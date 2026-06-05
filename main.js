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

    mobileNavToggle.addEventListener('click', toggleMobileNav);

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
    const sectionIds = ['home', 'about', 'treatments', 'tarieven', 'vergoeding', 'contact'];
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
    appointmentForm.querySelectorAll('.form-control, .form-checkbox').forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.form-group') || input.closest('.form-checkbox-group');
            const errorEl = group.querySelector('.error-msg') || document.getElementById('consent-error');
            if (group.classList.contains('has-error')) {
                setFieldError(input, errorEl, false);
            }
        });
    });

    appointmentForm.addEventListener('submit', (e) => {
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

        // If Valid, show Success Overlay
        if (isValid) {
            successOverlay.classList.add('show-success');
            
            // Console log simulation of data submission
            console.log('Form Submitted successfully!', {
                name: nameInput.value,
                phone: phoneInput.value,
                email: emailInput.value,
                service: document.getElementById('form-service').value,
                message: document.getElementById('form-message').value
            });
        }
    });

    // Reset Form button action
    resetFormBtn.addEventListener('click', () => {
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
