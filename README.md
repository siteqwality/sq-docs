# Site Qwality Docs

Public documentation for Site Qwality, hosted at [docs.siteqwality.com](https://docs.siteqwality.com). Built with [Starlight](https://starlight.astro.build/) on [Astro](https://astro.build/).

## Local development

```sh
npm install
npm run dev   # http://localhost:4321
```

## Project structure

```
src/
├── content/
│   └── docs/                  # All MDX content. Sidebar groupings live in astro.config.mjs.
└── assets/                    # Images, logos, OG cards.
public/                        # Static files served as-is.
astro.config.mjs               # Starlight config + sidebar.
openapi.json                   # (Phase 2) auto-synced from core-rs.
```

## Content conventions

Every page has frontmatter:

```yaml
---
title: Quickstart
description: Send your first metric in 5 minutes
last_verified: 2026-05-02
owner: jj
---
```

`last_verified` powers the scheduled stale-page audit. Bump it whenever you confirm a page still reflects reality.

## Claims and capabilities

`.github/workflows/docs-gates.yml` runs two checks on every docs change:

- `npm run check:claims` (`scripts/claims-gate.mjs`). `claims/capabilities.json` lists what the product does, each
  capability `live`, `held` (built, not shipped) or `absent`, with its evidence: API operations, which must be in
  `openapi.json`, or a source path. `claims/claims.json` lists load-bearing sentences in the docs and the capabilities
  each one needs. The gate fails when a claim needs a capability that is missing or not `live`, when a claim's text is
  no longer on its page, or when any page matches an `absent` capability's pattern without negating it ("there are no
  phone calls" passes, "you get a phone call" fails). When you document something new, add its capability and claim;
  when a sentence moves, update the claim after re-checking it against the product.
- `npm run check:api-examples` (`scripts/api-examples.mjs`). Every `curl` against `https://api.siteqwality.com` in a
  code block must name a method and path in `openapi.json`, and its JSON body must use known fields and send the
  required ones. Routes that are live but missing from the spec go in `claims/unlisted-routes.json`. The monthly run
  adds `--live`: each authenticated route is called in production without a key and must answer `401` or `403`, not
  `404`.

## Deployment

Pushing to `main` runs `.github/workflows/pages.yml`, which builds the site and deploys it to GitHub Pages.

## Background

See `~/code/SiteQwality/docs/plans/2026-05-02-docs-site-rebuild-design.md` for the full design and migration plan.
