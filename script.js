/* ============================================================
   INTEGRITY RESIDENTIAL MAINTENANCE LLC
   script.js — Navigation, CRO Interactions, Analytics Hooks
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Sticky Nav Scroll Effect ─────────────────────────── */
  const nav = document.querySelector('.nav');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      nav && nav.classList.add('scrolled');
    } else {
      nav && nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── Mobile Navigation Toggle ─────────────────────────── */
  const navToggle = document.querySelector('.nav__toggle');
  const navDrawer = document.querySelector('.nav__drawer');

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', function () {
      const isOpen = navDrawer.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Animate hamburger to X
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close drawer on link click
    navDrawer.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('open');
        document.body.style.overflow = '';
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(s => s.style.transform = s.style.opacity = '');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navDrawer.contains(e.target)) {
        navDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Intersection Observer — Fade In Animations ─────────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger animations for sibling elements
          const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
          let delay = 0;
          siblings.forEach((el, idx) => {
            if (el === entry.target) delay = idx * 80;
          });
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Active Nav Link ─────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href.endsWith(currentPage))) {
      link.classList.add('active');
    }
  });

  /* ── Phone Number Click Tracking ────────────────────────── */
  document.querySelectorAll('a[href^="tel:"]').forEach(el => {
    el.addEventListener('click', function () {
      // Analytics hook — replace with GA4/Meta Pixel events
      if (typeof gtag === 'function') {
        gtag('event', 'phone_call', {
          event_category: 'CRO',
          event_label: 'Phone Click',
          value: 1
        });
      }
      // Facebook Pixel
      if (typeof fbq === 'function') {
        fbq('track', 'Contact');
      }
    });
  });

  /* ── Form Submission Tracking ────────────────────────────── */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'CRO',
          event_label: 'Form Submit',
          value: 1
        });
      }
    });
  });

  /* ── Smooth Anchor Scroll ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Emergency Form Toggle ────────────────────────────────── */
  const emergencySelect = document.querySelector('#emergency');
  const emergencyAlert = document.querySelector('.emergency-alert');
  if (emergencySelect && emergencyAlert) {
    emergencySelect.addEventListener('change', function () {
      emergencyAlert.style.display = this.value === 'yes' ? 'flex' : 'none';
    });
  }

  /* ── Contact Form Submission (No backend) ─────────────────── */
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Show loading
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate submission (replace with Tally or Formspree endpoint)
      setTimeout(() => {
        const successMsg = document.querySelector('#formSuccess');
        if (successMsg) {
          contactForm.style.display = 'none';
          successMsg.style.display = 'block';
        }
        // Analytics
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', { event_category: 'CRO', event_label: 'Form Submit' });
        }
      }, 1200);
    });
  }

  /* ── Counter Animation ──────────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ── FAQ Accordion ──────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '0';
        question.setAttribute('aria-expanded', isOpen);
      });
    }
  });

});
