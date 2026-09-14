(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const initReveals = () => {
    const reveals = document.querySelectorAll(".reveal");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    reveals.forEach((el) => observer.observe(el));
  };

  const setYear = () => {
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  };

  const loadFooter = () => {
    const slot = document.getElementById("site-footer");
    if (!slot) {
      setYear();
      return Promise.resolve();
    }

    return fetch("footer.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error("No s'ha pogut carregar el footer");
        }
        return response.text();
      })
      .then((html) => {
        slot.outerHTML = html;
        setYear();
      })
      .catch(() => {
        slot.innerHTML =
          '<p class="site-footer__copy">© HorAIzon · <a href="mailto:info@horaizon.es">info@horaizon.es</a></p>';
      });
  };

  initReveals();
  loadFooter();
})();
