import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  
  // Si no hay token, rebota al login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
