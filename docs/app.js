/* SineVFX site. No dependencies, no build step. GitHub Pages serves this as-is. */
(() => {
  "use strict";
  const CFG = window.SVFX_CONFIG || {};
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Redeem uses the username typed on the buy card. When it is missing the
  // redeem popup calls this to reveal + focus that one field instead of asking
  // for the name again in the popup. Assigned by the buy-card block below.
  let revealUserField = () => {};
  // Opens the "check your Roblox purchase" popup using the Get-plugin username.
  // Assigned by the claim block; called by the Robux/Creator-Store tiles too.
  let openClaim = () => {};

  $$("[data-price]").forEach(el => el.textContent = CFG.price || "$5");
  $$("[data-trial-days]").forEach(el => el.textContent = CFG.trialDays ?? 3);
  $$("[data-repo]").forEach(el => { if (CFG.repo) el.href = CFG.repo; });
  // The Setup "Download the plugin" button downloads the loader WITHOUT leaving
  // the page: it fetches the file and saves it via a blob URL. If the fetch is
  // blocked (CORS), it falls back to opening in a background tab, so the current
  // page is never navigated away from either way.
  const loaderHref = CFG.loader || (CFG.repo ? CFG.repo + "/releases/latest" : null);
  $$("[data-loader]").forEach(el => {
    el.href = loaderHref || "#";
    el.addEventListener("click", async (e) => {
      if (!loaderHref) return;
      e.preventDefault();
      const name = decodeURIComponent(loaderHref.split("/").pop() || "SineVFX Loader.rbxm");
      try {
        const r = await fetch(loaderHref);
        if (!r.ok) throw new Error(r.status);
        const url = URL.createObjectURL(await r.blob());
        const a = document.createElement("a");
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      } catch {
        window.open(loaderHref, "_blank", "noopener");
      }
    });
  });

  // Copyable redeemable code. Icon-only button that flips to a check on copy.
  (() => {
    const btn = $("#copyCode"), box = $("#setupCode");
    if (!btn || !box) return;
    const use = btn.querySelector("use");
    btn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(box.value); }
      catch { box.select(); try { document.execCommand("copy"); } catch {} }
      btn.classList.add("done");
      use.setAttribute("href", "#i-check");
      setTimeout(() => { btn.classList.remove("done"); use.setAttribute("href", "#i-copy"); }, 1400);
    });
  })();

  // The download starts locked; a quiet "start the free trial" link unlocks it.
  // It doesn't start a trial — the 3-day trial begins inside Studio on first open.
  (() => {
    const enable = $("#enableDownload"), dl = $("[data-loader]");
    if (!enable || !dl) return;
    enable.addEventListener("click", () => {
      dl.classList.remove("is-locked");
      enable.remove();
    });
  })();

  $$("[data-discord]").forEach(el => {
    if (CFG.discord) { el.href = CFG.discord; el.target = "_blank"; el.rel = "noopener noreferrer"; }
    else el.style.display = "none";
  });
  // Footer links: hide if not configured rather than leave a dead "#".
  const wire = (sel, href) => $$(sel).forEach(el => {
    if (href) { el.href = href; el.target = "_blank"; el.rel = "noopener noreferrer"; }
    else el.style.display = "none";
  });
  // Terms and License stay VISIBLE at the bottom even before a link exists
  // (the user wants both shown). With a link they become clickable; without,
  // they render as plain, non-clickable text rather than a dead "#".
  const wireOrText = (sel, href) => $$(sel).forEach(el => {
    if (href) { el.href = href; el.target = "_blank"; el.rel = "noopener noreferrer"; }
    else { el.removeAttribute("href"); el.classList.add("nolink"); }
  });
  wireOrText("[data-terms]", CFG.terms);

  /* ── scatter the background specks to random spots each load ──── */
  (() => {
    const blobs = $$(".blob");
    if (!blobs.length || REDUCE) return;
    const rnd = (a, b) => a + Math.random() * (b - a);
    blobs.forEach(b => {
      const size = rnd(46, 82);
      b.style.width = b.style.height = size + "vw";
      b.style.top = rnd(-30, 80) + "%";
      b.style.left = rnd(-30, 80) + "%";
      b.style.right = "auto";
      b.style.bottom = "auto";
      b.style.marginLeft = "0";
      b.style.animationDelay = `${-rnd(0, 16).toFixed(1)}s, ${-rnd(0, 34).toFixed(1)}s`;
    });
  })();

  /* ── nav gains a blur backdrop once the page scrolls ──────────── */
  (() => {
    const nav = $(".nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", scrollY > 12);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  })();

  /* ── reveal on scroll ─────────────────────────────────────────── */
  (() => {
    const items = $$(".reveal");
    if (!items.length) return;
    if (REDUCE) { items.forEach(el => el.classList.add("in")); return; }
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  })();

  /* ── background particles ─────────────────────────────────────────
     Uses the real particle.png sprite, drawn white. Particles seed across the
     WHOLE viewport and drift in any direction rather than rising from the
     bottom edge, and they wrap at the edges so the field stays even.      */
  (() => {
    const cv = $("#vfx");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let w = 0, h = 0, parts = [], raf = 0, last = 0, sprite = null, ready = false;
    const rand = (a, b) => a + Math.random() * (b - a);

    const spawn = () => ({
      x: rand(-40, w + 40), y: rand(-40, h + 40),
      size: rand(16, 54),
      vx: rand(-3, 3), vy: rand(10, 26),         // drift downward
      spin: rand(-24, 24), rot: rand(0, 360),
      life: rand(0, 1), ttl: rand(9, 20),
    });

    // The PNG is already white, so it is used as-is.
    function buildSprites(img) {
      sprite = img;
      ready = true;
    }

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      cv.width = Math.floor(w * dpr); cv.height = Math.floor(h * dpr);
      cv.style.width = w + "px"; cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = Array.from({ length: Math.max(16, Math.min(54, Math.round(w * h / 26000))) }, spawn);
    }

    function frame(t) {
      const dt = Math.min((t - last) / 1000 || 0, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      if (ready) {
        ctx.globalCompositeOperation = "lighter";
        for (const p of parts) {
          p.life += dt / p.ttl;
          if (p.life >= 1) { Object.assign(p, spawn(), { life: 0 }); continue; }
          p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.spin * dt;
          // wrap rather than respawn at an edge, so the field stays even
          if (p.x < -60) p.x = w + 60; else if (p.x > w + 60) p.x = -60;
          if (p.y < -60) p.y = h + 60; else if (p.y > h + 60) p.y = -60;
          const a = Math.min(p.life / 0.18, 1) * Math.min((1 - p.life) / 0.35, 1);
          ctx.globalAlpha = 0.5 * a;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot * Math.PI / 180);
          ctx.drawImage(sprite, -p.size / 2, -p.size / 2, p.size, p.size);
          ctx.setTransform(Math.min(devicePixelRatio || 1, 2), 0, 0, Math.min(devicePixelRatio || 1, 2), 0, 0);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
      raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const stop  = () => { cancelAnimationFrame(raf); raf = 0; };

    const img = new Image();
    img.onload = () => {
      buildSprites(img);
      resize();
      if (REDUCE) { last = performance.now(); frame(last + 16); stop(); }
      else {
        document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
        start();
      }
    };
    img.onerror = () => {};   // no sprite, no background. Everything else still works.
    img.src = "particle.png";
    addEventListener("resize", () => { if (ready) resize(); }, { passive: true });
  })();

  /* ── stats ────────────────────────────────────────────────────── */
  (() => {
    const countTo = (el, n) => {
      if (!el) return;
      const dur = 1100, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (CFG.API) {
      fetch(CFG.API + "/v1/stats")
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(d => { if (d && d.ok) countTo($('[data-stat="installs"]'), d.installs || 0); })
        .catch(() => {});
    }
    if (CFG.repo) {
      const slug = CFG.repo.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
      fetch(`https://api.github.com/repos/${slug}/releases`)
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(list => {
          const rel = Array.isArray(list) ? list.find(x => !x.draft) : null;
          const el = $('[data-stat="version"]');
          if (rel && el) el.textContent = rel.tag_name;
        })
        .catch(() => {});
    }
  })();

  /* ── showcase: an endless, freely scrolling strip ─────────────────
     The clips are rendered three times over. Scrolling past either end
     silently jumps by exactly one set width, and because the sets are
     identical the seam cannot be seen, so it loops forever in both
     directions. No scroll-snap anywhere: a release just decays its
     momentum, which is what makes it glide instead of yanking.         */
  (() => {
    const strip = $("#strip");
    if (!strip) return;

    const render = (videos) => {
      const usable = videos.filter(v => v && v.src);
      if (!usable.length) {
        strip.innerHTML = `<div class="empty">Add clips to docs/media and list them in videos.json</div>`;
        return;
      }

      const SETS = 3;
      for (let s = 0; s < SETS; s++) {
        for (const v of usable) {
          const el = document.createElement("div");
          el.className = "clip";
          el.innerHTML =
            `<video muted loop playsinline preload="metadata" src="${esc(v.src)}"${
              v.poster ? ` poster="${esc(v.poster)}"` : ""}></video>` +
            (v.title ? `<span class="cap">${esc(v.title)}</span>` : "");
          strip.appendChild(el);
        }
      }

      const clips = $$(".clip", strip);
      let setW = 0;
      const measure = () => {
        const per = clips.length / SETS;
        const first = clips[0], nextSet = clips[per];
        setW = nextSet ? nextSet.offsetLeft - first.offsetLeft : 0;
      };

      const io = new IntersectionObserver((es) => {
        for (const e of es) {
          if (e.isIntersecting) { const p = e.target.play(); if (p) p.catch(() => {}); }
          else e.target.pause();
        }
      }, { threshold: 0.3 });
      $$("video", strip).forEach(v => io.observe(v));

      // Keep the scroll position inside the middle set. Re-measures itself if
      // the first measurement landed before layout was ready (offsetLeft is 0
      // until then), otherwise the loop would silently never engage.
      const wrap = () => {
        if (!setW) measure();
        if (!setW) return;
        if (strip.scrollLeft < setW * 0.5) strip.scrollLeft += setW;
        else if (strip.scrollLeft > setW * 1.5) strip.scrollLeft -= setW;
      };

      let rafMark = 0;
      const mark = () => {
        cancelAnimationFrame(rafMark);
        rafMark = requestAnimationFrame(() => {
          const c = strip.scrollLeft + strip.clientWidth / 2;
          let win = clips[0], best = Infinity;
          for (const el of clips) {
            const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - c);
            if (d < best) { best = d; win = el; }
          }
          clips.forEach(el => el.classList.toggle("active", el === win));
        });
      };

      strip.addEventListener("scroll", () => { wrap(); mark(); }, { passive: true });

      const settle = () => {
        measure();
        strip.scrollLeft = setW;      // start in the middle set
        mark();
      };
      // offsetLeft is only real once layout has run.
      requestAnimationFrame(settle);
      addEventListener("resize", () => { measure(); mark(); }, { passive: true });

      /* drag with momentum, no snapping */
      let down = false, sx = 0, sl = 0, moved = false;
      let vel = 0, lastX = 0, lastT = 0, glide = 0;

      strip.addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "mouse") return;
        cancelAnimationFrame(glide);
        down = true; moved = false; vel = 0;
        sx = lastX = e.clientX; sl = strip.scrollLeft; lastT = performance.now();
        strip.classList.add("dragging");
      });
      strip.addEventListener("pointermove", (e) => {
        if (!down) return;
        const now = performance.now(), dt = now - lastT;
        if (dt > 0) vel = (e.clientX - lastX) / dt;     // px per ms
        lastX = e.clientX; lastT = now;
        const dx = e.clientX - sx;
        if (Math.abs(dx) > 3) moved = true;
        strip.scrollLeft = sl - dx;
      });
      const release = () => {
        if (!down) return;
        down = false;
        strip.classList.remove("dragging");
        if (REDUCE) return;
        let v = vel * 16;                               // px per frame
        const step = () => {
          v *= 0.94;                                    // friction
          strip.scrollLeft -= v;
          wrap();
          if (Math.abs(v) > 0.25) glide = requestAnimationFrame(step);
        };
        if (Math.abs(v) > 0.5) glide = requestAnimationFrame(step);
      };
      addEventListener("pointerup", release);
      addEventListener("pointercancel", release);

      strip.addEventListener("click", (e) => {
        if (moved) { e.preventDefault(); e.stopPropagation(); }
      }, true);
    };

    fetch("videos.json")
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => render(Array.isArray(d) ? d : (d.videos || [])))
      .catch(() => render([]));
  })();

  /* ── buy card ─────────────────────────────────────────────────── */
  (() => {
    const card = $(".buycard");
    if (!card) return;
    const pay = CFG.pay || {};
    const price = CFG.price || "$5";

    // On  = buy a code, so no account is needed and the username field hides.
    // Off = applied straight to the username shown below.
    const tog = $("#codeToggle"), sub = $("#toggleSub"), userWrap = $("#userWrap");
    const setMode = (on) => {
      tog.setAttribute("aria-checked", String(on));
      sub.textContent = on
        ? "You get a code. Redeem it whenever you want, on any account."
        : "Applied straight to the account below. It unlocks next time you open Studio.";
      if (userWrap) userWrap.classList.toggle("hidden", on);
    };
    tog.addEventListener("click", () => setMode(tog.getAttribute("aria-checked") !== "true"));
    setMode(false);

    // Reveal + focus the username field (turning the code toggle off so it is
    // visible) so the redeem popup can borrow whatever gets typed here.
    revealUserField = () => {
      setMode(false);
      const buy = $("#buyUser");
      if (!buy) return;
      buy.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "center" });
      setTimeout(() => buy.focus(), REDUCE ? 0 : 240);
    };

    // A small centered window, so PayPal feels like a popup rather than a full
    // page redirect. Falls back to a normal tab if the popup is blocked.
    const openPopup = (url) => {
      const w = 480, h = 720;
      const x = Math.max(0, (screen.availWidth - w) / 2);
      const y = Math.max(0, (screen.availHeight - h) / 2);
      const win = window.open(url, "svfx_pay", `width=${w},height=${h},left=${x},top=${y}`);
      if (win) win.focus(); else window.open(url, "_blank", "noopener");
    };

    // badge is {icon:"i-robux"} or {mono:"S"}. `marks` (optional) draws a row of
    // accepted-method logos on the right instead of the arrow (used for Card).
    // mode: "popup" opens the link in a centered popup window.
    const tile = ({ href, cls, name, meta, badge, marks, mode }) => {
      const live = typeof href === "string" && href.length > 0;
      const a = document.createElement("a");
      a.className = `pay ${cls}` + (live ? "" : " soon");
      a.href = live ? href : "#";
      if (live) {
        if (mode === "popup") a.addEventListener("click", (e) => { e.preventDefault(); openPopup(href); });
        else if (mode === "paypal") a.addEventListener("click", (e) => {
          e.preventDefault();
          openPopup(href);
          const pm = $("#m-paypal");                 // show the "get your code" step on the main page
          if (pm) pm.hidden = false;
        });
        else if (mode === "roblox") a.addEventListener("click", (e) => {
          e.preventDefault();
          openPopup(href);
          openClaim();                                // show the "check your purchase" step
        });
        else { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      }
      let badgeHtml;
      if (badge.mask) badgeHtml =
        `<span class="bmask" style="-webkit-mask-image:url('${badge.mask}');mask-image:url('${badge.mask}')"></span>`;
      else if (badge.img) badgeHtml = `<img class="bimg" src="${badge.img}" alt="">`;
      else if (badge.icon) badgeHtml = `<svg class="bic"><use href="#${badge.icon}"/></svg>`;
      else badgeHtml = `<span class="mono">${esc(badge.mono)}</span>`;
      const arrow = `<span class="parrow"><svg class="ic"><use href="#i-arrow"/></svg></span>`;
      let right;
      if (!live) right = `<span class="ptag">soon</span>`;
      else if (marks && marks.length) right =
        `<span class="pmarks">${marks.map(m =>
          `<svg class="pmark m-${m}"><use href="#m-${m}"/></svg>`).join("")}</span>` + arrow;
      else right = arrow;
      a.innerHTML =
        `<span class="pbadge">${badgeHtml}</span>` +
        `<span class="ptext"><span class="pname">${esc(name)}</span>` +
        (meta ? `<span class="pmeta">${esc(meta)}</span>` : "") + `</span>` +
        right;
      return a;
    };

    const list = $("#pays");
    if (!list) return;
    list.innerHTML = "";
    const robux = (CFG.robux || 1300).toLocaleString();

    list.appendChild(tile({
      href: pay.stripe, cls: "pay-lemon", name: "Card",
      meta: price, mode: "popup",
      badge: { mask: "icon-card.png" },
      marks: ["visa", "mc", "apay", "gpay"],
    }));
    list.appendChild(tile({
      href: pay.creatorStore, cls: "pay-store", name: "Creator Store",
      meta: `${price} on Roblox, installs into Studio`, mode: "roblox",
      badge: { mask: "icon-dev1.png" },
    }));
    list.appendChild(tile({
      href: pay.shirt, cls: "pay-robux", name: `${robux} Robux`,
      meta: `${price} after devex + 30 percent`, mode: "roblox",
      badge: { mask: "icon-dev2.png" },
    }));
    list.appendChild(tile({
      href: pay.paypal, cls: "pay-paypal", name: "PayPal",
      meta: `${price} by PayPal`, mode: "paypal",
      badge: { img: "icon-paypal.png" },
    }));

    // Every option opens in a popup window, so this page stays visible behind
    // it — glide down to the Setup steps so they're ready when the buyer closes
    // the checkout.
    $$(".pay:not(.soon)", list).forEach(a => {
      a.addEventListener("click", () => {
        setTimeout(() => $("#setup")?.scrollIntoView({
          behavior: REDUCE ? "auto" : "smooth", block: "start",
        }), 60);
      });
    });

    // Robux price, read live from the Roblox listing so it always matches reality
    // (the number in config is only the fallback until this lands).
    const shirtId = (pay.shirt || "").match(/(\d{6,})/);
    if (CFG.API && shirtId) {
      fetch(`${CFG.API}/v1/price?asset=${shirtId[1]}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (d && d.ok && d.robux) {
            const el = $(".pay-robux .pname");
            if (el) el.textContent = `${Number(d.robux).toLocaleString()} Robux`;
          }
        }).catch(() => {});
    }

    const tos = $("#tos");
    if (tos) {
      const link = CFG.terms ? `<a href="${esc(CFG.terms)}">Terms of Service</a>` : "Terms of Service";
      tos.innerHTML = `By buying you agree to the ${link}. Sales are final once a code has been ` +
        `redeemed. Sine VFX is a Roblox Studio plugin and is not affiliated with Roblox Corporation.`;
    }
  })();

  /* ── redeem modal ─────────────────────────────────────────────────
     The popup never asks for a username. It uses the one typed on the buy
     card and shows "Unlocking for @name". If that field is empty, it reveals
     and focuses it instead of opening the popup.                            */
  (() => {
    const open = () => {
      const m = $("#m-redeem");
      if (!m) return;
      const u = ($("#buyUser")?.value || "").trim();
      if (!u) { revealUserField(); return; }
      const using = $("#usingName");
      if (using) using.innerHTML = `Unlocking for <b>@${esc(u)}</b>`;
      m.hidden = false;
      $("#code")?.focus();
    };
    const close = () => $$(".modal").forEach(m => m.hidden = true);

    $$("[data-modal='redeem']").forEach(b => b.addEventListener("click", open));
    $$("[data-close]").forEach(b => b.addEventListener("click", close));
    $$(".modal").forEach(m => m.addEventListener("click", (e) => { if (e.target === m) close(); }));
    addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  })();

  /* ── redeem ───────────────────────────────────────────────────── */
  (() => {
    const form = $("#redeemForm"), out = $("#redeemResult");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const key = $("#code").value.trim();
      const username = ($("#buyUser")?.value || "").trim();
      if (!key || !username) { if (!username) revealUserField(); return; }

      const btn = $("button[type=submit]", form);
      btn.disabled = true;
      out.className = "result";
      out.textContent = "Checking";
      try {
        const r = await fetch(CFG.API + "/v1/redeem", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ key, username }),
        });
        const d = await r.json().catch(() => ({}));
        if (r.ok && d.ok) {
          out.className = "result ok";
          out.textContent = `Done. ${d.username} has access. Now install it below.`;
          form.reset();
          // Send them to the Setup steps once they have read the confirmation.
          setTimeout(() => {
            $$(".modal").forEach(m => m.hidden = true);
            $("#setup")?.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
          }, 1400);
        } else {
          out.className = "result err";
          out.textContent = d.error || "That code could not be redeemed.";
        }
      } catch {
        out.className = "result err";
        out.textContent = "Could not reach the server. Try again.";
      } finally {
        btn.disabled = false;
      }
    });
  })();

  /* ── unlock a Roblox purchase: verify ownership, no code needed ─────
     For the Robux shirt and Creator Store, buying makes the account OWN the item,
     so the buyer just types their username and the Worker confirms it with Roblox. */
  (() => {
    const m = $("#m-claim"), form = $("#claimForm"), out = $("#claimResult"), using = $("#claimUsing");
    if (!m || !form) return;

    openClaim = () => {
      const u = ($("#buyUser")?.value || "").trim();
      if (!u) { revealUserField(); return; }        // needs the username from the buy card
      if (using) using.innerHTML = `Checking <b>@${esc(u)}</b>`;
      if (out) { out.className = "result"; out.textContent = ""; }
      m.hidden = false;
    };
    $$("[data-modal='claim']").forEach(b => b.addEventListener("click", openClaim));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = ($("#buyUser")?.value || "").trim();
      if (!username) { revealUserField(); return; }
      if (!CFG.API) return;
      const btn = $("button[type=submit]", form);
      btn.disabled = true;
      out.className = "result";
      out.textContent = "Checking your Roblox account…";
      try {
        const r = await fetch(CFG.API + "/v1/claim", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const d = await r.json().catch(() => ({}));
        if (r.ok && d.ok) {
          out.className = "result ok";
          out.textContent = d.alreadyHad
            ? `${d.username} already has access — you're all set. Install it below.`
            : `Found your purchase. ${d.username} is now unlocked. Install it below.`;
          setTimeout(() => {
            m.hidden = true;
            $("#setup")?.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
          }, 1800);
        } else {
          out.className = "result err";
          out.textContent = d.message || d.error || "Could not check that account.";
        }
      } catch {
        out.className = "result err";
        out.textContent = "Could not reach the server. Try again.";
      } finally {
        btn.disabled = false;
      }
    });
  })();

  /* ── PayPal: after paying, fetch the code minted by the IPN, by email ── */
  (() => {
    const m = $("#m-paypal"), form = $("#paypalForm"), out = $("#paypalResult"), input = $("#paypalEmail");
    if (!m || !form) return;

    const deliver = (key) => {
      const box = $("#setupCode"); if (box) box.value = key;
      const codeInput = $("#code"); if (codeInput) codeInput.value = key;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (input?.value || "").trim();
      if (!email || !CFG.API) return;
      const btn = $("button[type=submit]", form);
      btn.disabled = true;
      out.className = "result";
      out.textContent = "Looking for your payment…";
      let tries = 0;
      const poll = () => {
        fetch(`${CFG.API}/v1/paypal/order?email=${encodeURIComponent(email)}`)
          .then(r => r.ok ? r.json() : null)
          .then(d => {
            if (d && d.ok && d.key) {
              deliver(d.key);
              out.className = "result ok";
              out.textContent = "Found it. Your code is filled in below. Redeem it with your username.";
              setTimeout(() => {
                m.hidden = true;
                $("#setup")?.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
              }, 1600);
            } else if (tries++ < 20) {
              setTimeout(poll, 2000);            // IPN may still be in flight
            } else {
              out.className = "result err";
              out.textContent = "No payment found for that email yet. If you just paid, wait a moment and try again.";
              btn.disabled = false;
            }
          })
          .catch(() => {
            if (tries++ < 20) setTimeout(poll, 2000);
            else { out.className = "result err"; out.textContent = "Could not reach the server. Try again."; btn.disabled = false; }
          });
      };
      poll();
    });
  })();

  /* ── back from a Stripe checkout: fetch the code it minted and show it ──
     Stripe's success redirect carries ?session_id=…. Because the checkout ran in a
     popup window, that redirect lands INSIDE the popup — so the popup hands the
     session back to the main page and closes. The main page then polls /v1/order
     until the webhook's code lands, drops it into the Setup box + redeem field, and
     glides down so they can redeem it.                                             */
  (() => {
    if (!CFG.API) return;

    const showCode = (sid) => {
      const box = $("#setupCode");
      const hint = box?.closest(".minicard")?.querySelector(".mchint");
      if (hint) hint.textContent = "Getting your code…";
      let tries = 0;
      const poll = () => {
        fetch(`${CFG.API}/v1/order?session=${encodeURIComponent(sid)}`)
          .then(r => r.ok ? r.json() : null)
          .then(d => {
            if (d && d.ok && d.key) {
              if (box) box.value = d.key;
              const codeInput = $("#code");
              if (codeInput) codeInput.value = d.key;
              if (hint) hint.textContent = "Your code is ready. Redeem it below.";
              $("#setup")?.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
            } else if (tries++ < 12) {
              setTimeout(poll, 1500);          // webhook may still be in flight
            } else if (hint) {
              hint.textContent = "Payment received. If no code shows, contact us on Discord.";
            }
          })
          .catch(() => { if (tries++ < 12) setTimeout(poll, 1500); });
      };
      poll();
    };

    // The main window listens for the popup handing back its session id.
    addEventListener("message", (e) => {
      if (e.origin !== location.origin || !e.data || !e.data.svfxSession) return;
      showCode(String(e.data.svfxSession));
    });

    const sid = new URLSearchParams(location.search).get("session_id");
    if (!sid) return;
    history.replaceState({}, "", location.pathname + location.hash);
    // If we're the checkout popup, hand off to the opener and close; else show here.
    if (window.opener && !window.opener.closed && window.opener !== window) {
      try { window.opener.postMessage({ svfxSession: sid }, location.origin); window.close(); return; }
      catch { /* cross-origin or blocked: fall through and show it in this window */ }
    }
    showCode(sid);
  })();

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
})();
