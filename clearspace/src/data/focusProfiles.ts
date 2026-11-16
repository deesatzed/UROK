import type { FocusProfileId, ViewName } from "../types";

export type FocusProfile = {
  id: FocusProfileId;
  label: string;
  description: string;
  toolOrder: Array<Extract<ViewName, "breathe" | "ground">>;
};

export const focusProfiles: FocusProfile[] = [
  {
    id: "steady",
    label: "Steady default",
    description: "Keep breathing and grounding equally available.",
    toolOrder: ["breathe", "ground"],
  },
  {
    id: "breath-sensitive",
    label: "Breathing feels sensitive",
    description: "Lead with grounding when focusing on breath feels too loud.",
    toolOrder: ["ground", "breathe"],
  },
  {
    id: "sensory-overload",
    label: "Sensory overload",
    description: "Suggest the senses exercise first.",
    toolOrder: ["ground", "breathe"],
  },
  {
    id: "night",
    label: "Nighttime stress",
    description: "Suggest comfortable breathing first.",
    toolOrder: ["breathe", "ground"],
  },
];

export const defaultFocusProfile: FocusProfileId = "steady";

export function getFocusProfile(profileId: FocusProfileId) {
  return (
    focusProfiles.find((profile) => profile.id === profileId) ??
    focusProfiles[0]
  );
}
