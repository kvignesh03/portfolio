/**
 * K Vignesh Portfolio - Main JavaScript
 * Interactive functionality, theme switcher, responsive navigation,
 * clipboard helpers, filtering, and modal management.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNavigation();
  initScrollSpy();
  initSkillsFilter();
  initClipboardHelpers();
  initProjectModals();
  initContactForm();
});

/* ==========================================================================
   1. Dark / Light Theme Switcher
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Retrieve saved preference or check system preference
  const savedTheme = localStorage.getItem('vignesh_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('vignesh_theme', newTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  function toggleMenu() {
    const isOpen = navMenu.classList.toggle('open');
    mobileToggle.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close when clicking outside of navigation header
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. Scroll Spy (Active Nav Link Highlighting)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

/* ==========================================================================
   4. Skills Filter
   ========================================================================== */
function initSkillsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterButtons.length || !skillCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');

      // Update active filter button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter skill cards
      skillCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. One-Click Copy Helpers & Toast Notifications
   ========================================================================== */
function initClipboardHelpers() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = button.getAttribute('data-copy');
      if (!textToCopy) return;

      copyTextToClipboard(textToCopy);
      
      const label = textToCopy.includes('@') ? 'Email copied to clipboard!' : 'Phone number copied to clipboard!';
      showToast(label);
    });
  });
}

function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(err => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed: ', err);
  }
  document.body.removeChild(textArea);
}

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   6. Project Architecture Modal
   ========================================================================== */
function initProjectModals() {
  const openButtons = document.querySelectorAll('.open-details-btn');
  const modalCloseBtn = document.getElementById('modal-close');
  const modal = document.getElementById('hospital-modal');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      openModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. Interactive Contact Form (Direct Email & Gmail Composer)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const gmailBtn = document.getElementById('btn-gmail');
  if (!form) return;

  const recipientEmail = 'vignesh239797@gmail.com';

  function getFormData() {
    const name = document.getElementById('form-name')?.value.trim() || '';
    const email = document.getElementById('form-email')?.value.trim() || '';
    const subject = document.getElementById('form-subject')?.value.trim() || '';
    const message = document.getElementById('form-message')?.value.trim() || '';
    return { name, email, subject, message };
  }

  function buildEmailBody(name, email, message) {
    return `Hello Vignesh,

${message}

--------------------------------------------------
Sender Details:
Name: ${name}
Email: ${email}
Sent via K Vignesh Portfolio`;
  }

  // Handle Form Submit: Open default Email App via mailto:
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const { name, email, subject, message } = getFormData();

    if (!name || !email || !subject || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    const fullBody = buildEmailBody(name, email, message);
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;

    const submitBtn = form.querySelector('.btn-submit');
    const originalContent = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Opening Email App...</span>`;

    // Trigger system default email client
    window.location.href = mailtoUrl;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      showToast(`Opening your email client to send to ${recipientEmail}`);
    }, 1000);
  });

  // Handle "Open in Gmail" Button Click
  if (gmailBtn) {
    gmailBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const { name, email, subject, message } = getFormData();

      if (!name || !email || !subject || !message) {
        showToast('Please fill in your name, email, and message first.');
        if (!name) document.getElementById('form-name')?.focus();
        else if (!email) document.getElementById('form-email')?.focus();
        else if (!subject) document.getElementById('form-subject')?.focus();
        else if (!message) document.getElementById('form-message')?.focus();
        return;
      }

      const fullBody = buildEmailBody(name, email, message);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;

      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      showToast('Opening Gmail web composer in a new tab!');
    });
  }
}
