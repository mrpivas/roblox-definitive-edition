/**
 * Управление брифом в модальном окне
 */

export function initBrief() {
  const modal = document.getElementById("briefModal");
  if (!modal) return;

  const slides = modal.querySelectorAll(".modal__slide");
  const startButton = modal.querySelector(".modal__button--start");
  const options = modal.querySelectorAll(".modal__option");
  const textarea = modal.querySelector(".modal__textarea");
  const radioInputs = modal.querySelectorAll(".modal__radio-input");
  const nameInput = modal.querySelector("[data-name-input]");
  const emailInput = modal.querySelector("[data-email-input]");
  const messageInput = modal.querySelector("[data-message-input]");
  const tooltipWrapper = document.getElementById("helpTooltip");
  const tooltip = tooltipWrapper ? tooltipWrapper.querySelector(".modal__tooltip") : null;
  const tooltipOverlay = tooltipWrapper ? tooltipWrapper.querySelector(".modal__tooltip-overlay") : null;
  const tooltipClose = tooltipWrapper ? tooltipWrapper.querySelector(".modal__tooltip-close") : null;

  let currentSlide = 1;
  const selectedOptions = new Set();
  let isDirectMode = false; // Режим прямого открытия на слайде (без прогресса и навигации)

  // Функция для получения текущей активной кнопки "Далее"
  function getCurrentNextButton() {
    const activeSlide = modal.querySelector(`.modal__slide[data-slide="${currentSlide}"]`);
    return activeSlide ? activeSlide.querySelector(".modal__nav-button--next") : null;
  }

  // Функция для получения текущей активной кнопки "Назад"
  function getCurrentBackButton() {
    const activeSlide = modal.querySelector(`.modal__slide[data-slide="${currentSlide}"]`);
    return activeSlide ? activeSlide.querySelector(".modal__nav-button--back") : null;
  }

  // Показать слайд
  function showSlide(slideNumber, directMode = false) {
    isDirectMode = directMode;
    
    // Управляем классом для режима прямого открытия
    if (directMode) {
      modal.classList.add("modal--direct-mode");
    } else {
      modal.classList.remove("modal--direct-mode");
    }

    slides.forEach((slide) => {
      if (parseInt(slide.dataset.slide) === slideNumber) {
        slide.classList.add("modal__slide--active");
      } else {
        slide.classList.remove("modal__slide--active");
      }
    });
    currentSlide = slideNumber;

    // Обновляем состояние кнопки "Далее" при переходе на слайд
    updateNextButton();
  }

  // Обновить состояние кнопки "Далее" или "Отправить"
  function updateNextButton() {
    const activeSlide = modal.querySelector(`.modal__slide[data-slide="${currentSlide}"]`);
    const nextButton = activeSlide ? activeSlide.querySelector(".modal__nav-button--next, .modal__nav-button--submit") : null;
    if (!nextButton) return;

    if (currentSlide === 2) {
      // На слайде 2 проверяем выбранные опции
      nextButton.disabled = selectedOptions.size === 0;
      console.log("Слайд 2: disabled =", nextButton.disabled, "selectedOptions =", selectedOptions.size);
    } else if (currentSlide === 3) {
      // На слайде 3 проверяем textarea
      const textareaValue = textarea ? textarea.value.trim() : "";
      nextButton.disabled = !textarea || textareaValue === "";
      console.log("Слайд 3: disabled =", nextButton.disabled, "textarea value =", textareaValue);
    } else if (currentSlide === 4) {
      // На слайде 4 проверяем radio-опции
      const anyChecked = Array.from(radioInputs).some(radio => radio.checked);
      nextButton.disabled = !anyChecked;
      console.log("Слайд 4: disabled =", nextButton.disabled, "anyChecked =", anyChecked);
    } else if (currentSlide === 5) {
      // На слайде 5 проверяем имя и email
      const nameValue = nameInput ? nameInput.value.trim() : "";
      const emailValue = emailInput ? emailInput.value.trim() : "";
      nextButton.disabled = !nameValue || !emailValue;
      console.log("Слайд 5: disabled =", nextButton.disabled, "name =", nameValue, "email =", emailValue);
    }
  }

  // Кнопка "Начать"
  if (startButton) {
    startButton.addEventListener("click", () => {
      showSlide(2);
    });
  }

  // Обработчики для всех кнопок "Назад", "Далее" и "Отправить"
  slides.forEach((slide) => {
    const backButton = slide.querySelector(".modal__nav-button--back");
    const nextButton = slide.querySelector(".modal__nav-button--next");
    const submitButton = slide.querySelector(".modal__nav-button--submit");

    if (backButton) {
      backButton.addEventListener("click", () => {
        if (currentSlide > 1) {
          showSlide(currentSlide - 1);
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (!nextButton.disabled && currentSlide < slides.length) {
          // Переход к следующему слайду
          showSlide(currentSlide + 1);
        }
      });
    }

    if (submitButton) {
      submitButton.addEventListener("click", () => {
        if (!submitButton.disabled) {
          // Отправка формы
          console.log("Форма отправлена!");
          // TODO: Здесь будет логика отправки данных на сервер
          
          // Переход на слайд завершения
          showSlide(6);
        }
      });
    }
  });

  // Выбор опций
  options.forEach((option) => {
    option.addEventListener("click", () => {
      const optionValue = option.dataset.option;

      if (option.classList.contains("active")) {
        option.classList.remove("active");
        selectedOptions.delete(optionValue);
      } else {
        option.classList.add("active");
        selectedOptions.add(optionValue);
      }

      updateNextButton();
    });
  });

  // Textarea для третьего слайда
  if (textarea) {
    textarea.addEventListener("input", () => {
      console.log("Textarea input:", textarea.value, "Length:", textarea.value.trim().length);
      updateNextButton();
    });
  } else {
    console.warn("Textarea не найдена!");
  }

  // Radio-опции для четвертого слайда
  radioInputs.forEach((radio) => {
    radio.addEventListener("change", () => {
      updateNextButton();
    });
  });

  // Инпуты для пятого слайда
  if (nameInput) {
    nameInput.addEventListener("input", () => {
      updateNextButton();
    });
  }

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      updateNextButton();
    });
  }

  // Сброс при закрытии модалки
  const closeButtons = modal.querySelectorAll("[data-modal-close]");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(() => {
        showSlide(1, false);
        selectedOptions.clear();
        options.forEach((opt) => opt.classList.remove("active"));
        updateNextButton();
        isDirectMode = false;
        modal.classList.remove("modal--direct-mode");
      }, 300);
    });
  });

  // Тултип помощи - обработчики для всех кнопок помощи на всех слайдах
  const helpButtons = modal.querySelectorAll(".modal__help");
  helpButtons.forEach((helpButton) => {
    helpButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (tooltipWrapper) {
        tooltipWrapper.classList.toggle("active");
      }
    });
  });

  if (tooltipClose && tooltipWrapper) {
    tooltipClose.addEventListener("click", (e) => {
      e.stopPropagation();
      tooltipWrapper.classList.remove("active");
    });
  }

  // Закрытие тултипа при клике на overlay
  if (tooltipOverlay && tooltipWrapper) {
    tooltipOverlay.addEventListener("click", () => {
      tooltipWrapper.classList.remove("active");
    });
  }

  // Инициализация
  showSlide(1);
  updateNextButton();

  // Экспортируем функцию для открытия на конкретном слайде
  return {
    openToSlide: function(slideNumber) {
      showSlide(slideNumber, true);
      // Открываем модалку
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      
      // Фокус на первое поле формы
      setTimeout(() => {
        const activeSlide = modal.querySelector(`.modal__slide[data-slide="${slideNumber}"]`);
        if (activeSlide) {
          const firstInput = activeSlide.querySelector('input:not([type="checkbox"]):not([type="radio"])');
          if (firstInput) {
            firstInput.focus();
          }
        }
      }, 100);
    }
  };
}

