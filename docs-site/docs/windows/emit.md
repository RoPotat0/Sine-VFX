# Emit

The **Emit window** is your live preview. It fires transformed effects right in edit mode so
you can see exactly what ships — no Play button, no round‑trips.

Open it from the **Emit** entry on the [Hub](/windows/overview).

## The three verbs

| Action      | What it does                                                          |
| ----------- | -------------------------------------------------------------------- |
| **Emit**    | Fire a one‑shot play over the effect's duration. Hold to repeat.     |
| **Enable**  | Turn the effect on and hold it until you disable it.                 |
| **Disable** | Turn it off (with a short fade‑out where it applies).                |

These are the same three verbs you'll call at [runtime](/shipping/api), so what you preview
is what your game does.

## Repeat and timing

- **Hold Emit** to repeat the burst continuously.
- **EmitDelay** and **EmitDuration** control the timing of a repeat cycle — the delay before
  a play and how long the effect stays enabled over the cycle.
- Beams, Trails, and Lights are wired into the same repeat loop, so mixed selections play
  together.

## Working with selections

The Emit window acts on your current selection of transformed effects. Select several and
they emit/enable together — handy for composing a multi‑part effect (a flash + debris + a
beam) and previewing it as one.

## Floating slider panel

The window includes a floating slider panel for quickly dialing timing values without
diving into the full Properties tree — good for fast iteration while you watch the effect.

## Cameras

Transformed [Camera Effects](/effects/camera) appear here too — Emit and Enable drive their
shake / FOV / blur exactly like a particle effect. See the
[Camera Effect](/effects/camera) page for its play model (hold vs. pulse).

## Tips

- Keep this window open while editing in [Properties](/windows/properties) or the
  [graph editor](/windows/graph-editor) so every change plays back instantly.
- Use **Enable** (not repeated Emit) when tuning a continuous effect like a persistent aura
  or beam.
