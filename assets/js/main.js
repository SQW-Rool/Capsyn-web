/* ============================================================
   Capsyn 介绍站 —— 交互脚本
   1) 导航：滚动加背景、移动端折叠
   2) 实时演示：时钟走时 + 单/双计时状态轮播 + 指标数字轻微跳动
   3) 截图筛选
   4) 滚动出现动画
   全部原生 API，无依赖。
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- 1. 导航 ---------------- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function onScroll() {
    if (window.scrollY > 12) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navLinks.classList.toggle("is-open", !open);
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------- 2. 演示岛 ---------------- */
  var clockEl = document.querySelector("[data-clock]");
  var monitorEl = document.querySelector("[data-monitor]");
  var timerEl = document.querySelector("[data-timer]");
  var dotEl = document.querySelector("[data-dot]");
  var cpuEl = document.querySelector("[data-cpu]");
  var barEl = document.querySelector("[data-bar]");

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /* 胶囊里的时钟：每秒刷新 */
  function tickClock() {
    if (!clockEl) return;
    var d = new Date();
    clockEl.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* 演示状态轮播：0 时钟 → 1 单计时 → 2 双计时（胶囊 + 小圆岛） */
  var demoState = 0;
  var remaining = 4 * 60 + 32; /* 04:32 */

  function renderDemo() {
    if (!monitorEl || !dotEl) return;

    var hasMonitor = demoState >= 1;
    var hasDot = demoState >= 2;

    monitorEl.hidden = !hasMonitor;
    clockEl.hidden = hasMonitor;
    dotEl.hidden = !hasDot;

    if (hasMonitor && timerEl) {
      var m = Math.floor(remaining / 60);
      var s = remaining % 60;
      timerEl.textContent = pad(m) + ":" + pad(s);
    }
  }

  function advanceDemo() {
    demoState = (demoState + 1) % 3;
    renderDemo();
  }

  if (!reduceMotion) {
    setInterval(advanceDemo, 4200);
  }

  /* 倒计时每秒 -1（只在显示时） */
  if (!reduceMotion) {
    setInterval(function () {
      if (remaining > 0) {
        remaining -= 1;
      } else {
        remaining = 4 * 60 + 32;
      }
      if (demoState >= 1) renderDemo();
    }, 1000);
  }

  /* 指标数字轻微跳动，让演示看起来"活着" */
  if (!reduceMotion && cpuEl && barEl) {
    setInterval(function () {
      var v = 12 + Math.round(Math.random() * 26);
      cpuEl.textContent = v + "%";
      barEl.style.width = v + "%";
    }, 1800);
  }

  renderDemo();

  /* ---------------- 3. 截图筛选 ---------------- */
  var tabs = document.getElementById("tabs");
  var shots = document.getElementById("shots");

  if (tabs && shots) {
    var items = Array.prototype.slice.call(shots.querySelectorAll(".shot"));

    tabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab");
      if (!btn) return;

      Array.prototype.forEach.call(tabs.querySelectorAll(".tab"), function (t) {
        var active = t === btn;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });

      var filter = btn.getAttribute("data-filter");
      items.forEach(function (item) {
        var show = filter === "all" || item.getAttribute("data-tag") === filter;
        item.classList.toggle("is-hidden", !show);
        if (show) item.classList.add("is-in"); /* 重新显示时保持可见 */
      });
    });
  }

  /* ---------------- 4. 滚动出现 ---------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    revealEls.forEach(function (el, i) {
      /* 同一屏的卡片错开一点，看起来更轻 */
      el.style.transitionDelay = Math.min(i % 3, 2) * 60 + "ms";
      io.observe(el);
    });
  }
})();
