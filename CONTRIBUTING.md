# Contributing to SiteQwality Docs

## Adding a new page

1. Pick the right product area under `src/content/docs/<area>/`.
2. Pick the right page type from the four templates below.
3. Copy the template, fill in content, add a sidebar entry in `astro.config.mjs`.
4. `npm run dev` to preview, `npm run build` to verify.

## Page templates

Every product area follows the same four-page shape:

| Template | File | Job |
|---|---|---|
| Overview | `<area>/overview.mdx` | What this feature is, when to use it, how it relates to other features |
| Quickstart | `<area>/quickstart.mdx` | Copy-pasteable path to first success |
| How-to | `<area>/how-to/<task>.mdx` | One specific task per page |
| Reference | `<area>/reference.mdx` | Settings table, field-by-field |

API endpoint pages are auto-generated from `openapi.json` — don't write them by hand.

### Frontmatter

Every page must have:

```yaml
---
title: Quickstart
description: One sentence shown in search results and OG cards.
last_verified: 2026-05-03
owner: jj
---
```

`last_verified` powers the scheduled stale-page audit. Bump it whenever you confirm the page still reflects reality. Pages older than 180 days get flagged in the quarterly audit PR.

`last_verified` and `owner` are optional in the schema (so auto-generated API ref pages don't break the build), but **all hand-written pages should set them**.

### Overview template

```mdx
---
title: <Feature name>
description: <One sentence; what + who it's for>
last_verified: 2026-05-03
owner: jj
---

import { Aside } from '@astrojs/starlight/components';

<One-paragraph hook: what problem this solves, who it's for.>

## When to use this

<Bulleted list of concrete scenarios.>

## How it works

<2-3 paragraphs of mental model. Diagrams welcome.>

## Next steps

- [Quickstart](./quickstart/) — set this up in 5 minutes.
- [Settings reference](./reference/) — every field, explained.
- API: see [`POST /<endpoint>`](/api-reference/...).
```

### Quickstart template

```mdx
---
title: Quickstart
description: <Achieve concrete outcome> in 5 minutes.
last_verified: 2026-05-03
owner: jj
---

import { Steps, Tabs, TabItem, Code } from '@astrojs/starlight/components';

<One-sentence promise: "By the end of this guide you'll have <X>.">

## Prerequisites

- A SiteQwality account ([sign up free](https://app.siteqwality.com)).
- An API key — see [Authentication](/api-reference/overview/#authentication).
- <Anything else.>

<Steps>

1. **<First action>**

   <Brief instructions. Include screenshots or code blocks.>

2. **<Second action>**

   ```bash
   curl -X POST https://api.siteqwality.com/<endpoint> \
     -H "Authorization: Bearer $SITEQWALITY_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{ ... }'
   ```

3. **<Verify it worked>**

   <How the user knows the thing is happening.>

</Steps>

## What's next

- [How to <related task>](./how-to/<task>/)
- [Settings reference](./reference/)
```

### How-to template

```mdx
---
title: <Verb-shaped task>
description: <One sentence>
last_verified: 2026-05-03
owner: jj
---

<One-paragraph context: when you'd want to do this.>

## Steps

1. <Step>
2. <Step>
3. <Step>

## Notes

<Edge cases, gotchas, related settings.>
```

### Reference template

```mdx
---
title: Settings reference
description: Every field on a <feature>, explained.
last_verified: 2026-05-03
owner: jj
---

| Field | Type | Default | Description |
|---|---|---|---|
| `friendly_name` | string | required | Display name shown in the dashboard. |
| `uri` | string | required | Target URL. Must be absolute. |
| `timeout_ms` | integer | 15000 | Per-request timeout in milliseconds. |
| ... |
```

## Sidebar conventions

Sidebar groups live in `astro.config.mjs`. Within each product area:

```js
{
    label: 'HTTP checks',
    items: [
        { label: 'Overview', slug: 'uptime-monitoring/http-checks/overview' },
        { label: 'Quickstart', slug: 'uptime-monitoring/http-checks/quickstart' },
        { label: 'Settings reference', slug: 'uptime-monitoring/http-checks/reference' },
        {
            label: 'How-to guides',
            autogenerate: { directory: 'uptime-monitoring/http-checks/how-to' },
        },
    ],
},
```

`autogenerate` is fine for `how-to/` directories — Starlight orders them alphabetically. Put a numeric prefix (`01-...`, `02-...`) on filenames if you need a specific order.

## Components quick reference

```mdx
import { Aside, Steps, Tabs, TabItem, Code, Card, CardGrid, LinkCard } from '@astrojs/starlight/components';

<Aside type="note|tip|caution|danger" title="Optional title">Body.</Aside>

<Tabs syncKey="lang">
    <TabItem label="curl">...</TabItem>
    <TabItem label="JavaScript">...</TabItem>
</Tabs>

<LinkCard title="Next: Settings reference" href="../reference/" />
```

## Theming

The site uses the **Atlas** design system (shared with the marketing site and
app). Branding lives in a few places — content/structure changes never need to
touch these:

| File | Role |
|---|---|
| `src/styles/atlas.css` | The whole theme — maps Starlight's `--sl-color-*` vars onto Atlas tokens (light + dark), restyles every component. Wired via `customCss` in `astro.config.mjs`. |
| `ec.config.mjs` | Expressive Code (code-block) theming — the always-dark Atlas ink panel. |
| `public/fonts/` | Self-hosted Manrope + JetBrains Mono woff2. |
| `src/assets/atlas-logo-{light,dark}.svg` | The Pulse logo mark (per theme) — canonical `mark.svg` / `mark-light.svg` from the brand kit. |
| `public/favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `android-icon-{192,512}.png`, `og-feat.png` | Canonical assets from the SiteQwality brand kit — drop in replacements verbatim, don't regenerate. |
| `public/site.webmanifest` | PWA manifest pointing at the android icons. |

> **Gotcha — code-block theming lives in `ec.config.mjs`, not `astro.config.mjs`.**
> The `starlight-openapi` plugin overwrites Starlight's `expressiveCode` config
> option, so themes/styleOverrides set there are silently discarded.
> `astro-expressive-code` merges `ec.config.mjs` in separately, so that survives.

## Deployment

Pushing to `main` triggers a Netlify build (~1-2 min). The site lives at [docs.siteqwality.com](https://docs.siteqwality.com).
