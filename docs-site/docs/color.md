# Color

The **Color** tool is SineVFX's full colour workflow - a proper picker plus batch recolour
operations that work across many instance types at once. Open it from **Tools → Color**.

## The picker

- A **2D saturation/value field** with a **hue** control for choosing a colour visually.
- **RGB inputs** for exact values.
- A **colour wheel** for hue selection.

## Replace Colors

Select a bunch of effects and **replace** one colour with another across all of them, with a
**tolerance** setting so near-matches are caught too. Great for reskinning an effect from,
say, blue to red without editing each gradient by hand.

## Shift Colors

**Shift** the hue, saturation, and value of a whole selection with sliders - recolour a
whole effect (or a whole scene of effects) while keeping its internal contrast and structure
intact.

## What it can recolour

The Color tool collects colour targets across many instance types in one pass:

- `ParticleEmitter`
- `Beam`
- `Trail`
- `UIGradient`
- `BasePart`

So a single Replace or Shift can sweep an entire multi-part effect - particles, beams,
trails, and the parts they're attached to - together.

## Colour sequences

For channels that use a **colour sequence** over lifetime, SineVFX provides sequence editing
so a colour can transition across a particle's life, not just sit static.

## Tips

- Use **Replace Colors** with a moderate tolerance to catch gradient stops that are *close*
  to your source colour.
- Use **Shift Colors** for whole-scene retints - it preserves the relationships between
  colours far better than replacing each one.
