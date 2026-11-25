# CS Learning Studio V3.1 — Workspace Engine
- Independent release, original V3 unchanged. Run via GitHub Pages or an HTTP server (not by opening HTML directly).
- Drag a panel title to the edge of another panel, or use its move menu. Drag separators or use arrow keys. Close/reopen or maximize/restore panels. On narrow screens, switch panels via tabs.
- Experiment tabs keep independent code, notes, layout and execution cursor/history; stored locally in browser. V3.0 code and notes migrate if present on the same origin; V3.0 panel order is not migrated. Existing degree progress storage is unchanged. New origins require existing progress export/import.
- Undo/redo is for CPU instructions; not for layout changes. The CPU remains the original educational 8-bit instruction-level model; no real cycle-accurate circuitry. Four selected HW101 lessons link to a generic relevant lab, not a full lesson-specific simulation.
- Fullscreen depends on browser support. Studio experiments are not cross-device synchronized. Tests are in tests/workspace.test.mjs and V31_TEST_RESULTS.json. Browser verification was blocked by environment navigation policy.
