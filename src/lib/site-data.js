const backgroundImage = 'https://cdn.hackclub.com/01a0aabc-f8d1-709f-b0b3-aba661d8a59f/background.png';
const logoImage = 'https://cdn.hackclub.com/01a0aabc-ffa1-714d-b041-6cd0e01ce1ce/logo.png';
const sectionBreakerImage = 'https://cdn.hackclub.com/01a0aabd-0421-76a6-b795-ee5cfad6d116/section-breaker.png';
const sectionBreakerLineImage = 'https://cdn.hackclub.com/01a0aabc-fc95-71d4-8823-ce7a5add7bc2/section-breaker-line.png';
const stickerImage = 'https://cdn.hackclub.com/01a0aabc-7701-7153-a0cd-9d976d331e3a/sticker-primary.png';
import organiserDocRaw from '../../Docs/First Traces/Leader Docs/Organiser main doc.md?raw';
import pcbGuideRaw from '../../Docs/First Traces/Participant docs/PCB Guide.md?raw';

export const assets = {
  bgImage: backgroundImage,
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
    content: organiserDocRaw,
    hidden: true
  },
  {
    slug: 'first-traces-pcb-guide',
    title: 'PCB Guide',
    group: 'Participant docs',
    path: 'Docs/First Traces/Participant docs/PCB Guide.md',
    content: pcbGuideRaw
  }
];
