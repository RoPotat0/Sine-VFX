# Your first effect

We'll build a burst of glowing particles from a single part, shape how they fade and shrink
over their life, preview it live, and wire it into your game. About ten minutes.

## What you'll end up with

A one-shot burst you can fire from a script with `VFX.emit(...)` - small glowing shards that
fade and shrink as they fly out.

## 1. Build the particle

1. Insert a **Part** into the Workspace.
2. Make it small (say `0.4, 0.4, 0.4`).
3. Give it the look you want each particle to have: set its **Color**, and its **Material**
   (Neon reads well for glowing effects).

Whatever this part looks like is what every particle will look like, so this step *is* your
particle art.

## 2. Transform it

Select the part and click **Transform**. It becomes a 3D particle emitter: the part goes
invisible and will now spawn copies of itself. (Details in
[Transformable objects](/effects/transformable).)

## 3. Set the emission

Open the **Properties** window and find the **Emission** group. Start with something like:

- **Rate** low (or 0 if you only want one-shot bursts).
- A short **Lifetime** so particles don't linger.
- A **Speed** high enough that they visibly fly outward.

Open the **Emit** window and hit **Emit** to see a burst. Adjust until the shape feels right.

## 4. Graph the fade

In **Properties**, find **Transparency** and open its **[graph editor](/windows/graph-editor)**.

- Set the start (time `0`) fully visible.
- Set the end (time `1`) fully transparent.
- Pull the bezier handles so it holds bright for a moment, then fades fast near the end.

Emit again - the particles now fade out instead of vanishing.

## 5. Graph the size

Do the same for **Size**: large at birth, shrinking toward `0` at death. Add a small
**envelope** so not every particle is identical, which reads as more natural.

## 6. Colour it (optional)

Open **[Tools → Color](/tools/color)** to fine-tune the colour, or give it a colour sequence
so it shifts over its life (bright core to a cooler tail, for example).

## 7. Preview the whole thing

With the **Emit** window open, **Emit** repeatedly (hold to repeat) and tweak until you like
it. Everything you see here is exactly what ships.

## 8. Ship it

1. Open **Module** and plant the runtime (it writes to `ReplicatedStorage.SineVFX`).
2. From a **LocalScript**, fire it where you want the burst:

```lua
local VFX = require(game.ReplicatedStorage.SineVFX)

local burst = workspace:WaitForChild("MyBurst")   -- your transformed part
VFX.emit(burst)
```

Done. See [The runtime module](/shipping/module) and the [Runtime API](/shipping/api) for
enabling/disabling held effects and playing for all players.

## Where to go next

- Try building the same idea from a **[preset](/effects/presets)** to see how a finished effect
  is structured.
- Batch-edit a whole scene of effects with the **[Tools](/tools/overview)**.
- Watch video walkthroughs in the **[#tutorials
  channel](https://discord.com/channels/1501090480828715028/1534366571093295277)** on the
  Discord.
