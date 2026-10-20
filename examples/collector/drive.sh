# Test driver: starts the Collector as the docs do, then feeds it with telemetrygen.
sh run.sh &
sleep 3
send="--otlp-endpoint=127.0.0.1:4318 --otlp-http --otlp-insecure --rate=0"
while true; do
  telemetrygen logs $send --logs=1 --body="order placed"
  telemetrygen traces $send --traces=1
  telemetrygen metrics $send --metrics=1 --otlp-metric-name=orders.placed
  sleep 1
done
