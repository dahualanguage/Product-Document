#!/usr/bin/env python3
"""
Send ESL Student wireframes to Figma via html.to.design MCP endpoint.
Each wireframe section is sent separately as a named frame.
"""

import json
import re
import sys
import urllib.request

MCP_URL = "https://h2d-mcp.divriots.com/fad31c9f-4bfa-48e0-b923-affb78f266e7/mcp"
WIREFRAME_PATH = "../specs/esl-student/wireframes.html"

def mcp_request(session_id, method, params, req_id):
    """Send a JSON-RPC request to the MCP endpoint."""
    body = json.dumps({
        "jsonrpc": "2.0",
        "id": req_id,
        "method": method,
        "params": params,
    }).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }
    if session_id:
        headers["Mcp-Session-Id"] = session_id

    req = urllib.request.Request(MCP_URL, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        raw = resp.read().decode("utf-8")
        resp_headers = dict(resp.headers)
        # Parse SSE response
        for line in raw.split("\n"):
            if line.startswith("data: "):
                return json.loads(line[6:]), resp_headers
    return None, resp_headers


def init_session():
    """Initialize MCP session and return session ID."""
    result, headers = mcp_request(None, "initialize", {
        "protocolVersion": "2025-03-26",
        "capabilities": {},
        "clientInfo": {"name": "claude-code", "version": "1.0"},
    }, 0)
    session_id = headers.get("Mcp-Session-Id") or headers.get("mcp-session-id")
    print(f"Session initialized: {session_id[:16]}...")
    return session_id


def import_html(session_id, name, html, req_id):
    """Call the import-html tool."""
    result, _ = mcp_request(session_id, "tools/call", {
        "name": "import-html",
        "arguments": {
            "name": name,
            "html": html,
        },
    }, req_id)
    return result


def read_wireframe():
    """Read the wireframe HTML file."""
    with open(WIREFRAME_PATH, "r", encoding="utf-8") as f:
        return f.read()


def extract_css(html):
    """Extract the <style> content."""
    match = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
    return match.group(1).strip() if match else ""


def extract_section(html, section_id, next_section_id=None):
    """Extract a wireframe section's inner HTML (inside wf-container)."""
    # Find the wf-section div
    pattern = rf'<div class="wf-section" id="{section_id}">(.*?)'
    if next_section_id:
        pattern += rf'(?=<div class="wf-section" id="{next_section_id}">)'
    else:
        pattern += r'(?=<footer>)'
    match = re.search(pattern, html, re.DOTALL)
    if match:
        return match.group(0)
    return None


def build_standalone_html(css, body_html, title):
    """Build a standalone HTML snippet with styles for import."""
    # Minimize CSS by removing comments and extra whitespace
    css_min = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    css_min = re.sub(r'\s+', ' ', css_min)

    return f"""<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background: #f8fafc; line-height: 1.5; font-size: 14px;">
<style>{css_min}</style>
{body_html}
</div>"""


def main():
    print("Reading wireframe HTML...")
    html = read_wireframe()
    css = extract_css(html)

    # Define sections
    sections = [
        ("wf-homepage", "wf-filtered", "A — Word Bank Homepage"),
        ("wf-filtered", "wf-setup-home", "B — Filtered View"),
        ("wf-setup-home", "wf-setup-category", "C — Practice Setup (Homepage)"),
        ("wf-setup-category", None, "D — Practice Setup (Category)"),
    ]

    # Which sections to send (default: all, or pass indices as args)
    indices = list(range(len(sections)))
    if len(sys.argv) > 1:
        indices = [int(x) for x in sys.argv[1:]]

    print("Initializing MCP session...")
    session_id = init_session()

    for idx in indices:
        sid, next_sid, name = sections[idx]
        print(f"\nExtracting section: {name}...")
        section_html = extract_section(html, sid, next_sid)
        if not section_html:
            print(f"  ERROR: Could not extract section {sid}")
            continue

        standalone = build_standalone_html(css, section_html, name)
        size_kb = len(standalone.encode("utf-8")) / 1024
        print(f"  HTML size: {size_kb:.1f} KB")

        print(f"  Sending to Figma: {name}...")
        try:
            result = import_html(session_id, name, standalone, idx + 1)
            if result and "result" in result:
                content = result["result"].get("content", [])
                for c in content:
                    if c.get("type") == "text":
                        print(f"  OK: {c['text'][:200]}")
            elif result and "error" in result:
                print(f"  ERROR: {result['error']}")
            else:
                print(f"  Response: {json.dumps(result)[:300]}")
        except Exception as e:
            print(f"  ERROR: {e}")

    print("\nDone! Check your Figma canvas.")


if __name__ == "__main__":
    main()
