/**
 * Gallery functionality for EcoLearn website
 * Handles image gallery, filtering, modal display, and responsive behavior
 */

// Gallery data with images and metadata
const galleryData = [
    {
        id: 'climate-1',
        src: 'https://pixabay.com/get/g51af1bcca9a8f75bab190eeeca745bd41dad7f58be12a2cb9cee24fd7bf3d0073e08a56b249cc7c198f67252041656adde7a955636098fabe0f64a56b5448257_1280.jpg',
        category: 'climate',
        title: 'Environmental Impact of Climate Change',
        description: 'Visual representation of how climate change affects our natural environment, from melting glaciers to changing weather patterns.',
        alt: 'Environmental impacts of climate change illustration'
    },
    {
        id: 'climate-2',
        src: 'https://pixabay.com/get/g8e7ce3a8e051ee3697c048d6a63b22ff7e42c57de45a41c2427550b5ff569ca19523ec6360b437b43dc11cf01b1659af01f1b733cdd274c42a59fae012e20cb3_1280.jpg',
        category: 'climate',
        title: 'Global Warming Visualization',
        description: 'Data visualization showing global temperature trends and the acceleration of warming in recent decades.',
        alt: 'Global warming effects visualization'
    },
    {
        id: 'climate-3',
        src: 'https://pixabay.com/get/g819a72331464feca07de56b4f3b19517b7dbab015868d91bc3605ca15fe4e2cec2b83541fe99b34543bc4b4bc271b70fd457d0e8ec8ab62dd0bcdb72ea0ad802_1280.jpg',
        category: 'climate',
        title: 'Climate Action Solutions',
        description: 'Innovative approaches and technologies being developed to address climate change challenges worldwide.',
        alt: 'Climate action and solutions'
    },
    {
        id: 'climate-4',
        src: 'https://pixabay.com/get/g0632a35ad2e63d6f7d0ca07d601e62880e977c712e3333caf6e00e4fcbeb6a3bdd23f2ee4d84103efe304a8acb0a2b529fdac41510357d9cfb0ccf2d1a5d76c5_1280.jpg',
        category: 'climate',
        title: 'Climate Research and Monitoring',
        description: 'Scientific research and monitoring systems that help us understand and track climate change patterns.',
        alt: 'Climate research and monitoring equipment'
    },
    {
        id: 'climate-5',
        src: 'https://pixabay.com/get/g2653db29d9b53a99954052d674644683dc7c581290c312069d95b5ec33c800cb2e43243346df9c0a22c28f338a853c2073b0238df2f94979a8c775936503b9d1_1280.jpg',
        category: 'climate',
        title: 'Climate Change Awareness',
        description: 'Educational initiatives and awareness campaigns highlighting the importance of climate action.',
        alt: 'Climate change awareness campaign'
    },
    {
        id: 'climate-6',
        src: 'https://pixabay.com/get/gc74e0584cbbd8e2424ca0e513bdf3f5000d7d0a38f83cbaa29dad37d0815670eb7b4e94dea62db81c0274524fdb25acebf6f86ba462f32bda936bfa8a74c8f93_1280.jpg',
        category: 'climate',
        title: 'Environmental Conservation',
        description: 'Conservation efforts and natural habitat protection as part of climate change mitigation strategies.',
        alt: 'Environmental conservation efforts'
    },
    {
        id: 'sustainability-1',
        src: 'https://pixabay.com/get/ged9dd58903a940c002bf2645b6b02a7225fc92559f9d9e2ccafe3cc16ea35464817ff3d0cf80870fa4042b16a399ad431d573d14e8b18329c3183b546a088f0d_1280.jpg',
        category: 'sustainability',
        title: 'Sustainable Living Concepts',
        description: 'Practical examples of sustainable living practices that individuals and communities can adopt.',
        alt: 'Sustainable living concepts'
    },
    {
        id: 'sustainability-2',
        src: 'https://pixabay.com/get/ge6803e777b352e9feb9b1517b543e87c578a95335b4d38a5f6399cad9df0482ec383ba35e5be1cb75399d7404bfd1dbb7a0d696fec3c6e7ca78db6f179539fbc_1280.jpg',
        category: 'sustainability',
        title: 'Circular Economy Principles',
        description: 'Illustration of circular economy principles and how they create sustainable business models.',
        alt: 'Circular economy principles'
    },
    {
        id: 'sustainability-3',
        src: 'https://pixabay.com/get/g837a92369f8e7368ed2e1f3195bb0696c886072345c07be55ef48eb94b25386e6f51e73d48cd6fbc40b45e5993901a1e46ede6f3d95d70534dddd0d4f78e2753_1280.jpg',
        category: 'sustainability',
        title: 'Sustainable Practices in Daily Life',
        description: 'Everyday sustainable practices that contribute to environmental protection and resource conservation.',
        alt: 'Sustainable practices in daily life'
    },
    {
        id: 'sustainability-4',
        src: 'https://pixabay.com/get/g2f645a4c553ce1d25a3fd402b58eb63bfa719afaed6849c5e486f37ed4b62df379f4ccdb08d7d8946270f1e6d66c66824accf1deb584d498fdb8511b22a545c2_1280.jpg',
        category: 'sustainability',
        title: 'Green Technology Innovation',
        description: 'Innovative green technologies that support sustainable development and environmental protection.',
        alt: 'Green technology innovation'
    },
    {
        id: 'sustainability-5',
        src: 'https://pixabay.com/get/gdc8572fcc3116cc887e885ddf959b174f54cfad69cb16fdae225a87f4164de551c9a34794acd834bc838a83fb88d31b392f64844b22d02b9e00dcd57717b6c22_1280.jpg',
        category: 'sustainability',
        title: 'Sustainable Agriculture',
        description: 'Agricultural practices that maintain soil health, conserve water, and reduce environmental impact.',
        alt: 'Sustainable agriculture practices'
    },
    {
        id: 'sustainability-6',
        src: 'https://pixabay.com/get/gbbda590ffd48de28d76ec39d87e5f5875a92590eede37438428aeb0e2cca805e4852bd7799954650429f285dc040d80fb84029f15c8faa4881de75fce19794c3_1280.jpg',
        category: 'sustainability',
        title: 'Eco-Friendly Urban Planning',
        description: 'Urban planning strategies that integrate sustainability principles for livable, green cities.',
        alt: 'Eco-friendly urban planning'
    },
    {
        id: 'protection-1',
        src: 'https://pixabay.com/get/g42a6a10524308fe90335b8c390cc2eae5583875a66b965219922252a9f2b2f4ed67db3c5c9eb1878358c9272ad7f37287f343e3b88535394620e673dea2a04b7_1280.jpg',
        category: 'protection',
        title: 'Forest Conservation and Protection',
        description: 'Forest conservation efforts protecting biodiversity and carbon sequestration capabilities.',
        alt: 'Forest conservation and protection'
    },
    {
        id: 'protection-2',
        src: 'https://pixabay.com/get/gea89c2e073f288e217e6c17f7afe7a7fd2cc6b46aaebf1c4c3b338b869dcc7ccb3d0bee9de173e141982f44f7bda71bec883490f076935f657e5463bb3793013_1280.jpg',
        category: 'protection',
        title: 'Ocean and Marine Protection',
        description: 'Marine conservation initiatives protecting ocean ecosystems and marine biodiversity.',
        alt: 'Ocean and marine protection'
    },
    {
        id: 'protection-3',
        src: 'https://pixabay.com/get/gc32e23b1fe4577ed7359334e3c5f470e7966708ec9da43b010727ae821908cf01fc8e70d206d2d82d0444ee6188a29281578a817b215301afb54b4f69839a374_1280.jpg',
        category: 'protection',
        title: 'Air Quality and Pollution Control',
        description: 'Air quality monitoring and pollution control measures for healthier urban environments.',
        alt: 'Air quality and pollution control'
    },
    {
        id: 'protection-4',
        src: 'https://pixabay.com/get/g260701fb9b80ecd057b8eac8f79174176f20b7796a4776fedaabb529ca0c399f79441f02a86b79cb895486c0dcffae6161e1d6c923c9d63a1b98b80bf06bd88e_1280.jpg',
        category: 'protection',
        title: 'Wildlife Conservation',
        description: 'Wildlife conservation programs protecting endangered species and natural habitats.',
        alt: 'Wildlife conservation efforts'
    },
    {
        id: 'renewable-1',
        src: 'https://pixabay.com/get/gd3c84940e3bd716a8ae3e276831d6f72a3c36a9f6c51627d2f71070124a39bd56d02f70c98d2ad11c48111842c1256769f11d0d36b1f9469e9a9578211a5a3df_1280.jpg',
        category: 'renewable',
        title: 'Solar Energy Infrastructure',
        description: 'Large-scale solar energy installations providing clean electricity for communities.',
        alt: 'Solar energy panels and wind turbines'
    },
    {
        id: 'renewable-2',
        src: 'https://pixabay.com/get/g5d3c01c1569fd4ceb3b9c141a8b40cbb0a2cc15146032ea045e116882d070a64f2b76094e1893306b753406eaf17f6923d39f949af5caef0c5660f2e4c1a7668_1280.jpg',
        category: 'renewable',
        title: 'Wind Energy Generation',
        description: 'Modern wind turbines harnessing wind power for sustainable electricity generation.',
        alt: 'Wind energy turbines'
    },
    {
        id: 'renewable-3',
        src: 'https://pixabay.com/get/g0a328cd05e7a059e6eb2badc33d5f67be5673429b4a01de59eb1e4351487b19bbbfe0b24ada4744114ab6d61d9ba30e90268ea7dfdeffd58f3e6648a1627d430_1280.jpg',
        category: 'renewable',
        title: 'Hydroelectric Power Generation',
        description: 'Hydroelectric facilities utilizing water flow for clean, renewable energy production.',
        alt: 'Hydroelectric power generation'
    },
    {
        id: 'renewable-4',
        src: 'https://pixabay.com/get/gfa59936985a377012a621b5de6cf34787abda60090059f9887dfc6f1cc4b7c9b239af593af796a4bb6292ff6ae7b9f9cd7122250f98ce3309feecec03695ee24_1280.jpg',
        category: 'renewable',
        title: 'Renewable Energy Innovation',
        description: 'Cutting-edge renewable energy technologies and innovative sustainable power solutions.',
        alt: 'Renewable energy innovation'
    }
];

// Gallery state
let currentFilter = 'all';
let currentModalImage = null;

/**
 * Initialize gallery functionality
 */
function initializeGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('gallery-modal');
    
    if (!galleryContainer) {
        console.warn('Gallery container not found');
        return;
    }
    
    // Render initial gallery
    renderGallery(galleryData);
    
    // Add filter event listeners
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', handleFilterClick);
        });
    }
    
    // Initialize modal functionality
    if (modal) {
        initializeModal();
    }
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
    // Add intersection observer for lazy loading
    initializeLazyLoading();
    
    console.log('Gallery functionality initialized');
}

/**
 * Render gallery with given items
 */
function renderGallery(items) {
    const galleryContainer = document.getElementById('gallery-container');
    
    if (items.length === 0) {
        galleryContainer.innerHTML = `
            <div class="gallery-empty">
                <h3>No images found</h3>
                <p>No images match the current filter. Try selecting a different category.</p>
            </div>
        `;
        return;
    }
    
    const galleryHTML = items.map((item, index) => `
        <div class="gallery-item" 
             data-category="${item.category}" 
             data-index="${index}"
             tabindex="0"
             role="button"
             aria-label="View ${item.title}">
            <img src="${item.src}" 
                 alt="${item.alt}" 
                 loading="lazy"
                 data-title="${item.title}"
                 data-description="${item.description}">
            <div class="gallery-overlay">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        </div>
    `).join('');
    
    galleryContainer.innerHTML = galleryHTML;
    
    // Add event listeners to gallery items
    addGalleryItemListeners();
    
    // Animate items in
    animateGalleryItems();
}

/**
 * Add event listeners to gallery items
 */
function addGalleryItemListeners() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        // Click event
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            openModal(img, index);
        });
        
        // Keyboard events
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const img = item.querySelector('img');
                openModal(img, index);
            }
        });
        
        // Hover events for accessibility
        item.addEventListener('mouseenter', () => {
            item.setAttribute('aria-pressed', 'true');
        });
        
        item.addEventListener('mouseleave', () => {
            item.setAttribute('aria-pressed', 'false');
        });
    });
}

/**
 * Handle filter button clicks
 */
function handleFilterClick(e) {
    e.preventDefault();
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const selectedFilter = e.target.dataset.filter;
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update current filter
    currentFilter = selectedFilter;
    
    // Filter and render gallery
    const filteredItems = filterGalleryItems(selectedFilter);
    renderGallery(filteredItems);
    
    // Announce filter change for screen readers
    announceFilterChange(selectedFilter, filteredItems.length);
}

/**
 * Filter gallery items by category
 */
function filterGalleryItems(filter) {
    if (filter === 'all') {
        return galleryData;
    }
    
    return galleryData.filter(item => item.category === filter);
}

/**
 * Initialize modal functionality
 */
function initializeModal() {
    const modal = document.getElementById('gallery-modal');
    const modalClose = document.querySelector('.modal-close');
    
    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard events for modal
    document.addEventListener('keydown', handleModalKeydown);
}

/**
 * Open modal with image
 */
function openModal(img, index) {
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    
    if (!modal || !modalImage || !modalTitle || !modalDescription) {
        console.warn('Modal elements not found');
        return;
    }
    
    // Set modal content
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalTitle.textContent = img.dataset.title;
    modalDescription.textContent = img.dataset.description;
    
    // Set current modal image index
    currentModalImage = index;
    
    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus modal for accessibility
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.focus();
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Trap focus in modal
    trapModalFocus();
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.getElementById('gallery-modal');
    
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        currentModalImage = null;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to gallery item that opened modal
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (currentModalImage !== null && galleryItems[currentModalImage]) {
            galleryItems[currentModalImage].focus();
        }
    }
}

/**
 * Handle modal keyboard navigation
 */
function handleModalKeydown(e) {
    const modal = document.getElementById('gallery-modal');
    
    if (!modal.classList.contains('active')) {
        return;
    }
    
    switch (e.key) {
        case 'Escape':
            e.preventDefault();
            closeModal();
            break;
            
        case 'ArrowLeft':
            e.preventDefault();
            navigateModal(-1);
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            navigateModal(1);
            break;
    }
}

/**
 * Navigate to previous/next image in modal
 */
function navigateModal(direction) {
    if (currentModalImage === null) return;
    
    const filteredItems = filterGalleryItems(currentFilter);
    const newIndex = (currentModalImage + direction + filteredItems.length) % filteredItems.length;
    
    const newItem = filteredItems[newIndex];
    if (newItem) {
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        
        modalImage.src = newItem.src;
        modalImage.alt = newItem.alt;
        modalTitle.textContent = newItem.title;
        modalDescription.textContent = newItem.description;
        
        currentModalImage = newIndex;
    }
}

/**
 * Trap focus within modal
 */
function trapModalFocus() {
    const modal = document.getElementById('gallery-modal');
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

/**
 * Add keyboard navigation for gallery
 */
function addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Only handle keys when gallery is focused
        const activeElement = document.activeElement;
        if (!activeElement.classList.contains('gallery-item')) {
            return;
        }
        
        const galleryItems = document.querySelectorAll('.gallery-item');
        const currentIndex = Array.from(galleryItems).indexOf(activeElement);
        
        let newIndex = currentIndex;
        
        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                newIndex = (currentIndex + 1) % galleryItems.length;
                break;
                
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = currentIndex === 0 ? galleryItems.length - 1 : currentIndex - 1;
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                // Move to next row (assuming grid layout)
                const itemsPerRow = getItemsPerRow();
                newIndex = Math.min(currentIndex + itemsPerRow, galleryItems.length - 1);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                // Move to previous row
                const itemsPerRowUp = getItemsPerRow();
                newIndex = Math.max(currentIndex - itemsPerRowUp, 0);
                break;
                
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
                
            case 'End':
                e.preventDefault();
                newIndex = galleryItems.length - 1;
                break;
        }
        
        if (newIndex !== currentIndex && galleryItems[newIndex]) {
            galleryItems[newIndex].focus();
        }
    });
}

/**
 * Get number of items per row in current layout
 */
function getItemsPerRow() {
    const galleryContainer = document.getElementById('gallery-container');
    const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
    
    if (galleryItems.length < 2) return 1;
    
    const firstItemRect = galleryItems[0].getBoundingClientRect();
    const secondItemRect = galleryItems[1].getBoundingClientRect();
    
    // If second item is on the same row as first item
    if (Math.abs(firstItemRect.top - secondItemRect.top) < 10) {
        let itemsPerRow = 1;
        
        for (let i = 1; i < galleryItems.length; i++) {
            const itemRect = galleryItems[i].getBoundingClientRect();
            if (Math.abs(firstItemRect.top - itemRect.top) < 10) {
                itemsPerRow++;
            } else {
                break;
            }
        }
        
        return itemsPerRow;
    }
    
    return 1;
}

/**
 * Initialize lazy loading for gallery images
 */
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loading state
                    img.classList.add('loading');
                    
                    // Create new image to preload
                    const newImg = new Image();
                    newImg.onload = () => {
                        img.src = newImg.src;
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    };
                    
                    newImg.onerror = () => {
                        img.classList.remove('loading');
                        img.classList.add('error');
                        console.warn('Failed to load image:', img.src);
                    };
                    
                    newImg.src = img.src;
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        // Observe gallery images
        const observeGalleryImages = () => {
            const images = document.querySelectorAll('.gallery-item img[loading="lazy"]');
            images.forEach(img => imageObserver.observe(img));
        };
        
        // Initial observation
        observeGalleryImages();
        
        // Re-observe after gallery updates
        const galleryContainer = document.getElementById('gallery-container');
        if (galleryContainer) {
            const mutationObserver = new MutationObserver(() => {
                observeGalleryImages();
            });
            
            mutationObserver.observe(galleryContainer, {
                childList: true,
                subtree: true
            });
        }
    }
}

/**
 * Animate gallery items on load
 */
function animateGalleryItems() {
    // Only animate if user hasn't requested reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        // Animate in with stagger
        setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

/**
 * Announce filter change for screen readers
 */
function announceFilterChange(filter, count) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        const filterName = filter === 'all' ? 'all categories' : formatFilterName(filter);
        const message = `Showing ${count} image${count !== 1 ? 's' : ''} from ${filterName}`;
        liveRegion.textContent = message;
    }
}

/**
 * Format filter name for display
 */
function formatFilterName(filter) {
    const filterNames = {
        'climate': 'Climate Change',
        'sustainability': 'Sustainability',
        'renewable': 'Renewable Energy',
        'protection': 'Environmental Protection'
    };
    
    return filterNames[filter] || filter;
}

/**
 * Add gallery-specific styles
 */
function addGalleryStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .gallery-item img.loading {
            opacity: 0.6;
            background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
            background-size: 400% 100%;
            animation: shimmer 1.5s ease-in-out infinite;
        }
        
        .gallery-item img.loaded {
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        
        .gallery-item img.error {
            opacity: 0.5;
            background-color: var(--color-background-alt);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .gallery-item img.error::after {
            content: 'Image not available';
            color: var(--color-text-secondary);
            font-size: var(--font-size-sm);
        }
        
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        .gallery-empty {
            grid-column: 1 / -1;
            text-align: center;
            padding: var(--spacing-4xl);
            color: var(--color-text-secondary);
        }
        
        .gallery-item:focus {
            outline: 3px solid var(--color-primary);
            outline-offset: 2px;
        }
        
        .modal.active {
            display: flex !important;
        }
        
        .modal-content img {
            max-width: 100%;
            height: auto;
        }
        
        @media (max-width: 767px) {
            .gallery-item {
                transition: transform 0.2s ease;
            }
            
            .gallery-item:active {
                transform: scale(0.98);
            }
        }
        
        @media (prefers-reduced-motion: reduce) {
            .gallery-item,
            .gallery-item img {
                transition: none !important;
                animation: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    addGalleryStyles();
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeGallery,
        renderGallery,
        filterGalleryItems,
        openModal,
        closeModal,
        handleFilterClick
    };
}
