# Paths

**Paths** is a preview mode that draws the **predicted trajectory** of particles for the
selected emitters, so you can see where they'll travel before you even emit.

Toggle it from the **Paths** entry on the SineVFX menu.

## What it shows

With Paths on, SineVFX visualises the flight path a particle would take given the emitter's
current velocity, acceleration, spread, and lifetime settings. As you change those values in
[Properties](/properties), the predicted paths update to match.

This is especially useful for:

- **Directional effects** - aiming a stream of particles precisely.
- **Bezier / orbit effects** - seeing the curve a particle rides.
- **Lightning bolts** - a [Lightning](/lightning) emitter draws its route plus a frozen
  sample of the actual bolt, branches included.
- **Tuning spread and acceleration** - understanding how wide or how fast an emission fans
  out.
- **Raycast emitters** - a [3D particle](/part#raycast) with Raycast on draws from where its
  particles will land (and draws nothing for rays set to Skip on a miss).

## Native ParticleEmitters

Paths also works on plain `ParticleEmitter`s, using Roblox's own motion rules: **Drag** only
slows the launch velocity, while **Acceleration** keeps pushing at full strength, and
**GlobalWind** is included when **WindAffectsDrag** is on. That means heavy-drag effects (smoke
that puffs out then drifts) are drawn accurately instead of overshooting. Rotating the emitter
updates the curve when world-space forces like Acceleration or wind are involved.

## Notes

- Paths is a **global preview mode**, not a window - it stays on until you toggle it off, and
  its state persists between sessions.
- It affects only the **selected** emitters, so select the ones you're tuning.
