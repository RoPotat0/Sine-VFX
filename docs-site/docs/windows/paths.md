# Paths

**Paths** is a preview mode that draws the **predicted trajectory** of particles for the
selected emitters, so you can see where they'll travel before you even emit.

Toggle it from the **Paths** entry on the [Hub](/windows/overview).

## What it shows

With Paths on, SineVFX visualises the flight path a particle would take given the emitter's
current velocity, acceleration, spread, and lifetime settings. As you change those values in
[Properties](/windows/properties), the predicted paths update to match.

This is especially useful for:

- **Directional effects** — aiming a stream of particles precisely.
- **Bezier / orbit presets** — seeing the curve a particle rides.
- **Tuning spread and acceleration** — understanding how wide or how fast an emission fans
  out.

## Notes

- Paths is a **global preview mode**, not a window — it stays on until you toggle it off, and
  its state persists between sessions.
- It affects only the **selected** emitters, so select the ones you're tuning.
