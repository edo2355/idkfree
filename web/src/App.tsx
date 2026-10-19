import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Register } from './pages/Register';
import { Feed } from './pages/Feed';
import { Chats } from './pages/Chats';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { Create } from './pages/Create';
import { Reels } from './pages/Reels';
import { NotFound } from './pages/NotFound';
import { SplashScreen } from './pages/SplashScreen';

export default function App() {
  const { isLoading, token } = useAuth();
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    // Obligamos a que la pantalla de carga dure al menos 2.5 segundos (2500 ms)
    const timer = setTimeout(() => setMinTimePassed(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Se muestra la carga si está validando la sesión O si no ha pasado el tiempo mínimo
  if (isLoading || !minTimePassed) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Si hay token, va al Feed, sino a la Landing */}
      <Route 
        path="/" 
        element={
          token ? (
            <ProtectedRoute><Feed /></ProtectedRoute>
          ) : (
            <Landing />
          )
        } 
      />
      
      {/* Ruta exclusiva para el Feed si ya estás logueado */}
            <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
      <Route path="/reels" element={<ProtectedRoute><Reels /></ProtectedRoute>} />

      <Route
        path="/u/:alias"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
      <Route path="/chat/:userId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}