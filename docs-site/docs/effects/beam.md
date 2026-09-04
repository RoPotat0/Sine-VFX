# Beam

Select a **Beam** and run [Transform](/windows/transform) to turn it into a SineVFX-editable
beam. Like the [Trail](/effects/trail), its properties become graphable and it plays back with
the emit / enable / disable verbs.

## What you get

- The beam's channels (width, transparency, colour, curve, texture, and so on) become editable
  in the [Properties window](/windows/properties).
- Numeric channels can be driven by a lifetime [graph](/windows/graph-editor).
- Nested content rides along into a render template.

## Editing

Tune channels in [Properties](/windows/properties), [graph](/windows/graph-editor) the ones
that should animate, and recolour with the [Color tool](/tools/color).

## Preview and ship

Preview in the [Emit window](/windows/emit) (a Beam is emittable, with EmitDelay / EmitDuration
timing). Plant the [runtime module](/shipping/module) and drive it with `VFX.emit(beam)` /
`VFX.enable(beam)` / `VFX.disable(beam)`. See the [Runtime API](/shipping/api).

## Related

- [Trail](/effects/trail) - the other transformable ribbon.
- [Batch tools](/tools/overview) - all the batch editors work on beams too.
