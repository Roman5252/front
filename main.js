/**
 * main.js - Основной JavaScript файл проекта
 * Содержит функционал для модального окна, формы обратной связи и улучшения UX
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
                } else if (element.validity.valueMissing) {
                    element.setCustomValidity('Это поле обязательно для заполнения');
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
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        topic: document.getElementById('topic').value,
        message: document.getElementById('message').value
    };
    
    console.log('Форма успешно отправлена!', formData);
    
    // Показываем сообщение об успехе
    showNotification('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.', 'success');
    
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

// ===== УЛУЧШЕНИЯ UX =====

/**
 * Показывает уведомление
 */
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Базовые стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    
    // Цвета в зависимости от типа
    const backgroundColor = type === 'error' ? '#dc3545' : 
                           type === 'success' ? '#28a745' : '#17a2b8';
    notification.style.backgroundColor = backgroundColor;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

/**
 * Обновляет активное состояние навигации
 */
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        if ((currentPage === 'index.html' && linkHref === 'index.html') ||
            (currentPage === 'about.html' && linkHref === 'about.html') ||
            (currentPage === 'contacts.html' && linkHref === 'contacts.html')) {
            link.classList.add('active');
        }
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====

/**
 * Инициализирует весь функционал после загрузки DOM
 */
function init() {
    console.log('Инициализация приложения...');
    
    // Обновляем активную навигацию
    updateActiveNav();
    
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
    
    // Добавляем стили для уведомлений
    const notificationStyles = `
        .notification {
            font-family: var(--font-family-base);
        }
        
        .services-grid,
        .portfolio-grid,
        .team-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--space-6);
            margin: var(--space-6) 0;
        }
        
        .service-card,
        .portfolio-item,
        .team-member {
            background: var(--color-white);
            padding: var(--space-6);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow);
            border-left: 4px solid var(--color-primary);
        }
        
        .social-link {
            color: var(--color-primary);
            text-decoration: none;
            margin: 0 var(--space-2);
        }
        
        .social-link:hover {
            text-decoration: underline;
        }
        
        .map-placeholder {
            background: var(--color-light);
            padding: var(--space-16);
            text-align: center;
            border-radius: var(--border-radius-lg);
            border: 2px dashed #dee2e6;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
    
    console.log('Приложение инициализировано');
}

// Запуск инициализации когда DOM полностью загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Экспорт функций для глобального использования
window.App = {
    showNotification,
    openModal,
    closeModal,
    updateActiveNav
};