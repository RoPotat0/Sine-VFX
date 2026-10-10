# Properties

The **Properties window** is where you actually edit a transformed effect. It replaces
squinting at Studio's property panel with a VFX-first layout: grouped, searchable, and wired
straight into the [graph editor](/graph-editor).

## The tree

Properties are shown as a **collapsible three-level tree**:

```
Class  ▸  Group  ▸  Property
```

- **Class** - the kind of effect (e.g. ParticleEmitter, Beam).
- **Group** - a logical grouping such as **Appearance**, **Emission**, **Shape**,
  **Particles**, **Flipbook**, **EmitterShape**, **Collision**, **Optimization**.
- **Property** - the individual channel you edit.

**Appearance** is ordered first for every class, since it's what you reach for most. Collapse
groups you're not using to keep the panel tidy.

## What gets edited

The window edits the effects you **actually selected**:

- Selecting an effect (or its `Properties` folder or RenderPart) edits that effect.
- Selecting a plain Part, Model or Folder does **not** pull in transformed effects hidden
  inside it. Select the effect itself.
- Effects nested inside a [3D particle](/part) are only edited when you pick them directly in
  the Explorer, so tweaking an emitter never silently changes what's inside it.
- Plain `ParticleEmitter`s still show up through their containers, as before.

Firing is different: the [Emit window](/emit) still fires everything inside your selection.

## Editing values

- **Numbers** - type a value, or scrub. Changes apply live.
- **Colours** - open the [Color tools](/color) for a full picker, palettes, and
  replace/shift operations.
- **Toggles** - checkboxes for booleans (a filled box is on, a dimmer fill means a mixed
  multi-selection). Some rows reveal or hide sub-rows depending on a toggle or value: a group
  only shows its options when its master toggle is on, and some rows only appear once a related
  value isn't zero (e.g. Lightning's ForkDepth appears once ForkChance is above 0).
- **Tooltips** - hover any row's label for a plain-language description, often with a
  "try X" range.
- **Number sequences** - a value that varies over lifetime. Type it as `top,bottom` to set a
  value with an envelope, or open the **[graph editor](/graph-editor)** for full
  curve control.

## Multi-select editing

Select several transformed effects and the Properties window edits them **together**.
Changing a channel applies to all of them. If you **Cancel**, every target is reverted -
both its value *and* its graph/bezier data - so a batch tweak is safe to back out of.

## Graph channels

Any channel that supports a lifetime graph shows a control to open the
[graph editor](/graph-editor). That's where transparency fades, size curves, and
shake profiles are shaped. Bezier data for a channel is stored on the instance, so it
survives closing and reopening the window.

## Tips

- Use the group ordering to your advantage - start in **Appearance**, then **Emission**,
  then **Shape**.
- For particle emitters, the **Particles**, **Flipbook**, and **EmitterShape** groups hold
  the texture, sprite-sheet, and shape controls respectively.
- Pair this window with the [Emit window](/emit) open so you can see each change
  play back immediately.
