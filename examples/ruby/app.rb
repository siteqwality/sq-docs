# A tiny checkout worker that places an order every second.
require 'bundler/setup'
Bundler.require
require 'logger'

# [setup]
OpenTelemetry::SDK.configure(&:use_all)
# [/setup]

# [log]
logger = Logger.new($stdout)
# [/log]
# [metric]
orders = OpenTelemetry.meter_provider.meter('checkout').create_counter('orders.placed')
# [/metric]
tracer = OpenTelemetry.tracer_provider.tracer('checkout')

loop do
  tracer.in_span('place order') do
    # [log]
    logger.info('order placed')
    # [/log]
    # [metric]
    orders.add(1)
    # [/metric]
  end
  sleep 1
end
