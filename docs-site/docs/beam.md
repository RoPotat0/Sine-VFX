# Beam

Select a **Beam** and run [Transform](/transform) to turn it into a SineVFX-editable
beam. Like the [Trail](/trail), its properties become graphable and it plays back with
the emit / enable / disable verbs.

## What you get

- The beam's channels (width, transparency, colour, curve, texture, and so on) become editable
  in the [Properties window](/properties).
- Numeric channels can be driven by a lifetime [graph](/graph-editor).
- Nested content rides along into a render template.

## Property reference

Every channel is a native `Beam` property that SineVFX exposes to the
[graph editor](/graph-editor), so most can animate over the effect's life.

| Property           | Meaning                                                                       |
| ------------------ | ----------------------------------------------------------------------------- |
| **Color**          | Beam colour across its length / over lifetime.                                |
| **Transparency**   | Opacity across the beam · `0` solid, `1` invisible.                           |
| **Width0**         | Width at the start (Attachment0) end.                                         |
| **Width1**         | Width at the end (Attachment1) end.                                           |
| **CurveSize0**     | Bezier handle at the start end - bends the beam's path.                       |
| **CurveSize1**     | Bezier handle at the end - bends the beam's path.                             |
| **Segments**       | How many pieces the beam is built from (higher = smoother curves).            |
| **Texture**        | Optional image tiled along the beam.                                          |
| **TextureLength**  | World length of one texture tile.                                             |
| **TextureSpeed**   | How fast the texture scrolls along the beam (great for energy/flow looks).    |
| **TextureMode**    | How the texture repeats: Stretch, Wrap, or Static.                            |
| **FaceCamera**     | If on, the beam always turns to face the viewer.                             |
| **TimeScale**      | Playback speed (also speeds up TextureSpeed). `1` normal, `0` frozen.         |
| **EmitDelay**      | Delay before the beam starts on emit.                                         |
| **EmitDuration**   | How long a single emit/enable cycle runs.                                     |

## Editing

Tune channels in [Properties](/properties), [graph](/graph-editor) the ones
that should animate, and recolour with the [Color tool](/color).

## Preview and ship

Preview in the [Emit window](/emit) (a Beam is emittable, with EmitDelay / EmitDuration
timing). Plant the [runtime module](/module) and drive it with `VFX.emit(beam)` /
`VFX.enable(beam)` / `VFX.disable(beam)`. See the [Runtime API](/api).

## Related

- [Trail](/trail) - the other transformable ribbon.
- [Batch tools](/overview) - all the batch editors work on beams too.
