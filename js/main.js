(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const body = document.body;
  const intro = $('#intro');
  const skipIntro = $('#skip-intro');
  const enterWorld = $('#enter-world');
  const menuToggle = $('#menu-toggle');
  const nav = $('#site-nav');
  const progressFill = $('#reading-progress-fill');
  const backToTop = $('#back-to-top');
  const themeToggle = $('#theme-toggle');
  const themeIcon = $('.theme-icon', themeToggle || document);
  const themeLabel = $('.theme-label', themeToggle || document);
  const toast = $('#site-toast');
  const paletteToggle = $('#palette-toggle');
  const paletteNames = ['coral', 'violet', 'aqua', 'amber'];
  let paletteIndex = Math.max(0, paletteNames.indexOf(root.dataset.palette || 'coral'));
  let toastTimer = 0;
  let introTimer = 0;
  let queuedScroll = false;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  function safeStorageGet(storageName, key) {
    try { return window[storageName].getItem(key); } catch (_error) { return null; }
  }
  function safeStorageSet(storageName, key, value) {
    try { window[storageName].setItem(key, value); } catch (_error) { /* Storage can be unavailable for local files or private windows. */ }
  }

  function setTheme(theme, announce = false) {
    const light = theme === 'light';
    root.dataset.theme = light ? 'light' : 'dark';
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(light));
      themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    }
    if (themeIcon) themeIcon.textContent = light ? '☾' : '☼';
    if (themeLabel) themeLabel.textContent = light ? 'DARK' : 'LIGHT';
    const themeColor = $('meta[name="theme-color"]');
    if (themeColor) themeColor.content = light ? '#f4f3f0' : '#090c15';
    safeStorageSet('localStorage', 'myWorldTheme', light ? 'light' : 'dark');
    if (announce) showToast(light ? 'Light theme on — a little more daylight.' : 'Dark theme on — back to the night shift.');
  }

  const savedTheme = safeStorageGet('localStorage', 'myWorldTheme');
  setTheme(savedTheme === 'light' ? 'light' : 'dark');
  themeToggle?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
  });

  function setPalette(name, announce = true) {
    paletteIndex = Math.max(0, paletteNames.indexOf(name));
    root.dataset.palette = paletteNames[paletteIndex];
    safeStorageSet('localStorage', 'myWorldPalette', paletteNames[paletteIndex]);
    paletteToggle?.setAttribute('aria-label', `Change accent palette. Current palette: ${paletteNames[paletteIndex]}`);
    if (announce) showToast(`Accent palette: ${paletteNames[paletteIndex].toUpperCase()} ✦`);
  }
  const savedPalette = safeStorageGet('localStorage', 'myWorldPalette');
  if (savedPalette && paletteNames.includes(savedPalette)) paletteIndex = paletteNames.indexOf(savedPalette);
  setPalette(paletteNames[paletteIndex], false);
  paletteToggle?.addEventListener('click', () => {
    const next = (paletteIndex + 1) % paletteNames.length;
    setPalette(paletteNames[next]);
    paletteToggle.animate?.([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(160deg) scale(1.14)' }, { transform: 'rotate(360deg) scale(1)' }], { duration: reduceMotion ? 1 : 480, easing: 'cubic-bezier(.2,.8,.2,1)' });
  });

  // Pointer-aware color halos let the glow travel with the cursor instead of flashing on.
  const pointerAura = $('#pointer-aura');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover && !reduceMotion) {
    let auraVisible = false;
    document.addEventListener('pointermove', event => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
      if (pointerAura && !auraVisible) {
        pointerAura.style.opacity = '.9';
        auraVisible = true;
      }
      const target = event.target.closest?.('.glow-button, .button, .nav-link, .gallery-item, .post-card, .tag-pill, .filter-chip');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      if (rect.width && rect.height) {
        target.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        target.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
      }
    }, { passive: true });
    document.addEventListener('pointerleave', () => {
      if (pointerAura) pointerAura.style.opacity = '0';
      auraVisible = false;
    });
  }

  // Cinematic welcome sequence: first visit only, always skippable.
  function closeIntro() {
    if (!intro || !intro.classList.contains('is-active') || intro.classList.contains('is-leaving')) return;
    window.clearTimeout(introTimer);
    intro.classList.add('is-leaving');
    intro.setAttribute('aria-hidden', 'true');
    safeStorageSet('sessionStorage', 'myWorldIntroSeen', 'yes');
    window.setTimeout(() => intro.classList.remove('is-active', 'is-leaving'), reduceMotion ? 1 : 860);
  }
  function openIntro(force = false) {
    if (!intro || reduceMotion) {
      showToast('Welcome to MY WORLD · BY AZIJON.');
      return;
    }
    if (!force && safeStorageGet('sessionStorage', 'myWorldIntroSeen') === 'yes') return;
    window.clearTimeout(introTimer);
    intro.classList.remove('is-leaving');
    intro.classList.add('is-active');
    intro.setAttribute('aria-hidden', 'false');
    safeStorageSet('sessionStorage', 'myWorldIntroSeen', 'yes');
    introTimer = window.setTimeout(closeIntro, 6500);
  }
  openIntro();
  skipIntro?.addEventListener('click', closeIntro);
  enterWorld?.addEventListener('click', closeIntro);
  $('#watch-intro')?.addEventListener('click', () => openIntro(true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      closeIntro();
      if ($('#image-viewer')?.open) $('#image-viewer').close();
    }
  });

  // Mobile navigation disclosure.
  function closeMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
    body.classList.remove('menu-open');
  }
  menuToggle?.addEventListener('click', () => {
    const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('is-open', opening);
    body.classList.toggle('menu-open', opening);
  });
  $$('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (nav && menuToggle?.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 880) closeMenu(); }, { passive: true });

  // Quotes and small, useful surprises.
  const thoughts = [
    '“Small steps can take you somewhere unexpected.”',
    '“Make something today that future-you will thank you for.”',
    '“Curiosity is a pretty good place to start.”',
    '“A first version beats a perfect idea that never starts.”',
    '“You do not have to know the whole path to take the next step.”',
    '“Collect ideas. Keep the useful ones. Try the interesting ones.”',
    '“Good things grow when you give them a little attention.”'
  ];
  let thoughtIndex = 0;
  const heroQuote = $('#hero-quote');
  function updateThought(index = null, announce = false) {
    if (!heroQuote) return;
    thoughtIndex = index === null ? (thoughtIndex + 1 + Math.floor(Math.random() * (thoughts.length - 1))) % thoughts.length : index % thoughts.length;
    heroQuote.classList.remove('quote-change');
    void heroQuote.offsetWidth;
    heroQuote.textContent = thoughts[thoughtIndex];
    heroQuote.classList.add('quote-change');
    if (announce) showToast('A fresh thought, just for this visit. ✦');
  }
  $('#new-quote')?.addEventListener('click', () => updateThought(null, true));
  $('#copy-project-note')?.addEventListener('click', () => {
    updateThought(null, false);
    showToast('Project note saved to the inspiration card.');
  });

  const liveClock = $('#live-clock');
  const liveDate = $('#live-date');
  function updateClock() {
    const now = new Date();
    if (liveClock) liveClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (liveDate) liveDate.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  }
  updateClock();
  window.setInterval(updateClock, 60_000);
  const footerYear = $('#footer-year');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

  // Switch the visual sound-wave motif on/off. No audio is played.
  const vibeToggle = $('#vibe-toggle');
  const vibeLabel = $('#vibe-label');
  vibeToggle?.addEventListener('click', () => {
    const active = !body.classList.contains('vibe-active');
    body.classList.toggle('vibe-active', active);
    vibeToggle.setAttribute('aria-pressed', String(active));
    if (vibeLabel) vibeLabel.textContent = active ? 'VISUAL VIBE / ON' : 'VISUAL VIBE / OFF';
    showToast(active ? 'Visualizer active — just animation, no audio.' : 'Visualizer paused. Enjoy the quiet.');
  });

  // Story filters really change which cards are visible.
  const filterChips = $$('.filter-chip');
  const postCards = $$('.post-card[data-category]');
  const filterEmpty = $('#filter-empty');
  filterChips.forEach(chip => chip.addEventListener('click', () => {
    const category = chip.dataset.filter || 'all';
    let visibleCount = 0;
    filterChips.forEach(item => {
      const selected = item === chip;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    postCards.forEach(card => {
      const visible = category === 'all' || card.dataset.category === category;
      card.hidden = !visible;
      if (visible) visibleCount++;
    });
    if (filterEmpty) filterEmpty.hidden = visibleCount !== 0;
    showToast(category === 'all' ? 'Showing every story.' : `Showing ${category} stories.`);
  }));

  // Clickable project tags change the lead thought and explain their theme.
  $$('[data-project-note]').forEach(button => button.addEventListener('click', () => {
    const message = button.dataset.projectNote || 'Keep exploring.';
    if (heroQuote) heroQuote.textContent = `“${message}”`;
    showToast(message);
  }));

  const inspirations = [
    'Try one tiny version of the idea instead of waiting for the perfect moment.',
    'Take a different route today. Fresh input can spark a fresh idea.',
    'Make a little thing just because it seems interesting.',
    'A short break is part of the creative process, not the opposite of it.',
    'Keep the part that works. Learn from the part that does not.'
  ];
  $('#mood-button')?.addEventListener('click', () => {
    const output = $('#mood-result');
    if (output) {
      const next = Math.floor(Math.random() * inspirations.length);
      output.classList.remove('quote-change');
      void output.offsetWidth;
      output.textContent = inspirations[next];
      output.classList.add('quote-change');
    }
  });

  const questions = [
    'What is one small problem you would love to make easier?',
    'What would your dream creative workspace look like?',
    'What is something new you would like to learn this month?',
    'Which everyday thing could be redesigned to work better?',
    'What would you build if you had one free weekend?'
  ];
  $('#question-button')?.addEventListener('click', () => {
    const output = $('#question-result');
    if (!output) return;
    const current = output.textContent;
    let next = questions[Math.floor(Math.random() * questions.length)];
    if (questions.length > 1) while (next === current) next = questions[Math.floor(Math.random() * questions.length)];
    output.textContent = next;
    output.classList.remove('quote-change');
    void output.offsetWidth;
    output.classList.add('quote-change');
  });

  // A visual gallery lightbox with functional next/previous controls.
  const viewer = $('#image-viewer');
  const viewerImage = $('#viewer-image');
  const viewerCaption = $('#viewer-caption');
  const galleryButtons = $$('.gallery-item[data-image]');
  let viewerIndex = 0;
  function showViewerImage(index) {
    if (!galleryButtons.length || !viewerImage || !viewerCaption) return;
    viewerIndex = (index + galleryButtons.length) % galleryButtons.length;
    const item = galleryButtons[viewerIndex];
    viewerImage.src = item.dataset.image;
    viewerImage.alt = $('img', item)?.alt || '';
    viewerCaption.textContent = item.dataset.caption || '';
    if (!viewer.open) viewer.showModal();
  }
  galleryButtons.forEach((item, index) => item.addEventListener('click', () => showViewerImage(index)));
  $('#viewer-prev')?.addEventListener('click', () => showViewerImage(viewerIndex - 1));
  $('#viewer-next')?.addEventListener('click', () => showViewerImage(viewerIndex + 1));
  viewer?.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  document.addEventListener('keydown', event => {
    if (!viewer?.open) return;
    if (event.key === 'ArrowRight') showViewerImage(viewerIndex + 1);
    if (event.key === 'ArrowLeft') showViewerImage(viewerIndex - 1);
  });

  // Shuffle moves the actual gallery elements, not just their labels.
  $('#shuffle-gallery')?.addEventListener('click', () => {
    const grid = $('.gallery-grid');
    if (!grid) return;
    const items = $$('.gallery-item', grid);
    const shuffled = [...items].sort(() => Math.random() - .5);
    grid.classList.add('is-shuffling');
    shuffled.forEach(item => grid.append(item));
    window.setTimeout(() => grid.classList.remove('is-shuffling'), reduceMotion ? 1 : 500);
    showToast('Gallery shuffled. A different view of the same world.');
  });

  // Copy action works on hosted sites and attempts the local-file URL where supported.
  async function copyText(value) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        showToast('Copied to clipboard. ✦');
        return;
      }
      const temporary = document.createElement('textarea');
      temporary.value = value;
      temporary.setAttribute('readonly', '');
      temporary.style.position = 'fixed';
      temporary.style.opacity = '0';
      document.body.append(temporary);
      temporary.select();
      const copied = document.execCommand('copy');
      temporary.remove();
      showToast(copied ? 'Copied to clipboard. ✦' : `Copy this address: ${value}`);
    } catch (_error) {
      showToast(`Copy this address: ${value}`);
    }
  }
  $('#copy-site-link')?.addEventListener('click', () => copyText(window.location.href));

  // Focus / quiet mode.
  const focusToggle = $('#focus-toggle');
  focusToggle?.addEventListener('click', () => {
    const active = !body.classList.contains('focus-mode');
    body.classList.toggle('focus-mode', active);
    focusToggle.setAttribute('aria-pressed', String(active));
    focusToggle.innerHTML = active ? 'Exit quiet mode <span aria-hidden="true">◉</span>' : 'Quiet mode <span aria-hidden="true">◌</span>';
    showToast(active ? 'Quiet mode on. Less motion, more focus.' : 'Back to the full experience.');
  });

  // Remember whether the closing note is saved during this session.
  const saveNote = $('#save-note');
  saveNote?.addEventListener('click', () => {
    const saved = saveNote.getAttribute('aria-pressed') !== 'true';
    saveNote.setAttribute('aria-pressed', String(saved));
    saveNote.textContent = saved ? '♥' : '♡';
    saveNote.classList.toggle('is-saved', saved);
    safeStorageSet('sessionStorage', 'myWorldNoteSaved', saved ? 'yes' : 'no');
    showToast(saved ? 'Note saved for this visit. ♥' : 'Note removed from saved items.');
  });
  if (safeStorageGet('sessionStorage', 'myWorldNoteSaved') === 'yes' && saveNote) {
    saveNote.setAttribute('aria-pressed', 'true');
    saveNote.textContent = '♥';
    saveNote.classList.add('is-saved');
  }

  $('#randomize-vibe')?.addEventListener('click', () => {
    const next = paletteNames[(paletteIndex + 1) % paletteNames.length];
    setPalette(next, false);
    updateThought(null, false);
    body.classList.add('vibe-active');
    vibeToggle?.setAttribute('aria-pressed', 'true');
    if (vibeLabel) vibeLabel.textContent = 'VISUAL VIBE / ON';
    showToast(`New visual vibe: ${next.toUpperCase()} ✦`);
  });

  $('#motion-toggle')?.addEventListener('click', event => {
    const button = event.currentTarget;
    const paused = !root.classList.contains('motion-paused');
    root.classList.toggle('motion-paused', paused);
    button.setAttribute('aria-pressed', String(paused));
    button.innerHTML = paused ? 'Motion: paused <span aria-hidden="true">Ⅱ</span>' : 'Motion: on <span aria-hidden="true">◌</span>';
    showToast(paused ? 'Motion paused. The site stays fully usable.' : 'Motion resumed.');
  });

  function revealSecret() {
    body.classList.add('secret-glow', 'vibe-active');
    window.setTimeout(() => body.classList.remove('secret-glow'), 4200);
    const next = paletteNames[(paletteIndex + 1) % paletteNames.length];
    setPalette(next, false);
    updateThought(null, false);
    showToast('SECRET FOUND ✦ You found the backstage mood switch.');
  }
  $('#easter-toggle')?.addEventListener('click', revealSecret);
  let secretKeys = '';
  document.addEventListener('keydown', event => {
    if (event.key.length === 1 && /[a-z]/i.test(event.key) && !event.target.matches('input,textarea,[contenteditable="true"]')) {
      secretKeys = (secretKeys + event.key.toLowerCase()).slice(-3);
      if (secretKeys === 'azi') {
        revealSecret();
        secretKeys = '';
      }
    }
  });

  // Subtle card tilt on desktop; reset on leave so normal hover states still work.
  if (supportsHover && !reduceMotion) {
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        const max = card.classList.contains('post-card') ? 3 : 2.7;
        card.style.transform = `perspective(1100px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Reveal content progressively only when the browser supports it.
  const revealItems = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('js-motion');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -28px 0px' });
    revealItems.forEach(el => revealObserver.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }

  const navLinks = $$('.nav-link');
  const navigationTargets = navLinks.map(link => ({ element: $(link.getAttribute('href')), link })).filter(item => item.element);
  function updateScrollUI() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0;
    if (progressFill) progressFill.style.width = `${percent}%`;
    backToTop?.classList.toggle('is-visible', window.scrollY > 650);
    const marker = window.scrollY + Math.min(240, window.innerHeight * .25);
    let active = navigationTargets[0];
    navigationTargets.forEach(item => {
      if (item.element.getBoundingClientRect().top + window.scrollY <= marker) active = item;
    });
    navLinks.forEach(link => link.classList.toggle('is-active', link === active?.link));
    queuedScroll = false;
  }
  window.addEventListener('scroll', () => {
    if (!queuedScroll) {
      window.requestAnimationFrame(updateScrollUI);
      queuedScroll = true;
    }
  }, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion || root.classList.contains('motion-paused') ? 'auto' : 'smooth' }));
  updateScrollUI();
})();
