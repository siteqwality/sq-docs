timestamp="$(date +%s)000000000"
start_timestamp="$(($(date +%s) - 1))000000000"
curl --fail-with-body -X POST 'https://otlp.siteqwality.com/v1/traces' \
  -H 'Authorization: Bearer YOUR_INGEST_KEY' \
  -H 'Content-Type: application/json' \
  --data-binary '{"resourceSpans":[{"resource":{"attributes":[{"key":"service.name","value":{"stringValue":"checkout"}},{"key":"deployment.environment.name","value":{"stringValue":"production"}}]},"scopeSpans":[{"spans":[{"traceId":"4bf92f3577b34da6a3ce929d0e0e4736","spanId":"00f067aa0ba902b7","name":"place order","kind":2,"startTimeUnixNano":"'"$start_timestamp"'","endTimeUnixNano":"'"$timestamp"'","status":{"code":1}}]}]}]}'
