'use strict';

// The same zero-dependency Web Audio approach used by Games 1 and 3.
const AudioController = {
  ctx: null,
  master: null,
  soundEnabled: true,
  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.soundEnabled ? 1 : 0;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    } catch { /* Audio support must not block the game. */ }
  },
  tone(from, to, duration, delay = 0, volume = 0.1, type = 'sine') {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx || !this.master) return;
    try {
      const now = this.ctx.currentTime + delay;
      const oscillator = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(from, now);
      oscillator.frequency.exponentialRampToValueAtTime(to, now + duration);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch { /* Continue silently when audio is unavailable. */ }
  },
  playSelect() { this.tone(650, 880, 0.12); },
  playConveyor() {
    this.tone(180, 75, 0.85, 0, 0.045, 'triangle');
    this.tone(320, 620, 0.6, 0.2, 0.025, 'sine');
  },
  playVictory() {
    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      this.tone(frequency, frequency, 0.35, index * 0.13, 0.12);
    });
  },
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.init();
    if (this.master) this.master.gain.setValueAtTime(this.soundEnabled ? 1 : 0, this.ctx.currentTime);
    document.getElementById('sound-icon').textContent = this.soundEnabled ? '🔊' : '🔇';
    const button = document.getElementById('btn-sound-toggle');
    button.title = this.soundEnabled ? 'Suara: Aktif' : 'Suara: Nonaktif';
    button.setAttribute('aria-pressed', String(this.soundEnabled));
    if (this.soundEnabled) this.playSelect();
  }
};

const asset = number => `img/game-2/semak (${number}) 1.png`;
const processes = {
  organic: {
    title: 'Proses Daur Ulang Sampah Organik',
    steps: [
      { label: 'Pengumpulan', text: 'Sampah organik dikumpulkan dari sisa makanan, tanaman, dan daun.', image: asset(6) },
      { label: 'Pemilahan', text: 'Pisahkan sisa organik dari plastik, logam, dan bahan lain yang tidak dapat terurai.', image: asset(7) },
      { label: 'Pencacahan', text: 'Sampah organik dipotong menjadi bagian kecil agar lebih cepat terurai.', image: asset(5) },
      { label: 'Pengomposan', text: 'Dengan kelembapan dan udara yang cukup, bahan organik terurai menjadi kompos untuk menyuburkan tanaman.', image: asset(8) }
    ]
  },
  plastic: {
    title: 'Proses Daur Ulang Sampah Plastik',
    steps: [
      { label: 'Pengumpulan', text: 'Botol dan kemasan plastik dikumpulkan untuk diolah kembali.', image: asset(9) },
      { label: 'Pemilahan', text: 'Plastik dipilah berdasarkan jenisnya. Pisahkan plastik yang dapat didaur ulang dari yang tidak dapat didaur ulang.', image: asset(10) },
      { label: 'Pencucian', text: 'Plastik dicuci sampai bersih untuk menghilangkan sisa makanan, kotoran, dan bahan yang menempel.', image: asset(11) },
      { label: 'Pencacahan', text: 'Plastik yang sudah bersih dicacah menjadi potongan kecil agar mudah diolah.', image: asset(12) },
      { label: 'Pelelehan', text: 'Di fasilitas pengolahan, cacahan plastik dipanaskan dengan suhu terkontrol untuk proses pencetakan.', image: asset(13) },
      { label: 'Produk baru', text: 'Plastik diolah dan dicetak menjadi produk baru, seperti bahan bangunan yang dapat digunakan kembali.', image: asset(14) }
    ]
  },
  paper: {
    title: 'Proses Daur Ulang Sampah Kertas',
    steps: [
      { label: 'Pengumpulan', text: 'Kertas, kardus, dan buku bekas dikumpulkan untuk didaur ulang.', image: asset(15) },
      { label: 'Pemilahan', text: 'Pisahkan kertas bersih dari kertas yang berminyak, berlapis plastik, atau tercampur sampah lain.', image: asset(10) },
      { label: 'Pencacahan', text: 'Kertas dipotong menjadi bagian kecil untuk memudahkan proses pembuatan bubur kertas.', image: asset(16) },
      { label: 'Pembuatan pulp', text: 'Potongan kertas dicampur dengan air hingga menjadi pulp atau bubur kertas.', image: asset(17) },
      { label: 'Pencetakan dan pengeringan', text: 'Pulp dicetak, ditekan, dan dikeringkan menjadi lembaran kertas baru yang siap digunakan.', image: asset(18) }
    ]
  }
};

const menu = document.getElementById('category-screen');
const screen = document.getElementById('process-screen');
const title = document.getElementById('process-title');
const description = document.getElementById('step-description');
const label = document.getElementById('step-label');
const stage = document.getElementById('step-stage');
const nextButton = document.getElementById('next-button');
const menuButton = document.getElementById('menu-button');
const progress = document.getElementById('progress');
let activeCategory = null;
let currentStep = 0;
let isAnimating = false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const wait = ms => new Promise(resolve => setTimeout(resolve, reducedMotion.matches ? 0 : ms));
const nextFrame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const conveyorDuration = 1000;
stage.style.setProperty('--conveyor-duration', `${conveyorDuration}ms`);

// Load every illustration before its transition so slow image loading cannot cause a blank step.
for (const process of Object.values(processes)) {
  for (const step of process.steps) { const image = new Image(); image.src = step.image; }
}

function lockControls(locked) {
  isAnimating = locked;
  nextButton.disabled = locked;
  menuButton.disabled = locked;
  screen.setAttribute('aria-busy', String(locked));
}

function createStepImage(step, className) {
  const image = document.createElement('img');
  image.src = step.image;
  image.alt = step.label;
  image.className = `step-image ${className}`;
  return image;
}

function renderStepText() {
  const steps = processes[activeCategory].steps;
  const step = steps[currentStep];
  label.textContent = `TAHAP ${currentStep + 1} / ${steps.length} · ${step.label}`;
  description.textContent = step.text;
  progress.replaceChildren(...steps.map((_, index) => {
    const dot = document.createElement('span');
    dot.className = `dot ${index === currentStep ? 'active' : index < currentStep ? 'done' : ''}`;
    return dot;
  }));
}

async function startProcess(category) {
  if (isAnimating || !processes[category]) return;
  AudioController.playSelect();
  lockControls(true);
  activeCategory = category;
  currentStep = 0;
  menu.classList.add('leaving');
  await wait(250);
  menu.hidden = true;
  menu.classList.remove('leaving');
  title.textContent = processes[category].title;
  renderStepText();
  stage.replaceChildren(createStepImage(processes[category].steps[0], 'enter-from-left'));
  screen.hidden = false;
  await nextFrame();
  stage.firstElementChild.className = 'step-image center';
  title.focus({ preventScroll: true });
  await wait(conveyorDuration);
  lockControls(false);
}

async function animateStepChange(next) {
  const oldImage = stage.firstElementChild;
  const newImage = createStepImage(next, 'enter-from-left');
  stage.appendChild(newImage);
  description.classList.add('fade-out');
  await nextFrame();
  oldImage.className = 'step-image exit-to-right';
  AudioController.playConveyor();
  await wait(220);
  newImage.className = 'step-image center';
  await wait(100);
  currentStep++;
  renderStepText();
  description.classList.remove('fade-out');
  description.classList.add('fade-in');
  await wait(conveyorDuration - 100);
  oldImage.remove();
  description.classList.remove('fade-in');
}

async function showCategoryMenu() {
  screen.classList.add('leaving');
  if (stage.firstElementChild) stage.firstElementChild.className = 'step-image exit-to-right';
  await wait(conveyorDuration);
  screen.hidden = true;
  screen.classList.remove('leaving');
  stage.replaceChildren();
  activeCategory = null;
  currentStep = 0;
  menu.classList.add('leaving');
  menu.hidden = false;
  await nextFrame();
  menu.classList.remove('leaving');
  document.getElementById('menu-title').focus({ preventScroll: true });
  await wait(300);
  lockControls(false);
}

async function goToNextStep() {
  if (isAnimating || !activeCategory) return;
  lockControls(true);
  const steps = processes[activeCategory].steps;
  if (currentStep === steps.length - 1) {
    AudioController.playVictory();
    await showCategoryMenu();
    return;
  }
  await animateStepChange(steps[currentStep + 1]);
  lockControls(false);
}

document.querySelectorAll('[data-category]').forEach(button => {
  button.addEventListener('click', () => startProcess(button.dataset.category));
});
nextButton.addEventListener('click', goToNextStep);
menuButton.addEventListener('click', () => {
  if (isAnimating || !activeCategory) return;
  AudioController.playSelect();
  lockControls(true);
  showCategoryMenu();
});
document.getElementById('btn-sound-toggle').addEventListener('click', () => AudioController.toggleSound());
