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

const { calculateCheckoutOffer, compareCheckoutOffers } = loadTypeScriptModule(
  "src/lib/checkout-comparison.ts"
)

const baseOffer = {
  itemPrice: 250,
  quantity: 2,
  shipping: 50,
  voucherDiscount: 75,
  paymentDiscount: 25,
  otherFees: 10,
  importCost: 40,
}

test("calculates subtotal, final total, and per-unit price", () => {
  assert.deepEqual(calculateCheckoutOffer(baseOffer), {
    subtotal: 500,
    total: 500,
    perUnit: 250,
  })
})

test("clamps negative inputs to zero and normalizes zero quantity to one", () => {
  assert.deepEqual(
    calculateCheckoutOffer({
      itemPrice: -100,
      quantity: 0,
      shipping: -20,
      voucherDiscount: -10,
      paymentDiscount: -5,
      otherFees: -3,
      importCost: -9,
    }),
    { subtotal: 0, total: 0, perUnit: 0 }
  )
})

test("normalizes non-finite values, integer quantity, and currency precision", () => {
  assert.deepEqual(
    calculateCheckoutOffer({
      itemPrice: 10.005,
      quantity: 2.9,
      shipping: Number.POSITIVE_INFINITY,
      voucherDiscount: Number.NaN,
      paymentDiscount: 0,
      otherFees: 0,
      importCost: 0,
    }),
    { subtotal: 20.01, total: 20.01, perUnit: 10.01 }
  )
})

test("returns a tie with zero difference for equal final totals", () => {
  assert.deepEqual(compareCheckoutOffers(baseOffer, { ...baseOffer }), {
    winner: "tie",
    difference: 0,
  })
})

test("returns the lower-total offer and a rounded difference", () => {
  assert.deepEqual(
    compareCheckoutOffers(
      { ...baseOffer, shipping: 0 },
      { ...baseOffer, shipping: 35.555 }
    ),
    { winner: "a", difference: 35.56 }
  )
})

test("keeps overflow-scale finite inputs comparable without false ties", () => {
  const offerA = {
    ...baseOffer,
    itemPrice: Number.MAX_VALUE,
    quantity: 2,
  }
  const offerB = {
    ...baseOffer,
    itemPrice: Number.MAX_VALUE,
    quantity: 3,
  }

  const resultA = calculateCheckoutOffer(offerA)
  const resultB = calculateCheckoutOffer(offerB)
  const comparison = compareCheckoutOffers(offerA, offerB)

  const derivedValues = [
    resultA.subtotal,
    resultA.total,
    resultA.perUnit,
    resultB.subtotal,
    resultB.total,
    resultB.perUnit,
  ]
  for (const value of derivedValues) {
    assert.equal(Number.isFinite(value), true)
  }
  assert.equal(comparison.winner, "a")
  assert.equal(Number.isFinite(comparison.difference), true)
  assert.ok(comparison.difference > 0)
})
