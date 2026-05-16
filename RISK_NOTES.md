# RISK_NOTES.md

## Risks

| Risk | Severity | Why It Matters | Mitigation |
| --- | --- | --- | --- |
| Root workspace is not a Git repository | High | Future app and doc changes at `/Volumes/WS4TB/UROK` lack root-level version-control rollback. | Before substantial build work, confirm whether to initialize Git at root or place the app inside a Git-tracked directory. |
| No main app scaffold exists yet | High | There are no root build/test commands or entry points to run. | Start with `TQ-001` and create a standalone Vite React TypeScript app. |
| Dependency installation may need network approval | Medium | Scaffolding a new app may require npm package downloads. | Request approval only when install/build commands hit network restrictions. |
| `prefile.md` is a prototype, not production architecture | Medium | It is a single React file with injected styles and mixed state concerns. | Convert behavior into typed components and data modules before expanding features. |
| Stress support can accidentally become medical advice | High | Overly certain reassurance or treatment-like language could be unsafe. | Follow `STANDARDS.md`; keep copy bounded, escalation-aware, and non-diagnostic. |
| Sensitive local data in journal/support contact | Medium | Stress notes and contact info can be private, especially on shared devices. | Store locally only, minimize fields, add delete/export controls to backlog, avoid cloud sync by default. |
| Lumina scope creep | Medium | Lumina includes clinical/provider/AI features outside this product's MVP. | Reuse only local-first/offline/testing/safety patterns; do not import clinical workflows. |
| Virtual Puppet Theater scope creep | Medium | It brings camera, microphone, WebSocket, AI, TTS, and heavy animation dependencies. | Reuse only optional design patterns after MVP stability; do not add its stack to the first build. |
| Emergency-region assumptions are unresolved | Medium | Crisis guidance differs by country and user context. | Use conservative generic copy initially; make emergency/support contact configurable. |
| Runtime CDN dependency risk | Medium | Runtime CDNs undermine offline behavior and reliability. | Bundle dependencies through the app build; avoid CDN Tailwind/importmaps in production. |

## Safe Next Step

Create the standalone app scaffold from `TQ-001`, preferably in `clearspace/`, after explicitly noting the root Git boundary. Keep `lumina/` and `virtual-puppet-theater/` read-only and use them only as reference material.
