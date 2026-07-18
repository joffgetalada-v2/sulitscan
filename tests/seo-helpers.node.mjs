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
  const localRequire = (specifier) => {
    if (Object.hasOwn(dependencies, specifier)) return dependencies[specifier]
    throw new Error(`Unexpected dependency ${specifier} from ${relativePath}`)
  }
  const evaluate = new Function("exports", "require", "module", "__filename", "__dirname", outputText)
  evaluate(moduleRecord.exports, localRequire, moduleRecord, filename, dirname(filename))
  return moduleRecord.exports
}

const dealsModule = loadTypeScriptModule("src/data/deals.ts")
const seoModule = loadTypeScriptModule("src/lib/deal-seo.ts", {
  "@/data/deals": dealsModule,
})

test("deal SEO titles are unique and no longer than 65 characters", () => {
  const titles = dealsModule.getActiveDeals().map(seoModule.buildDealSeoTitle)
  assert.equal(new Set(titles).size, titles.length)
  assert.ok(titles.every((title) => title.length <= 65))
  assert.ok(titles.every((title) => title.endsWith("| SulitScan PH")))
})

test("deal SEO descriptions are unique product-specific snippets", () => {
  const active = dealsModule.getActiveDeals()
  const descriptions = active.map(seoModule.buildDealSeoDescription)
  assert.equal(new Set(descriptions).size, descriptions.length)
  assert.ok(descriptions.every((description) => description.length <= 160))
  assert.ok(active.every((deal, index) =>
    descriptions[index].toLowerCase().includes(deal.title.split(/\s+/)[0].toLowerCase())
  ))
})
