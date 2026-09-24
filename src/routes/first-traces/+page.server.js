import { error, redirect } from '@sveltejs/kit';
import { docs } from '$lib/site-data.js';

// Legacy alias: #/first-traces pointed at the PCB Guide.
export function load() {
  const doc = docs.find((d) => d.slug === 'first-traces-pcb-guide');
  if (!doc) error(404, 'Doc not found');
  redirect(308, doc.href);
}
