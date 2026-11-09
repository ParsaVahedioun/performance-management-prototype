# سامانه هوشمند مدیریت عملکرد — نسخه نمایشی (Prototype)

یک Prototype/MVP کاملاً Presentation-Ready برای یک سامانه سازمانی مدیریت عملکرد، فروش، امتیازدهی و گیمیفیکیشن پرسنل. این نسخه صرفاً Frontend است و هیچ Backend، Database یا API واقعی ندارد.

## معرفی پروژه (Project Overview)

این پروژه یک داشبورد سازمانی چندنقشی (Employee / Admin / Developer) است که تجربه‌ای شبیه یک نرم‌افزار SaaS مدرن ارائه می‌دهد:

- پایش عملکرد فردی و سازمانی با KPI، نمودار و Progress Ring
- سیستم گیمیفیکیشن شامل امتیازدهی، رتبه‌بندی (Rank Roadmap) و قرعه‌کشی
- داشبورد مدیریتی با تحلیل فروش، عملکرد واحدها و مدیریت پرسنل
- Developer Control Center برای پایش فنی سیستم (Mock CRM، Audit Log، Feature Flags)

تمام داده‌ها Mock هستند و در `js/data.js` نگه‌داری می‌شوند.

## نحوه اجرا (How to Run)

هیچ Build Step یا نصب وابستگی لازم نیست. کافی است فایل `index.html` را مستقیماً در مرورگر (ترجیحاً Chrome) باز کنید.

> توجه: اتصال اینترنت برای بارگذاری فونت Vazirmatn، آیکون‌های Font Awesome و کتابخانه Chart.js از CDN لازم است.

## حساب‌های نمایشی (Demo Accounts)

| نقش | نام کاربری | رمز عبور |
|---|---|---|
| مدیر سیستم (Admin) | `Admin` | `admin1234` |
| توسعه‌دهنده (Developer) | `dev` | `dev-dev123` |
| کارمند نمونه ۱ (فروش) | `employee` | `123456` |
| کارمند نمونه ۲ (فروش) | `sales01` | `123456` |
| کارمند نمونه (انبار) | `warehouse` | `123456` |
| کارمند نمونه (مالی) | `finance` | `123456` |

این اطلاعات صرفاً برای این Prototype هستند و هیچ Security واقعی پشت آن‌ها نیست.

## ساختار پروژه (Folder Structure)

```
/project
  index.html
  /css
    style.css          → Design System اصلی (رنگ، تایپوگرافی، کامپوننت‌ها)
    responsive.css      → قوانین Responsive برای Tablet/Mobile
  /js
    data.js             → Mock Data + Data Service (لایه واسط داده)
    charts.js           → مدیریت نمودارهای Chart.js (هماهنگ با Theme)
    auth.js             → منطق ورود/خروج نمایشی (بدون Security واقعی)
    employee.js          → صفحات نقش Employee
    admin.js             → صفحات نقش Admin
    developer.js          → صفحات نقش Developer
    app.js               → Router، Shell (Sidebar/Topbar)، Toast، Modal، Theme
  README.md
```

## امکانات کلیدی (Features)

- **ورود نمایشی**: انتخاب نقش بر اساس نام کاربری (Admin / dev / employee)
- **داشبورد کارمند**: KPI، نمودار فروش تعاملی، Radar عملکرد، پیشرفت شرکت، مسیر رتبه‌ها، قرعه‌کشی
- **داشبورد مدیریت**: KPI سازمانی، روند فروش، توزیع عملکرد، جدول پرسنل با Search/Filter/Sort
- **گیمیفیکیشن**: Rank Roadmap با ۱۴ رتبه، سیستم قرعه‌کشی با Animation، مدیریت جوایز
- **Developer Control Center**: Mock CRM، Audit Logs، System Logs، Feature Flags
- **UX سازمانی کامل**: Dark/Light Mode با ذخیره در LocalStorage، Responsive کامل، Toast، Modal، Skeleton/Empty/Error State، Number Counter Animation

## داده‌های Mock (Mock Data)

تمام داده‌ها در `js/data.js` به صورت یک شیء `MockDB` تعریف شده و از طریق `DataService` (لایه واسط) در دسترس UI قرار می‌گیرند. تغییرات کاربر (درصد واحدها، قوانین امتیازدهی، جوایز، Feature Flags، Session ورود) در `localStorage` مرورگر ذخیره می‌شوند تا با Refresh از بین نروند.

## اتصال به Backend واقعی در آینده (Future Backend Integration)

معماری پروژه به گونه‌ای طراحی شده که UI هیچ وابستگی مستقیمی به منبع داده ندارد؛ تمام دسترسی‌ها از طریق `DataService` در `js/data.js` انجام می‌شود. برای اتصال به یک Backend واقعی کافی است:

1. متدهای `DataService` (مثل `getEmployee()`, `getPersonnel()`, `findUser()`) را به‌جای خواندن از `MockDB`، به `fetch` سمت API متصل کنید.
2. توابع را به `async/await` تبدیل کرده و در صفحات (`employee.js`, `admin.js`, `developer.js`) حالت Loading (Skeleton موجود در `createSkeletonCards`) را نمایش دهید.
3. `Auth.login()` را به یک Endpoint احراز هویت واقعی (JWT/Session) متصل کنید.

### نقطه اتصال CRM (CRM Integration Point)

صفحه Mock CRM (`#dev-crm`) و متد `DataService.getMockCRM()` نقطه شبیه‌سازی‌شده‌ای برای اتصال به CRM واقعی هستند؛ در نسخه نهایی، دکمه «همگام‌سازی اطلاعات» باید به یک Endpoint Sync واقعی متصل شود.

## راهنمای ارائه به مدیریت (Presentation Guide)

برای نمایش کامل قابلیت‌های سیستم به مدیریت، مسیر زیر پیشنهاد می‌شود:

1. **صفحه ورود**: به Login اشاره کنید — طراحی حرفه‌ای، تصویر برند سمت راست، Badge نسخه نمایشی.
2. **ورود به‌عنوان Employee** (`employee` / `123456`): نمایش داشبورد کارمند — KPIهای انیمیشن‌دار، نمودار فروش تعاملی (تغییر بازه زمانی)، Radar عملکرد، مسیر رتبه‌ها (Roadmap).
3. **قرعه‌کشی**: روی دکمه «ورود به قرعه‌کشی» کلیک کرده و Animation و نتیجه Mock را نمایش دهید.
4. **پرونده دیجیتال و پروفایل**: مسیر `پروفایل` را نشان دهید.
5. **خروج و ورود به‌عنوان Admin** (`Admin` / `admin1234`): داشبورد مدیریت، جدول پرسنل با Search/Filter، صفحه «سهم واحدها» و دمو ویرایش درصد (با Validation مجموع ۱۰۰٪)، افزودن قانون امتیازدهی جدید.
6. **خروج و ورود به‌عنوان Developer** (`dev` / `dev-dev123`): Control Center، Mock CRM و دکمه «همگام‌سازی»، Feature Flags.
7. **حالت تاریک**: روی آیکون ماه در Topbar کلیک کرده و تغییر Theme را نمایش دهید.
8. **موبایل**: عرض مرورگر را کوچک کرده و Sidebar Drawer و طراحی Responsive را نشان دهید.

---
سامانه هوشمند مدیریت عملکرد · نسخه نمایشی ۱.۰ · © ۲۰۲۶
