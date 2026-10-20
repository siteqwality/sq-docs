// A tiny checkout service: every request is traced by otelhttp.
package main

import (
	"context"
	"log"
	"net/http"

	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
)

// [log]
var logger = otelslog.NewLogger("checkout")

// [/log]

func main() {
	// [setup]
	shutdown, err := setupOTel(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	defer shutdown(context.Background())
	// [/setup]

	// [metric]
	orders, _ := otel.Meter("checkout").Int64Counter("orders.placed")
	// [/metric]
	order := func(w http.ResponseWriter, r *http.Request) {
		// [log]
		logger.InfoContext(r.Context(), "order placed", "orderId", 42)
		// [/log]
		// [metric]
		orders.Add(r.Context(), 1)
		// [/metric]
		w.Write([]byte("ok\n"))
	}
	// [trace]
	http.Handle("/order", otelhttp.NewHandler(http.HandlerFunc(order), "order"))
	// [/trace]
	log.Fatal(http.ListenAndServe(":8080", nil))
}
