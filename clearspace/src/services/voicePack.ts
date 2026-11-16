import { narratedCue, type OpeningCue, type VoiceStyle } from "../data/guide";

export const studioVoices = {
  default_b78b28baf5c31a1d: "Imogen",
  default_2c5123a959875341: "Cillian",
} as const;
export type StudioVoice = keyof typeof studioVoices;
export type PreparedPack = {
  voice: StudioVoice;
  style?: VoiceStyle;
  clips: { text: string; audio: Blob }[];
};
export function packTexts(opening: OpeningCue, phrase: string, style: VoiceStyle = "gentle") {
  return [
    ...new Set(
      [
        narratedCue(opening, style),
        phrase.trim(),
        narratedCue("ease", style),
        narratedCue("choice", style),
      ].filter(Boolean),
    ),
  ];
}
export function validPack(value: unknown): value is PreparedPack {
  if (
    !value ||
    typeof value !== "object" ||
    !("voice" in value) ||
    !("clips" in value)
  )
    return false;
  return (
    Object.prototype.hasOwnProperty.call(studioVoices, String(value.voice)) &&
    (!("style" in value) || value.style === "gentle" || value.style === "brief") &&
    Array.isArray(value.clips) &&
    value.clips.length > 0 &&
    value.clips.length <= 4 &&
    value.clips.every(
      (c) =>
        c &&
        typeof c.text === "string" &&
        c.audio instanceof Blob &&
        c.audio.size > 44,
    )
  );
}

function accessPack<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open("clearspace-prepared-voice", 1);
    open.onupgradeneeded = () => open.result.createObjectStore("audio");
    open.onerror = () => reject(open.error);
    let blocked = false;
    open.onblocked = () => {
      blocked = true;
      reject(new Error("Close other ClearSpace tabs and try again."));
    };
    open.onsuccess = () => {
      const db = open.result;
      if (blocked) {
        db.close();
        return;
      }
      try {
        const tx = db.transaction("audio", mode);
        let result: T;
        tx.oncomplete = () => {
          db.close();
          resolve(result);
        };
        tx.onabort = () => {
          db.close();
          reject(
            tx.error ||
              new Error("Could not access saved audio on this device."),
          );
        };
        const request = run(tx.objectStore("audio"));
        request.onsuccess = () => {
          result = request.result;
        };
      } catch (error) {
        db.close();
        reject(error);
      }
    };
  });
}

export async function loadPack() {
  const value: unknown = await accessPack("readonly", (s) => s.get("current"));
  return validPack(value) ? value : null;
}
export async function savePack(pack: PreparedPack, signal?: AbortSignal) {
  // The whole pack replaces the previous one in a single transaction.
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
  await accessPack("readwrite", (s) => {
    const tx = s.transaction;
    const cancel = () => {
      try {
        tx.abort();
      } catch {
        /* already settled */
      }
    };
    if (signal?.aborted) {
      tx.abort();
      throw new DOMException("Cancelled", "AbortError");
    }
    signal?.addEventListener("abort", cancel, { once: true });
    const cleanup = () => signal?.removeEventListener("abort", cancel);
    tx.addEventListener("complete", cleanup, { once: true });
    tx.addEventListener("abort", cleanup, { once: true });
    return s.put(pack, "current");
  });
}
export async function removePack() {
  await accessPack("readwrite", (s) => s.delete("current"));
}

export async function renderPack(
  voice: StudioVoice,
  texts: string[],
  signal: AbortSignal,
  report: (s: string) => void,
) {
  if (!window.isSecureContext || !("gpu" in navigator))
    throw new Error(
      "This browser cannot prepare a voice. The included guide is ready.",
    );
  if (!("indexedDB" in window))
    throw new Error("This browser cannot save voice clips.");
  if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
  return new Promise<PreparedPack>((resolve, reject) => {
    // The engine spawns dedicated workers on import. Removing this document also releases its workers and GPU.
    const frame = document.createElement("iframe");
    frame.hidden = true;
    frame.title = "Voice preparation";
    const channel = new MessageChannel();
    let timer: number;
    const close = () => {
      window.clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      channel.port1.close();
      frame.remove();
    };
    const fail = (error: Error) => {
      close();
      reject(error);
    };
    const abort = () => fail(new DOMException("Cancelled", "AbortError"));
    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(
        () =>
          fail(
            new Error(
              "Preparation stopped responding. Try again or use the included voice.",
            ),
          ),
        180_000,
      );
    };
    channel.port1.onmessage = ({ data }) => {
      arm();
      if (data.kind === "progress") report(data.message);
      else if (data.kind === "error") fail(new Error(data.message));
      else if (data.kind === "ready") {
        const pack = { voice, clips: data.clips };
        if (
          !validPack(pack) ||
          pack.clips.length !== texts.length ||
          pack.clips.some((c, i) => c.text !== texts[i])
        )
          return fail(
            new Error(
              "The audio was incomplete. Your previous guide is still available.",
            ),
          );
        close();
        resolve(pack);
      }
    };
    frame.onload = () =>
      frame.contentWindow?.postMessage(
        { kind: "prepare", voice, texts },
        location.origin,
        [channel.port2],
      );
    frame.onerror = () =>
      fail(
        new Error("The voice studio could not open. Try again when connected."),
      );
    signal.addEventListener("abort", abort, { once: true });
    arm();
    frame.src = new URL(
      import.meta.env.BASE_URL + "voice-studio/frame.html",
      document.baseURI,
    ).href;
    document.body.append(frame);
  });
}
