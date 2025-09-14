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

  const cards = document.querySelectorAll('.reason-card');
const obs = new IntersectionObserver((entries)=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      entry.target.classList.add('show','delay-'+((i%4)+1));
      obs.unobserve(entry.target);
    }
  });
},{threshold:0.25});
cards.forEach(c=>obs.observe(c));

let allCoins = []; // store all data for filtering

async function fetchCryptoData() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
    );
    const data = await res.json();
    allCoins = data; // save all coins for search filter
    renderCryptoTable(allCoins);
  } catch (error) {
    document.getElementById("crypto-data").innerHTML =
      "<tr><td colspan='7'>⚠️ Error loading data</td></tr>";
    console.error(error);
  }
}

function renderCryptoTable(coins) {
  let rows = "";
  coins.forEach((coin, index) => {
    rows += `
      <tr>
        <td>${index + 1}</td>
        <td><img src="${coin.image}" alt="${coin.name}"> ${coin.name}</td>
        <td>${coin.symbol.toUpperCase()}</td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td class="${coin.price_change_percentage_24h >= 0 ? "positive" : "negative"}">
          ${coin.price_change_percentage_24h?.toFixed(2) ?? "0.00"}%
        </td>
        <td>$${coin.market_cap.toLocaleString()}</td>
        <td>$${coin.total_volume.toLocaleString()}</td>
      </tr>
    `;
  });

  document.getElementById("crypto-data").innerHTML =
    rows || "<tr><td colspan='7'>No matching coins found</td></tr>";
}

// Search filter
document.getElementById("crypto-search-input").addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  const filteredCoins = allCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchValue) ||
      coin.symbol.toLowerCase().includes(searchValue)
  );
  renderCryptoTable(filteredCoins);
});

// Fetch on load
fetchCryptoData();
// Auto refresh every 10 seconds
setInterval(fetchCryptoData, 10000);

// =========================
// Investment Plans Script
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('planModal');
  const modalTitle = document.getElementById('planModalTitle');
  const modalDeposit = document.getElementById('modalDeposit');
  const modalPayout = document.getElementById('modalPayout');
  const modalReferral = document.getElementById('modalReferral');
  const modalBonus = document.getElementById('modalBonus');
  const modalTerms = document.getElementById('modalTerms');
  const modalClose = document.querySelector('.modal-close');
  const planButtons = document.querySelectorAll('.plan-cta');

  // Format numbers as currency
  function formatCurrency(n) {
    return Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  // Compounding formula: principal × (1 + r)^days
  function compoundAmount(principal, dailyRate, days) {
    return principal * Math.pow(1 + dailyRate, days);
  }

  // Open Modal and populate with data
  function openModal(planEl) {
    const name = planEl.getAttribute('data-plan');
    const min = Number(planEl.getAttribute('data-min'));
    const max = Number(planEl.getAttribute('data-max'));
    const rate = Number(planEl.getAttribute('data-rate'));
    const duration = Number(planEl.getAttribute('data-duration'));
    const referral = Number(planEl.getAttribute('data-referral')) || 0;
    const bonus = Number(planEl.getAttribute('data-bonus')) || 0;

    modal.setAttribute('aria-hidden', 'false');
    modalTitle.textContent = `${name} Plan — Details`;

    modalDeposit.value = min;
    modalReferral.textContent = `${referral}%`;
    modalBonus.textContent = formatCurrency(bonus);

    modalTerms.textContent = `${name} Plan — Minimum deposit ${formatCurrency(min)}. Duration: ${duration} days. Daily interest: ${(rate*100).toFixed(2)}% compounded. Referral: ${referral}%. See Risk Disclosure.`;

    // Initial payout
    const payout = compoundAmount(min, rate, duration);
    modalPayout.textContent = formatCurrency(payout);

    // Update payout when user changes deposit
    modalDeposit.oninput = () => {
      let val = Number(modalDeposit.value);
      if (isNaN(val) || val < min) val = min;
      if (val > max) val = max;

      const payoutCalc = compoundAmount(val, rate, duration);
      modalPayout.textContent = formatCurrency(payoutCalc);
    };
  }

  // Attach event to plan buttons
  planButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.plan-card');
      if (card) openModal(card);
    });
  });

  // Close modal
  modalClose.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'true');
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  // Accessibility: open modal with Enter key
  document.querySelectorAll('.plan-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') openModal(card);
    });
  });

  // Desktop hover parallax effect
  if (window.innerWidth >= 992) {
    document.querySelectorAll('.plan-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) - rect.width/2;
        const y = (e.clientY - rect.top) - rect.height/2;
        card.style.transform = `translateY(-8px) rotateX(${(y/rect.height)*2}deg) rotateY(${(x/rect.width)*2}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
});
