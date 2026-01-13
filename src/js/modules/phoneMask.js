/**
 * Модуль международного телефонного инпута с флагами
 * Использует библиотеку intl-tel-input
 */

import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";

export function initPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach((input) => {
    // Пропускаем поля телефона внутри блока request
    if (input.closest(".request")) {
      return;
    }

    const iti = intlTelInput(input, {
      // Начальная страна
      initialCountry: "ru",

      // Предпочитаемые страны (появятся вверху списка)
      preferredCountries: ["ru", "by", "kz", "ua"],

      // Разделить код страны от номера
      separateDialCode: true,

      // Автоматическое форматирование при вводе
      formatOnDisplay: true,

      // Строгий режим - автоформатирование при вводе
      strictMode: false,

      // Национальный режим (код страны не вводится в поле)
      nationalMode: true,

      // Поиск по странам
      countrySearch: true,

      // Только эти страны (можно раскомментировать)
      // onlyCountries: ['ru', 'by', 'kz', 'ua'],

      // Путь к utils.js для валидации и форматирования
      utilsScript:
        "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.5/build/js/utils.js",

      // Плейсхолдер с маской (aggressive - показывает полный формат)
      autoPlaceholder: "aggressive",

      // Dropdown будет вставляться в body (по умолчанию)
      useFullscreenPopup: false,
    });

    // Сохраняем экземпляр в data-атрибуте для доступа из других модулей
    input.itiInstance = iti;

    // Функция форматирования российского номера: (000) 000-00-00
    function formatRussianPhone(value) {
      // Убираем все нецифровые символы
      const digits = value.replace(/\D/g, "");

      // Форматируем в зависимости от количества цифр
      if (digits.length === 0) return "";
      if (digits.length <= 3) return `(${digits}`;
      if (digits.length <= 6)
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      if (digits.length <= 8)
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
          6
        )}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        8
      )}-${digits.slice(8, 10)}`;
    }

    // Обновление placeholder для России
    function updatePlaceholder() {
      const countryData = iti.getSelectedCountryData();
      if (countryData.iso2 === "ru") {
        input.placeholder = "(000) 000-00-00";
      }
    }

    // Обновляем placeholder при смене страны
    input.addEventListener("countrychange", function() {
      updatePlaceholder();
    });

    // Устанавливаем начальный placeholder
    updatePlaceholder();

    // Валидация на blur
    input.addEventListener("blur", function() {
      if (input.value.trim()) {
        if (iti.isValidNumber()) {
          input.classList.remove("error");
          input.classList.add("valid");
        } else {
          input.classList.add("error");
          input.classList.remove("valid");
        }
      }
    });

    // Запрет ввода букв - только цифры
    input.addEventListener("keypress", function(e) {
      const char = String.fromCharCode(e.which);
      // Разрешаем только цифры
      if (!/[0-9]/.test(char)) {
        e.preventDefault();
      }
    });

    // Запрет вставки нецифровых символов
    input.addEventListener("paste", function(e) {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData(
        "text"
      );
      // Извлекаем только цифры
      const digitsOnly = pastedText.replace(/\D/g, "");
      if (digitsOnly) {
        // Вставляем только цифры
        document.execCommand("insertText", false, digitsOnly);
      }
    });

    // Форматирование при вводе и сброс валидации
    input.addEventListener("input", function(e) {
      input.classList.remove("error", "valid");

      // Применяем маску только для России
      const countryData = iti.getSelectedCountryData();
      if (countryData.iso2 === "ru") {
        const cursorPos = input.selectionStart;
        const oldValue = input.value;
        const oldLength = oldValue.length;

        // Применяем форматирование
        const formatted = formatRussianPhone(oldValue);

        if (formatted !== oldValue) {
          input.value = formatted;

          // Корректируем позицию курсора
          const newLength = formatted.length;
          let newCursorPos = cursorPos + (newLength - oldLength);

          // Если курсор попал на спец символ, сдвигаем его вправо
          if (
            formatted[newCursorPos - 1] &&
            /[\(\)\s\-]/.test(formatted[newCursorPos - 1])
          ) {
            newCursorPos++;
          }

          input.setSelectionRange(newCursorPos, newCursorPos);
        }
      }
    });
  });
}

/**
 * Получить полный международный номер телефона
 */
export function getPhoneNumber(input) {
  if (input.itiInstance) {
    return input.itiInstance.getNumber();
  }
  return input.value;
}
