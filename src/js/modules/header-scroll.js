/**
 * Модуль управления появлением header при прокрутке
 * Header появляется только после прокрутки на 200px на ПК и планшете
 */
function headerScroll() {
	const header = document.querySelector('.header');
	
	if (!header) return;
	
	const SCROLL_THRESHOLD = 200; // Порог прокрутки в пикселях
	const MOBILE_BREAKPOINT = 768; // Граница мобильных устройств
	
	let isHeaderVisible = false;
	let lastScrollTop = 0;
	
	/**
	 * Проверяет, является ли устройство мобильным
	 */
	function isMobile() {
		return window.innerWidth <= MOBILE_BREAKPOINT;
	}
	
	/**
	 * Управляет видимостью header
	 */
	function handleScroll() {
		// На мобильных устройствах header всегда виден
		if (isMobile()) {
			header.classList.remove('header--hidden');
			header.classList.add('header--visible');
			isHeaderVisible = true;
			return;
		}
		
		const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
		
		// Показываем header после прокрутки на 200px
		if (currentScroll > SCROLL_THRESHOLD) {
			if (!isHeaderVisible) {
				header.classList.remove('header--hidden');
				header.classList.add('header--visible');
				isHeaderVisible = true;
			}
		} else {
			// Скрываем header если прокрутка меньше 200px
			if (isHeaderVisible) {
				header.classList.remove('header--visible');
				header.classList.add('header--hidden');
				isHeaderVisible = false;
			}
		}
		
		lastScrollTop = currentScroll;
	}
	
	/**
	 * Обработчик изменения размера окна
	 */
	function handleResize() {
		handleScroll();
	}
	
	// Инициализация - скрываем header на ПК/планшете при загрузке
	if (!isMobile()) {
		header.classList.add('header--hidden');
	} else {
		header.classList.add('header--visible');
		isHeaderVisible = true;
	}
	
	// Слушатели событий
	let scrollTimer;
	window.addEventListener('scroll', function() {
		if (scrollTimer) {
			window.cancelAnimationFrame(scrollTimer);
		}
		
		scrollTimer = window.requestAnimationFrame(function() {
			handleScroll();
		});
	});
	
	window.addEventListener('resize', handleResize);
	
	// Проверяем при загрузке страницы
	handleScroll();
}

export default headerScroll;

