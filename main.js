// ===== GSAP ANIMACIONES MODERNAS PARA HACHAXE =====

// Registro de plugins GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener("DOMContentLoaded", function () {
  // ===== PREVENIR SCROLLS CONFLICTIVOS =====
  // Cancelar cualquier scroll automático del navegador
  window.addEventListener("beforeunload", () => {
    gsap.killTweensOf(window);
  });

  // Inicializar todas las animaciones
  initPreloader();
  initNavigation();
  initHeroAnimations();
  initScrollAnimations();
  initParticleSystem();
  initInteractiveElements();
  initModernGallery(); // Nueva galería ultra moderna
  initAxeLogoAnimations(); // Nueva animación de corte de hacha

  // Configurar Swiper si existe
  if (typeof Swiper !== "undefined") {
    initSwiper();
  }
});

// ===== PRELOADER ANTI-FOUC MEJORADO =====
function initPreloader() {
  const preloader = document.querySelector("[data-preaload]");
  const circle = document.querySelector(".circle");
  const text = document.querySelector(".preload .text");

  if (!preloader) return;

  // Asegurar que el body esté oculto inicialmente
  document.body.style.overflow = "hidden";

  // Animación del círculo con efecto de hacha
  if (circle) {
    gsap.set(circle, { rotation: 0, scale: 0.8, opacity: 0 });
    gsap.to(circle, {
      rotation: 360,
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "back.out(1.7)",
    });
  }

  // Animación del texto
  if (text) {
    gsap.from(text, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.2,
      ease: "power2.out",
    });
  }

  // Esperar a que se carguen los recursos críticos
  const resourcesLoaded = new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      window.addEventListener("load", resolve);
    }
  });

  const minimumTime = new Promise((resolve) => setTimeout(resolve, 1200));

  // Timeline para ocultar el preloader solo cuando todo esté listo
  Promise.all([resourcesLoaded, minimumTime]).then(() => {
    const hidePreloader = gsap.timeline();

    hidePreloader
      .to(circle, { scale: 0, rotation: 720, duration: 0.5, ease: "power2.in" })
      .to(text, { opacity: 0, y: -50, duration: 0.3 }, "-=0.2")
      .to(preloader, {
        y: "-100%",
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          preloader.classList.add("loaded");
          document.body.classList.add("loaded");
          document.body.style.overflow = "";
          setTimeout(() => preloader.remove(), 100);
          initPageAnimations();
        },
      });
  });
}

// ===== NAVEGACIÓN INTELIGENTE =====
function initNavigation() {
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  const menuBtnIcon = menuBtn?.querySelector("i");
  const nav = document.querySelector("nav");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("open");
      menuBtn.classList.toggle("active");

      const isOpen = navLinks.classList.contains("open");
      if (menuBtnIcon) {
        menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
      }

      // Animación de los enlaces
      const links = navLinks.querySelectorAll("li");
      if (isOpen) {
        gsap.fromTo(
          links,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          }
        );
      }
    });

    // ===== CERRAR MENÚ AL HACER CLICK EN UN ENLACE =====
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        // Cerrar menú inmediatamente para scroll suave
        setTimeout(() => {
          navLinks.classList.remove("open");
          menuBtn.classList.remove("active");
          if (menuBtnIcon) {
            menuBtnIcon.setAttribute("class", "ri-menu-line");
          }
        }, 50); // Pequeño delay para que el click se procese primero
      }
    });
  }

  // ===== EFECTO SCROLL EN NAVEGACIÓN OPTIMIZADO =====
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    // Debounce para mejor performance
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (window.scrollY > 100) {
        nav?.classList.add("scrolled");
      } else {
        nav?.classList.remove("scrolled");
      }
    }, 10);
  });

  // ===== SMOOTH SCROLL SIMPLIFICADO Y EFECTIVO =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      console.log("🔗 Navegando a:", targetId, "Elemento encontrado:", !!target);

      if (target) {
        // Calcular posición con offset para header fijo
        const headerHeight = document.querySelector("nav")?.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight - 20;

        console.log("📍 Posición objetivo:", targetPosition);

        // Añadir indicador visual temporal
        document.body.style.cursor = "wait";

        // Método híbrido: GSAP simple o nativo como fallback
        try {
          // Usar GSAP de forma más directa
          gsap.to(window, {
            duration: 0.8,
            scrollTo: targetPosition,
            ease: "power2.out",
            onStart: () => console.log("🚀 Scroll iniciado"),
            onComplete: () => {
              console.log("✅ Scroll completado");
              document.body.style.cursor = "auto";
            },
          });
        } catch (error) {
          console.warn("⚠️ GSAP falló, usando scroll nativo:", error);
          // Fallback nativo
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
          // Restaurar cursor después del fallback
          setTimeout(() => (document.body.style.cursor = "auto"), 800);
        }
      } else {
        console.warn("❌ No se encontró el elemento con ID:", targetId);
      }
    });
  });
}

// ===== ANIMACIONES DEL HERO =====
function initHeroAnimations() {
  const heroTimeline = gsap.timeline({ delay: 0.5 }); // Reducido de 3.5 a 0.5

  // Animación del título principal
  heroTimeline.fromTo(
    ".header__content h1",
    {
      opacity: 0,
      y: 60, // Reducido de 100
      scale: 0.9, // Menos dramático
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1, // Reducido de 1.5
      ease: "power3.out",
    }
  );

  // Animación de la descripción
  heroTimeline.fromTo(
    ".header__content .section__description",
    { opacity: 0, y: 30 }, // Reducido de 50
    {
      opacity: 1,
      y: 0,
      duration: 0.8, // Reducido de 1
      ease: "power2.out",
    },
    "-=0.6" // Solapamiento más rápido
  );

  // Animación de los botones
  heroTimeline.fromTo(
    ".header__btns a",
    { opacity: 0, y: 20, scale: 0.9 }, // Reducido
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6, // Reducido de 0.8
      stagger: 0.1, // Reducido de 0.2
      ease: "back.out(1.7)",
    },
    "-=0.4" // Solapamiento más rápido
  );

  // Animación de la imagen
  heroTimeline.fromTo(
    ".header__image img",
    {
      opacity: 0,
      scale: 0.8, // Menos dramático
      rotation: -5, // Menos dramático
    },
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1, // Reducido de 1.5
      ease: "power3.out",
    },
    "-=0.8" // Solapamiento más rápido
  );

  // Efecto de respiración en la imagen (sin cambios)
  gsap.to(".header__image img", {
    scale: 1.05,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: "power2.inOut",
  });
}

// ===== ANIMACIONES AL HACER SCROLL =====
function initScrollAnimations() {
  // Animaciones para títulos de sección
  gsap.utils.toArray(".section__header").forEach((header) => {
    gsap.fromTo(
      header,
      {
        opacity: 0,
        y: 50, // Reducido de 100
        scale: 0.9, // Menos dramático
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8, // Reducido de 1.2
        ease: "power3.out",
        scrollTrigger: {
          trigger: header,
          start: "top 90%", // Más temprano (antes era 80%)
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Animaciones para las tarjetas de servicios
  gsap.utils.toArray(".discover__card").forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 80,
        rotationY: -15,
      },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        duration: 1,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Animaciones para la galería
  gsap.utils.toArray(".box").forEach((box, index) => {
    gsap.fromTo(
      box,
      {
        opacity: 0,
        scale: 0.8,
        rotation: 5,
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        delay: index * 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: box,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Animación de la lista de compromisos
  gsap.utils.toArray(".commitment__list li").forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        opacity: 0,
        x: -100,
        rotation: -2,
      },
      {
        opacity: 1,
        x: 0,
        rotation: 0,
        duration: 1,
        delay: index * 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  // Animación para la imagen de compromiso
  gsap.fromTo(
    ".commitment__image",
    {
      opacity: 0,
      x: 100,
      scale: 0.9,
    },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".commitment__image",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );
}

// ===== SISTEMA DE PARTÍCULAS =====
function initParticleSystem() {
  const header = document.querySelector(".header");
  if (!header) return;

  // Crear contenedor de partículas
  const particlesContainer = document.createElement("div");
  particlesContainer.className = "header__particles";
  header.appendChild(particlesContainer);

  // Generar partículas
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 4 + 4 + "s";
    particlesContainer.appendChild(particle);

    // Animación individual de cada partícula
    gsap.to(particle, {
      y: "random(-50, 50)",
      x: "random(-30, 30)",
      opacity: "random(0.3, 0.8)",
      duration: "random(3, 6)",
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
  }
}

// ===== ELEMENTOS INTERACTIVOS =====
function initInteractiveElements() {
  // Efecto hover en tarjetas
  document
    .querySelectorAll(".discover__card, .commitment__list li > div, .box")
    .forEach((element) => {
      element.addEventListener("mouseenter", () => {
        gsap.to(element, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      element.addEventListener("mouseleave", () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

  // Efecto magnético en botones
  document.querySelectorAll(".btn, .header__btns a").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
}

// ===== ANIMACIONES DESPUÉS DEL PRELOADER =====
function initPageAnimations() {
  // Configurar año actual
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = currentYear;
  }
}

// ===== SWIPER CONFIGURACIÓN =====
function initSwiper() {
  const progressCircle = document.querySelector(".autoplay-progress svg");
  const progressContent = document.querySelector(".autoplay-progress span");

  const swiper = new Swiper(".swiper", {
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    effect: "coverflow",
    coverflowEffect: {
      rotate: 30,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    on: {
      autoplayTimeLeft(s, time, progress) {
        if (progressCircle) {
          progressCircle.style.setProperty("--progress", 1 - progress);
        }
        if (progressContent) {
          progressContent.textContent = `${Math.ceil(time / 1000)}s`;
        }
      },
    },
  });
}

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function para optimizar eventos
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Optimizar resize events
window.addEventListener(
  "resize",
  debounce(() => {
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  }, 250)
);

// ===== CARRUSEL DINÁMICO ULTRA MODERNO CON LAZY LOADING =====
function initModernGallery() {
  // ===== CONFIGURACIÓN ULTRA EFICIENTE DE IMÁGENES =====
  // 🚀 MÉTODO HÍBRIDO: Máxima velocidad + Fácil mantenimiento

  // Configuración base por categorías
  const imageConfig = {
    hachas: {
      basePath: "./assets/hachas/",
      images: [
        { file: "hachaz-1.webp", alt: "Lanzamiento de hachas - Experiencia épica" },
        { file: "hachaz-2.webp", alt: "Técnica profesional de lanzamiento" },
        { file: "hachaz-5.webp", alt: "Diversión y adrenalina garantizada" },
      ],
    },
    rage: {
      basePath: "./assets/rage/",
      images: [{ file: "hachaz-3.webp", alt: "Rage Room - Libera todo tu estrés" }],
    },
    ambiente: {
      basePath: "./assets/ambiente/",
      images: [
        { file: "hachaz-4.webp", alt: "Instalaciones modernas y seguras" },
        { file: "hachaz-6.webp", alt: "Zona de espera y relajación" },
      ],
    },
  };

  // 🔥 GENERADOR AUTOMÁTICO ULTRA RÁPIDO
  const galleryImages = {};
  Object.entries(imageConfig).forEach(([category, config]) => {
    galleryImages[category] = config.images.map((img) => ({
      src: config.basePath + img.file,
      alt: img.alt,
      category: category,
      // Preload data para máxima velocidad
      loading: "lazy",
      sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
    }));
  });

  // 🚀 FUNCIÓN HELPER PARA AGREGAR NUEVAS IMÁGENES FÁCILMENTE
  function addImageToCategory(category, filename, altText) {
    if (!galleryImages[category]) {
      galleryImages[category] = [];
    }
    galleryImages[category].push({
      src: `./assets/${category}/${filename}`,
      alt: altText,
      category: category,
      loading: "lazy",
      sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
    });
  }

  // 📊 ESTADÍSTICAS DEL SISTEMA (para debugging)
  console.log("📸 Galería cargada:", {
    totalImages: Object.values(galleryImages).flat().length,
    categories: Object.keys(galleryImages),
    imagesPerCategory: Object.fromEntries(
      Object.entries(galleryImages).map(([cat, imgs]) => [cat, imgs.length])
    ),
  });

  // Variables del carrusel
  const carouselTrack = document.getElementById("carouselTrack");
  const carouselIndicators = document.getElementById("carouselIndicators");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const lightboxModal = document.getElementById("lightboxModal");

  if (!carouselTrack || !carouselIndicators) return;

  let currentImages = [];
  let currentSlide = 0;
  let totalSlides = 0;
  let slidesToShow = getSlidesToShow();
  let isAnimating = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let autoplayInterval = null;

  // Lazy loading observer
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // ===== FUNCIONES PRINCIPALES =====

  function getSlidesToShow() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getAllImages() {
    return Object.values(galleryImages).flat();
  }

  function getFilteredImages(filter) {
    if (filter === "all") return getAllImages();
    return galleryImages[filter] || [];
  }

  // ===== GENERACIÓN DINÁMICA DEL CARRUSEL =====

  function generateCarousel(images) {
    currentImages = images;
    totalSlides = Math.max(0, images.length - slidesToShow + 1);

    // Limpiar carrusel existente
    carouselTrack.innerHTML = "";
    carouselIndicators.innerHTML = "";

    // Generar slides
    images.forEach((image, index) => {
      const slide = createSlide(image, index);
      carouselTrack.appendChild(slide);
    });

    // Generar indicadores
    for (let i = 0; i < totalSlides; i++) {
      const indicator = createIndicator(i);
      carouselIndicators.appendChild(indicator);
    }

    // Reset position
    currentSlide = 0;
    updateCarouselPosition();
    updateIndicators();
    updateNavigationButtons();

    // Lazy load visible images
    lazyLoadVisibleImages();
  }

  function createSlide(image, index) {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.dataset.index = index;
    slide.dataset.category = image.category;

    slide.innerHTML = `
      <div class="image-placeholder">
        <i class="ri-image-line"></i>
      </div>
      <img data-src="${image.src}" alt="${image.alt}" class="lazy-image">
      <div class="image-overlay">
        <div class="overlay-content">
          <i class="ri-eye-line"></i>
          <span>Ver imagen</span>
        </div>
      </div>
      <div class="image-particles"></div>
    `;

    // Crear partículas
    createParticles(slide.querySelector(".image-particles"));

    // Event listeners
    setupSlideEvents(slide, index);

    return slide;
  }

  function createIndicator(index) {
    const indicator = document.createElement("button");
    indicator.className = "carousel-indicator";
    indicator.dataset.index = index;
    indicator.addEventListener("click", () => goToSlide(index));
    return indicator;
  }

  // ===== LAZY LOADING INTELIGENTE =====

  function lazyLoadVisibleImages() {
    const visibleSlides = getVisibleSlides();
    visibleSlides.forEach((slide) => {
      const img = slide.querySelector(".lazy-image");
      if (img && !img.classList.contains("loaded")) {
        imageObserver.observe(img);
      }
    });
  }

  function loadImage(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.classList.add("loaded");
      img.addEventListener("load", () => {
        const placeholder = img.parentElement.querySelector(".image-placeholder");
        if (placeholder) {
          gsap.to(placeholder, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => placeholder.remove(),
          });
        }
      });
    }
  }

  function getVisibleSlides() {
    const start = currentSlide;
    const end = Math.min(start + slidesToShow + 1, currentImages.length); // +1 para preload
    return Array.from(carouselTrack.children).slice(start, end);
  }

  // ===== NAVEGACIÓN DEL CARRUSEL =====

  function goToSlide(index, animated = true) {
    if (isAnimating || index < 0 || index >= totalSlides) return;

    currentSlide = index;
    updateCarouselPosition(animated);
    updateIndicators();
    updateNavigationButtons();
    lazyLoadVisibleImages();
  }

  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }

  function updateCarouselPosition(animated = true) {
    const slideWidth = carouselTrack.children[0]?.offsetWidth || 0;
    const gap = 24; // 1.5rem en px
    const offset = currentSlide * (slideWidth + gap);

    if (animated) {
      isAnimating = true;
      gsap.to(carouselTrack, {
        x: -offset,
        duration: 0.6,
        ease: "power3.out",
        onComplete: () => {
          isAnimating = false;
        },
      });
    } else {
      gsap.set(carouselTrack, { x: -offset });
    }
  }

  function updateIndicators() {
    document.querySelectorAll(".carousel-indicator").forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentSlide);
    });
  }

  function updateNavigationButtons() {
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide >= totalSlides - 1;
  }

  // ===== SISTEMA DE FILTROS =====

  function initFilters() {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        // Update active button
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Filter and regenerate carousel
        const filteredImages = getFilteredImages(filter);

        // Animación de salida
        gsap.to(carouselTrack, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          onComplete: () => {
            generateCarousel(filteredImages);
            // Animación de entrada
            gsap.fromTo(
              carouselTrack,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
          },
        });
      });
    });
  }

  // ===== EFECTOS INTERACTIVOS =====

  function setupSlideEvents(slide, index) {
    const img = slide.querySelector("img");
    const overlay = slide.querySelector(".image-overlay");
    const particles = slide.querySelector(".image-particles");

    // 📱 EFECTOS ADAPTATIVOS SEGÚN DISPOSITIVO
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;

    // Hover effects con GSAP - MÁS SUAVES EN MÓVIL
    slide.addEventListener("mouseenter", () => {
      // En móvil, efectos más sutiles
      const slideY = isMobile ? -8 : -15;
      const slideScale = isMobile ? 1.01 : 1.02;
      const imgScale = isMobile ? 1.05 : isTablet ? 1.08 : 1.15;

      gsap.to(slide, {
        y: slideY,
        scale: slideScale,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(img, {
        scale: imgScale,
        duration: 0.6,
        ease: "power2.out",
      });

      // Solo animar partículas en desktop
      if (!isMobile) {
        animateParticles(particles);
      }
    });

    slide.addEventListener("mouseleave", () => {
      gsap.to(slide, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(img, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    });

    // Click para lightbox
    slide.addEventListener("click", () => {
      openLightbox(index);
    });
  }

  function createParticles(container) {
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--primary-red);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0;
      `;
      container.appendChild(particle);
    }
  }

  function animateParticles(container) {
    const particles = container.querySelectorAll(".particle");

    particles.forEach((particle, index) => {
      gsap.fromTo(
        particle,
        { opacity: 0, y: 0, scale: 1 },
        {
          opacity: 1,
          y: -50,
          scale: 1.5,
          duration: 2,
          delay: index * 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        }
      );
    });
  }

  // ===== TOUCH/SWIPE SUPPORT =====

  function initTouchEvents() {
    const trackContainer = document.querySelector(".carousel-track-container");

    trackContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      trackContainer.classList.add("swiping");
    });

    trackContainer.addEventListener("touchmove", (e) => {
      e.preventDefault(); // Prevent scrolling
    });

    trackContainer.addEventListener("touchend", (e) => {
      trackContainer.classList.remove("swiping");

      if (!touchStartX || !touchStartY) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }

      touchStartX = 0;
      touchStartY = 0;
    });
  }

  // ===== LIGHTBOX (adaptado para carrusel) =====

  function openLightbox(index) {
    const image = currentImages[index];
    if (!image) return;

    const modalImg = lightboxModal.querySelector(".modal-image");
    const modalTitle = lightboxModal.querySelector(".modal-title");
    const currentSpan = lightboxModal.querySelector(".current-image");
    const totalSpan = lightboxModal.querySelector(".total-images");

    modalImg.src = image.src;
    modalTitle.textContent = image.alt;
    currentSpan.textContent = index + 1;
    totalSpan.textContent = currentImages.length;

    // 🔧 CENTRADO PERFECTO Y ZOOM REDUCIDO PARA MÓVIL
    const isMobile = window.innerWidth <= 768;

    // Animación de apertura
    gsap.set(lightboxModal, {
      display: "block",
      // Asegurar centrado perfecto
      justifyContent: "center",
      alignItems: "center",
    });

    gsap.fromTo(
      lightboxModal,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          lightboxModal.classList.add("active");
        },
      }
    );

    // 📱 ZOOM REDUCIDO PARA MÓVIL - MÁS SUTIL
    const startScale = isMobile ? 0.8 : 0.5; // Menos zoom en móvil
    const backEase = isMobile ? "power2.out" : "back.out(1.7)"; // Ease más suave en móvil

    gsap.fromTo(
      modalImg,
      {
        scale: startScale,
        opacity: 0,
        // Centrado perfecto
        x: 0,
        y: 0,
      },
      {
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0,
        duration: isMobile ? 0.4 : 0.6, // Más rápido en móvil
        ease: backEase,
        delay: 0.1, // Delay reducido
      }
    );

    document.body.style.overflow = "hidden";
  }

  // ===== AUTOPLAY =====

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      if (currentSlide >= totalSlides - 1) {
        goToSlide(0);
      } else {
        nextSlide();
      }
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // ===== RESPONSIVE =====

  function handleResize() {
    const newSlidesToShow = getSlidesToShow();
    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow;
      totalSlides = Math.max(0, currentImages.length - slidesToShow + 1);
      currentSlide = Math.min(currentSlide, totalSlides - 1);
      updateCarouselPosition(false);
      updateIndicators();
      updateNavigationButtons();
    }
  }

  // ===== EVENT LISTENERS =====

  function initEventListeners() {
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);

    // Lightbox events
    const closeBtn = lightboxModal?.querySelector(".modal-close");
    const lightboxPrevBtn = lightboxModal?.querySelector(".modal-prev");
    const lightboxNextBtn = lightboxModal?.querySelector(".modal-next");
    const backdrop = lightboxModal?.querySelector(".modal-backdrop");

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (backdrop) backdrop.addEventListener("click", closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener("click", prevLightboxImage);
    if (lightboxNextBtn) lightboxNextBtn.addEventListener("click", nextLightboxImage);

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (lightboxModal?.classList.contains("active")) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") prevLightboxImage();
        if (e.key === "ArrowRight") nextLightboxImage();
      } else {
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "ArrowRight") nextSlide();
      }
    });

    // Pause autoplay on hover
    const carouselContainer = document.querySelector(".carousel-container");
    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", stopAutoplay);
      carouselContainer.addEventListener("mouseleave", startAutoplay);
    }

    // Resize handler
    window.addEventListener("resize", debounce(handleResize, 250));
  }

  // ===== LIGHTBOX NAVIGATION =====

  function closeLightbox() {
    const modalImg = lightboxModal.querySelector(".modal-image");
    const isMobile = window.innerWidth <= 768;

    // 📱 CIERRE MÁS SUAVE EN MÓVIL
    const endScale = isMobile ? 0.8 : 0.5;
    const duration = isMobile ? 0.3 : 0.4;

    gsap.to(modalImg, {
      scale: endScale,
      opacity: 0,
      x: 0, // Mantener centrado
      y: 0, // Mantener centrado
      duration: duration,
      ease: "power2.in",
    });

    gsap.to(lightboxModal, {
      opacity: 0,
      duration: duration,
      ease: "power2.in",
      onComplete: () => {
        lightboxModal.classList.remove("active");
        lightboxModal.style.display = "none";
        document.body.style.overflow = "";
      },
    });
  }

  function nextLightboxImage() {
    const currentIndex =
      parseInt(lightboxModal.querySelector(".current-image").textContent) - 1;
    if (currentIndex < currentImages.length - 1) {
      openLightbox(currentIndex + 1);
    }
  }

  function prevLightboxImage() {
    const currentIndex =
      parseInt(lightboxModal.querySelector(".current-image").textContent) - 1;
    if (currentIndex > 0) {
      openLightbox(currentIndex - 1);
    }
  }

  // ===== INICIALIZACIÓN =====

  function init() {
    // Generar carrusel inicial con todas las imágenes
    generateCarousel(getAllImages());

    // Inicializar componentes
    initFilters();
    initTouchEvents();
    initEventListeners();

    // Iniciar autoplay
    setTimeout(startAutoplay, 2000);

    console.log("🚀 Carrusel dinámico ultra moderno inicializado");
  }

  // Inicializar
  init();
}

// ===== ANIMACIONES LOGO HACHA =====
function initAxeLogoAnimations() {
  // Animación inicial del logo de texto al cargar
  const logoText = document.querySelector(".logo-text");
  const logoLeft = document.querySelector(".logo-left");
  const logoRight = document.querySelector(".logo-right");
  const logoImage = document.querySelector(".logo-image-container");

  if (logoText && logoLeft && logoRight) {
    // Animación de entrada espectacular al cargar la página
    gsap.set([logoLeft, logoRight], {
      opacity: 0,
      y: 20,
      scale: 0.8,
    });

    // Animación secuencial de entrada
    const logoTl = gsap.timeline({ delay: 0.5 });

    logoTl
      .to([logoLeft, logoRight], {
        duration: 0.8,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "back.out(1.7)",
        stagger: 0.1,
      })
      .to(
        logoLeft,
        {
          duration: 0.4,
          x: -4,
          rotation: -1,
          ease: "power2.out",
        },
        "cut"
      )
      .to(
        logoRight,
        {
          duration: 0.4,
          x: 4,
          rotation: 1,
          ease: "power2.out",
        },
        "cut"
      )
      .to(
        [logoLeft, logoRight],
        {
          duration: 0.6,
          x: 0,
          rotation: 0,
          ease: "elastic.out(1, 0.5)",
        },
        "+=0.2"
      );

    // Efecto periódico sutil cada 8 segundos
    gsap.to(logoText, {
      duration: 0.3,
      scale: 1.02,
      repeat: -1,
      yoyo: true,
      repeatDelay: 8,
      ease: "power2.inOut",
    });
  }

  // Animación del logo imagen con entrada espectacular
  if (logoImage) {
    const image = logoImage.querySelector(".logo-main-image");
    const cutEffect = logoImage.querySelector(".axe-cut-effect");

    if (image && cutEffect) {
      // Estado inicial
      gsap.set(image, { scale: 0.8, opacity: 0, rotationY: 20 });
      gsap.set(cutEffect, { scaleY: 0, opacity: 0 });

      // Animación de entrada
      const imageTl = gsap.timeline({ delay: 1.2 });

      imageTl
        .to(image, {
          duration: 1.2,
          scale: 1,
          opacity: 1,
          rotationY: 0,
          ease: "power3.out",
        })
        .to(
          cutEffect,
          {
            duration: 0.6,
            scaleY: 1,
            opacity: 0.8,
            ease: "power2.out",
          },
          "+=0.3"
        )
        .to(
          cutEffect,
          {
            duration: 0.4,
            opacity: 0,
            ease: "power2.in",
          },
          "+=0.1"
        )
        .to(
          image,
          {
            duration: 0.3,
            scale: 1.02,
            ease: "power2.out",
          },
          "<0.1"
        )
        .to(image, {
          duration: 0.5,
          scale: 1,
          ease: "elastic.out(1, 0.3)",
        });
    }
  }

  // Animación especial cada 15 segundos con sonido visual
  setInterval(() => {
    if (logoText && !logoText.matches(":hover")) {
      // Efecto de corte automático sutil
      gsap.to(logoLeft, {
        duration: 0.2,
        x: -6,
        rotation: -1.5,
        ease: "power2.out",
      });

      gsap.to(logoRight, {
        duration: 0.2,
        x: 6,
        rotation: 1.5,
        ease: "power2.out",
      });

      // Volver a posición normal
      gsap.to([logoLeft, logoRight], {
        duration: 0.6,
        x: 0,
        rotation: 0,
        delay: 0.2,
        ease: "elastic.out(1, 0.4)",
      });
    }
  }, 15000);

  console.log("⚔️ Animaciones de logo hacha inicializadas");
}
