# NakaSetu (नाका सेतु) — Hyperlocal Labor & Service Gateway

> **Bridging the Digital Divide**: 30-minute hyperlocal on-demand skilled trades & blue-collar labor dispatch connecting modern smartphone customers with offline, feature-phone Naka workers.

[![Live Demo on Vercel](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://code-vibers-dhruv-surti-naka-setu-ten.vercel.app/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

---

## 🌐 Live Application

The production application is live and hosted on Vercel:
👉 **[https://code-vibers-dhruv-surti-naka-setu-ten.vercel.app/](https://code-vibers-dhruv-surti-naka-setu-ten.vercel.app/)**

---

## 📌 Overview

**NakaSetu** solves one of the largest unorganized sector challenges in India and emerging markets: daily labor nakas (chowks). While urban households struggle to find trusted, swift trade workers (electricians, plumbers, carpenters, daily-wage helpers), millions of informal laborers sit offline at physical street corners waiting for daily work.

NakaSetu bridges both worlds:
1. **Smartphone Customers**: Get transparent, 30-minute standard-rate bookings, real-time GPS radar tracking, verified worker credentials, and cash/UPI/escrow settlements.
2. **Offline 2G / Feature-Phone Workers**: Receive incoming bookings via **automated voice IVR calls** with interactive DTMF keypress response ("Press 1 to accept, Press 2 to decline"), SMS alerts, and cash-in-hand payouts without needing an app, mobile data, or smartphone.

---

## ✨ Core Features

- **Dual-Sided Experience**:
  - **Customer Portal**: On-demand 30-minute booking radar, category filtering (Electrician, Plumber, Carpenter, House Maid, Painter, Appliance Repair, Naka Helper / Toli), dynamic quote calculator, live tracking, and digital invoice generation.
  - **Operations & Naka Dispatch Hub**: Worker status board (`Available`, `Dispatched`, `On Job`), interactive DTMF voice IVR dispatch simulation, group/toli capacity management, and fast offline registration.
- **Inclusive 2G Voice Architecture**: Supports workers without smartphones through automated bilingual voice prompts (Hindi / English) and simulated DTMF touch-tone responses.
- **Zero Platform Lock-in**: Full transparency with standard hourly or per-task rates and zero middlemen exploitation.
- **Glassmorphic UI**: Ultra-clean, modern ocean blue interface styled with Tailwind CSS v4 and Lucide icons.

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** (v18.x, v20.x, or v22.x recommended)
- **npm** or **pnpm**

### 2. Clone & Install
```bash
git clone https://github.com/Ditrus24/CodeVibers_Dhruv-Surti_NakaSetu.git
cd CodeVibers_Dhruv-Surti_NakaSetu

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Environment Variables (Optional)
The application works immediately out-of-the-box without requiring any mandatory paid API keys. If you want to customize your environment:
```bash
cp .env.example .env
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔑 Environment Configuration

The application is deployed with zero required API keys and utilizes 100% free services:

| Variable | Description | Value / Source | Free Tier Details |
|---|---|---|---|
| `VITE_APP_URL` | Canonical Production URL | `https://code-vibers-dhruv-surti-naka-setu-ten.vercel.app` | 100% Free on Vercel |
| `VITE_MAPBOX_TOKEN` *(Optional)* | Hyperlocal maps & geocoding | [Mapbox](https://account.mapbox.com/) | 50,000 monthly map loads free |
| `VITE_TWILIO_ACCOUNT_SID` *(Optional)* | Real SMS / IVR telephony gateway | [Twilio Free Sandbox](https://www.twilio.com/try-twilio) | Free trial sandbox credits |

---

## 🌐 Hosting & Deployment Details

The project is hosted as a high-performance Single Page Application (SPA) on Vercel with automatic CI/CD:

- **Live URL**: [https://code-vibers-dhruv-surti-naka-setu-ten.vercel.app/](https://code-vibers-dhruv-surti-naka-setu-ten.vercel.app/)
- **Framework Preset**: Vite
- **Build Command**: `vite build` (or `npm run build`)
- **Output Directory**: `dist`
- **Routing Configuration**: [`vercel.json`](vercel.json) rewrites all route requests to `/index.html` to guarantee clean client-side navigation.

---

## 📂 Project Structure

```text
CodeVibers_Dhruv-Surti_NakaSetu/
├── .env                     # Local environment file (git-ignored)
├── .env.example             # Environment template with live Vercel URL
├── vercel.json              # SPA routing rewrite rule for Vercel
├── index.html               # Entry HTML shell
├── package.json             # App dependencies & npm scripts
├── vite.config.ts           # Vite bundler configuration & aliases
├── tsconfig.json            # TypeScript configuration
└── src/
    ├── main.tsx             # React DOM root entry
    ├── App.tsx              # Application layout root
    ├── index.css            # Tailwind CSS v4 styling rules
    └── NakaSetuApp.tsx      # Main application logic (Customer & Ops portals, IVR simulation)
```

---

## 🛡️ License

This project is licensed under the [Apache-2.0 License](LICENSE).
