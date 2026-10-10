# Screen Effect

SineVFX turns a **Screen Effect** into a first-class, view-wide effect: **shake**, **FOV
punch**, **blur**, **colour grading**, **bloom** and full-screen **impact frames**, all graphed
and previewable exactly like any particle effect. A **Distance** falloff can fade the whole
thing based on how close the camera is.

::: tip Formerly the "Camera Effect"
This used to transform `workspace.Camera` directly, but Roblox never serializes the Camera,
so the effect vanished on save/reopen. It now lives on a **Configuration** instead, which
persists cleanly. The URL stays `/camera`.
:::

## Transforming a Screen Effect

Insert a **Configuration**, select it, and run [Transform](/transform). SineVFX tags it and
adds a `Properties` folder **in place**, just like transforming a Beam or Trail. It acts on the
view, so there's no particle count.

It's **not a singleton**: transform as many Screen Effects as you like and the runtime sums
their contributions. Each sub-effect has its own on/off toggle, and its settings only show once
that toggle is on.

::: tip Put it where the action is
A Screen Effect can sit anywhere, including inside a [3D particle](/part) or a model. Emitting
the container from the [Emit window](/emit) fires it too, and with **Distance** on, the effect
can fade based on how far the camera is from its parent.
:::

## Emission

| Property      | Meaning                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------- |
| **Enabled**   | Run the effect continuously while on (same as the Enable button).                        |
| **Rate**      | While enabled, replays per second. `0` = ramp in and hold steady while enabled.          |
| **Lifetime**  | Length of one play, in seconds. Set Min < Max for a random length each play.             |
| **TimeScale** | Playback speed. `1` normal, `2` twice as fast, `0.5` slow motion, `0` frozen.            |

## The sub-effects

### Shake

A self-contained noise-based camera shake. Every channel is a **graph** sampled over each play.

| Channel        | Meaning                                                           |
| -------------- | ---------------------------------------------------------------- |
| **Strength**   | Overall shake amount.                                            |
| **Frequency**  | How fast the shake moves.                                        |
| **Position**   | Positional sway, in studs.                                       |
| **Rotation**   | Rotational sway, in degrees.                                     |
| **Smoothness** | `0` = raw, choppy shake · `1` = heavily smoothed.                |

### FOV

A field-of-view **punch**, driven by the **Offset** graph. Negative zooms in. SineVFX can push
FOV beyond Roblox's hard 120° cap by spilling the excess into a camera distortion trick, so you
get dramatic fisheye punches that Roblox alone won't allow.

### Blur

A `BlurEffect` with its **Size** driven by a graph. It ramps in and clears itself when the
effect ends.

### ColorGrade

Grades the whole screen over the play: hit flashes, red damage tints, washed-out slow-mo. It
**adds onto your game's own ColorCorrectionEffect** if there is one (and puts it back exactly
as it was afterwards), otherwise it uses its own.

| Channel        | Meaning                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| **Tint**       | Screen tint over the effect (colour graph). White = no tint.            |
| **Brightness** | `-1` black, `1` white. A quick `0.6 -> 0` graph is a white hit flash.    |
| **Contrast**   | Above 0 = harsher darks and lights, below 0 = flatter.                   |
| **Saturation** | `-1` = black and white, above 0 = more vivid.                            |

### Bloom

Makes bright things glow harder over the play, on top of your game's own bloom.

| Channel       | Meaning                                                              |
| ------------- | -------------------------------------------------------------------- |
| **Intensity** | Glow strength (graph). Try 0.5-2.                                    |
| **Size**      | How far the glow spreads, in pixels (graph).                         |
| **Threshold** | How bright something must be to glow. `1` = only pure white, `0` = everything. |

### ImpactFrames

Flashes a sequence of images over the whole screen, the anime impact-frame look. Frames are the
numbered Decals in `Properties/ImpactFrames/Frames`. The quick way: select the Screen Effect,
pick a flipbook (or one of your own **Impact Frame** uploads) in the [Asset Library](/library)
and apply it.

| Channel          | Meaning                                                                       |
| ---------------- | ----------------------------------------------------------------------------- |
| **Mode**         | **OneShot** = every frame once, spread over Lifetime. **Loop** / **PingPong** = cycle at Framerate. **Random** = a new random frame each tick (impact flicker). |
| **Framerate**    | Frames per second (not used by OneShot). Try 12-30.                           |
| **Speed**        | Playback speed of the frames *and* their graphs. `2` finishes halfway through Lifetime. |
| **Delay**        | Seconds after the effect starts before the frames appear. Not affected by Speed. The effect keeps running until the frames finish, so they never get cut off. |
| **Color**        | Image tint over the effect (colour graph).                                    |
| **Transparency** | Image transparency over the effect (graph).                                   |
| **Zoom**         | Image size, `1` = fills the screen (graph). A quick `1.2 -> 1` is a punch-in. |
| **Rotation**     | Image rotation in degrees (graph).                                            |
| **Scale**        | **Crop** fills the screen keeping the image's shape, **Fit** shows the whole image, **Stretch** fills and squashes. |
| **Layer**        | DisplayOrder of the overlay. Higher draws over more of your game's UI.        |

Frames are preloaded, so they don't blink on the first play.

### Distance

Scales **every** sub-effect above by how close the camera is to the effect's source: full
strength within **Near**, fading along the **Falloff** graph to nothing at **Far**.

| Channel     | Meaning                                                                          |
| ----------- | -------------------------------------------------------------------------------- |
| **From**    | **Parent** = the part or attachment the effect sits in. **Position** = a world point. **Object** = any part, model or attachment you pick. |
| **Point**   | World position (Position mode).                                                  |
| **Object**  | The instance to measure from (Object mode). Set it via the ObjectValue's Value.  |
| **Near**    | Full strength while the camera is within this many studs. Try 5-30.              |
| **Far**     | No effect once the camera is this far away. Try 50-300.                          |
| **Falloff** | Strength from Near (left) to Far (right). Default fades evenly to nothing.       |

Great for explosions that only shake the players standing near them.

## Play model

Same **emit / enable / disable** verbs as everything else:

- **Emit** - one play, over Lifetime.
- **Enable with Rate 0** - ramps to the graph's end and **holds** until you disable
  (short release fade on disable).
- **Enable with Rate > 0** - **pulses** a play every `1 / Rate` seconds.

**Rate is read live**, so changing it while enabled switches instantly between hold and pulse.

## Previewing

Transformed Screen Effects show up in the [Emit window](/emit). Emit and Enable drive every
sub-effect live in edit mode. The camera writes ride your normal navigation and zoom, so you can
keep flying the viewport while it shakes.

## Tools

The batch tools understand Screen Effects: [Retimer](/retimer) scales Lifetime, Rate, Frequency
and the impact frame timing, [Resizer](/resizer) scales shake Position and the Distance range,
and [Shifter](/shifter) / [Copier](/copier) list the shake, FOV, blur, ColorGrade, Bloom,
ImpactFrames and Distance settings (Copier copies the impact frames too).

## Shipping it

The Screen Effect ships in the [runtime module](/module) like everything else. Re-plant the
module after editing so the generated code includes the latest driver. At runtime it acts on
the local player's `CurrentCamera`, so drive it from the client.

::: tip
Shape the Strength curve for a sharp initial jolt that settles, keep Smoothness up for a
cinematic feel, and layer a short ColorGrade Brightness flash with a couple of impact frames
for a punchy hit.
:::
