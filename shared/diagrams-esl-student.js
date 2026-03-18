/**
 * Shared Mermaid diagram definitions — ESL Student
 * Single source of truth for both Flow Diagrams page and Spec page.
 *
 * Usage:
 *   <script src="../../shared/diagrams-esl-student.js"></script>
 *   window.ESL_STUDENT.studentPracticeFlow  → Mermaid string
 */

window.ESL_STUDENT = {

  /* ── A. Word Bank — Student Practice Flow ── */
  studentPracticeFlow: `flowchart TD
    START([Word Bank Homepage]):::start

    START --> EntryA["🏠 Practice Shortcut Button<br/>e.g. click <b>Spelling</b> on homepage"]
    START --> EntryB["📂 Practice from Category Page<br/>e.g. click <b>Practice Science</b>"]

    EntryA --> POPUP["Practice Setup Popup Opens"]
    EntryB --> POPUP

    POPUP --> PRE{"Practice Type<br/>pre-selected?"}:::decision

    PRE -->|"Yes · Entry A · skip Step 1"| STEP2
    PRE -->|"No · Entry B"| STEP1

    STEP1["<b>Step 1 · Choose Practice Type</b><br/>Spelling / Vocabs Mirroring / Multiple Choice"]
    STEP1 --> STEP2

    STEP2["<b>Step 2 · Choose Word Category</b><br/>Newest / All Random / Untested / Most Errors"]
    STEP2 --> STEP3

    STEP3["<b>Step 3 · Choose Question Count</b><br/>10 / 20 / 30"]
    STEP3 --> GO

    GO(["▶ Next"]):::done
    GO --> PREVIEW["📋 Quick Vocab Preview<br/>word list · translation · definition<br/>mental warm-up before quiz"]:::info
    PREVIEW --> SESSION["Practice Session<br/>Uses existing practice UI<br/>card stack · recording · grading"]:::info

    SESSION --> RESULT{"Correct?"}:::decision
    RESULT -->|Yes| SUCCESS["+1 successful attempt<br/>check mastery threshold"]:::done
    RESULT -->|No| REVEAL["Reveal correct answer<br/>does not count as attempt"]:::warn

    SUCCESS --> CHECK{"5 attempts +<br/>all 3 types?"}:::decision
    CHECK -->|Yes| MASTER["Word → <b>Mastered</b>"]:::done
    CHECK -->|No| REMAIN["Word stays in <b>Learning</b>"]

    REVEAL --> MORE
    MASTER --> MORE
    REMAIN --> MORE

    MORE{"More words<br/>in session?"}:::decision
    MORE -->|Yes| SESSION
    MORE -->|No| SUMMARY

    SUMMARY["Session Summary<br/>words practiced · accuracy rate · new mastery count"]:::info
    SUMMARY --> DONE([Session complete]):::endnode

    classDef start fill:#e0e7ff,stroke:#a5b4fc,color:#3730a3
    classDef decision fill:#fef9c3,stroke:#fde047,color:#854d0e
    classDef gate fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef warn fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef done fill:#f0fdf4,stroke:#86efac,color:#166534,stroke-width:2px
    classDef ai fill:#ecfdf5,stroke:#6ee7b7,color:#065f46,stroke-width:1.5px
    classDef info fill:#f0f9ff,stroke:#bae6fd,color:#0369a1
    classDef endnode fill:#fce7f3,stroke:#f9a8d4,color:#9d174d`,

  /* ── B. Spelling Practice — 3-Strike Rules + 60s Timer ── */
  spellingPracticeFlow: `flowchart TD
    SETUP([Setup Complete]):::start
    SETUP --> PREVIEW["📋 Quick Vocab Preview<br/>Review selected words<br/>word · translation · definition"]:::info
    PREVIEW --> START(["▶ Start Practice"]):::done
    START --> LOAD["Load Next Word<br/>reset attempts = 0"]

    LOAD --> SHOW["Show Question<br/>context sentence + blank<br/>⏱ Start 60s countdown"]
    SHOW --> INPUT["User Types Answer"]

    SHOW -.->|"60s elapsed"| TIMEOUT["⏱ Time's Up<br/>❌ +1 Wrong<br/>Reveal correct answer"]:::warn
    TIMEOUT --> NEXT

    INPUT --> CHECK{"Check<br/>Answer"}:::decision

    CHECK -->|Correct| ATT{"attempts<br/>= 0 ?"}:::decision
    ATT -->|"Yes · 1st try"| CORRECT["✅ +1 Correct"]:::done
    ATT -->|"No · needed hints"| WRONG_HINT["❌ +1 Wrong<br/>(needed hints)"]:::warn

    CHECK -->|Wrong| COUNT{"attempts<br/>count?"}:::decision

    COUNT -->|"1st wrong"| HINT1["Show Hint 1<br/>🔤 Chinese Translation<br/>📖 English Definition"]:::info
    HINT1 --> RETRY1["attempts = 1<br/>Clear input · Retry"]
    RETRY1 --> INPUT

    COUNT -->|"2nd wrong"| HINT2["Show Hint 2<br/>💡 First Letter<br/>e.g. Starts with <b>H</b>"]:::info
    HINT2 --> RETRY2["attempts = 2<br/>Clear input · Retry"]
    RETRY2 --> INPUT

    COUNT -->|"3rd wrong"| FAIL["❌ +1 Wrong<br/>Show correct answer<br/>in input field"]:::warn
    FAIL --> NEXT

    CORRECT --> NEXT
    WRONG_HINT --> NEXT

    NEXT{"More words<br/>in session?"}:::decision
    NEXT -->|Yes| LOAD
    NEXT -->|No| SUMMARY

    SUMMARY["Session Summary<br/>Correct / Wrong / Accuracy %"]:::info
    SUMMARY --> DONE([Practice Complete]):::endnode

    classDef start fill:#e0e7ff,stroke:#a5b4fc,color:#3730a3
    classDef decision fill:#fef9c3,stroke:#fde047,color:#854d0e
    classDef gate fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef warn fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef done fill:#f0fdf4,stroke:#86efac,color:#166534,stroke-width:2px
    classDef ai fill:#ecfdf5,stroke:#6ee7b7,color:#065f46,stroke-width:1.5px
    classDef info fill:#f0f9ff,stroke:#bae6fd,color:#0369a1
    classDef endnode fill:#fce7f3,stroke:#f9a8d4,color:#9d174d`,

  /* ── C. Multiple Choice — Progressive Hints + 20s Timer ── */
  mcPracticeFlow: `flowchart TD
    SETUP([Setup Complete]):::start
    SETUP --> PREVIEW["📋 Quick Vocab Preview<br/>Review selected words"]:::info
    PREVIEW --> START(["▶ Start Practice"]):::done
    START --> LOAD["Load Next Word<br/>reset attempts = 0<br/>generate 4 options (1 correct + 3 distractors)"]

    LOAD --> SHOW["Show Question<br/>context sentence + blank<br/>4 option buttons<br/>⏱ Start 20s countdown"]

    SHOW -.->|"20s elapsed"| TIMEOUT["⏱ Time's Up<br/>❌ +1 Wrong<br/>Reveal correct answer<br/>Show all Chinese translations"]:::warn
    TIMEOUT --> NEXT

    SHOW --> SELECT["Student Selects an Option"]

    SELECT --> CHECK{"Correct?"}:::decision

    CHECK -->|"Yes · 1st try"| CORRECT["✅ +1 Correct<br/>Selected → green<br/>Show all Chinese translations"]:::done

    CHECK -->|Wrong| COUNT{"attempts<br/>count?"}:::decision

    COUNT -->|"1st wrong"| HINT1["Selected → red<br/>Show Hint: <b>Definition</b><br/>Disable wrong option"]:::info
    HINT1 --> RETRY1["attempts = 1<br/>Retry remaining options"]
    RETRY1 --> SELECT

    COUNT -->|"2nd wrong"| HINT2["Selected → red<br/>Show Hint: <b>Definition + Translation</b><br/>Disable wrong option"]:::info
    HINT2 --> RETRY2["attempts = 2<br/>Retry remaining options"]
    RETRY2 --> SELECT

    COUNT -->|"3rd wrong"| FAIL["❌ +1 Wrong<br/>Reveal correct answer → green<br/>Show all Chinese translations"]:::warn
    FAIL --> NEXT

    CORRECT --> NEXT

    NEXT{"More words<br/>in session?"}:::decision
    NEXT -->|Yes| LOAD
    NEXT -->|No| SUMMARY

    SUMMARY["Session Summary<br/>Correct / Wrong / Accuracy %"]:::info
    SUMMARY --> DONE([Practice Complete]):::endnode

    classDef start fill:#e0e7ff,stroke:#a5b4fc,color:#3730a3
    classDef decision fill:#fef9c3,stroke:#fde047,color:#854d0e
    classDef gate fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef warn fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef done fill:#f0fdf4,stroke:#86efac,color:#166534,stroke-width:2px
    classDef ai fill:#ecfdf5,stroke:#6ee7b7,color:#065f46,stroke-width:1.5px
    classDef info fill:#f0f9ff,stroke:#bae6fd,color:#0369a1
    classDef endnode fill:#fce7f3,stroke:#f9a8d4,color:#9d174d`,

  /* ── D. Vocabs Mirroring — 2-Step (Word + Sentence) + 20s Timer ── */
  mirroringPracticeFlow: `flowchart TD
    SETUP([Setup Complete]):::start
    SETUP --> PREVIEW["📋 Quick Vocab Preview<br/>Review selected words"]:::info
    PREVIEW --> START(["▶ Start Practice"]):::done
    START --> LOAD["Load Next Word<br/>reset fails = 0<br/>mirrorStep = word"]

    LOAD --> SHOWWORD["<b>Step 1 · Say the Word</b><br/>Show target word + Chinese translation<br/>⏱ Start 10s countdown"]

    SHOWWORD -.->|"10s elapsed"| TIMEOUT_W["⏱ Time's Up<br/>❌ Word step failed"]:::warn
    TIMEOUT_W --> GOSENTENCE

    SHOWWORD --> RECORD_W["🎤 Student Records<br/>Tap mic → speak → tap to submit"]

    RECORD_W --> SCORE_W["🤖 AI Pronunciation Scoring<br/>5-star rating"]:::ai

    SCORE_W --> STAR_W{"Stars<br/>≥ 3?"}:::decision

    STAR_W -->|"Yes · pass"| PASS_W["✅ Word step passed<br/>⭐ Show star animation"]:::done
    STAR_W -->|"No · fail"| FAIL_W{"fails<br/>count?"}:::decision

    FAIL_W -->|"< 3 fails"| HINT_W{"1st fail?"}:::decision
    HINT_W -->|"Yes"| RETRY_W["fails + 1<br/>Retry (no hint yet)"]
    HINT_W -->|"No"| HINT_SHOW["🔊 Show Speaker Button<br/>as pronunciation hint"]:::info
    HINT_SHOW --> RETRY_W
    RETRY_W --> RECORD_W

    FAIL_W -->|"3rd fail"| AUTO_W["❌ 3 strikes<br/>Auto-advance"]:::warn

    PASS_W --> GOSENTENCE
    AUTO_W --> GOSENTENCE

    GOSENTENCE["<b>Step 2 · Say the Sentence</b><br/>Show example sentence + Chinese<br/>⏱ Start 20s countdown"]

    GOSENTENCE -.->|"20s elapsed"| TIMEOUT_S["⏱ Time's Up<br/>❌ Sentence step failed"]:::warn
    TIMEOUT_S --> RESULT

    GOSENTENCE --> RECORD_S["🎤 Student Records Sentence"]

    RECORD_S --> SCORE_S["🤖 AI Pronunciation Scoring<br/>5-star rating + color feedback"]:::ai

    SCORE_S --> STAR_S{"Stars<br/>≥ 3?"}:::decision

    STAR_S -->|"Yes · pass"| PASS_S["✅ Sentence step passed"]:::done
    STAR_S -->|"No · fail"| FAIL_S{"fails<br/>count?"}:::decision

    FAIL_S -->|"< 3 fails"| RETRY_S["fails + 1<br/>Show speaker hint if 2nd+ fail<br/>Retry"]
    RETRY_S --> RECORD_S
    FAIL_S -->|"3rd fail"| AUTO_S["❌ 3 strikes<br/>Auto-advance"]:::warn

    PASS_S --> RESULT
    AUTO_S --> RESULT

    RESULT{"Word step<br/>passed?"}:::decision
    RESULT -->|Yes| CORRECT["✅ +1 Correct"]:::done
    RESULT -->|No| WRONG["❌ +1 Wrong"]:::warn

    CORRECT --> NEXT
    WRONG --> NEXT

    NEXT{"More words<br/>in session?"}:::decision
    NEXT -->|Yes| LOAD
    NEXT -->|No| SUMMARY

    SUMMARY["Session Summary<br/>Correct / Wrong / Accuracy %"]:::info
    SUMMARY --> DONE([Practice Complete]):::endnode

    classDef start fill:#e0e7ff,stroke:#a5b4fc,color:#3730a3
    classDef decision fill:#fef9c3,stroke:#fde047,color:#854d0e
    classDef gate fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef warn fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef done fill:#f0fdf4,stroke:#86efac,color:#166534,stroke-width:2px
    classDef ai fill:#ecfdf5,stroke:#6ee7b7,color:#065f46,stroke-width:1.5px
    classDef info fill:#f0f9ff,stroke:#bae6fd,color:#0369a1
    classDef endnode fill:#fce7f3,stroke:#f9a8d4,color:#9d174d`,

  /* ── E. Practice All — Random Type Assignment ── */
  mixedPracticeFlow: `flowchart TD
    SETUP([Setup Complete]):::start
    SETUP --> ASSIGN["🔀 Assign Practice Types<br/>Each word gets random type<br/>equal distribution: Spelling / MC / Mirroring"]

    ASSIGN --> PREVIEW["📋 Quick Vocab Preview<br/>Show all words<br/>(practice type hidden)"]:::info
    PREVIEW --> START(["▶ Start Practice"]):::done
    START --> LOAD["Load Next Word<br/>Reveal assigned type"]

    LOAD --> TYPE{"Assigned<br/>Type?"}:::decision

    TYPE -->|Spelling| SPELL["✏️ <b>Spelling Flow</b><br/>context sentence + blank<br/>⏱ 60s · 3-strike hints<br/>→ follows full Spelling rules"]
    TYPE -->|Multiple Choice| MC["☑️ <b>Multiple Choice Flow</b><br/>4 options · progressive hints<br/>⏱ 20s · 3-strike<br/>→ follows full MC rules"]
    TYPE -->|Vocabs Mirroring| MIRROR["🎤 <b>Mirroring Flow</b><br/>Step 1: say word (10s) · Step 2: say sentence (20s)<br/>5-star rating · 3-strike<br/>→ follows full Mirroring rules"]

    SPELL --> RESULT
    MC --> RESULT
    MIRROR --> RESULT

    RESULT{"Correct?"}:::decision
    RESULT -->|Yes| CORRECT["✅ +1 Correct<br/>counts toward <b>assigned type</b>"]:::done
    RESULT -->|No| WRONG["❌ +1 Wrong<br/>does not count as attempt"]:::warn

    CORRECT --> NEXT
    WRONG --> NEXT

    NEXT{"More words<br/>in session?"}:::decision
    NEXT -->|Yes| LOAD
    NEXT -->|No| SUMMARY

    SUMMARY["Session Summary<br/>Correct / Wrong / Accuracy %<br/>each word shows practice type badge"]:::info
    SUMMARY --> DONE([Practice Complete]):::endnode

    classDef start fill:#e0e7ff,stroke:#a5b4fc,color:#3730a3
    classDef decision fill:#fef9c3,stroke:#fde047,color:#854d0e
    classDef gate fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef warn fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef done fill:#f0fdf4,stroke:#86efac,color:#166534,stroke-width:2px
    classDef ai fill:#ecfdf5,stroke:#6ee7b7,color:#065f46,stroke-width:1.5px
    classDef info fill:#f0f9ff,stroke:#bae6fd,color:#0369a1
    classDef endnode fill:#fce7f3,stroke:#f9a8d4,color:#9d174d`,

};
