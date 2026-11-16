import { describe, expect, it } from "vitest";
import { packTexts, validPack } from "./voicePack";
import { narratedCue, spokenCue } from "../data/guide";

describe("prepared guide audio", () => {
  it("includes the chosen opening and only an explicitly selected reminder", () => {
    expect(packTexts("look", "  My reminder.  ")).toEqual([
      narratedCue("look"),
      "My reminder.",
      narratedCue("ease"),
      narratedCue("choice"),
    ]);
    expect(packTexts("surface", "")).toEqual([
      narratedCue("surface"),
      narratedCue("ease"),
      narratedCue("choice"),
    ]);
    expect(packTexts("look", narratedCue("look"))).toHaveLength(3);
    expect(packTexts("surface", "", "brief")).toEqual([
      spokenCue("surface"), spokenCue("ease"), spokenCue("choice"),
    ]);
  });

  it("ignores malformed saved packs and unknown voices", () => {
    const clip = {
      text: "My cue",
      audio: new Blob([new Uint8Array(100)], { type: "audio/wav" }),
    };
    const voice = "default_b78b28baf5c31a1d";
    expect(validPack({ voice, clips: [clip] })).toBe(true);
    for (const pack of [
      null,
      { voice: "__proto__", clips: [clip] },
      { voice, clips: [], style: "unknown" },
      { voice, clips: [] },
      { voice, clips: Array(5).fill(clip) },
      { voice, clips: [{ text: "My cue", audio: "https://example.com" }] },
    ]) {
      expect(validPack(pack)).toBe(false);
    }
  });
});
