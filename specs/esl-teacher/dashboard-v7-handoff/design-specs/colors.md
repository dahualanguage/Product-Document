# Color System -- Dashboard v7

## Brand / Accent (Greens)

| Hex | Usage |
|-----|-------|
| `#059669` | Primary accent -- active states, buttons, links, met progress bars, checked checkboxes |
| `#047857` | Primary hover state (buttons, selected calendar day hover) |
| `#ecfdf5` | Primary tint background -- active sidebar, badges, metric tags, checked checkboxes bg |
| `#a7f3d0` | Checked checkbox border, active filter pill border |
| `#6EE7B7` | Badge border, card hover border, summary bar gradient end |
| `#34d399` | Goal bubble background (positioned above target dashed line) |

## Semantic Status

### Good (Green)

| Hex | Usage |
|-----|-------|
| `#059669` | Summary bar gradient start (>= 80%), met individual bar end, barrier "good" value |
| `#6EE7B7` | Summary bar gradient end (>= 80%) |
| `rgba(110,231,183,0.5)` | Individual met bar gradient start |

### Warning (Amber/Orange)

| Hex | Usage |
|-----|-------|
| `#f59e0b` / `#F59E0B` | Warning icon color, summary bar gradient start (50-79%), below-target bar end, barrier "ok" value |
| `#fbbf24` | Warning summary bar gradient end |
| `rgba(252,211,77,0.5)` | Individual below-target bar gradient start |

### Danger (Red)

| Hex | Usage |
|-----|-------|
| `#ef4444` / `#EF4444` | Danger summary bar gradient start (1-49%), far-below bar end, declining trend, delete hover, barrier "bad" value |
| `#f87171` | Danger summary bar gradient end |
| `rgba(252,165,165,0.5)` | Individual far-below bar gradient start |

### Linked Hover Highlight (Yellow)

| Hex | Usage |
|-----|-------|
| `#eab308` | Linked hover border color |
| `#fefce8` | Linked hover / unread background |
| `rgba(234,179,8,.2)` | Linked hover box-shadow ring |

## Neutrals

| Hex | Usage |
|-----|-------|
| `#0f172a` | Darkest text -- page title, card titles, KPI rule names, input values, modal titles |
| `#1e293b` | Body text color, tooltip background |
| `#334155` | Secondary text -- student names, select values, calendar day text |
| `#475569` | Tertiary text -- student values, section headers |
| `#64748b` | Muted text -- group names, labels, meta info, modal field labels |
| `#94a3b8` | Placeholder text -- subtitles, unit labels, disabled icons, dashed target line, "Every" label |
| `#cbd5e1` | Expand arrows, rank numbers, drag handles, checkbox unchecked border, "other month" calendar days |
| `#e2e8f0` | Borders -- cards, inputs, sidebar, summary bar track, table separators |
| `#f1f5f9` | Hover backgrounds, bar tracks, inner separators, countdown tag default bg, KPI tracker outer bg |
| `#f8fafc` | Table header bg, group section bg, student picker container bg |
| `#f8faf9` | Content area background, table row hover |
| `#fff` | Card backgrounds, modals, sidebar bg, input bg |

## Countdown Tag States

| State | Background | Text Color |
|-------|-----------|------------|
| Normal (> 3 days left) | `#f1f5f9` | `#64748b` |
| Warning (<= 3 days) | `#fef3c7` | `#92400e` |
| Danger (<= 1 day) | `#fee2e2` | `#991b1b` |

## Language Barrier Value Colors

| Condition | Color | CSS Class |
|-----------|-------|-----------|
| >= 120 seconds | `#059669` | `.good` |
| 45-119 seconds | `#F59E0B` | `.ok` |
| < 45 seconds | `#EF4444` | `.bad` |

## Language Barrier Trend Colors

| Condition | Color | CSS Class |
|-----------|-------|-----------|
| Improving (diff > 5%) | `#059669` | `.improving` |
| Declining (diff < -5%) | `#EF4444` | `.worsening` |
| Stable (-5% to 5%) | `#94a3b8` | `.stable` |

## Subject Tag Colors (Most Tapped Words)

| Subject | Background | Text Color | CSS Class |
|---------|-----------|------------|-----------|
| Science | `#ecfdf5` | `#065f46` | `.sci` |
| Math | `#eef2ff` | `#4338ca` | `.math` |
| History | `#fef3c7` | `#92400e` | `.hist` |
| Social Studies | `#e0f2fe` | `#0369a1` | `.ss` |

## Language Tags (Student Picker)

| Language | Background | Text Color | CSS Class |
|----------|-----------|------------|-----------|
| Chinese (zh) | `#fef3c7` | `#92400e` | `.lang-zh` |
| Spanish (es) | `#ede9fe` | `#6d28d9` | `.lang-es` |

## Miscellaneous

| Hex | Usage |
|-----|-------|
| `rgba(0,0,0,.4)` | Modal overlay background |
| `#C4CDD5` | App header bottom border |
| `#fef9c3` | Inbox badge background |
| `#854d0e` | Inbox badge text |
| `#fde047` | Inbox badge border |