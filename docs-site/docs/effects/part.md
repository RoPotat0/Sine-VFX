# Part → 3D emitter

This is SineVFX's signature transform. Select any **BasePart** (a Part, MeshPart, union, and
so on) and it becomes a **3D particle emitter** where **each particle looks like that part**.

## What happens on transform

- The part's shape, material, colour, textures, and its **children** (meshes, decals,
  attachments, nested effects) become the particle's appearance.
- The original part stays in place as the emitter's root marker and turns invisible.
- A clone of it becomes the **RenderPart** template that every particle is spawned from.

So instead of being limited to flat particle textures, you emit **real 3D geometry**: rocks,
shards, leaves, glowing meshes, whatever the part is.

## Editing it

Open the [Properties window](/windows/properties). A 3D emitter exposes grouped channels such
as:

- **Appearance** - how each particle looks.
- **Emission** - Rate, Lifetime, Speed, EmitCount, EmitDelay, EmitDuration.
- **Shape / EmitterShape** - where and in what direction particles spawn.
- **Particles / Flipbook** - texture and sprite-sheet options.
- **Collision, Optimization** - physics and performance.

Any numeric channel can be driven by a lifetime **[graph](/windows/graph-editor)**.

## Nesting

A part placed inside another emitter's RenderPart template can itself be transformed into a
nested 3D emitter, so you can layer effects (a glowing core that also sheds sparks, for
example).

## Preview and ship

Preview with the [Emit window](/windows/emit), then plant the
[runtime module](/shipping/module) and fire it with `VFX.emit(part)`. See the
[Runtime API](/shipping/api).

## Related

- [Transform](/windows/transform) - how to run it.
- [Presets](/effects/presets) - pre-built Part-based effects (Lightning, Orbit, Bezier,
  Debris, Crater).
