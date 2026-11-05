/* Night-mode toggle. Loaded in <head> so the right theme is set before first paint.
   The page works without this file: it then simply follows the system setting. */
(function () {
  var d = document.documentElement;
  d.classList.add("js");

  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}

  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  if (stored === "dark" || stored === "light") {
    d.setAttribute("data-theme", stored);
  } else {
    d.setAttribute("data-theme", mq && mq.matches ? "dark" : "light");
    d.setAttribute("data-theme-auto", "");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;

    function label() {
      var dark = d.getAttribute("data-theme") === "dark";
      btn.setAttribute("aria-label", dark ? "Switch to day mode" : "Switch to night mode");
      btn.setAttribute("title", dark ? "Day mode" : "Night mode");
    }

    btn.addEventListener("click", function () {
      var next = d.getAttribute("data-theme") === "dark" ? "light" : "dark";
      d.setAttribute("data-theme", next);
      d.removeAttribute("data-theme-auto");
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });

    /* Until the visitor makes a choice, keep following the system setting. */
    if (mq) {
      var follow = function (e) {
        if (d.hasAttribute("data-theme-auto")) {
          d.setAttribute("data-theme", e.matches ? "dark" : "light");
          label();
        }
      };
      if (mq.addEventListener) mq.addEventListener("change", follow);
      else if (mq.addListener) mq.addListener(follow);
    }

    label();
  });
})();
