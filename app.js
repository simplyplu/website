(() => {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");

  // Page fade-in
  requestAnimationFrame(() => document.body.classList.add("page-ready"));

  // Load saved theme or system preference
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (saved) {
    root.setAttribute("data-theme", saved);
  } else if (prefersDark) {
    root.setAttribute("data-theme", "dark");
  }

  // Toggle click
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", current);
      localStorage.setItem("theme", current);
    });
  }

  // Smooth leave
  document.addEventListener("click", e => {
    const link = e.target.closest("a");
    if (!link || link.target === "_blank") return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto")) return;

    e.preventDefault();
    document.body.classList.remove("page-ready");
    document.body.classList.add("page-leave");

    setTimeout(() => (window.location.href = href), 240);
  });
})();
