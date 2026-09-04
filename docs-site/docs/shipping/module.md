# The runtime module

Everything you author in SineVFX lives on the instances in your place. To make those effects
**play in your running game**, SineVFX generates a **runtime module** and plants it into your
place. Your game code then calls a tiny API and the module reproduces the effect for real.

## Planting the module

1. Open the **Module** entry on the [Hub](/windows/overview).
2. Plant the module. SineVFX writes it to **`ReplicatedStorage.SineVFX`**.

That's it — the module is self‑contained. Ship your place and the effects go with it.

::: tip Re‑plant after edits
The module is a **snapshot** of your effect logic at plant time. Whenever you change effects
and want the shipped copy to match, **re‑plant** it. If in‑game playback ever looks out of
date, a re‑plant is the fix.
:::

## What gets planted

The generated module bundles SineVFX's particle/ribbon simulation and the
[Camera Effect](/effects/camera) driver, plus a small public surface:

```lua
local VFX = require(game.ReplicatedStorage.SineVFX)
```

exposing `VFX.emit`, `VFX.enable`, and `VFX.disable`. See the full
[Runtime API](/shipping/api).

## Client vs. server

Effects **render per‑client**. Call the API from a **LocalScript** (or a client‑side module),
not from the server. If you call it from a server context, SineVFX warns you — the effect
won't render for players because rendering is a client concern. To play an effect for
everyone, fire it on each client (e.g. via a RemoteEvent your server broadcasts).

## Where to call it from

A typical setup:

- Author and preview effects in Studio.
- Plant the module.
- From a LocalScript, `require` the module and call `VFX.emit(effectInstance)` when the
  effect should play (on a hit, a cast, a pickup, etc.).

Continue to the [Runtime API](/shipping/api) for the exact functions and arguments.
