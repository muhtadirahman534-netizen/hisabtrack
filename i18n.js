/* HisabTrack — Bengali / English language layer.
   Adds a EN / বাং switch and translates rendered text automatically. */
(function () {
  "use strict";

  var KEY = "takatrack.lang";
  var current = "bn";
  try { var saved = localStorage.getItem(KEY); if (saved === "en" || saved === "bn") current = saved; } catch (e) {}

  var DICT = {
    /* navigation & shell */
    "Dashboard": "ড্যাশবোর্ড",
    "Your money at a glance": "আপনার টাকার এক নজরে হিসাব",
    "Transactions": "লেনদেন",
    "Every taka in and out": "প্রতিটি টাকার আসা-যাওয়া",
    "Budgets": "বাজেট",
    "Plan your monthly spending": "মাসিক খরচের পরিকল্পনা",
    "Savings Assistant": "সঞ্চয় সহকারী",
    "Smart, rule-based insights": "স্মার্ট, নিয়মভিত্তিক পরামর্শ",
    "Settings": "সেটিংস",
    "Preferences and your data": "পছন্দ এবং আপনার ডেটা",
    "Money, made clear": "টাকার হিসাব, সহজভাবে",
    "Workspace": "ওয়ার্কস্পেস",
    "Quick add": "দ্রুত যোগ",
    "View insights": "পরামর্শ দেখুন",
    "account": "অ্যাকাউন্ট",
    "Analytics": "অ্যানালিটিক্স",
    "Charts built from your real transactions": "আপনার আসল লেনদেন থেকে তৈরি চার্ট",
    "Savings Goals": "সঞ্চয়ের লক্ষ্য",
    "Save towards what matters to you": "যা গুরুত্বপূর্ণ, তার দিকে সঞ্চয় করুন",
    "Track your money. Control your future.": "টাকার হিসাব রাখুন। ভবিষ্যৎ নিয়ন্ত্রণ করুন।",
    "Theme": "থিম",
    "Dark theme": "ডার্ক থিম",
    "Light theme": "লাইট থিম",
    "Home": "হোম",
    "Txns": "লেনদেন",
    "Charts": "চার্ট",
    "AI": "এআই",
    "Savings goals": "সঞ্চয়ের লক্ষ্য",
    "Dark": "ডার্ক",
    "Light": "লাইট",
    "Easy on the eyes": "চোখের জন্য আরামদায়ক",
    "Bright and clean": "উজ্জ্বল ও পরিচ্ছন্ন",
    "Choose how HisabTrack looks": "হিসাবট্র্যাক কেমন দেখাবে বেছে নিন",
    "Welcome back, ": "আবার স্বাগতম, ",
    "Here's your financial overview.": "এটা আপনার আর্থিক সারাংশ।",

    /* dashboard */
    "Total Balance": "মোট ব্যালেন্স",
    "Total Income": "মোট আয়",
    "Total Expenses": "মোট খরচ",
    "Total Savings": "মোট সঞ্চয়",
    "this month": "এই মাসে",
    "% of all income saved": "% আয় সঞ্চয়ের হার",
    "Add income to see your savings rate": "সঞ্চয়ের হার দেখতে আয় যোগ করুন",
    "Income vs Expense": "আয় বনাম খরচ",
    "Last 6 months": "গত ৬ মাস",
    "No transactions yet": "এখনো কোনো লেনদেন নেই",
    "Add your first income or expense to see the chart.": "চার্ট দেখতে প্রথম আয় বা খরচ যোগ করুন।",
    "Spending by category": "ক্যাটাগরি অনুযায়ী খরচ",
    "Spent": "খরচ",
    "No expenses this month": "এই মাসে কোনো খরচ নেই",
    "Expenses you add will be grouped by category here.": "আপনি যে খরচ যোগ করবেন, তা এখানে ক্যাটাগরি অনুযায়ী দেখা যাবে।",
    "Recent transactions": "সাম্প্রতিক লেনদেন",
    "Your latest activity": "আপনার সর্বশেষ কার্যকলাপ",
    "View all": "সব দেখুন",
    "Nothing recorded yet": "এখনো কিছু রেকর্ড করা হয়নি",
    "Add your first transaction to get started.": "শুরু করতে প্রথম লেনদেন যোগ করুন।",
    "Add transaction": "লেনদেন যোগ করুন",
    "Monthly budget": "মাসিক বাজেট",
    "Manage": "পরিচালনা",
    "Total budget": "মোট বাজেট",
    "AI savings insights": "AI সঞ্চয় পরামর্শ",
    "Rule-based analysis": "নিয়মভিত্তিক বিশ্লেষণ",
    "Savings score:": "সঞ্চয় স্কোর:",
    "Suggested target:": "প্রস্তাবিত লক্ষ্য:",
    "/month": "/মাস",
    "Add income to get a target": "লক্ষ্য পেতে আয় যোগ করুন",
    "Ask the savings assistant": "সঞ্চয় সহকারীকে জিজ্ঞাসা করুন",
    "No budgets set": "কোনো বাজেট সেট করা নেই",
    "Create a budget to keep spending in check.": "খরচ নিয়ন্ত্রণে রাখতে বাজেট তৈরি করুন।",
    "Set a budget": "বাজেট সেট করুন",
    "left": "বাকি",
    "over": "অতিরিক্ত",

    /* report insights */
    "Healthy savings rate": "সুস্থ সঞ্চয়ের হার",
    "You are saving ": "আপনি সঞ্চয় করছেন ",
    "% of income. Keep it up!": "% আয়ের। চালিয়ে যান!",
    "Room to save more": "আরও সঞ্চয়ের সুযোগ",
    "Your savings rate is ": "আপনার সঞ্চয়ের হার ",
    "%. Aim for at least 20%.": "%। কমপক্ষে ২০% লক্ষ্য করুন।",
    "No savings recorded": "কোনো সঞ্চয় রেকর্ড নেই",
    "Try setting aside a small amount every month, even ৳ 500 counts.": "প্রতি মাসে সামান্য অঙ্ক আলাদা করে রাখুন, ৳ ৫০০-ও গণনা হয়।",
    "Budget exceeded": "বাজেট অতিক্রম",
    "category is over limit, led by": "ক্যাটাগরি সীমা অতিক্রম করেছে, যার মধ্যে প্রধান",
    "categories are over limit, led by": "ক্যাটাগরি সীমা অতিক্রম করেছে, যার মধ্যে প্রধান",
    "Budgets on track": "বাজেট ঠিক পথে",
    "You are within all of your category limits this month.": "এই মাসে আপনি সব ক্যাটাগরির সীমার মধ্যে আছেন।",
    "Top spending category": "সবচেয়ে বেশি খরচের ক্যাটাগরি",
    " takes ": " এর খরচ ",
    "% of this month's expenses.": "% এই মাসের খরচের।",
    "Spending is balanced": "খরচের ভারসাম্য ভালো",
    "No single category dominates your expenses this month.": "এই মাসে কোনো একক ক্যাটাগরি খরচে আধিপত্য করেনি।",
    "Add your income": "আপনার আয় যোগ করুন",
    "Record income to unlock your savings rate and targets.": "সঞ্চয়ের হার ও লক্ষ্য দেখতে আয় রেকর্ড করুন।",
    "Excellent": "চমৎকার",
    "Good": "ভালো",
    "Fair": "মোটামুটি",
    "Needs attention": "মনোযোগ প্রয়োজন",

    /* assistant answers & chat */
    "Your all-time savings rate is ": "আপনার সামগ্রিক সঞ্চয়ের হার ",
    "% of income. A common guideline is 20%.": "% আয়ের। সাধারণ নির্দেশিকা ২০%।",
    " Based on your income, a good monthly target would be around ": " আপনার আয় অনুযায়ী, ভালো মাসিক লক্ষ্য হতে পারে ",
    ". You have saved ": ". আপনি সঞ্চয় করেছেন ",
    " so far.": " পর্যন্ত।",
    " Add some income to unlock a personalised target.": " ব্যক্তিগত লক্ষ্য পেতে কিছু আয় যোগ করুন।",
    "You have not set any budgets yet. Head to the Budgets page to create one.": "আপনি এখনো কোনো বাজেট সেট করেননি। একটি তৈরি করতে বাজেট পেইজে যান।",
    "Warning: ": "সতর্কতা: ",
    " exceeded the limit this month.": " এই মাসে সীমা অতিক্রম করেছে।",
    "You have used ": "আপনি ব্যবহার করেছেন ",
    "% of your overall monthly limit, with ": "% সামগ্রিক মাসিক সীমার, সাথে ",
    " left.": " বাকি।",
    "All category budgets are on track this month. Nicely done!": "এই মাসে সব ক্যাটাগরির বাজেট ঠিক পথে। দারুণ!",
    "No expenses recorded this month yet.": "এই মাসে এখনো কোনো খরচ রেকর্ড করা হয়নি।",
    "This month you spent ": "এই মাসে আপনি খরচ করেছেন ",
    ". Your biggest category is ": ". আপনার সবচেয়ে বড় ক্যাটাগরি ",
    " at ": " যার পরিমাণ ",
    "% of spending).": "% খরচের।)",
    "You have recorded ": "আপনি রেকর্ড করেছেন ",
    " of total income, including ": " মোট আয়ের, যার মধ্যে ",
    " this month.": " এই মাসে।",
    "Your current balance is ": "আপনার বর্তমান ব্যালেন্স ",
    " (income minus expenses and savings).": " (আয় বাদে খরচ ও সঞ্চয়)।",
    "Hi! I can analyse your income, expenses, budgets and savings. Try asking about your biggest expense or your savings rate.": "আসসালামুয়ালাইকুম! আমি আপনার আয়, খরচ, বাজেট ও সঞ্চয় বিশ্লেষণ করতে পারি। সবচেয়ে বড় খরচ বা সঞ্চয়ের হার সম্পর্কে জিজ্ঞাসা করুন।",
    "I can help with your savings rate, budgets, spending categories, income and balance. Try one of the suggested questions above.": "আমি সঞ্চয়ের হার, বাজেট, খরচের ক্যাটাগরি, আয় ও ব্যালেন্সে সাহায্য করতে পারি। উপরের প্রশ্নগুলোর একটি চেষ্টা করুন।",
    "Hi! I am your HisabTrack savings assistant. Ask me anything about your money, or tap a suggested question.": "আসসালামুয়ালাইকুম! আমি আপনার হিসাবট্র্যাক সঞ্চয় সহকারী। আপনার টাকা সম্পর্কে যেকোনো প্রশ্ন করুন, অথবা একটি পরামর্শ প্রশ্নে টিপ দিন।",
    "How am I saving?": "আমি কীভাবে সঞ্চয় করছি?",
    "Where did I spend most?": "সবচেয়ে বেশি কোথায় খরচ করেছি?",
    "Am I over budget?": "আমি কি বাজেট অতিক্রম করেছি?",
    "What is my balance?": "আমার ব্যালেন্স কত?",
    "Ask about your money…": "আপনার টাকা সম্পর্কে জিজ্ঞাসা করুন…",
    "Your savings health": "আপনার সঞ্চয়ের অবস্থা",
    "Based on your current data": "আপনার বর্তমান ডেটা অনুযায়ী",
    "Suggested savings target:": "প্রস্তাবিত সঞ্চয় লক্ষ্য:",
    "per month": "প্রতি মাসে",
    "Add income to unlock a suggested target": "লক্ষ্য পেতে আয় যোগ করুন",
    "Ask the assistant": "সহকারীকে জিজ্ঞাসা করুন",
    "Answers are generated from your own data": "উত্তরগুলো আপনার নিজের ডেটা থেকে তৈরি",

    /* transactions */
    "Money In": "আয়",
    "Money Out": "খরচ",
    "Saved": "সঞ্চয়",
    "All time": "সম্পূর্ণ সময়",
    "All transactions": "সমস্ত লেনদেন",
    "Search by note, category or date…": "নোট, ক্যাটাগরি বা তারিখ দিয়ে খুঁজুন…",
    "All": "সব",
    "Income": "আয়",
    "Expense": "খরচ",
    "Savings": "সঞ্চয়",
    "Add new": "নতুন যোগ",
    "records": "রেকর্ড",
    "record": "রেকর্ড",
    "No matching transactions": "কোনো মিলে এমন লেনদেন নেই",
    "Try a different search or filter.": "অন্য কিছু খুঁজুন বা ফিল্টার বদলান।",
    "Details": "বিবরণ",
    "Date": "তারিখ",
    "Category": "ক্যাটাগরি",
    "Amount": "অঙ্ক",

    /* budgets */
    "Monthly budgets": "মাসিক বাজেট",
    "Overall monthly limit": "সামগ্রিক মাসিক সীমা",
    "% used": "% ব্যবহৃত",
    "spent of": "খরচ",
    "remaining": "বাকি",
    "over budget": "বাজেটের বেশি",
    "No category budgets yet": "এখনো কোনো ক্যাটাগরি বাজেট নেই",
    "Add one below to start tracking categories.": "ক্যাটাগরি ট্র্যাক করতে নিচে একটি যোগ করুন।",
    "Add a budget": "বাজেট যোগ করুন",
    "Set a monthly spending limit for a category": "একটি ক্যাটাগরির জন্য মাসিক খরচের সীমা সেট করুন",
    "Monthly limit": "মাসিক সীমা",
    "Add budget": "বাজেট যোগ করুন",
    "Overall limit": "সামগ্রিক সীমা",
    "A single cap for all expenses this month": "এই মাসে সব খরচের জন্য একটি সীমা",
    "Total monthly limit": "মোট মাসিক সীমা",
    "Save limit": "সীমা সংরক্ষণ",

    /* settings */
    "Preferences": "পছন্দসমূহ",
    "Personalise your HisabTrack": "আপনার হিসাবট্র্যাক কাস্টমাইজ করুন",
    "Display name": "প্রদর্শিত নাম",
    "Currency": "মুদ্রা",
    "Amounts are stored as numbers; only the symbol changes.": "অঙ্ক সংখ্যা হিসেবেই থাকে; শুধু প্রতীক বদলায়।",
    "Save preferences": "পছন্দ সংরক্ষণ",
    "Your data": "আপনার ডেটা",
    "Everything is stored in this browser": "সবকিছু এই ব্রাউজারেই সংরক্ষিত",
    "Storage used": "ব্যবহৃত স্টোরেজ",
    "Export JSON": "JSON এক্সপোর্ট",
    "Import JSON": "JSON ইম্পোর্ট",
    "Restore demo data": "ডেমো ডেটা ফেরত আনুন",
    "Clear everything": "সব মুছুন",
    "Android app": "অ্যান্ড্রয়েড অ্যাপ",
    "Install it on your phone": "ফোনে ইনস্টল করুন",
    "Download the APK file, open it on your Android phone, and allow installation from unknown sources to install HisabTrack as a full-screen app.": "APK ফাইলটি ডাউনলোড করে আপনার অ্যান্ড্রয়েড ফোনে খুলুন এবং অজানা উৎস থেকে ইনস্টলের অনুমতি দিয়ে HisabTrack-কে ফুলস্ক্রিন অ্যাপ হিসেবে ইনস্টল করুন।",
    "Download APK": "APK ডাউনলোড",
    "Open web app": "ওয়েব অ্যাপ খুলুন",

    /* guided setup */
    "Welcome to HisabTrack": "হিসাবট্র্যাকে স্বাগতম",
    "Your personal money manager. Let us set it up together in a few quick steps.": "আপনার ব্যক্তিগত অর্থ ব্যবস্থাপক। চলুন কয়েকটি সহজ ধাপে এটি সেটআপ করি।",
    "Hi, I am your savings assistant.": "হাই, আমি আপনার সঞ্চয় সহকারী।",
    "First, what should I call you?": "প্রথমে, আপনাকে কী বলে ডাকব?",
    "Your name": "আপনার নাম",
    "e.g. Rahim": "যেমন: রহিম",
    "Get started": "শুরু করুন",
    "Nice to meet you, ": "আপনার সাথে দেখা করে ভালো লাগলো, ",
    "Step": "ধাপ",
    "Monthly income": "মাসিক আয়",
    "Let us begin with the money that comes in. Enter your monthly salary or total regular income — for example 45000.": "চলুন আগে দেখি কত টাকা আসে। আপনার মাসিক বেতন বা মোট নিয়মিত আয় লিখুন — যেমন ৪৫০০০।",
    "Salary, freelance, business — anything you receive every month.": "বেতন, ফ্রিল্যান্স, ব্যবসা — মাসে যা কিছু পান।",
    "House rent": "বাড়ির ভাড়া",
    "Now your biggest fixed cost. Enter the monthly rent you pay for your home.": "এখন আপনার বড় নির্দিষ্ট খরচ। বাড়ির মাসিক ভাড়া লিখুন।",
    "If you live with family and pay nothing, enter 0.": "বাড়িতে থাকলে ভাড়া না দিলে ০ লিখুন।",
    "Food & groceries": "খাদ্য ও কেনাকাটা",
    "Tell us what you usually spend on food, groceries and daily meals in one month.": "মাসে খাবার, গ্রোসারি ও দৈনিক খরচে সাধারণত কত খরচ করেন?",
    "A rough average is fine — you can edit everything later.": "আন্দাজমতো লিখলেও চলবে — পরে সব ঠিক করা যাবে।",
    "Transport, utilities & shopping": "যাতায়াত, বিদ্যুৎ ও কেনাকাটা",
    "Almost done. Enter your combined monthly spending on transport, electricity/internet and shopping. We will split it into three budgets for you.": "প্রায় শেষ। যাতায়াত, বিদ্যুৎ/ইন্টারনেট ও কেনাকাটায় মাসে মোট কত খরচ করেন? আমি সেটিকে তিনটি বাজেটে ভাগ করে দেব।",
    "Example: 8000 becomes roughly 3200 transport, 2800 utilities, 2000 shopping.": "উদাহরণ: ৮০০০ হলে প্রায় ৩২০০ যাতায়াত, ২৮০০ বিদ্যুৎ, ২০০০ কেনাকাটা।",
    "Monthly savings": "মাসিক সঞ্চয়",
    "Great habit! How much would you like to set aside every month? We will record it as an emergency fund contribution.": "দারুণ অভ্যাস! প্রতি মাসে কত টাকা পাশে রাখতে চান? আমি সেটিকে জরুরি তহবিল হিসেবে হিসাব করব।",
    "Even a small amount counts. Enter 0 to skip.": "সামান্যও হলেও চলবে। ছেড়ে দিতে ০ লিখুন।",
    "Monthly spending limit": "মাসিক খরচের সীমা",
    "Finally, set a total monthly spending limit. We will use it to show your budget health on the dashboard.": "সবশেষে মোট মাসিক খরচের একটা সীমা নির্ধারণ করুন। ড্যাশবোর্ডে বাজেটের অবস্থা দেখতে এটা কাজে লাগবে।",
    "Leave blank and we will calculate it from your answers.": "খালি রাখলে আপনার উত্তর থেকে হিসাব করে নেব।",
    "Amount (BDT)": "অর্থ (টাকা)",
    "Next": "পরবর্তী",
    "Finish setup": "সেটআপ শেষ করুন",
    "Skip setup": "সেটআপ এড়িয়ে যান",
    "Setup complete — your numbers are ready!": "সেটআপ সম্পন্ন — আপনার হিসাব প্রস্তুত!",
    "Please enter your name": "আপনার নাম লিখুন",
    "Guided setup": "গাইডেড সেটআপ",
    "You can run Guided setup any time from Settings": "সেটিংস থেকে যেকোনো সময় গাইডেড সেটআপ চালাতে পারেন",

    /* PIN lock */
    "PIN lock": "PIN লক",
    "Protect this browser with a 4–6 digit PIN": "৪–৬ ডিজিটের PIN দিয়ে এই ব্রাউজার সুরক্ষিত করুন",
    "Status": "অবস্থা",
    "On": "চালু",
    "Off": "বন্ধ",
    "Current PIN": "বর্তমান PIN",
    "New PIN": "নতুন PIN",
    "PIN": "PIN",
    "Confirm PIN": "PIN নিশ্চিত করুন",
    "4–6 digits": "৪–৬ ডিজিট",
    "Repeat": "আবার লিখুন",
    "Auto-lock after inactivity": "নিষ্ক্রিয়তার পর স্বয়ংক্রিয় লক",
    "Locks the app after this much time without activity. Off means only manual lock.": "এতক্ষণ কোনো কার্যকলাপ না হলে অ্যাপ লক হবে। বন্ধ রাখলে শুধু ম্যানুয়াল লক কাজ করবে।",
    "1 minute": "১ মিনিট",
    "5 minutes": "৫ মিনিট",
    "15 minutes": "১৫ মিনিট",
    "30 minutes": "৩০ মিনিট",
    "Update PIN lock": "PIN লক আপডেট",
    "Enable PIN lock": "PIN লক চালু করুন",
    "Auto-lock updated": "স্বয়ংক্রিয় লক আপডেট হয়েছে",
    "Lock now": "এখনই লক",
    "Recovery code": "রিকভারি কোড",
    "Turn off PIN": "PIN বন্ধ করুন",
    "Turn off PIN lock": "PIN লক বন্ধ করুন",
    "Your transactions and budgets are not affected.": "আপনার লেনদেন ও বাজেটের কোনো ক্ষতি হবে না।",
    "This is a screen lock for this browser only. It does not encrypt your data. Export JSON backups to protect them.": "এটি শুধু এই ব্রাউজারের জন্য স্ক্রিন লক। এটা আপনার ডেটা এনক্রিপ্ট করে না। সুরক্ষার জন্য JSON ব্যাকআপ রাখুন।",
    "Save this code somewhere safe. If you forget your PIN, enter it on the lock screen to remove the PIN without losing your data.": "এই কোডটি নিরাপদ জায়গায় রাখুন। PIN ভুলে গেলে লক স্ক্রিনে এই কোড দিয়ে ডেটা না হারিয়েই PIN সরাতে পারবেন।",
    "I saved it": "আমি সংরক্ষণ করেছি",
    "Enter your PIN to continue": "চালিয়ে যেতে আপনার PIN দিন",
    "Enter your recovery code": "আপনার রিকভারি কোড দিন",
    "Unlock": "আনলক",
    "Unlocked": "আনলক হয়েছে",
    "Reset PIN": "PIN রিসেট",
    "Forgot PIN?": "PIN ভুলে গেছেন?",
    "Back to PIN": "PIN-এ ফিরে যান",
    "Enter your 4–6 digit PIN": "৪–৬ ডিজিটের PIN দিন",
    "Incorrect PIN": "ভুল PIN",
    "Incorrect recovery code": "ভুল রিকভারি কোড",
    "PIN must be 4–6 digits": "PIN অবশ্যই ৪–৬ ডিজিট হতে হবে",
    "PINs do not match": "PIN দুটি মিলছে না",
    "Current PIN is incorrect": "বর্তমান PIN ভুল",
    "PIN lock updated": "PIN লক আপডেট হয়েছে",
    "PIN removed — set a new one in Settings": "PIN সরানো হয়েছে — সেটিংসে নতুন PIN সেট করুন",
    "PIN lock turned off": "PIN লক বন্ধ হয়েছে",
    "Could not save PIN": "PIN সংরক্ষণ করা যায়নি",

    "About HisabTrack": "হিসাবট্র্যাক সম্পর্কে",
    "HisabTrack is a simple, private finance manager. No account, no server, no tracking — your data never leaves this browser.": "হিসাবট্র্যাক একটি সরল, ব্যক্তিগত ফাইন্যান্স ম্যানেজার। কোনো অ্যাকাউন্ট, সার্ভার বা ট্র্যাকিং নেই — আপনার ডেটা কখনো এই ব্রাউজারের বাইরে যায় না।",
    "Tip: use Export JSON to back up your data regularly, and Import JSON to restore it on another device.": "টিপ: নিয়মিত JSON এক্সপোর্ট করে ব্যাকআপ রাখুন এবং অন্য ডিভাইসে JSON ইম্পোর্ট করে ফেরত আনুন।",

    /* modal & confirmations */
    "Edit transaction": "লেনদেন সম্পাদনা",
    "Type": "ধরন",
    "Note": "নোট",
    "What was it for?": "কী জন্য ছিল?",
    "Cancel": "বাতিল",
    "Save changes": "পরিবর্তন সংরক্ষণ",
    "Edit budget ·": "বাজেট সম্পাদনা ·",
    "Spent so far this month:": "এই মাসে এখন পর্যন্ত খরচ:",
    "Save budget": "বাজেট সংরক্ষণ",
    "Delete transaction": "লেনদেন মুছুন",
    "Delete “": "«",
    "” of ": "» এর অঙ্ক ",
    "? This cannot be undone.": "? এটি ফেরত আনা যাবে না।",
    "Delete": "মুছুন",
    "This replaces all current transactions and budgets with sample data.": "এটি বর্তমান সব লেনদেন ও বাজেটকে নমুনা ডেটা দিয়ে প্রতিস্থাপন করবে।",
    "Restore": "ফেরত আনুন",
    "This permanently deletes all transactions and budgets. Export a backup first if needed.": "এটি সব লেনদেন ও বাজেট স্থায়ীভাবে মুছে দেবে। প্রয়োজনে আগে ব্যাকআপ নিন।",
    "Delete all": "সব মুছুন",

    /* toasts */
    "Transaction deleted": "লেনদেন মুছে দেওয়া হয়েছে",
    "Transaction added": "লেনদেন যোগ করা হয়েছে",
    "Transaction updated": "লেনদেন আপডেট করা হয়েছে",
    "Budget added": "বাজেট যোগ করা হয়েছে",
    "Budget updated": "বাজেট আপডেট করা হয়েছে",
    "Budget removed": "বাজেট সরানো হয়েছে",
    "Overall limit saved": "সামগ্রিক সীমা সংরক্ষিত",
    "Preferences saved": "পছন্দ সংরক্ষিত",
    "Backup downloaded": "ব্যাকআপ ডাউনলোড হয়েছে",
    "Export failed": "এক্সপোর্ট ব্যর্থ",
    "Data imported successfully": "ডেটা সফলভাবে ইম্পোর্ট হয়েছে",
    "That file is not a valid HisabTrack backup": "এই ফাইলটি বৈধ হিসাবট্র্যাক ব্যাকআপ নয়",
    "Demo data restored": "ডেমো ডেটা ফেরত এসেছে",
    "All data cleared": "সব ডেটা মুছে দেওয়া হয়েছে",
    "Enter an amount greater than zero": "শূন্যের চেয়ে বড় অঙ্ক লিখুন",
    "Choose a date": "একটি তারিখ বাছুন",
    "Enter a valid limit": "বৈধ সীমা লিখুন",
    "A budget for ": "এই ক্যাটাগরির বাজেট ",
    "already exists": "আগে থেকেই আছে",
    "Enter a valid amount": "বৈধ অঙ্ক লিখুন",

    /* analytics */
    "3 months": "৩ মাস",
    "6 months": "৬ মাস",
    "12 months": "১২ মাস",
    "8 weeks": "৮ সপ্তাহ",
    "month": "মাস",
    "months": "মাস",
    "Last ": "গত ",
    "Total": "মোট",
    "total": "মোট",
    "Month": "মাস",
    "Expense": "খরচ",
    "Expenses": "খরচ",
    "Savings rate": "সঞ্চয়ের হার",
    "Not enough data for this period": "এই সময়ের জন্য পর্যাপ্ত ডেটা নেই",
    "Add some income and expenses, or choose a longer date range.": "কিছু আয় ও খরচ যোগ করুন, অথবা দীর্ঘ সময় বাছুন।",
    "No expenses in this period": "এই সময়ে কোনো খরচ নেই",
    "Avg. monthly income": "গড় মাসিক আয়",
    "Avg. monthly expense": "গড় মাসিক খরচ",
    "Highest spending": "সবচেয়ে বেশি খরচ",
    "% of spending": "% খরচের",
    "Best saving month": "সেরা সঞ্চয়ের মাস",
    "No months yet": "এখনো কোনো মাস নেই",
    "No savings yet": "এখনো সঞ্চয় নেই",
    "Monthly income vs expense": "মাসিক আয় বনাম খরচ",
    "Category breakdown": "ক্যাটাগরি বিশ্লেষণ",
    "Share of total expenses": "মোট খরচের ভাগ",
    "Weekly spending": "সাপ্তাহিক খরচ",
    "Savings trend": "সঞ্চয়ের প্রবণতা",
    "Monthly and cumulative savings": "মাসিক ও ক্রমবর্ধমান সঞ্চয়",
    "Monthly financial summary": "মাসিক আর্থিক সারাংশ",
    "All amounts in ": "সব অঙ্ক ",

    /* savings goals */
    "Save towards the things that matter to you": "যা গুরুত্বপূর্ণ, তার দিকে সঞ্চয় করুন",
    "New goal": "নতুন লক্ষ্য",
    "No savings goals yet": "এখনো কোনো সঞ্চয়ের লক্ষ্য নেই",
    "Try a laptop, a new phone or an emergency fund.": "ল্যাপটপ, নতুন ফোন বা জরুরি তহবিল চেষ্টা করুন।",
    "Create a goal": "লক্ষ্য তৈরি করুন",
    "Total saved": "মোট সঞ্চয়",
    "% of all goals": "সব লক্ষ্যের %",
    "No target set": "কোনো লক্ষ্য নির্ধারণ করা নেই",
    "Still needed": "এখনো প্রয়োজন",
    "Across all goals": "সব লক্ষ্য জুড়ে",
    "Completed": "সম্পন্ন",
    "Goals reached": "লক্ষ্য অর্জিত",
    "Goal reached 🎉": "লক্ষ্য অর্জিত 🎉",
    "Passed": "অতিক্রম",
    "No target date": "কোনো লক্ষ্যের তারিখ নেই",
    "Edit goal": "লক্ষ্য সম্পাদনা",
    "Delete goal": "লক্ষ্য মুছুন",
    "Remaining": "বাকি",
    "Deadline": "শেষ তারিখ",
    "Save monthly": "মাসিক সঞ্চয়",
    "New savings goal": "নতুন সঞ্চয়ের লক্ষ্য",
    "Goal name": "লক্ষ্যের নাম",
    "e.g. Buy a Laptop": "যেমন: ল্যাপটপ কেনা",
    "New Laptop": "নতুন ল্যাপটপ",
    "Target (": "লক্ষ্য (",
    "Saved so far (": "এখন পর্যন্ত সঞ্চয় (",
    "Target date": "লক্ষ্যের তারিখ",
    "Optional — used to work out how much to save each month.": "ঐচ্ছিক — প্রতি মাসে কত সঞ্চয় করতে হবে তা হিসাব করতে কাজে লাগবে।",
    "Delete this goal?": "এই লক্ষ্য মুছুন?",
    "” and its progress will be removed.": "” এবং এর অগ্রগতি মুছে যাবে।",
    "Goal deleted": "লক্ষ্য মুছে দেওয়া হয়েছে",
    "Goal updated": "লক্ষ্য আপডেট হয়েছে",
    "Goal created": "লক্ষ্য তৈরি হয়েছে",
    "Enter a goal name": "লক্ষ্যের নাম লিখুন",
    "Enter a target greater than zero": "শূন্যের চেয়ে বড় লক্ষ্য লিখুন",

    /* assistant presets & misc */
    "How can I save more money?": "আমি কীভাবে আরও টাকা সঞ্চয় করব?",
    "Which category costs me the most?": "কোন ক্যাটাগরিতে সবচেয়ে বেশি খরচ হয়?",
    "How much money did I save this month?": "এই মাসে আমি কত টাকা সঞ্চয় করেছি?",
    "Give me a monthly savings plan.": "আমাকে একটা মাসিক সঞ্চয় পরিকল্পনা দিন।",
    "Light theme on": "লাইট থিম চালু",
    "Dark theme on": "ডার্ক থিম চালু",
    "Export CSV": "CSV এক্সপোর্ট",
    "No transactions to export": "এক্সপোর্ট করার মতো কোনো লেনদেন নেই",
    "CSV exported": "CSV এক্সপোর্ট হয়েছে",
    "This replaces all current transactions, budgets and goals with sample data.": "এটি বর্তমান সব লেনদেন, বাজেট ও লক্ষ্যকে নমুনা ডেটা দিয়ে প্রতিস্থাপন করবে।",
    "This permanently deletes all transactions, budgets and goals. Export a backup first if needed.": "এটি সব লেনদেন, বাজেট ও লক্ষ্য স্থায়ীভাবে মুছে দেবে। প্রয়োজনে আগে ব্যাকআপ নিন।",
    "Tip: use Export JSON or CSV to back up your data regularly, and Import JSON to restore it on another device.": "টিপ: নিয়মিত Export JSON বা CSV দিয়ে ব্যাকআপ রাখুন এবং অন্য ডিভাইসে Import JSON দিয়ে ফেরত আনুন।",
    "Could not save data": "ডেটা সংরক্ষণ করা যায়নি",
    "User": "ব্যবহারকারী",

    /* assistant replies */
    "I don't have any transactions yet. Add your income and expenses and ask me again.": "এখনো কোনো লেনদেন নেই। আয় আর খরচ যোগ করে আবার জিজ্ঞাসা করুন।",
    "You have no expenses recorded for ": "আপনি ",
    " yet.": " এখনো কোনো খরচ রেকর্ড করেননি।",
    "Add your monthly income first, then I can build a savings plan around it.": "প্রথমে মাসিক আয় যোগ করুন, তবেই আমি আপনার জন্য সঞ্চয় পরিকল্পনা বানাতে পারব।",
    "Based on a monthly income of ": "মাসিক আয় ",
    ", here is a simple plan:": " ধরে, এটা একটা সহজ পরিকল্পনা:",
    "• Needs (rent, bills, food, transport): ": "• প্রয়োজন (ভাড়া, বিদ্যুৎ, খাবার, যাতায়াত): ",
    "• Savings: ": "• সঞ্চয়: ",
    "• Wants (shopping, eating out, entertainment): ": "• চাহিদা (কেনাকাটা, বাইরে খাওয়া, বিনোদন): ",
    "Split your savings across your goals:": "আপনার লক্ষ্যগুলোতে সঞ্চয় ভাগ করে দিন:",
    "Here is what stands out in ": "এই ",
    "-এ যা মনে দাঁড়িয়েছে:": "-এ যা মনে দাঁড়িয়েছে:",
    "Try these three steps:": "এই তিনটি ধাপ চেষ্টা করুন:",
    " costs you the most this month: ": " এই মাসে আপনার সবচেয়ে বেশি খরচ: ",
    "Your top categories:": "আপনার প্রধান ক্যাটাগরি:",
    " budget is ": " বাজেট ",
    "% used.": "% ব্যবহৃত।",
    "In ": "এই ",
    " so far you earned ": " পর্যন্ত আপনার আয় ",
    " and spent ": " এবং খরচ ",
    "That means you saved ": "অর্থাৎ আপনি ",
    " — ": " — ",
    "% of your income.": "% আয়ের।",
    "That means you are ": "অর্থাৎ আপনি ",
    " short this month.": " কম আছেন এই মাসে।",
    "You are ": "আপনার ",
    " away from the suggested target of ": " পৌঁছাতে প্রস্তাবিত লক্ষ্য ",
    ".": " বাকি আছে।",
    "You have already reached the suggested target of ": "আপনি ইতিমধ্যেই প্রস্তাবিত লক্ষ্য ",
    ". Great work!": " পৌঁছেছেন। দারুণ কাজ!",
    "Hi! I can analyse your income, expenses, budgets, savings goals and spending habits. Try asking about your biggest expense, a monthly savings plan, or your savings rate.": "আসসালামুয়ালাইকুম! আমি আপনার আয়, খরচ, বাজেট, সঞ্চয়ের লক্ষ্য ও খরচের অভ্যাস বিশ্লেষণ করতে পারি। সবচেয়ে বড় খরচ, মাসিক সঞ্চয় পরিকল্পনা বা সঞ্চয়ের হার সম্পর্কে জিজ্ঞাসা করুন।",
    "I can help with your savings rate, budgets, spending categories, income, goals and balance. Try one of the suggested questions above.": "আমি সঞ্চয়ের হার, বাজেট, খরচের ক্যাটাগরি, আয়, লক্ষ্য ও ব্যালেন্সে সাহায্য করতে পারি। উপরের প্রশ্নগুলোর একটি চেষ্টা করুন।",
    "Am I over budget?": "আমি কি বাজেট অতিক্রম করেছি?",
    "What is my balance?": "আমার ব্যালেন্স কত?",

    /* categories */
    "Salary": "বেতন", "Freelance": "ফ্রিল্যান্স", "Business": "ব্যবসা",
    "Investment": "বিনিয়োগ", "Gift": "উপহার", "Other": "অন্যান্য",
    "Food": "খাদ্য", "Rent": "ভাড়া", "Transport": "পরিবহন",
    "Utilities": "ইউটিলিটি", "Shopping": "কেনাকাটা", "Health": "স্বাস্থ্য",
    "Education": "শিক্ষা", "Entertainment": "বিনোদন",
    "Emergency Fund": "জরুরি তহবিল", "Goals": "লক্ষ্য",

    /* dates & common prepositions */
    "in": "এ",
    "January": "জানুয়ারী", "February": "ফেব্রুয়ারী", "March": "মার্চ", "April": "এপ্রিল",
    "May": "মে", "June": "জুন", "July": "জুলাই", "August": "আগস্ট",
    "September": "সেপ্টেম্বর", "October": "অক্টোবর", "November": "নভেম্বর", "December": "ডিসেম্বর",
    "Jan": "জানু", "Feb": "ফেব্রু", "Mar": "মার্চ", "Apr": "এপ্র", "Jun": "জুন",
    "Jul": "জুলা", "Aug": "আগ", "Sep": "সেপ্ট", "Oct": "অক্টো", "Nov": "নভে", "Dec": "ডিসে",
    "Sat": "শনি", "Sun": "রবি", "Mon": "সোম", "Tue": "মঙ্গল", "Wed": "বুধ", "Thu": "বৃহঃ", "Fri": "শুক্র"
  };

  /* longest phrases first so "Total Income" wins over "Income" */
  var RULES = Object.keys(DICT).sort(function (a, b) { return b.length - a.length; }).map(function (k) {
    var esc = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var start = /^\w/.test(k) ? "\\b" : "";
    var end = /\w$/.test(k) ? "\\b" : "";
    return [new RegExp(start + esc + end, "g"), DICT[k]];
  });

  function tr(text) {
    if (current === "en") return text;
    var out = String(text);
    for (var i = 0; i < RULES.length; i++) out = out.replace(RULES[i][0], RULES[i][1]);
    return out;
  }

  var TITLES = {
    dashboard: ["Dashboard — HisabTrack", "ড্যাশবোর্ড — হিসাবট্র্যাক"],
    transactions: ["Transactions — HisabTrack", "লেনদেন — হিসাবট্র্যাক"],
    budgets: ["Budgets — HisabTrack", "বাজেট — হিসাবট্র্যাক"],
    analytics: ["Analytics — HisabTrack", "অ্যানালিটিক্স — হিসাবট্র্যাক"],
    assistant: ["Savings Assistant — HisabTrack", "সঞ্চয় সহকারী — হিসাবট্র্যাক"],
    goals: ["Savings Goals — HisabTrack", "সঞ্চয়ের লক্ষ্য — হিসাবট্র্যাক"],
    settings: ["Settings — HisabTrack", "সেটিংস — হিসাবট্র্যাক"]
  };
  function setTitle() {
    var h = (location.hash || "").replace(/^#\/?/, "").split("?")[0];
    var pair = TITLES[h] || TITLES.dashboard;
    document.title = current === "bn" ? pair[1] : pair[0];
  }

  function injectToggle() {
    var actions = document.querySelector(".topbar-actions");
    if (!actions) return;
    var box = document.getElementById("lang-toggle");
    if (!box) {
      box = document.createElement("div");
      box.id = "lang-toggle";
      box.className = "lang-switch";
      box.innerHTML = '<button type="button" data-lang="en" title="English">EN</button><button type="button" data-lang="bn" title="বাংলা">বাং</button>';
      actions.insertBefore(box, actions.firstChild);
    }
    var btns = box.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle("active", btns[i].getAttribute("data-lang") === current);
    }
  }

  function walk(node) {
    if (!node) return;
    if (node.nodeType === 3) {
      var parent = node.parentNode;
      if (parent && (parent.tagName === "SCRIPT" || parent.tagName === "STYLE")) return;
      var t = node.nodeValue || "";
      var n = tr(t);
      if (n !== t) node.nodeValue = n;
    } else if (node.nodeType === 1) {
      if (node.tagName === "SCRIPT" || node.tagName === "STYLE") return;
      var attrs = ["placeholder", "title", "aria-label"];
      for (var a = 0; a < attrs.length; a++) {
        var v = node.getAttribute(attrs[a]);
        if (v) { var nv = tr(v); if (nv !== v) node.setAttribute(attrs[a], nv); }
      }
      var kids = Array.prototype.slice.call(node.childNodes || []);
      for (var i = 0; i < kids.length; i++) walk(kids[i]);
    }
  }

  var obs;
  function flush(records) {
    var roots = [];
    records.forEach(function (r) {
      if (r.type === "childList") {
        Array.prototype.forEach.call(r.addedNodes, function (n) {
          if (n.nodeType === 1 || n.nodeType === 3) roots.push(n);
        });
      } else if (r.type === "characterData") roots.push(r.target);
    });
    if (obs) obs.disconnect();
    roots.forEach(walk);
    injectToggle();
    setTitle();
    if (obs) obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-lang]");
    if (!b) return;
    var lang = b.getAttribute("data-lang");
    if (lang === current) return;
    try { localStorage.setItem(KEY, lang); } catch (err) {}
    location.reload();
  });

  function start() {
    document.documentElement.lang = current;
    obs = new MutationObserver(flush);
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    walk(document.body);
    injectToggle();
    setTitle();
  }
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
  window.addEventListener("hashchange", function () { setTimeout(setTitle, 0); });
})();
