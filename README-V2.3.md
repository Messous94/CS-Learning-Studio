# CS Bachelor's Journey V2.3 — Expanded Curriculum & Navigation

## What this update does

- Source syllabus: the uploaded original `CS-Bachelors-Journey-main.zip`, `index.html` → `CURRICULUM_STAGES` (26 courses, 208 broad **source units**).
- The same **6 stages** and original **26 course codes** remain. Two specifically approved additions: `CS400` AI foundations (search, knowledge and reasoning), and `CS309` specialized platform development (web, mobile and APIs). The total is **28 courses**.
- Source unit titles and their focus strings remain in the `units` / `legacyUnits` data structure. The expanded curriculum includes **882 smaller lesson entries**, combining manually subdivided foundation topics and focus-based candidate lesson splits.
- Every detailed lesson has stable ID, learning objectives, suggested activity types, potential lab blueprint, previous-lesson reference, and a **manual-only** completion policy.
- Expansions beyond the 208 source units are **editorial proposals**, not verified text extracted from the original file. Non-foundation splits especially require topic-by-topic academic and Arabic terminology review before they should be called finalized.
- Potential lab blueprints are planning metadata. They DO NOT make unsupported labs executable automatically.

## Compatibility

- No contents of the older source repository are modified or imported into the new app.
- Same `localStorage` database key as V2.2: `cs-bachelors-independent-v2-data`.
- Existing generated V2 lectures, notes, quiz results and lab state are left intact. Previous broad lessons are retained and reachable from the archive in their course when they have generated content.
- CS101 retains its existing course-level completion status, including self-reported completion without generated lessons.
- Existing DEMO derivative course is retained, if present.
- The old course-level completion status remains independent of lesson-level completion.
- Lesson-level completion is a manual toggle; neither generation nor grading is a prerequisite.
- Reloading the same curriculum does not append duplicates.
- To save localStorage space, the large lesson planning metadata stays in `curriculum.json`, not redundantly in the local database.

## Navigation and reader

- An explicit Back control is visible on secondary views.
- Route changes create browser history entries; native Android back-swipe should use that history.
- A gesture fallback is registered *only in installed standalone PWA mode* for edge swipes (avoid fighting browser-native navigation).
- Reader size buttons `A−`, `A+`, and reset are visible inside the lesson; the chosen reading font size is saved.
- Original reader typography rules are otherwise unchanged.

## Update without data loss

1. In the *currently running V2.2*, export a JSON backup from Settings. Keep it outside the app.
2. Replace four files in the **same** V2 GitHub repository root: `app.js`, `style.css`, `sw.js`, `curriculum.json`. Do not delete `index.html`, `manifest.webmanifest`, `icons/`, or `.github/`.
3. Commit the files. GitHub Actions deploys the static site as before.
4. Reopen the PWA and verify CS101 is complete, the previously generated derivative lesson still exists, and new courses are grouped under the six stages.
5. Check a lesson in HW101; manually mark it complete; reload and verify it stays complete. In the lecture viewer test A+/A− and back navigation. Export another backup.

## Verification performed

- JavaScript syntax check: passed.
- JSON schema shape, course count and unique new-lesson IDs: passed.
- In-memory migration simulation with stored HW101 old lecture, completion, lab state, existing DEMO generated content and existing CS101 completion: passed.
- Repeated migration idempotence: passed.
- Browser mobile interactive test: **NOT VERIFIED**. Local Chromium browser was blocked from reaching localhost by the execution environment (`ERR_BLOCKED_BY_ADMINISTRATOR`).
- Gemini real-call generation, cross-device GitHub sync, Android OS swipe behavior: **NOT VERIFIED**.

## Important constraints

- Back navigation is implemented by client-side history state, not by a full URL router. A hard refresh while already on a nested hash may return to the default screen.
- Large generated lectures can eventually exceed the browser's localStorage quota. IndexedDB migration remains a necessary future storage improvement before substantial mass generation.
- The browser cannot safely conceal a Gemini API key. The existing key is kept only in sessionStorage.
- The generated syllabus is a detailed **planning foundation**. Each course still needs an academic review of scope, ordering, and project assessment. The AI prompt uses the lesson objectives to direct generation but cannot guarantee factual correctness or advanced simulation capabilities.
