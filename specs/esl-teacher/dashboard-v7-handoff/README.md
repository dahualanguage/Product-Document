# ESL Teacher Dashboard v7 -- Engineering Handoff

## What This Is

The ESL Teacher Dashboard v7 is the default landing page for ESL teachers. It provides a real-time overview of student KPI progress and language independence metrics through three main panels: KPI Tracker, Language Barrier, and Most Tapped Words.

## Interactive Demo

- **Dashboard Demo**: [../demo-dashboard-v7.html](../demo-dashboard-v7.html)

## Related Pages

- **Students v7**: [../demo-students-v7.html](../demo-students-v7.html)
- **Session Insights v7**: [../demo-session-insights-v7.html](../demo-session-insights-v7.html)
- **Single-page Handoff Reference**: [../dashboard-v7-handoff.html](../dashboard-v7-handoff.html)

## Folder Structure

```
dashboard-v7-handoff/
  README.md                        <- This file
  design-specs/
    colors.md                      <- All hex colors by category
    typography.md                  <- Font sizes, weights, colors by component
    spacing.md                     <- Layout, padding, gaps, radii, shadows
  components/
    component-map.md               <- Component hierarchy, HTML structure, props
  logic/
    interactions.md                <- Hover, expand, drag, modal, tooltip behaviors
    data-model.md                  <- Student/Tracker schemas, computations, API endpoints
```

## Key Design Decisions

- **Two-column grid layout**: KPI Tracker spans both rows on the left; Language Barrier (top-right) and Most Tapped Words (bottom-right) share the right column.
- **Linked hover**: Hovering a KPI tracker card highlights the corresponding Language Barrier card (and vice versa) via a yellow highlight effect.
- **Progress bar color thresholds**: Three tiers (green/amber/red) based on percentage of students meeting their target.
- **Language Barrier metric**: Measures seconds between translation taps -- higher interval = more language independence = better.
- **Recurring cycle system**: Trackers operate on repeating cycles (e.g., 7-day windows) with automatic daysLeft countdown.
- **Drag-to-reorder trackers**: Teachers can reorder their trackers via native HTML5 Drag and Drop in the Manage Trackers modal.
- **Font family**: DM Sans (Google Fonts) throughout the entire ESL Teacher module.
- **Icon system**: Google Material Icons Round via CDN.
- **All CSS is inline**: No external stylesheets; every style is embedded in the HTML file.