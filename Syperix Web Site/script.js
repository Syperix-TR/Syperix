/* ============================================================
   SYPERIX — Interactive Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============ LOADING SCREEN ============
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('done');
  }, 2200);

  // ============ CUSTOM CURSOR ============
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const interactives = document.querySelectorAll('a, button, .team-card, .project-big-card, .rnd-card, .supporter-card, .achievement-card, input, select, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.width = '12px';
        dot.style.height = '12px';
        dot.style.background = 'transparent';
        dot.style.border = '2px solid var(--accent)';
        ring.style.width = '50px';
        ring.style.height = '50px';
        ring.style.opacity = '0.3';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.width = '6px';
        dot.style.height = '6px';
        dot.style.background = 'var(--accent)';
        dot.style.border = 'none';
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.opacity = '0.5';
      });
    });
  }

  // ============ GRID CANVAS ============
  const canvas = document.getElementById('gridCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    let dots = [];
    let mouse = { x: -999, y: -999 };

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      createDots();
    }

    function createDots() {
      dots = [];
      const spacing = 55;
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil(h / spacing);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            x: i * spacing + spacing / 2,
            y: j * spacing + spacing / 2,
            baseX: i * spacing + spacing / 2,
            baseY: j * spacing + spacing / 2,
            radius: 1.2,
            opacity: 0.15 + Math.random() * 0.1
          });
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      
      dots.forEach(d => {
        const dx = mouse.x - d.x;
        const dy = mouse.y - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;

        let r = d.radius;
        let o = d.opacity;

        if (dist < maxDist) {
          const factor = 1 - dist / maxDist;
          r = d.radius + factor * 3;
          o = d.opacity + factor * 0.5;
          
          // Slight displacement away from mouse
          const angle = Math.atan2(dy, dx);
          d.x = d.baseX - Math.cos(angle) * factor * 8;
          d.y = d.baseY - Math.sin(angle) * factor * 8;
        } else {
          // Return to base
          d.x += (d.baseX - d.x) * 0.08;
          d.y += (d.baseY - d.y) * 0.08;
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${o})`;
        ctx.fill();
      });

      // Connect nearby dots on hover
      for (let a = 0; a < dots.length; a++) {
        const dxM = mouse.x - dots[a].x;
        const dyM = mouse.y - dots[a].y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (distM > 180) continue;

        for (let b = a + 1; b < dots.length; b++) {
          const dx = dots[a].x - dots[b].x;
          const dy = dots[a].y - dots[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 80) {
            const dxM2 = mouse.x - dots[b].x;
            const dyM2 = mouse.y - dots[b].y;
            const distM2 = Math.sqrt(dxM2 * dxM2 + dyM2 * dyM2);
            if (distM2 > 180) continue;

            const alpha = (1 - dist / 80) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(dots[a].x, dots[a].y);
            ctx.lineTo(dots[b].x, dots[b].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -999;
      mouse.y = -999;
    });

    resize();
    draw();
    window.addEventListener('resize', resize);
  }

  // ============ NAVBAR ============
  const nav = document.getElementById('mainNav');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;

    if (sy > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    if (sy > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    updateActiveLink();
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Active link
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(sec => {
      const top = sec.offsetTop - 130;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // ============ METRICS COUNTER ============
  const metricNums = document.querySelectorAll('.metric-num');
  let metricsAnimated = false;

  function animateMetrics() {
    metricNums.forEach(num => {
      const target = parseInt(num.getAttribute('data-target'));
      const duration = 1500;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        num.textContent = Math.floor(target * eased);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          num.textContent = target + '+';
        }
      }

      requestAnimationFrame(tick);
    });
  }

  const metricsContainer = document.querySelector('.hero-metrics');
  if (metricsContainer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metricsAnimated) {
          metricsAnimated = true;
          animateMetrics();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(metricsContainer);
  }

  // ============ SCROLL REVEAL ============
  const revealElements = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation for siblings
        const parent = entry.target.parentElement;
        const siblings = parent.querySelectorAll('.reveal-up');
        let delay = 0;
        siblings.forEach(sib => {
          if (sib === entry.target) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
          }
          delay += 80;
        });

        // Fallback - ensure it shows
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 600);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============ CONTACT FORM ============
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('cName');
      const emailEl = document.getElementById('cEmail');
      const msgEl = document.getElementById('cMessage');
      let valid = true;

      [nameEl, emailEl, msgEl].forEach(el => el.classList.remove('error'));

      if (!nameEl.value.trim()) {
        nameEl.classList.add('error');
        valid = false;
      }
      if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        emailEl.classList.add('error');
        valid = false;
      }
      if (!msgEl.value.trim()) {
        msgEl.classList.add('error');
        valid = false;
      }

      if (valid) {
        toast.classList.add('show');
        form.reset();
        setTimeout(() => toast.classList.remove('show'), 4000);
      }
    });
  }

  // ============ TILT EFFECT ON CARDS ============
  if (window.matchMedia('(hover: hover)').matches) {
    const tiltCards = document.querySelectorAll('.project-big-card, .team-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotX = (y - 0.5) * -6;
        const rotY = (x - 0.5) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ============ SMOOTH SECTION TRANSITIONS ============
  // Subtle parallax on hero
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (sy < window.innerHeight) {
        heroContent.style.transform = `translateY(${sy * 0.15}px)`;
        heroContent.style.opacity = 1 - sy / (window.innerHeight * 0.8);
      }
    });
  }

  // ============ TYPED EFFECT FOR HERO DESC ============
  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) {
    const originalText = heroDesc.textContent;
    heroDesc.textContent = '';
    heroDesc.style.minHeight = '80px';
    
    let charIndex = 0;
    setTimeout(() => {
      function typeChar() {
        if (charIndex < originalText.length) {
          heroDesc.textContent += originalText[charIndex];
          charIndex++;
          setTimeout(typeChar, 18);
        }
      }
      typeChar();
    }, 1200);
  }

});
