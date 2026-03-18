/**
 * Shared Mermaid diagram definitions — Flow 6: Live Classroom
 * Single source of truth for both Flow Diagrams page and Spec page.
 *
 * Usage:
 *   <script src="../../shared/diagrams-flow6.js"></script>
 *   window.FLOW6.teacherFlow  → Mermaid string
 *   window.FLOW6.studentFlow  → Mermaid string
 */

window.FLOW6 = {

  /* ── 3.1 Project Teacher Flow ── */
  teacherFlow: `flowchart TD
    START([Subject Teacher]):::start --> SELECT["Select / Join the Class"]
    SELECT --> VOICE["Test voice<br/>Browser microphone permission"]
    VOICE --> MIC{Microphone granted?}:::decision
    MIC -->|No| MIC_FAIL["Browser blocked mic<br/>Must allow in settings"]:::warn
    MIC -->|Yes| TRANSCRIBE["Start of class transcription<br/>Audio → Speech-to-Text → Real-time push"]:::ai

    TRANSCRIBE --> SYNC["Sync Students terminal<br/>Students receive live transcript"]
    TRANSCRIBE --> END_CLASS["End of class transcription"]

    END_CLASS --> NAME["Naming Lesson<br/>(or Use default)"]
    NAME --> SAVE["Save Lesson"]

    SAVE --> NOTIFY["Send notice to ESL Teacher"]
    SAVE --> HISTORY["Add to Student<br/>Previous Lesson"]

    NOTIFY --> DONE([Session complete]):::endnode
    HISTORY --> DONE

    classDef start fill:#e0e7ff,stroke:#a5b4fc,color:#3730a3
    classDef decision fill:#fef9c3,stroke:#fde047,color:#854d0e
    classDef gate fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef warn fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef done fill:#f0fdf4,stroke:#86efac,color:#166534,stroke-width:2px
    classDef ai fill:#ecfdf5,stroke:#6ee7b7,color:#065f46,stroke-width:1.5px
    classDef info fill:#f0f9ff,stroke:#bae6fd,color:#0369a1
    classDef endnode fill:#fce7f3,stroke:#f9a8d4,color:#9d174d`,

  /* ── 4.1 Student Flow ── */
  studentFlow: `flowchart TD
    START([ESL Student]):::start --> JOIN["Join the Class<br/>via notification or link"]
    JOIN --> SUB["Subscribe to real-time channel<br/>Receive live transcript"]

    SUB --> READ["ClickableTranscript renders<br/>Scrolling text in real time"]
    READ --> TAP{Student taps a word?}:::decision
    TAP -->|Yes| LOOKUP["lookupWord query<br/>Translation · Definition · Examples"]:::ai
    LOOKUP --> EVENT["Difficulty event recorded<br/>word · timestamp · studentId"]
    LOOKUP --> POPUP["Word support popup<br/>displayed to student"]
    POPUP --> DISMISS["Dismiss popup"]
    DISMISS --> READ

    TAP -->|Session ends| ENDED["Teacher ends live session<br/>Transcript frozen (read-only)"]
    ENDED --> SUMMARY["View Session Summary<br/>Own difficulty words & stats"]
    SUMMARY --> REVIEW["Review in Previous Lessons"]:::info
    REVIEW --> DONE([Session complete]):::endnode

    EVENT --> PROFILE["Feeds into difficulty profile<br/>→ Data Dashboard"]:::info

    classDef start fill:#e0e7ff,stroke:#a5b4fc,color:#3730a3
    classDef decision fill:#fef9c3,stroke:#fde047,color:#854d0e
    classDef gate fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef warn fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef done fill:#f0fdf4,stroke:#86efac,color:#166534,stroke-width:2px
    classDef ai fill:#ecfdf5,stroke:#6ee7b7,color:#065f46,stroke-width:1.5px
    classDef info fill:#f0f9ff,stroke:#bae6fd,color:#0369a1
    classDef endnode fill:#fce7f3,stroke:#f9a8d4,color:#9d174d`,

  /* ── ESL Teacher Post-Session Flow ── */
  postSessionFlow: `flowchart TD
    START([Subject class ends]):::start

    subgraph SYS ["System — Post-Class Automation"]
        AutoSave["Auto-save all tapped words for students<br/>who closed browser without reviewing<br/>the Class End Summary"]
        AIJob[Trigger async AI analysis job]:::ai
        GenA["Generate Category A<br/>Transcript summary + keyword extraction"]:::ai
        GenB["Aggregate Category B<br/>Save rate per word across all students"]
        StoreInsight[Store SessionInsight record]
        NotifyESL["Notify ESL Teacher — new insights ready"]:::info
    end

    subgraph REVIEW ["ESL Teacher — Review Insights"]
        OpenInsights["Open Session Insights<br/>Select session from dashboard"]
        ReviewA["Category A<br/>What was taught · keywords"]:::info
        ReviewB["Category B<br/>Save rates · word bank growth"]:::info
        Actionable{"Any words to review?<br/>Create assignment?"}:::decision
        Skip(["Mark for later / skip"]):::endnode
    end

    subgraph CREATE ["ESL Teacher — Create Assignment"]
        Step1["Step 1 · Source<br/>Session pre-selected from insights view"]
        Step2["Step 2 · Type<br/>Review word list from high-save-rate words<br/>Edit: remove or add words"]
        TypeChoice{"Assignment<br/>type?"}:::decision
        Mirroring["Vocab Mirroring<br/>Word recognition and recall"]
        MCQ["Vocab Multiple Choice<br/>Definition and usage discrimination"]
        QaDraft["AI drafts comprehension questions<br/>from session content summary"]:::ai
        QaEdit["Teacher reviews and edits<br/>AI-drafted questions"]
        Step3["Step 3 · Target<br/>Assign to ESL Group or individual student"]
        Step4["Step 4 · Preview<br/>Review assignment as students will see it"]
        Publish(["Publish assignment"]):::done
    end

    subgraph STUDENT ["Student"]
        Receive["Receive assignment notification"]
        Practice(["Complete assignment<br/>in practice queue"]):::endnode
    end

    START --> AutoSave
    AutoSave --> AIJob
    AIJob --> GenA & GenB
    GenA & GenB --> StoreInsight
    StoreInsight --> NotifyESL

    NotifyESL --> OpenInsights
    OpenInsights --> ReviewA & ReviewB
    ReviewA & ReviewB --> Actionable
    Actionable -->|No| Skip
    Actionable -->|Yes| Step1

    Step1 --> Step2
    Step2 --> TypeChoice
    TypeChoice -->|Mirroring| Mirroring
    TypeChoice -->|Multiple Choice| MCQ
    TypeChoice -->|Subject QA| QaDraft
    QaDraft --> QaEdit
    Mirroring & MCQ & QaEdit --> Step3
    Step3 --> Step4
    Step4 --> Publish

    Publish --> Receive
    Receive --> Practice

    classDef start fill:#e0e7ff,stroke:#a5b4fc,color:#3730a3
    classDef decision fill:#fef9c3,stroke:#fde047,color:#854d0e
    classDef gate fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef warn fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef done fill:#f0fdf4,stroke:#86efac,color:#166534,stroke-width:2px
    classDef ai fill:#ecfdf5,stroke:#6ee7b7,color:#065f46,stroke-width:1.5px
    classDef info fill:#f0f9ff,stroke:#bae6fd,color:#0369a1
    classDef endnode fill:#fce7f3,stroke:#f9a8d4,color:#9d174d`,

  /* ── ESL Teacher — Create ESL Group ── */
  createGroupFlow: `flowchart TD
    START([ESL Teacher]):::start

    subgraph DASH ["My Students Dashboard"]
        ViewList["View current student list<br/>All students assigned to this ESL Teacher"]
        NewBtn["Click + New Group"]
    end

    subgraph CREATE ["Create Group"]
        InputName["Enter group name<br/>e.g. Group A — Beginner"]
        ApplyFilter["Filter student pool"]
        FilterNote["Filters available:<br/>English Level · Subject · Grade · Native Language"]:::info
        SelectStudents["Manually select students<br/>from filtered list"]
        CheckMin{≥ 2 students<br/>selected?}:::decision
        TooFew["Show validation error:<br/>Minimum 2 students required"]:::warn
        CheckConflict{"Any selected student<br/>already in another group?"}:::decision
        TransferWarn["Alert: Student will be<br/>moved from existing group<br/>Teacher confirms transfer"]:::info
        Preview["Preview group<br/>Name · member list · student count"]
        Save(["Create Group"]):::done
    end

    START --> ViewList
    ViewList --> NewBtn
    NewBtn --> InputName
    InputName --> ApplyFilter
    ApplyFilter ~~~ FilterNote
    ApplyFilter --> SelectStudents
    SelectStudents --> CheckMin
    CheckMin -->|No| TooFew
    TooFew --> SelectStudents
    CheckMin -->|Yes| CheckConflict
    CheckConflict -->|No conflict| Preview
    CheckConflict -->|Has conflict| TransferWarn
    TransferWarn --> Preview
    Preview --> Save

    Save --> Updated([Group created<br/>Students assigned to new group]):::endnode

    classDef start fill:#e0e7ff,stroke:#a5b4fc,color:#3730a3
    classDef decision fill:#fef9c3,stroke:#fde047,color:#854d0e
    classDef gate fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef warn fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef done fill:#f0fdf4,stroke:#86efac,color:#166534,stroke-width:2px
    classDef ai fill:#ecfdf5,stroke:#6ee7b7,color:#065f46,stroke-width:1.5px
    classDef info fill:#f0f9ff,stroke:#bae6fd,color:#0369a1
    classDef endnode fill:#fce7f3,stroke:#f9a8d4,color:#9d174d`,

};
