import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminSession {
  id: string;
  email: string;
  loginTime: number;
}

export const useAdminAuth = () => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminSession = () => {
      try {
        const sessionData = localStorage.getItem('admin_session');
        if (sessionData) {
          const session: AdminSession = JSON.parse(sessionData);
          
          // Check if session is still valid (24 hours)
          const sessionAge = Date.now() - session.loginTime;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge < maxAge) {
            setAdminSession(session);
          } else {
            localStorage.removeItem('admin_session');
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        localStorage.removeItem('admin_session');
      } finally {
        setLoading(false);
      }
    };

    checkAdminSession();
  }, []);

  const logout = () => {
    localStorage.removeItem('admin_session');
    setAdminSession(null);
    navigate('/admin');
  };

  const requireAuth = () => {
    if (!loading && !adminSession) {
      navigate('/admin');
      return false;
    }
    return true;
  };

  return {
    adminSession,
    loading,
    logout,
    requireAuth,
    isAuthenticated: !!adminSession
  };
};