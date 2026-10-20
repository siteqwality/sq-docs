#!/usr/bin/env bash
# Runs each example against the local capture receiver: ./verify.sh [example ...]
# Each one is built from the same install, env and run files the docs show.
set -euo pipefail
cd "$(dirname "$0")"
examples=("$@")
[ ${#examples[@]} -gt 0 ] || examples=(node python java dotnet php go rust ruby collector curl)
key=$(printf 'a%.0s' $(seq 96))
id=sqx-$$
net=$id-net
tmp=$(mktemp -d)
trap 'docker rm -f $id-capture $id-app >/dev/null 2>&1 || true; docker network rm $net >/dev/null 2>&1 || true; rm -rf "$tmp"' EXIT
docker network create $net >/dev/null
failed=()

for name in "${examples[@]}"; do
  echo "== $name"
  docker rm -f $id-capture $id-app >/dev/null 2>&1 || true
  docker run -d --name $id-capture --network $net --network-alias capture -p 127.0.0.1::4318 \
    -v "$PWD/capture:/capture:ro" python:3.13-slim python -u /capture/server.py >/dev/null
  port=$(docker port $id-capture 4318/tcp | head -1 | sed 's/.*://')
  # The docs' files with the endpoint and key swapped for the local receiver.
  rm -rf "$tmp/ctx" && cp -R "$name" "$tmp/ctx"
  { grep -rlI -e otlp.siteqwality.com -e YOUR_INGEST_KEY "$tmp/ctx" || true; } | while read -r file; do
    sed -i.orig -e 's|https://otlp.siteqwality.com|http://capture:4318|g' -e "s|YOUR_INGEST_KEY|$key|g" "$file"
    rm "$file.orig"
  done
  if ! docker build --progress=plain -t sq-docs-example-$name "$tmp/ctx" > "$tmp/build.log" 2>&1; then
    echo "FAILED: image build"
    tail -40 "$tmp/build.log" | sed 's/^/  build: /'
    failed+=("$name")
    continue
  fi
  # Faster flushes than the defaults, so each check takes seconds.
  printf '%s\n' OTEL_METRIC_EXPORT_INTERVAL=1000 OTEL_BLRP_SCHEDULE_DELAY=500 OTEL_BSP_SCHEDULE_DELAY=500 > "$tmp/env"
  [ -f "$tmp/ctx/env.sh" ] && sed 's/^export //' "$tmp/ctx/env.sh" >> "$tmp/env"
  docker run -d --name $id-app --network $net --network-alias app --env-file "$tmp/env" sq-docs-example-$name >/dev/null
  missing=""
  for _ in $(seq 120); do
    sleep 1
    if [ -f "$name/trigger" ]; then
      docker run --rm --network $net curlimages/curl:8.22.0 -fsS -m 2 -o /dev/null "http://app:8080$(cat "$name/trigger")" 2>/dev/null || true
    fi
    missing=""
    grep -aq 'order placed' <(curl -s localhost:$port/_dump/logs) || missing+=" logs"
    grep -aq 'checkout' <(curl -s localhost:$port/_dump/traces) || missing+=" traces"
    grep -aq 'orders.placed' <(curl -s localhost:$port/_dump/metrics) || missing+=" metrics"
    [ -z "$missing" ] && break
  done
  refused=$(curl -s localhost:$port/_errors)
  if [ -z "$missing" ] && [ "$refused" = "[]" ]; then
    echo "ok: logs, traces and metrics accepted"
  else
    echo "FAILED: missing:${missing:- none} refused: $refused"
    docker logs --tail 40 $id-app 2>&1 | sed 's/^/  app: /'
    failed+=("$name")
  fi
done

[ ${#failed[@]} -eq 0 ] || { echo "failed: ${failed[*]}"; exit 1; }
echo "all passed"
