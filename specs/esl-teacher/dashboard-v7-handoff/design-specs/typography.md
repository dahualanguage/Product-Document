# Typography -- Dashboard v7

## Font Family

```
font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

Loaded via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet">
```

Base body: `font-size: 14px; line-height: 1.5; color: #1e293b`

## Page Header

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Page title | 22px | 800 | `#0f172a` | `letter-spacing: -.3px` |
| Page subtitle | 14px | 400 | `#94a3b8` | |
| Page badge | 12px | 700 | `#059669` | Pill with green border |

## App Header

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Header title | 16px | 700 | `#0f172a` |
| User name | 13px | 500 | `#475569` |
| Header badge | 10px | 700 | `#059669` |
| Version link | 11px | 600 | `#94a3b8` |

## Sidebar

| Element | Size | Weight | Color (default) | Color (active) |
|---------|------|--------|-----------------|----------------|
| Icon | 22px | -- | `#94a3b8` | `#059669` |
| Label | 10px | 600 | `#94a3b8` | `#059669` |
| Notification badge | 10px | 700 | `#fff` on `#ef4444` bg | -- |

## KPI Tracker

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Card section title | 14px | 600 | `#0f172a` | `.kpi-tracker-title` |
| Tracker rule name | 13px | 700 | `#0f172a` | `.kpi-rule-name` |
| Metric tag | 11px | 700 | `#059669` | Green pill, bg `#ecfdf5` |
| Countdown tag | 11px | 700 | `#64748b` | Default state; see colors.md for warn/danger |
| Summary percentage | 11px | 700 | `#64748b` | Right of summary bar |
| Student name | 12px | 600 | `#334155` | 80px width, truncated with ellipsis |
| Student value | 11px | 700 | `#475569` | Right-aligned |
| Student unit | 10px | 500 | `#94a3b8` | Inline after value |
| Goal bubble | 10px | 600 | `#fff` | On `#34d399` bg, `border-radius: 8px` |
| Rule description | 12px | 400 | `#64748b` | `.kpi-rule-desc` |

## Language Barrier

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Group name | 11px | 700 | `#64748b` | `.barrier-group-name` |
| "Every" label | 12px | 600 | `#94a3b8` | `.barrier-every` |
| Interval value | 22px | 800 | color-coded | `.barrier-value` -- see color thresholds |
| Unit label | 11px | 600 | `#94a3b8` | `.barrier-unit` |
| Trend text | 11px | 600 | color-coded | `.barrier-trend` -- green/red/gray |
| Meta tag | 9px | 700 | `#64748b` | bg `#f1f5f9` |
| Student name (expanded) | 12px | 600 | `#334155` | |
| Student value (expanded) | 12px | 700 | color-coded | Same thresholds as main value |

## Most Tapped Words Table

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Table header | 10px | 700 | `#94a3b8` | `letter-spacing: .4px`, uppercase |
| Rank number | 10px | 700 | `#cbd5e1` | `.tt-rank` |
| Word | 14px | 500 | `#0f172a` | `.tt-word` |
| Subject tag | 10px | 600 | varies | See subject tag colors |
| Subject count | 9px | 700 | inherited | `opacity: .7` |
| Tap count | 13px | 700 | `#0f172a` | `.tt-taps`, center-aligned |
| Variant forms | 11px | 400 | `#94a3b8` | Italic |

## Modals

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Modal title | 16px | 800 | `#0f172a` | |
| Field label | 11px | 700 | `#64748b` | Uppercase, `letter-spacing: .3px` |
| Input text | 13px | 600 | `#0f172a` | |
| Button text | 14px | 500 | varies | `letter-spacing: .1px` |
| Cancel button | 14px | 500 | `#64748b` | |
| Save button | 14px | 500 | `#fff` | |

## Manage Trackers Modal

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Tracker name | 13px | 700 | `#0f172a` |
| Description tags | 10px | 600 | `#059669` on `#ecfdf5` bg |
| Description text | 11px | 400 | `#64748b` |

## Tooltips

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Tooltip text | 11px | 500 | `#fff` on `#1e293b` bg |

## Buttons

| Button | Size | Weight | Color |
|--------|------|--------|-------|
| Manage Trackers | 14px | 500 | `#059669` |
| New Tracker (primary) | 14px | 500 | `#fff` |
| Card action link | 11px | 600 | `#059669` |
| Filter select | 12px | 500 | `#334155` |

## Calendar Picker

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Month/year select | 13px | 600 | `#0f172a` |
| Day of week header | 11px | 600 | `#94a3b8` |
| Day number | 13px | 500 | `#334155` |
| Day number (other month) | 13px | 500 | `#cbd5e1` |
| Day number (selected) | 13px | 700 | `#fff` |

## Student Picker

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Filter dropdown | 12px | 600 | `#334155` |
| "Select All" label | 12px | 700 | `#059669` |
| Student count | 11px | 600 | `#94a3b8` |
| Student name | 12px | 600 | `#334155` |
| Tag (language/WIDA) | 9px | 700 | varies |