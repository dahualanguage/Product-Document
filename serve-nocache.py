#!/usr/bin/env python3
"""Local preview server: python3 serve-nocache.py  →  http://127.0.0.1:8765/  (Cache-Control: no-store, so edited pages never stick)."""
import http.server, sys
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store, max-age=0'); super().end_headers()
    def log_message(self,*a): pass
http.server.ThreadingHTTPServer(('127.0.0.1', int(sys.argv[1]) if len(sys.argv)>1 else 8765), H).serve_forever()
