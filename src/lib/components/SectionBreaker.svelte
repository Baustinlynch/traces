<script>
  let { lineImage, breakerImage } = $props();
</script>

<div class="breaker" aria-hidden="true">
  <div class="breaker-line-bg" style={`background-image: url(${lineImage});`}></div>
  <img src={breakerImage} alt="" class="breaker-img" />
</div>
