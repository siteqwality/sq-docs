# Tested setup examples

The language guides, the OpenTelemetry Collector guide and the curl guide import their code from
these directories, so the docs show exactly the code that is tested here.

```bash
examples/verify.sh            # every example
examples/verify.sh node go    # just these
```

For each example, `verify.sh` builds a Docker image from the same install, env and run files the
docs show, points it at `capture/server.py` instead of `https://otlp.siteqwality.com`, and checks
that a log, a trace and a metric arrive. The capture receiver applies the same request rules as the
real one (routes, key format, content types, compression), so a wrong header, path or protocol
fails here. Packages are installed unpinned, like a reader would, so a breaking upstream release
fails too.

`.github/workflows/examples.yml` runs this every month and on changes to these files. It also runs
`scripts/stale-guides.mjs`, which fails when a hand-maintained guide in
`src/content/docs/observability/platforms` (hosted platforms and forwarders that cannot run here)
has a `last_verified` date older than 180 days. Re-check that guide against the platform, then bump
the date.

## Markers

A guide can show one part of a file with `<Snippet code={app} region="log" />`. The region is the
lines between `// [log]` and `// [/log]` (or `#` comments), and may be split into several parts.
