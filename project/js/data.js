/* ==========================================================================
   Mock Data Layer
   این فایل تمام داده‌های نمایشی سیستم را نگه می‌دارد.
   در آینده این فایل با یک Data Service واقعی متصل به API جایگزین می‌شود
   (به بخش Data Service در js/app.js مراجعه کنید).
   ========================================================================== */

const MockDB = {
  users: [
    { username: "Admin",     password: "admin1234", role: "admin",     name: "مدیر سامانه",      avatar: "A" },
    { username: "dev",       password: "dev-dev123", role: "developer", name: "توسعه‌دهنده سیستم",  avatar: "D" },
    { username: "employee",  password: "123456",    role: "employee",  name: "پارسا واحدیون",       avatar: "پ", employeeId: "E-1042" },
    { username: "sales01",   password: "123456",    role: "employee",  name: "نگار ابراهیمی",      avatar: "ن", employeeId: "E-1043" },
    { username: "warehouse", password: "123456",    role: "employee",  name: "کیان مرادی",        avatar: "ک", employeeId: "E-1044" },
    { username: "finance",   password: "123456",    role: "employee",  name: "سارا کاظمی",        avatar: "س", employeeId: "E-1045" },
  ],

  ranks: [
    { id: "consultant",       title: "مشاور",               icon: "seedling" },
    { id: "specialist",       title: "کارشناس",              icon: "user" },
    { id: "senior_specialist",title: "کارشناس ارشد",          icon: "user-check" },
    { id: "management",       title: "مدیریت",               icon: "briefcase" },
    { id: "leadership",       title: "راهبری",               icon: "compass" },
    { id: "diamond",          title: "الماس",                icon: "gem" },
    { id: "blue_diamond",     title: "الماس آبی",             icon: "gem" },
    { id: "black_diamond",    title: "الماس سیاه",            icon: "gem" },
    { id: "exec_ambassador",  title: "سفیر اجرایی",           icon: "award" },
    { id: "gold_ambassador",  title: "سفیر طلایی",            icon: "award" },
    { id: "blue_diamond_amb", title: "سفیر الماس آبی",         icon: "star" },
    { id: "black_diamond_amb",title: "سفیر الماس سیاه",        icon: "star" },
    { id: "royal_ambassador", title: "سفیر رویال",            icon: "crown" },
    { id: "royal_guidance",   title: "هدایت رویال",           icon: "crown" },
  ],

  currentRankIndex: 2, // کارشناس ارشد

  employee: {
    id: "E-1042",
    name: "پارسا واحدیون",
    position: "کارشناس فروش",
    department: "فروش",
    joinDate: "۱۴۰۲/۰۳/۱۵",
    rank: "کارشناس ارشد",
    score: 680,
    nextRankProgress: 74,
    lotteryChances: 22,
    kpis: {
      monthlySales: 128500000,
      monthlySalesGrowth: 18.4,
      invoiceCount: 84,
      invoiceGrowth: 12,
      performanceScore: 680,
      performanceScoreDelta: 24,
      lotteryChances: 22,
    },
    performance: {
      sales: 92,
      invoice: 84,
      attendance: 96,
      overtime: 78,
      overall: 88,
      productDiversity: 70,
    },
  },

  topProducts: [
    { name: "لامپ LED حبابی 10 وات E27 آفتابی امید پدیده",      qty: 34, amount: 48000000, score: 72 },
    { name: "لامپ LED حبابی 10 وات E27 آفتابی بروکس",      qty: 28, amount: 32000000, score: 54 },
    { name: "لامپ LED استوانه ای 100 وات E27 آفتابی پارس کیمیا",     qty: 21, amount: 26500000, score: 41 },
    { name: "لامپ LED سفینه ای 70 وات E40 مهتابی ایران زمین",     qty: 19, amount: 14250000, score: 33 },
    { name: "لامپ مهتابی 20PLL وات آفتابی دلتا ",        qty: 12, amount: 9600000,  score: 22 },
  ],

  companyProgress: {
    salesTarget: 2000000000,
    currentSales: 1680000000,
    percentage: 84,
    growthVsLastMonth: 12.8,
    totalInvoices: 1248,
  },

  recentActivities: [
    { icon: "file-text",   text: "فروش یک فاکتور جدید ثبت شد", delta: 12, time: "۱۰ دقیقه پیش" },
    { icon: "clock",       text: "ثبت گزارش کار",              delta: 6,  time: "۲ ساعت پیش" },
    { icon: "star",        text: "فروش محصول ویژه",            delta: 15, time: "دیروز" },
    { icon: "calendar",    text: "ثبت مرخصی",                  delta: -2, time: "۲ روز پیش" },
    { icon: "trending-up", text: "رشد فروش نسبت به هفته قبل",   delta: 8,  time: "۳ روز پیش" },
  ],

  leaves: [
    { date: "۱۴۰۵/۰۶/۱۰", type: "استحقاقی", duration: "۱ روز", status: "تأیید شده", effect: "-۱ امتیاز" },
    { date: "۱۴۰۵/۰۵/۲۲", type: "استعلاجی", duration: "۲ روز", status: "تأیید شده", effect: "بدون اثر" },
    { date: "۱۴۰۵/۰۴/۰۳", type: "استحقاقی", duration: "نیم روز", status: "در انتظار", effect: "-" },
  ],

  overtimes: [
    { date: "۱۴۰۵/۰۶/۱۵", type: "اضافه‌کاری عادی", duration: "۳ ساعت", status: "تأیید شده", effect: "+۶ امتیاز" },
    { date: "۱۴۰۵/۰۶/۰۸", type: "اضافه‌کاری تعطیل", duration: "۵ ساعت", status: "تأیید شده", effect: "+۱۵ امتیاز" },
    { date: "۱۴۰۵/۰۵/۲۹", type: "اضافه‌کاری عادی", duration: "۲ ساعت", status: "در انتظار", effect: "-" },
  ],

  notifications: [
    { icon: "gift",         text: "شما ۳۰ امتیاز جدید گرفتید.", time: "۵ دقیقه پیش", unread: true },
    { icon: "trending-up",  text: "فروش شما نسبت به ماه گذشته ۱۸٪ رشد داشته است.", time: "۱ ساعت پیش", unread: true },
    { icon: "ticket",       text: "یک شانس قرعه‌کشی جدید دریافت کردید.", time: "دیروز", unread: false },
    { icon: "award",        text: "به رتبه بعدی ۲۶٪ فاصله دارید.", time: "۲ روز پیش", unread: false },
  ],

  scoringRules: [
    { id: 1, title: "هر ۱۰ فاکتور",          points: 5,  type: "positive" },
    { id: 2, title: "هر ۱۰ میلیون تومان فروش", points: 10, type: "positive" },
    { id: 3, title: "فروش محصول ویژه",         points: 5,  type: "positive" },
    { id: 4, title: "هر ساعت اضافه‌کاری",       points: 2,  type: "positive" },
    { id: 5, title: "هر مرخصی اضافه",          points: -3, type: "negative" },
  ],

  rewards: [
    { id: 1, title: "کارت هدیه",       subtitle: "۵۰۰ هزار تومان", cost: 50,  icon: "credit-card", color: "gold" },
    { id: 2, title: "مرخصی تشویقی",     subtitle: "۱ روز",          cost: 80,  icon: "calendar-check", color: "turquoise" },
    { id: 3, title: "هدیه ویژه",       subtitle: "محصول منتخب",    cost: 120, icon: "gift", color: "blue" },
    { id: 4, title: "بن تخفیف فروشگاهی", subtitle: "۲۰۰ هزار تومان", cost: 35, icon: "shopping-bag", color: "success" },
  ],

  departments: [
    { name: "فروش",   score: 92, performance: 88, share: 50 },
    { name: "انبار",  score: 81, performance: 76, share: 20 },
    { name: "مالی",   score: 87, performance: 90, share: 15 },
    { name: "اداری",  score: 78, performance: 74, share: 15 },
  ],

  companyPercentages: { sales: 50, warehouse: 20, finance: 15, admin: 15 },

  personnel: [
    { id: "E-1042", name: "پارسا واحدیون ",   dept: "فروش",  sales: 128500000, invoices: 84, score: 680, rank: "کارشناس ارشد", growth: 18, status: "فعال" },
    { id: "E-1043", name: "فائزه تائبی", dept: "فروش",  sales: 154200000, invoices: 96, score: 742, rank: "مدیریت",       growth: 22, status: "فعال" },
    { id: "E-1044", name: "کیان مرادی",   dept: "انبار", sales: 0,         invoices: 0,  score: 410, rank: "کارشناس",     growth: 5,  status: "فعال" },
    { id: "E-1045", name: "خانم اسحاقی",   dept: "مالی",  sales: 0,         invoices: 0,  score: 505, rank: "کارشناس ارشد", growth: 9,  status: "فعال" },
    { id: "E-1046", name: "جواد یزدی ",   dept: "فروش",  sales: 98700000,  invoices: 61, score: 512, rank: "کارشناس",     growth: -4, status: "مرخصی" },
    { id: "E-1047", name: "مریم صادقی",   dept: "اداری", sales: 0,         invoices: 0,  score: 388, rank: "مشاور",       growth: 3,  status: "فعال" },
    { id: "E-1048", name: "ازاده اقاحسینی ",    dept: "فروش",  sales: 176300000, invoices: 103,score: 811, rank: "راهبری",      growth: 27, status: "فعال" },
  ],

  auditLogs: [
    { user: "Admin", action: "ویرایش قانون امتیازدهی", entity: "Score Rule", date: "۱۴۰۵/۰۶/۲۶", status: "موفق" },
    { user: "Admin", action: "تغییر درصد واحدها",       entity: "Company Share", date: "۱۴۰۵/۰۶/۲۵", status: "موفق" },
    { user: "dev",   action: "همگام‌سازی CRM",           entity: "Mock CRM", date: "۱۴۰۵/۰۶/۲۴", status: "موفق" },
    { user: "Admin", action: "افزودن جایزه جدید",        entity: "Reward", date: "۱۴۰۵/۰۶/۲۲", status: "موفق" },
    { user: "dev",   action: "تغییر Feature Flag",       entity: "Feature Flag", date: "۱۴۰۵/۰۶/۲۰", status: "موفق" },
  ],

  systemLogs: [
    { level: "info",    message: "همگام‌سازی با Mock CRM انجام شد", time: "۰۹:۴۲" },
    { level: "info",    message: "ورود کاربر Admin", time: "۰۹:۱۰" },
    { level: "warning", message: "تأخیر جزئی در پاسخ سرویس گزارش‌گیری", time: "۰۸:5۵" },
    { level: "error",   message: "خطای موقت در دریافت اطلاعات فاکتور #4471", time: "۰۸:۲۰" },
    { level: "info",    message: "راه‌اندازی مجدد سرویس Mock", time: "۰۰:۰۱" },
  ],

  mockCRM: {
    connection: "متصل",
    provider: "Mock CRM",
    lastSync: "۱۴۰۵/۰۶/۲۶ - ۰۹:۴۲",
    records: { employees: 42, sales: 8421, invoices: 6912, leave: 382, overtime: 194 },
  },

  featureFlags: [
    { name: "گیمیفیکیشن قرعه‌کشی", enabled: true },
    { name: "داشبورد رادار عملکرد", enabled: true },
    { name: "حالت تاریک",           enabled: true },
    { name: "اعلان‌های بلادرنگ",    enabled: false },
    { name: "گزارش‌گیری پیشرفته",   enabled: false },
  ],

  // سری‌های زمانی نمودار فروش برای بازه‌های مختلف
  salesSeries: {
    "۱ هفته": {
      labels: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"],
      sales: [12, 18, 15, 22, 19, 25, 10],
      invoices: [4, 6, 5, 7, 6, 8, 3],
      items: [9, 14, 11, 17, 15, 20, 7],
    },
    "۱ ماه": {
      labels: ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"],
      sales: [78, 92, 85, 128],
      invoices: [24, 29, 27, 38],
      items: [60, 71, 66, 98],
    },
    "۳ ماه": {
      labels: ["فروردین", "اردیبهشت", "خرداد"],
      sales: [310, 342, 365],
      invoices: [96, 104, 112],
      items: [240, 265, 280],
    },
    "۶ ماه": {
      labels: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"],
      sales: [310, 342, 365, 298, 355, 402],
      invoices: [96, 104, 112, 90, 108, 120],
      items: [240, 265, 280, 230, 270, 310],
    },
    "۱ سال": {
      labels: ["مهر", "آبان", "آذر", "دی", "بهمن", "اسفند", "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"],
      sales: [280, 295, 310, 330, 305, 320, 310, 342, 365, 298, 355, 402],
      invoices: [88, 91, 96, 100, 94, 98, 96, 104, 112, 90, 108, 120],
      items: [210, 225, 240, 255, 235, 248, 240, 265, 280, 230, 270, 310],
    },
  },

  companySalesTrend: {
    labels: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"],
    values: [1120, 1240, 1180, 1350, 1490, 1680],
  },

  performanceDistribution: {
    labels: ["ضعیف (۰-۴۰)", "متوسط (۴۱-۷۰)", "خوب (۷۱-۹۰)", "عالی (۹۱-۱۰۰)"],
    values: [3, 11, 18, 10],
  },
};

/* ==========================================================================
   Data Service
   لایه واسط بین UI و داده‌ها. فعلاً از Mock Data استفاده می‌کند اما
   در آینده می‌تواند بدون تغییر در UI به یک API واقعی متصل شود.
   ========================================================================== */
const DataService = {
  // --- Auth ---
  findUser(username, password) {
    return MockDB.users.find(
      (u) => u.username.toLowerCase() === String(username).toLowerCase() && u.password === password
    );
  },

  // --- Employee ---
  getEmployee() { return MockDB.employee; },
  getTopProducts() { return MockDB.topProducts; },
  getCompanyProgress() { return MockDB.companyProgress; },
  getRanks() { return MockDB.ranks; },
  getCurrentRankIndex() { return MockDB.currentRankIndex; },
  getRecentActivities() { return MockDB.recentActivities; },
  getLeaves() { return MockDB.leaves; },
  getOvertimes() { return MockDB.overtimes; },
  getNotifications() { return MockDB.notifications; },
  getSalesSeries(range) { return MockDB.salesSeries[range] || MockDB.salesSeries["۱ ماه"]; },
  getRewards() { return MockDB.rewards; },

  // --- Admin ---
  getPersonnel() { return MockDB.personnel; },
  getDepartments() { return MockDB.departments; },
  getScoringRules() { return MockDB.scoringRules; },
  getCompanyPercentages() {
    const stored = Storage.get("companyPercentages");
    return stored || MockDB.companyPercentages;
  },
  setCompanyPercentages(vals) { Storage.set("companyPercentages", vals); },
  getCompanySalesTrend() { return MockDB.companySalesTrend; },
  getPerformanceDistribution() { return MockDB.performanceDistribution; },
  addScoringRule(rule) {
    const rules = Storage.get("scoringRules") || MockDB.scoringRules;
    rule.id = Date.now();
    rules.push(rule);
    Storage.set("scoringRules", rules);
    return rules;
  },
  getStoredScoringRules() { return Storage.get("scoringRules") || MockDB.scoringRules; },
  addReward(reward) {
    const rewards = Storage.get("rewards") || MockDB.rewards;
    reward.id = Date.now();
    rewards.push(reward);
    Storage.set("rewards", rewards);
    return rewards;
  },
  getStoredRewards() { return Storage.get("rewards") || MockDB.rewards; },

  // --- Developer ---
  getAuditLogs() { return MockDB.auditLogs; },
  getSystemLogs() { return MockDB.systemLogs; },
  getMockCRM() { return MockDB.mockCRM; },
  getFeatureFlags() { return Storage.get("featureFlags") || MockDB.featureFlags; },
  setFeatureFlags(flags) { Storage.set("featureFlags", flags); },
  getUsers() { return MockDB.users; },
};
