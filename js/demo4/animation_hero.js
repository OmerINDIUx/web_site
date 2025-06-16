// (() => {
//   /* ---------- 0) estado global ---------- */
//   let currentIconColor = "#18B2E8"; // valor por defecto

//   /* ---------- 1) LISTENER ÍNDICE UV ---------- */
//   document.addEventListener("uvReady", (e) => {
//     const match = e.detail.src.match(/(\d+)\.gif$/);
//     const num = match ? +match[1] : null;

//     const uvColors = {
//       0: "#18B2E8",
//       1: "#18B2E8",
//       2: "#18B2E8",
//       3: "#9244D6",
//       4: "#9244D6",
//       5: "#9244D6",
//       6: "#f66b58",
//       7: "#f66b58",
//       8: "#FFC043",
//       9: "#FFC043",
//       10: "#FFC043",
//       11: "#FFC043",
//       12: "#F86230",
//       13: "#F86230",
//       14: "#F86230",
//       15: "#F86230",
//     };
//     const color = num != null && num in uvColors ? uvColors[num] : "#18B2E8";

//     // Ejemplo de uso en tu mark
//     const mark = document.querySelector(".hx-3");
//     if (mark) mark.style.setProperty("--color-highlight-end", color);
//   });

//   /* ---------- 2) LISTENER AIRE Y SALUD ---------- */
//   document.addEventListener("aireSaludReady", (e) => {
//     const { textoIndice, color } = e.detail;
//     currentIconColor = color; // ① guarda el color
//     document.documentElement.style.setProperty(
//       "--color-highlight-start",
//       color
//     ); // ② actualiza la var. CSS

//     // ---- actualiza título
//     const h2 = document.querySelector(".content__title_W");
//     if (h2) {
//       const fixed = h2.querySelector("span");
//       h2.innerHTML = "";
//       if (fixed) h2.appendChild(fixed);

//       const span = document.createElement("span");
//       span.textContent = textoIndice;
//       span.style.fontWeight = "bold";
//       span.style.color = color;
//       h2.appendChild(span);
//     }
//   });

//   /* ---------- 3) FETCH al sitio ---------- */
//   const targetUrl = "http://aire.cdmx.gob.mx/default.php";
//   const proxyUrl = "https://api.allorigins.win/get?url=";

//   fetch(proxyUrl + encodeURIComponent(targetUrl))
//     .then((r) => r.text())
//     .then((html) => {
//       const doc = new DOMParser().parseFromString(html, "text/html");

//       // UV
//       const uvImg = doc.querySelector("#indiceuvimagen img");
//       if (uvImg?.src)
//         document.dispatchEvent(
//           new CustomEvent("uvReady", { detail: { src: uvImg.src } })
//         );

//       // Aire y Salud
//       const cont = doc.querySelector("#renglondosdatoscalidadaireahora");
//       const strong = [...(cont?.querySelectorAll("strong") || [])].find((s) =>
//         s.textContent.trim().toLowerCase().startsWith("índice aire y salud")
//       );

//       if (strong) {
//         const textoIndice = strong.textContent.trim();
//         const t = textoIndice.toLowerCase();
//         let color = "#18B2E8";
//         if (t.includes("aceptable")) color = "#9244D6";
//         else if (
//           t.includes("mala") &&
//           !t.includes("muy") &&
//           !t.includes("extrema")
//         )
//           color = "#f66b58";
//         else if (t.includes("muy mala") || t.includes("extremadamente mala"))
//           color = "#FFC043";

//         document.dispatchEvent(
//           new CustomEvent("aireSaludReady", { detail: { textoIndice, color } })
//         );
//       }
//     })
//     .catch((err) => console.error("Error obteniendo datos:", err));

//   /* ---------- 4) Reemplazar <img> por SVG inline ---------- */
//   async function inlineSVG(imgEl) {
//     if (!imgEl) return;
//     const url = imgEl.src;
//     const svgText = await fetch(url).then((r) => r.text());
//     const wrapper = document.createElement("div");
//     wrapper.innerHTML = svgText;

//     const svgEl = wrapper.querySelector("svg");
//     if (!svgEl) return;

//     svgEl.id = imgEl.id;
//     svgEl.classList.add(...imgEl.classList);

//     // Asegura fill="currentColor" para heredar el color
//     svgEl.querySelectorAll("path, circle, rect, polygon").forEach((sh) => {
//       sh.setAttribute("fill", "currentColor");
//       if (sh.hasAttribute("stroke")) sh.setAttribute("stroke", "currentColor");
//     });

//     imgEl.replaceWith(svgEl);
//   }

//   /* ---------- 5) DOMContentLoaded: inline + animaciones ---------- */
//   document.addEventListener("DOMContentLoaded", async () => {
//     gsap.registerPlugin(ScrollTrigger);

//     // ① reemplazar imágenes por SVG
//     await Promise.all([
//       inlineSVG(document.querySelector("#svgStart")),
//       inlineSVG(document.querySelector("#svgEnd")),
//     ]);

//     /* ② aplicar el color que quizá ya se recibió antes de tiempo */
//     document.documentElement.style.setProperty(
//       "--color-highlight-start",
//       currentIconColor
//     );

//     // ③ animaciones GSAP
//     gsap.set("#svgStart", { opacity: 0.3, yPercent: -100, xPercent: 600 });
//     gsap.set("#svgEnd", { opacity: 0.3, yPercent: -100, xPercent: -600 });
//     gsap.set(".text-large_w", {
//       opacity: 0,
//       yPercent: 100,
//       scale: 0,
//       transformOrigin: "center top",
//     });

//     gsap
//       .timeline({
//         scrollTrigger: {
//           trigger: "#container",
//           start: "top 80%",
//           end: "top 30%",
//           scrub: true,
//         },
//       })
//       .to(
//         "#svgStart",
//         { opacity: 1, yPercent: -90, xPercent: 90, ease: "none" },
//         0
//       )
//       .to(
//         "#svgEnd",
//         { opacity: 1, yPercent: 50, xPercent: -100, ease: "none" },
//         0
//       )
//       .to(
//         ".text-large_w",
//         { opacity: 1, yPercent: 0, ease: "none", scale: 1 },
//         0.4
//       );
//   });
// })();
// animaciones.js
(() => {
  let currentIconColor = "#18B2E8";

  document.addEventListener("uvReady", (e) => {
    const { src, color } = e.detail;

    const mark = document.querySelector(".hx-3");
    if (mark) mark.style.setProperty("--color-highlight-end", color);
  });

  document.addEventListener("aireSaludReady", (e) => {
    const { textoIndice, color } = e.detail;
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
  });

  async function inlineSVG(imgEl) {
    if (!imgEl) return;
    const svgText = await fetch(imgEl.src).then((r) => r.text());
    const wrapper = document.createElement("div");
    wrapper.innerHTML = svgText;

    const svgEl = wrapper.querySelector("svg");
    if (!svgEl) return;

    svgEl.id = imgEl.id;
    svgEl.classList.add(...imgEl.classList);

    svgEl.querySelectorAll("path, circle, rect, polygon").forEach((sh) => {
      sh.setAttribute("fill", "currentColor");
      if (sh.hasAttribute("stroke")) sh.setAttribute("stroke", "currentColor");
    });

    imgEl.replaceWith(svgEl);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    gsap.registerPlugin(ScrollTrigger);

    await Promise.all([
      inlineSVG(document.querySelector("#svgStart")),
      inlineSVG(document.querySelector("#svgEnd")),
    ]);

    document.documentElement.style.setProperty(
      "--color-highlight-start",
      currentIconColor
    );

    gsap.set("#svgStart", { opacity: 0.3, yPercent: -100, xPercent: 600 });
    gsap.set("#svgEnd", { opacity: 0.3, yPercent: -100, xPercent: -600 });
    gsap.set(".text-large_w", {
      opacity: 0,
      yPercent: 100,
      scale: 0,
      transformOrigin: "center top",
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#container",
          start: "top 80%",
          end: "top 30%",
          scrub: true,
        },
      })
      .to("#svgStart", { opacity: 1, yPercent: -90, xPercent: 90 }, 0)
      .to("#svgEnd", { opacity: 1, yPercent: 50, xPercent: -100 }, 0)
      .to(".text-large_w", { opacity: 1, yPercent: 0, scale: 1 }, 0.4);
  });
})();
