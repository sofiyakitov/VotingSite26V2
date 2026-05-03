document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Interactive Infographic Logic ---
    const stepCards = document.querySelectorAll('.step-card');
    
    stepCards.forEach(card => {
        card.addEventListener('click', () => {
            const isExpanded = card.getAttribute('aria-expanded') === 'true';
            const controlId = card.getAttribute('aria-controls');
            const description = document.getElementById(controlId);
            
            // Close all other steps
            stepCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.setAttribute('aria-expanded', 'false');
                    const otherDesc = document.getElementById(otherCard.getAttribute('aria-controls'));
                    if (otherDesc) {
                        otherDesc.classList.add('hidden');
                        otherDesc.setAttribute('aria-hidden', 'true');
                    }
                }
            });

            // Toggle current step
            if (!isExpanded) {
                card.setAttribute('aria-expanded', 'true');
                description.classList.remove('hidden');
                description.setAttribute('aria-hidden', 'false');
            } else {
                card.setAttribute('aria-expanded', 'false');
                description.classList.add('hidden');
                description.setAttribute('aria-hidden', 'true');
            }
        });
    });

    // --- 2. Questionnaire Logic ---
    const form = document.getElementById('readiness-form');
    const resultContainer = document.getElementById('quiz-result');
    const resultText = document.getElementById('result-text');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values from form
            const q1 = form.querySelector('input[name="q1"]:checked');
            const q2 = form.querySelector('input[name="q2"]:checked');
            const q3 = form.querySelector('input[name="q3"]:checked');

            if (!q1 || !q2 || !q3) {
                alert('אנא ענו על כל השאלות לפני הבדיקה.');
                return;
            }

            let allYes = (q1.value === 'yes' && q2.value === 'yes' && q3.value === 'yes');

            if (allYes) {
                resultText.textContent = 'מעולה! אתם מוכנים. נשאר רק להגיע ולהצביע.';
                resultText.style.color = '#43a047'; // Green
            } else {
                resultText.textContent = 'כמעט שם! ודאו שיש לכם תעודה מזהה, שאתם יודעים איפה הקלפי, ופנו לכם זמן ביום הבחירות.';
                resultText.style.color = '#d32f2f'; // Red
            }

            resultContainer.classList.remove('hidden');
            
            // Scroll to result slightly
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // --- 3. Vanilla JS Carousel Logic ---
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn-next');
        const prevButton = document.querySelector('.carousel-btn-prev');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        // Slide width (assuming all are the same width)
        const slideWidth = slides[0].getBoundingClientRect().width;

        // Arrange the slides next to one another
        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        slides.forEach(setSlidePosition);

        // Resize handler to update slide width and positions
        window.addEventListener('resize', () => {
            const newWidth = slides[0].getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.left = newWidth * index + 'px';
            });
            const currentSlide = track.querySelector('.current-slide');
            track.style.transform = 'translateX(' + (-currentSlide.style.left.replace('px','') * 1) + 'px)'; // RTL: actually in RTL we might move positive, wait.
        });

        const moveToSlide = (track, currentSlide, targetSlide) => {
            // Because it's RTL, standard translateX behavior can be tricky.
            // But we placed them `left: X px` which is LTR positioning essentially.
            // Wait, in RTL, `left` places it from the left edge. 
            // Better to use right: X px for RTL, but to keep it simple, let's just use CSS transform correctly.
            // Actually, in CSS Flexbox with RTL, the elements are laid out right-to-left automatically.
            // Let's rely on standard RTL flex behavior:
            // The first child is on the right.
            const targetIndex = slides.findIndex(s => s === targetSlide);
            const moveAmount = targetIndex * 100; // 100% per slide
            
            // In RTL, moving left means translating positive X to see elements on the left.
            track.style.transform = `translateX(${moveAmount}%)`;
            
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
            
            // update ARIA
            currentSlide.removeAttribute('aria-hidden');
            slides.forEach(s => {
                if (s !== targetSlide) s.setAttribute('aria-hidden', 'true');
            });
            targetSlide.setAttribute('aria-hidden', 'false');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-indicator');
            currentDot.removeAttribute('aria-current');
            targetDot.classList.add('current-indicator');
            targetDot.setAttribute('aria-current', 'true');
        };

        // Initialize ARIA
        slides.forEach((s, i) => {
            if (i !== 0) s.setAttribute('aria-hidden', 'true');
        });

        // Click Right (Prev in RTL, meaning go to next item conceptually but directionally right arrow goes to previous item usually. Wait, RTL next is left arrow!)
        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;
            const currentDot = dotsNav.querySelector('.current-indicator');
            const nextDot = currentDot.nextElementSibling;

            if (nextSlide) {
                moveToSlide(track, currentSlide, nextSlide);
                updateDots(currentDot, nextDot);
            }
        });

        // Click Left (Prev)
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;
            const currentDot = dotsNav.querySelector('.current-indicator');
            const prevDot = currentDot.previousElementSibling;

            if (prevSlide) {
                moveToSlide(track, currentSlide, prevSlide);
                updateDots(currentDot, prevDot);
            }
        });

        // Click Dot
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');
            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-indicator');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];

            moveToSlide(track, currentSlide, targetSlide);
            updateDots(currentDot, targetDot);
        });
    }

    // --- 4. Navbar Toggle Logic ---
    const navbarToggler = document.querySelector('.navbar-toggler');
    const mainNav = document.getElementById('mainNav');

    if (navbarToggler && mainNav) {
        navbarToggler.addEventListener('click', () => {
            const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                navbarToggler.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('show');
            } else {
                navbarToggler.setAttribute('aria-expanded', 'true');
                mainNav.classList.add('show');
            }
        });
    }
});
