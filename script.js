/* ============================================================
   SON JIHYUN — 1page portfolio / interactions
   no dependencies
   ============================================================ */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- scroll progress ---------- */
  var bar = document.querySelector(".progress span");

  function onScroll() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }

  /* ---------- reveal on enter ---------- */
  var items = document.querySelectorAll(".reveal");

  if (reduced || !("IntersectionObserver" in window)) {
    for (var i = 0; i < items.length; i++) items[i].classList.add("is-in");
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    for (var j = 0; j < items.length; j++) revealObserver.observe(items[j]);
  }

  /* ---------- active nav ---------- */
  var navLinks = document.querySelectorAll(".nav a[data-nav]");
  var sections = [];

  for (var k = 0; k < navLinks.length; k++) {
    var target = document.getElementById(navLinks[k].getAttribute("data-nav"));
    if (target) sections.push({ id: target.id, el: target, link: navLinks[k] });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          sections.forEach(function (s) {
            s.link.classList.toggle("is-active", s.id === entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (s) { navObserver.observe(s.el); });
  }

  /* ---------- custom cursor (desktop only) ---------- */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var cursor = document.querySelector(".cursor");

  if (fine && cursor && !reduced) {
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var tx = cx;
    var ty = cy;

    window.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      cursor.classList.add("is-active");
    });

    window.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-active");
    });

    (function loop() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform =
        "translate(" + cx + "px," + cy + "px) translate(-50%, -50%)";
      window.requestAnimationFrame(loop);
    })();

    var hoverables = document.querySelectorAll("a, button, .project, .archive__item");
    for (var h = 0; h < hoverables.length; h++) {
      hoverables[h].addEventListener("mouseenter", function () {
        cursor.classList.add("is-hover");
      });
      hoverables[h].addEventListener("mouseleave", function () {
        cursor.classList.remove("is-hover");
      });
    }
  }

  /* ---------- scroll listener ---------- */
  var ticking = false;

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

  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
})();
