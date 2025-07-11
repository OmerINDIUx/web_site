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
  const grupoGeneral = container.querySelector("#grupoGeneral");
  if (
    ![laboratorio, indi, logoX, cornerTL, cornerBR, grupoGeneral].every(Boolean)
  ) {
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
  gsap.set(grupoGeneral, {
    xPercent: 3,
    yPercent: 3,
    scale: 0.6,
    transformOrigin: "center",
  });
  const tl = gsap.timeline({
  defaults: { ease: "power2.inOut" }, // más suave que power2.out
  scrollTrigger: {
    trigger: "#map",
    start: "-=300%",
    end: "+=300%",
    scrub: 0.8, // suaviza el seguimiento
    pinSpacing: true,
  },
});

tl.to("#svg-container", { width: "25vw", height: "auto", duration: 1 }, 0)
  .to(laboratorio, {
    xPercent: -190,
    yPercent: -270,
    opacity: 0,
    scale: 0,
    duration: 1.2,
  }, 0.2)
  .to(indi, {
    xPercent: -25,
    yPercent: -18,
    scale: 0.4,
    duration: 1,
  }, 0.3)
  .to(logoX, {
    xPercent: -230,
    yPercent: -190,
    scale: 0.4,
    duration: 1,
  }, 0.3)
  .to(cornerTL, {
    xPercent: -25,
    yPercent: -185,
    scale: 0.35,
    duration: 1,
  }, 0.4)
  .to(cornerBR, {
    xPercent: -230,
    yPercent: -18,
    scale: 0.35,
    duration: 1,
  }, 0.4)
  .to(grupoGeneral, {
    xPercent: 0,
    yPercent: 1,
    scale: 1,
    duration: 1.2,
  }, 0.5)
  .call(() => {
    gsap.set("#site-header", { pointerEvents: "auto" });
  }, null, 0.9);


  const setFill = (color) => {
    indi.style.fill = color;
    logoX.style.fill = color;
  };

  function crearGradienteSVG(svgEl, id, color1, color2) {
    const svgns = "http://www.w3.org/2000/svg";

    let defs = svgEl.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS(svgns, "defs");
      svgEl.insertBefore(defs, svgEl.firstChild);
    }

    // Remueve gradiente viejo si existe
    const oldGrad = defs.querySelector(`#${id}`);
    if (oldGrad) oldGrad.remove();

    const grad = document.createElementNS(svgns, "linearGradient");
    grad.setAttribute("id", id);
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%");
    grad.setAttribute("y2", "0%");

    const stop1 = document.createElementNS(svgns, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", color1);

    const stop2 = document.createElementNS(svgns, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", color2);

    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
  }
setFill("#EFEFEF");
laboratorio.style.fill = "#EFEFEF";



  // ✅ Aplica directamente el gradiente desde JS como fondo o fill si quieres
  let aireReady = false;
  let aireColor = "#EFEFEF"; // color por defecto

  function aplicarAireColor(color) {
    aireReady = true;
    aireColor = color;

    const gradiente = `linear-gradient(to right, ${aireColor}, #18B2E8)`;
    document.documentElement.style.setProperty(
      "--color-highlight-start",
      gradiente
    );

    // Aplicar como fondo CSS
    const target = document.querySelector(".aire-gradiente-target");
    if (target) {
      target.style.background = `var(--color-highlight-start)`;
    }

    // Crear gradiente SVG y aplicarlo a los elementos que quieres que tengan degradado
    const svg = container.querySelector("svg");
    crearGradienteSVG(svg, "gradienteAire", aireColor, "#18B2E8");

    cornerTL.setAttribute("fill", "url(#gradienteAire)");
    cornerBR.setAttribute("fill", "url(#gradienteAire)");

    // Log para ver el valor real
    console.log(
      "🎨 Gradiente CSS aplicado → --color-highlight-start:",
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-highlight-start")
        .trim()
    );
  }

  document.addEventListener("aireSaludReady", (e) => {
    aplicarAireColor(e.detail.color);
  });

  if (window.aireSaludColor) {
    aplicarAireColor(window.aireSaludColor);
  }

  setTimeout(() => {
    if (!aireReady) {
      console.warn(
        "⚠️ No se recibió el evento 'aireSaludReady'. Usando color por defecto."
      );
      aplicarAireColor(aireColor);
    }
  }, 5000);

  // Smooth scroll menú
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
        smoothScrollTo(0, 2000);
      } else {
        const href = link.getAttribute("href");
        const el = document.querySelector(href);
        if (el) {
          const offsetTop = el.getBoundingClientRect().top + window.scrollY;
          smoothScrollTo(offsetTop, 1000);
        }
      }
    });
  });
});
