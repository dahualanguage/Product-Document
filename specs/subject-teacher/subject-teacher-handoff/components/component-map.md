# Component Map

## App Shell
| Component | Description |
|-----------|------------|
| `app-sidebar` | 88px navigation rail with logo + 2 items (Classes, History) |
| `sidebar-item` | Icon + label, 3 states: default / hover / active |
| `app-header` | 56px top bar: product title + version link + user avatar |

## Screen: Classes (Dashboard)
| Component | Description |
|-----------|------------|
| `dash-head` | Page title "My Classes" + summary row (6 classes / 22 ESL students) |
| `dash-summary` | Inline stats with icon + count, separated by vertical divider |
| `room-card` | Expandable class card, contains header + collapsible roster |
| `room-card-header` | Class name + student avatar stack + Start button + expand toggle |
| `room-avatars` | Stacked circular avatars (30px), color-coded by WIDA level, -8px overlap |
| `room-start` | Green filled button "Start" with play_arrow icon |
| `room-expand` | 32px square toggle button, chevron rotates 180deg on open |
| `room-roster` | Expandable student list, shown on `.open` state |
| `room-student` | Student row: avatar (30px, WIDA color) + name + grade + WIDA badge |

## Screen: Mic Test
| Component | Description |
|-----------|------------|
| `detail-back` | 36px back button (arrow_back), returns to Classes |
| `mic-test-card` | Centered card (600px max) with mic icon, waveform, selector, buttons |
| `mic-circle` | 80px circle with mic icon, teal border |
| `waveform-bars` | 5 animated bars (pulse animation), left and right of mic |
| `listening-bar` | Dark pill bar with 3 animated dots + "Listening..." text |
| `mic-selector` | Dropdown showing current microphone device |
| `btn-green` | Primary action: "Start Test" → "Start Class" (appears after 3s) |

## Screen: Live Class
| Component | Description |
|-----------|------------|
| `live-topbar` | Timer (left) + class name + mic status badge + End Class button (right) |
| `live-timer` | 28px bold green timer, counts up from 00:00 |
| `mic-status` | Green pill: dot + "Mic on" |
| `transcript-card` | White card, lines appear with fadeSlideIn animation every 4s |
| `live-listening-bar` | Dark bar with animated dots, hidden when paused |
| `pause-btn` | 56px circle FAB: red (playing) / green (paused) |
| `paused-overlay` | Full-screen dark overlay with pause icon + "Class Paused" + resume button |

## Screen: History
| Component | Description |
|-----------|------------|
| `history-filters` | Pill-shaped filter chips: All / 1st–6th Grade |
| `history-filter` | Chip button, 3 states: default / hover / active (dark fill) |
| `session-card` | Session row: name + date/time/duration + status badge |
| `session-badge` | Status indicator, 3 variants: Ended (gray) / In Progress (green) / Disconnected (red) |

## Dialogs (Shared System)
| Component | Description |
|-----------|------------|
| `modal-overlay` | Fixed overlay: dark bg + blur |
| `dialog` | White card (420px, 20px radius), contains title + content + actions |
| `dialog-actions` | Space-between layout with top divider, secondary (left) + primary (right) |
| `dialog-btn.secondary` | Text-only, #94a3b8, 14px 600 |
| `dialog-btn.primary` | Filled green (#10b981), white text, 10px radius |

### Dialog: Save Class
- Title: "Save Class"
- Content: hint text + input field (session name, auto-filled)
- Actions: Cancel / Save (no divider)

### Dialog: Session Found
- Title: "Session Found"
- Content: body text + hint text
- Actions: Start New Session / Resume Session (with divider)

### Dialog: Still Here
- Title: "Are you still in class?"
- Content: countdown timer (32px, #f59e0b) + hint text
- Actions: End Class / Yes, I'm here (with divider)
