function renderSVGToCanvas(svgString, canvasId, width, height, callback) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas con id '${canvasId}' no encontrado.`);
    return;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = function () {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);
    if (callback) callback(canvas);
  };
  img.onerror = function () {
    console.error(`Error cargando imagen SVG para canvas ${canvasId}`);
  };
  img.src = url;
}

document.addEventListener('DOMContentLoaded', function () {
  const svgTopLeft = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="23.5,100 0,100 0,0 100,0 100,23.5 23.5,23.5" fill="#eee"/>
    </svg>`;

  const svgBottomRight = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="76.4,0 100,0 100,100 0,100 0,76.4 76.4,76.4" fill="#eee"/>
    </svg>`;

  // Cuando ambos SVGs hayan sido renderizados, inicia la animación
  let loadedCount = 0;
  const onCanvasReady = () => {
    loadedCount++;
    if (loadedCount === 2) startCanvasAnimation();
  };

  renderSVGToCanvas(svgTopLeft, 'canvasTL', 50, 50, onCanvasReady);
  renderSVGToCanvas(svgBottomRight, 'canvasBiR', 150, 150, onCanvasReady);
});

function startCanvasAnimation() {
  const canvasTL = document.getElementById('cornerTL-wrapper');
  const canvasBR = document.getElementById('cornerBR-wrapper');

  if (!canvasTL || !canvasBR) return;

  // POSICIÓN A (estado inicial)
  gsap.set(canvasTL, {
    x: 600,       // posición absoluta en píxeles (desde su contenedor)
    y: 3100,
    scale: 1,
    transformOrigin: "center",
  });

  gsap.set(canvasBR, {
    x: -1150,
    y: 2200,
    scale: 1,
    transformOrigin: "center",
  });

  // TIMELINE con ScrollTrigger
  gsap.timeline({
    scrollTrigger: {
      trigger: "#map", // elemento que activa el scroll
      start: "top center",    // empieza cuando #map entra al centro
      end: "center center",   // termina cuando #map sale del centro
      scrub: 1,
    },
  })
  .to(canvasBR, {
    x: -950,       // posición absoluta en píxeles (desde su contenedor)
    y: 2760,
    scale: 1,
    duration: 1
  })
  .to(canvasTL, {
    x: 212,
    y: 3435,
    scale: 1,
    duration: 1
  }, 0); // el segundo parámetro "0" hace que comience al mismo tiempo que el canvasBR
}
