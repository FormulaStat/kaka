/* =========================
   Mobile Navbar Toggle
========================= */
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

/* =========================
   Animated Counters
========================= */
function animateCounter(id, endValue, duration) {
  const el = document.getElementById(id);
  let start = 0;
  const step = Math.ceil(endValue / (duration / 16));

  function update() {
    start += step;
    if (start < endValue) {
      el.textContent = start.toLocaleString();
      requestAnimationFrame(update);
    } else {
      el.textContent = endValue.toLocaleString();
    }
  }
  update();
}

// Run counters when page loads
window.addEventListener("load", () => {
  animateCounter("users", 5248, 2000);
  animateCounter("power", 32500, 2000);
  animateCounter("withdrawals", 1478920, 2500);
});

/* =========================
   Smooth Scroll for Nav
========================= */
document.querySelectorAll('.nav-links a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    // Only smooth scroll if it's an in-page link
    if (this.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
      // Close menu on mobile after click
      navLinks.classList.remove("active");
    }
  });
});
