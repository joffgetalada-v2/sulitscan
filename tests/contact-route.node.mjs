import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { resolve } from "node:path"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import ts from "typescript"

const require = createRequire(import.meta.url)
function loadTypeScript(relativePath, dependencies = {}) {
  const filename = resolve(relativePath)
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename,
  })
  const record = { exports: {} }
  new Function("exports", "require", "module", outputText)(record.exports, (specifier) => {
    if (Object.hasOwn(dependencies, specifier)) return dependencies[specifier]
    if (["next/server", "react", "react/jsx-runtime", "lucide-react"].includes(specifier)) return require(specifier)
    // Never fall through to the real Resend SDK (or any unexpected dependency).
    throw new Error(`Unexpected dependency: ${specifier}`)
  }, record)
  return record.exports
}

const helpers = existsSync("src/lib/contact-message.ts") ? loadTypeScript("src/lib/contact-message.ts") : {}
function parse(value) {
  assert.equal(typeof helpers.parseContactMessage, "function", "pure contact parser must exist")
  return helpers.parseContactMessage(value)
}
const valid = { name: "Reader", email: "reader@example.com", subject: "feedback", message: "Hello!" }
const failureMessage = "Failed to send message. Please try again or email us directly at hello@sulitscan.com."
function providerResult(data, error = null) { return { data, error, headers: {} } }
function routeHarness(send = async () => providerResult({ id: "email_test" })) {
  const deliveries = []
  const route = loadTypeScript("src/app/api/contact/route.ts", {
    "@/lib/contact-message": helpers,
    resend: { Resend: class {
      emails = { send: async (payload) => { deliveries.push(payload); return send(payload) } }
    } },
  })
  return {
    deliveries,
    post: (body, raw = false) => route.POST(new Request("https://sulitscan.com/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: raw ? body : JSON.stringify(body),
    })),
  }
}
function assertInvalid(result, status) {
  assert.equal(result.ok, false)
  assert.equal(result.status, status)
  assert.equal(typeof result.error, "string")
  assert.ok(result.error.length > 0)
}

test("parser returns trimmed fields without mutating the input", () => {
  const input = { name: " Reader ", email: " reader@example.com ", subject: " feedback ", message: " Hello! \n" }
  assert.deepEqual(parse(input), { ok: true, message: valid })
  assert.equal(input.name, " Reader ")
})

test("parser rejects arrays and non-object bodies with 400", () => {
  for (const body of [null, undefined, [], [valid], "text", 42, true]) assertInvalid(parse(body), 400)
})

for (const field of ["name", "email", "subject", "message"]) {
  test(`parser rejects missing, blank, and non-string ${field} with 422`, () => {
    for (const value of [undefined, null, 42, true, {}, [], "", " \r\n\t "]) {
      assertInvalid(parse({ ...valid, [field]: value }), 422)
    }
  })
}

test("parser rejects invalid email addresses", () => {
  for (const email of ["reader", "reader@example", "reader @example.com", "a@@example.com", "a@example.com\r\nBcc:x@y.com"]) {
    assertInvalid(parse({ ...valid, email }), 422)
  }
})

test("parser rejects unknown and inherited subject keys", () => {
  for (const subject of ["unknown", "__proto__", "constructor", "toString", "feedback\r\nBcc: x@y.com"]) {
    assertInvalid(parse({ ...valid, subject }), 422)
  }
})

for (const [field, maximum, boundary] of [
  ["name", 100, "n".repeat(100)],
  ["email", 254, `${"e".repeat(248)}@x.com`],
  ["message", 5000, "m".repeat(5000)],
]) {
  test(`parser accepts ${field} at ${maximum} characters and rejects one more`, () => {
    assert.equal(parse({ ...valid, [field]: boundary }).ok, true)
    assertInvalid(parse({ ...valid, [field]: `${boundary}x` }), 422)
  })
}

test("subject length is capped at 50 before the supported-key check", () => {
  assertInvalid(parse({ ...valid, subject: "s".repeat(50) }), 422)
  assert.doesNotMatch(parse({ ...valid, subject: "s".repeat(50) }).error, /50/)
  assert.match(parse({ ...valid, subject: "s".repeat(51) }).error, /50/)
})

test("HTML escaping handles every special character", () => {
  assert.equal(typeof helpers.escapeHtml, "function", "HTML escaper must exist")
  assert.equal(helpers.escapeHtml('&<>"\''), "&amp;&lt;&gt;&quot;&#x27;")
})

test("subject fragment sanitizer strips CR and LF", () => {
  assert.equal(typeof helpers.sanitizeSubjectFragment, "function", "subject sanitizer must exist")
  assert.equal(helpers.sanitizeSubjectFragment("Reader\r\nBcc: injected\rName\nEnd"), "ReaderBcc: injectedNameEnd")
})

test("route returns 400 for malformed JSON and invalid body types without delivery", async () => {
  const harness = routeHarness()
  for (const raw of ["{not json", "", "null", "[]", '"text"', "42", "true"]) {
    const response = await harness.post(raw, true)
    assert.equal(response.status, 400, raw)
    assert.equal(typeof (await response.json()).error, "string")
  }
  assert.deepEqual(harness.deliveries, [])
})

test("route returns 422 for invalid fields without delivery", async () => {
  const harness = routeHarness()
  for (const body of [
    {}, { ...valid, name: 42 }, { ...valid, email: [] }, { ...valid, message: {} },
    { ...valid, subject: 42 }, { ...valid, name: " " }, { ...valid, email: "invalid" },
    { ...valid, subject: "unknown" }, { ...valid, message: "m".repeat(5001) },
  ]) {
    const response = await harness.post(body)
    assert.equal(response.status, 422)
    assert.equal(typeof (await response.json()).error, "string")
  }
  assert.deepEqual(harness.deliveries, [])
})

for (const [subject, recipient, label] of [
  ["deal-suggestion", "deals@sulitscan.com", "Deal Suggestion"],
  ["outdated-price", "deals@sulitscan.com", "Outdated Price Report"],
  ["broken-link", "deals@sulitscan.com", "Broken Link / Error"],
  ["partnership", "partners@sulitscan.com", "Affiliate Partnership"],
  ["feedback", "hello@sulitscan.com", "General Feedback"],
  ["other", "hello@sulitscan.com", "Other"],
]) {
  test(`route preserves ${subject} destination and returns success when error is null`, async () => {
    const harness = routeHarness()
    const response = await harness.post({ ...valid, subject })
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { success: true })
    assert.equal(harness.deliveries.length, 1)
    assert.deepEqual(harness.deliveries[0].to, [recipient])
    assert.deepEqual(harness.deliveries[0].bcc, ["joff.getalada@dovrmedia.com"])
    assert.equal(harness.deliveries[0].from, "SulitScan PH <hello@e.sulitscan.com>")
    assert.equal(harness.deliveries[0].replyTo, "reader@example.com")
    assert.equal(harness.deliveries[0].subject, `[SulitScan Contact] ${label}, Reader`)
  })
}

test("route escapes every user field rendered to HTML and removes subject line breaks", async () => {
  const harness = routeHarness()
  const response = await harness.post({ ...valid, name: ' <Reader & "Friend">\r\nBcc: x@y.com ',
    email: ' reader&\'"@example.com ', message: ' <script>"quoted" & \'text\'</script> ' })
  assert.equal(response.status, 200)
  const payload = harness.deliveries[0]
  assert.equal(payload.subject, '[SulitScan Contact] General Feedback, <Reader & "Friend">Bcc: x@y.com')
  assert.doesNotMatch(payload.subject, /[\r\n]/)
  assert.match(payload.html, /&lt;Reader &amp; &quot;Friend&quot;&gt;/)
  assert.match(payload.html, /href="mailto:reader&amp;&#x27;&quot;@example.com"/)
  assert.match(payload.html, />reader&amp;&#x27;&quot;@example.com<\/a>/)
  assert.match(payload.html, /&lt;script&gt;&quot;quoted&quot; &amp; &#x27;text&#x27;&lt;\/script&gt;/)
  assert.doesNotMatch(payload.html, /<script>|<Reader/)
})

for (const [name, send] of [
  ["thrown provider exception", async () => { throw new Error("provider secret failure") }],
  ["resolved provider error", async () => providerResult(null, { name: "validation_error", message: "provider secret failure", statusCode: 422 })],
]) {
  test(`route returns a generic 500 for ${name}`, async () => {
    const harness = routeHarness(send)
    const originalError = console.error
    console.error = () => {}
    try {
      const response = await harness.post(valid)
      assert.equal(response.status, 500)
      assert.deepEqual(await response.json(), { error: failureMessage })
      assert.equal(harness.deliveries.length, 1)
    } finally { console.error = originalError }
  })
}

test("route returns success when provider error is absent", async () => {
  const harness = routeHarness(async () => ({ data: { id: "email_test" }, headers: {} }))
  const response = await harness.post(valid)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true })
})

test("contact form enables browser validation for its required blank-default topic", () => {
  const ContactForm = loadTypeScript("src/components/ContactForm.tsx").default
  const html = renderToStaticMarkup(React.createElement(ContactForm, {}))
  const form = html.match(/<form\b[^>]*>/)?.[0]
  const select = html.match(/<select\b[^>]*name="subject"[^>]*>/)?.[0]
  assert.ok(form, "contact form is rendered")
  assert.ok(select, "topic selector is rendered")
  assert.doesNotMatch(form, /\bnovalidate\b/i, "browser constraint validation must be enabled")
  assert.match(select, /\brequired(?:="")?(?:\s|>)/)
  assert.match(html, /<option\b[^>]*value=""[^>]*selected=""[^>]*>/)
  assert.match(html, /href="mailto:hello@sulitscan.com"/)
})
