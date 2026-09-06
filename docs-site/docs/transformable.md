# Objects & effects

SineVFX works by **transforming** ordinary Roblox instances into editable effects. These kinds
of object can be transformed, each with its own page:

| Object                              | Becomes                                                     |
| ----------------------------------- | ----------------------------------------------------------- |
| **[Part](/part)**                   | A [3D particle](/part) (the part *is* the particle)         |
| **[Trail](/trail)**                 | A graphable transformed trail                               |
| **[Beam](/beam)**                   | A graphable transformed beam                                |
| **[Light](/light)**                 | A light emitter (PointLight / SpotLight / SurfaceLight)     |
| **[Highlight](/highlight)**         | A highlight emitter (outline / fill flashes)                |
| **[Screen Effect](/camera)**        | A global view effect (shake / FOV / blur)                   |

Select one (or several), then run [Transform](/transform). SineVFX can also drive plain
Roblox effect instances without transforming them, see
[Emittable objects](/emittable).

## How it works in general

Transforming an object tags it as a SineVFX effect and lays down a **`Properties` folder** of
grouped settings that the [Properties window](/properties) edits. Every channel can be
a scalar or a lifetime **[graph](/graph-editor)**, and every effect responds to the
same **emit / enable / disable** verbs in the [Emit window](/emit) and at
[runtime](/api).

Running Transform again, or **Untransform**, returns the plain instance. Studio's **Ctrl+Z**
reverts a transform cleanly.

## Not transformed, but still driven

You don't transform a `ParticleEmitter` or a `Sound`. The [Part](/part) model gives you
the particle system, but SineVFX can still **emit and enable** those plain instances directly.
Lights and Highlights can be **either** transformed (see [Light](/light) /
[Highlight](/highlight)) or driven plain. See [Emittable objects](/emittable)
for the full list of what the [Emit window](/emit) can drive.

::: tip
Group several transformed effects under a Folder or Model and emitting the container fires all
of them, so a multi-part effect plays as one.
:::
