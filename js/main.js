/* ══════════════════════════════════════════════
   MAIN.JS App orchestration + mode switching
   IUS DRRP
══════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── Mode management ──
  const MODES = ['player', 'radio', 'record'];
  let currentMode = 'player';
  let isRecording = false;
  let recTimer = null;
  let recElapsed = 0;

  // Mode view elements (left display)
  const leftViews = {
    player: document.getElementById('playerArt'),
    radio:  document.getElementById('radioArt'),
    record: document.getElementById('recordArt'),
  };

  // Mode view elements (right display)
  const rightViews = {
    player: document.getElementById('playerTrack'),
    radio:  document.getElementById('radioTrack'),
    record: document.getElementById('recordTrack'),
  };

  const modeBtns = {
    player: document.getElementById('btnPlayer'),
    radio:  document.getElementById('btnRadio'),
    record: document.getElementById('btnRecord'),
  };

  const recDot   = document.getElementById('recDot');
  const batDot   = document.getElementById('batDot');
  const recTime  = document.getElementById('recTime');
  const vuLeft   = document.getElementById('vuLeft');
  const vuRight  = document.getElementById('vuRight');

  function fmt(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function switchMode(mode) {
    if (!MODES.includes(mode)) return;

    // Hide all views
    Object.values(leftViews).forEach(v  => v.classList.add('hidden'));
    Object.values(rightViews).forEach(v => v.classList.add('hidden'));
    Object.values(modeBtns).forEach(b   => b.classList.remove('active'));

    // Show target views
    leftViews[mode].classList.remove('hidden');
    rightViews[mode].classList.remove('hidden');
    modeBtns[mode] && modeBtns[mode].classList.add('active');

    // Mode transitions
    const prevMode = currentMode;
    currentMode = mode;

    // Player exit
    if (prevMode === 'player') {
      // keep player running in background
    }

    // Radio mode
    if (mode === 'radio') {
      window.IUS_Radio && IUS_Radio.start();
      // Radio uses the tune knob for scanning
    } else {
      window.IUS_Radio && IUS_Radio.stop();
    }

    // Record mode
    if (mode === 'record') {
      startRecording();
    } else {
      stopRecording();
    }
  }

  function startRecording() {
    if (isRecording) return;
    isRecording = true;
    recElapsed = 0;
    recDot.classList.add('active');
    window.IUS_EQ && IUS_EQ.setRecording(true);
    vuLeft.classList.add('active');
    vuRight.classList.add('active');

    recTimer = setInterval(() => {
      recElapsed++;
      recTime.textContent = fmt(recElapsed);
    }, 1000);
  }

  function stopRecording() {
    if (!isRecording) return;
    isRecording = false;
    recDot.classList.remove('active');
    window.IUS_EQ && IUS_EQ.setRecording(false);
    vuLeft.classList.remove('active');
    vuRight.classList.remove('active');
    clearInterval(recTimer);
    recTimer = null;
  }

  // Mode buttons
  document.getElementById('btnPlayer').addEventListener('click', () => switchMode('player'));
  document.getElementById('btnRadio').addEventListener('click',  () => switchMode('radio'));
  document.getElementById('btnRecord').addEventListener('click', () => switchMode('record'));

  // Radio scan with prev/next buttons in radio mode
  document.getElementById('btnPrev').addEventListener('click', () => {
    if (currentMode === 'radio') IUS_Radio.scanPrev();
  });
  document.getElementById('btnNext').addEventListener('click', () => {
    if (currentMode === 'radio') IUS_Radio.scanNext();
  });

  // ── Volume / Tune API bridge ──
  window.IUS = {
    get mode() { return currentMode; },

    setVolume(val) {
      // 0-100
      const pct = Math.max(0, Math.min(100, val));
      document.getElementById('volFill').style.width = pct + '%';
      document.getElementById('volVal').textContent  = pct;
    },

    setTune(normalized) {
      if (currentMode === 'radio') {
        window.IUS_Radio && IUS_Radio.tune(normalized);
      }
      // In player mode, tune knob = seek (optional)
    },
  };

  // ── Battery status dot (always on in prototype) ──
  batDot.classList.add('active');

  // ── Keyboard shortcuts ──
  document.addEventListener('keydown', e => {
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        if (currentMode === 'player') {
          window.IUS_Player.isPlaying()
            ? IUS_Player.pause()
            : IUS_Player.play();
        }
        break;
      case 'ArrowRight':
        if (currentMode === 'radio') IUS_Radio.scanNext();
        break;
      case 'ArrowLeft':
        if (currentMode === 'radio') IUS_Radio.scanPrev();
        break;
      case 'KeyP':
        switchMode('player');
        break;
      case 'KeyR':
        switchMode('radio');
        break;
      case 'KeyD':
        switchMode('record');
        break;
      case 'Escape':
        document.getElementById('eqOverlay').classList.add('hidden');
        document.getElementById('btnEQ').classList.remove('active');
        break;
    }
  });

  // ── Init startup sequence ──
  (function startup() {
    // Flash status dots on boot
    setTimeout(() => recDot.classList.add('active'),  200);
    setTimeout(() => batDot.classList.add('active'),  400);
    setTimeout(() => document.getElementById('sigDot').classList.add('active'), 600);
    setTimeout(() => {
      recDot.classList.remove('active');
      document.getElementById('sigDot').classList.remove('active');
    }, 1200);

    // Start player mode
    setTimeout(() => {
      switchMode('player');
      IUS_Player.play();
    }, 800);
  })();

})();
