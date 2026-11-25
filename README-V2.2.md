# CS Bachelor's Journey V2.2 — Original Syllabus Import

This update adds the **original curriculum structure** from the uploaded `CS-Bachelors-Journey-main.zip`, specifically the `CURRICULUM_STAGES` constant in `index.html`.

## Verified scope

- 6 stages / 26 courses / 208 lessons (8 lessons per course)
- Original course codes, Arabic titles, prerequisites, lesson order and lesson focus are retained.
- **No generated lessons**, cached lecture text, progress.json, glossary or old API credentials are imported.
- Existing V2 stored data remains on the same localStorage key `cs-bachelors-independent-v2-data`.
- Manual status of CS101 stays completed; existing DEMO lesson and its generated sections stay intact.
- The syllabus is loaded once from `curriculum.json` and missing items are appended **without replacing** existing course/lesson objects. Reopening is idempotent.
- Incoming V2 backup imports / GitHub pulls also add missing syllabus items while preserving imported progress, but **the existing import/pull still replaces local V2 data**. Export a backup before importing/pulling.

## Install

1. On currently published V2, go to Settings -> Export backup and save the JSON locally.
2. Replace `app.js`, `style.css`, `sw.js`, and add `curriculum.json` in the same repository root; commit all 4 files together.
3. GitHub Actions deploys as usual. Hard-refresh/reopen after publish.
4. Verify 6 stages, 26 curricular courses, 208 lessons; the DEMO course may also appear, making 27 total displayed courses.
5. Verify CS101 remains completed and existing DEMO derivative lesson retains its generated content.

**Limitations**: The file structure in the uploaded original ZIP contains 26 courses and 208 lessons, not the 33/396 counts referenced in some earlier discussions. This release intentionally follows the exact uploaded source, without inventing missing courses. The older GitHub `progress.json` was inspected only for structure and is NOT used as V2 progress.
