# Session 1 — Microcontrollers & Your First Circuit

## What is a microcontroller?

A microcontroller is a tiny, self-contained computer on a single chip that you can program to read sensors, control motors, and automate electronics projects. It's the most low-level type of computer you can get — most microcontrollers don't run an operating system, they just run bare code, usually in a low-level language. Some microcontrollers have features like WiFi and Bluetooth, but others are more basic and can only read and write to pins.

## What is a Development Board?

A development board is a board, usually made by the manufacturer of a microcontroller chip, to show off what their chips can do. For our projects we're going to use an Arduino — Arduino makes them easy to build projects with, for makers and industry users. Development boards make it easy to prototype projects, since they have pins that can easily be connected to other components.

### What are these pins for?

- **GND** — the negative pin on our microcontroller; it's where the electricity flows to from all of our other pins.
- **3.3V** — power supply used for small microcontrollers, LEDs, and more.
- **5V power supply** — mostly used for small servos, LCD screens, and so on.
- **Digital pins** — the pins we can control with code; the microcontroller can turn them on and off.
- **Analog pins** — read the voltage between themselves and ground, allowing us to read what state components such as buttons and potentiometers are in.

*(The original slide includes a full labeled diagram of the Arduino Uno's pins alongside these descriptions — it's one of the images this export couldn't bring over; see the note at the end of this file.)*

## How are we going to design a circuit?

We're going to use **Wokwi** to design our circuits! Wokwi is a free simulator at [wokwi.com](https://wokwi.com). Select a microcontroller, wire it to an LED, a sensor, or a display, write the code, hit run — it behaves like the real thing would. You don't need to wait for parts to arrive or anything; it's web-based, free, and easy to use.

We'll be using an **Arduino Uno**, powered by an ATmega328P chip.

1. Go onto wokwi.com and click on the Arduino, then scroll down to "Start from scratch" and click **Arduino Uno**.
2. It will drop you into a dropdown — to make the starter circuit, pick a resistor and an LED.

### Adding components

On the top left of your circuit screen, click the **+** sign to add components. Place the LED and resistor like so:

![Arduino Uno with an LED and resistor wired up](https://cdn.hackclub.com/01a0ac09-2d60-7197-bed6-151770ba60f6/width-198)

### Why do we need a resistor?

We use the resistor to limit the amount of current that can go into our LED, so that it doesn't burn up. We can do this because of Ohm's law:

**V = IR**
- I = Current (measured in Amps)
- R = Resistance (measured in ohms, Ω)
- V = Voltage (measured in V)

For our LED, we're using a voltage of 3.3V, and it can take a maximum safe current of 30mA, so:

3.3V = 0.0033A × R → R = 3.3 / 0.0033 = **1000Ω**

So make sure your resistor is 1000Ω, so that the LED is properly protected. Set it up — you've now got everything you need to light up an LED!

---

> **A note on images:** a few diagrams on the original Session 1 slides (the full Arduino pinout diagram, and a couple of Wokwi screenshots showing the "+" menu and component dropdown) are stored under a Canva asset permission this connection couldn't read, so they couldn't be re-hosted here. Everything else — including the one image above — was pulled from the deck and re-hosted on the Hack Club CDN. You can see the originals in the [Traces: Guide Slides! deck](https://www.canva.com/d/qSRdPFCi5AAqwSx).