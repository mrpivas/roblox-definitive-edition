export function initReviewsScroll() {
  const wrapper = document.querySelector('.reviews__wrapper');
  const track = document.querySelector('.reviews__track');
  const prevBtn = document.querySelector('.reviews__nav-btn--prev');
  const nextBtn = document.querySelector('.reviews__nav-btn--next');
  
  if (!wrapper || !track) return;

  // Клонируем карточки для бесконечного скролла
  const cards = track.querySelectorAll('.review-card');
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  // Переменные для автоскролла
  let scrollPosition = 0;
  let animationId = null;
  let isHovered = false;
  let isDragging = false;
  let isNavigationActive = false; // Флаг для отслеживания клика на кнопку навигации
  let navigationTimeout = null; // Таймер для возобновления автопрокрутки
  let startX = 0;
  let scrollLeft = 0;
  let velocity = 0;

  // Скорость автоскролла (пиксели в секунду)
  const autoScrollSpeed = 30;
  
  // Функция для получения ширины карточки с учетом адаптивности
  function getCardWidth() {
    const card = track.querySelector('.review-card');
    if (!card) return 424; // fallback: 411 + 13 gap
    
    const cardRect = card.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(track);
    const gap = parseFloat(computedStyle.gap) || 13;
    
    return cardRect.width + gap;
  }

  // Функция автоскролла
  function autoScroll() {
    if (!isHovered && !isDragging && !isNavigationActive) {
      scrollPosition += autoScrollSpeed / 60; // 60 FPS

      // Получаем ширину одного полного набора карточек
      const trackWidth = track.scrollWidth / 2;

      // Сброс позиции для бесконечного скролла
      if (scrollPosition >= trackWidth) {
        scrollPosition = 0;
      }

      track.style.transform = `translateX(-${scrollPosition}px)`;
    }

    animationId = requestAnimationFrame(autoScroll);
  }

  // Старт автоскролла
  autoScroll();

  // Пауза при наведении
  wrapper.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  wrapper.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // === GRAB SCROLL ===

  function startDrag(e) {
    isDragging = true;
    wrapper.style.cursor = 'grabbing';
    startX = e.pageX || e.touches[0].pageX;
    scrollLeft = scrollPosition;
    velocity = 0;
  }

  function stopDrag() {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.cursor = 'grab';
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX || e.touches[0].pageX;
    const walk = (x - startX) * 2; // Множитель для чувствительности
    const newPosition = scrollLeft - walk;

    // Получаем ширину одного полного набора карточек
    const trackWidth = track.scrollWidth / 2;

    // Зацикливание при ручном скролле
    if (newPosition >= trackWidth) {
      scrollPosition = newPosition - trackWidth;
      scrollLeft = scrollPosition;
      startX = x;
    } else if (newPosition < 0) {
      scrollPosition = trackWidth + newPosition;
      scrollLeft = scrollPosition;
      startX = x;
    } else {
      scrollPosition = newPosition;
    }

    track.style.transform = `translateX(-${scrollPosition}px)`;
    
    // Сохраняем скорость для инерции
    velocity = walk;
  }

  // Mouse events
  wrapper.addEventListener('mousedown', startDrag);
  wrapper.addEventListener('mousemove', drag);
  wrapper.addEventListener('mouseup', stopDrag);
  wrapper.addEventListener('mouseleave', stopDrag);

  // Touch events
  wrapper.addEventListener('touchstart', startDrag, { passive: true });
  wrapper.addEventListener('touchmove', drag, { passive: false });
  wrapper.addEventListener('touchend', stopDrag);

  // Поддержка движения при наведении курсора
  let isCursorHovering = false;
  
  wrapper.addEventListener('mouseenter', () => {
    isCursorHovering = true;
  });
  
  wrapper.addEventListener('mouseleave', () => {
    isCursorHovering = false;
  });
  
  wrapper.addEventListener('mousemove', (e) => {
    if (!isCursorHovering || isDragging) return;
    
    const rect = wrapper.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const containerWidth = rect.width;
    
    // Вычисляем позицию курсора от 0 до 1
    const position = mouseX / containerWidth;
    
    // Получаем ширину одного полного набора карточек
    const trackWidth = track.scrollWidth / 2;
    
    // Преобразуем позицию курсора в позицию скролла
    const targetPosition = position * trackWidth;
    
    // Плавно перемещаемся к целевой позиции
    if (Math.abs(targetPosition - scrollPosition) > 5) {
      scrollPosition = targetPosition;
      
      // Зацикливание
      if (scrollPosition >= trackWidth) {
        scrollPosition = scrollPosition - trackWidth;
      } else if (scrollPosition < 0) {
        scrollPosition = trackWidth + scrollPosition;
      }
      
      track.style.transform = `translateX(-${scrollPosition}px)`;
      track.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        track.style.transition = '';
      }, 300);
    }
  });

  // === NAVIGATION BUTTONS ===
  
  // Функция для остановки автопрокрутки при клике на кнопку
  function pauseAutoScroll() {
    isNavigationActive = true;
    
    // Очищаем предыдущий таймер, если он есть
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
    }
    
    // Возобновляем автопрокрутку через 2 секунды после клика
    navigationTimeout = setTimeout(() => {
      isNavigationActive = false;
    }, 2000);
  }
  
  function scrollToNext() {
    pauseAutoScroll(); // Останавливаем автопрокрутку
    
    const trackWidth = track.scrollWidth / 2;
    const cardWidth = getCardWidth();
    scrollPosition += cardWidth;
    
    // Зацикливание
    if (scrollPosition >= trackWidth) {
      scrollPosition = scrollPosition - trackWidth;
    }
    
    track.style.transform = `translateX(-${scrollPosition}px)`;
    track.style.transition = 'transform 0.5s ease';
    
    setTimeout(() => {
      track.style.transition = '';
    }, 500);
  }
  
  function scrollToPrev() {
    pauseAutoScroll(); // Останавливаем автопрокрутку
    
    const trackWidth = track.scrollWidth / 2;
    const cardWidth = getCardWidth();
    scrollPosition -= cardWidth;
    
    // Зацикливание
    if (scrollPosition < 0) {
      scrollPosition = trackWidth + scrollPosition;
    }
    
    track.style.transform = `translateX(-${scrollPosition}px)`;
    track.style.transition = 'transform 0.5s ease';
    
    setTimeout(() => {
      track.style.transition = '';
    }, 500);
  }
  
  // Обработчики кнопок (только если кнопки существуют - для мобильных)
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollToNext();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollToPrev();
    });
  }

  // Очистка при уничтожении
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
    }
    
    if (nextBtn) {
      nextBtn.removeEventListener('click', scrollToNext);
    }
    
    if (prevBtn) {
      prevBtn.removeEventListener('click', scrollToPrev);
    }
  };
}

