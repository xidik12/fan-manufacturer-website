// ── Mobile menu toggle ──
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

// ── Header scroll effect with glassmorphism ──
const header = document.querySelector('.header-area');
if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });
}

// ── Counter animation with easing ──
function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2200;
    const startTime = performance.now();

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = Math.floor(easedProgress * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ── Intersection Observer for fade-up animations ──
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Trigger counters inside this element
            entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Observe all fade-up elements
document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// ── Section observer for general animations ──
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
            sectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('section').forEach(section => sectionObserver.observe(section));

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Parallax effect for hero sections ──
const heroEl = document.querySelector('.hero-slider');
if (heroEl) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < 800) {
            heroEl.style.backgroundPositionY = `${scrolled * 0.3}px`;
        }
    }, { passive: true });
}

// ── Scroll-driven spinning fan backgrounds ──
(function() {
    // Stand fan SVG — 3 spiral curved blades like a desk/stand fan
    const fanSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
            <!-- Outer guard ring -->
            <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.3"/>
            <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/>
            <!-- Center hub -->
            <circle cx="100" cy="100" r="14" opacity="0.8"/>
            <circle cx="100" cy="100" r="8" opacity="1"/>
            <!-- Blade 1 — spiral curve sweeping from hub to outer edge -->
            <path d="M100 86 C92 70, 68 42, 42 28 C28 20, 16 28, 22 42 C30 60, 52 72, 86 100 Z" opacity="0.6"/>
            <!-- Blade 2 — rotated 120° -->
            <path d="M100 86 C92 70, 68 42, 42 28 C28 20, 16 28, 22 42 C30 60, 52 72, 86 100 Z" opacity="0.6" transform="rotate(120 100 100)"/>
            <!-- Blade 3 — rotated 240° -->
            <path d="M100 86 C92 70, 68 42, 42 28 C28 20, 16 28, 22 42 C30 60, 52 72, 86 100 Z" opacity="0.6" transform="rotate(240 100 100)"/>
            <!-- Cross guard wires -->
            <line x1="100" y1="5" x2="100" y2="195" stroke="currentColor" stroke-width="1" opacity="0.12"/>
            <line x1="5" y1="100" x2="195" y2="100" stroke="currentColor" stroke-width="1" opacity="0.12"/>
            <line x1="33" y1="33" x2="167" y2="167" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
            <line x1="167" y1="33" x2="33" y2="167" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
        </g>
    </svg>`;

    const fanConfigs = [
        { class: 'scroll-fan--1', speed: 0.12, color: '#1e40af' },
        { class: 'scroll-fan--2', speed: -0.08, color: '#1e40af' },
    ];

    const fans = [];
    fanConfigs.forEach(config => {
        const el = document.createElement('div');
        el.className = `scroll-fan ${config.class}`;
        el.style.color = config.color;
        el.innerHTML = fanSVG;
        document.body.appendChild(el);
        fans.push({ el, speed: config.speed, rotation: 0 });
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                fans.forEach(fan => {
                    fan.rotation = scrollY * fan.speed;
                    fan.el.querySelector('svg').style.transform = `rotate(${fan.rotation}deg)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();
