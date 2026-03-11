/* ══════════════════════════════════════════════
   EQ.JS EQ bar animation + overlay panel
   IUS DRRP
══════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── EQ band targets and current values ──
  const BANDS = 10;
  const bands = {
    player: Array(BANDS).fill(0),
    record: Array(BANDS).fill(0),
  };
  const targets = {
    player: Array(BANDS).fill(0),
    record: Array(BANDS).fill(0),
  };

  // Shape presets (amplitude multiplier per band)
  const SHAPES = {
    music:  [0.7, 0.6, 0.5, 0.65, 0.8, 0.75, 0.7, 0.6, 0.45, 0.3],
    bass:   [0.95, 0.9, 0.75, 0.5, 0.35, 0.25, 0.2, 0.15, 0.1, 0.08],
    vocal:  [0.2, 0.3, 0.55, 0.85, 0.95, 0.9, 0.8, 0.5, 0.3, 0.15],
    flat:   Array(BANDS).fill(0.5),
    record: [0.6, 0.65, 0.7, 0.75, 0.72, 0.68, 0.6, 0.5, 0.4, 0.3],
  };

  let currentShape = 'music';
  let isPlaying = false;
  let isRecording = false;
  let rafId = null;

  // Get bar elements
  const playerBars = document.querySelectorAll('#eqBars .eq-bar');
  const recordBars = document.querySelectorAll('#eqBarsRec .eq-bar');

  function randomTarget(baseShape) {
    return baseShape.map(base =>
      Math.max(0.02, Math.min(1, base + (Math.random() - 0.5) * 0.6))
    );
  }

  let targetUpdateTimer = 0;

  function animate(ts) {
    rafId = requestAnimationFrame(animate);

    // Update targets every ~100ms
    targetUpdateTimer += 16;
    if (targetUpdateTimer > 100) {
      targetUpdateTimer = 0;
      if (isPlaying)    targets.player = randomTarget(SHAPES[currentShape]);
      if (isRecording)  targets.record = randomTarget(SHAPES.record);
    }

    const speed = 0.15;

    // Player EQ
    playerBars.forEach((bar, i) => {
      if (isPlaying) {
        bands.player[i] += (targets.player[i] - bands.player[i]) * speed;
      } else {
        bands.player[i] += (0 - bands.player[i]) * speed;
      }
      const h = Math.max(4, Math.round(bands.player[i] * 80));
      bar.style.height = h + 'px';
    });

    // Record EQ
    recordBars.forEach((bar, i) => {
      if (isRecording) {
        bands.record[i] += (targets.record[i] - bands.record[i]) * speed;
      } else {
        bands.record[i] += (0 - bands.record[i]) * speed;
      }
      const h = Math.max(4, Math.round(bands.record[i] * 80));
      bar.style.height = h + 'px';
    });
  }

  rafId = requestAnimationFrame(animate);

  // ── EQ Overlay ──
  const eqBands = [
    { label: '60Hz', default: 0 },
    { label: '170Hz', default: 0 },
    { label: '310Hz', default: 0 },
    { label: '600Hz', default: 0 },
    { label: '1kHz', default: 0 },
    { label: '3kHz', default: 0 },
    { label: '6kHz', default: 0 },
    { label: '12kHz', default: 0 },
    { label: '14kHz', default: 0 },
    { label: '16kHz', default: 0 },
  ];

  const eqControls = document.getElementById('eqControls');

  eqBands.forEach((band, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'eq-slider-wrap';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = -12;
    slider.max = 12;
    slider.step = 1;
    slider.value = band.default;
    slider.id = 'eq_band_' + i;

    const label = document.createElement('div');
    label.className = 'eq-slider-label';
    label.textContent = band.label;

    wrap.appendChild(slider);
    wrap.appendChild(label);
    eqControls.appendChild(wrap);
  });

  // Preset buttons
  const presetData = {
    flat:  Array(10).fill(0),
    bass:  [8, 6, 4, 2, 0, -2, -2, -3, -3, -4],
    vocal: [-3, -2, 0, 4, 6, 5, 3, 0, -2, -3],
    air:   [-2, -1, 0, 0, 2, 3, 5, 7, 8, 9],
    warm:  [4, 3, 2, 1, 0, -1, -2, -2, -3, -3],
  };

  document.querySelectorAll('.eq-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.eq-preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.dataset.preset;
      const vals = presetData[preset] || Array(10).fill(0);
      document.querySelectorAll('#eqControls input').forEach((slider, i) => {
        slider.value = vals[i];
      });

      // Update EQ shape visualization
      if (preset === 'bass') currentShape = 'bass';
      else if (preset === 'vocal') currentShape = 'vocal';
      else currentShape = 'music';
    });
  });

  // EQ panel open/close
  const btnEQ = document.getElementById('btnEQ');
  const eqOverlay = document.getElementById('eqOverlay');
  const eqClose = document.getElementById('eqClose');

  btnEQ.addEventListener('click', () => {
    eqOverlay.classList.toggle('hidden');
    btnEQ.classList.toggle('active');
  });

  eqClose.addEventListener('click', () => {
    eqOverlay.classList.add('hidden');
    btnEQ.classList.remove('active');
  });

  eqOverlay.addEventListener('click', e => {
    if (e.target === eqOverlay) {
      eqOverlay.classList.add('hidden');
      btnEQ.classList.remove('active');
    }
  });

  // ── Public API ──
  window.IUS_EQ = {
    setPlaying(v)   { isPlaying = v; },
    setRecording(v) { isRecording = v; },
    setShape(s)     { currentShape = s; },
  };

})();
