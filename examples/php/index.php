<?php
// A tiny checkout endpoint; the SDK starts from the OTEL_* variables on autoload.
require __DIR__ . '/vendor/autoload.php';

use Monolog\Logger;
use OpenTelemetry\API\Globals;
use OpenTelemetry\Contrib\Logs\Monolog\Handler;

// [log]
$logger = new Logger('checkout', [new Handler(Globals::loggerProvider(), 'info')]);
// [/log]
// [span]
$tracer = Globals::tracerProvider()->getTracer('checkout');
$span = $tracer->spanBuilder('place order')->startSpan();
$scope = $span->activate();
// Logs and spans created here belong to this span.
// [/span]
// [log]
$logger->info('order placed', ['orderId' => 42]);
// [/log]
// [metric]
Globals::meterProvider()->getMeter('checkout')->createCounter('orders.placed')->add(1);
// [/metric]
// [span]
$scope->detach();
$span->end();
// [/span]
echo "ok\n";
