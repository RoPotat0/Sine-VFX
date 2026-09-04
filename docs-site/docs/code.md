# Code

**Code** shows the ready-to-paste script that fires the selected effect at runtime, so you can
drop it straight into your game.

## Using it

1. Select a transformed effect.
2. Open **Tools → Code**.
3. Copy the snippet it shows and paste it into a **LocalScript**.

The snippet uses the [runtime module](/module) you plant with **Module**. It looks
like this:

```lua
local VFX = require(game.ReplicatedStorage.SineVFX)

VFX.emit(effect)      -- one-shot burst
VFX.enable(effect)    -- hold it on
VFX.disable(effect)   -- turn it off
```

The runtime also exposes the same three through `shared.sv`, so `shared.sv.emit(effect)` works
too once the module is required somewhere.

## Notes

- Plant the [runtime module](/module) first, or the `require` has nothing to load.
- Call it from the **client** (a LocalScript); effects render per-client. See the
  [Runtime API](/api).

## Related

- [The runtime module](/module) - plant it before using the code.
- [Runtime API](/api) - full details on emit / enable / disable.
