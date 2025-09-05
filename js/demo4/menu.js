document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById('menu-toggle');
  const fullscreenMenu = document.getElementById('fullscreen-menu');
  const closeButton = document.getElementById('close-menu');
  const menuLinks = fullscreenMenu?.querySelectorAll('.menu__item') || [];

  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    fullscreenMenu.classList.add('show');

    gsap.set(fullscreenMenu, {
      transformOrigin: "top left",
      transformPerspective: 1200
    });

    gsap.fromTo(fullscreenMenu,
      {  rotateZ: 90, rotateY: -90,  opacity: 1 },
      { rotateZ: 0, rotateY: 0, rotateZ: 0, opacity: 1, duration: 1.5, ease: "power4.out" }
    );
  }

  function closeMenu() {
    menuOpen = false;

    gsap.to(fullscreenMenu, {
      rotateZ: 90,
      rotateY: -90,
      opacity: 0,
      transformOrigin: "top left",
      transformPerspective: 1200,
      duration: .6,
      ease: "power4.in",
      onComplete: () => fullscreenMenu.classList.remove('show')
    });
  }

  menuToggle?.addEventListener('click', () => {
    if (!menuOpen) openMenu();
  });

  closeButton?.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }, 700);
      } else {
        window.location.href = href;
      }
    });
  });
});
