document.addEventListener("DOMContentLoaded", async () => {
  const svgText = await fetch("img/Brand_INDIx_animate.svg").then((r) =>
    r.text()
  );
  const container = document.getElementById("svg-container");
  if (!container) {
    console.error("No se encontró #svg-container");
    return;
  }
  container.innerHTML = svgText;

  const laboratorio = container.querySelector("#laboratorio");
  const indi = container.querySelector("#indi");
  const logoX = container.querySelector("#logoX");
  const cornerTL = container.querySelector("#cornerTL");
  const cornerBR = container.querySelector("#cornerBR");

  if (![laboratorio, indi, logoX, cornerTL, cornerBR].every(Boolean)) {
    console.error("Faltan nodos dentro del SVG");
    return;
  }

  cornerTL.setAttribute("clip-path", "url(#liquidClipTL)");
  cornerBR.setAttribute("clip-path", "url(#liquidClipBR)");

  gsap.registerPlugin(ScrollTrigger);

  gsap.set([laboratorio, indi, logoX, cornerTL, cornerBR], {
    xPercent: 0,
    yPercent: 0,
    scale: 1,
    opacity: 1,
    transformOrigin: "center",
  });
  const grupoGeneral = container.querySelector("#grupoGeneral");

  gsap.set(grupoGeneral, {
    xPercent: 3,
    yPercent: 3,
    scale: 0.43,
    transformOrigin: "left top",
  });

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: {
      trigger: "#brand",
      start: "+=1%",
      end: "+=60%",
      scrub: true,
      // pin: true,
      pinSpacing: true,
      // markers: true, // <-- útil para debug
    },
  });

  tl.to("#svg-container", { width: "25vw", height: "auto" }, 0)
    .to(
      laboratorio,
      { xPercent: -115, yPercent: -270, opacity: 0, scale: 0 },
      0.1
    )

    .to(indi, { xPercent: 50, yPercent: -18, scale: 0.4 }, 0.3)
    .to(logoX, { xPercent: -155, yPercent: -190, scale: 0.4 }, 0.5)

    .to(cornerTL, { xPercent: 73, yPercent: -185, scale: 0.35 }, 0.7) //abajo izquierda

    .to(cornerBR, { xPercent: -155, yPercent: -18, scale: 0.35 }, 0.9) //arriba derecha

    // .to(".menu-right", { opacity: 1, pointerEvents: "auto" }, 0)

    .to(grupoGeneral, { xPercent: 0, yPercent: 1, scale: 1 }, 1)
    .call(
      () => {
        gsap.set("#site-header", { pointerEvents: "auto" });
      },
      null,
      1.1
    );
  gsap.set(".menu-right", { opacity: 1, pointerEvents: "auto" });

  // Segundo trigger para .color_brand2
  const setFill = (color) => {
    indi.style.fill = color;
    logoX.style.fill = color;
  };

  // 3. Trigger más profundo (.color_brand)
  ScrollTrigger.create({
    trigger: ".color_brand",
    start: "top center",
    end: "bottom center",
    onEnter: () => setFill("#111111"),
    onLeaveBack: () => setFill("#EFEFEF"),
  });

  // 2. Luego .color_brand2
  ScrollTrigger.create({
    trigger: ".color_brand2",
    start: "top center",
    end: "bottom center",
    onEnter: () => setFill("#EFEFEF"),
    onLeaveBack: () => setFill("#EFEFEF"),
  });

  // 1. Finalmente, el global (opcional o solo si necesitas algo fuera de sección)
  ScrollTrigger.create({
    start: "top center",
    end: "bottom center",
    onEnter: () => setFill("#EFEFEF"),
    onLeaveBack: () => setFill("#EFEFEF"),
  });

  // Actualizar ScrollTrigger para asegurar que todo se calcule correctamente
  ScrollTrigger.refresh();

  ScrollTrigger.create({
    start: "top center",
    end: "bottom center",
    onEnter: () => {
      laboratorio.style.fill = "#EFEFEF";
    },
    onLeaveBack: () => {
      laboratorio.style.fill = "#EFEFEF";
    },
  });



let aireColor = "#EFEFEF"; // color por defecto
let aireReady = false;

// Escuchar el evento si llega después
document.addEventListener("aireSaludReady", (e) => {
  aireReady = true;
  aireColor = e.detail.color;
  cornerTL.style.fill = aireColor;
  cornerBR.style.fill = aireColor;
  console.log("✔️ aireSaludReady recibido a tiempo", aireColor);
});

// Fallback si no llegó después de un tiempo
setTimeout(() => {
  if (!aireReady) {
    console.warn("⚠️ No se recibió el evento 'aireSaludReady'. Usando color por defecto.");
    cornerTL.style.fill = aireColor;
    cornerBR.style.fill = aireColor;
  }
}, 1500); // espera 1.5 segundos para ver si llegó el evento







  // Fallback si el evento no ocurre en cierto tiempo (5 segundos)
  setTimeout(() => {
    if (!aireSaludRecibido) {
      console.warn(
        "⚠️ No se recibió el evento 'aireSaludReady'. Usando color por defecto."
      );
      const fallbackColor = "#18B2E8";
      cornerTL.style.fill = fallbackColor;
      cornerBR.style.fill = fallbackColor;
    }
  }, 5000);

  const smoothScrollTo = (targetY, duration = 1000) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);
      window.scrollTo(0, startY + distance * percent);
      if (percent < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  document.querySelectorAll(".menu__item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-scrollto");
      if (target === "0") {
        smoothScrollTo(0, 2000); // scroll al top, más lento
      } else {
        const href = link.getAttribute("href");
        const el = document.querySelector(href);
        if (el) {
          const offsetTop = el.getBoundingClientRect().top + window.scrollY;
          smoothScrollTo(offsetTop, 1000); // scroll más lento al ID
        }
      }
    });
  });
});
