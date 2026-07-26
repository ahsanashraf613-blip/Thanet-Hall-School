  // ===== LOADER =====
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 800);
  });

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  // ===== PAGE NAVIGATION =====
  function showPage(pageId) {
    const target = document.getElementById('page-' + pageId);
    if (!target) return;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    target.classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-trigger reveal animations on the new page
    setTimeout(() => {
      const reveals = target.querySelectorAll('.reveal, .stagger');
      reveals.forEach(el => {
        el.classList.remove('visible');
        observer.observe(el);
      });
    }, 100);

    // Close mobile menu if open
    closeMobileMenu();
  }

  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const page = el.dataset.page;
      showPage(page);
    });
  });

  // ===== SCROLL REVEAL ANIMATIONS =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger counter animation if applicable
        const counters = entry.target.querySelectorAll('[data-count]');
        counters.forEach(animateCounter);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));

  // ===== COUNTER ANIMATION =====
  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(update);
  }

  // ===== MOBILE MENU =====
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('mobile-menu-btn').addEventListener('click', openMobileMenu);
  document.getElementById('mobile-close').addEventListener('click', closeMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  // ===== BACK TO TOP =====
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== TOAST =====
  function showToast(message, icon = 'fa-check-circle') {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-message');
    msg.textContent = message;
    toast.querySelector('i').className = 'fas ' + icon;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // ===== FORM SUBMISSION =====
  document.getElementById('admission-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Admission inquiry submitted! We will contact you within 24 hours.', 'fa-paper-plane');
    e.target.reset();
  });

  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent successfully! Our team will respond shortly.', 'fa-envelope-open');
    e.target.reset();
  });

  // ===== PARALLAX ON HERO ORBS =====
  document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.hero .orb');
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.3;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  // ===== KEYBOARD ACCESSIBILITY =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
