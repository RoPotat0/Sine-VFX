# Tools

The **Tools** menu holds SineVFX's batch editors, the ones that reshape, rescale, retime,
recolour, and export whole selections at once. Open it from the **Tools** entry on the SineVFX
menu; each opens as its own window and works on your current selection of transformed effects
(emitters, trails, and beams).

| Tool                            | What it does                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| **[Shifter](/tools/shifter)**   | Slide a property up or down across a whole multi-selection.     |
| **[Resizer](/tools/resizer)**   | Scale an effect proportionally, every size channel together.    |
| **[Retimer](/tools/retimer)**   | Speed up or slow down an effect's timing as a unit.             |
| **[Copier](/tools/copier)**     | Copy a property (or set) from one effect and paste onto others. |
| **[Code](/tools/code)**         | Get the ready-to-paste code that fires the selected effect.     |
| **[Color](/tools/color)**       | Full colour picker plus batch Replace / Shift across effects.   |

## The batch workflow

The pattern is the same for every tool:

1. **Select** one or many transformed effects.
2. **Open** the tool.
3. **Apply** once, and it lands on the whole selection together.

Because these edits key off each effect's kind (emitter / trail / beam), a mixed selection is
handled correctly, each object edited through its own settings.

## Related windows

A few supporting windows help while you tune:

- **[Texture Library](/windows/library)** - apply textures to selected emitters.
- **[Paths](/windows/paths)** - preview predicted particle trajectories.
- **Particle Counter** - watch particle counts while tuning performance.
- **Trail Preview** - preview trail shapes.
