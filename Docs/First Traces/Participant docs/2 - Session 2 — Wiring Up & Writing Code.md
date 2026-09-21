# Session 2 — Wiring Up & Writing Code

## Join the club

Scan this QR code to make a Hack Club account and join the club:

![QR code to join the Hack Club](https://cdn.hackclub.com/01a0ac09-8231-7d3e-86a8-cf737dd5f2a6/width-148)

Join link: https://clubs.hackclub.com/auth/member?join=YN349R

There's also a "Join the team" slide with a Microsoft Teams QR code and link:

![QR code for the Microsoft Teams channel](https://cdn.hackclub.com/01a0ac09-63b7-7c84-ba04-834bc57e8087/width-200)

Teams link: https://teams.microsoft.com/l/team/19%3APd73FhlgLUWQdXUlkwlBp7rvoZDJXj_SVXGi7U9uReQ1%40thread.tacv2/conversations?groupId=712db69e-a0a9-4b4c-b37f-95cf383a8f39&tenantId=48acfe69-376a-42b5-9f69-c9e47bbfb9c4

> **Heads up:** both of these slides were still marked **"Not For public release!!!"** in the deck, with some leftover testing notes layered on top (e.g. "just here for brenden use only"). I've left those annotations out of this file, but you'll probably want to double-check these two links/slides are ready before sharing this guide any further.

## Welcome back

Now that we have our components connected, we need to write the code to control the LED.

Microcontrollers can be programmed using a variety of different programming languages. Some common ones are **MicroPython** (a light version of the popular language Python) and **Embedded Rust** (a light version of the already-light language Rust). For our Arduino, we're going to be using **C++**.

On the left side of the screen is the window where we'll write our code for the Arduino. Right now our circuit isn't doing anything, because we haven't written any code to tell the pins what to output. There are two sections in our code window — the **setup** section and the **loop** section. We're going to be writing our code in the setup section for now.

![Wokwi's code editor next to the simulated Arduino Uno](https://cdn.hackclub.com/01a0ac09-4813-782c-a310-0c18cb2ba5ea/width-200)

## Try more components

Now, have a look at the other components you can add to your design. In the kit you'll be getting, you'll have about 6 buttons and 15 LEDs. Think of a design you can make with these components and add it to your simulation. Have a look online for more code you can use — there's so much more you can do!

---

> **A note on images:** the QR/logo images above and the Wokwi editor screenshot were pulled from the original slides and re-hosted on the Hack Club CDN. You can see the originals in the [Traces: Guide Slides! deck](https://www.canva.com/d/qSRdPFCi5AAqwSx).