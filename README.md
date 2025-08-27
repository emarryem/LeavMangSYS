# ED Leave Management System – Project Documentation

## Introduction

I built the **ED Leave Management System** as a modern HR tool for managing employee leaves and approvals.
The goal was to deliver a professional, enterprise-grade frontend system that feels like SaaS products such as Linear or Notion — clean, intuitive, and trustworthy.

The project covers the **full employee leave lifecycle**:

* Authentication
* Applying for leave
* Approval workflows
* Analytics and reporting

---

## Design System (UI/UX)

### Color Palette

* **Primary:** Indigo/Blue `#1E3A8A`, `#3B82F6` (trust & professionalism)
* **Secondary:** Slate/Gray `#64748B`, `#F1F5F9` (neutral balance)
* **Accent:**

  * Green `#10B981` → Approvals
  * Red `#EF4444` → Rejections

### Typography

* **Headings:** Inter / Poppins (bold)
* **Body:** Roboto / Open Sans (regular)

### Sizes

* `h1`: 2xl
* `h2`: xl
* `body`: base

### Reusable Components

* **Card** → subtle shadows, `rounded-2xl`
* **Button** → Primary / Secondary / Outline
* **Input Fields** → with validation/error states
* **Navbar + Sidebar** → responsive & collapsible
* **Modal** → for approvals/rejections
* **Charts** → Pie/Bar from Recharts

---

## Frontend Pages

### 1. Authentication

* **Login Page:** split-screen (illustration left + form right)
* **Register Page:** name, email, department, password + strength indicator

### 2. Welcome Page

* “Welcome, \[UserName]
* Quick stats → leave balance, pending requests
* CTA → “Go to Dashboard”

### 3. Dashboard

* Navbar (Logo + User Menu) + Sidebar (Dashboard, Apply Leave, My Requests, Profile, Analytics)
* Cards: Remaining Annual Leave, Pending Requests, Approved Requests
* Floating “Apply Leave” button

### 4. Apply Leave

* Dynamic form (fields depend on leave type)
* Inline validation (e.g., Annual Leave → max 21 days/year)
* Date pickers + file upload for medical certificates
* Preview before submission

### 5. My Requests

* Table with Type, Dates, Duration, Status
* Color-coded status: Pending (Yellow), Approved (Green), Rejected (Red)
* Pagination + search

### 6. Admin Panel (HR/Manager)

* Filterable table of all requests
* Approve / Reject actions (single or bulk)
* Toast notifications (later → email integration)

### 7. Profile

* User details card
* Remaining leave balance
* Option to update profile

### 8. Analytics

* HR/Admin only
* **Pie Chart:** Absence ratios per user per year
* **Bar Chart:** Department-level comparisons
* Export options → PDF/Excel

---

##  Tech Stack

* **React + Vite** → fast development & builds
* **Tailwind CSS** → utility-first styling
* **Recharts** → charts & analytics
* **React Router** → navigation
* **React Context API** → state management (auth & leaves)
* **React Hook Form** → form handling
* **Lucide Icons** + **shadcn/ui** → UI components
* **Mock Backend (localStorage)** → simulating real API

---

## Development Process & Challenges

### 1. Authentication & Role Management

* **Challenge:** Securing pages based on user roles (Employee, Manager, HR).
* **Solution:** Implemented `AuthContext` to store roles + protect routes with `PrivateRoute`.

### 2. Dynamic Leave Validation

* **Challenge:** Each leave type had different rules (Annual = 21 days, Sick = 3 days, etc.).
* **Solution:** Created a central `LeaveContext` with business rules applied dynamically in forms.

### 3. Analytics & Visualization

* **Challenge:** Making HR-friendly reports (ratios & department-level).
* **Solution:** Used **Recharts** (Pie + Bar) with filters per user/department.

### 4. UI/UX Consistency

* **Challenge:** Maintaining consistent professional design.
* **Solution:** Built a **design system** (colors, typography, reusable components) and applied it across pages.

### 5. Dependency Issues

* Faced **`@swc/core` compatibility problem** with Node.js v24.
* **Fix:** Downgraded to a stable version `@swc/core@1.3.96`.
* Also prepared a fallback plan → use Node.js v20 LTS if errors persist.
