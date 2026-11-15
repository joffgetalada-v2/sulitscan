# SulitScan November Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove stale merchant guidance and publish five evidence-led November buyer guides with original banners.

**Architecture:** Keep the existing data-driven category and blog architecture. Add a concise `metaDescription` field to category content, consume it from dynamic category metadata, append five validated `BlogPost` records, and store generated raster assets beside existing guide covers.

**Tech Stack:** Next.js 16.3.8 App Router, React 19, TypeScript, Node test runner, generated JPEG assets.

**Spec:** `docs/superpowers/specs/2026-11-16-sulitscan-november-growth-design.md`

## Global Constraints

- Read relevant Next.js 16.3.8 docs before changing route metadata.
- Use current primary sources and label time-sensitive platform details.
- Do not promise AdSense approval or enable ads.
- Do not reintroduce Temu into current commercial guidance.
- Preserve unrelated untracked `output/` and `tmp/` files.
- Push the verified result to `main`.

## Review Focus

- A featured category missing content must still receive a safe fallback description.
- Category metadata descriptions must be unique, concise, and free of terminated merchants.
- Current campaign claims must identify their November 16, 2026 review date and defer to the live offer page.
- Delivery and warranty guides must separate platform policy from guarantees about a reader's order or claim.
- Every new post must have a unique local cover, canonical route, FAQ data, and discoverable recommendation intent.

---

### Task 1: Current category guidance and metadata

**Files:**
- Modify: `tests/affiliate-compliance.node.mjs`
- Modify: `src/data/category-content.ts`
- Modify: `src/app/categories/[slug]/page.tsx`

**Interfaces:**
- Consumes: `categoryContent[slug]` in the existing category page.
- Produces: `CategoryContent.metaDescription: string` for public metadata.

- [ ] Add a failing test that loads category content and rejects Temu references in current category guidance, missing/duplicate descriptions, and descriptions outside 110–160 characters.
- [ ] Run `npm run test:compliance` and confirm the new assertions fail on the stale category data.
- [ ] Rewrite the seven stale category sections and add metadata descriptions for all eight featured categories.
- [ ] Change `generateMetadata` to prefer `content.metaDescription` instead of the long intro.
- [ ] Run `npm run test:compliance` and `npm run typecheck` and confirm both pass.

### Task 2: November guide registry

**Files:**
- Create: `tests/november-content.node.mjs`
- Modify: `package.json`
- Modify: `src/data/posts.ts`

**Interfaces:**
- Consumes: the existing `BlogPost` shape, post lookup, blog listing, related-post logic, and sitemap registry.
- Produces: posts `post-065` through `post-069` with five unique slugs and cover paths.

- [ ] Add a failing test that resolves the five slugs through `getPostBySlug`, checks November 16 publication/review dates, distinct local covers, FAQs, recommendation intent, and required official/source links.
- [ ] Run the test directly and confirm it fails because the posts are absent.
- [ ] Append five complete posts with direct answers, methods, worked examples, checklists, limits, disclosures, FAQs, and contextual links.
- [ ] Register `test:november-content` in `package.json` and include it in `npm run check`.
- [ ] Run the new test, recommendation tests, sitemap tests, and typecheck.

### Task 3: Original guide banners

**Files:**
- Create: `public/images/guides/shopee-12-12-sale-philippines-2026-checklist.jpg`
- Create: `public/images/guides/online-shopping-complaint-dti-philippines.jpg`
- Create: `public/images/guides/holiday-online-shopping-delivery-checklist-philippines.jpg`
- Create: `public/images/guides/bundle-vs-single-item-unit-price-guide-philippines.jpg`
- Create: `public/images/guides/online-shopping-warranty-checklist-philippines.jpg`

**Interfaces:**
- Consumes: five generated PNG originals from the built-in image generator.
- Produces: optimized 1600×900 JPEG cover assets referenced by Task 2.

- [ ] Copy generated originals into the workspace and crop/resize them non-destructively to 1600×900 JPEGs.
- [ ] Inspect all five rendered covers for subject, composition, text/logo avoidance, and crop safety.
- [ ] Run the November content test and link checker to confirm every reference resolves.

### Task 4: Audit record and complete verification

**Files:**
- Create: `docs/seo-audit-2026-11-16.md`

**Interfaces:**
- Consumes: live audit evidence, implemented changes, and the existing AdSense deployment contract.
- Produces: a dated owner checklist that separates completed work from external actions.

- [ ] Document crawl/index status, content freshness, corrected category issue, new content cluster, AdSense external blocker, and next measurement steps.
- [ ] Run `npm run check` and retain the full result.
- [ ] Review the complete diff against the spec and verify no unrelated untracked files were added.
- [ ] Commit all scoped files, push `main`, and verify the deployed sitemap, `/ads.txt`, category metadata, and five new article routes.
