<script>
  import WorkshopsPage from '$lib/components/WorkshopsPage.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Workshops · Traces</title>
  <meta
    name="description"
    content="Every Traces hardware workshop in one place. Pick a series, follow the guide in Wokwi, ship your project, and get a hardware grant to build it for real."
  />
</svelte:head>

<WorkshopsPage
  workshops={data.workshops}
  logoImage={data.logoImage}
  backgroundImage={data.backgroundImage}
  footerLinks={data.footerLinks}
/>
