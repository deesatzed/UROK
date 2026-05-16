import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SupportContact, ToolkitItem } from "../types";
import { SafetyNotice } from "./SafetyNotice";

type SettingsViewProps = {
  lowStimEnabled: boolean;
  phrases: string[];
  supportContact: SupportContact;
  toolkitItems: ToolkitItem[];
  voiceGuideEnabled: boolean;
  voiceGuideSupported: boolean;
  onBackHome: () => void;
  setLowStimEnabled: (value: boolean | ((current: boolean) => boolean)) => void;
  setPhrases: (value: string[] | ((current: string[]) => string[])) => void;
  setSupportContact: (
    value: SupportContact | ((current: SupportContact) => SupportContact),
  ) => void;
  setToolkitItems: (
    value: ToolkitItem[] | ((current: ToolkitItem[]) => ToolkitItem[]),
  ) => void;
  setVoiceGuideEnabled: (value: boolean | ((current: boolean) => boolean)) => void;
};

export function SettingsView({
  lowStimEnabled,
  phrases,
  supportContact,
  toolkitItems,
  voiceGuideEnabled,
  voiceGuideSupported,
  onBackHome,
  setLowStimEnabled,
  setPhrases,
  setSupportContact,
  setToolkitItems,
  setVoiceGuideEnabled,
}: SettingsViewProps) {
  const [newPhrase, setNewPhrase] = useState("");
  const [newToolkitItem, setNewToolkitItem] = useState("");

  const addPhrase = () => {
    const phrase = newPhrase.trim();
    if (!phrase) return;
    setPhrases((current) => [...current, phrase]);
    setNewPhrase("");
  };

  const addToolkitItem = () => {
    const text = newToolkitItem.trim();
    if (!text) return;
    setToolkitItems((current) => [
      ...current,
      { id: `${Date.now()}`, text, checked: false },
    ]);
    setNewToolkitItem("");
  };

  return (
    <section className="settings-view" aria-labelledby="settings-title">
      <div>
        <p className="eyebrow">Personalization</p>
        <h1 id="settings-title">Settings</h1>
        <p>
          Keep the app personal without accounts or cloud sync. These settings
          stay in local device storage.
        </p>
      </div>

      <div className="settings-section">
        <h2>Reassurance phrases</h2>
        <div className="settings-list">
          {phrases.map((phrase, index) => (
            <div className="settings-row" key={`${phrase}-${index}`}>
              <span>{phrase}</span>
              <button
                type="button"
                aria-label={`Remove phrase ${index + 1}`}
                onClick={() =>
                  setPhrases((current) =>
                    current.filter((_, phraseIndex) => phraseIndex !== index),
                  )
                }
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        <div className="input-row">
          <label>
            <span>Add phrase</span>
            <input
              type="text"
              value={newPhrase}
              onChange={(event) => setNewPhrase(event.target.value)}
            />
          </label>
          <button type="button" onClick={addPhrase}>
            <Plus size={18} aria-hidden="true" />
            Add
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Physical toolkit</h2>
        <div className="settings-list">
          {toolkitItems.map((item) => (
            <div className="settings-row" key={item.id}>
              <button
                className="check-row-button"
                type="button"
                aria-pressed={item.checked}
                onClick={() =>
                  setToolkitItems((current) =>
                    current.map((currentItem) =>
                      currentItem.id === item.id
                        ? { ...currentItem, checked: !currentItem.checked }
                        : currentItem,
                    ),
                  )
                }
              >
                {item.checked ? "Ready" : "Need"}: {item.text}
              </button>
              <button
                type="button"
                aria-label={`Remove ${item.text}`}
                onClick={() =>
                  setToolkitItems((current) =>
                    current.filter((currentItem) => currentItem.id !== item.id),
                  )
                }
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        <div className="input-row">
          <label>
            <span>Add toolkit item</span>
            <input
              type="text"
              value={newToolkitItem}
              onChange={(event) => setNewToolkitItem(event.target.value)}
            />
          </label>
          <button type="button" onClick={addToolkitItem}>
            <Plus size={18} aria-hidden="true" />
            Add
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Support contact</h2>
        <div className="contact-grid">
          <label>
            <span>Name</span>
            <input
              type="text"
              value={supportContact.name}
              onChange={(event) =>
                setSupportContact((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>Phone</span>
            <input
              type="tel"
              value={supportContact.phone}
              onChange={(event) =>
                setSupportContact((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
            />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>Preferences</h2>
        <div className="toggle-grid">
          <button
            type="button"
            aria-pressed={lowStimEnabled}
            onClick={() => setLowStimEnabled((current) => !current)}
          >
            Low stimulation {lowStimEnabled ? "on" : "off"}
          </button>
          <button
            type="button"
            aria-pressed={voiceGuideSupported ? voiceGuideEnabled : false}
            disabled={!voiceGuideSupported}
            onClick={() => {
              if (voiceGuideSupported) {
                setVoiceGuideEnabled((current) => !current);
              }
            }}
          >
            {voiceGuideSupported
              ? `Voice guide ${voiceGuideEnabled ? "on" : "off"}`
              : "Voice guide unavailable"}
          </button>
        </div>
      </div>

      <SafetyNotice compact />

      <button className="secondary-button" type="button" onClick={onBackHome}>
        Back to home
      </button>
    </section>
  );
}
