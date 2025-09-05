// gsap.registerPlugin(ScrollTrigger);

//     const video = document.querySelector(".video-background");
//     const videoWrapper = document.querySelector(".video-scroll-wrapper");

//     video.addEventListener("loadedmetadata", () => {
//       let duration = video.duration;

//       // Más espacio de scroll = avance más suave
//       videoWrapper.style.height = window.innerHeight + duration * 50 + "px";

//       ScrollTrigger.create({
//         trigger: videoWrapper,
//         start: "top top",
//         endTrigger: ".TextLarge",
//         end: "top center",
//         pin: ".video-fullscreen",
//         scrub: 2, // inercia
//          markers: true, // descomenta si quieres debug
//         onUpdate: (self) => {
//           gsap.to(video, {
//             currentTime: self.progress * duration,
//             duration: 0.5,
//             ease: "power2.out"
//           });
//         },
//       });


//       // Fade out cuando entra el texto
//       gsap.to(".video-fullscreen", {
//         opacity: 0,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: ".TextLarge",
//           start: "top bottom",
//           end: "top center",
//           scrub: true
//         }
//       });
//     });

gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("image-sequence");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameStart = 1000;
const frameEnd = 1120;
const frameCount = frameEnd - frameStart + 1;

const currentFrame = index => `images/image_sequences/vivienda_${(frameStart + index)}.png`;

const images = [];
const imageSeq = { frame: 0 };

// Pre-cargar imágenes
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

// Función para pintar el frame actual
function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const img = images[imageSeq.frame];
  if (img) {
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  }
}

// Animar la secuencia con scroll
gsap.to(imageSeq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    trigger: ".video-scroll-wrapper",
    start: "top top",
    endTrigger: ".TextLarge",
    end: "top center",
    scrub: 1,
    pin: ".video-fullscreen",
    markers: true // quítalo cuando no quieras debug
  },
  onUpdate: render
});

// FadeOut cuando aparece el texto
gsap.to(".video-fullscreen", {
  opacity: 0,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".TextLarge",
    start: "top bottom",
    end: "top center",
    scrub: true
  }
});

// Render inicial
images[0].onload = render;
