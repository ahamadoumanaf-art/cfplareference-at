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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMenus);
} else {
    initializeMenus();
}