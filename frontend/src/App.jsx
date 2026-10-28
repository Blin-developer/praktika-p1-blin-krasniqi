import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import BusinessCatalogPage from './pages/BusinessCatalogPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminBusinessesPage from './pages/AdminBusinessesPage';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import './App.css';

/**
 * AppContent – Menaxhon navigimin mes pamjeve: kreu, katalogu, kategoritë dhe zona administrative.
 * Përfshin Navbar-in global, Footer-in e unifikuar dhe logjikën e rrugëzimit SPA.
 */
function AppContent() {
  const { isAuthenticated, isAdmin, initialChecking } = useAuth();

  // Pamja aktive: 'home' | 'catalog' | 'categories' | 'admin'
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    const search = new URLSearchParams(window.location.search);
    if (path.startsWith('/admin') || search.get('page') === 'admin' || search.get('admin') === '1') {
      return 'admin';
    }
    if (path.startsWith('/categories') || search.get('page') === 'categories') {
      return 'categories';
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

  // Sinkronizo URL me pamjen aktive
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      if (path.startsWith('/admin') || search.get('page') === 'admin' || search.get('admin') === '1') {
        setCurrentView('admin');
      } else if (path.startsWith('/categories') || search.get('page') === 'categories') {
        setCurrentView('categories');
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

      if (extra?.scrollTo) {
        // Scroll në seksionin e synuar pas montimit
        setTimeout(() => {
          const el = document.getElementById(extra.scrollTo);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (view === 'categories') {
      setCurrentView('categories');
      setSelectedBusiness(null);
      window.history.pushState(null, '', '/categories');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'catalog') {
      setCurrentView('catalog');
      setSelectedBusiness(null);
      if (extra && typeof extra === 'object') {
        setCatalogInitialFilters(extra);
      } else {
        setCatalogInitialFilters({});
      }
      window.history.pushState(null, '', '/catalog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin') {
      setCurrentView('admin');
      window.history.pushState(null, '', '/admin/businesses');
    }
  }, []);

  // Kur zgjedh kategori nga cilado faqe, shko në katalog me kategorinë e zgjedhur
  const handleSelectCategory = useCallback((categorySlug) => {
    setCatalogInitialFilters({ category: categorySlug });
    setCurrentView('catalog');
    window.history.pushState(null, '', `/catalog?category=${categorySlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Kur zgjedh biznes nga faqja kryesore ose nga reklamat, shko në katalog dhe hap profilin
  const handleSelectBusiness = useCallback((business) => {
    const slug = typeof business === 'string' ? business : business?.slug;
    setSelectedBusiness(slug);
    setCurrentView('catalog');
    if (slug) {
      window.history.pushState(null, '', `/catalog?business=${slug}`);
    } else {
      window.history.pushState(null, '', '/catalog');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isAdminView = currentView === 'admin';

  // Loading gjatë verifikimit të sesionit administrativ
  if (isAdminView && initialChecking) {
    return (
      <div className="admin-loading-screen" role="status" aria-live="polite">
        <div className="admin-spinner" aria-hidden="true" />
        <p>Duke verifikuar sesionin administrativ...</p>
      </div>
    );
  }

  // Admin panel – plotësisht i ndarë pa Navbar/Footer publik
  if (isAdminView) {
    if (!isAuthenticated || !isAdmin) {
      return <AdminLoginPage onNavigateToCatalog={() => handleNavigate('catalog')} />;
    }
    return <AdminBusinessesPage onNavigateToCatalog={() => handleNavigate('catalog')} />;
  }

  // Pamja publike me Navbar dhe Footer të unifikuar
  return (
    <div className="public-app">
      <Navbar
        activeView={currentView}
        onNavigate={handleNavigate}
      />

      <main className="public-main">
        {currentView === 'home' ? (
          <HomePage
            onNavigateToCatalog={(filters) => handleNavigate('catalog', filters)}
            onNavigateToCategories={() => handleNavigate('categories')}
            onSelectCategory={handleSelectCategory}
            onSelectBusiness={handleSelectBusiness}
          />
        ) : currentView === 'categories' ? (
          <CategoriesPage
            onSelectCategory={handleSelectCategory}
            onNavigateToCatalog={(filters) => handleNavigate('catalog', filters)}
          />
        ) : (
          <BusinessCatalogPage
            initialFilters={catalogInitialFilters}
            initialBusiness={selectedBusiness}
          />
        )}
      </main>

      {/* Footer i unifikuar në të gjitha pamjet publike */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
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
