# Introduction

**SineVFX** is a visual‑effects authoring plugin for **Roblox Studio**. It gives you a
dedicated, VFX‑focused properties editor that sits on top of Roblox's native effect
instances — `ParticleEmitter`, `Beam`, `Trail`, lights, and more — and adds the things
Studio's built‑in property panel is missing: **graph‑driven values over a particle's
lifetime**, a proper **bezier curve editor**, **live preview** in edit mode, **batch
tools** for reshaping whole selections at once, and a **runtime module** you plant into
your game so the effects you author play back exactly the same for your players.

## Why SineVFX exists

Authoring good VFX in Studio normally means fighting the number‑sequence pickers, guessing
at values, and hitting Play over and over to see the result. SineVFX replaces that loop:

- **See it while you build it.** Emit and enable effects directly in edit mode.
- **Shape values as curves, not stair‑steps.** Every numeric channel can be driven by a
  smooth bezier graph with envelopes, instead of Roblox's coarse keypoints.
- **Work on many objects at once.** Select fifty emitters and shift, resize, retime, or
  recolour them in one action.
- **Ship what you see.** A single generated module reproduces your effects at runtime with
  a tiny `VFX.emit(...)` call.

## What you can make

Particle bursts, beams and trails, orbiting and bezier‑path effects, lightning, debris and
crater impacts, camera shake / FOV / blur — and anything you can build out of Roblox's
effect instances. SineVFX ships with a set of ready‑made [presets](/effects/presets) to
start from.

## How the docs are organised

- **[Getting started](/guide/installation)** — install it, and build your first effect.
- **[The interface](/windows/overview)** — the Hub and each window, one at a time.
- **[Tools](/tools/overview)** — the batch editing tools.
- **[Effects](/effects/presets)** — presets and the camera effect.
- **[Shipping](/shipping/module)** — planting the runtime and calling it from your game.
- **[Reference](/reference/settings)** — settings, themes, and troubleshooting.

::: tip New here?
Jump straight to the **[Quick start](/guide/quick-start)** — it takes a stock
ParticleEmitter to a graphed, previewable effect in a few minutes.
:::
