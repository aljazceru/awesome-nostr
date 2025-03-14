// Move these declarations to the very top of the file
const darkModeToggle = document.getElementById('darkModeToggle');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const body = document.body;
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isSwiping = false;

// Color theme definitions
const colorThemes = {
    default: {
        light: {
            primary: '#4a314d',
            background: '#ffffff',
            text: '#1a090d',
            cardBackground: '#a8ba9a',
            sidebarBackground: '#6b6570',
            hoverColor: '#ace894'
        },
        dark: {
            background: '#1a090d',
            text: '#ace894',
            cardBackground: '#4a314d',
            sidebarBackground: '#6b6570',
            linkColor: '#a8ba9a'
        }
    },
    purple: {
        light: {
            primary: '#9c528b',
            background: '#ffffff',
            text: '#2f0147',
            cardBackground: '#e2c2c6',
            sidebarBackground: '#b9929f',
            hoverColor: '#610f7f'
        },
        dark: {
            background: '#2f0147',
            text: '#e2c2c6',
            cardBackground: '#9c528b',
            sidebarBackground: '#610f7f',
            linkColor: '#b9929f'
        }
    },
    nature: {
        light: {
            primary: '#2c5530',
            background: '#ffffff',
            text: '#1a2f1c',
            cardBackground: '#a7c4aa',
            sidebarBackground: '#718355',
            hoverColor: '#90a955'
        },
        dark: {
            background: '#1a2f1c',
            text: '#90a955',
            cardBackground: '#2c5530',
            sidebarBackground: '#718355',
            linkColor: '#a7c4aa'
        }
    },
    sunset: {
        light: {
            primary: '#cf5c36',
            background: '#ffffff',
            text: '#1f1f1f',
            cardBackground: '#eec584',
            sidebarBackground: '#c8963e',
            hoverColor: '#f3a953'
        },
        dark: {
            background: '#1f1f1f',
            text: '#eec584',
            cardBackground: '#cf5c36',
            sidebarBackground: '#c8963e',
            linkColor: '#f3a953'
        }
    },
    grape: {
        light: {
            primary: '#642ca9',
            background: '#ffffff',
            text: '#642ca9',
            cardBackground: '#ffb8de',
            sidebarBackground: '#ffdde1',
            hoverColor: '#ff36ab'
        },
        dark: {
            background: '#642ca9',
            text: '#ffdde1',
            cardBackground: '#ff36ab',
            sidebarBackground: '#ff74d4',
            linkColor: '#ffb8de'
        }
    },
    autumn: {
        light: {
            primary: '#d95d39',
            background: '#ffffff',
            text: '#0e1428',
            cardBackground: '#f0a202',
            sidebarBackground: '#7b9e89',
            hoverColor: '#f18805'
        },
        dark: {
            background: '#0e1428',
            text: '#f0a202',
            cardBackground: '#d95d39',
            sidebarBackground: '#7b9e89',
            linkColor: '#f18805'
        }
    },
    midnight: {
        light: {
            primary: '#b91372',
            background: '#ffffff',
            text: '#31081f',
            cardBackground: '#fa198b',
            sidebarBackground: '#6b0f1a',
            hoverColor: '#fa198b'
        },
        dark: {
            background: '#0e0004',
            text: '#fa198b',
            cardBackground: '#b91372',
            sidebarBackground: '#31081f',
            linkColor: '#fa198b'
        }
    },
    rosenoir: {
        light: {
            primary: '#792359',
            background: '#ffffff',
            text: '#2f2d2e',
            cardBackground: '#fd3e81',
            sidebarBackground: '#41292c',
            hoverColor: '#d72483'
        },
        dark: {
            background: '#2f2d2e',
            text: '#fd3e81',
            cardBackground: '#792359',
            sidebarBackground: '#41292c',
            linkColor: '#d72483'
        }
    }
};

// Initialize all UI controls
document.addEventListener('DOMContentLoaded', () => {
    // Dark mode initialization
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.dataset.theme = savedTheme;
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.dataset.theme = prefersDark ? 'dark' : 'light';
        localStorage.setItem('theme', body.dataset.theme);
    }
    
    // Update dark mode toggle button icon
    updateDarkModeIcon();

    // Dark mode toggle event listener
    darkModeToggle.addEventListener('click', () => {
        body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', body.dataset.theme);
        updateDarkModeIcon();
        
        // Reapply color theme when switching dark/light mode
        const currentColorTheme = localStorage.getItem('colorTheme') || 'default';
        applyColorTheme(currentColorTheme);
    });

    // Color theme initialization
    const colorThemeSelect = document.getElementById('colorThemeSelect');
    const savedColorTheme = localStorage.getItem('colorTheme') || 'default';
    colorThemeSelect.value = savedColorTheme;
    applyColorTheme(savedColorTheme);
    
    // Color theme change event listener
    colorThemeSelect.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        localStorage.setItem('colorTheme', selectedTheme);
        applyColorTheme(selectedTheme);
    });

    // Test if marked is loaded
    if (typeof marked === 'undefined') {
        console.error('marked.js is not loaded!');
        document.getElementById('resources-container').innerHTML = `
            <div class="error-message">
                Error: marked.js library is not loaded properly.
            </div>`;
        return;
    }

    // If everything is working, proceed with main functionality
    parseAndDisplayContent()
        .then(() => {
            console.log("Content successfully parsed and displayed");

            // Show section if page fragment exists
            if (location.hash) {
                document.querySelector(`a[href='${location.hash}']`).click();
            }
        })
        .catch(error => {
            console.error('Error in main content processing:', error);
            document.getElementById('resources-container').innerHTML = `
                <div class="error-message">
                    Error loading content: ${error.message}
                </div>`;
        });

    // Ensure we're working with valid elements
    if (!sidebar || !menuToggle) {
        console.error('Required elements not found');
        return;
    }

    // Single function to handle sidebar state
    const toggleSidebar = (show) => {
        if (show === undefined) {
            sidebar.classList.toggle('active');
        } else {
            sidebar.classList[show ? 'add' : 'remove']('active');
        }
        // Update aria-expanded state
        menuToggle.setAttribute('aria-expanded', sidebar.classList.contains('active'));
    };

    // Menu toggle click handler
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });

    // Delegate sidebar link clicks using event delegation
    document.querySelector('.nav-links').addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        e.preventDefault();

        // Remove active class from all links
        document.querySelectorAll('.nav-links a').forEach(l => 
            l.classList.remove('active')
        );
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Get section name and display it
        const section = link.getAttribute('data-section');
        displaySection(section, window.parsedResources);
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            toggleSidebar(false);
        }
    });

    // Touch handling
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
    };

    const handleTouchMove = (e) => {
        if (!isSwiping) return;
        
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;

        const deltaX = touchStartX - touchEndX;
        const deltaY = Math.abs(touchStartY - touchEndY);

        if (deltaY > Math.abs(deltaX)) {
            isSwiping = false;
            return;
        }

        if (Math.abs(deltaX) > 10) {
            e.preventDefault();
        }
    };

    const handleTouchEnd = () => {
        if (!isSwiping) return;
        
        const deltaX = touchStartX - touchEndX;
        const deltaY = Math.abs(touchStartY - touchEndY);
        const swipeThreshold = 50;

        if (Math.abs(deltaX) > swipeThreshold && deltaY < 100) {
            toggleSidebar(deltaX < 0);
        }
        
        isSwiping = false;
    };

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) && 
            sidebar.classList.contains('active')) {
            toggleSidebar(false);
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                toggleSidebar(true);
            } else {
                toggleSidebar(false);
            }
        }, 250);
    });
});

// Helper function to update dark mode icon
function updateDarkModeIcon() {
    darkModeToggle.innerHTML = body.dataset.theme === 'dark' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
}

function handleSwipe() {
    const swipeThreshold = 100;
    const swipeDistance = touchStartX - touchEndX;
    
    if (swipeDistance > swipeThreshold && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
}

// Search functionality
const searchInput = document.getElementById('search');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const container = document.getElementById('resources-container');
    
    if (!searchTerm) {
        // If search is empty, restore current category view
        const currentCategory = document.querySelector('.nav-links a.active')?.textContent;
        if (currentCategory) {
            displaySection(currentCategory, window.parsedResources);
        }
        return;
    }

    // Clear current container
    container.innerHTML = '';
    
    // Search through all sections
    Object.entries(window.parsedResources).forEach(([sectionName, sectionContent]) => {
        sectionContent.forEach(item => {
            if (item.type === 'resources') {
                // Process both top-level and nested items for search
                searchResourceList(item.element, container, searchTerm, sectionName);
            } else if (item.type === 'content') {
                // Search through regular content
                const contentText = item.element.textContent.toLowerCase();
                if (contentText.includes(searchTerm)) {
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'markdown-content';
                    contentDiv.innerHTML = item.element.outerHTML;
                    
                    // Add section label
                    const sectionLabel = document.createElement('div');
                    sectionLabel.className = 'category-label';
                    sectionLabel.textContent = sectionName;
                    
                    container.appendChild(sectionLabel);
                    container.appendChild(contentDiv);
                }
            }
        });
    });
    
    // Show "no results" message if nothing found
    if (!container.children.length) {
        container.innerHTML = `
            <div class="no-results">
                No resources found matching "${searchTerm}"
            </div>
        `;
    }
});

// New helper function to search through resource lists recursively
function searchResourceList(ulElement, container, searchTerm, sectionName) {
    Array.from(ulElement.children).forEach(li => {
        // Search in the main item if it has a link
        if (li.querySelector(':scope > a')) {
            const resourceName = li.querySelector(':scope > a')?.textContent || '';
            const resourceLink = li.querySelector(':scope > a')?.href || '';
            const description = li.textContent
                .replace(resourceName, '') // Remove the resource name
                .replace(/^\s*-\s*/, '')  // Remove leading dash
                .replace(/\s*\[!\[.*?\]\(.*?\)\]\(.*?\)\s*/, '') // Remove GitHub stars badge if present
                .trim();
            
            const searchableText = [resourceName, description, resourceLink]
                .join(' ')
                .toLowerCase();
            
            if (searchableText.includes(searchTerm)) {
                const card = createResourceCard({
                    name: resourceName,
                    link: resourceLink,
                    description: description,
                    stars: li.querySelector(':scope > img[alt="stars"]')
                        ? parseInt(li.querySelector(':scope > img[alt="stars"]').src.match(/stars\/(\d+)/)?.[1]) || 0
                        : 0
                });
                
                // Add section label to card
                const sectionLabel = document.createElement('div');
                sectionLabel.className = 'category-label';
                sectionLabel.textContent = sectionName;
                card.insertBefore(sectionLabel, card.firstChild);
                
                container.appendChild(card);
            }
        }

        // Search in nested items if they exist
        const nestedUl = li.querySelector(':scope > ul');
        if (nestedUl) {
            searchResourceList(nestedUl, container, searchTerm, sectionName);
        }
    });
}

// Add active class handling for navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        searchInput.value = ''; // Clear search when changing categories
    });
});

// Add this function to fetch contributors from GitHub API
async function fetchContributors(owner, repo) {
    try {
        let page = 1;
        let allContributors = [];
        
        while (true) {
            const response = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100&page=${page}`
            );
            
            if (!response.ok) throw new Error('Failed to fetch contributors');
            
            const contributors = await response.json();
            if (contributors.length === 0) break; // No more contributors
            
            allContributors = [...allContributors, ...contributors];
            page++;
            
            // Check if we've reached the last page
            const linkHeader = response.headers.get('Link');
            if (!linkHeader || !linkHeader.includes('rel="next"')) {
                break;
            }
        }
        
        console.log(`Total contributors fetched: ${allContributors.length}`);
        return allContributors;
        
    } catch (error) {
        console.error('Error fetching contributors:', error);
        return [];
    }
}

// Modify the parseResources function to handle contributors differently
function parseResources(content) {
    const resources = {
        'most-popular': [],
        'protocol': [],
        'relays': [],
        'clients': [],
        'libraries': [],
        'bridges-and-gateways': [],
        'cache-services': [],
        'tools': [],
        'nip-05-identity-services': [],
        'offline-signers': [],
        'vanity-pubkey-mining': [],
        'peer-to-peer-markets': [],
        'nip-07-browser-extensions': [],
        'nip-47-nostr-wallet-connect-nwc-implementations': [],
        'nip-57-zaps-compatible-wallets-and-solutions': [],
        'nip-90-data-vending-machines': [],
        'nip-96-file-storage-servers': [],
        'nostr-web-services-nws': [],
        'adjacent-protocols': [],
        'games-on-nostr': [],
        'communities': [],
        'tutorials': [],
        'recommended-reading-watching': [],
        'podcasts': [],
        'other-links': [],
        'deprecated': [],
        'related-resources': [],
        'contributing': [],
        'contributors': []
    };

    const lines = content.split('\n');
    let currentMainSection = '';
    let currentSubSection = '';
    let contributingContent = '';

    // Extract repo info from contributors section
    let repoInfo = null;
    const repoRegex = /github\.com\/([\w-]+)\/([\w-]+)\/graphs\/contributors/;

    lines.forEach(line => {
        if (line.startsWith('## ')) {
            currentMainSection = line.slice(3).trim();
            currentSubSection = '';
            console.log('Processing section:', currentMainSection); // Debug log
        } else if (currentMainSection.toLowerCase() === 'contributors') {
            const match = line.match(repoRegex);
            if (match) {
                repoInfo = {
                    owner: match[1],
                    repo: match[2]
                };
            }
        } else if (currentMainSection.toLowerCase() === 'contributing') {
            if (line.trim() && !line.startsWith('##')) {
                contributingContent += line + '\n';
            }
        }
        // Detect subsection headers (###)
        else if (line.startsWith('### ')) {
            currentSubSection = line.slice(4).trim();
        }
        // Parse regular resource lines (starting with '- [')
        else if (line.trim().startsWith('- [')) {
            const resource = parseResourceLine(line);
            if (resource) {
                // Convert section header to category ID format
                const categoryId = currentMainSection
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');

                console.log('Parsed resource:', categoryId, resource); // Debug log

                // Add resource to appropriate category if it exists
                if (resources[categoryId]) {
                    resources[categoryId].push(resource);
                } else {
                    console.warn('Category not found:', categoryId); // Debug log
                }
            }
        }
    });

    // Add special handling for contributors and contributing sections
    resources['contributors'] = [{
        type: 'github-contributors',
        repoInfo: repoInfo
    }];
    
    resources['contributing'] = [{
        type: 'markdown',
        content: contributingContent.trim()
    }];

    // Log the parsed data for debugging
    console.log('Parsed resources:', resources);
    return resources;
}

// Function to parse a single resource line
function parseResourceLine(line) {
    // Modified regex patterns to be more lenient
    const nameRegex = /\[(.*?)\]/;
    const linkRegex = /\((.*?)\)/;
    const starsRegex = /!\[stars\].*?stars\/(.*?)\/.*?style=social/;
    
    // Modified description regex to be optional
    const descriptionRegex = /(?:\) - )(.*?)(?=(?:\[|\n|$))|(?:style=social\) - )(.*?)(?=(?:\[|\n|$))/;

    try {
        const nameMatch = nameRegex.exec(line);
        const linkMatch = linkRegex.exec(line);
        
        // Only require name and link to be present
        if (nameMatch?.[1] && linkMatch?.[1]) {
            const name = nameMatch[1].trim();
            const link = linkMatch[1].trim();
            const stars = starsRegex.exec(line)?.[1];
            
            // Make description optional
            const descMatch = descriptionRegex.exec(line);
            const description = (descMatch?.[1] || descMatch?.[2] || '').trim();

            return {
                name,
                link,
                stars: stars ? parseInt(stars) : 0,
                description, // This might be an empty string now
                raw: line.trim()
            };
        }
    } catch (error) {
        console.error('Error parsing resource line:', error, line);
    }
    return null;
}

// Modified createResourceCard function to display markdown links in a cleaner format
function createResourceCard(resource) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    
    // Add schema.org structured data
    card.setAttribute('itemscope', '');
    card.setAttribute('itemtype', 'https://schema.org/SoftwareApplication');
    
    // Extract domain and build multiple fallback favicon URLs
    let faviconUrl = '';
    try {
        const url = new URL(resource.link);
        const domain = url.hostname;
        
        // Try multiple favicon sources
        const faviconSources = [
            `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
            `https://${domain}/favicon.ico`,
            `https://${domain}/favicon.png`,
            `https://${domain}/apple-touch-icon.png`,
            `https://${domain}/apple-touch-icon-precomposed.png`
        ];

        // Create image element with fallback chain
        const img = document.createElement('img');
        img.className = 'resource-favicon';
        img.alt = '';
        
        // Set first source as initial
        img.src = faviconSources[0];
        
        // Add error handling to try next source
        let sourceIndex = 0;
        img.onerror = () => {
            sourceIndex++;
            if (sourceIndex < faviconSources.length) {
                img.src = faviconSources[sourceIndex];
            } else {
                // If all sources fail, use a default icon
                img.src = 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32">
                        <circle cx="50" cy="50" r="40" fill="#ccc"/>
                        <text x="50" y="65" font-size="40" text-anchor="middle" fill="#fff">
                            ${resource.name.charAt(0).toUpperCase()}
                        </text>
                    </svg>
                `);
                img.onerror = null; // Remove error handler once default is shown
            }
        };

        faviconUrl = img.outerHTML;
    } catch (e) {
        console.warn('Invalid URL:', resource.link);
        // Use default icon for invalid URLs
        faviconUrl = `<div class="resource-favicon-fallback">${resource.name.charAt(0).toUpperCase()}</div>`;
    }
    
    card.innerHTML = `
        <div class="resource-header">
            ${faviconUrl}
            <div class="resource-content">
                <h3 class="resource-title">
                    <a href="${resource.link}" 
                       target="_blank" 
                       rel="noopener"
                       itemprop="name">
                        ${resource.name}
                    </a>
                    ${resource.stars ? `
                        <div class="resource-stars" itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
                            <i class="fas fa-star" aria-hidden="true"></i>
                            <span itemprop="ratingValue">${resource.stars}</span>
                            <meta itemprop="ratingCount" content="${resource.stars}">
                        </div>
                    ` : ''}
                </h3>
                ${resource.description ? `
                    <div class="resource-description" itemprop="description">
                        ${resource.description}
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    return card;
}

// Update createSpecialSectionCard to handle GitHub contributors
async function createSpecialSectionCard(resource) {
    const card = document.createElement('div');
    card.className = 'resource-card';

    if (resource.type === 'github-contributors') {
        card.className += ' contributors-card';
        card.innerHTML = `
            <div class="resource-title">Contributors</div>
            <div class="contributors-grid">
                <div class="loading">Loading contributors...</div>
            </div>
        `;

        if (resource.repoInfo) {
            console.log('Fetching contributors for:', resource.repoInfo); // Debug log
            const contributors = await fetchContributors(resource.repoInfo.owner, resource.repoInfo.repo);
            console.log('Number of contributors:', contributors.length); // Debug log
            const contributorsHtml = contributors.map(contributor => `
                <a href="${contributor.html_url}" target="_blank" title="${contributor.login}">
                    <img src="${contributor.avatar_url}" alt="${contributor.login}" />
                    <span>${contributor.login}</span>
                </a>
            `).join('');

            const grid = card.querySelector('.contributors-grid');
            grid.innerHTML = contributorsHtml || 'No contributors found';
        }
    } else if (resource.type === 'markdown') {
        // For contributing section
        const formattedContent = resource.content
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        card.innerHTML = `
            <div class="resource-title">How to Contribute</div>
            <div class="resource-description">
                ${formattedContent}
            </div>
        `;
    }

    return card;
}

// Update populateResources to handle both special and regular resources
async function populateResources(categoryId, resources) {
    const container = document.getElementById('resources-container');
    container.innerHTML = '';

    const categoryResources = resources[categoryId];
    if (!categoryResources) return;

    for (const resource of categoryResources) {
        let card;
        if (resource.type) {
            // Handle special sections (contributors and contributing)
            card = await createSpecialSectionCard(resource);
        } else {
            // Handle regular resource cards
            card = createResourceCard(resource);
        }
        container.appendChild(card);
    }
}

// Function to get icon for category
function getCategoryIcon(category) {
    const iconMap = {
        'most-popular': 'fa-star',
        'protocol': 'fa-book',
        'relays': 'fa-server',
        'clients': 'fa-mobile-alt',
        'libraries': 'fa-code',
        'bridges-and-gateways': 'fa-bridge',
        'cache-services': 'fa-database',
        'tools': 'fa-wrench',
        'nip-05-identity-services': 'fa-id-card',
        'offline-signers': 'fa-signature',
        'vanity-pubkey-mining': 'fa-hammer',
        'peer-to-peer-markets': 'fa-store',
        'nip-07-browser-extensions': 'fa-puzzle-piece',
        'nip-47-nostr-wallet-connect-nwc-implementations': 'fa-wallet',
        'nip-57-zaps-compatible-wallets-and-solutions': 'fa-bolt',
        'nip-90-data-vending-machines': 'fa-store-alt',
        'nip-96-file-storage-servers': 'fa-folder',
        'nostr-web-services-nws': 'fa-globe',
        'adjacent-protocols': 'fa-link',
        'games-on-nostr': 'fa-gamepad',
        'communities': 'fa-users',
        'tutorials': 'fa-graduation-cap',
        'recommended-reading-watching': 'fa-book-reader',
        'podcasts': 'fa-podcast',
        'other-links': 'fa-external-link-alt',
        'deprecated': 'fa-archive',
        'related-resources': 'fa-project-diagram',
        'contributing': 'fa-hands-helping',
        'contributors': 'fa-users-cog',
        // Default icon if category not found
        'default': 'fa-circle'
    };

    const key = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return iconMap[key] || iconMap.default;
}

// Function to generate navigation from content
function generateNavigation(sectionNames) {
    const navList = document.querySelector('.nav-links');
    navList.innerHTML = ''; // Clear existing navigation

    sectionNames.forEach(section => {
        // Create URL-friendly ID
        const sectionId = section
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#${sectionId}" data-section="${section}">
                <i class="fas fa-chevron-right"></i>
                ${section}
            </a>
        `;

        // Add click handler
        li.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class from all links
            document.querySelectorAll('.nav-links a').forEach(a => 
                a.classList.remove('active')
            );
            // Add active class to clicked link
            e.target.classList.add('active');
            // Display the section
            displaySection(section, window.parsedResources);
        });

        navList.appendChild(li);
    });

    // Set first item as active
    const firstLink = navList.querySelector('a');
    if (firstLink) {
        firstLink.classList.add('active');
    }
}

async function parseAndDisplayContent() {
    try {
        const response = await fetch('./README.md');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();

        // Parse the markdown into HTML
        const htmlContent = marked.parse(content);

        // Create a temporary element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Get all sections (h2 headers and their content)
        const sections = {};
        let currentSection = null;
        let currentSectionContent = [];

        Array.from(tempDiv.children).forEach(element => {
            if (element.tagName === 'H2') {
                // If we have a previous section, save it
                if (currentSection) {
                    sections[currentSection] = currentSectionContent;
                }
                // Start new section
                currentSection = element.textContent.trim();
                currentSectionContent = [];
            } else if (currentSection) {
                currentSectionContent.push({
                    type: element.tagName === 'UL' ? 'resources' : 'content',
                    element: element
                });
            }
        });

        // Save the last section
        if (currentSection) {
            sections[currentSection] = currentSectionContent;
        }

        // Store sections globally
        window.parsedResources = sections;

        // Generate navigation
        const sectionNames = Object.keys(sections);
        generateNavigation(sectionNames);

        // Display initial section
        if (sectionNames.length > 0) {
            displaySection(sectionNames[0], sections);
        }

    } catch (error) {
        console.error('Error processing markdown:', error);
        throw error; // Re-throw to be caught by the main error handler
    }
}

function displaySection(sectionName, sections) {
    const container = document.getElementById('resources-container');
    container.innerHTML = '';

    // Add section header
    const header = document.createElement('h2');
    header.textContent = sectionName;
    container.appendChild(header);

    // Display section content
    sections[sectionName].forEach(item => {
        if (item.type === 'content') {
            // Regular markdown content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'markdown-content';
            contentDiv.innerHTML = item.element.outerHTML;
            container.appendChild(contentDiv);
        } else if (item.type === 'resources') {
            // Resource list
            Array.from(item.element.children).forEach(li => {
                const card = createResourceCard({
                    name: li.querySelector('a')?.textContent || '',
                    link: li.querySelector('a')?.href || '',
                    description: li.textContent.split('- ')[1]?.trim() || '',
                    stars: li.querySelector('img[alt="stars"]')
                        ? parseInt(li.querySelector('img[alt="stars"]').src.match(/stars\/(\d+)/)?.[1]) || 0
                        : 0
                });
                container.appendChild(card);
            });
        }
    });
}

function applyColorTheme(themeName) {
    const isDark = document.body.dataset.theme === 'dark';
    const theme = colorThemes[themeName][isDark ? 'dark' : 'light'];
    
    // Apply theme colors to CSS variables
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value);
    });
}