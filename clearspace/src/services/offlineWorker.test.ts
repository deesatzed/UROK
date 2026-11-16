import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync("scripts/offline-worker.js", "utf8");

function worker(addAll: () => Promise<void>) {
  const listeners = new Map<string, (event: unknown) => void>();
  const skipWaiting = vi.fn().mockResolvedValue(undefined);
  new Function("self", "caches", source)(
    {
      registration: { scope: "https://clearspace.example/" },
      addEventListener: (name: string, listener: (event: unknown) => void) =>
        listeners.set(name, listener),
      skipWaiting,
    },
    { open: vi.fn().mockResolvedValue({ addAll }) },
  );
  let installed!: Promise<void>;
  listeners.get("install")!({
    waitUntil: (pending: Promise<void>) => { installed = pending; },
  });
  return { installed, skipWaiting };
}

describe("offline guide updates", () => {
  it("makes an update available only after all its audio and app assets are cached", async () => {
    let complete!: () => void;
    const pending = new Promise<void>((resolve) => { complete = resolve; });
    const { installed, skipWaiting } = worker(() => pending);
    await Promise.resolve();
    expect(skipWaiting).not.toHaveBeenCalled();
    complete();
    await installed;
    expect(skipWaiting).toHaveBeenCalledTimes(1);
  });

  it("keeps the previous offline version when the new cache cannot finish", async () => {
    const { installed, skipWaiting } = worker(() => Promise.reject(new Error("Offline")));
    await expect(installed).rejects.toThrow("Offline");
    expect(skipWaiting).not.toHaveBeenCalled();
  });
});
