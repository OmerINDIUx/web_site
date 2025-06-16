const loaderOverlay = document.getElementById("loader-overlay");
const slider = document.getElementById("LoadSlider");
const loadingText = document.getElementById("text_loading");

const frases = [
  "El clima cambia, como nuestras ideas.",
  "Después de la tormenta, viene la calma.",
  "El sol siempre vuelve a salir.",
  "Observa las nubes, entienden el tiempo.",
];
loadingText.textContent = frases[Math.floor(Math.random() * frases.length)];

// Crear timeline seguro
const tl = gsap.timeline();

const safeTo = (selector, props) => {
  if (document.querySelector(selector)) {
    tl.to(selector, props);
  }
};

// Añadir animaciones si existen
safeTo("#elemento1", { opacity: 1, duration: 1 });
safeTo("#elemento2", { x: 100, duration: 1 });
safeTo("#elemento3", { scale: 1.2, duration: 1 });


// Cargar fuente con FontFaceObserver
const loadFont = () => {
  const observer = new FontFaceObserver("power_grotesk", {
    weight: 400,
    style: "normal",
  });
  return observer.load(null, 5000); // timeout de 5 segundos
};

// Asegurar que loader se oculte siempre
Promise.allSettled([
  loadFont().catch(() => console.warn("⚠️ No se cargó power_grotesk a tiempo")),
  new Promise(resolve => tl.eventCallback("onComplete", resolve))
]).then(() => {
  gsap.to(loaderOverlay, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      loaderOverlay.style.display = "none";
    }
  });
});

const cornerTimeline = gsap.timeline();

// Asegúrese de que los elementos estén posicionados correctamente para permitir la transformación desde el centro
cornerTimeline
  .from(".top-left1", {
    x: window.innerWidth / 2 - 50, // ajusta según el tamaño del ícono
    y: window.innerHeight / 2 - 50,
    scale: 0.2,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  })
  .from(".bottom-right1", {
    x: -(window.innerWidth / 2 - 50),
    y: -(window.innerHeight / 2 - 50),
    scale: 0.2,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  }, "<") // sincronizado con la anterior
  .from("#text_loading", {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: "power2.out"
  });

// Agregar al timeline principal
tl.add(cornerTimeline);

document.body.classList.remove('loading');
