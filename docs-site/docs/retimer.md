# Retimer

**Retimer** scales an effect's **timing** as a unit, so the whole thing plays faster or slower
while the shape of its curves stays intact. It scales the timing-related properties for each
class together.

## Using it

1. Select the transformed effects to retime.
2. Open **Tools → Retimer**.
3. Set the time factor. Timing channels (lifetimes, durations, rates) scale together across the
   selection.

It understands every kind it can see: 3D particles (including Lightning's JitterRate,
ScrollSpeed and GrowthTime), transformed trails and beams, [Screen Effects](/camera) (Lifetime,
Rate, shake Frequency, impact frame Framerate / Speed / Delay) and [Decals](/decal).

::: tip Retimer vs. TimeScale
Retimer permanently rescales the timing **values**. If you just want an effect to play faster
or slower without changing its numbers, set its **TimeScale** instead (see
[TimeScale](/transformable#timescale)).
:::

## When to use it

- Slowing an effect down for a dramatic, cinematic feel.
- Speeding an effect up so it reads in a fast-paced moment.
- Keeping a multi-part effect in sync when you change its overall pace.

## Related

- [Resizer](/resizer) - the size equivalent.
- [Graph editor](/graph-editor) - reshape individual curves rather than scaling timing.
