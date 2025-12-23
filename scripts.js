// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  // Utilities
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));

  // Year in footer
  $('#year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle && navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.style.display = expanded ? '' : 'flex';
  });

  // Smooth scroll for internal links
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
          // close mobile nav if open
          if (window.innerWidth < 980 && navLinks) { navLinks.style.display = ''; navToggle.setAttribute('aria-expanded','false'); }
        }
      }
    });
  });

  // IntersectionObserver for fade-in & progress bars
  const io = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        // If progress bars inside, animate them
        const bars = entry.target.querySelectorAll('.progress');
        bars.forEach(p => {
          const val = Number(p.getAttribute('data-value')) || 0;
          const bar = p.querySelector('.progress-bar');
          if (bar) {
            // setTimeout for stagger
            setTimeout(() => bar.style.width = `${val}%`, 80);
          }
        });

        // unobserve to prevent re-trigger
        io.unobserve(entry.target);
      }
    }
  }, {threshold: 0.15});

  // observe sections/cards
  $$('.fade-in').forEach(el => io.observe(el));
  // also observe hero (if present)
  const hero = $('#hero');
  hero && io.observe(hero);

  // Portfolio modal logic
  const modal = $('#modal');
  const modalTitle = $('#modal-title');
  const modalDesc = $('#modal-desc');
  const modalMedia = document.querySelector('.modal-media');
  const modalClose = document.querySelector('.modal-close');

  function openModal(data){
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    if (data.img) modalMedia.style.backgroundImage = `url('${data.img}')`;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    // focus management
    modalClose.focus();
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  $$('.work-card').forEach(card => {
    const title = card.dataset.title || '';
    const desc = card.dataset.desc || '';
    const img = card.dataset.img || '';
    function handler(){
      openModal({title, desc, img});
    }
    card.addEventListener('click', handler);
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') handler(); });
  });

  modalClose && modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });

  // Contact form basic validation and simulated submit
  const form = $('#contactForm');
  const formMsg = $('#formMsg');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formMsg.textContent = '';
      const formData = new FormData(form);
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const message = formData.get('message')?.toString().trim();

      if (!name || !email || !message) {
        formMsg.textContent = 'Mohon lengkapi semua field terlebih dahulu.';
        formMsg.style.color = '#b02a2a';
        return;
      }
      // rudimentary email check
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        formMsg.textContent = 'Masukkan alamat email yang valid.';
        formMsg.style.color = '#b02a2a';
        return;
      }

      // Simulate send (replace with real endpoint if available)
      formMsg.style.color = '#063431';
      formMsg.textContent = 'Mengirim...';
      setTimeout(() => {
        formMsg.textContent = 'Pesan berhasil dikirim! Terima kasih 😊';
        form.reset();
      }, 1100);
    });
  }

  // Micro interactions: parallax effect on hero shapes (mouse move)
  const heroSection = document.querySelector('.hero-section');
  const bgShapes = document.querySelector('.bg-shapes');
  if (heroSection && bgShapes) {
    heroSection.addEventListener('mousemove', (e) => {
      const {left, top, width, height} = heroSection.getBoundingClientRect();
      const relX = (e.clientX - left) / width - 0.5;
      const relY = (e.clientY - top) / height - 0.5;
      bgShapes.style.transform = `translate(${relX*12}px, ${relY*8}px) rotate(${relX*6}deg)`;
    });
  }

  // Lazy load images for better performance (progressive enhancement)
  const imgs = document.querySelectorAll('img');
  imgs.forEach(img => {
    if (!img.complete) {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });

  // Keyboard-accessible skip to content (optional improvement)
  // (Already navigable via anchors; if desired, implement a "skip" link)

});