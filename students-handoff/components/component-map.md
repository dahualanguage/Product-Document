# Component Map — Students v7

## Page Structure

```
AppFrame (.app-frame)
├── Sidebar (.app-sidebar)
│   ├── Logo (.sidebar-logo)
│   ├── NavItem: Dashboard
│   ├── NavItem: Students (active)
│   └── NavItem: Insights + Badge(2)
│
├── AppMain (.app-main)
│   ├── AppHeader (.app-header)
│   │   ├── Title: "ESL Teacher"
│   │   ├── VersionLink → versions/index.html
│   │   └── UserAvatar: "MC" / "Ms. Chen"
│   │
│   └── MasterDetail (.master-detail)
│       ├── ListPanel (.list-panel) — 38%
│       │   ├── ListHeader (.list-panel-header)
│       │   │   ├── TitleRow: "Students (18)" + ManageBtn
│       │   │   ├── Subtitle: "Select a student to view details"
│       │   │   ├── SearchInput (placeholder: "Search by name...")
│       │   │   └── FilterRow: Group | Level | Grade
│       │   └── ListScroll (.list-scroll)
│       │       └── StudentCard[] (.stu-item)
│       │           ├── Avatar (.stu-item-avatar)
│       │           ├── Name (.stu-item-name)
│       │           └── Meta (.stu-item-meta): WIDA tag + lang + grade
│       │
│       └── DetailPanel (.detail-panel) — flex:1
│           ├── DetailHeader (.detail-header) [JS rendered]
│           │   ├── Avatar (48px)
│           │   ├── Name + Subtitle
│           │   └── EditBtn → Edit Student Modal
│           │
│           ├── DetailScroll (.detail-scroll)
│           │   ├── Section: KPI Tracker
│           │   │   └── KpiCard[] (.detail-kpi-card)
│           │   │       ├── GoalText + Value/Target
│           │   │       └── ProgressBar + TargetLine
│           │   │
│           │   ├── Section: Vocabulary
│           │   │   └── VocabSummary (.vocab-summary)
│           │   │       ├── StatCards: New This Week | Learning | Mastered
│           │   │       └── MasteryBar: mastered% + learning%
│           │   │
│           │   ├── Section: KPI Cycle History
│           │   │   └── ScrollTable: Cycle | Goal | Result | Achieved
│           │   │
│           │   ├── Section: Practice History
│           │   │   └── ScrollTable: Date | Type(pill) | Score(bar)
│           │   │
│           │   └── Section: Translation Frequency
│           │       └── ScrollTable: Date | Subject | Frequency(colored)
│           │
│           └── EmptyState (.detail-empty) [before selection]
│               ├── Icon: person_search
│               └── Text: "Select a student from the list"
│
├── [Modal] Edit Student (.edit-modal)
│   ├── Title: "Edit Student"
│   ├── Fields: Name, Language, Grade, WIDA, KPI Group
│   └── Actions: Cancel | Save
│
└── [Modal] Manage Students (.manage-modal)
    ├── Header: "Manage Students" + CloseBtn
    ├── Table: Student | Language | Grade | WIDA | KPI Group
    │   └── All cells are editable (inputs/selects)
    └── Footer: Cancel | Save All
```

## CSS Class Reference

| Class | Element | Notes |
|-------|---------|-------|
| `.app-frame` | Root flex container | `height: 100vh` |
| `.app-sidebar` | Left nav bar | `width: 88px` |
| `.sidebar-item` | Nav button | `.active` for current page |
| `.sidebar-badge` | Notification count | Red circle |
| `.master-detail` | Content split | `display: flex` |
| `.list-panel` | Left panel | `width: 38%` |
| `.list-panel-title` | Panel heading | Dynamic count `(N)` |
| `.list-search` | Search input | Icon-left layout |
| `.list-filter` | Filter dropdown | Custom arrow SVG |
| `.stu-item` | Student card | `.active` on selection |
| `.stu-item-avatar` | Circle avatar | WIDA-colored |
| `.level-tag` | WIDA badge | `.wida-1` through `.wida-6` |
| `.detail-panel` | Right panel | `flex: 1` |
| `.detail-header` | Student identity | JS-rendered |
| `.detail-scroll` | Scrollable content | `overflow-y: auto` |
| `.detail-section` | Content block | `margin-bottom: 28px` |
| `.detail-section-title` | Block heading | With `.badge` count |
| `.detail-empty` | No-selection state | Centered icon + text |
| `.detail-kpi-card` | KPI progress card | Bar + target line |
| `.practice-table` | History table | Sticky header, scrollable |
| `.vocab-summary` | Word bank stats | Stat cards + progress bar |
| `.edit-modal` | Single edit form | `width: 420px` |
| `.manage-modal` | Bulk edit table | `width: 900px` |
| `.manage-table` | Editable table | Fixed column widths |