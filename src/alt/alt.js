// Design B "Editorial Motion" — scroll choreography. Everything heavy
// lives behind the html.motion gate (set in <head> when the visitor
// doesn't prefer reduced motion), so the page reads fine without it.

import './alt.css';
import { initDesignBar } from '../designbar.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

initDesignBar('b');
document.getElementById('ed-year').textContent = String(new Date().getFullYear());

const motion = document.documentElement.classList.contains('motion');

if (motion) {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // buttery scroll, wired into GSAP's ticker
  const lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // ---------------------------------------------------- hero entrance
  const chars = new SplitText('.ed-h1 .ed-line', { type: 'chars' }).chars;
  gsap
    .timeline({ defaults: { ease: 'power4.out' } })
    .from(chars, { yPercent: 118, rotate: 4, duration: 1.15, stagger: 0.022 }, 0.15)
    .to('.ed-kicker', { opacity: 1, duration: 0.7 }, 0.4)
    .to('.ed-sub', { opacity: 1, duration: 0.8 }, 0.75)
    .to('.ed-cta-row', { opacity: 1, duration: 0.8 }, 0.9)
    .to('.ed-stats', { opacity: 1, duration: 0.8 }, 1.05);

  // counters tick up once the stats row is in
  document.querySelectorAll('.ed-stat strong').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const state = { v: 0 };
    gsap.to(state, {
      v: target,
      duration: 1.6,
      delay: 1.1,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(state.v) + suffix;
      },
    });
  });

  // fox drifts with scroll
  gsap.to('.ed-hero-fox', {
    y: -90,
    rotate: -6,
    ease: 'none',
    scrollTrigger: { trigger: '.ed-hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });
  gsap.to('.ed-hero-blob', {
    y: 140,
    scale: 1.15,
    ease: 'none',
    scrollTrigger: { trigger: '.ed-hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });

  // ------------------------------------------- manifesto word scrub
  const words = new SplitText('.ed-fill', { type: 'words' }).words;
  gsap.set(words, { color: '#d6d1c4' });
  gsap.to(words, {
    color: '#131210',
    stagger: 0.06,
    ease: 'none',
    scrollTrigger: { trigger: '.ed-manifesto', start: 'top 72%', end: 'bottom 45%', scrub: 0.4 },
  });

  // -------------------------------------- pinned horizontal gallery
  const track = document.querySelector('.ed-htrack');
  const dist = () => track.scrollWidth - window.innerWidth;
  const slide = gsap.to(track, {
    x: () => -dist(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.ed-hwrap',
      start: 'top top',
      end: () => '+=' + dist(),
      scrub: 0.7,
      pin: true,
      invalidateOnRefresh: true,
    },
  });
  // panel headlines drift in as the track slides
  document.querySelectorAll('.ed-panel h3').forEach((h) => {
    gsap.from(h, {
      x: 90,
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: h,
        containerAnimation: slide,
        start: 'left 85%',
        end: 'left 45%',
        scrub: true,
      },
    });
  });

  // ------------------------------------------- autopilot timeline
  gsap.to('.ed-pilot-line i', {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { trigger: '.ed-pilot-right', start: 'top 70%', end: 'bottom 55%', scrub: 0.4 },
  });
  document.querySelectorAll('.ed-row').forEach((row) => {
    gsap.from(row, {
      opacity: 0.18,
      x: 26,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: row, start: 'top 74%' },
    });
  });
  gsap.from('.ed-pilot-end', {
    opacity: 0,
    y: 24,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.ed-pilot-end', start: 'top 82%' },
  });

  // ----------------------------------------------------- pricing
  gsap.from('.ed-card', {
    y: 70,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.ed-cards', start: 'top 78%' },
  });

  // ------------------------------------------------------- final
  const finalChars = new SplitText('.ed-final-h .ed-line', { type: 'chars' }).chars;
  gsap.from(finalChars, {
    yPercent: 110,
    duration: 0.9,
    stagger: 0.015,
    ease: 'power4.out',
    scrollTrigger: { trigger: '.ed-final', start: 'top 62%' },
  });

  // ------------------------------------------------ micro-interactions
  // magnetic buttons
  if (window.matchMedia('(pointer: fine)').matches) {
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

    // pricing-card tilt
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
        gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('pointerleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' });
      });
    });

    // cursor: dot snaps, ring lags
    const cursor = document.querySelector('.ed-cursor');
    const dot = document.querySelector('.ed-cursor-dot');
    const ring = document.querySelector('.ed-cursor-ring');
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
      cursor.classList.toggle('is-link', !!e.target.closest('a, button'));
    });
  }
}
