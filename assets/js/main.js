(function () {
  "use strict";

  /* ── Helpers ──────────────────────────────────────────── */
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ── 1. SPLASH ────────────────────────────────────────── */
  function initSplash() {
    const splash = $("[data-splash]");
    if (!splash) return;
    function hideSplash() {
      splash.classList.add("is-out");
      setTimeout(() => {
        splash.style.display = "none";
        triggerHeroEntrance();
        showWhatsApp();
      }, 550);
    }
    if (document.readyState === "complete") {
      setTimeout(hideSplash, 3800);
    } else {
      window.addEventListener("load", () => setTimeout(hideSplash, 3800));
    }
    setTimeout(hideSplash, 5500); // last resort
  }

  /* ── 2. HERO ENTRANCE ─────────────────────────────────── */
  function triggerHeroEntrance() {
    var eyebrow = $(".hero-eyebrow");
    var subtitle = $(".hero-subtitle");
    var actions = $(".hero-actions");
    if (eyebrow) eyebrow.classList.add("is-visible");
    if (subtitle) subtitle.classList.add("is-visible");
    if (actions) actions.classList.add("is-visible");
    // Animate h1 words
    $$(".hero-title .word-inner").forEach(function (w, i) {
      w.style.transition =
        "transform 0.75s var(--ease-soft) " + (i * 0.09) + "s, " +
        "opacity 0.6s ease " + (i * 0.09) + "s";
      w.style.transform = "translateY(0)";
      w.style.opacity = "1";
    });
  }

  /* ── 3. WORD SPLIT for H1 ─────────────────────────────── */
  function initWordSplit() {
    var h1 = $(".hero-title");
    if (!h1) return;
    // Preserve innerHTML but wrap text nodes
    function wrapNode(node) {
      if (node.nodeType === 3) {
        return node.textContent.split(/(\s+)/).map(function (w) {
          if (/^\s+$/.test(w)) return w;
          return '<span class="word" style="display:inline-block;overflow:hidden">' +
            '<span class="word-inner" style="display:inline-block;transform:translateY(70px);opacity:0">' +
            w + "</span></span>";
        }).join("");
      }
      if (node.nodeName === "BR") return "<br>";
      if (node.nodeType === 1) {
        var tag = node.tagName.toLowerCase();
        var inner = Array.from(node.childNodes).map(wrapNode).join("");
        return "<" + tag + ">" + inner + "</" + tag + ">";
      }
      return "";
    }
    h1.innerHTML = Array.from(h1.childNodes).map(wrapNode).join("");
  }

  /* ── 4. NAVBAR ────────────────────────────────────────── */
  function initNav() {
    var nav = $("#nav");
    var hamburger = $(".nav-hamburger");
    var mobileMenu = $("#mobile-menu");
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 80) {
        nav.classList.add("is-solid");
      } else {
        nav.classList.remove("is-solid");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", function () {
        var isOpen = hamburger.classList.toggle("is-open");
        hamburger.setAttribute("aria-expanded", String(isOpen));
        if (isOpen) {
          mobileMenu.classList.add("is-open");
          mobileMenu.removeAttribute("aria-hidden");
        } else {
          mobileMenu.classList.remove("is-open");
          mobileMenu.setAttribute("aria-hidden", "true");
        }
      });
      // Close on link click
      $$(".nav-mobile-link", mobileMenu).forEach(function (link) {
        link.addEventListener("click", function () {
          hamburger.classList.remove("is-open");
          hamburger.setAttribute("aria-expanded", "false");
          mobileMenu.classList.remove("is-open");
          mobileMenu.setAttribute("aria-hidden", "true");
        });
      });
    }
  }

  /* ── 5. SMOOTH SCROLL (anchor links) ─────────────────── */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href^='#']");
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = 80;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  }

  /* ── 6. SCROLL PROGRESS BAR ───────────────────────────── */
  function initScrollBar() {
    var bar = $("#scroll-bar");
    if (!bar) return;
    window.addEventListener("scroll", function () {
      var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      bar.style.width = pct + "%";
    }, { passive: true });
  }

  /* ── 7. SCROLL TOP BUTTON ─────────────────────────────── */
  function initScrollTop() {
    var btn = $("#scroll-top");
    if (!btn) return;
    btn.removeAttribute("hidden");
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── 8. CARD STAGGER ENTRANCE ─────────────────────────── */
  function initCardEntrance() {
    var cards = $$(".service-card, .prestacion-item");
    cards.forEach(function (card, i) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          setTimeout(function () {
            card.style.transition = "opacity 0.6s ease, transform 0.6s var(--ease-soft)";
            card.classList.add("is-visible");
          }, (i % 4) * 80);
          obs.disconnect();
        });
      }, { threshold: 0.05 });
      obs.observe(card);
    });
  }

  /* ── 9. COUNT-UP STATS ────────────────────────────────── */
  function initCountUp() {
    $$("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var observed = false;
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || observed) return;
          observed = true;
          if (window.gsap) {
            gsap.to({ val: 0 }, {
              val: target, duration: 2, ease: "power2.out",
              snap: { val: 1 },
              onUpdate: function () {
                el.textContent = Math.round(this.targets()[0].val);
              }
            });
          } else {
            // Fallback no GSAP
            var start = 0; var dur = 1800;
            var startTime = null;
            function step(ts) {
              if (!startTime) startTime = ts;
              var prog = Math.min((ts - startTime) / dur, 1);
              el.textContent = Math.round(prog * target);
              if (prog < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          }
          obs.disconnect();
        });
      }, { threshold: 0.1 });
      obs.observe(el);
    });
  }

  /* ── 10. CLIP-PATH REVEAL (quiénes somos image) ───────── */
  function initClipReveal() {
    $$("[data-clip-reveal]").forEach(function (el) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          el.style.transition = "clip-path 1.4s var(--ease-soft)";
          el.style.clipPath = "inset(0 0 0% 0)";
          obs.disconnect();
        });
      }, { threshold: 0.05 });
      obs.observe(el);
    });
  }

  /* ── 11. CAROUSEL / TESTIMONIOS ──────────────────────── */
  function initCarousel() {
    var track = $("#carousel-track");
    var prevBtn = $(".carousel-btn--prev");
    var nextBtn = $(".carousel-btn--next");
    var dots = $$(".carousel-dot");
    if (!track) return;

    var cards = $$(".testimonial-card", track);
    var total = cards.length;
    var current = 0;
    var autoTimer = null;
    var paused = false;

    function getVisible() {
      var w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 720) return 2;
      return 1;
    }

    function goTo(idx) {
      var vis = getVisible();
      var max = Math.max(0, total - vis);
      current = Math.max(0, Math.min(idx, max));
      var cardW = track.parentElement.offsetWidth;
      var gap = 24;
      var singleW = (cardW - gap * (vis - 1)) / vis;
      var offset = current * (singleW + gap);
      track.style.transform = "translateX(-" + offset + "px)";
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === current);
        d.setAttribute("aria-selected", String(i === current));
      });
    }

    function next() { goTo(current + 1 >= total - getVisible() + 1 ? 0 : current + 1); }
    function prev() { goTo(current <= 0 ? Math.max(0, total - getVisible()) : current - 1); }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); resetAuto(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); resetAuto(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { goTo(i); resetAuto(); });
    });

    // Pause on hover
    track.parentElement.addEventListener("mouseover", function () { paused = true; });
    track.parentElement.addEventListener("mouseout",  function () { paused = false; });

    function autoPlay() {
      autoTimer = setInterval(function () {
        if (!paused) next();
      }, 4500);
    }
    function resetAuto() {
      clearInterval(autoTimer); autoPlay();
    }

    goTo(0);
    autoPlay();
    window.addEventListener("resize", function () { goTo(current); });
  }

  /* ── 12. CONTACT FORM ─────────────────────────────────── */
  function initContactForm() {
    var form = $("#contact-form");
    var btn = $("#btn-submit");
    var success = $("#form-success");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (btn) { btn.disabled = true; btn.textContent = "ENVIANDO…"; }
      // Simulate send (replace with real endpoint when ready)
      setTimeout(function () {
        if (btn) { btn.disabled = false; btn.textContent = "ENVIAR CONSULTA"; }
        if (success) { success.removeAttribute("hidden"); }
        form.reset();
        setTimeout(function () {
          if (success) success.setAttribute("hidden", "");
        }, 5000);
      }, 1200);
    });
  }

  /* ── 13. WHATSAPP FAB ─────────────────────────────────── */
  function showWhatsApp() {
    setTimeout(function () {
      var fab = $("#whatsapp-fab");
      if (fab) fab.classList.add("is-visible");
    }, 2500);
  }

  /* ── 14. CUSTOM CURSOR ────────────────────────────────── */
  function initCursor() {
    var dot  = $(".cursor-dot");
    var ring = $(".cursor-ring");
    if (!dot || !ring) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var mx = -100, my = -100, rx = -100, ry = -100;
    var firstMove = false;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate3d(" + (mx - 2.5) + "px," + (my - 2.5) + "px,0)";
      if (!firstMove) {
        firstMove = true;
        rx = mx; ry = my;
        ring.style.transform = "translate3d(" + (rx - 16) + "px," + (ry - 16) + "px,0)";
        dot.classList.add("ready");
        ring.classList.add("ready");
      }
    });

    (function lerp() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = "translate3d(" + (rx - 16) + "px," + (ry - 16) + "px,0)";
      requestAnimationFrame(lerp);
    })();

    var hovers = "a, button, .service-card, .prestacion-item, .pilar-item, .nav-cta";
    document.querySelectorAll(hovers).forEach(function (el) {
      el.addEventListener("mouseover", function (e) {
        if (!el.contains(e.relatedTarget)) ring.classList.add("hover");
      });
      el.addEventListener("mouseout", function (e) {
        if (!el.contains(e.relatedTarget)) ring.classList.remove("hover");
      });
    });
  }

  /* ── 15. LENIS SMOOTH SCROLL ──────────────────────────── */
  function initLenis() {
    if (typeof Lenis === "undefined") {
      console.warn("[initLenis] Lenis not loaded — using native scroll");
      return;
    }
    try {
      var lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      window.lenis = lenis;
      if (window.gsap && window.ScrollTrigger) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
      }
    } catch (err) {
      console.warn("[initLenis] fallback:", err);
    }
  }

  /* ── 16. GLOBAL SAFETY NET ────────────────────────────── */
  function initSafetyNet() {
    setTimeout(function () {
      $$(".word-inner, .service-card, .prestacion-item, [data-clip-reveal]").forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.clipPath = "none";
        el.style.transition = "none";
      });
      $$(".hero-eyebrow, .hero-subtitle, .hero-actions").forEach(function (el) {
        el.style.opacity = "1"; el.style.transform = "none";
      });
    }, 6000);
  }

  /* ── BOOT ─────────────────────────────────────────────── */
  function boot() {
    safe(initWordSplit, "initWordSplit");
    safe(initSplash,    "initSplash");
    safe(initNav,       "initNav");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initScrollBar, "initScrollBar");
    safe(initScrollTop, "initScrollTop");
    safe(initCardEntrance, "initCardEntrance");
    safe(initCountUp,   "initCountUp");
    safe(initClipReveal, "initClipReveal");
    safe(initCarousel,  "initCarousel");
    safe(initContactForm, "initContactForm");
    safe(initCursor,    "initCursor");
    safe(initLenis,     "initLenis");
    safe(initSafetyNet, "initSafetyNet");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
    }
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
