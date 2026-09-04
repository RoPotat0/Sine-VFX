# Transform

**Transform** is the gateway into SineVFX. Before you can graph or preview an effect, you
transform its instance so the plugin can manage it.

## What transforming does

Select a supported instance and run Transform. SineVFX:

1. **Tags** the instance so it's recognised as a SineVFX effect.
2. Adds a **`Properties` folder** onto the instance holding the extended, graphable
   settings that the [Properties window](/windows/properties) edits.

This is done **in place**. No new parts are created, nothing is reparented, and the object
stays exactly where it was. A transformed Beam is still that same Beam — it just carries
SineVFX's settings now.

## Supported instances

| Instance          | Becomes                     |
| ----------------- | --------------------------- |
| `ParticleEmitter` | Transformed particle effect |
| `Beam`            | Transformed beam            |
| `Trail`           | Transformed trail           |
| `PointLight` / `SpotLight` / `SurfaceLight` | Transformed light |
| `Highlight`       | Transformed highlight       |
| `Sound`           | Transformed sound           |
| `Camera`          | [Camera Effect](/effects/camera) |

You can select and transform **many instances at once**.

## Untransforming

Running Transform again on an already‑transformed instance (or using **Untransform**)
removes the tag and the `Properties` folder, returning the plain Roblox instance. Your
underlying Beam/Trail/emitter is untouched.

::: warning
Untransforming discards the SineVFX‑specific settings stored in the `Properties` folder
(graphs, envelopes, extended options). The native properties of the instance remain.
:::

## The Camera is special

Transforming the `Camera` gives you a global **[Camera Effect](/effects/camera)** — shake,
FOV punch, and blur — rather than a spatial particle effect. It behaves like any other
transformed effect (emit / enable / disable, graphed channels) but with no count and no
position in the world. See its [dedicated page](/effects/camera).

## Next

With something transformed, open the [Properties window](/windows/properties) to start
editing it.
