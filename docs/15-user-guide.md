# 20. User Guide

End-user documentation for the four TenaLink portals. Screenshots are not included in the repository — placeholders marked below.

---

## Getting Started

### Access the application

1. Open the application URL (development: http://localhost:5173)
2. You will see the **Login** page

> 📷 *Screenshot placeholder: Login page with email/Fayda ID and password fields*

### Logging in

1. Enter your **email** or **Fayda ID**
2. Enter your **password**
3. Click **Sign In**
4. You are redirected to your role-specific dashboard

### Registration

A **Register** page exists at `/register`. It currently stores accounts locally in the browser only and **does not create a backend account**. For demo access, use credentials provided by your administrator or the seed data in the Developer Guide.

**Needs developer input** — intended production registration flow.

---

## Patient Portal (`/patient`)

### Dashboard

- Overview of upcoming appointments and recent medical activity
- Quick links to book appointments and view history

> 📷 *Screenshot placeholder: Patient dashboard*

### Book an appointment

1. Go to **Hospitals** (or use "Book Appointment" from dashboard)
2. Browse available hospitals
3. Select a hospital to view doctors
4. Choose a doctor → **Book Appointment**
5. Enter date, time, and reason for visit
6. Submit the request

Your appointment is created with status **Scheduled** in the system.

### View appointments

1. Navigate to **Appointments**
2. View all appointments with status filters
3. Click an appointment for details (doctor, hospital, date, reason)

**Note:** Status labels in the UI (Pending, Confirmed) may not match backend statuses.

### Medical history

1. Open **Medical History** from the sidebar
2. Tabs available:
   - **Timeline** — chronological medical events
   - **Prescriptions** — prescribed medications
   - **Labs** — lab-related events
   - **Documents** — uploaded/document events
3. Use search and filters within the timeline view

### Profile

1. Go to **Profile**
2. View personal and health information (blood type, allergies, conditions)
3. Edit and save profile changes

**Note:** Profile update may fail if backend method mismatch (`PUT` vs `POST`) is not resolved.

---

## Doctor Portal (`/doctor`)

### Dashboard

- Summary of appointments and patient activity

### Patients

1. Open **Patients**
2. View patients from your appointments
3. Click a patient for summary, timeline, add event, or prescribe

### Appointment requests

1. Open **Appointments**
2. Review pending requests

**Current limitation:** Approve/Reject buttons do not update the backend. **Needs developer input** on expected workflow.

### Add medical event

1. From a patient, choose **Add Event**
2. Select event type (visit, lab, etc.)
3. Complete the form
4. Submit — event appears on patient timeline

### Prescriptions

1. From patient context, **Prescribe** medication
2. Or view all prescriptions under **Prescriptions** menu item (if in sidebar — route exists at `/doctor/prescriptions`)

---

## Hospital Admin Portal (`/admin`)

### Dashboard

- Platform user statistics
- Appointment overview counts
- Recent audit activity

### Doctors

- Search and view all registered doctors on the platform

### Patients

- View all registered patients

### Appointments

- Table of all appointments across the platform

### Audit logs

- Review system audit entries

### Settings

- View system configuration entries (read-only in UI)

### Hospitals (routed, not in sidebar)

- Shows **static mock hospital data** — not connected to live API

---

## Super Admin Portal (`/super-admin`)

### Dashboard

- User statistics by role
- Recent audit activity

### Hospitals

1. View all hospitals with facility details
2. **Add Hospital** — create new facility
3. **Delete** — remove hospital
4. Edit button is visible but **not functional**

### Hospital Admins

- List users with admin role

### Audit logs

- Full paginated audit log viewer

### Platform

- Manage system configuration key-value pairs
- Create, edit, delete config entries

---

## Logging out

Click **Logout** in the sidebar footer. You are returned to the login page and your session token is cleared from the browser.

---

## Role summary

| If you are a… | You can… |
|---------------|----------|
| Patient | Book appointments, view your history and profile |
| Doctor | Manage your patients, add medical events, prescribe |
| Hospital Admin | View platform-wide doctors, patients, appointments, audit |
| Super Admin | Manage hospitals, admins, platform config, global audit |

---

## Getting help

`ContactSupportPage.jsx` exists but is **not linked** in navigation.

**Needs developer input** — support contact and escalation process.
