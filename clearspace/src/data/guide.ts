import reminders from "./reminders.json";
import cues from "./guideCues.json";
export { cues };
export type CueId = keyof typeof cues;
export type OpeningCue = "surface" | "look";
export function spokenCue(id: CueId) {
  return [cues[id].title, cues[id].body].filter(Boolean).join(" ");
}
export const bundledClips = new Map<string, string>(
  (Object.keys(cues) as CueId[]).map((id) => [spokenCue(id), id]),
);

reminders.forEach((text, index) =>
  bundledClips.set(text, "reminder" + (index + 1)),
);
