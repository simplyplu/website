// Smooth page transitions for static HTML
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fade in on load
  if (!reduce) {
    requestAnimationFrame(() => document.body.classList.add("page-ready"));
  } else {
    document.body.classList.add("page-ready");
  }

  // Intercept internal link clicks to fade out first
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // Ignore: external, mailto, tel, hashes, new tabs, downloads
    const isExternal = link.origin && link.origin !== window.location.origin;
    const isHash = href.startsWith("#");
    const isMail = href.startsWith("mailto:");
    const isTel = href.startsWith("tel:");
    const newTab = link.target === "_blank";
    const download = link.hasAttribute("download");

    if (isExternal || isHash || isMail || isTel || newTab || download) return;

    // Only fade for normal navigation
    e.preventDefault();

    if (reduce) {
      window.location.href = href;
      return;
    }

    document.body.classList.remove("page-ready");
    document.body.classList.add("page-leave");

    // Match CSS transition duration
    setTimeout(() => {
      window.location.href = href;
    }, 240);
  });

  // If user hits back/forward, ensure fade-in class is on
  window.addEventListener("pageshow", () => {
    document.body.classList.add("page-ready");
    document.body.classList.remove("page-leave");
  });
})();
