# Themes

SineVFX is fully themeable. Colours, transparency, corners, the font and a window background
image are all part of a theme, and that image can be animated.

Manage themes from the **Themes** section of [Settings](/settings).

## Built-in themes

**Default**, **Animated**, **Dark**, **Green**, **Red**, **Purple**, **Amber**, **Slate**,
**Cyan** and **Greyish** ship with the plugin and are listed first. They're read-only, so make a
**New** theme if you want to tweak one.

## Theme Editor

Edits apply live to every open window. **Apply** closes the editor, **Cancel** undoes your
changes.

The editor opens in **simple** mode: pick an **Accent**, **Background** and **Text** colour and
SineVFX works out the rest. Accent also re-hues the Background and Text, so it changes everything.
Switch on **Advanced** to edit every colour by hand. Simple edits overwrite the advanced colours
they drive.

- **Colours** - click any colour to change it in the [Color Wheel](/color-wheel).
- **Adjust All** - **Hue**, **Saturation** and **Brightness** sliders shift every colour at once,
  so you can retint a whole theme in seconds. Double-click a slider to reset it.
- **Transparency** - Base, Surface, Accent, Background, Property Field, Top Bar, Header and
  Hub each have their own slider. **Header Transparency** also fades the Properties grid lines.
- **Path Transparency** - how see-through the [Paths](/paths) preview lines are (built-in themes
  use 0.85). Found in the **3D Viewport** section.
- **Corners** - **All Corners** scales every corner, and windows, cards, buttons and toggles
  each have their own slider too.
- **Font** and **Text Size** - the UI font and how large it draws.

## Background images

The **Background Image** section puts an image behind every window.

| Setting                | What it does                                                                  |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Background Image**   | The image. Type an asset ID, or click the icon beside the box to open **Theme Image**. |
| **Image Color**        | Tints the image.                                                              |
| **Image Fit**          | **Fit**, **Stretch**, **Tile** or **Crop**.                                   |
| **Pattern Size**       | Tile size in pixels. Only shows for **Tile**.                                 |
| **Static**             | Pins the image to the screen, so windows act like cut-outs over one big picture. |
| **Image Transparency** | How see-through the image is.                                                 |

## Animated backgrounds

**Theme Image** is where you pick, cut and upload a background. Click the browse icon to choose
files from your PC:

- **One PNG or JPG** - a still image, or cut it into a grid of frames with **Cols**, **Rows** and
  **Count** if it's a sprite sheet.
- **A GIF** - plays at its own speed.
- **Several PNG or JPG files** - played as frames in file name order. Set the speed with **FPS**
  (starts at 12).

You can also type several asset IDs into the box. Each ID becomes one frame, and nothing needs
uploading.

Animations hold up to **64 frames**, and GIFs play at up to 30 fps. Longer ones skip frames
evenly. GIFs are shrunk to fit, so large ones lose some sharpness. A GIF can't be mixed with other
files in one pick.

### Use or Upload

- **Use** applies the file straight away, without uploading.
- **Upload** puts it on your Roblox account, so it's permanent and works in shared themes.
  Uploaded images are listed under **Uploaded** so you can reuse them. The **X** on a row only
  removes it from that list, not from your account.

::: warning Local files don't survive closing Studio
Roblox plugins can't read a file path from your PC, only what you pick in the file picker. A
picked file survives a plugin reload but is gone when you close Studio, so **Upload** it to keep
it. A shared theme that uses a local file shows no image for anyone else.
:::

## Sharing themes

- **Export** - copy your theme as a code to share.
- **Import** - paste a code to bring a theme in.

Switching themes, applying a theme and dragging colours in the Theme Editor all recolour the
open windows **in place**, without rebuilding them, so there's no lag or flicker.

## Related

- [Settings](/settings) - the rest of the plugin's configuration.
- [Color Wheel](/color-wheel) - the picker the editor uses.
