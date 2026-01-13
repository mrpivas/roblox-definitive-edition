/**
 * Drag-scroll для слайдера service-games
 */
export function initServiceGamesSlider() {
  const slider = document.querySelector('.service-games__slider');
  const track = document.querySelector('.service-games__slider-track');
  const prevBtn = document.querySelector('.service-games__nav--prev');
  const nextBtn = document.querySelector('.service-games__nav--next');

  if (!slider || !track) {
    return;
  }

  let isDragging = false;
  let isNavigationActive = false;
  let navigationTimeout = null;
  let startX = 0;
  let scrollLeft = 0;
  let currentPosition = 0; // Текущая позиция слайдера

  // Функция для получения ширины одного слайда с учетом gap
  function getSlideWidth() {
    const slide = track.querySelector('.service-games__slide');
    if (!slide) return 620; // fallback
    
    const slideRect = slide.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(track);
    const gap = parseFloat(computedStyle.gap) || 20;
    
    return slideRect.width + gap;
  }

  // Функция для получения текущей позиции из transform
  function getCurrentPosition() {
    const transform = getComputedStyle(track).transform;
    if (transform === 'none') return 0;
    
    const matrix = new DOMMatrix(transform);
    return matrix.m41;
  }

  // Функция для нормализации позиции в допустимый диапазон
  function normalizePosition() {
    const slideWidth = getSlideWidth();
    const totalWidth = slideWidth * 3; // 3 слайда в анимации
    
    // Нормализуем в диапазон [-totalWidth, 0]
    while (currentPosition > 0) {
      currentPosition -= totalWidth;
    }
    while (currentPosition <= -totalWidth) {
      currentPosition += totalWidth;
    }
  }

  // Функция для полной остановки анимации (отключает CSS анимацию)
  function stopAnimation() {
    currentPosition = getCurrentPosition();
    track.style.animation = 'none';
    track.style.animationPlayState = 'paused';
  }

  // Функция для паузы анимации
  function pauseAnimation() {
    currentPosition = getCurrentPosition();
    track.style.animationPlayState = 'paused';
  }

  // Функция для возобновления анимации
  function resumeAnimation() {
    if (!isDragging && !isNavigationActive) {
      // Нормализуем позицию перед возобновлением анимации
      normalizePosition();
      
      // Восстанавливаем CSS анимацию
      track.style.transform = '';
      track.style.animation = '';
      void track.offsetWidth; // Trigger reflow
      track.style.animationPlayState = 'running';
    }
  }

  // Остановка при наведении
  slider.addEventListener('mouseenter', () => {
    if (!isNavigationActive) {
      pauseAnimation();
    }
  });

  slider.addEventListener('mouseleave', () => {
    if (!isDragging && !isNavigationActive) {
      // Возобновляем анимацию только если не было клика на кнопку
      resumeAnimation();
    }
  });

  // Drag-scroll функционал
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    stopAnimation(); // Полностью останавливаем анимацию при drag
    startX = e.pageX;
    slider.style.cursor = 'grabbing';
    
    currentPosition = getCurrentPosition();
    scrollLeft = currentPosition;
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX;
    const walk = (x - startX) * 2;
    
    currentPosition = scrollLeft + walk;
    
    track.style.animation = 'none';
    track.style.transition = 'none'; // Убираем transition при перетаскивании
    track.style.transform = `translateX(${currentPosition}px)`;
  });

  slider.addEventListener('mouseup', () => {
    if (!isDragging) return;
    
    isDragging = false;
    slider.style.cursor = 'grab';
    
    // Сохраняем текущую позицию
    currentPosition = getCurrentPosition();
    
    // Нормализуем позицию в допустимый диапазон
    normalizePosition();
    
    // Применяем нормализованную позицию
    track.style.transform = `translateX(${currentPosition}px)`;
    
    setTimeout(() => {
      track.style.transition = '';
      track.style.animation = '';
      resumeAnimation();
    }, 100);
  });

  slider.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      slider.style.cursor = 'grab';
      
      // Сохраняем текущую позицию
      currentPosition = getCurrentPosition();
      
      // Нормализуем позицию в допустимый диапазон
      normalizePosition();
      
      // Применяем нормализованную позицию
      track.style.transform = `translateX(${currentPosition}px)`;
      
      setTimeout(() => {
        track.style.transition = '';
        track.style.animation = '';
        resumeAnimation();
      }, 100);
    }
  });

  // Touch events для мобильных
  let touchStartX = 0;
  let touchScrollLeft = 0;

  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    stopAnimation(); // Полностью останавливаем анимацию при touch
    touchStartX = e.touches[0].pageX;
    
    currentPosition = getCurrentPosition();
    touchScrollLeft = currentPosition;
  }, { passive: true });

  slider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const x = e.touches[0].pageX;
    const walk = (x - touchStartX) * 2;
    
    currentPosition = touchScrollLeft + walk;
    
    track.style.animation = 'none';
    track.style.transition = 'none';
    track.style.transform = `translateX(${currentPosition}px)`;
  }, { passive: false });

  slider.addEventListener('touchend', () => {
    if (!isDragging) return;
    
    isDragging = false;
    
    // Сохраняем текущую позицию
    currentPosition = getCurrentPosition();
    
    // Нормализуем позицию в допустимый диапазон
    normalizePosition();
    
    // Применяем нормализованную позицию
    track.style.transform = `translateX(${currentPosition}px)`;
    
    setTimeout(() => {
      track.style.transition = '';
      track.style.animation = '';
      resumeAnimation();
    }, 100);
  });

  // === NAVIGATION BUTTONS ===
  
  // Обработка кнопок навигации (если они есть)
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Предотвращаем множественные клики
      if (isNavigationActive) return;
      
      // Полностью останавливаем CSS анимацию
      stopAnimation();
      isNavigationActive = true;
      
      const slideWidth = getSlideWidth();
      currentPosition = getCurrentPosition();
      
      // Сдвигаем вправо (уменьшаем отрицательное значение или увеличиваем положительное)
      currentPosition += slideWidth;
      
      // Нормализуем позицию в допустимый диапазон
      normalizePosition();
      
      // Применяем плавную анимацию через transition
      track.style.transition = 'transform 0.5s ease';
      track.style.transform = `translateX(${currentPosition}px)`;
      
      // После завершения анимации убираем transition и сбрасываем флаг
      setTimeout(() => {
        track.style.transition = '';
        isNavigationActive = false;
      }, 500);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Предотвращаем множественные клики
      if (isNavigationActive) return;
      
      // Полностью останавливаем CSS анимацию
      stopAnimation();
      isNavigationActive = true;
      
      const slideWidth = getSlideWidth();
      currentPosition = getCurrentPosition();
      
      // Сдвигаем влево (увеличиваем отрицательное значение)
      currentPosition -= slideWidth;
      
      // Нормализуем позицию в допустимый диапазон
      normalizePosition();
      
      // Применяем плавную анимацию через transition
      track.style.transition = 'transform 0.5s ease';
      track.style.transform = `translateX(${currentPosition}px)`;
      
      // После завершения анимации убираем transition и сбрасываем флаг
      setTimeout(() => {
        track.style.transition = '';
        isNavigationActive = false;
      }, 500);
    });
  }
}

// Инициализация после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initServiceGamesSlider, 0);
  });
} else {
  setTimeout(initServiceGamesSlider, 0);
}