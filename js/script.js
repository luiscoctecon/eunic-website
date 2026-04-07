// Hero Slider
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

// Auto slide
setInterval(nextSlide, 5000);

// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu after clicking
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Testimonial Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const testPrevBtn = document.querySelector('.test-prev');
const testNextBtn = document.querySelector('.test-next');
const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    testimonials.forEach(test => test.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
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

if (testPrevBtn && testNextBtn) {
    testPrevBtn.addEventListener('click', prevTestimonial);
    testNextBtn.addEventListener('click', nextTestimonial);
}

if (dots.length > 0) {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
}

// Auto testimonial change
setInterval(nextTestimonial, 7000);

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('h3');
    const answer = item.querySelector('p');

    question.addEventListener('click', () => {
        // Close other FAQs
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.querySelector('p').style.display = 'none';
            }
        });

        // Toggle current FAQ
        if (answer.style.display === 'block') {
            answer.style.display = 'none';
        } else {
            answer.style.display = 'block';
        }
    });
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.option-card, .story-image, .testimonial, .faq-item').forEach(el => {
    observer.observe(el);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .option-card, .story-image, .testimonial, .faq-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    .option-card.animate, .story-image.animate, .testimonial.animate, .faq-item.animate {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Parallax effect for hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Button hover effects
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.02)';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);

// Photo Carousel
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselPrevBtn = document.querySelector('.carousel-prev');
const carouselNextBtn = document.querySelector('.carousel-next');
const carouselDots = document.querySelectorAll('.carousel-dot');

let currentCarouselIndex = 0;
let slideWidth = 400; // Default desktop width
let slideGap = 24; // Default gap (1.5rem = 24px)
let totalSlideWidth = slideWidth + slideGap;
let touchStartX = 0;
let touchEndX = 0;

// Determine slide width based on viewport
function updateSlideWidth() {
    if (window.innerWidth <= 380) {
        slideWidth = 240;
        slideGap = 13; // 0.8rem
    } else if (window.innerWidth <= 480) {
        slideWidth = 260;
        slideGap = 13;
    } else if (window.innerWidth <= 640) {
        slideWidth = 280;
        slideGap = 16;
    } else if (window.innerWidth <= 768) {
        slideWidth = 320;
        slideGap = 19;
    } else if (window.innerWidth <= 1024) {
        slideWidth = 350;
        slideGap = 24;
    } else {
        slideWidth = 400;
        slideGap = 24;
    }
    totalSlideWidth = slideWidth + slideGap;
}

function scrollToSlide(index) {
    if (carouselSlides.length > 0) {
        currentCarouselIndex = (index + carouselSlides.length) % carouselSlides.length;
        const scrollLeft = currentCarouselIndex * totalSlideWidth;
        
        carouselTrack.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });

        updateCarouselDots();
    }
}

function updateCarouselDots() {
    carouselDots.forEach((dot, idx) => {
        if (idx === currentCarouselIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextCarouselSlide() {
    scrollToSlide(currentCarouselIndex + 1);
}

function prevCarouselSlide() {
    scrollToSlide(currentCarouselIndex - 1);
}

// Touch handlers for mobile swiping
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].clientX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    
    // Calculate distance swiped
    const swipeDistance = touchStartX - touchEndX;
    const threshold = 50; // Minimum swipe distance in pixels
    
    if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance > 0) {
            // Swiped left - show next slide
            nextCarouselSlide();
        } else {
            // Swiped right - show previous slide
            prevCarouselSlide();
        }
    }
}

// Initialize carousel
updateSlideWidth();

if (carouselPrevBtn && carouselNextBtn && carouselTrack) {
    carouselPrevBtn.addEventListener('click', prevCarouselSlide);
    carouselNextBtn.addEventListener('click', nextCarouselSlide);
    
    // Add touch event listeners
    carouselTrack.addEventListener('touchstart', handleTouchStart, false);
    carouselTrack.addEventListener('touchend', handleTouchEnd, false);
}

// Carousel dot navigation
carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => scrollToSlide(index));
});

// Update active dot on scroll
if (carouselTrack) {
    let scrollTimeout;
    carouselTrack.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = carouselTrack.scrollLeft;
            const index = Math.round(scrollLeft / totalSlideWidth);
            if (index < carouselSlides.length && index !== currentCarouselIndex) {
                currentCarouselIndex = index;
                updateCarouselDots();
            }
        }, 100);
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    updateSlideWidth();
    // Re-scroll to current slide after resize
    scrollToSlide(currentCarouselIndex);
});

// Prevent button double-click
[carouselPrevBtn, carouselNextBtn].forEach(btn => {
    if (btn) {
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
    }
});

// Auto-scroll carousel (optional - uncomment to enable)
// setInterval(nextCarouselSlide, 6000);

 function scrollCarousel(direction) {
                        const track = document.getElementById('carouselTrack');
                        track.scrollBy({ left: direction * 420, behavior: 'smooth' });
                    }