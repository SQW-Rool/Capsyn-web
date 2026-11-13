/* Capsyn 官网 v2 交互脚本：导航 / 演示岛 / 截图画廊筛选 / 滚动出现 / FAQ 单开 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var staticMode = new URLSearchParams(window.location.search).has("static");
  if (staticMode) { document.documentElement.classList.add("is-static"); }

  /* ---------- 移动端导航 ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 滚动高亮当前章节 ---------- */
  var sectionIds = ["features", "music", "gallery", "versions", "faq", "roadmap"];
  var navAnchors = {};
  sectionIds.forEach(function (id) {
    var anchor = document.querySelector('.nav-links a[href="#' + id + '"]');
    if (anchor) { navAnchors[id] = anchor; }
  });

  var setActive = function (id) {
    Object.keys(navAnchors).forEach(function (key) {
      navAnchors[key].classList.toggle("is-active", key === id);
    });
  };

  var sections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { setActive(entry.target.id); }
      });
    }, { rootMargin: "-40% 0px -50% 0px" });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- 滚动出现 ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (staticMode || reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 首屏演示岛：自动展开 / 收起 + 可点击 ---------- */
  var demo = document.getElementById("demo");
  if (demo && !reduceMotion && !staticMode) {
    var open = true;
    var timer = null;
    var hovering = false;

    var render = function () {
      demo.classList.toggle("is-open", open);
    };

    var schedule = function () {
      window.clearTimeout(timer);
      if (hovering) { return; }
      timer = window.setTimeout(function () {
        open = !open;
        render();
        schedule();
      }, open ? 5200 : 3400);
    };

    demo.addEventListener("pointerenter", function () {
      hovering = true;
      window.clearTimeout(timer);
      open = true;
      render();
    });

    demo.addEventListener("pointerleave", function () {
      hovering = false;
      schedule();
    });

    demo.addEventListener("click", function () {
      open = !open;
      render();
      schedule();
    });

    demo.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open = !open;
        render();
      }
    });

    demo.setAttribute("tabindex", "0");
    schedule();
  }

  /* ---------- 截图画廊筛选 ---------- */
  var tabs = document.getElementById("tabs");
  var shots = document.getElementById("shots");

  if (tabs && shots) {
    var items = Array.prototype.slice.call(shots.querySelectorAll(".shot"));

    var apply = function (filter) {
      items.forEach(function (item) {
        var show = filter === "all" || item.getAttribute("data-cat") === filter;
        item.classList.toggle("is-hidden", !show);
      });
    };

    tabs.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-filter]");
      if (!button) { return; }

      tabs.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-selected", b === button ? "true" : "false");
      });

      apply(button.getAttribute("data-filter"));
    });
  }

  /* ---------- FAQ：同时只展开一条 ---------- */
  var faq = document.querySelector(".faq");
  if (faq) {
    faq.addEventListener("toggle", function (event) {
      var opened = event.target;
      if (!(opened instanceof HTMLDetailsElement) || !opened.open) { return; }

      faq.querySelectorAll("details.q").forEach(function (other) {
        if (other !== opened) { other.open = false; }
      });
    }, true);
  }
})();
