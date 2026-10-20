timestamp="$(date +%s)000000000"
start_timestamp="$(($(date +%s) - 60))000000000"
curl --fail-with-body -X POST 'https://otlp.siteqwality.com/v1/metrics' \
  -H 'Authorization: Bearer YOUR_INGEST_KEY' \
  -H 'Content-Type: application/json' \
  --data-binary '{"resourceMetrics":[{"resource":{"attributes":[{"key":"service.name","value":{"stringValue":"checkout"}},{"key":"deployment.environment.name","value":{"stringValue":"production"}}]},"scopeMetrics":[{"metrics":[{"name":"orders.placed","sum":{"aggregationTemporality":2,"isMonotonic":true,"dataPoints":[{"startTimeUnixNano":"'"$start_timestamp"'","timeUnixNano":"'"$timestamp"'","asInt":"1"}]}}]}]}]}'
