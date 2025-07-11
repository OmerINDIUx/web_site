document.addEventListener("DOMContentLoaded", () => {
  const loaderOverlay = document.getElementById("loader-overlay");
  const loadingText = document.getElementById("text_loading");
  const loadingDots = document.getElementById("loading");
  const slider = document.getElementById("LoadSlider");

  // Frases aleatorias
  const frases = [
    "El clima cambia, como nuestras ideas.",
    "Después de la tormenta, viene la calma.",
    "El sol siempre vuelve a salir.",
    "Observa las nubes, entienden el tiempo.",
  ];
  loadingText.textContent = frases[Math.floor(Math.random() * frases.length)];

  // Animación de puntos "Cargando..."
  let dotCount = 0;
  const dotInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    loadingDots.textContent = "Cargando" + ".".repeat(dotCount);
  }, 500);

  // Simulación de barra de carga
  let percent = 0;
  const sliderInterval = setInterval(() => {
    if (slider && percent < 100) {
      percent += 1;
      slider.style.width = percent + "%";
    } else {
      clearInterval(sliderInterval);
    }
  }, 30);

  // GSAP timelines
  const tl = gsap.timeline();

  const safeTo = (selector, props) => {
    if (document.querySelector(selector)) {
      tl.to(selector, props);
    }
  };

  // Animaciones opcionales de elementos si existen
  safeTo("#elemento1", { opacity: 1, duration: 1 });
  safeTo("#elemento2", { x: 100, duration: 1 });
  safeTo("#elemento3", { scale: 1.2, duration: 1 });

  // Animación de íconos de esquina y texto
  const cornerTimeline = gsap.timeline();
  cornerTimeline
    .from(".top-left", {
      x: window.innerWidth / 2 - 50,
      y: window.innerHeight / 2 - 50,
      scale: 0.2,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    })
    .from(".bottom-right", {
      x: -(window.innerWidth / 2 - 50),
      y: -(window.innerHeight / 2 - 50),
      scale: 0.2,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "<")
    .from("#text_loading", {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power2.out"
    });

  tl.add(cornerTimeline);

  // Esperar a que termine animación y fuentes
  const loadFont = () => {
    const observer = new FontFaceObserver("power_grotesk", {
      weight: 400,
      style: "normal"
    });
    return observer.load(null, 5000);
  };

  Promise.allSettled([
    loadFont().catch(() => console.warn("⚠️ No se cargó power_grotesk a tiempo")),
    new Promise(resolve => tl.eventCallback("onComplete", resolve))
  ]).then(() => {
    clearInterval(dotInterval);
    gsap.to(loaderOverlay, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        loaderOverlay.style.display = "none";
        document.body.classList.remove('loading');
      }
    });
  });
});
