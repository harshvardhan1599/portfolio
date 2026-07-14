# 001 — Speed up and reduced-motion-gate the gallery tile hover

- **Status**: DONE (applied on df8490c)
- **Commit**: df8490c
- **Severity**: MEDIUM-HIGH
- **Category**: Easing & duration + Accessibility
- **Estimated scope**: 2 files, 4 className edits

## Problem

The Tinkerings gallery tiles run their hover response at **500ms** — far over the
sub-300ms budget for a hover interaction (the most frequently-triggered motion on
that page), so the lift feels sluggish. The same 500ms drives a **full-viewport
`backdrop-blur` overlay** on every hover, and neither the scale nor the blur is
gated for `prefers-reduced-motion` (a whole-screen blur is exactly the kind of
motion that setting exists to remove).

```tsx
/* src/components/StaticTile.tsx:50-53 — current (figure, the scale) */
className={`flex flex-col gap-3 relative transition-transform duration-500 ease-out ${origin} ${
  isLifted ? "z-50" : "z-0"
} ${isHovered ? "scale-[1.04]" : "scale-100"}`}
```

```tsx
/* src/components/StaticTile.tsx:101-104 — current (the full-screen blur overlay) */
className={`fixed inset-0 z-40 pointer-events-none backdrop-blur-sm bg-background/20 transition-opacity duration-500 ease-out ${
  isHovered ? "opacity-100" : "opacity-0"
}`}
```

`src/components/DitherTile.tsx:34-38` (the `<a>`, scale) and `:60-63` (the blur
overlay) have the identical pattern.

## Target

Scale response at **200ms**, blur fade at **300ms**, both with a strong ease-out,
and both dropped under reduced motion (tile stays put, no screen blur).

```tsx
/* target — StaticTile.tsx figure */
className={`flex flex-col gap-3 relative transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${origin} ${
  isLifted ? "z-50" : "z-0"
} ${isHovered ? "scale-[1.04] motion-reduce:scale-100" : "scale-100"}`}
```

```tsx
/* target — StaticTile.tsx blur overlay */
className={`fixed inset-0 z-40 pointer-events-none backdrop-blur-sm bg-background/20 transition-opacity duration-300 ease-out motion-reduce:hidden ${
  isHovered ? "opacity-100" : "opacity-0"
}`}
```

Apply the identical two changes in `DitherTile.tsx`.

## Repo conventions to follow

- These components use Tailwind utility classes for motion (`transition-transform`,
  `duration-*`, `ease-out`); strong custom curves are written inline as arbitrary
  values elsewhere (e.g. `DitherStage` uses `cubic-bezier(0.7,0,0.15,1)`,
  `AboutBody` uses `cubic-bezier(0.22,1,0.36,1)`). Use the arbitrary Tailwind form
  `ease-[cubic-bezier(0.23,1,0.32,1)]` for the scale; plain `ease-out` is fine for
  the opacity fade.
- Reduced-motion elsewhere is handled in JS (`window.matchMedia`); here the
  motion is pure CSS classes, so use Tailwind's `motion-reduce:` variant.

## Steps

1. `src/components/StaticTile.tsx:52` — change `duration-500` → `duration-200` and
   `ease-out` → `ease-[cubic-bezier(0.23,1,0.32,1)]`; append `motion-reduce:scale-100`
   inside the hovered branch (`scale-[1.04] motion-reduce:scale-100`).
2. `src/components/StaticTile.tsx:102` — change `duration-500` → `duration-300`; add
   `motion-reduce:hidden` to the overlay className.
3. `src/components/DitherTile.tsx:36` — same as step 1 (this is on the `<a>`).
4. `src/components/DitherTile.tsx:62` — same as step 2.

## Boundaries

- Motion/utility classes only — do NOT change the hover state machine
  (`isHovered`/`isLifted`), the z-lift, or markup.
- Do NOT touch the image/video children or the `origin-*` transform-origin.
- No new dependencies.
- If a className doesn't match the excerpt above (drift since `df8490c`), STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit` clean; `npx eslint src/components/StaticTile.tsx src/components/DitherTile.tsx` clean; `/playground` returns 200.
- **Feel check**: on `/playground`, hover a tile — the lift should feel immediate
  and crisp (not a slow glide); the background blur should come up quickly.
  - DevTools Animations panel at 10% speed: the scale eases out (fast start), no linger.
  - Rendering panel → emulate `prefers-reduced-motion: reduce`: hovering a tile
    produces **no** scale and **no** full-screen blur (the tile is static).
- **Done when**: hover response is ~200ms, blur ~300ms, and reduced-motion shows neither.
