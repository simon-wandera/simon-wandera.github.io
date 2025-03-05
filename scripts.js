document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // Mobile navigation toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', function() {
        // Toggle navigation
        nav.classList.toggle('nav-active');
        
        // Animate links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger animation
        burger.classList.toggle('toggle');
    });
    
    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });

    // Lightbox functionality
    const lightboxImages = document.querySelectorAll('.lightbox-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.close');
    
    lightboxImages.forEach(image => {
        image.addEventListener('click', function() {
            lightbox.style.display = 'flex';
            lightboxContent.src = this.src;
            lightboxCaption.innerHTML = this.alt;
        });
    });
    
    closeLightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
    
    // Also close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    // Handle form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (name && email && message) {
                // Here you would normally send the data to a server
                alert(`Thank you, ${name}! Your message has been received. We'll respond to ${email} shortly.`);
                contactForm.reset();
            } else {
                alert('Please fill all required fields');
            }
        });
    }
    
    // Add animation for burger menu toggle
    if (burger) {
        burger.addEventListener('click', () => {
            const lines = burger.querySelectorAll('div');
            lines[0].classList.toggle('line1-active');
            lines[1].classList.toggle('line2-active');
            lines[2].classList.toggle('line3-active');
        });
    }

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes navLinkFade {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .toggle .line2 {
            opacity: 0;
        }
        
        .toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        .line1-active {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .line2-active {
            opacity: 0;
        }
        
        .line3-active {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(style);

    // Create audio elements for team member interactions - Using same click sound
    const sounds = {
        click: new Audio('sounds/click1.mp3'),
        hover: new Audio('sounds/hover.mp3')
    };

    // Set volume for all sounds (subtle)
    Object.values(sounds).forEach(sound => {
        sound.volume = 0.2;
    });

    // Team member interaction
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        // Sound effect on hover
        member.addEventListener('mouseenter', function() {
            sounds.hover.currentTime = 0;
            sounds.hover.play();
        });
        
        // Click effect with sound - All use the same click sound now
        member.addEventListener('click', function() {
            sounds.click.currentTime = 0;
            sounds.click.play();
            
            // Add pulse animation
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 1000);
        });
    });

    // Create sound files directory and placeholder files if they don't exist
    function createSoundFilesPlaceholder() {
        console.log('Note: Sound files need to be added to a "sounds" directory.');
        console.log('Sounds referenced: click1.mp3, hover.mp3');
    }
    createSoundFilesPlaceholder();

    // Fallback in case sounds fail to load
    Object.values(sounds).forEach(sound => {
        sound.addEventListener('error', function() {
            console.log('Sound file could not be loaded.');
        });
    });

    // Enhanced scroll animations for team section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Add appear class and observe team elements
    document.querySelectorAll('.team-member').forEach(member => {
        member.classList.add('hidden-element');
        observer.observe(member);
    });
    
    // Also observe the team quote
    const teamQuote = document.querySelector('.team-quote');
    if (teamQuote) {
        teamQuote.classList.add('hidden-element');
        observer.observe(teamQuote);
    }

    // Add CSS for the animations
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .hidden-element {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .appear {
            opacity: 1;
            transform: translateY(0);
        }
        
        .team-member {
            transition: transform 0.4s ease, box-shadow 0.4s ease, opacity 0.6s ease;
        }
    `;
    document.head.appendChild(animationStyle);

    // Gallery filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mediaItems = document.querySelectorAll('.media-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter media items
            const filterValue = this.getAttribute('data-filter');
            
            mediaItems.forEach(item => {
                // First add animate-out class
                item.classList.add('animate-out');
                
                setTimeout(() => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hidden');
                        setTimeout(() => {
                            item.classList.remove('animate-out');
                            item.classList.add('animate-in');
                            setTimeout(() => {
                                item.classList.remove('animate-in');
                            }, 500);
                        }, 50);
                    } else {
                        item.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });
    
    // Handle video play overlays
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    videoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const overlay = wrapper.querySelector('.play-overlay');
        
        overlay.addEventListener('click', function() {
            if (video.paused) {
                video.play();
                overlay.style.opacity = 0;
            } else {
                video.pause();
                overlay.style.opacity = 1;
            }
        });
        
        video.addEventListener('play', function() {
            overlay.style.opacity = 0;
        });
        
        video.addEventListener('pause', function() {
            overlay.style.opacity = 1;
        });
        
        video.addEventListener('ended', function() {
            overlay.style.opacity = 1;
        });
    });
    
    // Load more functionality (demo)
    const loadMoreBtn = document.querySelector('.load-more');
    if (loadMoreBtn) {
        let clickCount = 0;
        
        loadMoreBtn.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount === 1) {
                // Simulate loading delay
                loadMoreBtn.textContent = 'Loading...';
                loadMoreBtn.disabled = true;
                
                setTimeout(() => {
                    loadMoreBtn.textContent = 'No More Items';
                    loadMoreBtn.disabled = true;
                    loadMoreBtn.style.backgroundColor = '#aaa';
                    loadMoreBtn.style.cursor = 'not-allowed';
                }, 1500);
            }
        });
    }
    
    // Add animation styles for gallery items
    const galleryAnimationStyle = document.createElement('style');
    galleryAnimationStyle.textContent = `
        .media-item {
            transition: transform 0.4s ease, box-shadow 0.4s ease, opacity 0.3s ease;
        }
        
        .animate-out {
            opacity: 0;
            transform: translateY(10px);
        }
        
        .animate-in {
            animation: fadeInUp 0.5s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(galleryAnimationStyle);

    // Particles background for hero section
    function loadParticlesJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.onload = initializeParticles;
        document.head.appendChild(script);
    }
    
    // Initialize particles
    function initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#ffffff",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });
        } else {
            console.error("particlesJS is not defined. The script might not have loaded correctly.");
        }
    }
    
    // Check if particles-js element exists before loading the script
    if (document.getElementById('particles-js')) {
        loadParticlesJS();
    }

    // Smooth scroll from landing page to next section
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.querySelector('#research');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Update all theme colors to match the new palette
    function updateThemeColors() {
        // This function could be used to programmatically update color themes
        // if needed in the future (e.g., theme switching)
        console.log("Theme colors updated to new palette");
    }
    
    // Initialize color theme
    updateThemeColors();
});
