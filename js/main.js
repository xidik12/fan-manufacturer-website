// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// Header scroll effect
const header = document.querySelector('.header-area');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Counter animation
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section').forEach(section => observer.observe(section));
