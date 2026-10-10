# Trail

Select a **Trail** and run [Transform](/transform) to turn it into a SineVFX-editable
trail. Its properties are exposed to the [graph editor](/graph-editor) so they can be
driven over the effect's life, and it plays back with the same emit / enable / disable verbs as
everything else.

## What you get

- The trail's channels (width, transparency, colour, lifetime, and so on) become editable in
  the [Properties window](/properties).
- Numeric channels can be graphed over the effect's lifetime.
- Nested content rides along into a render template, the same way a
  [Part emitter](/part) keeps its children.

## Property reference

Every channel is a native `Trail` property that SineVFX exposes to the
[graph editor](/graph-editor), so most can animate over the effect's life.

| Property           | Meaning                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| **Color**          | Trail colour along its length / over lifetime.                              |
| **Transparency**   | Opacity along the trail · `0` solid, `1` invisible (usually fades to the tail). |
| **WidthScale**     | Multiplier on the trail's width from head to tail.                          |
| **Lifetime**       | How long each segment of the ribbon persists before it disappears.          |
| **Texture**        | Optional image tiled along the trail.                                       |
| **TextureLength**  | World length of one texture tile.                                           |
| **TextureMode**    | How the texture repeats: Stretch, Wrap, or Static.                          |
| **MinLength**      | Minimum travel distance before a new segment is drawn (smooths jitter).     |
| **FaceCamera**     | If on, the ribbon always turns to face the viewer.                          |
| **TimeScale**      | Playback speed. `1` normal, `2` twice as fast, `0.5` slow motion, `0` frozen. |
| **EmitDelay**      | Delay before the trail starts on emit.                                      |
| **EmitDuration**   | How long a single emit/enable cycle runs.                                   |

## Editing

Open [Properties](/properties) to tune the channels, [graph](/graph-editor)
the ones that should change over time, and [Color](/color) to recolour it.

## Preview and ship

Preview in the [Emit window](/emit) (a Trail is emittable, so it also has emit timing:
EmitDelay / EmitDuration). Plant the [runtime module](/module) and drive it with
`VFX.emit(trail)` / `VFX.enable(trail)` / `VFX.disable(trail)`. See the
[Runtime API](/api).

## Related

- [Beam](/beam) - the other transformable ribbon.
- [Batch tools](/overview) - Shifter, Resizer, Retimer, Copier all work on trails.
