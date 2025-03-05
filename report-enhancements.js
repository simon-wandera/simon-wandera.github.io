/**
 * Report-specific enhancements for Project November
 * Handles report page interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== Reading Progress Bar - Improved Logic =====
    const progressBar = document.getElementById('read-progress');
    const reportContent = document.querySelector('.report-content');
    
    if (progressBar && reportContent) {
        const updateProgressBar = () => {
            // Get the article height, accounting for padding
            const contentBox = reportContent.getBoundingClientRect();
            const contentHeight = contentBox.height;
            
            // Get the window height
            const windowHeight = window.innerHeight;
            
            // Calculate how much we can scroll (content - window)
            const scrollableContent = contentHeight > windowHeight ? 
                contentHeight - windowHeight : 0;
            
            // Early exit if no scrollable content
            if (scrollableContent === 0) {
                progressBar.style.width = '100%';
                return;
            }
            
            // Calculate how far we've scrolled into the content
            const scrollTop = Math.abs(contentBox.top);
            const scrollPercentage = (scrollTop / scrollableContent) * 100;
            
            // Clamp between 0-100
            const clampedPercentage = Math.min(Math.max(scrollPercentage, 0), 100);
            
            // Apply to progress bar with smoother easing
            progressBar.style.width = `${clampedPercentage}%`;
        };
        
        // Update on scroll and resize
        window.addEventListener('scroll', updateProgressBar, { passive: true });
        window.addEventListener('resize', updateProgressBar);
        
        // Initial update
        updateProgressBar();
    }

    // ===== Print Functionality =====
    const printButton = document.getElementById('print-button');
    
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }

    // ===== Download Options =====
    const downloadOptions = document.querySelectorAll('.download-option');
    
    downloadOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            const format = this.getAttribute('data-format');
            
            // In a real-world scenario, this would call a server endpoint to generate and download
            // the document in the requested format. For demonstration, we'll show a message.
            alert(`Downloading report in ${format.toUpperCase()} format...\n\nIn a production environment, this would generate and download a ${format.toUpperCase()} file.`);
        });
    });

    // ===== Dropdown Toggle =====
    const downloadBtn = document.querySelector('.download-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    if (downloadBtn && dropdownContent) {
        downloadBtn.addEventListener('click', function() {
            dropdownContent.classList.toggle('show');
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!e.target.matches('.download-btn') && !e.target.closest('.download-btn')) {
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            }
        });
    }

    // ===== Mobile Table of Contents - Enhanced =====
    const mobileTocBtn = document.getElementById('mobile-toc-btn');
    const mobileToc = document.getElementById('mobile-toc');
    
    if (mobileTocBtn && mobileToc) {
        // Track whether TOC is open
        let isTocOpen = false;
        
        // Open mobile TOC
        function openMobileToc() {
            mobileToc.classList.add('active');
            isTocOpen = true;
            
            // Set focus to close button
            const closeBtn = mobileToc.querySelector('.close-mobile-toc');
            if (closeBtn) {
                setTimeout(() => {
                    closeBtn.focus();
                }, 300);
            }
            
            // Announce to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.classList.add('sr-only');
            announcement.textContent = 'Table of contents opened';
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 3000);
        }
        
        // Close mobile TOC
        function closeMobileToc() {
            mobileToc.classList.remove('active');
            isTocOpen = false;
            
            // Return focus to button that opened it
            mobileTocBtn.focus();
        }
        
        // Toggle TOC
        mobileTocBtn.addEventListener('click', openMobileToc);
        
        // Close button
        const closeTocBtn = mobileToc.querySelector('.close-mobile-toc');
        if (closeTocBtn) {
            closeTocBtn.addEventListener('click', closeMobileToc);
        }
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (isTocOpen && !e.target.closest('.mobile-toc') && !e.target.closest('#mobile-toc-btn')) {
                closeMobileToc();
            }
        });
        
        // Close with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isTocOpen) {
                closeMobileToc();
            }
        });
        
        // Focus trap for mobile TOC
        mobileToc.addEventListener('keydown', function(e) {
            if (!isTocOpen || e.key !== 'Tab') return;
            
            const focusableElements = mobileToc.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        });
    }

    // ===== Enhanced Section Navigation =====
    const reportSections = document.querySelectorAll('.report-section');
    const tocLinks = document.querySelectorAll('.toc a, .mobile-toc a');
    
    // Set ids for sections if not already set
    reportSections.forEach(section => {
        const heading = section.querySelector('h2');
        if (heading && !section.id) {
            section.id = heading.textContent.toLowerCase().replace(/\s+/g, '-');
        }
    });
    
    // Smooth scroll to section when clicking ToC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update URL without reload
                history.pushState(null, null, '#' + targetId);
            }
        });
    });

    // ===== Section Highlighting - Fixed for Edge Cases =====
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -70% 0px', 
        threshold: [0, 0.1, 0.5]  // Multiple thresholds for better accuracy
    };
    
    const highlightCurrentSection = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            // Only update if the section is more than 10% visible
            if (entry.intersectionRatio >= 0.1) {
                const id = entry.target.getAttribute('id');
                updateActiveSection(id);
            }
        });
    }, observerOptions);
    
    function updateActiveSection(id) {
        // Update both desktop and mobile TOCs
        document.querySelectorAll('.toc a, .mobile-toc a').forEach(link => {
            const href = link.getAttribute('href').substring(1);
            
            if (href === id) {
                link.classList.add('active');
                
                // If it's in the desktop TOC, ensure it's visible (scroll parent if necessary)
                if (link.closest('.toc')) {
                    const tocContainer = link.closest('.toc');
                    const linkRect = link.getBoundingClientRect();
                    const containerRect = tocContainer.getBoundingClientRect();
                    
                    if (linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom) {
                        link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Start observing all sections
    reportSections.forEach(section => {
        highlightCurrentSection.observe(section);
    });

    // Add styles for active TOC items
    const tocActiveStyle = document.createElement('style');
    tocActiveStyle.textContent = `
        .toc a.active, .mobile-toc a.active {
            background-color: rgba(151, 188, 98, 0.1);
            color: var(--color-primary);
            font-weight: 500;
            border-left: 3px solid var(--color-primary);
            padding-left: calc(1rem - 3px);
        }
        
        .report-section {
            scroll-margin-top: 100px;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            background-color: white;
            min-width: 200px;
            box-shadow: var(--box-shadow);
            border-radius: var(--border-radius);
            z-index: 1;
            right: 0;
            margin-top: 10px;
        }
        
        html[data-theme="dark"] .dropdown-content {
            background-color: var(--color-dark-light);
        }
        
        .dropdown-content.show {
            display: block;
        }
        
        .download-option {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            text-decoration: none;
            color: var(--color-text);
            transition: var(--transition);
        }
        
        .download-option:hover {
            background-color: #f5f5f5;
            color: var(--color-primary);
        }
        
        html[data-theme="dark"] .download-option:hover {
            background-color: #333;
        }
        
        .download-option i {
            font-size: 1.2rem;
        }
        
        .share-report-btn {
            background-color: var(--color-secondary);
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 30px;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 0.8rem;
            transition: var(--transition);
            font-weight: 500;
            cursor: pointer;
            margin-left: 10px;
        }
        
        .share-report-btn:hover {
            background-color: var(--color-secondary-light);
            transform: translateY(-3px);
            box-shadow: var(--box-shadow);
        }
        
        .progress-bar-container {
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            height: 4px;
            background-color: rgba(0, 0, 0, 0.1);
            z-index: 999;
        }
        
        html[data-theme="dark"] .progress-bar-container {
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .progress-bar {
            height: 100%;
            width: 0;
            background-color: var(--color-primary);
            transition: width 0.1s;
        }
    `;
    document.head.appendChild(tocActiveStyle);

    // ===== Share Report Button =====
    const shareReportBtn = document.querySelector('.share-report-btn');
    
    if (shareReportBtn) {
        shareReportBtn.addEventListener('click', function() {
            // Open share modal with full report URL
            window.openShareModal(null);
        });
    }

    // ===== Add IDs to Finding Sections =====
    const findingCards = document.querySelectorAll('.finding-card');
    
    // Add IDs to finding cards for direct navigation
    if (findingCards.length > 0) {
        const topics = ['ants', 'wasps', 'spiders', 'additional'];
        
        findingCards.forEach((card, index) => {
            if (index < topics.length) {
                card.id = topics[index];
            }
        });
    }

    // ===== Enhanced Mobile ToC =====
    const downloadLink = document.querySelector('.download-link');
    
    // Setup download link in mobile ToC
    if (downloadLink) {
        downloadLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show dropdown instead
            const downloadBtn = document.querySelector('.download-btn');
            if (downloadBtn) {
                // Close mobile ToC
                mobileToc.classList.remove('active');
                
                // Timeout to allow ToC to close before showing dropdown
                setTimeout(() => {
                    // Trigger download dropdown
                    downloadBtn.click();
                }, 400);
            }
        });
    }
    
    // ===== Highlight Current Reading Section =====
    const findingSections = document.querySelectorAll('.finding-card, .report-section');
    const allLinks = document.querySelectorAll('.toc a, .mobile-toc a');
    
    // Create IntersectionObserver for more precise scrolling position detection
    const highlightSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                
                // Highlight corresponding link
                allLinks.forEach(link => {
                    const href = link.getAttribute('href').substring(1);
                    link.classList.toggle('active', href === id);
                });
            }
        });
    }, {
        rootMargin: "-20% 0px -75% 0px"
    });
    
    // Observe all sections
    findingSections.forEach(section => {
        if (section.id) {
            highlightSectionObserver.observe(section);
        }
    });
});
