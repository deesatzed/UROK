import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function offlineGuide(): Plugin {
  return {
    name: "clearspace-offline-guide",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      const voices = new URL("./public/voices/", import.meta.url);
      const clips = readdirSync(voices)
        .filter((file) => file.endsWith(".mp3"))
        .sort();
      const files = Object.keys(bundle)
        .filter((file) => /\.(?:js|css|html)$/.test(file))
        .sort();
      const hash = createHash("sha256");
      const worker = readFileSync(
        fileURLToPath(new URL("./scripts/offline-worker.js", import.meta.url)),
        "utf8",
      );
      hash.update(worker);
      for (const file of files) {
        const asset = bundle[file];
        hash
          .update(file)
          .update(asset.type === "chunk" ? asset.code : asset.source);
      }
      for (const name of clips)
        hash.update(name).update(readFileSync(new URL(name, voices)));
      const manifest = [...files, ...clips.map((name) => "voices/" + name)];
      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: worker
          .replace(
            '"BUILD_REVISION"',
            JSON.stringify(hash.digest("hex").slice(0, 16)),
          )
          .replace('["BUILD_FILES"]', JSON.stringify(manifest)),
      });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), offlineGuide()],
});
