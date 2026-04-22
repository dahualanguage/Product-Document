# ESL Teacher Students v7 — Engineering Handoff

## Overview

The Students page is the second tab of the ESL Teacher module. It provides a master-detail view for teachers to browse, filter, and inspect individual student performance across KPI goals, practice history, translation frequency, and vocabulary mastery.

## Flow

```
ESL Teacher Sidebar → Students
  1. Student List (left panel)    — search + filter by group/level/grade
  2. Student Detail (right panel) — select a student to view:
     a. KPI Tracker progress      — current cycle bars with goal line
     b. Vocabulary summary        — mastered/learning stats + progress bar
     c. KPI Cycle History         — past cycle results table
     d. Practice History          — session log with type + score
     e. Translation Frequency     — per-session tap interval
  3. Edit Student (modal)         — single student editing
  4. Manage Students (modal)      — bulk spreadsheet editing
```

## Screens

| # | Screen | Component |
|---|--------|-----------|
| 1 | Student List | `.list-panel` — 38% width, searchable, filterable |
| 2 | Student Detail | `.detail-panel` — 62% width, scrollable sections |
| 3 | Empty State | `.detail-empty` — shown before any selection |
| 4 | Edit Student Modal | `.edit-modal` — single student form (420px) |
| 5 | Manage Students Modal | `.manage-modal` — bulk table (900px) |

## Key Design Decisions

- **Master-detail layout** — both panels scroll independently within `100vh`
- **WIDA-colored avatars** — 6 distinct color schemes by proficiency level (warm→cool)
- **Group = Tracker** — student groups are derived from KPI tracker names (e.g. "3rd Grade · WIDA 1")
- **Real-time filter** — search + 3 dropdowns compose as AND conditions
- **Inline editing** — Manage modal shows all students in an editable table
- **Deterministic mock data** — hash-based generation ensures consistent demo across reloads

## Shared Components with Dashboard v7

| Component | Shared? | Notes |
|-----------|---------|-------|
| App Sidebar | Yes | Same 3-item nav, Students is `.active` |
| App Header | Yes | Same brand title + user area |
| KPI Progress Bar | Partial | Same bar colors/logic, different layout (inline vs card) |
| WIDA Tags | Yes | Same 6-color system |
| Translation Frequency | Similar | Same thresholds, different display (table vs card) |

## Quick Start

Open `code/demo-students-v7.html` in a browser. The first student is auto-selected on load.

## Folder Structure

```
students-handoff/
├── code/
│   ├── demo-students-v7.html    ← Complete working demo
│   └── assets/                  ← Logo image
├── design-specs/
│   ├── colors.md                ← Full color system (WIDA, status, subjects)
│   ├── typography.md            ← Type scale for all elements
│   └── spacing.md               ← Layout, spacing, radius, shadows
├── components/
│   └── component-map.md         ← Full component tree + CSS class reference
├── logic/
│   └── interactions.md          ← All interaction flows + computation logic
└── README.md                    ← This file
```

## Related Pages

- **Dashboard v7** — same app, different tab (`demo-dashboard-v7.html`)
- **Insights v7** — same app, different tab (`demo-session-insights-v7.html`)
- **Handoff page** — full engineering spec: `specs/esl-teacher/students-v7-handoff.html`