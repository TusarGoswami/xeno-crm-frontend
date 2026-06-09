import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';

/**
 * App — Root component with routing
 *
 * Routes:
 *   /           → Home (AI Chat Interface)
 *   /campaigns  → Campaigns Dashboard
 */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
      </Routes>
    </Router>
  );
}
