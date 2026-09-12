# PROMPT — "ABYSSAL" : generative piano/synth arpeggio visualizer

Copy everything below the line into a fresh Claude Code session.

---

Build **ABYSSAL** — a single self-contained `.html` file (no build step, no npm, no CDN,
no external assets, works offline by double-click) that is a *continuously running*
generative synth-arpeggio machine with a piano visualizer, designed to look and sound
like an infinitely scrollable, impossible-to-stop-watching Instagram reel.

Everything — audio, visuals, fonts (system stack only), UI — lives in that one file.
Target: `abyssal.html` at the repo root. Keep it under ~2500 lines and keep the code
readable: clearly sectioned (`// ——— AUDIO ENGINE ———`, `// ——— HARMONY ———`,
`// ——— RENDER ———`), no minification, no frameworks.

## 1. The sound

Sonic reference: the micro-keyboard playing of **Dorian Concept** — fast, fluid,
hand-played arpeggios that breathe; jazz-leaning voicings; warm, slightly detuned analog
tone; rhythm that is locked but never quantized-stiff. Don't try to reproduce a specific
track. Reproduce these traits, explicitly:

**Harmony engine**
- Base: **D Dorian** (D E F G A B C). Dorian is the home mode — the raised 6th is what
  makes it beautiful-but-sad rather than just sad.
- Dark-fantasy shading: the engine periodically (every 16–32 bars) modulates into
  **D Aeolian** (darker), **D Phrygian ♮3 / Phrygian dominant** (occult, ritual), or lifts
  to **F Lydian** (the "surfacing into light" moment). Modulation should be by
  common-tone pivot, never an abrupt key jump.
- Chords are **stacked in 4ths and 9ths**, never plain triads. Voicing pool:
  `m11`, `add9`, `sus2`, `sus4`, `maj7#11`, `m6/9`, quartal stacks (root–4th–4th–2nd).
- Progressions generated from a small weighted Markov table of scale-degree moves that
  favors **i → ♭VII → IV → i**, **i → v → ♭III → IV**, and the plagal descent
  **iv → i**. Every progression must resolve to the tonic within 4 or 8 bars — the loop
  has to *land*.
- **Voice leading is mandatory**: hold common tones, move other voices by the smallest
  available interval. Implement a real `voiceLead(prevVoicing, nextChordTones)` function.
  This is the single biggest thing separating "satisfying" from "random notes."

**The satisfying intervals** — bake these in deliberately, they are the hook:
- Ascending **perfect 5th** and **major 9th** leaps at phrase starts (open, hopeful).
- **4–3 suspensions** resolving on the downbeat (the classic dopamine release).
- **Tritone → major 6th** outward resolution for the dark-fantasy tension moments.
- **Minor 3rd → perfect 4th** cell as the recurring melodic signature, transposed
  around the mode — this is the "hook cell," it must recur recognizably.
- Octave-displaced repeats: same pitch class, jumped up an octave = instant ear candy.

**Arpeggio engine**
- Tempo ~**96 BPM**, 16th-note grid, with **swing 54–58%** and per-note humanization:
  timing jitter ±8 ms, velocity jitter ±15%, and a slow velocity contour across each bar
  (crescendo into beat 3).
- Patterns cycled from: `up`, `down`, `upDown`, `downUp`, `outsideIn`, `pinky-pedal`
  (top note held as a pedal while lower notes move), `random-walk-with-gravity`
  (biased back toward register center).
- **Runs**: every 4–8 bars, a 32nd-note burst of 6–11 notes sweeping up two octaves,
  ending on a chord tone. These are the "wow" moments.
- **Space matters.** Insert a full beat of silence before roughly every 4th phrase. The
  rests are what make the next entry hit.
- A separate slow **counter-melody voice** in the high register, ~1 note per 2 beats,
  doubled a 5th below at low velocity.

**Synthesis — all Web Audio API, zero samples**
- `keys`: 2-operator FM electric-piano voice (carrier sine, modulator at ratio 14:1,
  modulation index decaying fast ~120 ms) + a sine sub an octave down. Bell attack,
  woody body. This is the lead arp voice.
- `pluck`: Karplus-Strong (noise burst → delay line with lowpass feedback) for the
  counter-melody. Bright, short, watery.
- `pad`: 3 detuned sawtooth oscillators (±7 cents) through a lowpass whose cutoff is
  modulated by a slow LFO (0.07 Hz) — the ocean floor drone. Very quiet, very wide.
- `sub`: sine bass, root notes only, slow attack, ducked under the arps.
- FX chain: per-voice lowpass → **ping-pong delay** (dotted 8th, ~38% feedback,
  feedback path lowpassed at 2.5 kHz) → **procedural convolution reverb** (generate the
  impulse response in code: exponentially decaying filtered noise, 3.5 s tail, slight
  stereo decorrelation) → gentle soft-clip saturation → master compressor.
- **Sidechain pump**: master gain dips ~18% on every beat 1 and 3 with a 180 ms recovery
  envelope. Subtle, but it's what makes it feel like a produced track.
- Use `AudioContext.currentTime` lookahead scheduling (25 ms timer, 100 ms schedule
  window). Never schedule from `requestAnimationFrame`. Audio must not drift or glitch
  when the tab is backgrounded and refocused.
- **Autoplay policy**: start silent behind a full-screen entry state (see §3) and only
  create/resume the AudioContext on the first user gesture.

## 2. The visuals — deep ocean spacecore, dark fantasy

The scene is an abyssal trench that is also open space. Cold, vast, bioluminescent,
slightly holy. Colors: near-black indigo `#04060f` → deep teal `#062b33` ground,
with bioluminescent accents in cyan `#5ff5e6`, ultraviolet `#8b6cff`, abyss-anglerfish
gold `#ffd98a`, and a rare blood-coral `#ff5c7a` reserved for the tension chords.
High contrast, mostly darkness, light used sparingly so every note *glows*.

**Layers, back to front:**
1. Volumetric god-rays from far above, slowly rotating, barely visible.
2. Drifting marine snow / starfield particles with parallax depth (3 depth bands).
3. A slow caustic light pattern on the "floor" — animated with layered sine noise.
4. Distant silhouettes in the murk: huge slow shapes (a leviathan spine, a cathedral
   arch, a ruined monolith) that pass every 40–90 s and are *never* fully revealed.
5. **The instrument** — the piano visualizer, centered.
6. Foreground: floating sigil rings, particulate bokeh, vignette, subtle chromatic
   aberration that pulses on downbeats, and a fine film grain.

**The piano visualizer itself** — do NOT build a flat Synthesia keyboard. Build this:
- A **keyboard bent into an arc** (or a full ring, your call — pick the one that reads
  better at 9:16) sitting in the mid-plane, drawn as thin luminous glass slats rather
  than white/black keys. Pitch class determines hue around the ring.
- Notes **rise** from the keys as columns of light — like bubbles/plankton ascending —
  instead of falling toward the keys. Column height = velocity, width = duration,
  brightness = register.
- Each strike emits: a **radial shockwave ring** on the plane, a burst of 8–20 glowing
  particles with drag and buoyancy, and a bloom bloom on the key itself that decays over
  ~700 ms.
- Held/pedaled notes leave a **persistent light trail** that slowly dissolves upward.
- Chord changes trigger a **rune/sigil ring** that draws itself procedurally (an
  n-pointed star polygon where n = chord size, rotating slowly) and fades over 2 bars.
- Bass notes shake the water: a low-frequency displacement ripple across the whole frame.

**Rendering approach**: Canvas 2D with an offscreen buffer for the glow pass
(draw → blur via successive downscale/upscale → additive composite) is acceptable and
keeps the file simple. Use WebGL only for the background field if you can keep it inline
and dependency-free. **60 fps at 1080p is a hard requirement** — cap particle counts,
reuse object pools, never allocate in the render loop.

## 3. The reel mechanics — this is what makes it addictive

- **Entry state**: full-screen black, one line of thin letterspaced type —
  `DESCEND` — with a slow breathing glow. One click/tap starts audio and begins a
  20-second camera descent into the trench while the first arpeggio fades in. Make this
  opening 5 seconds genuinely beautiful; it's the thumbnail.
- **It never ends and never repeats.** Seeded PRNG (`mulberry32`) so any run can be
  reproduced via `?seed=`. Show the seed in the corner in tiny mono type.
- **Escalation arc, looping every ~90 s**: `DRIFT` (sparse, 2 voices) →
  `BLOOM` (full arps, delay opens) → `DESCENT` (dark mode, minor 2nds, low register,
  visuals desaturate to ultraviolet) → `SURFACE` (Lydian lift, gold light, the big
  32nd-note run, everything blooms) → back to `DRIFT`. Name the current phase in tiny
  type in the corner. People watch to see the next phase.
- **Rare events** — the reason someone watches for 3 minutes: on a low probability roll
  every 30–60 s, one of: the leviathan passes and every note it eclipses plays in
  reverse; a "resonance cascade" where one note re-triggers in a fibonacci rhythm; a
  bloom of 200 particles that spell out a slow constellation; total silence for 2 beats
  with the screen going white-blue, then a fortissimo chord. Log a tiny `RARE` glyph in
  the corner when one fires.
- **Aspect toggle**: `V` switches to 9:16 vertical (letterboxed, everything reflows and
  scales — do not just crop), `F` toggles fullscreen, `H` hides all UI for clean screen
  recording. Default to 16:9.
- **Perfect-loop seam**: because phases return to `DRIFT` in the same key and camera
  position, a screen recording of exactly one 90 s cycle loops seamlessly. Verify this.
- Keyboard: `Space` pause/resume, `M` mute, `R` reseed, `1–4` jump to phase,
  `←/→` tempo ±4 BPM. Show the key map on `?`.

## 4. Constraints and quality bar

- One file. No dependencies. No network calls. No images. No audio files.
- Must not clip or distort — put a limiter on the master and verify peak levels.
- Must respect `prefers-reduced-motion`: reduce camera drift, particle count, and kill
  chromatic aberration and screen shake, but keep the piece running.
- Must degrade sanely on a phone: detect device pixel ratio and particle budget, target
  a stable 60 fps over maximal fidelity.
- Handle tab visibility: suspend audio on hide, resume cleanly on show, no note pileup.
- No console errors, no memory growth over a 10-minute run (check with repeated
  allocations profiling — pool particles and voices).

## 5. Process

1. Before writing the final file, plan the architecture in a short design note: module
   boundaries, the scheduler contract, the data shape of a scheduled note event
   (`{time, midi, velocity, duration, voice, phase}`), and how the render loop consumes
   the same events for visuals (visual events should be driven off the *scheduled* note
   list with a lookahead offset so audio and light land on the same frame).
2. Build the audio engine first and verify it in isolation — harmony, voice leading,
   arpeggiator, synthesis, FX — then layer the visuals on top of the event stream.
3. Actually run it: serve the file and load it in a headless Chromium via Playwright,
   screenshot at 3 s, 20 s, and 60 s, and check the console is clean and the frame rate
   holds. Iterate on the screenshots until the frames look like something you'd stop
   scrolling for.
4. Commit to `claude/piano-visualizer-ocean-synth-di5ryx` with a clear message. Don't
   open a PR unless asked.

## 6. What "done" means

I should be able to open the file, click once, and not want to close the tab for three
minutes. The arpeggios should sound like a person playing, not a sequencer firing. Every
note should make light. And any 15-second window of it should be worth posting.

Taste is the deliverable here — if a choice is between "technically impressive" and
"feels good to watch," choose feels good, every time.
