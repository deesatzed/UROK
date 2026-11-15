import { useEffect, useState } from "react";
import { UrgentHelp } from "./components/UrgentHelp";
import { loadPack, type PreparedPack } from "./services/voicePack";
import type { OpeningCue } from "./data/guide";
import { AppShell } from "./components/AppShell";
import { BreathingTool } from "./components/BreathingTool";
import { CheckInView } from "./components/CheckInView";
import { EducationView } from "./components/EducationView";
import { GroundingTool } from "./components/GroundingTool";
import { HomeView } from "./components/HomeView";
import { JournalView } from "./components/JournalView";
import { SettingsView } from "./components/SettingsView";
import { SosWizard } from "./components/SosWizard";
import { SparkJoyView } from "./components/SparkJoyView";
import { defaultFocusProfile } from "./data/focusProfiles";
import { defaultReassurancePhrases } from "./data/reassurance";
import { defaultToolkitItems } from "./data/toolkit";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSpeechGuide } from "./hooks/useSpeechGuide";
import { migrateToolkitItems, storageValidators } from "./storage/appStorage";
import type {
  FocusProfileId,
  JournalEntry,
  SupportCheckIn,
  SupportContact,
  ViewName,
} from "./types";

const viewLabels: Record<ViewName, string> = {
  home: "Home",
  sos: "Calming Support",
  practice: "Practice",
  settings: "Settings",
  breathe: "Paced Breathing",
  ground: "Grounding",
  journal: "Journal",
  joy: "Spark Joy",
  checkin: "Check In",
};

const emptySupportContact: SupportContact = {
  name: "",
  phone: "",
};

const createJournalEntryId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

function App() {
  const [currentView, setCurrentView] = useState<ViewName>("home");
  const [checkInSource, setCheckInSource] =
    useState<SupportCheckIn["source"]>("breathing");
  const [lowStimEnabled, setLowStimEnabled] = useLocalStorage(
    "low-stim-enabled",
    false,
    { validate: storageValidators.boolean },
  );
  const [voiceGuideEnabled, setVoiceGuideEnabled] = useLocalStorage(
    "voice-guide-enabled",
    false,
    { validate: storageValidators.boolean },
  );
  const [reassurancePhrases, setReassurancePhrases] = useLocalStorage(
    "reassurance-phrases",
    defaultReassurancePhrases,
    { validate: storageValidators.reassurancePhrases },
  );
  const [supportContact, setSupportContact] = useLocalStorage<SupportContact>(
    "support-contact",
    emptySupportContact,
    { validate: storageValidators.supportContact },
  );
  const [focusProfile, setFocusProfile] = useLocalStorage<FocusProfileId>(
    "focus-profile",
    defaultFocusProfile,
    { validate: storageValidators.focusProfile },
  );
  const [toolkitItems, setToolkitItems] = useLocalStorage(
    "toolkit-items",
    defaultToolkitItems,
    {
      migrate: migrateToolkitItems,
      validate: storageValidators.toolkitItems,
    },
  );
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>(
    "journal-entries",
    [],
    { validate: storageValidators.journalEntries },
  );
  const [supportCheckIns, setSupportCheckIns] = useLocalStorage<
    SupportCheckIn[]
  >("support-check-ins", [], { validate: storageValidators.supportCheckIns });
  const [sosSessionCount, setSosSessionCount] = useLocalStorage(
    "sos-session-count",
    0,
    { validate: storageValidators.nonNegativeInteger },
  );
  const [opening, setOpening] = useLocalStorage<OpeningCue>(
    "opening-cue",
    "surface",
    { validate: (v): v is OpeningCue => v === "surface" || v === "look" },
  );
  const [favorite, setFavorite] = useLocalStorage("favorite-reminder", "", {
    validate: (v): v is string => typeof v === "string",
  });
  const savedPhrase = reassurancePhrases.includes(favorite) ? favorite : "";
  const [pack, setPack] = useState<PreparedPack | null>(null);
  const [voiceOverride, setVoiceOverride] = useState<boolean | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  useEffect(() => {
    let current = true;
    loadPack()
      .then((p) => {
        if (current && p) setPack(p);
      })
      .catch(() => {});
    return () => {
      current = false;
    };
  }, []);
  const speechGuide = useSpeechGuide(
    !helpOpen && (voiceOverride ?? voiceGuideEnabled),
    pack,
    setVoiceOverride,
  );
  const inGuide =
    currentView === "sos" ||
    currentView === "breathe" ||
    currentView === "ground";
  const navigate = (view: ViewName) => {
    speechGuide.stop();
    if (view !== "sos" && view !== "breathe" && view !== "ground")
      setVoiceOverride(null);
    setCurrentView(view);
  };
  const openHelp = () => {
    speechGuide.stop();
    if (inGuide) setVoiceOverride(false);
    setHelpOpen(true);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, "id" | "createdAt">) => {
    setJournalEntries((current) => [
      {
        id: createJournalEntryId(),
        createdAt: new Date().toISOString(),
        ...entry,
      },
      ...current,
    ]);
  };

  const deleteJournalEntry = (entryId: string) => {
    setJournalEntries((current) =>
      current.filter((entry) => entry.id !== entryId),
    );
  };

  const clearJournalEntries = () => {
    setJournalEntries([]);
  };

  const startSos = () => {
    setSosSessionCount((current) => current + 1);
    navigate("sos");
  };

  const finishTool = (source: SupportCheckIn["source"]) => {
    setCheckInSource(source);
    navigate("checkin");
  };

  const addSupportCheckIn = (
    entry: Omit<SupportCheckIn, "id" | "createdAt">,
  ) => {
    setSupportCheckIns((current) => [
      {
        id: createJournalEntryId(),
        createdAt: new Date().toISOString(),
        ...entry,
      },
      ...current,
    ]);
    navigate("home");
  };

  return (
    <AppShell
      currentView={currentView}
      currentViewLabel={viewLabels[currentView]}
      focusMode={inGuide}
      onHelp={openHelp}
      lowStimEnabled={lowStimEnabled}
      onHome={() => navigate("home")}
      onNavigate={navigate}
      onToggleLowStim={() => setLowStimEnabled((value) => !value)}
    >
      {helpOpen && (
        <UrgentHelp
          contact={supportContact}
          onClose={() => setHelpOpen(false)}
        />
      )}
      {currentView === "home" ? (
        <HomeView
          focusProfile={focusProfile}
          lastCheckIn={supportCheckIns[0]}
          onOpenBreathing={() => navigate("breathe")}
          onOpenGrounding={() => navigate("ground")}
          onOpenJoy={() => navigate("joy")}
          onOpenSettings={() => navigate("settings")}
          onStartSos={startSos}
        />
      ) : currentView === "sos" ? (
        <SosWizard
          opening={opening}
          selectedPhrase={savedPhrase}
          focusProfile={focusProfile}
          phraseOffset={Math.max(sosSessionCount - 1, 0)}
          phrases={reassurancePhrases}
          speechGuide={speechGuide}
          supportContact={supportContact}
          onExitHome={() => navigate("home")}
          onExitJournal={() => navigate("journal")}
          onStartBreathing={() => navigate("breathe")}
          onStartGrounding={() => navigate("ground")}
        />
      ) : currentView === "breathe" ? (
        <BreathingTool
          suspended={helpOpen}
          speechGuide={speechGuide}
          onDone={() => finishTool("breathing")}
          onSwitchGrounding={() => navigate("ground")}
        />
      ) : currentView === "ground" ? (
        <GroundingTool
          onSwitchBreathing={() => navigate("breathe")}
          speechGuide={speechGuide}
          onDone={() => finishTool("grounding")}
        />
      ) : currentView === "checkin" ? (
        <CheckInView
          source={checkInSource}
          onSave={addSupportCheckIn}
          onSkip={() => navigate("home")}
        />
      ) : currentView === "practice" ? (
        <EducationView
          onBreathe={() => navigate("breathe")}
          onGround={() => navigate("ground")}
          onPlan={() => navigate("settings")}
          onDone={() => navigate("home")}
        />
      ) : currentView === "journal" ? (
        <JournalView
          entries={journalEntries}
          onBackHome={() => navigate("home")}
          onClearEntries={clearJournalEntries}
          onDeleteEntry={deleteJournalEntry}
          onSaveEntry={addJournalEntry}
        />
      ) : currentView === "joy" ? (
        <SparkJoyView onDone={() => navigate("home")} />
      ) : currentView === "settings" ? (
        <SettingsView
          opening={opening}
          setOpening={setOpening}
          favorite={savedPhrase}
          setFavorite={setFavorite}
          pack={pack}
          onPack={setPack}
          focusProfile={focusProfile}
          lowStimEnabled={lowStimEnabled}
          phrases={reassurancePhrases}
          supportContact={supportContact}
          toolkitItems={toolkitItems}
          voiceGuideEnabled={voiceGuideEnabled}
          voiceGuideSupported={speechGuide.supported}
          onBackHome={() => navigate("home")}
          setFocusProfile={setFocusProfile}
          setLowStimEnabled={setLowStimEnabled}
          setPhrases={setReassurancePhrases}
          setSupportContact={setSupportContact}
          setToolkitItems={setToolkitItems}
          setVoiceGuideEnabled={setVoiceGuideEnabled}
        />
      ) : (
        <section className="placeholder-view" aria-labelledby="view-title">
          <p className="eyebrow">{viewLabels[currentView]}</p>
          <h1 id="view-title">{viewLabels[currentView]} is next.</h1>
          <p>
            This route is wired so the next task can fill it without changing
            the first-screen navigation.
          </p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => navigate("home")}
          >
            Back to home
          </button>
        </section>
      )}
    </AppShell>
  );
}

export default App;
