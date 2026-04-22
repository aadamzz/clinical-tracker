# 🔬 Clinical Trial Tracker - https://resilient-heliotrope-41f011.netlify.app/

A modern web application for exploring and understanding clinical trials, powered by real-time data from [ClinicalTrials.gov](https://clinicaltrials.gov) and AI-generated plain-language summaries.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-ff4154)
![Zustand](https://img.shields.io/badge/Zustand-5-443e38)
![Recharts](https://img.shields.io/badge/Recharts-3-8884d8)

---

## ✨ Features

### 🔍 Smart Search
Search through 400,000+ clinical studies by disease, drug name, or sponsor. Results come directly from the ClinicalTrials.gov API v2.

### 📋 Rich Trial Details
View comprehensive study information including phase timeline, eligibility criteria, interventions, outcome measures, and study locations.

### 🤖 AI Plain-Language Summaries
Click **"Explain this study"** to get a 3–5 sentence summary written in plain English — designed for patients and caregivers, not scientists. Powered by Claude (Anthropic).

### 💬 Universal AI Chat Assistant
A floating chat widget available on every page. The AI is context-aware — it knows what page you're on, what data you're viewing, and can generate interactive charts (pie, bar, line, radar) inline. Ask it to analyze search results, compare trials, explain study details, or visualize trends.

### 📊 Analytics Dashboard
Visualize the clinical trial landscape for any research area with interactive charts:
- **Phase distribution** (donut chart)
- **Status breakdown** (horizontal bar)
- **Top sponsors** (bar chart)
- **Intervention types** (pie chart)

### ⚖️ Compare Trials
Add up to 3 trials to a side-by-side comparison table covering 15 fields: status, phase, sponsor, enrollment, dates, conditions, interventions, eligibility, and more.

### 🌓 Dark Mode
Toggle between light and dark themes. Preference is saved to local storage.

### 📄 Export PDF
Generate a professional PDF report for any trial — includes title, key information table, description, eligibility criteria, locations, and page numbers.

### 🎯 Advanced Filtering
Filter trials by phase (1–4), status (Recruiting, Completed, etc.), and sort by relevance, date, or enrollment size.

### ❤️ Favorites
Save interesting trials to your favorites list. Persists across sessions using local storage.

### 📚 Storybook
Component library with interactive stories for `StatusBadge`, `PhaseBadge`, `PhaseTimeline`, and `TrialCard`.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Framework, SSR, API routes |
| **TypeScript** (strict mode) | Type safety |
| **TailwindCSS 4** | Styling |
| **TanStack Query v5** | Data fetching, caching, infinite scroll |
| **Zustand 5** | Global state (filters, favorites, compare, UI) |
| **Claude API** (Anthropic) | AI summaries, chat, analytics insights |
| **Recharts** | Interactive data visualizations |
| **jsPDF** | Client-side PDF generation |
| **Lucide React** | Icons |
| **Storybook** | Component documentation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/clinical-trial-tracker.git
cd clinical-trial-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Add your Anthropic API key to `.env.local`:

```env
ANTHROPIC_API_KEY=your_key_here
```

> Get a key at [console.anthropic.com](https://console.anthropic.com/)
> The app works fully without the key — only the AI features (summary, chat, insights) require it.

### Development

```bash
# Start the dev server
npm run dev

# Open Storybook
npm run storybook
```

Visit [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/ai/
│   │   ├── assistant/          # Context-aware AI chat API route
│   │   └── summary/            # AI plain-language summary API route
│   ├── analytics/              # Analytics dashboard page
│   ├── compare/                # Trial comparison page
│   ├── favorites/              # Saved trials page
│   ├── trials/[nctId]/         # Trial detail page
│   ├── globals.css
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Home page with search
├── components/
│   ├── ui/                     # Primitives (Button, StatusBadge, PhaseBadge, Skeleton)
│   ├── AISummary.tsx           # AI plain-language summary component
│   ├── ChatMarkdown.tsx        # Rich markdown + chart renderer for AI chat
│   ├── ChatWidget.tsx          # Floating AI chat assistant widget
│   ├── ExportPdfButton.tsx     # PDF report generator
│   ├── FilterPanel.tsx         # Phase/status filter panel
│   ├── Header.tsx              # Navigation header with dark mode toggle
│   ├── PhaseTimeline.tsx       # Visual phase timeline
│   ├── Providers.tsx           # TanStack Query + theme + chat provider
│   ├── SearchBar.tsx           # Search input with suggestions
│   ├── ThemeSync.tsx           # Dark mode synchronizer
│   ├── TrialCard.tsx           # Trial result card (with compare + favorite)
│   └── TrialList.tsx           # Paginated trial list
└── lib/
    ├── api/
    │   ├── ai.ts               # AI summary client
    │   └── clinicaltrials.ts   # ClinicalTrials.gov API client
    ├── chat/
    │   ├── ChatContext.tsx      # React context for page-aware AI chat
    │   └── usePageContext.ts   # Hook for setting chat context per page
    ├── hooks/
    │   └── useTrials.ts        # TanStack Query hooks
    ├── store/
    │   ├── useTrialStore.ts    # Zustand store (filters, favorites, compare)
    │   └── useThemeStore.ts    # Dark mode store
    └── types/
        └── trials.ts           # TypeScript types + normalizer
```

---

## 🌐 Data Source

All clinical trial data comes from the **ClinicalTrials.gov API v2** — a free, public API maintained by the U.S. National Library of Medicine. No API key required.

- [API Documentation](https://clinicaltrials.gov/data-api/api)
- [About ClinicalTrials.gov](https://clinicaltrials.gov/about-site/about-ctg)

---

## 📸 Screenshots

> _Screenshots will be added after deployment._

---

## 🚢 Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/clinical-trial-tracker)

Remember to add `ANTHROPIC_API_KEY` to your Vercel environment variables.

---

## 📄 License

MIT
# clinical-tracker
