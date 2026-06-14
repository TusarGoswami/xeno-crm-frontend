import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Copilot from './pages/Copilot';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Customers from './pages/Customers';

/**
 * App — Root component with sidebar layout and routing
 *
 * Routes:
 *   /                → Dashboard (overview metrics)
 *   /copilot         → AI Chat Interface (Campaign Copilot)
 *   /campaigns       → Campaigns List
 *   /campaigns/:id   → Campaign Detail (funnel + message log)
 *   /customers       → Customers Browse + Search
 */
export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <div className="flex min-h-screen ambient-bg">
          <Sidebar />
          <main className="flex-1 min-w-0 mobile-top-padding">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/customers" element={<Customers />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </Router>
  );
}
