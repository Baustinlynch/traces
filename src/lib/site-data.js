import bgImage from '../../assets/bg.png';
import logoImage from '../../assets/logo.png';
import sectionBreakerImage from '../../assets/sectionbreaker.png';
import sectionBreakerLineImage from '../../assets/sectionbreaker-line.png';
import stickerImage from '../../assets/sticker-2.png';
import organiserDocRaw from '../../Docs/First Traces/Leader Docs/Organiser main doc.md?raw';
import pcbGuideRaw from '../../Docs/First Traces/Participant docs/PCB Guide.md?raw';

export const assets = {
  bgImage,
  logoImage,
  sectionBreakerImage,
  sectionBreakerLineImage,
  stickerImage
};

export const heroActions = [
  {
    href: 'https://canva.link/traces',
    label: 'Start the guide!',
    variant: 'btn-gold'
  },
  {
    href: 'https://traces.fillout.com/traces-ship',
    label: 'Submit your project!',
    variant: 'btn-green'
  },
  {
    href: 'https://traces.fillout.com/traces-workshop',
    label: 'Start your workshop!',
    variant: 'btn-cream'
  },
  {
    href: 'https://hackclub.com/clubs',
    label: 'Bring it to your club',
    variant: 'btn-outline'
  }
];

export const timelineItems = [
  {
    title: 'follow the guide',
    body: 'Open the Traces guide and work through the steps in Wokwi. Learn schematics, code, and debugging, all in the browser.'
  },
  {
    title: 'make it your own',
    body: 'Take the base circuit and add your own components a LED, a sensor, a display, a motor. Experiment freely, nothing burns out.'
  },
  {
    title: 'ship your project',
    body: 'Submit your finished circuit like any other YSWS. Show us what you built and what parts it needs.'
  },
  {
    title: 'get your hardware grant',
    body: 'Approved? We send you a grant to buy the real components so you can build it for real.'
  }
];

export const footerLinks = [
  { href: 'https://hackclub.com', label: 'Hack Club' },
  { href: 'https://wokwi.com', label: 'Wokwi' },
  { href: 'https://hackclub.com/clubs', label: 'Clubs' },
  { href: 'https://hackclub.slack.com', label: 'Slack' }
];

export const docs = [
  {
    slug: 'first-traces-organiser-main-doc',
    title: 'Organiser main doc',
    group: 'Leader Docs',
    path: 'Docs/First Traces/Leader Docs/Organiser main doc.md',
    content: organiserDocRaw
  },
  {
    slug: 'first-traces-pcb-guide',
    title: 'PCB Guide',
    group: 'Participant docs',
    path: 'Docs/First Traces/Participant docs/PCB Guide.md',
    content: pcbGuideRaw
  }
];
