# Objects & effects

SineVFX works by **transforming** ordinary Roblox instances into editable effects. Four kinds
of object can be transformed, each with its own page:

| Object                                  | Becomes                                             |
| --------------------------------------- | --------------------------------------------------- |
| **[Part](/effects/part)**               | A [3D particle](/effects/part) (the part *is* the particle) |
| **[Trail](/effects/trail)**             | A graphable transformed trail                       |
| **[Beam](/effects/beam)**               | A graphable transformed beam                        |
| **[Camera](/effects/camera)**           | A global camera effect (shake / FOV / blur)         |

Select one (or several), then run [Transform](/windows/transform). SineVFX can also drive plain
Roblox effect instances without transforming them, see
[Emittable objects](/effects/emittable).

## How it works in general

Transforming an object tags it as a SineVFX effect and lays down a **`Properties` folder** of
grouped settings that the [Properties window](/windows/properties) edits. Every channel can be
a scalar or a lifetime **[graph](/windows/graph-editor)**, and every effect responds to the
same **emit / enable / disable** verbs in the [Emit window](/windows/emit) and at
[runtime](/shipping/api).

Running Transform again, or **Untransform**, returns the plain instance. Studio's **Ctrl+Z**
reverts a transform cleanly.

## Not transformed, but still driven

You don't transform a `ParticleEmitter`, a light, or a sound. The [Part](/effects/part) model
gives you the particle system, but SineVFX can still **emit and enable** those plain instances
directly. See [Emittable objects](/effects/emittable) for the full list of what the
[Emit window](/windows/emit) can drive.

::: tip
Group several transformed effects under a Folder or Model and emitting the container fires all
of them, so a multi-part effect plays as one.
:::
