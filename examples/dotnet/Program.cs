// A tiny checkout service: every request is traced automatically.
using System.Diagnostics.Metrics;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);
// [setup]
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddAspNetCoreInstrumentation())
    .WithMetrics(metrics => metrics.AddAspNetCoreInstrumentation().AddMeter("checkout"))
    .WithLogging()
    .UseOtlpExporter();
// [/setup]
var app = builder.Build();
// [metric]
var orders = new Meter("checkout").CreateCounter<long>("orders.placed");
// [/metric]

app.MapGet("/order", (ILogger<Program> logger) =>
{
    // [log]
    logger.LogInformation("order placed, orderId={OrderId}", 42);
    // [/log]
    // [metric]
    orders.Add(1);
    // [/metric]
    return "ok\n";
});
app.Run();
