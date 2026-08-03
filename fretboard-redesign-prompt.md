# Prompt: Redesign the Guitai Fretboard Visualizer

Copy everything below the line into a fresh Claude Code (or similar) session that has the Guitai repo (https://github.com/liamcashmore/Guitai) checked out.

---

Redesign the UI and UX of this fretboard visualizer app (vanilla JS: `index.html`, `music.js`, `view.js`, `audio.js`, `styles.css`) around the attached concept photo. Keep `music.js` (the theory engine) intact — every existing feature must survive the redesign — but rewrite the markup, styles, and view/render layer to match the concept's visual language and interaction philosophy.

## The concept photo, described precisely

A minimal, poster-like mobile screen:

- **Background:** a single flat dark slate-charcoal field (≈ `#474C56`), no gradients, no panels, no borders. The fretboard floats in generous negative space.
- **Fretboard:** vertical orientation — nut at the top, frets descending — like looking down at a guitar neck you're holding. Strings are thin vertical lines, frets thin horizontal lines, both in warm cream (≈ `#E9DCB8`), all hairline weight (1–1.5px). No wood texture, no skeuomorphism. ~15–17 frets visible, extending past the last note so the neck feels continuous.
- **Inlays:** tiny soft white dots (~3px) centered between strings at frets 3, 5, 7, 9, 12 (double), 15, 17 — quiet, nearly subliminal.
- **Notes:** flat filled circles sitting on the string lines, no strokes, no labels visible by default. Three semantic colors:
  - **Coral red** (≈ `#E8474E`) — the root
  - **Warm sand/gold** (≈ `#EEC478`) — active scale/chord tones
  - **Muted slate-lavender** (≈ `#7D7F9E`) — ghost/secondary tones (out-of-shape or passing notes)
- **Wordmark:** a small, quiet app title centered at the top in cream, letterspaced, lowercase or small caps. Nothing else in the header.
- **Toolbar:** one small floating pill/segmented bar at the bottom center, in cream/peach (≈ `#F7E3C3`, active segment slightly warmer ≈ `#F3D5A8`), containing 3–4 icon-only buttons (grid/board, shape, pencil/path). One slim standalone icon may sit just outside it. That's the *entire* visible chrome — no top control strip, no dropdown row, no visible sliders.

## Design directives

1. **Invert the current layout.** Today the app is a horizontal desktop fretboard under a dense strip of dropdowns, toggle buttons, and sliders. The redesign is mobile-first and vertical: fretboard portrait and centered, controls collapsed into the bottom toolbar. On wide screens, keep the vertical board centered with dead space either side (poster framing) — do not rotate back to horizontal.

2. **Progressive disclosure replaces the control strip.** Every existing control must remain reachable, but hidden until summoned:
   - **Tap the wordmark or a "key" chip** → bottom sheet with Root picker (chromatic wheel or 12-note grid) and Type (scale / arpeggio / chord) plus the full scale-and-chord catalog from `music.js` (all modal systems, pentatonics, bebop, the full chord library). Searchable list, grouped by family.
   - **Board icon** → view options: labels off / note names / degrees; OPEN strings on/off; GHOST tones on/off.
   - **Shape icon** → CAGED mode: entering it shows the five shapes as a swipeable/arrow-stepped position window; the current shape's notes go gold, everything else drops to slate-lavender ghosts. The old draggable "window handle" becomes an invisible drag gesture on the board itself.
   - **Path/pencil icon** → PATH (run-builder) mode: tap notes to set endpoints, drag to slide waypoints, double-tap to restart — preserve the existing gesture model but restyle the run as a thin cream polyline connecting the dots.
   - **Play** is a single button (in or beside the toolbar). Long-press or an adjacent chip opens a mini sheet with the two sliders (strum spread 0–100, BPM 40–200) rendered as minimal cream tracks with dot thumbs.

3. **Color is the information channel.** With labels hidden by default, the red/gold/lavender system carries all meaning: red = root, gold = in the current shape/selection, lavender = ghost. The legend disappears; a first-run one-line caption may introduce the colors, then never again. When labels are enabled, render them as small dark text *inside* the dots (charcoal on gold/cream, cream on red/lavender) — check contrast.

4. **Motion and audio feedback.** Keep the existing smooth transform transitions when shapes shift. When a note sounds (strum or path playback), it should pulse — briefly scale up ~1.2× with a soft glow of its own color — travelling down the neck as the strum spreads. Toolbar sheets slide up with a gentle ease; nothing bounces.

5. **Typography.** One geometric/humanist sans throughout (e.g. system stack or a single webfont), letterspaced small caps for the wordmark, 12–14px UI text. No bold weights except the active toolbar segment.

6. **Touch targets.** Note circles render ~small (visually ≈ 60–70% of string gap) but hit areas must be ≥ 40×40px. Toolbar icons ≥ 44px. Everything must work with touch (tap, drag, double-tap, long-press) *and* mouse.

7. **Keep, don't cut.** Feature parity checklist — all of these must still work after the redesign:
   - Root × Type (scale / arpeggio / chord) selection across the full `music.js` catalog
   - Label modes: none / note names / scale degrees
   - CAGED shapes with prev/next stepping and board-drag positioning
   - PATH run building (click/drag/double-click), clear, and path playback
   - GHOST tones toggle, OPEN strings toggle
   - Strum playback with spread control, BPM control
   - Unison pruning and correct note spelling (already in `music.js` — don't touch)

8. **Tech constraints.** Stay dependency-free vanilla JS + SVG (or canvas if needed for 60fps). One HTML file entry point. CSS custom properties for the five concept colors so the palette is themeable from `:root`. Must run as a static GitHub Pages site exactly as it does now.

Deliverable: the rewritten `index.html`, `styles.css`, and `view.js` (plus any small new modules), with `music.js` and `audio.js` untouched or minimally adapted, matching the concept photo closely enough that a screenshot of the app and the concept read as the same product.
