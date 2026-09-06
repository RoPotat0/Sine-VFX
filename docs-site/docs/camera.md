# Screen Effect

SineVFX turns a **Screen Effect** into a first-class, view-wide effect - **shake**, **FOV
punch**, and **blur** - graphed and previewable exactly like any particle effect.

::: tip Formerly the "Camera Effect"
This used to transform `workspace.Camera` directly, but Roblox never serializes the Camera,
so the effect vanished on save/reopen. It now lives on a **Configuration** instead, which
persists cleanly. The URL stays `/camera`; the effect is the same shake / FOV / blur.
:::

## Transforming a Screen Effect

Insert a **Configuration** (Model > Advanced, or any Configuration instance), select it, and
run [Transform](/transform). SineVFX tags it and adds a `Properties` folder **in
place** - no new parts, just like transforming a Beam or Trail. It becomes a **global** effect:
there's no position in the world and no particle count - it's a single effect that acts on the
view.

It's **not a singleton**: transform as many Screen Effects as you like and the runtime sums
their contributions.

## The three sub-effects

### Shake

A self-contained noise-based camera shake. Its channels are all **graphs** sampled over each
play:

| Channel        | Meaning                                                           |
| -------------- | ---------------------------------------------------------------- |
| **Strength**   | Overall shake amount.                                            |
| **Frequency**  | How fast the shake oscillates.                                   |
| **Position**   | Positional shake contribution.                                   |
| **Rotation**   | Rotational shake contribution.                                   |
| **Smoothness** | `0` = raw, choppy white-noise shake · `1` = heavily low-passed and smooth. |

### FOV

A field-of-view **punch**, driven by a graph (`FOVOffset`). SineVFX can push FOV beyond
Roblox's hard 120° cap by spilling the excess into a camera distortion trick, so you get
dramatic wide-angle punches that Roblox alone won't allow.

### Blur

A `BlurEffect` on Lighting, with its **BlurSize** driven by a graph. It ramps in and
auto-clears when the effect disables.

## Play model

The camera effect uses the same **emit / enable / disable** verbs as everything else, plus an
**emission** model for how it repeats:

- **Emit** - one play, over the effect's duration.
- **Enable with Rate 0** - ramps to the graph's end and **holds** until you disable
  (short release fade on disable).
- **Enable with Rate > 0** - **pulses** a play every `1 / Rate` seconds.

**Rate is read live**, so changing it while the effect is enabled switches instantly between
hold and pulse. The [Emit window's](/emit) duration controls how long the effect
stays enabled over a repeat cycle.

## Previewing

Transformed Screen Effects show up in the [Emit window](/emit) - Emit and Enable drive
the shake / FOV / blur just like a particle effect, live in edit mode. The camera writes ride
your normal navigation and zoom, so you can keep flying the viewport while it shakes.

## Shipping it

The camera effect ships in the [runtime module](/module) like everything else -
re-plant the module after editing so the generated code includes your camera driver. At
runtime the effect acts on whatever camera it's told to (typically the local player's
`CurrentCamera`).

::: tip
Because it's a real transformed instance, everything you know about graphs and envelopes
applies here - shape the Strength curve for a sharp initial jolt that settles, and keep
Smoothness up for a cinematic feel.
:::
