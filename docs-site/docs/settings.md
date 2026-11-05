# Settings

Open **Settings** from the [hub](#the-hub) to configure the plugin's look and
behaviour. Settings persist between sessions.

## The hub

The **hub** is SineVFX's one floating bar of icons. The button at its corner end expands and
collapses it. A tool's icon is bright while its window is open, and hovering one shows what it
does.

In order, the icons are **Emit** (hold to repeat), [Library](/library), **Particle Counter**,
[Shifter](/shifter), [Copier](/copier), [Resizer](/resizer), [Retimer](/retimer),
[Code](/code), [Color](/color), [Properties](/properties), [Module](/module),
**Trail Preview**, [Paths](/paths) and **Settings**.

**Hub Corner** picks which corner it sits in: bottom-left (default), bottom-right, top-left or
top-right.

## Emission

- **Repeat Timer** - the gap between bursts when [Repeat](/emit#repeat) is running (0 to 10s).

## Interface

- **Scale** - makes all of SineVFX's windows and controls larger or smaller (0.5 to 2).
- **Display Order** - where SineVFX draws compared to other UI.
- **Edge Margin** and **Margin Size** - keep windows a set gap away from the screen edges.
- **Auto-Hide** - hides the tools when nothing editable is selected.
- **Dim Unfocused** - fades out windows you aren't working in, so the one you're using stands
  out.
- **Dodge Windows** - windows shove each other out of the way and spring back to their spot.
  Off by default.
- **Hub Corner** - see [The hub](#the-hub).
- **Counter Pos** and **Counter Max** - where the Particle Counter sits on screen, and the count
  above which it reads `N+`.

## Tooltips

Turn hover tooltips on or off, and set the **Hover Delay** before one shows.

## Themes

Colours, transparency, corners, the font and an animated background image are all set by the
theme. See [Themes](/themes). The docs site you're reading uses the plugin's own blue-on-near-black
palette as its starting point.

## Window Layout

A layout saves where all your windows are, so you can switch between setups. **Default**,
**Medium** and **Small** are built in, and on first run SineVFX picks one to fit your screen.
**Save**, **Load**, **Import**, **Export** and **Delete** manage your own.

## Asset Library

**Grid Size** sets how large [Asset Library](/library) tiles are, **Always Animate** keeps
flipbook tiles playing without hovering, and **Flipbook FPS** sets their speed.

## Keybinds

See [Keybinds](/keybinds).

## Reset

**Reset Everything** wipes all SineVFX settings, including themes, layouts and window positions.
It asks first, and it can't be undone.

## Persistence

Almost everything you'd expect to stick, sticks - window positions and sizes, which windows
were open, the hub corner and expanded state, the Paths toggle, pinned windows, and your
theme. Reopen Studio and you're back where you left off. Under the hood this uses Studio's
per-plugin settings store.

## Other windows you'll meet

SineVFX includes a handful of supporting windows that open contextually:

- **Confirm / Notice** - confirmations and messages.
- **Particle Counter** - keep an eye on particle counts while tuning performance.
- **Trail Preview** - preview trail shapes.
- **Update available** - tells you when a newer version is out, with **Later** and **Skip
  version** buttons.
- **Color Wheel** and **Gradient editor** - open when you edit a colour or a colour sequence.
  See [Color Wheel](/color-wheel) and [Gradient editor](/gradient-editor).
- **Asset Library / Asset Upload** - the [texture library](/library) and uploading
  your own textures.
