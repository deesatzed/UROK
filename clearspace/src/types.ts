export type ViewName =
  | "home"
  | "sos"
  | "practice"
  | "settings"
  | "breathe"
  | "ground"
  | "journal"
  | "joy";

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

export type AppPreferences = {
  reassurancePhrases: string[];
  supportContact: SupportContact;
  lowStimEnabled: boolean;
  voiceGuideEnabled: boolean;
  toolkitItems: ToolkitItem[];
  journalEntries: JournalEntry[];
};
