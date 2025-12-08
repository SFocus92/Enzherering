// Analytics Configuration
// Замените YOUR_GA4_ID и YOUR_YANDEX_ID на реальные ID после регистрации

(function() {
    // Google Analytics 4 (GA4)
    const GA4_ID = 'YOUR_GA4_ID'; // Замените на ваш GA4 Measurement ID (например: G-XXXXXXXXXX)
    
    if (GA4_ID && GA4_ID !== 'YOUR_GA4_ID') {
        // GA4 script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
        document.head.appendChild(script1);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', GA4_ID, {
            'page_path': window.location.pathname + window.location.search,
            'send_page_view': true
        });
        
        // Track page views on navigation
        window.addEventListener('popstate', function() {
            gtag('config', GA4_ID, {
                'page_path': window.location.pathname + window.location.search
            });
        });
    }
    
    // Яндекс.Метрика
    // Замените на реальный ID только после регистрации
    // Или используйте: const YANDEX_ID = process.env.YANDEX_ID || 'YOUR_YANDEX_ID';
    const YANDEX_ID = '105738321'; // Замените на ваш Яндекс.Метрика ID (например: 12345678)
    
    if (YANDEX_ID && YANDEX_ID !== 'YOUR_YANDEX_ID') {
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        
        ym(YANDEX_ID, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            trackHash: true
        });
        
        // Track page views
        ym(YANDEX_ID, "hit", window.location.href);
    }
    
    // Track form submissions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (GA4_ID && GA4_ID !== 'YOUR_GA4_ID') {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form'
                });
            }
            
            if (YANDEX_ID && YANDEX_ID !== 'YOUR_YANDEX_ID') {
                ym(YANDEX_ID, 'reachGoal', 'form_submit');
            }
        });
    }
    
    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            if (GA4_ID && GA4_ID !== 'YOUR_GA4_ID') {
                gtag('event', 'phone_click', {
                    'event_category': 'Contact',
                    'event_label': this.href
                });
            }
            
            if (YANDEX_ID && YANDEX_ID !== 'YOUR_YANDEX_ID') {
                ym(YANDEX_ID, 'reachGoal', 'phone_click');
            }
        });
    });
    
    // Track email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            if (GA4_ID && GA4_ID !== 'YOUR_GA4_ID') {
                gtag('event', 'email_click', {
                    'event_category': 'Contact',
                    'event_label': this.href
                });
            }
            
            if (YANDEX_ID && YANDEX_ID !== 'YOUR_YANDEX_ID') {
                ym(YANDEX_ID, 'reachGoal', 'email_click');
            }
        });
    });
    
    // Track social media clicks
    document.querySelectorAll('a[href*="vk.com"], a[href*="t.me"]').forEach(function(link) {
        link.addEventListener('click', function() {
            const platform = this.href.includes('vk.com') ? 'VKontakte' : 'Telegram';
            
            if (GA4_ID && GA4_ID !== 'YOUR_GA4_ID') {
                gtag('event', 'social_click', {
                    'event_category': 'Social',
                    'event_label': platform
                });
            }
            
            if (YANDEX_ID && YANDEX_ID !== 'YOUR_YANDEX_ID') {
                ym(YANDEX_ID, 'reachGoal', 'social_click_' + platform.toLowerCase());
            }
        });
    });
    
    // Track service card clicks
    document.querySelectorAll('.service-card a, .gallery-item').forEach(function(element) {
        element.addEventListener('click', function() {
            const serviceName = this.closest('.service-card')?.querySelector('h3')?.textContent || 
                              this.closest('.gallery-item')?.querySelector('h3')?.textContent || 'Unknown';
            
            if (GA4_ID && GA4_ID !== 'YOUR_GA4_ID') {
                gtag('event', 'service_view', {
                    'event_category': 'Services',
                    'event_label': serviceName
                });
            }
            
            if (YANDEX_ID && YANDEX_ID !== 'YOUR_YANDEX_ID') {
                ym(YANDEX_ID, 'reachGoal', 'service_view');
            }
        });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track 25%, 50%, 75%, 100% scroll milestones
            if (scrollPercent >= 25 && maxScroll < 50) {
                trackScrollDepth(25);
            } else if (scrollPercent >= 50 && maxScroll < 75) {
                trackScrollDepth(50);
            } else if (scrollPercent >= 75 && maxScroll < 100) {
                trackScrollDepth(75);
            } else if (scrollPercent >= 100) {
                trackScrollDepth(100);
            }
        }
    });
    
    function trackScrollDepth(percent) {
        if (GA4_ID && GA4_ID !== 'YOUR_GA4_ID') {
            gtag('event', 'scroll', {
                'event_category': 'Engagement',
                'event_label': percent + '%'
            });
        }
        
        if (YANDEX_ID && YANDEX_ID !== 'YOUR_YANDEX_ID') {
            ym(YANDEX_ID, 'params', {
                scroll_depth: percent
            });
        }
    }
    
    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        
        if (GA4_ID && GA4_ID !== 'YOUR_GA4_ID') {
            gtag('event', 'time_on_page', {
                'event_category': 'Engagement',
                'value': timeOnPage
            });
        }
        
        if (YANDEX_ID && YANDEX_ID !== 'YOUR_YANDEX_ID') {
            ym(YANDEX_ID, 'params', {
                time_on_page: timeOnPage
            });
        }
    });
})();



