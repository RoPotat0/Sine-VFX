/* ─────────────────────────────────────────────────────────────────────────────
   SineVFX site config — this is the only file you need to edit for links/prices.

   Anything left as null is treated as "not set up yet": the site renders that
   payment option greyed out with a "soon" tag instead of a dead link. Fill one
   in and it goes live on the next push. Nothing here is a secret — it all ships
   to the browser, so never put an API key, a Stripe SECRET key, or the
   ADMIN_TOKEN in this file.
   ───────────────────────────────────────────────────────────────────────────── */
window.SVFX_CONFIG = {
  API: "https://sinevfx-api.chutkapro480.workers.dev",

  price: "$5",
  priceNote: "one-time, lifetime updates",

  repo: "https://github.com/RoPotat0/Sine-VFX",

  trialDays: 3,

  pay: {
    // The ONLY way to sell for Robux. Roblox has no payment API for outside
    // sites, so this is a link to your plugin's Creator Store page.
    creatorStore: null, // e.g. "https://create.roblox.com/store/asset/XXXXXXXX"

    // Stripe Payment Link (dashboard > Payment links). Just a URL, safe to ship.
    stripe: "https://buy.stripe.com/test_bJe8wIf8hdiW2UVeBL5Ne00",       // e.g. "https://buy.stripe.com/xxxxxxxx"

    // PayPal.me or a hosted button link.
    paypal: null,       // e.g. "https://paypal.me/yourname/5"

    // Any hosted crypto checkout (Coinbase Commerce, NOWPayments, ...).
    crypto: null,       // e.g. "https://commerce.coinbase.com/checkout/xxxx"
  },
};
