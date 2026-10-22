import GoLive from './pages/GoLive';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import WebLayout from './layouts/WebLayout';
import { Register } from './pages/Register';
import { Feed } from './pages/Feed';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { NotFound } from './pages/NotFound';
import { SplashScreen } from './pages/SplashScreen';
import { Chats } from './pages/Chats';
import { Chat } from './pages/Chat';
import { Search } from './pages/Search';
import { Create } from './pages/Create';
import { Reels } from './pages/Reels';

export default function App() {
  const { isLoading, token } = useAuth();
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !minTimePassed) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas Protegidas */}
      
          <Route path="/" element={<Landing />} />
        <Route path="/" element={<ProtectedRoute><WebLayout /></ProtectedRoute>}>
          <Route path="home" element={<Feed />} />
          <Route path="search" element={<Search />} />
          <Route path="create" element={<Create />} />
          <Route path="reels" element={<Reels />} />
          <Route path="chats" element={<Chats />} />
          <Route path="chat/:userId" element={<Chat />} />
          <Route path="u/:alias" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="golive" element={<GoLive />} />
        </Route>
      
      
      
      
      
      
      
      
      
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
