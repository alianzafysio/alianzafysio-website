/* -------------------------------------------------------------
   ALIANZA FYSIO - INTERACTION LOGIC (VANILLA JS)
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM Elements ---
    const header = document.getElementById('site-header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const fadeSections = document.querySelectorAll('.fade-in-section');
    
    // Form Elements
    const appointmentForm = document.getElementById('appointment-form');
    const successOverlay = document.getElementById('form-success-overlay');
    const resetFormBtn = document.getElementById('btn-reset-form');

    // --- 2. Header Scroll Styling Toggle ---
    const handleHeaderScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    };
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Trigger on initial load in case page is refreshed partway down

    // --- 3. Mobile Hamburger Menu Toggle ---
    const toggleMobileNav = () => {
        const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
        mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
        mobileNav.setAttribute('aria-hidden', isExpanded);
        
        if (!isExpanded) {
            // Open mobile drawer
            mobileNav.style.transform = 'translateX(0)';
            document.body.style.overflow = 'hidden'; // Stop page background scroll
        } else {
            // Close mobile drawer
            mobileNav.style.transform = 'translateX(100%)';
            document.body.style.overflow = ''; // Restore background scroll
        }
    };

    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', toggleMobileNav);
    }

    // Close mobile menu if a nav link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close drawer
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
            mobileNav.style.transform = 'translateX(100%)';
            document.body.style.overflow = '';
        });
    });

    // --- 4. Intersection Observer for Scroll Animations ---
    const fadeObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve once shown to prevent refading
                observer.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    fadeSections.forEach(section => {
        fadeObserver.observe(section);
    });

    // --- 5. Navigation Scroll Indicator Highlight ---
    // Uses an IntersectionObserver to detect which section is currently active
    const sectionIds = ['home', 'about', 'treatments', 'klachten', 'tarieven', 'contact'];
const sections = sectionIds.map(id => document.getElementById(id)).filter(el => el !== null);

    const navObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Center band of screen detects active section
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Update Desktop Links
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active-link');
                    } else {
                        link.classList.remove('active-link');
                    }
                });

                // Update Mobile Links too
                mobileNavLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active-link');
                    } else {
                        link.classList.remove('active-link');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // --- 7. Appointment Form Handling & Validation ---
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhone = (phone) => {
        // Simple validation: must contain digits, spaces, hyphens, or plus sign, length >= 8
        const cleanPhone = phone.replace(/[^0-9+]/g, '');
        return cleanPhone.length >= 8;
    };

    const setFieldError = (inputEl, errorEl, hasError) => {
        const group = inputEl.closest('.form-group') || inputEl.closest('.form-checkbox-group');
        if (hasError) {
            group.classList.add('has-error');
            errorEl.style.display = 'block';
        } else {
            group.classList.remove('has-error');
            errorEl.style.display = 'none';
        }
    };

    // Real-time input clearing of errors
    if (appointmentForm) appointmentForm.querySelectorAll('.form-control, .form-checkbox').forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.form-group') || input.closest('.form-checkbox-group');
            const errorEl = group.querySelector('.error-msg') || document.getElementById('consent-error');
            if (group.classList.contains('has-error')) {
                setFieldError(input, errorEl, false);
            }
        });
    });

    if (appointmentForm) appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Name Validation
        const nameInput = document.getElementById('form-name');
        const nameError = document.getElementById('name-error');
        if (nameInput.value.trim().length < 2) {
            setFieldError(nameInput, nameError, true);
            isValid = false;
        } else {
            setFieldError(nameInput, nameError, false);
        }

        // Phone Validation
        const phoneInput = document.getElementById('form-phone');
        const phoneError = document.getElementById('phone-error');
        if (!validatePhone(phoneInput.value)) {
            setFieldError(phoneInput, phoneError, true);
            isValid = false;
        } else {
            setFieldError(phoneInput, phoneError, false);
        }

        // Email Validation
        const emailInput = document.getElementById('form-email');
        const emailError = document.getElementById('email-error');
        if (!validateEmail(emailInput.value)) {
            setFieldError(emailInput, emailError, true);
            isValid = false;
        } else {
            setFieldError(emailInput, emailError, false);
        }

        // Consent Checkbox Validation
        const consentInput = document.getElementById('form-consent');
        const consentError = document.getElementById('consent-error');
        if (!consentInput.checked) {
            consentError.style.display = 'block';
            consentInput.closest('.form-checkbox-group').classList.add('has-error');
            isValid = false;
        } else {
            consentError.style.display = 'none';
            consentInput.closest('.form-checkbox-group').classList.remove('has-error');
        }

        // If Valid, send to Formspree
if (isValid) {

    const submitButton = appointmentForm.querySelector('.btn-submit');
    submitButton.disabled = true;
    submitButton.textContent = "Verzenden...";

    try {

        const response = await fetch(appointmentForm.action, {
            method: "POST",
            body: new FormData(appointmentForm),
            headers: {
                "Accept": "application/json"
            }
        });

        if (response.ok) {

            successOverlay.classList.add('show-success');

        } else {

            alert("Er is iets misgegaan. Probeer het opnieuw.");

        }

    } catch (error) {

        alert("Er kon geen verbinding worden gemaakt. Probeer het later opnieuw.");

    }

    submitButton.disabled = false;
    submitButton.textContent = "Verzenden";
}
    });

    // Reset Form button action
    if (resetFormBtn && appointmentForm && successOverlay) resetFormBtn.addEventListener('click', () => {
        appointmentForm.reset();
        successOverlay.classList.remove('show-success');
        
        // Clear any leftover error rings
        appointmentForm.querySelectorAll('.has-error').forEach(el => {
            el.classList.remove('has-error');
        });
        appointmentForm.querySelectorAll('.error-msg').forEach(el => {
            el.style.display = 'none';
        });
        document.getElementById('consent-error').style.display = 'none';
    });

});

// ---------------------------------------------------------
// GOOGLE REVIEWS ROTATOR — 3 CARDS
// ---------------------------------------------------------

const reviewGrid = document.querySelector('.review-rotator');
const reviewCards = document.querySelectorAll('.reviews-grid .featured-review');

const reviews = [
    {
        text: "As an expat new to the Netherlands, I wasn't familiar with how physiotherapy works here. Francisco took the time to explain the direct access system and helped me discover that I actually had six physiotherapy sessions covered by my health insurance. They are highly skilled, knowledgeable, and genuinely helpful. I highly recommend them!",
        author: "Beatriz Nicolas"
    },
    {
        text: "Zeer betrouwbaar en goede persoonlijke zorg! Absolute aanrader.",
        author: "Lotte Bos"
    },
    {
        text: "Francisco heeft mij enorm goed geholpen! Precies de hulp die ik nodig had, waardoor ik snel weer alles kon doen!",
        author: "Sepp Niemeijer"
    },
    {
        text: "Fantastisch geholpen. Ik voelde me altijd veilig en gehoord.",
        author: "Gido Hendriks"
    },
    {
        text: "100% recommended! I had really bad headaches and back pain, and Francisco treated me for the last several weeks and I haven’t had any other crisis since then. He gave me good advice that adapts to my lifestyle and access to an app with all my recovery exercises.",
        author: "César Alberto Mardomingo Alonso"
    },
    {
        text: "Uitstekende ervaring bij AlianzaFysio! Er wordt echt de tijd genomen om naar je te luisteren en goed te analyseren wat je nodig hebt. Het is niet zomaar een fysio die je alleen oefeningen geeft; de behandeling is hands-on, professioneel en effectief.",
        author: "Antonio José Pastor Belda"
    },
    {
        text: "Na een auto-ongeluk kon ik heel snel terecht bij Francisco, die een belangrijk onderdeel is geweest van mijn herstel. Hij is super kundig en zorgde snel voor verlichting, mede door zijn geweldige massage en gerichte actieplan. Hij geeft goed inzicht in wat je nodig hebt om weer goed op de been te komen. Zou zeker aanbevelen!",
        author: "Gina Mara"
    },
    {
        text: "Maartje is the best physiotherapist I’ve been to in the Netherlands. She takes the time to truly listen and understand your concerns. After years of dealing with pain, she helped me make a real and lasting improvement. I’m very grateful for her expertise and would highly recommend her!",
        author: "Irina Musch"
    },
    {
        text: "Een hele fijne fysiopraktijk! Ze nemen echt de tijd voor je en luisteren goed naar je klachten. Je krijgt duidelijke en eerlijke uitleg en advies. Je voelt je serieus genomen en goed geholpen. Absoluut een aanrader!",
        author: "Natascha Wesseling"
    }
];

let reviewStartIndex = 1;

function updateReviewCards() {

    if (!reviewGrid || !reviewCards.length) return;

    reviewGrid.classList.add('is-changing');

    setTimeout(() => {

        reviewCards.forEach((card, index) => {

            const reviewIndex = (reviewStartIndex + index) % reviews.length;
            const review = reviews[reviewIndex];

            const text = card.querySelector('.rotating-review-text');
            const author = card.querySelector('.rotating-review-author');

            if (text) {
                text.textContent = `“${review.text}”`;
            }

            if (author) {
                author.textContent = `— ${review.author}`;
            }

        });

        reviewGrid.classList.remove('is-changing');

        reviewStartIndex = (reviewStartIndex + 3) % reviews.length;

    }, 300);
}

if (reviewGrid && reviewCards.length) {
    setInterval(updateReviewCards, 7000);
}
