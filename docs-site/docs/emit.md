# Emit & preview

The **Emit window** is your live preview. It fires effects right in edit mode so you can see
exactly what ships, no Play button, no round-trips.

Open it from the **Emit** entry on the SineVFX menu (default keybind `R` to emit, `T` to
enable, see [Keybinds](/keybinds)).

## The controls

| Control      | What it does                                                          |
| ------------ | -------------------------------------------------------------------- |
| **Emit**     | Fire a one-shot play over the effect's duration.                     |
| **Enable**   | Turn the effect on and hold it until you disable it.                 |
| **Repeat**   | Keep firing on a timer until you stop (see below).                   |
| **Disable**  | Turn it off (with a short fade-out where it applies).                |

Emit / Enable / Disable are the same verbs you'll call at [runtime](/api), so what you
preview is what your game does.

## Repeat

**Repeat** loops the effect automatically instead of you clicking Emit over and over. It keeps
firing a play on an interval and runs until you stop it (it can also finish the current cycle
before stopping, so a burst never gets cut off mid-play).

- The interval is the **Repeat Timer**, set in **Settings → Emission** (0 to 10s).
- **EmitDelay** and **EmitDuration** on the effect control the timing within a cycle: the delay
  before a play, and how long it stays enabled over the cycle.
- [Beams, Trails, Lights, Sounds](/emittable), and 3D particles are all wired into the
  same repeat loop, so a mixed selection repeats together.

## Working with selections

The Emit window acts on your current selection. Select several effects and they emit / enable /
repeat together, handy for composing a multi-part effect (a flash + debris + a beam) and
previewing it as one. It drives both transformed effects and plain
[emittable objects](/emittable).

## Floating slider panel

The window includes a floating slider panel for quickly dialing timing values without diving
into the full Properties tree, good for fast iteration while you watch the effect.

## Cameras

Transformed [camera effects](/camera) appear here too, Emit and Enable drive their
shake / FOV / blur exactly like a particle effect. See the [Camera](/camera) page for
its play model (hold vs. pulse).

## Tips

- Keep this window open while editing in [Properties](/properties) or the
  [graph editor](/graph-editor) so every change plays back instantly.
- Use **Enable** (not **Repeat**) when tuning a continuous effect like a persistent aura or
  beam.
