# Core concepts

A few ideas run through the whole plugin. Understand these and everything else clicks into
place.

## Transformed effects

SineVFX doesn't invent its own effect objects. Instead it **transforms** the native Roblox
instances you already know — `ParticleEmitter`, `Beam`, `Trail`, `PointLight`,
`SpotLight`, `Highlight`, `Sound`, and even the `Camera`.

Transforming an instance:

- **tags** it so SineVFX recognises it, and
- adds a **`Properties` folder** onto the instance holding SineVFX's extended settings.

Crucially this happens **in place** — no new parts, no reparenting. The object stays where
it is; it just gains superpowers. [Untransforming](/windows/transform) removes the tag and
folder and gives you the plain instance back.

## Channels and graphs

A **channel** is a single editable value — Transparency, Size, a shake's Strength, and so
on. SineVFX channels come in two flavours:

- **Scalars** — a single number or value (Rate, Lifetime, a colour).
- **Graphs (number sequences)** — a value that changes **over the particle's lifetime**
  (or over one "play" of the effect), driven by a curve you draw in the
  [graph editor](/windows/graph-editor).

Graphs are the heart of SineVFX. Instead of Roblox's coarse keypoints you get full
**bezier curves** with per‑anchor tangent handles, plus an **envelope** — a symmetric band
around the curve that randomises each particle for natural variation.

## The preview driver (edit‑mode playback)

Playing effects in edit mode needs something to run the simulation every frame. SineVFX
elects **one** plugin copy as the *preview driver* and it does the simulating. You don't
manage this — it's automatic — but it's why effects can play live without entering Play
mode. If preview ever goes silent after reopening the plugin, see the
[troubleshooting notes](/reference/faq).

## Emit, enable, disable

Every effect responds to three verbs — the same three you'll call at runtime:

| Verb        | Meaning                                                        |
| ----------- | ------------------------------------------------------------- |
| **Emit**    | Fire once. A single one‑shot play over the effect's duration. |
| **Enable**  | Turn on and hold — keeps playing until you disable it.        |
| **Disable** | Turn off, with a short fade‑out where it makes sense.         |

The [Emit window](/windows/emit) drives these in edit mode; the
[runtime API](/shipping/api) exposes the exact same three in your game.

## The runtime module

Your edits live on the instances in your place, but at runtime your game needs code to read
them and reproduce the effect. SineVFX **generates that code for you** — the
[runtime module](/shipping/module) — and plants it in `ReplicatedStorage.SineVFX`. You call
`VFX.emit / enable / disable` and it does the rest. Re‑plant it whenever you want the shipped
copy to match your latest edits.

## Presets

[Presets](/effects/presets) are ready‑made transformed effects — Lightning, Orbit, Bezier,
Debris, Crater, and the base Beam / Trail / ParticleEmitter — that you drop in and tweak,
so you're never starting from a blank emitter.
