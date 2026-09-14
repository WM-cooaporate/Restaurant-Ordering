document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       MOBILE MENU TOGGLE
    ============================================ */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    /* ============================================
       NAVBAR SHADOW ON SCROLL
    ============================================ */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
                navbar.style.background = 'rgba(26, 15, 8, 0.98)';
            } else {
                navbar.style.padding = '18px 0';
                navbar.style.background = 'rgba(26, 15, 8, 0.85)';
            }
        });
    }

    /* ============================================
       ACTIVE LINK ON SCROLL
    ============================================ */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function updateActiveLink() {
        let current = '';
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // لو مفيش قسم محدد (فوق خالص) خليها Home
        if (!current) current = 'home';

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);

    /* ============================================
       SMOOTH SCROLL FOR ANCHOR LINKS
    ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ============================================
       CONTACT FORM
    ============================================ */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            formSuccess.classList.add('show');
            contactForm.reset();

            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 4000);
        });
    }

});