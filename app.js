window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const frameCount = 136;
const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');
const frames = [];
const framePath = (index) => `frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;
let currentFrame = 0;

function sizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawFrame(currentFrame);
}
function drawFrame(index) {
  const image = frames[index];
  if (!image || !image.complete) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.clearRect(0, 0, width, height);
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}
for (let i = 1; i <= frameCount; i += 1) {
  const image = new Image();
  image.src = framePath(i);
  image.onload = () => { if (i === 1) drawFrame(0); };
  frames.push(image);
}
window.addEventListener('resize', sizeCanvas);
sizeCanvas();

window.addEventListener('load', () => {
  document.querySelector('.loader').classList.add('done');
  if (!window.gsap) return;
  document.documentElement.classList.add('motion-ready');
  gsap.registerPlugin(ScrollTrigger);
  const heroScroll = gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.8 }
  });
  heroScroll.to({ frame: 0 }, {
    frame: frameCount - 1,
    duration: 1,
    ease: 'none',
    snap: 'frame',
    onUpdate() { currentFrame = Math.round(this.targets()[0].frame); drawFrame(currentFrame); }
  }, 0);
  heroScroll.to('.hero-copy', { autoAlpha: 0, y: -48, duration: 0.14, ease: 'none' }, 0.02);
  gsap.utils.toArray('.hero-feature').forEach((feature, index) => {
    const entry = feature.dataset.from;
    heroScroll.fromTo(feature, {
      autoAlpha: 0,
      x: entry === 'left' ? -42 : entry === 'right' ? 42 : 0,
      y: entry === 'up' ? 20 : 0
    }, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      duration: 0.09,
      ease: 'none'
    }, 0.11 + index * 0.12);
  });
  heroScroll.fromTo('.hero-explore', { autoAlpha: 0, y: 18 }, {
    autoAlpha: 1,
    y: 0,
    duration: 0.08,
    ease: 'none'
  }, 0.9);
  gsap.utils.toArray('.reveal').forEach((element, index) => {
    gsap.to(element, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: index % 3 * 0.08, scrollTrigger: { trigger: element, start: 'top 84%' } });
  });
  gsap.from('.hero-copy > *', { opacity: 0, y: 20, duration: 1.1, stagger: 0.12, delay: 0.35, ease: 'power3.out' });
  ScrollTrigger.refresh();
});

const bookingForm = document.querySelector('.booking-form');
const bookingDate = bookingForm.elements.date;
const today = new Date();
bookingDate.min = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const confirmation = bookingForm.querySelector('.form-success');
  bookingForm.reset();
  confirmation.hidden = false;
  confirmation.classList.add('show');
});

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.desktop-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  navigation.classList.remove('is-open');
}));

const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');
const updateHeader = () => header.classList.toggle('is-scrolled', hero.getBoundingClientRect().bottom <= 0);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
