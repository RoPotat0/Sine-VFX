/* ─────────────────────────────────────────────────────────────────────────────
   SineVFX site config. The only file you edit for links and numbers.
   Everything here ships to the browser, so never put a secret in it.
   Publishable keys are fine. A Stripe SECRET key or the ADMIN_TOKEN is not.

   A pay option left null shows as "soon" instead of a dead button.
   ───────────────────────────────────────────────────────────────────────────── */
window.SVFX_CONFIG = {
  API: "https://sinevfx-api.chutkapro480.workers.dev",
  repo: "https://github.com/RoPotat0/Sine-VFX",
  discord: "https://discord.gg/krQE8tGsUz",

  price: "$5",
  robux: 1900,      // instead of this use the actual price from the roblox website thing!!!
  trialDays: 3,

  // The loader file the Download button hands people (this IS the free trial).
  loader: "https://github.com/RoPotat0/Sine-VFX/raw/main/SineVFX%20Loader.rbxm",

  terms: null,          // link for the Terms of Service line, e.g. "terms.html"
  license: "https://github.com/RoPotat0/Sine-VFX/blob/main/LICENSE",

  pay: {
    // Stripe hosted checkout (card, Apple Pay, Google Pay). Opens in a popup.
    stripe: "https://buy.stripe.com/bJe9AU8Jb8GW4pxdvA2Fa00",

    creatorStore: "https://create.roblox.com/store/asset/108799042998848/SineVFX",        // Robux. The only way Roblox lets you sell for $5.
    shirt: "https://www.roblox.com/catalog/138288042903286/Sine-VFX",
    paypal: "https://www.paypal.com/ncp/payment/KCCQ7PFR9SVP6",
  },
};
