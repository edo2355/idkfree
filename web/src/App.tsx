import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WebLayout from './layouts/WebLayout';
import Landing from './pages/Landing';
import Waitlist from './pages/Waitlist';
import Ticketera from './pages/Ticketera';
import Integrations from './pages/Integrations';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import KycPage from './pages/KycPage';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import EventBuzz from './pages/EventBuzz';
import Shop from './pages/Shop';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './pages/SplashScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) return <SplashScreen onComplete={() => setIsLoading(false)} />;

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />

        {/* Rutas Privadas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<WebLayout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/buzz" element={<EventBuzz />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ticketera" element={<Ticketera />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/kyc" element={<KycPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
