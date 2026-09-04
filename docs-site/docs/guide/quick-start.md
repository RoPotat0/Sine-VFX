# Quick start

This walkthrough takes you from an ordinary part to a graphed, previewable, shippable effect.
A few minutes, start to finish.

## 1. Launch SineVFX

Open the **Plugins** tab and click **SineVFX**. Its floating controls appear in the corner of
the viewport, with entries for **Emit**, **Library**, **Tools**, **Paths**, **Module**, and
**Settings**.

## 2. Pick something to turn into particles

Add a **Part** to the Workspace and shape it however you want your particle to look, colour
and material included. That part is going to *become* the particle.

Prefer a head start? Drop in one of the [presets](/effects/presets) instead.

## 3. Transform it

Select the part. A **Transform** button appears near the controls, click it. The part becomes
a **3D particle emitter**: it turns invisible and now spawns copies of itself as particles.
See [Transformable objects](/effects/transformable) for what else can be transformed.

## 4. Edit its properties

Open the **Properties** window. The effect's channels are grouped into a collapsible tree,
Appearance, Emission, Shape, and so on. Change a value and it updates live. See
[Properties](/windows/properties).

## 5. Graph a value over the lifetime

Find a channel that supports a graph (for example **Transparency** or **Size**) and open its
**[graph editor](/windows/graph-editor)**. Drag the anchor points, pull the bezier handles for
smooth curves, and add an **envelope** for randomised spread. This is how you get motion that
feels alive instead of linear.

## 6. Preview it

Open the **Emit** window and hit **Emit** to fire a one-shot, or **Enable** to hold the effect
on. You're seeing the real thing, in edit mode, no Play button required. See
[Emit](/windows/emit).

## 7. Ship it

When you're happy, open **Module** and plant the SineVFX runtime into your game. Then, from a
LocalScript:

```lua
local VFX = require(game.ReplicatedStorage.SineVFX)

VFX.emit(myEffect)      -- one-shot burst
VFX.enable(myEffect)    -- hold it on
VFX.disable(myEffect)   -- turn it off
```

What you previewed is what your players get. Full details in
[The runtime module](/shipping/module) and the [Runtime API](/shipping/api).

::: tip Next steps
- Learn the [core concepts](/guide/concepts) behind transforms, graphs, and the runtime.
- Work through the [tutorials](/tutorials/).
- Batch-edit whole selections with the [Tools](/tools/overview).
:::
