// ==========================================================================
// Loading fade-in (fires once the DOM is parsed — doesn't wait on slow
// third-party video embeds, which can otherwise leave the page blank)
// ==========================================================================
requestAnimationFrame(() => document.body.classList.add('loaded'));

// ==========================================================================
// Scroll progress bar
// ==========================================================================
const progressBar = document.querySelector('.scroll-progress');
function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ==========================================================================
// Navbar: glass shrink + hide on scroll down / show on scroll up
// ==========================================================================
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (!navbar) return;

    navbar.classList.toggle('scrolled', y > 40);

    if (y > lastScrollY && y > 200 && !document.body.classList.contains('menu-open')) {
        navbar.classList.add('nav-hidden');
    } else {
        navbar.classList.remove('nav-hidden');
    }
    lastScrollY = y;
}, { passive: true });

// ==========================================================================
// Hero Slider
// ==========================================================================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

if (slides.length > 1) {
    setInterval(nextSlide, 6000);
}

// Split hero heading into animated words
document.querySelectorAll('.hero-content h1').forEach(h1 => {
    const words = h1.textContent.trim().split(/\s+/);
    h1.innerHTML = words.map((w, i) => `<span class="word" style="--w-i:${i}">${w}</span>`).join(' ');
});

// ==========================================================================
// Mobile Menu
// ==========================================================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// ==========================================================================
// Smooth scrolling for in-page anchors
// ==========================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId.length < 2) return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==========================================================================
// Testimonial Slider
// ==========================================================================
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const testPrevBtn = document.querySelector('.test-prev');
const testNextBtn = document.querySelector('.test-next');
const dots = document.querySelectorAll('.dot');
let testimonialTimer;

function showTestimonial(index) {
    testimonials.forEach(test => test.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    testimonials[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentTestimonial = index;
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
}

function restartTestimonialTimer() {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(nextTestimonial, 7000);
}

if (testPrevBtn && testNextBtn) {
    testPrevBtn.addEventListener('click', () => { prevTestimonial(); restartTestimonialTimer(); });
    testNextBtn.addEventListener('click', () => { nextTestimonial(); restartTestimonialTimer(); });
}

if (dots.length > 0) {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => { showTestimonial(index); restartTestimonialTimer(); });
    });
}

if (testimonials.length > 1) {
    restartTestimonialTimer();
}

// Swipe support for testimonials
const testimonialSlider = document.querySelector('.testimonial-slider');
if (testimonialSlider) {
    let tStartX = 0;
    testimonialSlider.addEventListener('touchstart', e => tStartX = e.changedTouches[0].clientX, { passive: true });
    testimonialSlider.addEventListener('touchend', e => {
        const dx = tStartX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) {
            dx > 0 ? nextTestimonial() : prevTestimonial();
            restartTestimonialTimer();
        }
    }, { passive: true });
}

// ==========================================================================
// FAQ Accordion (animated height, single-open)
// ==========================================================================
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('h3');
    const answer = item.querySelector('p');
    if (!question || !answer) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'faq-answer';
    answer.parentNode.insertBefore(wrapper, answer);
    wrapper.appendChild(answer);

    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            if (openItem !== item) {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-answer').style.maxHeight = null;
            }
        });

        if (isOpen) {
            item.classList.remove('open');
            wrapper.style.maxHeight = null;
        } else {
            item.classList.add('open');
            wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
        }
    });
});

// ==========================================================================
// Scroll reveal (IntersectionObserver) with per-group stagger
// ==========================================================================
const revealGroups = new Map();
document.querySelectorAll('[data-reveal]').forEach(el => {
    const group = el.closest('[data-reveal-group]') || el.parentElement;
    if (!revealGroups.has(group)) revealGroups.set(group, []);
    revealGroups.get(group).push(el);
});
revealGroups.forEach(list => {
    list.forEach((el, i) => el.style.setProperty('--reveal-i', i % 8));
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Comparison / pricing list staggered children reveal
document.querySelectorAll('.comparison-card, .pricing-list').forEach(el => {
    Array.from(el.children).forEach((child, i) => child.style.setProperty('--reveal-i', i));
    revealObserver.observe(el);
});

// ==========================================================================
// Count-up numbers (price figures)
// ==========================================================================
function animateCount(el) {
    const raw = el.textContent.trim();
    const numMatch = raw.match(/[\d,.]+/);
    if (!numMatch) return;
    const target = parseFloat(numMatch[0].replace(/,/g, ''));
    if (isNaN(target)) return;
    const prefix = raw.slice(0, numMatch.index);
    const suffix = raw.slice(numMatch.index + numMatch[0].length);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = prefix + value.toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = raw;
    }
    requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// ==========================================================================
// Magnetic buttons + cursor-tracked glow
// ==========================================================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty('--btn-x', x + 'px');
        btn.style.setProperty('--btn-y', y + 'px');
        const relX = (x - rect.width / 2) * 0.15;
        const relY = (y - rect.height / 2) * 0.25;
        btn.style.transform = `translate(${relX}px, ${relY - 3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// Decorative cursor glow on dark sections
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    const glowZones = document.querySelectorAll('.cta, .sadly, .different, .what-brings-you-here, .footer');
    let overGlowZone = false;

    document.addEventListener('mousemove', e => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';

        const el = document.elementFromPoint(e.clientX, e.clientY);
        overGlowZone = !!el && Array.from(glowZones).some(zone => zone.contains(el));
        cursorGlow.classList.toggle('active', overGlowZone);
    });
}

// ==========================================================================
// Photo Carousel (used on about/podcast pages)
// ==========================================================================
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselPrevBtn = document.querySelector('.carousel-prev');
const carouselNextBtn = document.querySelector('.carousel-next');
const carouselDots = document.querySelectorAll('.carousel-dot');

let currentCarouselIndex = 0;
let slideWidth = 400;
let slideGap = 24;
let totalSlideWidth = slideWidth + slideGap;
let touchStartX = 0;
let touchEndX = 0;

function updateSlideWidth() {
    if (window.innerWidth <= 380) { slideWidth = 240; slideGap = 13; }
    else if (window.innerWidth <= 480) { slideWidth = 260; slideGap = 13; }
    else if (window.innerWidth <= 640) { slideWidth = 280; slideGap = 16; }
    else if (window.innerWidth <= 768) { slideWidth = 320; slideGap = 19; }
    else if (window.innerWidth <= 1024) { slideWidth = 350; slideGap = 24; }
    else { slideWidth = 400; slideGap = 24; }
    totalSlideWidth = slideWidth + slideGap;
}

function scrollToSlide(index) {
    if (carouselSlides.length > 0) {
        currentCarouselIndex = (index + carouselSlides.length) % carouselSlides.length;
        carouselTrack.scrollTo({ left: currentCarouselIndex * totalSlideWidth, behavior: 'smooth' });
        updateCarouselDots();
    }
}

function updateCarouselDots() {
    carouselDots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentCarouselIndex));
}

function nextCarouselSlide() { scrollToSlide(currentCarouselIndex + 1); }
function prevCarouselSlide() { scrollToSlide(currentCarouselIndex - 1); }

function handleTouchStart(e) { touchStartX = e.changedTouches[0].clientX; }
function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;
    if (Math.abs(swipeDistance) > 50) {
        swipeDistance > 0 ? nextCarouselSlide() : prevCarouselSlide();
    }
}

updateSlideWidth();

if (carouselPrevBtn && carouselNextBtn && carouselTrack) {
    carouselPrevBtn.addEventListener('click', prevCarouselSlide);
    carouselNextBtn.addEventListener('click', nextCarouselSlide);
    carouselTrack.addEventListener('touchstart', handleTouchStart, false);
    carouselTrack.addEventListener('touchend', handleTouchEnd, false);
}

carouselDots.forEach((dot, index) => dot.addEventListener('click', () => scrollToSlide(index)));

if (carouselTrack) {
    let scrollTimeout;
    carouselTrack.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const index = Math.round(carouselTrack.scrollLeft / totalSlideWidth);
            if (index < carouselSlides.length && index !== currentCarouselIndex) {
                currentCarouselIndex = index;
                updateCarouselDots();
            }
        }, 100);
    });
}

window.addEventListener('resize', () => {
    updateSlideWidth();
    scrollToSlide(currentCarouselIndex);
});

[carouselPrevBtn, carouselNextBtn].forEach(btn => {
    if (btn) btn.addEventListener('touchstart', e => e.preventDefault());
});

function scrollCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    if (track) track.scrollBy({ left: direction * 420, behavior: 'smooth' });
}
