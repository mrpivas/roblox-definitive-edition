/**
 * Функционал кнопки "Наверх"
 */
export function initScrollTop() {
  const scrollTopBtn = document.querySelector(".footer__scroll-top");

  if (!scrollTopBtn) return;

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

