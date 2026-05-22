// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

// ===== Navbar Scroll Effect =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    navbar.classList.toggle('scrolled', currentScroll > 50);
    lastScroll = currentScroll;

    // Back to top visibility
    backToTop.classList.toggle('visible', currentScroll > 400);

    // Active nav link
    updateActiveNav();
});

// ===== Mobile Nav Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Active Nav Link on Scroll =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);

        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
}

// ===== Back to Top =====
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        if (counter.getAttribute('data-no-animate') === 'true') {
            const targetValue = parseInt(counter.getAttribute('data-target'));
            if (!Number.isNaN(targetValue)) {
                counter.textContent = targetValue;
            }
            return;
        }

        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    });
}

// ===== Scroll Reveal Animation =====
function setupRevealAnimations() {
    const revealElements = document.querySelectorAll(
        '.theme-card, .office-card, .contact-info-panel, .contact-form, .map-container, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
}

// ===== Counter Observer =====
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counterObserver.observe(statsSection);
}

// ===== Contact Form =====
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
                contactForm.reset();
            }, 2500);
        }, 1500);
    });
}

// ===== Smooth scroll for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    setupRevealAnimations();
    updateActiveNav();

    // Touch-toggle for theme cards on mobile
    document.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', () => {
            const isActive = card.classList.contains('touch-active');
            document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('touch-active'));
            if (!isActive) card.classList.add('touch-active');
        });
    });
});

// ===== Book Now Modal =====
const bookingModal = document.getElementById('bookingModal');
const openBookingBtn = document.getElementById('openBookingBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const stepLocation = document.getElementById('stepLocation');
const stepForm = document.getElementById('stepForm');
const stepPayment = document.getElementById('stepPayment');
const proceedBtn = document.getElementById('proceedBtn');
const backBtn = document.getElementById('backBtn');
const ticketMinus = document.getElementById('ticketMinus');
const ticketPlus = document.getElementById('ticketPlus');
const bkTickets = document.getElementById('bkTickets');
const ticketCount = document.getElementById('ticketCount');
const totalAmount = document.getElementById('totalAmount');
const payInstructions = document.getElementById('payInstructions');
const bookingSummary = document.getElementById('bookingSummary');
const whatsappBtn = document.getElementById('whatsappBtn');
const qrImage = document.getElementById('qrImage');
const qrContainer = document.getElementById('qrContainer');
const paymentNotice = document.getElementById('paymentNotice');
const locationOptions = document.querySelectorAll('.location-option');

const TICKET_PRICE = 300;
let selectedLocation = null;

const locationConfig = {
    kathmandu: {
        label: 'City Centre, Kathmandu',
        whatsapp: '9779705153227',
        qrSrc: '18d.jpg',
        qrAlt: 'Kathmandu Payment QR Code'
    },
    pokhara: {
        label: 'DisneyLand, Pokhara',
        whatsapp: '9779712053228',
        qrSrc: '18D_Pokhara.jpeg',
        qrAlt: 'Pokhara Payment QR Code'
    },
    chitwan: {
        label: 'CG Mall, Chitwan',
        whatsapp: '9779712053227',
        qrSrc: null,
        qrAlt: 'Chitwan Payment QR Code'
    }
};

// --- Helpers ---
function openModal() {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reset to step 0
    selectedLocation = null;
    locationOptions.forEach(option => option.classList.remove('active'));
    showStep(0);
    document.getElementById('bkName').value = '';
    document.getElementById('bkPhone').value = '';
    document.getElementById('bkDate').value = '';
    bkTickets.value = 1;
    updateTotal();
}

function closeModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
}

function showStep(step) {
    stepLocation.style.display = step === 0 ? 'block' : 'none';
    stepForm.style.display = step === 1 ? 'block' : 'none';
    stepPayment.style.display = step === 2 ? 'block' : 'none';
}

function updateTotal() {
    const qty = parseInt(bkTickets.value) || 1;
    ticketCount.textContent = qty;
    totalAmount.textContent = 'Rs. ' + (qty * TICKET_PRICE).toLocaleString();
}

// --- WhatsApp button: guard against empty link ---
whatsappBtn.addEventListener('click', (e) => {
    const link = whatsappBtn.getAttribute('href');
    if (!link || link === '#') {
        e.preventDefault();
        alert('Please complete the booking form first.');
    }
});

// --- Location selection ---
locationOptions.forEach(option => {
    option.addEventListener('click', () => {
        const locationKey = option.getAttribute('data-location');
        if (!locationKey || !locationConfig[locationKey]) return;

        selectedLocation = locationKey;
        locationOptions.forEach(item => item.classList.remove('active'));
        option.classList.add('active');
        showStep(1);
    });
});

// --- Ticket counter ---
ticketMinus.addEventListener('click', () => {
    const v = parseInt(bkTickets.value);
    if (v > 1) { bkTickets.value = v - 1; updateTotal(); }
});
ticketPlus.addEventListener('click', () => {
    const v = parseInt(bkTickets.value);
    if (v < 20) { bkTickets.value = v + 1; updateTotal(); }
});
// Clamp manual input between 1 and 20
bkTickets.addEventListener('change', () => {
    let v = parseInt(bkTickets.value) || 1;
    if (v < 1) v = 1;
    if (v > 20) v = 20;
    bkTickets.value = v;
    updateTotal();
});
bkTickets.addEventListener('input', updateTotal);

// --- Open / Close ---
openBookingBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
backBtn.addEventListener('click', () => showStep(1));

// Close on backdrop click
bookingModal.addEventListener('click', e => {
    if (e.target === bookingModal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && bookingModal.classList.contains('active')) closeModal();
});

// --- Proceed to Payment (Step 1 → 2) ---
proceedBtn.addEventListener('click', () => {
    if (!selectedLocation) {
        alert('Please choose a location first.');
        showStep(0);
        return;
    }

    const name = document.getElementById('bkName').value.trim();
    const phone = document.getElementById('bkPhone').value.trim();
    const date = document.getElementById('bkDate').value;
    const tickets = parseInt(bkTickets.value);
    const total = tickets * TICKET_PRICE;

    // Simple validation
    if (!name) { alert('Please enter your full name.'); return; }
    if (!phone) { alert('Please enter your phone number.'); return; }
    if (!date) { alert('Please select a date of visit.'); return; }

    // Format date nicely
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    // Update Step 2 UI
    payInstructions.textContent = `Scan to pay Rs. ${total.toLocaleString()} via your mobile banking app.`;

    bookingSummary.innerHTML = `
        <div><strong>Location:</strong> ${locationConfig[selectedLocation].label}</div>
        <div><strong>Name:</strong> ${name}</div>
        <div><strong>Phone:</strong> ${phone}</div>
        <div><strong>Date:</strong> ${formattedDate}</div>
        <div><strong>Tickets:</strong> ${tickets}</div>
        <div><strong>Total:</strong> Rs. ${total.toLocaleString()}</div>
    `;

    // Build WhatsApp link with pre-filled message
    const messageText = `Hi Flyover Entertainment! I would like to book tickets for 18D Cinema.

Location: ${locationConfig[selectedLocation].label}
Name: ${name}
Phone: ${phone}
Date: ${formattedDate}
Tickets: ${tickets}
Total Amount: Rs. ${total.toLocaleString()}

I am attaching my payment screenshot below:`;

    // Encode the text properly for a URL
    const msg = encodeURIComponent(messageText);

    const locationData = locationConfig[selectedLocation];
    if (locationData.qrSrc) {
        qrImage.src = locationData.qrSrc;
        qrImage.alt = locationData.qrAlt;
        qrContainer.style.display = 'flex';
        paymentNotice.style.display = 'none';
    } else {
        qrContainer.style.display = 'none';
        paymentNotice.textContent = 'Payment QR for this location is coming soon.';
        paymentNotice.style.display = 'block';
    }

    if (locationData.whatsapp) {
        whatsappBtn.href = `https://wa.me/${locationData.whatsapp}?text=${msg}`;
        whatsappBtn.classList.remove('disabled');
    } else {
        whatsappBtn.href = '#';
        whatsappBtn.classList.add('disabled');
    }

    // Advance to the QR code / payment screen layout
    showStep(2);
});
