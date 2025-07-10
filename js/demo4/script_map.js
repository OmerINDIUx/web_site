(() => {
  /* ───────────────────────────── 1. ESTADO GLOBAL ───────────────────────────── */
  let currentIconColor = "#e7e5d9";

  /**
   * Sincroniza la variable CSS global con el color actual y guarda el estado
   */
  function updateGlobalColor(color) {
    currentIconColor = color;
    document.documentElement.style.setProperty(
      "--color-highlight-start-map",
      color
    );
  }
  /* ───────────────────────────── 2. INLINE SVG ─────────────────────────────── */
  async function inlineSVG(imgEl) {
    if (!imgEl) return;

    const url = imgEl.src;
    const svgText = await fetch(url).then((r) => r.text());
    const wrapper = document.createElement("div");
    wrapper.innerHTML = svgText;

    const svgEl = wrapper.querySelector("svg");
    if (!svgEl) return;

    svgEl.id = imgEl.id;
    svgEl.classList.add(...imgEl.classList);

    // Hereda el color del CSS usando currentColor
    svgEl
      .querySelectorAll("path, circle, rect, polygon, line, polyline")
      .forEach((sh) => {
        sh.setAttribute("fill", "currentColor");
        if (sh.hasAttribute("stroke"))
          sh.setAttribute("stroke", "currentColor");
      });

    imgEl.replaceWith(svgEl);
  }

  /* ───────────────────────────── 3. UTILIDADES DE HORA ──────────────────────── */
  function getHourInCDMX() {
    const hourPart = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Mexico_City",
      hour12: false,
      hour: "2-digit",
    })
      .formatToParts(new Date())
      .find((p) => p.type === "hour");
    return parseInt(hourPart.value, 10);
  }

  function getSvgConfig(via, h = getHourInCDMX()) {
    // Horas pico (mañana y tarde)
    if ((h >= 7 && h <= 10) || (h >= 18 && h <= 21)) {
      return via === "primarias"
        ? { density: 20, numLights: 30, speed: 0.5, color: "#A51C5B" } // rojo intenso
        : { density: 20, numLights: 15, speed: 0.5, color: "#F86230" }; // naranja fuerte
      }


    // Horario intermedio / medio día
    if (h >= 11 && h <= 17) {
      return via === "primarias"
        ? { density: 30, numLights: 15, speed: 1.5, color: "#F86230" }
        : { density: 30, numLights: 8, speed: 1.5, color: "#E0AD3D" }; // amarillo
    }

    // Horario nocturno / madrugada
    return via === "primarias"
      ? { density: 50, numLights: 8, speed: 2.3, color: "#9244D6" }
      : { density: 50, numLights: 5, speed: 2.3, color: "#18B2E8" }; // beige suave
  }

  /* ───────────────────────────── 4. CLASE SvgAnimator ───────────────────────── */
  class SvgAnimator {
    constructor(containerId, svgFile, config = {}) {
      this.container = document.getElementById(containerId);
      this.svgFile = svgFile;
      this.density = config.density ?? 30;
      this.numLights = config.numLights ?? 5;
      this.speed = config.speed ?? 2;
      this.trailColor = config.color ?? "#ffffff";

      this.svg = null;
      this.paths = [];
      this.totalLengths = [];
      this.totalPathLength = 0;
      this.lights = [];
      this.estela = [];

      this.init();
    }

    async init() {
      // Carga e incrusta el SVG de la vía
      const data = await fetch(this.svgFile).then((r) => r.text());
      const doc = new DOMParser().parseFromString(data, "image/svg+xml");
      this.svg = doc.querySelector("svg");
      this.svg.setAttribute("viewBox", "0 0 3500 3500");
      this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

      /* Perspectiva 3D para un efecto de profundidad */
      this.container.style.perspective = "1000px";
      this.container.style.transformStyle = "preserve-3d";
      this.svg.style.transform = "rotateX(20deg) rotateY(-3deg)";
      this.svg.style.transformOrigin = "left top";

      this.container.appendChild(this.svg);

      /* Resplandor de las luces */
      const defs =
        this.svg.querySelector("defs") ||
        document.createElementNS("http://www.w3.org/2000/svg", "defs");
      if (!defs.parentNode) this.svg.insertBefore(defs, this.svg.firstChild);

      const filter = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter"
      );
      filter.setAttribute("id", "glow");
      filter.setAttribute("x", "-50%");
      filter.setAttribute("y", "-50%");
      filter.setAttribute("width", "200%");
      filter.setAttribute("height", "200%");

      const blur = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "feGaussianBlur"
      );
      blur.setAttribute("in", "SourceGraphic");
      blur.setAttribute("stdDeviation", "4");
      blur.setAttribute("result", "blur");

      const merge = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "feMerge"
      );
      ["blur", "blur", "SourceGraphic"].forEach((input) => {
        const node = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feMergeNode"
        );
        node.setAttribute("in", input);
        merge.appendChild(node);
      });

      filter.appendChild(blur);
      filter.appendChild(merge);
      defs.appendChild(filter);

      /* Paths */
      const raw = Array.from(
        this.svg.querySelectorAll("path, polyline, polygon")
      );
      this.paths = raw
        .map((el) => (el.tagName === "path" ? el : this.convertToPath(el)))
        .filter(Boolean);
      this.totalLengths = this.paths.map((p) => p.getTotalLength());
      this.totalPathLength = this.totalLengths.reduce((a, b) => a + b, 0);

      this.setupLights();
      this.animate();
    }

    /** Convierte polylines/polygons en path para permitir getPointAtLength */
    convertToPath(el) {
      const pts = el.getAttribute("points")?.trim()?.split(/\s+/);
      if (!pts || pts.length < 2) return null;

      const [fx, fy] = pts[0].split(",").map(Number);
      let d = `M${fx},${fy}`;
      for (let i = 1; i < pts.length; i++) {
        const [x, y] = pts[i].split(",").map(Number);
        d += ` L${x},${y}`;
      }
      if (el.tagName.toLowerCase() === "polygon") d += " Z";

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "none");
      return path;
    }

    /** Crea las luces iniciales según el número solicitado */
    setupLights() {
      this.lights.forEach((l) => l.el.remove());
      this.lights = [];

      for (let i = 0; i < this.numLights; i++) {
        const el = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        el.setAttribute("r", 1.5);
        el.setAttribute("fill", "yellow");
        el.setAttribute("filter", "url(#glow)");
        this.svg.appendChild(el);

        this.lights.push({
          el,
          progress: (i / this.numLights) * this.totalPathLength,
          direction: Math.random() < 0.5 ? 1 : -1,
        });
      }
    }

    /** Devuelve la posición X/Y global a lo largo de todos los paths */
    getPointAtGlobalLength(len) {
      let acc = 0;
      for (let i = 0; i < this.paths.length; i++) {
        const plen = this.totalLengths[i];
        if (len <= acc + plen) {
          return this.paths[i].getPointAtLength(len - acc);
        }
        acc += plen;
      }
      return null;
    }

    /** Animación cuadro a cuadro por requestAnimationFrame */
    animate() {
      const strokeColor = this.trailColor;

      this.lights.forEach((light) => {
        const pt = this.getPointAtGlobalLength(light.progress);
        if (pt) {
          light.el.setAttribute("cx", pt.x);
          light.el.setAttribute("cy", pt.y);

          if (!light.lastPoint) {
            light.lastPoint = { x: pt.x, y: pt.y };
          } else {
            const dx = pt.x - light.lastPoint.x;
            const dy = pt.y - light.lastPoint.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 100 && Math.random() < this.density / 100) {
              const line = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
              );
              line.setAttribute("x1", light.lastPoint.x);
              line.setAttribute("y1", light.lastPoint.y);
              line.setAttribute("x2", pt.x);
              line.setAttribute("y2", pt.y);
              line.setAttribute("stroke", strokeColor);
              line.setAttribute("stroke-width", 2);
              line.setAttribute("stroke-opacity", 0.7);
              this.svg.appendChild(line);
              this.estela.push(line);

              if (this.estela.length > 8000) {
                this.estela.shift().remove();
              }
            }

            light.lastPoint = { x: pt.x, y: pt.y };
          }
        }

        // Avance / retroceso
        light.progress += this.speed * light.direction;
        if (light.progress > this.totalPathLength) {
          light.progress = this.totalPathLength;
          light.direction = -1;
        } else if (light.progress < 0) {
          light.progress = 0;
          light.direction = 1;
        }
      });

      requestAnimationFrame(() => this.animate());
    }

    /** Permite actualizar configuración en caliente */
    updateConfig(cfg) {
      this.density = cfg.density;
      this.speed = cfg.speed;
      this.trailColor = cfg.color;

      if (cfg.numLights !== this.numLights) {
        this.numLights = cfg.numLights;
        this.setupLights();
      }
    }
  }

  /* ───────────────────────────── 5. DOM READY ─────────────────────────────── */
  document.addEventListener("DOMContentLoaded", async () => {
    /* 5.1 Incrustar los íconos como SVG para heredar el color */
    await Promise.all([
      inlineSVG(document.querySelector("#svg1")),
      inlineSVG(document.querySelector("#svg2")),
      inlineSVG(document.querySelector("#svg3")),
      inlineSVG(document.querySelector("#svg4")),
    ]);

    /* 5.2 Configuración inicial basada en la hora actual */
    const horaActual = getHourInCDMX();
    const cfgPrim = getSvgConfig("primarias", horaActual);
    const cfgSec = getSvgConfig("secundarias", horaActual);
    updateGlobalColor(cfgPrim.color);

    /* 5.3 Crear instancias SvgAnimator */
    const animPrimarias = new SvgAnimator(
      "svg-container1",
      "./img/Vias_primarias_CDMX.svg",
      cfgPrim
    );

    const animSecundarias = new SvgAnimator(
      "svg-container2",
      "./img/Vias_secundarias_CDMX.svg",
      cfgSec
    );

    /* 5.4 Slider para controlar la hora manualmente */
    const slider = document.getElementById("hourSlider");
    const labelHour = document.getElementById("hourLabel");

    slider.value = horaActual;
    updateHourDisplay(horaActual);

    function updateHourDisplay(h) {
      labelHour.textContent = `${h.toString().padStart(2, "0")}:00 hrs.`;
    }

    function applyHour(h) {
      updateHourDisplay(h);
      const cfgPrim = getSvgConfig("primarias", h);
      const cfgSec = getSvgConfig("secundarias", h);
      animPrimarias.updateConfig(cfgPrim);
      animSecundarias.updateConfig(cfgSec);
      updateGlobalColor(cfgPrim.color); // Sincroniza el color global
    }

    slider.addEventListener("input", (e) => applyHour(+e.target.value));
  });
  const slider = document.getElementById("hourSlider");
  const hourLabel = document.getElementById("hourLabel");

  function formatHour(hour) {
    return `${String(hour).padStart(2, "0")}:00`;
  }

  slider.addEventListener("input", () => {
    const value = parseInt(slider.value);
    hourLabel.textContent = formatHour(value);

    // Animación de rebote en la hora
    gsap.fromTo(
      hourLabel,
      { scale: 1.2, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }
    );

    // Glow temporal en el slider
    gsap.fromTo(
      slider,
      { boxShadow: "0 0 12px #e7e5d9" },
      { boxShadow: "0 0 0px transparent", duration: 0.6, ease: "power2.out" }
    );
  });
})();
