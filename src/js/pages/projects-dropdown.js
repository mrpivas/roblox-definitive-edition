export function initProjectsDropdown() {
  setTimeout(() => {
    const dropdown = document.querySelector('.projects__dropdown');
    
    if (!dropdown) {
      return;
    }

    const toggle = dropdown.querySelector('.projects__dropdown-toggle');
    const dropdownText = dropdown.querySelector('.projects__dropdown-text');
    const dropdownItems = dropdown.querySelectorAll('.projects__dropdown-item');

    if (!toggle) {
      return;
    }

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = dropdown.classList.contains('active');
      
      dropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    dropdownItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        dropdownItems.forEach((i) => i.classList.remove('projects__dropdown-item--active'));
        
        item.classList.add('projects__dropdown-item--active');
        
        const filterText = item.textContent.trim();
        dropdownText.textContent = filterText;
        
        const category = item.getAttribute('data-filter');
        
        dropdown.classList.remove('active');
        
        filterProjects(category);
        
        syncDesktopFilters(category);
      });
    });
  }, 100);
}

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

function syncDesktopFilters(category) {
  const desktopFilters = document.querySelectorAll('.projects__filters-wrapper--desktop .projects__filter');
  
  desktopFilters.forEach((filter) => {
    const filterCategory = filter.getAttribute('data-filter');
    
    if (filterCategory === category) {
      filter.classList.add('projects__filter--active');
    } else {
      filter.classList.remove('projects__filter--active');
    }
  });
}

