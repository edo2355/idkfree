import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebLayout from './layouts/WebLayout';
import Landing from './pages/Landing';
import Ticketera from './pages/Ticketera';
import Waitlist from './pages/Waitlist';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WebLayout />}>
          <Route index element={<Landing />} />
          <Route path="waitlist" element={<Waitlist />} />
          <Route path="ticketera" element={<Ticketera />} />
          <Route path="*" element={<div className="text-white p-10">Página en construcción</div>} />
        </Route>
      </Routes>
    </Router>
  );
}
