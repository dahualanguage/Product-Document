# Content Dependency & Deletion Behavior

> **Purpose**: Document how content entities in DAHUA AI are related to each other, and define the expected user experience when editing or deleting content that has downstream dependencies.
>
> **Status**: Discovery / Proposal
>
> **Last Updated**: 2026-02-28

---

## 1. Entity Relationship Map

```
PROJECT
├── QUESTION BANK (generated FROM project content)
│   ├── Questions (individual questions inside the bank)
│   └── PRACTICE — QA type (references questionsBankSk)
│       └── ASSIGNMENT (distributed to students)
│           └── ASSIGNMENT HISTORY (student submissions & scores)
│
└── PRACTICE — MIRRORING type (references projectConfigSk)
    └── ASSIGNMENT (distributed to students)
        └── ASSIGNMENT HISTORY (student submissions & scores)
```

**Key Relationships:**

| Parent | Child | Link | Type |
|--------|-------|------|------|
| Project | Question Bank | Question Bank is generated from Project content | Creation dependency |
| Project | Mirroring Practice | Practice references Project for content | Runtime dependency |
| Question Bank | QA Practice | Practice references Question Bank for questions | Runtime dependency |
| Practice | Assignment | Assignment is created from a Practice | Runtime dependency |
| Assignment | Assignment History | Student submissions belong to an Assignment | Data dependency |

---

## 2. Current Problems (As of Feb 2026)

### 2.1 Delete Without Warning

| Action | Has Confirmation? | What happens to children? |
|--------|------------------|--------------------------|
| Delete Project | **NO** — immediate deletion | Question Banks, Practices, Assignments all become orphaned or silently deleted |
| Delete Question Bank | **NO** — immediate deletion | QA Practices and their Assignments become orphaned or silently deleted |
| Delete Practice | **YES** — dialog asks "Are you sure?" | But does NOT warn about existing Assignments or student submissions |
| Delete Assignment | No delete UI exists | — |

### 2.2 Edit Without Sync

| Action | What happens to children? |
|--------|--------------------------|
| Edit Project content | Related Question Banks are NOT updated — they keep the old content |
| Edit Project content | Related Mirroring Practices are NOT updated — students practice outdated content |
| Edit Question Bank | Related QA Practices are NOT updated |

### 2.3 Impact

- **Teachers lose student data without knowing** — deleting a Project silently removes all student practice history downstream
- **Content goes out of sync** — editing a Project does not propagate changes, so students may practice outdated material
- **No visibility into what's connected** — teachers have no way to see which Practices or Assignments depend on a Project

---

## 3. Proposed User Flows

### 3.1 Deleting a Project

**When a teacher clicks "Delete" on a Project:**

1. System checks for downstream dependencies
2. Show a confirmation dialog that lists what's connected:

```
┌─────────────────────────────────────────────────┐
│  Delete Project: "Unit 5 — Family"              │
│─────────────────────────────────────────────────│
│                                                 │
│  ⚠️ This project has connected content:         │
│                                                 │
│  • 2 Question Banks                             │
│    - "Unit 5 MC Questions"                      │
│    - "Unit 5 QA Questions"                      │
│  • 1 Mirroring Practice                         │
│    - "Unit 5 Mirroring"                         │
│  • 3 Assignments (12 student submissions)       │
│                                                 │
│  What would you like to do?                     │
│                                                 │
│  ○ Delete everything                            │
│    (Project + all connected Question Banks,     │
│     Practices, Assignments, and student data)   │
│                                                 │
│  ○ Delete only this Project                     │
│    (Keep Question Banks and Practices, but      │
│     they will no longer link to this project)   │
│                                                 │
│  [Cancel]                    [Confirm Delete]   │
└─────────────────────────────────────────────────┘
```

**User feedback after deletion:**
- Success message listing what was deleted: "Deleted Project and 2 Question Banks, 1 Practice, 3 Assignments"
- If "Delete only this Project" was chosen: "Project deleted. 2 Question Banks and 1 Practice are now standalone."

---

### 3.2 Deleting a Question Bank

**When a teacher clicks "Delete" on a Question Bank:**

1. System checks for QA Practices using this bank
2. If dependencies exist, show confirmation:

```
┌─────────────────────────────────────────────────┐
│  Delete Question Bank: "Unit 5 MC Questions"    │
│─────────────────────────────────────────────────│
│                                                 │
│  ⚠️ This question bank is used by:             │
│                                                 │
│  • 1 QA Practice                                │
│    - "Unit 5 QA Practice"                       │
│  • 2 Assignments (8 student submissions)        │
│                                                 │
│  What would you like to do?                     │
│                                                 │
│  ○ Delete everything                            │
│    (Question Bank + connected Practices,        │
│     Assignments, and student data)              │
│                                                 │
│  ○ Delete only this Question Bank               │
│    (Practices will no longer have questions      │
│     and cannot be used for new assignments)     │
│                                                 │
│  [Cancel]                    [Confirm Delete]   │
└─────────────────────────────────────────────────┘
```

---

### 3.3 Deleting a Practice

**When a teacher clicks "Delete" on a Practice:**

1. System checks for Assignments and student submissions
2. Show confirmation with impact:

```
┌─────────────────────────────────────────────────┐
│  Delete Practice: "Unit 5 Mirroring"            │
│─────────────────────────────────────────────────│
│                                                 │
│  ⚠️ This practice has:                         │
│                                                 │
│  • 3 Assignments                                │
│  • 12 student submissions with scores           │
│                                                 │
│  Deleting this practice will also remove all    │
│  assignments and student submission history.    │
│                                                 │
│  This action cannot be undone.                  │
│                                                 │
│  [Cancel]                    [Delete Practice]  │
└─────────────────────────────────────────────────┘
```

---

### 3.4 Editing a Project (Content Change)

**When a teacher saves changes to a Project's content:**

1. System checks if any Question Banks or Practices reference this Project
2. If yes, show a sync prompt:

```
┌─────────────────────────────────────────────────┐
│  Project Updated Successfully ✓                 │
│─────────────────────────────────────────────────│
│                                                 │
│  This project is connected to:                  │
│                                                 │
│  • 2 Question Banks                             │
│    - "Unit 5 MC Questions" (15 questions)       │
│    - "Unit 5 QA Questions" (8 questions)        │
│  • 1 Mirroring Practice                         │
│    - "Unit 5 Mirroring" (2 assignments)         │
│                                                 │
│  Your content has changed. Would you like to    │
│  update the connected content?                  │
│                                                 │
│  ☐ Regenerate Question Banks                    │
│    (Old questions will be replaced with new     │
│     ones based on the updated content)          │
│                                                 │
│  ☐ Update Mirroring Practice content            │
│    (Students will practice the new version.     │
│     Existing submissions are kept as-is.)       │
│                                                 │
│  [Skip for Now]              [Update Selected]  │
└─────────────────────────────────────────────────┘
```

**Important notes:**
- "Skip for Now" means no sync — old content stays in Question Banks / Practices
- Regenerating Question Banks replaces all questions (teacher should be warned)
- Mirroring Practice content update should NOT affect past student submissions
- Teacher can always manually update later

---

### 3.5 Editing a Question Bank

**When a teacher edits questions in a Question Bank:**

- No sync prompt needed — QA Practices pull questions at runtime
- Changes take effect immediately for new practice sessions
- Past student submissions are not affected

---

## 4. Dependency Visibility

### 4.1 "Used By" Indicator

Every entity should show a small indicator of what depends on it:

**On Project card/row:**
- "Used by: 2 Question Banks, 1 Practice"

**On Question Bank card/row:**
- "Used by: 1 Practice, 2 Assignments"

**On Practice card/row:**
- "3 Assignments (12 submissions)"

This helps teachers understand the impact before they make changes.

### 4.2 Connection View (Future)

A visual map showing: Project → Question Banks → Practices → Assignments
(Low priority — the "Used By" indicator covers most use cases)

---

## 5. Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Teacher deletes a Project that has active (not yet due) Assignments | Warn: "X students have unfinished assignments. Deleting will remove their access." |
| Teacher edits Project but chooses "Skip for Now" on sync | Question Banks keep old content. Add a subtle "Out of sync" badge on affected items. |
| Student opens an Assignment whose Practice was deleted | Show message: "This practice is no longer available. Please contact your teacher." |
| Teacher tries to create a Practice from a deleted Question Bank | Should not be possible — deleted banks should not appear in the selection dropdown |
| Two teachers share the same Project; one deletes it | Both lose access. Consider: shared content should require consensus or admin approval to delete. |

---

## 6. Priority

| Item | Priority | Reason |
|------|----------|--------|
| Delete Project confirmation with dependency list | **P0** | Data loss risk — students lose all submission history |
| Delete Question Bank confirmation | **P0** | Same data loss risk |
| Delete Practice — add assignment/submission count to dialog | **P1** | Dialog exists but doesn't show impact |
| Edit Project sync prompt | **P1** | Content goes stale without teacher knowing |
| "Used By" indicator on cards | **P2** | Visibility improvement |
| "Out of sync" badge | **P2** | Helps teacher track stale content |
| Student-facing "Practice unavailable" message | **P1** | Better than a broken/empty page |

---

## 7. Roles Affected

| Role | Can Delete? | Needs Warning? |
|------|------------|----------------|
| ADMIN | All entities | Yes |
| TEACHER | Own Projects, Question Banks, Practices | Yes |
| SCHOOL_ADMIN | All school content | Yes |
| SCHOOL_TEACHER | Own Projects, Question Banks, Practices | Yes |
| SCHOOL_STUDENT | Nothing | N/A — but needs graceful handling when content is deleted |

---

## 8. Open Questions

1. **Soft delete vs hard delete?** — Should deleted content be recoverable for a period (e.g., 30-day trash)?
2. **Archive option?** — Instead of deleting, allow teachers to "archive" content (hidden but recoverable)?
3. **Shared content ownership** — If multiple teachers use the same Project, who can delete it?
4. **Student notification** — Should students be notified when an assignment they were working on gets deleted?
