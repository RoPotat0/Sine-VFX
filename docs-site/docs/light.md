# Light

Select a **Light** (PointLight, SpotLight, or SurfaceLight) and run
[Transform](/transform) to turn it into a SineVFX **light emitter**. Instead of a static
light, it **spawns short-lived light copies** on emit, each one animated over its life, so you
get flashes, pulses, and glows that fire on cue like any other effect.

## What happens on transform

- The light is tagged in place and gains a `Properties` folder, seeded from its current
  Brightness, Range, and Color. The light **stays** on its parent (unlike the
  [Screen Effect](/camera), lights persist).
- The original turns into the hidden **source** template. On emit, SineVFX clones it into
  the source's parent, ages each copy `0 -> 1` over its **Lifetime** along the Appearance
  graphs, then destroys it.
- Because lights don't move, this is a **copy** model, not a moving-particle one. Fire several
  at once and their brightness stacks on the part.

## Property reference

| Group          | Property        | Meaning                                                              |
| -------------- | --------------- | -------------------------------------------------------------------- |
| **Emission**   | **Enabled**     | Master toggle. Drives the runtime the same as the Emit window's Enable. |
|                | **Rate**        | Copies spawned per second while enabled (`0` = one held play).       |
|                | **Lifetime**    | How long each light copy lives before it fades out and is destroyed. |
|                | **EmitCount**   | How many copies a single **Emit** burst spawns.                     |
| **Appearance** | **Brightness**  | Light intensity over the copy's life (graph). Shape it for a flash-and-fade. |
|                | **Range**       | Light reach in studs over life (graph).                             |
|                | **Color**       | Light colour over life (colour graph).                              |

Author the graphs so `t = 1` lands back at rest, so a copy fades out cleanly instead of
popping.

## Play model

Same **emit / enable / disable** verbs as everything else:

- **Emit** spawns `EmitCount` copies, once.
- **Enable with Rate > 0** spawns a copy every `1 / Rate` seconds until you disable.
- **Enable with Rate 0** holds one play until disable.

## Nesting

A transformed Light placed inside an emitter's RenderPart template **bursts on spawn**, so
each particle can carry its own light (a glowing shard, a spark that actually lights the
scene).

## Preview and ship

Preview in the [Emit window](/emit), then plant the [runtime module](/module)
and drive it with `VFX.emit(light)` / `VFX.enable(light)` / `VFX.disable(light)`. See the
[Runtime API](/api). Re-plant the module after editing so the generated code includes
your light driver.

## Related

- [Highlight](/highlight) - the other transformable adornment effect.
- [Emittable objects](/emittable) - plain lights can also fire without transforming.
