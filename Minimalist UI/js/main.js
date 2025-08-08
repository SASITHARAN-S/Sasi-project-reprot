/**
 * Main JavaScript functionality for EcoLearn website
 * Handles navigation, smooth scrolling, interactive elements, and accessibility
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize all components
    initializeNavigation();
    initializeSmoothScrolling();
    initializeAccordions();
    initializeAnimations();
    initializeAccessibility();
    initializeProgressiveLoading();
    
    console.log('EcoLearn website initialized successfully');
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.querySelector('.search-container');
    const header = document.querySelector('.header');
    
    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Trap focus in mobile menu when open
            if (!isExpanded) {
                trapFocus(navMenu);
            }
        });
        
        // Close mobile menu when clicking nav links
        navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                searchContainer.classList.remove('active');
            }
        });
    }
    
    // Search functionality toggle for mobile
    if (searchInput && searchContainer) {
        const searchButton = document.getElementById('search-button');
        
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (window.innerWidth <= 767) {
                searchContainer.classList.toggle('active');
                if (searchContainer.classList.contains('active')) {
                    searchInput.focus();
                }
            } else {
                // Trigger search on desktop
                const searchEvent = new CustomEvent('search', {
                    detail: { query: searchInput.value }
                });
                document.dispatchEvent(searchEvent);
            }
        });
        
        // Handle search input
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchEvent = new CustomEvent('search', {
                    detail: { query: searchInput.value }
                });
                document.dispatchEvent(searchEvent);
            }
        });
    }
    
    // Header background on scroll
    let lastScrollY = window.scrollY;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
        
        // Hide header on scroll down, show on scroll up (mobile)
        if (window.innerWidth <= 767) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
        
        // Update active navigation link
        updateActiveNavLink();
    }
    
    // Throttled scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(handleScroll);
    });
}

/**
 * Smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, `#${targetId}`);
                
                // Focus target for accessibility
                setTimeout(() => {
                    targetElement.focus({ preventScroll: true });
                }, 500);
            }
        });
    });
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        
        if (href === current) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

/**
 * Accordion functionality
 */
function initializeAccordions() {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const content = document.getElementById(this.getAttribute('aria-controls'));
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other accordions
            accordionTriggers.forEach(otherTrigger => {
                if (otherTrigger !== this) {
                    otherTrigger.setAttribute('aria-expanded', 'false');
                    const otherContent = document.getElementById(otherTrigger.getAttribute('aria-controls'));
                    if (otherContent) {
                        otherContent.hidden = true;
                    }
                }
            });
            
            // Toggle current accordion
            this.setAttribute('aria-expanded', !isExpanded);
            if (content) {
                content.hidden = isExpanded;
                
                // Scroll to accordion if opening
                if (!isExpanded) {
                    setTimeout(() => {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = this.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }
        });
        
        // Keyboard navigation
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Intersection Observer for animations
 */
function initializeAnimations() {
    // Only run animations if user hasn't requested reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animations for cards
                if (entry.target.classList.contains('content-grid')) {
                    const cards = entry.target.querySelectorAll('.content-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe sections and cards
    const elementsToAnimate = document.querySelectorAll('.content-section, .content-grid, .gallery-section');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // Add CSS for animations
    addAnimationStyles();
}

/**
 * Add animation styles dynamically
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .content-section,
        .content-grid,
        .gallery-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .content-section.animate-in,
        .content-grid.animate-in,
        .gallery-section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .content-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }
        
        .content-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media (prefers-reduced-motion: reduce) {
            .content-section,
            .content-grid,
            .gallery-section,
            .content-card {
                opacity: 1;
                transform: none;
                transition: none;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Accessibility enhancements
 */
function initializeAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }
    
    // Keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll('.gallery-item, .content-card');
    
    interactiveElements.forEach(element => {
        // Make elements focusable
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        // Add keyboard event listeners
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Announce page changes for screen readers
    announcePageChanges();
    
    // High contrast mode detection
    detectHighContrastMode();
    
    // Font size controls
    addFontSizeControls();
}

/**
 * Announce page changes for screen readers
 */
function announcePageChanges() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.classList.add('visually-hidden');
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Listen for navigation changes
    window.addEventListener('hashchange', function() {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const heading = targetElement.querySelector('h1, h2, h3');
            if (heading) {
                liveRegion.textContent = `Navigated to ${heading.textContent}`;
            }
        }
    });
}

/**
 * Detect high contrast mode
 */
function detectHighContrastMode() {
    const testElement = document.createElement('div');
    testElement.style.color = 'rgb(31, 41, 55)';
    testElement.style.backgroundColor = 'rgb(255, 255, 255)';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const isHighContrast = computedStyle.color !== 'rgb(31, 41, 55)';
    
    document.body.removeChild(testElement);
    
    if (isHighContrast) {
        document.documentElement.classList.add('high-contrast');
    }
}

/**
 * Add font size controls for accessibility
 */
function addFontSizeControls() {
    const controls = document.createElement('div');
    controls.innerHTML = `
        <div class="font-size-controls" style="position: fixed; top: 80px; right: 20px; z-index: 999; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: none;">
            <label for="font-size-select">Font Size:</label>
            <select id="font-size-select">
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
            </select>
        </div>
    `;
    document.body.appendChild(controls);
    
    const select = document.getElementById('font-size-select');
    const controlsContainer = document.querySelector('.font-size-controls');
    
    // Show controls on focus/keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            controlsContainer.style.display = 'block';
        }
    });
    
    select.addEventListener('change', function() {
        document.documentElement.setAttribute('data-font-size', this.value);
        localStorage.setItem('font-size-preference', this.value);
    });
    
    // Load saved preference
    const savedFontSize = localStorage.getItem('font-size-preference');
    if (savedFontSize) {
        select.value = savedFontSize;
        document.documentElement.setAttribute('data-font-size', savedFontSize);
    }
}

/**
 * Progressive loading for better performance
 */
function initializeProgressiveLoading() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger loading
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
    
    // Preload critical sections
    setTimeout(() => {
        const criticalSections = document.querySelectorAll('#climate-change, #sustainability');
        criticalSections.forEach(section => {
            // Preload section images
            const sectionImages = section.querySelectorAll('img');
            sectionImages.forEach(img => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = img.src;
                document.head.appendChild(link);
            });
        });
    }, 1000);
}

/**
 * Trap focus within an element (for accessibility)
 */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
        
        if (e.key === 'Escape') {
            const navToggle = document.querySelector('.nav-toggle');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                element.classList.remove('active');
                navToggle.focus();
            }
        }
    });
    
    // Focus first element
    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }
}

/**
 * Handle window resize events
 */
window.addEventListener('resize', debounce(function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const searchContainer = document.querySelector('.search-container');
    
    // Reset mobile menu on resize
    if (window.innerWidth > 767) {
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
        }
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (searchContainer) {
            searchContainer.classList.remove('active');
        }
    }
}, 250));

/**
 * Debounce utility function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Error handling for failed image loads
 */
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Failed to load image:', e.target.src);
        
        // Add fallback styling
        e.target.style.background = 'var(--color-background-alt)';
        e.target.style.display = 'flex';
        e.target.style.alignItems = 'center';
        e.target.style.justifyContent = 'center';
        e.target.innerHTML = '<span style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Image unavailable</span>';
    }
}, true);

/**
 * Service worker registration for offline functionality
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeSmoothScrolling,
        initializeAccordions,
        trapFocus,
        debounce
    };
}
