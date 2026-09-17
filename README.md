# AL FIDA HUSSAIN PUBLIC SCHOOLS - School Management System

A complete, professional School Management System built with **HTML5, CSS3, and Vanilla JavaScript**. Uses LocalStorage for persistent demo data. No backend required.

**School:** AL FIDA HUSSAIN PUBLIC SCHOOLS  
**Tagline:** Quality Education, Bright Future  
**WhatsApp:** 03168122916 (International: 923168122916)

---

## How to Run

1. Open the `school-management-system` folder
2. Double-click **`index.html`** to open the public website in your browser
3. Or open **`login.html`** to go directly to the login portal

No server, installation, or build step is required. Works offline after first load (CDN icons/fonts need internet on first visit).

---

## Login Credentials (Demo)

| Role        | Username     | Password        |
|-------------|--------------|-----------------|
| Super Admin | `admin`      | `admin123`      |
| Teacher     | `teacher`    | `teacher123`    |
| Accountant  | `accountant` | `accountant123` |
| Parent      | `parent`     | `parent123`     |
| Student     | `student`    | `student123`    |

After login you are redirected to the correct dashboard for your role.

---

## File Structure

```
school-management-system/
├── index.html          # Public school website
├── login.html          # Login page
├── admin.html          # Super Admin dashboard
├── teacher.html        # Teacher portal
├── parent.html         # Parent portal
├── student.html        # Student portal
├── accountant.html     # Accountant portal
├── css/
│   ├── style.css       # Main styles (public + shared)
│   ├── dashboard.css   # Dashboard/sidebar styles
│   └── responsive.css  # Mobile responsive
├── js/
│   ├── database.js     # LocalStorage database + demo data
│   ├── auth.js         # Authentication
│   ├── app.js          # Common utilities (toast, WhatsApp, theme...)
│   ├── students.js     # Student CRUD
│   ├── teachers.js     # Teacher management
│   ├── parents.js      # Parent management
│   ├── attendance.js   # Attendance system
│   ├── fees.js         # Fee management + receipts
│   ├── exams.js        # Exam management
│   ├── results.js      # Marks & results
│   ├── timetable.js    # Timetable
│   ├── homework.js     # Homework
│   ├── admissions.js   # Online admissions
│   ├── whatsapp.js     # WhatsApp contacts & bulk messaging
│   ├── reports.js      # CSV reports
│   ├── settings.js     # School settings
│   ├── notifications.js# Notification center
│   └── admin-app.js    # Admin dashboard logic
├── assets/
│   └── logo.png        # School logo (replace with your own if needed)
└── README.md
```

---

## Features

### Public Website
- Home, About, Academics, Admissions, Teachers, Facilities, Events, Contact
- Floating WhatsApp button → `https://wa.me/923168122916`
- Responsive design

### Admin Dashboard
- Statistics cards (students, teachers, attendance, fees, admissions)
- Charts (students by class, attendance, fee collection)
- Full CRUD for Students, Parents, Teachers
- Attendance marking with Present/Absent/Leave/Late
- Fee management, receipts, defaulters list
- WhatsApp contact sheet + bulk WhatsApp message links
- Exams, Results, Timetable, Homework
- Admissions workflow (New → Review → Approved → Enrolled)
- Notices, Events, Library, Transport, Payroll
- ID Card & Certificate generators (printable)
- Reports with CSV export
- Notifications center
- Settings (school name, WhatsApp, theme)
- Dark/Light mode
- Global search

### Other Portals
- **Teacher:** Mark attendance, homework, view students/timetable
- **Parent:** View children, attendance, fees, results, homework, notices
- **Student:** Profile, attendance %, results, homework, timetable
- **Accountant:** Fees, payments, receipts, defaulters, payroll, reports

---

## Replace Logo

Replace the file:

```
assets/logo.png
```

with your own school logo (recommended: square PNG, transparent background). The system already uses this path everywhere.

---

## How LocalStorage Works

All data is stored in the browser's LocalStorage under keys such as:

- `school_students`, `school_parents`, `school_teachers`
- `school_fees`, `school_attendance`, `school_exams`, `school_results`
- `school_settings`, `school_users`, `school_notifications`
- etc.

Data persists until you clear browser data or click **Reset Demo Data** in Settings.

### Reset Demo Data

1. Login as Admin
2. Go to **Settings**
3. Click **Reset Demo Data**

This clears all LocalStorage school data and reloads the original demo dataset (20 students, 10 parents, 8 teachers, fees, attendance, etc.).

---

## Change School WhatsApp Number

1. Login as Admin → **Settings**
2. Update the **WhatsApp** field (e.g. `03168122916`)
3. Save

The system automatically converts local numbers (starting with 0) to international format (`923168122916`) for WhatsApp links.

---

## WhatsApp Integration

- No automatic sending API is used (safe & policy-compliant)
- Clicking any WhatsApp button opens `https://wa.me/NUMBER?text=...` with a pre-filled message
- Available for: school contact, parents, teachers, fee reminders, absent students, admissions, bulk lists

---

## Security Notes (Important)

This is a **frontend-only demo**. Authentication and data are stored in the browser.

- Suitable for local demos, training, and offline presentations
- **Not suitable for production** with real student data without a secure backend
- For production, connect to a real backend (Node.js, PHP, Firebase, Supabase, etc.) with proper authentication, HTTPS, and a database

---

## Connecting a Future Backend

The JavaScript is modular. To connect a real backend later:

1. Replace functions in `database.js` (`loadData`, `saveData`, `addRecord`, etc.) with API calls (`fetch` / axios)
2. Keep the same function signatures so the rest of the UI continues to work
3. Move authentication to server-side sessions / JWT
4. Optionally integrate WhatsApp Business API, SMS gateway, online payments, etc.

---

## Browser Support

Works on modern browsers: Chrome, Firefox, Edge, Safari (desktop & mobile).

---

## License

Created for AL FIDA HUSSAIN PUBLIC SCHOOLS. Demo / educational use.
