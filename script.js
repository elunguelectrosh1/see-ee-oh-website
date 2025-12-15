// ============================================
// SEE-EE-OH Website JavaScript
// Copyright 2025 SEE-EE-OH (Pty) Ltd
// Founded by: Benjamen Elungu
// ============================================

console.log('SEE-EE-OH Website Loaded Successfully');
console.log('Securing Southern Africa\'s Digital Future');

// ============================================
// Mobile Menu Toggle
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animate hamburger to X
        if (hamburger.classList.contains('active')) {
            hamburger.innerHTML = '<span style="transform: rotate(45deg) translateY(8px);"></span><span style="opacity: 0;"></span><span style="transform: rotate(-45deg) translateY(-8px);"></span>';
        } else {
            hamburger.innerHTML = '<span></span><span></span><span></span>';
        }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.innerHTML = '<span></span><span></span><span></span>';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.innerHTML = '<span></span><span></span><span></span>';
        }
    });
}

// ============================================
// Smooth Scrolling for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const headerOffset = 80; // Height of fixed navbar
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Navbar Background Change on Scroll
// ============================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'linear-gradient(135deg, rgba(10, 36, 99, 0.98) 0%, rgba(29, 53, 87, 0.98) 100%)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #0A2463 0%, #1D3557 100%)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
});

// ============================================
// Animate Elements on Scroll (Intersection Observer)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all service cards, stat items, and why items
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .stat-item, .why-item, .cta-feature, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        fadeInObserver.observe(el);
    });
});

// ============================================
// Counter Animation for Stats
// ============================================
const animateCounter = (element, target, suffix = '') => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format the number
        let displayValue = Math.floor(current);
        
        // Add suffix
        if (suffix === '+') {
            element.textContent = displayValue + '+';
        } else if (suffix === '%') {
            element.textContent = displayValue + '%';
        } else if (suffix === '/7') {
            element.textContent = '24/7';
        } else {
            element.textContent = displayValue;
        }
    }, 30);
};

// Animate stat numbers when they come into view
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const number = entry.target.querySelector('.stat-number');
            const text = number.textContent.trim();
            
            // Determine the target value and suffix
            if (text.includes('%')) {
                const value = parseInt(text);
                animateCounter(number, value, '%');
            } else if (text.includes('+')) {
                const value = parseInt(text);
                animateCounter(number, value, '+');
            } else if (text.includes('/')) {
                number.textContent = '24/7';
            } else {
                const value = parseInt(text);
                if (!isNaN(value)) {
                    animateCounter(number, value);
                }
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-item').forEach(stat => {
        statObserver.observe(stat);
    });
});

// ============================================
// Formspree Contact Form Handler
// ============================================

// Handle Formspree form submission with better UX
const contactFormSpree = document.querySelector('.contact-form[action*="formspree"]');
if (contactFormSpree) {
    contactFormSpree.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formStatus = document.getElementById('form-status');
        const submitBtn = contactFormSpree.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        formStatus.style.display = 'none';
        
        try {
            const formData = new FormData(contactFormSpree);
            const response = await fetch(contactFormSpree.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                formStatus.style.display = 'block';
                formStatus.style.background = '#d4edda';
                formStatus.style.color = '#155724';
                formStatus.style.border = '1px solid #c3e6cb';
                formStatus.style.padding = '1rem';
                formStatus.style.borderRadius = '8px';
                formStatus.style.marginBottom = '1rem';
                formStatus.innerHTML = `
                    <strong>✓ Message Sent Successfully!</strong><br>
                    Thank you for contacting SEEEEOH. We'll respond within 2 hours during business hours.
                `;
                
                // Reset form
                contactFormSpree.reset();
                
                // Scroll to success message
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Hide success message after 8 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 8000);
                
                // Track success
                console.log('✓ Form submitted successfully to Formspree');
                
            } else {
                const data = await response.json();
                if (data.errors) {
                    throw new Error(data.errors.map(error => error.message).join(', '));
                } else {
                    throw new Error('Form submission failed');
                }
            }
            
        } catch (error) {
            // Error
            formStatus.style.display = 'block';
            formStatus.style.background = '#f8d7da';
            formStatus.style.color = '#721c24';
            formStatus.style.border = '1px solid #f5c6cb';
            formStatus.style.padding = '1rem';
            formStatus.style.borderRadius = '8px';
            formStatus.style.marginBottom = '1rem';
            formStatus.innerHTML = `
                <strong>✗ Something went wrong</strong><br>
                Please email us directly at <a href="mailto:exoticminimalist40@gmail.com" style="color: #721c24; text-decoration: underline;">exoticminimalist40@gmail.com</a> 
                or call +264 85 749 9175
            `;
            
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// Easter Egg: Console Message
// ============================================
console.log('%c👁️ SEEEEOH 👁️', 'font-size: 30px; font-weight: bold; color: #00B4D8;');
console.log('%cSecuring Southern Africa\'s Digital Future', 'font-size: 14px; color: #0A2463;');
console.log('%c🇳🇦 Proudly Namibian | Founded by Benjamen Elungu', 'font-size: 12px; color: #666;');
console.log('%cInterested in working with us? Email: exoticminimalist40@gmail.com', 'font-size: 12px; color: #00B4D8;');

console.log('✓ All scripts loaded successfully');
console.log('✓ Formspree form handler loaded');
