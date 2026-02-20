# CLAUDE.md — Product Document

**IMPORTANT: Read this file in full before making any changes to this project.**

This project contains all product documentation for the DAHUA AI platform — flow diagrams, product specifications, and platform overview. The single entry point is `index.html` at the root.

## Project Structure

```
Product-Document/
├── CLAUDE.md                          ← This file (read first!)
├── index.html                         ← Documentation portal (single entry point)
├── overview/
│   └── platform-overview.html         ← Platform overview (roles, permissions, all 6 flows)
├── flowcharts/
│   ├── index.html                     ← Legend (node shapes & arrow reference)
│   ├── flow-1-authentication.html     ← Mermaid.js format
│   ├── flow-2-content-creation.html   ← Mermaid.js format
│   ├── flow-3-student-practice.html   ← Legacy swimlane (pending Mermaid conversion)
│   ├── flow-4-school-management.html  ← Mermaid.js format
│   ├── flow-5-platform-admin.html     ← Legacy swimlane (pending Mermaid conversion)
│   └── flow-6-live-classroom.html     ← Mermaid.js format
└── specs/
    ├── flow-1-authentication/         ← (empty — coming soon)
    ├── flow-2-content-creation/       ← (empty — coming soon)
    ├── flow-3-student-practice/       ← (empty — coming soon)
    ├── flow-4-school-management/
    │   ├── index.html                ← Spec index (landing page for all Flow 4 specs)
    │   └── data-dashboard.html        ← Data Dashboard for School Admin spec
    ├── flow-5-platform-admin/         ← (empty — coming soon)
    └── flow-6-live-classroom/
        ├── index.html                ← Spec index (landing page for all Flow 6 specs)
        ├── live-transcription.html    ← Live Transcription spec
        └── clickable-transcript.html  ← ClickableTranscript spec
```

## Naming Convention

- **Spec folders must match flowchart filenames** (e.g., `flow-4-school-management/` matches `flow-4-school-management.html`)
- Spec files inside each folder are named by feature (e.g., `data-dashboard.html`)
- All documentation is HTML (not markdown) so it renders in the browser with consistent styling

## Navigation Rules

- `index.html` (root) links to everything — overview, all flowcharts, and all spec index pages
- Each flow card in the root portal has at most 2 links: **Flow Diagram** + **Product Specs** (pointing to the spec index page)
- Each spec folder has an `index.html` landing page that lists all specs for that flow
- Each flowchart section with a spec links to it via a `.spec-link` button in the section title
- Each spec has a breadcrumb topbar: **Home / Flow N / Spec Name**
- Spec index pages have a breadcrumb topbar: **Home / Flow N / Product Specs**
- Flowchart pages have a shared sidebar with links to all flow pages

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

## Nav-dot Color Map

| Page | Color |
|------|-------|
| Legend (index.html) | `#64748b` (gray, SVG icon) |
| 1 — Authentication | `#6366f1` (indigo) |
| 2 — Content Creation | `#10b981` (green) |
| 3 — Student Practice | `#f59e0b` (amber) |
| 4 — School Management | `#ef4444` (red) |
| 5 — Platform Admin | `#8b5cf6` (purple) |
| 6 — Live Classroom | `#0ea5e9` (sky blue) |

Each flow page's `.badge` background in section titles must match that page's nav-dot color.

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

### Spec Link in Section Title

When a flow section has a corresponding product spec, add a `.spec-link` in the section title:

```html
<h3 class="section-title">
  <span class="badge">B</span> Section Title
  <a class="spec-link" href="../specs/flow-N-name/spec-name.html" title="Open product spec">
    <svg>...</svg> Product Spec
  </a>
</h3>
```

## Checklist: Adding / Modifying Pages

### Adding a new flow page:

1. Copy an existing Mermaid-format flow file as template (recommend flow-2)
2. Update `<title>` and `.page-header` content
3. Set the `active` class on the correct sidebar nav-item
4. Copy all 9 classDef definitions into every Mermaid block
5. Set `.badge` background to match the page's nav-dot color
6. Update the flowId array in `DiagramPanZoom` initialization
7. **Update `index.html`** (root portal) to include the new flow card
8. **Scan the codebase** from a UX perspective — only flag issues that actual users would encounter

### Adding a new spec:

1. Create the spec HTML file inside `specs/flow-N-name/`
2. Use the spec template style (topbar breadcrumb, container layout, consistent CSS)
3. Add breadcrumb: **Home / Flow N / Spec Name**
4. Add a `.spec-link` button in the corresponding flowchart section title
5. **Add the spec to `specs/flow-N-name/index.html`** (spec index page) — if no index exists yet, create one using the spec index template (badge + card list)
6. If this is the first spec for the flow, also **update root `index.html`** to replace the "coming soon" link with a "Product Specs" link pointing to `specs/flow-N-name/index.html`

### Modifying existing pages:

- Adding a sidebar item → update sidebar HTML in **all flowchart files + legend**
- Changing classDef colors → update all Mermaid files + Legend (`index.html` in flowcharts/)
- Changing nav-dot colors → update sidebar in all flowchart files + that page's `.badge`

## Legacy Swimlane Conversion

Flows 3 and 5 are pending conversion to Mermaid format. When converting:

1. Preserve the original flow logic, rewrite using Mermaid `flowchart TD` syntax
2. Scan the corresponding codebase from a UX angle — mark issues (`:::warn` / `:::gate`) and verified features (`:::done`)
3. Remove all legacy CSS lane color classes (e.g., `.color-admin`, `.color-system`)

## Footer Format

```html
<footer>DAHUA AI &middot; Flow Diagrams &middot; February 2026</footer>
```

For specs:
```html
<footer>DAHUA AI &middot; Product Spec &middot; Flow N &mdash; Flow Name &middot; February 2026</footer>
```

Update the month and year to match the actual update date.