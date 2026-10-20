timestamp="$(date +%s)000000000"
curl --fail-with-body -X POST 'https://otlp.siteqwality.com/v1/logs' \
  -H 'Authorization: Bearer YOUR_INGEST_KEY' \
  -H 'Content-Type: application/json' \
  --data-binary '{"resourceLogs":[{"resource":{"attributes":[{"key":"service.name","value":{"stringValue":"checkout"}},{"key":"deployment.environment.name","value":{"stringValue":"production"}}]},"scopeLogs":[{"logRecords":[{"timeUnixNano":"'"$timestamp"'","severityNumber":9,"severityText":"INFO","body":{"stringValue":"order placed"}}]}]}]}'
