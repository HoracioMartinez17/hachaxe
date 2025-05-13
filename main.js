const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");
/* Preload */
const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", () => {
  // Asegúrate de que el preloader desaparezca correctamente
  preloader.classList.add("loaded"); // Añade la clase 'loaded' al preloader
  document.body.classList.add("loaded"); // Añade la clase 'loaded' al body
});

// Opcional: Elimina el preloader del DOM después de desaparecer
setTimeout(() => {
  if (preloader) {
    preloader.remove();
  }
}, 1000); // 1 segundo después de marcarlo como 'loaded'

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});
document.addEventListener("DOMContentLoaded", function() {
  const currentYear = new Date().getFullYear();
  document.getElementById("currentYear").textContent = currentYear;
});
const scrollRevealOption = {
  distance: "30px",        // Distancia de desplazamiento
  origin: "bottom",        // Dirección de origen
  duration: 200,           // Duración más rápida (anteriormente 300ms)
  delay: 0,                // Sin retraso inicial (ajustar según el caso)
  interval: 100,           // Intervalo de 100ms entre las animaciones
};

ScrollReveal().reveal(".commitment__image img", {
  ...scrollRevealOption,
  origin: "left",
  duration: 250,           // Duración más rápida para la imagen
});

ScrollReveal().reveal(".commitment__content .section__header", {
  ...scrollRevealOption,
  delay: 150,              // Retraso más corto para el header
});

ScrollReveal().reveal(".commitment__content .animation__fade", {
  ...scrollRevealOption,
  delay: 200,              // Retraso más corto para la descripción
});

ScrollReveal().reveal(".commitment__list li", {
  ...scrollRevealOption,
  delay: 400,              // Retraso ajustado para los ítems
  interval: 200,           // Intervalo más rápido entre cada ítem
});

const progressCircle = document.querySelector(".autoplay-progress svg");
const progressContent = document.querySelector(".autoplay-progress span");
const swiper = new Swiper(".swiper", {
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: true
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  on: {
    autoplayTimeLeft(s, time, progress) {
      progressCircle.style.setProperty("--progress", 1 - progress);
      progressContent.textContent = `${Math.ceil(time / 1000)}s`;
    }
  }
});
