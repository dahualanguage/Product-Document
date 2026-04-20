# Spacing & Layout -- Dashboard v7

## App Frame

| Property | Value |
|----------|-------|
| Sidebar width | `88px` |
| Sidebar padding | `20px 0` |
| Sidebar item gap | `6px` |
| Sidebar item padding | `10px 0` |
| Sidebar item width | `64px` |
| Sidebar item border-radius | `10px` |
| Sidebar logo size | `44px x 44px` |
| Sidebar logo margin-bottom | `16px` |
| App header height | `56px` |
| App header padding | `0 28px` |
| Content area padding | `28px 36px 60px` |

## Dashboard Grid

| Property | Value |
|----------|-------|
| Grid columns | `1fr 1fr` |
| Grid gap | `20px` |
| KPI Tracker grid-row | `1 / 3` (spans both rows on left) |

## Card Styles

### Outer Cards (dash-card, kpi-tracker)

| Property | Value |
|----------|-------|
| Background | `#f1f5f9` |
| Border | `1px solid #e2e8f0` |
| Border radius | `14px` |
| Box shadow | `0 2px 8px rgba(0,0,0,.07)` |
| Header padding | `14px 20px` |
| Body padding | `16px 20px` |

### Inner Cards (kpi-rule, barrier-card, group-card)

| Property | Value |
|----------|-------|
| Background | `#fff` |
| Border | `1px solid #e2e8f0` |
| Border radius | `10px` |

### KPI Rule Card

| Property | Value |
|----------|-------|
| Header padding | `12px 14px` |
| Students inner padding | `42px 14px 12px` |
| Student row gap | `6px` |
| Gap between rules | `10px` |
| KPI tracker body padding | `12px 16px` |

### Barrier Card

| Property | Value |
|----------|-------|
| Summary padding | `14px 16px` |
| Students inner padding | `0 16px 12px` |
| Student row gap | `4px` |
| Grid columns | `repeat(3, 1fr)` |
| Grid gap | `10px` |

## Progress Bars

### Summary Progress Bar (KPI Header)

| Property | Value |
|----------|-------|
| Height | `6px` |
| Min width container | `100px` |
| Track background | `#e2e8f0` |
| Border radius | `3px` |

### Individual Student Bar (KPI Expanded)

| Property | Value |
|----------|-------|
| Height | `12px` |
| Track background | `#f1f5f9` |
| Border radius | `4px` |
| Student name width | `80px` |
| Value label width | `52px` |

### Target Dashed Line

| Property | Value |
|----------|-------|
| Width | `2px` |
| Top offset | `-4px` |
| Bottom offset | `-5px` |
| Pattern | `repeating-linear-gradient` -- 4px dash, 4px gap |
| Color | `#94a3b8` |

### Goal Bubble

| Property | Value |
|----------|-------|
| Position | Above dashed line, `-26px` top offset |
| Background | `#34d399` |
| Padding | `2px 6px` |
| Border radius | `8px` |

## Modal

| Property | Value |
|----------|-------|
| Overlay background | `rgba(0,0,0,.4)` |
| Overlay z-index | `100` |
| Modal width | `540px` |
| Modal padding | `28px` |
| Modal border-radius | `14px` |
| Modal shadow | `0 20px 60px rgba(0,0,0,.2)` |
| Field margin-bottom | `16px` |
| Label margin-bottom | `6px` |
| Actions margin-top | `24px` |
| Actions gap | `10px` |

## Buttons

| Button | Height | Border Radius | Padding |
|--------|--------|---------------|---------|
| Manage Trackers | `40px` | `20px` | `10px 24px` |
| New Tracker | `40px` | `20px` | `10px 24px` |
| Modal Cancel | `40px` | `20px` | -- (flex: 1) |
| Modal Save | `40px` | `20px` | -- (flex: 1) |
| Card action | auto | `6px` | `3px 10px` |
| Tracker list edit/delete | `28px x 28px` | `6px` | -- |

## Input Fields

| Property | Value |
|----------|-------|
| Padding | `8px 12px` |
| Border | `1px solid #e2e8f0` |
| Border radius | `8px` |
| Focus border | `#059669` |
| Focus ring | `0 0 0 2px rgba(5,150,105,.15)` |

## Calendar Picker

| Property | Value |
|----------|-------|
| Width | `280px` |
| Padding | `14px` |
| Border radius | `12px` |
| Shadow | `0 8px 30px rgba(0,0,0,.12)` |
| Day cell size | `32px x 32px` |
| Day cell border-radius | `8px` |
| Grid gap | `2px` |
| z-index | `130` |

## Student Picker (Target Picker)

| Property | Value |
|----------|-------|
| Container border-radius | `8px` |
| Container background | `#f8fafc` |
| Filter row padding | `10px 12px` |
| Select All row padding | `8px 12px` |
| Student list padding | `6px 12px` |
| Student list max-height | `180px` |
| Checkbox size | `16px x 16px` |
| Checkbox border-radius | `4px` |

## Tags / Pills

| Component | Padding | Border Radius |
|-----------|---------|---------------|
| Metric tag (KPI) | `3px 10px` | `6px` |
| Countdown tag | `3px 10px` | `6px` |
| Page badge | `4px 12px` | `20px` |
| Tracker list tag | `1px 6px` | `4px` |
| Subject tag | `2px 7px` | `4px` |
| Barrier meta tag | `1px 6px` | `3px` |
| Language/WIDA tag | `1px 6px` | `3px` |

## Tooltips

| Property | Value |
|----------|-------|
| Background | `#1e293b` |
| Padding | `4px 10px` |
| Border radius | `6px` |
| Arrow | `4px` borders, CSS triangle |
| z-index | `10` |

## Most Tapped Words Table

| Property | Value |
|----------|-------|
| Header padding | `8px 12px` |
| Cell padding | `10px 12px` |
| Rank column width | `28px` |
| Table body | Fixed max-height with `overflow-y: auto` |

## Animations

| Animation | Duration | Easing | Delay |
|-----------|----------|--------|-------|
| `fadeSlideIn` (page load) | `0.4s` | ease | `0.15s` |
| `barGrow` (progress bars) | `0.6s` | ease | -- |
| Expand/collapse | `0.3s` | ease | -- |
| Arrow rotation | `0.2s` | ease | -- |
| Hover transitions | `0.15s` | ease | -- |