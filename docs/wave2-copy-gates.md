# Wave 2 documentation deployment and copy gates

Reviewed 2026-10-04. This is a documentation handoff, not deployment evidence.

Recovery sequencing supplied by the release owner: npm has only 1.0.7; npm `whoami` returned 401 and login has been requested. CDN SDK1.1 and SDK2.0 are reported live. SDK2.1 is not deployed. Original replay v2 intake is now live, but the fixed index-header change is pending. Publishing/authentication belongs to the release owner; this task does not log in or publish packages.

A read-only preflight at 2026-10-04 14:20 UTC requesting `authorization,content-type,x-sq-replay-index` from `in-replay.siteqwality.com/v2/segments` returned HTTP 204 without CORS allow headers. It did not verify browser compatibility. Event intake preflight returned allow-origin, allow-methods and allow-headers. Neither check establishes authenticated ingestion, metering or replay playback.

## Source evidence

- Root `docs/plans/2026-10-03-rum-wave1-contract.md`, F6, F7, F12 and public SDK surface.
- Root `docs/plans/2026-10-03-rum-world-class-design.md`, sections 6.1, 7, 9.2 and 9.3.
- [SDK PR16](https://github.com/siteqwality/sdk-rum/pull/16), reviewed head `122c13b`, plus the in-progress fixed-URL implementation in `sdk-rum-w2p2` on 2026-10-04. The PR description still used query parameters when reviewed. The local transport uses `/v2/segments` and `x-sq-replay-index`; `Authorization` stays a header. Do not publish the matching SDK until that fix is committed, reviewed and accepted by deployed intake/CORS.
- `core-rs` remote master `44f55a8`: `rum-ingestor/src/handlers/batch.rs` and `errors.rs` meter errors as Observe. The shared core checkout was older and is not the source used for that conclusion. Source inspection does not prove that build is live.
- Replay wrapper `terraform/RUNBOOK-replay-v2.md`: separate `in-replay` host, allowlist, raw storage expiry after four days, required compactor and player rollout. Its old query-string examples and two-header preflight are superseded by the fixed-URL transport requirements in the SDK/CSP guide.
- `iac/sql/main.sql`: free allowances 1,000 Observe, 100 Analyze and 100 Replay sessions; Replay packs 1K/$2, 5K/$8 and 25K/$30 monthly. No stored-MB replay billing unit.

## Deployment sequence

1. Verify Phase 1 intake and identity on `in.siteqwality.com`, config publication for each app under `rum/config/v2/`, and the matching server metering. The SDK uses public config without a token.
2. Deploy and verify fixed-header replay intake/CORS on `in-replay.siteqwality.com`. Its preflight must allow `authorization, content-type, x-sq-replay-index` and expose `Retry-After`. Never put authentication in a URL.
3. Deploy the compactor, schedule, manifest/chunk API and compatible player before expanding replay v2. Raw segments expire after four days. Keep the application rollout allowlist constrained until playback is verified.
4. Publish the CSP/install docs and let customers add the new hosts before switching SDKs. Existing SDK1 examples stay pinned to 1.x. SDK2 instructions are explicitly rollout-gated.
5. From a reviewed SDK release checkout, publish and deploy the matching core, recorder and gzip fallback, then verify the canary. Only after prerequisites and canary evidence should the dashboard snippet and broader customer traffic switch.
6. Apply the marketing gates below individually, in en/de/it, after production evidence. An accepted PR, source implementation, local test or successful preflight is not a Phase exit.

## Commands for the release operator

These commands are provided for a later approved release. They were not executed by the docs integration task.

Docs use `main`, not `master`. After this docs PR is approved, merge it with the normal GitHub workflow. The repository's configured Netlify integration builds `main` with `npm run build` and publishes `dist`.

```bash
# Local documentation validation from this worktree.
npm ci
npm run build

# After npm login and release prerequisites, from a clean, reviewed SDK release checkout.
make check
npm pack --dry-run
npm publish --tag next
make deploy
make probe
```

`make deploy` uses the SDK's existing deployment script and `AWS_PROFILE=siteqwality`, uploads the versioned release and `/rum/v2/`, and invalidates the CDN alias. It must not run from an unrelated or dirty code worktree. Follow the SDK release checklist and fixture checks as well.

The 2.x canary package uses the `next` npm tag. Promoting `latest` or advancing the moving CDN alias requires the rollout gates above; these commands are not blanket publication approval.

Replay and core deployment commands remain owned by the wrapper runbook. Use isolated builds of merged core code and the root deploy rules; never build from the shared core checkout. Update the runbook's preflight to include the index header before following it.

For marketing, use the separate landingpage PR's explicit path allowlist and dry-run comparison. A branch push or merge does not deploy the PHP site.

## Later copy gates

| Claim | Required evidence before publication |
|---|---|
| Errors count as Observe, including SDK1 compatibility requests | Phase 1 intake live; a real accepted error-only session increments Observe and not Analyze; filtered noise does not claim usage. Rule-triggered Analyze/Replay remains separately counted. |
| Error grouping stable across releases | Phase 1 canary with matching errors across two bundle releases and grouping results. SDK keys alone do not prove the server/UI result. |
| Error replay includes up to two minutes before the error | Phase 2 exit, including at least 60 seconds on the fixture, real playback, compaction health for 72 hours and cost checks. Keep the early-page, consent, pause and memory limits explicit. |
| SDK size | Fresh gzip measurements for the exact published core and lazy chunks. A size budget is not the shipped file size. |
| New, regressed, escalating or threshold error alerts | Phase 4 exit with delivered notifications and working rule UI. |
| Source-map CLI and bundler plugins | Phase 4 published packages and a successful production upload/symbolication flow. Keep REST/CI two-call upload copy until then. |
| Device/browser/OS vitals segmentation and unified filters | Phase 5 deployed dashboard and query verification. |
| Privacy Center, deletion requests, retention controls, health/usage UI | Phase 6 UI plus server enforcement, permissions, audit and deletion verification. SDK consent/config fields do not establish these product claims. |
| Canvas recording | Phase 7 capture/player verification. SDK 2.1 currently disables it. |
| No sampling or rate limits | Never restore. Sampling, burst limits, quotas and request budgets are deliberate behavior. |
| Heatmaps, funnels, AI summaries, public sharing, EU residency | Outside these Phase 1/2 docs. Do not imply they shipped. |

Every marketing restoration must cover `src/content/{en,de,it}` and relevant `src/lang` metadata, preserve current pack pricing unless independently changed, lint PHP, render the affected locale pages and check all three host-scoped sitemaps and hreflang alternates.
