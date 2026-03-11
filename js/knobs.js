/* ══════════════════════════════════════════════
   KNOBS.JS Rotary knob drag interaction
   IUS DRRP
══════════════════════════════════════════════ */

(function() {
  'use strict';

  const knobs = document.querySelectorAll('.knob');

  knobs.forEach(knob => {
    let isDragging = false;
    let startY = 0;
    let startAngle = 0;
    let currentAngle = 0;
    const type = knob.dataset.knob;

    function getAngle() { return currentAngle; }

    function setAngle(angle) {
      currentAngle = Math.max(-150, Math.min(150, angle));
      knob.style.transform = `rotate(${currentAngle}deg)`;

      const normalized = (currentAngle + 150) / 300; // 0..1

      if (type === 'volume') {
        const vol = Math.round(normalized * 100);
        window.IUS && window.IUS.setVolume(vol);
      } else if (type === 'tune') {
        window.IUS && window.IUS.setTune(normalized);
      }
    }

    // Mouse
    knob.addEventListener('mousedown', e => {
      isDragging = true;
      startY = e.clientY;
      startAngle = currentAngle;
      document.body.style.cursor = 'ns-resize';
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dy = startY - e.clientY; // drag up = increase
      setAngle(startAngle + dy * 1.2);
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
      }
    });

    // Touch
    knob.addEventListener('touchstart', e => {
      isDragging = true;
      startY = e.touches[0].clientY;
      startAngle = currentAngle;
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', e => {
      if (!isDragging) return;
      const dy = startY - e.touches[0].clientY;
      setAngle(startAngle + dy * 1.2);
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', () => { isDragging = false; });

    // Wheel
    knob.addEventListener('wheel', e => {
      setAngle(currentAngle - e.deltaY * 0.5);
      e.preventDefault();
    }, { passive: false });

    // Init at center/62%
    if (type === 'volume') setAngle(-20);  // ~62% volume
    if (type === 'tune') setAngle(0);       // center frequency
  });

})();
