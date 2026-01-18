/**
 * Модуль анимации цифр как в слот-машине (odometer-style)
 * Анимирует числа при появлении в зоне видимости с эффектом вертикальной прокрутки
 */

export function initCounterAnimation() {
  // Парсим текст и получаем число с форматированием
  function parseText(text) {
    const cleaned = text.replace(/\s/g, '');
    
    // Извлекаем суффикс
    let suffix = '';
    const suffixMatch = cleaned.match(/(тыс|млн|млрд|k|m|b)/i);
    if (suffixMatch) {
      suffix = suffixMatch[0];
    }
    
    // Извлекаем число (включая запятую/точку)
    const numberMatch = cleaned.match(/[\d,\.]+/);
    const numberStr = numberMatch ? numberMatch[0] : '0';
    
    return {
      numberStr,
      suffix,
      hasComma: numberStr.includes(','),
      decimalPlaces: numberStr.includes(',') || numberStr.includes('.') ? 1 : 0
    };
  }
  
  // Создаем HTML структуру для прокрутки цифр
  function createRollingDigits(element, originalText) {
    const parsed = parseText(originalText);
    const numberStr = parsed.numberStr.replace(',', '.');
    const targetNumber = parseFloat(numberStr);
    
    // Форматируем число с правильным количеством знаков
    const formatted = targetNumber.toFixed(parsed.decimalPlaces);
    const displayStr = parsed.hasComma ? formatted.replace('.', ',') : formatted;
    
    // Создаем контейнер для цифр
    element.innerHTML = '';
    element.classList.add('counter-rolling');
    
    // Разбиваем на отдельные символы
    const chars = displayStr.split('');
    
    chars.forEach((char, index) => {
      if (char === ',' || char === '.') {
        // Для разделителей просто добавляем span
        const separator = document.createElement('span');
        separator.className = 'counter-separator';
        separator.textContent = char;
        element.appendChild(separator);
      } else if (!isNaN(char)) {
        // Для цифр создаем прокручивающийся элемент
        const digitWrapper = document.createElement('span');
        digitWrapper.className = 'counter-digit-wrapper';
        
        const digitRoller = document.createElement('span');
        digitRoller.className = 'counter-digit-roller';
        digitRoller.setAttribute('data-target', char);
        
        // Создаем колонку цифр от 0 до target
        const targetDigit = parseInt(char);
        for (let i = 0; i <= 9; i++) {
          const digitSpan = document.createElement('span');
          digitSpan.className = 'counter-digit';
          digitSpan.textContent = i;
          digitRoller.appendChild(digitSpan);
        }
        
        digitWrapper.appendChild(digitRoller);
        element.appendChild(digitWrapper);
      }
    });
    
    // Добавляем суффикс
    if (parsed.suffix) {
      const suffixSpan = document.createElement('span');
      suffixSpan.className = 'counter-suffix';
      suffixSpan.textContent = ' ' + parsed.suffix;
      element.appendChild(suffixSpan);
    }
    
    return displayStr;
  }
  
  // Анимация прокрутки цифр
  function animateRolling(element, duration = 2000) {
    const rollers = element.querySelectorAll('.counter-digit-roller');
    
    rollers.forEach((roller, index) => {
      const targetDigit = parseInt(roller.getAttribute('data-target'));
      const digitHeight = roller.querySelector('.counter-digit').offsetHeight;
      
      // Добавляем случайную задержку для каждой цифры
      const delay = index * 100;
      
      setTimeout(() => {
        // Прокручиваем цифры с эффектом
        const finalPosition = -targetDigit * digitHeight;
        roller.style.transform = `translateY(${finalPosition}px)`;
        roller.style.transition = `transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
      }, delay);
    });
  }
  
  // Ищем все элементы со статистикой
  const statNumbers = document.querySelectorAll(
    '.hero__stat-number, .about__stat-number, .game-info__stat-value, .service-page-hero__stat-number'
  );
  
  if (statNumbers.length === 0) return;
  
  // Подготавливаем элементы
  statNumbers.forEach(element => {
    const originalText = element.textContent.trim();
    element.setAttribute('data-original-text', originalText);
    
    // Создаем структуру для прокрутки
    createRollingDigits(element, originalText);
  });
  
  // Intersection Observer для запуска анимации
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
        entry.target.setAttribute('data-animated', 'true');
        
        // Запускаем анимацию прокрутки
        const delay = Array.from(statNumbers).indexOf(entry.target) * 150;
        setTimeout(() => {
          animateRolling(entry.target, 2000);
        }, delay);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Наблюдаем за всеми числами
  statNumbers.forEach(element => {
    observer.observe(element);
  });
}
