import { assets, footerLinks, heroActions, timelineItems } from '$lib/site-data.js';

export function load() {
  return { assets, heroActions, timelineItems, footerLinks };
}
