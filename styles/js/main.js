// Main JavaScript

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header');
    let offset = header.offsetHeight;
    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    });
  };

  /**
   * Toggle .scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header');
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 40) {
        selectHeader.classList.add('scrolled');
      } else {
        selectHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('load', headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault();
      let navbar = select('#navbar');
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile');
        let navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.classList.toggle('bi-list');
        navbarToggle.classList.toggle('bi-x');
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Fade-in animation for .fade-in elements
   */
  const fadeElements = select('.fade-in', true);
  const handleFadeIn = () => {
    const triggerBottom = window.innerHeight * 0.85;
    fadeElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < triggerBottom) {
        element.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', handleFadeIn);
  window.addEventListener('load', handleFadeIn);

})();

// Bento box topic hover image swap
const bentoTopics = document.querySelectorAll('.bento-topic');
const bentoImageTag = document.getElementById('bentoImageTag');
bentoTopics.forEach(topic => {
  topic.addEventListener('mouseenter', function() {
    bentoTopics.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const imgSrc = this.getAttribute('data-img');
    if (bentoImageTag && imgSrc) {
      bentoImageTag.src = imgSrc;
    }
  });
});

// Hero Section Wave Animation
(function() {
  const hero = document.getElementById("home");
  const canvas = document.getElementById("waveCanvas");
  if (!canvas || !hero) return;
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const rect = hero.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const numLines = 100;
  let t1 = 0;
  let t2 = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // First wave (main, lower, slower)
    const amplitude1 = canvas.height * 0.08;
    const baseHeight1 = canvas.height * 0.70;
    const speed1 = 0.005; // slower
    // Second wave (higher, different speed and phase)
    const amplitude2 = canvas.height * 0.10;
    const baseHeight2 = canvas.height * 0.32;
    const speed2 = 0.013; // slightly different
    for (let i = 0; i < numLines; i++) {
      const x = i * (canvas.width / numLines);
      const phase = (i / numLines) * Math.PI * 2;
      // First wave
      const wave1 = Math.sin((t1 * 2) + phase) * amplitude1;
      const y1 = baseHeight1 + wave1;
      const gradient1 = ctx.createLinearGradient(x, y1, x, canvas.height);
      gradient1.addColorStop(0, "rgba(100, 100, 255, 0.28)");
      gradient1.addColorStop(1, "rgba(100, 100, 255, 0)");
      ctx.beginPath();
      ctx.strokeStyle = gradient1;
      ctx.lineWidth = 2;
      ctx.moveTo(x, y1);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      // Second wave (on top)
      const wave2 = Math.sin((t2 * 2.2) - phase * 1.2 + 1.5) * amplitude2;
      const y2 = baseHeight2 + wave2;
      const gradient2 = ctx.createLinearGradient(x, y2, x, canvas.height);
      gradient2.addColorStop(0, "rgba(76, 25, 232, 0.22)");
      gradient2.addColorStop(1, "rgba(76, 25, 232, 0)");
      ctx.beginPath();
      ctx.strokeStyle = gradient2;
      ctx.lineWidth = 2.2;
      ctx.moveTo(x, y2);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    t1 += speed1;
    t2 += speed2;
    requestAnimationFrame(animate);
  }
  animate();
})();

(function () {
  const canvas = document.getElementById("waveCanvas");
  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  const numParticles = 200;
  const orbitRadius = 220;
  const center = { x: 0, y: 0 };
  const mouse = { x: 0, y: 0 };

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    center.x = width / 2;
    center.y = height / 2;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor(angleOffset) {
      this.baseAngle = angleOffset;
      this.orbitRadius = orbitRadius + Math.random() * 80;
      this.size = Math.random() * 3 + 1;
      this.speed = 0.0005 + Math.random() * 0.001;
      this.angle = this.baseAngle;
    }

    update() {
      this.angle += this.speed;
      this.x = center.x + Math.cos(this.angle) * this.orbitRadius;
      this.y = center.y + Math.sin(this.angle) * this.orbitRadius;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(102,46,125,0.7)";
      ctx.fill();
    }
  }

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle((i / numParticles) * Math.PI * 2));
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(206,179,211,${1 - dist / 120})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.update();
      p.draw();
    }

    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
})();

