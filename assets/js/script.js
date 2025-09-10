// =========================
// Mobile Menu Toggle
// =========================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// =========================
// Smooth Scroll for Anchor Links
// =========================
const links = document.querySelectorAll('.nav-links a[href^="#"]');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active'); // Close menu on mobile
      }
    }
  });
});

// =========================
// Newsletter Subscription
// =========================
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMsg = document.getElementById("newsletterMsg");

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("newsletterEmail").value;
  newsletterMsg.textContent = `✅ Thank you! ${email} has been subscribed.`;
  newsletterForm.reset();
});

// =========================
// Contact Form Submission
// =========================
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  formMsg.textContent = "✅ Thank you! Your message has been sent.";
  contactForm.reset();
});

// =========================
// Animated Stats Counters
// =========================
const counters = {
  users: 1200,
  power: 5000,
  withdrawals: 250000
};

function animateCounter(id, target) {
  let count = 0;
  const increment = Math.ceil(target / 200); // speed
  const el = document.getElementById(id);
  const interval = setInterval(() => {
    count += increment;
    if (count >= target) {
      count = target;
      clearInterval(interval);
    }
    el.textContent = count.toLocaleString();
  }, 20);
}

// Animate stats when visible
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight && rect.bottom >= 0;
}

const statsSection = document.querySelector('.stats');
let statsAnimated = false;

window.addEventListener('scroll', () => {
  if (!statsAnimated && isInViewport(statsSection)) {
    animateCounter('users', counters.users);
    animateCounter('power', counters.power);
    animateCounter('withdrawals', counters.withdrawals);
    statsAnimated = true;
  }
});
