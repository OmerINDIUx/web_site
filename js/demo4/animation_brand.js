// document.addEventListener("DOMContentLoaded", async () => {
//   const svgText = await fetch("img/INDI_lab.svg").then((r) => r.text());
//   const container = document.getElementById("svg-container");
//   if (!container) {
//     console.error("No se encontró #svg-container");
//     return;
//   }
//   container.innerHTML = svgText;

//   const indi = container.querySelector("#indi");
//   const logoX = container.querySelector("#lab");
//   const cornerUR = container.querySelector("#ur");
//   const cornerBL = container.querySelector("#bl");
//   const grupoGeneral = container.querySelector("#grupoGeneral");

//   if (![indi, logoX, cornerUR, cornerBL, grupoGeneral].every(Boolean)) {
//     console.error("Faltan nodos dentro del SVG");
//     return;
//   }

//   // Clip-paths
//   cornerUR.setAttribute("clip-path", "url(#liquidClipTL)");
//   cornerBL.setAttribute("clip-path", "url(#liquidClipBR)");

//   gsap.registerPlugin(ScrollTrigger);

//   // Estado inicial de piezas
//   gsap.set([indi, logoX, cornerUR, cornerBL], {
//     xPercent: 0,
//     yPercent: 0,
//     scale: 1,
//     opacity: 1,
//     transformOrigin: "center",
//   });

//   function getAnimValues() {
//     if (window.innerWidth <= 770) {
//       return {
//         indi: { xPercent: -362.5, yPercent: -243, scale: 0.3 },
//         logoX: { xPercent: -414.5, yPercent: -1143, scale: 0.3 },
//         cornerUR: { xPercent: -676.5, yPercent: -451.5, scale: 0.3 },
//         cornerBL: { xPercent: -444, yPercent: -623, scale: 0.3 },
//       };
//     } else if (window.innerWidth <= 1024) {
//       return {
//         indi: { xPercent: -249, yPercent: -160, scale: 0.25 },
//         logoX: { xPercent: -332, yPercent: -884, scale: 0.25 },
//         cornerUR: { xPercent: -546.5, yPercent: -283.5, scale: 0.25 },
//         cornerBL: { xPercent: -301.5, yPercent: -477, scale: 0.25 },
//       };
//     } else {
//       return {
//         indi: { xPercent: -344.5, yPercent: -80, scale: 0.15 },
//         logoX: { xPercent: -417, yPercent: -668.5, scale: 0.15 },
//         cornerUR: { xPercent: -687.5, yPercent: -117.5, scale: 0.15 },
//         cornerBL: { xPercent: -418.5, yPercent: -354.5, scale: 0.15 },
//       };
//     }
//   }

//   function ajustarGrupo() {
//     const bbox = grupoGeneral.getBBox();
//     const containerRect = container.getBoundingClientRect();

//     const scaleX = (containerRect.width * 0.8) / bbox.width;
//     const scaleY = (containerRect.height * 0.8) / bbox.height;
//     let scale = Math.min(scaleX, scaleY);
//     let yPercent;

//     if (window.innerWidth <= 750) {
//       scale *= 1.2;
//       yPercent = -50;
//     } else if (window.innerWidth <= 1024) {
//       yPercent = -50;
//     } else {
//       scale *= 0.8;
//       yPercent = -75;
//     }

//     gsap.set(grupoGeneral, {
//       xPercent: -50,
//       yPercent,
//       x: "50%",
//       y: "50%",
//       scale,
//       transformOrigin: "center center",
//     });
//   }

//   function buildTimeline() {
//     const vals = getAnimValues();
//     tl.clear()
//       .to(indi, { ...vals.indi, duration: 1 }, 0.3)
//       .to(logoX, { ...vals.logoX, duration: 1 }, 0.3)
//       .to(cornerUR, { ...vals.cornerUR, duration: 0.7 }, 0.4)
//       .to(cornerBL, { ...vals.cornerBL, duration: 0.7 }, 0.4)
//       .call(() => {
//         gsap.set("#site-header", { pointerEvents: "auto" });
//       }, null, 0.9);
//   }

//   function getTimelineVlues() {
//     if (window.innerWidth <= 770) {
//       return { start: "top top", end: "bottom center" };
//     } else {
//       return { start: "top bottom", end: "center bottom" };
//     }
//   }

//   // Inicializar ScrollTrigger con valores dinámicos
//   let { start, end } = getTimelineVlues();
//   const tl = gsap.timeline({
//     defaults: { ease: "power2.inOut" },
//     scrollTrigger: {
//       trigger: "#brand",
//       start,
//       end,
//       scrub: 0.8,
//       pinSpacing: true,
//       markers: true,
//     },
//   });

//   // Ejecutar inicialización
//   ajustarGrupo();
//   buildTimeline();

//   // Recalcular en resize
//   window.addEventListener("resize", () => {
//     ajustarGrupo();
//     ({ start, end } = getTimelineVlues());
//     tl.scrollTrigger.start = start;
//     tl.scrollTrigger.end = end;
//     buildTimeline();
//   });

//   // Función de color base
//   const setFill = (color) => {
//     indi.style.fill = color;
//     logoX.style.fill = color;
//   };
//   setFill("#EFEFEF");
//   laboratorio.style.fill = "#EFEFEF";

//   // Crear gradiente SVG
//   function crearGradienteSVG(svgEl, id, color1, color2) {
//     const svgns = "http://www.w3.org/2000/svg";
//     let defs = svgEl.querySelector("defs");
//     if (!defs) {
//       defs = document.createElementNS(svgns, "defs");
//       svgEl.insertBefore(defs, svgEl.firstChild);
//     }
//     const oldGrad = defs.querySelector(`#${id}`);
//     if (oldGrad) oldGrad.remove();

//     const grad = document.createElementNS(svgns, "linearGradient");
//     grad.setAttribute("id", id);
//     grad.setAttribute("x1", "0%");
//     grad.setAttribute("y1", "0%");
//     grad.setAttribute("x2", "100%");
//     grad.setAttribute("y2", "0%");

//     const stop1 = document.createElementNS(svgns, "stop");
//     stop1.setAttribute("offset", "0%");
//     stop1.setAttribute("stop-color", color1);

//     const stop2 = document.createElementNS(svgns, "stop");
//     stop2.setAttribute("offset", "100%");
//     stop2.setAttribute("stop-color", color2);

//     grad.appendChild(stop1);
//     grad.appendChild(stop2);
//     defs.appendChild(grad);
//   }

//   // Gradiente dinámico
//   let aireReady = false;
//   let aireColor = "#EFEFEF";
//   function aplicarAireColor(color) {
//     aireReady = true;
//     aireColor = color;
//     const gradiente = `linear-gradient(to right, ${aireColor}, #18B2E8)`;
//     document.documentElement.style.setProperty(
//       "--color-highlight-start",
//       gradiente
//     );
//     const target = document.querySelector(".aire-gradiente-target");
//     if (target) target.style.background = `var(--color-highlight-start)`;
//     const svg = container.querySelector("svg");
//     crearGradienteSVG(svg, "gradienteAire", aireColor, "#18B2E8");
//     cornerUR.setAttribute("fill", "url(#gradienteAire)");
//     cornerBL.setAttribute("fill", "url(#gradienteAire)");
//   }

//   document.addEventListener("aireSaludReady", (e) =>
//     aplicarAireColor(e.detail.color)
//   );
//   if (window.aireSaludColor) aplicarAireColor(window.aireSaludColor);
//   setTimeout(() => {
//     if (!aireReady) aplicarAireColor(aireColor);
//   }, 5000);

//   // Smooth scroll menú
//   const smoothScrollTo = (targetY, duration = 1000) => {
//     const startY = window.scrollY;
//     const distance = targetY - startY;
//     let startTime = null;
//     const step = (timestamp) => {
//       if (!startTime) startTime = timestamp;
//       const progress = timestamp - startTime;
//       const percent = Math.min(progress / duration, 1);
//       window.scrollTo(0, startY + distance * percent);
//       if (percent < 1) requestAnimationFrame(step);
//     };
//     requestAnimationFrame(step);
//   };

//   document.querySelectorAll(".menu__item").forEach((link) => {
//     link.addEventListener("click", (e) => {
//       e.preventDefault();
//       const target = link.getAttribute("data-scrollto");
//       if (target === "0") {
//         smoothScrollTo(0, 2000);
//       } else {
//         const href = link.getAttribute("href");
//         const el = document.querySelector(href);
//         if (el) {
//           const offsetTop = el.getBoundingClientRect().top + window.scrollY;
//           smoothScrollTo(offsetTop, 1000);
//         }
//       }
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", async () => {
  const [squareText, rectText] = await Promise.all([
    fetch("../../svg/indi-lab_Square.svg").then((r) => r.text()),
    fetch("../../svg/indi-lab_Vertical.svg").then((r) => r.text()),
  ]);

  const squareContainer = document.getElementById("svg-square");
  const rectContainer = document.getElementById("svg-rect");

  squareContainer.innerHTML = squareText;
  rectContainer.innerHTML = rectText;

  const squareSvg = squareContainer.querySelector("svg");
  const rectSvg = rectContainer.querySelector("svg");

  // IDs que queremos animar
  const ids = ["INDI", "LAB", "keyTop", "keyButton"];

  // Grupos completos
  const squareGroup = squareSvg.querySelector("#IndiGrup");
  const rectGroup = rectSvg.querySelector("#IndiGrup");


  function startAnimValues() {
    if (window.innerWidth <= 770) {
      return { ys: "5%", sscale: 0.2, transformOriginS: "top center" };
    } else if (window.innerWidth <= 1024) {
      return { ys: "5%", sscale: 0.2, transformOriginS: "top center" };

          } else if (window.innerWidth <= 1008) {
      return { ys: "5%", sscale: 0.2, transformOriginS: "top center" };
    } else {
      return { ys: "5%", sscale: 0.25, transformOriginS: "top center" };
    }
  }

    const { transformOriginS , ys, sscale } = startAnimValues();

  // Escala inicial del cuadrado
    // gsap.set(squareGroup, { scale: 0.2, y: "5%", transformOrigin: transformOriginS });

  gsap.set(squareGroup, { scale: sscale, y: ys, transformOrigin: transformOriginS });

  // Calcular posiciones de rectGroup con respecto al wrapper
  const wrapper = document.getElementById("svg-wrapper");
  const wrapperRect = wrapper.getBoundingClientRect();
  const targetX = wrapperRect.width * 0.015; // 1.5%
  const targetY = wrapperRect.height * 0.02; // 2%

  // Posición final del rectángulo
  gsap.set(rectGroup, {
    scale: 0.15,
    x: targetX,
    y: targetY,
    transformOrigin: "top left",
  });

  // 📌 Función para valores responsive
  function getAnimValues() {
    if (window.innerWidth <= 770) {
      return { yx: "50%", xx: "-50%", xscale: 0.12 };
    } else if (window.innerWidth <= 1024) {
      return { yx: "1%", xx: "-65%", xscale: 0.1 };

          } else if (window.innerWidth <= 1008) {
      return { yx: "1%", xx: "-65%", xscale: 0.1 };
    } else {
      return { yx: "1%", xx: "-60%", xscale: 0.055 };
    }
  }



  // Timeline con scroll
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#svg-wrapper",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      markers: true,
    },
  });

  // Morph de cada elemento
  ids.forEach((id) => {
    const fromEl = squareSvg.querySelector(`#${id}`);
    const toEl = rectSvg.querySelector(`#${id}`);
    if (!fromEl || !toEl) return;

    const fromBox = fromEl.getBBox();
    const toBox = toEl.getBBox();

    // Diferencias de posición
    const dx = toBox.x + toBox.width / 2 - (fromBox.x + fromBox.width / 2);
    const dy = toBox.y + toBox.height / 2 - (fromBox.y + fromBox.height / 2);

    // Escala relativa
    const scaleX = toBox.width / fromBox.width;
    const scaleY = toBox.height / fromBox.height;
    const scale = Math.min(scaleX, scaleY);

    gsap.set(fromEl, { transformOrigin: "50% 50%" });

    tl.to(
      fromEl,
      {
        x: dx,
        y: dy,
        scale: scale,
        ease: "power2.inOut",
      },
      0
    );
  });
  const { xx, yx, xscale } = getAnimValues();
  tl.to(
    squareGroup,
    {
      x: xx,
      y: yx,
      scale: xscale,
      duration: 0.5,
      transformOrigin: "top left",
    },
    0
  );
});
