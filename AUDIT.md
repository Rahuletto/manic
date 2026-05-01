# Manic documentation audit

**Scope:** `docs/` Fumadocs site (`content/docs`), layouts, and how it compares to common quality bars (**Vercel Next.js docs** vs **Vite docs**).

**Verdict (honest tier):** **Between high-quality Vite-tier and mid-tier “product docs.”** It is **not** yet at **Next.js / Vercel-level** completeness, narrative polish, or guided learning depth. It **already beats** many smaller frameworks on **typed examples** (Twoslash) and **internal architecture** coverage (`core/`), but **loses** on **first impressions**, **tutorial runway**, **discoverability**, and **reference parity with the actual package surface**.

---

## How this maps to “Next.js-level” vs “Vite-level”

| Dimension | Next.js / Vercel bar | Vite bar | Manic today |
|-----------|---------------------|----------|-------------|
| First landing experience | Strong product story, CTAs, diagrams | Minimal but purposeful | **Placeholder home** (“Hello World”) — far below either bar |
| Learning paths | Learn → Guides → API → deep dives | Config + plugins + guides | **Framework + API tabs** exist; **no staged “Learn Manic” path** |
| Reference completeness | Exhaustive; often auto-derived | Solid manual reference | **Good MDX reference**, but **sidebar/meta gaps** (e.g. orphan pages) |
| Code examples | Many runnable StackBlitz / templates | Copy-paste oriented | **Strong Twoslash** (types checked); **few “full app” walkthroughs** |
| Migration / comparison | Official “From CRA / Pages Router” docs | Comparisons kept short | **Benchmarks exist**; **light on migration framing** |
| Versioning | Docs tied to major versions | Looser | **Single rolling docs** — unclear compatibility story |
| Search / nav UX | Algolia-grade, cross-linked | Usually good enough | **Fumadocs defaults** — OK if search wired; verify prod |

---

## What already works well

1. **Twoslash-backed snippets** — Examples are forced through TypeScript validation; this is **above typical Vite-level** prose-only snippets and reduces doc drift (when snippets match real APIs).
2. **Structured IA skeleton** — Tabs (`framework`, `api`, `cli`, `core`), sidebar categories (Getting Started, Routing, Server, Plugins, Deployment, Advanced, Troubleshooting) resemble **serious framework docs**.
3. **`core/` section** — Build pipeline, discovery, architecture content is **closer to “framework internals whitepaper”** than most frameworks publish; valuable for advanced users.
4. **Fumadocs affordances** — MDX components, TOC style, “copy markdown”, GitHub link from page (when paths are correct), Mermaid — **modern doc platform**.
5. **Recent accuracy work** — Aligning ports, server entry (`server.js`), Hono cookie patterns, and removing non-existent APIs improves **trust** (trust is a major part of Next-level perception).

---

## What sucks (high impact)

1. **Docs home / entry experience** — `docs/app/(home)/page.tsx` is a **placeholder**. Next-level docs *sell the mental model in 10 seconds*; this **undermines everything else**.
2. **Reference discoverability gaps** — Example: `docs/content/docs/api/rpc-client.mdx` **exists** but **`docs/content/docs/api/meta.json` does not list it**, so it likely **does not appear in the primary nav** → users won’t find it.
3. **No clear “golden path” tutorial** — You have Getting Started + Quick Start + Project Structure, but not a **single end-to-end** “build a tiny app with route + API + env + deploy” that stitches the story.
4. **Versioning / release mapping** — No obvious “These docs apply to manic `0.12.x`” affordance. Next-level docs reduce fear of upgrading; Vite-level at least pins major behavior in the reference.
5. **Module import story is easy to get wrong** — The package has subpath exports (`manicjs/server`, `manicjs/config`, etc.). Docs mix `manicjs` root vs subpaths; without a **single authoritative import table**, readers file issues or copy wrong imports.

---

## What does not feel great (medium impact)

1. **Tone split** — Some pages read like marketing (“zero-config”), others like internal engineering notes. Next-style docs **blend** hype + precision; here the **blend is inconsistent page-to-page**.
2. **Duplication risk** — Framework guides vs API reference sometimes repeat (`config`, `env`, routing). Without “**this page is normative**” cues, readers don’t know which to trust when they disagree.
3. **“Forms” bucket** — Useful, but naming can imply first-class form primitives; much of it is **patterns**. Consider renaming or a callout so expectations match Manic’s actual surface area.
4. **Broken or generic cross-links** — There have been fixes, but fragile links (e.g. non-existent routes) erode Next-level polish. Run periodic **link checks in CI**.
5. **GitHub “edit this page” paths** — Ensure the generated GitHub URLs match your **default branch** and **content path** (`content/docs/...`) so the button is trustworthy.

---

## What to change (prioritized)

### P0 — Fast, high leverage

| Change | Why |
|--------|-----|
| Replace the **home page** with a real landing: value prop, 3-step quickstart, links to Framework + API + GitHub | Next-level perception starts at `/` |
| Audit **all `meta.json` `pages` arrays** vs files on disk; add missing pages (e.g. `rpc-client`) | Hidden docs = missing features |
| Add a **single “Imports cheat sheet”** page (table: symbol → recommended import path) | Stops confusion; reduces bad issues |
| Add “**Docs for manicjs `X.Y.Z`**” in the docs header/footer | Sets expectations |

### P1 — Tutorial + reference quality

| Change | Why |
|--------|-----|
| One **Golden Path tutorial** MDX: route + API + `getEnv` + `createClient`/`hc` + `manic build` + one provider | Next-style “learn by doing” |
| **Migration guides** (even short): “From Vite SPA”, “From React Router”, “API as Hono-only” | Captures evaluators |
| Standardize **normative docs**: “Source of truth: API page X” links from framework guides | Reduces contradictory guidance |

### P2 — Next.js-style polish

| Change | Why |
|--------|-----|
| **Search** tuning (synonyms: “env”, “environment”, “MANIC_PUBLIC”, “deploy”, “worker”) | Discoverability |
| **Changelog / release notes** linked from docs | Version trust |
| Optional: **interactive** examples (StackBlitz / CodeSandbox templates) | Next-level, but costly to maintain |

---

## Summary soundbite

- **Vs Vite:** You are **already competitive** on “serious framework reference” and **ahead** on typed examples in many places.
- **Vs Next.js/Vercel:** You are **not there yet** on **landing story, tutorial depth, reference completeness in nav, versioning, and migration paths** — the “product documentation” layer that makes a framework feel inevitable.

If you only do **three** things: **fix the home page**, **eliminate orphan doc pages**, and **publish one golden-path tutorial**, the site will jump a full tier in perceived quality.
