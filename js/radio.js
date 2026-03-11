/* ══════════════════════════════════════════════
   RADIO.JS FM/DAB radio simulation
   IUS DRRP
══════════════════════════════════════════════ */

(function() {
  'use strict';

  const PRESETS = [
    { freq: 88.6,  band: 'FM', name: 'BBC Radio 2',    now: 'Elbow One Day Like This' },
    { freq: 97.3,  band: 'FM', name: 'BBC Radio 1',    now: 'FKA twigs Cellophane' },
    { freq: 102.5, band: 'FM', name: 'BBC Radio 6',    now: 'Florence + The Machine' },
    { freq: 105.4, band: 'FM', name: 'Jazz FM',        now: 'Miles Davis Kind of Blue' },
    { freq: 107.1, band: 'DAB', name: 'BBC 6 Music HD', now: 'Portishead Glory Box' },
  ];

  let currentPreset = 2;
  let isScanning = false;
  let scanTimer = null;
  let clockTimer = null;

  // DOM refs
  const radioFreq     = document.getElementById('radioFreq');
  const radioBand     = document.getElementById('radioBand');
  const radioRds      = document.getElementById('radioRds');
  const radioTime     = document.getElementById('radioTime');
  const radioStation  = document.getElementById('radioStation');
  const radioNow      = document.getElementById('radioNow');
  const radioSong     = document.getElementById('radioSong');
  const scanFill      = document.getElementById('scanFill');
  const scanFreqLabel = document.getElementById('scanFreqLabel');
  const sigDot        = document.getElementById('sigDot');

  function freqToScanPct(freq) {
    // FM range 87.5 - 108.0
    return ((freq - 87.5) / (108.0 - 87.5)) * 100;
  }

  function loadPreset(idx) {
    currentPreset = (idx + PRESETS.length) % PRESETS.length;
    const p = PRESETS[currentPreset];

    radioFreq.textContent    = p.freq.toFixed(1);
    radioBand.textContent    = p.band;
    radioRds.textContent     = p.name;
    radioStation.textContent = p.name;
    radioNow.textContent     = 'Now Playing';
    radioSong.textContent    = p.now;

    const pct = freqToScanPct(p.freq);
    scanFill.style.width       = pct + '%';
    scanFreqLabel.textContent  = p.freq.toFixed(1);

    // Update preset dots
    document.querySelectorAll('.preset-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentPreset);
    });

    // Signal: simulate strength
    const sigBars = document.querySelectorAll('.sig-bar');
    const strength = p.band === 'DAB' ? 4 : 5;
    sigBars.forEach((bar, i) => {
      bar.style.background = i < strength
        ? 'var(--oled-green)'
        : 'rgba(255,255,255,0.1)';
      bar.style.boxShadow = i < strength ? '0 0 4px var(--oled-green)' : 'none';
    });
  }

  function startClock() {
    if (clockTimer) return;
    function tick() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      radioTime.textContent = h + ':' + m;
    }
    tick();
    clockTimer = setInterval(tick, 10000);
  }

  function stopClock() {
    clearInterval(clockTimer);
    clockTimer = null;
    radioTime.textContent = '--:--';
  }

  function simulateScan(direction) {
    if (isScanning) return;
    isScanning = true;

    // Animate a sweep
    const target = currentPreset + direction;
    let steps = 0;
    const maxSteps = 30;
    const startFreq = PRESETS[currentPreset].freq;
    const endPreset = (target + PRESETS.length) % PRESETS.length;
    const endFreq = PRESETS[endPreset].freq;

    scanTimer = setInterval(() => {
      steps++;
      const t = steps / maxSteps;
      const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      const freq = startFreq + (endFreq - startFreq) * eased;
      const pct = freqToScanPct(freq);

      scanFill.style.width      = pct + '%';
      scanFreqLabel.textContent = freq.toFixed(1);
      radioFreq.textContent     = freq.toFixed(1);

      if (steps >= maxSteps) {
        clearInterval(scanTimer);
        isScanning = false;
        loadPreset(endPreset);
      }
    }, 30);
  }

  // Preset dot click
  document.querySelectorAll('.preset-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (window.IUS && IUS.mode === 'radio') loadPreset(i);
    });
  });

  // Init
  loadPreset(currentPreset);

  // ── Public API ──
  window.IUS_Radio = {
    start() {
      loadPreset(currentPreset);
      startClock();
      sigDot.classList.add('active');
    },
    stop() {
      stopClock();
      sigDot.classList.remove('active');
    },
    scanNext()  { simulateScan(+1); },
    scanPrev()  { simulateScan(-1); },
    tune(normalized) {
      // Tune knob: map 0..1 to 87.5..108.0
      const freq = 87.5 + normalized * 20.5;
      // Snap to nearest preset
      let closest = 0;
      let minDist = Infinity;
      PRESETS.forEach((p, i) => {
        const d = Math.abs(p.freq - freq);
        if (d < minDist) { minDist = d; closest = i; }
      });
      if (minDist < 1.5 && closest !== currentPreset) {
        loadPreset(closest);
      } else {
        // Just update frequency display without locking
        radioFreq.textContent = freq.toFixed(1);
        const pct = freqToScanPct(freq);
        scanFill.style.width = pct + '%';
        scanFreqLabel.textContent = freq.toFixed(1);
      }
    },
  };

})();
