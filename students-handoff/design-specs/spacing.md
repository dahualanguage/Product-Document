# Spacing & Layout — Students v7

## Page Layout

```
┌─────────┬──────────────────────────────────────┐
│         │  App Header (56px)                   │
│ Sidebar │──────────────────────────────────────│
│  (88px) │  Left Panel (38%)  │  Right Panel    │
│         │  ┌──────────────┐  │  ┌────────────┐ │
│         │  │ Header       │  │  │ Student    │ │
│         │  │ Search       │  │  │ Header     │ │
│         │  │ Filters      │  │  ├────────────┤ │
│         │  ├──────────────┤  │  │ KPI        │ │
│         │  │ Student List │  │  │ Vocabulary │ │
│         │  │ (scrollable) │  │  │ History    │ │
│         │  └──────────────┘  │  │ Trans Freq │ │
│         │                    │  │ (scroll)   │ │
│         │                    │  └────────────┘ │
└─────────┴──────────────────────────────────────┘
```

## Key Dimensions

| Property | Value |
|----------|-------|
| App frame | `display: flex; height: 100vh; overflow: hidden` |
| Sidebar width | `88px` |
| Header height | `56px` |
| Left panel | `width: 38%; flex-shrink: 0` |
| Right panel | `flex: 1` |
| Left panel bg | `#f1f5f9` |
| Right panel bg | `#f8faf9` |

## Spacing

| Region | Property | Value |
|--------|----------|-------|
| List header | padding | `28px 28px 0` |
| List scroll | padding | `0 28px 24px` |
| Detail header | padding | `20px 28px` |
| Detail scroll | padding | `20px 28px 40px` |
| Detail sections | margin-bottom | `28px` |
| Student card | padding | `12px 14px` |
| Student card | margin-bottom | `6px` |
| Student card | gap (flex) | `12px` |
| Filter gap | gap | `6px` |
| Search | margin-bottom | `12px` |
| Filters | margin-bottom | `14px` |

## Border Radius

| Element | Radius |
|---------|--------|
| Student card | `10px` |
| Search input | `8px` |
| Filter select | `6px` |
| Detail section card | `10px` |
| Table scroll wrap | `10px` |
| Stat card | `8px` |
| Manage button | `20px` (pill) |
| Edit modal | `14px` |
| Manage modal | `16px` |
| Modal input | `10px` |
| Modal button | `20px` (pill) |
| Avatar | `50%` (circle) |

## Shadows

| Element | Shadow |
|---------|--------|
| Card (vocab summary) | none (border only) |
| Edit modal | `0 12px 40px rgba(0,0,0,.15)` |
| Manage modal | `0 20px 60px rgba(0,0,0,.18)` |
| Search focus | `0 0 0 2px rgba(5,150,105,.15)` |

## Table Scroll

| Property | Value |
|----------|-------|
| Max height | `320px` |
| Scrollbar width | `4px` |
| Scrollbar thumb | `#cbd5e1`, radius `2px` |
| Scrollbar thumb hover | `#94a3b8` |
| Sticky header | `position: sticky; top: 0; z-index: 1` |