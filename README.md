# SiteQwality Docs

Public documentation for SiteQwality, hosted at [docs.siteqwality.com](https://docs.siteqwality.com). Built with [Starlight](https://starlight.astro.build/) on [Astro](https://astro.build/).

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
netlify.toml                   # Build settings for Netlify.
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

## Deployment

Pushed commits to `main` trigger a Netlify build automatically.

## Background

See `~/code/SiteQwality/docs/plans/2026-05-02-docs-site-rebuild-design.md` for the full design and migration plan.
