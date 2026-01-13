/**
 * Навигация для слайдера услуг
 */
export function initServicesSlider() {
  const wrapper = document.querySelector('.services-catalog__grid');
  const prevBtns = document.querySelectorAll('.services-catalog__nav-btn--prev');
  const nextBtns = document.querySelectorAll('.services-catalog__nav-btn--next');

  if (!wrapper || prevBtns.length === 0 || nextBtns.length === 0) {
    console.log('Services slider elements not found, skipping initialization.');
    return;
  }

  console.log('Initializing services slider.');

  function getCardWidth() {
    const card = wrapper.querySelector('.service-card');
    if (!card) return 0;
    const style = getComputedStyle(wrapper);
    const gap = parseInt(style.gap) || 40;
    return card.offsetWidth + gap;
  }

  function scrollToNext() {
    const cardWidth = getCardWidth();
    wrapper.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    });
  }

  function scrollToPrev() {
    const cardWidth = getCardWidth();
    wrapper.scrollBy({
      left: -cardWidth,
      behavior: 'smooth'
    });
  }

  // Привязываем обработчики ко всем кнопкам (desktop и mobile)
  nextBtns.forEach(btn => btn.addEventListener('click', scrollToNext));
  prevBtns.forEach(btn => btn.addEventListener('click', scrollToPrev));

  // Drag scroll
  let isDown = false;
  let startX;
  let scrollLeft;
  let hasDragged = false;

  wrapper.addEventListener('mousedown', (e) => {
    // Проверяем, что клик не на кнопке навигации
    if (e.target.closest('.services-catalog__nav-btn')) {
      return;
    }
    
    isDown = true;
    hasDragged = false;
    wrapper.style.cursor = 'grabbing';
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });

  wrapper.addEventListener('mouseleave', () => {
    isDown = false;
    hasDragged = false;
    wrapper.style.cursor = 'grab';
  });

  wrapper.addEventListener('mouseup', () => {
    isDown = false;
    wrapper.style.cursor = 'grab';
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 2;
    
    // Если движение больше 5px, считаем это перетаскиванием
    if (Math.abs(walk) > 5) {
      hasDragged = true;
      e.preventDefault();
      wrapper.scrollLeft = scrollLeft - walk;
    }
  });

  // Клик по карточке для перехода
  wrapper.addEventListener('click', (e) => {
    // Если был drag, не переходим по ссылке
    if (hasDragged) {
      return;
    }
    
    // Если клик на кнопке навигации, не обрабатываем
    if (e.target.closest('.services-catalog__nav-btn')) {
      return;
    }
    
    // Находим карточку, на которую кликнули
    const card = e.target.closest('.service-card');
    if (!card) return;
    
    // Находим ссылку внутри карточки
    const link = card.querySelector('.service-card__button');
    if (link && link.href) {
      // Если клик не на самой ссылке, переходим программно
      if (!e.target.closest('.service-card__button')) {
        e.preventDefault();
        window.location.href = link.href;
      }
    }
  });

  wrapper.style.cursor = 'grab';
}

