# HisabTrack — প্রকাশের গাইড

**আপনার লাইভ লিংক:** https://hisabtrack.netlify.app

---

## 📁 ফাইলের তালিকা

| ফাইল | কাজ |
|---|---|
| `hisabtrack-deploy.zip` | হোস্টে আপলোড-রেডি **PWA প্যাকেজ** (নিচের সব ফাইল ভেতরে আছে) |
| `index.html` | মূল HTML (একা আপলোড করবেন না — বাকি ফাইলগুলোও লাগবে) |
| `styles.css` | ডিজাইন/থিম |
| `app.js` | অ্যাপের সম্পূর্ণ লজিক ও ডেমো ডেটা |
| `i18n.js` | বাংলা/ইংরেজি অনুবাদ ও টগল |
| `pwa.js` | "অ্যাপ ইনস্টল" বাটন |
| `manifest.json` | PWA ম্যানিফেস্ট — নাম, আইকন, standalone মোড |
| `sw.js` | Service worker — অফলাইন ক্যাশিং |
| `icon.svg`, `icon-192.png`, `icon-512.png` | অ্যাপ আইকন |
| `robots.txt`, `sitemap.xml` | সার্চ ইঞ্জিনের জন্য (Google-এ দেখা যাওয়ার সাহায্য করে) |
| `apk/HisabTrack.apk` | ZIP-এর ভেতরে — Android APK ডাউনলোডের জন্য |
| `assetlinks.json`, `.well-known/assetlinks.json` | APK-র সাথে ওয়েবসাইটের ডিজিটাল লিংক |
| `hisabtrack-apk/` | APK, AAB, `signing.keystore` ও `signing-key-info.txt` — ব্যাকআপ করে রাখুন |
| `HisabTrack.html` | **একক ফাইল** ব্যাকআপ — শেয়ার/সংরক্ষণের জন্য (PWA নয়) |
| `build-single.ps1` | সোর্স বদলানোর পর `HisabTrack.html` ও ZIP রিফ্রেশ করার স্ক্রিপ্ট |

---

## 🌐 নতুন করে প্রকাশ করবেন কীভাবে

### Netlify (বর্তমান হোস্ট)
1. https://app.netlify.com → লগইন → `hisabtrack` প্রজেক্ট
2. **Versions** → **Drop new files** → `hisabtrack-deploy.zip` আপলোড
3. **Publish new version** চাপুন → কয়েক সেকেন্ড পর লাইভ ✅

> নতুন প্রজেক্টে **Project configuration → General → Visitor access → Project visibility → Public** রাখতে হবে, নাহলে বাইরের লোক দেখতে পাবেন না।

> ⚠️ Netlify-এ যদি দেখা যায় **“production deploys paused / out of credits”**, তবে পুরনো সাইট live থাকলেও নতুন ZIP publish করা যাবে না। Team → **Upgrade** করুন অথবা পরবর্তী billing cycle-এর অপেক্ষা করুন, তারপর একই ZIP আবার DROP করুন।

### GitHub Pages
1. নতুন **Public** repository তৈরি করুন
2. ZIP-এর ভেতরের সব ফাইল আপলোড করুন → Commit
3. **Settings → Pages → Deploy from a branch → main / root** → Save

### একক ফাইল
`HisabTrack.html` যেকোনো জায়গায় কপি করে খুলুন বা পাঠান। আলাদা কোনো CSS/JS লাগবে না।
⚠️ এটি **PWA নয়** — অ্যাপ ইনস্টল চাইলে হোস্টেড লিংক ব্যবহার করুন।

---

## 📱 অ্যাপ হিসেবে ইনস্টল (PWA)

শুধু **HTTPS লিংকেই** ইনস্টল হয় (`file://` ফাইলে নয়)।

**Android / Chrome:** লিংক খুলুন → "অ্যাপ ইনস্টল" বাটন → **Install**। না দেখলে `⋮` মেনু → **Install app / Add to Home screen**।

**iPhone / Safari:** Share আইকন → **Add to Home Screen** → **Add**।

একবার খোলার পর service worker সব ফাইল ক্যাশ করে — ইন্টারনেট না থাকলেও অ্যাপ চলে, ডেটা ওই ডিভাইসেই থাকে।

---

## 🤖 Android APK

Settings → **Android app → Download APK** থেকে ফাইলটি ডাউনলোড করুন। ফোনে খুলে **Install unknown apps** অনুমতি দিয়ে ইনস্টল করুন।

> Google Play-তে upload করলে `hisabtrack-apk/HisabTrack.aab` ব্যবহার করুন। ভবিষ্যতে APK/AAB আপডেটে **একই `signing.keystore`** লাগবে — `signing-key-info.txt`-সহ নিরাপদ জায়গায় রাখুন।

---

## 🔒 PIN lock

Settings → **PIN lock** থেকে ৪–৬ ডিজিটের PIN সেট করুন।

- অ্যাপ খুলতে PIN লাগবে; **Lock now** দিয়ে যেকোনো সময় লক করা যায়।
- **Auto-lock after inactivity**: ১ / ৫ / ১৫ / ৩০ মিনিট বা Off।
- PIN সেট করার সময় একটা **Recovery code** দেখা যায় — সেটি সংরক্ষণ করুন। PIN ভুলে গেলে লক স্ক্রিনে **Forgot PIN?** → কোড দিয়ে PIN সরানো যায়, ডেটা থাকে।
- PIN শুধু এই ব্রাউজারের জন্য একটা স্ক্রিন লক — ডেটা এনক্রিপ্ট করে না। ব্যাকআপের জন্য Export JSON ব্যবহার করুন।
- PIN আলাদা কীতে (`takatrack.pin.v1`) থাকে; আপনার আর্থিক ডেটার কী (`takatrack.data.v1`) অপরিবর্তিত।

---

## 🧭 নতুন ব্যবহারকারীর প্রথম অভিজ্ঞাতা (Guided setup)

কেউ প্রথমবার লিংক বা APK খুললে:

1. টপবারে সবসময় **APK** ডাউনলোড বাটন থাকবে
2. প্রথমে নাম জিজ্ঞেস করে একটা স্বাগত ইন্টারফেস আসবে
3. নাম দেওয়ার পর ড্যাশবোর্ড আসবে — **সব হিসাব ০** (কোনো ডেমো ডেটা নেই)
4. এরপর AI সহকারী ৬টি ধাপে বলে দেবে কী কী লিখতে হবে: মাসিক আয় → বাড়ির ভাড়া → খাদ্য → যাতায়াত/বিদ্যুৎ/কেনাকাটা → সঞ্চয় → মাসিক খরচের সীমা
5. **Finish setup** চাপার সাথে সাথে লেনদেন, বাজেট আর ব্যালেন্স সঠিকভাবে তৈরি হয়ে যাবে

পুরনো ব্যবহারকারীদের ডেটা অটুইথাকে — তাদের কোনো সেটআপ স্ক্রিন দেখা যায় না। Settings → **Guided setup** দিয়ে যেকোনো সময় আবার চালানো যায়।

> `_redirects` ফাইলটি Netlify-তে `/.well-known/assetlinks.json` কে `/assetlinks.json`-এ নির্দেশ করে — APK verification-এর জন্য এটি রাখতে হবে।

---

## 📈 অ্যানালিটিক্স, লক্ষ্য ও থিম

- **অ্যানালিটিক্স**: ৩ / ৬ / ১২ মাস বা সব সময়ের জন্য আয়–খরচের বার চার্ট, ক্যাটাগরি কেক, সাপ্তাহিক খরচ, সঞ্চয়ের প্রবণতা ও মাসিক সারণী — সব আপনার নিজের লেনদেন থেকে তৈরি।
- **সঞ্চয়ের লক্ষ্য**: নতুন লক্ষ্য যোগ করুন, লক্ষ্য অঙ্ক/জমা করা টাকা/তারিখ সম্পাদনা করুন, অগ্রগতি দেখুন এবং অর্জিত লক্ষ্য উদযাপন করুন। জরুরি তহবিলের মতো লক্ষ্য AI-র মাসিক পরিকল্পনাতাও ব্যবহৃত হয়।
- **থিম**: টপবারের সূর্য/চাঁদ বাটন বা Settings → **Theme** থেকে Dark/Light বদলান — পছন্দ `takatrack.data.v1`-এ সংরক্ষিত থাকে।
- **CSV এক্সপোর্ট**: Settings → **CSV export** দিয়ে লেনদেনের সব রেকর্ড Excel/Google Sheets-এ খোলা যায় এমন CSV ফাইল পান। JSON ব্যাকআপ আগের মতোই থাকে।

---

## 🔍 Google-এ দেখা যাওয়া

✅ `index.html`-এ Google verification মেটা ট্যাগ আছে (`id="google-verify"`) — ট্যাগটি মুছবেন না।
✅ `robots.txt` ও `sitemap.xml` আপনার লিংক দিয়েই তৈরি।

1. https://search.google.com/search-console → **Add property → URL prefix** → `https://hisabtrack.netlify.app`
2. **HTML tag** দিয়ে **Verify** করুন
3. বাঁ মেন্যু → **Sitemap** → `sitemap.xml` → **Submit**

লিংক জানা যেকোনো মানুষ তখনই দেখতে পাবে; Google-এ Search-এ আসতে কয়েক দিন/সপ্তাহ লাগে।

---

## ⚠️ গুরুত্বপূর্ণ

- কোনো লগইন/সার্ভার লাগবে না — সব ডেটা ব্যবহারকারীর নিজের ব্রাউজারে (`localStorage`) থাকে।
- Settings → **Export JSON** দিয়ে সময়মতো ব্যাকআপ রাখুন।
- সোর্স ফাইল এডিট করার পর PowerShell-এ চালান:
  `powershell -ExecutionPolicy Bypass -File "C:\Users\new\Downloads\Lovable\build-single.ps1"`
  এটি `HisabTrack.html` ও `hisabtrack-deploy.zip` দুটোই রিফ্রেশ করবে।
- ভবিষ্যতে ডোমেইন বদলালে `sitemap.xml` ও `robots.txt`-এ নতুন URL বসাতে ভুলবেন না।
