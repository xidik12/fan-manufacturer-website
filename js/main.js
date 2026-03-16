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
    // Propeller fan SVG — 4 wide curved organic blades with center hub
    const fanSVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
            <!-- Center hub -->
            <circle cx="100" cy="100" r="12" opacity="0.9"/>
            <!-- Blade 1 — top-left, wide curved propeller shape -->
            <path d="M100 88 C85 75, 50 60, 30 45 C20 38, 25 25, 40 30 C60 38, 80 55, 88 100" opacity="0.7"/>
            <!-- Blade 2 — top-right -->
            <path d="M112 100 C125 85, 140 50, 155 30 C162 20, 175 25, 170 40 C162 60, 145 80, 100 88" opacity="0.7"/>
            <!-- Blade 3 — bottom-right -->
            <path d="M100 112 C115 125, 150 140, 170 155 C180 162, 175 175, 160 170 C140 162, 120 145, 112 100" opacity="0.7"/>
            <!-- Blade 4 — bottom-left -->
            <path d="M88 100 C75 115, 60 150, 45 170 C38 180, 25 175, 30 160 C38 140, 55 120, 100 112" opacity="0.7"/>
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
