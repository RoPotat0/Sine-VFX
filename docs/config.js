/* ─────────────────────────────────────────────────────────────────────────────
   Sine VFX site config. The only file you edit for links and numbers.
   Everything here ships to the browser, so never put a secret in it.
   ───────────────────────────────────────────────────────────────────────────── */
window.SVFX_CONFIG = {
  discord: "https://discord.gg/krQE8tGsUz",

  price: "$5",
  version: "v1.0.0",     // shown in the "latest" stat (static — edit it on each release)
  users: "400+",              // buyer/user count shown on the site (static — just edit this number)

  pay: {
    // Sine VFX is sold only on the Roblox Creator Store; it installs straight into Studio.
    creatorStore: "https://create.roblox.com/store/asset/96645663824840/SineVFX",
  },

  // Buyer-role account connect (used by connect.html). Both values are PUBLIC — safe here.
  connect: {
    robloxClientId: "7905125328022841312",  // your Roblox OAuth app Client ID
    // The Discord bot Worker's base URL (from `wrangler deploy`), no trailing slash.
    workerUrl: "https://sinevfx-discord.chutkapro480.workers.dev",
  },
};
