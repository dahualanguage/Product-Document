# Interaction Patterns -- Dashboard v7

## 1. Expand / Collapse

### KPI Tracker Cards

- **Trigger**: Click anywhere on `.kpi-rule-header`
- **Mechanism**: Toggle `.open` class on `.kpi-rule`
- **Animation**: `.kpi-rule-students` transitions `max-height` from `0` to `800px` over `0.3s ease`
- **Arrow**: `.kpi-rule-arrow` rotates from `0deg` to `90deg` over `0.2s`
- **Side effect**: When expanded, student progress bars play `barGrow` animation (0.6s ease, from width 0)

### Language Barrier Cards

- **Trigger**: Click anywhere on `.barrier-card-summary`
- **Mechanism**: Toggle `.open` class on `.barrier-card`
- **Animation**: `.barrier-students` transitions `max-height` from `0` to `600px` over `0.3s ease`
- **Arrow**: `.barrier-card-arrow` rotates same as KPI

### Common Pattern

Both use CSS-only `max-height` transitions. The expanded content is always in the DOM but hidden with `max-height: 0; overflow: hidden`.

---

## 2. Linked Hover

KPI Tracker cards and Language Barrier cards are linked by tracker ID. Hovering one highlights the other.

### Setup

After each render of both panels, call `bindLinkedHover()` which:
1. Iterates all trackers
2. Finds the matching KPI rule (`[data-tracker-id="N"]`) and barrier card
3. Attaches `mouseenter` / `mouseleave` event listeners on both

### Highlight Effect

```css
.kpi-rule.linked-highlight,
.barrier-card.linked-highlight {
  border-color: #eab308;
  box-shadow: 0 0 0 2px rgba(234,179,8,.2);
  background: #fefce8;
}
```

### Behavior

- Hovering KPI rule -> adds `.linked-highlight` to matching barrier card
- Hovering barrier card -> adds `.linked-highlight` to matching KPI rule
- Mouse leave -> removes `.linked-highlight` from the paired element
- The hovered element itself also gets the yellow highlight via its own `:hover` CSS

---

## 3. Progress Bar Color Logic

### Summary Bar (KPI Header)

Based on percentage of students who met their target:

| % Met | Gradient | CSS Class |
|-------|----------|-----------|
| >= 80% | `#059669` to `#6EE7B7` | (default) |
| 50-79% | `#f59e0b` to `#fbbf24` | `.warn` |
| 1-49% | `#ef4444` to `#f87171` | `.danger` |
| 0% | No visible fill | `.danger` (0% width) |

### Individual Student Bars (KPI Expanded)

Based on student's actual value vs tracker target:

| Condition | Gradient | CSS Class |
|-----------|----------|-----------|
| value >= target | `rgba(110,231,183,0.5)` to `#059669` | `.met` |
| value >= target * 0.5 | `rgba(252,211,77,0.5)` to `#F59E0B` | `.below` |
| value < target * 0.5 | `rgba(252,165,165,0.5)` to `#EF4444` | `.far` |

### Bar Width Calculation

```
barWidthPercent = Math.min((value / (target * 1.5)) * 100, 100)
```

The max scale is `target * 1.5` so students who exceed the goal show a proportional bar.

### Target Line Position

```
targetLineLeft = (target / (target * 1.5)) * 100 = 66.67%
```

Always at the 2/3 mark of the bar container.

---

## 4. Warning Icon Logic

The amber warning icon (`.kpi-rule-urgent-wrap`) appears only when:

```
daysLeft <= 2 AND unmetStudentCount > 0
```

### Tooltip

- Content: `"N days left - X of Y students unmet"`
- Shown on hover via CSS (`opacity: 0` -> `1`)
- Dark tooltip style: bg `#1e293b`, text `#fff`, border-radius `6px`
- Has a downward-pointing CSS arrow (`:before` pseudo-element)

---

## 5. Countdown Tag States

The countdown tag (`.kpi-rule-tag.countdown`) changes appearance based on days remaining:

| Days Left | CSS Class | Background | Text Color |
|-----------|-----------|-----------|------------|
| > 3 | (default) | `#f1f5f9` | `#64748b` |
| <= 3 | `.warn` | `#fef3c7` | `#92400e` |
| <= 1 | `.danger` | `#fee2e2` | `#991b1b` |

### End Date Tooltip

On hover, shows the cycle end date via CSS `::after` pseudo-element:

```css
.kpi-rule-tag.countdown:hover::after {
  content: attr(data-date);  /* e.g. "Ends Apr 17" */
}
```

---

## 6. Time Window Filter (Language Barrier)

The Language Barrier section header includes period toggle buttons: **3d / 7d / 14d / 30d**.

- Selecting a period re-computes all barrier values for that window
- All barrier cards and their expanded student rows update
- Active button gets highlighted styling

---

## 7. Most Tapped Words Filters

Three filter controls at the top of the table:

### Tracker Filter (Select)

- Options: "All Students" (default) + one option per tracker
- When a specific tracker is selected, tap counts are scaled proportionally:
  ```
  scaledTaps = Math.round(baseTaps * (trackerStudentCount / totalStudentCount))
  ```

### Period Filter

- Options: 3 Days, 7 Days, 14 Days, 30 Days
- Changes the time window for word tap data

### Top N Filter

- Options: Top 5 / 10 / 15 / 20 / 30
- Default: Top 10
- Controls how many rows are visible in the table

---

## 8. Modal Flows

### Opening Modals

| Trigger | Modal |
|---------|-------|
| "Manage Trackers" button (page header) | Manage Trackers list |
| "+ New Tracker" button (page header) | New Tracker form |
| Edit icon in Manage Trackers list | Edit Tracker form (pre-filled) |
| "+ New Tracker" button inside Manage modal | Close list modal, open New Tracker form |

### Closing Modals

- Click "Cancel" / "Close" button
- Click overlay background (outside modal box)
- Close detection: `if (event.target === overlay)` on overlay click

### Modal Display

```css
.kpi-modal-overlay { display: none; }
.kpi-modal-overlay.open { display: flex; }
```

No entry/exit animations in current design.

### Save Flow

1. Validate at least 1 student selected
2. Create/update tracker object in local state
3. Close modal
4. Re-render all three panels (KPI Tracker, Language Barrier, Most Tapped Words)
5. Re-bind linked hover listeners

### Delete Flow (Edit Mode)

1. Remove tracker from state array
2. Close modal
3. Re-render all panels

---

## 9. Drag and Drop (Tracker Reorder)

Used in the Manage Trackers modal to reorder the tracker list.

### Implementation

Native HTML5 Drag and Drop API. Each `.tracker-list-item` has `draggable="true"`.

### Events

| Event | Handler |
|-------|---------|
| `dragstart` | Set `effectAllowed: 'move'`, store source index, add `.dragging` class |
| `dragover` | `preventDefault()`, set `dropEffect: 'move'`, add `.drag-over` class |
| `dragleave` | Remove `.drag-over` class |
| `drop` | `preventDefault()`, remove `.drag-over`, splice array to move item |
| `dragend` | Remove `.dragging` class, re-render all panels |

### Visual Feedback

- **Dragging source**: `opacity: 0.4` (`.dragging` class)
- **Drop target**: Green border highlight
  ```css
  .tracker-list-item.drag-over {
    border-color: #059669;
    box-shadow: 0 0 0 2px rgba(5,150,105,.15);
  }
  ```

### After Drop

- Tracker array is spliced to new order
- All panels re-render with new order
- Linked hover re-binds

---

## 10. Hover States Summary

| Element | Default | Hover |
|---------|---------|-------|
| KPI rule card | `border: #e2e8f0` | `border: #eab308`, yellow shadow + bg |
| Barrier card | `border: #e2e8f0` | `border: #eab308`, yellow shadow + bg |
| Sidebar item | `bg: transparent` | `bg: #f1f5f9` |
| Table row | `bg: transparent` | `bg: #f8faf9` |
| Primary button | `bg: #059669` | `bg: #047857` |
| Card action button | `bg: #fff, border: #e2e8f0` | `bg: #ecfdf5, border: #6EE7B7` |
| Manage Trackers btn | `bg: #fff` | `bg: #ecfdf5` |
| Tracker list item | `border: #e2e8f0` | `border: #cbd5e1` |
| Select input | `border: #e2e8f0` | `border: #cbd5e1` |

---

## 11. Page Load Animation

The entire dashboard grid animates in on load:

```css
.dashboard-grid {
  animation: fadeSlideIn .4s ease .15s both;
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 12. Focus States

All interactive inputs share the same focus ring:

```css
border-color: #059669;
box-shadow: 0 0 0 2px rgba(5,150,105,.15);
outline: none;
```