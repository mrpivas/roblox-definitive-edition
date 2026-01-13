/**
 * Модуль управления модальными окнами
 */

export class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    if (!this.modal) {
      console.error(`Модальное окно с id="${modalId}" не найдено`);
      return;
    }

    this.body = document.body;
    this.closeButtons = this.modal.querySelectorAll("[data-modal-close]");
    this.isOpen = false;

    this.init();
  }

  init() {
    // Закрытие по клику на кнопки закрытия
    this.closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => this.close());
    });

    // Закрытие по Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    // Предотвращение закрытия при клике на контент
    const content = this.modal.querySelector(".modal__content");
    if (content) {
      content.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
  }

  open() {
    this.modal.classList.add("is-open");
    this.modal.setAttribute("aria-hidden", "false");
    this.body.classList.add("modal-open");
    this.isOpen = true;

    // Фокус на первое поле формы
    setTimeout(() => {
      const firstInput = this.modal.querySelector(
        'input:not([type="checkbox"])'
      );
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  close() {
    this.modal.classList.remove("is-open");
    this.modal.setAttribute("aria-hidden", "true");
    this.body.classList.remove("modal-open");
    this.isOpen = false;

    // Сброс формы при закрытии
    const form = this.modal.querySelector("form");
    if (form) {
      form.reset();
    }
  }
}

/**
 * Обработчик формы заявки в блоке
 */
function initRequestForm() {
  const form = document.getElementById("requestFormBlock");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Валидация полей
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Получаем данные формы
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      agreement: formData.get("agreement") === "on",
    };

    console.log("Отправка формы (блок):", data);

    // Здесь будет отправка на сервер
    // try {
    //   const response = await fetch('/api/request', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    //   });
    //   if (response.ok) {
    //     alert('Заявка отправлена успешно!');
    //     form.reset();
    //   }
    // } catch (error) {
    //   console.error('Ошибка отправки:', error);
    // }

    // Временная заглушка
    alert(
      `Заявка отправлена успешно!\n\nИмя: ${data.name}\nТелефон: ${data.phone}\nEmail: ${data.email}`
    );
    form.reset();
  });
}

/**
 * Инициализация модальных окон
 */
export function initModals() {
  // Создаем экземпляр модального окна заявки
  const requestModal = new Modal("requestModal");

  // Создаем экземпляр модального окна брифа
  const briefModal = new Modal("briefModal");

  // Создаем экземпляр модального окна результата подбора
  const selectionResultModal = new Modal("selectionResultModal");

  // Находим все кнопки, которые открывают модальное окно заявки
  const openButtons = document.querySelectorAll(
    '[data-modal-open="requestModal"]'
  );

  openButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      requestModal.open();
    });
  });

  // Находим все кнопки, которые открывают модальное окно брифа
  const briefOpenButtons = document.querySelectorAll(
    '[data-modal-open="briefModal"]'
  );

  briefOpenButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const directSlide = btn.getAttribute("data-brief-direct");
      if (directSlide) {
        // Открываем бриф на конкретном слайде (режим прямого доступа)
        if (window.briefModule && window.briefModule.openToSlide) {
          window.briefModule.openToSlide(parseInt(directSlide));
        } else {
          // Если функция еще не инициализирована, открываем обычным способом
          briefModal.open();
          // И пытаемся перейти на слайд после небольшой задержки
          setTimeout(() => {
            if (window.briefModule && window.briefModule.openToSlide) {
              window.briefModule.openToSlide(parseInt(directSlide));
            }
          }, 100);
        }
      } else {
        briefModal.open();
      }
    });
  });

  // Находим все кнопки, которые открывают модальное окно результата подбора
  const selectionResultButtons = document.querySelectorAll(
    '[data-modal-open="selectionResultModal"]'
  );

  selectionResultButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Проверяем, не отключена ли кнопка (валидация из selection-params.js)
      if (btn.disabled || btn.classList.contains('disabled')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      e.preventDefault();
      selectionResultModal.open();
    });
  });

  // Обработка отправки формы
  const form = document.getElementById("requestForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const phoneInput = document.getElementById("phone");

      // Валидация телефона через intl-tel-input
      if (phoneInput && phoneInput.itiInstance) {
        if (!phoneInput.itiInstance.isValidNumber()) {
          phoneInput.classList.add("error");
          phoneInput.focus();
          return;
        }
      }

      // Валидация остальных полей
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Получаем данные формы
      const formData = new FormData(form);

      // Получаем полный международный номер телефона
      const fullPhoneNumber = phoneInput.itiInstance
        ? phoneInput.itiInstance.getNumber()
        : formData.get("phone");

      const data = {
        name: formData.get("name"),
        phone: fullPhoneNumber, // Полный международный номер
        email: formData.get("email"),
        agreement: formData.get("agreement") === "on",
      };

      console.log("Отправка формы:", data);

      // Здесь будет отправка на сервер
      // try {
      //   const response = await fetch('/api/request', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(data),
      //   });
      //   if (response.ok) {
      //     alert('Заявка отправлена успешно!');
      //     requestModal.close();
      //   }
      // } catch (error) {
      //   console.error('Ошибка отправки:', error);
      // }

      // Временная заглушка
      alert(
        `Заявка отправлена успешно!\n\nИмя: ${data.name}\nТелефон: ${data.phone}\nEmail: ${data.email}`
      );
      requestModal.close();
    });
  }

  // Инициализация формы в блоке
  initRequestForm();
}
