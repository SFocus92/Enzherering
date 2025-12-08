
// Main JavaScript for Engineering Comfort Elite

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Quick Navigation Tabs functionality
    const quickNavTabs = document.querySelectorAll('.quick-nav-tab');
    const sections = document.querySelectorAll('section[id]');
    
    // Highlight active tab on scroll
    function updateActiveTab() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                quickNavTabs.forEach(tab => {
                    tab.classList.remove('active', 'bg-secondary', 'text-white');
                    tab.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
                    
                    if (tab.getAttribute('href') === `#${sectionId}`) {
                        tab.classList.add('active', 'bg-secondary', 'text-white');
                        tab.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveTab);
    
    // Smooth scroll for quick nav tabs
    quickNavTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active tab
                    quickNavTabs.forEach(t => {
                        t.classList.remove('active', 'bg-secondary', 'text-white');
                        t.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
                    });
                    
                    this.classList.add('active', 'bg-secondary', 'text-white');
                    this.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
                }
            }
        });
    });
    // Enhanced Mobile Menu for navbar component
    function enhanceMobileMenu() {
        const mobileMenuButton = document.querySelector('#mobileMenuButton') || 
                                 document.querySelector('custom-navbar')?.shadowRoot?.querySelector('#mobileMenuButton');
        const mobileMenu = document.querySelector('#mobileMenu') || 
                           document.querySelector('custom-navbar')?.shadowRoot?.querySelector('#mobileMenu');
        
        if (mobileMenuButton && mobileMenu) {
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target) && 
                    !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuButton.querySelector('i');
                    if (icon) {
                        icon.setAttribute('data-feather', 'menu');
                        if (typeof feather !== 'undefined') {
                            feather.replace();
                        }
                    }
                }
            });
            
            // Close menu on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuButton.querySelector('i');
                    if (icon) {
                        icon.setAttribute('data-feather', 'menu');
                        if (typeof feather !== 'undefined') {
                            feather.replace();
                        }
                    }
                }
            });
        }
    }
    
    // Call after a short delay to ensure shadow DOM is ready
    setTimeout(enhanceMobileMenu, 500);
    
    // Theme Toggle Functionality - Enhanced
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        // Re-render feather icons after theme change
        if (typeof feather !== 'undefined') {
            setTimeout(() => feather.replace(), 100);
        }
    }
    
    // Initialize theme toggle button - wait for DOM to be ready
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            // Remove any existing listeners
            const newToggle = themeToggle.cloneNode(true);
            themeToggle.parentNode.replaceChild(newToggle, themeToggle);
            
            // Add click listener
            newToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const isDark = document.documentElement.classList.contains('dark');
                applyTheme(isDark ? 'light' : 'dark');
            });
        }
    }
    
    // Check for saved theme preference on load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
    
    // Initialize theme toggle after a short delay to ensure button exists
    setTimeout(initThemeToggle, 100);
    
    // Also try immediately
    initThemeToggle();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Hide quick nav on small screens when scrolling down
    let lastScrollTop = 0;
    const quickNav = document.querySelector('.quick-nav-tab')?.closest('section');
    
    if (quickNav && window.innerWidth < 768) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                quickNav.style.transform = 'translateY(-100%)';
                quickNav.style.opacity = '0';
                quickNav.style.transition = 'transform 0.3s, opacity 0.3s';
            } else {
                // Scrolling up
                quickNav.style.transform = 'translateY(0)';
                quickNav.style.opacity = '1';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    // Improved Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add a subtle animation for elements within the section
                const animatedElements = entry.target.querySelectorAll('.animate-on-scroll');
                animatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animated');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Add animation classes to key elements
    document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const offsetTop = targetElement.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
// Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
    // Simple validation
    if (!data.name || !data.email || !data.message) {
        showNotification('Пожалуйста, заполните все обязательные поля.', 'error', contactForm);
        return;
    }
    
    // Simulate form submission
    showNotification('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.', 'success', contactForm);
this.reset();
            
            // In a real application, you would send the data to a server here
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     showNotification('Message sent successfully!', 'success');
            //     contactForm.reset();
            // })
            // .catch(error => {
            //     showNotification('Error sending message. Please try again.', 'error');
            // });
        });
    }
    
    // Notification System
    function showNotification(message, type = 'info', anchorEl = null) {
        const isDark = document.documentElement.classList.contains('dark');
        const baseColors = {
            success: isDark ? 'bg-green-900/70 text-green-100 border-green-600/60' : 'bg-green-50 text-green-800 border-green-200',
            error: isDark ? 'bg-red-900/70 text-red-100 border-red-600/60' : 'bg-red-50 text-red-800 border-red-200',
            info: isDark ? 'bg-blue-900/70 text-blue-100 border-blue-600/60' : 'bg-blue-50 text-blue-800 border-blue-200'
        };

        // Если передан контекст (например, форма) — показываем уведомление под кнопкой
        if (anchorEl) {
            const form = anchorEl.closest('form') || anchorEl;
            let container = form.parentElement.querySelector('.form-inline-notification');

            if (!container) {
                container = document.createElement('div');
                container.className = 'form-inline-notification';
                form.insertAdjacentElement('afterend', container);
            }

            container.innerHTML = `
                <div class="mt-4 w-full border rounded-xl px-4 py-3 shadow-lg flex items-start gap-3 text-sm font-semibold transition-all duration-300 ${baseColors[type] || baseColors.info}">
                    <span class="mt-0.5">${message}</span>
                </div>
            `;

            // Удаляем уведомление через 6 секунд
            setTimeout(() => {
                if (container.parentElement) {
                    container.remove();
                }
            }, 6000);

            return;
        }

        // Фолбэк: плавающее уведомление
        const notification = document.createElement('div');
        notification.className = `fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-xl transform transition-all duration-300 translate-x-full ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
            notification.classList.add('translate-x-0');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    // Gallery Image Modal
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4';
            modal.innerHTML = `
                <div class="relative max-w-4xl max-h-[90vh]">
                    <img src="${this.src}" alt="${this.alt}" class="w-full h-auto max-h-[90vh] object-contain">
                    <button class="absolute top-4 right-4 text-white hover:text-secondary transition-colors">
                        <i data-feather="x" class="w-8 h-8"></i>
                    </button>
                </div>
            `;
            
            document.body.appendChild(modal);
            feather.replace();
            
            // Close modal
            modal.querySelector('button').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        });
    });
    
    // Lazy Loading Images
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        document.querySelectorAll('img.lazy').forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
    
    // Back to Top Button - Premium Design
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.className = 'back-to-top-btn';
    backToTop.setAttribute('aria-label', 'Вернуться наверх');
    backToTop.innerHTML = '<i data-feather="arrow-up"></i>';
    
    document.body.appendChild(backToTop);
    feather.replace();
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Update button visibility and theme
    function updateBackToTopButton() {
        const isDark = document.documentElement.classList.contains('dark');
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
            if (isDark) {
                backToTop.classList.add('dark-theme');
                backToTop.classList.remove('light-theme');
            } else {
                backToTop.classList.add('light-theme');
                backToTop.classList.remove('dark-theme');
            }
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', updateBackToTopButton);
    
    // Update on theme change
    const themeObserver = new MutationObserver(() => {
        updateBackToTopButton();
    });
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Initial check
    updateBackToTopButton();
    // Service Filtering (for services page)
    const filterButtons = document.querySelectorAll('.service-filter');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (filterButtons.length > 0 && serviceCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('bg-secondary', 'text-white');
                    btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                });
                
                // Add active class to clicked button
                this.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                this.classList.add('bg-secondary', 'text-white');
                
                const filterValue = this.dataset.filter;
                
                // Filter service cards
                serviceCards.forEach(card => {
                    if (filterValue === 'all' || card.dataset.category === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
// Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg';
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.top = `${this.offsetTop - 40}px`;
            tooltip.style.left = `${this.offsetLeft + this.offsetWidth / 2}px`;
            tooltip.style.transform = 'translateX(-50%)';
            
            document.body.appendChild(tooltip);
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                document.body.removeChild(this._tooltip);
                this._tooltip = null;
            }
        });
    });
    
    // Mobile Menu Toggle (for navbar component)
    window.toggleMobileMenu = function() {
        const mobileMenu = document.querySelector('[data-mobile-menu]');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        }
    };
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.querySelector('[data-mobile-menu]');
        const menuButton = document.querySelector('[data-menu-button]');
        
        if (mobileMenu && menuButton && !mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            }
        }
    });
    // Load more gallery items (for gallery page)
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more items
            this.innerHTML = '<div class="loading-spinner"></div>';
            
            setTimeout(() => {
                // In a real application, this would fetch more items from an API
                const newItems = `
                    <div class="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                        <img src="img/gallery/project-1.jpg" alt="Дополнительный проект" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 class="text-xl font-bold mb-2">Новый проект</h3>
                            <p class="text-gray-200">Недавно завершённый монтаж</p>
                        </div>
                    </div>
                `;
                
                const galleryGrid = document.querySelector('.gallery-grid');
                if (galleryGrid) {
                    galleryGrid.insertAdjacentHTML('beforeend', newItems);
                }
                
                this.innerHTML = 'Показать ещё проекты';
                showNotification('Больше проектов успешно загружено!', 'success');
}, 1000);
        });
    }
// Counter Animation (for stats)
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            counter.textContent = target + '+';
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current) + '+';
                        }
                    }, 16);
                    
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    // Tablet and mobile specific adjustments
    function adjustForViewport() {
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth < 768) {
            // Mobile adjustments
            document.body.classList.add('mobile-view');
            document.body.classList.remove('tablet-view', 'desktop-view');
            
            // Reduce animation intensity on mobile
            document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
                el.style.transition = 'transform 0.3s, opacity 0.3s';
            });
        } else if (viewportWidth >= 768 && viewportWidth < 1024) {
            // Tablet adjustments
            document.body.classList.add('tablet-view');
            document.body.classList.remove('mobile-view', 'desktop-view');
        } else {
            // Desktop
            document.body.classList.add('desktop-view');
            document.body.classList.remove('mobile-view', 'tablet-view');
        }
    }
    
    // Run on load and resize
    adjustForViewport();
    window.addEventListener('resize', adjustForViewport);
    
    // Initialize all animations and features
    console.log('Сайт Крым Инженеринг успешно инициализирован!');
    
    // Update active tab on initial load
    setTimeout(updateActiveTab, 100);
});