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
  evaluate(moduleRecord.exports, () => {
    throw new Error(`Unexpected dependency from ${relativePath}`)
  }, moduleRecord, filename, dirname(filename))
  return moduleRecord.exports
}

const adsense = loadTypeScriptModule("src/lib/adsense.ts")

test("normalizes only real 16-digit AdSense client IDs", () => {
  assert.equal(adsense.normalizeAdSenseClientId("ca-pub-1234567890123456"), "ca-pub-1234567890123456")
  assert.equal(adsense.normalizeAdSenseClientId(" pub-1234567890123456 "), "ca-pub-1234567890123456")

  for (const value of [
    undefined,
    "",
    "ca-pub-XXXXXXXXXXXXXXXX",
    "ca-pub-1234",
    "pub-12345678901234567",
    "ca-app-pub-1234567890123456",
  ]) {
    assert.equal(adsense.normalizeAdSenseClientId(value), null)
  }
})

test("derives an ads.txt publisher ID from either supported input form", () => {
  assert.equal(adsense.toAdSensePublisherId("ca-pub-1234567890123456"), "pub-1234567890123456")
  assert.equal(adsense.toAdSensePublisherId("pub-1234567890123456"), "pub-1234567890123456")
  assert.equal(adsense.toAdSensePublisherId("pub-0000"), null)
})

test("enables ad serving only for an explicit true flag", () => {
  assert.equal(adsense.isAdSenseServingEnabled("true"), true)
  assert.equal(adsense.isAdSenseServingEnabled(" true "), true)

  for (const value of [undefined, "", "false", "1", "yes", "TRUE"]) {
    assert.equal(adsense.isAdSenseServingEnabled(value), false)
  }
})

test("builds one consistent verification, ads.txt, and optional article-script configuration", () => {
  assert.equal(adsense.createAdSenseConfig("invalid", "true"), null)
  assert.deepEqual(adsense.createAdSenseConfig("pub-1234567890123456", "false"), {
    clientId: "ca-pub-1234567890123456",
    publisherId: "pub-1234567890123456",
    servingEnabled: false,
    scriptSrc: null,
  })
  assert.deepEqual(adsense.createAdSenseConfig("ca-pub-1234567890123456", "true"), {
    clientId: "ca-pub-1234567890123456",
    publisherId: "pub-1234567890123456",
    servingEnabled: true,
    scriptSrc:
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456",
  })
})

test("uses one publisher ID source and scopes the serving script to full articles", () => {
  const adsTextRoute = readFileSync(resolve("src/app/ads.txt/route.ts"), "utf8")
  const articlePage = readFileSync(resolve("src/app/blog/[slug]/page.tsx"), "utf8")
  const rootLayout = readFileSync(resolve("src/app/layout.tsx"), "utf8")
  const articleScript = readFileSync(resolve("src/components/AdSenseArticleScript.tsx"), "utf8")
  const adsenseLibrary = readFileSync(resolve("src/lib/adsense.ts"), "utf8")

  assert.match(adsTextRoute, /NEXT_PUBLIC_ADSENSE_CLIENT_ID/)
  assert.doesNotMatch(adsTextRoute, /ADSENSE_PUBLISHER_ID/)
  assert.match(articlePage, /AdSenseArticleScript/)
  assert.doesNotMatch(rootLayout, /AdSenseArticleScript/)
  assert.match(articleScript, /NEXT_PUBLIC_ADSENSE_ADS_ENABLED/)
  assert.match(adsenseLibrary, /pagead2\.googlesyndication\.com/)
})
