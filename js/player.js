/* ══════════════════════════════════════════════
   PLAYER.JS Playback simulation
   IUS DRRP
══════════════════════════════════════════════ */

(function() {
  'use strict';

  const TRACKS = [
    { artist: 'IUS',          title: 'Track 01',           duration: 243, format: 'Hi-Res', spec: '49/32' },
    { artist: 'IUS',          title: 'Prototype Alpha',    duration: 318, format: 'FLAC',   spec: '24/48' },
    { artist: 'Field Session',title: 'Morning Recording',  duration: 412, format: 'FLAC',   spec: '24/48' },
    { artist: 'IUS',          title: 'Track 04',           duration: 3817, format: 'Hi-Res', spec: '49/32' },
    { artist: 'Aux Line In',  title: 'Session A Take 2', duration: 187, format: 'FLAC',   spec: '16/44' },
    { artist: 'IUS',          title: 'Headphone Test',     duration: 527, format: 'LOSSLESS', spec: '32/96' },
  ];

  let currentTrack = 3; // start at track 4
  let elapsed = 0;      // seconds
  let isPlaying = false;
  let tickInterval = null;

  // DOM refs
  const trackArtist  = document.getElementById('trackArtist');
  const trackTitle   = document.getElementById('trackTitle');
  const trackTime    = document.getElementById('trackTime');
  const timeCurrent  = document.getElementById('timeCurrent');
  const progressBar  = document.getElementById('progressBar');
  const formatBadge  = document.getElementById('formatBadge');
  const formatSpec   = document.getElementById('formatSpec');

  const btnPlay  = document.getElementById('btnPlay');
  const btnStop  = document.getElementById('btnStop');
  const btnPrev  = document.getElementById('btnPrev');
  const btnNext  = document.getElementById('btnNext');
  const playIcon  = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');

  function fmt(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function loadTrack(idx) {
    currentTrack = (idx + TRACKS.length) % TRACKS.length;
    elapsed = 0;
    const t = TRACKS[currentTrack];

    trackArtist.textContent  = t.artist;
    trackTitle.textContent   = t.title;
    formatBadge.textContent  = t.format;
    formatSpec.textContent   = t.spec;

    const remaining = t.duration - elapsed;
    trackTime.textContent   = `(${fmt(remaining)})`;
    timeCurrent.textContent = fmt(elapsed);
    progressBar.style.width = '0%';

    // Scroll long titles
    if (t.title.length > 10) {
      trackTitle.classList.add('scrolling');
    } else {
      trackTitle.classList.remove('scrolling');
    }
  }

  function tick() {
    const t = TRACKS[currentTrack];
    elapsed += 1;
    if (elapsed >= t.duration) {
      elapsed = 0;
      nextTrack();
      return;
    }
    const pct = (elapsed / t.duration) * 100;
    timeCurrent.textContent = fmt(elapsed);
    trackTime.textContent   = `(${fmt(t.duration - elapsed)})`;
    progressBar.style.width = pct + '%';
  }

  function play() {
    if (isPlaying) return;
    isPlaying = true;
    tickInterval = setInterval(tick, 1000);
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    window.IUS_EQ && IUS_EQ.setPlaying(true);
    document.getElementById('batDot').classList.add('active');
  }

  function pause() {
    if (!isPlaying) return;
    isPlaying = false;
    clearInterval(tickInterval);
    tickInterval = null;
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    window.IUS_EQ && IUS_EQ.setPlaying(false);
  }

  function stop() {
    pause();
    elapsed = 0;
    timeCurrent.textContent = '00:00';
    progressBar.style.width = '0%';
    const t = TRACKS[currentTrack];
    trackTime.textContent   = `(${fmt(t.duration)})`;
  }

  function nextTrack() {
    const wasPlaying = isPlaying;
    stop();
    loadTrack(currentTrack + 1);
    if (wasPlaying) play();
  }

  function prevTrack() {
    const wasPlaying = isPlaying;
    // If past 3 seconds, restart; else go back
    if (elapsed > 3) {
      elapsed = 0;
    } else {
      stop();
      loadTrack(currentTrack - 1);
    }
    if (wasPlaying) play();
  }

  // Button events
  btnPlay.addEventListener('click', () => {
    isPlaying ? pause() : play();
    btnPlay.classList.add('pressed');
    setTimeout(() => btnPlay.classList.remove('pressed'), 150);
  });

  btnStop.addEventListener('click', () => {
    stop();
    btnStop.classList.add('pressed');
    setTimeout(() => btnStop.classList.remove('pressed'), 150);
  });

  btnNext.addEventListener('click', () => {
    nextTrack();
    btnNext.classList.add('pressed');
    setTimeout(() => btnNext.classList.remove('pressed'), 150);
  });

  btnPrev.addEventListener('click', () => {
    prevTrack();
    btnPrev.classList.add('pressed');
    setTimeout(() => btnPrev.classList.remove('pressed'), 150);
  });

  // Init
  loadTrack(currentTrack);

  // ── Public API ──
  window.IUS_Player = {
    play, pause, stop,
    isPlaying: () => isPlaying,
    setTrackForMode(mode) {
      // Switch display for non-player modes
    },
  };

})();
