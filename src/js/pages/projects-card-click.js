/**
 * Обработка клика на карточку проекта для перехода на страницу игры
 */
export function initProjectsCardClick() {
  function setupCardClick(card) {
    card.addEventListener('click', (e) => {
      // Если клик на самой кнопке, не обрабатываем (кнопка сама обработает переход)
      if (e.target.closest('.project-card__button')) {
        return;
      }

      // Находим ссылку внутри карточки
      const link = card.querySelector('.project-card__button');
      if (link && link.href) {
        e.preventDefault();
        window.location.href = link.href;
      }
    });
  }

  // Обработка существующих карточек
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(setupCardClick);

  // Для динамически добавленных карточек (через load-more)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.classList && node.classList.contains('project-card')) {
          setupCardClick(node);
        }
      });
    });
  });

  const projectsGrid = document.querySelector('.projects__grid');
  if (projectsGrid) {
    observer.observe(projectsGrid, { childList: true });
  }
}

// Инициализация после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectsCardClick);
} else {
  initProjectsCardClick();
}