// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');

function closeNav() {
  if (nav) {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
}

if (toggle && nav) {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!header?.contains(e.target)) {
      closeNav();
    }
  });

  // Prevent menu from closing when clicking inside nav
  nav.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Modal: open on "Click to View"
const modal = document.getElementById('enquiry-modal');
const enquiryForm = document.getElementById('enquiry-form');

function openModal() {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  // focus first input
  const first = modal.querySelector('input[name="name"]');
  first?.focus();
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.unlock-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    openModal();
  });
});

// Also open modal from Feature Spotlight CTA
document.querySelectorAll('.enquire-open').forEach(btn => {
  btn.addEventListener('click', () => openModal());
});

// Close on backdrop or X
modal?.addEventListener('click', (e) => {
  if ((e.target instanceof Element) && e.target.hasAttribute('data-close')) {
    closeModal();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Simple submit (prevent default for now)
enquiryForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(enquiryForm);
  const name = (data.get('name') || '').toString().trim();
  const phone = (data.get('phone') || '').toString().trim();

  if (!name || !phone) return; // basic guard

  // TODO: integrate backend or WhatsApp/SMS/email as needed
  console.log('Enquiry submitted:', { name, phone });

  // Unlock all floor plans and site plans after successful submission
  document.querySelectorAll('.floor-plan-card, .site-plan-card').forEach(card => {
    card.classList.add('unlocked');
  });

  // Reset and close
  enquiryForm.reset();
  closeModal();
});

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Gallery Carousel (vanilla JS)
(function initCarousel(){
  const root = document.querySelector('.carousel');
  if (!root) return;

  const track = root.querySelector('.carousel-track');
  const slides = Array.from(track.querySelectorAll('.slide'));
  const prev = root.querySelector('.carousel-arrow.prev');
  const next = root.querySelector('.carousel-arrow.next');
  const dotsWrap = root.querySelector('.carousel-dots');
  const thumbs = Array.from(root.querySelectorAll('.carousel-thumbs .thumb'));
  const autoplay = root.getAttribute('data-autoplay') === 'true';
  const intervalMs = Number(root.getAttribute('data-interval')) || 4500;

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Go to slide ${i+1}`);
    if (i === 0) b.classList.add('is-active');
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  let index = 0;
  let timer = null;

  function setActive(i){
    index = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === index));
    dots.forEach((d, j) => d.classList.toggle('is-active', j === index));
    thumbs.forEach((t, j) => t.classList.toggle('is-active', j === index));
  }

  function nextSlide(){ setActive(index + 1); }
  function prevSlide(){ setActive(index - 1); }

  next?.addEventListener('click', nextSlide);
  prev?.addEventListener('click', prevSlide);
  dots.forEach((d, i) => d.addEventListener('click', () => setActive(i)));
  thumbs.forEach((t, i) => t.addEventListener('click', () => setActive(i)));

  // Autoplay with pause on hover
  function start(){ if (!autoplay) return; stop(); timer = setInterval(nextSlide, intervalMs); }
  function stop(){ if (timer) clearInterval(timer); timer = null; }
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  start();

  // Swipe support
  let startX = 0, dx = 0, isDown = false;
  const vp = root.querySelector('.carousel-viewport');
  vp.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDown = true; stop(); }, {passive: true});
  vp.addEventListener('touchmove', (e) => { if (!isDown) return; dx = e.touches[0].clientX - startX; }, {passive: true});
  vp.addEventListener('touchend', () => {
    if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); }
    isDown = false; dx = 0; start();
  });
})();

// Amenities Carousel
(function initAmenitiesCarousel(){
  const root = document.querySelector('.amenities-slider');
  if (!root) return;

  const track = root.querySelector('.amenities-track');
  const slides = Array.from(track.querySelectorAll('.amenity-slide'));
  const prev = root.querySelector('.amenities-arrow.prev');
  const next = root.querySelector('.amenities-arrow.next');
  const dotsWrap = root.querySelector('.amenities-dots');
  const autoplay = root.getAttribute('data-autoplay') === 'true';
  const intervalMs = Number(root.getAttribute('data-interval')) || 5000;

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Go to amenity ${i+1}`);
    if (i === 0) b.classList.add('is-active');
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  let index = 0;
  let timer = null;

  function setActive(i){
    index = (i + slides.length) % slides.length;
    
    // Remove all classes
    slides.forEach(s => s.classList.remove('is-active', 'is-prev', 'is-next'));
    dots.forEach(d => d.classList.remove('is-active'));
    
    // Set active
    slides[index].classList.add('is-active');
    dots[index].classList.add('is-active');
    
    // Set prev/next for partial visibility with blur
    const prevIndex = (index - 1 + slides.length) % slides.length;
    const nextIndex = (index + 1) % slides.length;
    slides[prevIndex].classList.add('is-prev');
    slides[nextIndex].classList.add('is-next');
    
    // No transform needed - using flexbox order instead
  }

  function nextSlide(){ setActive(index + 1); }
  function prevSlide(){ setActive(index - 1); }

  next?.addEventListener('click', nextSlide);
  prev?.addEventListener('click', prevSlide);
  dots.forEach((d, i) => d.addEventListener('click', () => setActive(i)));

  // Mobile arrows
  const mobileNext = root.querySelector('.amenities-arrow.next.mobile');
  const mobilePrev = root.querySelector('.amenities-arrow.prev.mobile');
  mobileNext?.addEventListener('click', nextSlide);
  mobilePrev?.addEventListener('click', prevSlide);

  // Autoplay with pause on hover
  function start(){ if (!autoplay) return; stop(); timer = setInterval(nextSlide, intervalMs); }
  function stop(){ if (timer) clearInterval(timer); timer = null; }
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  
  // Initialize
  setActive(0);
  start();

  // Swipe support
  let startX = 0, dx = 0, isDown = false;
  const vp = root.querySelector('.amenities-viewport');
  vp.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDown = true; stop(); }, {passive: true});
  vp.addEventListener('touchmove', (e) => { if (!isDown) return; dx = e.touches[0].clientX - startX; }, {passive: true});
  vp.addEventListener('touchend', () => {
    if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); }
    isDown = false; dx = 0; start();
  });
})();
