import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { focusProfiles } from "../data/focusProfiles";
import type { FocusProfileId, SupportContact, ToolkitItem } from "../types";
import { VoiceStudio } from "./VoiceStudio";
import { cues, type OpeningCue } from "../data/guide";
import type { PreparedPack } from "../services/voicePack";
import { SafetyNotice } from "./SafetyNotice";

type SettingsViewProps = {
  supportMessage: string;
  setSupportMessage: (value: string) => void;
  opening: OpeningCue;
  setOpening: (v: OpeningCue) => void;
  favorite: string;
  setFavorite: (v: string) => void;
  pack: PreparedPack | null;
  onPack: (v: PreparedPack | null) => void;
  focusProfile: FocusProfileId;
  lowStimEnabled: boolean;
  phrases: string[];
  supportContact: SupportContact;
  toolkitItems: ToolkitItem[];
  voiceGuideEnabled: boolean;
  voiceGuideSupported: boolean;
  onBackHome: () => void;
  setFocusProfile: (value: FocusProfileId) => void;
  setLowStimEnabled: (value: boolean | ((current: boolean) => boolean)) => void;
  setPhrases: (value: string[] | ((current: string[]) => string[])) => void;
  setSupportContact: (
    value: SupportContact | ((current: SupportContact) => SupportContact),
  ) => void;
  setToolkitItems: (
    value: ToolkitItem[] | ((current: ToolkitItem[]) => ToolkitItem[]),
  ) => void;
  setVoiceGuideEnabled: (
    value: boolean | ((current: boolean) => boolean),
  ) => void;
};

export function SettingsView({
  supportMessage,
  setSupportMessage,
  opening,
  setOpening,
  favorite,
  setFavorite,
  pack,
  onPack,
  focusProfile,
  lowStimEnabled,
  phrases,
  supportContact,
  toolkitItems,
  voiceGuideEnabled,
  voiceGuideSupported,
  onBackHome,
  setFocusProfile,
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
        <h1 id="settings-title">My support plan</h1>
        <p>
          Choose your first cue and how it sounds. Your choices stay on this
          device.
        </p>
      </div>

      <div className="settings-section">
        <h2>When I start my guide</h2>
        <label>
          First cue
          <select
            value={opening}
            onChange={(e) => setOpening(e.target.value as OpeningCue)}
          >
            <option value="surface">{cues.surface.title}</option>
            <option value="look">{cues.look.title}</option>
          </select>
        </label>
        <label>
          Personal reminder
          <select
            value={favorite}
            onChange={(e) => setFavorite(e.target.value)}
          >
            <option value="">Rotate my reminders</option>
            {[...new Set(phrases.filter(Boolean))].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <div className="toggle-grid">
          <button
            type="button"
            aria-pressed={voiceGuideEnabled}
            disabled={!voiceGuideSupported}
            onClick={() => setVoiceGuideEnabled((v) => !v)}
          >
            {voiceGuideSupported
              ? "Voice guide " + (voiceGuideEnabled ? "on" : "off")
              : "Voice guide unavailable"}
          </button>
        </div>
        <VoiceStudio
          opening={opening}
          phrase={favorite}
          pack={pack}
          onPack={onPack}
        />
      </div>

      <details className="settings-section">
        <summary>My reminders</summary>
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
      </details>

      <details className="settings-section">
        <summary>My physical toolkit</summary>
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
      </details>

      <div className="settings-section">
        <h2>Support contact</h2>
        <label>
          What I’d like someone to know
          <textarea
            maxLength={500}
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
          />
        </label>
        <p>You can show this message to someone during support or afterward.</p>
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
        <p>Choose the first tool ClearSpace suggests when you are not sure.</p>
        <div className="profile-grid" aria-label="Focus profile">
          {focusProfiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              aria-pressed={focusProfile === profile.id}
              onClick={() => setFocusProfile(profile.id)}
            >
              <span>{profile.label}</span>
              <small>{profile.description}</small>
            </button>
          ))}
        </div>
        <div className="toggle-grid">
          <button
            type="button"
            aria-pressed={lowStimEnabled}
            onClick={() => setLowStimEnabled((current) => !current)}
          >
            Low stimulation {lowStimEnabled ? "on" : "off"}
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
