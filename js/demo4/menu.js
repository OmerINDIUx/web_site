document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById('menu-toggle');
  const fullscreenMenu = document.getElementById('fullscreen-menu');
  const closeButton = document.getElementById('close-menu');
  const menuLinks = fullscreenMenu?.querySelectorAll('.menu__item') || [];

  function openMenu() {
    fullscreenMenu.classList.add('show');
  }

  function closeMenu() {
    fullscreenMenu.classList.remove('show');
  }

  menuToggle?.addEventListener('click', openMenu);
  closeButton?.addEventListener('click', closeMenu);

  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Cerrar menú al hacer clic en un enlace
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();

      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        window.location.href = href;
      }
    });
  });
});
