# A tiny Flask checkout service: every request is traced automatically.
import logging

from flask import Flask
from opentelemetry import metrics

app = Flask(__name__)
# [log]
logger = logging.getLogger("checkout")
logger.setLevel(logging.INFO)
# [/log]
# [metric]
orders = metrics.get_meter("checkout").create_counter("orders.placed")
# [/metric]


@app.route("/order")
def order():
    # [log]
    logger.info("order placed", extra={"order_id": 42})
    # [/log]
    # [metric]
    orders.add(1)
    # [/metric]
    return "ok\n"
