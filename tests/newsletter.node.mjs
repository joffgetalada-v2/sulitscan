import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import ts from "typescript"

function loadTypeScriptModule(relativePath, dependencies = {}) {
  const filename = resolve(relativePath)
  const source = readFileSync(filename, "utf8")
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  })
  const moduleRecord = { exports: {} }
  const evaluate = new Function("exports", "require", "module", "__filename", "__dirname", outputText)
  evaluate(
    moduleRecord.exports,
    (specifier) => {
      if (Object.hasOwn(dependencies, specifier)) return dependencies[specifier]
      throw new Error(`Unexpected dependency ${specifier} from ${relativePath}`)
    },
    moduleRecord,
    filename,
    dirname(filename)
  )
  return moduleRecord.exports
}

const newsletterModule = loadTypeScriptModule("src/lib/newsletter-signup.ts")
const { handleNewsletterRequest, handleNewsletterSignup } = newsletterModule

const SUCCESS = { success: true }
const INVALID_REQUEST = { error: "Invalid newsletter request." }
const INVALID = { error: "Invalid newsletter signup." }
const UNAVAILABLE = { error: "Newsletter signup is temporarily unavailable. Please try again." }
const NO_STORE = { "Cache-Control": "no-store" }
const MISSING_CONFIGURATION = "missing_configuration"
const PROVIDER_UNAVAILABLE = "provider_unavailable"
const baseSubmission = {
  email: "reader@example.com",
  consent: true,
  source: "homepage",
  hp: "",
}

function response(data, error = null) {
  return { data, error, headers: {} }
}

function providerError(name, message, statusCode) {
  return response(null, { name, message, statusCode })
}

function missingContact() {
  return providerError("not_found", "Contact not found", 404)
}

function existingContact(unsubscribed = false) {
  return response({
    id: "contact_123",
    email: "reader@example.com",
    created_at: "2026-07-31T00:00:00.000Z",
    first_name: null,
    last_name: null,
    unsubscribed,
    object: "contact",
    properties: {},
  })
}

function createdContact() {
  return response({ id: "contact_123", object: "contact" })
}

function assertResult(result, status, body, category) {
  assert.deepEqual(result, {
    status,
    body,
    headers: NO_STORE,
    ...(category ? { category } : {}),
  })
}

function timingHarness(jitterMs) {
  let elapsed = 0
  let jitterCalls = 0
  const delays = []

  return {
    timing: {
      now: () => elapsed,
      delay: async (milliseconds) => {
        delays.push(milliseconds)
        elapsed += milliseconds
      },
      jitter: () => {
        jitterCalls += 1
        return jitterMs
      },
    },
    advance(milliseconds) {
      elapsed += milliseconds
    },
    delays,
    elapsed: () => elapsed,
    jitterCalls: () => jitterCalls,
  }
}

test("rejects malformed JSON without contacting the newsletter provider", async () => {
  let providerContacted = false
  const contacts = {
    async get() {
      providerContacted = true
      throw new Error("provider must not be called")
    },
    async create() {
      providerContacted = true
      throw new Error("provider must not be called")
    },
  }

  const result = await handleNewsletterRequest(
    new Request("https://sulitscan.com/api/newsletter", {
      method: "POST",
      body: "{not valid JSON",
    }),
    contacts
  )

  assertResult(result, 400, INVALID_REQUEST)
  assert.equal(providerContacted, false)
})

test("normalizes a valid email before creating a contact", async () => {
  const getCalls = []
  const createCalls = []
  const contacts = {
    async get(input) {
      getCalls.push(input)
      return missingContact()
    },
    async create(input) {
      createCalls.push(input)
      return createdContact()
    },
  }

  const result = await handleNewsletterSignup(
    { ...baseSubmission, email: "  Reader@Example.COM  " },
    contacts
  )

  assertResult(result, 200, SUCCESS)
  assert.deepEqual(getCalls, [{ email: "reader@example.com" }])
  assert.deepEqual(createCalls, [{ email: "reader@example.com", unsubscribed: false }])
})

test("rejects path delimiters anywhere in normalized emails without contacting the provider", async () => {
  const contacts = {
    async get() {
      throw new Error("provider must not be called")
    },
    async create() {
      throw new Error("provider must not be called")
    },
  }

  for (const email of [
    "reader?tag@example.com",
    "reader#tag@example.com",
    "reader/path@example.com",
    "reader@example?path.com",
    "reader@example#fragment.com",
    "reader@example.com/path",
    "reader@example.com?next=target",
    "reader@example.com#fragment",
    "reader@example.com/../../domains/target#",
  ]) {
    const result = await handleNewsletterSignup({ ...baseSubmission, email }, contacts)
    assertResult(result, 422, INVALID)
  }
})

test("preserves plus addressing in valid email local parts", async () => {
  const operations = []
  const contacts = {
    async get(input) {
      operations.push({ method: "get", input })
      return missingContact()
    },
    async create(input) {
      operations.push({ method: "create", input })
      return createdContact()
    },
  }

  const result = await handleNewsletterSignup(
    { ...baseSubmission, email: "Reader+Deals@Example.COM" },
    contacts
  )

  assertResult(result, 200, SUCCESS)
  assert.deepEqual(operations, [
    { method: "get", input: { email: "reader+deals@example.com" } },
    { method: "create", input: { email: "reader+deals@example.com", unsubscribed: false } },
  ])
})

test("compensates different provider durations to the same success-response target", async () => {
  const existingTiming = timingHarness(75)
  const existingContacts = {
    async get() {
      existingTiming.advance(100)
      return existingContact()
    },
    async create() {
      throw new Error("existing contacts must not be created")
    },
  }
  const newTiming = timingHarness(75)
  const newContacts = {
    async get() {
      newTiming.advance(300)
      return missingContact()
    },
    async create() {
      newTiming.advance(250)
      return createdContact()
    },
  }

  const existingResult = await handleNewsletterRequest(
    new Request("https://sulitscan.com/api/newsletter", {
      method: "POST",
      body: JSON.stringify(baseSubmission),
    }),
    existingContacts,
    existingTiming.timing
  )
  const newResult = await handleNewsletterRequest(
    new Request("https://sulitscan.com/api/newsletter", {
      method: "POST",
      body: JSON.stringify(baseSubmission),
    }),
    newContacts,
    newTiming.timing
  )

  assertResult(existingResult, 200, SUCCESS)
  assertResult(newResult, 200, SUCCESS)
  assert.deepEqual(existingTiming.delays, [775])
  assert.deepEqual(newTiming.delays, [425])
  assert.equal(existingTiming.elapsed(), 975)
  assert.equal(newTiming.elapsed(), 975)
  assert.equal(existingTiming.jitterCalls(), 1)
  assert.equal(newTiming.jitterCalls(), 1)
})

test("uses a 900ms success floor with zero-to-200ms jitter", async () => {
  for (const [jitter, expectedDelay] of [[0, 900], [200, 1100]]) {
    const harness = timingHarness(jitter)
    const contacts = {
      async get() {
        return existingContact()
      },
      async create() {
        throw new Error("existing contacts must not be created")
      },
    }

    const result = await handleNewsletterRequest(
      new Request("https://sulitscan.com/api/newsletter", {
        method: "POST",
        body: JSON.stringify(baseSubmission),
      }),
      contacts,
      harness.timing
    )

    assertResult(result, 200, SUCCESS)
    assert.deepEqual(harness.delays, [expectedDelay])
    assert.equal(harness.elapsed(), expectedDelay)
    assert.equal(harness.jitterCalls(), 1)
  }
})

test("does not delay invalid or provider-unavailable responses", async () => {
  const timing = {
    now: () => 0,
    delay: async () => {
      throw new Error("non-success responses must not be delayed")
    },
    jitter: () => {
      throw new Error("non-success responses must not sample jitter")
    },
  }
  const contacts = {
    async get() {
      return providerError("invalid_api_key", "invalid API key: secret-value", 401)
    },
    async create() {
      throw new Error("create must not be called")
    },
  }

  const invalidResult = await handleNewsletterRequest(
    new Request("https://sulitscan.com/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ ...baseSubmission, consent: false }),
    }),
    contacts,
    timing
  )
  const unavailableResult = await handleNewsletterRequest(
    new Request("https://sulitscan.com/api/newsletter", {
      method: "POST",
      body: JSON.stringify(baseSubmission),
    }),
    contacts,
    timing
  )

  assertResult(invalidResult, 422, INVALID)
  assertResult(unavailableResult, 503, UNAVAILABLE, PROVIDER_UNAVAILABLE)
})

test("rejects malformed and overlong emails without contacting the provider", async () => {
  const contacts = {
    async get() {
      throw new Error("provider must not be called")
    },
    async create() {
      throw new Error("provider must not be called")
    },
  }

  for (const email of ["reader", "reader@example", "reader @example.com", `a`.repeat(255) + "@x.com"]) {
    const result = await handleNewsletterSignup({ ...baseSubmission, email }, contacts)
    assertResult(result, 422, INVALID)
  }
})

test("requires consent to be the boolean true", async () => {
  const contacts = {
    async get() {
      throw new Error("provider must not be called")
    },
    async create() {
      throw new Error("provider must not be called")
    },
  }

  for (const consent of [false, "true", 1, null, undefined]) {
    const result = await handleNewsletterSignup({ ...baseSubmission, consent }, contacts)
    assertResult(result, 422, INVALID)
  }
})

test("accepts only the newsletter placements used by the site", async () => {
  const contacts = {
    async get() {
      return existingContact()
    },
    async create() {
      throw new Error("existing contacts must not be created")
    },
  }

  for (const source of ["homepage", "blog-index", "blog-article"]) {
    const result = await handleNewsletterSignup({ ...baseSubmission, source }, contacts)
    assertResult(result, 200, SUCCESS)
  }

  for (const source of [undefined, "website", "Homepage", 1]) {
    const result = await handleNewsletterSignup({ ...baseSubmission, source }, contacts)
    assertResult(result, 422, INVALID)
  }
})

test("silently accepts honeypot submissions without contacting the provider", async () => {
  const contacts = {
    async get() {
      throw new Error("provider must not be called")
    },
    async create() {
      throw new Error("provider must not be called")
    },
  }

  const result = await handleNewsletterSignup({ ...baseSubmission, hp: "bot" }, contacts)

  assertResult(result, 200, SUCCESS)
})

test("treats an existing active contact as a generic success", async () => {
  const createCalls = []
  const getCalls = []
  const contacts = {
    async get(input) {
      getCalls.push(input)
      return existingContact(false)
    },
    async create(input) {
      createCalls.push(input)
      return createdContact()
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 200, SUCCESS)
  assert.deepEqual(getCalls, [{ email: "reader@example.com" }, { email: "reader@example.com" }])
  assert.deepEqual(createCalls, [])
})

test("preserves an existing unsubscribe while returning a generic success", async () => {
  const createCalls = []
  const getCalls = []
  const contacts = {
    async get(input) {
      getCalls.push(input)
      return existingContact(true)
    },
    async create(input) {
      createCalls.push(input)
      return createdContact()
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 200, SUCCESS)
  assert.deepEqual(getCalls, [{ email: "reader@example.com" }, { email: "reader@example.com" }])
  assert.deepEqual(createCalls, [])
})

test("creates a missing contact as subscribed", async () => {
  const operations = []
  const contacts = {
    async get(input) {
      operations.push({ method: "get", input })
      return missingContact()
    },
    async create(input) {
      operations.push({ method: "create", input })
      return createdContact()
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 200, SUCCESS)
  assert.deepEqual(operations, [
    { method: "get", input: { email: "reader@example.com" } },
    { method: "create", input: { email: "reader@example.com", unsubscribed: false } },
  ])
})

test("recovers a concurrent create by checking for the contact once more", async () => {
  const getCalls = []
  const contacts = {
    async get(input) {
      getCalls.push(input)
      return getCalls.length === 1 ? missingContact() : existingContact()
    },
    async create() {
      return providerError("validation_error", "Contact already exists", 409)
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 200, SUCCESS)
  assert.deepEqual(getCalls, [{ email: "reader@example.com" }, { email: "reader@example.com" }])
})

test("returns unavailable when create fails and the final lookup remains missing", async () => {
  const getCalls = []
  const createCalls = []
  const contacts = {
    async get(input) {
      getCalls.push(input)
      return missingContact()
    },
    async create(input) {
      createCalls.push(input)
      return providerError("internal_server_error", "provider unavailable", 500)
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 503, UNAVAILABLE, PROVIDER_UNAVAILABLE)
  assert.deepEqual(getCalls, [{ email: "reader@example.com" }, { email: "reader@example.com" }])
  assert.deepEqual(createCalls, [{ email: "reader@example.com", unsubscribed: false }])
})

test("reports a missing contacts client as temporarily unavailable", async () => {
  const result = await handleNewsletterSignup(baseSubmission, null)

  assertResult(result, 503, UNAVAILABLE, MISSING_CONFIGURATION)
})

test("sanitizes SDK error responses", async () => {
  const contacts = {
    async get() {
      return providerError("invalid_api_key", "invalid API key: secret-value", 401)
    },
    async create() {
      throw new Error("create must not be called")
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 503, UNAVAILABLE, PROVIDER_UNAVAILABLE)
})

test("sanitizes thrown provider failures", async () => {
  const contacts = {
    async get() {
      throw new Error("network unavailable")
    },
    async create() {
      throw new Error("create must not be called")
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 503, UNAVAILABLE, PROVIDER_UNAVAILABLE)
})

test("route serializes a generic 503 and logs only the missing-configuration category", async () => {
  const routeModule = loadTypeScriptModule("src/app/api/newsletter/route.ts", {
    "server-only": {},
    resend: {
      Resend: class {
        constructor() {
          throw new Error("Resend must not be constructed without configuration")
        }
      },
    },
    "@/lib/newsletter-signup": newsletterModule,
  })
  const originalApiKey = process.env.RESEND_API_KEY
  const originalConsoleError = console.error
  const errorCalls = []

  delete process.env.RESEND_API_KEY
  console.error = (...args) => errorCalls.push(args)
  try {
    const response = await routeModule.POST(
      new Request("https://sulitscan.com/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(baseSubmission),
      })
    )

    assert.equal(response.status, 503)
    assert.deepEqual(await response.json(), UNAVAILABLE)
    assert.deepEqual(errorCalls, [
      ["[newsletter-signup-failure]", { category: MISSING_CONFIGURATION, status: 503 }],
    ])
  } finally {
    console.error = originalConsoleError
    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = originalApiKey
  }
})

test("route serializes a generic 503 and logs only the provider-unavailable category", async () => {
  const routeModule = loadTypeScriptModule("src/app/api/newsletter/route.ts", {
    "server-only": {},
    resend: {
      Resend: class {
        contacts = {
          async get() {
            return providerError("invalid_api_key", "invalid API key: secret-value", 401)
          },
          async create() {
            throw new Error("create must not be called")
          },
        }
      },
    },
    "@/lib/newsletter-signup": newsletterModule,
  })
  const originalApiKey = process.env.RESEND_API_KEY
  const originalConsoleError = console.error
  const errorCalls = []

  process.env.RESEND_API_KEY = "secret-api-key"
  console.error = (...args) => errorCalls.push(args)
  try {
    const response = await routeModule.POST(
      new Request("https://sulitscan.com/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...baseSubmission, email: "private-contact@example.com" }),
      })
    )

    assert.equal(response.status, 503)
    assert.deepEqual(await response.json(), UNAVAILABLE)
    assert.deepEqual(errorCalls, [
      ["[newsletter-signup-failure]", { category: PROVIDER_UNAVAILABLE, status: 503 }],
    ])
    assert.equal(JSON.stringify(errorCalls).includes("private-contact@example.com"), false)
    assert.equal(JSON.stringify(errorCalls).includes("secret-api-key"), false)
    assert.equal(JSON.stringify(errorCalls).includes("invalid API key"), false)
  } finally {
    console.error = originalConsoleError
    if (originalApiKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = originalApiKey
  }
})
