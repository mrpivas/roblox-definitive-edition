function burgerMenu() {
	const burger = document.querySelector('.header__menu-toggle');
	const overlay = document.querySelector('.mobile-menu-overlay');
	const body = document.body;
	
	if (!burger) return;
	
	burger.addEventListener('click', function() {
		body.classList.toggle('menu-open');
		
		const isExpanded = body.classList.contains('menu-open');
		burger.setAttribute('aria-expanded', isExpanded);
	});
	
	if (overlay) {
		overlay.addEventListener('click', function() {
			body.classList.remove('menu-open');
		});
	}
	
	const mobileLinks = document.querySelectorAll('.mobile-menu__link');
	mobileLinks.forEach(link => {
		link.addEventListener('click', function() {
			body.classList.remove('menu-open');
		});
	});
	
	window.addEventListener('resize', function() {
		if (window.innerWidth > 768) {
			body.classList.remove('menu-open');
		}
	});
}

export default burgerMenu;

