// =========================
// Mobile Navbar Toggle
// =========================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// =========================
// Scroll-triggered Stats Counters
// =========================
// --- Stats counters (robust, uses IntersectionObserver) ---
document.addEventListener('DOMContentLoaded', () => {
  const counters = [
    { id: 'users', target: 1245 },        // change to real targets if you have them
    { id: 'power', target: 3500 },
    { id: 'withdrawals', target: 875000 }
  ];

  let animated = false;

  function animateValue(el, start, end, duration = 1800) {
    if (!el) return;
    const range = end - start;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.floor(start + range * progress);
      el.textContent = value.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = end.toLocaleString(); // final exact value
      }
    }
    requestAnimationFrame(step);
  }

  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        counters.forEach(c => {
          const el = document.getElementById(c.id);
          // If element missing, log a helpful message for debugging
          if (!el) {
            console.warn(`Counter element #${c.id} not found in DOM.`);
            return;
          }
          animateValue(el, 0, c.target, 1800);
        });
        animated = true;
        obs.unobserve(statsSection);
      }
    });
  }, { threshold: 0.45 });

  observer.observe(statsSection);
});


// =========================
// Contact Form Handler
// =========================
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

if(contactForm){
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    formMsg.textContent = "✅ Thank you! Your message has been sent.";
    contactForm.reset();
  });
}

// =========================
// Newsletter Form Handler
// =========================
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMsg = document.getElementById('newsletterMsg');

if(newsletterForm){
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    newsletterMsg.textContent = "✅ Subscription successful!";
    newsletterForm.reset();
  });
}

// =========================
// Swiper Testimonials Initialization
// =========================
const swiper = new Swiper(".mySwiper", {
  loop: true,
  autoplay: { delay: 5000 },
  pagination: { el: ".swiper-pagination", clickable: true },
});

// =========================
// Optional: Smooth Scroll for Navbar Links
// =========================
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// === Crypto Ticker ===
document.addEventListener("DOMContentLoaded", () => {
  const tickerList = document.getElementById("tickerList");
  if (!tickerList) return;

  // Optional: replace sample data with live data if API works
  async function loadCryptoPrices() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,solana,cardano&vs_currencies=usd&include_24hr_change=true"
      );
      if (!response.ok) throw new Error("API fetch failed");
      const data = await response.json();

      tickerList.innerHTML = "";
      Object.keys(data).forEach((coin) => {
        const price = data[coin].usd.toFixed(2);
        const change = data[coin].usd_24h_change.toFixed(2);
        const direction = change >= 0 ? "up" : "down";
        const li = document.createElement("li");
        li.innerHTML = `${coin.toUpperCase()}: $${price} <span class="${direction}">(${change}%)</span>`;
        tickerList.appendChild(li);
      });
    } catch (error) {
      console.warn("Using fallback ticker data:", error);
    }
  }

  loadCryptoPrices();
  setInterval(loadCryptoPrices, 60000);
});
