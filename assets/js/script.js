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
const counters = [
  { id: 'users', target: 1245 },
  { id: 'power', target: 3500 },
  { id: 'withdrawals', target: 875000 }
];

let hasAnimated = false;

function animateCounters() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;
  
  const sectionPos = statsSection.getBoundingClientRect().top;
  const screenPos = window.innerHeight;

  if (!hasAnimated && sectionPos < screenPos) {
    counters.forEach(counter => {
      const el = document.getElementById(counter.id);
      let count = 0;
      const increment = Math.ceil(counter.target / 200); // ~2 seconds animation
      const interval = setInterval(() => {
        count += increment;
        if (count >= counter.target) {
          el.textContent = counter.target.toLocaleString();
          clearInterval(interval);
        } else {
          el.textContent = count.toLocaleString();
        }
      }, 10);
    });
    hasAnimated = true;
  }
}

window.addEventListener('scroll', animateCounters);

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

// Fetch live crypto prices from CoinGecko API
async function loadCryptoPrices() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,ripple,solana,cardano&vs_currencies=usd&include_24hr_change=true"
    );
    const data = await response.json();

    const tickerList = document.getElementById("tickerList");
    tickerList.innerHTML = ""; // clear old data

    Object.keys(data).forEach((coin) => {
      const price = data[coin].usd.toFixed(2);
      const change = data[coin].usd_24h_change.toFixed(2);
      const direction = change >= 0 ? "up" : "down";

      const li = document.createElement("li");
      li.innerHTML = `${coin.toUpperCase()}: $${price} <span class="${direction}">(${change}%)</span>`;
      tickerList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading crypto prices:", error);
  }
}

// Load prices initially and refresh every 60s
loadCryptoPrices();
setInterval(loadCryptoPrices, 60000);
