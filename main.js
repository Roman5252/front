/**
 * main.js - Основной JavaScript файл проекта
 * Содержит функционал для модального окна и формы обратной связи
 */

// ===== МОДАЛЬНОЕ ОКНО И ФОРМА ОБРАТНОЙ СВЯЗИ =====

// Элементы модального окна
const contactDialog = document.getElementById('contactDialog');
const openDialogBtn = document.getElementById('openDialog');
const closeDialogBtn = document.getElementById('closeDialog');
const contactForm = document.getElementById('contactForm');

// Переменная для хранения последнего активного элемента
let lastActiveElement = null;

/**
 * Открывает модальное окно
 */
function openModal() {
    // Сохраняем текущий активный элемент
    lastActiveElement = document.activeElement;
    
    // Показываем модальное окно
    contactDialog.showModal();
    
    // Ставим фокус на первое поле формы
    const firstInput = contactDialog.querySelector('input, select, textarea, button');
    if (firstInput) {
        firstInput.focus();
    }
    
    console.log('Модальное окно открыто');
}

/**
 * Закрывает модальное окно
 */
function closeModal() {
    contactDialog.close('cancel');
    console.log('Модальное окно закрыто');
}

/**
 * Сбрасывает все кастомные сообщения об ошибках
 */
function resetCustomValidity() {
    const formElements = contactForm.elements;
    for (let element of formElements) {
        if (typeof element.setCustomValidity === 'function') {
            element.setCustomValidity('');
        }
        element.removeAttribute('aria-invalid');
    }
}

/**
 * Форматирует номер телефона в российском формате
 */
function formatPhoneNumber(input) {
    // Удаляем все нецифровые символы, кроме плюса в начале
    let digits = input.value.replace(/\D/g, '');
    
    // Ограничиваем длину 11 цифрами (без +7)
    digits = digits.slice(0, 11);
    
    // Заменяем 8 на 7 в начале (российский формат)
    if (digits.startsWith('8')) {
        digits = '7' + digits.slice(1);
    }
    
    // Форматируем номер
    let formatted = '+7';
    if (digits.length > 1) {
        formatted += ` (${digits.slice(1, 4)}`;
    }
    if (digits.length >= 5) {
        formatted += `) ${digits.slice(4, 7)}`;
    }
    if (digits.length >= 8) {
        formatted += `-${digits.slice(7, 9)}`;
    }
    if (digits.length >= 10) {
        formatted += `-${digits.slice(9, 11)}`;
    }
    
    input.value = formatted;
}

/**
 * Валидирует форму и показывает ошибки
 */
function validateForm(event) {
    event.preventDefault();
    
    // Сбрасываем предыдущие ошибки
    resetCustomValidity();
    
    // Проверяем валидность формы
    if (!contactForm.checkValidity()) {
        // Показываем системные сообщения об ошибках
        contactForm.reportValidity();
        
        // Добавляем ARIA-атрибуты для невалидных полей
        const formElements = contactForm.elements;
        for (let element of formElements) {
            if (element.willValidate && !element.checkValidity()) {
                element.setAttribute('aria-invalid', 'true');
                
                // Кастомные сообщения для определенных типов ошибок
                if (element.validity.typeMismatch && element.type === 'email') {
                    element.setCustomValidity('Пожалуйста, введите корректный email адрес');
                } else if (element.validity.patternMismatch && element.id === 'phone') {
                    element.setCustomValidity('Введите телефон в формате: +7 (900) 000-00-00');
                }
            }
        }
        
        console.log('Форма содержит ошибки');
        return;
    }
    
    // Если форма валидна - обрабатываем отправку
    handleFormSubmit();
}

/**
 * Обрабатывает успешную отправку формы
 */
function handleFormSubmit() {
    // В реальном проекте здесь был бы AJAX-запрос на сервер
    console.log('Форма успешно отправлена!', {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        topic: document.getElementById('topic').value,
        message: document.getElementById('message').value
    });
    
    // Показываем сообщение об успехе
    alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
    
    // Закрываем модальное окно
    contactDialog.close('success');
    
    // Сбрасываем форму
    contactForm.reset();
    
    console.log('Форма обработана успешно');
}

/**
 * Обрабатывает закрытие модального окна
 */
function handleDialogClose() {
    // Возвращаем фокус на элемент, который был активен до открытия модалки
    if (lastActiveElement) {
        lastActiveElement.focus();
    }
    
    // Сбрасываем форму при закрытии
    contactForm.reset();
    resetCustomValidity();
}

// ===== ИНИЦИАЛИЗАЦИЯ =====

/**
 * Инициализирует весь функционал после загрузки DOM
 */
function init() {
    console.log('Инициализация приложения...');
    
    // Инициализация модального окна
    if (openDialogBtn && contactDialog) {
        // Открытие модалки
        openDialogBtn.addEventListener('click', openModal);
        
        // Закрытие модалки по кнопке
        if (closeDialogBtn) {
            closeDialogBtn.addEventListener('click', closeModal);
        }
        
        // Закрытие модалки по клику на фон (для нативных dialog)
        contactDialog.addEventListener('click', (event) => {
            if (event.target === contactDialog) {
                closeModal();
            }
        });
        
        // Обработка закрытия модалки
        contactDialog.addEventListener('close', handleDialogClose);
    }
    
    // Инициализация формы
    if (contactForm) {
        contactForm.addEventListener('submit', validateForm);
    }
    
    // Инициализация маски телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        // Валидация при потере фокуса
        phoneInput.addEventListener('blur', function() {
            if (this.value && !this.checkValidity()) {
                this.setCustomValidity('Введите телефон в формате: +7 (900) 000-00-00');
                this.setAttribute('aria-invalid', 'true');
                this.reportValidity();
            }
        });
    }
    
    console.log('Приложение инициализировано');
}

// Запуск инициализации когда DOM полностью загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

/**
 * Показывает уведомление (можно использовать для показа сообщений)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    const backgroundColor = type === 'error' ? '#dc3545' : 
                           type === 'success' ? '#28a745' : '#17a2b8';
    notification.style.backgroundColor = backgroundColor;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Экспорт функций для глобального использования (если нужно)
window.App = {
    showNotification,
    openModal,
    closeModal
};