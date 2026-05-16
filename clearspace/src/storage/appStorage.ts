import { focusProfiles } from "../data/focusProfiles";
import type {
  CheckInHelped,
  CheckInShift,
  FocusProfileId,
  JournalEntry,
  SupportCheckIn,
  SupportContact,
  ToolkitItem,
} from "../types";

const checkInShifts: CheckInShift[] = [
  "a-little-calmer",
  "about-the-same",
  "more-intense",
];

const checkInHelpedValues: CheckInHelped[] = [
  "grounding-helped",
  "breathing-helped",
  "reassurance-helped",
  "human-support-helped",
];

const focusProfileIds = focusProfiles.map((profile) => profile.id);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isSupportContact(value: unknown): value is SupportContact {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.phone === "string"
  );
}

function isFocusProfileId(value: unknown): value is FocusProfileId {
  return (
    typeof value === "string" &&
    focusProfileIds.includes(value as FocusProfileId)
  );
}

function isToolkitItem(value: unknown): value is ToolkitItem {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    typeof value.checked === "boolean"
  );
}

function isToolkitItems(value: unknown): value is ToolkitItem[] {
  return Array.isArray(value) && value.every(isToolkitItem);
}

function isJournalEntry(value: unknown): value is JournalEntry {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.trigger === "string" &&
    typeof value.helped === "string"
  );
}

function isJournalEntries(value: unknown): value is JournalEntry[] {
  return Array.isArray(value) && value.every(isJournalEntry);
}

function isSupportCheckIn(value: unknown): value is SupportCheckIn {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.createdAt === "string" &&
    (value.source === "breathing" || value.source === "grounding") &&
    typeof value.shift === "string" &&
    checkInShifts.includes(value.shift as CheckInShift) &&
    typeof value.helped === "string" &&
    checkInHelpedValues.includes(value.helped as CheckInHelped)
  );
}

function isSupportCheckIns(value: unknown): value is SupportCheckIn[] {
  return Array.isArray(value) && value.every(isSupportCheckIn);
}

export function migrateToolkitItems(value: unknown): ToolkitItem[] | undefined {
  if (!isStringArray(value)) return undefined;

  return value.map((text, index) => ({
    id: `legacy-toolkit-${index}`,
    text,
    checked: false,
  }));
}

export const storageValidators = {
  boolean: isBoolean,
  focusProfile: isFocusProfileId,
  journalEntries: isJournalEntries,
  nonNegativeInteger: isNonNegativeInteger,
  reassurancePhrases: isStringArray,
  supportCheckIns: isSupportCheckIns,
  supportContact: isSupportContact,
  toolkitItems: isToolkitItems,
};
