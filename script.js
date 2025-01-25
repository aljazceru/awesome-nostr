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
const resourceCards = document.querySelectorAll('.resource-card');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    resourceCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
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

// Function to parse resources from README content
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

    // Split content by lines and process each line
    const lines = content.split('\n');
    let currentMainSection = '';
    let currentSubSection = '';

    lines.forEach(line => {
        // Detect main section headers (##)
        if (line.startsWith('## ')) {
            currentMainSection = line.slice(3).trim();
            currentSubSection = '';
        }
        // Detect subsection headers (###)
        else if (line.startsWith('### ')) {
            currentSubSection = line.slice(4).trim();
        }
        // Special handling for contributors section with HTML content
        else if (currentMainSection.toLowerCase() === 'contributors' && line.includes('<a')) {
            const resource = {
                name: 'Contributors List',
                description: 'GitHub contributors to the awesome-nostr repository',
                link: 'https://github.com/aljazceru/awesome-nostr/graphs/contributors',
                raw: line.trim()
            };
            resources['contributors'].push(resource);
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

// Function to populate resources container
function populateResources(categoryId, resources) {
    const container = document.getElementById('resources-container');
    container.innerHTML = ''; // Clear existing content

    resources[categoryId]?.forEach(resource => {
        const card = createResourceCard(resource);
        container.appendChild(card);
    });
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