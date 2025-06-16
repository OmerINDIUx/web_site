function translatePage(lang = 'en') {
  const elements = document.querySelectorAll('[data-i18n]');

  // 1. Fade out con opacidad y ligera escala para salida
  gsap.to(elements, {
    opacity: 0,
    scale: 0.95,
    duration: 0.3,
    stagger: 0.02,
    ease: "power1.in",
    onComplete: () => {
      // 2. Cargar traducciones
      fetch(`./json/${lang}.json`)
        .then(res => res.json())
        .then(translations => {
          elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = translations[key] || key;

            if (el.tagName === 'IMG') {
              el.alt = translation;
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              el.placeholder = translation;
            } else {
              el.innerHTML = translation;
            }
          });

          // 3. Entrada con rebote sutil
          gsap.fromTo(elements,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              stagger: 0.02,
              ease: 'back.out(1.4)'
            }
          );
        })
        .catch(err => console.error("Error cargando idioma:", err));
    }
  });
}


// Cambio de idioma con animación del botón también
document.getElementById('lang-toggle')?.addEventListener('click', () => {
  const btn = document.getElementById('lang-toggle');
  const current = btn.textContent.trim();
  const nextLang = current === 'ES' ? 'es' : 'en';

  // Animación del botón al hacer toggle
  gsap.to(btn, {
    scale: 0.8,
    duration: 0.15,
    onComplete: () => {
      btn.textContent = nextLang.toUpperCase();
      translatePage(nextLang.toLowerCase());

      gsap.to(btn, {
        scale: 1,
        duration: 0.15,
        ease: "back.out(2)"
      });
    }
  });
});

// Carga inicial con animación suave
window.addEventListener('DOMContentLoaded', () => {
  gsap.from('[data-i18n]', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: 0.03,
    ease: "power2.out"
  });

  translatePage('en');
});
