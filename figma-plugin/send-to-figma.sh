#!/bin/bash
# Send ESL Student wireframes to Figma via html.to.design MCP
set -e

MCP_URL="https://h2d-mcp.divriots.com/fad31c9f-4bfa-48e0-b923-affb78f266e7/mcp"
SESSION_ID=$(cat /tmp/h2d-session-id.txt)
WIREFRAME="../specs/esl-student/wireframes.html"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Using MCP session: ${SESSION_ID:0:16}..."

send_html() {
  local name="$1"
  local html_file="$2"
  local req_id="$3"

  echo ""
  echo "=== Sending: $name ==="
  local size=$(wc -c < "$html_file")
  echo "  HTML size: $((size / 1024)) KB"

  # Build JSON payload using Python for proper escaping
  local payload=$(python3 -c "
import json, sys
with open('$html_file', 'r') as f:
    html = f.read()
payload = {
    'jsonrpc': '2.0',
    'id': $req_id,
    'method': 'tools/call',
    'params': {
        'name': 'import-html',
        'arguments': {
            'name': '$name',
            'html': html
        }
    }
}
sys.stdout.write(json.dumps(payload))
")

  local response=$(curl -s -X POST "$MCP_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -H "Mcp-Session-Id: $SESSION_ID" \
    --max-time 120 \
    -d "$payload" 2>&1)

  echo "  Response: $(echo "$response" | head -5)"
}

# Extract CSS
echo "Extracting CSS and wireframe sections..."

CSS=$(python3 -c "
import re
with open('$WIREFRAME', 'r') as f:
    html = f.read()
match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
if match:
    css = match.group(1).strip()
    # Minimize
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    css = re.sub(r'\s+', ' ', css)
    print(css)
")

# Extract each section and save as standalone HTML files
python3 << 'PYEOF'
import re

with open("../specs/esl-student/wireframes.html", "r") as f:
    html = f.read()

# Extract CSS
match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
css = match.group(1).strip() if match else ""
css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
css = re.sub(r'\s+', ' ', css)

# Section boundaries
sections = [
    ("wf-homepage", "wf-filtered", "A"),
    ("wf-filtered", "wf-setup-home", "B"),
    ("wf-setup-home", "wf-setup-category", "C"),
    ("wf-setup-category", None, "D"),
]

for sid, next_sid, label in sections:
    start_marker = f'<div class="wf-section" id="{sid}">'
    start_idx = html.find(start_marker)
    if start_idx == -1:
        print(f"ERROR: Cannot find section {sid}")
        continue

    if next_sid:
        end_marker = f'<div class="wf-section" id="{next_sid}">'
        end_idx = html.find(end_marker)
    else:
        end_marker = '<footer>'
        end_idx = html.find(end_marker, start_idx)

    if end_idx == -1:
        section_html = html[start_idx:]
    else:
        section_html = html[start_idx:end_idx]

    # Build standalone
    standalone = f'''<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background: #f8fafc; line-height: 1.5; font-size: 14px; padding: 20px;">
<style>{css}</style>
{section_html.strip()}
</div>'''

    filename = f"/tmp/wf-section-{label}.html"
    with open(filename, "w") as f:
        f.write(standalone)
    size_kb = len(standalone.encode("utf-8")) / 1024
    print(f"Section {label}: {filename} ({size_kb:.1f} KB)")

PYEOF

echo ""
echo "Sections extracted. Sending to Figma..."

# Send each section
WHICH="${1:-all}"

if [ "$WHICH" = "all" ] || [ "$WHICH" = "0" ] || [ "$WHICH" = "A" ]; then
  send_html "A — Word Bank Homepage" "/tmp/wf-section-A.html" 1
fi
if [ "$WHICH" = "all" ] || [ "$WHICH" = "1" ] || [ "$WHICH" = "B" ]; then
  send_html "B — Filtered View" "/tmp/wf-section-B.html" 2
fi
if [ "$WHICH" = "all" ] || [ "$WHICH" = "2" ] || [ "$WHICH" = "C" ]; then
  send_html "C — Practice Setup (Homepage)" "/tmp/wf-section-C.html" 3
fi
if [ "$WHICH" = "all" ] || [ "$WHICH" = "3" ] || [ "$WHICH" = "D" ]; then
  send_html "D — Practice Setup (Category)" "/tmp/wf-section-D.html" 4
fi

echo ""
echo "Done! Check your Figma canvas."
