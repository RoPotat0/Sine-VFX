# Asset Library

The **Asset Library** is a browsable collection of **over 14,000 assets** you can apply to
selected effects with a click, no hunting for asset IDs.

Open it from the **Library** entry on the SineVFX menu (default keybind `B`, see
[Keybinds](/keybinds)). It opens as a dockable Studio widget, and remembers where you docked
it between sessions.

## Using it

1. Select one or more effects.
2. Open the Asset Library.
3. Click an asset to **apply it to the whole selection** at once.

Great for trying looks fast, sparks, smoke, glows, flipbook sheets, without leaving your flow.

## What applying does

What happens depends on what's selected:

| Selected                         | Applying a texture / flipbook...                                             |
| -------------------------------- | ---------------------------------------------------------------------------- |
| **ParticleEmitter / Beam / Trail** | Sets the texture (and the flipbook layout for sprite sheets, including custom 5x5 / 6x6 grids). |
| **[3D particle](/part)**         | Sets the RenderPart's texture, or fills its mesh flipbook frames.            |
| **[Transformed Decal](/decal)**  | Replaces the image, or fills `Properties/Flipbook/Frames` from a flipbook.   |
| **[Screen Effect](/camera)**     | Fills its **ImpactFrames** (one frame per sprite-sheet cell) and turns ImpactFrames on. |

Applying an **Impact Frame** with no Screen Effect selected inserts a new Screen Effect for you,
ready to emit.

## Your own assets

Open **Asset Upload** to add your own assets. They show up under **My Assets** (and in
favourites / recents) and apply the same way as the built-in ones. Upload types:

| Type              | What it stores                                                              |
| ----------------- | --------------------------------------------------------------------------- |
| **Texture**       | An image. Can be imported from a local file.                                |
| **Mesh Flipbook** | A sequence of images played as frames.                                      |
| **Impact Frame**  | A sequence of images for a Screen Effect's [ImpactFrames](/camera#impactframes). |
| **Mesh**          | A mesh (a MeshPart, or a Part with a SpecialMesh).                          |
| **Beam**          | A beam texture, listed in the Beams section.                                |
| **Sound**         | A sound.                                                                    |
| **Script**        | A Script / LocalScript / ModuleScript (or a Folder of them), saved with its source so you can drop it back in later. Listed in the Scripts section. |

Texture, Mesh Flipbook, Impact Frame and Beam can import local image files directly.

## Loading speed

The library keeps a local copy of its asset list, so after the first time it opens instantly
and refreshes quietly in the background. Grid tiles load small thumbnails first and only
download full-size sheets when they need them, and the library starts warming up a few seconds
after the plugin loads so it's ready when you open it.

If the library can't connect, see
[Asset Library won't load](/faq#the-asset-library-won-t-load).

## Tips

- Combine the library with the [graph editor](/graph-editor): pick an asset, then shape
  its transparency and size curves for the final look.
- For animated sprite sheets, check the **Flipbook** options in [Properties](/properties)
  after applying the texture, or use [mesh flipbooks](/part#flipbooks-and-mesh-flipbooks)
  for animated 3D particles.
