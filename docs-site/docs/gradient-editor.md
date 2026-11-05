# Gradient editor

The **Gradient editor** edits **colour sequences** - any colour that changes over a particle's
life or along a trail or beam. It opens when you click a colour-sequence field in
[Properties](/properties) (for example a 3D particle's **Color**, or a Screen Effect's
**Tint**).

Like the [Graph editor](/graph-editor), changes apply **live**. **Apply** keeps them,
**Cancel** puts the original gradient back.

## Stops

A gradient is a row of **stops**, each with a colour and a position (time) from 0 to 1.

| Action | What it does |
| --- | --- |
| **Click** an empty spot | Adds a stop there, already coloured to match the gradient at that point. |
| **Click** a stop | Selects it. |
| **Drag** a stop | Moves it along the gradient. |
| **Double-click** a stop | Opens the [Color Wheel](/color-wheel) to change its colour. |
| **Right-click** a stop | Deletes it. |

The **first and last stops** are pinned at 0 and 1. Dragging one of them drops a **new copy**
of it that you then drag, so the ends never move.

A gradient can hold up to **20 stops** - that's Roblox's limit for a colour sequence.

## The bottom bar

- **T:** - the selected stop's exact time. Type a value from 0 to 1.
- **Edit** - opens the [Color Wheel](/color-wheel) for the selected stop. While the wheel is
  open, clicking another stop points the wheel at that one.
- **Delete** - removes the selected stop.
- **Undo / Redo** - step back and forward through your edits.

## Tips

- To make a colour **hold** for part of the effect's life, place two stops with the same colour.
- To recolour a whole gradient (or many effects at once) without editing each stop, use the
  [Color](/color) tool's **Shift** mode instead.
