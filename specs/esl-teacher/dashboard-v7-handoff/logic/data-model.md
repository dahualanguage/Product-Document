# Data Model -- Dashboard v7

## Student Object

```json
{
  "name":  "Emily Chen",
  "lang":  "zh",              // "zh" | "es"
  "wida":  1,                 // WIDA proficiency level 1-6
  "grade": 3,                 // school grade 3-8
  "times": { "7": 2, "14": 5, "30": 10 },    // practice count by period (days)
  "mins":  { "7": 10, "14": 22, "30": 45 },   // practice duration in minutes
  "words": { "7": 3, "14": 6, "30": 12 },     // mastered word count
  "taps":  { "7": 24, "14": 45, "30": 88 },   // translation tap count
  "hover": { "7": 90, "14": 170, "30": 330 }  // hover-to-translate count
}
```

### Notes

- Metric values are stored per time window: 7, 14, 30 days.
- For arbitrary cycle lengths (e.g., a 10-day cycle), the demo linearly interpolates between known data points.
- `lang` determines which language tag to show in the student picker.
- `wida` and `grade` are used for filtering in the student picker.

---

## Tracker Object

```json
{
  "id":       1,
  "name":     "3rd Grade - WIDA 1",
  "metric":   "times",          // "times" | "mins" | "words"
  "target":   6,                // numeric goal per cycle
  "cycle":    "7",              // cycle length in days (string key)
  "start":    "2026-04-10",     // cycle start date (YYYY-MM-DD)
  "end":      "2026-06-30",     // optional end date (YYYY-MM-DD)
  "students": ["Emily Chen", "Carlos Garcia", "Lucia Torres"]
}
```

### Notes

- `cycle` is stored as a string to match the keys in student metric objects.
- `students` array contains student names (demo); in production, use student IDs.
- `metric` determines which student field to read: `"times"` -> `student.times`, etc.

---

## Metric Definitions

| Key | Label | Unit | Description |
|-----|-------|------|-------------|
| `times` | Number of Practices | times | Count of completed practice sessions |
| `mins` | Practice Duration | mins | Total minutes spent practicing |
| `words` | Mastered Word Count | words | Number of vocabulary words mastered |

---

## Computed Values

### Days Left (Recurring Cycle)

```javascript
function getKpiDaysLeft(tracker) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // midnight
  const start = parseDate(tracker.start);
  const cycleDays = parseInt(tracker.cycle);
  const elapsed = daysBetween(start, today);
  const cyclesPassed = Math.floor(elapsed / cycleDays);
  const nextEnd = addDays(start, (cyclesPassed + 1) * cycleDays);
  return daysBetween(today, nextEnd);
}
```

If `start` is in the future, `daysLeft = daysBetween(today, start) + cycleDays`.

### Student Value for Cycle

```javascript
function getStudentVal(student, metric, cycleDays) {
  const data = student[metric];  // e.g. student.times
  const days = parseInt(cycleDays);

  // Direct lookup if exact key exists
  if (data[String(days)] !== undefined) {
    return data[String(days)];
  }

  // Linear interpolation between known data points
  const keys = Object.keys(data).map(Number).sort((a, b) => a - b);
  // ... interpolate between surrounding keys
}
```

### Summary Progress

```javascript
function computeSummaryProgress(tracker, students) {
  const cycleDays = tracker.cycle;
  const target = tracker.target;
  const metric = tracker.metric;

  let metCount = 0;
  tracker.students.forEach(name => {
    const student = findStudent(name);
    const value = getStudentVal(student, metric, cycleDays);
    if (value >= target) metCount++;
  });

  const total = tracker.students.length;
  const percentMet = total > 0 ? Math.round((metCount / total) * 100) : 0;

  return { metCount, total, percentMet };
}
```

### Language Barrier Interval

```javascript
function computeBarrierValue(studentNames, days) {
  const intervals = studentNames.map(name => {
    const student = findStudent(name);
    const taps = getStudentVal(student, "taps", days);
    const mins = getStudentVal(student, "mins", days);
    if (taps === 0) return Infinity;
    return (mins * 60) / taps;  // seconds per tap
  });

  const finite = intervals.filter(v => isFinite(v));
  const avg = finite.reduce((a, b) => a + b, 0) / finite.length;

  // Previous period (demo uses simulation)
  const prev = avg * 0.85;  // NOTE: production should use actual prior window

  return { val: avg, prev: prev };
}
```

### Trend Calculation

```javascript
function computeTrend(current, previous) {
  if (previous === 0) return { text: "Stable", class: "stable", pct: 0 };

  const diff = ((current - previous) / previous) * 100;

  if (diff > 5)  return { text: `Improving +${Math.round(diff)}%`, class: "improving", pct: diff };
  if (diff < -5) return { text: `Declining ${Math.round(diff)}%`, class: "worsening", pct: diff };
  return { text: "Stable", class: "stable", pct: diff };
}
```

### Barrier Display Format

```javascript
function formatBarrierValue(seconds) {
  if (seconds >= 60) {
    return { value: (seconds / 60).toFixed(1), unit: "min" };
  }
  return { value: Math.round(seconds), unit: "sec" };
}
```

### Barrier Color Class

```javascript
function getBarrierColorClass(seconds) {
  if (seconds >= 120) return "good";   // green
  if (seconds >= 45)  return "ok";     // amber
  return "bad";                         // red
}
```

---

## Most Tapped Words Data

```json
{
  "words": [
    {
      "rank": 1,
      "word": "photosynthesis",
      "subjects": [
        { "name": "Science", "count": 4, "class": "sci" }
      ],
      "tapCount": 47
    }
  ]
}
```

### Filtering Logic

When a specific tracker is selected in the filter:
```javascript
const scaledTaps = Math.round(baseTaps * (trackerStudentCount / totalStudentCount));
```

When "All Students" is selected, use raw tap counts.

---

## Suggested API Endpoints

### Tracker CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/teachers/{teacherId}/trackers` | List all trackers, ordered by display position |
| `POST` | `/api/teachers/{teacherId}/trackers` | Create tracker. Body: `{ name, metric, target, cycle, start, end, studentIds[] }` |
| `PUT` | `/api/trackers/{trackerId}` | Update tracker fields |
| `DELETE` | `/api/trackers/{trackerId}` | Remove a tracker |
| `PUT` | `/api/teachers/{teacherId}/trackers/reorder` | Body: `{ orderedIds: [1, 3, 2, 4] }` |

### Tracker Progress

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/trackers/{trackerId}/progress` | Per-student progress for current cycle |
| `GET` | `/api/trackers/{trackerId}/progress/summary` | Lightweight: `{ metCount, totalCount, percentMet, daysLeft, isUrgent }` |

**Progress response:**
```json
{
  "cycleDaysLeft": 3,
  "students": [
    { "name": "Emily Chen", "value": 9, "target": 6, "met": true }
  ]
}
```

### Language Barrier

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/trackers/{trackerId}/barrier?window={days}` | Translation frequency stats |

**Response:**
```json
{
  "avgIntervalSec": 72.5,
  "prevIntervalSec": 61.2,
  "trendPct": 18.4,
  "trendDirection": "improving",
  "students": [
    { "name": "Emily Chen", "intervalSec": 84.0 }
  ]
}
```

> **Note**: The "previous period" comparison should use the actual prior window (e.g., previous 7 days), not the simulated `* 0.85` from the demo.

### Most Tapped Words

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/teachers/{teacherId}/tapped-words?window={days}&limit={n}&trackerId={id}` | Ranked word list |

**Response:**
```json
{
  "words": [
    { "rank": 1, "word": "photosynthesis", "subjects": [{ "name": "Science", "count": 4 }], "tapCount": 47 }
  ]
}
```

### Student Roster

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/teachers/{teacherId}/students?grade={g}&wida={w}` | Filterable student list for picker |

**Response:**
```json
{
  "students": [
    { "id": "s1", "name": "Emily Chen", "lang": "zh", "wida": 1, "grade": 3 }
  ]
}
```

### Dashboard Batch (Initial Load)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/teachers/{teacherId}/dashboard?barrierWindow={days}` | All dashboard data in one call |

Returns trackers with progress, barrier stats, and top tapped words. Use individual endpoints for filter changes and real-time updates.