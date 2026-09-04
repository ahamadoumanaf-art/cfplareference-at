function initializeMenus() {
    const buttons = document.querySelectorAll('.menu-toggle');

    buttons.forEach((button) => {
        const nav = document.getElementById(button.getAttribute('aria-controls'));
        if (!nav) return;

        button.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            button.classList.toggle('open', isOpen);
            button.setAttribute('aria-expanded', String(isOpen));
        });

        nav.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                nav.classList.remove('open');
                button.classList.remove('open');
                button.setAttribute('aria-expanded', 'false');
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                nav.classList.remove('open');
                button.classList.remove('open');
                button.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

function initializeHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = [...slider.querySelectorAll('.hero-slide')];
    const dots = [...slider.querySelectorAll('.hero-slider-dot')];
    const previousButton = slider.querySelector('.hero-slider-prev');
    const nextButton = slider.querySelector('.hero-slider-next');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeIndex = 0;
    let timer;

    function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }

    function restartTimer() {
        if (reduceMotion) return;
        window.clearInterval(timer);
        timer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
    }

    previousButton.addEventListener('click', () => {
        showSlide(activeIndex - 1);
        restartTimer();
    });

    nextButton.addEventListener('click', () => {
        showSlide(activeIndex + 1);
        restartTimer();
    });

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            showSlide(Number(dot.dataset.slideTo));
            restartTimer();
        });
    });

    slider.addEventListener('mouseenter', () => window.clearInterval(timer));
    slider.addEventListener('mouseleave', restartTimer);
    showSlide(0);
    restartTimer();
}

function initializeMetricsCounter() {
    const metricsSection = document.querySelector('.metrics');
    if (!metricsSection) return;

    const values = [...metricsSection.querySelectorAll('.metric-value')];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationRun = 0;

    function animateValue(element, target, duration, runId) {
        return new Promise((resolve) => {
            if (reduceMotion) {
                element.textContent = `${target}${element.dataset.suffix}`;
                resolve();
                return;
            }

            const startTime = performance.now();

            function updateValue(currentTime) {
                if (runId !== animationRun) {
                    resolve();
                    return;
                }

                const progress = Math.min((currentTime - startTime) / duration, 1);
                const currentValue = Math.floor(progress * target);
                element.textContent = `${currentValue}${element.dataset.suffix}`;

                if (progress < 1) {
                    window.requestAnimationFrame(updateValue);
                } else {
                    resolve();
                }
            }

            window.requestAnimationFrame(updateValue);
        });
    }

    async function startCounters() {
        const runId = ++animationRun;

        values.forEach((value) => {
            value.textContent = `0${value.dataset.suffix}`;
        });

        for (const value of values) {
            await animateValue(value, Number(value.dataset.target), 1200, runId);
            if (runId !== animationRun) return;
            await new Promise((resolve) => window.setTimeout(resolve, 180));
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) startCounters();
        });
    }, { threshold: 0.45 });

    observer.observe(metricsSection);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeMenus();
        initializeHeroSlider();
        initializeMetricsCounter();
    });
} else {
    initializeMenus();
    initializeHeroSlider();
    initializeMetricsCounter();
}