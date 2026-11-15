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

const postsModule = loadTypeScriptModule("src/data/posts.ts")

const expectedGuides = [
  {
    id: "post-065",
    slug: "shopee-12-12-sale-philippines-2026-checklist",
    sources: [
      "https://shopee.ph/m/12-12-sneak-peek",
      "https://www.importtaxph.com/",
      "/tools/checkout-comparison",
    ],
  },
  {
    id: "post-066",
    slug: "online-shopping-complaint-dti-philippines",
    sources: [
      "https://fairtrade.dti.gov.ph/services/complaints-handling/",
      "https://consumercare.dti.gov.ph/",
      "/blog/unboxing-video-evidence-online-shopping-philippines",
    ],
  },
  {
    id: "post-067",
    slug: "holiday-online-shopping-delivery-checklist-philippines",
    sources: [
      "https://help.shopee.ph/portal/4/article/80976-How-do-I-check-the-estimated-delivery-date-for-my-order%3F-%28ENG%29",
      "https://help.shopee.ph/portal/4/article/81217-",
      "https://help.shopee.ph/portal/4/article/80965-Why%20is%20my%20order%20returned%20to%20the%20seller%20%28RTS%29%3F",
    ],
  },
  {
    id: "post-068",
    slug: "bundle-vs-single-item-unit-price-guide-philippines",
    sources: [
      "https://www.dti.gov.ph/dti-knowledge-hub/dti-faqs",
      "/tools/checkout-comparison",
      "/blog/why-final-prices-change-at-checkout",
    ],
  },
  {
    id: "post-069",
    slug: "online-shopping-warranty-checklist-philippines",
    sources: [
      "https://www.dti.gov.ph/dti-knowledge-hub/dti-faqs",
      "https://ecommerce.dti.gov.ph/wp-content/uploads/2020/11/RA-7394-Consumer-Act-of-the-Philippines.pdf",
      "/blog/online-electrical-appliance-safety-ps-icc-philippines",
    ],
  },
]

test("November buyer guides are complete, source-backed, and discoverable", () => {
  const covers = new Set()

  for (const expected of expectedGuides) {
    const post = postsModule.getPostBySlug(expected.slug)
    assert.ok(post, `${expected.slug}: guide must resolve through getPostBySlug`)
    assert.equal(post.id, expected.id)
    assert.equal(post.publishedAt, "2026-11-16")
    assert.equal(post.lastReviewed, "2026-11-16")
    assert.equal(post.author, "SulitScan Team")
    assert.ok(post.readTime >= 8, `${expected.slug}: read time must reflect a substantive guide`)
    assert.equal(post.coverImage, `/images/guides/${expected.slug}.jpg`)
    assert.ok(post.coverImageAlt.length >= 50, `${expected.slug}: descriptive cover alt is required`)
    assert.ok(post.faqs?.length >= 3, `${expected.slug}: at least three FAQs are required`)
    assert.ok(post.recommendationIntent?.topics.length >= 2, `${expected.slug}: discovery topics are required`)
    assert.ok(
      (post.recommendationIntent?.platforms ?? []).every((platform) => platform !== "Temu"),
      `${expected.slug}: current guides must not recommend a terminated merchant`
    )
    assert.match(post.content, /^\s*[^#\n].+/)
    assert.match(post.content, /## How we assessed this guide/)
    assert.match(post.content, /## Worked /)
    assert.match(post.content, /## Limitations and live-policy check/)
    assert.match(post.content, /## Affiliate disclosure/)
    for (const source of expected.sources) {
      assert.ok(post.content.includes(source), `${expected.slug}: missing source or contextual route ${source}`)
    }
    assert.equal(covers.has(post.coverImage), false, `${expected.slug}: cover path must be unique`)
    covers.add(post.coverImage)
  }
})
