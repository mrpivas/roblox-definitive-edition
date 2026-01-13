/**
 * Навигация для слайдера на странице игры + drag-scroll
 */
export function initGameSlider() {
  const prevBtn = document.querySelector('.game-about__nav--prev');
  const nextBtn = document.querySelector('.game-about__nav--next');
  const track = document.querySelector('.game-about__slider-track');
  const slider = document.querySelector('.game-about__slider');

  if (!prevBtn || !nextBtn || !track || !slider) {
    console.log('Game slider elements not found, skipping initialization.');
    return;
  }

  console.log('Initializing game slider navigation and drag-scroll.');

  let isPaused = false;
  let isDragging = false;
  let isNavigationActive = false;
  let navigationTimeout = null;
  let startX = 0;
  let scrollLeft = 0;
  let currentPosition = 0; // Текущая позиция слайдера
  let animationStartPosition = 0; // Позиция, с которой началась анимация

  // Функция для получения ширины одного слайда с учетом gap
  function getSlideWidth() {
    const slide = track.querySelector('.game-about__slide');
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

  // Функция для сброса позиции при достижении границ (бесконечный цикл)
  function resetPositionIfNeeded() {
    const slideWidth = getSlideWidth();
    const totalWidth = slideWidth * 3; // 3 слайда в анимации
    
    // Нормализуем позицию в диапазоне от -totalWidth до 0
    // (анимация движется влево, поэтому позиции отрицательные)
    if (currentPosition > 0) {
      // Если позиция стала положительной, сбрасываем в начало цикла
      currentPosition = currentPosition - totalWidth;
    } else if (Math.abs(currentPosition) >= totalWidth) {
      // Если позиция вышла за границы влево, сбрасываем
      currentPosition = currentPosition % totalWidth;
      if (currentPosition < -totalWidth) {
        currentPosition = currentPosition + totalWidth;
      }
    }
  }
  
  // Функция для нормализации позиции в допустимый диапазон
  function normalizePosition() {
    const slideWidth = getSlideWidth();
    const totalWidth = slideWidth * 3;
    
    // Нормализуем в диапазон [-totalWidth, 0]
    while (currentPosition > 0) {
      currentPosition -= totalWidth;
    }
    while (currentPosition <= -totalWidth) {
      currentPosition += totalWidth;
    }
  }

  // Функция для паузы анимации
  function pauseAnimation() {
    // Сохраняем текущую позицию перед паузой
    currentPosition = getCurrentPosition();
    animationStartPosition = currentPosition;
    
    track.style.animationPlayState = 'paused';
    isPaused = true;
  }

  // Функция для полной остановки анимации (отключает CSS анимацию)
  function stopAnimation() {
    currentPosition = getCurrentPosition();
    track.style.animation = 'none';
    track.style.animationPlayState = 'paused';
    isPaused = true;
  }

  // Функция для возобновления анимации
  function resumeAnimation() {
    if (!isDragging && !isNavigationActive) {
      // Сбрасываем позицию перед возобновлением анимации
      resetPositionIfNeeded();
      
      // Восстанавливаем CSS анимацию с правильной позиции
      track.style.transform = '';
      track.style.animation = '';
      // Принудительно перезапускаем анимацию
      void track.offsetWidth; // Trigger reflow
      track.style.animationPlayState = 'running';
      isPaused = false;
    }
  }
  
  // Функция для остановки анимации при клике на кнопку навигации
  function pauseAnimationForNavigation() {
    isNavigationActive = true;
    stopAnimation(); // Полностью останавливаем анимацию
    
    // НЕ возобновляем анимацию автоматически после клика
    // Анимация возобновится только при наведении мыши или после drag
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
    }
    
    // Сбрасываем флаг через некоторое время, но НЕ возобновляем анимацию
    navigationTimeout = setTimeout(() => {
      isNavigationActive = false;
    }, 500); // Уменьшаем время до 500ms
  }

  // Остановка при наведении мыши
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

  // Клик на "Предыдущий" (движение вправо - позиция становится менее отрицательной)
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

  // Клик на "Следующий" (движение влево - позиция становится более отрицательной)
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

  // Drag-scroll функционал
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    stopAnimation(); // Полностью останавливаем анимацию при drag
    startX = e.pageX;
    
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
}

// Инициализация после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initGameSlider, 0);
  });
} else {
  setTimeout(initGameSlider, 0);
}

