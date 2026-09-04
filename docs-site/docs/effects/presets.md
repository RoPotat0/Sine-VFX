# Presets

**Presets** are ready-made, already-transformed effects you drop into your place and tweak -
so you're never starting from a blank emitter. Each one is a complete SineVFX effect with
its channels, graphs, and shape already dialed in.

## Built-in presets

| Preset               | What it is                                                        |
| -------------------- | ----------------------------------------------------------------- |
| **ParticleEmitter**  | A clean base particle effect to build from.                       |
| **Beam**             | A base beam.                                                      |
| **Trail**            | A base trail.                                                     |
| **PointLight**       | A base light.                                                     |
| **Highlight**        | A base highlight outline/glow.                                    |
| **Sound**            | A base sound effect.                                              |
| **Lightning**        | A lightning bolt built on a bezier-driven render part + trail.    |
| **Orbit**            | Particles / a part orbiting around a point.                       |
| **Bezier**           | An effect that rides a bezier path.                               |
| **Charging Bezier**  | A charge-up variant along a bezier path - good for wind-ups.      |
| **Debris**           | Scattering debris on impact.                                      |
| **Crater**           | A ground-impact crater effect.                                    |

## Using a preset

1. Insert the preset into your Workspace.
2. It's already transformed - open [Properties](/windows/properties) to tweak it.
3. Preview with [Emit](/windows/emit), shape values in the
   [graph editor](/windows/graph-editor), and recolour with the [Color tool](/tools/color).

## Anatomy of a preset

The more complex presets (Lightning, Orbit, Bezier, Debris, Crater) are built around a
**RenderPart** plus a **`Properties` folder** whose groups mirror the ones you see in the
Properties window - Appearance, Emission, Shape, Particles, Flipbook, Bezier, Placement,
Collision, Optimization, and Nested. That's the same structure your own transformed effects
use, so anything you learn tuning a preset applies to effects you build from scratch.

## Tips

- Presets are the fastest way to learn - open one, poke at its graphs, and see how a
  finished effect is put together.
- Duplicate a preset and use the [Copier](/tools/overview#copier) to spread its look across
  new objects.
