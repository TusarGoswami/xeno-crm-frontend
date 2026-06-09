# ✨ Campaign Copilot — Frontend

The **React frontend** for Campaign Copilot, an AI-native Mini CRM with a chat-first interface. Marketers describe campaigns in plain English, and the app uses AI to parse intent, find matching customer segments, draft personalized messages, and launch campaigns — all through a conversational UI. The dashboard shows live-updating delivery statistics as callbacks stream in.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **React Icons** | Icon library |

---

## 📱 Pages

### 1. Home — AI Chat Interface (`/`)
- Conversational campaign creation flow
- AI-powered prompt parsing with Gemini
- Real-time segment preview with customer table
- Editable AI-drafted message with channel-aware character limits
- One-click campaign launch

### 2. Campaigns Dashboard (`/campaigns`)
- All campaigns listed as expandable cards
- Live-updating stats (polls every 3 seconds)
- Message-level delivery log with status tracking
- Visual progress bars for delivery metrics

---

## 📁 Project Structure

```
xeno-crm-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ChatInput.jsx           # Chat-style input bar
│   │   ├── SegmentPreview.jsx      # Customer segment results table
│   │   ├── MessageDraftEditor.jsx  # Editable AI-drafted message
│   │   └── CampaignStats.jsx      # Live stats with progress bars
│   ├── pages/
│   │   ├── Home.jsx               # AI chat interface (main page)
│   │   └── Campaigns.jsx          # Campaign dashboard
│   ├── App.jsx                    # Root component with routing
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles + Tailwind
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── .env                            # Environment variables (not committed)
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
cp .env.example .env
# Then fill in your values (see Environment Variables below)

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

## 🎨 Design Features

- **Dark theme** with glassmorphism elements
- **Inter** font from Google Fonts
- Custom gradient brand colors (indigo/purple palette)
- Smooth micro-animations (fade-in, slide-up, typing dots)
- Custom scrollbars
- Responsive layout
- Chat bubble UI for conversational feel

---

## 🔗 Related Repositories

| Service | Repository |
|---|---|
| **Frontend (this repo)** | [xeno-crm-frontend](https://github.com/TusarGoswami/xeno-crm-frontend) |
| **Channel Service** | [xeno-channel-service](https://github.com/TusarGoswami/xeno-channel-service) |
| **Backend** | [xeno-crm-backend](https://github.com/TusarGoswami/xeno-crm-backend) |

---

## 📄 License

MIT
