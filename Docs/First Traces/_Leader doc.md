Thank you for running First Traces! I ([@Brenden](https://hackclub.enterprise.slack.com/team/U0A0JJ603N2) on slack) have spent so much of my time working on this workshop, and the traces program in its entirety and I hope that you and your participants have a better time running this workshop than i did making it! (many weekends spent working, and enough caffeine to take about 5 years of my life) Many thanks to [@Noah Walsh](https://hackclub.enterprise.slack.com/team/U09NRKW6DT8) for testing this workshop with this club,  [@jps](https://hackclub.enterprise.slack.com/team/U07HEH4N8UV) for sponsoring this program, and [@aahil](https://hackclub.enterprise.slack.com/team/U0A5NM1QBU4) for stepping away to work on his other programs, and for allowing me to pick up running traces! 
Now on with the guide!
 
These premade guides for this workshop do not prepare for every way that your participants **will** manage to fuck it all up, so i recommend that you go through these guides yourself, and learn about the tools your participants will be using, [WokWi](https://wokwi.com), [EasyEDA](https://easyeda.com), and [The Arduino IDE](https://www.arduino.cc/en/software/).
I also recommend that you familiarise yourself with the ordering process for JLCPCB, (or a different PCB manufacturer if it is cheaper for you or more available in your country)

> [!warning] This page is a draft
> It's written to be useful, not finished. Everything marked **TODO** needs an answer from whoever owns the program before it goes out to leaders.
>
> - **TODO** — the kit contents and quantities below are read out of the participant guides. Confirm them against the real kit before you tell a club what they're getting.
> - **TODO** — the grant section has no numbers in it on purpose. Add the current per-participant amount, the budget code or form, and the deadline, once you've confirmed them in `#traces`.
> - **TODO** — the page title comes from the filename, so this publishes as "Leader doc". If you want a nicer title and URL, rename the file to something like `_Leader Guide.md` (the leading underscore keeps it out of the participant nav).
> - **TODO** — decide how leaders find this page. It's hidden, so it never shows in the sidebar, prev/next, or the workshop card. Link it from your sign-up form, or un-hide it once it's finished.

## What First Traces is

Six sessions that take a group of students from "what even is a microcontroller" to a custom PCB they ordered for real.

1. [[Session 1 — Microcontrollers & Your First Circuit]] — build and simulate an LED circuit in Wokwi.
2. [[Session 2 — Wiring Up & Writing Code]] — write the code that drives it.
3. [[Session 3 — Breadboards & Code Basics]] — the four lines of code everyone will actually use, and how a breadboard is wired.
4. [[Session 4 — From Simulation to Breadboard]] — the same circuit, on real hardware.
5. [[Session 5 — From Breadboard to PCB (EasyEDA)]] — the same circuit again, as a board layout.
6. [[PCB Guide]] — export the Gerbers and hand them to you to order.

Every session ends with something running, and the program ends with a board in each participant's hands. That's the hook — sell the club on the fact that participants leave with real hardware, not a certificate.

The first three sessions need nothing but laptops. The hardware only shows up at session 4, which means you can start the program while your parts are still in the post.

## Who this is for

- Club leaders running Traces for their own club, usually 8–15 participants. Above about 15 you stop being able to help everyone in the room, so i would recommend to get another leader at that point
- Students with no electronics background. The sessions expect no experience

## Before you start

**Run the whole thing yourself first.** Do every session on your own machine, start to finish, including the PCB order. These guides do not prepare for every way a participant can break their circuit, and the only way to find out how yours breaks is to break it yourself. Do the drills in this section before your first session, not during.

**Get into [#traces](https://hackclub.enterprise.slack.com/archives/C0BC9PJBQBU)on slack.** Programme questions, kit questions, and "is this normal" questions all belong in the Traces channel on Slack. The people who wrote these guides are in there and they know the answers faster than you can search.

**Make the accounts before the first session.** Tell participants to sign up for [Wokwi](https://wokwi.com) and [EasyEDA](https://easyeda.com/register) and confirm the email before session 1. Account creation eats fifteen minutes of a session if you leave it to the room, and half your group will hit a verification email at the same time. Wokwi is needed from session 1; EasyEDA isn't until session 5, so session 4 is your last clean warning.

**Know the ordering process.** [[PCB Guide]] sends participants to you with a Gerber file, not to a checkout. Read the JLCPCB order flow end to end, and find out what your local alternative costs and how long it takes, before anyone hands you a file.

**Check the room.** Everything in this program is web-based, so you need:

- A projector or screen for demoing your own circuit at the front.
- Reliable Wi-Fi for Wokwi, EasyEDA, and the Arduino IDE downloads. Test it on the actual meeting machine, not on your phone.
- Power outlets for everyone, and enough table space for a breadboard and a laptop side by side.
- One spare Arduino Uno and a spare breadboard for you. You'll want to demo something broken on purpose, and you don't want to be fumbling while you do it.
- The [original slides](https://www.canva.com/d/qSRdPFCi5AAqwSx) if you'd rather present from those than from the guide.

## The kit

You will get about $15 to $20 for your Arduino kit, this guide is designed for a kit like [this](https://www.aliexpress.com/item/1005006769233421.html?).  If you need to get a different kit you may need to change the guides/edit the slides for different components
## Running the sessions

Aim for about 40 minutes a session, and try to keep the gap between them small, once a week is probably fine, but with more of a gap in between, your participants might start to forget things.
### Session 1 — Microcontrollers & Your First Circuit

This session is all on the web simulator. No hardware, so it's the easiest session to run and the easiest to recover from.

- Get the room on Wokwi and onto an Arduino Uno **before** you start talking. If you're demoing, use the same "start from scratch" path they will.
- The pin diagram does a lot of work here. Two or three minutes naming GND, 3.3V, 5V, digital, and analog is cheaper than twenty minutes of debugging later.
- The resistor is where the room goes quiet. Ohm's law, V = IR, 3.3V at 30mA, therefore 1000Ω. If someone asks why 30mA, "because that's the safe maximum for the LED" is a complete answer.
- End with a working blinking LED in Wokwi. Anyone who doesn't have one by the time you move on should pair with someone who does rather than fall behind.

### Session 2 — Wiring Up & Writing Code

- The room meets `setup` and `loop` for the first time. Draw them on the board and leave them there for the rest of the program.
- The stretch task is deliberately open-ended: "design something with the buttons and LEDs in your kit, and find code online." Have two or three ideas ready, and expect to spend most of your time being a search assistant.
- **Pin numbers from now on matter.** Whatever pin they pick for their LED in session 2 is the pin they have to wire in session 4. Tell them explicitly to write their pin numbers down somewhere visible, or you'll rebuild half the room's breadboards from scratch next week.

### Session 3 — Breadboards & Code Basics

Still a simulation session, so it's a good week to run if parts haven't landed.

- This session is for participants to work independently, go around the room and help where you can, but don't lecture them
- If a participant doesn't have a finished circuit by the end, they will not get through session 4 — pair them up rather than carrying them.
- This is the natural place to hand out kits if they've arrived, so people can look at the parts before they're needed.

### Session 4 — From Simulation to Breadboard

The session that decides whether the rest works. Expect to spend most of your time on the floor.

- Demo the whole build on your own board first, at the front, at walking pace. Then hand out kits. Then circulate.
- The three failures you'll see, in order of frequency:
  1. **LED backwards.** Long leg is the anode, and it goes through the resistor. If they didn't get it in Wokwi they won't guess it here.
  2. **Both LED legs in the same row.** The LED is shorted, and the whole row is the anode. The guide says "two *different* rows" — say it out loud.
  3. **The code and the breadboard disagree.** The pin in the sketch isn't the pin they wired to. This is the one session 2's "write your pin numbers down" note prevents.
- Have a known-good Uno on the floor with a sketch loaded, so you can swap a board in a couple of seconds and make sure their board isn't broken

### Session 5 — From Breadboard to PCB (EasyEDA)

The hardest session, and the one where the room is most likely to give up on themselves.

- Get the `.epro2` project file ready and shared **in advance**. [[PCB Guide]] tells participants their leader provides it; if you don't send it before the session, the first twenty minutes will be thrown off.
- Reassure them about the ratsnest. The blue lines aren't an error state, they're just "these pins still need connecting", and half the room reads them as a broken board.
- DRC is where the session stalls. Push people to fix every red marker before they leave, and remind them what the markers mean: traces too close, a short, or an unconnected net. Unconnected nets are the most common one, and they mean a missing wire in the schematic.
- 45° corners and thicker power traces are guidance, not rules. Don't let a perfectionist argument eat the session.
- The last ten minutes are the deadline: everyone exports their Gerbers and sends them to you. Do not say "we'll do it next week." Get the files in the room.

### The PCB order

Once the files are in, the work is yours.

1. Collect every Gerber file, and keep the names with the participant names. Somebody will send you `gerbers(3).zip` and you'll want to know whose it is.
2. Spot-check before you pay for anything. Open each file in a Gerber viewer or back in EasyEDA and confirm the board outline, both copper layers, and the silkscreen are all there, and that nothing is left unconnected. One bad zip means one dead board and three weeks of postage.
3. If you can, 
4. Order the whole batch together. Two layers, 1.6mm FR-4, and the standard defaults are fine for a first run
5. Order for the whole club plus 10–20% spare boards, and label the spares. You will need them: a handful of participants will pull a pad off, bridge two traces with a stray blob of solder, or discover a footprint that doesn't match the part they actually had.
6. Pay from the program budget and keep every receipt. You'll be asked for them at the end.
7. Ship the boards to participants, or hold them for a soldering session. Production plus shipping is realistically three to four weeks, so set expectations at session 5 rather than letting people wonder.
8. If a meaningful share of the boards come back dead, that's a finding, not a failure — tell the Traces channel so the next club doesn't hit it, and order a spin.

## Grants and budget

Traces is funded by a Hack Club hardware grant, so participants should not be paying for their own parts — that's most of the reason the program works.

- **TODO** — add the current per-participant amount, how a participant's grant is claimed, and any deadline.
- Don't quote an amount to your club until you've confirmed it. A grant amount that changes is much worse than no number at all.
- Spend the grant on what the guide needs and nothing else. If your club wants a soldering iron, a bench supply, or spares beyond the first batch, ask in `#traces` first.
- Every participant should finish. The grant is tied to people getting to a board, so if someone's stuck at session 4, spend the extra session on them.

## Troubleshooting

| Symptom | Usual cause | Fix |
| --- | --- | --- |
| No board found in the Arduino IDE | Charge-only USB cable, or a dead port | Swap the cable first, then the port. |
| `avrdude: stk500_recv()` or similar upload error | Clone board needs a CH340/FTDI driver, or the reset button was held | Install the driver, then hold reset while starting the upload. |
| LED lights in Wokwi, nothing on the board | Code and wiring disagree on the pin, or LED is backwards, or no GND | Check the pin number first, then the long leg, then ground. |
| Nothing happens in Wokwi | `pinMode` missing, or everything is in the wrong half of the sketch | The pin has to be set to `OUTPUT` before `digitalWrite` does anything. |
| Whole row of the breadboard is dead | Legs in the same row, or a lead pushed in at an angle | Pop the parts out and look at the holes. |
| DRC errors in EasyEDA | Unconnected net, or traces too close | Unconnected first: find the missing wire in the schematic, not in the layout. |
| Gerbers arrive as one zip file | That's correct | Don't unzip it before uploading it to the board house. |
| EasyEDA account problems | Unverified email, or a school network blocking signup | Get the accounts created in advance, in session 4 at the latest. |

## Checklists

**Before session 1**

- [ ] Run every session yourself, end to end
- [ ] Kit enough people, plus spares
- [ ] Get the `.epro2` file and the slide deck to hand
- [ ] Confirm everyone has a Wokwi account
- [ ] Test the room's Wi-Fi and projector
- [ ] Post the guide links in your club's channel, not just the session time

**Every session**

- [ ] Demo your own build first, at the front
- [ ] Circulate instead of lecturing — sessions 4 and 5 are floor time
- [ ] Note what got stuck, so the next session can start there
- [ ] Take a photo of the room working, and post it

**After the last session**

- [ ] Every participant has sent you a Gerber file
- [ ] Spot-check each file before ordering
- [ ] Order the batch, plus spares, and keep the receipts
- [ ] Tell participants the delivery estimate
- [ ] Post the finished boards somewhere public

## Where to get help

- `#traces` on Slacker for anything program-related. This is the fastest route to a real answer.
- The [Hack Foundation](https://hack.foundation/) if the question is about grants, or about your club rather than the workshop.
- Me ([@Brenden](https://hackclub.enterprise.slack.com/team/U0A0JJ603N2)) if none of that works. Please come with what you tried first — it's much easier to help, and I write the guides, so I know which step you got past.

---

**Original slides:** [Traces: Guide Slides!](https://www.canva.com/d/qSRdPFCi5AAqwSx)
