# Interaction Logic — Students v7

## 1. Student Selection

```
User clicks StudentCard
  → selectedStudent = name
  → Re-render list (update .active state)
  → Hide EmptyState
  → Show DetailScroll
  → Render: Header + KPI + Vocabulary + KPI History + Practice History + Translation Freq
```

**Auto-select:** On page load, first student is selected automatically.

## 2. Search & Filter

```
User types in SearchInput OR changes any Filter dropdown
  → filterStudents()
  → AND-combine: search(name) + group + level + grade
  → Update count: "Students (N)"
  → Re-render student list
  → If no matches: show "No students match filters."
  → Current selection stays (detail not cleared)
```

### Filter Options

| Filter | Default | Source |
|--------|---------|--------|
| Group | "All Groups" | Populated from `kpiTrackers[].name` |
| Level | "All Levels" | Static: WIDA 1-6 |
| Grade | "All Grades" | Static: 3rd-8th Grade |

## 3. Edit Student (Single)

```
User clicks Edit button (detail header)
  → Create overlay + modal DOM
  → Pre-fill: name, lang, grade, wida, kpiGroup
  → User edits fields
  → Click "Save"
    → Update student object in-place
    → Recompute initials from new name
    → Remove modal
    → Re-render list
    → Re-render detail for updated student
  → Click "Cancel" or overlay
    → Remove modal (no changes)
```

### Field Mapping

| Form Field | Student Property | Notes |
|-----------|-----------------|-------|
| Name | `student.name` | Also recomputes `student.initials` |
| Language | `student.lang` | "Mandarin", "Spanish", "Vietnamese" |
| Grade | part of `student.group` | Combined with WIDA for group |
| WIDA Level | `student.level` | Also updates avatar color class |
| KPI Group | `student.group` | Select from tracker names or "None" |

## 4. Manage Students (Bulk)

```
User clicks "Manage" button
  → Create overlay + modal with editable table
  → All 18 students shown with inline inputs/selects
  → Click "Save All"
    → Iterate all rows, update each student object
    → Recompute initials for any name changes
    → Remove modal
    → Re-render list
    → If student is selected, re-render detail
  → Click "Cancel" or overlay
    → Remove modal (no changes)
```

## 5. KPI Progress Computation

```javascript
function getStudentKpiVal(studentName, metric, cycleDays) {
  // metric = "times": count sessions within cycle window
  // metric = "mins": sessions.length × simulated minutes
  // metric = "words": count mastered vocabulary
}

// Bar color:
// value >= target       → .met (green)
// value >= target * 0.5 → .below (yellow)
// value <  target * 0.5 → .far (red)

// Bar width = min(value / (target * 1.5) * 100, 100)%
// Target line at: min(target / (target * 1.5) * 100, 100)%
```

## 6. KPI Cycle History Generation

```javascript
// Generates current cycle + up to 8 past cycles
// Current cycle: uses real computed value
// Past cycles: deterministic from hash(studentName + metric)
//   value = target × (0.4 + random_factor)
//   status: "In Progress" (current) / "Completed" (≥target) / "Not Completed" (<target)
```

## 7. Translation Frequency

```javascript
// Per session: transSec = baseSec[wida] + variance(±5)
// Base seconds by WIDA: { 1:22, 2:16, 3:11, 4:7, 5:4, 6:2 }
// Display: ≥60s → "X.X min", <60s → "Xs sec"
// Color: ≥20s → good(green), 10-19s → ok(amber), <10s → bad(red)
```

## 8. Vocabulary Stats

```javascript
// Total = vocabulary.length
// Learning = vocabulary.filter(v => v.state === 'learning').length
// Mastered = vocabulary.filter(v => v.state === 'mastered').length
// New This Week = deterministic from hash(studentName), range 1-4
// Mastery bar: mastered% green + learning% yellow
```

## 9. Page Load Animation

| Element | Animation | Duration | Delay |
|---------|-----------|----------|-------|
| List panel | `fadeSlideIn` (opacity 0→1, Y 8→0) | 0.35s ease | 0s |
| Detail panel | `fadeSlideIn` | 0.35s ease | 0.08s |

## 10. Deterministic Mock Data

All mock data is generated from a hash of the student's name, making it consistent across page reloads:

```javascript
function hashStr(s) {
  var h = 0;
  for (var i = 0; i < s.length; i++)
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
```

This hash drives: word selection, mastery scores, practice history dates/scores, vocabulary states, and "new this week" counts.