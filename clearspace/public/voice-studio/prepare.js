// Isolated so cancelling setup tears down both of Zyphra's dedicated workers.
const modelBase =
  "https://huggingface.co/Zyphra/ZONOS3-Mini/resolve/d2d142a86b1e6aeb4252679673c86ecd86177bf8/web/";
window.addEventListener("message", async (event) => {
  if (
    event.origin !== location.origin ||
    event.source !== parent ||
    event.data?.kind !== "prepare"
  )
    return;
  const port = event.ports[0];
  if (!port) return;
  const { voice, texts } = event.data;
  const send = (kind, message) => port.postMessage({ kind, message });
  try {
    if (
      !Array.isArray(texts) ||
      !texts.length ||
      texts.length > 4 ||
      texts.some((t) => typeof t !== "string" || !t.trim() || t.length > 500)
    )
      throw new Error("Choose a shorter reminder before preparing the voice.");
    const adapter = await navigator.gpu?.requestAdapter();
    if (
      !adapter ||
      adapter.isFallbackAdapter ||
      adapter.info?.isFallbackAdapter
    )
      throw new Error(
        "Hardware WebGPU is unavailable on this device. The included guide is ready.",
      );
    const { engine, localFetch } = await import("./vendor/engine.js");
    engine.onFatal(() =>
      send(
        "error",
        "The graphics device stopped responding. The included guide is ready.",
      ),
    );
    await engine.init(
      (p) =>
        send(
          "progress",
          p.total
            ? "Preparing the voice model · " +
                Math.floor((100 * p.loaded) / p.total) +
                "%"
            : "Opening the voice model…",
        ),
      { base: modelBase, cache: false },
    );
    const clips = [];
    for (const text of texts) {
      send(
        "progress",
        "Making clip " + (clips.length + 1) + " of " + texts.length + "…",
      );
      const res = await localFetch("/v2/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          language: "en_us",
          speaker_embedding_id: voice,
          stream: false,
          format: "wav",
          seed: 42,
        }),
      });
      if (!res.ok)
        throw new Error(
          "The voice could not finish this clip. Your previous guide is still available.",
        );
      const data = await res.arrayBuffer();
      if (
        data.byteLength <= 44 ||
        new DataView(data).getUint32(0) !== 0x52494646 ||
        new DataView(data).getUint32(8) !== 0x57415645
      )
        throw new Error("The voice returned an unreadable clip.");
      clips.push({ text, audio: new Blob([data], { type: "audio/wav" }) });
    }
    port.postMessage({ kind: "ready", clips });
  } catch (err) {
    send(
      "error",
      /unavailable|shorter reminder|previous guide|unreadable/.test(
        err?.message || "",
      )
        ? err.message
        : "Voice preparation could not finish on this device. You can retry or use the included guide.",
    );
  }
});
