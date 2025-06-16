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
            cardBackground: '#f8f9fa',
            sidebarBackground: '#6b6570',
            hoverColor: '#ace894'
        },
        dark: {
            background: '#1a1a1a',
            text: '#e8e8e8',
            cardBackground: '#2d2d2d',
            sidebarBackground: '#333333',
            linkColor: '#88cc88'
        }
    },
    purple: {
        light: {
            primary: '#9c528b',
            background: '#ffffff',
            text: '#2f0147',
            cardBackground: '#f7f3f7',
            sidebarBackground: '#b9929f',
            hoverColor: '#c470a4'
        },
        dark: {
            background: '#1a0d1a',
            text: '#e6d6e6',
            cardBackground: '#301a30',
            sidebarBackground: '#4a2d4a',
            linkColor: '#cc88cc'
        }
    },
    nature: {
        light: {
            primary: '#2c5530',
            background: '#ffffff',
            text: '#1a2f1c',
            cardBackground: '#f8faf8',
            sidebarBackground: '#718355',
            hoverColor: '#90a955'
        },
        dark: {
            background: '#0f1a0f',
            text: '#d4e6d4',
            cardBackground: '#1a331a',
            sidebarBackground: '#264d26',
            linkColor: '#99dd99'
        }
    },
    sunset: {
        light: {
            primary: '#cf5c36',
            background: '#ffffff',
            text: '#1f1f1f',
            cardBackground: '#fdf8f3',
            sidebarBackground: '#c8963e',
            hoverColor: '#f3a953'
        },
        dark: {
            background: '#1a0f0a',
            text: '#ffd4a3',
            cardBackground: '#2d1a0d',
            sidebarBackground: '#4d2d1a',
            linkColor: '#ffaa55'
        }
    },
    grape: {
        light: {
            primary: '#642ca9',
            background: '#ffffff',
            text: '#2d1a47',
            cardBackground: '#faf7fd',
            sidebarBackground: '#9775cc',
            hoverColor: '#8855cc'
        },
        dark: {
            background: '#0d0a1a',
            text: '#e6d4ff',
            cardBackground: '#1a0d33',
            sidebarBackground: '#33204d',
            linkColor: '#bb88ff'
        }
    },
    autumn: {
        light: {
            primary: '#d95d39',
            background: '#ffffff',
            text: '#2d1a0f',
            cardBackground: '#fdf7f0',
            sidebarBackground: '#cc8866',
            hoverColor: '#f18805'
        },
        dark: {
            background: '#1a0f0a',
            text: '#ffcc99',
            cardBackground: '#331a0d',
            sidebarBackground: '#4d2d1a',
            linkColor: '#ffaa77'
        }
    },
    midnight: {
        light: {
            primary: '#b91372',
            background: '#ffffff',
            text: '#31081f',
            cardBackground: '#fdf3f7',
            sidebarBackground: '#d988aa',
            hoverColor: '#e6558c'
        },
        dark: {
            background: '#0a0005',
            text: '#ff99cc',
            cardBackground: '#260d1a',
            sidebarBackground: '#4d1a33',
            linkColor: '#ff77bb'
        }
    },
    slate: {
        light: {
            primary: '#475569',
            background: '#ffffff',
            text: '#1e293b',
            cardBackground: '#f8fafc',
            sidebarBackground: '#94a3b8',
            hoverColor: '#64748b'
        },
        dark: {
            background: '#0f172a',
            text: '#cbd5e1',
            cardBackground: '#1e293b',
            sidebarBackground: '#334155',
            linkColor: '#94a3b8'
        }
    },
    forest: {
        light: {
            primary: '#16a085',
            background: '#ffffff',
            text: '#2c3e50',
            cardBackground: '#f0fdf4',
            sidebarBackground: '#52d4a6',
            hoverColor: '#1abc9c'
        },
        dark: {
            background: '#0a1a12',
            text: '#a7f3d0',
            cardBackground: '#064e3b',
            sidebarBackground: '#047857',
            linkColor: '#6ee7b7'
        }
    },
    ocean: {
        light: {
            primary: '#2563eb',
            background: '#ffffff',
            text: '#1e40af',
            cardBackground: '#eff6ff',
            sidebarBackground: '#60a5fa',
            hoverColor: '#3b82f6'
        },
        dark: {
            background: '#0c1429',
            text: '#bfdbfe',
            cardBackground: '#1e3a8a',
            sidebarBackground: '#1d4ed8',
            linkColor: '#93c5fd'
        }
    },
    cherry: {
        light: {
            primary: '#dc2626',
            background: '#ffffff',
            text: '#991b1b',
            cardBackground: '#fef2f2',
            sidebarBackground: '#f87171',
            hoverColor: '#ef4444'
        },
        dark: {
            background: '#1a0606',
            text: '#fecaca',
            cardBackground: '#7f1d1d',
            sidebarBackground: '#991b1b',
            linkColor: '#fb7185'
        }
    },
    cyberpunk: {
        light: {
            primary: '#8b5cf6',
            background: '#fafafa',
            text: '#171717',
            cardBackground: '#f5f5f5',
            sidebarBackground: '#a78bfa',
            hoverColor: '#7c3aed'
        },
        dark: {
            background: '#0a0a0a',
            text: '#00ffff',
            cardBackground: '#1a0a1a',
            sidebarBackground: '#2a1a2a',
            linkColor: '#ff0099'
        }
    },
    nord: {
        light: {
            primary: '#5e81ac',
            background: '#eceff4',
            text: '#2e3440',
            cardBackground: '#e5e9f0',
            sidebarBackground: '#81a1c1',
            hoverColor: '#88c0d0'
        },
        dark: {
            background: '#2e3440',
            text: '#d8dee9',
            cardBackground: '#3b4252',
            sidebarBackground: '#434c5e',
            linkColor: '#88c0d0'
        }
    },
    warm: {
        light: {
            primary: '#f59e0b',
            background: '#ffffff',
            text: '#92400e',
            cardBackground: '#fffbeb',
            sidebarBackground: '#fbbf24',
            hoverColor: '#f97316'
        },
        dark: {
            background: '#1c1917',
            text: '#fed7aa',
            cardBackground: '#451a03',
            sidebarBackground: '#78350f',
            linkColor: '#fb923c'
        }
    },
    dracula: {
        light: {
            primary: '#bd93f9',
            background: '#ffffff',
            text: '#282a36',
            cardBackground: '#f8f8f2',
            sidebarBackground: '#cfc9e3',
            hoverColor: '#ff79c6'
        },
        dark: {
            background: '#282a36',
            text: '#f8f8f2',
            cardBackground: '#44475a',
            sidebarBackground: '#6272a4',
            linkColor: '#bd93f9'
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

    // Color theme initialization - color theme select is commented out in HTML
    const savedColorTheme = localStorage.getItem('colorTheme');
    const defaultTheme = 'default';

    // Validate saved theme exists and apply it
    const initialTheme = colorThemes[savedColorTheme] ? savedColorTheme : defaultTheme;
    applyColorTheme(initialTheme);

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
            `https://www.google.com/s2/favicons?domain=https://${domain}&sz=64`,
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

    window.scrollTo(0, 0);
}

function applyColorTheme(themeName) {
    // Check if theme exists, otherwise fallback to default
    const themeExists = colorThemes[themeName];
    if (!themeExists) {
        console.warn(`Theme "${themeName}" not found, falling back to default theme`);
        themeName = 'default';
    }

    const isDark = document.body.dataset.theme === 'dark';
    const theme = colorThemes[themeName][isDark ? 'dark' : 'light'];
    
    if (!theme) {
        console.error(`Could not find ${isDark ? 'dark' : 'light'} mode for theme "${themeName}"`);
        return;
    }
    
    // Apply theme colors to CSS variables
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value);
    });

    // Store the successfully applied theme
    localStorage.setItem('colorTheme', themeName);
}