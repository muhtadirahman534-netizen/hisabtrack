# HisabTrack / হিসাবট্র্যাক

Bengali-first, offline-capable personal finance PWA. No account, no server — all data stays in the browser's `localStorage`.

**Live app:** https://hisabtrack.netlify.app  
**Android APK:** https://hisabtrack.netlify.app/apk/HisabTrack.apk

## Folder contents

| Path | Description |
|---|---|
| `source/` | Complete website source (HTML, CSS, JS, PWA files, icons, SEO files) |
| `HisabTrack.html` | Single self-contained backup — open directly in any browser |
| `deploy/hisabtrack-deploy.zip` | Exact package deployed to Netlify |
| `android/` | Signed APK + AAB, assetlinks.json, signing key info (private keystore excluded) |
| `build-single.ps1` | Rebuilds the standalone HTML and deploy ZIP |
| `deploy.md` | Publishing and feature guide |

## Features

- Dashboard, transactions, budgets, savings goals, analytics, savings assistant
- Bengali default with EN / বাং toggle
- Light / dark theme, CSV export, JSON backup & import
- PWA install prompt, offline support, icons, standalone display
- Local PIN screen lock (not encryption)
- 6-step guided first-time setup
- Android APK download

## Data keys (kept stable)

`takatrack.data.v1`, `takatrack.lang`, `takatrack.pin.v1`, `takatrack.setup.v1`

## Notes

- Google verification meta `id="google-verify"` is present in `source/index.html`.
- APK package ID: `com.hisabtrack.app`
- Future APK updates must reuse `hisabtrack-apk/signing.keystore` from the working folder.
