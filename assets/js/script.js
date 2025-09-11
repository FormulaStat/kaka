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
// --- Testimonials Swiper init (robust, waits for Swiper if needed) ---
document.addEventListener('DOMContentLoaded', () => {
  function initSwiperWhenReady(retries = 0) {
    if (typeof Swiper === 'undefined') {
      if (retries > 10) {
        console.error('Swiper failed to load after multiple attempts.');
        return;
      }
      // retry after a short delay (in case script hasn't loaded yet)
      setTimeout(() => initSwiperWhenReady(retries + 1), 200);
      return;
    }

    // Only initialize once (guard)
    if (document.querySelector('.mySwiper') && !document.querySelector('.mySwiper').swiper) {
      new Swiper('.mySwiper', {
        loop: true,
        autoplay: { delay: 4500, disableOnInteraction: false },
        slidesPerView: 1,
        spaceBetween: 24,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: {
          700: { slidesPerView: 2 },
          1100: { slidesPerView: 3 }
        }
      });
    }
  }

  initSwiperWhenReady();
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

// --- Crypto Ticker (Live Prices) ---
async function loadCryptoPrices() {
  const tickerList = document.getElementById("ticker-list");
  if (!tickerList) return;

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,tether&vs_currencies=usd"
    );
    const data = await res.json();

    // Map coin IDs to readable names
    const coins = {
      bitcoin: "BTC",
      ethereum: "ETH",
      binancecoin: "BNB",
      ripple: "XRP",
      tether: "USDT",
    };

    tickerList.innerHTML = "";

    for (let key in coins) {
      if (data[key]) {
        const price = data[key].usd.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
        const li = document.createElement("li");
        li.textContent = `${coins[key]}: ${price}`;
        tickerList.appendChild(li);
      }
    }
  } catch (err) {
    console.error("Crypto API failed, fallback active:", err);
    tickerList.innerHTML = `
      <li>BTC: $27,500</li>
      <li>ETH: $1,750</li>
      <li>BNB: $245</li>
      <li>XRP: $0.48</li>
      <li>USDT: $1.00</li>
    `;
  }
}

// Load immediately and refresh every 2 minutes
loadCryptoPrices();
setInterval(loadCryptoPrices, 120000);

// What We Do: expandable cards (smooth animations, single open at a time, accessible)
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.what-card'));

  if (!cards.length) return;

  // initialize aria attributes
  cards.forEach(card => {
    const longText = card.querySelector('.long-text');
    const btn = card.querySelector('.toggle-btn');
    if (!longText || !btn) return;
    longText.style.display = 'none';
    longText.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('type', 'button');
  });

  // helpers
  function openCard(card) {
    const longText = card.querySelector('.long-text');
    const btn = card.querySelector('.toggle-btn');
    if (!longText || !btn) return;

    // close others
    cards.forEach(c => { if (c !== card) closeCard(c); });

    // reveal
    longText.style.display = 'block';              // enable measuring
    const fullHeight = longText.scrollHeight + 'px';
    // force reflow for reliable transition
    longText.style.maxHeight = '0px';
    window.getComputedStyle(longText).maxHeight;
    longText.style.opacity = '1';
    longText.style.maxHeight = fullHeight;
    card.classList.add('open');
    longText.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = 'Read Less';
  }

  function closeCard(card) {
    const longText = card.querySelector('.long-text');
    const btn = card.querySelector('.toggle-btn');
    if (!longText || !btn) return;
    // smoothly collapse
    longText.style.maxHeight = longText.scrollHeight + 'px';
    window.getComputedStyle(longText).maxHeight;
    longText.style.opacity = '0';
    longText.style.maxHeight = '0px';
    // after transition, hide
    const handler = (e) => {
      if (e.propertyName === 'max-height') {
        longText.style.display = 'none';
        longText.removeEventListener('transitionend', handler);
      }
    };
    longText.addEventListener('transitionend', handler);
    card.classList.remove('open');
    longText.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Read More';
  }

  // attach handlers
  cards.forEach(card => {
    const btn = card.querySelector('.toggle-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (card.classList.contains('open')) {
        closeCard(card);
      } else {
        openCard(card);
      }
    });

    // accessibility: open with Enter/Space when focused
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
});
