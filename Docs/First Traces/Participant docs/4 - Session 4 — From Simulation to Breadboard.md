# Session 4 — From Simulation to Breadboard

## How does a breadboard work?

A breadboard is a plastic board full of tiny spring clips, so you can build circuits with no soldering.

- Down the middle, each row of 5 holes is connected together internally.
- A groove down the center splits the board in half, so the left and right sides are **not** connected to each other.
- Along the top and bottom edges are the **power rails** — long strips (usually marked + and −) that run the full length of the board, used for running power and GND to every component.
- Plug a component's leg into any hole in a row, and it's now electrically joined to every other hole in that row, just like it was soldered together.

## Build your Wokwi circuit on a breadboard

1. Push the LED into two **different** rows. The long leg (anode, +) and short leg (cathode, −) must never share a row.
2. Push your 1000Ω resistor into the same row as the LED's long leg, with its other leg in an empty row.
3. Run a jumper wire from that empty row (the resistor's free leg) to the same digital pin you used in Wokwi.
4. Run a second jumper wire from the LED's short leg row to a GND pin on the Arduino.
5. Double-check: LED the right way round, resistor value correct, wires firmly seated.

## Program your Arduino

1. Open the Arduino IDE on your computer.
2. Copy the code from your Wokwi simulation and paste it into the Arduino IDE.
3. Make sure all the pins in your code match with the ones you have set up on your breadboard.
4. Connect your Arduino to your computer, or whichever device you are using, using the USB cable.
5. In the dropdown at the top left of the screen, select — *(the original slide's instructions cut off right here — worth checking the source deck or filling in the correct board/port option before printing this guide)*.

---

> **A note on images:** the breadboard-wiring diagrams on the original Session 4 slides are stored under a Canva asset permission this connection couldn't read, so they couldn't be re-hosted here. You can see them in the [Traces: Guide Slides! deck](https://www.canva.com/d/qSRdPFCi5AAqwSx).