# Lightning

**Lightning mode** turns a [3D particle](/part) into a **lightning bolt**. Each particle
becomes a jagged bolt made of copies of the emitter's RenderPart. You get zig-zags, branches,
crackle, growing strikes, and bolts that hit surfaces. Everything is still driven by the same
emitter, so Rate, Lifetime, EmitCount and the [graph editor](/graph-editor) work as usual.

## Turning it on

1. Select a 3D particle emitter (or [Transform](/transform) a part into one).
2. In [Properties](/properties), open the **Lightning** section and switch on **Lightning**.
3. [Emit](/emit) it. Each particle is now a bolt shooting out along the emitter's direction.

Once Lightning is on, the Properties window hides the settings that don't apply to a bolt
(Size, Speed, Rotation, Acceleration, Flipbook, Nested and so on). The bolt settings
appear inside the normal sections, so you'll find them where you'd expect: thickness under
**Appearance**, growth under **Emission**, zig-zag shape under **Shape**.

::: tip What the bolt is made of
Every segment of the bolt is a copy of the **RenderPart**, so its material, colour and
transparency decide how the bolt looks. A Neon part with high LightEmission gives the
classic glowing bolt. A **Highlight** inside the RenderPart is applied once per bolt, not
once per segment. Roblox shows about 31 Highlights at a time, so very large numbers of
highlighted bolts will drop some outlines.
:::

## Where the bolt strikes

The bolt's target comes from the **Particles → Route** setting:

| Route       | The bolt...                                                                    |
| ----------- | ------------------------------------------------------------------------------ |
| **Default** | Shoots straight along the emitter's direction for **Length** studs.            |
| **Center**  | Strikes the emitter's centre.                                                  |
| **Custom**  | Strikes one of your custom targets.                                            |

With **Custom** and **RoutePick = InOrder**, the bolt instead becomes a **path through every
target** in order, like a chain of lightning hopping between points. **RouteSmooth** rounds
off the corners between targets.

### Striking surfaces

Turn on **Collision → StrikeSurface** (Default route only) for ground and wall strikes.
When a bolt spawns, it checks for a surface within its Length along its direction. If it
finds one, the bolt ends exactly on that surface and stays attached to the part it hit. If
nothing is in range, that bolt doesn't fire at all. Point the emitter down for lightning
that hits the ground.

Plain **Collisions** also works: the bolt and its branches stop at the first surface they
touch.

## Property reference

### Lightning section

| Property       | Meaning                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| **Lightning**  | The on/off toggle. Turns each 3D particle into a bolt.                                                      |
| **Style**      | How the bolt moves. **Jitter** snaps to a new random shape (classic lightning). **Scroll** sends a smooth wave flowing along it (energy beam). **JitterScroll** does both. |
| **JitterRate** | How many times per second the bolt snaps to a new shape (graph). 10-20 crackles, 30+ is frantic, 0 freezes it. In Scroll it only re-rolls the branches. |
| **ScrollSpeed**| *Scroll styles.* How fast the wiggle travels along the bolt, in waves per second. Negative flows the other way. |
| **Waves**      | *Scroll styles.* How many wiggles fit along the bolt.                                                        |
| **ForkChance** | How often branches split off (0 to 1). 0 = none, 0.3 = a few, 0.8 = lots.                                    |
| **ForkDepth**  | 1 = branches come off the main bolt. 2 = branches grow their own smaller branches too.                       |
| **ForkLength** | Branch size compared to what it grows from (0.4 = 40%). Branches are thinner and calmer by the same amount.  |

ForkDepth and ForkLength only show once ForkChance is above 0.

### Appearance

| Property      | Meaning                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| **Gradient**  | Colour from the source (left) to the tip (right). Multiplies with Color, so leave it white to just use Color. |
| **Width**     | Bolt thickness in studs, over the bolt's life. 0.1-0.3 is a normal bolt. Pull the end down to fade it out thin. |
| **WidthAlong**| Thickness from source to tip. Ending around 0.2-0.4 gives the classic tapered bolt.                       |
| **ZOffset**   | Pushes the bolt toward or away from the camera, same as on normal particles.                             |

Color, Transparency, LightEmission and the other Appearance channels apply to the bolt as normal.

### Emission

| Property       | Meaning                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| **GrowthTime** | Seconds for the bolt to shoot out to full length. 0 = instant, 0.05 = snappy strike, 0.3+ = slow crawl. Negative grows from the tip back to the source. |

Rate, Lifetime, EmitCount, EmitDelay and EmitDuration work as they do for any 3D particle.

### Shape

| Property      | Meaning                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| **Segments**  | How many straight pieces make up the bolt. More = finer zig-zags (and more parts). 16-24 suits most bolts. Enter two numbers (e.g. `12, 28`) to give every bolt a random count in that range. |
| **Amplitude** | How far the bolt zig-zags sideways, as a fraction of its length (0.15 = 15%). 0 = straight line, 0.1-0.25 reads as lightning. |
| **Roughness** | How crinkly the zig-zag is at small scale (0 to 1). Low = one big smooth bend, high = rough all the way down. 0.4-0.6 looks natural. |
| **StartFree** | Lets the bolt's start wander (0 to 1). 0 = locked to the emitter.                                           |
| **EndFree**   | Lets the bolt's end wander (0 to 1). 0 = locked to its target, 0.5-1 gives a loose, searching tip.           |
| **Sag**       | Makes the bolt droop like a hanging cable, as a fraction of its length. Negative arches it upward.          |
| **SagShape**  | Shape of the droop. 1 = smooth curve, higher = pointier dip, 0.5 = round arc, 0 = flat bottom. Shows once Sag isn't 0. |

### Other sections

| Section          | What works on a bolt                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **Particles**    | **Length**: how far the bolt reaches in studs on the Default route (graph). **Route**, **RoutePick**, **RouteSmooth** pick the target (see above). |
| **Placement**    | **Position** offsets where the bolt starts.                                                 |
| **Bezier**       | **Bezier** + **Radius** bow the whole bolt into a curve.                                    |
| **Collision**    | **Collisions** stops the bolt at the first surface. **StrikeSurface** is described above.   |
| **Optimization** | StepRate, CullOffscreen, CullDistance and DistanceLOD all apply to bolts.                   |

## Quick recipes

- **Classic strike:** Style Jitter, JitterRate 15, Amplitude 0.15, Roughness 0.5,
  ForkChance 0.3, GrowthTime 0.05, WidthAlong tapering to 0.3.
- **Ground strike:** point the emitter down, Route Default, Length 40, turn on
  **StrikeSurface**.
- **Energy beam:** Style Scroll, Waves 3, ScrollSpeed 2, ForkChance 0, Amplitude 0.08.
- **Chain lightning:** Route Custom, RoutePick InOrder, add your targets, RouteSmooth 0.3.
- **Hanging arc:** Sag 0.2, SagShape 1, EndFree 0, low Roughness.

## Previewing with Paths

With [Paths](/paths) on, a lightning emitter draws its route plus a frozen sample of the
actual bolt (zig-zags, sag, branches and all), one line for each bolt that would be alive at
once. It's a quick way to tune Segments, Amplitude and the route without emitting.

## Tools

[Retimer](/retimer), [Resizer](/resizer), [Shifter](/shifter) and [Copier](/copier) all
understand lightning emitters. Retimer scales JitterRate, ScrollSpeed and GrowthTime,
Resizer scales Width and Length, and Shifter and Copier list the bolt settings.

## Related

- [3D particle](/part) - the emitter Lightning mode is built on.
- [Paths](/paths) - preview the bolt shape.
- [Graph editor](/graph-editor) - shape Width, Amplitude, JitterRate and more over life.
