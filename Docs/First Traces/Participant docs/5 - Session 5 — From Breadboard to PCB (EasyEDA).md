# Session 5 — From Breadboard to PCB (EasyEDA)

## What is EasyEDA?

EasyEDA is a free, browser-based tool for drawing schematics, laying out PCBs, and ordering the finished board — all in one place, nothing to install.

Two tabs matter most: **Schematic**, where you draw your circuit with symbols and wires, and **PCB**, where you place real component footprints and route copper traces.

Every part has two faces: a schematic symbol (what it means electrically) and a footprint (the physical pads matching its real package). EasyEDA links the two automatically from its library.

When your board is finished, EasyEDA exports Gerber files straight to JLCPCB for fabrication, or you can download them and use any board house you like.

## PCB design basics

1. A PCB is a stack of insulating board and copper layers. **Traces** are the copper "wires" etched onto those layers that replace your jumper wires.
2. **Pads and footprints** are where a component's legs solder down — every footprint's pad size and spacing must exactly match the real part, or it won't fit.
3. **Vias** are tiny plated holes that carry a signal from one copper layer to another, letting traces "jump" layers when they'd otherwise cross.
4. **Silkscreen** is the printed labeling layer — part outlines, reference designators, your logo. It's ink, not copper, and carries no electrical connection.
5. Before ordering, **Design Rule Check (DRC)** scans for traces too close together, unconnected nets, or pads that violate your fab's minimum spacing.

## From Wokwi to EasyEDA

1. Wokwi is a simulator: parts are icons and wires are virtual. EasyEDA needs those same electrical connections turned into a real schematic, then a real board.
2. Start in the Schematic editor and place a symbol for every part in your Wokwi project (Arduino Uno, LED, resistor) using the built-in library search.
3. Wire the symbols exactly as they were connected in Wokwi, same pin to same pin. This map of connections is called your **netlist**.
4. Once every pin on the schematic is connected, click **Convert to PCB**. EasyEDA drops in the real footprint for every symbol, ready to arrange.
5. Arrange the footprints, then route each highlighted "ratsnest" line into an actual copper trace to complete the board.

## Recreate your Wokwi circuit in EasyEDA

1. Open a new Schematic in EasyEDA and search the library for "Arduino Uno" — place its symbol on the sheet.
2. Add an LED symbol and a resistor symbol — the same two parts from your Wokwi sketch.
3. Wire the resistor from the Arduino's digital pin to the LED's anode, and the LED's cathode to GND, matching your Wokwi wiring exactly.
4. Click **Convert to PCB**. EasyEDA drops in the real footprints (Arduino header strips, LED, resistor) linked by ratsnest lines.
5. Arrange the footprints on the board outline, then route each ratsnest line into a copper trace with the routing tool.
6. Run **Design Rule Check**, fix any flagged spacing or unconnected nets, then export Gerbers once it comes back clean.

## Kit footprint reference

- **Breadboard** — prototyping only; once you move to a PCB it's not part of the board, just the sketchpad you used to test the circuit.
- **Resistors** — Axial THT footprint, 400 mil (10.16 mm) lead spacing — search "AXIAL-0.4" or "R_Axial_DIN0207" in the library.
- **5mm LEDs (yellow/red/green)** — "LED_D5.0mm" THT footprint, 2.54 mm lead spacing — the flat side of the LED body marks the cathode.
- **Tactile pushbuttons (6×6mm, 4-leg)** — "SW-TH_6x6mm" THT footprint, legs on a 4.5 × 6.5 mm pattern.
- **Ceramic disc capacitors** — "CAP-TH_D3.0mm_P5.00mm" THT footprint, roughly 5 mm lead spacing.

## Power, headers, and talking to the Arduino

1. The 9V battery snap and DC barrel jack pigtail are flying leads, not fixed parts — land both on a 2-pin, 2.54 mm THT pin header or a 2-position 5.08 mm screw terminal.
2. Rather than soldering your PCB directly onto the Uno, treat the Uno as an external module you talk to through its existing header pins, same as a breadboard.
3. On your PCB, place 2.54 mm-pitch through-hole pin headers, however many pins each net needs, as the only points that connect to the Arduino.
4. Route each net from a component footprint to its matching header pin, using the same labels your Wokwi sketch already used (e.g. D9, GND, 5V).
5. In the field, a Dupont jumper wire runs from the Arduino Uno's header row to your PCB's header — no soldering to the Uno itself.
6. This keeps your Uno reusable across projects: only the small custom PCB changes, and it always plugs back into the same header rows.

---

**Original slides:** [Traces: Guide Slides!](https://www.canva.com/d/qSRdPFCi5AAqwSx)