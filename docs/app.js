/* SineVFX site. No dependencies, no build step. GitHub Pages serves this as-is. */
(() => {
  "use strict";
  const CFG = window.SVFX_CONFIG || {};
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

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


  $$("[data-discord]").forEach(el => {
    if (CFG.discord) { el.href = CFG.discord; el.target = "_blank"; el.rel = "noopener noreferrer"; }
    else el.style.display = "none";
  });
  // Creator Store button (its own choice above the buy card) → opens the Roblox store directly.
  $$("[data-store]").forEach(el => {
    if (CFG.pay && CFG.pay.creatorStore) { el.href = CFG.pay.creatorStore; el.target = "_blank"; el.rel = "noopener noreferrer"; }
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
    // User count is a static value from config now (no database). Just edit CFG.users.
    countTo($('[data-stat="installs"]'), Number(CFG.users) || 0);
    // Version is a static value from config now (no longer pulled from GitHub releases).
    const vEl = $('[data-stat="version"]');
    if (vEl && CFG.version) vEl.textContent = CFG.version;
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
            `<video muted loop playsinline preload="none" src="${esc(v.src)}"${
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

      // Only the clips actually on screen are candidates for playback. Decoding
      // several 720p streams at once is what makes the strip stutter while it
      // loads, so we additionally cap how many play simultaneously (see
      // prunePlayback below) and only start a clip's download once it's near.
      const visible = new Set();
      const io = new IntersectionObserver((es) => {
        for (const e of es) {
          const v = e.target;
          if (e.isIntersecting) { visible.add(v); if (v.preload !== "auto") v.preload = "auto"; }
          else { visible.delete(v); v.pause(); }
        }
        prunePlayback();
      }, { threshold: 0.25 });
      $$("video", strip).forEach(v => io.observe(v));

      // Keep at most MAX_PLAYING videos running — the ones closest to the centre
      // of the viewport. Everything else pauses, which keeps the decoder from
      // thrashing (the source of the scroll lag) without the field looking dead.
      const MAX_PLAYING = 3;
      const prunePlayback = () => {
        const c = strip.scrollLeft + strip.clientWidth / 2;
        const near = [...visible].sort((a, b) => {
          const pa = a.parentElement, pb = b.parentElement;
          return Math.abs(pa.offsetLeft + pa.offsetWidth / 2 - c)
               - Math.abs(pb.offsetLeft + pb.offsetWidth / 2 - c);
        });
        near.forEach((v, i) => {
          if (i < MAX_PLAYING) { if (v.paused) { const p = v.play(); if (p) p.catch(() => {}); } }
          else if (!v.paused) v.pause();
        });
      };

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
          prunePlayback();
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

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
})();
