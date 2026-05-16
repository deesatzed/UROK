import { useState } from "react";
import { AppShell } from "./components/AppShell";
import { BreathingTool } from "./components/BreathingTool";
import { EducationView } from "./components/EducationView";
import { GroundingTool } from "./components/GroundingTool";
import { HomeView } from "./components/HomeView";
import { JournalView } from "./components/JournalView";
import { SettingsView } from "./components/SettingsView";
import { SosWizard } from "./components/SosWizard";
import { SparkJoyView } from "./components/SparkJoyView";
import { defaultReassurancePhrases } from "./data/reassurance";
import { defaultToolkitItems } from "./data/toolkit";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSpeechGuide } from "./hooks/useSpeechGuide";
import type { JournalEntry, SupportContact, ViewName } from "./types";

const viewLabels: Record<ViewName, string> = {
  home: "Home",
  sos: "Calming Support",
  practice: "Practice",
  settings: "Settings",
  breathe: "Paced Breathing",
  ground: "Grounding",
  journal: "Journal",
  joy: "Spark Joy",
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
  const [toolkitItems, setToolkitItems] = useLocalStorage(
    "toolkit-items",
    defaultToolkitItems,
  );
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>(
    "journal-entries",
    [],
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

  return (
    <AppShell
      currentViewLabel={viewLabels[currentView]}
      lowStimEnabled={lowStimEnabled}
      onHome={() => setCurrentView("home")}
      onToggleLowStim={() => setLowStimEnabled((value) => !value)}
    >
      {currentView === "home" ? (
        <HomeView
          onOpenJoy={() => setCurrentView("joy")}
          onOpenPractice={() => setCurrentView("practice")}
          onOpenSettings={() => setCurrentView("settings")}
          onStartSos={() => setCurrentView("sos")}
        />
      ) : currentView === "sos" ? (
        <SosWizard
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
          onDone={() => setCurrentView("home")}
        />
      ) : currentView === "ground" ? (
        <GroundingTool
          speechGuide={speechGuide}
          onDone={() => setCurrentView("home")}
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
          lowStimEnabled={lowStimEnabled}
          phrases={reassurancePhrases}
          supportContact={supportContact}
          toolkitItems={toolkitItems}
          voiceGuideEnabled={voiceGuideEnabled}
          voiceGuideSupported={speechGuide.supported}
          onBackHome={() => setCurrentView("home")}
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
