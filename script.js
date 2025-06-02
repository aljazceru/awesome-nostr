/**
 * Sets up category toast functionality for mobile
 */
function setupCategoryToast() {
    const toastButton = document.getElementById('category-toast-button');
    const toastContainer = document.getElementById('category-toast-container');
    const toastClose = document.getElementById('category-toast-close');
    
    if (toastButton && toastContainer && toastClose) {
        // Toggle toast on button click
        toastButton.addEventListener('click', () => {
            toastContainer.classList.toggle('active');
        });
        
        // Close toast on close button click
        toastClose.addEventListener('click', () => {
            toastContainer.classList.remove('active');
        });
        
        // Close toast when clicking outside
        document.addEventListener('click', (e) => {
            if (!toastContainer.contains(e.target) && e.target !== toastButton) {
                toastContainer.classList.remove('active');
            }
        });
    }
}/**
 * Sets up theme selector functionality
 */
function setupThemeSelector() {
    const themeSelect = document.getElementById('theme-select');
    
    // Load saved theme if exists
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
        themeSelect.value = savedTheme;
    }
    
    // Handle theme changes
    themeSelect.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        document.body.dataset.theme = selectedTheme;
        localStorage.setItem('theme', selectedTheme);
    });
}/**
 * Sets up mobile menu toggle functionality
 */
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('mainnav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-active');
            
            // Change icon based on menu state
            const icon = mobileMenuToggle.querySelector('i');
            if (mainNav.classList.contains('mobile-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when a link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) { // Only on mobile screens
                    mainNav.classList.remove('mobile-active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup theme switching
    setupThemeSelector();
    
    // Navigation handling
    setupNavigation();
    
    // Check if marked is loaded
    if (typeof marked === 'undefined') {
        console.error('marked.js is not loaded!');
        document.getElementById('resources-container').innerHTML = `
            <div class="error-message">
                Error: marked.js library is not loaded properly.
            </div>`;
        return;
    }

    // Parse and display content from README.md
    parseAndDisplayContent()
        .then(() => {
            console.log("Content successfully parsed and displayed");
            
            // Show section if page fragment exists
            if (location.hash) {
                const hashPart = location.hash.substring(1);
                document.querySelector(`a[data-category='${hashPart}']`)?.click();
            }
        })
        .catch(error => {
            console.error('Error in main content processing:', error);
            document.getElementById('resources-container').innerHTML = `
                <div class="error-message">
                    Error loading content: ${error.message}
                </div>`;
        });
});

/**
 * Sets up navigation between views
 */
function setupNavigation() {
    const navHome = document.getElementById('navhome');
    const navProfile = document.getElementById('nav-profile');
    const navServices = document.getElementById('nav-services');
    const navApps = document.getElementById('nav-apps');
    
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('home-view');
    });
    
    navProfile.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('profile-view');
        loadProfileManager();
    });
    
    navServices.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('services-view');
        loadServices();
    });
    
    navApps.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('apps-view');
        loadApps();
    });
}

/**
 * Switches to the specified view
 * @param {string} viewId - ID of the view to show
 */
function switchView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show the selected view
    document.getElementById(viewId).classList.add('active');
}

/**
 * Sets up navigation between views
 */
function setupNavigation() {
    const navHome = document.getElementById('navhome');
    const navProfile = document.getElementById('nav-profile');
    const navServices = document.getElementById('nav-services');
    const navApps = document.getElementById('nav-apps');
    
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('home-view');
    });
    
    navProfile.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('profile-view');
        loadProfileManager();
    });
    
    navServices.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('services-view');
        loadServices();
    });
    
    navApps.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('apps-view');
        loadApps();
    });
}

/**
 * Switches to the specified view
 * @param {string} viewId - ID of the view to show
 */
function switchView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show the selected view
    document.getElementById(viewId).classList.add('active');
}

/**
 * Loads the profile manager functionality
 */
function loadProfileManager() {
    const pmContainer = document.getElementById('PM-container');
    
    // This would normally load the profile manager from external scripts
    // For now, displaying a placeholder message
    pmContainer.innerHTML = `
        <div class="section-card">
            <h3>Profile Manager_</h3>
            <p>Profile manager functionality will be loaded here.</p>
            <p>This will integrate with the nostr-profile-manager module.</p>
            
            <div class="profile-actions">
                <button class="action-button">Manage Metadata</button>
                <button class="action-button">Manage Contacts</button>
                <button class="action-button">Manage Relays</button>
                <button class="action-button">Delete Events</button>
            </div>
        </div>
    `;
}

/**
 * Loads the services view
 */
function loadServices() {
    const servicesContainer = document.getElementById('services-container');
    
    // This would normally fetch services from parsed markdown or API
    // For now, displaying placeholder services
    servicesContainer.innerHTML = `
        <div class="resource-card">
            <h3>NIP-05 Identity Services</h3>
            <p>Providers that offer NIP-05 identity verification services for Nostr users.</p>
            <div class="resource-links">
                <a href="#services/nip05">View Services <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
        
        <div class="resource-card">
            <h3>Relay Services</h3>
            <p>Nostr relay hosting and management services for reliable connectivity.</p>
            <div class="resource-links">
                <a href="#services/relays">View Services <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
        
        <div class="resource-card">
            <h3>Storage Services</h3>
            <p>NIP-96 compatible file storage services for media and document hosting.</p>
            <div class="resource-links">
                <a href="#services/storage">View Services <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `;
}

/**
 * Loads the apps view
 */
function loadApps() {
    const appsContainer = document.getElementById('apps-container');
    
    // This would normally fetch apps from parsed markdown or API
    // For now, displaying placeholder apps
    appsContainer.innerHTML = `
        <div class="resource-card">
            <h3>Mobile Clients</h3>
            <p>Nostr clients for iOS and Android devices.</p>
            <div class="resource-links">
                <a href="#apps/mobile">View Apps <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
        
        <div class="resource-card">
            <h3>Web Clients</h3>
            <p>Browser-based Nostr clients for desktop and mobile access.</p>
            <div class="resource-links">
                <a href="#apps/web">View Apps <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
        
        <div class="resource-card">
            <h3>Desktop Clients</h3>
            <p>Native Nostr applications for Windows, macOS, and Linux.</p>
            <div class="resource-links">
                <a href="#apps/desktop">View Apps <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `;
}

/**
 * Parse and display content from README.md
 * @returns {Promise<void>}
 */
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

        // Setup search functionality
        setupSearch();

    } catch (error) {
        console.error('Error processing markdown:', error);
        throw error; // Re-throw to be caught by the main error handler
    }
}

/**
 * Generate navigation from content
 * @param {string[]} sectionNames - Array of section names
 */
function generateNavigation(sectionNames) {
    const navList = document.querySelector('#category-list');
    const toastList = document.querySelector('#category-toast-list');
    
    // Clear existing navigation
    navList.innerHTML = '';
    toastList.innerHTML = '';
    
    sectionNames.forEach(section => {
        // Create URL-friendly ID
        const sectionId = section
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Add to regular list (desktop)
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#${sectionId}" data-category="${sectionId}">
                ${section}
            </a>
        `;

        // Add click handler
        li.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links in both desktop and toast
            document.querySelectorAll('#category-list li, #category-toast-list li').forEach(item => 
                item.classList.remove('active')
            );
            
            // Add active class to clicked link and its toast counterpart
            li.classList.add('active');
            document.querySelectorAll(`#category-toast-list li a[data-category="${sectionId}"]`)
                .forEach(link => link.parentElement.classList.add('active'));
            
            // Display the section
            displaySection(section, window.parsedResources);
            
            // Close the toast on mobile
            document.getElementById('category-toast-container').classList.remove('active');
        });

        navList.appendChild(li);
        
        // Create duplicate for toast menu (mobile)
        const toastLi = li.cloneNode(true);
        
        // Add click handler for toast items
        toastLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links in both desktop and toast
            document.querySelectorAll('#category-list li, #category-toast-list li').forEach(item => 
                item.classList.remove('active')
            );
            
            // Add active class to clicked link and its desktop counterpart
            toastLi.classList.add('active');
            document.querySelectorAll(`#category-list li a[data-category="${sectionId}"]`)
                .forEach(link => link.parentElement.classList.add('active'));
            
            // Display the section
            displaySection(section, window.parsedResources);
            
            // Close the toast
            document.getElementById('category-toast-container').classList.remove('active');
        });
        
        toastList.appendChild(toastLi);
    });

    // Set first item as active in both menus
    const firstDesktopLink = navList.querySelector('li');
    const firstToastLink = toastList.querySelector('li');
    
    if (firstDesktopLink) {
        firstDesktopLink.classList.add('active');
    }
    
    if (firstToastLink) {
        firstToastLink.classList.add('active');
    }
    
    // Setup category toast button
    setupCategoryToast();
}

/**
 * Display a specific section of content
 * @param {string} sectionName - Name of the section to display
 * @param {Object} sections - Object containing all sections
 */
function displaySection(sectionName, sections) {
    const container = document.getElementById('resources-container');
    container.innerHTML = '';

    // Add section header
    const header = document.createElement('h3');
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

/**
 * Creates a resource card element from data
 * @param {Object} resource - Resource data
 * @returns {HTMLElement} - Resource card element
 */
function createResourceCard(resource) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    
    // Stars display if available
    const starsDisplay = resource.stars 
        ? `<span class="stars"><i class="fas fa-star"></i> ${resource.stars}</span>` 
        : '';
    
    card.innerHTML = `
        <h3>${resource.name} ${starsDisplay}</h3>
        <p>${resource.description}</p>
        <div class="resource-links">
            <a href="${resource.link}" target="_blank" rel="noopener noreferrer">
                View Project <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `;
    
    return card;
}

/**
 * Sets up search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    // Search on button click
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

/**
 * Performs search across all resources
 * @param {string} searchTerm - Term to search for
 */
function performSearch(searchTerm) {
    const container = document.getElementById('resources-container');
    
    if (!searchTerm) {
        // If search is empty, restore current category view
        const currentCategory = document.querySelector('#category-list li.active a')?.textContent;
        if (currentCategory) {
            displaySection(currentCategory, window.parsedResources);
        }
        return;
    }

    // Clear current container
    container.innerHTML = '';
    
    // Add search results header
    const header = document.createElement('h3');
    header.textContent = `Search Results for "${searchTerm}"`;
    container.appendChild(header);
    
    // Search through all sections
    let resultsFound = false;
    
    Object.entries(window.parsedResources).forEach(([sectionName, sectionContent]) => {
        sectionContent.forEach(item => {
            if (item.type === 'resources') {
                // Process resource items for search
                searchResourceList(item.element, container, searchTerm, sectionName);
                resultsFound = true;
            } else if (item.type === 'content') {
                // Search through regular content
                const contentText = item.element.textContent.toLowerCase();
                if (contentText.includes(searchTerm.toLowerCase())) {
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'markdown-content';
                    contentDiv.innerHTML = item.element.outerHTML;
                    
                    // Add section label
                    const sectionLabel = document.createElement('div');
                    sectionLabel.className = 'category-label';
                    sectionLabel.textContent = sectionName;
                    
                    container.appendChild(sectionLabel);
                    container.appendChild(contentDiv);
                    resultsFound = true;
                }
            }
        });
    });
    
    // Show "no results" message if nothing found
    if (!resultsFound) {
        container.innerHTML += `
            <div class="no-results">
                <p>No resources found matching "${searchTerm}"</p>
            </div>
        `;
    }
}

/**
 * Search through a resource list
 * @param {HTMLElement} ulElement - UL element containing resources
 * @param {HTMLElement} container - Container to add results to
 * @param {string} searchTerm - Term to search for
 * @param {string} sectionName - Name of the section being searched
 */
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
            
            if (searchableText.includes(searchTerm.toLowerCase())) {
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