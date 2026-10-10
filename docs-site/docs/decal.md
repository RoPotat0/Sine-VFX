# Decal

Select a **Decal** (or **Texture**) that sits on a part and run [Transform](/transform) to
turn it into a SineVFX **decal emitter**. Instead of one static image, it **spawns short-lived
decal copies** on the part, each animated over its life. Think decals that behave like
particles: scorch marks that fade, flashing runes, animated flipbook sprites, scrolling energy
surfaces.

## What happens on transform

- The decal is tagged in place and gains a `Properties` folder. It **must sit on a BasePart**,
  since a decal has to live on a part's face.
- The original turns into a hidden **source** marker (it goes invisible). On emit, SineVFX
  clones it onto the same part, ages each copy `0 -> 1` over its **Lifetime** along the
  Appearance graphs, then destroys it.
- Copies are temporary and never saved with your place. Fire several at once and they stack.

## Property reference

| Group          | Property         | Meaning                                                                     |
| -------------- | ---------------- | --------------------------------------------------------------------------- |
| **Emission**   | **Enabled**      | Keep emitting decals while on (same as the Emit window's Enable).          |
|                | **Rate**         | Decals spawned per second while enabled.                                    |
|                | **Lifetime**     | How long each decal lives, in seconds. Set Min < Max for a random length per decal. |
|                | **TimeScale**    | Playback speed. `1` normal, `2` twice as fast, `0.5` slow motion, `0` frozen. |
| **Appearance** | **Color**        | Tint over the decal's life (colour graph). White = the image's own colours. |
|                | **Transparency** | Opacity over life (graph). Defaults to a fade out.                          |
|                | **Face**         | Which side of the part each decal lands on: Top, Bottom, Front, Back, Left, Right, or **Random** (a random side per decal). |
| **Flipbook**   | **Mode**         | How the frames play: **OneShot** (every frame once over Lifetime), **Loop**, **PingPong**, or **Random** (a new random frame each tick). |
|                | **Framerate**    | Frames per second for Loop / PingPong / Random. Try 12-30.                  |
|                | **StartRandom**  | Each decal starts on a random frame.                                        |
| **Scroll**     | **ScrollU**      | *Texture only.* Slides the image sideways, in studs per second (graph).     |
|                | **ScrollV**      | *Texture only.* Slides the image up/down, in studs per second (graph).      |

### Flipbook frames

Frames are the numbered Decals inside `Properties/Flipbook/Frames`. The easy way to fill them:
select the transformed decal, pick a flipbook in the [Asset Library](/library) and apply it.
You can also drop numbered Decals into that folder yourself.

## Play model

- **Emit** spawns a burst of copies, once.
- **Enable** keeps spawning copies at **Rate** until you disable.
- **Disable** stops spawning; live copies finish their life.

## Tools

[Retimer](/retimer), [Shifter](/shifter), [Copier](/copier) and the [Color](/color) tool all
understand transformed decals, and the Particle Counter counts their live copies.

## Preview and ship

Preview in the [Emit window](/emit), then plant the [runtime module](/module) and drive it with
`VFX.emit(decal)` / `VFX.enable(decal)` / `VFX.disable(decal)`. See the [Runtime API](/api).
Re-plant the module after editing so the generated code includes the decal driver.

## Related

- [Light](/light) and [Highlight](/highlight) - the other copy-style emitters.
- [Asset Library](/library) - fill the flipbook frames in one click.
