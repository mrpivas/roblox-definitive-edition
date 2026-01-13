function langToggle() {
	const langBtn = document.querySelector('.nav__lang');
	
	if (!langBtn) return;
	
	langBtn.addEventListener('click', function(e) {
		e.preventDefault();
		const currentLang = this.dataset.lang;
		
		if (currentLang === 'eng') {
			this.textContent = 'rus';
			this.dataset.lang = 'rus';
		} else {
			this.textContent = 'eng';
			this.dataset.lang = 'eng';
		}
	});
}

export default langToggle;
// v1.0

