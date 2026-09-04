# Quick start

This walkthrough takes you from a plain ParticleEmitter to a graphed, previewable,
shippable effect. Five minutes, start to finish.

## 1. Launch SineVFX

Open the **Plugins** tab and click **SineVFX**. The **Hub** button (the FAB) appears in the
corner of the viewport. Click it to expand the menu strip:

> **Emit · Library · Tools · Paths · Module · Settings**

## 2. Create something to work on

Add a `ParticleEmitter` to a part in the Workspace (or drop in one of the
[presets](/effects/presets) to start from a good‑looking base). Select it.

## 3. Transform it

With the emitter selected, run **Transform**. SineVFX tags the instance and adds a
`Properties` folder to it **in place** — no new parts are created, your object stays exactly
where it is. It's now a SineVFX‑editable effect. See [Transform](/windows/transform).

## 4. Edit its properties

Open the **Properties** window. You'll see the effect's channels grouped into a collapsible
tree — Appearance, Emission, Shape, and so on. Change a value and it updates live. See
[Properties](/windows/properties).

## 5. Graph a value over the lifetime

Find a numeric channel that supports a graph (for example **Transparency** or **Size**) and
open its **[graph editor](/windows/graph-editor)**. Drag the anchor points, pull the bezier
handles for smooth curves, and add an **envelope** for randomised spread. This is how you get
motion that feels alive instead of linear.

## 6. Preview it

Open the **Emit** window and hit **Emit** to fire a one‑shot, or **Enable** to hold the
effect on. You're seeing the real thing, in edit mode — no Play button required. See
[Emit](/windows/emit).

## 7. Ship it

When you're happy, open **Module** and plant the SineVFX runtime into your game. Then, from
your own scripts:

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
- Batch‑edit whole selections with the [Tools](/tools/overview).
- Add [camera shake / FOV / blur](/effects/camera).
:::
