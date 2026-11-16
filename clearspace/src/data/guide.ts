import reminders from "./reminders.json";
import cues from "./guideCues.json";
import narration from "./guideNarration.json";
export { cues };
export type CueId = keyof typeof cues;
export type OpeningCue = "surface" | "look";
export type VoiceStyle = "gentle" | "brief";
export const voiceStyles: Record<VoiceStyle, string> = {
  gentle: "Gentle guidance",
  brief: "Brief cues",
};
export function spokenCue(id: CueId) {
  return [cues[id].title, cues[id].body].filter(Boolean).join(" ");
}
export function narratedCue(id: CueId, style: VoiceStyle = "gentle") {
  return style === "gentle" && id in narration
    ? narration[id as keyof typeof narration].join(" ")
    : spokenCue(id);
}
export const bundledClips = new Map<string, string>(
  (Object.keys(cues) as CueId[]).map((id) => [spokenCue(id), id]),
);

reminders.forEach((text, index) =>
  bundledClips.set(text, "reminder" + (index + 1)),
);

export function guideAudio(text: string, style: VoiceStyle = "gentle") {
  const id = bundledClips.get(text);
  if (!id) return { text };
  if (style === "gentle" && id in narration) {
    return { text: narratedCue(id as CueId, style), id: `${id}-gentle` };
  }
  return { text, id };
}
