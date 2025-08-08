/**
 * Climate Change Education Website - Main JavaScript
 * Handles core functionality, navigation, and page interactions
 */

class ClimateEducationApp {
    constructor() {
        this.isLoading = true;
        this.currentSection = 'hero';
        this.scrollPosition = 0;
        this.particles = [];
        this.counters = new Map();
        this.progressBars = new Map();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeLoading();
        this.createParticles();
        this.setupIntersectionObserver();
        this.initializeCounters();
        this.setupProgressBars();
        this.initializeClimateData();
        this.setupResponsiveNavigation();
        this.initializeScrollEffects();
    }

    setupEventListeners() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.handleDOMLoaded();
        });

        // Window events
        window.addEventListener('load', () => {
            this.handleWindowLoad();
        });

        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Navigation events
        this.setupNavigationEvents();
        
        // Button events
        this.setupButtonEvents();
        
        // Form events
        this.setupFormEvents();
    }

    initializeLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressFill = document.getElementById('progressFill');
        
        if (!loadingScreen || !progressFill) return;

        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 500);
            }
            
            progressFill.style.width = `${progress}%`;
        }, 200);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.isLoading = false;
                this.startMainAnimations();
            }, 500);
        }
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = window.innerWidth < 768 ? 30 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createParticle();
            particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random positioning and animation
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 50;
        const endX = startX + (Math.random() - 0.5) * 200;
        const animationDuration = 8 + Math.random() * 10;
        const delay = Math.random() * 5;
        const size = 2 + Math.random() * 4;
        
        particle.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            width: ${size}px;
            height: ${size}px;
            animation: particleFloat ${animationDuration}s linear ${delay}s infinite;
        `;
        
        return particle;
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleSectionInView(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            this.observer.observe(section);
        });

        // Observe animated elements
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }

    handleSectionInView(section) {
        const sectionId = section.id;
        
        // Update current section
        this.currentSection = sectionId;
        this.updateActiveNavLink(sectionId);
        
        // Trigger section-specific animations
        this.triggerSectionAnimations(section);
        
        // Add visible class for animated elements
        if (section.classList.contains('animate-on-scroll')) {
            section.classList.add('visible');
        }
    }

    updateActiveNavLink(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    triggerSectionAnimations(section) {
        const sectionId = section.id;
        
        switch (sectionId) {
            case 'hero':
                this.animateHeroStats();
                break;
            case 'climate-crisis':
                this.animateProgressBars();
                break;
            case 'data-visualization':
                this.animateDataCharts();
                break;
            case 'solutions':
                this.animateSolutionCards();
                break;
            case 'renewable-energy':
                this.animateEnergyMetrics();
                break;
            case 'take-action':
                this.animateActionTracker();
                break;
        }
    }

    initializeCounters() {
        const counterElements = document.querySelectorAll('[data-target]');
        
        counterElements.forEach(element => {
            const target = parseFloat(element.getAttribute('data-target'));
            this.counters.set(element, {
                target,
                current: 0,
                isAnimated: false
            });
        });
    }

    animateCounter(element, target, duration = 2000) {
        const counterData = this.counters.get(element);
        if (!counterData || counterData.isAnimated) return;
        
        counterData.isAnimated = true;
        const startTime = performance.now();
        const startValue = 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (target - startValue) * easeOutQuart;
            
            // Format the number appropriately
            const formattedValue = this.formatNumber(currentValue, target);
            element.textContent = formattedValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = this.formatNumber(target, target);
                counterData.current = target;
            }
        };
        
        requestAnimationFrame(animate);
    }

    formatNumber(value, target) {
        if (target >= 1000) {
            return Math.floor(value).toLocaleString();
        } else if (target >= 100) {
            return Math.floor(value);
        } else {
            return value.toFixed(1);
        }
    }

    setupProgressBars() {
        const progressBars = document.querySelectorAll('[data-progress]');
        
        progressBars.forEach(bar => {
            const progress = parseInt(bar.getAttribute('data-progress'));
            this.progressBars.set(bar, {
                target: progress,
                isAnimated: false
            });
        });
    }

    animateProgressBar(element, target) {
        const progressData = this.progressBars.get(element);
        if (!progressData || progressData.isAnimated) return;
        
        progressData.isAnimated = true;
        
        setTimeout(() => {
            element.style.width = `${target}%`;
        }, 300);
    }

    animateHeroStats() {
        const statNumbers = document.querySelectorAll('.hero-stats [data-target]');
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            this.animateCounter(stat, target, 3000);
        });
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.crisis-section [data-progress]');
        progressBars.forEach(bar => {
            const progress = parseInt(bar.getAttribute('data-progress'));
            this.animateProgressBar(bar, progress);
        });
    }

    animateDataCharts() {
        // Animate pie chart segments
        this.animatePieChart();
        
        // Animate line chart
        this.animateLineChart();
        
        // Animate bar charts
        this.animateBarCharts();
        
        // Animate budget visualization
        this.animateBudgetVisualization();
    }

    animatePieChart() {
        const pieSegments = document.querySelectorAll('.pie-segment');
        const totalCircumference = 2 * Math.PI * 80; // radius = 80
        
        pieSegments.forEach((segment, index) => {
            const className = segment.classList[1]; // energy, transport, etc.
            let percentage;
            
            switch (className) {
                case 'energy': percentage = 25; break;
                case 'transport': percentage = 17; break;
                case 'industry': percentage = 15; break;
                case 'agriculture': percentage = 12; break;
                default: percentage = 0;
            }
            
            const segmentLength = (percentage / 100) * totalCircumference;
            const offset = index * segmentLength;
            
            setTimeout(() => {
                segment.style.strokeDasharray = `${segmentLength} ${totalCircumference}`;
                segment.style.strokeDashoffset = `-${offset}`;
            }, index * 200);
        });
    }

    animateLineChart() {
        const tempLine = document.querySelector('.temp-line');
        const tempArea = document.querySelector('.temp-area');
        
        if (tempLine) {
            setTimeout(() => {
                tempLine.style.strokeDasharray = 'none';
                tempLine.style.animation = 'drawLine 2s ease forwards';
            }, 500);
        }
        
        if (tempArea) {
            setTimeout(() => {
                tempArea.style.animation = 'fadeIn 1s ease forwards';
            }, 1500);
        }
    }

    animateBarCharts() {
        const barFills = document.querySelectorAll('.bar-fill[data-height]');
        
        barFills.forEach((bar, index) => {
            const height = bar.getAttribute('data-height');
            setTimeout(() => {
                bar.style.height = `${height}%`;
            }, index * 200);
        });
    }

    animateBudgetVisualization() {
        const budgetUsed = document.querySelector('.budget-used[data-width]');
        const budgetRemaining = document.querySelector('.budget-remaining[data-width]');
        
        if (budgetUsed) {
            setTimeout(() => {
                budgetUsed.style.width = '67%';
            }, 300);
        }
        
        if (budgetRemaining) {
            setTimeout(() => {
                budgetRemaining.style.width = '33%';
            }, 800);
        }
    }

    animateSolutionCards() {
        const solutionCards = document.querySelectorAll('.solution-card');
        
        solutionCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'cardSlideIn 0.8s ease forwards';
                card.style.opacity = '1';
            }, index * 150);
        });
    }

    animateEnergyMetrics() {
        const metricFills = document.querySelectorAll('.metric-fill[data-percentage]');
        
        metricFills.forEach((fill, index) => {
            const percentage = fill.getAttribute('data-percentage');
            setTimeout(() => {
                fill.style.width = `${percentage}%`;
            }, index * 300);
        });
    }

    animateActionTracker() {
        const trackerStats = document.querySelectorAll('.tracker-stat [data-target]');
        
        trackerStats.forEach((stat, index) => {
            setTimeout(() => {
                const target = parseInt(stat.getAttribute('data-target'));
                this.animateCounter(stat, target, 2500);
            }, index * 500);
        });
        
        // Animate global progress bar
        const globalProgress = document.querySelector('.progress-fill-global[data-progress]');
        if (globalProgress) {
            setTimeout(() => {
                const progress = globalProgress.getAttribute('data-progress');
                globalProgress.style.width = `${progress}%`;
            }, 1500);
        }
    }

    setupNavigationEvents() {
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.smoothScrollTo(targetId);
            });
        });
        
        // Mobile navigation toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
        
        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            });
        });
    }

    setupButtonEvents() {
        // Primary CTA buttons
        const ctaButtons = document.querySelectorAll('.btn-primary');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleCTAClick(e, button);
            });
        });
        
        // Solution buttons
        const solutionButtons = document.querySelectorAll('.solution-btn');
        solutionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleSolutionClick(e, button);
            });
        });
        
        // Option buttons
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleOptionClick(e, button);
            });
        });
        
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                this.smoothScrollTo('hero');
            });
        }
    }

    setupFormEvents() {
        // Newsletter signup
        const newsletterForm = document.querySelector('.newsletter-signup');
        if (newsletterForm) {
            const input = newsletterForm.querySelector('.newsletter-input');
            const button = newsletterForm.querySelector('.newsletter-btn');
            
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleNewsletterSignup(input.value);
                });
            }
            
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleNewsletterSignup(input.value);
                    }
                });
            }
        }
    }

    handleCTAClick(e, button) {
        e.preventDefault();
        
        // Add click animation
        button.style.animation = 'buttonPress 0.2s ease';
        
        // Navigate based on button text
        const buttonText = button.textContent.trim();
        if (buttonText.includes('Start Learning')) {
            this.smoothScrollTo('climate-crisis');
        } else if (buttonText.includes('View Data')) {
            this.smoothScrollTo('data-visualization');
        }
        
        // Reset animation
        setTimeout(() => {
            button.style.animation = '';
        }, 200);
    }

    handleSolutionClick(e, button) {
        e.preventDefault();
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        
        // Show modal or navigate (placeholder)
        setTimeout(() => {
            alert('Solution details would be shown in a modal or new page.');
            button.style.transform = '';
        }, 150);
    }

    handleOptionClick(e, button) {
        e.preventDefault();
        
        // Add ripple effect
        this.createRippleEffect(button, e);
        
        // Handle different option types
        const buttonText = button.textContent.trim();
        if (buttonText.includes('Get Involved')) {
            // Navigate to action section
            this.smoothScrollTo('take-action');
        } else {
            // Show placeholder message
            setTimeout(() => {
                alert(`${buttonText} feature would be implemented here.`);
            }, 300);
        }
    }

    handleNewsletterSignup(email) {
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate API call
        this.showNotification('Thank you for subscribing!', 'success');
        
        // Clear input
        const input = document.querySelector('.newsletter-input');
        if (input) {
            input.value = '';
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;
        
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    handleScroll() {
        this.scrollPosition = window.pageYOffset;
        
        // Update header background
        this.updateHeaderBackground();
        
        // Show/hide back to top button
        this.updateBackToTopButton();
        
        // Parallax effects
        this.updateParallaxEffects();
        
        // Update climate clock
        this.updateClimateClock();
    }

    updateHeaderBackground() {
        const header = document.getElementById('mainHeader');
        if (!header) return;
        
        if (this.scrollPosition > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    updateBackToTopButton() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        
        if (this.scrollPosition > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    updateParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = -(this.scrollPosition * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateClimateClock() {
        const clockElement = document.getElementById('climateClock');
        if (!clockElement) return;
        
        // Calculate time remaining until 2030 (arbitrary deadline)
        const now = new Date();
        const deadline = new Date('2030-01-01');
        const timeRemaining = deadline - now;
        
        if (timeRemaining > 0) {
            const years = Math.floor(timeRemaining / (1000 * 60 * 60 * 24 * 365));
            const days = Math.floor((timeRemaining % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            
            clockElement.textContent = `${years}y ${days}d ${hours}h ${minutes}m`;
        }
    }

    setupResponsiveNavigation() {
        // Handle responsive breakpoints
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        const handleMediaQueryChange = (e) => {
            if (e.matches) {
                // Mobile view
                this.setupMobileNavigation();
            } else {
                // Desktop view
                this.setupDesktopNavigation();
            }
        };
        
        mediaQuery.addListener(handleMediaQueryChange);
        handleMediaQueryChange(mediaQuery);
    }

    setupMobileNavigation() {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.style.transition = 'left 0.3s ease';
        }
    }

    setupDesktopNavigation() {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('active');
            navMenu.style.left = '';
        }
    }

    initializeScrollEffects() {
        // Add scroll-triggered animations
        const scrollElements = document.querySelectorAll('.animate-on-scroll');
        
        scrollElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
        });
    }

    initializeClimateData() {
        // Initialize real-time climate data updates
        this.updateClimateStats();
        
        // Update every 5 minutes
        setInterval(() => {
            this.updateClimateStats();
        }, 300000);
    }

    updateClimateStats() {
        // Simulate real-time data updates
        const stats = {
            temperature: 1.1 + (Math.random() * 0.1 - 0.05),
            co2: 420 + (Math.random() * 5 - 2.5),
            timeToAct: 8 - (Math.random() * 0.5)
        };
        
        // Update hero stats if visible
        const tempStat = document.querySelector('.hero-stats [data-target="1.1"]');
        const co2Stat = document.querySelector('.hero-stats [data-target="420"]');
        const timeStat = document.querySelector('.hero-stats [data-target="8"]');
        
        if (tempStat && this.currentSection === 'hero') {
            tempStat.textContent = stats.temperature.toFixed(1);
        }
        if (co2Stat && this.currentSection === 'hero') {
            co2Stat.textContent = Math.round(stats.co2);
        }
        if (timeStat && this.currentSection === 'hero') {
            timeStat.textContent = Math.round(stats.timeToAct);
        }
    }

    handleResize() {
        // Update particle system
        this.updateParticleSystem();
        
        // Recalculate responsive elements
        this.recalculateResponsiveElements();
    }

    updateParticleSystem() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        // Remove existing particles
        this.particles.forEach(particle => {
            particle.remove();
        });
        this.particles = [];
        
        // Create new particles for current screen size
        this.createParticles();
    }

    recalculateResponsiveElements() {
        // Recalculate any elements that depend on window size
        const responsiveElements = document.querySelectorAll('[data-responsive]');
        
        responsiveElements.forEach(element => {
            // Custom responsive logic would go here
        });
    }

    startMainAnimations() {
        // Start particle animations
        this.animateParticles();
        
        // Start floating icon animations
        this.animateFloatingIcons();
        
        // Start hero text animations
        this.animateHeroText();
    }

    animateParticles() {
        this.particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animation = 'particleFloat 8s linear infinite';
            }, index * 100);
        });
    }

    animateFloatingIcons() {
        const floatingIcons = document.querySelectorAll('.floating-icon');
        floatingIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.5}s`;
        });
    }

    animateHeroText() {
        const titleWords = document.querySelectorAll('.title-word');
        titleWords.forEach((word, index) => {
            setTimeout(() => {
                word.style.animation = 'slideInUp 0.8s ease forwards';
            }, index * 200);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    handleDOMLoaded() {
        // DOM is ready, setup initial states
        console.log('Climate Education App - DOM Loaded');
    }

    handleWindowLoad() {
        // All resources loaded, start animations
        console.log('Climate Education App - Window Loaded');
    }
}

// Initialize the application
const app = new ClimateEducationApp();

// Export for potential external use
window.ClimateEducationApp = ClimateEducationApp;
