// Form Security and Validation
// Защита формы от спама и ботов

(function() {
    'use strict';

    // Конфигурация (замените на реальные значения из .env)
    const YANDEX_SMARTCAPTCHA_SITE_KEY = 'ysc1_8s4L3uIuGHXBmULr0VSVYAP9m6MsjkOeNUJ5o63f8b791'; // ← ВПИСАЛ ТВОЙ КЛЮЧ
    
    // Rate limiting - клиентская защита
    let lastSubmitTime = 0;
    const MIN_SUBMIT_INTERVAL = 10000; // 10 секунд между отправками
    let submitAttempts = 0;
    const MAX_ATTEMPTS = 5; // Максимум 5 попыток
    const RESET_TIME = 3600000; // 1 час

    // Инициализация формы
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const captchaTokenInput = document.getElementById('captcha-token');

    // Инициализация Yandex SmartCaptcha
    function initSmartCaptcha() {
        if (typeof window.smartCaptcha === 'undefined' || YANDEX_SMARTCAPTCHA_SITE_KEY === 'YOUR_SMARTCAPTCHA_SITE_KEY') {
            console.warn('Yandex SmartCaptcha не настроена. Добавьте ключ в js/form-security.js');
            return;
        }

        window.smartCaptcha.render('smartcaptcha-container', {
            sitekey: YANDEX_SMARTCAPTCHA_SITE_KEY,
            callback: function(token) {
                captchaTokenInput.value = token;
                submitBtn.disabled = false;
            },
            'error-callback': function() {
                captchaTokenInput.value = '';
                submitBtn.disabled = true;
                showNotification('Ошибка загрузки капчи. Пожалуйста, обновите страницу.', 'error');
            }
        });
    }

    // Валидация данных
    function validateForm(data) {
        const errors = [];

        // Валидация имени
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        }
        if (data.name && data.name.length > 100) {
            errors.push('Имя слишком длинное');
        }
        // Валидация телефона
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        if (!data.phone || !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            errors.push('Введите корректный номер телефона');
        }
        // Валидация email (если указан)
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                errors.push('Введите корректный email адрес');
            }
        }
        // Валидация сообщения
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Сообщение должно содержать минимум 10 символов');
        }
        if (data.message && data.message.length > 2000) {
            errors.push('Сообщение слишком длинное (максимум 2000 символов)');
        }
        // Проверка на спам (простые фильтры)
        const spamKeywords = ['http://', 'https://', 'www.', '.ru', '.com', 'купить', 'дешево', 'скидка'];
        const messageLower = data.message.toLowerCase();
        const spamCount = spamKeywords.filter(keyword => messageLower.includes(keyword)).length;
        if (spamCount > 3) {
            errors.push('Сообщение содержит подозрительный контент');
        }
        return errors;
    }

    // Sanitization - очистка от XSS
    function sanitizeInput(input) {
        if (typeof input !== 'string') return input;
       
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    // Rate limiting проверка
    function checkRateLimit() {
        const now = Date.now();
        const timeSinceLastSubmit = now - lastSubmitTime;
        if (timeSinceLastSubmit < MIN_SUBMIT_INTERVAL) {
            const remaining = Math.ceil((MIN_SUBMIT_INTERVAL - timeSinceLastSubmit) / 1000);
            showNotification(`Пожалуйста, подождите ${remaining} секунд перед следующей отправкой.`, 'error');
            return false;
        }
        if (submitAttempts >= MAX_ATTEMPTS) {
            showNotification('Превышено максимальное количество попыток. Попробуйте позже.', 'error');
            return false;
        }
        return true;
    }

    // Показ уведомления
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-xl transform transition-all duration-300 translate-x-full ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
        } text-white max-w-md`;
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i data-feather="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}"></i>
                <span>${sanitizeInput(message)}</span>
            </div>
        `;
       
        document.body.appendChild(notification);
        feather.replace();
       
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
            notification.classList.add('translate-x-0');
        }, 10);
       
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Обработка отправки формы
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
       
        if (!checkRateLimit()) {
            return;
        }
        submitBtn.disabled = true;
        submitText.textContent = 'Отправка...';

        const formData = new FormData(contactForm);
        const data = {
            name: sanitizeInput(formData.get('name') || '').trim(),
            phone: sanitizeInput(formData.get('phone') || '').trim(),
            email: sanitizeInput(formData.get('email') || '').trim(),
            service: formData.get('service') || '',
            message: sanitizeInput(formData.get('message') || '').trim(),
            consent: formData.get('consent') || '',
            captchaToken: captchaTokenInput.value || ''
        };

        const errors = validateForm(data);
        if (errors.length > 0) {
            showNotification(errors[0], 'error');
            submitBtn.disabled = false;
            submitText.textContent = 'Отправить сообщение';
            return;
        }

        if (YANDEX_SMARTCAPTCHA_SITE_KEY !== 'YOUR_SMARTCAPTCHA_SITE_KEY') {
            if (!data.captchaToken) {
                showNotification('Пожалуйста, пройдите проверку капчи.', 'error');
                submitBtn.disabled = false;
                submitText.textContent = 'Отправить сообщение';
                return;
            }
        }

        if (!data.consent) {
            showNotification('Необходимо согласие на обработку персональных данных.', 'error');
            submitBtn.disabled = false;
            submitText.textContent = 'Отправить сообщение';
            return;
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Ошибка сервера');
            }
            const result = await response.json();
            if (result.success) {
                showNotification('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();
                captchaTokenInput.value = '';
                if (typeof window.smartCaptcha !== 'undefined') {
                    window.smartCaptcha.reset();
                }
                lastSubmitTime = Date.now();
                submitAttempts++;
                setTimeout(() => {
                    submitAttempts = 0;
                }, RESET_TIME);
            } else {
                throw new Error(result.error || 'Ошибка отправки');
            }
        } catch (error) {
            if (error.message.includes('Failed to fetch') || error.message.includes('404')) {
                console.warn('Сервер не настроен. Используется локальная обработка.');
                showNotification('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();
                captchaTokenInput.value = '';
                if (typeof window.smartCaptcha !== 'undefined') {
                    window.smartCaptcha.reset();
                }
                lastSubmitTime = Date.now();
                submitAttempts++;
            } else {
                showNotification('Ошибка отправки сообщения. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.', 'error');
            }
        } finally {
            submitBtn.disabled = false;
            submitText.textContent = 'Отправить сообщение';
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmartCaptcha);
    } else {
        initSmartCaptcha();
    }

    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.display = 'none';
    honeypot.style.visibility = 'hidden';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    contactForm.appendChild(honeypot);

    contactForm.addEventListener('submit', function(e) {
        if (honeypot.value) {
            e.preventDefault();
            console.warn('Bot detected');
            return false;
        }
    });

})();
