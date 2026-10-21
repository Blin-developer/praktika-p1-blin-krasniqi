import { useState, useEffect } from 'react';
import BusinessCatalogPage from './pages/BusinessCatalogPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminBusinessesPage from './pages/AdminBusinessesPage';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import './App.css';

/**
 * AppContent – Menaxhon kalimin ndërmjet Katalogut Publik dhe Zonës Administrative.
 */
function AppContent() {
  const { isAuthenticated, initialChecking } = useAuth();

  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname;
    const search = new URLSearchParams(window.location.search);
    return path.startsWith('/admin') || search.get('page') === 'admin' || search.get('admin') === '1'
      ? '/admin/businesses'
      : path;
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      if (path.startsWith('/admin') || search.get('page') === 'admin' || search.get('admin') === '1') {
        setCurrentPath('/admin/businesses');
      } else {
        setCurrentPath(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function handleNavigateToAdmin() {
    setCurrentPath('/admin/businesses');
    window.history.pushState(null, '', '/admin/businesses');
  }

  function handleNavigateToCatalog() {
    setCurrentPath('/');
    window.history.pushState(null, '', '/');
  }

  const isAdminRoute = currentPath.startsWith('/admin');

  if (isAdminRoute) {
    if (initialChecking) {
      return (
        <div className="admin-loading-screen">
          <div className="admin-spinner" aria-hidden="true" />
          <p>Duke verifikuar sesionin administrativ...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AdminLoginPage onNavigateToCatalog={handleNavigateToCatalog} />;
    }

    return <AdminBusinessesPage onNavigateToCatalog={handleNavigateToCatalog} />;
  }

  return <BusinessCatalogPage onNavigateToAdmin={handleNavigateToAdmin} />;
}

/**
 * App.jsx – Hyrja kryesore e mbështjellë me AuthProvider.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
