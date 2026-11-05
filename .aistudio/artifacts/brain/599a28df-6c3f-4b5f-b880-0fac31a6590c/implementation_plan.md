# NakaSetu — Pure-Frontend Feature Upgrades & UI/UX Polish Plan

This update adds five noticeable, pure-frontend user capabilities across the Customer View and Field Operations Desk while refining the visual design to crisp white cards, subtle structural borders, and high-contrast Deep Blue (`#1D4ED8`) and Warm Orange (`#EA580C`) action accents.

## User Review & Critical Decisions

> [!IMPORTANT]
> All selected features are 100% client-side React state and browser `localStorage`—no external APIs, AI models, or complex backend dependencies are introduced.

- **Confirmed Customer Features**:
  1. **Simple English / हिंदी (Hindi) Text Toggle**: One-click language switcher in the top header translating key UI headings, service labels, urgency options, and CTAs.
  2. **Helper Count & Hours Price Calculator**: Interactive selectors in the Step 1 Dispatch Configuration card allowing customers to pick **Workers Needed (`1 Solo`, `2 Helpers`, `3Helpers`)** and **Duration (`1`–`8` hrs/units)** with live total tariff calculation that carries through to the final invoice.
  3. **Past Bookings History Modal & Printable Receipt View**: Header button (`Past Bookings`) opening a modal with completed job records and a structured digital receipt view.
- **Confirmed Field Operations Desk Upgrades**:
  4. **Naka Hub Filter Buttons**: Quick filter pills (`All Hubs`, `Station Road Chowk`, `Bharti Park Naka`, `Andheri East Naka #1`, etc.) above the Live Worker Directory table.
  5. **Browser `localStorage` Persistence**: Automatically saves newly registered workers (both offline Naka and online smartphone partners), worker availability changes, customer reviews, and completed booking receipts across browser refreshes (with a quick "Reset Saved Data" option).
- **Confirmed UI/UX Visual Polish**:
  6. **Crisp White Cards with Subtle Borders & Deep Blue / Orange CTAs**: Replaces heavy saturated blue borders with clean subtle borders (`border-slate-200/90` on a soft `#EFF6FF` / `#F8FAFC` canvas) so crisp white cards (`#FFFFFF`) and high-intent Deep Blue (`#1D4ED8`) and Warm Orange (`#EA580C`) buttons stand out cleanly.

---

## 1. Overview & Core Concept

- **What It Does**: Enhances NakaSetu's dual-sided hyperlocal dispatch prototype with dynamic fare calculation, bilingual accessibility, booking history/receipt inspection, Naka hub filtering, and persistent state across reloads.
- **Target Audience**: Urban household customers booking 30-minute trade/domestic help and field desk operators managing feature-phone Naka laborers.
- **Key Value**: Makes the prototype feel like a complete, tactile product during live demos while eliminating visual clutter.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  - **Bilingual Switch**: Clicking `EN | हिंदी` in the top navigation bar immediately toggles primary headings, service names, and button labels between English and Hindi.
  - **Dynamic Price Estimation**: Selecting a service in Step 1 and adjusting helper count (`1`, `2`, `3`) or hours/meals (`1`–`4+`) updates the live estimated total (`Base Rate × Helpers × Duration`) across Step 1, Step 2 Radar, Step 3 Job Summary, and Step 4 Settlement.
  - **Past Bookings & Receipt Inspection**: Clicking `Bookings (N)` in the top bar opens the booking history modal where users can view any completed job's itemized receipt, OTP log, and rating.
  - **Naka Hub Filtering**: Operators on the Field Desk click any Naka Hub pill to filter the worker roster by physical chowk alongside existing search and device-type filters.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Clean, high-contrast utilitarian SaaS & consumer marketplace (Stripe/Linear clarity).
  - *Color Palette & Mood*:
    - Canvas Background: Soft airy blue-slate mist (`#EFF6FF` / `bg-slate-50`).
    - Card Surfaces: Crisp pure white (`#FFFFFF`) with subtle hairline borders (`border-slate-200`) and soft elevation (`shadow-xs`).
    - Primary Brand Accent: Deep Royal Blue (`#1D4ED8`, hover `#1E40AF`) for primary actions, active tabs, and selected card outlines.
    - Tertiary Accent: Warm Orange (`#EA580C`, tint `bg-orange-50 text-orange-800 border-orange-200`) for SLA badges, star ratings, ETA highlights, and partner onboarding CTA.
    - Semantic Statuses: Emerald green for verified/available states, Amber for dispatched/pending, Red for Emergency SOS.
  - *Typography & Hierarchy*: `Plus Jakarta Sans` for UI hierarchy and `JetBrains Mono` (`tabular-nums`) for all prices, OTPs, phone numbers, and timestamps.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Pure Dictionary-Based Bilingual Toggle (`EN | हिंदी`)**
  - *Chosen Approach*: An in-memory translation dictionary mapping key UI labels and all 10 service names between English and Hindi.
  - *Why*: Instant zero-latency switching with zero external translation API calls or network dependencies.
- **Decision 2: `localStorage` State Sync with Safe Fallback**
  - *Chosen Approach*: Persist `workers`, `workerReviews`, and `bookingHistory` in `localStorage` under namespaced keys (`nakasetu_workers_v1`, `nakasetu_reviews_v1`, `nakasetu_bookings_v1`).
  - *Why*: Ensures newly onboarded workers, IVR status updates, written reviews, and completed receipts survive page reloads during demonstrations.

---

## 4. Technical Architecture & Data Strategy

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                        NakaSetuApp (Root State)                          │
│  • lang ('en' | 'hi')               • workers[] (synced to localStorage) │
│  • workerReviews[] (localStorage)   • bookingHistory[] (localStorage)    │
└───────────────────┬──────────────────────────────────┬───────────────────┘
                    │                                  │
                    ▼                                  ▼
┌───────────────────────────────────────┐  ┌───────────────────────────────┐
│      Customer App View (View 1)       │  │  Field Operations Desk (View2)│
│  ┌─────────────────────────────────┐  │  │  ┌─────────────────────────┐  │
│  │ Step 1: 10-Service Grid         │  │  │  │ Offline Naka Enrollment │  │
│  │ + Helper Count (1/2/3) & Hours  │  │  │  └────────────┬────────────┘  │
│  │   Live Price Calculator         │  │  │               ▼               │
│  └────────────────┬────────────────┘  │  │  ┌─────────────────────────┐  │
│                   ▼                   │  │  │ Live Worker Directory   │  │
│  ┌─────────────────────────────────┐  │  │  │ + Naka Hub Filter Pills │  │
│  │ Step 2 & 3: 3s Radar + Matched  │  │  │  │ + Search & Device Tabs  │  │
│  │ Worker + Reviews + Dual OTPs    │  │  │  └────────────┬────────────┘  │
│  └────────────────┬────────────────┘  │  │               ▼               │
│                   ▼                   │  │  ┌─────────────────────────┐  │
│  ┌─────────────────────────────────┐  │  │  │ Simulated IVR Call Modal│  │
│  │ Step 4: Dynamic Bill Settlement │  │  │  │ (DTMF 1 Accept / 2 Pass)│  │
│  │ + Write Review -> Saves Receipt │  │  │  └─────────────────────────┘  │
│  └─────────────────────────────────┘  │  └───────────────────────────────┘
└───────────────────────────────────────┘
```

- **Interactive Component & State Mapping**:
  - `helperCount` (`1 | 2 | 3`) and `durationUnits` (`1..8`) compute `estimatedTotal = selectedService.baseRate * helperCount * durationUnits`.
  - Completing Step 4 (`handleFinishAndReset`) appends a new `BookingRecord` to `bookingHistory`, prepends any written review to `workerReviews`, persists both to `localStorage`, and resets the booking wizard to Step 1.
  - Clicking any Naka Hub pill (`selectedHubFilter`) in View 2 filters `filteredWorkers` by `worker.hubLocation` in combination with `opsSearchQuery` and `opsPhoneFilter`.
