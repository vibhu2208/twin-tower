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

  // Reset and close
  enquiryForm.reset();
  closeModal();
});

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
