# 002 — Add press feedback to interactive controls

- **Status**: DONE (applied on df8490c; large home cards use 0.985 vs 0.98 to stay subtle)
- **Commit**: df8490c
- **Severity**: LOW (additive / missed opportunity)
- **Category**: Physicality & origin
- **Estimated scope**: 3 files, small

## Problem

Nothing in the UI gives a press response. Pressable controls should confirm the
press with a small `scale` on `:active` — its absence makes clicks feel inert.
Affected, high-traffic controls:

```tsx
/* src/components/NavMenu.tsx:110-114 — Contact button, no :active feedback */
className="flex items-center gap-2 rounded-xl border border-foreground/40 px-4 py-2 text-foreground/80 transition-colors hover:border-foreground/70 hover:text-foreground"
```

- Case-study card links: `src/app/page.tsx` — the three `<Link ... data-cursor="case-study">` grid blocks.
- Tinkering tile links: the `<a>` in `src/components/StaticTile.tsx:82-89` and `DitherTile.tsx:26-36`.

## Target

A subtle press: `scale(0.97)` on `:active`, 120ms ease-out, gated for reduced
motion. For the Contact button, extend its existing `transition` to include
transform:

```tsx
/* target — NavMenu.tsx Contact button */
className="flex items-center gap-2 rounded-xl border border-foreground/40 px-4 py-2 text-foreground/80 transition-[colors,transform] duration-[120ms] ease-out hover:border-foreground/70 hover:text-foreground active:scale-[0.97] motion-reduce:active:scale-100"
```

For the tile `<a>` and case-study `<Link>`, add only:
`active:scale-[0.98] transition-transform duration-[120ms] ease-out motion-reduce:active:scale-100`
(0.98 because these are large surfaces — keep it barely-there; on the tinkering
tiles this composes with the existing `transition-transform` on the inner figure,
so put it on the `<a>`/`<Link>` wrapper, not the scaling figure).

## Repo conventions to follow

- Motion is Tailwind utilities here; the codebase already uses arbitrary values
  like `duration-[120ms]` and `scale-[1.04]`.
- Reduced motion via the `motion-reduce:` variant (see plan 001).

## Steps

1. `src/components/NavMenu.tsx:112` — replace `transition-colors` with
   `transition-[colors,transform] duration-[120ms] ease-out` and append
   `active:scale-[0.97] motion-reduce:active:scale-100`.
2. `src/app/page.tsx` — on each of the 3 case-study `<Link>` wrappers (the ones with
   `data-cursor="case-study"`), append
   `active:scale-[0.98] transition-transform duration-[120ms] ease-out motion-reduce:active:scale-100`
   (they currently have layout classes only). Add `origin-center` implicitly (default).
3. `src/components/StaticTile.tsx:88` and `src/components/DitherTile.tsx` — on the
   `<a className="block">` wrapper add the same `active:scale-[0.98] transition-transform duration-[120ms] ease-out motion-reduce:active:scale-100`.

## Boundaries

- Add the `:active` scale only — do NOT alter existing hover, the tile lift/blur
  (plan 001 owns those), layout, or `data-cursor` attributes.
- Keep the scale subtle (0.97 buttons, 0.98 large surfaces). Never below 0.95.
- No new dependencies.
- If a target className doesn't match (drift since `df8490c`), STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npx eslint` clean; `/`, `/playground` return 200.
- **Feel check**: click-and-hold the Contact button and a case-study card — each
  should dip ~2-3% while held and spring back on release.
  - DevTools 10%: the press scales in on `:active`, releases on mouseup, no jump.
  - Reduced-motion emulation: pressing produces no scale.
- **Done when**: the four control types visibly acknowledge a press, subtly, and reduced-motion suppresses it.
