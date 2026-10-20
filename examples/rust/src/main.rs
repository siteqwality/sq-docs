// A tiny checkout worker that places an order every second.
use opentelemetry::{global, trace::TracerProvider as _};
use opentelemetry_appender_tracing::layer::OpenTelemetryTracingBridge;
use opentelemetry_otlp::{LogExporter, MetricExporter, SpanExporter};
use opentelemetry_sdk::{
    logs::SdkLoggerProvider, metrics::SdkMeterProvider, trace::SdkTracerProvider,
};
use tracing_subscriber::prelude::*;

fn main() {
    // [setup]
    let spans = SpanExporter::builder().with_http().build().unwrap();
    let tracer_provider = SdkTracerProvider::builder().with_batch_exporter(spans).build();
    let metrics = MetricExporter::builder().with_http().build().unwrap();
    let meter_provider = SdkMeterProvider::builder().with_periodic_exporter(metrics).build();
    let logs = LogExporter::builder().with_http().build().unwrap();
    let logger_provider = SdkLoggerProvider::builder().with_batch_exporter(logs).build();
    global::set_meter_provider(meter_provider.clone());
    tracing_subscriber::registry()
        .with(OpenTelemetryTracingBridge::new(&logger_provider))
        .with(tracing_opentelemetry::layer().with_tracer(tracer_provider.tracer("checkout")))
        .init();
    // [/setup]

    // [metric]
    let orders = global::meter("checkout").u64_counter("orders.placed").build();
    // [/metric]
    loop {
        tracing::info_span!("place order").in_scope(|| {
            // [log]
            tracing::info!(order_id = 42, "order placed");
            // [/log]
            // [metric]
            orders.add(1, &[]);
            // [/metric]
        });
        std::thread::sleep(std::time::Duration::from_secs(1));
    }
}
