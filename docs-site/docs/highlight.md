# Highlight

Select a **Highlight** and run [Transform](/transform) to turn it into a SineVFX
**highlight emitter**. On emit it **spawns short-lived highlight copies** over the same model,
each animated over its life, so a character or part can flash an outline and fill on cue: hit
flashes, power-ups, selection pulses.

## What happens on transform

- The Highlight is tagged in place and gains a `Properties` folder, seeded from its current
  Fill and Outline colour and transparency. It **stays** on its adornee.
- The tagged Highlight becomes the resting **source** (driven at graph `t = 0` so your edits
  show). On emit, SineVFX clones it with the **same `Adornee`**, ages each copy `0 -> 1` over
  its **Lifetime** along the Appearance graphs, then destroys it.
- Copies adorn the same model, so a burst rides whatever the Highlight was pointed at.

## Property reference

| Group          | Property                | Meaning                                                       |
| -------------- | ----------------------- | ------------------------------------------------------------- |
| **Emission**   | **Enabled**             | Master toggle. Drives the runtime like the Emit window's Enable. |
|                | **Rate**                | Copies spawned per second while enabled (`0` = one held play). |
|                | **Lifetime**            | How long each highlight copy lasts before it clears.          |
|                | **EmitCount**           | How many copies a single **Emit** burst spawns.              |
| **Appearance** | **FillColor**           | Inner fill colour over life (colour graph).                   |
|                | **OutlineColor**        | Outline colour over life (colour graph).                      |
|                | **FillTransparency**    | Fill opacity over life (`0` solid, `1` invisible).            |
|                | **OutlineTransparency** | Outline opacity over life (`0` solid, `1` invisible).         |

Shape the transparency graphs so `t = 1` returns to the rest state, so each copy fades out
without a pop.

## Play model

- **Emit** spawns `EmitCount` copies, once.
- **Enable with Rate > 0** spawns a copy every `1 / Rate` seconds until you disable.
- **Enable with Rate 0** holds one play until disable.

## Nesting

A transformed Highlight nested in an emitter's RenderPart template **bursts on spawn**, so each
particle can carry its own outline flash.

## Preview and ship

Preview in the [Emit window](/emit), then plant the [runtime module](/module)
and drive it with `VFX.emit(highlight)` / `VFX.enable(highlight)` /
`VFX.disable(highlight)`. See the [Runtime API](/api). Re-plant the module after editing
so the generated code includes your highlight driver.

## Related

- [Light](/light) - the other transformable adornment effect.
