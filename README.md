# Sahaaya AI — Real-Time Stress and Trauma Support System

> **Hackathon Prototype Notice:** Sahaaya AI is an AI-assisted stress and vulnerability support prototype designed for demonstration with the National Helpline Against Atrocities (NHAA 14566) integrated portal concept. It is **not** a certified clinical diagnostic tool or statutory emergency dispatch system. All data shown is synthetic, and all AI indicators are preliminary aids requiring human professional review.

## Key Features

- **Public Portal & Voluntary Assessment (`/`, `/assessment`)**: Informed-consent onboarding, multilingual UI support (English, Hindi, Kannada, with extensible registry for Tamil, Telugu, Marathi), text or simulated voice intake (no audio recorded or stored), optional skip-friendly non-leading questions, and persistent direct access to a human support worker.
- **Deterministic Preliminary Assessment Engine**: Computes a transparent 0–100 Stress Vulnerability Index (SVI), preliminary support priority (`Low`, `Moderate`, `High`, `Critical`), contributing text/check-in indicators, confidence & uncertainty margins, and compassionate urgent-support guidance without graphic details or automatic third-party alerts.
- **Victim Support Dashboard & Analytics (`/dashboard`, `/analytics`)**: Real-time KPI summaries, Recharts visualizations for priority distribution and intake trends, searchable/filterable anonymized case table, and explicit separation between automated indicators and human decisions.
- **Case Review & Professional Oversight (`/cases`, `/cases/:id`)**: Anonymized case inspection, mandatory human confirmation for referrals, priority override with rationale, AI indicator dismissal, and synthetic case notes.
- **Support & Referral Center (`/referrals`)**: Mock resource directory covering counselling, legal aid, medical care, social welfare, emergency support, and witness protection information with clearly labeled placeholder contacts and live status tracking.
- **Privacy & Ethical AI (`/privacy`, `/settings`)**: Zero `localStorage`/`sessionStorage` persistence of sensitive inputs, volatile in-memory state with one-click session purge, and no demographic/biometric inference.

## Tech Stack

- React 19 + TypeScript
- Vite + Tailwind CSS v4
- React Router (`react-router-dom`)
- Recharts (`recharts`)
- Lucide React Icons (`lucide-react`)

## Local Installation & Running

No API keys are required to run this prototype.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (runs on http://localhost:3000)
npm run dev

# 3. Type-check and build for production
npm run lint
npm run build
```
