# Interaction Logic

## Navigation Flow

```
Classes ──→ Mic Test ──→ Live Class ──→ Save Modal ──→ History
   ↑            │                           │
   └────────────┘ (back btn)                └──→ Classes
```

## Screen: Classes

| Action | Behavior |
|--------|----------|
| Click "Start" on room card | Navigate to Mic Test, pass class name + student count |
| Click expand toggle | Toggle `.open` class on room card, show/hide roster, rotate chevron 180deg |
| Click sidebar "History" | Navigate to History screen |

## Screen: Mic Test

| Action | Behavior |
|--------|----------|
| Click back button | Return to Classes |
| Click "Start Test" | Hide "Start Test" button, show listening bar + start waveform animation, after 3s show "Start Class" button |
| Click "Start Class" | Navigate to Live Class, start timer + transcript |
| **Scenario: Session Found** | If previous disconnected session exists, show Session Found dialog on entry |
| Dialog: "Resume Session" | Close dialog, navigate directly to Live Class |
| Dialog: "Start New Session" | Close dialog, stay on Mic Test |

## Screen: Live Class

| Action | Behavior |
|--------|----------|
| Timer | Counts up every 1s (MM:SS format), pauses when class is paused |
| Transcript | New line appears every 4s with `fadeSlideIn` animation, auto-scrolls to bottom |
| Click pause button | Toggle pause state: stop timer + transcript, show paused overlay |
| Paused overlay | Full-screen dark overlay with "Class Paused" + resume button |
| Click resume (overlay) | Remove overlay, resume timer + transcript |
| Click "End Class" | Open Save Class dialog |
| **Scenario: Still Here** | If no voice input detected for extended period, show "Are you still in class?" dialog with countdown |
| Dialog: "Yes, I'm here" | Close dialog, continue class |
| Dialog: "End Class" | Close dialog, trigger End Class flow (save modal) |
| Countdown timer | Starts at 09:48, counts down 1s intervals. If reaches 0, auto-trigger End Class |

## Screen: Save Modal

| Action | Behavior |
|--------|----------|
| Auto-fill | Session name = "{Class Name} {MM/DD/YYYY} {H:MM AM/PM}" |
| Click "Save" | Close modal, stop live class, navigate to History |
| Click "Cancel" | Close modal, return to Live Class (class still running) |

## Screen: History

| Action | Behavior |
|--------|----------|
| Filter chips | Click to filter session list by grade (All / 1st–6th). Active chip gets dark fill. Only one active at a time |
| Session cards | Display only, no click action in current version |
| Click sidebar "Classes" | Navigate back to Classes |

## Sidebar Navigation

| Item | Target |
|------|--------|
| Classes (active by default) | Dashboard / Mic Test / Live Class screens |
| History | History screen |

Active state follows current screen context:
- Dashboard, Mic Test, Live Class → Classes active
- History → History active

## Hash URL Triggers (Demo Only)

| Hash | Behavior |
|------|----------|
| `#session-found` | Open Mic Test + show Session Found dialog after 500ms |
| `#still-here` | Open Live Class + show Still Here dialog after 1000ms |
| `#history` | Open History screen |
| `#mic-test` | Open Mic Test screen |
| `#live-class` | Open Live Class screen |
