# Emittable objects

Beyond the [transformed effects](/transformable), SineVFX can drive plain Roblox effect
instances directly. Select them and the [Emit window](/emit) can **emit**, **enable**,
and **repeat** them, and they all ship through the [runtime](/api) the same way.

## What SineVFX can emit

| Object                              | How it fires                                              |
| ----------------------------------- | --------------------------------------------------------- |
| **3D particle** (transformed Part)  | Spawns part-particles. See [3D particle](/part).  |
| **Transformed Trail / Beam**        | Bursts the transformed ribbon.                            |
| **ParticleEmitter**                 | Calls `:Emit(count)` for a one-shot, or holds Enabled.    |
| **Beam**                            | Toggles `Enabled` (enable/hold).                          |
| **Trail**                           | Toggles `Enabled` (enable/hold).                          |
| **Light** (Point / Spot / Surface)  | Toggles `Enabled` (enable/hold).                          |
| **Sound**                           | Plays the sound.                                          |
| **Camera** (transformed)            | Drives the [camera effect](/camera).              |

So a selection can mix transformed effects and plain instances, and SineVFX handles each by its
kind.

## Emit, Enable, Repeat

Every emittable object responds to the same controls in the [Emit window](/emit):

- **Emit** - fire once (a `ParticleEmitter:Emit()`, a ribbon burst, a `Sound:Play()`).
- **Enable** - turn on and hold (toggle `Enabled`), until you disable.
- **Repeat** - keep firing on a timer (see [Emit & preview](/emit#repeat)).

## Firing nested effects on spawn

Inside a [3D particle's](/part) template you can nest plain effect instances and have
them fire automatically as each particle spawns:

- **EmitOnSpawn** - fires anything nested like the Emit button does: `ParticleEmitter:Emit()`,
  `Sound:Play()`, and `Enabled = true` on a Beam / Trail / Light.
- **EnableOnSpawn** - sets nested `ParticleEmitter` / `Beam` / `Trail` / `Light` `.Enabled` to
  true (and plays a nested Sound) when a particle spawns.

That's how a single part-particle can carry its own sparks, glow, and sound with it.

## Shipping

All of these are driven by the [runtime module](/module) through the same
`VFX.emit / enable / disable` calls. See the [Runtime API](/api).
