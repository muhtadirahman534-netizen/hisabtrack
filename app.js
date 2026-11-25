/* ==========================================================================
   HisabTrack — complete personal finance app (no build step, no dependencies)
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- tiny DOM helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  const uid = () => "id_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  function isBnLang() {
    try { return localStorage.getItem("takatrack.lang") !== "en"; }
    catch (e) { return true; }
  }

  const ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    wallet: '<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20M16 14h2"/>',
    up: '<path d="M7 17 17 7M7 7h10v10"/>',
    down: '<path d="M7 7l10 10M17 7v10H7"/>',
    piggy: '<path d="M4 12a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2h-2l-1 4h-3l-1-2h-4l-1 2H7l-1-4H4z"/><path d="M9 6V4M15 6V4"/>',
    pie: '<path d="M21 12a9 9 0 1 1-9-9v9z"/><path d="M21 9a9 9 0 0 0-6-6v6z"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 7h8M8 11h8"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    sparkles: '<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"/><path d="m19 15 .7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7L19 15z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3v-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.4 7 7.2 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h4v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4h-.2a1.7 1.7 0 0 0-1.6 1z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3"/>',
    upload: '<path d="M12 16V4m0 0 4 4m-4-4L8 8M4 17v3h16v-3"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    landmark: '<path d="m3 10 9-6 9 6M5 10v9h14v-9M3 20h18M9 20v-6h6v6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/>',
    analytics: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    goal: '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    flag: '<path d="M5 21V4M5 5h13l-2.5 4L18 13H5"/>',
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.info) + "</svg>";
  }

  /* ---------- constants ---------- */
  const ROUTES = {
    dashboard: { title: "Dashboard", subtitle: "Your money at a glance", icon: "dashboard" },
    transactions: { title: "Transactions", subtitle: "Every taka in and out", icon: "receipt" },
    budgets: { title: "Budgets", subtitle: "Plan your monthly spending", icon: "target" },
    analytics: { title: "Analytics", subtitle: "Charts built from your real transactions", icon: "analytics" },
    assistant: { title: "Savings Assistant", subtitle: "Smart, rule-based insights", icon: "sparkles" },
    goals: { title: "Savings Goals", subtitle: "Save towards what matters to you", icon: "goal" },
    settings: { title: "Settings", subtitle: "Preferences and your data", icon: "settings" },
  };
  const CATEGORIES = {
    income: ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"],
    expense: ["Food", "Rent", "Transport", "Utilities", "Shopping", "Health", "Education", "Entertainment", "Other"],
    savings: ["Emergency Fund", "Goals", "Investment", "Other"],
  };
  const COLORS = ["#22c55e", "#38bdf8", "#fbbf24", "#f87171", "#34d399", "#a78bfa", "#fb923c", "#2dd4bf"];
  const SYMBOLS = { BDT: "৳", USD: "$", INR: "₹", GBP: "£" };
  const STORE_KEY = "takatrack.data.v1";
  const PIN_KEY = "takatrack.pin.v1";
  const SETUP_KEY = "takatrack.setup.v1";
  const pin = { data: null, locked: false, recovering: false, lastActivity: Date.now() };
  const setup = { step: 0, data: {}, replay: false };

  /* ---------- PIN lock helpers ---------- */
  function simpleHash(str) {
    let h1 = 2166136261, h2 = 2166136261;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 16777619);
      h2 = Math.imul((h2 + c * (i + 7)) | 0 ^ (h2 >>> 13), 1274126177);
    }
    return ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + ("00000000" + (h2 >>> 0).toString(16)).slice(-8);
  }
  function hashPin(value, salt) {
    const input = salt + ":" + value;
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))
        .then(function (buf) {
          return "sha256$" + Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
        })
        .catch(function () { return Promise.resolve("simple$" + simpleHash(input)); });
    }
    return Promise.resolve("simple$" + simpleHash(input));
  }
  function randomBytes(n) {
    const arr = new Uint8Array(n);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(arr);
    else for (let i = 0; i < n; i++) arr[i] = Math.floor(Math.random() * 256);
    return arr;
  }
  function newSalt() {
    return Array.prototype.map.call(randomBytes(8), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
  }
  function makeRecovery() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.prototype.map.call(randomBytes(8), function (b) { return chars[b % chars.length]; }).join("");
  }
  function loadPin() {
    try {
      const p = JSON.parse(localStorage.getItem(PIN_KEY) || "null");
      if (p && p.salt && p.hash) return p;
    } catch (e) {}
    return { enabled: false, hash: "", salt: "", recovery: "", autoLock: 5 };
  }
  function savePin() {
    try { localStorage.setItem(PIN_KEY, JSON.stringify(pin.data)); }
    catch (e) { toast("Could not save PIN", "error"); }
  }
  function disablePin() {
    pin.data.enabled = false; pin.data.hash = ""; pin.data.salt = ""; pin.data.recovery = "";
    savePin();
  }

  /* ---------- guided setup ---------- */
  const SETUP_STEPS = [
    { key: "income", title: "Monthly income",
      tip: "Let us begin with the money that comes in. Enter your monthly salary or total regular income — for example 45000.",
      hint: "Salary, freelance, business — anything you receive every month." },
    { key: "rent", title: "House rent",
      tip: "Now your biggest fixed cost. Enter the monthly rent you pay for your home.",
      hint: "If you live with family and pay nothing, enter 0." },
    { key: "food", title: "Food & groceries",
      tip: "Tell us what you usually spend on food, groceries and daily meals in one month.",
      hint: "A rough average is fine — you can edit everything later." },
    { key: "other", title: "Transport, utilities & shopping",
      tip: "Almost done. Enter your combined monthly spending on transport, electricity/internet and shopping. We will split it into three budgets for you.",
      hint: "Example: 8000 becomes roughly 3200 transport, 2800 utilities, 2000 shopping." },
    { key: "savings", title: "Monthly savings",
      tip: "Great habit! How much would you like to set aside every month? We will record it as an emergency fund contribution.",
      hint: "Even a small amount counts. Enter 0 to skip." },
    { key: "budget", title: "Monthly spending limit",
      tip: "Finally, set a total monthly spending limit. We will use it to show your budget health on the dashboard.",
      hint: "Leave blank and we will calculate it from your answers." },
  ];
  function markSetupDone() {
    try { localStorage.setItem(SETUP_KEY, "done"); } catch (e) {}
  }
  function setupHTML() {
    const step = setup.step;
    if (step === 0) {
      return '<div class="setup-screen"><div class="setup-card">' +
        '<div class="setup-mark">৳</div><h2>Welcome to HisabTrack</h2>' +
        '<p class="setup-sub">Your personal money manager. Let us set it up together in a few quick steps.</p>' +
        '<div class="setup-ai"><span class="ai-avatar">✦</span><div><b>Hi, I am your savings assistant.</b><br/>First, what should I call you?</div></div>' +
        '<form data-form="setup-name"><div class="field"><label>Your name</label>' +
        '<input class="input setup-input" name="name" placeholder="e.g. Rahim" maxlength="40" required autofocus/></div>' +
        '<button class="btn btn-primary btn-block" type="submit" style="margin-top:14px">Get started</button></form>' +
        "</div></div>";
    }
    const i = step - 1;
    const s = SETUP_STEPS[i];
    const pct = Math.round((step / (SETUP_STEPS.length + 1)) * 100);
    return '<div class="setup-screen"><div class="setup-card">' +
      '<div class="setup-top"><span class="setup-brand">✦ HisabTrack</span><span class="setup-progress">Step ' + (i + 1) + " / " + SETUP_STEPS.length + "</span></div>" +
      '<div class="setup-bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="setup-ai"><span class="ai-avatar">✦</span><div>' + esc(s.tip) + "</div></div>" +
      "<h2>" + s.title + '</h2><p class="setup-sub">' + esc(s.hint) + "</p>" +
      '<form data-form="setup-step"><div class="field"><label>Amount (BDT)</label>' +
      '<input class="input setup-input" name="value" type="number" min="0" step="1" inputmode="numeric" placeholder="0" value="' + esc(setup.data[s.key] || "") + '"/></div>' +
      '<button class="btn btn-primary btn-block" type="submit" style="margin-top:14px">' + (i === SETUP_STEPS.length - 1 ? "Finish setup" : "Next") + "</button></form>" +
      '<button class="lock-link" data-action="setup-skip">Skip setup</button>' +
      "</div></div>";
  }
  function startSetup(replay) {
    setup.replay = !!replay;
    setup.data = {};
    showSetup(0);
  }
  function showSetup(step) {
    setup.step = typeof step === "number" ? step : 0;
    document.body.classList.toggle("setup-welcome", setup.step === 0);
    const root = $("#setup-root");
    if (root) root.innerHTML = setupHTML();
    const input = $(".setup-input");
    if (input) input.focus();
  }
  function hideSetup() {
    document.body.classList.remove("setup-welcome");
    const root = $("#setup-root");
    if (root) root.innerHTML = "";
  }
  function finishSetup() {
    const d = setup.data;
    const num = function (k) { return Math.max(0, Number(d[k]) || 0); };
    const income = num("income"), rent = num("rent"), food = num("food"), other = num("other"), savings = num("savings");
    const transport = Math.round(other * 0.4), utilities = Math.round(other * 0.35), shopping = Math.max(0, other - transport - utilities);
    const now = new Date();
    const txs = [];
    function add(type, amount, category, note, day) {
      if (amount <= 0) return;
      const dt = dateStr(new Date(now.getFullYear(), now.getMonth(), Math.min(day, now.getDate())));
      txs.push({ id: uid(), type: type, amount: amount, category: category, note: note, date: dt });
    }
    add("income", income, "Salary", "Monthly salary", 1);
    add("expense", rent, "Rent", "House rent", 3);
    add("expense", food, "Food", "Groceries & meals", 8);
    add("expense", transport, "Transport", "Daily commute", 12);
    add("expense", utilities, "Utilities", "Electricity & internet", 15);
    add("savings", savings, "Emergency Fund", "Monthly savings", 18);
    add("expense", shopping, "Shopping", "Personal items", 20);
    const newBudgets = [
      { id: uid(), category: "Rent", limit: rent },
      { id: uid(), category: "Food", limit: food },
      { id: uid(), category: "Transport", limit: transport },
      { id: uid(), category: "Utilities", limit: utilities },
      { id: uid(), category: "Shopping", limit: shopping },
    ].filter(function (b) { return b.limit > 0; });
    const limit = Number(d.budget);
    const totalLimit = limit > 0 ? limit : rent + food + other;
    if (setup.replay) {
      state.transactions = state.transactions.concat(txs);
      newBudgets.forEach(function (nb) {
        const old = state.budgets.filter(function (b) { return b.category === nb.category; })[0];
        if (old) old.limit = nb.limit; else state.budgets.push(nb);
      });
    } else {
      state.transactions = txs;
      state.budgets = newBudgets;
    }
    state.prefs.overallBudget = totalLimit;
    save(); markSetupDone(); hideSetup(); render();
    toast("Setup complete — your numbers are ready!");
  }

  /* ---------- dates ---------- */
  function pad(n) { return String(n).padStart(2, "0"); }
  function dateStr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function todayStr() { return dateStr(new Date()); }
  function monthOf(s) { return String(s || "").slice(0, 7); }
  function currentKey() { return monthOf(todayStr()); }
  function monthKeysBack(n) {
    const out = [], now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      out.push(d.getFullYear() + "-" + pad(d.getMonth() + 1));
    }
    return out;
  }
  function monthKeysForRange(txs, range) {
    if (range !== "all") return monthKeysBack(Number(range) || 6);
    const dates = (txs || []).map(function (x) { return String(x.date || "").slice(0, 7); }).filter(Boolean).sort();
    if (!dates.length) return monthKeysBack(1);
    const first = dates[0].split("-"), now = new Date();
    let n = (now.getFullYear() - Number(first[0])) * 12 + (now.getMonth() + 1 - Number(first[1])) + 1;
    n = Math.max(1, Math.min(36, n));
    return monthKeysBack(n);
  }
  function addDays(d, n) { const x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function weekBuckets(txs, count) {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const out = [];
    for (let i = count - 1; i >= 0; i--) {
      const start = addDays(end, -((i + 1) * 7 - 1));
      const key = dateStr(start);
      const spend = (txs || []).filter(function (x) {
        if (x.type !== "expense") return false;
        const ds = String(x.date || "");
        return ds >= key && ds <= dateStr(addDays(start, 6));
      }).reduce(function (s, x) { return s + (Number(x.amount) || 0); }, 0);
      out.push({ key: key, label: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }), spend: spend });
    }
    return out;
  }
  function monthLabel(key, short) {
    const p = String(key).split("-");
    const d = new Date(Number(p[0]), Number(p[1]) - 1, 1);
    return d.toLocaleDateString("en-US", { month: short ? "short" : "long", year: "numeric" });
  }
  function prettyDate(s) {
    const d = new Date(String(s) + "T00:00:00");
    return isNaN(d.getTime()) ? s : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  /* ---------- money ---------- */
  function money(n, opts) {
    opts = opts || {};
    const sym = SYMBOLS[(state && state.prefs && state.prefs.currency) || "BDT"] || "৳";
    const abs = Math.abs(Math.round(Number(n) || 0)).toLocaleString("en-US");
    const sign = opts.signed ? (n > 0 ? "+" : n < 0 ? "−" : "") : n < 0 ? "−" : "";
    return sign + sym + " " + abs;
  }
  function compact(n) {
    n = Number(n) || 0;
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1000) return Math.round(n / 1000) + "k";
    return String(Math.round(n));
  }

  /* ---------- calculations ---------- */
  function totals(txs) {
    const t = { income: 0, expenses: 0, savings: 0, balance: 0, savingsRate: 0 };
    (txs || []).forEach(function (x) {
      const a = Number(x.amount) || 0;
      if (x.type === "income") t.income += a;
      else if (x.type === "savings") t.savings += a;
      else t.expenses += a;
    });
    t.balance = t.income - t.expenses - t.savings;
    t.savingsRate = t.income ? t.savings / t.income : 0;
    return t;
  }
  function inMonth(txs, key) { return (txs || []).filter(function (x) { return monthOf(x.date) === key; }); }
  function monthlySeries(txs, keys) {
    return keys.map(function (k) {
      const t = totals(inMonth(txs, k));
      return { key: k, label: new Date(Number(k.slice(0, 4)), Number(k.slice(5, 7)) - 1, 1).toLocaleDateString("en-US", { month: "short" }), income: t.income, expenses: t.expenses, savings: t.savings, rate: t.savingsRate };
    });
  }
  function categoryBreakdown(txs) {
    const map = {};
    (txs || []).forEach(function (x) {
      if (x.type !== "expense") return;
      map[x.category] = (map[x.category] || 0) + (Number(x.amount) || 0);
    });
    return Object.keys(map).map(function (k) { return { category: k, value: map[k] }; }).sort(function (a, b) { return b.value - a.value; });
  }
  function budgetUsage(txs, budgets, key, overall) {
    const monthTxs = inMonth(txs, key);
    const rows = (budgets || []).map(function (b) {
      const spent = monthTxs.filter(function (x) { return x.type === "expense" && x.category === b.category; })
        .reduce(function (s, x) { return s + (Number(x.amount) || 0); }, 0);
      const limit = Number(b.limit) || 0;
      const pct = limit ? (spent / limit) * 100 : 0;
      return { category: b.category, id: b.id, spent: spent, limit: limit, pct: pct, status: pct >= 100 ? "over" : pct >= 80 ? "warn" : "good" };
    }).sort(function (a, b) { return b.pct - a.pct; });
    let overallRow = null;
    if (overall > 0) {
      const spent = totals(monthTxs).expenses;
      const pct = (spent / overall) * 100;
      overallRow = { spent: spent, limit: overall, pct: pct, status: pct >= 100 ? "over" : pct >= 80 ? "warn" : "good" };
    }
    return { categories: rows, overall: overallRow };
  }
  function buildReport(d) {
    const all = totals(d.transactions);
    const key = currentKey();
    const month = totals(inMonth(d.transactions, key));
    const prevDate = new Date();
    prevDate.setDate(1); prevDate.setMonth(prevDate.getMonth() - 1);
    const prevExpenses = totals(inMonth(d.transactions, monthOf(dateStr(prevDate)))).expenses;
    const avgKeys = monthKeysBack(3);
    const incomes = avgKeys.map(function (k) { return totals(inMonth(d.transactions, k)).income; }).filter(function (v) { return v > 0; });
    const avgIncome = incomes.length ? Math.round(incomes.reduce(function (s, v) { return s + v; }, 0) / incomes.length) : 0;
    const breakdown = categoryBreakdown(inMonth(d.transactions, key));
    const usage = budgetUsage(d.transactions, d.budgets, key, d.prefs.overallBudget);
    const insights = [];
    let score = 50;
    const rate = all.savingsRate;
    if (rate >= 0.2) { score += 25; insights.push({ tone: "positive", title: "Healthy savings rate", message: "You are saving " + Math.round(rate * 100) + "% of your income. Keep it up!" }); }
    else if (rate > 0) { score += 10; insights.push({ tone: "warning", title: "Room to save more", message: "Your savings rate is " + Math.round(rate * 100) + "%. Aim for at least 20%." }); }
    else { score -= 12; insights.push({ tone: "danger", title: "No savings recorded", message: "Try setting aside a small amount every month, even ৳ 500 counts." }); }
    const over = usage.categories.filter(function (x) { return x.pct >= 100; });
    if (over.length) { score -= 15; insights.push({ tone: "danger", title: "Budget exceeded", message: over.length + " categor" + (over.length > 1 ? "ies are" : "y is") + " over limit, led by " + over[0].category + "." }); }
    else if (usage.categories.length) { score += 10; insights.push({ tone: "positive", title: "Budgets on track", message: "You are within all of your category limits this month." }); }
    if (breakdown.length) {
      const top = breakdown[0];
      const share = month.expenses ? top.value / month.expenses : 0;
      if (share > 0.35) { score -= 6; insights.push({ tone: "warning", title: "Top spending category", message: top.category + " takes " + Math.round(share * 100) + "% of this month's expenses." }); }
      else { score += 5; insights.push({ tone: "info", title: "Spending is balanced", message: "No single category dominates your expenses this month." }); }
    }
    if (prevExpenses > 0 && month.expenses > prevExpenses * 1.1) {
      score -= 5;
      const rise = Math.round((month.expenses / prevExpenses - 1) * 100);
      insights.push({
        tone: "warning",
        title: isBnLang() ? "খরচ গত মাসের চেয়ে বেড়েছে" : "Spending is up from last month",
        message: isBnLang()
          ? "এই মাসে আপনি " + money(month.expenses) + " খরচ করেছেন, গত মাসের (" + money(prevExpenses) + ") চেয়ে " + rise + "% বেশি।"
          : "You have spent " + money(month.expenses) + " this month, " + rise + "% more than last month (" + money(prevExpenses) + ")."
      });
    }
    if (!all.income) { score -= 10; insights.push({ tone: "danger", title: "Add your income", message: "Record income to unlock your savings rate and targets." }); }
    score = Math.max(0, Math.min(100, score));
    const target = all.income ? Math.round((all.income * 0.2) / 500) * 500 : null;
    const trim = function (n) { return Math.max(200, Math.round((Number(n) || 0) * 0.15 / 100) * 100); };
    const bnTips = isBnLang();
    const tips = [];
    breakdown.slice(0, 3).forEach(function (x) {
      const amt = money(trim(x.value));
      const advice = (bnTips ? {
        Food: "সপ্তাহের দিনে বাড়িতে রান্না করুন আর সাপ্তাহিক বাজারের একটা তালিকা বানান — খাবারে প্রায় " + amt + " সাশ্রয় হবে।",
        Shopping: "Daraz বা Facebook অর্ডারের আগে ৪৮ ঘণ্টার নিয়ম মানুন — impulse কেনাকাটা এড়িয়ে প্রায় " + amt + " সাশ্রয় হবে।",
        Entertainment: "স্ট্রিমিং সাবস্ক্রিপশন দেখে নিন এবং মাসে দুইবারের বেশি টাকা দিয়ে বের হবেন না — প্রায় " + amt + " সাশ্রয় হবে।",
        Transport: "একবারে কয়েকটা কাজ সেরে নিন এবং যেখানে সম্ভব মেট্রো/বাস ব্যবহার করুন — প্রায় " + amt + " সাশ্রয় হবে।",
        Utilities: "অপ্রয়োজনীয় লাইট আর ফ্যান বন্ধ করুন, ইন্টারনেট ও মোবাইল প্যাকেজ তুলনা করুন — বিল প্রায় " + amt + " কমতে পারে।",
        Health: "বিশ্বস্ত ফার্মাসিতে মাসিক প্যাকে ওষুধ কিনুন, কিন্তু জরুরি স্বাস্থ্য খরচ কখনো কমাবেন না।",
        Education: "টাকা দিয়ে নতুন কোর্স কেনার আগে 10 Minute School বা YouTube-এ ফ্রি কোর্স দেখুন।",
      } : {
        Food: "Cook at home on weekdays and plan one weekly bazar list — save about " + amt + " on food.",
        Shopping: "Use a 48-hour rule before Daraz or Facebook orders — skipping impulse buys can save about " + amt + ".",
        Entertainment: "Review streaming subscriptions and limit paid outings to twice a month to save about " + amt + ".",
        Transport: "Combine errands and use metro rail or bus instead of ride-sharing where you can — about " + amt + " saved.",
        Utilities: "Switch off unused lights and fans, and compare internet and mobile packages — bills could drop by about " + amt + ".",
        Health: "Buy regular medicines in monthly packs from a trusted pharmacy, but never cut necessary health spending.",
        Education: "Look for free courses on 10 Minute School or YouTube before paying for new ones.",
      })[x.category];
      if (advice && tips.length < 2) tips.push(advice);
    });
    if (bnTips) {
      tips.push(target
        ? "সর্বপ্রথম নিজের জন্য আলাদা করুন: বেতনের দিনেই " + money(target) + " সঞ্চয়ে জমা করুন, খরচ করার আগে।"
        : "সর্বপ্রথম নিজের জন্য আলাদা করুন: আয় আসামাত্রই একটা নির্দিষ্ট অঙ্ক সঞ্চয়ে রাখুন।");
      if (tips.length < 3) tips.push("তিন মাসের খরচের একটা জরুরি তহবিল গড়ে তুলুন — প্রায় " + money(Math.round(Math.max(month.expenses, prevExpenses) * 3 / 1000) * 1000 || 100000) + "।");
    } else {
      tips.push(target ? "Pay yourself first: move " + money(target) + " to savings on salary day, before spending anything." : "Pay yourself first: move a fixed amount to savings as soon as income arrives.");
      if (tips.length < 3) tips.push("Build an emergency fund of three months' expenses — about " + money(Math.round(Math.max(month.expenses, prevExpenses) * 3 / 1000) * 1000 || 100000) + ".");
    }
    return {
      score: score,
      scoreLabel: score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs attention",
      target: target,
      avgIncome: avgIncome,
      prevExpenses: prevExpenses,
      tips: tips.slice(0, 3),
      insights: insights,
    };
  }

  /* ---------- persistence & seed ---------- */
  function seed() {
    const txs = [];
    function dayAgoMonth(m, day) {
      const now = new Date();
      let d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      let dd = day;
      if (m === 0) dd = Math.min(day, now.getDate());
      return dateStr(new Date(d.getFullYear(), d.getMonth(), Math.min(dd, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate())));
    }
    function add(type, amount, category, note, date) { txs.push({ id: uid(), type: type, amount: amount, category: category, note: note, date: date }); }
    for (let m = 5; m >= 0; m--) {
      add("income", 85000, "Salary", "Monthly salary", dayAgoMonth(m, 1));
      add("expense", 22000, "Rent", "House rent", dayAgoMonth(m, 3));
      add("expense", m === 0 ? 9800 : 7200 + m * 350, "Food", "Groceries & meals", dayAgoMonth(m, 8));
      add("expense", 3200, "Transport", "Daily commute", dayAgoMonth(m, 12));
      add("expense", 2600, "Utilities", "Electricity & internet", dayAgoMonth(m, 15));
      add("savings", 12000, "Emergency Fund", "Monthly contribution", dayAgoMonth(m, 18));
      if (m % 2 === 0) add("income", 12000, "Freelance", "Side project", dayAgoMonth(m, 21));
      else add("expense", 5400, "Shopping", "Personal items", dayAgoMonth(m, 20));
    }
    return {
      transactions: txs,
      budgets: [
        { id: uid(), category: "Food", limit: 12000 },
        { id: uid(), category: "Rent", limit: 25000 },
        { id: uid(), category: "Transport", limit: 5000 },
        { id: uid(), category: "Utilities", limit: 5000 },
        { id: uid(), category: "Shopping", limit: 8000 },
      ],
      goals: [
        { id: uid(), name: "Emergency Fund", target: 360000, saved: 96000, targetDate: dateStr(new Date(new Date().getFullYear(), new Date().getMonth() + 6, 1)) },
        { id: uid(), name: "New Laptop", target: 120000, saved: 30000, targetDate: dateStr(new Date(new Date().getFullYear(), new Date().getMonth() + 10, 1)) },
      ],
      prefs: { currency: "BDT", name: "Rahim Ahmed", overallBudget: 60000, theme: "dark" },
    };
  }
  function emptyState() {
    return { transactions: [], budgets: [], goals: [], prefs: { currency: "BDT", name: "User", overallBudget: 0, theme: "dark" } };
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return emptyState();
      const d = JSON.parse(raw);
      if (!d || !Array.isArray(d.transactions) || !Array.isArray(d.budgets)) return seed();
      d.prefs = d.prefs || { currency: "BDT", name: "User", overallBudget: 0, theme: "dark" };
      if (!d.prefs.theme || (d.prefs.theme !== "dark" && d.prefs.theme !== "light")) d.prefs.theme = "dark";
      d.goals = Array.isArray(d.goals) ? d.goals : [];
      return d;
    } catch (e) { return seed(); }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { toast("Could not save data", "error"); }
  }
  function applyTheme() {
    const theme = (state && state.prefs && state.prefs.theme) === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f4f8f6" : "#071511");
  }

  let state = load();
  const ui = { route: "dashboard", search: "", type: "all", draft: null, chat: [], range: "6" };

  /* ---------- toast ---------- */
  function toast(msg, kind) {
    const root = $("#toast-root");
    const el = document.createElement("div");
    el.className = "toast " + (kind || "success");
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(function () { el.style.opacity = "0"; el.style.transition = "opacity .3s"; setTimeout(function () { el.remove(); }, 300); }, 3200);
  }

  /* ---------- charts ---------- */
  function barChart(series) {
    const W = 720, H = 240, pl = 52, pr = 14, pt = 14, pb = 34;
    const iw = W - pl - pr, ih = H - pt - pb;
    const peak = Math.max(1, series.reduce(function (m, s) { return Math.max(m, s.income, s.expenses); }, 0));
    const nice = Math.max(50000, Math.ceil(peak / 50000) * 50000);
    const step = iw / Math.max(1, series.length);
    const bw = Math.min(22, step * 0.28);
    let grid = "";
    [0, 0.25, 0.5, 0.75, 1].forEach(function (f) {
      const y = pt + ih - f * ih;
      grid += '<line x1="' + pl + '" y1="' + y + '" x2="' + (W - pr) + '" y2="' + y + '" stroke="var(--border-soft)"/>' +
        '<text x="' + (pl - 8) + '" y="' + (y + 4) + '" text-anchor="end" fill="var(--faint)" font-size="10">' + compact(nice * f) + "</text>";
    });
    let bars = "";
    series.forEach(function (s, i) {
      const gx = pl + i * step + step / 2;
      const hi = (s.income / nice) * ih, he = (s.expenses / nice) * ih;
      bars += '<rect x="' + (gx - bw - 2) + '" y="' + (pt + ih - hi) + '" width="' + bw + '" height="' + Math.max(hi, 1) + '" rx="3" fill="var(--success)" opacity=".92"><title>' + s.key + " income: " + money(s.income) + "</title></rect>" +
        '<rect x="' + (gx + 2) + '" y="' + (pt + ih - he) + '" width="' + bw + '" height="' + Math.max(he, 1) + '" rx="3" fill="var(--danger)" opacity=".92"><title>' + s.key + " expense: " + money(s.expenses) + "</title></rect>" +
        '<text x="' + gx + '" y="' + (H - 10) + '" text-anchor="middle" fill="var(--muted)" font-size="11">' + s.label + "</text>";
    });
    return '<div class="chart-wrap"><svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid meet">' + grid + bars + '</svg></div>' +
      '<div class="chart-legend"><span><i class="legend-dot" style="background:var(--success)"></i>Income</span><span><i class="legend-dot" style="background:var(--danger)"></i>Expenses</span></div>';
  }
  function donut(data) {
    const total = data.reduce(function (s, x) { return s + x.value; }, 0);
    const r = 76, c = 2 * Math.PI * r, sw = 22;
    let offset = 0, arcs = "";
    data.forEach(function (item, i) {
      const len = total ? (item.value / total) * c : 0;
      arcs += '<circle cx="105" cy="105" r="' + r + '" fill="none" stroke="' + COLORS[i % COLORS.length] + '" stroke-width="' + sw +
        '" stroke-dasharray="' + Math.max(0, len - 2.5) + " " + (c - Math.max(0, len - 2.5)) + '" stroke-dashoffset="' + (-offset) +
        '" transform="rotate(-90 105 105)"><title>' + esc(item.category) + ": " + money(item.value) + "</title></circle>";
      offset += len;
    });
    return '<svg viewBox="0 0 210 210"><circle cx="105" cy="105" r="' + r + '" fill="none" stroke="var(--panel-3)" stroke-width="' + sw + '"/>' + arcs + "</svg>";
  }
  function lineChart(points) {
    const W = 720, H = 230, pl = 54, pr = 16, pt = 16, pb = 34;
    const iw = W - pl - pr, ih = H - pt - pb;
    const max = Math.max(1, points.reduce(function (m, p) { return Math.max(m, p.value); }, 0));
    const min = Math.min(0, points.reduce(function (m, p) { return Math.min(m, p.value); }, 0));
    const range = Math.max(1, max - min);
    let running = 0;
    const vals = points.map(function (p) { running += p.value; return running; });
    const lo = Math.min(0, Math.min.apply(null, vals)), hi = Math.max(1, Math.max.apply(null, vals));
    const span = Math.max(1, hi - lo);
    const xy = vals.map(function (v, i) {
      const x = pl + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
      const y = pt + ih - ((v - lo) / span) * ih;
      return { x: x, y: y, v: v, label: points[i].label };
    });
    let grid = "";
    [0, 0.5, 1].forEach(function (f) {
      const y = pt + ih - f * ih;
      grid += '<line x1="' + pl + '" y1="' + y + '" x2="' + (W - pr) + '" y2="' + y + '" stroke="var(--border-soft)"/>' +
        '<text x="' + (pl - 8) + '" y="' + (y + 4) + '" text-anchor="end" fill="var(--faint)" font-size="10">' + compact(lo + f * span) + "</text>";
    });
    const path = xy.map(function (p, i) { return (i ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1); }).join(" ");
    const area = path + " L" + (xy.length ? xy[xy.length - 1].x : pl) + " " + (pt + ih) + " L" + pl + " " + (pt + ih) + " Z";
    const dots = xy.map(function (p) { return '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="3" fill="var(--primary)"><title>' + esc(p.label) + ": " + money(p.v) + "</title></circle>"; }).join("");
    const labels = xy.map(function (p) { return '<text x="' + p.x.toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" fill="var(--muted)" font-size="11">' + esc(p.label) + "</text>"; }).join("");
    return '<div class="chart-wrap"><svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid meet">' + grid +
      '<path d="' + area + '" fill="var(--primary)" opacity=".10"/><path d="' + path + '" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linejoin="round"/>' + dots + labels + "</svg></div>";
  }
  function weeklyChart(weeks) {
    const peak = Math.max(1, weeks.reduce(function (m, w) { return Math.max(m, w.spend); }, 0));
    const nice = Math.max(10000, Math.ceil(peak / 10000) * 10000);
    return '<div class="week-chart">' + weeks.map(function (w) {
      return '<div class="week-col" title="' + esc(w.label) + ": " + money(w.spend) + '"><div class="week-bar"><i style="height:' + Math.max(2, (w.spend / nice) * 100) + '%"></i></div><small>' + esc(w.label) + "</small></div>";
    }).join("") + "</div>";
  }

  /* ---------- shared UI pieces ---------- */
  function statCard(label, value, iconName, hint, tone, featured) {
    return '<div class="stat' + (featured ? " featured" : "") + (tone ? " tone-" + tone : "") + '">' +
      '<div class="stat-top"><span class="stat-label">' + label + '</span><span class="stat-icon">' + icon(iconName) + "</span></div>" +
      '<div class="stat-value">' + value + '</div><div class="stat-hint">' + hint + "</div></div>";
  }
  function card(title, desc, body, action, extraClass) {
    return '<section class="card ' + (extraClass || "") + '"><div class="card-head"><div><h3 class="card-title">' + title + "</h3>" +
      (desc ? '<p class="card-desc">' + desc + "</p>" : "") + "</div>" + (action || "") + '</div><div class="card-body">' + body + "</div></section>";
  }
  function empty(iconName, title, text, button) {
    return '<div class="empty"><div class="empty-icon">' + icon(iconName) + "</div><h4>" + title + "</h4>" + (text ? "<p>" + text + "</p>" : "") + (button || "") + "</div>";
  }
  function statusClass(s) { return s === "over" ? "over" : s === "warn" ? "warn" : "good"; }
  function txRow(t, showActions) {
    const sym = { income: "up", expense: "down", savings: "piggy" }[t.type] || "receipt";
    const sign = t.type === "income" ? "+" : "−";
    return '<div class="tx-row"><div class="tx-icon ' + t.type + '">' + icon(sym) + '</div>' +
      '<div class="tx-main"><div class="tx-title">' + esc(t.note || t.category) + '</div><div class="tx-meta">' + esc(t.category) + " · " + prettyDate(t.date) + "</div></div>" +
      '<div class="tx-amount amount-' + t.type + '">' + sign + money(t.amount) + "</div>" +
      (showActions ? '<div class="row-actions"><button class="icon-btn" title="Edit" data-action="edit-tx" data-id="' + t.id + '">' + icon("edit") + '</button><button class="icon-btn" title="Delete" data-action="delete-tx" data-id="' + t.id + '">' + icon("trash") + "</button></div>" : "") +
      "</div>";
  }

  function txTableRow(t) {
    const sym = { income: "up", expense: "down", savings: "piggy" }[t.type] || "receipt";
    const sign = t.type === "income" ? "+" : "−";
    return '<tr><td><div class="tx-icon ' + t.type + '" style="display:inline-grid;vertical-align:middle;margin-right:9px">' + icon(sym) + '</div>' +
      '<span class="tx-title">' + esc(t.note || t.category) + '</span></td>' +
      '<td class="muted">' + prettyDate(t.date) + "</td><td>" + esc(t.category) + "</td>" +
      '<td style="text-align:right" class="tx-amount amount-' + t.type + '">' + sign + money(t.amount) + "</td>" +
      '<td style="text-align:right"><div class="row-actions" style="opacity:1;justify-content:flex-end">' +
      '<button class="icon-btn" title="Edit" data-action="edit-tx" data-id="' + t.id + '">' + icon("edit") + "</button>" +
      '<button class="icon-btn" title="Delete" data-action="delete-tx" data-id="' + t.id + '">' + icon("trash") + "</button></div></td></tr>";
  }

  /* ---------- views ---------- */
  function viewDashboard() {
    const d = state, key = currentKey();
    const all = totals(d.transactions);
    const month = totals(inMonth(d.transactions, key));
    const series = monthlySeries(d.transactions, monthKeysBack(6));
    const breakdown = categoryBreakdown(inMonth(d.transactions, key));
    const usage = budgetUsage(d.transactions, d.budgets, key, d.prefs.overallBudget);
    const recent = d.transactions.slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); }).slice(0, 5);
    const report = buildReport(d);

    let budgetBody = "";
    if (usage.overall || usage.categories.length) {
      if (usage.overall) {
        budgetBody += '<div class="summary-box"><div class="budget-top"><b>Total budget</b><small class="' + (usage.overall.status === "over" ? "text-danger" : "") + '">' + Math.round(usage.overall.pct) + "%</small></div>" +
          '<div class="progress ' + statusClass(usage.overall.status) + '"><i style="width:' + Math.min(100, usage.overall.pct) + '%"></i></div>' +
          '<div class="budget-top" style="margin:9px 0 0"><small>' + money(usage.overall.spent) + " of " + money(usage.overall.limit) + " · " +
          (usage.overall.spent <= usage.overall.limit ? money(usage.overall.limit - usage.overall.spent) + " left" : money(usage.overall.spent - usage.overall.limit) + " over") + "</small></div></div>";
      }
      usage.categories.slice(0, 4).forEach(function (l) {
        budgetBody += '<div class="budget-row"><div class="budget-top"><span>' + esc(l.category) + '</span><small>' + money(l.spent) + " / " + money(l.limit) + " · " + Math.round(l.pct) + "%</small></div>" +
          '<div class="progress ' + statusClass(l.status) + '"><i style="width:' + Math.min(100, l.pct) + '%"></i></div></div>';
      });
    } else {
      budgetBody = empty("target", "No budgets set", "Create a budget to keep spending in check.", '<button class="btn btn-primary btn-sm" data-action="go" data-route="budgets">Set a budget</button>');
    }

    let catBody = "";
    if (breakdown.length) {
      catBody = '<div class="donut-layout"><div class="donut-wrap">' + donut(breakdown) +
        '<div class="donut-center"><small>Spent</small><b>' + money(month.expenses) + "</b></div></div><div class=\"cat-list\">" +
        breakdown.slice(0, 5).map(function (x, i) {
          const pct = month.expenses ? (x.value / month.expenses) * 100 : 0;
          return '<div class="cat-item"><i class="legend-dot" style="background:' + COLORS[i % COLORS.length] + '"></i><span>' + esc(x.category) + '</span><b class="tabular">' + money(x.value) + '</b><span class="bar"><i style="width:' + pct + "%;background:" + COLORS[i % COLORS.length] + '"></i></span></div>';
        }).join("") + "</div></div>";
    } else {
      catBody = empty("pie", "No expenses this month", "Expenses you add will be grouped by category here.");
    }

    return '<div class="page-greeting"><h2>Welcome back, ' + esc(state.prefs.name || "there") + '!</h2><p>Here\'s your financial overview.</p></div>' +
      '<div class="grid stats-grid">' +
      statCard("Total Balance", money(all.balance), "wallet", money(month.balance, { signed: true }) + " this month", "", true) +
      statCard("Total Income", money(all.income), "up", money(month.income) + " in " + monthLabel(key, "short"), "income") +
      statCard("Total Expenses", money(all.expenses), "down", money(month.expenses) + " in " + monthLabel(key, "short"), "expense") +
      statCard("Total Savings", money(all.savings), "piggy", all.income ? Math.round(all.savingsRate * 100) + "% of all income saved" : "Add income to see your savings rate", "info") +
      "</div>" +
      '<div class="grid grid-3">' +
      card("Income vs Expense", "Last 6 months", d.transactions.length ? barChart(series) : empty("landmark", "No transactions yet", "Add your first income or expense to see the chart.")) +
      card("Spending by category", monthLabel(key), catBody) +
      "</div>" +
      '<div class="grid grid-3" style="margin-top:18px">' +
      card("Recent transactions", "Your latest activity", recent.length ? '<div class="tx-list">' + recent.map(function (t) { return txRow(t, false); }).join("") + "</div>" : empty("receipt", "Nothing recorded yet", "Add your first transaction to get started.", '<button class="btn btn-primary btn-sm" data-action="quick-add">' + icon("plus") + " Add transaction</button>"), '<button class="btn btn-ghost btn-sm" data-action="go" data-route="transactions">View all</button>') +
      '<div class="grid" style="gap:18px">' +
      card("Monthly budget", monthLabel(key), budgetBody, '<button class="btn btn-ghost btn-sm" data-action="go" data-route="budgets">Manage</button>') +
      card("AI savings insights", "Rule-based analysis", '<div class="score-hero"><div class="score-badge" style="background:' + (report.score >= 60 ? "var(--success)" : report.score >= 40 ? "var(--warning)" : "var(--danger)") + '">' + report.score + '</div><div><h4>Savings score: ' + report.scoreLabel + "</h4><p>" + (report.target ? "Suggested target: " + money(report.target) + "/month" : "Add income to get a target") + '</p></div></div><ul class="insights">' +
        report.insights.slice(0, 3).map(function (i) {
          const color = i.tone === "positive" ? "var(--success)" : i.tone === "warning" ? "var(--warning)" : i.tone === "danger" ? "var(--danger)" : "var(--info)";
          return '<li class="insight"><span class="dot" style="background:' + color + '"></span><span><b>' + esc(i.title) + ".</b> <span>" + esc(i.message) + "</span></span></li>";
        }).join("") + '</ul><button class="btn btn-outline btn-block" style="margin-top:16px" data-action="go" data-route="assistant">' + icon("sparkles") + " Ask the savings assistant</button>") +
      "</div></div>";
  }

  function renderTxTable() {
    const body = $("#tx-body");
    if (!body) return;
    let rows = state.transactions.slice();
    if (ui.type !== "all") rows = rows.filter(function (x) { return x.type === ui.type; });
    if (ui.search) {
      const q = ui.search.toLowerCase();
      rows = rows.filter(function (x) { return (x.note + " " + x.category + " " + x.type + " " + x.date).toLowerCase().indexOf(q) >= 0; });
    }
    rows.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    body.innerHTML = rows.length ? rows.map(function (t) { return txTableRow(t); }).join("") :
      '<tr><td colspan="5">' + empty("search", "No matching transactions", "Try a different search or filter.") + "</td></tr>";
    const count = $("#tx-count");
    if (count) count.textContent = rows.length + " record" + (rows.length === 1 ? "" : "s");
  }
  function viewTransactions() {
    const t = totals(state.transactions);
    return '<div class="grid stats-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">' +
      statCard("Money In", money(t.income), "up", "All time", "income") +
      statCard("Money Out", money(t.expenses), "down", "All time", "expense") +
      statCard("Saved", money(t.savings), "piggy", "All time", "info") + "</div>" +
      card("All transactions", "", '<div class="toolbar"><div class="search">' + icon("search") + '<input id="tx-search" class="input" placeholder="Search by note, category or date…" value="' + esc(ui.search) + '"/></div>' +
        '<div class="chips">' + ["all", "income", "expense", "savings"].map(function (k) {
          return '<button class="chip' + (ui.type === k ? " active" : "") + '" data-action="filter-type" data-type="' + k + '">' + (k === "all" ? "All" : k.charAt(0).toUpperCase() + k.slice(1)) + "</button>";
        }).join("") + '</div><button class="btn btn-primary" data-action="quick-add">' + icon("plus") + " Add new</button></div>" +
        '<div class="muted tiny" id="tx-count" style="margin-bottom:6px"></div>' +
        '<div style="overflow-x:auto"><table class="table"><thead><tr><th>Details</th><th>Date</th><th>Category</th><th style="text-align:right">Amount</th><th></th></tr></thead><tbody id="tx-body"></tbody></table></div>');
  }

  function viewBudgets() {
    const key = currentKey();
    const usage = budgetUsage(state.transactions, state.budgets, key, state.prefs.overallBudget);
    let body = "";
    if (usage.overall) {
      body += '<div class="summary-box"><div class="budget-top"><b>Overall monthly limit</b><small class="' + (usage.overall.status === "over" ? "text-danger" : "") + '">' + Math.round(usage.overall.pct) + "% used</small></div>" +
        '<div class="progress ' + statusClass(usage.overall.status) + '"><i style="width:' + Math.min(100, usage.overall.pct) + '%"></i></div>' +
        '<div class="budget-top" style="margin:9px 0 0"><small>' + money(usage.overall.spent) + " spent of " + money(usage.overall.limit) + " · " +
        (usage.overall.spent <= usage.overall.limit ? money(usage.overall.limit - usage.overall.spent) + " remaining" : money(usage.overall.spent - usage.overall.limit) + " over budget") + "</small></div></div>";
    }
    if (usage.categories.length) {
      body += usage.categories.map(function (l) {
        return '<div class="budget-row"><div class="budget-top"><div><b>' + esc(l.category) + '</b> <span class="tag">' + Math.round(l.pct) + "%</span></div><div>" +
          '<small>' + money(l.spent) + " / " + money(l.limit) + '</small> <button class="icon-btn" style="width:26px;height:26px;display:inline-grid" data-action="edit-budget" data-id="' + l.id + '">' + icon("edit") + '</button> <button class="icon-btn" style="width:26px;height:26px;display:inline-grid" data-action="delete-budget" data-id="' + l.id + '">' + icon("trash") + "</button></div></div>" +
          '<div class="progress ' + statusClass(l.status) + '"><i style="width:' + Math.min(100, l.pct) + '%"></i></div></div>';
      }).join("");
    } else {
      body += empty("target", "No category budgets yet", "Add one below to start tracking categories.");
    }
    const opts = CATEGORIES.expense.map(function (c) { return '<option value="' + c + '">' + c + "</option>"; }).join("");
    const form = '<form data-form="budget" class="field-row" style="align-items:end">' +
      '<div class="field"><label>Category</label><select class="input" name="category">' + opts + "</select></div>" +
      '<div class="field"><label>Monthly limit (' + (SYMBOLS[state.prefs.currency] || "৳") + ')</label><input class="input" name="limit" type="number" min="1" step="any" placeholder="10000" required/></div>' +
      '<button class="btn btn-primary" type="submit">' + icon("plus") + " Add budget</button></form>";
    return "<div class=\"grid\" style=\"gap:18px\">" +
      card("Monthly budgets", monthLabel(key), body) +
      card("Add a budget", "Set a monthly spending limit for a category", form) +
      card("Overall limit", "A single cap for all expenses this month", '<form data-form="overall" class="field-row" style="align-items:end"><div class="field"><label>Total monthly limit</label><input class="input" name="overall" type="number" min="0" step="any" value="' + (state.prefs.overallBudget || "") + '" placeholder="e.g. 60000"/></div><button class="btn btn-outline" type="submit">Save limit</button></form>') +
      "</div>";
  }

  function viewAnalytics() {
    const keys = monthKeysForRange(state.transactions, ui.range);
    const txs = state.transactions.filter(function (x) { return keys.indexOf(monthOf(x.date)) >= 0; });
    const series = monthlySeries(txs, keys);
    const breakdown = categoryBreakdown(txs);
    const t = totals(txs);
    const active = series.filter(function (s) { return s.income || s.expenses; }).length || 1;
    const bestMonth = series.reduce(function (b, s) { return !b || s.savings > b.savings ? s : b; }, null);
    const best = bestMonth && bestMonth.savings > 0 ? bestMonth : null;
    const top = breakdown[0];
    const ranges = [["3", "3 months"], ["6", "6 months"], ["12", "12 months"], ["all", "All time"]];
    const tabs = '<div class="range-tabs">' + ranges.map(function (r) {
      return '<button class="' + (ui.range === r[0] ? "active" : "") + '" data-action="set-range" data-range="' + r[0] + '">' + r[1] + "</button>";
    }).join("") + "</div>";
    if (!txs.length) {
      return card("Analytics", "Charts built from your real transactions",
        empty("analytics", "Not enough data for this period", "Add some income and expenses, or choose a longer date range.", '<button class="btn btn-primary btn-sm" data-action="quick-add">' + icon("plus") + " Add transaction</button>"), tabs);
    }
    let catBody = "";
    if (breakdown.length) {
      catBody = '<div class="donut-layout"><div class="donut-wrap">' + donut(breakdown) +
        '<div class="donut-center"><small>Spent</small><b>' + money(t.expenses) + "</b></div></div><div class=\"cat-list\">" +
        breakdown.slice(0, 5).map(function (x, i) {
          const pct = t.expenses ? (x.value / t.expenses) * 100 : 0;
          return '<div class="cat-item"><i class="legend-dot" style="background:' + COLORS[i % COLORS.length] + '"></i><span>' + esc(x.category) + '</span><b class="tabular">' + money(x.value) + '</b><span class="bar"><i style="width:' + pct + "%;background:" + COLORS[i % COLORS.length] + '"></i></span></div>';
        }).join("") + "</div></div>";
    } else {
      catBody = empty("pie", "No expenses in this period", "Expenses you add will be grouped by category here.");
    }
    const rows = series.slice().reverse().map(function (s) {
      return '<tr><td><b>' + esc(monthLabel(s.key)) + '</b></td><td class="tabular text-success">' + money(s.income) + '</td><td class="tabular text-danger">' + money(s.expenses) + '</td><td class="tabular' + (s.savings < 0 ? " text-danger" : "") + '">' + money(s.savings) + '</td><td class="tabular muted">' + (s.income ? Math.round(s.rate * 100) + "%" : "—") + "</td></tr>";
    }).join("");
    return "<div class=\"grid\" style=\"gap:18px\">" +
      '<div class="grid stats-grid">' +
      statCard("Avg. monthly income", money(Math.round(t.income / active)), "up", money(t.income) + " total", "income") +
      statCard("Avg. monthly expense", money(Math.round(t.expenses / active)), "down", money(t.expenses) + " total", "expense") +
      statCard("Highest spending", top ? esc(top.category) : "—", "analytics", top ? money(top.value) + " · " + Math.round(top.value / Math.max(1, t.expenses) * 100) + "% of spending" : "No expenses in this period", "warning") +
      statCard("Best saving month", best ? money(best.savings) : "—", "trophy", best ? esc(monthLabel(best.key)) : "No savings yet", "info") +
      "</div>" +
      '<div class="grid grid-3">' +
      card("Monthly income vs expense", "Last " + keys.length + " months", barChart(series), tabs) +
      card("Category breakdown", "Share of total expenses", catBody) +
      "</div>" +
      '<div class="grid grid-2">' +
      card("Weekly spending", "Last 8 weeks", weeklyChart(weekBuckets(state.transactions, 8))) +
      card("Savings trend", "Monthly and cumulative savings", lineChart(series.map(function (s) { return { label: s.label, value: s.savings }; }))) +
      "</div>" +
      card("Monthly financial summary", "All amounts in " + state.prefs.currency,
        '<div style="overflow-x:auto"><table class="table"><thead><tr><th>Month</th><th style="text-align:right">Income</th><th style="text-align:right">Expense</th><th style="text-align:right">Savings</th><th style="text-align:right">Savings rate</th></tr></thead><tbody>' + rows +
        '</tbody><tfoot><tr><td><b>Total</b></td><td class="tabular text-success">' + money(t.income) + '</td><td class="tabular text-danger">' + money(t.expenses) + '</td><td class="tabular">' + money(t.savings) + '</td><td class="tabular muted">' + (t.income ? Math.round(t.savingsRate * 100) + "%" : "—") + "</td></tr></tfoot></table></div>") +
      "</div>";
  }

  function goalMonthsLeft(g) {
    if (!g.targetDate) return 1;
    const p = String(g.targetDate).split("-"), d = new Date(Number(p[0]), Number(p[1]) - 1, 1), now = new Date();
    return Math.max(1, (d.getFullYear() - now.getFullYear()) * 12 + (d.getMonth() - now.getMonth()) + 1);
  }
  function goalCard(g) {
    const target = Number(g.target) || 0, saved = Number(g.saved) || 0;
    const pct = target ? (saved / target) * 100 : 0;
    const left = Math.max(0, target - saved);
    const reached = saved >= target && target > 0;
    const passed = g.targetDate && g.targetDate < todayStr() && !reached;
    const monthly = Math.round(left / goalMonthsLeft(g) / 100) * 100;
    const status = reached ? "Goal reached 🎉" : passed ? "Passed" : money(monthly);
    return '<div class="goal-card">' +
      '<div class="goal-head"><div class="goal-title"><span class="goal-icon ' + (reached ? "done" : "") + '">' + icon(reached ? "check" : "goal") + '</span><div><h4>' + esc(g.name) + '</h4>' +
      (g.targetDate ? '<small>' + icon("calendar") + " " + esc(prettyDate(g.targetDate)) + "</small>" : "<small>No target date</small>") + "</div></div>" +
      '<div class="row-actions" style="opacity:1"><button class="icon-btn" title="Edit goal" data-action="edit-goal" data-id="' + g.id + '">' + icon("edit") + '</button><button class="icon-btn" title="Delete goal" data-action="delete-goal" data-id="' + g.id + '">' + icon("trash") + "</button></div></div>" +
      '<div class="goal-amount"><b>' + money(saved) + '</b><span class="text-info">' + Math.min(100, Math.round(pct)) + "%</span></div>" +
      '<div class="goal-sub">' + (isBnLang() ? "মোট " : "of ") + money(target) + '</div><div class="progress ' + (reached ? "good" : "") + '"><i style="width:' + Math.min(100, pct) + '%"></i></div>' +
      '<div class="goal-foot"><div><small>Remaining</small><b>' + money(left) + '</b></div><div><small>' + (reached ? "Status" : passed ? "Deadline" : "Save monthly") + '</small><b class="' + (reached ? "text-success" : passed ? "text-danger" : "") + '">' + status + "</b></div></div></div>";
  }
  function viewGoals() {
    const goals = state.goals || [];
    const target = goals.reduce(function (s, g) { return s + (Number(g.target) || 0); }, 0);
    const saved = goals.reduce(function (s, g) { return s + Math.min(Number(g.saved) || 0, Number(g.target) || 0); }, 0);
    const done = goals.filter(function (g) { return (Number(g.saved) || 0) >= (Number(g.target) || 0) && (Number(g.target) || 0) > 0; }).length;
    const addBtn = '<button class="btn btn-primary btn-sm" data-action="new-goal">' + icon("plus") + " New goal</button>";
    if (!goals.length) {
      return card("Savings Goals", "Save towards the things that matter to you",
        empty("goal", "No savings goals yet", "Try a laptop, a new phone or an emergency fund.", '<button class="btn btn-primary btn-sm" data-action="new-goal">' + icon("plus") + " Create a goal</button>"), addBtn);
    }
    return "<div class=\"grid\" style=\"gap:18px\">" +
      '<div class="grid stats-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">' +
      statCard("Total saved", money(saved), "piggy", target
        ? (isBnLang() ? Math.round(saved / target * 100) + "% সব লক্ষ্যের" : Math.round(saved / target * 100) + "% of all goals")
        : "No target set", "", true) +
      statCard("Still needed", money(Math.max(0, target - saved)), "goal", "Across all goals", "info") +
      statCard("Completed", done + " / " + goals.length, "trophy", "Goals reached", "income") +
      "</div>" +
      card("Savings Goals", "Save towards what matters to you", '<div class="goal-grid">' + goals.map(goalCard).join("") + "</div>", addBtn) +
      "</div>";
  }

  function assistantAnswer(q) {
    const s = String(q).toLowerCase();
    const d = state, key = currentKey();
    const all = totals(d.transactions), month = totals(inMonth(d.transactions, key));
    const bd = categoryBreakdown(inMonth(d.transactions, key));
    const usage = budgetUsage(d.transactions, d.budgets, key, d.prefs.overallBudget);
    const report = buildReport(d);
    const trim = function (n) { return Math.max(200, Math.round((Number(n) || 0) * 0.15 / 100) * 100); };
    const bn = isBnLang();
    const kind = function () {
      if (/monthly plan| savings plan|মাসিক পরিকল্পনা|সঞ্চয় পরিকল্পনা|পরিকল্পনা দিন/.test(s)) return "plan";
      if (/save more|সঞ্চয় বাড়াই|কীভাবে সঞ্চয়|বেশি সঞ্চয়|save-more/.test(s)) return "save-more";
      if (/which category|biggest category|top category|costs me the most|সবচেয়ে বড় ক্যাটাগরি|কোথায় খরচ|সবচেয়ে বেশি খরচ/.test(s)) return "top-category";
      if (/saved this month|how much.*saved|how much.*save|did i save|এই মাসে.*সঞ্চয়|কত সঞ্চয়|সঞ্চয় কত/.test(s)) return "saved-month";
      if (/savings rate|how am i saving|সঞ্চয়ের হার|আমি কীভাবে সঞ্চয়/.test(s)) return "rate";
      if (/budget|লিমিট|limit|বাজেট/.test(s)) return "budget";
      if (/spend|expense|খরচ|cost|category|ক্যাটাগরি/.test(s)) return "spend";
      if (/income|salary|আয়|বেতন/.test(s)) return "income";
      if (/balance|ব্যালেন্স/.test(s)) return "balance";
      if (/hello|hi|hey|নমস্কার|আসসালামুয়ালাইকুম|আসসালামু|assalamualaikum|assalamu/.test(s)) return "hello";
      return "other";
    }();
    if (kind === "plan") {
      const income = all.income > 0 ? all.income : report.avgIncome;
      if (!income) return bn
        ? "প্রথমে মাসিক আয় যোগ করুন, তবেই আমি আপনার জন্য সঞ্চয় পরিকল্পনা বানাতে পারব।"
        : "Add your monthly income first, then I can build a savings plan around it.";
      const saveTarget = report.target || Math.round(income * 0.2 / 500) * 500;
      const needs = Math.round(income * 0.5 / 500) * 500;
      const wants = Math.max(0, income - needs - saveTarget);
      const lines = bn ? [
        "মাসিক আয় " + money(income) + " ধরে, এটা একটা সহজ পরিকল্পনা:",
        "",
        "• প্রয়োজন (ভাড়া, বিদ্যুৎ, খাবার, যাতায়াত): " + money(needs) + " — ৫০%",
        "• সঞ্চয়: " + money(saveTarget) + " — " + Math.round(saveTarget / income * 100) + "%",
        "• চাহিদা (কেনাকাটা, বাইরে খাওয়া, বিনোদন): " + money(wants) + " — " + Math.round(wants / income * 100) + "%",
      ] : [
        "Based on a monthly income of " + money(income) + ", here is a simple plan:",
        "",
        "• Needs (rent, bills, food, transport): " + money(needs) + " — 50%",
        "• Savings: " + money(saveTarget) + " — " + Math.round(saveTarget / income * 100) + "%",
        "• Wants (shopping, eating out, entertainment): " + money(wants) + " — " + Math.round(wants / income * 100) + "%",
      ];
      const open = (d.goals || []).filter(function (g) { return (Number(g.saved) || 0) < (Number(g.target) || 0); });
      if (open.length) {
        lines.push("", bn ? "আপনার লক্ষ্যগুলোতে সঞ্চয় ভাগ করে দিন:" : "Split your savings across your goals:");
        open.slice(0, 3).forEach(function (g) {
          const months = goalMonthsLeft(g);
          const per = Math.round((Number(g.target) - Number(g.saved)) / months / 100) * 100;
          lines.push("• " + g.name + ": " + money(per) + (bn ? "/মাস, " : "/month for ") + months + (bn ? " মাস" : " month" + (months > 1 ? "s" : "")));
        });
      }
      return lines.join("\n");
    }
    if (kind === "save-more") {
      if (!state.transactions.length) return bn
        ? "এখনো কোনো লেনদেন নেই। আয় আর খরচ যোগ করে আবার জিজ্ঞাসা করুন।"
        : "I don't have any transactions yet. Add your income and expenses and ask me again.";
      const lines = [bn ? "এই " + monthLabel(key) + "-এ যা মনে দাঁড়িয়েছে:" : "Here is what stands out in " + monthLabel(key) + ":"];
      if (month.income > 0) {
        const rate = Math.round(Math.max(0, month.savingsRate) * 100);
        lines.push(bn
          ? "• আপনি আপনার আয়ের " + rate + "% সঞ্চয় করছেন (" + money(month.savings) + ")।"
          : "• You are saving " + rate + "% of your income (" + money(month.savings) + ").");
      }
      if (bd.length) {
        const cut = money(trim(bd[0].value));
        lines.push(bn
          ? "• " + bd[0].category + " আপনার সবচেয়ে বড় খরচ। " + cut + " কমালেই দ্রুত ফল পাবেন।"
          : "• " + bd[0].category + " is your largest expense. Cutting it by " + cut + " is the quickest win.");
      }
      const watch = usage.categories.filter(function (x) { return x.status !== "good"; });
      if (watch.length) lines.push(bn
        ? "• এই বাজেটগুলোর দিকে নজর দিন: " + watch.map(function (x) { return x.category + " (" + Math.round(x.pct) + "%)"; }).join(", ") + "।"
        : "• Watch these budgets: " + watch.map(function (x) { return x.category + " (" + Math.round(x.pct) + "%)"; }).join(", ") + ".");
      lines.push("", bn ? "এই তিনটি ধাপ চেষ্টা করুন:" : "Try these three steps:");
      report.tips.forEach(function (tip, i) { lines.push((i + 1) + ". " + tip); });
      return lines.join("\n");
    }
    if (kind === "top-category") {
      if (!bd.length) return bn
        ? "আপনি " + monthLabel(key) + "এ এখনো কোনো খরচ রেকর্ড করেননি।"
        : "You have no expenses recorded for " + monthLabel(key) + " yet.";
      const share = Math.round(bd[0].value / Math.max(1, month.expenses) * 100);
      const lines = [
        bn
          ? bd[0].category + " এই মাসে আপনার সবচেয়ে বেশি খরচ: " + money(bd[0].value) + " (" + share + "% খরচের)।"
          : bd[0].category + " costs you the most this month: " + money(bd[0].value) + " (" + share + "% of your spending).",
        "",
        bn ? "আপনার প্রধান ক্যাটাগরি:" : "Your top categories:"
      ];
      bd.slice(0, 3).forEach(function (x, i) { lines.push((i + 1) + ". " + x.category + " — " + money(x.value) + " (" + Math.round(x.value / Math.max(1, month.expenses) * 100) + "%)"); });
      const row = usage.categories.filter(function (x) { return x.category === bd[0].category; })[0];
      if (row) lines.push("", bn
        ? "আপনার " + bd[0].category + " বাজেট " + Math.round(row.pct) + "% ব্যবহৃত।"
        : "Your " + bd[0].category + " budget is " + Math.round(row.pct) + "% used.");
      return lines.join("\n");
    }
    if (kind === "saved-month") {
      const rate = Math.round(month.savingsRate * 100);
      const lines = bn ? [
        "এই " + monthLabel(key) + " পর্যন্ত আপনার আয় " + money(month.income) + " এবং খরচ " + money(month.expenses) + "।",
        month.savings >= 0
          ? "অর্থাৎ আপনি " + money(month.savings) + (month.income ? " সঞ্চয় করেছেন — আয়ের " + rate + "%।" : " সঞ্চয় করেছেন।")
          : "অর্থাৎ এই মাসে আপনি " + money(-month.savings) + " কম আছেন।"
      ] : [
        "In " + monthLabel(key) + " so far you earned " + money(month.income) + " and spent " + money(month.expenses) + ".",
        month.savings >= 0 ? "That means you saved " + money(month.savings) + (month.income ? " — " + rate + "% of your income." : ".") : "That means you are " + money(-month.savings) + " short this month."
      ];
      if (report.target) {
        const gap = report.target - month.savings;
        lines.push(bn
          ? (gap > 0
            ? "প্রস্তাবিত লক্ষ্য " + money(report.target) + " পৌঁছাতে আপনার " + money(gap) + " বাকি আছে।"
            : "আপনি ইতিমধ্যেই প্রস্তাবিত লক্ষ্য " + money(report.target) + " পৌঁছেছেন। দারুণ কাজ!")
          : (gap > 0
            ? "You are " + money(gap) + " away from the suggested target of " + money(report.target) + "."
            : "You have already reached the suggested target of " + money(report.target) + ". Great work!"));
      }
      return lines.join("\n");
    }
    if (kind === "rate") {
      const r = all.income ? Math.round(all.savingsRate * 100) : 0;
      const target = all.income ? money(Math.round(all.income * 0.2 / 500) * 500) : null;
      return "Your all-time savings rate is " + r + "% of income. A common guideline is 20%." +
        (target ? " Based on your income, a good monthly target would be around " + target + ". You have saved " + money(all.savings) + " so far." : " Add some income to unlock a personalised target.");
    }
    if (kind === "budget") {
      if (!usage.categories.length && !usage.overall) return "You have not set any budgets yet. Head to the Budgets page to create one.";
      const over = usage.categories.filter(function (x) { return x.pct >= 100; });
      if (over.length) return "Warning: " + over.map(function (x) { return x.category + " (" + Math.round(x.pct) + "%)"; }).join(", ") + " exceeded the limit this month.";
      if (usage.overall) return "You have used " + Math.round(usage.overall.pct) + "% of your overall monthly limit, with " + money(Math.max(0, usage.overall.limit - usage.overall.spent)) + " left.";
      return "All category budgets are on track this month. Nicely done!";
    }
    if (kind === "spend") {
      if (!bd.length) return "No expenses recorded this month yet.";
      return "This month you spent " + money(month.expenses) + ". Your biggest category is " + bd[0].category + " at " + money(bd[0].value) + " (" + Math.round(bd[0].value / Math.max(1, month.expenses) * 100) + "% of spending).";
    }
    if (kind === "income") return "You have recorded " + money(all.income) + " of total income, including " + money(month.income) + " this month.";
    if (kind === "balance") return "Your current balance is " + money(all.balance) + " (income minus expenses and savings).";
    if (kind === "hello") return bn
      ? "আসসালামুয়ালাইকুম! আমি আপনার আয়, খরচ, বাজেট, সঞ্চয়ের লক্ষ্য ও খরচের অভ্যাস বিশ্লেষণ করতে পারি। সবচেয়ে বড় খরচ, মাসিক সঞ্চয় পরিকল্পনা বা সঞ্চয়ের হার সম্পর্কে জিজ্ঞাসা করুন।"
      : "Hi! I can analyse your income, expenses, budgets, savings goals and spending habits. Try asking about your biggest expense, a monthly savings plan, or your savings rate.";
    return bn
      ? "আমি সঞ্চয়ের হার, বাজেট, খরচের ক্যাটাগরি, আয়, লক্ষ্য ও ব্যালেন্সে সাহায্য করতে পারি। উপরের প্রশ্নগুলোর একটি চেষ্টা করুন।"
      : "I can help with your savings rate, budgets, spending categories, income, goals and balance. Try one of the suggested questions above.";
  }
  function viewAssistant() {
    const report = buildReport(state);
    const presets = ["How can I save more money?", "Which category costs me the most?", "How much money did I save this month?", "Give me a monthly savings plan.", "Am I over budget?", "What is my balance?"];
    return '<div class="grid" style="gap:18px">' +
      '<div class="grid grid-2">' +
      card("Your savings health", "Based on your current data", '<div class="score-hero"><div class="score-badge" style="background:' + (report.score >= 60 ? "var(--success)" : report.score >= 40 ? "var(--warning)" : "var(--danger)") + '">' + report.score + '</div><div><h4>' + report.scoreLabel + "</h4><p>" + (report.target ? "Suggested savings target: " + money(report.target) + " per month" : "Add income to unlock a suggested target") + '</p></div></div><ul class="insights">' +
        report.insights.map(function (i) {
          const color = i.tone === "positive" ? "var(--success)" : i.tone === "warning" ? "var(--warning)" : i.tone === "danger" ? "var(--danger)" : "var(--info)";
          return '<li class="insight"><span class="dot" style="background:' + color + '"></span><span><b>' + esc(i.title) + ".</b> <span>" + esc(i.message) + "</span></span></li>";
        }).join("") + "</ul>") +
      card("Ask the assistant", "Answers are generated from your own data", '<div id="chat-log" class="chat"></div>' +
        '<div class="chips" style="margin-top:14px">' + presets.map(function (q) {
          return '<button class="chip" data-action="chat-preset" data-q="' + esc(q) + '">' + esc(q) + "</button>";
        }).join("") + '</div><form class="chat-form" data-form="chat"><input class="input" name="q" placeholder="Ask about your money…" autocomplete="off" required/><button class="btn btn-primary" type="submit">' + icon("send") + "</button></form>") +
      "</div>" +
      card("Bangladesh savings tips", "Practical ideas from your own numbers — no server, works offline", '<ul class="tip-grid">' +
        report.tips.map(function (tip, i) {
          return '<li><span class="tip-num">' + (i + 1) + '</span><span>' + esc(tip) + "</span></li>";
        }).join("") + "</ul>") +
      "</div>";
  }
  function renderChat() {
    const log = $("#chat-log");
    if (!log) return;
    if (!ui.chat.length) ui.chat.push({ who: "bot", text: "Hi! I am your HisabTrack savings assistant. Ask me anything about your money, or tap a suggested question." });
    log.innerHTML = ui.chat.map(function (m) { return '<div class="chat-msg ' + m.who + '">' + esc(m.text) + "</div>"; }).join("");
    log.scrollTop = log.scrollHeight;
  }

  /* ---------- PIN lock screen ---------- */
  function lockScreenHTML(mode) {
    const recovering = mode === "recover";
    return '<div class="lock-screen"><div class="lock-card">' +
      '<div class="lock-mark">৳</div><h2>HisabTrack</h2>' +
      '<p class="lock-sub">' + (recovering ? "Enter your recovery code" : "Enter your PIN to continue") + "</p>" +
      '<div class="lock-error" id="pin-error"></div>' +
      '<form data-form="' + (recovering ? "pin-recover" : "pin-unlock") + '">' +
      '<input id="pin-input" name="' + (recovering ? "code" : "pin") + '" class="input pin-input" type="password" ' +
      (recovering ? 'maxlength="12" placeholder="Recovery code" autocomplete="off"'
                  : 'inputmode="numeric" pattern="[0-9]{4,6}" maxlength="6" placeholder="••••" autocomplete="current-password"') +
      ' required/><button class="btn btn-primary btn-block" type="submit" style="margin-top:12px">' +
      (recovering ? "Reset PIN" : "Unlock") + "</button></form>" +
      '<button class="lock-link" data-action="' + (recovering ? "pin-back" : "pin-forgot") + '">' +
      (recovering ? "Back to PIN" : "Forgot PIN?") + "</button></div></div>";
  }
  function showLock(mode) {
    pin.locked = true;
    pin.recovering = mode === "recover";
    closeModal();
    document.body.classList.add("pin-locked");
    const root = $("#lock-root");
    if (root) root.innerHTML = lockScreenHTML(pin.recovering ? "recover" : "pin");
    const input = $("#pin-input");
    if (input) input.focus();
  }
  function hideLock() {
    pin.locked = false;
    pin.recovering = false;
    document.body.classList.remove("pin-locked");
    const root = $("#lock-root");
    if (root) root.innerHTML = "";
    pin.lastActivity = Date.now();
  }
  function pinError(msg) {
    const el = $("#pin-error");
    if (el) el.textContent = msg;
    const input = $("#pin-input");
    if (input) { input.value = ""; input.focus(); }
    const box = $(".lock-card");
    if (box) { box.classList.remove("lock-shake"); void box.offsetWidth; box.classList.add("lock-shake"); }
  }
  function openRecovery() {
    $("#modal-root").innerHTML = '<div class="modal-overlay" data-action="overlay"><div class="modal" style="max-width:400px">' +
      '<div class="modal-head"><h3>Recovery code</h3><button class="icon-btn" data-action="close-modal">' + icon("close") + "</button></div>" +
      '<div class="modal-body"><p class="muted" style="margin:0">Save this code somewhere safe. If you forget your PIN, enter it on the lock screen to remove the PIN without losing your data.</p>' +
      '<div class="recovery-code">' + esc(pin.data.recovery) + "</div></div>" +
      '<div class="modal-foot"><button class="btn btn-primary" data-action="close-modal">I saved it</button></div></div></div>';
  }
  function openPinRemove() {
    $("#modal-root").innerHTML = '<div class="modal-overlay" data-action="overlay"><div class="modal" style="max-width:400px">' +
      '<div class="modal-head"><h3>Turn off PIN lock</h3><button class="icon-btn" data-action="close-modal">' + icon("close") + "</button></div>" +
      '<form data-form="pin-disable"><div class="modal-body"><div class="field"><label>Current PIN</label>' +
      '<input class="input" name="current" type="password" inputmode="numeric" pattern="[0-9]{4,6}" maxlength="6" required/>' +
      '<span class="hint">Your transactions and budgets are not affected.</span></div></div>' +
      '<div class="modal-foot"><button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button>' +
      '<button type="submit" class="btn btn-danger">Turn off PIN</button></div></form></div></div>';
  }

  function pinSettingsCard() {
    const p = pin.data;
    const opts = [[0, "Off"], [1, "1 minute"], [5, "5 minutes"], [15, "15 minutes"], [30, "30 minutes"]]
      .map(function (o) { return '<option value="' + o[0] + '"' + (p.autoLock === o[0] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("");
    return card("PIN lock", "Protect this browser with a 4–6 digit PIN",
      '<div class="stat-mini"><span>Status</span><b>' + (p.enabled ? "On" : "Off") + "</b></div>" +
      '<form data-form="pin-settings" class="grid" style="gap:12px;margin-top:12px">' +
      (p.enabled ? '<div class="field"><label>Current PIN</label><input class="input" name="current" type="password" inputmode="numeric" pattern="[0-9]{4,6}" maxlength="6" required/></div>' : "") +
      '<div class="field-row">' +
      '<div class="field"><label>' + (p.enabled ? "New PIN" : "PIN") + '</label><input class="input" name="pin" type="password" inputmode="numeric" pattern="[0-9]{4,6}" maxlength="6" placeholder="4–6 digits" ' + (p.enabled ? "" : "required") + "/></div>" +
      '<div class="field"><label>Confirm PIN</label><input class="input" name="confirm" type="password" inputmode="numeric" pattern="[0-9]{4,6}" maxlength="6" placeholder="Repeat"/></div>' +
      "</div>" +
      '<div class="field"><label>Auto-lock after inactivity</label><select class="input" name="autoLock">' + opts + "</select>" +
      '<span class="hint">Locks the app after this much time without activity. Off means only manual lock.</span></div>' +
      '<div class="chips"><button class="btn btn-primary btn-sm" type="submit">' + icon("check") + " " + (p.enabled ? "Update PIN lock" : "Enable PIN lock") + "</button>" +
      (p.enabled ? '<button class="btn btn-outline btn-sm" type="button" data-action="lock-now">' + icon("settings") + " Lock now</button>" +
        '<button class="btn btn-outline btn-sm" type="button" data-action="show-recovery">Recovery code</button>' +
        '<button class="btn btn-danger btn-sm" type="button" data-action="pin-remove">Turn off PIN</button>' : "") +
      "</div></form>" +
      '<p class="muted tiny" style="margin:12px 0 0">This is a screen lock for this browser only. It does not encrypt your data. Export JSON backups to protect them.</p>');
  }

  function viewSettings() {
    const size = 0;
    try { size = new Blob([localStorage.getItem(STORE_KEY) || ""]).size; } catch (e) {}
    const curOpts = Object.keys(SYMBOLS).map(function (k) { return '<option value="' + k + '"' + (state.prefs.currency === k ? " selected" : "") + ">" + k + " (" + SYMBOLS[k] + ")</option>"; }).join("");
    const theme = state.prefs.theme === "light" ? "light" : "dark";
    const themeCards = '<div class="theme-cards">' +
      '<button type="button" class="' + (theme === "dark" ? "active" : "") + '" data-action="set-theme" data-theme="dark">' + icon("moon") + "<b>Dark</b><small>Easy on the eyes</small></button>" +
      '<button type="button" class="' + (theme === "light" ? "active" : "") + '" data-action="set-theme" data-theme="light">' + icon("sun") + "<b>Light</b><small>Bright and clean</small></button></div>";
    return '<div class="grid grid-2">' +
      pinSettingsCard() +
      card("Preferences", "Personalise your HisabTrack", '<form data-form="prefs" class="grid" style="gap:14px">' +
        '<div class="field"><label>Display name</label><input class="input" name="name" value="' + esc(state.prefs.name) + '"/></div>' +
        '<div class="field"><label>Currency</label><select class="input" name="currency">' + curOpts + '</select><span class="hint">Amounts are stored as numbers; only the symbol changes.</span></div>' +
        '<button class="btn btn-primary" type="submit">' + icon("check") + " Save preferences</button></form>") +
      card("Theme", "Choose how HisabTrack looks", themeCards) +
      card("Your data", "Everything is stored in this browser", '<div class="stat-mini"><span>Transactions</span><b>' + state.transactions.length + '</b></div>' +
        '<div class="stat-mini"><span>Budgets</span><b>' + state.budgets.length + '</b></div>' +
        '<div class="stat-mini"><span>Savings goals</span><b>' + (state.goals || []).length + '</b></div>' +
        '<div class="stat-mini"><span>Storage used</span><b>' + Math.max(1, Math.round(size / 1024)) + " KB</b></div>" +
        '<div class="divider"></div><div class="chips"><button class="btn btn-outline btn-sm" data-action="export">' + icon("download") + " Export JSON</button>" +
        '<button class="btn btn-outline btn-sm" data-action="export-csv">' + icon("download") + " Export CSV</button>" +
        '<button class="btn btn-outline btn-sm" data-action="import">' + icon("upload") + " Import JSON</button>" +
        '<button class="btn btn-outline btn-sm" data-action="reset-demo">' + icon("refresh") + " Restore demo data</button>" +
        '<button class="btn btn-outline btn-sm" data-action="setup-start">' + icon("sparkles") + " Guided setup</button>" +
        '<button class="btn btn-danger btn-sm" data-action="clear-all">' + icon("trash") + " Clear everything</button></div>" +
        '<input type="file" id="import-file" accept="application/json,.json" hidden/>') +
      card("Android app", "Install it on your phone", '<p class="muted" style="margin:0 0 10px">Download the APK file, open it on your Android phone, and allow installation from unknown sources to install HisabTrack as a full-screen app.</p>' +
        '<div class="chips" style="margin-top:12px"><a class="btn btn-primary btn-sm" href="https://hisabtrack.netlify.app/apk/HisabTrack.apk" download>' + icon("download") + ' Download APK</a>' +
        '<a class="btn btn-outline btn-sm" href="https://hisabtrack.netlify.app/" target="_blank" rel="noopener">' + icon("info") + ' Open web app</a></div>') +
      card("About HisabTrack", "", '<p class="muted" style="margin:0 0 10px">HisabTrack is a simple, private finance manager. No account, no server, no tracking — your data never leaves this browser.</p><p class="muted tiny" style="margin:0">Tip: use Export JSON or CSV to back up your data regularly, and Import JSON to restore it on another device.</p>') +
      "</div>";
  }

  const VIEWS = { dashboard: viewDashboard, transactions: viewTransactions, budgets: viewBudgets, analytics: viewAnalytics, assistant: viewAssistant, goals: viewGoals, settings: viewSettings };

  /* ---------- shell & router ---------- */
  function currentRoute() {
    const h = window.location.hash.replace(/^#\/?/, "").split("?")[0];
    return ROUTES[h] ? h : "dashboard";
  }
  function navItems() {
    return ["dashboard", "transactions", "budgets", "analytics", "assistant", "goals", "settings"].map(function (k) {
      return '<button class="nav-item' + (ui.route === k ? " active" : "") + '" data-action="go" data-route="' + k + '">' + icon(ROUTES[k].icon) + "<span>" + ROUTES[k].title + "</span></button>";
    }).join("");
  }
  function shell() {
    const r = ROUTES[ui.route];
    const theme = state.prefs.theme === "light" ? "light" : "dark";
    const initials = String(state.prefs.name || "U").trim().split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
    const themeSwitch = '<div class="theme-switch" role="group" aria-label="Theme">' +
      '<button type="button" class="' + (theme === "dark" ? "active" : "") + '" data-action="set-theme" data-theme="dark" title="Dark theme">' + icon("moon") + "</button>" +
      '<button type="button" class="' + (theme === "light" ? "active" : "") + '" data-action="set-theme" data-theme="light" title="Light theme">' + icon("sun") + "</button></div>";
    const mobile = [
      ["dashboard", "Home"], ["transactions", "Txns"], ["budgets", "Budgets"], ["analytics", "Charts"], ["assistant", "AI"], ["goals", "Goals"],
    ];
    return '<div class="app">' +
      '<aside class="sidebar"><div class="brand"><div class="brand-mark">৳</div><div><div class="brand-name">Hisab<span>Track</span></div><div class="brand-tag">Track your money. Control your future.</div></div></div>' +
      '<nav class="nav"><div class="nav-label">Workspace</div>' + navItems() + "</nav>" +
      '<div class="sidebar-foot"><div class="side-card"><p>Save towards the things that matter to you.</p><button class="btn btn-primary btn-sm btn-block" data-action="go" data-route="goals">' + icon("goal") + " Savings goals</button></div>" +
      '<div class="side-user"><div class="avatar">' + esc(initials) + '</div><div><b>' + esc(state.prefs.name || "User") + '</b><small>' + esc(state.prefs.currency) + " account</small></div></div></div></aside>" +
      '<div class="main"><header class="topbar"><div><h1 class="page-title">' + r.title + '</h1><p class="page-subtitle">' + r.subtitle + '</p></div><div class="topbar-actions">' +
      '<span class="date-pill">' + new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) + '</span>' +
      themeSwitch +
      '<button class="icon-btn settings-top" data-action="go" data-route="settings" title="Settings">' + icon("settings") + "</button>" +
      '<a class="btn btn-ghost btn-sm apk-top" href="https://hisabtrack.netlify.app/apk/HisabTrack.apk" download title="Download APK">' + icon("download") + " APK</a>" +
      '<button class="btn btn-primary" data-action="quick-add">' + icon("plus") + " Quick add</button></div></header>" +
      '<main class="view">' + VIEWS[ui.route]() + "</main></div></div>" +
      '<nav class="mobile-nav">' + mobile.map(function (m) {
        return '<button class="' + (ui.route === m[0] ? "active" : "") + '" data-action="go" data-route="' + m[0] + '">' + icon(ROUTES[m[0]].icon) + "<span>" + m[1] + "</span></button>";
      }).join("") + "</nav>";
  }
  function render() {
    ui.route = currentRoute();
    applyTheme();
    document.title = ROUTES[ui.route].title + " — HisabTrack";
    const app = $("#app");
    app.innerHTML = shell();
    if (ui.route === "transactions") renderTxTable();
    if (ui.route === "assistant") renderChat();
    window.scrollTo(0, 0);
  }
  function go(route) {
    if (ROUTES[route]) window.location.hash = "#/" + route;
  }

  /* ---------- modals ---------- */
  function closeModal() { $("#modal-root").innerHTML = ""; ui.draft = null; }
  function openTxModal(tx) {
    ui.draft = tx ? Object.assign({}, tx) : { type: "expense", amount: "", category: "Food", note: "", date: todayStr() };
    renderTxModal();
  }
  function renderTxModal() {
    const d = ui.draft;
    if (!d) return;
    const editing = !!d.id;
    const cats = CATEGORIES[d.type].map(function (c) { return '<option value="' + c + '"' + (d.category === c ? " selected" : "") + ">" + c + "</option>"; }).join("");
    const segs = ["income", "expense", "savings"].map(function (k) {
      return '<button type="button" data-action="set-type" data-type="' + k + '" class="' + (d.type === k ? "active" : "") + '">' + k.charAt(0).toUpperCase() + k.slice(1) + "</button>";
    }).join("");
    $("#modal-root").innerHTML = '<div class="modal-overlay" data-action="overlay"><div class="modal" role="dialog" aria-modal="true">' +
      '<div class="modal-head"><h3>' + (editing ? "Edit transaction" : "Add transaction") + '</h3><button class="icon-btn" data-action="close-modal">' + icon("close") + "</button></div>" +
      '<form data-form="tx"><div class="modal-body">' +
      '<div class="field"><label>Type</label><div class="segmented">' + segs + "</div></div>" +
      '<div class="field-row"><div class="field"><label>Amount</label><input class="input" data-field="amount" type="number" min="1" step="1" placeholder="0" value="' + esc(d.amount) + '" required autofocus/></div>' +
      '<div class="field"><label>Date</label><input class="input" data-field="date" type="date" value="' + esc(d.date) + '" required/></div></div>' +
      '<div class="field"><label>Category</label><select class="input" data-field="category">' + cats + "</select></div>" +
      '<div class="field"><label>Note</label><input class="input" data-field="note" maxlength="80" placeholder="What was it for?" value="' + esc(d.note) + '"/></div>' +
      '</div><div class="modal-foot"><button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">' + (editing ? "Save changes" : "Add transaction") + "</button></div></form></div></div>";
  }
  function openBudgetModal(b) {
    $("#modal-root").innerHTML = '<div class="modal-overlay" data-action="overlay"><div class="modal" style="max-width:400px" role="dialog" aria-modal="true">' +
      '<div class="modal-head"><h3>Edit budget · ' + esc(b.category) + '</h3><button class="icon-btn" data-action="close-modal">' + icon("close") + "</button></div>" +
      '<form data-form="edit-budget"><div class="modal-body"><div class="field"><label>Monthly limit</label>' +
      '<input class="input" name="limit" type="number" min="1" step="any" value="' + Number(b.limit) + '" required/>' +
      '<span class="hint">Spent so far this month: ' + money(inMonth(state.transactions, currentKey()).filter(function (x) { return x.type === "expense" && x.category === b.category; }).reduce(function (s, x) { return s + Number(x.amount); }, 0)) + "</span></div></div>" +
      '<div class="modal-foot"><button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary" data-id="' + b.id + '">Save budget</button></div></form></div></div>';
  }
  function openGoalModal(g) {
    const editing = !!g;
    const sym = SYMBOLS[state.prefs.currency] || "৳";
    $("#modal-root").innerHTML = '<div class="modal-overlay" data-action="overlay"><div class="modal" style="max-width:460px" role="dialog" aria-modal="true">' +
      '<div class="modal-head"><h3>' + (editing ? "Edit goal" : "New savings goal") + '</h3><button class="icon-btn" data-action="close-modal">' + icon("close") + "</button></div>" +
      '<form data-form="goal"><div class="modal-body">' +
      '<div class="field"><label>Goal name</label><input class="input" name="name" maxlength="60" placeholder="e.g. Buy a Laptop" value="' + esc(editing ? g.name : "") + '" required/></div>' +
      '<div class="field-row"><div class="field"><label>Target (' + sym + ')</label><input class="input" name="target" type="number" min="1" step="any" placeholder="60000" value="' + esc(editing ? g.target : "") + '" required/></div>' +
      '<div class="field"><label>Saved so far (' + sym + ')</label><input class="input" name="saved" type="number" min="0" step="any" placeholder="0" value="' + esc(editing ? g.saved : "0") + '"/></div></div>' +
      '<div class="field"><label>Target date</label><input class="input" name="targetDate" type="date" value="' + esc(editing ? g.targetDate || "" : "") + '"/><span class="hint">Optional — used to work out how much to save each month.</span></div>' +
      '</div><div class="modal-foot"><button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary" data-id="' + (editing ? g.id : "") + '">' + (editing ? "Save changes" : "Create goal") + "</button></div></form></div></div>";
  }
  function openConfirm(title, message, action) {
    $("#modal-root").innerHTML = '<div class="modal-overlay" data-action="overlay"><div class="modal" style="max-width:400px">' +
      '<div class="modal-head"><h3>' + esc(title) + '</h3><button class="icon-btn" data-action="close-modal">' + icon("close") + "</button></div>" +
      '<div class="modal-body"><p class="muted" style="margin:0">' + esc(message) + "</p></div>" +
      '<div class="modal-foot"><button class="btn btn-outline" data-action="close-modal">Cancel</button><button class="btn btn-danger" data-action="' + action.act + '" data-id="' + esc(action.id || "") + '">' + esc(action.label) + "</button></div></div></div>";
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const a = el.getAttribute("data-action");
    if (a === "pin-forgot") { showLock("recover"); return; }
    if (a === "pin-back") { showLock("pin"); return; }
    if (a === "lock-now") { showLock("pin"); return; }
    if (a === "show-recovery") { openRecovery(); return; }
    if (a === "pin-remove") { openPinRemove(); return; }
    if (a === "setup-skip") { markSetupDone(); hideSetup(); render(); toast("You can run Guided setup any time from Settings"); return; }
    if (a === "setup-start") { startSetup(true); return; }
    if (a === "overlay") { if (e.target === el) closeModal(); return; }
    if (a === "close-modal") { closeModal(); return; }
    if (a === "go") { go(el.getAttribute("data-route")); return; }
    if (a === "set-theme") {
      state.prefs.theme = el.getAttribute("data-theme") === "light" ? "light" : "dark";
      save(); applyTheme(); render(); toast(state.prefs.theme === "light" ? "Light theme on" : "Dark theme on");
      return;
    }
    if (a === "set-range") { ui.range = el.getAttribute("data-range") || "6"; render(); return; }
    if (a === "new-goal") { openGoalModal(null); return; }
    if (a === "edit-goal") {
      const g = (state.goals || []).find(function (x) { return x.id === el.getAttribute("data-id"); });
      if (g) openGoalModal(g);
      return;
    }
    if (a === "delete-goal") {
      const g = (state.goals || []).find(function (x) { return x.id === el.getAttribute("data-id"); });
      if (g) openConfirm("Delete this goal?", "“" + g.name + "” and its progress will be removed.", { act: "confirm-delete-goal", id: g.id, label: "Delete" });
      return;
    }
    if (a === "confirm-delete-goal") {
      state.goals = (state.goals || []).filter(function (x) { return x.id !== el.getAttribute("data-id"); });
      save(); closeModal(); render(); toast("Goal deleted");
      return;
    }
    if (a === "quick-add") { openTxModal(null); return; }
    if (a === "set-type") {
      if (ui.draft) { ui.draft.type = el.getAttribute("data-type"); ui.draft.category = CATEGORIES[ui.draft.type][0]; renderTxModal(); }
      return;
    }
    if (a === "edit-tx") {
      const t = state.transactions.find(function (x) { return x.id === el.getAttribute("data-id"); });
      if (t) openTxModal(t);
      return;
    }
    if (a === "delete-tx") {
      const t = state.transactions.find(function (x) { return x.id === el.getAttribute("data-id"); });
      if (t) openConfirm("Delete transaction", "Delete “" + (t.note || t.category) + "” of " + money(t.amount) + "? This cannot be undone.", { act: "confirm-delete-tx", id: t.id, label: "Delete" });
      return;
    }
    if (a === "confirm-delete-tx") {
      state.transactions = state.transactions.filter(function (x) { return x.id !== el.getAttribute("data-id"); });
      save(); closeModal(); render(); toast("Transaction deleted");
      return;
    }
    if (a === "edit-budget") {
      const b = state.budgets.find(function (x) { return x.id === el.getAttribute("data-id"); });
      if (b) openBudgetModal(b);
      return;
    }
    if (a === "delete-budget") {
      state.budgets = state.budgets.filter(function (x) { return x.id !== el.getAttribute("data-id"); });
      save(); render(); toast("Budget removed");
      return;
    }
    if (a === "filter-type") { ui.type = el.getAttribute("data-type"); render(); return; }
    if (a === "chat-preset") { pushChat(el.getAttribute("data-q")); return; }
    if (a === "export") {
      try {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url; link.download = "hisabtrack-backup-" + todayStr() + ".json";
        document.body.appendChild(link); link.click(); link.remove();
        URL.revokeObjectURL(url);
        toast("Backup downloaded");
      } catch (err) { toast("Export failed", "error"); }
      return;
    }
    if (a === "export-csv") {
      try {
        if (!state.transactions.length) { toast("No transactions to export", "error"); return; }
        const q = function (v) { const s = String(v == null ? "" : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
        const head = ["Date", "Type", "Category", "Note", "Amount (" + state.prefs.currency + ")"];
        const lines = [head.map(q).join(",")];
        state.transactions.slice().sort(function (x, y) { return String(y.date).localeCompare(String(x.date)); }).forEach(function (x) {
          lines.push([x.date, x.type, x.category, x.note || "", x.amount].map(q).join(","));
        });
        const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url; link.download = "hisabtrack-transactions-" + todayStr() + ".csv";
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        toast("CSV exported");
      } catch (err) { toast("Export failed", "error"); }
      return;
    }
    if (a === "import") { const f = $("#import-file"); if (f) f.click(); return; }
    if (a === "reset-demo") {
      openConfirm("Restore demo data", "This replaces all current transactions, budgets and goals with sample data.", { act: "confirm-reset", label: "Restore" });
      return;
    }
    if (a === "confirm-reset") { state = seed(); markSetupDone(); save(); closeModal(); render(); toast("Demo data restored"); return; }
    if (a === "clear-all") {
      openConfirm("Clear everything", "This permanently deletes all transactions, budgets and goals. Export a backup first if needed.", { act: "confirm-clear", label: "Delete all" });
      return;
    }
    if (a === "confirm-clear") { state = { transactions: [], budgets: [], goals: [], prefs: state.prefs }; markSetupDone(); save(); closeModal(); render(); toast("All data cleared"); return; }
  });

  document.addEventListener("input", function (e) {
    const t = e.target;
    if (t.id === "tx-search") { ui.search = t.value; renderTxTable(); return; }
    if (ui.draft && t.hasAttribute("data-field")) { ui.draft[t.getAttribute("data-field")] = t.value; }
  });

  document.addEventListener("submit", function (e) {
    const form = e.target.closest("form[data-form]");
    if (!form) return;
    e.preventDefault();
    const kind = form.getAttribute("data-form");
    const f = form.elements;
    if (kind === "tx") {
      const d = ui.draft;
      const amount = Number(d && d.amount);
      if (!amount || amount <= 0) { toast("Enter an amount greater than zero", "error"); return; }
      if (!d.date) { toast("Choose a date", "error"); return; }
      if (d.id) {
        const idx = state.transactions.findIndex(function (x) { return x.id === d.id; });
        if (idx >= 0) state.transactions[idx] = Object.assign({}, d, { amount: amount });
        toast("Transaction updated");
      } else {
        state.transactions.push({ id: uid(), type: d.type, amount: amount, category: d.category, note: (d.note || "").trim(), date: d.date });
        toast("Transaction added");
      }
      save(); closeModal(); render();
    } else if (kind === "budget") {
      const category = f.category.value;
      const limit = Number(f.limit.value);
      if (!limit || limit <= 0) { toast("Enter a valid limit", "error"); return; }
      const exists = state.budgets.some(function (b) { return b.category === category; });
      if (exists) { toast("A budget for " + category + " already exists", "error"); return; }
      state.budgets.push({ id: uid(), category: category, limit: limit });
      save(); render(); toast("Budget added");
    } else if (kind === "edit-budget") {
      const id = form.querySelector('[type="submit"]').getAttribute("data-id");
      const b = state.budgets.find(function (x) { return x.id === id; });
      const limit = Number(f.limit.value);
      if (b && limit > 0) { b.limit = limit; save(); closeModal(); render(); toast("Budget updated"); }
      else toast("Enter a valid amount", "error");
    } else if (kind === "goal") {
      const id = form.querySelector('[type="submit"]').getAttribute("data-id");
      const name = (f.name.value || "").trim();
      const target = Number(f.target.value);
      const saved = Math.max(0, Number(f.saved.value) || 0);
      const date = f.targetDate.value || "";
      if (!name) { toast("Enter a goal name", "error"); return; }
      if (!target || target <= 0) { toast("Enter a target greater than zero", "error"); return; }
      const data = { name: name, target: target, saved: saved, targetDate: date };
      state.goals = state.goals || [];
      if (id) {
        const g = state.goals.find(function (x) { return x.id === id; });
        if (g) Object.assign(g, data);
        toast("Goal updated");
      } else {
        state.goals.push(Object.assign({ id: uid() }, data));
        toast("Goal created");
      }
      save(); closeModal(); render();
    } else if (kind === "overall") {
      state.prefs.overallBudget = Math.max(0, Number(f.overall.value) || 0);
      save(); render(); toast("Overall limit saved");
    } else if (kind === "prefs") {
      state.prefs.name = (f.name.value || "User").trim();
      state.prefs.currency = f.currency.value;
      if (f.theme) state.prefs.theme = f.theme.value === "light" ? "light" : "dark";
      save(); applyTheme(); render(); toast("Preferences saved");
    } else if (kind === "chat") {
      const q = (f.q.value || "").trim();
      if (q) { f.q.value = ""; pushChat(q); }
    } else if (kind === "setup-name") {
      const nameInput = f.namedItem("name");
      const name = ((nameInput && nameInput.value) || "").trim();
      if (!name) { toast("Please enter your name", "error"); return; }
      state.prefs.name = name; save(); render(); hideSetup();
      toast("Nice to meet you, " + name + "!");
      setTimeout(function () { showSetup(1); }, 900);
    } else if (kind === "setup-step") {
      const s = SETUP_STEPS[setup.step - 1];
      if (!s) return;
      const valueInput = f.namedItem("value");
      setup.data[s.key] = Math.max(0, Number(valueInput && valueInput.value) || 0);
      if (setup.step < SETUP_STEPS.length) showSetup(setup.step + 1);
      else finishSetup();
    } else if (kind === "pin-unlock") {
      const val = (f.pin.value || "").trim();
      if (!/^\d{4,6}$/.test(val)) { pinError("Enter your 4–6 digit PIN"); return; }
      hashPin(val, pin.data.salt).then(function (h) {
        if (h === pin.data.hash) { hideLock(); toast("Unlocked"); }
        else pinError("Incorrect PIN");
      });
    } else if (kind === "pin-recover") {
      const code = (f.code.value || "").trim().toUpperCase();
      if (code && code === pin.data.recovery) {
        disablePin(); hideLock(); render(); toast("PIN removed — set a new one in Settings");
      } else pinError("Incorrect recovery code");
    } else if (kind === "pin-settings") {
      const next = (f.pin.value || "").trim();
      const confirm = (f.confirm.value || "").trim();
      const autoLock = Math.max(0, Number(f.autoLock.value) || 0);
      if (next && !/^\d{4,6}$/.test(next)) { toast("PIN must be 4–6 digits", "error"); return; }
      if (next && next !== confirm) { toast("PINs do not match", "error"); return; }
      function finishPin() {
        const first = !pin.data.enabled || !pin.data.hash;
        const salt = newSalt();
        hashPin(next, salt).then(function (h) {
          pin.data.enabled = true; pin.data.salt = salt; pin.data.hash = h; pin.data.autoLock = autoLock;
          if (first || !pin.data.recovery) pin.data.recovery = makeRecovery();
          savePin(); render();
          if (first) openRecovery(); else toast("PIN lock updated");
        });
      }
      if (pin.data.enabled) {
        const current = (f.current.value || "").trim();
        hashPin(current, pin.data.salt).then(function (h) {
          if (h !== pin.data.hash) { toast("Current PIN is incorrect", "error"); return; }
          finishPin();
        });
      } else if (next) finishPin();
      else { pin.data.autoLock = autoLock; savePin(); render(); toast("Auto-lock updated"); }
    } else if (kind === "pin-disable") {
      const current = (f.current.value || "").trim();
      hashPin(current, pin.data.salt).then(function (h) {
        if (h !== pin.data.hash) { toast("Current PIN is incorrect", "error"); return; }
        disablePin(); closeModal(); render(); toast("PIN lock turned off");
      });
    }
  });

  function pushChat(q) {
    ui.chat.push({ who: "user", text: q });
    ui.chat.push({ who: "bot", text: assistantAnswer(q) });
    renderChat();
  }

  document.addEventListener("change", function (e) {
    if (e.target.id === "import-file" && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const parsed = JSON.parse(reader.result);
          if (!parsed || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.budgets)) throw new Error("bad file");
          state = parsed;
          state.prefs = state.prefs || { currency: "BDT", name: "User", overallBudget: 0, theme: "dark" };
          state.goals = Array.isArray(state.goals) ? state.goals : [];
          markSetupDone(); save(); render(); toast("Data imported successfully");
        } catch (err) { toast("That file is not a valid HisabTrack backup", "error"); }
      };
      reader.readAsText(file);
      e.target.value = "";
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
  window.addEventListener("hashchange", render);

  /* ---------- activity tracking & auto-lock ---------- */
  ["pointerdown", "keydown", "scroll", "touchstart"].forEach(function (ev) {
    window.addEventListener(ev, function () { pin.lastActivity = Date.now(); }, { passive: true });
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) pin.lastActivity = Date.now();
  });
  setInterval(function () {
    if (!pin.locked && pin.data && pin.data.enabled && pin.data.autoLock > 0) {
      if (Date.now() - pin.lastActivity >= pin.data.autoLock * 60000) showLock("pin");
    }
  }, 15000);

  /* ---------- boot ---------- */
  const brandNew = localStorage.getItem(STORE_KEY) === null;
  if (brandNew && localStorage.getItem(SETUP_KEY) !== "done") {
    try { localStorage.setItem(SETUP_KEY, "pending"); } catch (e) {}
  }
  save();
  pin.data = loadPin();
  if (!window.location.hash) window.location.hash = "#/dashboard";
  render();
  if (pin.data.enabled && pin.data.hash) showLock("pin");
  else if (localStorage.getItem(SETUP_KEY) === "pending") showSetup(0);
})();
