# Core concepts

A few ideas run through the whole plugin. Understand these and everything else clicks into
place.

## Transformed effects

SineVFX doesn't invent its own effect objects. Instead it **transforms** native Roblox
instances into editable effects. The headline case is a **Part**, which becomes a **3D
particle emitter** whose particles look like that part. You can also transform a **Trail**, a
**Beam**, or the **Camera**. See [Transformable objects](/effects/transformable) for the full
list.

Transforming an instance:

- **tags** it so SineVFX recognises it, and
- adds a **`Properties` folder** of grouped settings that the
  [Properties window](/windows/properties) edits.

[Untransforming](/windows/transform) removes the tag and template and gives you the plain
instance back.

## Channels and graphs

A **channel** is a single editable value - Transparency, Size, a beam's Width, and so on.
SineVFX channels come in two flavours:

- **Scalars** - a single number or value (Rate, Lifetime, a colour).
- **Graphs (number sequences)** - a value that changes **over the particle's lifetime**
  (or over one "play" of the effect), driven by a curve you draw in the
  [graph editor](/windows/graph-editor).

Graphs are the heart of SineVFX. Instead of Roblox's coarse keypoints you get full
**bezier curves** with per-anchor tangent handles, plus an **envelope** - a symmetric band
around the curve that randomises each particle for natural variation.

## The preview driver (edit-mode playback)

Playing effects in edit mode needs something to run the simulation every frame. SineVFX
elects **one** plugin copy as the *preview driver* and it does the simulating. You don't
manage this - it's automatic - but it's why effects can play live without entering Play
mode. If preview ever goes silent after reopening the plugin, see the
[troubleshooting notes](/reference/faq).

## Emit, enable, disable

Every effect responds to three verbs - the same three you'll call at runtime:

| Verb        | Meaning                                                        |
| ----------- | ------------------------------------------------------------- |
| **Emit**    | Fire once. A single one-shot play over the effect's duration. |
| **Enable**  | Turn on and hold - keeps playing until you disable it.        |
| **Disable** | Turn off, with a short fade-out where it makes sense.         |

The [Emit window](/windows/emit) drives these in edit mode; the
[runtime API](/shipping/api) exposes the exact same three in your game.

## The runtime module

Your edits live on the instances in your place, but at runtime your game needs code to read
them and reproduce the effect. SineVFX **generates that code for you** - the
[runtime module](/shipping/module) - and plants it in `ReplicatedStorage.SineVFX`. You call
`VFX.emit / enable / disable` and it does the rest. Re-plant it whenever you want the shipped
copy to match your latest edits.

## Emittable objects

Alongside the transformed effects, SineVFX can drive plain Roblox effect instances too, so an
existing `ParticleEmitter`, `Beam`, `Trail`, `Light`, or `Sound` responds to the same
emit / enable / disable controls. See [Emittable objects](/effects/emittable).
