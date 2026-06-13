// Design B "Obsidian Glass" — scroll choreography + liquid-glass
// micro-interactions. Heavy work gates behind html.motion (set in
// <head> unless the visitor prefers reduced motion).

import './alt.css';
import { initDesignBar } from '../designbar.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

initDesignBar('b');
document.getElementById('g-year').textContent = String(new Date().getFullYear());

const motion = document.documentElement.classList.contains('motion');
const finePointer = window.matchMedia('(pointer: fine)').matches;

// pointer-tracked glare on every glass surface
if (finePointer) {
  document.querySelectorAll('.glare').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
}

// without motion the demo window still tells the full story: end state
if (!motion) {
  document.querySelector('.g-demo').dataset.scene = '3';
}

if (motion) {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // nav anchors glide
  document.querySelectorAll('.g-links a[href^="#"], .g-ctas a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(a.getAttribute('href'), { offset: -20, duration: 1.2 });
    });
  });

  // nav gains depth + glow once scrolled
  ScrollTrigger.create({
    start: 80,
    onToggle: (self) => document.getElementById('g-nav').classList.toggle('is-stuck', self.isActive),
  });

  // ---------------------------------------------------- hero entrance
  const heroLines = new SplitText('.g-h1', { type: 'lines', mask: 'lines' }).lines;
  gsap
    .timeline({ defaults: { ease: 'power4.out' } })
    .from(heroLines, { yPercent: 120, duration: 1.1, stagger: 0.1 }, 0.15)
    .to('.g-kicker', { opacity: 1, duration: 0.7 }, 0.35)
    .to('.g-sub', { opacity: 1, duration: 0.8 }, 0.7)
    .to('.g-ctas', { opacity: 1, duration: 0.8 }, 0.85)
    .to('.g-micro', { opacity: 1, duration: 0.8 }, 0.95)
    .to('.g-stats', { opacity: 1, duration: 0.8 }, 1.05);

  document.querySelectorAll('.g-stat strong').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const state = { v: 0 };
    gsap.to(state, {
      v: target,
      duration: 1.6,
      delay: 1.05,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(state.v) + suffix;
      },
    });
  });

  // glow meshes breathe and drift
  gsap.to('.g-glow-hero', { y: 90, scale: 1.08, duration: 14, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.g-glow-demo', { x: -70, y: 60, duration: 17, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.g-glow-bento', { x: 60, y: -50, duration: 19, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.g-glow-price', { y: 70, scale: 1.06, duration: 16, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // hero glow recedes as you scroll into the page
  gsap.to('.g-glow-hero', {
    opacity: 0.35,
    ease: 'none',
    scrollTrigger: { trigger: '.g-hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });

  // ------------------------------------------- connector row entrance
  gsap.from('.g-logo', {
    y: 26,
    opacity: 0,
    duration: 0.6,
    stagger: 0.045,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-logos-row', start: 'top 82%' },
  });

  // --------------------------------------- pinned three-scene demo
  const demo = document.querySelector('.g-demo');
  gsap.from('.g-win', {
    y: 80,
    opacity: 0,
    scale: 0.96,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-demo', start: 'top 70%' },
  });
  ScrollTrigger.create({
    trigger: '.g-demo',
    start: 'top top',
    end: '+=240%',
    pin: '.g-demo-stage',
    scrub: true,
    onUpdate: (self) => {
      const scene = self.progress < 0.33 ? '1' : self.progress < 0.7 ? '2' : '3';
      if (demo.dataset.scene !== scene) demo.dataset.scene = scene;
    },
  });

  // ------------------------------------------------------ bento tiles
  gsap.from('.g-tile', {
    y: 60,
    opacity: 0,
    scale: 0.97,
    duration: 0.8,
    stagger: 0.09,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-bento', start: 'top 80%' },
  });

  // ----------------------------------------------------- pricing
  gsap.from('.g-card', {
    y: 70,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-cards', start: 'top 78%' },
  });

  // --------------------------------------------------------- faq
  gsap.from('.g-faq details', {
    y: 36,
    opacity: 0,
    duration: 0.7,
    stagger: 0.07,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.g-faq', start: 'top 80%' },
  });

  // ------------------------------------------------------- final
  const finalLines = new SplitText('.g-final-h', { type: 'lines', mask: 'lines' }).lines;
  gsap.from(finalLines, {
    yPercent: 120,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out',
    scrollTrigger: { trigger: '.g-final', start: 'top 65%' },
  });

  // --------------------------------------------- floating CTA dock
  const dock = document.getElementById('g-dock');
  const showDock = gsap.to(dock, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', paused: true });
  gsap.set(dock, { y: 16 });
  let pastHero = false;
  let beforeFinal = true;
  const syncDock = () => (pastHero && beforeFinal ? showDock.play() : showDock.reverse());
  ScrollTrigger.create({
    trigger: '.g-hero',
    start: 'bottom 70%',
    onToggle: (self) => {
      pastHero = self.isActive || self.progress === 1;
      syncDock();
    },
  });
  ScrollTrigger.create({
    trigger: '.g-final',
    start: 'top 75%',
    onToggle: (self) => {
      beforeFinal = !self.isActive;
      syncDock();
    },
  });

  // ------------------------------------------------ micro-interactions
  if (finePointer) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      const strength = 12;
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
        gsap.to(btn, { x: dx * strength, y: dy * strength, duration: 0.35, ease: 'power3.out' });
      });
      btn.addEventListener('pointerleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' });
      });
    });

    const cursor = document.querySelector('.g-cursor');
    const dot = document.querySelector('.g-cursor-dot');
    const ring = document.querySelector('.g-cursor-ring');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    addEventListener('pointermove', (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    });
    gsap.ticker.add(() => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
    });
    document.addEventListener('pointerover', (e) => {
      cursor.classList.toggle('is-link', !!e.target.closest('a, button, summary'));
    });
  }
}
