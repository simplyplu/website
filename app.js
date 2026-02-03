(() => {
  const html = document.documentElement;

  // Show page once JS is running (prevents flash)
  requestAnimationFrame(() => document.body.classList.add("page-ready"));

  // Theme toggle icon swap
  const toggle = document.querySelector(".theme-toggle");
  const icon = document.querySelector(".theme-icon");

  function setIcon(theme) {
    if (!icon) return;
    if (theme === "dark") {
      // Sun icon (means switch to light)
      icon.innerHTML = `<path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM4.22 5.64a1 1 0 0 1 1.41 0l.7.7a1 1 0 1 1-1.41 1.41l-.7-.7a1 1 0 0 1 0-1.41ZM17.66 19.08a1 1 0 0 1 1.41 0l.7.7a1 1 0 1 1-1.41 1.41l-.7-.7a1 1 0 0 1 0-1.41ZM2 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm18 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1ZM4.22 18.36a1 1 0 0 1 0-1.41l.7-.7a1 1 0 1 1 1.41 1.41l-.7.7a1 1 0 0 1-1.41 0ZM17.66 4.92a1 1 0 0 1 0-1.41l.7-.7a1 1 0 1 1 1.41 1.41l-.7.7a1 1 0 0 1-1.41 0Z"/>`;
    } else {
      // Moon icon (means switch to dark)
      icon.innerHTML = `<path d="M21 12.79A9 9 0 0 1 11.21 3a7 7 0 1 0 9.79 9.79Z"/>`;
    }
  }

  setIcon(html.getAttribute("data-theme"));

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      setIcon(next);

      // keep background from flashing between modes
      html.style.backgroundColor = next === "dark" ? "#07080c" : "#f8fafc";
      document.body.style.backgroundColor = html.style.backgroundColor;
    });
  }

  // Smooth page leave for internal local pages
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href) return;

    if (a.target === "_blank") return;
    if (href.startsWith("#")) return;
    if (href.startsWith("mailto:")) return;
    if (href.startsWith("tel:")) return;
    if (!href.endsWith(".html")) return;

    e.preventDefault();
    document.body.classList.remove("page-ready");
    document.body.classList.add("page-leave");

    setTimeout(() => {
      window.location.href = href;
    }, 240);
  });

  window.addEventListener("pageshow", () => {
    document.body.classList.add("page-ready");
    document.body.classList.remove("page-leave");
  });
})();
