/**
 * Climate Change Education Website - Animation Controller
 * Handles complex animations, transitions, and visual effects
 */

class AnimationController {
    constructor() {
        this.animationQueue = [];
        this.isAnimating = false;
        this.observedElements = new Set();
        this.activeAnimations = new Map();
        this.performanceMode = this.detectPerformanceMode();
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupPerformanceOptimizations();
        this.setupAnimationHelpers();
        this.bindEvents();
    }

    detectPerformanceMode() {
        // Detect device performance capabilities
        const navigator = window.navigator;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        const isLowEnd = (
            navigator.hardwareConcurrency < 4 ||
            (connection && connection.effectiveType && 
             ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) ||
            window.devicePixelRatio < 2
        );
        
        return isLowEnd ? 'low' : 'high';
    }

    setupIntersectionObserver() {
        const options = {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '0px 0px -100px 0px'
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.handleIntersection(entry);
            });
        }, options);

        // Observe all animatable elements
        this.observeAnimatableElements();
    }

    observeAnimatableElements() {
        const selectors = [
            '.crisis-card',
            '.data-card',
            '.solution-card',
            '.energy-card',
            '.action-card',
            '.animate-on-scroll',
            '[data-animate]',
            '.chart-container',
            '.progress-indicator',
            '.metric-bar'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!this.observedElements.has(element)) {
                    this.intersectionObserver.observe(element);
                    this.observedElements.add(element);
                }
            });
        });
    }

    handleIntersection(entry) {
        const element = entry.target;
        const intersectionRatio = entry.intersectionRatio;
        
        if (intersectionRatio > 0.1 && !element.classList.contains('animated')) {
            this.triggerElementAnimation(element);
        }
        
        // Handle scroll-based animations
        if (intersectionRatio > 0.5) {
            this.handleScrollBasedAnimations(element, intersectionRatio);
        }
    }

    triggerElementAnimation(element) {
        element.classList.add('animated');
        
        const animationType = element.getAttribute('data-animate') || this.getDefaultAnimation(element);
        const delay = parseInt(element.getAttribute('data-delay')) || 0;
        const duration = parseInt(element.getAttribute('data-duration')) || 800;
        
        setTimeout(() => {
            this.executeAnimation(element, animationType, duration);
        }, delay);
    }

    getDefaultAnimation(element) {
        if (element.classList.contains('crisis-card')) return 'slideInUp';
        if (element.classList.contains('data-card')) return 'fadeInScale';
        if (element.classList.contains('solution-card')) return 'flipInY';
        if (element.classList.contains('energy-card')) return 'slideInLeft';
        if (element.classList.contains('action-card')) return 'bounceIn';
        return 'fadeInUp';
    }

    executeAnimation(element, type, duration) {
        const animationConfig = this.getAnimationConfig(type, duration);
        
        if (this.performanceMode === 'low') {
            // Simplified animations for low-performance devices
            this.executeSimpleAnimation(element, animationConfig);
        } else {
            // Full animations for high-performance devices
            this.executeComplexAnimation(element, animationConfig);
        }
    }

    getAnimationConfig(type, duration) {
        const configs = {
            slideInUp: {
                keyframes: [
                    { opacity: 0, transform: 'translateY(50px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ],
                options: { duration, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
            },
            fadeInScale: {
                keyframes: [
                    { opacity: 0, transform: 'scale(0.8)' },
                    { opacity: 1, transform: 'scale(1)' }
                ],
                options: { duration, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
            },
            flipInY: {
                keyframes: [
                    { opacity: 0, transform: 'perspective(400px) rotateY(90deg)' },
                    { opacity: 1, transform: 'perspective(400px) rotateY(0deg)' }
                ],
                options: { duration: duration + 200, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
            },
            slideInLeft: {
                keyframes: [
                    { opacity: 0, transform: 'translateX(-50px)' },
                    { opacity: 1, transform: 'translateX(0)' }
                ],
                options: { duration, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
            },
            bounceIn: {
                keyframes: [
                    { opacity: 0, transform: 'scale(0.3)' },
                    { opacity: 1, transform: 'scale(1.05)' },
                    { opacity: 1, transform: 'scale(0.9)' },
                    { opacity: 1, transform: 'scale(1)' }
                ],
                options: { duration: duration + 300, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }
            },
            fadeInUp: {
                keyframes: [
                    { opacity: 0, transform: 'translateY(30px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ],
                options: { duration, easing: 'ease-out' }
            }
        };
        
        return configs[type] || configs.fadeInUp;
    }

    executeSimpleAnimation(element, config) {
        // Simplified CSS-based animation for performance
        element.style.transition = `all ${config.options.duration}ms ${config.options.easing}`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
    }

    executeComplexAnimation(element, config) {
        if (!element.animate) {
            // Fallback for browsers without Web Animations API
            this.executeSimpleAnimation(element, config);
            return;
        }

        const animation = element.animate(config.keyframes, config.options);
        this.activeAnimations.set(element, animation);
        
        animation.addEventListener('finish', () => {
            this.activeAnimations.delete(element);
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }

    handleScrollBasedAnimations(element, ratio) {
        // Progress bars and meters
        if (element.classList.contains('progress-indicator')) {
            this.animateProgressBar(element, ratio);
        }
        
        // Charts and data visualizations
        if (element.classList.contains('chart-container')) {
            this.animateChart(element, ratio);
        }
        
        // Parallax effects
        if (element.hasAttribute('data-parallax')) {
            this.applyParallaxEffect(element, ratio);
        }
    }

    animateProgressBar(element, ratio) {
        const progressBar = element.querySelector('.progress-bar-fill, .meter-fill');
        if (!progressBar) return;
        
        const targetWidth = parseInt(progressBar.getAttribute('data-progress')) || 0;
        const currentWidth = Math.min(targetWidth * ratio * 2, targetWidth);
        
        progressBar.style.width = `${currentWidth}%`;
        
        // Add completion effect
        if (currentWidth >= targetWidth && !progressBar.classList.contains('completed')) {
            progressBar.classList.add('completed');
            this.createProgressCompletionEffect(progressBar);
        }
    }

    createProgressCompletionEffect(progressBar) {
        // Create a pulse effect when progress completes
        const pulse = document.createElement('div');
        pulse.style.cssText = `
            position: absolute;
            top: -2px;
            right: -2px;
            width: 8px;
            height: 8px;
            background: #27ae60;
            border-radius: 50%;
            animation: pulse 1s ease-out;
        `;
        
        progressBar.style.position = 'relative';
        progressBar.appendChild(pulse);
        
        setTimeout(() => pulse.remove(), 1000);
    }

    animateChart(element, ratio) {
        // Handle different chart types
        if (element.querySelector('.pie-chart')) {
            this.animatePieChart(element, ratio);
        }
        
        if (element.querySelector('.line-chart')) {
            this.animateLineChart(element, ratio);
        }
        
        if (element.querySelector('.bar-chart')) {
            this.animateBarChart(element, ratio);
        }
    }

    animatePieChart(container, ratio) {
        const segments = container.querySelectorAll('.pie-segment');
        segments.forEach((segment, index) => {
            const delay = index * 200;
            const progress = Math.max(0, (ratio - 0.3) * 2);
            
            setTimeout(() => {
                if (progress > 0) {
                    segment.style.strokeDasharray = `${progress * 100} 314`;
                    segment.style.opacity = '1';
                }
            }, delay);
        });
    }

    animateLineChart(container, ratio) {
        const lines = container.querySelectorAll('.chart-line');
        lines.forEach(line => {
            const pathLength = line.getTotalLength ? line.getTotalLength() : 1000;
            const progress = Math.max(0, (ratio - 0.2) * 1.5);
            
            line.style.strokeDasharray = pathLength;
            line.style.strokeDashoffset = pathLength * (1 - progress);
        });
    }

    animateBarChart(container, ratio) {
        const bars = container.querySelectorAll('.chart-bar');
        bars.forEach((bar, index) => {
            const targetHeight = bar.getAttribute('data-height') || '100';
            const delay = index * 100;
            const progress = Math.max(0, (ratio - 0.3) * 2);
            
            setTimeout(() => {
                bar.style.height = `${targetHeight * progress}%`;
            }, delay);
        });
    }

    applyParallaxEffect(element, ratio) {
        const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
        const offset = (1 - ratio) * 100 * speed;
        
        element.style.transform = `translateY(${offset}px)`;
    }

    // Counter Animation System
    animateCounters() {
        const counters = document.querySelectorAll('[data-target]');
        counters.forEach(counter => {
            if (!counter.classList.contains('counting')) {
                this.animateCounter(counter);
            }
        });
    }

    animateCounter(element) {
        element.classList.add('counting');
        
        const target = parseFloat(element.getAttribute('data-target'));
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth counting
            const easedProgress = this.easeOutCubic(progress);
            const currentValue = target * easedProgress;
            
            // Format the number
            const formattedValue = this.formatCounterValue(currentValue, target);
            element.textContent = formattedValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = this.formatCounterValue(target, target);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    formatCounterValue(value, target) {
        if (target >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (target >= 1000) {
            return Math.floor(value).toLocaleString();
        } else if (target >= 100) {
            return Math.floor(value);
        } else {
            return value.toFixed(1);
        }
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Particle System
    createParticleSystem(container, config = {}) {
        const defaultConfig = {
            count: 50,
            size: { min: 2, max: 6 },
            speed: { min: 1, max: 3 },
            opacity: { min: 0.1, max: 0.8 },
            colors: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c']
        };
        
        const particleConfig = { ...defaultConfig, ...config };
        
        for (let i = 0; i < particleConfig.count; i++) {
            this.createParticle(container, particleConfig);
        }
    }

    createParticle(container, config) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = this.randomBetween(config.size.min, config.size.max);
        const speed = this.randomBetween(config.speed.min, config.speed.max);
        const opacity = this.randomBetween(config.opacity.min, config.opacity.max);
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            opacity: ${opacity};
            pointer-events: none;
        `;
        
        container.appendChild(particle);
        this.animateParticle(particle, speed);
    }

    animateParticle(particle, speed) {
        const containerRect = particle.parentElement.getBoundingClientRect();
        const startX = Math.random() * containerRect.width;
        const startY = containerRect.height + 50;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = -50;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        const animation = particle.animate([
            { transform: `translate(0, 0) rotate(0deg)` },
            { transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(360deg)` }
        ], {
            duration: (1000 * speed) + Math.random() * 2000,
            easing: 'linear',
            iterations: Infinity
        });
        
        return animation;
    }

    randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    // Morphing Animations
    createMorphingShape(element, shapes) {
        let currentShapeIndex = 0;
        
        const morphInterval = setInterval(() => {
            currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
            const targetShape = shapes[currentShapeIndex];
            
            element.style.clipPath = targetShape;
            element.style.transition = 'clip-path 2s ease-in-out';
        }, 3000);
        
        return morphInterval;
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Reduce animations on low-end devices
        if (this.performanceMode === 'low') {
            this.reducedMotionMode();
        }
        
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAllAnimations();
            } else {
                this.resumeAllAnimations();
            }
        });
    }

    reducedMotionMode() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
            .particle {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    pauseAllAnimations() {
        this.activeAnimations.forEach(animation => {
            animation.pause();
        });
        
        document.body.style.animationPlayState = 'paused';
    }

    resumeAllAnimations() {
        this.activeAnimations.forEach(animation => {
            animation.play();
        });
        
        document.body.style.animationPlayState = 'running';
    }

    setupAnimationHelpers() {
        // CSS variables for dynamic animations
        this.updateCSSVariables();
        
        // Animation event listeners
        this.setupAnimationEventListeners();
    }

    updateCSSVariables() {
        const root = document.documentElement;
        
        // Set performance-based values
        if (this.performanceMode === 'low') {
            root.style.setProperty('--animation-duration', '0.3s');
            root.style.setProperty('--transition-duration', '0.2s');
            root.style.setProperty('--particle-count', '10');
        } else {
            root.style.setProperty('--animation-duration', '0.8s');
            root.style.setProperty('--transition-duration', '0.3s');
            root.style.setProperty('--particle-count', '50');
        }
    }

    setupAnimationEventListeners() {
        // Listen for animation events
        document.addEventListener('animationstart', (e) => {
            console.log('Animation started:', e.animationName);
        });
        
        document.addEventListener('animationend', (e) => {
            console.log('Animation ended:', e.animationName);
            this.handleAnimationEnd(e);
        });
    }

    handleAnimationEnd(event) {
        const element = event.target;
        
        // Clean up completed animations
        if (element.classList.contains('animated')) {
            element.style.animation = '';
        }
        
        // Trigger next animation in sequence if needed
        const nextElement = element.getAttribute('data-next-animate');
        if (nextElement) {
            const target = document.querySelector(nextElement);
            if (target) {
                this.triggerElementAnimation(target);
            }
        }
    }

    bindEvents() {
        // Bind animation triggers to user interactions
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-animate-on-click')) {
                const animationType = e.target.getAttribute('data-animate-on-click');
                this.executeAnimation(e.target, animationType, 500);
            }
        });
        
        // Bind hover animations
        document.addEventListener('mouseenter', (e) => {
            if (e.target.hasAttribute('data-animate-on-hover')) {
                const animationType = e.target.getAttribute('data-animate-on-hover');
                this.executeAnimation(e.target, animationType, 300);
            }
        }, true);
    }

    // Public API methods
    animate(element, type, duration = 800) {
        return this.executeAnimation(element, type, duration);
    }

    addToObserver(element) {
        if (!this.observedElements.has(element)) {
            this.intersectionObserver.observe(element);
            this.observedElements.add(element);
        }
    }

    removeFromObserver(element) {
        if (this.observedElements.has(element)) {
            this.intersectionObserver.unobserve(element);
            this.observedElements.delete(element);
        }
    }

    destroy() {
        // Clean up observers and animations
        this.intersectionObserver.disconnect();
        this.pauseAllAnimations();
        this.activeAnimations.clear();
        this.observedElements.clear();
    }
}

// Initialize the animation controller
const animationController = new AnimationController();

// Export for external use
window.AnimationController = AnimationController;
window.animationController = animationController;
