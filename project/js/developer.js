/* ==========================================================================
   Developer Pages
   ========================================================================== */
const DeveloperPages = {
  render(hash, root) {
    const map = {
      "#dev-dashboard": this.dashboard,
      "#dev-users": this.users,
      "#dev-admins": this.admins,
      "#dev-permissions": this.permissions,
      "#dev-audit": this.audit,
      "#dev-logs": this.logs,
      "#dev-crm": this.crm,
      "#dev-flags": this.flags,
      "#dev-settings": this.settings,
    };
    const fn = (map[hash] || this.dashboard).bind(this);
    fn(root);
  },

  header() { return App.pageHeader(); },

  /* ---------------- Dashboard ---------------- */
  dashboard(root) {
    const users = DataService.getUsers();
    const crm = DataService.getMockCRM();
    root.innerHTML = `
      ${this.header()}
      <div class="grid grid-4" style="margin-bottom:20px">
        ${createKpiCard({ label: "Users", value: users.length + 38, icon: "users", iconClass: "blue", delay: 0 })}
        ${createKpiCard({ label: "Admins", value: 4, icon: "user-shield", iconClass: "gold", delay: 60 })}
        ${createKpiCard({ label: "API Requests (24h)", value: 2481, icon: "server", iconClass: "turquoise", delay: 120 })}
        ${createKpiCard({ label: "Errors (24h)", value: 3, icon: "triangle-exclamation", iconClass: "navy", delay: 180 })}
      </div>

      <div class="grid grid-2-1" style="align-items:start">
        <div class="card">
          <div class="card-head"><div class="card-title">System Status</div></div>
          <div class="grid grid-2" style="gap:14px">
            <div class="crm-stat"><div class="n"><span class="status-dot online"></span>Online</div><div class="l">System Status</div></div>
            <div class="crm-stat"><div class="n"><span class="status-dot online"></span>Mock Connected</div><div class="l">CRM</div></div>
            <div class="crm-stat"><div class="n"><span class="status-dot warn"></span>Demo Mode</div><div class="l">Database</div></div>
            <div class="crm-stat"><div class="n">${crm.lastSync.split(" - ")[1]}</div><div class="l">Last Sync</div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title">Mock CRM</div></div>
          <div class="row-between text-sm" style="margin-bottom:10px"><span class="text-muted">Provider</span><span style="font-weight:700">${crm.provider}</span></div>
          <div class="row-between text-sm" style="margin-bottom:10px"><span class="text-muted">Connection</span><span class="badge badge-success">${crm.connection}</span></div>
          <div class="row-between text-sm"><span class="text-muted">Last Sync</span><span style="font-weight:700">${crm.lastSync}</span></div>
        </div>
      </div>

      <div class="card section-gap">
        <div class="card-head"><div class="card-title">Recent System Logs</div></div>
        ${DataService.getSystemLogs().slice(0, 4).map((l) => this.logRow(l)).join("")}
      </div>
    `;
  },

  logRow(l) {
    const map = { info: ["circle-info", "badge-blue"], warning: ["triangle-exclamation", "badge-warning"], error: ["circle-xmark", "badge-danger"] };
    const [ic, cls] = map[l.level] || map.info;
    return `
      <div class="activity-item">
        <div class="activity-icon">${icon(ic)}</div>
        <div class="activity-text">${l.message}<div class="activity-time">${l.time}</div></div>
        <span class="badge ${cls}">${l.level.toUpperCase()}</span>
      </div>`;
  },

  /* ---------------- Users ---------------- */
  users(root) {
    const users = DataService.getUsers();
    root.innerHTML = `
      ${this.header()}
      <div class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Username</th><th>نام نمایشی</th><th>نقش</th><th>وضعیت</th></tr></thead>
            <tbody>
              ${users.map((u) => `
                <tr>
                  <td style="direction:ltr;text-align:left;font-family:monospace">${u.username}</td>
                  <td>${u.name}</td>
                  <td><span class="badge badge-blue">${u.role}</span></td>
                  <td><span class="badge badge-success">فعال</span></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /* ---------------- Admins ---------------- */
  admins(root) {
    const admins = DataService.getUsers().filter((u) => u.role === "admin" || u.role === "developer");
    root.innerHTML = `
      ${this.header()}
      <div class="grid grid-3">
        ${admins.map((a) => `
          <div class="card">
            <div class="row-gap"><div class="avatar">${a.avatar}</div><div><div style="font-weight:700">${a.name}</div><div class="text-sm text-muted" style="direction:ltr;text-align:right">${a.username}</div></div></div>
            <div class="row-between section-gap"><span class="text-sm text-muted">سطح دسترسی</span><span class="badge badge-gold">${a.role === "developer" ? "Full Access" : "Admin"}</span></div>
          </div>`).join("")}
      </div>
    `;
  },

  /* ---------------- Permissions ---------------- */
  permissions(root) {
    const perms = [
      { role: "Employee", access: ["مشاهده داشبورد شخصی", "ثبت درخواست مرخصی", "مشاهده امتیازات خود"] },
      { role: "Admin", access: ["مدیریت پرسنل", "تعریف قوانین امتیازدهی", "مشاهده گزارش‌های سازمانی"] },
      { role: "Developer", access: ["دسترسی کامل سیستم", "مدیریت Feature Flags", "مشاهده Audit Logs"] },
    ];
    root.innerHTML = `
      ${this.header()}
      <div class="grid grid-3">
        ${perms.map((p) => `
          <div class="card">
            <div class="card-title" style="margin-bottom:14px">${p.role}</div>
            ${p.access.map((a) => `<div class="row-gap text-sm" style="margin-bottom:10px">${icon("check", "")} ${a}</div>`).join("")}
          </div>`).join("")}
      </div>
    `;
  },

  /* ---------------- Audit Logs ---------------- */
  audit(root) {
    const logs = DataService.getAuditLogs();
    root.innerHTML = `
      ${this.header()}
      <div class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>User</th><th>Action</th><th>Entity</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              ${logs.map((l) => `
                <tr>
                  <td style="direction:ltr;text-align:left;font-family:monospace">${l.user}</td>
                  <td>${l.action}</td>
                  <td>${l.entity}</td>
                  <td class="num">${l.date}</td>
                  <td><span class="badge badge-success">${l.status}</span></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /* ---------------- System Logs ---------------- */
  logs(root) {
    root.innerHTML = `
      ${this.header()}
      <div class="card">
        ${DataService.getSystemLogs().map((l) => this.logRow(l)).join("")}
      </div>
    `;
  },

  /* ---------------- Mock CRM ---------------- */
  crm(root) {
    const crm = DataService.getMockCRM();
    root.innerHTML = `
      ${this.header()}
      <div class="card" style="margin-bottom:20px">
        <div class="row-between" style="margin-bottom:18px">
          <div>
            <div class="card-title">وضعیت اتصال CRM</div>
            <div class="card-desc">Provider: ${crm.provider} · Last Sync: ${crm.lastSync}</div>
          </div>
          <span class="badge badge-success">${icon("plug")} ${crm.connection}</span>
        </div>
        <button class="btn btn-primary" id="syncBtn">${icon("rotate")} همگام‌سازی اطلاعات</button>
      </div>
      <div class="grid grid-4" id="crmStats">
        <div class="crm-stat"><div class="n num">${fmt.num(crm.records.employees)}</div><div class="l">Employees</div></div>
        <div class="crm-stat"><div class="n num">${fmt.num(crm.records.sales)}</div><div class="l">Sales</div></div>
        <div class="crm-stat"><div class="n num">${fmt.num(crm.records.invoices)}</div><div class="l">Invoices</div></div>
        <div class="crm-stat"><div class="n num">${fmt.num(crm.records.leave)}</div><div class="l">Leave</div></div>
      </div>
    `;
    document.getElementById("syncBtn").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      btn.innerHTML = `${icon("spinner", "spin")} در حال همگام‌سازی...`;
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `${icon("rotate")} همگام‌سازی اطلاعات`;
        Toast.show("همگام‌سازی با موفقیت انجام شد", "success");
      }, 1600);
    });
  },

  /* ---------------- Feature Flags ---------------- */
  flags(root) {
    const flags = DataService.getFeatureFlags();
    root.innerHTML = `
      ${this.header()}
      <div class="card">
        ${flags.map((f, i) => `
          <div class="row-between" style="padding:14px 0;border-bottom:1px solid var(--border-subtle)">
            <span class="text-sm">${f.name}</span>
            <label class="switch"><input type="checkbox" data-flag-idx="${i}" ${f.enabled ? "checked" : ""} /><span class="switch-slider"></span></label>
          </div>`).join("")}
      </div>
    `;
    root.querySelectorAll("[data-flag-idx]").forEach((sw) => {
      sw.addEventListener("change", () => {
        const idx = Number(sw.getAttribute("data-flag-idx"));
        flags[idx].enabled = sw.checked;
        DataService.setFeatureFlags(flags);
        Toast.show("تنظیمات ذخیره شد", "success");
      });
    });
  },

  /* ---------------- Settings ---------------- */
  settings(root) {
    root.innerHTML = `
      ${this.header()}
      <div class="card">
        <div class="card-head"><div class="card-title">تنظیمات فنی سیستم</div></div>
        <div class="form-group"><label>Environment</label><input class="form-control" value="Demo / Prototype" disabled /></div>
        <div class="form-group"><label>Data Source</label><input class="form-control" value="Mock Data Layer (js/data.js)" disabled /></div>
        <div class="form-group"><label>API Base URL (Future)</label><input class="form-control" placeholder="https://api.example.com/v1" /></div>
        <button class="btn btn-primary" onclick="Toast.show('تنظیمات ذخیره شد', 'success')">${icon("floppy-disk")} ذخیره تنظیمات</button>
      </div>
    `;
  },
};
