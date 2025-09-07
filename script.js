// Portfolio JavaScript - Simple, Future-Proof, Mobile-Friendly

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const contactForm = document.getElementById('contact-form');

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
        this.bindEvents();
    }

    bindEvents() {
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = themeToggle.querySelector('.theme-icon');
        icon.textContent = this.theme === 'light' ? '🌙' : '☀️';
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle scroll events
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        navMenu.classList.toggle('active', this.isMenuOpen);
        hamburger.classList.toggle('active', this.isMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const scrolled = window.scrollY > 50;
        navbar.style.background = scrolled 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(255, 255, 255, 0.95)';
        
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            navbar.style.background = scrolled 
                ? 'rgba(17, 24, 39, 0.98)' 
                : 'rgba(17, 24, 39, 0.95)';
        }
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.observeElements();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.skill-category, .project-card, .about-text, .contact-info').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    handleScroll() {
        // Add any scroll-based animations here
        const scrolled = window.scrollY;
        const parallaxElements = document.querySelectorAll('.hero-image');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}

// Form Manager
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Basic validation
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        this.showLoading();
        
        // Simulate form submission (you can replace this with your own email service later)
        setTimeout(() => {
            this.showSuccess();
            contactForm.reset();
        }, 2000);
    }

    validateForm(data) {
        const errors = [];
        
        if (!data.name.trim()) {
            errors.push('Name is required');
        }
        
        if (!data.email.trim()) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email');
        }
        
        if (!data.subject.trim()) {
            errors.push('Subject is required');
        }
        
        if (!data.message.trim()) {
            errors.push('Message is required');
        }

        if (errors.length > 0) {
            this.showErrors(errors);
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showLoading() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Store original text for restoration
        submitBtn.dataset.originalText = originalText;
    }

    showSuccess() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.dataset.originalText;
        
        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.style.background = '#10b981';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }

    showError(errorMessage) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.dataset.originalText;
        
        submitBtn.textContent = 'Error - Try Again';
        submitBtn.style.background = '#dc2626';
        submitBtn.disabled = false;
        
        // Show error message
        this.showErrors([errorMessage]);
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
        }, 5000);
    }

    showErrors(errors) {
        // Remove existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Create error container
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.style.cssText = `
            background: #fee2e2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #fecaca;
        `;
        
        errorContainer.innerHTML = `
            <strong>Please fix the following errors:</strong>
            <ul style="margin: 0.5rem 0 0 1rem;">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        
        contactForm.insertBefore(errorContainer, contactForm.firstChild);
        
        // Scroll to form
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Performance Optimizer
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeScrollEvents();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    optimizeScrollEvents() {
        let ticking = false;
        
        const updateScroll = () => {
            // Handle scroll-based updates here
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }
}

// Utility Functions
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Global function for timeline item toggle (called from HTML onclick)
function toggleTimelineItem(header) {
    const timelineItem = header.closest('.timeline-item');
    const description = timelineItem.querySelector('.timeline-description');
    const isExpanded = header.classList.contains('expanded');
    
    // Close all other expanded items
    document.querySelectorAll('.timeline-header.expanded').forEach(otherHeader => {
        if (otherHeader !== header) {
            otherHeader.classList.remove('expanded');
            otherHeader.querySelector('.timeline-description').classList.remove('expanded');
        }
    });
    
    // Toggle current item
    if (isExpanded) {
        header.classList.remove('expanded');
        description.classList.remove('expanded');
    } else {
        header.classList.add('expanded');
        description.classList.add('expanded');
        
        // Smooth scroll to the expanded item
        setTimeout(() => {
            timelineItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 200);
    }
}

// Timeline Manager
class TimelineManager {
    constructor() {
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.timelineDots = document.querySelectorAll('.timeline-dot');
        this.init();
    }

    init() {
        this.bindEvents();
        this.observeTimelineItems();
        this.addHoverEffects();
    }

    bindEvents() {
        // Add click events to timeline dots
        this.timelineDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.highlightTimelineItem(index));
            dot.addEventListener('mouseenter', () => this.addPulseEffect(dot));
            dot.addEventListener('mouseleave', () => this.removePulseEffect(dot));
        });

        // Add hover effects to timeline content
        this.timelineItems.forEach(item => {
            const content = item.querySelector('.timeline-content');
            content.addEventListener('mouseenter', () => this.highlightTimelineDot(item));
            content.addEventListener('mouseleave', () => this.unhighlightTimelineDot(item));
        });

        // Add keyboard support for timeline headers
        document.querySelectorAll('.timeline-header').forEach(header => {
            header.setAttribute('tabindex', '0');
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTimelineItem(header);
                }
            });
        });
    }

    observeTimelineItems() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered animation
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        this.animateTimelineDot(entry.target);
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.timelineItems.forEach(item => {
            observer.observe(item);
        });
    }

    animateTimelineDot(timelineItem) {
        const dot = timelineItem.querySelector('.timeline-dot');
        if (dot) {
            dot.style.transform = 'scale(1.2)';
            dot.style.boxShadow = '0 0 0 8px rgba(59, 130, 246, 0.4), 0 8px 20px rgba(0, 0, 0, 0.2)';
            
            setTimeout(() => {
                dot.style.transform = '';
                dot.style.boxShadow = '';
            }, 600);
        }
    }

    highlightTimelineItem(index) {
        // Remove previous highlights
        this.timelineItems.forEach(item => {
            item.classList.remove('highlighted');
        });
        
        // Highlight selected item
        this.timelineItems[index].classList.add('highlighted');
        
        // Scroll to the item
        this.timelineItems[index].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    addPulseEffect(dot) {
        dot.classList.add('pulse');
    }

    removePulseEffect(dot) {
        dot.classList.remove('pulse');
    }

    highlightTimelineDot(timelineItem) {
        const dot = timelineItem.querySelector('.timeline-dot');
        if (dot) {
            dot.style.transform = 'scale(1.2)';
            dot.style.boxShadow = '0 0 0 6px rgba(59, 130, 246, 0.3), 0 6px 16px rgba(0, 0, 0, 0.15)';
        }
    }

    unhighlightTimelineDot(timelineItem) {
        const dot = timelineItem.querySelector('.timeline-dot');
        if (dot) {
            dot.style.transform = '';
            dot.style.boxShadow = '';
        }
    }

    addHoverEffects() {
        // Add skill tag hover effects
        document.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'scale(1.1) translateY(-2px)';
                tag.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = '';
                tag.style.boxShadow = '';
            });
        });
    }

    // Method to add new timeline item dynamically
    addTimelineItem(data) {
        const timeline = document.querySelector('.timeline');
        const newItem = this.createTimelineItem(data);
        timeline.appendChild(newItem);
        
        // Re-initialize observers for the new item
        this.observeTimelineItems();
    }

    createTimelineItem(data) {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.setAttribute('data-year', data.year);
        
        item.innerHTML = `
            <div class="timeline-marker">
                <div class="timeline-dot"></div>
                <div class="timeline-line"></div>
            </div>
            <div class="timeline-content">
                <div class="timeline-header" onclick="toggleTimelineItem(this)">
                    <h3>${data.title}</h3>
                    <span class="timeline-company">${data.company}</span>
                    <span class="timeline-duration">${data.duration}</span>
                    <div class="expand-icon">+</div>
                </div>
                <div class="timeline-description">
                    <p>${data.description}</p>
                    <div class="timeline-skills">
                        ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        return item;
    }
}

// Certificate Modal Manager
class CertificateModalManager {
    constructor() {
        this.modal = document.getElementById('certificate-modal');
        this.certificateImage = document.getElementById('certificate-image');
        this.certificatePdf = document.getElementById('certificate-pdf');
        this.closeBtn = document.querySelector('.close');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Click on certificate cards
        document.querySelectorAll('.clickable-cert').forEach(card => {
            card.addEventListener('click', (e) => this.openModal(e));
        });

        // Close modal events
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    openModal(e) {
        const certificatePath = e.currentTarget.getAttribute('data-certificate');
        const fileType = e.currentTarget.getAttribute('data-type');
        
        // Hide both elements first
        this.certificateImage.style.display = 'none';
        this.certificatePdf.style.display = 'none';
        
        if (fileType === 'pdf') {
            // Show PDF in iframe
            this.certificatePdf.src = certificatePath;
            this.certificatePdf.style.display = 'block';
        } else {
            // Show image
            this.certificateImage.src = certificatePath;
            this.certificateImage.style.display = 'block';
        }
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        
        // Clear the iframe src to stop PDF loading
        this.certificatePdf.src = '';
        this.certificateImage.src = '';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
    new FormManager();
    new PerformanceOptimizer();
    new TimelineManager();
    new CertificateModalManager();

    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu on escape
            const navManager = new NavigationManager();
            navManager.closeMobileMenu();
        }
    });

    // Add touch support for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

    console.log('Portfolio loaded successfully! 🚀');
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        NavigationManager,
        AnimationManager,
        FormManager,
        PerformanceOptimizer,
        TimelineManager,
        utils
    };
}
