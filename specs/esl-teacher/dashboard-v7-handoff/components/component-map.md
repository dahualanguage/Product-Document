# Component Map -- Dashboard v7

## Component Hierarchy

```
App Frame (.app-frame)
  Sidebar (.app-sidebar)
    Logo (.sidebar-logo)
    Nav Items (.sidebar-item) x3
      Dashboard (active)
      Students -> demo-students-v7.html
      Insights -> demo-session-insights-v7.html (with badge)
  Main (.app-main)
    Header (.app-header)
      Title (.app-header-title)
      Right section: Version link, User avatar + name
    Content (.app-content)
      Page Header (.page-head)
        Title + Subtitle
        Manage Trackers button (.kpi-manage-btn)
        New Tracker button (.kpi-setup-btn)
      Dashboard Grid (.dashboard-grid)  [2-column CSS grid]
        [Left, spans 2 rows] KPI Tracker (.kpi-tracker)
        [Right top] Language Barrier (.dash-card)
        [Right bottom] Most Tapped Words (.dash-card)
      Modals (overlays)
        New/Edit Tracker Modal
        Manage Trackers Modal
```

---

## 1. App Frame

### Sidebar (`.app-sidebar`)

Fixed 88px-wide left nav with icon + label items.

```html
<nav class="app-sidebar">
  <div class="sidebar-logo">...</div>
  <div class="sidebar-item active">
    <span class="material-icons-round">dashboard</span>
    <span>Dashboard</span>
  </div>
  <div class="sidebar-item">
    <span class="material-icons-round">group</span>
    <span>Students</span>
  </div>
  <div class="sidebar-item">
    <span class="material-icons-round">lightbulb</span>
    <span>Insights</span>
    <span class="sidebar-badge">2</span>  <!-- notification count -->
  </div>
</nav>
```

**Props/Data**: Active page indicator, notification count for Insights badge.

### App Header (`.app-header`)

```html
<div class="app-header">
  <span class="app-header-title">ESL Teacher</span>
  <div class="header-right">
    <a class="version-link" href="versions/index.html">Versions</a>
    <div class="header-user">
      <div class="header-avatar">MC</div>
      Ms. Chen
    </div>
  </div>
</div>
```

**Props/Data**: Teacher name, initials for avatar.

---

## 2. Page Header

```html
<div class="page-head">
  <div>
    <div class="page-title">Dashboard</div>
    <div class="page-sub">Overview of classroom KPIs & language insights</div>
  </div>
  <div style="display:flex; gap:10px;">
    <button class="kpi-manage-btn">Manage Trackers</button>
    <button class="kpi-setup-btn">+ New Tracker</button>
  </div>
</div>
```

---

## 3. KPI Tracker (`.kpi-tracker`)

Spans left column, both grid rows. Contains a vertically scrollable list of tracker cards.

### Structure

```html
<div class="kpi-tracker">
  <div class="kpi-tracker-header">
    <span class="kpi-tracker-title">KPI Tracker</span>
  </div>
  <div class="kpi-tracker-body">
    <!-- Repeating tracker cards -->
    <div class="kpi-rule" data-tracker-id="1">
      <div class="kpi-rule-header">
        <span class="kpi-rule-arrow">&#9654;</span>
        <div class="kpi-rule-info">
          <div class="kpi-rule-name">3rd Grade - WIDA 1</div>
          <div class="kpi-rule-desc">
            <span class="kpi-rule-tag metric">6 times in 7 days</span>
            <span class="kpi-rule-tag countdown" data-date="Ends Apr 17">3d left</span>
          </div>
        </div>
        <!-- Warning icon (conditional) -->
        <div class="kpi-rule-urgent-wrap">
          <span class="material-icons-round">warning</span>
          <div class="urgent-tooltip">3 days left - 2 of 5 students unmet</div>
        </div>
        <!-- Summary bar -->
        <div class="kpi-rule-summary">
          <div class="kpi-summary-bar-track">
            <div class="kpi-summary-bar-fill" style="width: 60%"></div>
          </div>
          <span class="kpi-summary-pct">60%</span>
        </div>
      </div>
      <!-- Expanded student list -->
      <div class="kpi-rule-students">
        <div class="kpi-rule-students-inner">
          <div class="kpi-stu-row">
            <span class="kpi-stu-name">Emily Chen</span>
            <div class="kpi-stu-bar-wrap">
              <div class="kpi-stu-bar met" style="width: 80%"></div>
              <div class="kpi-stu-target-line" style="left: 66.6%" data-target="Goal 6 times"></div>
            </div>
            <span class="kpi-stu-val">9 <span class="kpi-unit">times</span></span>
          </div>
          <!-- more student rows... -->
        </div>
      </div>
    </div>
  </div>
</div>
```

### Key CSS Classes

| Class | Purpose |
|-------|---------|
| `.kpi-rule` | Tracker card container |
| `.kpi-rule.open` | Expanded state (students visible) |
| `.kpi-rule.linked-highlight` | Yellow highlight from linked hover |
| `.kpi-summary-bar-fill` | Default green gradient |
| `.kpi-summary-bar-fill.warn` | Orange gradient (50-79%) |
| `.kpi-summary-bar-fill.danger` | Red gradient (1-49%) |
| `.kpi-stu-bar.met` | Student bar >= target |
| `.kpi-stu-bar.below` | Student bar >= 50% of target |
| `.kpi-stu-bar.far` | Student bar < 50% of target |
| `.kpi-rule-tag.countdown.warn` | Countdown <= 3 days |
| `.kpi-rule-tag.countdown.danger` | Countdown <= 1 day |

### Props/Data Needed

- `tracker.id` -- for linked hover binding
- `tracker.name` -- display name
- `tracker.metric` -- "times" | "mins" | "words"
- `tracker.target` -- numeric goal
- `tracker.cycle` -- cycle days
- `tracker.start`, `tracker.end` -- date strings
- `tracker.students[]` -- list of student names
- Per student: current value for the metric within this cycle
- Computed: `daysLeft`, `percentMet`, `unmetCount`

### Special Behaviors

- **Goal bubble**: Only rendered on the first student row via `data-target` attribute on `.kpi-stu-target-line`
- **Bar max scale**: Each bar scales to `target * 1.5` so values above target are visible
- **Bar animation**: `@keyframes barGrow` from width 0 over 0.6s

---

## 4. Language Barrier (`.dash-card`)

Right column, top row. A 3-column grid of barrier cards, one per tracker.

### Structure

```html
<div class="dash-card">
  <div class="dash-card-header">
    <span class="dash-card-title">Language Barrier - Translation Frequency</span>
    <div><!-- Time window filter: 3d / 7d / 14d / 30d --></div>
  </div>
  <div class="dash-card-body">
    <div class="barrier-grid">
      <div class="barrier-card" data-tracker-id="1">
        <div class="barrier-card-summary">
          <div class="barrier-card-main">
            <div class="barrier-card-top">
              <span class="barrier-group-name">3rd Grade - WIDA 1</span>
            </div>
            <div class="barrier-every">Every</div>
            <div class="barrier-value good">1.2 <span class="barrier-unit">min</span></div>
            <div class="barrier-trend improving">Improving +18%</div>
          </div>
          <span class="barrier-card-arrow">&#9654;</span>
        </div>
        <!-- Expanded students -->
        <div class="barrier-students">
          <div class="barrier-students-inner">
            <div class="barrier-stu-row">
              <span class="barrier-stu-name">Emily Chen</span>
              <span class="barrier-stu-val good">1.4 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Key CSS Classes

| Class | Purpose |
|-------|---------|
| `.barrier-card` | Individual tracker's barrier stats |
| `.barrier-card.open` | Expanded (shows student rows) |
| `.barrier-card.linked-highlight` | Yellow highlight from linked hover |
| `.barrier-value.good` / `.ok` / `.bad` | Color-coded value |
| `.barrier-trend.improving` / `.worsening` / `.stable` | Trend indicator |

### Props/Data Needed

- `tracker.id` -- for linked hover
- `tracker.name` -- for group label
- Computed `avgIntervalSec` -- current period average
- Computed `prevIntervalSec` -- previous period for trend
- Per student: individual `intervalSec`
- Selected time window (3/7/14/30 days)

---

## 5. Most Tapped Words (`.dash-card`)

Right column, bottom row. A ranked table with filters.

### Structure

```html
<div class="dash-card">
  <div class="dash-card-header">
    <span class="dash-card-title">Most Tapped Words in Class</span>
  </div>
  <div class="stat-top">
    <div class="stat-filters">
      <select class="stat-select"><!-- Tracker filter --></select>
      <select class="stat-select"><!-- Period: 3/7/14/30d --></select>
      <select class="stat-select"><!-- Top N: 5/10/15/20/30 --></select>
    </div>
  </div>
  <div class="dash-card-body word-table">
    <table class="tapped-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Word</th>
          <th>Appeared in</th>
          <th class="center">Tapped</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tt-rank">1</td>
          <td class="tt-word">photosynthesis</td>
          <td>
            <div class="tt-subjects">
              <span class="tt-subject sci">Science <span class="tt-cnt">x4</span></span>
            </div>
          </td>
          <td class="tt-taps">47</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### Props/Data Needed

- Word list: `{ rank, word, subjects: [{ name, count }], tapCount }`
- Filter values: selected tracker ID (or "All"), period, top N

---

## 6. Manage Trackers Modal

Overlay modal listing all trackers with drag-to-reorder.

### Structure

```html
<div class="kpi-modal-overlay">
  <div class="kpi-modal">
    <h3>Manage Trackers</h3>
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div class="tracker-list-item" draggable="true">
        <div class="tracker-list-handle">
          <span class="material-icons-round" style="font-size:20px;">drag_indicator</span>
        </div>
        <div class="tracker-list-info">
          <div class="tracker-list-name">3rd Grade - WIDA 1</div>
          <div class="tracker-list-desc">
            <span class="tracker-list-tag">times</span>
            <span class="tracker-list-tag">6/7d</span>
            <span class="tracker-list-tag">5 students</span>
          </div>
        </div>
        <div class="tracker-list-actions">
          <button class="tracker-list-btn"><span class="material-icons-round" style="font-size:16px;">edit</span></button>
          <button class="tracker-list-btn danger"><span class="material-icons-round" style="font-size:16px;">close</span></button>
        </div>
      </div>
    </div>
    <div class="kpi-modal-actions">
      <button class="kpi-modal-cancel">Close</button>
      <button class="kpi-modal-save">+ New Tracker</button>
    </div>
  </div>
</div>
```

### Key CSS Classes

| Class | Purpose |
|-------|---------|
| `.tracker-list-item.dragging` | Source item being dragged (opacity 0.4) |
| `.tracker-list-item.drag-over` | Drop target (green border + shadow) |
| `.tracker-list-btn.danger` | Delete button (red hover state) |

---

## 7. New/Edit Tracker Modal

Form modal for creating or editing a tracker.

### Form Fields

| Field | Input Type | CSS Class | Validation |
|-------|-----------|-----------|------------|
| Tracker Name | text input | `.kpi-modal-field input` | Required |
| Metric | select dropdown | `.kpi-modal-field select` | "times" / "mins" / "words" |
| Target | number input | `.kpi-modal-field input` | min: 1, default: 10 |
| Cycle (days) | number input | `.kpi-modal-field input` | min: 1, max: 365, default: 7 |
| Start Day | calendar picker | `.cal-wrapper` | Custom shadcn-style calendar |
| End Day | calendar picker | `.cal-wrapper` | Independent instance |
| Students | multi-select | `.target-picker` | Grade + WIDA filters, "Select All", checkboxes |

### Calendar Sub-Component (`.cal-wrapper`)

- Trigger button shows formatted date
- Dropdown panel (`.cal-panel`) positioned absolutely below trigger
- Month select (`.cal-month-select`, width 110px) + Year select (`.cal-year-select`, width 76px)
- 7-column grid of day cells
- Day states: `.other` (grayed), `.today` (green border), `.selected` (green fill)

### Student Picker Sub-Component (`.target-picker`)

- Filter row with Grade dropdown (3rd-8th) and WIDA dropdown (1-6)
- "Select All" toggle with count display ("X / Y selected")
- Scrollable student list (max-height 180px) with checkboxes
- Each student shows: checkbox + name + language tag + grade tag + WIDA tag

### Modal Actions

| Mode | Left Button | Right Button | Extra |
|------|------------|-------------|-------|
| Create | Cancel (close) | Save Tracker | -- |
| Edit | Cancel (close) | Save Tracker | Delete button (white bg, red text) |

### Validation

- At least 1 student must be selected before save
- All numeric fields enforce min/max