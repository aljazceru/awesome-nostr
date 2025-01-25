// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Initialize theme from localStorage or system preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.dataset.theme = savedTheme;
    } else {
        // Check system preference if no saved theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.dataset.theme = prefersDark ? 'dark' : 'light';
        localStorage.setItem('theme', body.dataset.theme);
    }
    
    // Update toggle button icon
    darkModeToggle.innerHTML = body.dataset.theme === 'dark' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
});

darkModeToggle.addEventListener('click', () => {
    const newTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    
    darkModeToggle.innerHTML = newTheme === 'dark' 
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
                // Search through resource lists
                Array.from(item.element.children).forEach(li => {
                    const resourceName = li.querySelector('a')?.textContent || '';
                    const resourceLink = li.querySelector('a')?.href || '';
                    const resourceDescription = li.textContent.split('- ')[1]?.trim() || '';
                    
                    const searchableText = [resourceName, resourceDescription, resourceLink]
                        .join(' ')
                        .toLowerCase();
                    
                    if (searchableText.includes(searchTerm)) {
                        const card = createResourceCard({
                            name: resourceName,
                            link: resourceLink,
                            description: resourceDescription,
                            stars: li.querySelector('img[alt="stars"]')
                                ? parseInt(li.querySelector('img[alt="stars"]').src.match(/stars\/(\d+)/)?.[1]) || 0
                                : 0
                        });
                        
                        // Add section label to card
                        const sectionLabel = document.createElement('div');
                        sectionLabel.className = 'category-label';
                        sectionLabel.textContent = sectionName;
                        card.insertBefore(sectionLabel, card.firstChild);
                        
                        container.appendChild(card);
                    }
                });
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
    // Updated regex patterns to better handle various markdown formats
    const nameRegex = /\[(.*?)\]/;
    const linkRegex = /\((.*?)\)/;
    const starsRegex = /!\[stars\].*?stars\/(.*?)\/.*?style=social/;
    // Updated description regex to handle descriptions after stars badge
    const descriptionRegex = /style=social\) - (.*?)(?=(?:\[|\n|$))|(?:\) - )(.*?)(?=(?:\[|\n|$))/;

    try {
        const name = nameRegex.exec(line)?.[1];
        const link = linkRegex.exec(line)?.[1];
        const stars = starsRegex.exec(line)?.[1];
        
        // More robust description extraction
        const descMatch = descriptionRegex.exec(line);
        const description = (descMatch?.[1] || descMatch?.[2] || '').trim();

        if (name && link) {
            return {
                name,
                link,
                stars: stars || 0,
                description: description || '',
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
    
    // Extract domain for favicon
    let faviconUrl = '';
    try {
        const url = new URL(resource.link);
        // Using Google's favicon service as a fallback if the direct favicon isn't available
        faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
    } catch (e) {
        console.warn('Invalid URL:', resource.link);
    }
    
    card.innerHTML = `
        <div class="resource-header">
            <h3 class="resource-title">
                <a href="${resource.link}" 
                   target="_blank" 
                   rel="noopener"
                   itemprop="name">
                    ${faviconUrl ? `<img src="${faviconUrl}" alt="" class="resource-favicon" />` : ''}
                    ${resource.name}
                    <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                </a>
            </h3>
            ${resource.stars ? `
                <div class="resource-stars" itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <span itemprop="ratingValue">${resource.stars}</span>
                    <meta itemprop="ratingCount" content="${resource.stars}">
                </div>
            ` : ''}
        </div>
        ${resource.description ? `
            <div class="resource-description" itemprop="description">
                ${resource.description}
            </div>
        ` : ''}
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

// Remove the old fetch call and replace with this initialization
document.addEventListener('DOMContentLoaded', () => {
    // Test if marked is loaded
    if (typeof marked === 'undefined') {
        console.error('marked.js is not loaded!');
        document.getElementById('resources-container').innerHTML = `
            <div class="error-message">
                Error: marked.js library is not loaded properly.
            </div>`;
        return;
    }

    // Test marked with a simple markdown string
    console.log('marked.js test:', marked.parse('# Test\nThis is a *test* of **marked.js**'));

    // If everything is working, proceed with main functionality
    parseAndDisplayContent()
        .then(() => console.log('Content successfully parsed and displayed'))
        .catch(error => {
            console.error('Error in main content processing:', error);
            document.getElementById('resources-container').innerHTML = `
                <div class="error-message">
                    Error loading content: ${error.message}
                </div>`;
        });
});

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