/* =========================================================
   babybaby — main.js
   Language switch, navigation, canvas field, reveal effects.
   No dependencies.
   ========================================================= */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- language ---------------- */

  var STORAGE_KEY = "babybaby:lang";
  var toggle = document.getElementById("lang-toggle");
  var label = document.getElementById("lang-label");

  function normalize(value) {
    return value === "en" ? "en" : "pt";
  }

  function applyLang(lang, persist) {
    var l = normalize(lang);
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l === "pt" ? "pt-BR" : "en");

    var title = root.getAttribute(l === "pt" ? "data-title-pt" : "data-title-en");
    if (title) document.title = title;

    if (label) label.textContent = l === "pt" ? "EN" : "PT";
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        l === "pt" ? "Mudar idioma para inglês" : "Switch language to Portuguese"
      );
      toggle.setAttribute("aria-pressed", l === "en" ? "true" : "false");
    }

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, l);
      } catch (e) {
        /* storage may be unavailable */
      }
    }

    document.dispatchEvent(
      new CustomEvent("babybaby:lang", { detail: { lang: l } })
    );
  }

  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    saved = null;
  }

  var initial = saved ? normalize(saved) : "pt";

  applyLang(initial, false);

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-lang") === "pt" ? "en" : "pt";
      applyLang(next, true);
    });
  }

  /* ---------------- mobile navigation ---------------- */

  var nav = document.getElementById("nav");
  var menu = document.getElementById("menu-toggle");

  function closeMenu() {
    if (!nav || !menu) return;
    nav.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Abrir menu");
  }

  if (menu && nav) {
    menu.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
      menu.setAttribute(
        "aria-label",
        open ? "Fechar menu" : "Abrir menu"
      );
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || menu.contains(event.target)) return;
      closeMenu();
    });
  }

  /* ---------------- header state ---------------- */

  var header = document.querySelector(".site-header");
  var ticking = false;

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );

  onScroll();

  /* ---------------- reveal on scroll ---------------- */

  var revealables = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealables.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealables.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------- active nav link ---------------- */

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]')
  );
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------------- card pointer glow ---------------- */

  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((event.clientX - rect.left) / rect.width) * 100 + "%");
        card.style.setProperty("--my", ((event.clientY - rect.top) / rect.height) * 100 + "%");
      });
    });
  }

  /* ---------------- canvas particle field ---------------- */

  var canvas = document.getElementById("field");

  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var width = 0;
    var height = 0;
    var dpr = 1;
    var particles = [];
    var rafId = null;

    var palette = [
      { r: 124, g: 92, b: 255 },
      { r: 34, g: 211, b: 238 },
      { r: 255, g: 92, b: 209 }
    ];

    function sizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function buildParticles() {
      var count = width < 720 ? 26 : width < 1200 ? 44 : 62;
      particles = [];

      for (var i = 0; i < count; i++) {
        var color = palette[i % palette.length];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: 0.8 + Math.random() * 1.5,
          a: 0.18 + Math.random() * 0.4,
          color: color
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      var i, j, p, q, dx, dy, dist, alpha;

      for (i = 0; i < particles.length; i++) {
        p = particles[i];

        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          "rgba(" + p.color.r + "," + p.color.g + "," + p.color.b + "," + p.a + ")";
        ctx.fill();

        for (j = i + 1; j < particles.length; j++) {
          q = particles[j];
          dx = p.x - q.x;
          dy = p.y - q.y;
          dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 148) continue;

          alpha = (1 - dist / 148) * 0.13;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = "rgba(140,130,255," + alpha.toFixed(3) + ")";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      if (!reduceMotion) rafId = window.requestAnimationFrame(draw);
    }

    function start() {
      sizeCanvas();
      buildParticles();
      if (rafId) window.cancelAnimationFrame(rafId);
      draw();
    }

    start();

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(start, 180);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (rafId) window.cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!reduceMotion && !rafId) {
        draw();
      }
    });
  }
})();
