# 3D particle

SineVFX's signature effect. Select any **BasePart** (a Part, MeshPart, union, and so on) and
[Transform](/transform) turns it into a **3D particle** emitter, where **each particle
looks like that part**.

## What happens on transform

- The part's shape, material, colour, textures, and its **children** (meshes, decals,
  attachments, nested effects) become the particle's appearance.
- The original part stays in place as the emitter's root marker and turns invisible.
- A clone of it becomes the **RenderPart** template that every particle is spawned from.

So instead of being limited to flat particle textures, you emit **real 3D geometry**: rocks,
shards, leaves, glowing meshes, whatever the part is.

## Editing it

Open the [Properties window](/properties). A 3D particle exposes grouped channels such
as:

- **Appearance** - how each particle looks (colour, transparency, size, LightEmission /
  LightInfluence / Brightness for glow).
- **Emission** - Rate, Lifetime, Speed, EmitCount, EmitDelay, EmitDuration.
- **Shape / EmitterShape** - where and in what direction particles spawn.
- **Particles / Flipbook** - texture and sprite-sheet options (see below).
- **Collision, Optimization** - physics and performance.

Any numeric channel can be driven by a lifetime **[graph](/graph-editor)**.

## Flipbooks and mesh flipbooks

A **flipbook** plays a sprite sheet across a particle's life so a single particle animates
(smoke, fire, explosions). SineVFX exposes the flipbook layout and playback settings in the
**Flipbook** group.

**Mesh flipbooks** take the idea into 3D: instead of flipping frames of a 2D sprite, the
particle swaps through a sequence of **meshes** over its lifetime, so a mesh-based particle can
animate its geometry (a tumbling debris shape, a morphing blob) rather than just its texture.
Set these up in the emitter's mesh-flipbook settings, and they play back over the same lifetime
timeline as everything else.

## Nesting

A part placed inside another emitter's RenderPart template can itself be transformed into a
nested 3D particle, so you can layer effects (a glowing core that also sheds sparks, for
example). Nested `ParticleEmitter` / `Beam` / `Trail` / `Light` / `Sound` inside the template
can also fire on spawn (see [Emittable objects](/emittable)).

## Preview and ship

Preview with the [Emit window](/emit), then plant the
[runtime module](/module) and fire it with `VFX.emit(part)`. See the
[Runtime API](/api).

## Related

- [Transform](/transform) - how to run it.
- [Emittable objects](/emittable) - everything the Emit window can drive.
