// A tiny checkout service: every request is traced automatically.
import com.sun.net.httpserver.HttpServer;
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.metrics.LongCounter;
import java.net.InetSocketAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class App {
  // [log]
  private static final Logger logger = LoggerFactory.getLogger(App.class);
  // [/log]
  // [metric]
  private static final LongCounter orders =
      GlobalOpenTelemetry.getMeter("checkout").counterBuilder("orders.placed").build();
  // [/metric]

  public static void main(String[] args) throws Exception {
    HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
    server.createContext("/order", exchange -> {
      // [log]
      logger.info("order placed, orderId={}", 42);
      // [/log]
      // [metric]
      orders.add(1);
      // [/metric]
      byte[] body = "ok\n".getBytes();
      exchange.sendResponseHeaders(200, body.length);
      exchange.getResponseBody().write(body);
      exchange.close();
    });
    server.start();
  }
}
