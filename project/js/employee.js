/* ==========================================================================
   Employee Pages
   ========================================================================== */
const EmployeePages = {
  render(hash, root) {
    const map = {
      "#dashboard": this.dashboard,
      "#performance": this.performance,
      "#sales": this.sales,
      "#score": this.score,
      "#rank": this.rank,
      "#lottery": this.lottery,
      "#rewards": this.rewards,
      "#activities": this.activities,
      "#leave": this.leave,
      "#profile": this.profile,
    };
    const fn = (map[hash] || this.dashboard).bind(this);
    fn(root);
  },

  header() { return App.pageHeader(); },

  /* ---------------- Dashboard ---------------- */
  dashboard(root) {
    const emp = DataService.getEmployee();
    const products = DataService.getTopProducts();
    const company = DataService.getCompanyProgress();

    root.innerHTML = `
      ${this.header()}

      <div class="card card-glass" style="margin-bottom:20px">
        <div class="row-between" style="flex-wrap:wrap;gap:16px">
          <div class="row-gap">
            <div class="avatar lg">${emp.name[0]}</div>
            <div>
              <div style="font-size:18px;font-weight:800">سلام ${emp.name.split(" ")[0]} 👋</div>
              <div class="text-muted text-sm" style="margin-top:4px">${emp.position} · واحد ${emp.department}</div>
            </div>
          </div>
          <div class="row-gap">
            ${createBadgeForRank(emp.rank)}
            <span class="badge badge-turquoise">${icon("bolt")} ${fmt.num(emp.score)} امتیاز</span>
          </div>
        </div>
      </div>

      <div class="grid grid-4" style="margin-bottom:20px">
        ${createKpiCard({ label: "فروش این ماه", value: emp.kpis.monthlySales, icon: "sack-dollar", iconClass: "gold", deltaText: emp.kpis.monthlySalesGrowth + "٪", deltaUp: true, isCurrency: true, delay: 0 })}
        ${createKpiCard({ label: "تعداد فاکتور", value: emp.kpis.invoiceCount, icon: "file-invoice", iconClass: "blue", deltaText: emp.kpis.invoiceGrowth + "٪", deltaUp: true, delay: 60 })}
        ${createKpiCard({ label: "امتیاز عملکرد", value: emp.kpis.performanceScore, icon: "star", iconClass: "turquoise", deltaText: "+" + emp.kpis.performanceScoreDelta + " امتیاز", deltaUp: true, delay: 120 })}
        ${createKpiCard({ label: "شانس قرعه‌کشی", value: emp.kpis.lotteryChances, icon: "gift", iconClass: "navy", delay: 180 })}
      </div>

      <div class="grid grid-2-1" style="margin-bottom:20px;align-items:start">
        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">روند فروش</div>
              <div class="card-desc">نمایش تعاملی فروش، فاکتور و اقلام در بازه‌های مختلف</div>
            </div>
            <div class="range-tabs" id="salesRangeTabs">
              ${["۱ هفته", "۱ ماه", "۳ ماه", "۶ ماه", "۱ سال"].map((r, i) => `<button class="range-tab ${i === 1 ? "active" : ""}" data-range="${r}">${r}</button>`).join("")}
            </div>
          </div>
          <div class="chart-canvas-wrap"><canvas id="salesLineChart"></canvas></div>
        </div>

        <div class="card">
          <div class="card-head"><div class="card-title">تحلیل عملکرد من</div></div>
          <div style="display:flex;flex-wrap:wrap;gap:18px;justify-content:center">
            ${createProgressRing(emp.performance.overall, 120, 10, "var(--gold-500)")}
          </div>
          <div class="ring-label" style="margin-bottom:14px">امتیاز کلی عملکرد</div>
          <div class="stack" style="gap:10px">
            ${this.miniBar("امتیاز فروش", emp.performance.sales, "var(--gold-500)")}
            ${this.miniBar("امتیاز فاکتور", emp.performance.invoice, "var(--blue-500)")}
            ${this.miniBar("امتیاز حضور", emp.performance.attendance, "var(--turquoise-500)")}
            ${this.miniBar("امتیاز اضافه‌کاری", emp.performance.overtime, "var(--success-500)")}
          </div>
        </div>
      </div>

      <div class="grid grid-2-1" style="align-items:start">
        <div class="stack">
          <div class="card">
            <div class="card-head">
              <div class="card-title">محصولات پرفروش من</div>
            </div>
            <div class="table-wrap">
              <table class="data-table">
                <thead><tr><th>محصول</th><th>تعداد</th><th>مبلغ فروش</th><th>امتیاز</th></tr></thead>
                <tbody>
                  ${products.map((p) => `
                    <tr>
                      <td>${p.name}</td>
                      <td class="num">${fmt.num(p.qty)}</td>
                      <td class="num">${fmt.toman(p.amount)}</td>
                      <td><span class="badge badge-success">${icon("plus")} ${p.score}</span></td>
                    </tr>`).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="card-head"><div class="card-title">پیشرفت کلی شرکت</div></div>
            <div class="row-between" style="margin-bottom:8px">
              <span class="text-sm text-muted">فروش فعلی از هدف</span>
              <span style="font-weight:800">${company.percentage}٪</span>
            </div>
            <div class="progress-track"><div class="progress-fill gold" style="width:${company.percentage}%"></div></div>
            <div class="row-between" style="margin-top:12px">
              <span class="text-sm text-muted">${fmt.compactToman(company.currentSales)} از ${fmt.compactToman(company.salesTarget)} تومان</span>
              <span class="badge badge-success">${icon("arrow-trend-up")} ${company.growthVsLastMonth}٪</span>
            </div>
            <div class="row-between" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border-subtle)">
              <span class="text-sm text-muted">تعداد کل فاکتورها</span>
              <span style="font-weight:700" class="num">${fmt.num(company.totalInvoices)}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><div class="card-title">آخرین فعالیت‌ها</div></div>
          <div>
            ${DataService.getRecentActivities().slice(0, 5).map((a) => `
              <div class="activity-item">
                <div class="activity-icon">${icon(a.icon)}</div>
                <div class="activity-text">
                  ${a.text}
                  <div class="activity-time">${a.time}</div>
                </div>
                <div class="activity-delta ${a.delta >= 0 ? "pos" : "neg"}">${a.delta >= 0 ? "+" : ""}${a.delta}</div>
              </div>`).join("")}
          </div>
        </div>
      </div>

      <div class="section-gap">
        ${RankUI.roadmapCard(true)}
      </div>

      <div class="section-gap">
        ${LotteryUI.card()}
      </div>
    `;

    this.bindSalesChart("۱ ماه");
    LotteryUI.bind(root);
  },

  miniBar(label, value, color) {
    return `
      <div>
        <div class="row-between text-sm" style="margin-bottom:5px"><span class="text-muted">${label}</span><span style="font-weight:700">${value}٪</span></div>
        <div class="progress-track" style="height:7px"><div class="progress-fill" style="width:${value}%;background:${color}"></div></div>
      </div>`;
  },

  bindSalesChart(initialRange) {
    const render = (range) => {
      const s = DataService.getSalesSeries(range);
      ChartsManager.lineChart("salesLineChart", {
        labels: s.labels,
        datasets: [
          { label: "فروش (میلیون تومان)", data: s.sales, color: "#c9a227" },
          { label: "تعداد فاکتور", data: s.invoices, color: "#2f6fed" },
          { label: "تعداد اقلام", data: s.items, color: "#12968f" },
        ],
      });
    };
    render(initialRange);
    document.querySelectorAll('[data-range]').forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll('[data-range]').forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        render(btn.getAttribute("data-range"));
      });
    });
  },

  /* ---------------- Performance ---------------- */
  performance(root) {
    const emp = DataService.getEmployee();
    root.innerHTML = `
      ${this.header()}
      <div class="grid grid-2-1" style="align-items:start">
        <div class="card">
          <div class="card-head"><div class="card-title">نمودار رادار عملکرد</div></div>
          <div class="chart-canvas-wrap"><canvas id="perfRadar"></canvas></div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title">جزئیات شاخص‌ها</div></div>
          <div class="stack" style="gap:14px">
            ${this.miniBar("فروش", emp.performance.sales, "var(--gold-500)")}
            ${this.miniBar("فاکتور", emp.performance.invoice, "var(--blue-500)")}
            ${this.miniBar("حضور و غیاب", emp.performance.attendance, "var(--turquoise-500)")}
            ${this.miniBar("اضافه‌کاری", emp.performance.overtime, "var(--success-500)")}
            ${this.miniBar("تنوع محصول", emp.performance.productDiversity, "var(--warning-500)")}
          </div>
        </div>
      </div>
      <div class="grid grid-4 section-gap">
        ${createKpiCard({ label: "امتیاز کلی", value: emp.performance.overall, icon: "gauge-high", iconClass: "gold", delay: 0 })}
        ${createKpiCard({ label: "رتبه فعلی در واحد", value: 2, icon: "ranking-star", iconClass: "blue", delay: 60 })}
        ${createKpiCard({ label: "فاصله تا رتبه بعدی", value: emp.nextRankProgress, icon: "flag-checkered", iconClass: "turquoise", delay: 120 })}
        ${createKpiCard({ label: "روزهای متوالی فعال", value: 46, icon: "fire", iconClass: "navy", delay: 180 })}
      </div>
    `;
    ChartsManager.radarChart("perfRadar", {
      labels: ["فروش", "فاکتور", "حضور", "اضافه‌کاری", "تنوع محصول", "کلی"],
      data: [emp.performance.sales, emp.performance.invoice, emp.performance.attendance, emp.performance.overtime, emp.performance.productDiversity, emp.performance.overall],
    });
  },

  /* ---------------- Sales ---------------- */
  sales(root) {
    const products = DataService.getTopProducts();
    root.innerHTML = `
      ${this.header()}
      <div class="card" style="margin-bottom:20px">
        <div class="card-head">
          <div class="card-title">روند فروش من</div>
          <div class="range-tabs" id="salesRangeTabs2">
            ${["۱ هفته", "۱ ماه", "۳ ماه", "۶ ماه", "۱ سال"].map((r, i) => `<button class="range-tab ${i === 1 ? "active" : ""}" data-range2="${r}">${r}</button>`).join("")}
          </div>
        </div>
        <div class="chart-canvas-wrap"><canvas id="salesBarChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title">جزئیات فروش محصولات</div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>محصول</th><th>تعداد فروش</th><th>مبلغ فروش</th><th>امتیاز کسب‌شده</th></tr></thead>
            <tbody>
              ${products.map((p) => `<tr><td>${p.name}</td><td class="num">${fmt.num(p.qty)}</td><td class="num">${fmt.toman(p.amount)}</td><td><span class="badge badge-success">+${p.score}</span></td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
    const renderBar = (range) => {
      const s = DataService.getSalesSeries(range);
      ChartsManager.barChart("salesBarChart", { labels: s.labels, data: s.sales, color: "#c9a227" });
    };
    renderBar("۱ ماه");
    document.querySelectorAll('[data-range2]').forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll('[data-range2]').forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderBar(btn.getAttribute("data-range2"));
      });
    });
  },

  /* ---------------- Score ---------------- */
  score(root) {
    const emp = DataService.getEmployee();
    const activities = DataService.getRecentActivities();
    root.innerHTML = `
      ${this.header()}
      <div class="grid grid-3" style="margin-bottom:20px">
        ${createKpiCard({ label: "امتیاز فعلی", value: emp.score, icon: "star", iconClass: "gold", delay: 0 })}
        ${createKpiCard({ label: "امتیاز کسب‌شده این ماه", value: emp.kpis.performanceScoreDelta, icon: "arrow-trend-up", iconClass: "success", delay: 60 })}
        ${createKpiCard({ label: "امتیاز تا رتبه بعدی", value: 240, icon: "flag-checkered", iconClass: "blue", delay: 120 })}
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title">تاریخچه امتیازات</div></div>
        ${activities.map((a) => `
          <div class="activity-item">
            <div class="activity-icon">${icon(a.icon)}</div>
            <div class="activity-text">${a.text}<div class="activity-time">${a.time}</div></div>
            <div class="activity-delta ${a.delta >= 0 ? "pos" : "neg"}">${a.delta >= 0 ? "+" : ""}${a.delta}</div>
          </div>`).join("")}
      </div>
    `;
  },

  /* ---------------- Rank ---------------- */
  rank(root) {
    root.innerHTML = `${this.header()} ${RankUI.roadmapCard(false)} <div class="section-gap">${FolderUI.card()}</div>`;
  },

  /* ---------------- Lottery ---------------- */
  lottery(root) {
    root.innerHTML = `${this.header()} ${LotteryUI.card()}`;
    LotteryUI.bind(root);
  },

  /* ---------------- Rewards ---------------- */
  rewards(root) {
    const emp = DataService.getEmployee();
    const rewards = DataService.getStoredRewards();
    root.innerHTML = `
      ${this.header()}
      <div class="card" style="margin-bottom:20px">
        <div class="row-between">
          <div class="card-title">امتیاز قابل استفاده شما</div>
          <span class="badge badge-gold">${icon("star")} ${fmt.num(emp.score)} امتیاز</span>
        </div>
      </div>
      <div class="grid grid-4">
        ${rewards.map((r) => `
          <div class="reward-card">
            <div class="reward-icon ${r.color}">${icon(r.icon)}</div>
            <div class="reward-title">${r.title}</div>
            <div class="reward-subtitle">${r.subtitle}</div>
            <div class="reward-cost">${r.cost} امتیاز</div>
            <button class="btn btn-outline btn-sm btn-block" style="margin-top:12px" ${emp.score < r.cost ? "disabled" : ""} onclick="EmployeePages.redeem('${r.title}')">دریافت جایزه</button>
          </div>`).join("")}
      </div>
    `;
  },
  redeem(title) { Toast.show(`درخواست دریافت «${title}» ثبت شد`, "success"); },

  /* ---------------- Activities ---------------- */
  activities(root) {
    const activities = DataService.getRecentActivities();
    root.innerHTML = `
      ${this.header()}
      <div class="card">
        ${activities.length ? activities.map((a) => `
          <div class="activity-item">
            <div class="activity-icon">${icon(a.icon)}</div>
            <div class="activity-text">${a.text}<div class="activity-time">${a.time}</div></div>
            <div class="activity-delta ${a.delta >= 0 ? "pos" : "neg"}">${a.delta >= 0 ? "+" : ""}${a.delta}</div>
          </div>`).join("") : createEmptyState({ title: "فعالیتی ثبت نشده", desc: "با ثبت اولین فروش یا فاکتور، فعالیت‌های شما اینجا نمایش داده می‌شود.", actionIcon: "inbox" })}
      </div>
    `;
  },

  /* ---------------- Leave & Overtime ---------------- */
  leave(root) {
    root.innerHTML = `
      ${this.header()}
      <div class="card">
        <div class="tab-strip" id="leaveTabs">
          <button class="active" data-tab="leaves">مرخصی‌ها</button>
          <button data-tab="overtimes">اضافه‌کاری‌ها</button>
        </div>
        <div id="leaveTabContent"></div>
      </div>
    `;
    const renderTab = (tab) => {
      const data = tab === "leaves" ? DataService.getLeaves() : DataService.getOvertimes();
      const content = document.getElementById("leaveTabContent");
      content.innerHTML = `
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>تاریخ</th><th>نوع</th><th>مدت</th><th>وضعیت</th><th>اثر بر امتیاز</th></tr></thead>
            <tbody>
              ${data.map((d) => `
                <tr>
                  <td class="num">${d.date}</td>
                  <td>${d.type}</td>
                  <td>${d.duration}</td>
                  <td><span class="badge ${d.status === "تأیید شده" ? "badge-success" : "badge-warning"}">${d.status}</span></td>
                  <td>${d.effect}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>`;
    };
    renderTab("leaves");
    document.querySelectorAll("#leaveTabs button").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#leaveTabs button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderTab(btn.getAttribute("data-tab"));
      });
    });
  },

  /* ---------------- Profile ---------------- */
  profile(root) {
    const emp = DataService.getEmployee();
    root.innerHTML = `
      ${this.header()}
      <div class="grid grid-2-1" style="align-items:start">
        <div class="card">
          <div class="row-gap" style="margin-bottom:20px">
            <div class="avatar lg">${emp.name[0]}</div>
            <div>
              <div style="font-size:17px;font-weight:800">${emp.name}</div>
              <div class="text-muted text-sm">${emp.position} · واحد ${emp.department}</div>
            </div>
          </div>
          <div class="grid grid-2" style="gap:14px">
            ${this.profileField("کد پرسنلی", emp.id)}
            ${this.profileField("تاریخ شروع همکاری", emp.joinDate)}
            ${this.profileField("رتبه فعلی", emp.rank)}
            ${this.profileField("امتیاز کل", fmt.num(emp.score))}
          </div>
        </div>
        ${FolderUI.card()}
      </div>
      <div class="card section-gap">
        <div class="card-head"><div class="card-title">خلاصه عملکرد</div></div>
        <div class="grid grid-4">
          ${this.miniStat("فروش", emp.performance.sales)}
          ${this.miniStat("فاکتور", emp.performance.invoice)}
          ${this.miniStat("حضور", emp.performance.attendance)}
          ${this.miniStat("کلی", emp.performance.overall)}
        </div>
      </div>
    `;
  },
  profileField(label, value) {
    return `<div><div class="text-sm text-muted" style="margin-bottom:4px">${label}</div><div style="font-weight:700">${value}</div></div>`;
  },
  miniStat(label, value) {
    return `<div style="text-align:center;padding:14px;border-radius:var(--r-md);background:var(--bg-surface-alt)"><div style="font-size:20px;font-weight:800">${value}٪</div><div class="text-sm text-muted" style="margin-top:4px">${label}</div></div>`;
  },
};

/* ==========================================================================
   Shared: Rank Roadmap UI
   ========================================================================== */
const RankUI = {
  roadmapCard(compact) {
    const ranks = DataService.getRanks();
    const currentIdx = DataService.getCurrentRankIndex();
    const emp = DataService.getEmployee();
    return `
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">مسیر پیشرفت من</div>
            <div class="card-desc">رتبه فعلی: ${emp.rank} · ${emp.nextRankProgress}٪ تا رتبه بعدی</div>
          </div>
          ${createBadgeForRank(emp.rank)}
        </div>
        <div class="progress-track" style="margin-bottom:18px">
          <div class="progress-fill gold" style="width:${emp.nextRankProgress}%"></div>
        </div>
        <div class="roadmap-scroll">
          <div class="roadmap-track">
            ${ranks.map((r, i) => {
              const state = i < currentIdx ? "done" : i === currentIdx ? "current" : "locked";
              return `
                ${i > 0 ? `<div class="roadmap-connector ${i <= currentIdx ? "done" : ""}"></div>` : ""}
                <div class="roadmap-node ${state}">
                  <div class="roadmap-icon">
                    ${icon(r.icon)}
                    ${state === "locked" ? `<span class="roadmap-lock-badge">${icon("lock")}</span>` : ""}
                  </div>
                  <div class="roadmap-title">${r.title}</div>
                  ${state === "current" ? `<span class="roadmap-tag">رتبه فعلی</span>` : ""}
                </div>`;
            }).join("")}
          </div>
        </div>
      </div>`;
  },
};

/* ==========================================================================
   Shared: Digital Employee Folder
   ========================================================================== */
const FolderUI = {
  card() {
    const tabs = [
      { icon: "user", label: "پروفایل", hash: "#profile" },
      { icon: "chart-line", label: "عملکرد", hash: "#performance" },
      { icon: "cart-shopping", label: "فروش", hash: "#sales" },
      { icon: "star", label: "امتیازات", hash: "#score" },
      { icon: "trophy", label: "رتبه", hash: "#rank" },
      { icon: "medal", label: "جوایز", hash: "#rewards" },
    ];
    return `
      <div class="folder-card">
        <div class="row-gap">
          ${icon("folder-open")}
          <div>
            <div style="font-weight:800;font-size:15px">پرونده عملکرد دیجیتال</div>
            <div style="font-size:12px;color:#aeb8cc;margin-top:3px">دسترسی سریع به تمام اطلاعات شخصی شما</div>
          </div>
        </div>
        <div class="folder-tabs">
          ${tabs.map((t) => `<a class="folder-tab" href="${t.hash}">${icon(t.icon)}${t.label}</a>`).join("")}
        </div>
      </div>`;
  },
};

/* ==========================================================================
   Shared: Lottery
   ========================================================================== */
const LotteryUI = {
  card() {
    const emp = DataService.getEmployee();
    return `
      <div class="lottery-card">
        <div class="lottery-inner">
          <div class="text-sm" style="color:#b8c1d6">امتیاز فعلی شما</div>
          <div class="lottery-score">${fmt.num(emp.score)}</div>
          <div class="text-sm" style="color:#8592ab">به ازای هر ۳۰ امتیاز، یک شانس قرعه‌کشی دریافت می‌کنید</div>
          <div class="lottery-chances">${icon("ticket")} تعداد شانس شما: <b>${emp.lotteryChances}</b></div>
          <div>
            <button class="btn btn-gold btn-lg" id="openLotteryBtn">${icon("dice")} ورود به قرعه‌کشی</button>
          </div>
        </div>
      </div>`;
  },
  bind(root) {
    const btn = root.querySelector("#openLotteryBtn");
    if (!btn) return;
    btn.addEventListener("click", () => this.openModal());
  },
  openModal() {
    const box = ModalSystem.open(`
      <div class="modal-head">
        <div class="card-title">${icon("gift")} قرعه‌کشی امتیازی</div>
        <button class="modal-close" onclick="closeModal()">${icon("xmark")}</button>
      </div>
      <div id="lotteryModalBody">
        <div class="wheel-zone">
          <div class="wheel-visual" id="wheelVisual">${icon("gift")}</div>
          <p class="text-sm text-muted" style="text-align:center;margin-bottom:18px">با کلیک روی دکمه زیر، شانس خود را برای این دوره امتحان کنید.</p>
          <button class="btn btn-gold btn-block" id="spinBtn">${icon("dice")} شروع قرعه‌کشی</button>
        </div>
      </div>
    `);
    box.querySelector("#spinBtn").addEventListener("click", () => this.spin());
  },
  spin() {
    const wheel = document.getElementById("wheelVisual");
    const spinBtn = document.getElementById("spinBtn");
    spinBtn.disabled = true;
    spinBtn.innerHTML = `${icon("spinner", "spin")} در حال قرعه‌کشی...`;
    wheel.classList.add("spinning");

    setTimeout(() => {
      const win = Math.random() > 0.45;
      const body = document.getElementById("lotteryModalBody");
      if (win) {
        const points = [20, 30, 50, 80][Math.floor(Math.random() * 4)];
        body.innerHTML = `
          <div class="lottery-result">
            <div class="result-emoji">🎉</div>
            <h3>تبریک!</h3>
            <p>شما برنده ${fmt.num(points)} امتیاز شدید</p>
            <button class="btn btn-primary btn-block" style="margin-top:18px" onclick="closeModal()">متوجه شدم</button>
          </div>`;
        Toast.show(`${fmt.num(points)} امتیاز جدید دریافت کردید`, "success");
      } else {
        body.innerHTML = `
          <div class="lottery-result">
            <div class="result-emoji">🙁</div>
            <h3>این بار جایزه‌ای برای شما ثبت نشد</h3>
            <p>شانس بعدی خود را از دست ندهید، با کسب امتیاز بیشتر دوباره تلاش کنید.</p>
            <button class="btn btn-outline btn-block" style="margin-top:18px" onclick="closeModal()">بستن</button>
          </div>`;
      }
    }, 2500);
  },
};
