import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WebLayout from './layouts/WebLayout';
import Landing from './pages/Landing';
import Waitlist from './pages/Waitlist';
import Ticketera from './pages/Ticketera';
import Integrations from './pages/Integrations';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './pages/SplashScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Muestra la pantalla de carga primero
  if (isLoading) {
    return <SplashScreen onComplete={() => setIsLoading(false)} />;
  }

  // Una vez carga, muestra la web normal
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<WebLayout />}>
            <Route path="/dashboard" element={<div className="text-white font-mono p-8">DASHBOARD EN CONSTRUCCIÓN</div>} />
            <Route path="/ticketera" element={<Ticketera />} />
            <Route path="/integrations" element={<Integrations />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
