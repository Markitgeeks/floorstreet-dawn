/* ============================================================
   Floor Street — Dawn Theme Custom JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* -------------------------------------------------------
     Countdown Timer
     ------------------------------------------------------- */
  class FSCountdown {
    constructor(el) {
      this.el = el;
      this.endDate = new Date(el.dataset.endDate).getTime();
      if (isNaN(this.endDate)) return;

      this.daysEl = el.querySelector('[data-days]');
      this.hoursEl = el.querySelector('[data-hours]');
      this.minsEl = el.querySelector('[data-mins]');
      this.secsEl = el.querySelector('[data-secs]');

      this.update();
      this.interval = setInterval(() => this.update(), 1000);
    }

    update() {
      const now = Date.now();
      const diff = Math.max(0, this.endDate - now);

      if (diff <= 0) {
        clearInterval(this.interval);
        if (this.el.dataset.expiredHide === 'true') {
          this.el.closest('.fs-announcement')?.remove();
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (this.daysEl) this.daysEl.textContent = String(days).padStart(2, '0');
      if (this.hoursEl) this.hoursEl.textContent = String(hours).padStart(2, '0');
      if (this.minsEl) this.minsEl.textContent = String(mins).padStart(2, '0');
      if (this.secsEl) this.secsEl.textContent = String(secs).padStart(2, '0');
    }
  }

  /* -------------------------------------------------------
     Sticky Header scroll effect
     ------------------------------------------------------- */
  class FSStickyHeader {
    constructor(el) {
      this.header = el;
      this.scrollThreshold = 50;
      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    }

    onScroll() {
      if (window.scrollY > this.scrollThreshold) {
        this.header.classList.add('is-scrolled');
      } else {
        this.header.classList.remove('is-scrolled');
      }
    }
  }

  /* -------------------------------------------------------
     Mobile Navigation Drawer
     ------------------------------------------------------- */
  class FSMobileNav {
    constructor() {
      this.overlay = document.querySelector('.fs-mobile-nav-overlay');
      this.drawer = document.querySelector('.fs-mobile-nav');
      if (!this.overlay || !this.drawer) return;

      this.openBtns = document.querySelectorAll('[data-open-mobile-nav]');
      this.closeBtns = document.querySelectorAll('[data-close-mobile-nav]');

      this.openBtns.forEach(btn => btn.addEventListener('click', () => this.open()));
      this.closeBtns.forEach(btn => btn.addEventListener('click', () => this.close()));
      this.overlay.addEventListener('click', () => this.close());

      // Accordion sub-menus
      this.drawer.querySelectorAll('[data-toggle-sub]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const sub = btn.nextElementSibling;
          if (sub) {
            sub.classList.toggle('is-open');
            btn.classList.toggle('is-open');
          }
        });
      });
    }

    open() {
      this.drawer.classList.add('is-open');
      this.overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    close() {
      this.drawer.classList.remove('is-open');
      this.overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  /* -------------------------------------------------------
     Testimonials Carousel
     ------------------------------------------------------- */
  class FSTestimonials {
    constructor(el) {
      this.el = el;
      this.track = el.querySelector('.fs-testimonials__track');
      this.slides = el.querySelectorAll('.fs-testimonial');
      this.dots = el.querySelectorAll('.fs-testimonials__dot');
      this.current = 0;
      this.total = this.slides.length;
      this.autoplayDelay = parseInt(el.dataset.autoplay) || 5000;

      if (this.total <= 1) return;

      this.dots.forEach((dot, i) => {
        dot.addEventListener('click', () => this.goTo(i));
      });

      // Swipe support
      let startX = 0;
      this.track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      this.track.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) this.next();
          else this.prev();
        }
      }, { passive: true });

      // Autoplay
      this.startAutoplay();
      el.addEventListener('mouseenter', () => this.stopAutoplay());
      el.addEventListener('mouseleave', () => this.startAutoplay());
    }

    goTo(index) {
      this.current = ((index % this.total) + this.total) % this.total;
      this.track.style.transform = `translateX(-${this.current * 100}%)`;
      this.dots.forEach((d, i) => d.classList.toggle('is-active', i === this.current));
    }

    next() { this.goTo(this.current + 1); }
    prev() { this.goTo(this.current - 1); }

    startAutoplay() {
      this.stopAutoplay();
      this.autoplayTimer = setInterval(() => this.next(), this.autoplayDelay);
    }

    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }
  }

  /* -------------------------------------------------------
     Initialize everything on DOM ready
     ------------------------------------------------------- */
  function init() {
    // Countdown timers
    document.querySelectorAll('[data-countdown]').forEach(el => new FSCountdown(el));

    // Sticky header
    const header = document.querySelector('.fs-header');
    if (header) new FSStickyHeader(header);

    // Mobile nav
    new FSMobileNav();

    // Testimonials
    document.querySelectorAll('.fs-testimonials__slider').forEach(el => new FSTestimonials(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
