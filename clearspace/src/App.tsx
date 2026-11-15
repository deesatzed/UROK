import { useEffect, useState } from "react";
import { AftercareView } from "./components/AftercareView";
import { StepsView } from "./components/StepsView";
import { WorryView } from "./components/WorryView";
import { PanicPattern } from "./components/PanicPattern";
import { SupportCard, defaultSupportMessage } from "./components/SupportCard";
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
import {
  isSmallSteps,
  migrateToolkitItems,
  storageValidators,
} from "./storage/appStorage";
import type {
  FocusProfileId,
  JournalEntry,
  SupportCheckIn,
  SupportContact,
  ViewName,
  SmallStep,
  StepDraft,
  StepAttempt,
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
  before: "Before an activity",
  after: "Aftercare",
  steps: "My steps",
  worry: "Working with worry",
  pattern: "My panic pattern",
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
  const [smallSteps, setSmallSteps] = useLocalStorage<SmallStep[]>(
    "small-steps",
    [],
    { validate: isSmallSteps },
  );
  const [supportMessage, setSupportMessage] = useLocalStorage(
    "support-message",
    defaultSupportMessage,
    {
      validate: (value): value is string =>
        typeof value === "string" && value.length <= 500,
    },
  );
  const [selectedStepId, setSelectedStepId] = useState<string>();
  const [cardOpen, setCardOpen] = useState(false);
  const [checkInAvailable, setCheckInAvailable] = useState(false);
  const saveSmallStep = (draft: StepDraft, id?: string) => {
    const stepId = id ?? createJournalEntryId();
    const plan: SmallStep = {
      ...draft,
      id: stepId,
      createdAt: new Date().toISOString(),
      attempts: [],
    };
    setSmallSteps((current) =>
      id
        ? current.map((item) => (item.id === id ? { ...item, ...draft } : item))
        : [plan, ...current],
    );
    return stepId;
  };
  const recordStep = (
    id: string,
    attempt: Omit<StepAttempt, "id" | "createdAt">,
  ) => {
    const entry = {
      ...attempt,
      id: createJournalEntryId(),
      createdAt: new Date().toISOString(),
    };
    setSmallSteps((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, attempts: [...item.attempts, entry] }
          : item,
      ),
    );
  };
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
    !helpOpen && !cardOpen && (voiceOverride ?? voiceGuideEnabled),
    pack,
    setVoiceOverride,
  );
  const inGuide =
    currentView === "sos" ||
    currentView === "breathe" ||
    currentView === "ground";
  const navigate = (view: ViewName) => {
    speechGuide.stop();
    if (!["sos", "breathe", "ground", "after", "worry"].includes(view))
      setVoiceOverride(null);
    setCurrentView(view);
  };
  const openSteps = (id?: string) => {
    setSelectedStepId(id);
    navigate("steps");
  };
  const openCard = () => {
    speechGuide.stop();
    setVoiceOverride(false);
    setCardOpen(true);
  };
  const openHelp = () => {
    speechGuide.stop();
    setVoiceOverride(false);
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
    setCheckInAvailable(false);
    setSosSessionCount((current) => current + 1);
    navigate("sos");
  };

  const finishTool = (source: SupportCheckIn["source"]) => {
    setCheckInSource(source);
    setCheckInAvailable(true);
    navigate("after");
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
      focusMode={
        inGuide ||
        currentView === "after" ||
        currentView === "worry" ||
        currentView === "before"
      }
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
          nextStep={smallSteps[0]}
          onBefore={() => {
            setSelectedStepId(undefined);
            navigate("before");
          }}
          onAfter={() => {
            setCheckInAvailable(false);
            navigate("after");
          }}
          onPractice={() => navigate("practice")}
          onOpenStep={openSteps}
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
          onAfter={() => navigate("after")}
          onExitJournal={() => navigate("journal")}
          onStartBreathing={() => navigate("breathe")}
          onStartGrounding={() => navigate("ground")}
        />
      ) : currentView === "breathe" ? (
        <BreathingTool
          suspended={helpOpen || cardOpen}
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
      ) : currentView === "after" ? (
        <AftercareView
          guide={speechGuide}
          contact={supportContact}
          checkInAvailable={checkInAvailable}
          onSupport={startSos}
          onHome={() => navigate("home")}
          onSteps={() => openSteps()}
          onJournal={() => navigate("journal")}
          onCheckIn={() => navigate("checkin")}
        />
      ) : currentView === "steps" || currentView === "before" ? (
        <StepsView
          key={currentView}
          plans={smallSteps}
          initialId={selectedStepId}
          anticipatory={currentView === "before"}
          onSave={saveSmallStep}
          onRecord={recordStep}
          onDelete={(id) =>
            setSmallSteps((current) => current.filter((s) => s.id !== id))
          }
          onHome={() => navigate("home")}
          onWorry={() => navigate("worry")}
          onSupport={startSos}
        />
      ) : currentView === "worry" ? (
        <WorryView
          guide={speechGuide}
          onHome={() => navigate("home")}
          onPlan={() => openSteps()}
          onSupport={startSos}
        />
      ) : currentView === "pattern" ? (
        <PanicPattern
          onDone={() => navigate("practice")}
          onPlan={() => openSteps()}
        />
      ) : currentView === "practice" ? (
        <EducationView
          focusProfile={focusProfile}
          onBreathe={() => navigate("breathe")}
          onGround={() => navigate("ground")}
          onPlan={() => navigate("settings")}
          onSteps={() => openSteps()}
          onPattern={() => navigate("pattern")}
          onWorry={() => navigate("worry")}
          onJoy={() => navigate("joy")}
          onJournal={() => navigate("journal")}
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
          supportMessage={supportMessage}
          setSupportMessage={setSupportMessage}
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
      ) : null}
      {(inGuide || currentView === "after") && (
        <div className="support-options">
          <button className="text-action" onClick={openCard}>
            Show someone what I need
          </button>
        </div>
      )}
      {cardOpen && (
        <SupportCard
          message={supportMessage}
          onClose={() => setCardOpen(false)}
        />
      )}
    </AppShell>
  );
}

export default App;
