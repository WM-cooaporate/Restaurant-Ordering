/* ============ GALLERY LIGHTBOX ============ */
document.addEventListener('DOMContentLoaded', () => {

    const items = document.querySelectorAll('.g-item');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbTitle = document.getElementById('lbTitle');
    const lbDesc = document.getElementById('lbDesc');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');

    let currentIndex = 0;

    /* فتح الـ lightbox */
    function openLightbox(index) {
        const item = items[index];
        lbImg.src = item.dataset.img;
        lbTitle.textContent = item.dataset.title;
        lbDesc.textContent = item.dataset.desc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        currentIndex = index;
    }

    /* إغلاق */
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* التالي */
    function showNext() {
        currentIndex = (currentIndex + 1) % items.length;
        openLightbox(currentIndex);
    }

    /* السابق */
    function showPrev() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        openLightbox(currentIndex);
    }

    /* ربط الأحداث على كل صورة */
    items.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    /* أزرار التحكم */
    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', showNext);
    lbPrev.addEventListener('click', showPrev);

    /* الضغط على الخلفية يقفل */
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    /* أسهم الكيبورد */
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    /* Swipe على الموبايل */
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) showNext();
        if (touchEndX > touchStartX + 50) showPrev();
    });

});