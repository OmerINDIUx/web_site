// const targetUrl = 'http://aire.cdmx.gob.mx/default.php';
// const proxyUrl  = 'https://api.allorigins.win/get?url=';

// fetch(proxyUrl + encodeURIComponent(targetUrl))
//   .then(response => response.text())
//   .then(html => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, 'text/html');

//     // Buscar el div que contiene el índice
//     const contenedor = doc.querySelector('#renglondosdatoscalidadaireahora');
//     if (!contenedor) {
//       console.log('No se encontró el contenedor renglondosdatoscalidadaireahora');
//       return;
//     }

//     // Buscar el strong dentro de ese div con el texto esperado
//     const strongs = contenedor.querySelectorAll('strong');
//     let textoIndice = null;

//     strongs.forEach(el => {
//       if (el.textContent.trim().startsWith('Índice AIRE Y SALUD:')) {
//         textoIndice = el.textContent.trim();
//       }
//     });

//     if (!textoIndice) {
//       console.log('No se encontró texto con "Índice AIRE Y SALUD:"');
//       return;
//     }

//     // Extraer la palabra clave (buena, aceptable, mala, etc)
//     const match = textoIndice.match(/Índice AIRE Y SALUD:\s*(\w+)/i);
//     const palabra = match ? match[1].toLowerCase() : null;

//     // Mapa de colores
//     const colorMap = {
//       buena: '#18B2E8',
//       aceptable: '#9244D6',
//       mala: '#FFC043',
//       muy: '#F86230',             // para "muy mala"
//       extremadamente: '#A51C5B',  // para "extremadamente mala"
//     };

//     // Determinar color según palabra clave, cuidando "muy mala" y "extremadamente mala"
//     let color = '#9244D6'; // color default

//     if (palabra === 'buena') color = colorMap.buena;
//     else if (palabra === 'aceptable') color = colorMap.aceptable;
//     else if (palabra === 'mala') color = colorMap.mala;
//     else if (textoIndice.toLowerCase().includes('muy mala')) color = colorMap['muy'];
//     else if (textoIndice.toLowerCase().includes('extremadamente mala')) color = colorMap['extremadamente'];

//     // Mostrar en consola
//     console.log(`Índice Aire y Salud: "${textoIndice}", Color: ${color}`);

//     // Opcional: actualizar contenido en la página actual (si quieres)
//     const h2 = document.querySelector('.content__title_W');
//     if (h2) {
//       // Mantener un span inicial si existe
//       const span = h2.querySelector('span');
//       h2.innerHTML = '';
//       if(span) h2.appendChild(span);

//       // Crear nuevo span con palabra y color
//       const colorSpan = document.createElement('span');
//       colorSpan.textContent = palabra ? palabra.charAt(0).toUpperCase() + palabra.slice(1) : textoIndice;
//       colorSpan.style.fontWeight = 'bold';
//       colorSpan.style.color = color;

//       h2.appendChild(colorSpan);
//     }
//   })
//   .catch(err => {
//     console.error('Error:', err);
//   });




// datosColores.js

const targetUrl = 'http://aire.cdmx.gob.mx/default.php';
const proxyUrl = 'https://api.allorigins.win/get?url=';
console.log("Iniciando fetch a calidad del aire");

fetch(proxyUrl + encodeURIComponent(targetUrl))
  .then(response => {
    console.log("Respuesta recibida del proxy");
    return response.text();
  })
  .then(html => {
    console.log("HTML recibido:");
    console.log(html.slice(0, 500)); // muestra solo el inicio

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Índice UV
    const uvImg = doc.querySelector("#indiceuvimagen img");
    if (uvImg?.src) {
      const match = uvImg.src.match(/(\d+)\.gif$/);
      const num = match ? +match[1] : null;

      const color = { 0: "#18B2E8", 1: "#18B2E8", 2: "#18B2E8",
        3: "#9244D6", 4: "#9244D6", 5: "#9244D6",
        6: "#f66b58", 7: "#f66b58",
        8: "#FFC043", 9: "#FFC043", 10: "#FFC043", 11: "#FFC043",
        12: "#F86230", 13: "#F86230", 14: "#F86230", 15: "#F86230",
      }[num] || "#18B2E8";

      console.log("Disparando evento uvReady");
      document.dispatchEvent(new CustomEvent("uvReady", {
        detail: { src: uvImg.src, color }
      }));
    }

    // Calidad del aire
    const contenedor = doc.querySelector("#renglondosdatoscalidadaireahora");
    if (!contenedor) {
      console.warn("No se encontró #renglondosdatoscalidadaireahora");
      return;
    }

    const strong = [...contenedor.querySelectorAll("strong")].find(el =>
      el.textContent.trim().toLowerCase().startsWith("índice aire y salud")
    );

    if (!strong) {
      console.warn("No se encontró strong con texto 'índice aire y salud'");
      return;
    }

    const textoIndice = strong.textContent.trim();
    const textoLower = textoIndice.toLowerCase();

    let color = "#18B2E8";
    if (textoLower.includes("aceptable")) color = "#9244D6";
    else if (textoLower.includes("muy mala") || textoLower.includes("extremadamente mala"))
      color = textoLower.includes("extremadamente") ? "#A51C5B" : "#F86230";
    else if (textoLower.includes("mala")) color = "#FFC043";

    console.log("Disparando evento aireSaludReady", textoIndice, color);

    document.dispatchEvent(new CustomEvent("aireSaludReady", {
      detail: { textoIndice, color }
    }));
  })
  .catch(err => {
    console.error("Error al obtener datos:", err);
  });
