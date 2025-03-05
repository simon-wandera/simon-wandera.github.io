/**
 * Interactive Enhancements for Project November
 * Handles mobile responsiveness and interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== Preloader =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Both load event and timeout for reliable preloader hiding
        const hidePreloader = () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        };
        
        window.addEventListener('load', hidePreloader);
        
        // Fallback timeout (slightly longer for slower connections)
        setTimeout(hidePreloader, 3500);
    }

    // ===== Dark Mode Toggle - Updated with Modern Icons =====
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Use user preference with media query as fallback
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // Apply theme immediately to avoid flash of wrong theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme === 'dark');
        
        // Toggle theme on button click with enhanced animation
        themeToggle.addEventListener('click', function() {
            // Add animation class
            themeToggle.classList.add('theme-toggle-active');
            
            // Remove animation class after transition completes
            setTimeout(() => {
                themeToggle.classList.remove('theme-toggle-active');
            }, 700);
            
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(!isDark);
            
            // Update theme-color meta tag for browser UI
            const metaThemeColor = document.getElementById('theme-color-meta');
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#1c1c1c' : '#1a5c38');
            }
            
            // Announce theme change for screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.classList.add('sr-only');
            announcement.textContent = `Theme changed to ${newTheme} mode`;
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 3000);
        });
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Only change theme automatically if user hasn't explicitly set preference
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                updateThemeIcon(e.matches);
                
                // Update theme-color meta tag
                const metaThemeColor = document.getElementById('theme-color-meta');
                if (metaThemeColor) {
                    metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#1c1c1c' : '#1a5c38');
                }
            }
        });
    }
    
    // Update theme toggle icon with modern icons
    function updateThemeIcon(isDark) {
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.className = ''; // Clear existing classes
            icon.classList.add('fas', 'fa-sun');
            themeToggle.setAttribute('title', 'Switch to light mode');
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = ''; // Clear existing classes
            icon.classList.add('fas', 'fa-moon');
            themeToggle.setAttribute('title', 'Switch to dark mode');
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    // Add theme toggle animation styles
    const themeToggleStyle = document.createElement('style');
    themeToggleStyle.textContent = `
        .theme-toggle-active i {
            animation: spin 0.7s ease-in-out;
        }
        
        @keyframes spin {
            0% { transform: rotate(0); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(themeToggleStyle);

    // ===== Font Size Toggle =====
    const fontSizeToggle = document.getElementById('font-size-toggle');
    if (fontSizeToggle) {
        // Check for saved font size preference
        const savedFontSize = localStorage.getItem('fontSize') || 'normal';
        
        // Apply saved font size
        document.documentElement.setAttribute('data-font-size', savedFontSize);
        
        // Toggle font size on button click
        fontSizeToggle.addEventListener('click', function() {
            const currentSize = document.documentElement.getAttribute('data-font-size');
            const newSize = currentSize === 'large' ? 'normal' : 'large';
            
            document.documentElement.setAttribute('data-font-size', newSize);
            localStorage.setItem('fontSize', newSize);
        });
    }

    // ===== Back To Top Button =====
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== Mobile Navigation Improvements =====
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const body = document.body;
    
    if (burger && nav) {
        // Create overlay if it doesn't exist
        let navOverlay = document.querySelector('.nav-overlay');
        if (!navOverlay) {
            navOverlay = document.createElement('div');
            navOverlay.className = 'nav-overlay';
            body.appendChild(navOverlay);
        }
        
        // Toggle menu on burger click
        burger.addEventListener('click', function() {
            const isExpanded = nav.classList.contains('nav-active');
            
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            body.classList.toggle('menu-open');
            navOverlay.classList.toggle('active');
            
            // Update ARIA attributes
            burger.setAttribute('aria-expanded', !isExpanded);
            
            // Animate links only when opening
            if (!isExpanded) {
                document.querySelectorAll('.nav-links li').forEach((link, index) => {
                    // Clear any existing animation
                    link.style.animation = '';
                    // Trigger reflow
                    void link.offsetWidth;
                    // Add new animation
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                });
            }
            
            // Set focus to first menu item when opening
            if (!isExpanded && document.querySelectorAll('.nav-links a').length > 0) {
                setTimeout(() => {
                    document.querySelector('.nav-links a').focus();
                }, 100);
            }
        });
        
        // Close menu when clicking overlay
        navOverlay.addEventListener('click', closeMenu);
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('nav-active')) {
                closeMenu();
            }
        });
        
        // Close menu function
        function closeMenu() {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            body.classList.remove('menu-open');
            navOverlay.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            
            // Reset animations
            document.querySelectorAll('.nav-links li').forEach(link => {
                link.style.animation = '';
            });
            
            // Return focus to burger
            burger.focus();
        }
    }

    // ===== Lazy Loading Images - Improved with Error Handling =====
    const lazyImages = document.querySelectorAll('img:not(.member-img):not(.lightbox-content)');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('src');
                    
                    // Don't proceed if image has already been processed
                    if (img.classList.contains('lazy-processed')) return;
                    img.classList.add('lazy-processed');
                    
                    // Create placeholder with dimensions matching the original image
                    const placeholderHeight = img.height || 200; 
                    const placeholder = document.createElement('div');
                    placeholder.className = 'image-placeholder';
                    placeholder.style.height = `${placeholderHeight}px`;
                    placeholder.style.width = '100%';
                    
                    // Create new image that will replace original
                    const newImg = new Image();
                    newImg.src = src;
                    newImg.className = img.className + ' lazy-load';
                    newImg.alt = img.alt;
                    
                    // Handle success case
                    newImg.onload = function() {
                        // Replace original with loaded image
                        img.parentNode.replaceChild(newImg, img);
                        
                        // Add loaded class after a short delay for transition
                        setTimeout(() => {
                            newImg.classList.add('lazy-loaded');
                        }, 10);
                    };
                    
                    // Handle error case
                    newImg.onerror = function() {
                        console.warn(`Failed to load image: ${src}`);
                        // Keep original image visible in case of error
                        img.style.opacity = '1';
                        if (placeholder.parentNode) {
                            placeholder.parentNode.removeChild(placeholder);
                        }
                    };
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px'
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without intersection observer
        lazyImages.forEach(img => {
            img.style.opacity = '1';
        });
    }

    // ===== Cookie Consent =====
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const declineCookiesBtn = document.getElementById('decline-cookies');
    
    if (cookieConsent) {
        // Check if user has already made a choice
        const cookieChoice = localStorage.getItem('cookieConsent');
        
        if (!cookieChoice) {
            // Show cookie consent after a delay
            setTimeout(() => {
                cookieConsent.classList.add('active');
            }, 2000);
            
            // Accept cookies
            acceptCookiesBtn.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'accepted');
                cookieConsent.classList.remove('active');
                enableCookies(true);
            });
            
            // Decline cookies
            declineCookiesBtn.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'declined');
                cookieConsent.classList.remove('active');
                enableCookies(false);
            });
        } else {
            // Apply saved preference
            enableCookies(cookieChoice === 'accepted');
        }
    }
    
    function enableCookies(enabled) {
        // This function would handle cookie enablement based on user choice
        console.log('Cookies ' + (enabled ? 'enabled' : 'disabled'));
    }

    // ===== Share Modal Improvements =====
    const shareModal = document.getElementById('share-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const shareBtns = document.querySelectorAll('.share-btn');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const shareUrlInput = document.getElementById('share-url');
    
    // Open share modal
    window.openShareModal = function(sectionId) {
        if (!shareModal) return;
        
        // Get current URL with section hash
        const url = window.location.href.split('#')[0] + '#' + sectionId;
        
        // Set URL to share
        if (shareUrlInput) {
            shareUrlInput.value = url;
        }
        
        // Show modal
        shareModal.classList.add('active');
    };
    
    // Close share modal
    if (closeModalBtn && shareModal) {
        closeModalBtn.addEventListener('click', function() {
            shareModal.classList.remove('active');
        });
        
        // Close when clicking outside content
        shareModal.addEventListener('click', function(event) {
            if (event.target === shareModal) {
                shareModal.classList.remove('active');
            }
        });
    }
    
    // Handle share buttons
    shareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const url = shareUrlInput ? encodeURIComponent(shareUrlInput.value) : encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${title}&body=${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    // Copy link functionality
    if (copyLinkBtn && shareUrlInput) {
        copyLinkBtn.addEventListener('click', function() {
            shareUrlInput.select();
            document.execCommand('copy');
            
            // Visual feedback
            const originalIcon = copyLinkBtn.innerHTML;
            copyLinkBtn.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyLinkBtn.innerHTML = originalIcon;
            }, 1500);
        });
    }

    // ===== Handle keyboard navigation =====
    document.addEventListener('keydown', function(e) {
        // Close modals with ESC key
        if (e.key === 'Escape') {
            if (shareModal && shareModal.classList.contains('active')) {
                shareModal.classList.remove('active');
            }
            
            // Close mobile nav if open
            if (nav && nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                body.classList.remove('menu-open');
                document.querySelector('.nav-overlay').classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // ===== Keyboard accessibility for clickable elements =====
    const keyboardAccessibleElements = document.querySelectorAll('[role="button"], .team-member, .research-card, .filter-btn');
    
    keyboardAccessibleElements.forEach(el => {
        if (!el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
        }
        
        el.addEventListener('keydown', function(e) {
            // Activate on Enter or Space
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });

    // ===== Focus trap for modals =====
    function setupFocusTrap(modal) {
        if (!modal) return;
        
        modal.addEventListener('keydown', function(e) {
            if (!modal.classList.contains('active')) return;
            
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                // If going backwards with shift+tab and on first element, go to last element
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
                
                // If going forward with tab and on last element, go to first element
                else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
    
    setupFocusTrap(shareModal);

    // Helper function for handling Enter key on keyboard navigable elements
    document.querySelectorAll('[role="button"], button, [tabindex="0"]').forEach(el => {
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add screen reader only styles
    const srStyles = document.createElement('style');
    srStyles.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
    `;
    document.head.appendChild(srStyles);
});
