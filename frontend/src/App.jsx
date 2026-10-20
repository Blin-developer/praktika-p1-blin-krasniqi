import { useState, useEffect } from 'react';
import BusinessCatalogPage from './pages/BusinessCatalogPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { AuthProvider } from './context/AuthContext';
import './App.css';

/**
 * AppContent – Menaxhon kalimin ndërmjet Katalogut Publik dhe Zonës së Hyrjes Administrative.
 */
function AppContent() {
  const [view, setView] = useState(() => {
    const path = window.location.pathname;
    const search = new URLSearchParams(window.location.search);
    return (path === '/admin' || path === '/admin/login' || search.get('page') === 'admin' || search.get('admin') === '1')
      ? 'admin'
      : 'catalog';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      setView(
        (path === '/admin' || path === '/admin/login' || search.get('page') === 'admin' || search.get('admin') === '1')
          ? 'admin'
          : 'catalog'
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function handleNavigateToAdmin() {
    setView('admin');
    window.history.pushState(null, '', '/admin');
  }

  function handleNavigateToCatalog() {
    setView('catalog');
    window.history.pushState(null, '', '/');
  }

  if (view === 'admin') {
    return <AdminLoginPage onNavigateToCatalog={handleNavigateToCatalog} />;
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
