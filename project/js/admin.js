/* ==========================================================================
   Admin Pages
   ========================================================================== */
const AdminPages = {
  render(hash, root) {
    const map = {
      "#admin-dashboard": this.dashboard,
      "#admin-personnel": this.personnel,
      "#admin-sales": this.sales,
      "#admin-departments": this.departments,
      "#admin-scoring": this.scoring,
      "#admin-lottery": this.lottery,
      "#admin-rewards": this.rewards,
      "#admin-reports": this.reports,
      "#admin-settings": this.settings,
    };
    const fn = (map[hash] || this.dashboard).bind(this);
    fn(root);
  },

  header() { return App.pageHeader(); },

  /* ---------------- Dashboard ---------------- */
  dashboard(root) {
    const personnel = DataService.getPersonnel();
    const totalSales = personnel.reduce((s, p) => s + p.sales, 0) + 1680000000 - personnel.reduce((s, p) => s + p.sales, 0); // keep company total consistent
    const company = DataService.getCompanyProgress();
    const totalScore = personnel.reduce((s, p) => s + p.score, 0);
    const trend = DataService.getCompanySalesTrend();
    const dist = DataService.getPerformanceDistribution();
    const depts = DataService.getDepartments();

    root.innerHTML = `
      ${this.header()}
      <div class="grid grid-4" style="margin-bottom:20px">
        ${createKpiCard({ label: "فروش کل شرکت", value: company.currentSales, icon: "sack-dollar", iconClass: "gold", isCurrency: true, deltaText: company.growthVsLastMonth + "٪", deltaUp: true, delay: 0 })}
        ${createKpiCard({ label: "تعداد پرسنل", value: personnel.length + 35, icon: "users", iconClass: "blue", delay: 60 })}
        ${createKpiCard({ label: "فاکتورهای امروز", value: 47, icon: "file-invoice", iconClass: "turquoise", delay: 120 })}
        ${createKpiCard({ label: "درصد تحقق هدف", value: company.percentage, icon: "bullseye", iconClass: "navy", delay: 180 })}
      </div>

      <div class="grid grid-2-1" style="margin-bottom:20px;align-items:start">
        <div class="card">
          <div class="card-head"><div class="card-title">روند فروش شرکت</div></div>
          <div class="chart-canvas-wrap"><canvas id="companyTrendChart"></canvas></div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title">توزیع عملکرد پرسنل</div></div>
          <div class="chart-canvas-wrap sm"><canvas id="perfDistChart"></canvas></div>
          <div class="legend-list section-gap">
            ${dist.labels.map((l, i) => `
              <div class="legend-row">
                <span class="legend-dot" style="background:${["#e5484d", "#d68a1b", "#2f6fed", "#1e9e6b"][i]}"></span>
                <span>${l}</span><span class="val">${dist.values[i]} نفر</span>
              </div>`).join("")}
          </div>
        </div>
      </div>

      <div class="grid grid-2-1" style="align-items:start">
        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">برترین کارکنان</div>
              <div class="card-desc">${icon("eye-slash")} نمایش داخلی مدیریت</div>
            </div>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>#</th><th>نام</th><th>واحد</th><th>امتیاز</th><th>رتبه</th></tr></thead>
              <tbody>
                ${[...personnel].sort((a, b) => b.score - a.score).slice(0, 5).map((p, i) => `
                  <tr>
                    <td class="num">${i + 1}</td>
                    <td class="row-gap"><span class="avatar" style="width:28px;height:28px;font-size:11px">${p.name[0]}</span>${p.name}</td>
                    <td>${p.dept}</td>
                    <td class="num">${fmt.num(p.score)}</td>
                    <td><span class="badge badge-gold">${p.rank}</span></td>
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><div class="card-title">عملکرد واحدها</div></div>
          <div class="stack" style="gap:14px">
            ${depts.map((d) => `
              <div>
                <div class="row-between text-sm" style="margin-bottom:5px"><span>${d.name}</span><span style="font-weight:700">${d.performance}٪</span></div>
                <div class="progress-track" style="height:8px"><div class="progress-fill" style="width:${d.performance}%"></div></div>
              </div>`).join("")}
          </div>
        </div>
      </div>
    `;

    ChartsManager.lineChart("companyTrendChart", {
      labels: trend.labels,
      datasets: [{ label: "فروش (میلیون تومان)", data: trend.values, color: "#c9a227" }],
    });
    ChartsManager.donutChart("perfDistChart", {
      labels: dist.labels, data: dist.values,
      colors: ["#e5484d", "#d68a1b", "#2f6fed", "#1e9e6b"],
    });
  },

  /* ---------------- Personnel ---------------- */
  personnel(root) {
    const personnel = DataService.getPersonnel();
    root.innerHTML = `
      ${this.header()}
      <div class="card">
        <div class="table-toolbar">
          <div class="topbar-search" style="width:260px">
            ${icon("magnifying-glass")}
            <input type="text" id="personnelSearch" placeholder="جستجوی نام پرسنل..." />
          </div>
          <div class="row-gap">
            <select class="input-field" id="deptFilter">
              <option value="">همه واحدها</option>
              <option value="فروش">فروش</option>
              <option value="انبار">انبار</option>
              <option value="مالی">مالی</option>
              <option value="اداری">اداری</option>
            </select>
            <select class="input-field" id="sortFilter">
              <option value="score-desc">مرتب‌سازی: بیشترین امتیاز</option>
              <option value="sales-desc">مرتب‌سازی: بیشترین فروش</option>
              <option value="name-asc">مرتب‌سازی: نام</option>
            </select>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table" id="personnelTable">
            <thead><tr><th>نام</th><th>واحد</th><th>فروش</th><th>فاکتور</th><th>امتیاز</th><th>رتبه</th><th>رشد</th><th>وضعیت</th></tr></thead>
            <tbody id="personnelTbody"></tbody>
          </table>
        </div>
      </div>
    `;

    const renderRows = () => {
      const search = document.getElementById("personnelSearch").value.trim();
      const dept = document.getElementById("deptFilter").value;
      const sort = document.getElementById("sortFilter").value;
      let rows = personnel.filter((p) => p.name.includes(search) && (!dept || p.dept === dept));
      if (sort === "score-desc") rows.sort((a, b) => b.score - a.score);
      if (sort === "sales-desc") rows.sort((a, b) => b.sales - a.sales);
      if (sort === "name-asc") rows.sort((a, b) => a.name.localeCompare(b.name, "fa"));

      const tbody = document.getElementById("personnelTbody");
      if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="8">${createEmptyState({ title: "نتیجه‌ای یافت نشد", desc: "فیلترها یا عبارت جستجو را تغییر دهید.", actionIcon: "magnifying-glass" })}</td></tr>`;
        return;
      }
      tbody.innerHTML = rows.map((p) => `
        <tr onclick="AdminPages.openPersonDetail('${p.id}')">
          <td class="row-gap"><span class="avatar" style="width:30px;height:30px;font-size:12px">${p.name[0]}</span>${p.name}</td>
          <td>${p.dept}</td>
          <td class="num">${p.sales ? fmt.compactToman(p.sales) : "—"}</td>
          <td class="num">${p.invoices || "—"}</td>
          <td class="num">${fmt.num(p.score)}</td>
          <td><span class="badge badge-gold">${p.rank}</span></td>
          <td><span class="badge ${p.growth >= 0 ? "badge-success" : "badge-danger"}">${p.growth >= 0 ? "+" : ""}${p.growth}٪</span></td>
          <td><span class="badge ${p.status === "فعال" ? "badge-success" : "badge-warning"}">${p.status}</span></td>
        </tr>`).join("");
    };

    renderRows();
    document.getElementById("personnelSearch").addEventListener("input", renderRows);
    document.getElementById("deptFilter").addEventListener("change", renderRows);
    document.getElementById("sortFilter").addEventListener("change", renderRows);
  },

  openPersonDetail(id) {
    const p = DataService.getPersonnel().find((x) => x.id === id);
    if (!p) return;
    ModalSystem.open(`
      <div class="modal-head">
        <div class="row-gap"><span class="avatar">${p.name[0]}</span><div class="card-title">${p.name}</div></div>
        <button class="modal-close" onclick="closeModal()">${icon("xmark")}</button>
      </div>
      <div class="grid grid-2" style="gap:12px;margin-bottom:16px">
        ${EmployeePages.profileField("واحد", p.dept)}
        ${EmployeePages.profileField("رتبه", p.rank)}
        ${EmployeePages.profileField("امتیاز", fmt.num(p.score))}
        ${EmployeePages.profileField("وضعیت", p.status)}
      </div>
      <div class="chart-canvas-wrap sm"><canvas id="personDetailRadar"></canvas></div>
    `, { wide: true });
    setTimeout(() => {
      ChartsManager.radarChart("personDetailRadar", {
        labels: ["فروش", "فاکتور", "حضور", "اضافه‌کاری", "تنوع محصول", "کلی"],
        data: [Math.min(100, 60 + p.growth), 70, 90, 75, 65, Math.min(100, Math.round(p.score / 10))],
      });
    }, 30);
  },

  /* ---------------- Sales Analytics ---------------- */
  sales(root) {
    const trend = DataService.getCompanySalesTrend();
    root.innerHTML = `
      ${this.header()}
      <div class="card" style="margin-bottom:20px">
        <div class="card-head">
          <div class="card-title">روند فروش سازمان</div>
          <div class="range-tabs" id="adminSalesRange">
            ${["۱ هفته", "۱ ماه", "۳ ماه", "۶ ماه", "۱ سال"].map((r, i) => `<button class="range-tab ${i === 3 ? "active" : ""}" data-arange="${r}">${r}</button>`).join("")}
          </div>
        </div>
        <div class="chart-canvas-wrap"><canvas id="adminSalesChart"></canvas></div>
      </div>
      <div class="grid grid-2">
        <div class="card">
          <div class="card-head"><div class="card-title">فاکتور بر اساس بازه</div></div>
          <div class="chart-canvas-wrap sm"><canvas id="adminInvoiceChart"></canvas></div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title">روند فروش ۶ ماهه شرکت</div></div>
          <div class="chart-canvas-wrap sm"><canvas id="adminTrendMini"></canvas></div>
        </div>
      </div>
    `;
    const renderCharts = (range) => {
      const s = DataService.getSalesSeries(range);
      ChartsManager.lineChart("adminSalesChart", {
        labels: s.labels,
        datasets: [
          { label: "فروش", data: s.sales.map((v) => v * 12), color: "#c9a227" },
          { label: "فاکتور", data: s.invoices.map((v) => v * 12), color: "#2f6fed" },
        ],
      });
      ChartsManager.barChart("adminInvoiceChart", { labels: s.labels, data: s.invoices.map((v) => v * 12), color: "#2f6fed" });
    };
    renderCharts("۶ ماه");
    document.querySelectorAll("[data-arange]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-arange]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderCharts(btn.getAttribute("data-arange"));
      });
    });
    ChartsManager.lineChart("adminTrendMini", { labels: trend.labels, datasets: [{ label: "فروش", data: trend.values, color: "#12968f" }] });
  },

  /* ---------------- Departments ---------------- */
  departments(root) {
    const depts = DataService.getDepartments();
    const pct = DataService.getCompanyPercentages();
    root.innerHTML = `
      ${this.header()}
      <div class="grid grid-2-1" style="align-items:start">
        <div class="card">
          <div class="card-head"><div class="card-title">عملکرد واحدها</div></div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>واحد</th><th>امتیاز</th><th>عملکرد</th><th>سهم از فروش</th></tr></thead>
              <tbody>
                ${depts.map((d) => `
                  <tr>
                    <td>${d.name}</td>
                    <td class="num">${d.score}</td>
                    <td>
                      <div class="progress-track" style="height:7px;width:120px"><div class="progress-fill" style="width:${d.performance}%"></div></div>
                    </td>
                    <td class="num">${d.share}٪</td>
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <div class="card-title">سهم واحدها از فروش</div>
            <button class="btn btn-outline btn-sm" id="editPctBtn">${icon("pen")} ویرایش درصدها</button>
          </div>
          <div class="chart-canvas-wrap sm"><canvas id="pctDonut"></canvas></div>
          <div class="legend-list section-gap" id="pctLegend"></div>
        </div>
      </div>
    `;
    this.renderPctDonut(pct);
    document.getElementById("editPctBtn").addEventListener("click", () => this.openPctEditor());
  },

  renderPctDonut(pct) {
    const labels = ["فروش", "انبارداری", "مالی", "اداری"];
    const colors = ["#c9a227", "#2f6fed", "#12968f", "#5b6478"];
    const values = [pct.sales, pct.warehouse, pct.finance, pct.admin];
    ChartsManager.donutChart("pctDonut", { labels, data: values, colors });
    document.getElementById("pctLegend").innerHTML = labels.map((l, i) => `
      <div class="legend-row"><span class="legend-dot" style="background:${colors[i]}"></span><span>${l}</span><span class="val">${values[i]}٪</span></div>`).join("");
  },

  openPctEditor() {
    const pct = DataService.getCompanyPercentages();
    const box = ModalSystem.open(`
      <div class="modal-head">
        <div class="card-title">ویرایش سهم واحدها</div>
        <button class="modal-close" onclick="closeModal()">${icon("xmark")}</button>
      </div>
      <div class="pct-edit-row"><label>فروش</label><input class="form-control" type="number" id="pctSales" value="${pct.sales}" min="0" max="100" /></div>
      <div class="pct-edit-row"><label>انبارداری</label><input class="form-control" type="number" id="pctWarehouse" value="${pct.warehouse}" min="0" max="100" /></div>
      <div class="pct-edit-row"><label>مالی</label><input class="form-control" type="number" id="pctFinance" value="${pct.finance}" min="0" max="100" /></div>
      <div class="pct-edit-row"><label>اداری</label><input class="form-control" type="number" id="pctAdmin" value="${pct.admin}" min="0" max="100" /></div>
      <div class="pct-total-banner" id="pctBanner">مجموع: 100٪</div>
      <button class="btn btn-primary btn-block" style="margin-top:16px" id="savePctBtn">ذخیره تغییرات</button>
    `);
    const inputs = ["pctSales", "pctWarehouse", "pctFinance", "pctAdmin"].map((id) => document.getElementById(id));
    const updateBanner = () => {
      const total = inputs.reduce((s, i) => s + Number(i.value || 0), 0);
      const banner = document.getElementById("pctBanner");
      banner.textContent = `مجموع: ${total}٪` + (total !== 100 ? " — باید دقیقاً ۱۰۰٪ باشد" : "");
      banner.classList.toggle("invalid", total !== 100);
      return total;
    };
    inputs.forEach((i) => i.addEventListener("input", updateBanner));
    updateBanner();
    box.querySelector("#savePctBtn").addEventListener("click", () => {
      const total = updateBanner();
      if (total !== 100) { Toast.show("مجموع درصدها باید ۱۰۰٪ باشد", "warning"); return; }
      const newPct = { sales: Number(inputs[0].value), warehouse: Number(inputs[1].value), finance: Number(inputs[2].value), admin: Number(inputs[3].value) };
      DataService.setCompanyPercentages(newPct);
      this.renderPctDonut(newPct);
      closeModal();
      Toast.show("تنظیمات ذخیره شد", "success");
    });
  },

  /* ---------------- Scoring Rules ---------------- */
  scoring(root) {
    const rules = DataService.getStoredScoringRules();
    root.innerHTML = `
      ${this.header()}
      <div class="card">
        <div class="row-between" style="margin-bottom:16px">
          <div class="card-desc">این قوانین نحوه محاسبه امتیاز پرسنل را تعیین می‌کنند.</div>
          <button class="btn btn-primary btn-sm" id="addRuleBtn">${icon("plus")} افزودن قانون</button>
        </div>
        <div id="rulesList">
          ${rules.map((r) => `
            <div class="rule-row">
              <div class="row-gap"><span class="badge ${r.type === "negative" ? "badge-danger" : "badge-success"}">${icon(r.type === "negative" ? "minus" : "plus")} ${r.points > 0 ? "+" : ""}${r.points}</span><span class="rule-title">${r.title}</span></div>
              <span class="text-sm text-muted">قانون فعال</span>
            </div>`).join("")}
        </div>
      </div>
    `;
    document.getElementById("addRuleBtn").addEventListener("click", () => this.openAddRule());
  },

  openAddRule() {
    const box = ModalSystem.open(`
      <div class="modal-head">
        <div class="card-title">افزودن قانون امتیازدهی</div>
        <button class="modal-close" onclick="closeModal()">${icon("xmark")}</button>
      </div>
      <div class="form-group"><label>عنوان قانون</label><input class="form-control" id="ruleTitle" placeholder="مثلاً: هر ۵ فاکتور اضافه" /></div>
      <div class="form-group"><label>مقدار امتیاز</label><input class="form-control" id="rulePoints" type="number" placeholder="مثلاً: 5 یا -3-" /></div>
      <button class="btn btn-primary btn-block" id="saveRuleBtn">ذخیره قانون</button>
    `);
    box.querySelector("#saveRuleBtn").addEventListener("click", () => {
      const title = document.getElementById("ruleTitle").value.trim();
      const points = Number(document.getElementById("rulePoints").value);
      if (!title || !points) { Toast.show("لطفاً تمام فیلدها را تکمیل کنید", "warning"); return; }
      DataService.addScoringRule({ title, points, type: points < 0 ? "negative" : "positive" });
      closeModal();
      Toast.show("قانون جدید اضافه شد", "success");
      Router.render();
    });
  },

  /* ---------------- Admin Lottery ---------------- */
  lottery(root) {
    const personnel = DataService.getPersonnel();
    root.innerHTML = `
      ${this.header()}
      <div class="grid grid-3" style="margin-bottom:20px">
        ${createKpiCard({ label: "شانس‌های فعال این دوره", value: 214, icon: "ticket", iconClass: "gold", delay: 0 })}
        ${createKpiCard({ label: "برندگان دوره قبل", value: 8, icon: "trophy", iconClass: "blue", delay: 60 })}
        ${createKpiCard({ label: "امتیاز اهدایی کل", value: 640, icon: "star", iconClass: "turquoise", delay: 120 })}
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title">شانس‌های پرسنل</div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>نام</th><th>واحد</th><th>امتیاز</th><th>تعداد شانس</th></tr></thead>
            <tbody>
              ${personnel.map((p) => `<tr><td>${p.name}</td><td>${p.dept}</td><td class="num">${fmt.num(p.score)}</td><td class="num">${Math.floor(p.score / 30)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /* ---------------- Rewards Management ---------------- */
  rewards(root) {
    const rewards = DataService.getStoredRewards();
    root.innerHTML = `
      ${this.header()}
      <div class="card">
        <div class="row-between" style="margin-bottom:16px">
          <div class="card-desc">جوایز قابل دریافت برای پرسنل را مدیریت کنید.</div>
          <button class="btn btn-primary btn-sm" id="addRewardBtn">${icon("plus")} افزودن جایزه</button>
        </div>
        <div class="grid grid-4">
          ${rewards.map((r) => `
            <div class="reward-card">
              <div class="reward-icon ${r.color || "gold"}">${icon(r.icon || "gift")}</div>
              <div class="reward-title">${r.title}</div>
              <div class="reward-subtitle">${r.subtitle}</div>
              <div class="reward-cost">${r.cost} امتیاز</div>
            </div>`).join("")}
        </div>
      </div>
    `;
    document.getElementById("addRewardBtn").addEventListener("click", () => this.openAddReward());
  },

  openAddReward() {
    const box = ModalSystem.open(`
      <div class="modal-head">
        <div class="card-title">افزودن جایزه جدید</div>
        <button class="modal-close" onclick="closeModal()">${icon("xmark")}</button>
      </div>
      <div class="form-group"><label>عنوان جایزه</label><input class="form-control" id="rewardTitle" placeholder="مثلاً: کارت هدیه فروشگاهی" /></div>
      <div class="form-group"><label>توضیح کوتاه</label><input class="form-control" id="rewardSubtitle" placeholder="مثلاً: ۳۰۰ هزار تومان" /></div>
      <div class="form-group"><label>امتیاز مورد نیاز</label><input class="form-control" id="rewardCost" type="number" placeholder="مثلاً: 60" /></div>
      <button class="btn btn-primary btn-block" id="saveRewardBtn">ذخیره جایزه</button>
    `);
    box.querySelector("#saveRewardBtn").addEventListener("click", () => {
      const title = document.getElementById("rewardTitle").value.trim();
      const subtitle = document.getElementById("rewardSubtitle").value.trim();
      const cost = Number(document.getElementById("rewardCost").value);
      if (!title || !cost) { Toast.show("لطفاً تمام فیلدها را تکمیل کنید", "warning"); return; }
      DataService.addReward({ title, subtitle, cost, icon: "gift", color: "blue" });
      closeModal();
      Toast.show("جایزه جدید اضافه شد", "success");
      Router.render();
    });
  },

  /* ---------------- Reports ---------------- */
  reports(root) {
    root.innerHTML = `
      ${this.header()}
      <div class="grid grid-2">
        <div class="card">
          <div class="card-head"><div class="card-title">گزارش فروش ماهانه</div></div>
          <p class="text-sm text-muted" style="margin-bottom:14px">خروجی کامل فروش، فاکتور و امتیازدهی پرسنل در بازه انتخابی.</p>
          <button class="btn btn-outline btn-sm" onclick="Toast.show('گزارش آماده دانلود است', 'success')">${icon("file-arrow-down")} دریافت گزارش Excel</button>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title">گزارش عملکرد پرسنل</div></div>
          <p class="text-sm text-muted" style="margin-bottom:14px">تحلیل کامل امتیاز، رتبه و رشد هر یک از پرسنل.</p>
          <button class="btn btn-outline btn-sm" onclick="Toast.show('گزارش آماده دانلود است', 'success')">${icon("file-arrow-down")} دریافت گزارش PDF</button>
        </div>
      </div>
    `;
  },

  /* ---------------- Settings ---------------- */
  settings(root) {
    root.innerHTML = `
      ${this.header()}
      <div class="card">
        <div class="card-head"><div class="card-title">تنظیمات عمومی سامانه</div></div>
        ${this.settingRow("فعال‌سازی گیمیفیکیشن قرعه‌کشی", true)}
        ${this.settingRow("نمایش رادار عملکرد به پرسنل", true)}
        ${this.settingRow("اعلان ایمیلی هفتگی مدیران", false)}
        ${this.settingRow("همگام‌سازی خودکار با CRM", true)}
      </div>
    `;
    root.querySelectorAll(".switch input").forEach((sw) => {
      sw.addEventListener("change", () => Toast.show("تنظیمات ذخیره شد", "success"));
    });
  },
  settingRow(label, checked) {
    return `
      <div class="row-between" style="padding:14px 0;border-bottom:1px solid var(--border-subtle)">
        <span class="text-sm">${label}</span>
        <label class="switch"><input type="checkbox" ${checked ? "checked" : ""} /><span class="switch-slider"></span></label>
      </div>`;
  },
};
