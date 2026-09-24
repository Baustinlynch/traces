<script>
  import LandingPage from '$lib/components/LandingPage.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Traces</title>
  <meta
    name="description"
    content="Traces is a Hack Club hardware series for clubs: design and simulate real circuits in Wokwi, ship your project, and get a hardware grant to build it for real."
  />
</svelte:head>

<LandingPage
  assets={data.assets}
  heroActions={data.heroActions}
  timelineItems={data.timelineItems}
  footerLinks={data.footerLinks}
/>
