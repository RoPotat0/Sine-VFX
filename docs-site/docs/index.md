# Introduction

**SineVFX** is a visual effects authoring plugin for **Roblox Studio**. It gives you a
dedicated, VFX-focused editor on top of Roblox's native effect instances (`ParticleEmitter`,
`Beam`, `Trail`, lights, and more) and adds what Studio's own property panel is missing:
values that change over a particle's lifetime as smooth **graphs**, **live preview** in edit
mode, **batch tools** for editing many objects at once, and a **runtime** you drop into your
game so what you author is what your players see.

## Why use it

Building good VFX in Studio normally means fighting the number-sequence pickers, guessing at
values, and hitting Play over and over. SineVFX replaces that loop:

- **See it while you build it.** Emit and enable effects directly in edit mode.
- **Shape values as curves, not stair-steps.** Any numeric channel can be driven by a smooth
  bezier graph with envelopes.
- **Work on many objects at once.** Select a whole pile of emitters and shift, resize,
  retime, or recolour them in one action.
- **Ship what you see.** One generated module reproduces your effects at runtime with a tiny
  `VFX.emit(...)` call.

## What you can make

Particle bursts, beams and trails, orbiting and path-driven effects, lightning, impacts, and
anything you can build from Roblox's effect instances. SineVFX ships with a set of ready-made
[presets](/effects/presets) so you never start from a blank emitter.

## Where to go next

- **[Installation](/guide/installation)** puts the plugin in your Studio.
- **[Quick start](/guide/quick-start)** takes a plain emitter to a graphed, previewable
  effect in a few minutes.
- **[Transformable objects](/effects/transformable)** lists everything SineVFX can turn into
  an editable effect.
- **[Tutorials](/tutorials/)** walk through building real effects step by step.
- **[Shipping](/shipping/module)** covers planting the runtime and calling it from your game.

::: tip New here?
Start with **[Installation](/guide/installation)**, then the
**[Quick start](/guide/quick-start)**.
:::
