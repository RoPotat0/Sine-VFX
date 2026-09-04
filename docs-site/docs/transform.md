# Transform

**Transform** is the gateway into SineVFX. Before you can graph or preview an effect, you
transform its instance so the plugin can manage it.

When your selection contains something [transformable](/transformable), a floating
**Transform** button appears near the Emit controls. Click it to transform the selection.

## What transforming does

Transforming an instance tags it as a SineVFX effect and lays down a **`Properties` folder**
of grouped settings that the [Properties window](/properties) edits. What you get
depends on what you transformed:

- **A Part** becomes a **3D particle emitter** - the part itself becomes what each particle
  looks like. See [Transformable objects](/transformable) for the full picture.
- **A Trail** or **Beam** becomes a graphable transformed ribbon.
- **The Camera** becomes a global [camera effect](/camera).

For a Part, the original stays put as the emitter root (it turns invisible), and a clone of it
(with its children) becomes the **RenderPart** template that particles are spawned from.

## Untransforming

Run Transform again on something already transformed, or use **Untransform**, to remove the
tag and template and return the plain instance. Studio's **Ctrl+Z** also reverts a transform
cleanly, since the original content is detached rather than destroyed.

::: tip
You can select and transform **many** instances at once. Grouping several transformed effects
under a Folder or Model lets you emit them all together.
:::

## Next

With something transformed, open the [Properties window](/properties) to edit it, then
[Emit](/emit) to preview.
