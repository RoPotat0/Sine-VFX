# Quick start

This walkthrough takes you from an ordinary part to a graphed, previewable, shippable effect.
A few minutes, start to finish.

## 1. Launch SineVFX

Open the **Plugins** tab and click **SineVFX**. Its [hub](/settings#the-hub) appears in the
corner of the viewport: one bar with an icon for every tool. Hover an icon to see what it does.

## 2. Pick something to turn into particles

Add a **Part** to the Workspace and shape it however you want your particle to look, colour
and material included. That part is going to *become* the particle.

## 3. Transform it

Open the **Properties** window and select the part. A **Transform** button appears beside the
search bar, click it. The part becomes
a **3D particle emitter**: it turns invisible and now spawns copies of itself as particles.
See [Transformable objects](/transformable) for what else can be transformed.

## 4. Edit its properties

The **Properties** window now shows the effect's channels, grouped into a collapsible tree,
Appearance, Emission, Shape, and so on. Change a value and it updates live. See
[Properties](/properties).

## 5. Graph a value over the lifetime

Find a channel that supports a graph (for example **Transparency** or **Size**) and open its
**[graph editor](/graph-editor)**. Drag the anchor points, pull the bezier handles for
smooth curves, and add an **envelope** for randomised spread. This is how you get motion that
feels alive instead of linear.

## 6. Preview it

Open the **Emit** window and hit **Emit** to fire a one-shot, or **Enable** to hold the effect
on. You're seeing the real thing, in edit mode, no Play button required. See
[Emit](/emit).

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
[The runtime module](/module) and the [Runtime API](/api).

::: tip Next steps
- Learn the [core concepts](/concepts) behind transforms, graphs, and the runtime.
- Work through the [tutorials](/tutorials).
- Batch-edit whole selections with the [Tools](/overview).
:::
