export function initHeaderActive() {
  const navLinks = document.querySelectorAll('.nav__link');
  
  if (!navLinks.length) {
    return;
  }

  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;

  navLinks.forEach(link => {
    link.classList.remove('active');
  });

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('data-page');
    const linkHref = link.getAttribute('href');

    if (linkHref && linkHref.includes('.html')) {
      // Для ссылок на другие страницы (services.html, projects.html)
      if (linkHref.includes(currentPage) && !linkHref.includes('#')) {
        link.classList.add('active');
      }
    } else if (linkHref && linkHref.startsWith('#')) {
      // Для ссылок только с hash (старый формат)
      if (currentPage === 'index.html' || currentPage === '') {
        if (currentHash && currentHash === linkHref) {
          link.classList.add('active');
        }
      }
    }
    // Для ссылок вида ./index.html#about активное состояние устанавливается только через scroll
  });

  if (currentPage === 'index.html' || currentPage === '') {
    updateActiveOnScroll(navLinks);
  }
}

function updateActiveOnScroll(navLinks) {
  const sections = [];
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Извлекаем ID секции из ссылок вида #about или ./index.html#about
      const hashIndex = href.indexOf('#');
      if (hashIndex !== -1) {
        const sectionId = href.substring(hashIndex + 1);
        const section = document.getElementById(sectionId);
        if (section) {
          sections.push({ link, section });
        }
      }
    }
  });

  if (!sections.length) return;

  // Получаем высоту header для offset (если header фиксированный)
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;
  const offset = headerHeight + 100; // Добавляем отступ для лучшей видимости

  function checkActiveSection() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Если страница в самом верху, не устанавливаем активное состояние
    if (scrollTop < 50) {
      sections.forEach(({ link }) => {
        link.classList.remove('active');
      });
      return;
    }

    const viewportTop = scrollTop + offset; // Верхняя граница с учетом offset
    const viewportCenter = scrollTop + windowHeight / 2; // Центр области просмотра
    const viewportBottom = scrollTop + windowHeight; // Нижняя граница

    let activeSection = null;
    let minDistance = Infinity;

    sections.forEach(({ section }) => {
      const rect = section.getBoundingClientRect();
      // rect.top - это позиция относительно viewport, нужно добавить scrollTop
      const sectionTop = scrollTop + rect.top;
      const sectionBottom = sectionTop + rect.height;
      const sectionCenter = sectionTop + rect.height / 2;

      // Секция должна быть видна в области просмотра
      // Проверяем, что секция пересекается с видимой областью
      const isInViewport = (
        sectionTop < viewportBottom &&
        sectionBottom > viewportTop
      );

      // Дополнительная проверка: секция должна быть достаточно близко к верхней части
      // видимой области (с учетом offset) или к центру
      const isNearTop = sectionTop <= viewportTop + 200 && sectionBottom >= viewportTop;
      const isNearCenter = sectionTop <= viewportCenter && sectionBottom >= viewportCenter;

      if (isInViewport && (isNearTop || isNearCenter)) {
        // Выбираем секцию, которая ближе всего к верхней части видимой области
        const distance = Math.abs(sectionTop - viewportTop);
        if (distance < minDistance) {
          minDistance = distance;
          activeSection = section;
        }
      }
    });

    // Устанавливаем активное состояние только если секция действительно видна
    sections.forEach(({ link, section }) => {
      if (section === activeSection && activeSection !== null) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', checkActiveSection, { passive: true });
  
  // Проверяем активную секцию при загрузке только если:
  // 1. Есть hash в URL (пользователь перешел по прямой ссылке)
  // 2. Страница уже прокручена (не в самом верху)
  if (window.location.hash) {
    // Если есть hash, проверяем после небольшой задержки
    setTimeout(() => {
      checkActiveSection();
    }, 100);
  } else if (window.scrollY > 50) {
    // Если страница прокручена, проверяем
    setTimeout(() => {
      checkActiveSection();
    }, 100);
  } else {
    // Если страница вверху и нет hash, снимаем все активные состояния
    sections.forEach(({ link }) => {
      link.classList.remove('active');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderActive);
} else {
  initHeaderActive();
}

