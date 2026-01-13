export function initProjectsLoadMore() {
  const loadMoreBtn = document.querySelector('.projects__load-more');
  const projectsGrid = document.querySelector('.projects__grid');

  if (!loadMoreBtn || !projectsGrid) return;

  let currentPage = 1;
  let isLoading = false;
  let currentFilter = 'all';

  function getCurrentFilter() {
    const activeFilter = document.querySelector('.projects__filter--active');
    return activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
  }

  const filterButtons = document.querySelectorAll('.projects__filter');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = getCurrentFilter();
      currentPage = 1;
    });
  });

  function createProjectCard(project) {
    const article = document.createElement('article');
    article.className = 'project-card';
    article.setAttribute('data-category', project.category);
    article.style.display = 'none';

    article.innerHTML = `
      <img
        src="${project.image}"
        alt="${project.name}"
        class="project-card__image"
        loading="lazy"
      />
      <div class="project-card__overlay"></div>
      <a href="${project.link}" class="project-card__button">
        <span class="project-card__name">${project.name}</span>
        <span class="project-card__icon">
          <img src="./img/svgicons/projects/arrow.svg" alt="Arrow" />
        </span>
      </a>
    `;

    return article;
  }

  async function loadMoreProjects() {
    if (isLoading) return;

    isLoading = true;
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Загрузка...';

    try {
      const response = await fetch('./data/projects.json');
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }

      const data = await response.json();
      let projects = data.projects;

      if (currentFilter !== 'all') {
        projects = projects.filter(
          (project) => project.category === currentFilter
        );
      }

      if (projects.length === 0) {
        loadMoreBtn.textContent = 'Больше нет проектов';
        loadMoreBtn.disabled = true;
        return;
      }

      projects.forEach((project, index) => {
        const card = createProjectCard(project);
        projectsGrid.appendChild(card);

        setTimeout(() => {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          }, 10);
        }, index * 50);
      });

      currentPage++;
      loadMoreBtn.textContent = 'Загрузить ещё';

      if (currentPage > 2) {
        loadMoreBtn.style.display = 'none';
      }
    } catch (error) {
      console.error('Ошибка при загрузке проектов:', error);
      loadMoreBtn.textContent = 'Ошибка загрузки';
      setTimeout(() => {
        loadMoreBtn.textContent = 'Загрузить ещё';
        loadMoreBtn.disabled = false;
      }, 2000);
    } finally {
      isLoading = false;
      loadMoreBtn.disabled = false;
    }
  }

  loadMoreBtn.addEventListener('click', loadMoreProjects);
}

