# Transformable objects

SineVFX works by **transforming** ordinary Roblox instances into editable effects. Four kinds
of instance can be transformed, and each becomes a specific kind of effect.

Select one (or many) and run [Transform](/windows/transform).

## Part → 3D particle emitter

This is SineVFX's signature. Select any **BasePart** (a Part, MeshPart, union, etc.) and it
becomes a **3D particle emitter** where **each particle looks like that part**.

- The part's shape, material, colour, textures, and even its **children** (meshes, decals,
  attachments, nested effects) ride along and become the particle's appearance.
- The original part stays in place as the emitter's root marker (it turns invisible); only the
  spawned particles render.
- So instead of being limited to flat particle textures, you can emit **real 3D geometry** as
  particles: rocks, shards, leaves, glowing meshes, whatever the part is.

You can even nest a part inside another emitter's template to build layered effects.

## Trail → transformed trail

Select a **Trail** and it becomes a SineVFX-editable trail, with its properties exposed to the
[graph editor](/windows/graph-editor) so you can drive them over the effect's life.

## Beam → transformed beam

Select a **Beam** and it becomes a SineVFX-editable beam, again with graphable properties.

## Camera → camera effect

Select the **Camera** and it becomes a global [camera effect](/effects/camera) (shake, FOV,
blur). It has no position in the world and no particle count; it acts on the view.

## What isn't transformed directly

You don't transform a `ParticleEmitter` itself, or lights, or sounds. The Part-to-emitter
model gives you the particle system, and the [presets](/effects/presets) (Lightning, Orbit,
Bezier, Debris, Crater, and the base Beam / Trail) are pre-built transformed effects you can
drop in and edit.

## Notes

- Selecting a **Folder or Model** and emitting it fires every transformed effect inside it, so
  you can group a multi-part effect and drive it as one.
- Running Transform again on something already transformed (or **Untransform**) returns the
  plain instance. See [Transform](/windows/transform).
