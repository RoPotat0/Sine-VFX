# FAQ & troubleshooting

## Effects won't preview / emit does nothing

SineVFX elects one plugin copy as the edit-mode **preview driver**. Occasionally - usually
after an update or reloading the plugin - a stale copy can hold onto that role and the live
copy stays passive, so **Emit** and **Enable** silently do nothing.

**Fix:** fully **disable and re-enable** the plugin (or restart Studio). That clears the old
driver and the active copy takes over.

## The UI looks broken / doubled after an update

Studio caches plugin modules. After an update you can end up with stale UI (a duplicated toolbar button, dead windows).

**Fix:** disable and re-enable the plugin, or restart Studio, to clear the module cache.

## In-game effects don't match what I see in Studio

The [runtime module](/module) is a **snapshot** taken when you plant it. If you've
edited effects since, the shipped module is out of date.

**Fix:** open **Module** and **re-plant** it. Then test again.

## `emit` / `enable` does nothing in-game (and warns)

Effects render **per-client**. Calling the [runtime API](/api) from a **server**
script warns and won't render.

**Fix:** call it from a **LocalScript** (or a client module). To show an effect to all
players, have the server fire a RemoteEvent and call `VFX.emit` on each client.

## My effect isn't found by the runtime

`VFX.emit(target)` looks for **tagged** SineVFX effects under the `target` you pass.

- Make sure the effect was actually **[transformed](/transform)** (it needs the tag
  and `Properties` folder).
- Pass the instance that **contains** the effect, or the effect instance itself.
- Use `WaitForChild` so you're not referencing an effect before it replicates.

## The Asset Library won't load

The [Asset Library](/library) downloads its asset list from GitHub (with a jsDelivr mirror as a
fallback). If it hangs on "Loading library..." or shows a network error:

- Open **Plugins → Manage Plugins**, find SineVFX and make sure its **HTTP access** to
  `raw.githubusercontent.com` and `cdn.jsdelivr.net` is allowed. Studio asks for this
  permission the first time; if the prompt was dismissed, the request just waits.
- An `SslConnectFail` / `ConnectFail` error means your network is blocking the connection
  (school or work networks, some VPNs). Try another network.

Once it has loaded once, the library keeps a local copy and opens instantly afterwards, even
while offline.

## Screen Effects - what happens at runtime?

A [Screen Effect](/camera) acts on the local player's `CurrentCamera`. Drive it from the client
like any other effect. Its ColorGrade adds onto your game's own ColorCorrectionEffect and puts
it back afterwards, and with **Distance** on it only hits players whose camera is close to it.

## My EditableMesh lightning shows as normal parts in-game

[EditableMesh](/lightning#lightning-section) bolts need the game owner to be ID-verified with
**Enable Mesh / Image APIs** turned on in the Creator Dashboard. Without that, bolts fall back to
segment parts automatically.

## Where's my data stored?

- **Graphs / bezier curves** live as attributes **on the instance**, so they travel with the
  effect and survive reopening.
- **Plugin settings** (layout, theme, window state) use Studio's per-plugin settings store.

## Still stuck?

Join the community on **[Discord](https://discord.gg/krQE8tGsUz)** - it's the fastest way to
get help and share what you've made.
