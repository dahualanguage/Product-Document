# CLAUDE.md — Product Document

This project contains product flow diagrams for the DAHUA AI platform. It visualizes the UX status of each feature module — marking implemented features, known issues, and flow gaps — for the development team's reference.

## Project Structure

```
Product-Document/
├── CLAUDE.md                          ← This file
├── platform-overview.html             ← Platform overview (role permission matrix, sidebar mapping)
└── flowcharts/
    ├── index.html                     ← Legend (node shapes & arrow reference)
    ├── flow-1-authentication.html     ← Mermaid.js format ✓
    ├── flow-2-content-creation.html   ← Mermaid.js format ✓
    ├── flow-3-student-practice.html   ← Legacy swimlane (pending Mermaid conversion)
    ├── flow-4-school-management.html  ← Legacy swimlane (pending Mermaid conversion)
    └── flow-5-platform-admin.html     ← Legacy swimlane (pending Mermaid conversion)
```

## Node Style Rules (classDef)

All Mermaid flowcharts use these 9 classDefs. **All 9 must be copied into every Mermaid block:**

```
classDef start fill:#e0e7ff,stroke:#a5b4fc,color:#3730a3
classDef decision fill:#fef9c3,stroke:#fde047,color:#854d0e
classDef gate fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
classDef warn fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
classDef done fill:#f0fdf4,stroke:#86efac,color:#166534,stroke-width:2px
classDef ai fill:#ecfdf5,stroke:#6ee7b7,color:#065f46,stroke-width:1.5px
classDef info fill:#f0f9ff,stroke:#bae6fd,color:#0369a1
classDef endnode fill:#fce7f3,stroke:#f9a8d4,color:#9d174d
```

Nodes without a classDef = blue Process Step (default style controlled by Mermaid themeVariables).

### Red Marker Rules (CRITICAL)

- `:::gate` (Gate / Block) and `:::warn` (Warning Note) both render as **bold red borders**
- **Only use for actual UX problems** — bugs, missing features, or dead ends that users encounter during their workflow
- **NEVER** mark intentional design restrictions as red
  - Wrong: Student has no Content Creation access → `:::gate` ✗
  - Correct: Student's flow ends here → `:::endnode` ✓
- Litmus test: **Would the target user be confused or frustrated by this?** Yes → red. No → don't mark red.

### Style Reference

| classDef | Purpose | When to Use |
|----------|---------|-------------|
| `:::start` | Flow entry point | Purple rounded pill, beginning of each flow |
| (default) | Process step | Blue box, no classDef needed |
| `:::ai` | AI-powered step | Steps using OpenAI / Cognitive Services |
| `:::decision` | Decision branch | Yellow diamond, Yes/No or multi-way branch |
| `:::gate` | Block / dead end | Bold red border, flow completely stops and user is impacted |
| `:::warn` | Warning / gap | Bold red border, problem exists but flow can continue |
| `:::done` | Verified feature | Green border, confirmed implemented in codebase |
| `:::info` | Info note | Blue info box, additional context |
| `:::endnode` | Flow end | Pink rounded pill, normal completion (including roles with no access) |

## Role Ordering

When a flowchart includes Access Control role branches, the **left-to-right order** (declaration order in TD flowcharts) is fixed:

```
ADMIN → SCHOOL_ADMIN → SCHOOL_TEACHER → TEACHER → STUDENT → SCHOOL_STUDENT → PARENTS → UNKNOWN
```

- Only include roles **relevant to the feature** — omit roles that don't interact with it
- Roles with identical permissions can be merged (e.g., `SCHOOL_ADMIN / SCHOOL_TEACHER`)
- Roles without access but relevant to the flow should end with `:::endnode`, not `:::gate`

## Sidebar Specification

### All pages share the same sidebar HTML structure

Every page's sidebar must contain navigation links to all flow pages. The `active` class marks the current page.

### Nav-dot Color Map

| Page | Color |
|------|-------|
| Legend (index.html) | `#64748b` (gray, SVG icon) |
| 1 — Authentication | `#6366f1` (indigo) |
| 2 — Content Creation | `#10b981` (green) |
| 3 — Student Practice | `#f59e0b` (amber) |
| 4 — School Management | `#ef4444` (red) |
| 5 — Platform Admin | `#8b5cf6` (purple) |

### Badge Color

Each flow page's `.badge` background in section titles must match that page's nav-dot color.

### Collapse Toggle

Each page's `<script>` includes sidebar toggle logic — clicking toggles the `.collapsed` class and rotates the SVG chevron.

## Mermaid.js Technical Specification

### CDN Import

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
```

### Initialization Config

```javascript
mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    primaryColor: '#dbeafe',
    primaryTextColor: '#1e40af',
    primaryBorderColor: '#93c5fd',
    lineColor: '#94a3b8',
    secondaryColor: '#fef9c3',
    tertiaryColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '13px',
    nodeBorder: '#93c5fd',
    mainBkg: '#dbeafe',
    clusterBkg: '#f8fafc',
    clusterBorder: '#e2e8f0',
    edgeLabelBackground: '#ffffff',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 16,
    nodeSpacing: 40,
    rankSpacing: 50,
    useMaxWidth: false,
  },
});
```

### DiagramPanZoom

Each Mermaid diagram is wrapped in a `.diagram-viewport` container with a custom `DiagramPanZoom` class that provides:

- Mouse wheel zoom (centered on cursor position)
- Click-and-drag panning
- Touch pinch-to-zoom
- Top-right toolbar (zoom in / zoom out / percentage display / Fit to View / 1:1 reset)
- Auto Fit to View on window resize

### HTML Structure Template

Each flow section follows this structure:

```html
<h3 class="section-title"><span class="badge">A</span> Section Title</h3>
<div class="flow-section">
  <div class="zoom-toolbar" data-for="flowId">
    <button class="zoom-btn" data-action="in" title="Zoom in">+</button>
    <button class="zoom-btn" data-action="out" title="Zoom out">&minus;</button>
    <div class="zoom-level" data-label>100%</div>
    <button class="zoom-btn" data-action="fit" title="Fit to view"><!-- SVG --></button>
    <button class="zoom-btn text-btn" data-action="reset" title="Reset to 100%">1:1</button>
  </div>
  <div class="diagram-viewport" id="flowId">
    <pre class="mermaid">
flowchart TD
    ...classDef definitions...
    </pre>
  </div>
</div>
```

### DiagramPanZoom Initialization

Wait for Mermaid to finish rendering, then initialize:

```javascript
const diagrams = {};
function initDiagrams() {
  ['flowA', 'flowB', ...].forEach((id) => {
    const vp = document.getElementById(id);
    if (!vp || !vp.querySelector('svg')) return;
    const d = new DiagramPanZoom(id);
    d.init();
    diagrams[id] = d;
  });
}

let attempts = 0;
const waitForMermaid = setInterval(() => {
  attempts++;
  const allReady = ['flowA', 'flowB', ...].every(
    (id) => document.getElementById(id)?.querySelector('svg')
  );
  if (allReady || attempts > 30) {
    clearInterval(waitForMermaid);
    initDiagrams();
  }
}, 200);
```

## Checklist: Adding / Modifying Flow Pages

### Adding a new flow page:

1. Copy an existing Mermaid-format flow file as template (recommend flow-2)
2. Update `<title>` and `.page-header` content
3. Set the `active` class on the correct sidebar nav-item
4. Copy all 9 classDef definitions into every Mermaid block
5. Set `.badge` background to match the page's nav-dot color
6. Update the flowId array in `DiagramPanZoom` initialization
7. **Scan the codebase** from a UX perspective — only flag issues that actual users would encounter

### Modifying existing pages:

- Adding a sidebar item → update sidebar HTML in **all 7 files**
- Changing classDef colors → update all Mermaid files + Legend (`index.html`)
- Changing nav-dot colors → update sidebar in all 7 files + that page's `.badge`

## Legacy Swimlane Conversion

Flows 3, 4, and 5 are pending conversion to Mermaid format. When converting:

1. Preserve the original flow logic, rewrite using Mermaid `flowchart TD` syntax
2. Scan the corresponding codebase from a UX angle — mark issues (`:::warn` / `:::gate`) and verified features (`:::done`)
3. Remove all legacy CSS lane color classes (e.g., `.color-admin`, `.color-system`)
4. The Legend's Role Lane Colors section has already been removed — no action needed

## Footer Format

```html
<footer>DAHUA AI &middot; Flow Diagrams &middot; February 2026</footer>
```

Update the month and year to match the actual update date.
