export type ViewName =
  | "home"
  | "sos"
  | "practice"
  | "settings"
  | "breathe"
  | "ground"
  | "journal"
  | "joy"
  | "checkin"
  | "before"
  | "after"
  | "steps"
  | "worry"
  | "pattern";

export type StepDraft = {
  activity: string;
  action: string;
  prediction: string;
  source: "mine" | "therapist";
};

export type StepAttempt = {
  id: string;
  createdAt: string;
  happened: string;
  learned: string;
};

export type ReflectionDraft = {
  happened: string;
  learned: string;
};

export type SmallStep = StepDraft & {
  id: string;
  createdAt: string;
  attempts: StepAttempt[];
};

export type FocusProfileId =
  | "steady"
  | "breath-sensitive"
  | "sensory-overload"
  | "night";

export type SupportContact = {
  name: string;
  phone: string;
};

export type ToolkitItem = {
  id: string;
  text: string;
  checked: boolean;
};

export type JournalEntry = {
  id: string;
  createdAt: string;
  trigger: string;
  helped: string;
};

export type CheckInShift =
  | "a-little-calmer"
  | "about-the-same"
  | "more-intense";

export type CheckInHelped =
  | "grounding-helped"
  | "breathing-helped"
  | "reassurance-helped"
  | "human-support-helped";

export type SupportCheckIn = {
  id: string;
  createdAt: string;
  source: "breathing" | "grounding";
  shift: CheckInShift;
  helped?: CheckInHelped;
};

export type AppPreferences = {
  reassurancePhrases: string[];
  supportContact: SupportContact;
  focusProfile: FocusProfileId;
  lowStimEnabled: boolean;
  voiceGuideEnabled: boolean;
  toolkitItems: ToolkitItem[];
  journalEntries: JournalEntry[];
  supportCheckIns: SupportCheckIn[];
};
