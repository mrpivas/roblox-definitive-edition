/**
 * 3D слайдер с эффектом coverflow
 * Логика как в примере Materialize CSS carousel
 */

import Swiper from "swiper/bundle";

export function init3DSlider() {
  const swiperContainer = document.querySelector(".hero-swiper");
  if (!swiperContainer) {
    return;
  }

  // Функция для обновления стилей слайдов
  function updateSlidesStyles(swiper) {
    const slides = swiper.slides;

    slides.forEach((slide) => {
      // Округляем progress до целого для симметрии
      const p = Math.round(slide.progress);

      let rotateZ = 0;
      let scale = 1;
      let opacity = 1;
      let zIndex = 10;

      // Центральная
      if (p === 0) {
        rotateZ = 0;
        scale = 1;
        zIndex = 40;
        opacity = 1;
      }
      // Первая слева
      else if (p === -1) {
        rotateZ = 6;
        scale = 0.95;
        zIndex = 30;
        opacity = 1;
      }
      // Первая справа
      else if (p === 1) {
        rotateZ = -6;
        scale = 0.95;
        zIndex = 30;
        opacity = 1;
      }
      // Вторая слева
      else if (p === -2) {
        rotateZ = 4;
        scale = 0.9;
        zIndex = 20;
        opacity = 1;
      }
      // Вторая справа
      else if (p === 2) {
        rotateZ = -4;
        scale = 0.9;
        zIndex = 20;
        opacity = 1;
      }
      // ВСЁ ОСТАЛЬНОЕ — СКРЫВАЕМ
      else {
        opacity = 0;
        scale = 0.8;
        zIndex = 1;
      }

      slide.style.opacity = opacity;
      slide.style.filter = 'none';
      slide.style.zIndex = zIndex;

      // Удаляем старые rotateZ и scale, добавляем новые
      slide.style.transform =
        slide.style.transform
          .replace(/rotateZ\(.*?\)/g, "")
          .replace(/scale\(.*?\)/g, "") +
        ` rotateZ(${rotateZ}deg) scale(${scale})`;
    });
  }

  const heroSwiper = new Swiper(".hero-swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    spaceBetween: 0,
    speed: 600,
    loop: true,
    watchSlidesProgress: true,
    preloadImages: true,
    updateOnWindowResize: true,

    // Поддержка тачпада и жестов
    simulateTouch: true,
    touchRatio: 1,
    touchAngle: 45,
    
    mousewheel: {
      enabled: true,
      forceToAxis: true,
      sensitivity: 1,
      releaseOnEdges: false,
    },

    coverflowEffect: {
      rotate: 0,
      stretch: 60,
      depth: 200,
      modifier: 1.2,
      slideShadows: false,
    },

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      reverseDirection: true,
    },

    keyboard: {
      enabled: true,
    },

    // Жёстко ограничиваем видимые слайды по нормализованному progress
    // Показываем 5 карточек: 2 слева, центральная, 2 справа
    on: {
      init: function() {
        // Принудительно обновляем стили при инициализации
        this.update();
        setTimeout(() => {
          updateSlidesStyles(this);
        }, 100);
      },
      ready: function() {
        // Обновляем стили когда Swiper готов
        updateSlidesStyles(this);
      },
      setTranslate: function() {
        updateSlidesStyles(this);
      },
      slideChangeTransitionEnd: function() {
        // Обновляем стили после завершения перехода
        updateSlidesStyles(this);
      },
    },

    breakpoints: {
      320: {
        coverflowEffect: {
          rotate: 0,
          stretch: 40,
          depth: 150,
          modifier: 1,
        },
      },
      768: {
        coverflowEffect: {
          rotate: 0,
          stretch: 50,
          depth: 180,
          modifier: 1.1,
        },
      },
      1024: {
        coverflowEffect: {
          rotate: 0,
          stretch: 60,
          depth: 200,
          modifier: 1.2,
        },
      },
    },
  });

  // Принудительно обновляем стили после полной инициализации
  setTimeout(() => {
    heroSwiper.update();
    updateSlidesStyles(heroSwiper);
  }, 200);

  return heroSwiper;
}
