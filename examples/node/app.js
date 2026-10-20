// A tiny checkout service: every request is traced automatically.
const http = require('node:http');
// [log]
const logger = require('pino')();
// [/log]
// [metric]
const { metrics } = require('@opentelemetry/api');
const orders = metrics.getMeter('checkout').createCounter('orders.placed');
// [/metric]

http
  .createServer((req, res) => {
    // [log]
    logger.info({ orderId: 42 }, 'order placed');
    // [/log]
    // [metric]
    orders.add(1);
    // [/metric]
    res.end('ok\n');
  })
  .listen(8080);
