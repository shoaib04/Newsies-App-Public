const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  const preview = document.querySelector(".preview-wrap");
  const hero = document.querySelector(".hero-section");

  hero?.addEventListener("pointermove", (event) => {
    if (!preview) return;
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    preview.style.setProperty("--pointer-x", `${x * 8}px`);
    preview.style.setProperty("--pointer-y", `${y * 8}px`);
    preview.style.transform = `translate3d(${x * 5}px, ${y * 5}px, 0)`;
  });

  hero?.addEventListener("pointerleave", () => {
    preview?.style.setProperty("--pointer-x", "0px");
    preview?.style.setProperty("--pointer-y", "0px");
    preview?.style.setProperty("transform", "translate3d(0, 0, 0)");
  });

  let scheduled = false;
  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      const offset = Math.min(window.scrollY * 0.04, 24);
      preview?.style.setProperty("--scroll-offset", `${offset}px`);
      if (preview) preview.style.transform = `translateY(${offset * -0.18}px)`;
      scheduled = false;
    });
  }, { passive: true });
}
