# Live Translate — Design System

> Updated: 2026-05-29 · Synced with v2 demo

---

## 1. Color Tokens

### Primary (Green)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#059669` | Active nav, active badges, selected states |
| `primary-light` | `#10b981` | Gradient buttons, waveform bars, word dots |
| `primary-bg` | `#ecfdf5` | Active pill bg, filter chip active, quiz active |
| `primary-bg-deep` | `#d1fae5` | Nav active indicator, saved chip bg |
| `primary-bg-surface` | `#dcfce7` | Word highlight bg |
| `primary-subtle` | `#a7f3d0` | Incoming block border |
| `primary-muted` | `#6ee7b7` | Idle waveform bars |

### Accent (Cyan)

| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | `#00B8D9` | Tap-to-save word highlight text |

### Danger (Red)

| Token | Hex | Usage |
|-------|-----|-------|
| `danger` | `#ef4444` | Stop button, recording dot, timer badge text |
| `danger-bg` | `#fef2f2` | Timer badge bg |
| `danger-border` | `#fca5a5` | Timer badge border |

### Neutral

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#0f172a` | Headings, word names, definitions |
| `text-secondary` | `#475569` | Body text, POS badge text, table body |
| `text-muted` | `#64748b` | Descriptions, inactive buttons |
| `text-placeholder` | `#94a3b8` | Labels, placeholders, inactive icons |
| `text-disabled` | `#cbd5e1` | Disabled elements, chevrons |
| `border` | `#eef0ef` | Card borders, dividers |
| `border-light` | `#f1f5f9` | Inner dividers, section separators |
| `surface` | `#f5f7f5` | Screen backgrounds (detail, quiz) |
| `surface-card` | `#f7f8f7` | Phone frame bg, app bg |
| `surface-white` | `#fff` | Cards, top bar, bottom nav |
| `bg-dark` | `#1a1f2e` | Demo page body (phone frame mode) |

---

## 2. Typography

### Font Family

```
'Public Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

### Font Weight Scale

| Weight | Name | Usage |
|--------|------|-------|
| 600 | Semi-bold | Page titles, quiz hero title, practice hints (zh/word-big), preview count, sub-screen title |
| 500 | Medium | Most UI: buttons, labels, nav, card titles, word names, badges, inputs |
| 400 | Regular | Not used in current design |

> Note: Design intentionally uses only 500 and 600 for a lightweight, professional feel. No bold (700) or extra-bold (800) in the current system.

### Type Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Sub-screen title | 16px | 600 | `#0f172a` |
| Summary title | 18px | 600 | `#0f172a` |
| Quiz hero title | 18px | 600 | `#0f172a` |
| Session detail name | 15px | 600 | `#0f172a` |
| Word card — English | 17px | 600 | `#0f172a` |
| Definition `.wd-text` | 15px | 500 | `#0f172a` |
| Word card — translation | 14px | 500 | `#059669` |
| Word list — English | 14px | 500 | `#0f172a` |
| Transcript — English | 15px | 500 | `#0f172a` |
| Transcript — native | 14px | 500 | `#64748b` |
| Example `.wd-example` | 13px | 500 | `#0f172a` (italic) |
| Example highlight | — | 700 | `#059669` (bg: `#dcfce7`) |
| Translation line `.wd-tl-line` | 13px | 500 | `#94a3b8` |
| Button text | 15px | 500 | `#fff` |
| Filter chip | 12px | 500 | `#64748b` / active `#059669` |
| Section label | 11px | 500 | `#94a3b8` (uppercase) |
| POS badge | 11px | 500 | `#475569` |
| Nav label | 11px | 500 | `#94a3b8` / active `#059669` |
| Pronunciation | 11px | 500 | `#94a3b8` (italic) |
| Lang badge | 10px | 600 | `#059669` (bg: `#ecfdf5`) |
| Example label | 10px | 500 | `#94a3b8` (uppercase) |

### Practice Type Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Spelling — Chinese hint | 24px | 600 | `#0f172a` |
| Mirroring — English word | 28px | 600 | `#0f172a` |
| Preview count | 36px | 600 | `#059669` |
| Practice counter | 13px | 500 | `#94a3b8` |
| Practice counter strong | — | 600 | `#0f172a` |
| Type badge | 11px | 500 | varies |

---

## 3. Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Inner gaps, cal grid gap |
| `space-sm` | 8px | Small gaps, chip gaps |
| `space-md` | 12px | Card padding inline, list item gaps |
| `space-lg` | 16px | Card padding, section padding |
| `space-xl` | 20px | Screen side padding, section gaps |
| `space-2xl` | 24px | Header padding, large gaps |

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Lang code badge, small pills |
| `radius-md` | 8px | Calendar cells, images, quick buttons |
| `radius-lg` | 10px | Segmented control, quiz count buttons |
| `radius-xl` | 12px | Input fields, practice cards, buttons |
| `radius-2xl` | 14px | Word cards, primary buttons, transcript blocks |
| `radius-pill` | 20px | Filter chips, POS badges, saved chips |
| `radius-nav` | 15px | Nav active indicator pill |

---

## 5. Shadows

| Name | Value | Usage |
|------|-------|-------|
| `shadow-card` | `0 2px 12px rgba(0,0,0,.05)` | Word card hover |
| `shadow-btn` | `0 4px 18px rgba(5,150,105,.3)` | Primary buttons |
| `shadow-btn-hover` | `0 6px 24px rgba(5,150,105,.35)` | Primary button hover |
| `shadow-phone` | `0 50px 100px rgba(0,0,0,.35), 0 15px 40px rgba(0,0,0,.2)` | Phone frame (demo only) |
| `shadow-toast` | `0 4px 16px rgba(0,0,0,.15)` | Toast notification |
| `shadow-dropdown` | `0 8px 32px rgba(0,0,0,.14)` | Language dropdown |
| `shadow-seg` | `0 1px 3px rgba(0,0,0,.1)` | Segmented control active |

---

## 6. Components

### Bottom Nav (M3 Navigation Bar)

- Height: `76px`
- Background: `#fff`
- Border top: `1px solid #eef0ef`
- Active indicator pill: `60×30px`, `border-radius: 15px`, `bg: #d1fae5`
- Icon size: `22px`
- Label: `11px / 500`
- Hidden during: recording, practice

### Primary Button

- Full width, `border-radius: 14px`
- Background: `linear-gradient(135deg, #10b981, #059669)`
- Text: `15px / 500 / #fff`
- Shadow: `0 4px 18px rgba(5,150,105,.3)`
- Hover: `translateY(-1px)`, shadow increase
- Active: `scale(.98)`
- Disabled: `bg: #e2e8f0`, `color: #94a3b8`, no shadow

### Toggle Switch

- Size: `44×24px`
- Off: `bg: #e2e8f0`
- On: `bg: #10b981`
- Knob: `20×20px`, white, `border-radius: 50%`

### Filter Chip

- `border-radius: 20px`
- Default: `bg: #fff`, `border: 1px solid #eef0ef`, `color: #64748b`
- Active: `bg: #ecfdf5`, `border: 1px solid #059669`, `color: #059669`

### Segmented Control (View Toggle)

- Container: `bg: #eef0ef`, `border-radius: 10px`, `padding: 3px`
- Button: `34×28px`, `border-radius: 8px`
- Active: `bg: #fff`, `color: #0f172a`, `box-shadow: 0 1px 3px rgba(0,0,0,.1)`

### Word Card

- `border-radius: 14px`, `border: 1px solid #eef0ef`
- Hover: `box-shadow: 0 2px 12px rgba(0,0,0,.05)`
- Header: word + translation + pronunciation + play button
- POS section: badge + optional image (200×200, radius 8px) + definition + example

### Calendar Cell

- `aspect-ratio: 1 / 0.8`, `border-radius: 8px`
- Normal: `500 / #475569`
- Today: `500 / #0f172a`
- Selected: `bg: #ecfdf5`, `color: #059669`, `500`
- Has data: green dot `4px` below number

### Toast

- `bg: #1e293b`, `color: #fff`
- `13px / 500`, `border-radius: 20px`
- Auto-dismiss: 1.8s
- Shadow: `0 4px 16px rgba(0,0,0,.15)`

---

## 7. Icons

**Source**: Google Material Icons Round (CDN)

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
```

| Context | Icons used |
|---------|-----------|
| Nav | `mic`, `bookmarks`, `quiz`, `history` |
| Recording | `mic`, `pause`, `play_arrow`, `stop`, `fiber_manual_record` |
| Word save | `touch_app`, `bookmark`, `volume_up`, `close` |
| Quiz | `check`, `edit`, `record_voice_over`, `shuffle` |
| Navigation | `arrow_back`, `search`, `chevron_left`, `chevron_right`, `chevron_right` |
| Actions | `replay`, `check_circle`, `swap_vert`, `view_agenda`, `view_list` |
| Calendar | `chevron_left`, `chevron_right` |

---

## 8. Animations

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| Screen transition | 0.25s | ease | Fade in on screen change |
| Button hover | 0.2s | `cubic-bezier(.2,.9,.3,1)` | translateY + shadow |
| Waveform pulse | 1.2s | ease-in-out | Infinite, live recording bars |
| Toast | 0.3s | `cubic-bezier(.2,.9,.3,1)` | Slide up + fade in |
| Hint popup | 0.3s in + 0.4s out | ease | Pop in, auto-fade at 2.5s |
| Record pulse | 1.5s | ease-in-out | Infinite, red shadow pulse |
| Progress bar | 0.4s | `cubic-bezier(.4,0,.2,1)` | Width transition |
