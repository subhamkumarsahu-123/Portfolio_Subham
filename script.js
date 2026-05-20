/* ==========================================================================
   INTERACTIVE PORTFOLIO ENGINE - SUBHAM KUMAR SAHU
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all custom components
    initNeuralCanvas();
    initTypewriter();
    initMobileNav();
    initScrollEffects();
    initSkillsTabs();
    initProjectsFilter();
    initContactForm();
    initScrollReveal();
});

/* ==========================================================================
   1. NEURAL PARTICLE NETWORK (CANVAS PHYSICS)
   ========================================================================== */
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Resize handler
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    // Particle Object Blueprint
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Velocity components
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.size = Math.random() * 2 + 1.5;
            this.baseColor = Math.random() > 0.5 ? '#00f2fe' : '#9d4edd';
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor;
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.baseColor;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }

        update() {
            // Screen edge check
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Mouse interaction (soft attraction)
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.hypot(dx, dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    // Elastic attraction
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }
        }
    }

    // Populate particles based on viewport area
    function initParticles() {
        particles = [];
        const quantity = Math.floor((canvas.width * canvas.height) / 11000);
        const maxLimit = Math.min(quantity, 130); // Cap for performance
        for (let i = 0; i < Math.max(maxLimit, 45); i++) {
            particles.push(new Particle());
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connection lines
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.hypot(dx, dy);

                if (distance < 110) {
                    // Line alpha gets stronger as they get closer
                    const alpha = (110 - distance) / 110 * 0.16;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    // Create gradient lines matching the particle themes
                    const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    grad.addColorStop(0, particles[i].baseColor + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
                    grad.addColorStop(1, particles[j].baseColor + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
                    
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Connect mouse to particles
            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.hypot(dx, dy);
                if (distance < mouse.radius) {
                    const alpha = (mouse.radius - distance) / mouse.radius * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    // Mouse Tracking Event Listeners
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        // debounce resize to avoid flickering
        clearTimeout(canvas.resizeTimer);
        canvas.resizeTimer = setTimeout(resizeCanvas, 200);
    });

    // Start
    resizeCanvas();
    animate();
}

/* ==========================================================================
   2. HERO TYPEWRITER CAROUSEL
   ========================================================================== */
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const words = JSON.parse(element.getAttribute('data-words'));
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Erase characters
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            // Write characters
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // natural typing speed
        }

        // Handle word completions
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2200; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; // Loop back
            typingSpeed = 400; // brief delay before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing loop
    setTimeout(type, 1000);
}

/* ==========================================================================
   3. MOBILE NAVIGATION PANEL TOGGLE
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggleBtn || !navMenu) return;

    // Toggle menu slide
    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        // Update hamburger icon to close mark
        toggleBtn.innerHTML = isActive 
            ? '<i class="fa-solid fa-xmark"></i>' 
            : '<i class="fa-solid fa-bars-staggered"></i>';
    });

    // Close mobile menu on page click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                toggleBtn.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
            }
        });
    });
}

/* ==========================================================================
   4. READING SCROLL & SECTION NAVIGATION HIGHLIGHT (SCROLL SPY)
   ========================================================================== */
function initScrollEffects() {
    const header = document.querySelector('.header');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // 1. Update Sticky Header Style
        if (scrollTop > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        } else {
            header.style.padding = '20px 0';
            header.style.boxShadow = 'none';
        }

        // 2. Reading Progress Indicator
        if (documentHeight > 0 && scrollProgress) {
            const percent = (scrollTop / documentHeight) * 100;
            scrollProgress.style.width = `${percent}%`;
        }

        // 3. Navigation Scroll Spy
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* ==========================================================================
   5. SKILLS MATRIX EXPERTISE TAB SELECTOR
   ========================================================================== */
function initSkillsTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const targetTab = header.getAttribute('data-tab');

            // Set headers active
            tabHeaders.forEach(btn => btn.classList.remove('active'));
            header.classList.add('active');

            // Set panel active
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('id') === targetTab) {
                    pane.classList.add('active');
                }
            });
        });
    });
}

/* ==========================================================================
   6. PROJECTS CATEGORY FILTERS (ANIMATED)
   ========================================================================== */
function initProjectsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                // Visual transition triggers
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger fade and scale in
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Hide after animation finishes
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   7. INTERACTIVE CONTACT FORM WITH FEEDBACK TOASTS
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toast-close');
    const submitBtn = document.getElementById('btn-submit');

    if (!form || !toast || !submitBtn) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop default action

        // Show sending state parameters on button
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Mock mail transmission processing
        setTimeout(() => {
            // Clear inputs
            form.reset();

            // Restore button properties
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;

            // Trigger visual Toast reveal animation
            toast.classList.add('show');

            // Auto-hide toast after 4.5 seconds
            const autoHide = setTimeout(() => {
                toast.classList.remove('show');
            }, 4500);

            // Close button click handler
            toastClose.addEventListener('click', () => {
                toast.classList.remove('show');
                clearTimeout(autoHide);
            }, { once: true });

        }, 1500);
    });
}

/* ==========================================================================
   8. INTUITIVE SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // viewport
            threshold: 0.1, // reveal when 10% visible
            rootMargin: '0px 0px -50px 0px' // offset bottom trigger slightly
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    obs.unobserve(entry.target); // Trigger once
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('reveal-active'));
    }
}
