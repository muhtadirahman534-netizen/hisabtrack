# HisabTrack / হিসাবট্র্যাক

Bengali-first, offline-capable personal finance PWA. No account, no server — all data stays in the browser's localStorage.

- **Live app (primary):** https://hisabtrack.netlify.app
- **Live app (GitHub Pages backup):** https://muhtadirahman534-netizen.github.io/hisabtrack/
- **Android APK:** https://hisabtrack.netlify.app/apk/HisabTrack.apk

## Repository contents

| Path | Description |
|---|---|
| `index.html`, `app.js`, `i18n.js`, `styles.css` | Complete website source |
| `sw.js`, `manifest.json`, `pwa.js`, `icon-*.png`, `icon.svg` | PWA / offline / install assets |
| `robots.txt`, `sitemap.xml`, `_redirects`, `assetlinks.json` | SEO and Android deep-link files |
| `HisabTrack.html` | Single self-contained backup — open directly in any browser |
| `android/` | Signed APK + AAB, assetlinks.json, signing-key-info.txt (private keystore excluded) |
| `deploy/hisabtrack-deploy.zip` | Exact package deployed to Netlify |
| `build-single.ps1` | Rebuilds the standalone HTML and deploy ZIP |
| `deploy.md` | Publishing and feature guide |

## Features

- Dashboard, transactions, budgets, savings goals, analytics, savings assistant
- Bengali default with EN / বাং toggle
- Light / dark theme, CSV export, JSON backup & import
- PWA install prompt, offline support, standalone display
- Local PIN screen lock (screen lock only — not encryption)
- 6-step guided first-time setup
- Android APK download

## Data keys (kept stable across rename)

`takatrack.data.v1`, `takatrack.lang`, `takatrack.pin.v1`, `takatrack.setup.v1`

## Notes

- Google verification meta `id="google-verify"` is present in `index.html`.
- APK package ID: `com.hisabtrack.app`
- Future APK updates must reuse `hisabtrack-apk/signing.keystore` from the local working folder.
