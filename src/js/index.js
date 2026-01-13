import { initHeaderActive } from './header-active.js';
initHeaderActive();

import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

window.Swiper = Swiper;

import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

Fancybox.bind('[data-fancybox]', {
});

import mobileNav from './modules/mobile-nav.js';
mobileNav();

import burgerMenu from './modules/burger-menu.js';
burgerMenu();

import langToggle from './modules/lang-toggle.js';
langToggle();

import { initBrief } from './modules/brief.js';
window.briefModule = initBrief();

import { initModals } from './modules/modal.js';
initModals();

import { initPhoneMask } from './modules/phoneMask.js';
initPhoneMask();

import headerScroll from './modules/header-scroll.js';
headerScroll();

import { init3DSlider } from './home/3d-slider.js';
init3DSlider();

import { initTeamSlider } from './home/team-slider.js';
initTeamSlider();

import { initReviewsScroll } from './home/reviews-scroll.js';
initReviewsScroll();

import { initScrollTop } from './blocks/scroll-top.js';
initScrollTop();

import { initProjectsFilters } from './pages/projects-filters.js';
initProjectsFilters();

import { initProjectsDropdown } from './pages/projects-dropdown.js';
initProjectsDropdown();

import { initProjectsLoadMore } from './pages/projects-load-more.js';
initProjectsLoadMore();

import { initProjectsCardClick } from './pages/projects-card-click.js';
initProjectsCardClick();

import { initGameSlider } from './pages/game-slider.js';
initGameSlider();

import { initServicesSlider } from './pages/services-slider.js';
initServicesSlider();

import { initServiceGamesSlider } from './pages/service-games-slider.js';
initServiceGamesSlider();

import { initSelectionParams } from './pages/selection-params.js';
initSelectionParams();
