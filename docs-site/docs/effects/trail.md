# Trail

Select a **Trail** and run [Transform](/windows/transform) to turn it into a SineVFX-editable
trail. Its properties are exposed to the [graph editor](/windows/graph-editor) so they can be
driven over the effect's life, and it plays back with the same emit / enable / disable verbs as
everything else.

## What you get

- The trail's channels (width, transparency, colour, lifetime, and so on) become editable in
  the [Properties window](/windows/properties).
- Numeric channels can be graphed over the effect's lifetime.
- Nested content rides along into a render template, the same way a
  [Part emitter](/effects/part) keeps its children.

## Editing

Open [Properties](/windows/properties) to tune the channels, [graph](/windows/graph-editor)
the ones that should change over time, and [Color](/tools/color) to recolour it.

## Preview and ship

Preview in the [Emit window](/windows/emit) (a Trail is emittable, so it also has emit timing:
EmitDelay / EmitDuration). Plant the [runtime module](/shipping/module) and drive it with
`VFX.emit(trail)` / `VFX.enable(trail)` / `VFX.disable(trail)`. See the
[Runtime API](/shipping/api).

## Related

- [Beam](/effects/beam) - the other transformable ribbon.
- [Batch tools](/tools/overview) - Shifter, Resizer, Retimer, Copier all work on trails.
