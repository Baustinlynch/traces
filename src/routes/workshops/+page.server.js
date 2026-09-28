import { assets, footerLinks, workshops } from '$lib/site-data.js';

export function load() {
  return {
    workshops,
    logoImage: assets.logoImage,
    backgroundImage: assets.bgImage,
    footerLinks
  };
}
