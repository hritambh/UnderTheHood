# Playbook: Security Engineering

Use this after `add-topic` has picked the `security` track.
Guide for the sections: `formats/security.md`.

## Scope the topic

- Work out which kind it is:
  - **An attack** ("SQL Injection"): explain the attack, then the defence.
  - **A defence** ("Secrets Management"): in `attack`, explain what an attacker does when it is missing.
- The purpose is always defence. Explain an attack well enough that a developer can spot and fix the bug in their own code, and stop there.
- If the topic is how login or permissions work in general, it belongs in `core-concepts`. A real breach told as a story belongs in `incidents`. Go back to routing.
- Title: the usual name of the attack or the defence.

## Limits for this track

- Show vulnerable code and one simple input that triggers it. Don't write attack tools, scanners, or steps for attacking a real site.
- Never use a real company, site or person as the target. Use `example.com` and made-up names.
- Every vulnerable example is followed by its fixed version.
- Don't invent security advice. If you are not sure a defence works, check a trusted source such as OWASP, or leave it out.

## Work in this order

The file order is fixed by the guide. This is the order to think in.

1. **`vulnerable`.** Write the smallest piece of code that has the bug, and the input that triggers it. Mark the exact line that is wrong.
2. **`defence`.** Fix that same code. Explain why the fix works, not only what changed.
3. **Check the fix.** Take the triggering input from step 1 and walk it through the fixed code. It must no longer work.
4. **`attack`.** The steps from the attacker's first move to the damage, and the diagram.
5. **`impact`.** What the attacker gets, concretely.
6. **`layers`.** Other protections that limit the damage if the main fix is missed somewhere. At least two.
7. **`detect`.** How to find the bug before attackers do, and how to notice an attack.
8. **`mistakes`.** Fixes that look right but aren't. This is often the most useful section.
9. **`tradeoffs`.**
10. **`realWorld`.** An everyday story with the same shape.
11. **`interview`.**
12. **`what`**, then **`revision`**.

## Keep it short and visual

The reader wants to understand this well enough to explain it and use it. Everything past that is weight.

- Budget: **about 2,500 words** for the whole topic, 100 to 200 per section, 300 at the very most. It is a target, not a wall: a subject that genuinely needs more room gets it. Full rule: `TOPIC_STYLE.md` part 7.
- **Draw first.** Sketch the two diagrams before writing prose: the attacker's path in `attack`, and where the fix sits in `defence`. Then write only what the diagrams don't already say.
- A table beats three paragraphs comparing things. A numbered list beats a paragraph of steps.
- Say the useful thing in a section, then stop. A short section is not a thin one.
- **Cutting pass, every time.** Run `npm run build`, take the section it flags as longest, cut what repeats, turn the longest explanation left into a diagram or a table. Build again. Repeat until every sentence left is earning its place.
- First thing to cut here: extra payload variations. One attack, one fix, then the layers.

## Traps in this track

- A fix that does not close the hole shown.
- Vulnerable code with no fixed version next to it.
- Defences listed with nothing about what each one stops.
- "Sanitise the input" with no detail. Say exactly what to do.
- Real targets, or more attack detail than a developer needs to fix their own code.

## Checks before you finish

- [ ] The triggering input from `vulnerable` no longer works against the code in `defence`.
- [ ] Every vulnerable example has a fixed version.
- [ ] `layers` has at least two more protections, each with what it stops.
- [ ] `mistakes` lists wrong fixes, with why each fails.
- [ ] No real company, site or person is used as a target.
- [ ] Every defence is one you are sure works.
- [ ] Every "Must have" item in the guide is there.
- [ ] The build prints no length or diagram `Note:` for the topic.
- [ ] Two diagrams at least, where the guide says they go.
- [ ] The cutting pass was actually done, not just planned.
