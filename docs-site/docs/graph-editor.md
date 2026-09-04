# Graph editor

The **graph editor** (the Curve window) is what sets SineVFX apart. It drives any numeric
channel with a smooth **bezier curve** over the effect's lifetime, with an optional
**envelope** for randomised spread - far beyond Roblox's coarse number-sequence keypoints.

Open it from any graph-capable channel in the [Properties window](/properties).

## Reading the graph

- The **horizontal axis** is time - `0` at the left (particle birth / start of a play) to
  `1` at the right (death / end).
- The **vertical axis** is the channel's value, clamped to that channel's **min/max range**.
- **Anchor points** define the curve; the line between them is what the value actually does.

## Editing the curve

- **Drag an anchor** to move it in time and value.
- **Add an anchor** by clicking on the curve; **delete** the selected one with the Delete
  button (or right-click).
- **Bezier handles** - each anchor has tangent handles. Pull them out for smooth, eased
  segments; collapse a handle to zero for a straight (linear) segment.
- **Right-click** an anchor to reset it; handles can be flipped 180° for symmetric shaping.

A segment with zero-length handles is **linear**; give the handles length and it becomes a
**curved** segment, sampled smoothly for playback.

## Envelopes

An **envelope** is a symmetric band around the curve - `value ± spread` - that randomises
each particle within that range for natural variation (think flickering transparency or
varied sizes). Toggle the envelope on and drag its band; it's clamped to the channel's
value range so it never overshoots. Set spread to zero and every particle follows the curve
exactly.

## Range controls

The button row lets you set the channel's **Min**, **Max**, and **Envelope** range, plus
toggle **Curve** and **Envelope** modes. The view auto-fits to include the full curve and
any envelope spread when you reload, so you always see the whole shape.

## Where the data lives

Bezier curves are stored **on the instance** (as attributes), so they persist across
sessions and travel with the effect when you copy it. Reopening the editor restores the
exact curve you drew.

## Tips

- Keep the [Emit window](/emit) running while you shape a curve - you'll feel the
  difference every handle makes.
- Use envelopes sparingly; a little spread reads as "alive," a lot reads as "noisy."
- For sharp pops (impact flashes), use near-vertical linear segments; for soft fades, pull
  the handles long.
