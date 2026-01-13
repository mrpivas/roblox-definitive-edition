export function initProjectsFilters() {
  const filtersContainer = document.querySelector('.projects__filters');
  
  if (!filtersContainer) return;

  const filterButtons = filtersContainer.querySelectorAll('.projects__filter');

  function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        
        setTimeout(() => {
          card.style.opacity = '1';
        }, 10);
      } else {
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove('projects__filter--active');
      });

      button.classList.add('projects__filter--active');

      const category = button.getAttribute('data-filter');

      filterProjects(category);

      syncMobileDropdown(category);
    });
  });

  filterProjects('all');

  function syncMobileDropdown(category) {
    const dropdownItems = document.querySelectorAll('.projects__dropdown-item');
    const dropdownText = document.querySelector('.projects__dropdown-text');
    
    dropdownItems.forEach((item) => {
      const itemCategory = item.getAttribute('data-filter');
      
      if (itemCategory === category) {
        item.classList.add('projects__dropdown-item--active');
        if (dropdownText) {
          dropdownText.textContent = item.textContent.trim();
        }
      } else {
        item.classList.remove('projects__dropdown-item--active');
      }
    });
  }
}
