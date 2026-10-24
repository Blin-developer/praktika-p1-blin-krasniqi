import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BusinessCatalogPage from './pages/BusinessCatalogPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminBusinessesPage from './pages/AdminBusinessesPage';
import UserAuthModal from './components/UserAuthModal';
import UserProfileModal from './components/UserProfileModal';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import './App.css';

/**
 * AppContent – Menaxhon navigimin mes pamjeve: kreu, katalogu dhe zona administrative.
 * Përfshin Navbar-in global, modalet e autentikimit dhe logjikën e rrugëzimit SPA.
 */
function AppContent() {
  const { isAuthenticated, isAdmin, initialChecking } = useAuth();

  // Pamja aktive: 'home' | 'catalog' | 'admin'
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    const search = new URLSearchParams(window.location.search);
    if (path.startsWith('/admin') || search.get('page') === 'admin' || search.get('admin') === '1') {
      return 'admin';
    }
    if (path.startsWith('/catalog') || search.get('page') === 'catalog') {
      return 'catalog';
    }
    return 'home';
  });

  // Filtrat fillestare kur navigo në katalog nga faqja kryesore
  const [catalogInitialFilters, setCatalogInitialFilters] = useState({});

  // Biznesi i zgjedhur për profil
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // Modalet e autentikimit
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Sinkronizo URL me pamjen aktive
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      if (path.startsWith('/admin') || search.get('page') === 'admin' || search.get('admin') === '1') {
        setCurrentView('admin');
      } else if (path === '/' || path === '') {
        setCurrentView('home');
      } else {
        setCurrentView('catalog');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Funksioni i navigimit kryesor
  const handleNavigate = useCallback((view, extra = null) => {
    if (view === 'home') {
      setCurrentView('home');
      setSelectedBusiness(null);
      setCatalogInitialFilters({});
      window.history.pushState(null, '', '/');
    } else if (view === 'catalog') {
      setCurrentView('catalog');
      setSelectedBusiness(null);
      if (extra && typeof extra === 'object') {
        setCatalogInitialFilters(extra);
      } else {
        setCatalogInitialFilters({});
      }
      window.history.pushState(null, '', '/catalog');
    } else if (view === 'admin') {
      setCurrentView('admin');
      window.history.pushState(null, '', '/admin/businesses');
    }
  }, []);

  // Kur zgjedh kategori nga faqja kryesore, shko në katalog me kategorinë e zgjedhur
  const handleSelectCategory = useCallback((categorySlug) => {
    setCatalogInitialFilters({ category: categorySlug });
    setCurrentView('catalog');
    window.history.pushState(null, '', `/catalog?category=${categorySlug}`);
  }, []);

  // Kur zgjedh biznes nga faqja kryesore, shko në katalog dhe hap profilin
  const handleSelectBusiness = useCallback((business) => {
    setSelectedBusiness(business);
    setCurrentView('catalog');
    window.history.pushState(null, '', '/catalog');
  }, []);

  // Hap modalin e autentikimit
  const handleRequireAuth = useCallback((tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  }, []);

  // Hap modalin e profilit
  const handleOpenProfile = useCallback(() => {
    setProfileModalOpen(true);
  }, []);


  const isAdminView = currentView === 'admin';

  // Loading shkrin gjatë verifikimit të sesionit administrativ
  if (isAdminView && initialChecking) {
    return (
      <div className="admin-loading-screen" role="status" aria-live="polite">
        <div className="admin-spinner" aria-hidden="true" />
        <p>Duke verifikuar sesionin administrativ...</p>
      </div>
    );
  }

  // Admin panel – pa Navbar publik
  if (isAdminView) {
    if (!isAuthenticated || !isAdmin) {
      return <AdminLoginPage onNavigateToCatalog={() => handleNavigate('home')} />;
    }
    return <AdminBusinessesPage onNavigateToCatalog={() => handleNavigate('home')} />;
  }

  // Pamja publike me Navbar
  return (
    <div className="public-app">
      <Navbar
        activeView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleRequireAuth}
        onOpenProfile={handleOpenProfile}
      />

      <main className="public-main">
        {currentView === 'home' ? (
          <HomePage
            onNavigateToCatalog={(filters) => handleNavigate('catalog', filters)}
            onSelectCategory={handleSelectCategory}
            onSelectBusiness={handleSelectBusiness}
            onRequireAuth={handleRequireAuth}
          />
        ) : (
          <BusinessCatalogPage
            onNavigateToAdmin={() => handleNavigate('admin')}
            onRequireAuth={handleRequireAuth}
            initialFilters={catalogInitialFilters}
            initialBusiness={selectedBusiness}
          />
        )}
      </main>

      {/* Modal për Login / Regjistrim */}
      <UserAuthModal
        isOpen={authModalOpen}
        initialMode={authModalTab}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Modal për Profilin e Përdoruesit */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}

/**
 * App – Komponenti rrënjësor i mbështjellë me AuthProvider.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
