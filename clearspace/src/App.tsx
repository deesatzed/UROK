import { useState } from "react";
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
  );
  const [voiceGuideEnabled, setVoiceGuideEnabled] = useLocalStorage(
    "voice-guide-enabled",
    false,
  );
  const [reassurancePhrases, setReassurancePhrases] = useLocalStorage(
    "reassurance-phrases",
    defaultReassurancePhrases,
  );
  const [supportContact, setSupportContact] = useLocalStorage<SupportContact>(
    "support-contact",
    emptySupportContact,
  );
  const [focusProfile, setFocusProfile] = useLocalStorage<FocusProfileId>(
    "focus-profile",
    defaultFocusProfile,
  );
  const [toolkitItems, setToolkitItems] = useLocalStorage(
    "toolkit-items",
    defaultToolkitItems,
  );
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>(
    "journal-entries",
    [],
  );
  const [supportCheckIns, setSupportCheckIns] = useLocalStorage<SupportCheckIn[]>(
    "support-check-ins",
    [],
  );
  const [sosSessionCount, setSosSessionCount] = useLocalStorage(
    "sos-session-count",
    0,
  );
  const speechGuide = useSpeechGuide(voiceGuideEnabled);

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
    setCurrentView("sos");
  };

  const finishTool = (source: SupportCheckIn["source"]) => {
    setCheckInSource(source);
    setCurrentView("checkin");
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
    setCurrentView("home");
  };

  return (
    <AppShell
      currentView={currentView}
      currentViewLabel={viewLabels[currentView]}
      focusMode={currentView === "sos"}
      lowStimEnabled={lowStimEnabled}
      onHome={() => setCurrentView("home")}
      onNavigate={setCurrentView}
      onToggleLowStim={() => setLowStimEnabled((value) => !value)}
    >
      {currentView === "home" ? (
        <HomeView
          focusProfile={focusProfile}
          lastCheckIn={supportCheckIns[0]}
          onOpenBreathing={() => setCurrentView("breathe")}
          onOpenGrounding={() => setCurrentView("ground")}
          onOpenJoy={() => setCurrentView("joy")}
          onOpenPractice={() => setCurrentView("practice")}
          onOpenSettings={() => setCurrentView("settings")}
          onStartSos={startSos}
        />
      ) : currentView === "sos" ? (
        <SosWizard
          focusProfile={focusProfile}
          phraseOffset={Math.max(sosSessionCount - 1, 0)}
          phrases={reassurancePhrases}
          speechGuide={speechGuide}
          supportContact={supportContact}
          onExitHome={() => setCurrentView("home")}
          onExitJournal={() => setCurrentView("journal")}
          onStartBreathing={() => setCurrentView("breathe")}
          onStartGrounding={() => setCurrentView("ground")}
        />
      ) : currentView === "breathe" ? (
        <BreathingTool
          speechGuide={speechGuide}
          onDone={() => finishTool("breathing")}
          onSwitchGrounding={() => setCurrentView("ground")}
        />
      ) : currentView === "ground" ? (
        <GroundingTool
          speechGuide={speechGuide}
          onDone={() => finishTool("grounding")}
        />
      ) : currentView === "checkin" ? (
        <CheckInView
          source={checkInSource}
          onSave={addSupportCheckIn}
          onSkip={() => setCurrentView("home")}
        />
      ) : currentView === "practice" ? (
        <EducationView onDone={() => setCurrentView("home")} />
      ) : currentView === "journal" ? (
        <JournalView
          entries={journalEntries}
          onBackHome={() => setCurrentView("home")}
          onClearEntries={clearJournalEntries}
          onDeleteEntry={deleteJournalEntry}
          onSaveEntry={addJournalEntry}
        />
      ) : currentView === "joy" ? (
        <SparkJoyView onDone={() => setCurrentView("home")} />
      ) : currentView === "settings" ? (
        <SettingsView
          focusProfile={focusProfile}
          lowStimEnabled={lowStimEnabled}
          phrases={reassurancePhrases}
          supportContact={supportContact}
          toolkitItems={toolkitItems}
          voiceGuideEnabled={voiceGuideEnabled}
          voiceGuideSupported={speechGuide.supported}
          onBackHome={() => setCurrentView("home")}
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
            onClick={() => setCurrentView("home")}
          >
            Back to home
          </button>
        </section>
      )}
    </AppShell>
  );
}

export default App;
