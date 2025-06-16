import { HighlightEffect as HighlightEffect3 } from "./effect-3/highlightEffect.js";

(() => {
  const { gsap } = window;
  const ScrollTrigger = window.ScrollTrigger;
  const Flip = window.Flip;
  const Lenis = window.Lenis;
  const Splitting = window.Splitting;
  const FontFaceObserver = window.FontFaceObserver;

  gsap.registerPlugin(ScrollTrigger, Flip);

  const preloadImages = (sel = "img") =>
    new Promise((resolve) => {
      const imgs = [...document.querySelectorAll(sel)];
      if (!imgs.length) return resolve();
      let loaded = 0;
      imgs.forEach((img) => {
        const proxy = new Image();
        proxy.src = img.src;
        proxy.onload = () => ++loaded === imgs.length && resolve();
      });
    });

  const preloadPowerGrotesk = () => {
    const font = new FontFaceObserver("power_grotesk", {
      weight: 400,
      style: "normal",
    });
    return font
      .load(null, 5000)
      .then(() => document.documentElement.classList.add("fonts-loaded"))
      .catch(() => console.warn("⚠️ No se cargó power_grotesk a tiempo"));
  };

  const initSmooth = () => {
    const lenis = new Lenis({ lerp: 0.2, smoothWheel: true });
    lenis.on("scroll", () => ScrollTrigger.update());
    const raf = (t) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  };

  const animationEffects = [
    {
      name: "Zoom+Fade",
      effect: (el, i, total) =>
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=100%",
              scrub: true,
            },
          })
          .to(el, { scale: 2, opacity: 0, ease: "power2.inOut" }, 0),
    },

    {
      name: "Slide Left",
      effect: (el, i, total) =>
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=100%",
              scrub: true,
            },
          })
          .to(el, { x: "-100vw", opacity: 0, ease: "expo.inOut" }, 0),
    },

    {
      name: "Zoom In + Blur",
      effect: (el, i, total) =>
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=100%",
              scrub: true,
            },
          })
          .to(
            el,
            { opacity: 0, scale: 1.5, filter: "blur(5px)", ease: "power3.out" },
            0
          ),
    },

    {
      name: "Fade + Scale Down",
      effect: (el, i, total) =>
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=100%",
              scrub: true,
            },
          })
          .to(el, { opacity: 0, scale: 0.2, ease: "power1.out" }, 0),
    },

    {
      name: "Wobble + Fade",
      effect: (el, i, total) =>
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=100%",
              scrub: true,
            },
          })
          .to(
            el,
            {
              x: () => Math.random() * 30 - 15,
              rotation: () => Math.random() * 10 - 5,
              opacity: 0,
              ease: "none",
            },
            0
          ),
    },
  ];

  const initScrollAnimations = () => {
    const elements = [...document.querySelectorAll(".content--sticky")];
    const total = elements.length;

    elements.forEach((el, i) => {
      const effectObj =
        animationEffects[Math.floor(Math.random() * animationEffects.length)];
      console.log(`🌀 Elemento ${i + 1}: efecto aplicado -> ${effectObj.name}`);
      effectObj.effect(el, i, total);
    });
  };

  const initHighlight = () => {
    document.querySelectorAll(".hx").forEach((el) => {
      if (!el.classList.contains("hx-11")) el.dataset.splitting = "";
    });
    Splitting();
    document.querySelectorAll(".hx-3").forEach((el) => {
      new HighlightEffect3(el);
    });
  };

  (async () => {
    try {
      await Promise.all([
        preloadImages(".content__img"),
        preloadPowerGrotesk(),
      ]);
      document.body.classList.remove("loading");
      initSmooth();
      initHighlight();
      initScrollAnimations();
    } catch (err) {
      console.error("Error al inicializar:", err);
    }
  })();
})();
