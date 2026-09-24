<script>
  let { stickerImage } = $props();
</script>

<section class="section" id="what">
  <div class="section-inner two-col">
    <div class="col-text">
      <h2 class="h2">a circuits YSWS,<br />built for clubs.</h2>
      <p class="p-lead">
        Most YSWS programs ship you a kit and say good luck. Traces is different, follow the
        guide, learn circuit design in <strong>Wokwi</strong>, then add your own components and
        we'll <strong>grant you the real parts</strong> to build it in the physical world.
      </p>
      <p>
        Everything starts in <a href="https://wokwi.com" target="_blank" rel="noopener">Wokwi</a>,
        a free in-browser simulator for Arduino, ESP32, Raspberry Pi Pico, and more. Wire up
        resistors, sensors, displays and microcontrollers, hit run, and watch the simulation
        light up. Mess it up? Undo and try again, nothing actually smokes up. Once you ship a
        project with your own custom components, we send you the hardware to build it for real.
      </p>
      <ul class="checklist">
        <li>No parts to buy up front</li>
        <li>Runs in any browser, on any laptop</li>
        <li>Real schematics, real code, real debugging</li>
        <li>Finish a project, earn a hardware grant</li>
      </ul>
    </div>
    <div class="col-visual">
      <div class="sticker-frame">
        <img src={stickerImage} alt="Traces sticker" class="sticker-img" />
      </div>
    </div>
  </div>
</section>
