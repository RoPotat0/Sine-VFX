# Keybinds

SineVFX has a small set of keyboard shortcuts for the actions you reach for constantly. They
act on your **live selection**, so they work whether or not the matching window is open.

## Defaults

| Action      | Default key   | What it does                                             |
| ----------- | ------------- | -------------------------------------------------------- |
| **Emit**    | `R`           | Fire a one-shot emit on the selected effect(s).          |
| **Enable**  | `T`           | Toggle enable/hold on the selected effect(s).            |
| **Library** | `B`           | Open the [Asset Library](/windows/library).              |
| **Presets** | `` ` ``       | Open the presets browser.                                |

## Rebinding

Change any of them in **Settings → Keybinds**:

1. Click the shortcut's card to start capturing.
2. Press the key you want.
3. Press **Backspace** or **Delete** to clear it, or **Esc** to cancel.

Each card also has a **reset** to restore its default.

::: tip Single key, on purpose
Keybinds are **single keys only**, no `Ctrl` / `Alt` / `Shift` combos. That's deliberate, so
SineVFX's shortcuts never collide with Studio's own modifier shortcuts.
:::

## Notes

- Shortcuts are ignored while a text box is focused or while you're capturing a new bind.
- They read the current selection every time, so selecting different effects changes what they
  act on.
- See [Settings & themes](/reference/settings) for the rest of the configuration.
