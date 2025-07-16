(() => {
  let currentIconColor = "#18B2E8";
  let uvColor = "#18B2E8";
  let aireColor = "#18B2E8";

  function aplicarGradiente() {
    const gradiente = `linear-gradient(90deg, ${aireColor}, ${uvColor})`;
    document.documentElement.style.setProperty("--color-highlight-gradient", gradiente);

    const svgEls = document.querySelectorAll("svg#svgStart, svg#svgEnd");
    svgEls.forEach(svg => {
      createGradient(svg, `grad-${svg.id}`, aireColor, uvColor);
      svg.querySelectorAll("path, circle, rect, polygon").forEach((sh) => {
        sh.setAttribute("fill", `url(#grad-${svg.id})`);
      });
    });
  }

  document.addEventListener("uvReady", (e) => {
    const { src, color } = e.detail;
    uvColor = color;
    const mark = document.querySelector(".hx-3");
    if (mark) mark.style.setProperty("--color-highlight-end", color);
    aplicarGradiente();
  });

  document.addEventListener("aireSaludReady", (e) => {
    const { textoIndice, color } = e.detail;
    aireColor = color;
    currentIconColor = color;
    document.documentElement.style.setProperty("--color-highlight-start", color);

    const h2 = document.querySelector(".content__title_W");
    if (h2) {
      const fixed = h2.querySelector("span");
      h2.innerHTML = "";
      if (fixed) h2.appendChild(fixed);

      const span = document.createElement("span");
      span.textContent = textoIndice;
      span.style.fontWeight = "bold";
      span.style.color = color;
      h2.appendChild(span);
    }

    aplicarGradiente();
  });

  function createGradient(svgEl, id, colorStart, colorEnd) {
    const defs = svgEl.querySelector("defs") || svgEl.insertBefore(
      document.createElementNS("http://www.w3.org/2000/svg", "defs"),
      svgEl.firstChild
    );

    const old = defs.querySelector(`#${id}`);
    if (old) old.remove();

    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.setAttribute("id", id);
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%");
    grad.setAttribute("y2", "0%");

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", colorStart);

    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", colorEnd);

    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
  }

  async function inlineSVG(imgEl) {
    if (!imgEl) return;

    const svgText = await fetch(imgEl.src).then((r) => r.text());
    const wrapper = document.createElement("div");
    wrapper.innerHTML = svgText;

    const svgEl = wrapper.querySelector("svg");
    if (!svgEl) return;

    svgEl.id = imgEl.id;
    svgEl.classList.add(...imgEl.classList);

    // Prefijar IDs internos
    prefixInternalIds(svgEl, imgEl.id);

    imgEl.replaceWith(svgEl);
    return svgEl;
  }

  function prefixInternalIds(svgEl, prefix) {
    svgEl.querySelectorAll("[id]").forEach(el => {
      const oldId = el.id;
      const newId = `${prefix}-${oldId}`;
      // Cambiar el ID
      el.id = newId;

      // Buscar referencias internas que lo usen
      svgEl.querySelectorAll(`[*|href="#${oldId}"], [fill="url(#${oldId})"], [clip-path="url(#${oldId})"]`)
        .forEach(refEl => {
          Array.from(refEl.attributes).forEach(attr => {
            if (attr.value.includes(`#${oldId}`)) {
              attr.value = attr.value.replace(`#${oldId}`, `#${newId}`);
            }
          });
        });
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    gsap.registerPlugin(ScrollTrigger);

    const [svgStart, svgEnd] = await Promise.all([
      inlineSVG(document.querySelector("#svgStart")),
      inlineSVG(document.querySelector("#svgEnd")),
    ]);

    document.documentElement.style.setProperty("--color-highlight-start", currentIconColor);
    aplicarGradiente();

    gsap.set("#svgStart", { opacity: 0.3, yPercent: -100, xPercent: 600 });
    gsap.set("#svgEnd", { opacity: 0.3, yPercent: -100, xPercent: -600 });
    gsap.set(".text-large_w", {
      opacity: 0,
      yPercent: 100,
      scale: 0,
      transformOrigin: "center top",
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: "#container",
        start: "top 80%",
        end: "top 30%",
        scrub: true,
      },
    })
      .to("#svgStart", { opacity: 1, yPercent: -118, xPercent: 83, scale: 0.28 }, 0)
      .to("#svgEnd", { opacity: 1, yPercent: 90, xPercent: -90, scale: 0.28 }, 0)
      .to(".text-large_w", { opacity: 1, yPercent: 0, scale: 1 }, 0.4);
  });

  const icono = document.querySelector(".city-icon");
  if (icono) {
    icono.classList.add("animated-gradient", "grain-effect");
    icono.style.webkitBackgroundClip = "text";
    icono.style.webkitTextFillColor = "transparent";
  }
})();
