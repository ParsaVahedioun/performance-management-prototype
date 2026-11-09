/* ==========================================================================
   Storage helper (wraps localStorage, namespaced)
   ========================================================================== */
const Storage = {
  prefix: "pms_",
  get(key) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(this.prefix + key, JSON.stringify(value)); }
    catch (e) { /* quota or privacy mode - fail silently for prototype */ }
  },
  remove(key) { localStorage.removeItem(this.prefix + key); },
};

/* ==========================================================================
   Utility helpers
   ========================================================================== */
const fmt = {
  num(n) { return new Intl.NumberFormat("fa-IR").format(Math.round(n)); },
  toman(n) {
    if (n >= 1000000000) return (n / 1000000000).toFixed(2).replace(/\.00$/, "") + " میلیارد تومان";
    if (n >= 1000000) return this.num(n) + " تومان";
    return this.num(n) + " تومان";
  },
  compactToman(n) {
    if (n >= 1000000000) return (n / 1000000000).toFixed(2) + " میلیارد";
    if (n >= 1000000) return (n / 1000000).toFixed(1) + " میلیون";
    return this.num(n);
  },
};

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function icon(name, extra) {
  return `<i class="fa-solid fa-${name} ${extra || ""}"></i>`;
}

/* ==========================================================================
   Reusable component builders
   ========================================================================== */
function createKpiCard({ label, value, icon: iconName, iconClass, deltaText, deltaUp, isCurrency, delay }) {
  const deltaHtml = deltaText
    ? `<span class="kpi-delta ${deltaUp ? "up" : "down"}">${icon(deltaUp ? "arrow-trend-up" : "arrow-trend-down")} ${deltaText}</span>`
    : "";
  return `
    <div class="kpi-card" style="animation-delay:${delay || 0}ms">
      <div class="row-between">
        <div class="kpi-icon ${iconClass}">${icon(iconName)}</div>
      </div>
      <div>
        <div class="kpi-label">${label}</div>
        <div class="kpi-value num" data-counter data-target="${value}" data-currency="${isCurrency ? 1 : 0}">0</div>
      </div>
      ${deltaHtml}
    </div>`;
}

function createProgressRing(percent, size, strokeW, colorVar) {
  const r = (size - strokeW) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return `
    <div class="ring-wrap" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${r}" stroke="var(--bg-muted)" stroke-width="${strokeW}" fill="none"/>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" stroke="${colorVar}" stroke-width="${strokeW}" fill="none"
          stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}"
          data-ring-target="${offset}" style="transition: stroke-dashoffset 1.2s var(--ease);"/>
      </svg>
      <span class="ring-value">${percent}%</span>
    </div>`;
}

function createBadgeForRank(rank) {
  return `<span class="badge badge-gold">${icon("crown")} ${rank}</span>`;
}

function createEmptyState({ title, desc, actionLabel, actionIcon }) {
  return `
    <div class="empty-state">
      ${icon(actionIcon || "inbox")}
      <h4>${title}</h4>
      <p>${desc}</p>
      ${actionLabel ? `<button class="btn btn-outline btn-sm">${actionLabel}</button>` : ""}
    </div>`;
}

function createErrorState() {
  return `
    <div class="error-state">
      ${icon("triangle-exclamation")}
      <h4>خطایی در بارگذاری اطلاعات رخ داده است</h4>
      <p>لطفاً اتصال خود را بررسی کرده و دوباره تلاش کنید.</p>
      <button class="btn btn-outline btn-sm" onclick="location.reload()">${icon("rotate-right")} تلاش مجدد</button>
    </div>`;
}

function createSkeletonCards(count) {
  return Array.from({ length: count }).map(() => `<div class="skeleton skel-card"></div>`).join("");
}

/* ==========================================================================
   Toast system
   ========================================================================== */
const Toast = {
  stackEl: null,
  init() {
    this.stackEl = document.createElement("div");
    this.stackEl.className = "toast-stack";
    document.body.appendChild(this.stackEl);
  },
  show(message, type = "success") {
    if (!this.stackEl) this.init();
    const icons = { success: "circle-check", warning: "triangle-exclamation", error: "circle-xmark" };
    const t = el(`<div class="toast ${type}">${icon(icons[type] || "circle-check")}<span>${message}</span></div>`);
    this.stackEl.appendChild(t);
    setTimeout(() => {
      t.classList.add("leaving");
      setTimeout(() => t.remove(), 260);
    }, 3200);
  },
};

/* ==========================================================================
   Modal system
   ========================================================================== */
const ModalSystem = {
  overlay: null,
  init() {
    this.overlay = el(`<div class="modal-overlay"></div>`);
    document.body.appendChild(this.overlay);
    this.overlay.addEventListener("click", (e) => { if (e.target === this.overlay) this.close(); });
  },
  open(contentHtml, { wide } = {}) {
    if (!this.overlay) this.init();
    this.overlay.innerHTML = "";
    const box = el(`<div class="modal-box ${wide ? "wide" : ""}">${contentHtml}</div>`);
    this.overlay.appendChild(box);
    this.overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    return box;
  },
  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove("open");
    document.body.style.overflow = "";
  },
};
function closeModal() { ModalSystem.close(); }

/* ==========================================================================
   Number counter animation
   ========================================================================== */
function animateCounters(root) {
  const nodes = (root || document).querySelectorAll("[data-counter]");
  nodes.forEach((node) => {
    const target = parseFloat(node.getAttribute("data-target"));
    const isCurrency = node.getAttribute("data-currency") === "1";
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      node.textContent = isCurrency ? fmt.num(value) : fmt.num(value);
      if (p < 1) requestAnimationFrame(tick);
      else node.textContent = fmt.num(target);
    }
    requestAnimationFrame(tick);
  });
}

function animateRings(root) {
  const rings = (root || document).querySelectorAll("[data-ring-target]");
  rings.forEach((r) => {
    const target = r.getAttribute("data-ring-target");
    requestAnimationFrame(() => { r.style.strokeDashoffset = target; });
  });
}

/* ==========================================================================
   Theme
   ========================================================================== */
const ThemeManager = {
  key: "theme",
  init() {
    const saved = Storage.get(this.key) || "light";
    document.documentElement.setAttribute("data-theme", saved);
  },
  toggle() {
    const cur = document.documentElement.getAttribute("data-theme") || "light";
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    Storage.set(this.key, next);
    ChartsManager.refreshTheme();
  },
};

/* ==========================================================================
   Navigation config per role
   ========================================================================== */
const NAV_CONFIG = {
  employee: [
    { section: "اصلی", items: [
      { hash: "#dashboard", label: "داشبورد", icon: "gauge-high" },
      { hash: "#performance", label: "عملکرد من", icon: "chart-line" },
      { hash: "#sales", label: "فروش من", icon: "cart-shopping" },
    ]},
    { section: "گیمیفیکیشن", items: [
      { hash: "#score", label: "امتیازات", icon: "star" },
      { hash: "#rank", label: "رتبه من", icon: "trophy" },
      { hash: "#lottery", label: "قرعه‌کشی", icon: "gift" },
      { hash: "#rewards", label: "جوایز", icon: "medal" },
    ]},
    { section: "من", items: [
      { hash: "#activities", label: "فعالیت‌ها", icon: "clock-rotate-left" },
      { hash: "#leave", label: "مرخصی و اضافه‌کاری", icon: "calendar-days" },
      { hash: "#profile", label: "پروفایل", icon: "user" },
    ]},
  ],
  admin: [
    { section: "مدیریت", items: [
      { hash: "#admin-dashboard", label: "داشبورد مدیریت", icon: "gauge-high" },
      { hash: "#admin-personnel", label: "پرسنل", icon: "users" },
      { hash: "#admin-sales", label: "فروش", icon: "chart-column" },
      { hash: "#admin-departments", label: "واحدها", icon: "building" },
    ]},
    { section: "گیمیفیکیشن", items: [
      { hash: "#admin-scoring", label: "قوانین امتیازدهی", icon: "sliders" },
      { hash: "#admin-lottery", label: "قرعه‌کشی", icon: "gift" },
      { hash: "#admin-rewards", label: "جوایز", icon: "medal" },
    ]},
    { section: "سیستم", items: [
      { hash: "#admin-reports", label: "گزارش‌ها", icon: "file-lines" },
      { hash: "#admin-settings", label: "تنظیمات", icon: "gear" },
    ]},
  ],
  developer: [
    { section: "Control Center", items: [
      { hash: "#dev-dashboard", label: "Developer Dashboard", icon: "gauge-high" },
      { hash: "#dev-users", label: "Users", icon: "users" },
      { hash: "#dev-admins", label: "Admins", icon: "user-shield" },
      { hash: "#dev-permissions", label: "Permissions", icon: "key" },
    ]},
    { section: "System", items: [
      { hash: "#dev-audit", label: "Audit Logs", icon: "clipboard-list" },
      { hash: "#dev-logs", label: "System Logs", icon: "terminal" },
      { hash: "#dev-crm", label: "Mock CRM", icon: "plug" },
      { hash: "#dev-flags", label: "Feature Flags", icon: "flag" },
      { hash: "#dev-settings", label: "Settings", icon: "gear" },
    ]},
  ],
};

const PAGE_TITLES = {
  "#dashboard": ["داشبورد", "عملکرد شما در یک نگاه"],
  "#performance": ["عملکرد من", "تحلیل کامل شاخص‌های عملکردی شما"],
  "#sales": ["فروش من", "روند و جزئیات فروش شخصی شما"],
  "#score": ["امتیازات", "تاریخچه و منبع امتیازهای شما"],
  "#rank": ["رتبه من", "مسیر پیشرفت شما در سامانه"],
  "#lottery": ["قرعه‌کشی", "شانس خود را برای جوایز امتحان کنید"],
  "#rewards": ["جوایز", "جوایز قابل دریافت با امتیاز شما"],
  "#activities": ["آخرین فعالیت‌ها", "رویدادهای اخیر مرتبط با امتیاز شما"],
  "#leave": ["مرخصی و اضافه‌کاری", "مدیریت درخواست‌ها و تأثیر آن‌ها بر امتیاز"],
  "#profile": ["پروفایل من", "اطلاعات شخصی و خلاصه عملکرد"],

  "#admin-dashboard": ["داشبورد مدیریت", "نمای کلی عملکرد سازمان"],
  "#admin-personnel": ["عملکرد پرسنل", "مدیریت و پایش عملکرد کارکنان"],
  "#admin-sales": ["تحلیل فروش", "روند فروش سازمان در بازه‌های مختلف"],
  "#admin-departments": ["عملکرد واحدها", "سهم و عملکرد هر واحد سازمانی"],
  "#admin-scoring": ["قوانین امتیازدهی", "تعریف و مدیریت قوانین کسب امتیاز"],
  "#admin-lottery": ["مدیریت قرعه‌کشی", "پایش شانس‌ها و برندگان"],
  "#admin-rewards": ["مدیریت جوایز", "تعریف جوایز قابل دریافت پرسنل"],
  "#admin-reports": ["گزارش‌ها", "گزارش‌های تحلیلی سازمان"],
  "#admin-settings": ["تنظیمات", "پیکربندی سامانه"],

  "#dev-dashboard": ["Developer Control Center", "نمای فنی و وضعیت سیستم"],
  "#dev-users": ["Users", "مدیریت کاربران سیستم"],
  "#dev-admins": ["Admins", "مدیریت دسترسی مدیران"],
  "#dev-permissions": ["Permissions", "سطوح دسترسی نقش‌ها"],
  "#dev-audit": ["Audit Logs", "ثبت رویدادهای حساس سیستم"],
  "#dev-logs": ["System Logs", "لاگ‌های سیستمی"],
  "#dev-crm": ["Mock CRM", "وضعیت اتصال به CRM نمایشی"],
  "#dev-flags": ["Feature Flags", "مدیریت قابلیت‌های فعال سیستم"],
  "#dev-settings": ["Settings", "تنظیمات فنی سیستم"],
};

/* ==========================================================================
   Router
   ========================================================================== */
const Router = {
  defaultHash: { employee: "#dashboard", admin: "#admin-dashboard", developer: "#dev-dashboard" },
  init() {
    window.addEventListener("hashchange", () => this.render());
  },
  goDefault() {
    const session = Auth.getSession();
    if (!session) { location.hash = ""; return; }
    location.hash = this.defaultHash[session.role];
  },
  render() {
    const session = Auth.getSession();
    if (!session) { App.renderLogin(); return; }
    let hash = location.hash || this.defaultHash[session.role];
    if (!PAGE_TITLES[hash]) hash = this.defaultHash[session.role];

    App.renderShell(session, hash);
    const main = document.getElementById("mainContent");
    main.innerHTML = `<div class="page-enter" id="pageRoot"></div>`;
    const root = document.getElementById("pageRoot");

    try {
      if (session.role === "employee") EmployeePages.render(hash, root);
      else if (session.role === "admin") AdminPages.render(hash, root);
      else if (session.role === "developer") DeveloperPages.render(hash, root);
      animateCounters(root);
      animateRings(root);
    } catch (err) {
      console.error(err);
      root.innerHTML = createErrorState();
    }
  },
};

/* ==========================================================================
   App shell (sidebar + topbar)
   ========================================================================== */
const App = {
  renderLogin() {
    document.getElementById("app").innerHTML = AuthUI.loginTemplate();
    AuthUI.bindEvents();
  },

  renderShell(session, activeHash) {
    const app = document.getElementById("app");
    if (!document.querySelector(".app-shell")) {
      app.innerHTML = this.shellTemplate(session);
      this.bindShellEvents();
    }
    // Update active nav state
    document.querySelectorAll(".nav-item").forEach((n) => {
      n.classList.toggle("active", n.getAttribute("data-hash") === activeHash);
    });
    document.getElementById("topbarUserName").textContent = session.name;
    document.getElementById("topbarUserRole").textContent = this.roleLabel(session.role);
    document.getElementById("topbarAvatar").textContent = session.avatar;

    const [title, subtitle] = PAGE_TITLES[activeHash] || ["", ""];
    // page header injected per-page by page renderers using helper below
    App._currentTitle = title;
    App._currentSubtitle = subtitle;
  },

  roleLabel(role) {
    return { employee: "کارشناس فروش", admin: "مدیر سیستم", developer: "توسعه‌دهنده" }[role] || role;
  },

  pageHeader(iconName) {
    return `
      <div class="page-header row-between">
        <div>
          <div class="page-title">${App._currentTitle}</div>
          <div class="page-subtitle">${App._currentSubtitle}</div>
        </div>
      </div>`;
  },

  shellTemplate(session) {
    const nav = NAV_CONFIG[session.role];
    const navHtml = nav.map((sec) => `
      <div class="nav-section-label">${sec.section}</div>
      ${sec.items.map((it) => `
        <div class="nav-item" data-hash="${it.hash}" onclick="location.hash='${it.hash}'; SidebarUI.closeMobile();">
          ${icon(it.icon)}<span>${it.label}</span>
        </div>`).join("")}
    `).join("");

    return `
      <div class="app-shell">
        <div class="sidebar-backdrop" id="sidebarBackdrop" onclick="SidebarUI.closeMobile()"></div>
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-brand">
            <div class="brand-mark">SP</div>
            <div class="brand-text">
              <div class="brand-title">سامانه هوشمند عملکرد</div>
              <div class="brand-sub">نسخه نمایشی ۱.۰</div>
            </div>
          </div>
          <nav class="sidebar-nav">${navHtml}</nav>
          <div class="sidebar-footer">
            <span class="demo-badge">${icon("flask")} نسخه نمایشی / Prototype</span>
          </div>
        </aside>

        <header class="topbar">
          <div class="row-gap">
            <button class="icon-btn menu-toggle" id="menuToggle">${icon("bars")}</button>
            <div class="topbar-search">
              ${icon("magnifying-glass")}
              <input type="text" placeholder="جستجو..." />
            </div>
          </div>
          <div class="topbar-actions">
            <button class="icon-btn theme-toggle" id="themeToggleBtn" title="تغییر پوسته">${icon("moon")}</button>
            <div style="position:relative">
              <button class="icon-btn" id="notifBtn">${icon("bell")}<span class="dot"></span></button>
              <div class="dropdown-panel" id="notifPanel"></div>
            </div>
            <div style="position:relative">
              <div class="topbar-user" id="userMenuBtn">
                <div class="user-meta">
                  <div class="user-name" id="topbarUserName">—</div>
                  <div class="user-role" id="topbarUserRole">—</div>
                </div>
                <div class="avatar" id="topbarAvatar">-</div>
              </div>
              <div class="dropdown-panel user-dropdown" id="userPanel">
                <div class="notif-item" style="cursor:pointer" onclick="location.hash='#profile'">${icon("user")} <span class="notif-text">پروفایل من</span></div>
                <div class="notif-item" style="cursor:pointer" onclick="Auth.logout()">${icon("arrow-right-from-bracket")} <span class="notif-text">خروج از حساب</span></div>
              </div>
            </div>
          </div>
        </header>

        <main class="main-content" id="mainContent"></main>
      </div>`;
  },

  bindShellEvents() {
    document.getElementById("themeToggleBtn").addEventListener("click", () => {
      ThemeManager.toggle();
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      document.getElementById("themeToggleBtn").innerHTML = icon(isDark ? "sun" : "moon");
    });
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.getElementById("themeToggleBtn").innerHTML = icon(isDark ? "sun" : "moon");

    document.getElementById("menuToggle").addEventListener("click", () => SidebarUI.openMobile());

    document.getElementById("notifBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      NotificationsUI.toggle();
    });
    document.getElementById("userMenuBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("userPanel").classList.toggle("open");
      document.getElementById("notifPanel").classList.remove("open");
    });
    document.addEventListener("click", () => {
      document.getElementById("notifPanel")?.classList.remove("open");
      document.getElementById("userPanel")?.classList.remove("open");
    });
  },
};

const SidebarUI = {
  openMobile() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebarBackdrop").classList.add("open");
  },
  closeMobile() {
    document.getElementById("sidebar")?.classList.remove("open");
    document.getElementById("sidebarBackdrop")?.classList.remove("open");
  },
};

const NotificationsUI = {
  toggle() {
    const panel = document.getElementById("notifPanel");
    const isOpen = panel.classList.contains("open");
    document.getElementById("userPanel").classList.remove("open");
    if (isOpen) { panel.classList.remove("open"); return; }
    const notifs = DataService.getNotifications();
    panel.innerHTML = `
      <div class="dropdown-head">اعلان‌ها</div>
      ${notifs.map((n) => `
        <div class="notif-item ${n.unread ? "unread" : ""}">
          <div class="notif-icon">${icon(n.icon)}</div>
          <div>
            <div class="notif-text">${n.text}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>`).join("")}`;
    panel.classList.add("open");
  },
};

/* ==========================================================================
   Boot
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  Router.init();
  Router.render();
});
