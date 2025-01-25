// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    darkModeToggle.innerHTML = body.dataset.theme === 'dark' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Search functionality
const searchInput = document.getElementById('search');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const container = document.getElementById('resources-container');
    
    if (!searchTerm) {
        // If search is empty, restore current category view
        const currentCategory = document.querySelector('.nav-links a.active')?.getAttribute('href')?.replace('#', '');
        if (currentCategory) {
            populateResources(currentCategory, window.parsedResources);
        }
        return;
    }

    // Clear current container
    container.innerHTML = '';
    
    // Search through all categories
    Object.entries(window.parsedResources).forEach(([category, resources]) => {
        resources.forEach(resource => {
            let shouldShow = false;
            
            if (resource.type) {
                // Handle special sections (contributors, contributing)
                if (resource.type === 'markdown') {
                    shouldShow = resource.content.toLowerCase().includes(searchTerm);
                } else if (resource.type === 'github-contributors') {
                    // Skip contributors section in search
                    return;
                }
            } else {
                // Regular resources
                const searchableText = [
                    resource.name,
                    resource.description,
                    resource.link
                ].filter(Boolean).join(' ').toLowerCase();
                
                shouldShow = searchableText.includes(searchTerm);
            }
            
            if (shouldShow) {
                let card;
                if (resource.type) {
                    card = createSpecialSectionCard(resource);
                } else {
                    card = createResourceCard(resource);
                }
                
                // Add category label to card
                const categoryLabel = document.createElement('div');
                categoryLabel.className = 'category-label';
                categoryLabel.textContent = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                card.insertBefore(categoryLabel, card.firstChild);
                
                container.appendChild(card);
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

// Add active class handling for navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        searchInput.value = ''; // Clear search when changing categories
    });
});

// Sort functionality
const sortSelect = document.getElementById('sortSelect');

sortSelect.addEventListener('change', (e) => {
    const sortBy = e.target.value;
    const container = document.getElementById('resources-container');
    const cards = Array.from(container.getElementsByClassName('resource-card'));

    cards.sort((a, b) => {
        if (sortBy === 'stars') {
            return parseInt(b.dataset.stars) - parseInt(a.dataset.stars);
        } else if (sortBy === 'name') {
            return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
        }
        return 0;
    });

    container.innerHTML = '';
    cards.forEach(card => container.appendChild(card));
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

                // Add resource to appropriate category if it exists
                if (resources[categoryId]) {
                    resources[categoryId].push(resource);
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
    // Regular expressions to extract information
    const nameRegex = /\[(.*?)\]/;
    const linkRegex = /\((.*?)\)/;
    const starsRegex = /!\[stars\].*?stars\/(.*?)\/.*?style=social/;
    const descriptionRegex = /\) - (.*?)(?=\[|$)/;

    try {
        const name = nameRegex.exec(line)?.[1];
        const link = linkRegex.exec(line)?.[1];
        const stars = starsRegex.exec(line)?.[1];
        const description = descriptionRegex.exec(line)?.[1]?.trim();

        if (name && (link || description)) {
            return {
                name,
                link,
                stars: stars || 0,
                description: description || '',
                raw: line.trim() // Keep the original markdown line
            };
        }
    } catch (error) {
        console.error('Error parsing resource line:', error);
    }
    return null;
}

// Modified createResourceCard function to display markdown links in a cleaner format
function createResourceCard(resource) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.dataset.stars = resource.stars || 0;

    // Create a formatted version of the markdown content
    const formattedContent = `
        <div class="resource-title"><strong>${resource.name}</strong></div>
        ${resource.link ? `
            <div class="resource-link">
                <a href="${resource.link}" target="_blank">
                    <i class="fas fa-external-link-alt"></i>
                    ${resource.link}
                </a>
            </div>
        ` : ''}
        ${resource.description ? `
            <div class="resource-description">
                ${resource.description}
            </div>
        ` : ''}
        ${resource.stars ? `
            <div class="resource-stars">
                <i class="fas fa-star"></i>
                ${resource.stars}
            </div>
        ` : ''}
    `;

    card.innerHTML = formattedContent;
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
function generateNavigation(content) {
    const navList = document.querySelector('.nav-links');
    const categories = [];
    let currentCategory = '';

    // Split content by lines and find all ## headers
    const lines = content.split('\n');
    lines.forEach(line => {
        if (line.startsWith('## ')) {
            currentCategory = line.slice(3).trim();
            const categoryId = currentCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const icon = getCategoryIcon(currentCategory.toLowerCase());
            
            categories.push({
                id: categoryId,
                name: currentCategory,
                icon: icon
            });
        }
    });

    // Generate navigation HTML
    navList.innerHTML = categories.map(category => `
        <li>
            <a href="#${category.id}">
                <i class="fas ${category.icon}"></i>
                ${category.name}
            </a>
        </li>
    `).join('');

    // Add click event listeners to the new navigation items
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryId = e.target.getAttribute('href').replace('#', '');
            populateResources(categoryId, window.parsedResources);
        });
    });

    return categories;
}

// Update the fetch call to generate navigation
fetch('./README.md')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(content => {
        console.log('README content loaded:', content.substring(0, 200) + '...');
        
        // Generate navigation first
        const categories = generateNavigation(content);
        
        // Then parse and populate resources
        window.parsedResources = parseResources(content);
        console.log('Parsed resources:', window.parsedResources);
        
        // Load initial category (first one in the list)
        if (categories.length > 0) {
            populateResources(categories[0].id, window.parsedResources);
        }
    })
    .catch(error => {
        console.error('Error loading README:', error);
        document.getElementById('resources-container').innerHTML = 
            `<div class="error-message">Error loading resources: ${error.message}</div>`;
    });