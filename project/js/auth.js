/* ==========================================================================
   Auth (Mock)
   بدون هیچ Security واقعی - فقط برای شبیه‌سازی تجربه ورود
   ========================================================================== */
const Auth = {
  sessionKey: "session",

  getSession() { return Storage.get(this.sessionKey); },

  login(username, password) {
    const user = DataService.findUser(username, password);
    if (!user) return null;
    const session = {
      username: user.username,
      role: user.role,
      name: user.name,
      avatar: user.avatar,
      employeeId: user.employeeId || null,
    };
    Storage.set(this.sessionKey, session);
    return session;
  },

  logout() {
    Storage.remove(this.sessionKey);
    document.getElementById("app").innerHTML = "";
    location.hash = "";
    Router.render();
    Toast.show("با موفقیت از حساب خارج شدید", "success");
  },
};

const AuthUI = {
  loginTemplate() {
    return `
      <div class="login-shell">
        <div class="login-visual">
          <svg class="orbit-svg" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
            <circle cx="480" cy="140" r="230" fill="none" stroke="rgba(201,162,39,0.18)" stroke-width="1"/>
            <circle cx="480" cy="140" r="170" fill="none" stroke="rgba(47,111,237,0.18)" stroke-width="1"/>
            <polyline points="60,620 150,560 230,600 320,480 410,520 500,380" fill="none" stroke="rgba(201,162,39,0.6)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="500" cy="380" r="6" fill="#d9b94a"/>
            <circle cx="410" cy="520" r="5" fill="#5b8ef2"/>
            <circle cx="320" cy="480" r="5" fill="#5b8ef2"/>
            <circle cx="230" cy="600" r="5" fill="#1cb3aa"/>
            <g opacity="0.5">
              <rect x="60" y="660" width="18" height="60" rx="3" fill="#d9b94a"/>
              <rect x="90" y="630" width="18" height="90" rx="3" fill="#5b8ef2"/>
              <rect x="120" y="600" width="18" height="120" rx="3" fill="#1cb3aa"/>
              <rect x="150" y="645" width="18" height="75" rx="3" fill="#d9b94a"/>
            </g>
          </svg>
          <div class="brand-row">
            <div class="brand-mark">SP</div>
            <div class="brand-text">
              <div class="brand-title" style="color:#fff">سامانه هوشمند مدیریت عملکرد</div>
            </div>
          </div>
          <div class="visual-copy">
            <h2>عملکرد، فروش و رشد تیم در یک نگاه</h2>
            <p>پایش لحظه‌ای شاخص‌های فروش، امتیازدهی هوشمند پرسنل و مسیر پیشرفت شغلی، در یک بستر یکپارچه و مدرن سازمانی.</p>
          </div>
          <div class="visual-foot">© ۱۴۰۵ — سامانه هوشمند مدیریت عملکرد · نسخه نمایشی</div>
        </div>

        <div class="login-panel">
          <div class="login-form-card">
            <h1>ورود به سامانه</h1>
            <p class="lead">اطلاعات کاربری خود را وارد کنید</p>

            <div class="login-error" id="loginError">${icon("circle-exclamation")}<span>نام کاربری یا رمز عبور اشتباه است</span></div>

            <form id="loginForm">
              <div class="form-group">
                <label>نام کاربری</label>
                <input class="form-control" type="text" id="loginUsername" placeholder="نام کاربری خود را وارد کنید" autocomplete="username" required />
              </div>
              <div class="form-group">
                <label>رمز عبور</label>
                <input class="form-control" type="password" id="loginPassword" placeholder="••••••••" autocomplete="current-password" required />
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg" id="loginSubmitBtn">ورود به سامانه</button>
            </form>

            <div class="demo-accounts">
              <div class="demo-title">${icon("flask")} حساب‌های نمایشی <span class="badge badge-neutral" style="margin-right:auto">DEMO</span></div>
              <div class="demo-account-row" data-user="Admin" data-pass="admin1234">
                <span class="who">${icon("user-shield")} مدیر سیستم</span>
                <span class="cred">Admin / admin1234</span>
              </div>
              <div class="demo-account-row" data-user="dev" data-pass="dev-dev123">
                <span class="who">${icon("code")} توسعه‌دهنده</span>
                <span class="cred">dev / dev-dev123</span>
              </div>
              <div class="demo-account-row" data-user="employee" data-pass="123456">
                <span class="who">${icon("user")} کارمند نمونه</span>
                <span class="cred">employee / 123456</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  },

  bindEvents() {
    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("loginError");

    document.querySelectorAll(".demo-account-row").forEach((row) => {
      row.addEventListener("click", () => {
        document.getElementById("loginUsername").value = row.getAttribute("data-user");
        document.getElementById("loginPassword").value = row.getAttribute("data-pass");
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      const btn = document.getElementById("loginSubmitBtn");
      btn.disabled = true;
      btn.innerHTML = `${icon("spinner", "spin")} در حال ورود...`;

      setTimeout(() => {
        const session = Auth.login(username, password);
        if (session) {
          errorBox.classList.remove("show");
          Router.goDefault();
          Router.render();
        } else {
          errorBox.classList.add("show");
          btn.disabled = false;
          btn.innerHTML = "ورود به سامانه";
        }
      }, 500);
    });
  },
};
