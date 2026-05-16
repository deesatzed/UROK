import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Wind, 
  Eye, 
  Info, 
  Settings, 
  ShieldAlert, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Circle,
  Plus,
  Trash2,
  Volume2,
  Moon,
  BookHeart,
  Calendar
} from 'lucide-react';

// --- Default Data Based on User Prompt ---
const defaultPhrases = [
  "This is a stress wave. It feels intense, but it will pass.",
  "My body's alarm system is misfiring. I am not in danger.",
  "This has happened before, and I got through it.",
  "I am safe right here, right now.",
  "I am riding the wave. It will peak and then fade."
];

const educationData = [
  {
    title: "What Is Happening",
    content: "A stress wave is your body's built-in alarm system — the 'fight-or-flight' response — firing when there is no real danger. Stress hormones like adrenaline flood your body, causing a racing heart, fast breathing, sweating, and other intense sensations. These symptoms feel frightening, but they are not harmful. A stress wave usually peaks within a few minutes and then fades on its own."
  },
  {
    title: "What Not to Do",
    items: [
      "Do not fight the feeling or tell yourself you must stop it immediately — resistance often makes it worse.",
      "Do not take rapid, deep breaths — this can cause hyperventilation and more lightheadedness.",
      "Do not use alcohol or other substances to try to calm down — these can worsen anxiety over time.",
      "Do not avoid places or activities because of fear of another wave — avoidance can make high anxiety harder to work through over time."
    ]
  },
  {
    title: "Build a Stress Toolkit",
    content: "Keep a small kit in your bag, car, or desk with items that help you:",
    items: [
      "Very sour candy",
      "A bottle of water",
      "Headphones with calming audio",
      "A written card with your coping steps",
      "Ice pack or cooling towel"
    ]
  }
];

export default function App() {
  // --- State Management ---
  const [currentView, setCurrentView] = useState('home'); // home, sos, breathe, ground, learn, settings, journal
  const [customPhrases, setCustomPhrases] = useState(defaultPhrases);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [supportContact, setSupportContact] = useState({ name: '', phone: '' });
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [toolkit, setToolkit] = useState([
    { id: 1, text: "Very sour candy", checked: false },
    { id: 2, text: "A bottle of water", checked: false },
    { id: 3, text: "Headphones", checked: false },
    { id: 4, text: "Coping card", checked: false }
  ]);

  // --- Views ---
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView setView={setCurrentView} />;
      case 'sos':
        return <SOSWizard setView={setCurrentView} phrases={customPhrases} voiceEnabled={voiceEnabled} supportContact={supportContact} />;
      case 'breathe':
        return <BreathingTool setView={setCurrentView} voiceEnabled={voiceEnabled} />;
      case 'ground':
        return <GroundingTool setView={setCurrentView} />;
      case 'learn':
        return <EducationView setView={setCurrentView} />;
      case 'journal':
        return <JournalView setView={setCurrentView} addEntry={(entry) => setJournalEntries([entry, ...journalEntries])} />;
      case 'settings':
        return <SettingsView 
                 setView={setCurrentView} 
                 phrases={customPhrases} 
                 setPhrases={setCustomPhrases} 
                 toolkit={toolkit}
                 setToolkit={setToolkit}
                 voiceEnabled={voiceEnabled}
                 setVoiceEnabled={setVoiceEnabled}
                 supportContact={supportContact}
                 setSupportContact={setSupportContact}
                 darkModeEnabled={darkModeEnabled}
                 setDarkModeEnabled={setDarkModeEnabled}
                 journalEntries={journalEntries}
               />;
      default:
        return <HomeView setView={setCurrentView} />;
    }
  };

  return (
    <div className={`min-h-screen text-slate-800 font-sans selection:bg-teal-200 transition-colors duration-500 ${darkModeEnabled ? 'bg-slate-900 low-stim' : 'bg-slate-50'}`}>
      <div className={`max-w-md mx-auto min-h-screen shadow-lg sm:rounded-none md:rounded-2xl md:my-8 md:min-h-[850px] overflow-hidden relative flex flex-col transition-colors duration-500 ${darkModeEnabled ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
        {/* Header */}
        <header className={`px-6 py-5 flex justify-between items-center border-b z-10 sticky top-0 transition-colors duration-500 ${darkModeEnabled ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <button 
            onClick={() => setCurrentView('home')}
            className="text-xl font-semibold text-teal-800 flex items-center gap-2 tracking-tight"
          >
            <Wind className="w-6 h-6 text-teal-500" />
            ClearSpace
          </button>
          {currentView !== 'settings' && (
            <button 
              onClick={() => setCurrentView('settings')}
              className="p-2 text-slate-400 hover:text-teal-600 transition-colors rounded-full hover:bg-slate-50"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

// --- Home Dashboard ---
function HomeView({ setView }) {
  return (
    <div className="p-6 flex flex-col h-full animate-fade-in items-center justify-center pb-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-light text-slate-600 mb-3">Hello.</h1>
        <p className="text-slate-500 text-lg px-4">I am here to help you navigate this safely.</p>
      </div>

      {/* SOS Button - The ONLY button on the home screen */}
      <button 
        onClick={() => setView('sos')}
        className="w-full max-w-xs bg-teal-600 hover:bg-teal-700 text-white rounded-[3rem] p-10 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex flex-col items-center justify-center gap-6 group"
      >
        <div className="bg-white/20 p-6 rounded-full group-hover:scale-110 transition-transform">
          <Wind className="w-12 h-12 text-white" />
        </div>
        <div>
          <span className="block text-2xl font-bold mb-1 text-center">Calming Mantra</span>
          <span className="text-teal-100 text-sm text-center block tracking-wide uppercase font-semibold">Tap to begin</span>
        </div>
      </button>
    </div>
  );
}

// --- Active SOS Wizard ---
function SOSWizard({ setView, phrases, voiceEnabled, supportContact }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "First, plant your feet.",
      content: "Sit down if you can. Press both feet firmly into the floor. Notice the chair supporting you and the ground beneath you.",
      action: "I am grounded"
    },
    {
      title: "Read this to yourself:",
      content: phrases[Math.floor(Math.random() * phrases.length)], // Pick a random user phrase
      action: "Next"
    },
    {
      title: "Release muscle tension.",
      content: "Drop your shoulders. Unclench your jaw. Open your hands. Let your tongue rest loosely in your mouth.",
      action: "I have let go"
    },
    {
      title: "Reduce stimulation.",
      content: "If possible, step away from noise, crowds, or bright lights for a few minutes.",
      action: "Okay, next"
    },
    {
      title: "What do you need right now?",
      content: "Your body's alarm system is misfiring, but you are not in danger. Would you like to do a breathing exercise or a grounding exercise?",
      isBranch: true
    }
  ];

  const currentStep = steps[step];

  // Speech Synthesis Effect
  useEffect(() => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const textToSpeak = `${currentStep.title}. ${currentStep.content}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.85; // Slower rate for calmness
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
    
    // Cleanup on unmount or step change
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  }, [step, voiceEnabled, currentStep]);

  return (
    <div className="flex flex-col h-full bg-teal-800 text-teal-50 animate-fade-in absolute inset-0 z-20">
      <div className="flex justify-between items-center p-6 pb-0">
        <span className="text-teal-300 text-sm font-medium">Guided Support</span>
        <button 
          onClick={() => setView('journal')}
          className="text-teal-200 hover:text-white text-sm bg-teal-700/50 px-4 py-2 rounded-full transition-colors"
        >
          Exit
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white leading-tight animate-slide-up">
          {currentStep.title}
        </h2>
        <p className="text-xl text-teal-100 mb-12 max-w-sm leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
          {currentStep.content}
        </p>

        {!currentStep.isBranch ? (
          <button 
            onClick={() => setStep(s => Math.min(s + 1, steps.length - 1))}
            className="bg-white text-teal-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-teal-50 hover:scale-105 transition-all shadow-lg animate-slide-up flex items-center gap-2"
            style={{animationDelay: '0.2s'}}
          >
            {currentStep.action} <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex flex-col gap-4 w-full max-w-xs animate-slide-up" style={{animationDelay: '0.2s'}}>
            <button 
              onClick={() => setView('breathe')}
              className="bg-white text-teal-800 px-6 py-4 rounded-2xl font-semibold text-lg hover:bg-teal-50 transition-colors shadow-lg w-full"
            >
              Start Breathing
            </button>
            <button 
              onClick={() => setView('ground')}
              className="bg-teal-700 text-white px-6 py-4 rounded-2xl font-semibold text-lg hover:bg-teal-600 transition-colors shadow-lg border border-teal-600 w-full"
            >
              5-4-3-2-1 Grounding
            </button>
          </div>
        )}

        {/* Emergency Support Contact Button */}
        {supportContact.phone && (
          <a 
            href={`tel:${supportContact.phone}`}
            className="mt-12 text-teal-300 hover:text-white flex items-center gap-2 text-sm bg-teal-900/30 px-6 py-3 rounded-full transition-colors animate-slide-up"
            style={{animationDelay: '0.3s'}}
          >
            <Heart className="w-4 h-4" /> Call {supportContact.name || "Support"}
          </a>
        )}
      </div>

      <div className="p-6 flex justify-center gap-2">
        {steps.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-2 rounded-full transition-all duration-500 ${idx === step ? 'w-8 bg-teal-300' : 'w-2 bg-teal-700'}`}
          />
        ))}
      </div>
    </div>
  );
}

// --- Breathing Tool ---
function BreathingTool({ setView, voiceEnabled }) {
  const [phase, setPhase] = useState('inhale'); // inhale, outhale
  const [timeLeft, setTimeLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);

  // Function to trigger haptic feedback
  const triggerHaptic = (duration) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Switch phases
            if (phase === 'inhale') {
              setPhase('exhale');
              triggerHaptic([100, 50, 100]); // double pulse for exhale
              if (voiceEnabled && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  window.speechSynthesis.speak(new SpeechSynthesisUtterance("Breathe out slowly"));
              }
              return 6; // Exhale for 6 seconds
            } else {
              setPhase('inhale');
              triggerHaptic([200]); // single long pulse for inhale
              if (voiceEnabled && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  window.speechSynthesis.speak(new SpeechSynthesisUtterance("Breathe in gently"));
              }
              return 4; // Inhale for 4 seconds
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase, voiceEnabled]);

  const getPhaseText = () => {
    if (!isActive) return "Tap to begin";
    return phase === 'inhale' ? "Breathe In..." : "Breathe Out slowly...";
  };

  const getInstructionText = () => {
    if (!isActive) return "We will breathe in for 4 seconds, and out for 6 seconds. Try to breathe into your belly.";
    return phase === 'inhale' ? "Gently through your nose" : "Slowly through your mouth";
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="p-4">
        <button onClick={() => setView('home')} className="flex items-center text-slate-500 hover:text-slate-800">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">Paced Breathing</h2>
        <p className="text-slate-500 mb-12 max-w-xs">{getInstructionText()}</p>

        {/* Breathing Circle Visualizer */}
        <div 
          className="relative w-64 h-64 flex items-center justify-center cursor-pointer select-none"
          onClick={() => setIsActive(!isActive)}
        >
          {/* Pulsing background ring */}
          <div className={`absolute inset-0 bg-blue-100 rounded-full transition-all ease-in-out ${isActive ? (phase === 'inhale' ? 'scale-100 duration-[4000ms]' : 'scale-75 duration-[6000ms]') : 'scale-90 duration-500'}`} />
          
          {/* Main circle */}
          <div className={`absolute inset-4 bg-blue-500 rounded-full shadow-lg transition-all ease-in-out flex items-center justify-center flex-col text-white ${isActive ? (phase === 'inhale' ? 'scale-100 duration-[4000ms]' : 'scale-75 duration-[6000ms]') : 'scale-90 duration-500'}`}>
            <span className="text-xl font-medium mb-1 drop-shadow-sm">{getPhaseText()}</span>
            {isActive && <span className="text-4xl font-bold drop-shadow-md">{timeLeft}</span>}
          </div>
        </div>

        <button 
          onClick={() => setIsActive(!isActive)}
          className="mt-16 px-8 py-3 rounded-full bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 transition-colors"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  );
}

// --- Grounding Tool (5-4-3-2-1) ---
function GroundingTool({ setView }) {
  const steps = [
    { count: 5, sense: "things you can see", icon: "👀", hint: "Look around you. Notice shapes, colors, or shadows." },
    { count: 4, sense: "things you can touch", icon: "✋", hint: "Feel your clothing, the chair, or the temperature of the air." },
    { count: 3, sense: "things you can hear", icon: "👂", hint: "Listen for sounds outside, hum of appliances, or your own breath." },
    { count: 2, sense: "things you can smell", icon: "👃", hint: "Is there a scent in the room? Or simply the smell of fresh air." },
    { count: 1, sense: "thing you can taste", icon: "👅", hint: "Take a sip of water, or notice the current taste in your mouth." }
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [completedItems, setCompletedItems] = useState([]);

  const toggleItem = (index) => {
    if (completedItems.includes(index)) {
      setCompletedItems(completedItems.filter(i => i !== index));
    } else {
      const newItems = [...completedItems, index];
      setCompletedItems(newItems);
      // Auto-advance if all items in current step are checked
      if (newItems.filter(i => i >= 0 && i < steps[activeStep].count).length === steps[activeStep].count) {
        if (activeStep < steps.length - 1) {
          setTimeout(() => {
            setActiveStep(prev => prev + 1);
            setCompletedItems([]); // reset for next view
          }, 600);
        }
      }
    }
  };

  const isComplete = activeStep === steps.length - 1 && completedItems.length === steps[activeStep].count;

  return (
    <div className="flex flex-col h-full animate-fade-in bg-indigo-50">
      <div className="p-4 flex justify-between items-center">
        <button onClick={() => setView('home')} className="flex items-center text-indigo-700 font-medium">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <span className="text-indigo-400 text-sm font-semibold tracking-widest">5-4-3-2-1</span>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        {!isComplete ? (
          <>
            <div className="text-center mb-8 animate-slide-up">
              <span className="text-6xl mb-4 block">{steps[activeStep].icon}</span>
              <h2 className="text-2xl font-bold text-indigo-900 mb-2">
                Name {steps[activeStep].count} {steps[activeStep].sense}
              </h2>
              <p className="text-indigo-600/80">{steps[activeStep].hint}</p>
            </div>

            <div className="space-y-3 flex-1">
              {Array.from({ length: steps[activeStep].count }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleItem(idx)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                    completedItems.includes(idx) 
                      ? 'bg-indigo-600 text-white shadow-md transform scale-[1.02]' 
                      : 'bg-white text-indigo-900 border border-indigo-100 hover:border-indigo-300'
                  }`}
                >
                  {completedItems.includes(idx) ? (
                    <CheckCircle2 className="w-6 h-6 text-indigo-200" />
                  ) : (
                    <Circle className="w-6 h-6 text-indigo-200" />
                  )}
                  <span className={`font-medium ${completedItems.includes(idx) ? 'line-through text-indigo-200' : ''}`}>
                    Item {idx + 1}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="flex justify-center mt-6 gap-2">
              {steps.map((_, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full ${idx === activeStep ? 'bg-indigo-600' : 'bg-indigo-200'}`} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 text-indigo-500">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Well Done.</h2>
            <p className="text-indigo-700 mb-8 max-w-xs">You have grounded yourself in the present moment. How are you feeling now?</p>
            <button 
              onClick={() => setView('home')}
              className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold shadow-md hover:bg-indigo-700"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Post-Episode Journaling ---
function JournalView({ setView, addEntry }) {
  const [trigger, setTrigger] = useState('');
  const [helped, setHelped] = useState('');

  const handleSave = () => {
    if (trigger.trim() || helped.trim()) {
      addEntry({
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        trigger: trigger.trim(),
        helped: helped.trim()
      });
    }
    setView('home');
  };

  return (
    <div className="flex flex-col h-full animate-fade-in bg-white p-6">
      <div className="flex-1 flex flex-col mt-4">
        <div className="mb-8 text-center animate-slide-up">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookHeart className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Take a breath.</h2>
          <p className="text-slate-500">You did a great job navigating that. Would you like to note down what happened?</p>
        </div>

        <div className="space-y-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">What triggered this? (Optional)</label>
            <textarea 
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="E.g. A stressful email, feeling crowded..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">What helped the most?</label>
            <textarea 
              value={helped}
              onChange={(e) => setHelped(e.target.value)}
              placeholder="E.g. The grounding exercise, cold water..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px] resize-none"
            />
          </div>
        </div>

        <div className="mt-auto pt-8 flex flex-col gap-3 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <button 
            onClick={handleSave}
            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-semibold shadow-md hover:bg-teal-700 transition-colors"
          >
            Save & Exit
          </button>
          <button 
            onClick={() => setView('home')}
            className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-semibold hover:bg-slate-200 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Education & Information ---
function EducationView({ setView }) {
  return (
    <div className="flex flex-col h-full animate-fade-in bg-white">
      <div className="p-4 border-b border-slate-100">
        <button onClick={() => setView('home')} className="flex items-center text-slate-500 hover:text-slate-800">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
      </div>

      <div className="p-6 space-y-8">
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-slate-800">Understanding Stress</h2>
          <p className="text-slate-500 mt-2">Knowledge is a powerful tool against fear.</p>
        </div>

        {educationData.map((section, idx) => (
          <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">{section.title}</h3>
            {section.content && <p className="text-slate-600 leading-relaxed mb-4">{section.content}</p>}
            
            {section.items && (
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <span className="text-teal-500 mt-1">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 mt-8">
           <h3 className="text-lg font-semibold text-blue-900 mb-2">When to Reach Out</h3>
           <p className="text-blue-800 leading-relaxed">
             You have already been evaluated, and your doctor has confirmed that your symptoms are consistent with stress waves. That is reassuring — it means your body is healthy, even when it does not feel that way.
           </p>
        </div>
      </div>
    </div>
  );
}

// --- Settings & Customization ---
function SettingsView({ setView, phrases, setPhrases, toolkit, setToolkit, voiceEnabled, setVoiceEnabled, supportContact, setSupportContact, darkModeEnabled, setDarkModeEnabled, journalEntries }) {
  const [newPhrase, setNewPhrase] = useState('');
  const [newItem, setNewItem] = useState('');

  const addPhrase = () => {
    if (newPhrase.trim()) {
      setPhrases([...phrases, newPhrase.trim()]);
      setNewPhrase('');
    }
  };

  const removePhrase = (index) => {
    setPhrases(phrases.filter((_, i) => i !== index));
  };

  const addToolkitItem = () => {
    if (newItem.trim()) {
      setToolkit([...toolkit, { id: Date.now(), text: newItem.trim(), checked: false }]);
      setNewItem('');
    }
  };

  const toggleToolkitItem = (id) => {
    setToolkit(toolkit.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeToolkitItem = (id) => {
    setToolkit(toolkit.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col h-full animate-fade-in bg-slate-50">
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => setView('home')} className="flex items-center text-slate-600 font-medium hover:text-slate-900">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <span className="font-semibold text-slate-700">Settings & Tools</span>
      </div>

      <div className="p-6 space-y-10">

        {/* Tools & Resources moved from Home */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-800">Practice & Learn</h2>
            <p className="text-sm text-slate-500 mt-1">Explore tools when you are feeling calm.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setView('breathe')} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:bg-slate-50 text-slate-700 transition-colors">
              <Wind className="w-6 h-6 text-blue-500" />
              <span className="font-medium text-sm">Breathe</span>
            </button>
            <button onClick={() => setView('ground')} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:bg-slate-50 text-slate-700 transition-colors">
              <Eye className="w-6 h-6 text-indigo-500" />
              <span className="font-medium text-sm">Ground</span>
            </button>
            <button onClick={() => setView('learn')} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:bg-slate-50 text-slate-700 col-span-2 transition-colors">
              <Info className="w-6 h-6 text-amber-500" />
              <span className="font-medium text-sm">Understand Stress</span>
            </button>
          </div>
        </section>

        {/* Custom Phrases Section */}
        <section>
          <div className="mb-4 border-t border-slate-200 pt-8">
            <h2 className="text-xl font-bold text-slate-800">My Reassurance Phrases</h2>
            <p className="text-sm text-slate-500 mt-1">These appear during the SOS walkthrough to help guide you.</p>
          </div>

          <div className="space-y-3 mb-4">
            {phrases.map((phrase, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-start gap-4 shadow-sm">
                <p className="text-slate-700 text-sm flex-1">{phrase}</p>
                <button 
                  onClick={() => removePhrase(idx)}
                  className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input 
              type="text"
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPhrase()}
              placeholder="Add your own phrase..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
            <button 
              onClick={addPhrase}
              disabled={!newPhrase.trim()}
              className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Physical Toolkit Checklist */}
        <section>
          <div className="mb-4 border-t border-slate-200 pt-8">
            <h2 className="text-xl font-bold text-slate-800">My Physical Toolkit</h2>
            <p className="text-sm text-slate-500 mt-1">Keep track of comforting items you have nearby.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-4">
            {toolkit.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                <div 
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => toggleToolkitItem(item.id)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${item.checked ? 'bg-teal-500 border-teal-500' : 'border-slate-300'}`}>
                    {item.checked && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-sm font-medium ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {item.text}
                  </span>
                </div>
                <button 
                  onClick={() => removeToolkitItem(item.id)}
                  className="text-slate-400 hover:text-red-500 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input 
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addToolkitItem()}
              placeholder="Add an item (e.g. Sour candy)..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
            <button 
              onClick={addToolkitItem}
              disabled={!newItem.trim()}
              className="bg-slate-800 text-white p-3 rounded-xl hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Preferences & Contacts */}
        <section>
          <div className="mb-4 border-t border-slate-200 pt-8">
            <h2 className="text-xl font-bold text-slate-800">Mantra Preferences</h2>
            <p className="text-sm text-slate-500 mt-1">Choose how the app guides you.</p>
          </div>
          
          <div className="space-y-4">
            
            {/* Functional Voice Toggle */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <Volume2 className={`w-5 h-5 ${voiceEnabled ? 'text-teal-500' : 'text-slate-400'}`} />
                <div>
                  <span className="block text-sm font-medium text-slate-700">Voice Guide</span>
                  <span className="text-xs text-slate-500">Reads text aloud slowly</span>
                </div>
              </div>
              <button 
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${voiceEnabled ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {voiceEnabled ? 'On' : 'Off'}
              </button>
            </div>

            {/* Low Stimulation / Dark Mode Toggle */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <Moon className={`w-5 h-5 ${darkModeEnabled ? 'text-indigo-400' : 'text-slate-400'}`} />
                <div>
                  <span className="block text-sm font-medium text-slate-700">Low Stimulation</span>
                  <span className="text-xs text-slate-500">Darken screen & reduce contrast</span>
                </div>
              </div>
              <button 
                onClick={() => setDarkModeEnabled(!darkModeEnabled)}
                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${darkModeEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {darkModeEnabled ? 'On' : 'Off'}
              </button>
            </div>
            
            {/* Support Contact Setup */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-3 mb-1">
                <Heart className="w-5 h-5 text-rose-400" />
                <div>
                  <span className="block text-sm font-medium text-slate-700">Support Contact</span>
                  <span className="text-xs text-slate-500">Quick-dial during an episode</span>
                </div>
              </div>
              <div className="flex gap-2">
                 <input 
                    type="text" 
                    placeholder="Name (e.g. Mom)" 
                    value={supportContact.name}
                    onChange={(e) => setSupportContact({...supportContact, name: e.target.value})}
                    className="w-1/3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                 />
                 <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={supportContact.phone}
                    onChange={(e) => setSupportContact({...supportContact, phone: e.target.value})}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                 />
              </div>
            </div>

          </div>
        </section>

        {/* Journal History Section */}
        <section>
          <div className="mb-4 border-t border-slate-200 pt-8">
            <h2 className="text-xl font-bold text-slate-800">Journal History</h2>
            <p className="text-sm text-slate-500 mt-1">Review your past notes.</p>
          </div>
          
          <div className="space-y-4">
            {journalEntries.length === 0 ? (
              <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <p className="text-sm text-slate-400 italic">No journal entries yet.</p>
              </div>
            ) : (
              journalEntries.map(entry => (
                <div key={entry.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {entry.date} at {entry.time}
                  </div>
                  {entry.trigger && (
                    <div>
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-0.5">Trigger</span>
                      <span className="text-sm text-slate-600">{entry.trigger}</span>
                    </div>
                  )}
                  {entry.helped && (
                    <div>
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-0.5">What Helped</span>
                      <span className="text-sm text-slate-600">{entry.helped}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

// Ensure tailwind config enables custom animations for the gentle fading and sliding
const styles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.4s ease-out forwards;
  }
  .animate-slide-up {
    animation: slide-up 0.5s ease-out forwards;
    opacity: 0;
  }

  /* Low Stimulation (Dark Mode) Overrides */
  .low-stim, .low-stim main, .low-stim .bg-slate-50, .low-stim .bg-white, .low-stim .bg-indigo-50 {
    background-color: #0f172a !important; /* slate-900 */
    color: #cbd5e1 !important; /* slate-300 */
    border-color: #1e293b !important; /* slate-800 */
  }
  .low-stim header {
    background-color: #0f172a !important;
    border-bottom-color: #1e293b !important;
  }
  .low-stim section div.bg-white, .low-stim button.bg-white, .low-stim textarea {
    background-color: #1e293b !important;
    border-color: #334155 !important;
    color: #e2e8f0 !important;
  }
  .low-stim h1, .low-stim h2, .low-stim h3, .low-stim span.text-slate-800, .low-stim span.text-slate-700, .low-stim label {
    color: #f8fafc !important; /* slate-50 */
  }
  .low-stim p.text-slate-500, .low-stim span.text-slate-500 {
    color: #94a3b8 !important; /* slate-400 */
  }
  .low-stim .bg-teal-800 {
    background-color: #020617 !important; /* Extremely dark for SOS */
  }
  .low-stim * {
    transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
