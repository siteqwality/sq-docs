"""Local stand-in for https://otlp.siteqwality.com that applies the same request rules.

It accepts what the real receiver accepts (see the ingest reference) and keeps every
accepted body so verify.sh can check what each example sent.
"""
import gzip
import json
import re
import threading
import zlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SIGNALS = {"/v1/logs": "logs", "/v1/traces": "traces", "/v1/metrics": "metrics"}
KEY = re.compile(r"^[0-9a-fA-F]{96}$")
TYPES = {"application/x-protobuf": "protobuf", "application/protobuf": "protobuf", "application/json": "json"}

lock = threading.Lock()
bodies = {"logs": [], "traces": [], "metrics": []}
errors = []


def key_ok(values):
    if len(values) != 1:
        return False
    value = values[0].strip()
    scheme, _, rest = value.partition(" ")
    if rest:
        return scheme.lower() == "bearer" and bool(KEY.match(rest.strip()))
    return bool(KEY.match(value))


def inflate(body, encoding):
    if encoding in ("", "identity"):
        return body
    if encoding == "gzip":
        return gzip.decompress(body)
    if encoding == "deflate":
        return zlib.decompress(body)
    raise ValueError(f"unsupported Content-Encoding {encoding}")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def reject(self, status, reason):
        with lock:
            errors.append(f"{self.command} {self.path}: {status} {reason}")
        self.send_response(status)
        self.end_headers()

    def do_GET(self):
        # /_dump/<signal> returns the accepted bodies; /_errors lists refused requests.
        if self.path == "/_errors":
            payload = json.dumps(errors).encode()
        elif self.path.startswith("/_dump/") and self.path[7:] in bodies:
            payload = b"\n".join(bodies[self.path[7:]])
        else:
            return self.reject(404, "unknown path")
        self.send_response(200)
        self.end_headers()
        self.wfile.write(payload)

    def read_body(self):
        if (self.headers.get("Transfer-Encoding") or "").lower() != "chunked":
            return self.rfile.read(int(self.headers.get("Content-Length") or 0))
        chunks = []
        while True:
            size = int(self.rfile.readline().split(b";")[0], 16)
            if size == 0:
                self.rfile.readline()
                return b"".join(chunks)
            chunks.append(self.rfile.read(size))
            self.rfile.readline()

    def do_POST(self):
        raw = self.read_body()
        signal = SIGNALS.get(self.path)
        if signal is None:
            return self.reject(404, "unknown route")
        if not key_ok(self.headers.get_all("Authorization") or []):
            return self.reject(401, "missing or malformed Authorization")
        ctype = (self.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        if ctype not in TYPES:
            return self.reject(415, f"unsupported Content-Type {ctype!r}")
        try:
            body = inflate(raw, (self.headers.get("Content-Encoding") or "").strip().lower())
        except Exception as error:
            return self.reject(415, str(error))
        with lock:
            bodies[signal].append(body)
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        reply = b"{}" if TYPES[ctype] == "json" else b""
        self.send_header("Content-Length", str(len(reply)))
        self.end_headers()
        self.wfile.write(reply)


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 4318), Handler).serve_forever()
