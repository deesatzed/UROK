import type { StepDraft } from "../types";

export const emptyStep: StepDraft = {
  activity: "",
  action: "",
  prediction: "",
  source: "mine",
};

export const stepIdeas = [
  {
    label: "Go to a shop",
    activity: "Go to a shop",
    action: "Go inside and look at one thing.",
  },
  {
    label: "Go to an appointment",
    activity: "Go to my appointment",
    action: "Go in and check in at reception.",
  },
  {
    label: "See someone",
    activity: "Spend time with someone",
    action: "Arrange a short visit with someone I choose.",
  },
  {
    label: "Leave the house",
    activity: "Spend a little time outside",
    action: "Walk to a familiar spot nearby.",
  },
  {
    label: "Do something at work",
    activity: "Take part at work",
    action: "Join the first part of a meeting.",
  },
  {
    label: "A step from my therapist",
    activity: "",
    action: "",
    source: "therapist" as const,
  },
];
