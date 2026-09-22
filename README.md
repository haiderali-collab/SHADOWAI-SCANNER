# 🛡️ Shadow AI & Vendor Risk Scanner — Phase 1 MVP

> A modern full-stack cybersecurity dashboard tool for IT and security teams to track third-party software, discover unsanctioned Generative AI tools ("Shadow AI"), and calculate real-time vendor risk scores.

---

## 🌟 Key Features

### 1. 🔐 JWT Authentication & Access Control
- Secure login and registration with **bcrypt** password hashing.
- Single-tenant admin role with protected dashboard routes.
- Pre-configured demo credentials auto-fill button for fast testing.

### 2. 🤖 Third-Party Vendor & Generative AI Governance
- Add, edit, and delete software tools and generative AI assistants.
- Track key risk parameters:
  - **Category**: Generative AI Tool, SaaS Vendor, Cloud Provider, Developer Tool, Marketing, Security.
  - **Data Sensitivity Level**: Low, Medium, High.
  - **Compliance Certifications**: SOC2, GDPR, ISO27001.
  - **Known Data Breach History**: Yes / No.
  - **Approved by IT**: Yes (Sanctioned) / No (**Shadow AI / Unapproved**).

### 3. ⚖️ Dynamic Risk Scoring Engine (0-100 Scale)
Automatically computes vendor risk score using weighted parameters:
- **Data Sensitivity**: High (+35 pts), Medium (+20 pts), Low (+5 pts)
- **Compliance Certification**: No cert (+25 pts), Certified (+0 pts)
- **Breach History**: Incident reported (+25 pts), Clean history (+0 pts)
- **IT Approval / Shadow AI**: Unapproved (+15 pts)
- **Compound Penalty**: Unapproved tool handling High Data Sensitivity (+10 pts extra)
- **Risk Rating Badges**:
  - `0 - 29`: 🟢 **Low Risk**
  - `30 - 64`: 🟡 **Medium Risk**
  - `65 - 100`: 🔴 **High Risk**
  - `Unapproved`: 🟣 **SHADOW AI / UNAPPROVED** pulse badge.

### 4. 📊 Dashboard Analytics & Visualizations
- KPI Stat Cards: Total Vendors, Shadow Tools Count, High Risk Count, SOC2 Compliance Rate %.
- **Recharts Visualizations**:
  - **Pie Chart**: Risk Distribution Breakdown (High / Medium / Low).
  - **Bar Chart**: Category Breakdown comparing Approved vs Shadow tools.
- Real-time search, multi-column sorting, and multi-criteria filtering.

### 5. 📁 Bulk Import & Reports
- **Bulk CSV Import**: Drag & drop CSV files or paste CSV text with auto-download sample template.
- **CSV Export**: Instant download of complete risk registry.
- **Printable Executive PDF Audit View**: CISO-ready compliance report layout.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios, React Router v6
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer
- **Database**: SQLite (`better-sqlite3`) — self-contained, no external database server installation required. Auto-initializes and auto-seeds sample data on first launch!

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Single Command Setup & Startup

1. **Install All Dependencies (Root, Server, Client)**:
   ```bash
   npm run setup
   ```

2. **Start Both Backend API and Frontend Dev Server**:
   ```bash
   npm run dev
   ```

   This will launch:
   - **Backend API**: `http://localhost:5000`
   - **Frontend App**: `http://localhost:3000`

---

## 🔑 Default Admin Credentials

The SQLite database automatically initializes on first run with 10 realistic sample vendors and an initial admin account:

- **Email**: `admin@organization.com`
- **Password**: `admin123`

*(You can also click the **"Auto-fill Demo Admin Credentials"** button on the Login page).*

---

## 🌐 Deployment Instructions

### Option 1: Monolithic Single-Service Deployment (Render / Railway / Heroku)
1. Build the frontend: `npm run build`
2. The Express server (`server/src/index.js`) automatically serves static files from `client/dist`.
3. Set environment variable: `JWT_SECRET=your_production_secret_key`.

### Option 2: Split Deployment (Vercel Frontend + Render Backend)
- **Frontend (Vercel)**: Connect `client/` folder. Configure `rewrite` rule or environment variable for API URL.
- **Backend (Render / Railway)**: Connect `server/` folder. Set `JWT_SECRET` in environment variables.

---

## 📄 License
MIT License. Created for IT & Cybersecurity Governance.
