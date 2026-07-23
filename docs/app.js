/* SineVFX site. No dependencies, no build step — GitHub Pages serves this as-is. */
(() => {
  "use strict";
  const CFG = window.SVFX_CONFIG || {};
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ── static text from config ──────────────────────────────────── */
  $$("[data-price]").forEach(el => el.textContent = CFG.price || "$5");
  $$("[data-price-note]").forEach(el => el.textContent = CFG.priceNote || "one-time");
  $$("[data-trial-days]").forEach(el => el.textContent = CFG.trialDays ?? 3);
  $$("[data-repo]").forEach(el => { if (CFG.repo) el.href = CFG.repo; });

  /* ── VFX background ───────────────────────────────────────────────
     Slow embers drifting upward. Tuned to read as texture, not decoration:
     sparse, dim, single hue, and mostly hidden behind the vignette. If you
     can consciously notice it while reading, it is turned up too high.
     Cheap too — count scales with viewport area and it pauses when hidden. */
  (() => {
    const cv = $("#vfx");
    if (!cv) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = cv.getContext("2d", { alpha: true });
    let w = 0, h = 0, dpr = 1, parts = [], raf = 0, last = 0;

    const rand = (a, b) => a + Math.random() * (b - a);

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      cv.width = Math.floor(w * dpr); cv.height = Math.floor(h * dpr);
      cv.style.width = w + "px"; cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // ~1 particle per 26k px², clamped so phones and ultrawides both behave.
      const target = Math.max(14, Math.min(52, Math.round((w * h) / 26000)));
      parts = Array.from({ length: target }, spawn);
    }

    function spawn() {
      return {
        x: rand(0, w), y: rand(0, h),
        r: rand(0.6, 1.8),
        vy: rand(-6, -17),          // px/sec, upward
        vx: rand(-3, 3),
        life: rand(0, 1),
        ttl: rand(9, 20),
      };
    }

    function frame(t) {
      const dt = Math.min((t - last) / 1000 || 0, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        p.life += dt / p.ttl;
        if (p.life >= 1) { Object.assign(p, spawn(), { y: h + 8, life: 0 }); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        // fade in over the first 15%, out over the last 35%
        const a = Math.min(p.life / 0.15, 1) * Math.min((1 - p.life) / 0.35, 1);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7);
        g.addColorStop(0, `hsla(216,80%,64%,${0.22 * a})`);
        g.addColorStop(1, `hsla(216,80%,58%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 7, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function stop()  { cancelAnimationFrame(raf); raf = 0; }

    resize();
    addEventListener("resize", resize, { passive: true });
    if (reduce) {
      // Draw one static field so the page still has depth, then leave it alone.
      last = performance.now(); frame(last + 16); stop();
    } else {
      document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
      start();
    }
  })();

  /* ── live stats ───────────────────────────────────────────────────
     Counters stay as "—" if the API is unreachable. Showing a real zero
     would be worse than showing nothing.                                */
  (() => {
    const set = (k, v) => { const el = $(`[data-stat="${k}"]`); if (el) el.textContent = v; };

    const countTo = (el, n) => {
      if (!el) return;
      const dur = 900, t0 = performance.now();
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
        .then(d => {
          if (!d || d.ok !== true) throw new Error("bad payload");
          countTo($('[data-stat="users"]'), d.users || 0);
          countTo($('[data-stat="installs"]'), d.installs || 0);
        })
        .catch(() => { set("users", "—"); set("installs", "—"); });
    }

    // Version comes from the GitHub releases API, same source the plugin uses.
    if (CFG.repo) {
      const slug = CFG.repo.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
      fetch(`https://api.github.com/repos/${slug}/releases`)
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(list => {
          const rel = Array.isArray(list) ? list.find(r => !r.draft) : null;
          set("version", rel ? rel.tag_name : "—");
        })
        .catch(() => set("version", "—"));
    }
  })();

  /* ── showcase carousel ────────────────────────────────────────────
     Built from videos.json so adding a clip is a one-line edit. Native
     scroll-snap does the swiping; buttons and dots just drive scrollLeft,
     which keeps touch, trackpad and keyboard all working for free.
     Embeds load only on click — 5 autoplaying iframes would tank the page. */
  (() => {
    const track = $("#track"), dots = $("#dots");
    if (!track) return;

    const slideEl = (v) => {
      const el = document.createElement("article");
      el.className = "slide";

      const thumb = v.type === "youtube"
        ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`
        : (v.poster || "");

      el.innerHTML = `
        <div class="frame" role="button" tabindex="0" aria-label="Play ${escapeAttr(v.title || "video")}">
          ${thumb ? `<img loading="lazy" src="${escapeAttr(thumb)}" alt="">` : ""}
          <span class="play" aria-hidden="true"></span>
        </div>
        <div class="meta">
          <h3>${escapeHtml(v.title || "")}</h3>
          <p>${escapeHtml(v.caption || "")}</p>
        </div>`;

      const frame = $(".frame", el);
      const play = () => {
        if (v.type === "youtube") {
          frame.innerHTML =
            `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(v.id)}?autoplay=1&rel=0"
                     title="${escapeAttr(v.title || "")}" allow="autoplay; fullscreen"
                     allowfullscreen></iframe>`;
        } else {
          frame.innerHTML =
            `<video src="${escapeAttr(v.src)}" controls autoplay playsinline
                    ${v.poster ? `poster="${escapeAttr(v.poster)}"` : ""}></video>`;
        }
      };
      frame.addEventListener("click", play);
      frame.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
      });
      return el;
    };

    const render = (videos) => {
      const usable = videos.filter(v =>
        (v.type === "youtube" && v.id && !/^REPLACE/i.test(v.id)) ||
        (v.type === "mp4" && v.src));

      if (!usable.length) {
        track.innerHTML =
          `<div class="empty">No showcase videos yet — add them in
           <code>docs/videos.json</code>.</div>`;
        $$(".car-btn").forEach(b => b.style.display = "none");
        return;
      }

      usable.forEach(v => track.appendChild(slideEl(v)));

      usable.forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `Go to video ${i + 1}`);
        b.addEventListener("click", () => go(i));
        dots.appendChild(b);
      });

      const slides = () => $$(".slide", track);
      const index = () => {
        const c = track.scrollLeft + track.clientWidth / 2;
        return slides().reduce((best, s, i) =>
          Math.abs(s.offsetLeft + s.clientWidth / 2 - c) <
          Math.abs(slides()[best].offsetLeft + slides()[best].clientWidth / 2 - c) ? i : best, 0);
      };
      const go = (i) => {
        const s = slides()[Math.max(0, Math.min(i, slides().length - 1))];
        if (s) track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2 });
      };
      const sync = () => {
        const i = index();
        $$("button", dots).forEach((d, n) => d.classList.toggle("on", n === i));
      };

      $(".prev")?.addEventListener("click", () => go(index() - 1));
      $(".next")?.addEventListener("click", () => go(index() + 1));
      track.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft")  { e.preventDefault(); go(index() - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); go(index() + 1); }
      });

      let tid;
      track.addEventListener("scroll", () => {
        clearTimeout(tid);
        tid = setTimeout(sync, 60);
      }, { passive: true });
      sync();
    };

    fetch("videos.json")
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => render(Array.isArray(d) ? d : (d.videos || [])))
      .catch(() => render([]));
  })();

  /* ── payment options ──────────────────────────────────────────────
     Anything still null in config.js renders greyed out with a "soon" tag
     rather than a broken link.                                            */
  (() => {
    const grid = $("#payGrid");
    if (!grid) return;
    const pay = CFG.pay || {};

    const opts = [
      { k: "creatorStore", name: "Roblox / Creator Store", note: "Pay in Robux, on Roblox." },
      { k: "stripe",       name: "Card",                   note: "Stripe checkout." },
      { k: "paypal",       name: "PayPal",                 note: "Balance or card." },
      { k: "crypto",       name: "Crypto",                 note: "BTC, ETH, and others." },
    ];

    grid.innerHTML = "";
    for (const o of opts) {
      const url = pay[o.k];
      const live = typeof url === "string" && url.length > 0;
      const a = document.createElement("a");
      a.className = "pay" + (live ? "" : " soon");
      a.href = live ? url : "#";
      if (live) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      a.innerHTML = `
        <span class="name">${escapeHtml(o.name)}</span>
        <span class="note">${escapeHtml(o.note)}</span>
        <span class="tag ${live ? "live" : ""}">${live ? "available" : "soon"}</span>`;
      grid.appendChild(a);
    }
  })();

  /* ── redeem ───────────────────────────────────────────────────── */
  (() => {
    const form = $("#redeemForm"), out = $("#redeemResult");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const key = $("#code").value.trim();
      const username = $("#user").value.trim();
      if (!key || !username) return;

      const btn = $("button", form);
      btn.disabled = true;
      out.className = "result busy";
      out.textContent = "Checking…";

      try {
        const r = await fetch(CFG.API + "/v1/redeem", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ key, username }),
        });
        const d = await r.json().catch(() => ({}));
        if (r.ok && d.ok) {
          out.className = "result ok";
          out.textContent =
            `Done — ${d.username} now has ${d.tier === "lifetime" ? "lifetime" : "full"} access. ` +
            `Restart Studio and SineVFX will unlock itself.`;
          form.reset();
        } else {
          out.className = "result err";
          out.textContent = d.error || "That code could not be redeemed.";
        }
      } catch {
        out.className = "result err";
        out.textContent = "Could not reach the server. Check your connection and try again.";
      } finally {
        btn.disabled = false;
      }
    });
  })();

  /* ── helpers ──────────────────────────────────────────────────── */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }
})();
