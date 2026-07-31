import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import ts from "typescript"

function loadTypeScriptModule(relativePath) {
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
      throw new Error(`Unexpected dependency ${specifier} from ${relativePath}`)
    },
    moduleRecord,
    filename,
    dirname(filename)
  )
  return moduleRecord.exports
}

const { handleNewsletterSignup } = loadTypeScriptModule("src/lib/newsletter-signup.ts")

const SUCCESS = { success: true }
const INVALID = { error: "Invalid newsletter signup." }
const UNAVAILABLE = { error: "Newsletter signup is temporarily unavailable. Please try again." }
const NO_STORE = { "Cache-Control": "no-store" }
const baseSubmission = {
  email: "reader@example.com",
  consent: true,
  source: "homepage",
  hp: "",
}

function response(data, error = null) {
  return { data, error, headers: new Headers() }
}

function missingContact() {
  return response(null)
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

function assertResult(result, status, body) {
  assert.deepEqual(result, { status, body, headers: NO_STORE })
}

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
  const contacts = {
    async get() {
      return existingContact(false)
    },
    async create(input) {
      createCalls.push(input)
      return createdContact()
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 200, SUCCESS)
  assert.deepEqual(createCalls, [])
})

test("preserves an existing unsubscribe while returning a generic success", async () => {
  const createCalls = []
  const contacts = {
    async get() {
      return existingContact(true)
    },
    async create(input) {
      createCalls.push(input)
      return createdContact()
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 200, SUCCESS)
  assert.deepEqual(createCalls, [])
})

test("creates a missing contact as subscribed", async () => {
  const createCalls = []
  const contacts = {
    async get() {
      return missingContact()
    },
    async create(input) {
      createCalls.push(input)
      return createdContact()
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 200, SUCCESS)
  assert.deepEqual(createCalls, [{ email: "reader@example.com", unsubscribed: false }])
})

test("recovers a concurrent create by checking for the contact once more", async () => {
  const getCalls = []
  const contacts = {
    async get(input) {
      getCalls.push(input)
      return getCalls.length === 1 ? missingContact() : existingContact()
    },
    async create() {
      return response(null, { message: "already exists" })
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 200, SUCCESS)
  assert.deepEqual(getCalls, [{ email: "reader@example.com" }, { email: "reader@example.com" }])
})

test("reports a missing contacts client as temporarily unavailable", async () => {
  const result = await handleNewsletterSignup(baseSubmission, null)

  assertResult(result, 503, UNAVAILABLE)
})

test("sanitizes SDK error responses", async () => {
  const contacts = {
    async get() {
      return response(null, { message: "invalid API key: secret-value" })
    },
    async create() {
      throw new Error("create must not be called")
    },
  }

  const result = await handleNewsletterSignup(baseSubmission, contacts)

  assertResult(result, 503, UNAVAILABLE)
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

  assertResult(result, 503, UNAVAILABLE)
})
