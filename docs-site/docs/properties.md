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

## Editing values

- **Numbers** - type a value, or scrub. Changes apply live.
- **Colours** - open the [Color tools](/color) for a full picker, palettes, and
  replace/shift operations.
- **Toggles** - checkboxes for booleans. Some rows reveal or hide sub-rows depending on a
  toggle (for example a group only shows its options when its master toggle is on).
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
