'use strict';

const scrollProgress = document.querySelector('.scroll-progress');
const scrollProgressFill = document.querySelector('.scroll-progress-fill');
if (scrollProgress && scrollProgressFill) {
  let progressFrame = 0;
  const updateScrollProgress = () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100)) : 0;
      scrollProgressFill.style.width = `${progress}%`;
      scrollProgress.setAttribute('aria-valuenow', String(Math.round(progress)));
      progressFrame = 0;
    });
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();
}

const trustBand = document.querySelector('.trust-band');
const trustPause = document.querySelector('.trust-pause');
if (trustBand && trustPause) {
  trustPause.hidden = false;
  trustPause.addEventListener('click', () => {
    const paused = trustBand.classList.toggle('is-paused');
    trustPause.setAttribute('aria-pressed', String(paused));
    trustPause.setAttribute('aria-label', paused ? 'Retomar movimento da faixa' : 'Pausar movimento da faixa');
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const hero = document.querySelector('#inicio');
const sticky = document.querySelector('.mobile-sticky');
const offer = document.querySelector('#oferta');
const closing = document.querySelector('#comecar');

if (hero && sticky && offer && closing && 'IntersectionObserver' in window) {
  const mobile = window.matchMedia('(max-width: 760px)');
  let pastHero = false;
  let offerVisible = false;
  let closingVisible = false;
  const update = () => {
    sticky.hidden = !(mobile.matches && pastHero && !offerVisible && !closingVisible);
  };
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === hero) pastHero = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
      if (entry.target === offer) offerVisible = entry.isIntersecting;
      if (entry.target === closing) closingVisible = entry.isIntersecting;
    }
    update();
  }, { threshold: 0 });
  [hero, offer, closing].forEach((element) => observer.observe(element));
  mobile.addEventListener('change', update);
}

// Mantém apenas uma resposta aberta sem impedir navegação por teclado.
const questions = document.querySelectorAll('.accordion details');
questions.forEach((question) => {
  question.querySelector('summary').addEventListener('click', () => {
    if (question.open) return;
    questions.forEach((other) => {
      if (other !== question) other.open = false;
    });
  });
});

// Os ícones acompanham rótulos textuais; não duplicar esses rótulos na leitura.
document.querySelectorAll('svg').forEach((icon) => {
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('focusable', 'false');
});
