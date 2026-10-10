# Settings & themes

Open **Settings** from the SineVFX menu to configure the plugin's look and
behaviour. Settings persist between sessions.

## Button Layout

Choose which **corner** the SineVFX button (FAB) sits in - bottom-right (default), bottom-left,
top-right, or top-left. The menu strip and tool windows anchor themselves relative to the
FAB, so everything follows.

## UI scale

SineVFX scales its whole UI so it stays comfortable on any monitor. Adjust the scale to make
windows and controls larger or smaller.

## Themes

SineVFX is fully themeable - colours for surfaces, text, accents, and effect states are all
driven by a theme.

- **Built-in themes** - **Green**, **Red**, **Purple**, **Yellow/Orange**, **Grey/Blue** and
  **Greyish** ship with the plugin and are listed first. They're read-only, so make a new theme
  if you want to tweak one.
- **Theme Editor** - edit the active theme's colours live.
- **Import Theme** - bring in a theme someone shared.
- **Export Theme** - share your theme as a portable string/file.

Switching themes, applying a theme and dragging colours in the Theme Editor all recolour the
open windows **in place**, without rebuilding them, so there's no lag or flicker.

## Windows

- **Dim Unfocused** - fades out windows you aren't working in, so the one you're using stands
  out.
- Windows fade in and out smoothly when you open and close them.
- Window sizes stay correct when you change the UI scale.

The docs site you're reading uses the plugin's own blue-on-near-black palette as its
starting point.

## Persistence

Almost everything you'd expect to stick, sticks - window positions and sizes, which windows
were open, the FAB corner and expanded state, the Paths toggle, pinned windows, and your
theme. Reopen Studio and you're back where you left off. Under the hood this uses Studio's
per-plugin settings store.

## Other windows you'll meet

SineVFX includes a handful of supporting windows that open contextually:

- **Confirm / Notice** - confirmations and messages.
- **Particle Counter** - keep an eye on particle counts while tuning performance.
- **Trail Preview** - preview trail shapes.
- **Asset Library / Asset Upload** - the [texture library](/library) and uploading
  your own textures.
