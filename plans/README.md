# Animation improvement plans

Produced by the `improve-animations` skill (Emil Kowalski) at commit `df8490c`.
Read-only audit — these plans describe changes; no source was modified.

| # | Title | Severity | Status |
| --- | --- | --- | --- |
| [001](001-tile-hover-speed-and-reduced-motion.md) | Speed up + reduced-motion-gate the gallery tile hover | MEDIUM-HIGH | **DONE** |
| [002](002-press-feedback-on-controls.md) | Add press feedback to interactive controls | LOW (additive) | **DONE** |

## Recommended order

1. **001** first — highest leverage (the tile hover is the main interaction on
   `/playground`, and 001 also closes the reduced-motion gap on the full-screen blur).
2. **002** — additive polish; independent of 001 but touches the same tile `<a>`
   wrappers, so do it after 001 to avoid overlapping edits on those lines.

No dependencies between them beyond that ordering note.

## Applied directly (LOW one-liners)

- **CursorLabel `scale(0)` → `scale(0.9)`** (`CustomCursor.tsx:224`) — DONE.
- **`.card-gradient::before` hover 300ms → 200ms** (`globals.css:178`) — DONE.

## Execute

Hand any plan to an executor (including a cheaper model): "implement plans/001-…md
exactly." It is self-contained. Then feel-check per the plan's Verification section.
