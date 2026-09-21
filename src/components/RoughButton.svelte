<script>
  import { onMount } from 'svelte';
  import rough from 'roughjs';

  export let href;
  export let target = '_blank';
  export let rel = 'noopener';
  export let variant = '';
  export let size = '';

  let el;
  let svgEl;
  let seed = (Math.random() * 100000) | 0;

  function draw() {
    if (!el || !svgEl) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return;

    const cs = getComputedStyle(el);
    const fill = (cs.getPropertyValue('--btn-fill') || '').trim();
    const stroke = (cs.getPropertyValue('--btn-stroke') || '').trim() || '#1d2718';

    const pad = 8;
    const x = pad;
    const y = pad;
    const x2 = x + w - pad * 2;
    const y2 = y + h - pad * 2;
    const r = (h - pad * 2) / 2;
    const d = [
      `M${x + r} ${y}`,
      `L${x2 - r} ${y}`,
      `A ${r} ${r} 0 0 1 ${x2} ${y + r}`,
      `L${x2} ${y2 - r}`,
      `A ${r} ${r} 0 0 1 ${x2 - r} ${y2}`,
      `L${x + r} ${y2}`,
      `A ${r} ${r} 0 0 1 ${x} ${y2 - r}`,
      `L${x} ${y + r}`,
      `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
      'Z'
    ].join(' ');

    const rc = rough.svg(svgEl);
    svgEl.innerHTML = '';
    svgEl.appendChild(
      rc.path(d, {
        fill: fill === 'transparent' || fill === 'none' ? undefined : fill,
        stroke,
        strokeWidth: 2,
        fillStyle: 'solid',
        roughness: 1.3,
        bowing: 1.4,
        seed
      })
    );
  }

  onMount(() => {
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    return () => ro.disconnect();
  });
</script>

<a {href} {target} {rel} class="btn {variant} {size}" bind:this={el}>
  <svg bind:this={svgEl} class="btn-rough" aria-hidden="true"></svg>
  <span class="btn-label"><slot /></span>
</a>