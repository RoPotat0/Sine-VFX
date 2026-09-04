# Runtime API

Once the [runtime module](/shipping/module) is planted at `ReplicatedStorage.SineVFX`, you
drive effects from your game with three functions — the same **emit / enable / disable**
verbs you use to preview in Studio.

## Requiring the module

```lua
local VFX = require(game.ReplicatedStorage.SineVFX)
```

Do this from a **client** context (LocalScript or a module required by one) — effects render
per‑client. See [client vs. server](/shipping/module#client-vs-server).

## The three functions

You pass the instance that holds (or contains) your transformed effect(s). The module finds
the tagged SineVFX effects under it and drives them.

### `VFX.emit(target)`

Fire a **one‑shot** play — a single burst over the effect's duration.

```lua
VFX.emit(workspace.Fireball.Explosion)
```

### `VFX.enable(target)`

Turn the effect **on and hold** it — it keeps playing until you disable it. Use this for
continuous effects (auras, persistent beams, ongoing shake).

```lua
VFX.enable(character.Aura)
```

### `VFX.disable(target)`

Turn the effect **off**, with a short fade‑out where it applies.

```lua
VFX.disable(character.Aura)
```

## A minimal example

```lua
-- LocalScript
local VFX = require(game.ReplicatedStorage.SineVFX)

local effect = workspace:WaitForChild("Fireball"):WaitForChild("Explosion")

-- one-shot on impact
VFX.emit(effect)

-- or hold an aura while a state is active
VFX.enable(character.Aura)
task.wait(3)
VFX.disable(character.Aura)
```

## Camera effects

[Transformed cameras](/effects/camera) respond to the same three verbs. Point the API at the
tagged Camera (or an instance containing it) and it drives the shake / FOV / blur. Remember
that FOV/blur/shake act on the client's view, so call it locally.

## Playing for all players

Because rendering is per‑client, to show an effect to everyone:

1. On the server, fire a `RemoteEvent` to the relevant clients.
2. On each client, call `VFX.emit(...)` in the event handler.

## Gotchas

- **Call from the client.** Calling `emit` / `enable` / `disable` from the server warns and
  won't render — rendering is client‑side.
- **Re‑plant after edits.** The module is a snapshot; re‑plant it when you change effects so
  the runtime matches your latest authoring. See
  [the runtime module](/shipping/module#re-plant-after-edits).
- **Wait for replication.** Use `WaitForChild` for effects that may not have replicated to
  the client yet.
