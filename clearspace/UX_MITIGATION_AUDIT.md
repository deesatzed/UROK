# ClearSpace UX Mitigation Audit

Date: 2026-05-16

## Scope

This audit records the UX theory risks addressed in the current mitigation pass. It is not clinical validation and does not claim that ClearSpace treats, diagnoses, cures, or prevents high anxiety.

## Findings And Mitigations

| Concern | Risk | Mitigation Implemented |
| --- | --- | --- |
| Choice overload during active stress | Persistent navigation can invite wandering when the user needs one clear flow. | SOS now runs in focus mode without shell side/bottom navigation or settings shortcut. |
| Breathing can backfire | Some users become more alarmed when attention stays on breath. | Breathing includes a "Breathing feels worse" escape to grounding. |
| Repeated reassurance can become stale | The same script every time may lose salience and feel mechanical. | SOS reassurance rotates deterministically across sessions while staying local and scripted. |
| Weak personalization | A single default order ignores breath-sensitive, sensory-overload, and nighttime contexts. | Settings now includes local focus profiles that reorder suggested tools without hiding SOS. |
| Safety behavior reinforcement | A pure soothe loop can become repeated checking instead of learning what helped. | Tool completion routes to an optional local check-in that records what changed and what helped. |
| Unproven effectiveness | The app should not imply guaranteed symptom reduction. | Check-in copy frames results as noticing, not scoring or clinical measurement. |
| Crisis ambiguity | Free-text journal content can include red-flag symptoms or self-harm language. | Journal save runs deterministic red-flag routing before saving and displays urgent support guidance instead of treating the note as ordinary reflection. |

## Remaining Risks

- No clinical outcome study has been run.
- No real-device mobile or screen-reader pass has been completed in this mitigation pass.
- The focus profiles are local heuristic defaults, not personalized clinical recommendations.
- Red-flag detection is deterministic and conservative, but it is not comprehensive medical triage.
- The app remains support-only and should not be positioned as a substitute for therapy, emergency services, or medical evaluation.

## Support flow evaluation

The first cue orients attention to an external object. Touch and visual alternatives let someone choose a sense they can use. Counting, breathing, voice and the check-in are optional. The even four-second timer is an interface choice, without a claim that this ratio, these words, or a particular voice stops an attack. The step sequence and the app itself have not been clinically validated. A self-selected check-in cannot estimate treatment efficacy.

| Decision | Basis |
| --- | --- |
| Offer an adaptable five-senses grounding sequence | [NHS inform grounding exercises](https://www.nhsinform.scot/healthy-living/mental-wellbeing/breathing-and-relaxation-exercises/grounding-exercises) |
| Start breathing at a comfortable pace and let users choose whether to count | [NHS breathing exercises](https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/) |
| Keep urgent help reachable independently of an exercise or journal keyword | [MedlinePlus on recognizing medical emergencies](https://medlineplus.gov/ency/article/001927.htm) and [NICE CG113, section 1.3](https://www.nice.org.uk/guidance/cg113/chapter/recommendations) |
| Address recurrent symptoms and evidence-based care in Practice | [NIMH on panic disorder](https://www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms) and [NICE CG113](https://www.nice.org.uk/guidance/cg113/chapter/recommendations) |

### What to test with people

Invite people with lived experience to try ordinary scenarios on their own phones while comfortable. Do not induce panic. Ask them to start a guide, leave a breath exercise they dislike, find urgent help, and make the guide quiet, without coaching. Record time to first cue, independent completion, mistaken taps, unexpected sound and whether the wording felt assumptive. Include a screen reader session and users who prefer a visual opening. Test the stock voice before investing in voice customization. If anyone cannot reach help or stop audio unaided, fix and observe that task again. Evaluation of symptom or clinical outcomes would need a separate prospective design.
