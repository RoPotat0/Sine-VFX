# Color Wheel

The **Color Wheel** is SineVFX's single-colour picker. It opens whenever you edit one colour:
clicking a colour swatch in [Properties](/properties), editing a stop in the
[Gradient editor](/gradient-editor), or a colour in the Theme Editor.

Changes apply **live** while you pick. **Apply** keeps them, **Cancel** puts the original colour
back.

## The picker

- **Saturation / brightness square** - drag to pick how vivid and how bright the colour is.
- **Hue strip** - drag along it to pick the hue.
- **R / G / B** fields - type exact values from 0 to 255.
- **Hex** field - type or paste a hex code such as `#FF8800`.

When the wheel is editing a gradient stop, it also shows a **time** field so you can move that
stop without going back to the gradient editor.

## Eyedropper

The button in the bottom-left corner is the **eyedropper**. Click it, then move the mouse:

- The pointer becomes a **crosshair**, and a small dot next to it previews the colour under it.
  Near the edges of the Studio window the dot moves to the other side so it stays visible.
- **Left click** keeps the colour.
- **Right click** or **Esc** cancels and goes back to the colour you had before.

It can pick from:

- **The 3D viewport** - anything you can see. If you move the camera while picking, the picker
  catches up with the new view.
- **SineVFX's own windows** - backgrounds, buttons, icons, images and gradients, including
  see-through parts blended over what's behind them.

While you pick, SineVFX's buttons don't react to the mouse and clicks in the viewport don't
select parts, so you can move freely.

::: tip Limits
The eyedropper can't read **text** or **outlines**, Studio's own panels, other plugins' windows,
or the docked Asset Library. Anything moving in the scene is captured as it was when you last
moved the camera.
:::
