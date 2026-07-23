(function(){
  const canvas = document.getElementById('pcbCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, DPR;
  let traces = [];
  let pulses = [];
  let lastSpawn = 0;

  let mouseTX = null, mouseTY = null;
  let mouseX, mouseY;

  const GRID = 34;

  function rand(min, max){ return min + Math.random() * (max - min); }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function buildTrace(){
    const cols = Math.ceil(W / GRID);
    const rows = Math.ceil(H / GRID);

    const startCol = Math.floor(rand(0, cols));
    const startRow = Math.floor(rand(0, rows));
    let x = startCol * GRID;
    let y = startRow * GRID;

    const pts = [[x, y]];
    const segments = Math.floor(rand(3, 7));
    let dir = pick(['h','v']);

    for(let i = 0; i < segments; i++){
      const len = Math.floor(rand(2, 7)) * GRID;
      if(dir === 'h'){
        x += pick([-1,1]) * len;
      } else {
        y += pick([-1,1]) * len;
      }
      x = Math.max(-GRID, Math.min(W + GRID, x));
      y = Math.max(-GRID, Math.min(H + GRID, y));
      pts.push([x, y]);
      dir = dir === 'h' ? 'v' : 'h';
    }

    let segLens = [];
    let totalLen = 0;
    for(let i = 1; i < pts.length; i++){
      const dx = pts[i][0] - pts[i-1][0];
      const dy = pts[i][1] - pts[i-1][1];
      const l = Math.abs(dx) + Math.abs(dy);
      segLens.push(l);
      totalLen += l;
    }

    return {
      pts, segLens, totalLen,
      delay: rand(0, 2400),
      growDur: rand(1100, 2200),
      pad: Math.random() < 0.35,
      hue: pick(['gold','cream']),
      depth: rand(0.35, 1)
    };
  }

  function init(){
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const density = Math.max(10, Math.min(26, Math.floor((W * H) / 38000)));
    traces = [];
    for(let i = 0; i < density; i++){
      traces.push(buildTrace());
    }
    pulses = [];

    if(mouseTX === null){ mouseTX = W / 2; mouseTY = H / 2; }
    mouseX = mouseTX; mouseY = mouseTY;
  }

  function pointAtDistance(trace, dist){
    let remaining = dist;
    for(let i = 0; i < trace.segLens.length; i++){
      const segLen = trace.segLens[i];
      if(remaining <= segLen || i === trace.segLens.length - 1){
        const t = segLen === 0 ? 0 : Math.max(0, Math.min(1, remaining / segLen));
        const [x0,y0] = trace.pts[i];
        const [x1,y1] = trace.pts[i+1];
        return [x0 + (x1-x0)*t, y0 + (y1-y0)*t];
      }
      remaining -= segLen;
    }
    const last = trace.pts[trace.pts.length-1];
    return last;
  }

  function drawTracePath(trace, upTo){
    let remaining = Math.min(upTo, trace.totalLen);
    ctx.beginPath();
    ctx.moveTo(trace.pts[0][0], trace.pts[0][1]);
    for(let i = 0; i < trace.segLens.length; i++){
      const segLen = trace.segLens[i];
      const [x0,y0] = trace.pts[i];
      const [x1,y1] = trace.pts[i+1];
      if(remaining >= segLen){
        ctx.lineTo(x1, y1);
        remaining -= segLen;
      } else {
        const t = segLen === 0 ? 0 : remaining / segLen;
        ctx.lineTo(x0 + (x1-x0)*t, y0 + (y1-y0)*t);
        break;
      }
    }
    ctx.stroke();
  }

  let startTime = null;

  function easeOutCubic(x){ return 1 - Math.pow(1 - x, 3); }

  function frame(now){
    if(startTime === null) startTime = now;
    const t = now - startTime;

    ctx.clearRect(0, 0, W, H);

    mouseX += (mouseTX - mouseX) * 0.06;
    mouseY += (mouseTY - mouseY) * 0.06;
    const dx = (mouseX - W / 2) / (W / 2 || 1);
    const dy = (mouseY - H / 2) / (H / 2 || 1);
    const maxShift = Math.min(60, W * 0.05);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    traces.forEach(trace => {
      const local = t - trace.delay;
      if(local <= 0) return;
      const progress = Math.min(1, local / trace.growDur);
      const drawnLen = trace.totalLen * easeOutCubic(progress);

      const offX = dx * maxShift * trace.depth;
      const offY = dy * maxShift * trace.depth;
      const warped = { pts: trace.pts.map(([x,y]) => [x + offX, y + offY]), segLens: trace.segLens, totalLen: trace.totalLen };

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(160, 220, 185, 0.16)';
      drawTracePath(warped, drawnLen);

      if(progress < 1){
        const tip = pointAtDistance(warped, drawnLen);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,194,60,0.65)';
        ctx.arc(tip[0], tip[1], 3, 0, Math.PI*2);
        ctx.fill();
      }
    });

    if(!reduceMotion && now - lastSpawn > 260){
      lastSpawn = now;
      const ready = traces.filter(tr => (t - tr.delay) > tr.growDur);
      if(ready.length){
        const trace = pick(ready);
        pulses.push({ trace, dist: 0, speed: rand(90, 170) / 1000 });
      }
    }

    pulses.forEach(p => { p.dist += p.speed * 16; });
    pulses = pulses.filter(p => p.dist < p.trace.totalLen + 40);

    pulses.forEach(p => {
      const offX = dx * maxShift * p.trace.depth;
      const offY = dy * maxShift * p.trace.depth;
      const warped = { pts: p.trace.pts.map(([x,y]) => [x + offX, y + offY]), segLens: p.trace.segLens, totalLen: p.trace.totalLen };
      const [x,y] = pointAtDistance(warped, p.dist);
      const grad = ctx.createRadialGradient(x,y,0,x,y,14);
      grad.addColorStop(0, 'rgba(255,210,110,0.9)');
      grad.addColorStop(1, 'rgba(255,210,110,0)');
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(x, y, 14, 0, Math.PI*2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = '#ffe6a3';
      ctx.arc(x, y, 2.4, 0, Math.PI*2);
      ctx.fill();
    });

    requestAnimationFrame(frame);
  }

  function updateMouseFromEvent(clientX, clientY){
    const rect = canvas.getBoundingClientRect();
    mouseTX = clientX - rect.left;
    mouseTY = clientY - rect.top;
  }
  window.addEventListener('mousemove', (e) => updateMouseFromEvent(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if(e.touches && e.touches[0]) updateMouseFromEvent(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { startTime = null; init(); }, 150);
  });

  init();
  requestAnimationFrame(frame);
})();

(function(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;

  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => obs.observe(el));
})();
