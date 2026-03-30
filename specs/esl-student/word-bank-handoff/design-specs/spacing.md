# Spacing & Layout

## App Frame

| Property | Value |
|----------|-------|
| Layout | `display: flex` |
| Size | `100vw × 100vh` |
| Background | `#fff` |

## Sidebar

| Property | Value |
|----------|-------|
| Width | `88px` fixed |
| Background | `#fff` |
| Border right | `1px solid #e2e8f0` |
| Padding | `20px 0` |
| Gap between items | `6px` |
| Nav item size | `64px` wide |
| Nav item padding | `10px 0` |
| Nav item radius | `10px` |
| Logo | `44×44px` container, `margin-bottom: 16px` |

## Header

| Property | Value |
|----------|-------|
| Height | `56px` fixed |
| Border bottom | `1px solid #C4CDD5` |
| Padding | `0 28px` |

## Content Area

| Property | Value |
|----------|-------|
| Padding | `4px 120px 4px 4px` |
| Overflow | `overflow-y: auto` |

## Upper Section (Practice Area)

| Property | Value |
|----------|-------|
| Padding | `20px 36px 20px` |
| Gap | `20px` between rows |

### Row 1: Banner + Practice Buttons

| Property | Value |
|----------|-------|
| Layout | `display: grid` |
| Columns | `552px 1fr` |
| Gap | `20px` |

### Row 2: Set Cards

| Property | Value |
|----------|-------|
| Layout | `display: grid` |
| Columns | `552px 1fr 1fr 1fr` |
| Gap | `20px` |

## Notice Banner

| Property | Value |
|----------|-------|
| Padding | `25px` |
| Border radius | `14px` |
| Shadow | `0 2px 8px rgba(0,0,0,0.07)` |

## Practice Button

| Property | Value |
|----------|-------|
| Height | `135px` |
| Border radius | `12px` |
| Border | `1px solid #E2E8F0` |
| Shadow | `0 2px 8px rgba(0,0,0,0.07)` |
| Icon area | `100% × 90px` |

## Set Card

| Property | Value |
|----------|-------|
| Border radius | `14px` |
| Border | `1px solid #e2e8f0` |
| Shadow | `0 2px 8px rgba(0,0,0,0.07)` |
| Hover shadow | `0 6px 20px rgba(0,0,0,0.12)` |
| Hover transform | `translateY(-2px)` |

## Filter Area

| Property | Value |
|----------|-------|
| Tab padding | `6px 14px` |
| Tab radius | `20px` |
| Tab gap | `6px` |
| Sub-pill padding | `4px 12px` |
| Sub-pill radius | `14px` |

## Lower Section (Word Detail + Word List)

| Property | Value |
|----------|-------|
| Layout | `display: grid` |
| Columns | `552px 1fr` |
| Gap | `20px` |
| Padding | `20px 36px 60px` |
| Align | `stretch` (equal height) |

## Word Detail Card

| Property | Value |
|----------|-------|
| Border radius | `10px` |
| Border | `1px solid #e2e8f0` |
| Shadow | `0 2px 8px rgba(0,0,0,0.07)` |
| Header padding | `28px 24px 12px` |
| Body padding | `0 24px 20px` |
| Overflow | `overflow-y: auto` (scrollable to match list height) |

## Word Image (for simple words)

| Property | Value |
|----------|-------|
| Size | `200 × 200px` (1:1) |
| Border radius | `12px` |
| Object fit | `cover` |
| Shadow | `0 2px 8px rgba(0,0,0,0.08)` |
| Margin | `8px 0` |

## Word List

| Property | Value |
|----------|-------|
| Same card style as detail card |
| Item padding | `9px 10px` |
| Item border bottom | `1px solid #f1f5f9` |
| Selected bg | `#ecfdf5`, radius `6px` |
| Hover bg | `#f8fafc` |
| Pagination per page | `8 items` |
| Page button | `28 × 28px`, radius `6px` |
