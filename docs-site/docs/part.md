# 3D particle

SineVFX's signature effect. Select any **BasePart** (a Part, MeshPart, union, and so on) and
[Transform](/transform) turns it into a **3D particle** emitter, where **each particle
looks like that part**.

## What happens on transform

- The part's shape, material, colour, textures, and its **children** (meshes, decals,
  attachments, nested effects) become the particle's appearance.
- The original part stays in place as the emitter's root marker and turns invisible.
- A clone of it becomes the **RenderPart** template that every particle is spawned from.

So instead of being limited to flat particle textures, you emit **real 3D geometry**: rocks,
shards, leaves, glowing meshes, whatever the part is.

## Editing it

Open the [Properties window](/properties). A 3D particle exposes grouped channels such
as:

- **Appearance** - how each particle looks (colour, transparency, size, LightEmission /
  LightInfluence / Brightness for glow).
- **Emission** - Rate, Lifetime, Speed, TimeScale, EmitCount, EmitDelay, EmitDuration.
- **Shape / EmitterShape** (addon) - where and in what direction particles spawn.
- **Raycast** (addon) - snap particles onto the first surface a ray hits (see [Raycast](#raycast)).
- **Particles / Flipbook** - texture and sprite-sheet options (see below).
- **Collision, Optimization** - physics and performance.
- **Type** - what each particle is (see [Particle types](#particle-types)).
- **Addons** - optional sections you add when you need them (see [Addons](/properties#addons)).

Any numeric channel can be driven by a lifetime **[graph](/graph-editor)**.

## Property reference

Every channel below is a native `ParticleEmitter` property that SineVFX groups and exposes to
the [graph editor](/graph-editor). Anything marked *lifetime* varies over a particle's
own life; the emit-timing channels are SineVFX playback additions.

### Appearance

| Property           | Meaning                                                                         |
| ------------------ | ------------------------------------------------------------------------------- |
| **Color**          | Particle tint over lifetime (multiplies the part's own colour/textures).        |
| **Transparency**   | Opacity over lifetime · `0` solid, `1` invisible. Usually a fade-in/out curve.  |
| **Size**           | Particle scale over lifetime.                                                    |
| **Squash**         | Stretches the particle along its motion · `>0` elongates, `<0` flattens.        |
| **LightEmission**  | How much the particle ignores scene darkness · `1` = self-lit glow.             |
| **LightInfluence** | How much scene lighting tints the particle · `0` unlit, `1` fully lit.          |
| **Brightness**     | Overall emissive intensity multiplier.                                          |
| **Orientation**    | How each particle faces (face camera, velocity-aligned, etc.).                  |
| **ZOffset**        | Push the particle toward/away from the camera to fix draw-order/overlap.        |

### Emission

| Property               | Meaning                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| **Rate**               | Particles spawned per second while enabled.                                |
| **Lifetime**           | How long each particle lives (min,max seconds).                            |
| **Speed**              | Initial launch speed (min,max).                                            |
| **SpreadAngle**        | Cone spread of launch directions, in degrees (X,Y).                        |
| **Acceleration**       | Constant force applied to live particles (e.g. gravity).                   |
| **Drag**               | Air resistance that slows particles over their life.                       |
| **Rotation**           | Initial 2D spin of each particle (min,max degrees).                        |
| **RotSpeed**           | Ongoing spin rate (min,max degrees/sec).                                   |
| **VelocityInheritance**| Fraction of the emitter's own motion each particle inherits.               |
| **LockedToPart**       | If on, particles ride with the emitter instead of the world.              |
| **TimeScale**          | Playback speed of the whole emitter. `1` normal, `2` twice as fast, `0.5` slow motion, `0` frozen. |
| **EmitCount**          | How many particles a single **Emit** burst spawns.                         |
| **EmitDelay**          | Delay before the effect starts on emit.                                    |
| **EmitDuration**       | How long a single emit/enable cycle runs.                                  |

### Shape / EmitterShape

| Property        | Meaning                                                                        |
| --------------- | ------------------------------------------------------------------------------ |
| **Shape**       | Emitter volume: Box, Sphere, Cylinder, or Disc.                                |
| **ShapeStyle**  | Whether particles spawn on the shape's **Surface** or throughout its **Volume**. |
| **ShapeInOut**  | Launch direction: Outward, Inward, or InAndOut relative to the shape.          |
| **ShapePartial**| Blends between the emitter's normal direction and the shape direction.         |

### Raycast

Snaps each particle onto the first surface a ray hits: ground cracks, scorch marks, debris on
walls, rocks scattered across uneven terrain. Add it from the [Addons](/properties#addons)
section. It runs at spawn, **before** the Position graphs,
so Position then moves the particle from where it landed.

| Property      | Meaning                                                                               |
| ------------- | ------------------------------------------------------------------------------------- |
| **From**      | **Spawn** = each particle's own spawn point (after Shape), so a Shape scatters hits around. **Emitter** = the emitter's centre. |
| **Direction** | Which way the ray goes, in the emitter's own axes (turns with the emitter). `0, -1, 0` = the emitter's down. |
| **Distance**  | How far the ray reaches, in studs.                                                    |
| **Hits**      | **Solid** = only real ground and walls (skips characters, water, non-collidable and invisible parts). **All** = the first thing touched. |
| **Align**     | Turns each particle so its top faces out of the surface. Position and Rotation then work relative to the surface (PositionY lifts it off). |
| **Lift**      | Studs to push the particle off the surface so flat ones don't flicker into it.        |
| **Velocity**  | After landing: **Keep** its emission direction, fly straight out along the surface **Normal**, or **Reflect** the emission direction off the surface. |
| **OnMiss**    | When nothing is hit: **Spawn** where it would have anyway, or **Skip** that particle. |

Raycast respects **Spacing**, so particles that land too close together are re-rolled instead
of piling up. [Paths](/paths) shows where they'll land.

### Spacing

**SpacingBy** picks what Spacing measures against:

| Option           | Measures against                                                              |
| ---------------- | ----------------------------------------------------------------------------- |
| **Particles**    | Where live particles are right now.                                           |
| **Spawn Points** | Only where particles spawned, for an even spray pattern.                      |
| **Endpoints**    | Where each one finishes, so bolt tips land apart. With a Route target or a Shockwave, it compares spawn points. |

### Particles / Flipbook

| Property             | Meaning                                                                     |
| -------------------- | --------------------------------------------------------------------------- |
| **Texture**          | The image used per particle (ignored when the part supplies real geometry). |
| **FlipbookLayout**   | Sprite-sheet grid (e.g. 2x2, 4x4, 8x8) that defines the frames.             |
| **FlipbookMode**     | How frames advance: over lifetime, at a set rate, or randomised.            |
| **FlipbookFramerate**| Playback speed when the mode is rate-based.                                  |

For **mesh flipbooks**, these same controls swap through a sequence of meshes over lifetime
instead of 2D frames (see above).

### Collision & Optimization

These groups (Collision is an addon) hold the physics and performance switches - particle collision behaviour, and
culling/limit settings that keep large emitters cheap. Leave them at defaults unless an effect
needs to bounce off the world or you're trimming cost on a heavy emitter.

## Flipbooks and mesh flipbooks

A **flipbook** plays a sprite sheet across a particle's life so a single particle animates
(smoke, fire, explosions). SineVFX exposes the flipbook layout and playback settings in the
**Flipbook** group.

**Mesh flipbooks** take the idea into 3D: instead of flipping frames of a 2D sprite, the
particle swaps through a sequence of **meshes** over its lifetime, so a mesh-based particle can
animate its geometry (a tumbling debris shape, a morphing blob) rather than just its texture.
Set these up in the emitter's mesh-flipbook settings, and they play back over the same lifetime
timeline as everything else.

## Particle types

The **Type** dropdown at the top of **Appearance** decides what each particle is. Everything
except **Particle** is a chain built from segments of the RenderPart, so it shares
[Lightning](/lightning) settings like Width, Segments and Amplitude.

| Type          | What it is                                  |
| ------------- | ------------------------------------------- |
| **Particle**  | A normal moving part. The default.          |
| **Lightning** | A jagged bolt. See [Lightning](/lightning). |
| **Tendril**   | A curling arm.                              |
| **Crack**     | A line that crawls along surfaces.          |
| **Shockwave** | An expanding ring.                          |

### Tendril

| Property   | Meaning                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------- |
| **Curl**   | How far it bends along its length, in degrees (graph). 90 = gentle arm, 180 = curling, 360+ = tight coils. |
| **Bends**  | How many bends fit along it (graph). 1-2 = long sweeps, 4+ = wiggly.                     |
| **Writhe** | How fast the bends travel, in cycles per second (graph). 0 = frozen, 0.5 = lazy, 2 = thrashing. Negative flows toward the root. |
| **Droop**  | Pulls it down as it goes (graph). 0 = none, 1 = heavy. Negative lifts it up.             |

### Crack

| Property   | Meaning                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------- |
| **Wander** | How sharply it can turn at each segment, in degrees. 15 = nearly straight, 35 = natural, 80 = chaotic. |
| **Search** | How far to look for a surface, in studs: along the emission direction first, then straight down. No surface in reach = no crack. |
| **Lift**   | How far it floats above the surface, in studs. About half the Width works.               |

### Shockwave

| Property      | Meaning                                                                               |
| ------------- | ------------------------------------------------------------------------------------- |
| **Radius**    | Size of the ring in studs (graph). Start low and end high to make it expand. Amplitude makes it uneven; use 30+ Segments for a smooth circle. |
| **Height**    | How tall the ring's band is, in studs (graph). Width sets how thick it is across. EditableMesh and ZOffset ignore this. |
| **HugGround** | Drops the ring onto the surface under it so it follows the terrain. Off = a flat ring. |

## Nesting

Add the **Nested** addon for the on-spawn options. A part placed inside another emitter's
RenderPart template can itself be transformed into a
nested 3D particle, so you can layer effects (a glowing core that also sheds sparks, for
example). Nested `ParticleEmitter` / `Beam` / `Trail` / `Light` / `Sound`, and transformed
[Lights](/light), [Highlights](/highlight) and [Decals](/decal), inside the template can also
fire on spawn (see [Emittable objects](/emittable)).

### What fires and what you edit

- **Firing** (Emit / Enable / Disable, in Studio or at runtime) reaches **everything** inside a
  3D particle **except its RenderPart template**, which the runtime fires once per spawned
  particle instead. So a [Screen Effect](/camera), Sound or extra emitter sitting next to the
  RenderPart fires along with the emitter.
- **Editing** only touches what you select. Selecting a 3D particle edits that emitter, not the
  effects nested inside it. To edit a nested effect, select it directly in the Explorer. The
  [batch tools](/overview) follow the same rule.

## Preview and ship

Preview with the [Emit window](/emit), then plant the
[runtime module](/module) and fire it with `VFX.emit(part)`. See the
[Runtime API](/api).

## Related

- [Transform](/transform) - how to run it.
- [Lightning](/lightning) - turn a 3D particle into a lightning bolt.
- [Emittable objects](/emittable) - everything the Emit window can drive.
