FROM otel/opentelemetry-collector-contrib:0.162.0 AS collector
FROM ghcr.io/open-telemetry/opentelemetry-collector-contrib/telemetrygen:v0.162.0 AS telemetrygen
FROM alpine:3
COPY --from=collector /otelcol-contrib /usr/local/bin/otelcol-contrib
COPY --from=telemetrygen /telemetrygen /usr/local/bin/telemetrygen
WORKDIR /app
COPY collector.yaml run.sh drive.sh ./
CMD ["sh", "drive.sh"]
