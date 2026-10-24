# NakaSetu (नाका सेतु) — Hyperlocal Labor & Service Gateway

> **Bridging the Digital Divide**: 30-minute hyperlocal on-demand skilled trades & blue-collar labor dispatch connecting modern smartphone customers with offline, feature-phone Naka workers.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Deploy on Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

---

## 📌 Overview

**NakaSetu** solves one of the largest unorganized sector challenges in India and emerging markets: daily labor nakas (chowks). While urban households struggle to find trusted, swift trade workers (electricians, plumbers, carpenters, daily-wage helpers), millions of informal laborers sit offline at physical street corners waiting for daily work.

NakaSetu bridges both worlds:
1. **Smartphone Customers**: Get transparent, 30-minute standard-rate bookings, real-time GPS tracking, and cash/UPI/escrow settlements.
2. **Offline 2G / Feature-Phone Workers**: Receive incoming bookings via **automated voice IVR calls** with interactive DTMF keypress response ("Press 1 to accept, Press 2 to decline"), SMS alerts, and cash-in-hand payouts without needing an app or mobile data.

---

## ✨ Core Features

- **Dual-Sided Experience**:
  - **Customer Portal**: On-demand 30-minute booking radar, category filtering (Electrician, Plumber, Carpenter, House Maid, Painter, Appliance Repair, Naka Helper / Toli), dynamic quote calculator, live tracking, and digital invoice generation.
  - **Operations & Naka Dispatch Hub**: Worker status board (`Available`, `Dispatched`, `On Job`), interactive DTMF voice IVR dispatch simulation, group/toli assignment, and fast offline registration.
- **Inclusive 2G Voice Architecture**: Supports workers without smartphones through automated bilingual voice prompts (Hindi / English).
- **Zero Platform Lock-in**: Full transparency with transparent pricing per task or hourly unit.
- **Glassmorphic UI**: Ultra-clean, modern ocean blue interface designed with Tailwind CSS v4 and Lucide icons.

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** (v18.x, v20.x, or v22.x recommended)
- **npm** or **pnpm**

### 2. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/CodeVibers_Dhruv-Surti_NakaSetu.git
cd CodeVibers_Dhruv-Surti_NakaSetu

# Install dependencies (use --legacy-peer-deps if needed)
npm install --legacy-peer-deps
```

### 3. Environment Variables
Create your local `.env` file from the example template:
```bash
cp .env.example .env
```
Fill in your keys in `.env` (see below for completely free key providers).

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

## 🔑 Environment Variables & 100% Free Keys

The project requires **zero paid services** to run. All third-party providers listed below have permanently free tiers (no credit card required):

| Variable | Description | Where to Get Free Key | Free Tier Limit |
|---|---|---|---|
| `VITE_GEMINI_API_KEY` | Google Gemini AI for smart dispatch & job summaries | [Google AI Studio](https://aistudio.google.com/app/apikey) | **10-15 RPM permanently free** (No card required) |
| `VITE_APP_URL` | Public base URL of your deployed application | Assigned by Vercel/Render (e.g. `https://nakasetu.vercel.app`) | Free |
| `VITE_MAPBOX_TOKEN` *(Optional)* | Hyperlocal maps & geocoding | [Mapbox](https://account.mapbox.com/) | **50,000 monthly map loads free** |
| `VITE_TWILIO_ACCOUNT_SID` *(Optional)* | SMS / IVR voice simulation | [Twilio Free Trial](https://www.twilio.com/try-twilio) | Free trial sandbox credits |

---

## 🌐 Deployment Guide (Hosting on Free Tiers)

### Option A: Deploy on Vercel (Recommended - Instant & Free)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete NakaSetu app and deployment setup"
   git push origin main
   ```
2. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New..."** > **"Project"** and select your repository.
4. Vercel will auto-detect Vite:
   - **Framework Preset**: `Vite`
   - **Build Command**: `vite build` (or `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`
5. Open **Environment Variables** and add:
   - `VITE_GEMINI_API_KEY`: *(Your key from Google AI Studio)*
   - `VITE_APP_URL`: `https://<your-project>.vercel.app`
6. Click **Deploy**. Your app will be live within seconds!

> [!NOTE]
> A `vercel.json` rewrite file is already configured in this repository to handle client-side Single Page Application (SPA) routing cleanly.

---

### Option B: Deploy on Render (Free Static Site)

1. Log in to [Render](https://render.com).
2. Click **"New +"** and choose **"Static Site"**.
3. Connect your GitHub repository.
4. Configure the settings:
   - **Name**: `nakasetu`
   - **Branch**: `main`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Publish Directory**: `dist`
5. Under **Advanced** > **Environment Variables**, add:
   - `VITE_GEMINI_API_KEY`: *(Your key from Google AI Studio)*
   - `VITE_APP_URL`: `https://nakasetu.onrender.com`
6. Under **Redirects/Rewrites**, add:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
7. Click **Create Static Site**.

---

## 📂 Project Structure

```text
CodeVibers_Dhruv-Surti_NakaSetu/
├── .env.example             # Template for all environment variables (free tier documented)
├── .env                     # Local environment file (git-ignored)
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
