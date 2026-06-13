# ✨ Campaign Copilot — Frontend

> **AI-Native Mini CRM for Reaching Shoppers** — Built for [XENO](https://www.xeno.co/) Engineering Take-Home Assignment

🔗 **Live Demo:** [https://xeno-crm-frontend-blond.vercel.app](https://xeno-crm-frontend-blond.vercel.app)

The **React frontend** for Campaign Copilot, an AI-native Mini CRM with a chat-first interface. Marketers describe campaigns in plain English, and the app uses AI to parse intent, find matching customer segments, draft personalized messages, and launch campaigns — all through a conversational UI. The dashboard shows live-updating delivery statistics as callbacks stream in.

---

## 🏗️ Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│                    Campaign Copilot System                    │
├───────────────┬───────────────────────┬───────────────────────┤
│   Frontend    │      Backend          │   Channel Service     │
│   (Vercel)    │      (Render)         │     (Render)          │
│               │                       │                       │
│  React + Vite │  Node.js + Express    │  Node.js + Express    │
│  Tailwind CSS │  MongoDB + Gemini AI  │  Delivery Simulator   │
│               │                       │                       │
│  ──API───────>│  ──POST /send───────> │                       │
│               │  <──POST /receipt──── │                       │
└───────────────┴───────────────────────┴───────────────────────┘
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS 3** | Utility-first styling with custom theme |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **React Icons** | Icon library (HiOutline, HiSolid) |

---

## 📱 Pages & Features

### 1. 📊 Dashboard (`/`)
- Real-time overview metrics (total customers, campaigns, revenue)
- Channel-wise customer distribution chart
- Recent campaign cards with delivery stats
- Auto-polling for live updates

### 2. 🤖 AI Copilot (`/copilot`)
- **Chat-first interface** — describe campaigns in plain English
- AI-powered prompt parsing via Google Gemini
- Real-time segment preview with customer table
- Editable AI-drafted message with channel-aware character limits
- One-click campaign launch with live delivery tracking
- Multi-channel support: WhatsApp, SMS, Email, RCS

### 3. 📋 Campaigns (`/campaigns`)
- All campaigns listed as rich cards with status badges
- Live-updating delivery funnel stats
- Channel-specific styling and icons
- Quick access to campaign details

### 4. 📈 Campaign Detail (`/campaigns/:id`)
- Full delivery funnel visualization (sent → delivered → opened → clicked → converted)
- Message-level delivery log with individual status tracking
- Campaign revenue attribution

### 5. 👥 Customers (`/customers`)
- Customer browsing with sidebar channel filters
- Search by name, email, or phone
- Demo data loader for quick testing
- Expandable customer detail with order history
- Manual order recording with campaign attribution
- Add new customer form

---

## 📁 Project Structure

```
xeno-crm-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── CampaignStats.jsx       # Live delivery stats with progress bars
│   │   ├── ChatInput.jsx           # Chat-style input bar with send button
│   │   ├── MessageDraftEditor.jsx  # Editable AI-drafted message panel
│   │   ├── SegmentPreview.jsx      # Customer segment results table
│   │   ├── Sidebar.jsx             # Navigation sidebar with brand logo
│   │   ├── Skeleton.jsx            # Loading skeleton components
│   │   └── Toast.jsx               # Toast notification system
│   ├── pages/
│   │   ├── Home.jsx                # Landing page (redirects to Copilot)
│   │   ├── Dashboard.jsx           # Overview metrics dashboard
│   │   ├── Copilot.jsx             # AI chat interface (main feature)
│   │   ├── Campaigns.jsx           # Campaign list view
│   │   ├── CampaignDetail.jsx      # Single campaign detail + funnel
│   │   └── Customers.jsx           # Customer browse + manage
│   ├── App.jsx                     # Root component with routing
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles + Tailwind directives
├── index.html                       # HTML template
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind custom theme (teal/coral palette)
├── postcss.config.js                # PostCSS configuration
├── .env                             # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- CRM Backend running on port 3001

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/TusarGoswami/xeno-crm-frontend.git
cd xeno-crm-frontend

# 2. Install dependencies
npm install

# 3. Create .env file
echo "VITE_API_URL=http://localhost:3001" > .env

# 4. Start the development server
npm run dev
```

The app will open at `http://localhost:3000`.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | CRM Backend API base URL | `http://localhost:3001` |

> **Note:** Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

---

## 🎨 Design System

- **Color Palette:** Teal (#0F4C5C) + Coral (#FF6B6B) accent
- **Typography:** Inter font from Google Fonts
- **Theme:** Light mode with glassmorphism cards
- **Animations:** Smooth micro-animations (fade-in, slide-up, typing dots)
- **Custom scrollbars** and responsive layout
- **Chat bubble UI** for conversational AI feel

---

## 🌐 Deployed URLs

| Service | URL |
|---|---|
| **Frontend (this repo)** | [xeno-crm-frontend-blond.vercel.app](https://xeno-crm-frontend-blond.vercel.app) |
| **Backend API** | [xeno-crm-backend-i0y6.onrender.com](https://xeno-crm-backend-i0y6.onrender.com) |
| **Channel Service** | [xeno-channel-service-kbs0.onrender.com](https://xeno-channel-service-kbs0.onrender.com) |

---

## 🔗 Related Repositories

| Service | Repository |
|---|---|
| **Frontend (this repo)** | [xeno-crm-frontend](https://github.com/TusarGoswami/xeno-crm-frontend) |
| **Backend** | [xeno-crm-backend](https://github.com/TusarGoswami/xeno-crm-backend) |
| **Channel Service** | [xeno-channel-service](https://github.com/TusarGoswami/xeno-channel-service) |

---

## 📄 License

MIT
