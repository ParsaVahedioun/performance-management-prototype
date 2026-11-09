/* ==========================================================================
   Charts Manager
   لایه واسط روی Chart.js برای هماهنگی رنگ با Theme و مدیریت نمونه‌ها
   ========================================================================== */
const ChartsManager = {
  instances: {},

  palette() {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    return {
      grid: dark ? "rgba(255,255,255,0.06)" : "rgba(15,27,45,0.06)",
      text: dark ? "#a7b1c6" : "#5b6478",
      gold: "#c9a227",
      blue: "#2f6fed",
      turquoise: "#12968f",
      navy: dark ? "#5b8ef2" : "#0f1b2d",
      success: "#1e9e6b",
      warning: "#d68a1b",
      danger: "#e5484d",
      surface: dark ? "#101c30" : "#ffffff",
    };
  },

  baseFont() {
    return { family: "Vazirmatn", size: 11 };
  },

  destroy(id) {
    if (this.instances[id]) { this.instances[id].destroy(); delete this.instances[id]; }
  },

  register(id, chart) { this.instances[id] = chart; },

  refreshTheme() {
    // re-render current page to rebuild charts with new theme colors
    Router.render();
  },

  lineChart(canvasId, { labels, datasets }) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const p = this.palette();
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: datasets.map((d, i) => ({
          label: d.label,
          data: d.data,
          borderColor: d.color,
          backgroundColor: d.color + "22",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: d.color,
          pointBorderColor: p.surface,
          pointBorderWidth: 2,
          borderWidth: 2.5,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: datasets.length > 1, rtl: true, labels: { color: p.text, font: this.baseFont(), usePointStyle: true, boxWidth: 8 } },
          tooltip: {
            rtl: true, textDirection: "rtl",
            backgroundColor: p.surface, titleColor: p.text, bodyColor: p.text,
            borderColor: p.grid, borderWidth: 1, padding: 10, titleFont: this.baseFont(), bodyFont: this.baseFont(),
          },
        },
        scales: {
          x: { grid: { color: p.grid, display: false }, ticks: { color: p.text, font: this.baseFont() } },
          y: { grid: { color: p.grid }, ticks: { color: p.text, font: this.baseFont() } },
        },
      },
    });
    this.register(canvasId, chart);
    return chart;
  },

  barChart(canvasId, { labels, data, color }) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const p = this.palette();
    const chart = new Chart(ctx, {
      type: "bar",
      data: { labels, datasets: [{ data, backgroundColor: color || p.blue, borderRadius: 6, maxBarThickness: 34 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { rtl: true, backgroundColor: p.surface, titleColor: p.text, bodyColor: p.text, borderColor: p.grid, borderWidth: 1, padding: 10, titleFont: this.baseFont(), bodyFont: this.baseFont() },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: p.text, font: this.baseFont() } },
          y: { grid: { color: p.grid }, ticks: { color: p.text, font: this.baseFont() } },
        },
      },
    });
    this.register(canvasId, chart);
    return chart;
  },

  radarChart(canvasId, { labels, data, color }) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const p = this.palette();
    const chart = new Chart(ctx, {
      type: "radar",
      data: { labels, datasets: [{ data, borderColor: color || p.gold, backgroundColor: (color || p.gold) + "33", pointBackgroundColor: color || p.gold, borderWidth: 2 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { rtl: true, backgroundColor: p.surface, titleColor: p.text, bodyColor: p.text, titleFont: this.baseFont(), bodyFont: this.baseFont() } },
        scales: {
          r: {
            angleLines: { color: p.grid }, grid: { color: p.grid },
            pointLabels: { color: p.text, font: this.baseFont() },
            ticks: { display: false, backdropColor: "transparent" },
            suggestedMin: 0, suggestedMax: 100,
          },
        },
      },
    });
    this.register(canvasId, chart);
    return chart;
  },

  donutChart(canvasId, { labels, data, colors }) {
    this.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const p = this.palette();
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 3, borderColor: p.surface }] },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: { rtl: true, backgroundColor: p.surface, titleColor: p.text, bodyColor: p.text, titleFont: this.baseFont(), bodyFont: this.baseFont() },
        },
      },
    });
    this.register(canvasId, chart);
    return chart;
  },
};
