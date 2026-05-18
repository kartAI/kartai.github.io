/* =====================================================
   KartAI Sluttrapport — Script
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- VIDEO FALLBACK --- */
  const video = document.getElementById('hero-video');
  const placeholder = document.getElementById('video-placeholder');
  if (video) {
    video.addEventListener('error', () => placeholder?.classList.add('show'));
    // Vis placeholder hvis video ikke starter innen 2s
    setTimeout(() => {
      if (video.readyState === 0) placeholder?.classList.add('show');
    }, 2000);
  } else if (placeholder) {
    placeholder.classList.add('show');
  }

  /* --- NAVBAR: scroll-effekt --- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* --- SCROLL REVEAL (IntersectionObserver) --- */
  const revealEls = document.querySelectorAll('.scroll-reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger innenfor samme forelder
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.scroll-reveal'));
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* --- COUNTER ANIMATION --- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString('no-NO') + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString('no-NO') + suffix;
    }
    requestAnimationFrame(update);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.counter, .fact-number[data-target]').forEach(el => {
    counterObs.observe(el);
  });

  /* --- ACCORDION --- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      // Lukk alle
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-body').classList.remove('open');
        openItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });

      // Åpne valgt (om det ikke allerede var åpent)
      if (!isOpen) {
        item.classList.add('open');
        body.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        // Scroll til accordion-item
        setTimeout(() => {
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  });

  /* --- HORISONTAL SLIDER --- */
  const slider = document.getElementById('rippleSlider');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsWrap = document.getElementById('sliderDots');

  if (slider) {
    const cards = slider.querySelectorAll('.ripple-card');
    const cardCount = cards.length;
    let activeDot = 0;

    // Bygg dots
    if (dotsWrap) {
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Kort ${i + 1}`);
        dot.addEventListener('click', () => scrollToCard(i));
        dotsWrap.appendChild(dot);
      });
    }

    function getCardWidth() {
      const card = cards[0];
      if (!card) return 340;
      return card.offsetWidth + parseInt(getComputedStyle(slider).gap || 20);
    }

    function scrollToCard(index) {
      const cw = getCardWidth();
      slider.scrollTo({ left: index * cw, behavior: 'smooth' });
    }

    function updateDots() {
      const cw = getCardWidth();
      const idx = Math.round(slider.scrollLeft / cw);
      if (idx === activeDot) return;
      activeDot = idx;
      dotsWrap?.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === activeDot);
      });
      if (prevBtn) prevBtn.disabled = activeDot === 0;
      if (nextBtn) nextBtn.disabled = activeDot >= cardCount - 1;
    }

    prevBtn?.addEventListener('click', () => scrollToCard(Math.max(0, activeDot - 1)));
    nextBtn?.addEventListener('click', () => scrollToCard(Math.min(cardCount - 1, activeDot + 1)));
    slider.addEventListener('scroll', updateDots, { passive: true });
    updateDots();

    // Touch/swipe support
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        scrollToCard(diff > 0
          ? Math.min(cardCount - 1, activeDot + 1)
          : Math.max(0, activeDot - 1)
        );
      }
    }, { passive: true });
  }

  /* --- SMOOTH SCROLL FOR ANKER-LENKER --- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  /* --- HAMBURGER MENY (mobil) --- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger?.addEventListener('click', () => {
    const open = navLinks?.style.display === 'flex';
    if (navLinks) navLinks.style.display = open ? '' : 'flex';
    if (!open && navLinks) {
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'fixed';
      navLinks.style.top = '64px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'var(--col-surface)';
      navLinks.style.padding = '16px 24px';
      navLinks.style.borderBottom = '1px solid var(--col-border)';
      navLinks.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
      navLinks.style.zIndex = '999';
    } else if (navLinks) {
      navLinks.removeAttribute('style');
    }
  });

  /* --- SCROLLAMA: sticky scroll-seksjon (klar til bruk) --- */
  // Eksempel: legg til class="sticky-graphic" på en seksjon og
  // class="step" på hvert steg-element for å aktivere dette.
  if (typeof scrollama !== 'undefined') {
    const scroller = scrollama();
    const steps = document.querySelectorAll('.step');
    if (steps.length > 0) {
      scroller
        .setup({ step: '.step', offset: 0.5, progress: true })
        .onStepEnter(({ element, index, direction }) => {
          element.classList.add('is-active');
        })
        .onStepExit(({ element }) => {
          element.classList.remove('is-active');
        });
      window.addEventListener('resize', scroller.resize);
    }
  }

});
