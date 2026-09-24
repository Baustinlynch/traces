<script>
  import Hero from './Hero.svelte';
  import SectionBreaker from './SectionBreaker.svelte';
  import AboutSection from './AboutSection.svelte';
  import TimelineSection from './TimelineSection.svelte';
  import CtaSection from './CtaSection.svelte';
  import Footer from './Footer.svelte';

  let { assets, heroActions = [], timelineItems = [], footerLinks = [] } = $props();
</script>

<Hero backgroundImage={assets.bgImage} actions={heroActions} />
<SectionBreaker lineImage={assets.sectionBreakerLineImage} breakerImage={assets.sectionBreakerImage} />
<AboutSection stickerImage={assets.stickerImage} />
<TimelineSection items={timelineItems} />
<CtaSection logoImage={assets.logoImage} />
<Footer logoImage={assets.logoImage} links={footerLinks} />
