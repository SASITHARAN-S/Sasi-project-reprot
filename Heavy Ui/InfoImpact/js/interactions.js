/**
 * Climate Change Education Website - Interactions Controller
 * Handles user interactions, tooltips, modals, and interactive elements
 */

class InteractionsController {
    constructor() {
        this.activeModals = new Set();
        this.tooltips = new Map();
        this.interactiveElements = new Map();
        this.touchStartPos = { x: 0, y: 0 };
        this.isTouch = 'ontouchstart' in window;
        this.userEngagement = {
            timeOnPage: 0,
            sectionsViewed: new Set(),
            interactionsCount: 0,
            startTime: Date.now()
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTooltips();
        this.setupCardInteractions();
        this.setupChartInteractions();
        this.setupModalSystem();
        this.initializeUserEngagement();
        this.setupAccessibilityFeatures();
        this.setupTouchInteractions();
    }

    setupEventListeners() {
        // Global event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.handleDOMReady();
        });

        // Mouse events
        document.addEventListener('mouseover', (e) => {
            this.handleMouseOver(e);
        });

        document.addEventListener('mouseout', (e) => {
            this.handleMouseOut(e);
        });

        document.addEventListener('click', (e) => {
            this.handleClick(e);
        });

        // Touch events for mobile
        if (this.isTouch) {
            document.addEventListener('touchstart', (e) => {
                this.handleTouchStart(e);
            });

            document.addEventListener('touchend', (e) => {
                this.handleTouchEnd(e);
            });
        }

        // Keyboard events for accessibility
        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        // Window events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Scroll events for interactive elements
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));
    }

    initializeTooltips() {
        // Find all elements with data-tooltip attribute
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            this.setupTooltip(element);
        });

        // Setup dynamic tooltips for data points
        this.setupDataTooltips();
    }

    setupTooltip(element) {
        const tooltipText = element.getAttribute('data-tooltip');
        const tooltipPosition = element.getAttribute('data-tooltip-position') || 'top';
        
        if (!tooltipText) return;

        const tooltip = this.createTooltip(tooltipText, tooltipPosition);
        this.tooltips.set(element, tooltip);

        // Event listeners for showing/hiding tooltips
        element.addEventListener('mouseenter', () => {
            this.showTooltip(element, tooltip);
        });

        element.addEventListener('mouseleave', () => {
            this.hideTooltip(tooltip);
        });

        element.addEventListener('focus', () => {
            this.showTooltip(element, tooltip);
        });

        element.addEventListener('blur', () => {
            this.hideTooltip(tooltip);
        });
    }

    createTooltip(text, position) {
        const tooltip = document.createElement('div');
        tooltip.className = `tooltip tooltip-${position}`;
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(44, 62, 80, 0.95);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            line-height: 1.4;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transform: translateY(-5px);
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            white-space: nowrap;
            max-width: 250px;
            word-wrap: break-word;
        `;

        // Add arrow
        const arrow = document.createElement('div');
        arrow.className = 'tooltip-arrow';
        arrow.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            ${position === 'top' ? 'border-top: 6px solid rgba(44, 62, 80, 0.95); bottom: -6px;' : ''}
            ${position === 'bottom' ? 'border-bottom: 6px solid rgba(44, 62, 80, 0.95); top: -6px;' : ''}
            ${position === 'left' ? 'border-left: 6px solid rgba(44, 62, 80, 0.95); right: -6px; border-top: 6px solid transparent; border-bottom: 6px solid transparent;' : ''}
            ${position === 'right' ? 'border-right: 6px solid rgba(44, 62, 80, 0.95); left: -6px; border-top: 6px solid transparent; border-bottom: 6px solid transparent;' : ''}
            left: 50%;
            transform: translateX(-50%);
        `;

        tooltip.appendChild(arrow);
        document.body.appendChild(tooltip);
        
        return tooltip;
    }

    showTooltip(element, tooltip) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const position = tooltip.classList.contains('tooltip-top') ? 'top' :
                        tooltip.classList.contains('tooltip-bottom') ? 'bottom' :
                        tooltip.classList.contains('tooltip-left') ? 'left' : 'right';

        let left, top;

        switch (position) {
            case 'top':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.top - tooltipRect.height - 10;
                break;
            case 'bottom':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.bottom + 10;
                break;
            case 'left':
                left = rect.left - tooltipRect.width - 10;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'right':
                left = rect.right + 10;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
        }

        // Keep tooltip within viewport
        left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
        top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }

    hideTooltip(tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-5px)';
    }

    setupDataTooltips() {
        // Add tooltips to climate data points
        const dataPoints = document.querySelectorAll('.stat-number, .data-number, .metric-value');
        
        dataPoints.forEach(point => {
            const context = this.getDataContext(point);
            if (context) {
                point.setAttribute('data-tooltip', context);
                this.setupTooltip(point);
            }
        });
    }

    getDataContext(element) {
        // Provide context for different data types
        const text = element.textContent.trim();
        const parent = element.closest('.stat-item, .data-point, .metric');
        
        if (!parent) return null;

        const label = parent.querySelector('.stat-label, .data-label, .metric-label');
        if (!label) return null;

        const labelText = label.textContent.trim().toLowerCase();

        if (labelText.includes('temperature')) {
            return 'Global average temperature increase since pre-industrial times (1850-1900)';
        } else if (labelText.includes('co₂') || labelText.includes('co2')) {
            return 'Current atmospheric CO₂ concentration in parts per million (ppm)';
        } else if (labelText.includes('time') && labelText.includes('act')) {
            return 'Estimated years remaining to limit warming to 1.5°C with current policies';
        } else if (labelText.includes('sea level')) {
            return 'Average annual rate of global sea level rise';
        } else if (labelText.includes('emissions')) {
            return 'Global CO₂ emissions by sector as percentage of total';
        }

        return null;
    }

    setupCardInteractions() {
        // Enhanced card hover effects and interactions
        const cards = document.querySelectorAll('.crisis-card, .data-card, .solution-card, .energy-card, .action-card');
        
        cards.forEach(card => {
            this.setupCardEffects(card);
        });
    }

    setupCardEffects(card) {
        let isHovered = false;
        let tiltTimeout;

        // 3D tilt effect for cards
        card.addEventListener('mouseenter', (e) => {
            isHovered = true;
            this.applyCardTilt(card, e);
            this.enhanceCardVisuals(card);
        });

        card.addEventListener('mousemove', (e) => {
            if (isHovered) {
                clearTimeout(tiltTimeout);
                tiltTimeout = setTimeout(() => {
                    this.applyCardTilt(card, e);
                }, 10);
            }
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            this.resetCardTilt(card);
            this.resetCardVisuals(card);
        });

        // Click interactions
        card.addEventListener('click', (e) => {
            this.handleCardClick(card, e);
        });

        // Keyboard navigation
        if (card.tabIndex === -1) {
            card.tabIndex = 0;
        }

        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleCardClick(card, e);
            }
        });
    }

    applyCardTilt(card, event) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = event.clientX - centerX;
        const mouseY = event.clientY - centerY;

        const rotateX = (mouseY / rect.height) * -15;
        const rotateY = (mouseX / rect.width) * 15;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    }

    resetCardTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }

    enhanceCardVisuals(card) {
        // Add enhanced glow effect
        card.style.boxShadow = '0 20px 40px rgba(52, 152, 219, 0.3), 0 0 20px rgba(52, 152, 219, 0.1)';
        
        // Animate card image if present
        const cardImage = card.querySelector('.card-image, .energy-bg, .icon-bg');
        if (cardImage) {
            cardImage.style.transform = 'scale(1.05)';
        }

        // Enhance overlay visibility
        const overlay = card.querySelector('.card-overlay, .energy-overlay');
        if (overlay) {
            overlay.style.opacity = '0.9';
        }
    }

    resetCardVisuals(card) {
        card.style.boxShadow = '';
        
        const cardImage = card.querySelector('.card-image, .energy-bg, .icon-bg');
        if (cardImage) {
            cardImage.style.transform = 'scale(1)';
        }

        const overlay = card.querySelector('.card-overlay, .energy-overlay');
        if (overlay) {
            overlay.style.opacity = '';
        }
    }

    handleCardClick(card, event) {
        // Create ripple effect
        this.createRippleEffect(card, event);
        
        // Track interaction
        this.trackInteraction('card_click', {
            cardType: this.getCardType(card),
            cardContent: this.getCardContent(card)
        });

        // Handle different card types
        if (card.classList.contains('solution-card')) {
            this.showSolutionDetails(card);
        } else if (card.classList.contains('energy-card')) {
            this.showEnergyDetails(card);
        } else if (card.classList.contains('data-card')) {
            this.showDataDetails(card);
        } else {
            this.showGenericCardDetails(card);
        }
    }

    getCardType(card) {
        const classes = ['crisis-card', 'data-card', 'solution-card', 'energy-card', 'action-card'];
        return classes.find(cls => card.classList.contains(cls)) || 'unknown';
    }

    getCardContent(card) {
        const title = card.querySelector('.card-title, .solution-title, .energy-title, .action-title');
        return title ? title.textContent.trim() : 'Unknown';
    }

    setupChartInteractions() {
        // Interactive chart elements
        this.setupPieChartInteractions();
        this.setupBarChartInteractions();
        this.setupLineChartInteractions();
    }

    setupPieChartInteractions() {
        const pieSegments = document.querySelectorAll('.pie-segment');
        
        pieSegments.forEach((segment, index) => {
            segment.style.cursor = 'pointer';
            
            segment.addEventListener('mouseenter', () => {
                segment.style.strokeWidth = '25';
                segment.style.filter = 'brightness(1.2)';
                
                // Show detailed information
                this.showPieSegmentInfo(segment, index);
            });

            segment.addEventListener('mouseleave', () => {
                segment.style.strokeWidth = '20';
                segment.style.filter = 'brightness(1)';
                
                this.hidePieSegmentInfo();
            });

            segment.addEventListener('click', () => {
                this.handlePieSegmentClick(segment, index);
            });
        });
    }

    showPieSegmentInfo(segment, index) {
        const segmentData = this.getPieSegmentData(index);
        if (!segmentData) return;

        const infoBox = document.createElement('div');
        infoBox.className = 'chart-info-box';
        infoBox.innerHTML = `
            <h4>${segmentData.label}</h4>
            <p><strong>${segmentData.percentage}%</strong> of total emissions</p>
            <p>${segmentData.description}</p>
        `;
        
        infoBox.style.cssText = `
            position: absolute;
            background: white;
            border: 2px solid #3498db;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            max-width: 250px;
            font-size: 0.875rem;
        `;

        document.body.appendChild(infoBox);

        // Position near the segment
        const chartContainer = segment.closest('.pie-chart-container');
        if (chartContainer) {
            const rect = chartContainer.getBoundingClientRect();
            infoBox.style.left = (rect.right + 10) + 'px';
            infoBox.style.top = rect.top + 'px';
        }

        this.currentInfoBox = infoBox;
    }

    hidePieSegmentInfo() {
        if (this.currentInfoBox) {
            this.currentInfoBox.remove();
            this.currentInfoBox = null;
        }
    }

    getPieSegmentData(index) {
        const data = [
            { label: 'Energy', percentage: 25, description: 'Electricity generation, heating, and industrial energy use' },
            { label: 'Transport', percentage: 17, description: 'Cars, trucks, ships, planes, and other transportation' },
            { label: 'Industry', percentage: 15, description: 'Manufacturing, cement, steel, and chemical production' },
            { label: 'Agriculture', percentage: 12, description: 'Livestock, crop production, and land use changes' }
        ];
        
        return data[index] || null;
    }

    handlePieSegmentClick(segment, index) {
        this.trackInteraction('chart_interaction', {
            chartType: 'pie',
            segmentIndex: index,
            segmentData: this.getPieSegmentData(index)
        });

        // Show detailed modal or navigate to relevant section
        const segmentData = this.getPieSegmentData(index);
        if (segmentData) {
            this.showModal(`${segmentData.label} Emissions`, `
                <div class="modal-chart-details">
                    <h3>${segmentData.percentage}% of Global CO₂ Emissions</h3>
                    <p>${segmentData.description}</p>
                    <div class="emission-details">
                        <h4>Key Sources:</h4>
                        <ul>
                            ${this.getEmissionSources(segmentData.label).map(source => `<li>${source}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="reduction-strategies">
                        <h4>Reduction Strategies:</h4>
                        <ul>
                            ${this.getReductionStrategies(segmentData.label).map(strategy => `<li>${strategy}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `);
        }
    }

    getEmissionSources(sector) {
        const sources = {
            'Energy': ['Coal power plants', 'Natural gas facilities', 'Oil refineries', 'Residential heating'],
            'Transport': ['Road vehicles', 'Aviation', 'Shipping', 'Rail transport'],
            'Industry': ['Steel production', 'Cement manufacturing', 'Chemical processes', 'Aluminum smelting'],
            'Agriculture': ['Livestock methane', 'Rice cultivation', 'Fertilizer use', 'Deforestation']
        };
        
        return sources[sector] || [];
    }

    getReductionStrategies(sector) {
        const strategies = {
            'Energy': ['Renewable energy expansion', 'Energy efficiency improvements', 'Grid modernization', 'Carbon capture and storage'],
            'Transport': ['Electric vehicles', 'Public transportation', 'Biofuels', 'Active mobility (cycling, walking)'],
            'Industry': ['Process optimization', 'Circular economy practices', 'Clean technologies', 'Material substitution'],
            'Agriculture': ['Sustainable farming practices', 'Precision agriculture', 'Alternative proteins', 'Regenerative agriculture']
        };
        
        return strategies[sector] || [];
    }

    setupBarChartInteractions() {
        const barElements = document.querySelectorAll('.bar-fill, .growth-bar');
        
        barElements.forEach(bar => {
            bar.style.cursor = 'pointer';
            
            bar.addEventListener('mouseenter', () => {
                bar.style.filter = 'brightness(1.2)';
                bar.style.transform = 'scaleY(1.05)';
            });

            bar.addEventListener('mouseleave', () => {
                bar.style.filter = 'brightness(1)';
                bar.style.transform = 'scaleY(1)';
            });

            bar.addEventListener('click', () => {
                this.handleBarClick(bar);
            });
        });
    }

    handleBarClick(bar) {
        const barData = this.getBarData(bar);
        this.trackInteraction('chart_interaction', {
            chartType: 'bar',
            barData: barData
        });

        // Show bar-specific information
        if (barData) {
            this.showModal(barData.label, barData.details);
        }
    }

    getBarData(bar) {
        const label = bar.closest('.growth-bar')?.querySelector('.bar-label')?.textContent ||
                     bar.closest('.cost-bar')?.querySelector('.bar-label')?.textContent;
        
        if (!label) return null;

        const details = this.getDetailedBarInfo(label.trim());
        return { label: label.trim(), details };
    }

    getDetailedBarInfo(label) {
        const info = {
            'Solar': `
                <h3>Solar Energy Growth</h3>
                <p>Solar power has experienced exponential growth, with costs dropping by 89% over the past decade.</p>
                <ul>
                    <li>Fastest-growing renewable energy source</li>
                    <li>Becoming cost-competitive with fossil fuels</li>
                    <li>Huge potential for residential and utility-scale deployment</li>
                </ul>
            `,
            'Wind': `
                <h3>Wind Energy Expansion</h3>
                <p>Wind power is now one of the most cost-effective sources of electricity generation.</p>
                <ul>
                    <li>Offshore wind offers massive untapped potential</li>
                    <li>Modern turbines are larger and more efficient</li>
                    <li>Strong policy support driving rapid deployment</li>
                </ul>
            `,
            'Hydro': `
                <h3>Hydroelectric Power</h3>
                <p>The oldest and most established renewable energy source, providing reliable baseload power.</p>
                <ul>
                    <li>Excellent for grid stability and energy storage</li>
                    <li>Small hydro projects minimize environmental impact</li>
                    <li>Pumped hydro storage supports renewable integration</li>
                </ul>
            `,
            'Other': `
                <h3>Emerging Renewable Technologies</h3>
                <p>Innovative technologies including geothermal, tidal, and biomass energy.</p>
                <ul>
                    <li>Geothermal provides consistent, clean baseload power</li>
                    <li>Marine energy harnesses ocean currents and waves</li>
                    <li>Advanced biofuels from waste and algae</li>
                </ul>
            `
        };

        return info[label] || `<h3>${label}</h3><p>Detailed information about ${label} would be displayed here.</p>`;
    }

    setupLineChartInteractions() {
        const lineCharts = document.querySelectorAll('.line-chart, .temperature-chart');
        
        lineCharts.forEach(chart => {
            this.addChartHoverLine(chart);
        });
    }

    addChartHoverLine(chart) {
        const hoverLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hoverLine.setAttribute('stroke', '#3498db');
        hoverLine.setAttribute('stroke-width', '1');
        hoverLine.setAttribute('stroke-dasharray', '5,5');
        hoverLine.style.opacity = '0';
        hoverLine.style.pointerEvents = 'none';
        
        chart.appendChild(hoverLine);

        chart.addEventListener('mousemove', (e) => {
            const rect = chart.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            hoverLine.setAttribute('x1', x);
            hoverLine.setAttribute('y1', 0);
            hoverLine.setAttribute('x2', x);
            hoverLine.setAttribute('y2', rect.height);
            hoverLine.style.opacity = '1';
            
            // Show data point information
            this.showLineChartDataPoint(chart, x, y);
        });

        chart.addEventListener('mouseleave', () => {
            hoverLine.style.opacity = '0';
            this.hideLineChartDataPoint();
        });
    }

    showLineChartDataPoint(chart, x, y) {
        if (!this.chartDataPoint) {
            this.chartDataPoint = document.createElement('div');
            this.chartDataPoint.className = 'chart-data-point';
            this.chartDataPoint.style.cssText = `
                position: absolute;
                background: rgba(52, 152, 219, 0.95);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.875rem;
                z-index: 1000;
                pointer-events: none;
                backdrop-filter: blur(10px);
            `;
            document.body.appendChild(this.chartDataPoint);
        }

        // Calculate approximate data values based on position
        const chartRect = chart.getBoundingClientRect();
        const relativeX = x / chartRect.width;
        const relativeY = 1 - (y / chartRect.height);
        
        // Simulate data based on chart type
        let dataContent = '';
        if (chart.classList.contains('temperature-chart')) {
            const year = Math.round(1880 + (relativeX * 140));
            const tempAnomaly = (relativeY * 2 - 0.5).toFixed(2);
            dataContent = `Year: ${year}<br>Temperature Anomaly: ${tempAnomaly}°C`;
        } else {
            dataContent = `Data Point<br>X: ${(relativeX * 100).toFixed(1)}%<br>Y: ${(relativeY * 100).toFixed(1)}%`;
        }

        this.chartDataPoint.innerHTML = dataContent;
        this.chartDataPoint.style.left = (chartRect.left + x + 10) + 'px';
        this.chartDataPoint.style.top = (chartRect.top + y - 40) + 'px';
        this.chartDataPoint.style.display = 'block';
    }

    hideLineChartDataPoint() {
        if (this.chartDataPoint) {
            this.chartDataPoint.style.display = 'none';
        }
    }

    setupModalSystem() {
        // Create modal container
        this.modalContainer = document.createElement('div');
        this.modalContainer.className = 'modal-container';
        this.modalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

        document.body.appendChild(this.modalContainer);

        // Modal close on background click
        this.modalContainer.addEventListener('click', (e) => {
            if (e.target === this.modalContainer) {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.size > 0) {
                this.closeModal();
            }
        });
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        `;

        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            max-width: 90%;
            max-height: 90%;
            width: 600px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease;
        `;

        // Modal header styles
        const header = modal.querySelector('.modal-header');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #ecf0f1;
            background: linear-gradient(135deg, #3498db, #2ecc71);
            color: white;
        `;

        // Modal content styles
        const contentEl = modal.querySelector('.modal-content');
        contentEl.style.cssText = `
            padding: 2rem;
            overflow-y: auto;
            max-height: 60vh;
            line-height: 1.6;
        `;

        // Close button
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        `;

        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = 'transparent';
        });

        // Add modal animation keyframes
        if (!document.querySelector('#modal-animations')) {
            const style = document.createElement('style');
            style.id = 'modal-animations';
            style.textContent = `
                @keyframes modalSlideIn {
                    0% { opacity: 0; transform: translateY(-50px) scale(0.9); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes modalSlideOut {
                    0% { opacity: 1; transform: translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateY(-50px) scale(0.9); }
                }
            `;
            document.head.appendChild(style);
        }

        this.modalContainer.innerHTML = '';
        this.modalContainer.appendChild(modal);
        this.modalContainer.style.display = 'flex';
        this.activeModals.add(modal);

        // Focus management for accessibility
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        this.trackInteraction('modal_open', { title });
    }

    closeModal() {
        if (this.activeModals.size === 0) return;

        const modal = this.modalContainer.querySelector('.modal');
        if (modal) {
            modal.style.animation = 'modalSlideOut 0.3s ease';
            
            setTimeout(() => {
                this.modalContainer.style.display = 'none';
                this.modalContainer.innerHTML = '';
                this.activeModals.clear();
            }, 300);
        }

        this.trackInteraction('modal_close');
    }

    showSolutionDetails(card) {
        const title = card.querySelector('.solution-title')?.textContent || 'Solution Details';
        const description = card.querySelector('.solution-description')?.textContent || '';
        
        const content = `
            <div class="solution-details">
                <p>${description}</p>
                <div class="solution-implementation">
                    <h3>Implementation Strategies</h3>
                    <ul>
                        <li>Policy and regulatory frameworks</li>
                        <li>Technology development and deployment</li>
                        <li>Financial incentives and investment</li>
                        <li>Public awareness and education</li>
                    </ul>
                </div>
                <div class="solution-impact">
                    <h3>Expected Impact</h3>
                    <p>This solution could contribute significantly to reducing global greenhouse gas emissions and building a more sustainable future.</p>
                </div>
                <div class="solution-actions">
                    <h3>How You Can Help</h3>
                    <ul>
                        <li>Support businesses implementing these solutions</li>
                        <li>Advocate for supportive policies</li>
                        <li>Share knowledge with your community</li>
                        <li>Make sustainable choices in your daily life</li>
                    </ul>
                </div>
            </div>
        `;

        this.showModal(title, content);
    }

    showEnergyDetails(card) {
        const title = card.querySelector('.energy-title')?.textContent || 'Energy Details';
        const description = card.querySelector('.energy-description')?.textContent || '';
        
        const content = `
            <div class="energy-details">
                <p>${description}</p>
                <div class="energy-advantages">
                    <h3>Advantages</h3>
                    <ul>
                        <li>Clean and renewable energy source</li>
                        <li>Decreasing costs and improving efficiency</li>
                        <li>Job creation and economic benefits</li>
                        <li>Energy independence and security</li>
                    </ul>
                </div>
                <div class="energy-challenges">
                    <h3>Challenges</h3>
                    <ul>
                        <li>Intermittency and grid integration</li>
                        <li>Initial investment costs</li>
                        <li>Infrastructure requirements</li>
                        <li>Storage and transmission needs</li>
                    </ul>
                </div>
            </div>
        `;

        this.showModal(title, content);
    }

    showDataDetails(card) {
        const title = card.querySelector('.data-title')?.textContent || 'Data Details';
        
        const content = `
            <div class="data-details">
                <p>This data visualization presents current climate and environmental statistics from authoritative sources.</p>
                <div class="data-sources">
                    <h3>Data Sources</h3>
                    <ul>
                        <li>NASA Goddard Institute for Space Studies</li>
                        <li>NOAA National Centers for Environmental Information</li>
                        <li>Intergovernmental Panel on Climate Change (IPCC)</li>
                        <li>Global Carbon Atlas</li>
                    </ul>
                </div>
                <div class="data-methodology">
                    <h3>Methodology</h3>
                    <p>Data is collected from multiple monitoring stations worldwide and processed using standardized scientific methods to ensure accuracy and reliability.</p>
                </div>
            </div>
        `;

        this.showModal(title, content);
    }

    showGenericCardDetails(card) {
        const title = card.querySelector('.card-title')?.textContent || 'More Information';
        const description = card.querySelector('.card-description')?.textContent || '';
        
        const content = `
            <div class="card-details">
                <p>${description}</p>
                <div class="additional-info">
                    <h3>Learn More</h3>
                    <p>This topic is part of our comprehensive climate change education initiative. Explore related sections to deepen your understanding.</p>
                </div>
            </div>
        `;

        this.showModal(title, content);
    }

    createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(52, 152, 219, 0.3);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
            z-index: 1000;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);

        // Add ripple animation if not exists
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(4); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupTouchInteractions() {
        if (!this.isTouch) return;

        // Enhanced touch interactions for mobile devices
        let touchTimeout;

        document.addEventListener('touchstart', (e) => {
            this.touchStartPos.x = e.touches[0].clientX;
            this.touchStartPos.y = e.touches[0].clientY;
            
            // Long press detection
            touchTimeout = setTimeout(() => {
                this.handleLongPress(e);
            }, 500);
        });

        document.addEventListener('touchmove', () => {
            clearTimeout(touchTimeout);
        });

        document.addEventListener('touchend', () => {
            clearTimeout(touchTimeout);
        });
    }

    handleLongPress(event) {
        const element = event.target.closest('[data-tooltip], .crisis-card, .solution-card, .energy-card');
        if (element) {
            // Show additional options or context menu for touch devices
            this.showTouchContextMenu(element, event);
        }
    }

    showTouchContextMenu(element, event) {
        const menu = document.createElement('div');
        menu.className = 'touch-context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" data-action="details">
                <i class="fas fa-info-circle"></i>
                More Details
            </div>
            <div class="context-menu-item" data-action="share">
                <i class="fas fa-share"></i>
                Share
            </div>
            <div class="context-menu-item" data-action="bookmark">
                <i class="fas fa-bookmark"></i>
                Bookmark
            </div>
        `;

        menu.style.cssText = `
            position: fixed;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            min-width: 150px;
            animation: contextMenuSlideIn 0.2s ease;
        `;

        menu.style.left = event.touches[0].clientX + 'px';
        menu.style.top = event.touches[0].clientY + 'px';

        // Style menu items
        const items = menu.querySelectorAll('.context-menu-item');
        items.forEach(item => {
            item.style.cssText = `
                padding: 12px 16px;
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                border-bottom: 1px solid #ecf0f1;
                transition: background-color 0.2s ease;
            `;

            item.addEventListener('click', () => {
                this.handleContextMenuAction(item.getAttribute('data-action'), element);
                menu.remove();
            });
        });

        // Remove last border
        items[items.length - 1].style.borderBottom = 'none';

        document.body.appendChild(menu);

        // Remove menu on outside click
        setTimeout(() => {
            document.addEventListener('click', function removeMenu() {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            });
        }, 100);

        // Add animation
        if (!document.querySelector('#context-menu-animation')) {
            const style = document.createElement('style');
            style.id = 'context-menu-animation';
            style.textContent = `
                @keyframes contextMenuSlideIn {
                    0% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    handleContextMenuAction(action, element) {
        switch (action) {
            case 'details':
                this.handleCardClick(element, { clientX: 0, clientY: 0 });
                break;
            case 'share':
                this.shareElement(element);
                break;
            case 'bookmark':
                this.bookmarkElement(element);
                break;
        }
    }

    shareElement(element) {
        const title = element.querySelector('.card-title, .solution-title, .energy-title')?.textContent || 'Climate Education';
        const text = element.querySelector('.card-description, .solution-description, .energy-description')?.textContent || 'Learn about climate change and sustainability';

        if (navigator.share) {
            navigator.share({
                title: title,
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const shareText = `${title}\n${text}\n${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Content copied to clipboard!', 'success');
            });
        }

        this.trackInteraction('share', { element: title });
    }

    bookmarkElement(element) {
        const title = element.querySelector('.card-title, .solution-title, .energy-title')?.textContent || 'Climate Education';
        
        // Store in localStorage
        const bookmarks = JSON.parse(localStorage.getItem('climate_bookmarks') || '[]');
        const bookmark = {
            id: Date.now(),
            title: title,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        if (!bookmarks.find(b => b.title === title)) {
            bookmarks.push(bookmark);
            localStorage.setItem('climate_bookmarks', JSON.stringify(bookmarks));
            this.showNotification('Added to bookmarks!', 'success');
        } else {
            this.showNotification('Already bookmarked!', 'info');
        }

        this.trackInteraction('bookmark', { element: title });
    }

    initializeUserEngagement() {
        // Track user engagement metrics
        this.startEngagementTracking();
        
        // Set up visibility change tracking
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseEngagementTracking();
            } else {
                this.resumeEngagementTracking();
            }
        });

        // Track scroll depth
        this.setupScrollDepthTracking();
    }

    startEngagementTracking() {
        this.engagementInterval = setInterval(() => {
            this.userEngagement.timeOnPage += 1;
            this.updateEngagementDisplay();
        }, 1000);
    }

    pauseEngagementTracking() {
        clearInterval(this.engagementInterval);
    }

    resumeEngagementTracking() {
        this.startEngagementTracking();
    }

    setupScrollDepthTracking() {
        const sections = document.querySelectorAll('section[id]');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.userEngagement.sectionsViewed.add(entry.target.id);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    updateEngagementDisplay() {
        // Update engagement metrics in UI if needed
        const engagementDisplay = document.querySelector('#engagement-display');
        if (engagementDisplay) {
            engagementDisplay.innerHTML = `
                <div class="engagement-metric">
                    <span class="metric-label">Time on page:</span>
                    <span class="metric-value">${this.formatTime(this.userEngagement.timeOnPage)}</span>
                </div>
                <div class="engagement-metric">
                    <span class="metric-label">Sections viewed:</span>
                    <span class="metric-value">${this.userEngagement.sectionsViewed.size}/6</span>
                </div>
                <div class="engagement-metric">
                    <span class="metric-label">Interactions:</span>
                    <span class="metric-value">${this.userEngagement.interactionsCount}</span>
                </div>
            `;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    trackInteraction(type, data = {}) {
        this.userEngagement.interactionsCount++;
        
        const interaction = {
            type,
            timestamp: Date.now(),
            data
        };

        // Store interaction data (could be sent to analytics service)
        const interactions = JSON.parse(localStorage.getItem('climate_interactions') || '[]');
        interactions.push(interaction);
        
        // Keep only last 100 interactions
        if (interactions.length > 100) {
            interactions.splice(0, interactions.length - 100);
        }
        
        localStorage.setItem('climate_interactions', JSON.stringify(interactions));

        console.log('Interaction tracked:', interaction);
    }

    setupAccessibilityFeatures() {
        // Enhanced keyboard navigation
        this.setupKeyboardNavigation();
        
        // Screen reader announcements
        this.setupScreenReaderSupport();
        
        // High contrast mode detection
        this.setupContrastModeSupport();
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation for interactive elements
        const interactiveElements = document.querySelectorAll('.crisis-card, .solution-card, .energy-card, .data-card, .action-card');
        
        interactiveElements.forEach((element, index) => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            element.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        this.handleCardClick(element, e);
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        this.focusNextElement(interactiveElements, index);
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        this.focusPreviousElement(interactiveElements, index);
                        break;
                }
            });
        });
    }

    focusNextElement(elements, currentIndex) {
        const nextIndex = (currentIndex + 1) % elements.length;
        elements[nextIndex].focus();
    }

    focusPreviousElement(elements, currentIndex) {
        const prevIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
        elements[prevIndex].focus();
    }

    setupScreenReaderSupport() {
        // Create live region for announcements
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(this.liveRegion);
    }

    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }

    setupContrastModeSupport() {
        // Detect and respond to high contrast mode
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        
        const handleContrastChange = (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        };

        mediaQuery.addListener(handleContrastChange);
        handleContrastChange(mediaQuery);
    }

    showNotification(message, type = 'info') {
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
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Handle different interaction events
    handleMouseOver(event) {
        const element = event.target;
        
        // Enhanced hover effects for interactive elements
        if (element.classList.contains('nav-link')) {
            this.enhanceNavLinkHover(element);
        }
    }

    handleMouseOut(event) {
        const element = event.target;
        
        if (element.classList.contains('nav-link')) {
            this.resetNavLinkHover(element);
        }
    }

    handleClick(event) {
        const element = event.target;
        
        // Handle various click interactions
        if (element.classList.contains('btn')) {
            this.handleButtonClick(element, event);
        }
    }

    handleTouchStart(event) {
        // Store touch start position
        this.touchStartPos.x = event.touches[0].clientX;
        this.touchStartPos.y = event.touches[0].clientY;
    }

    handleTouchEnd(event) {
        // Calculate touch distance for swipe detection
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const deltaX = touchEndX - this.touchStartPos.x;
        const deltaY = touchEndY - this.touchStartPos.y;
        
        // Detect swipe gestures
        if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
            this.handleSwipe(deltaX, deltaY, event);
        }
    }

    handleSwipe(deltaX, deltaY, event) {
        // Handle swipe gestures for navigation
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                // Swipe right - previous section
                this.navigateToPreviousSection();
            } else {
                // Swipe left - next section
                this.navigateToNextSection();
            }
        }
    }

    navigateToPreviousSection() {
        const sections = ['hero', 'climate-crisis', 'data-visualization', 'solutions', 'renewable-energy', 'take-action'];
        const currentIndex = sections.indexOf(this.currentSection);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
        
        this.smoothScrollTo(sections[prevIndex]);
    }

    navigateToNextSection() {
        const sections = ['hero', 'climate-crisis', 'data-visualization', 'solutions', 'renewable-energy', 'take-action'];
        const currentIndex = sections.indexOf(this.currentSection);
        const nextIndex = (currentIndex + 1) % sections.length;
        
        this.smoothScrollTo(sections[nextIndex]);
    }

    smoothScrollTo(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    handleKeydown(event) {
        // Global keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'f':
                    // Custom search functionality could be added here
                    break;
                case 'h':
                    event.preventDefault();
                    this.smoothScrollTo('hero');
                    break;
            }
        }
        
        // Navigation shortcuts
        if (event.altKey) {
            switch (event.key) {
                case '1': this.smoothScrollTo('hero'); break;
                case '2': this.smoothScrollTo('climate-crisis'); break;
                case '3': this.smoothScrollTo('data-visualization'); break;
                case '4': this.smoothScrollTo('solutions'); break;
                case '5': this.smoothScrollTo('renewable-energy'); break;
                case '6': this.smoothScrollTo('take-action'); break;
            }
        }
    }

    handleResize() {
        // Update tooltip positions
        this.tooltips.forEach((tooltip, element) => {
            if (tooltip.style.opacity === '1') {
                this.showTooltip(element, tooltip);
            }
        });
        
        // Update modal positioning
        if (this.activeModals.size > 0) {
            // Recalculate modal positioning if needed
        }
    }

    handleScroll() {
        // Update current section based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.currentSection = section.id;
            }
        });
    }

    enhanceNavLinkHover(element) {
        // Add subtle animation to nav links
        element.style.transform = 'translateY(-2px)';
    }

    resetNavLinkHover(element) {
        element.style.transform = 'translateY(0)';
    }

    handleButtonClick(element, event) {
        // Add click feedback for buttons
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
        
        this.trackInteraction('button_click', {
            buttonText: element.textContent.trim(),
            buttonClass: element.className
        });
    }

    handleDOMReady() {
        console.log('Interactions Controller - DOM Ready');
        
        // Initialize any remaining interactive elements
        this.observeAnimatableElements();
        
        // Announce page ready to screen readers
        setTimeout(() => {
            this.announceToScreenReader('Climate Change Education website loaded. Navigate through sections using tab key or arrow keys.');
        }, 1000);
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

    // Public API
    addTooltip(element, text, position = 'top') {
        element.setAttribute('data-tooltip', text);
        element.setAttribute('data-tooltip-position', position);
        this.setupTooltip(element);
    }

    removeTooltip(element) {
        const tooltip = this.tooltips.get(element);
        if (tooltip) {
            tooltip.remove();
            this.tooltips.delete(element);
        }
        element.removeAttribute('data-tooltip');
        element.removeAttribute('data-tooltip-position');
    }

    destroy() {
        // Clean up event listeners and resources
        clearInterval(this.engagementInterval);
        
        // Remove tooltips
        this.tooltips.forEach(tooltip => tooltip.remove());
        this.tooltips.clear();
        
        // Remove modal container
        if (this.modalContainer) {
            this.modalContainer.remove();
        }
        
        // Remove live region
        if (this.liveRegion) {
            this.liveRegion.remove();
        }
        
        console.log('Interactions Controller destroyed');
    }
}

// Initialize the interactions controller
const interactionsController = new InteractionsController();

// Export for external use
window.InteractionsController = InteractionsController;
window.interactionsController = interactionsController;
