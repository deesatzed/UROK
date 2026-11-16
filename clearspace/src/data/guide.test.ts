import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import manifest from "../../public/voices/manifest.json";
import narration from "./guideNarration.json";
import { bundledClips, cues, guideAudio, narratedCue, spokenCue, type CueId } from "./guide";

describe("spoken guide content", () => {
  it("defaults to gentle narration and keeps brief cues available", () => {
    const text = spokenCue("surface");
    expect(guideAudio(text)).toEqual({ id: "surface-gentle", text: narratedCue("surface") });
    expect(guideAudio(text, "brief")).toEqual({ id: "surface", text });
    expect(narratedCue("surface").length).toBeGreaterThan(text.length);
    expect(guideAudio("My own words.")).toEqual({ text: "My own words." });
  });

  it("ships recordings for every brief cue, reminder and gentle narration with matching text", () => {
    const expected = new Map(bundledClips);
    for (const id of Object.keys(narration) as (keyof typeof narration)[]) {
      expected.set(narratedCue(id), `${id}-gentle`);
    }
    expect(Object.keys(manifest.clips)).toHaveLength(expected.size);
    for (const [text, id] of expected) {
      const clip = manifest.clips[id as keyof typeof manifest.clips];
      expect(clip.text, id).toBe(text);
      const bytes = readFileSync(`public/voices/${id}.mp3`);
      expect(createHash("sha256").update(bytes).digest("hex"), id).toBe(clip.sha256);
      expect(clip.durationSeconds).toBeGreaterThan(0);
    }
  });

  it("keeps the optional breathing count short enough for its interval", () => {
    for (const id of ["breathIn", "breathOut"] as CueId[]) {
      expect(narratedCue(id)).toBe(spokenCue(id));
      const clip = manifest.clips[id as keyof typeof manifest.clips];
      expect(clip.durationSeconds).toBeLessThan(4);
    }
  });

  it("offers one detail without a compulsory numbered grounding target", () => {
    for (const id of ["see", "touch", "hear", "smell", "taste"] as CueId[]) {
      expect(cues[id].title).not.toMatch(/\d/);
    }
  });
});
