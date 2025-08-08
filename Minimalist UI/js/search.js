/**
 * Search functionality for EcoLearn website
 * Handles content search, filtering, and result display
 */

// Search data structure containing all searchable content
const searchData = [
    {
        id: 'climate-what-is',
        title: 'What is Climate Change?',
        content: 'Climate change refers to long-term shifts in global temperatures and weather patterns. While natural variations occur, scientific evidence shows human activities are the primary driver since the 1800s. Global average temperature has risen 1.1°C since pre-industrial times. CO2 levels are at their highest in 3 million years. Human activities produce 36+ billion tons of CO2 annually.',
        section: 'climate-change',
        category: 'climate',
        url: '#climate-change'
    },
    {
        id: 'climate-impacts',
        title: 'Observable Climate Impacts',
        content: 'Climate change effects are already visible worldwide, affecting ecosystems, weather patterns, and human communities. Sea level rise: 21-24cm since 1880. Arctic sea ice declining 13% per decade. Increased frequency of extreme weather events. Ocean acidification threatening marine life.',
        section: 'climate-change',
        category: 'climate',
        url: '#climate-change'
    },
    {
        id: 'climate-action',
        title: 'Taking Climate Action',
        content: 'Addressing climate change requires immediate action at individual, community, and global levels. Transition to renewable energy sources. Improve energy efficiency in buildings. Adopt sustainable transportation. Support climate-friendly policies.',
        section: 'climate-change',
        category: 'climate',
        url: '#climate-change'
    },
    {
        id: 'sustainability-pillars',
        title: 'The Three Pillars of Sustainability',
        content: 'Sustainability rests on three interconnected pillars that must work together for true sustainable development. Environmental: Protecting ecosystems and natural resources. Economic: Ensuring prosperity and financial stability. Social: Promoting equity, health, and well-being.',
        section: 'sustainability',
        category: 'sustainability',
        url: '#sustainability'
    },
    {
        id: 'circular-economy',
        title: 'Circular Economy',
        content: 'Moving away from the linear take-make-waste model to a regenerative approach that eliminates waste and maximizes resource use. Design out waste and pollution. Keep products and materials in use. Regenerate natural systems. Powered by renewable energy.',
        section: 'sustainability',
        category: 'sustainability',
        url: '#sustainability'
    },
    {
        id: 'everyday-actions',
        title: 'Everyday Sustainability Actions',
        content: 'Small daily choices can make a significant collective impact on sustainability. Reduce, reuse, recycle materials. Choose sustainable transportation. Support local and ethical businesses. Conserve energy and water.',
        section: 'sustainability',
        category: 'sustainability',
        url: '#sustainability'
    },
    {
        id: 'solar-power',
        title: 'Solar Power',
        content: 'Solar energy harnesses sunlight through photovoltaic cells or thermal collectors, providing clean electricity and heating. Fastest-growing energy source globally. Costs have dropped 80% since 2010. Can power homes, businesses, and utilities. Creates jobs in manufacturing and installation.',
        section: 'renewable-energy',
        category: 'renewable',
        url: '#renewable-energy'
    },
    {
        id: 'wind-energy',
        title: 'Wind Energy',
        content: 'Wind turbines convert kinetic energy from moving air into electricity, offering scalable clean energy solutions. Second-largest renewable energy source. Onshore and offshore installations. Can power millions of homes. Minimal environmental footprint.',
        section: 'renewable-energy',
        category: 'renewable',
        url: '#renewable-energy'
    },
    {
        id: 'other-renewables',
        title: 'Other Renewable Energy Sources',
        content: 'Hydroelectric, geothermal, and biomass energy provide diverse renewable options for different regions and needs. Hydroelectric: Uses flowing water. Geothermal: Harnesses Earth heat. Biomass: Converts organic matter. Tidal: Captures ocean energy.',
        section: 'renewable-energy',
        category: 'renewable',
        url: '#renewable-energy'
    },
    {
        id: 'biodiversity-conservation',
        title: 'Biodiversity Conservation',
        content: 'Protecting the variety of life on Earth is crucial for ecosystem stability and human well-being. 1 million species face extinction risk. Forests store 1/3 of global CO2 emissions. Protected areas cover 15% of land surface. Indigenous communities protect 80% of biodiversity.',
        section: 'environmental-protection',
        category: 'protection',
        url: '#environmental-protection'
    },
    {
        id: 'ocean-health',
        title: 'Ocean Health',
        content: 'Oceans regulate climate, provide oxygen, and support billions of people worldwide. Oceans produce 70% of our oxygen. 8 million tons of plastic enter oceans annually. 30% of CO2 emissions absorbed by oceans. Marine protected areas growing globally.',
        section: 'environmental-protection',
        category: 'protection',
        url: '#environmental-protection'
    },
    {
        id: 'pollution-prevention',
        title: 'Pollution Prevention',
        content: 'Reducing air, water, and soil pollution protects human health and environmental quality. Air pollution causes 7 million deaths annually. 2 billion people lack safe drinking water. Soil degradation affects 1/3 of farmland. Clean technology solutions expanding rapidly.',
        section: 'environmental-protection',
        category: 'protection',
        url: '#environmental-protection'
    }
];

// Search configuration
const searchConfig = {
    minQueryLength: 2,
    maxResults: 10,
    highlightTags: ['<mark>', '</mark>'],
    debounceDelay: 300
};

let searchTimeout;

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const searchResultsContainer = document.getElementById('search-results-container');
    
    if (!searchInput || !searchButton || !searchResults || !searchResultsContainer) {
        console.warn('Search elements not found');
        return;
    }
    
    // Add event listeners
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeydown);
    searchButton.addEventListener('click', handleSearchClick);
    
    // Listen for custom search events
    document.addEventListener('search', handleSearchEvent);
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && !searchInput.contains(e.target) && !searchButton.contains(e.target)) {
            hideSearchResults();
        }
    });
    
    // Close search results on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideSearchResults();
            searchInput.blur();
        }
    });
    
    console.log('Search functionality initialized');
}

/**
 * Handle search input events
 */
function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Debounce search
    searchTimeout = setTimeout(() => {
        if (query.length >= searchConfig.minQueryLength) {
            performSearch(query);
        } else {
            hideSearchResults();
        }
    }, searchConfig.debounceDelay);
}

/**
 * Handle search keydown events
 */
function handleSearchKeydown(e) {
    const searchResultsContainer = document.getElementById('search-results-container');
    const activeResult = searchResultsContainer.querySelector('.search-result-item.active');
    
    switch (e.key) {
        case 'Enter':
            e.preventDefault();
            if (activeResult) {
                const link = activeResult.querySelector('a');
                if (link) {
                    link.click();
                }
            } else {
                const query = e.target.value.trim();
                if (query.length >= searchConfig.minQueryLength) {
                    performSearch(query);
                }
            }
            break;
            
        case 'ArrowDown':
            e.preventDefault();
            navigateSearchResults('down');
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            navigateSearchResults('up');
            break;
            
        case 'Escape':
            hideSearchResults();
            e.target.blur();
            break;
    }
}

/**
 * Handle search button clicks
 */
function handleSearchClick(e) {
    e.preventDefault();
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query.length >= searchConfig.minQueryLength) {
        performSearch(query);
    }
}

/**
 * Handle custom search events
 */
function handleSearchEvent(e) {
    const query = e.detail.query.trim();
    
    if (query.length >= searchConfig.minQueryLength) {
        performSearch(query);
    }
}

/**
 * Perform search operation
 */
function performSearch(query) {
    const results = searchContent(query);
    displaySearchResults(results, query);
    
    // Announce results for screen readers
    announceSearchResults(results.length, query);
}

/**
 * Search content based on query
 */
function searchContent(query) {
    const lowercaseQuery = query.toLowerCase();
    const queryWords = lowercaseQuery.split(/\s+/).filter(word => word.length > 0);
    
    const results = searchData.map(item => {
        const titleScore = calculateRelevanceScore(item.title.toLowerCase(), queryWords);
        const contentScore = calculateRelevanceScore(item.content.toLowerCase(), queryWords);
        const categoryScore = item.category.toLowerCase().includes(lowercaseQuery) ? 10 : 0;
        
        const totalScore = titleScore * 3 + contentScore + categoryScore;
        
        if (totalScore > 0) {
            return {
                ...item,
                score: totalScore,
                highlightedTitle: highlightMatches(item.title, queryWords),
                highlightedContent: highlightMatches(item.content, queryWords, 150)
            };
        }
        
        return null;
    }).filter(Boolean);
    
    // Sort by relevance score (descending)
    results.sort((a, b) => b.score - a.score);
    
    // Limit results
    return results.slice(0, searchConfig.maxResults);
}

/**
 * Calculate relevance score for text
 */
function calculateRelevanceScore(text, queryWords) {
    let score = 0;
    
    queryWords.forEach(word => {
        const wordRegex = new RegExp(word, 'gi');
        const matches = text.match(wordRegex);
        
        if (matches) {
            score += matches.length;
            
            // Bonus for exact word matches
            const exactWordRegex = new RegExp(`\\b${word}\\b`, 'gi');
            const exactMatches = text.match(exactWordRegex);
            if (exactMatches) {
                score += exactMatches.length * 2;
            }
        }
    });
    
    return score;
}

/**
 * Highlight search matches in text
 */
function highlightMatches(text, queryWords, maxLength = 0) {
    let highlightedText = text;
    
    queryWords.forEach(word => {
        const regex = new RegExp(`(${escapeRegExp(word)})`, 'gi');
        highlightedText = highlightedText.replace(regex, `${searchConfig.highlightTags[0]}$1${searchConfig.highlightTags[1]}`);
    });
    
    // Truncate if needed
    if (maxLength > 0 && text.length > maxLength) {
        const truncatedText = text.substring(0, maxLength) + '...';
        highlightedText = highlightedText.substring(0, maxLength + highlightedText.length - text.length) + '...';
    }
    
    return highlightedText;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Display search results
 */
function displaySearchResults(results, query) {
    const searchResults = document.getElementById('search-results');
    const searchResultsContainer = document.getElementById('search-results-container');
    
    // Clear previous results
    searchResultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        searchResultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No results found</h3>
                <p>No content found for "${escapeHtml(query)}". Try different keywords or browse our sections directly.</p>
                <div class="search-suggestions">
                    <h4>Suggested topics:</h4>
                    <ul>
                        <li><a href="#climate-change">Climate Change</a></li>
                        <li><a href="#sustainability">Sustainability</a></li>
                        <li><a href="#renewable-energy">Renewable Energy</a></li>
                        <li><a href="#environmental-protection">Environmental Protection</a></li>
                    </ul>
                </div>
            </div>
        `;
    } else {
        const resultsHTML = results.map((result, index) => `
            <div class="search-result-item" data-index="${index}" tabindex="0">
                <h3>${result.highlightedTitle}</h3>
                <p>${result.highlightedContent}</p>
                <a href="${result.url}" class="result-link">View in ${formatSectionName(result.section)}</a>
            </div>
        `).join('');
        
        searchResultsContainer.innerHTML = resultsHTML;
        
        // Add event listeners to results
        const resultItems = searchResultsContainer.querySelectorAll('.search-result-item');
        resultItems.forEach((item, index) => {
            item.addEventListener('click', () => handleResultClick(results[index]));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    handleResultClick(results[index]);
                }
            });
            
            // Add hover effects
            item.addEventListener('mouseenter', () => {
                removeActiveResult();
                item.classList.add('active');
            });
        });
    }
    
    // Show search results section
    searchResults.style.display = 'block';
    
    // Scroll to results
    setTimeout(() => {
        searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * Handle result click
 */
function handleResultClick(result) {
    hideSearchResults();
    
    // Navigate to the result
    const targetElement = document.querySelector(result.url);
    if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update URL
        history.pushState(null, null, result.url);
        
        // Clear search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Highlight the relevant content temporarily
        highlightResultContent(result);
    }
}

/**
 * Highlight result content on the page
 */
function highlightResultContent(result) {
    const targetSection = document.getElementById(result.section);
    if (targetSection) {
        // Add temporary highlight class
        targetSection.classList.add('search-highlight');
        
        // Remove highlight after animation
        setTimeout(() => {
            targetSection.classList.remove('search-highlight');
        }, 2000);
    }
}

/**
 * Navigate search results with keyboard
 */
function navigateSearchResults(direction) {
    const searchResultsContainer = document.getElementById('search-results-container');
    const resultItems = searchResultsContainer.querySelectorAll('.search-result-item');
    
    if (resultItems.length === 0) return;
    
    const activeResult = searchResultsContainer.querySelector('.search-result-item.active');
    let newIndex = 0;
    
    if (activeResult) {
        const currentIndex = parseInt(activeResult.dataset.index);
        
        if (direction === 'down') {
            newIndex = (currentIndex + 1) % resultItems.length;
        } else {
            newIndex = currentIndex === 0 ? resultItems.length - 1 : currentIndex - 1;
        }
        
        activeResult.classList.remove('active');
    }
    
    const newActiveResult = resultItems[newIndex];
    newActiveResult.classList.add('active');
    newActiveResult.focus();
    
    // Scroll result into view if needed
    newActiveResult.scrollIntoView({ block: 'nearest' });
}

/**
 * Remove active result highlighting
 */
function removeActiveResult() {
    const activeResult = document.querySelector('.search-result-item.active');
    if (activeResult) {
        activeResult.classList.remove('active');
    }
}

/**
 * Hide search results
 */
function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
    
    removeActiveResult();
}

/**
 * Format section name for display
 */
function formatSectionName(sectionId) {
    const sectionNames = {
        'climate-change': 'Climate Change',
        'sustainability': 'Sustainability',
        'renewable-energy': 'Renewable Energy',
        'environmental-protection': 'Environmental Protection'
    };
    
    return sectionNames[sectionId] || sectionId;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Announce search results for screen readers
 */
function announceSearchResults(count, query) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        const message = count === 0 
            ? `No results found for "${query}"`
            : `${count} result${count !== 1 ? 's' : ''} found for "${query}"`;
        
        liveRegion.textContent = message;
    }
}

/**
 * Add search highlight animation styles
 */
function addSearchStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .search-highlight {
            animation: searchHighlight 2s ease-out;
        }
        
        @keyframes searchHighlight {
            0% { background-color: rgba(34, 197, 94, 0.3); }
            100% { background-color: transparent; }
        }
        
        .search-result-item {
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        
        .search-result-item:hover,
        .search-result-item.active {
            background-color: var(--color-background-alt);
        }
        
        .search-result-item mark {
            background-color: var(--color-primary-light);
            color: var(--color-text-primary);
            padding: 1px 2px;
            border-radius: 2px;
        }
        
        .no-results {
            text-align: center;
            padding: var(--spacing-2xl);
        }
        
        .search-suggestions ul {
            list-style: none;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-md);
            justify-content: center;
            margin-top: var(--spacing-md);
        }
        
        .search-suggestions li {
            margin: 0;
        }
        
        .search-suggestions a {
            display: inline-block;
            padding: var(--spacing-xs) var(--spacing-md);
            background-color: var(--color-primary);
            color: white;
            border-radius: var(--border-radius-md);
            text-decoration: none;
            font-size: var(--font-size-sm);
            transition: background-color 0.2s ease;
        }
        
        .search-suggestions a:hover {
            background-color: var(--color-primary-dark);
        }
        
        @media (max-width: 767px) {
            .search-suggestions ul {
                flex-direction: column;
                align-items: center;
            }
            
            .search-suggestions a {
                width: 200px;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    addSearchStyles();
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeSearch,
        performSearch,
        searchContent,
        calculateRelevanceScore,
        highlightMatches,
        displaySearchResults
    };
}
