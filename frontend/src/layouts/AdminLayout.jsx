import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const CURRENT_YEAR = new Date().getFullYear();

const TAB_TITLES = {
  dashboard: '📊 Dashboard Administrativ',
  businesses: '🏢 Menaxhimi i Bizneseve',
  categories: '📁 Kategoritë e Bizneseve',
  settlements: '📍 Vendbanimet e Komunës',
  services: '🛠️ Shërbimet & Lehtësirat',
  advertisements: '📢 Reklamat & Sponsorizimet',
  reviews: '⭐ Vlerësimet e Qytetarëve',
  claims: '🏢 Kërkesat për Pronësi',
  deals: '🏷️ Ofertat & Zbritjet Lokale',
  account: '👤 Llogaria Ime (Profili & Siguria)',
};

/**
 * AdminLayout – Korniza e përbashkët administrative profesionale me Sidebar modern,
 * navigim të qartë me kontrast të lartë, kokë lundrimi responsive dhe menaxhim të sesionit.
 */
export default function AdminLayout({
  children,
  activeTab = 'dashboard',
  onNavigateToCatalog,
  onTabChange,
}) {
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mbyll sidebar në mobile kur ndryshon tab ose kur shtypet Escape
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  const handleSelectTab = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout-root">
      {/* Overlay për pamjet mobile kur hapet sidebar */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── SIDEBAR ADMINISTRATIV ── */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}
        aria-label="Lundrimi kryesor i panelit administrativ"
      >
        {/* Brand Header */}
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">
            <span className="admin-sidebar__crest" aria-hidden="true">🏛️</span>
            <div className="admin-sidebar__titles">
              <span className="admin-sidebar__title">Paneli Admin</span>
              <span className="admin-sidebar__sub">Komuna e Lipjanit</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-sidebar__close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Mbyll menunë e panelit"
          >
            ✕
          </button>
        </div>

        {/* Shënim për rolin */}
        <div className="admin-sidebar__role-chip">
          <span className="admin-sidebar__role-dot" aria-hidden="true">●</span>
          <span className="admin-sidebar__role-text">Zonë Administrative e Mbrojtur</span>
        </div>

        {/* Lista e Navigimit Kryesor */}
        <nav className="admin-sidebar__nav">
          <ul className="admin-sidebar__menu">
            <li>
              <button
                type="button"
                className={`admin-sidebar__item ${activeTab === 'dashboard' ? 'is-active' : ''}`}
                aria-current={activeTab === 'dashboard' ? 'page' : undefined}
                onClick={() => handleSelectTab('dashboard')}
              >
                <span className="admin-sidebar__icon" aria-hidden="true">📊</span>
                <span className="admin-sidebar__label">Dashboard</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`admin-sidebar__item ${activeTab === 'businesses' ? 'is-active' : ''}`}
                aria-current={activeTab === 'businesses' ? 'page' : undefined}
                onClick={() => handleSelectTab('businesses')}
              >
                <span className="admin-sidebar__icon" aria-hidden="true">🏢</span>
                <span className="admin-sidebar__label">Bizneset</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`admin-sidebar__item ${activeTab === 'categories' ? 'is-active' : ''}`}
                aria-current={activeTab === 'categories' ? 'page' : undefined}
                onClick={() => handleSelectTab('categories')}
              >
                <span className="admin-sidebar__icon" aria-hidden="true">📁</span>
                <span className="admin-sidebar__label">Kategoritë</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`admin-sidebar__item ${activeTab === 'settlements' ? 'is-active' : ''}`}
                aria-current={activeTab === 'settlements' ? 'page' : undefined}
                onClick={() => handleSelectTab('settlements')}
              >
                <span className="admin-sidebar__icon" aria-hidden="true">📍</span>
                <span className="admin-sidebar__label">Vendbanimet</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`admin-sidebar__item ${activeTab === 'services' ? 'is-active' : ''}`}
                aria-current={activeTab === 'services' ? 'page' : undefined}
                onClick={() => handleSelectTab('services')}
              >
                <span className="admin-sidebar__icon" aria-hidden="true">🛠️</span>
                <span className="admin-sidebar__label">Shërbimet</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`admin-sidebar__item ${activeTab === 'advertisements' ? 'is-active' : ''}`}
                aria-current={activeTab === 'advertisements' ? 'page' : undefined}
                onClick={() => handleSelectTab('advertisements')}
              >
                <span className="admin-sidebar__icon" aria-hidden="true">📢</span>
                <span className="admin-sidebar__label">Reklamat</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`admin-sidebar__item ${activeTab === 'reviews' ? 'is-active' : ''}`}
                aria-current={activeTab === 'reviews' ? 'page' : undefined}
                onClick={() => handleSelectTab('reviews')}
              >
                <span className="admin-sidebar__icon" aria-hidden="true">⭐</span>
                <span className="admin-sidebar__label">Vlerësimet</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`admin-sidebar__item ${activeTab === 'claims' ? 'is-active' : ''}`}
                aria-current={activeTab === 'claims' ? 'page' : undefined}
                onClick={() => handleSelectTab('claims')}
              >
                <span className="admin-sidebar__icon" aria-hidden="true">📋</span>
                <span className="admin-sidebar__label">Kërkesat për Pronësi</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`admin-sidebar__item ${activeTab === 'deals' ? 'is-active' : ''}`}
                aria-current={activeTab === 'deals' ? 'page' : undefined}
                onClick={() => handleSelectTab('deals')}
              >
                <span className="admin-sidebar__icon" aria-hidden="true">🏷️</span>
                <span className="admin-sidebar__label">Ofertat &amp; Zbritjet</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`admin-sidebar__item ${activeTab === 'account' ? 'is-active' : ''}`}
                aria-current={activeTab === 'account' ? 'page' : undefined}
                onClick={() => handleSelectTab('account')}
              >
                <span className="admin-sidebar__icon" aria-hidden="true">👤</span>
                <span className="admin-sidebar__label">Llogaria ime</span>
              </button>
            </li>

            {/* Ndarës para Dil */}
            <li className="admin-sidebar__divider" aria-hidden="true" />

            <li>
              <button
                type="button"
                className="admin-sidebar__item admin-sidebar__item--logout"
                onClick={logout}
                disabled={loading}
              >
                <span className="admin-sidebar__icon" aria-hidden="true">🚪</span>
                <span className="admin-sidebar__label">
                  {loading ? 'Duke u shkyçur...' : 'Dil'}
                </span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar__footer">
          <button
            type="button"
            className="admin-sidebar__public-link"
            onClick={onNavigateToCatalog}
            title="Kthehu te portali publik"
          >
            <span className="admin-sidebar__public-icon" aria-hidden="true">🌐</span>
            <span>Shiko Katalogun Publik →</span>
          </button>

          {/* User badge */}
          <div className="admin-sidebar__user-badge">
            <div className="admin-sidebar__avatar" aria-hidden="true">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name" title={user?.name}>
                {user?.name || 'Administrator'}
              </span>
              <span className="admin-sidebar__user-email" title={user?.email}>
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── PJESA KRYESORE E PËRMBAJTJES ── */}
      <div className="admin-body-wrap">
        {/* Topbar Header */}
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              type="button"
              className="admin-topbar__hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Hap menunë e panelit"
            >
              ☰
            </button>
            <div className="admin-topbar__title-wrap">
              <h1 className="admin-topbar__title">{TAB_TITLES[activeTab] || 'Paneli Administrativ'}</h1>
              <span className="admin-topbar__crumb">Administrimi Zyrtar • Lipjan</span>
            </div>
          </div>

          <div className="admin-topbar__right">
            <button
              type="button"
              className="btn btn--outline btn--sm admin-topbar__public-btn"
              onClick={onNavigateToCatalog}
            >
              🌐 Portali Publik
            </button>

            <button
              type="button"
              className="admin-topbar__user-trigger"
              onClick={() => handleSelectTab('account')}
              title="Shiko të dhënat e llogarisë"
            >
              <div className="admin-topbar__user-avatar" aria-hidden="true">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="admin-topbar__user-name">
                {user?.name?.split(' ')[0] || 'Admin'}
              </span>
            </button>

            <button
              type="button"
              className="btn btn--danger-outline btn--sm admin-topbar__logout-btn"
              onClick={logout}
              disabled={loading}
              title="Shkyçu nga sistemi"
            >
              🚪 Dil
            </button>
          </div>
        </header>

        {/* Përmbajtja e Faqes / Tab-it Aktiv */}
        <main className="admin-main-content" role="main">
          {children}
        </main>

        {/* Footer Administrativ */}
        <footer className="admin-footer">
          <p>© {CURRENT_YEAR} Komuna e Lipjanit — Sistemi Administrativ i Bizneseve Lokale.</p>
        </footer>
      </div>
    </div>
  );
}
