# Tools

The **Tools** menu holds SineVFX's batch editors - the ones that reshape, rescale, retime,
and recolour whole selections at once. Open it from the **Tools** entry on the
SineVFX menu; each tool opens as its own window.

| Tool                       | What it does                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| **[Shifter](#shifter)**    | Nudge / shift properties across a multi-selection.                   |
| **[Resizer](#resizer)**    | Scale a whole VFX proportionally - every size channel at once.       |
| **[Retimer](#retimer)**    | Re-time an effect - speed it up or slow it down as a unit.           |
| **[Copier](#copier)**      | Copy settings from one effect onto others.                           |
| **[Code](#code)**          | Get the code / snippet to reproduce or emit the effect.              |
| **[Color](/tools/color)**  | Full colour picker, palettes, replace & shift - see its own page.    |

All of these operate on your **current selection** of transformed effects, so the usual
workflow is: select many, open a tool, apply once.

## Shifter

Shift properties across every selected effect together, with persistence guards so a batch
edit stays consistent. Use it to nudge a shared value (say, brightness or a height offset)
across a group without touching each one by hand.

## Resizer

Scale a VFX **proportionally**. Rather than editing size channels one at a time, the Resizer
multiplies all of an effect's size-related properties together so it grows or shrinks as a
coherent whole - keeping the look intact at a new scale.

## Retimer

Re-time an effect as a unit - stretch or compress its timing so the whole thing plays slower
or faster while preserving the shape of its curves.

## Copier

Copy the SineVFX settings from one transformed effect and apply them to others, so you can
propagate a look across many objects quickly.

## Code

Pull the code snippet for an effect - handy when wiring it into your game with the
[runtime API](/shipping/api), or to reproduce/emit it from a script.

## Color

The Color tool is big enough to warrant its own page - a 2D picker, palettes, and
replace/shift operations across many instance types. See **[Color](/tools/color)**.
