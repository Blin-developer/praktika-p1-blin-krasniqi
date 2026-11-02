import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserAuthModal from './UserAuthModal';

const PRESET_CATEGORIES = [
  { slug: 'gastronomi', name: 'Gastronomi', icon: '🍽️' },
  { slug: 'tregti', name: 'Tregti & Qendra', icon: '🛒' },
  { slug: 'shendetesi', name: 'Shëndetësi & Farmaci', icon: '💊' },
  { slug: 'auto-transport', name: 'Auto & Transport', icon: '🚗' },
  { slug: 'sherbime', name: 'Shërbime & Zejtari', icon: '🛠️' },
  { slug: 'edukim', name: 'Edukim & Trajnime', icon: '🎓' },
];

/**
 * Navbar – Shirit lundrimi modern dhe me kontrast të lartë për portalin publik të Komunës së Lipjanit.
 * Ofron lundrim mes faqeve kryesore, dropdown të pasur të kategorive, autentikim sipas roleve (vizitor, përdorues normal, admin).
 */
export default function Navbar({
  activeView = 'home', // 'home' | 'catalog' | 'categories' | 'admin'
  onNavigate,
}) {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  const categoryMenuRef = useRef(null);

  // Mbyll dropdowns kur klikohet jashtë ose shtypet Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setCategoryDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNav = (view, extra = null) => {
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
    if (onNavigate) {
      onNavigate(view, extra);
    }
  };

  const handleCategoryItemClick = (slug) => {
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
    handleNav('catalog', { category: slug });
  };

  const handleSponsoredSectionClick = () => {
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
    handleNav('home', { scrollTo: 'sponsored' });
  };

  const handleOpenAuthModal = (mode = 'login') => {
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <header className="site-header">
      <div className="site-header__container">
        {/* Brand / Logo */}
        <div className="site-header__brand">
          <button
            type="button"
            className="brand-logo"
            onClick={() => handleNav('home')}
            aria-label="Kthehu në kryefaqe"
          >
            <span className="brand-logo__crest" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                <rect width="36" height="36" rx="8" fill="url(#crestGradNav)"/>
                <path d="M18 5.5L6.5 11.2V14.2H29.5V11.2L18 5.5Z" fill="#F59E0B"/>
                <rect x="8.5" y="15.2" width="3.2" height="11" rx="0.8" fill="#FFFFFF"/>
                <rect x="13.5" y="15.2" width="3.2" height="11" rx="0.8" fill="#FFFFFF"/>
                <rect x="19.3" y="15.2" width="3.2" height="11" rx="0.8" fill="#FFFFFF"/>
                <rect x="24.3" y="15.2" width="3.2" height="11" rx="0.8" fill="#FFFFFF"/>
                <rect x="6.5" y="27" width="23" height="3.2" rx="1" fill="#F59E0B"/>
                <circle cx="18" cy="11.2" r="1.6" fill="#1E3A8A"/>
                <defs>
                  <linearGradient id="crestGradNav" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1E3A8A"/>
                    <stop offset="1" stopColor="#2563EB"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <div className="brand-logo__text">
              <span className="brand-logo__title">Katalogu i Bizneseve</span>
              <span className="brand-logo__subtitle">Komuna e Lipjanit</span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="site-nav" aria-label="Lundrimi kryesor">
          <ul className="site-nav__list">
            <li>
              <button
                type="button"
                className={`site-nav__link ${activeView === 'home' ? 'site-nav__link--active' : ''}`}
                onClick={() => handleNav('home')}
              >
                Kreu
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`site-nav__link ${activeView === 'catalog' ? 'site-nav__link--active' : ''}`}
                onClick={() => handleNav('catalog')}
              >
                Katalogu
              </button>
            </li>

            {/* Dropdown i Kategorive */}
            <li className="nav-dropdown-item" ref={categoryMenuRef}>
              <button
                type="button"
                className={`site-nav__link nav-dropdown-trigger ${
                  activeView === 'categories' || categoryDropdownOpen ? 'site-nav__link--active' : ''
                }`}
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                aria-expanded={categoryDropdownOpen}
                aria-haspopup="true"
              >
                Kategoritë <span className="nav-dropdown-arrow" aria-hidden="true">{categoryDropdownOpen ? '▴' : '▾'}</span>
              </button>

              {categoryDropdownOpen && (
                <div className="nav-dropdown-menu" role="menu" aria-label="Lista e kategorive">
                  <div className="nav-dropdown-header">
                    <span>Zbuloni sipas sektorit</span>
                    <button
                      type="button"
                      className="nav-dropdown-header-all"
                      onClick={() => handleNav('categories')}
                    >
                      Faqja e Plotë ↗
                    </button>
                  </div>

                  <div className="nav-dropdown-grid">
                    {PRESET_CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        className="nav-dropdown-btn"
                        onClick={() => handleCategoryItemClick(cat.slug)}
                        role="menuitem"
                      >
                        <span className="nav-dropdown-icon" aria-hidden="true">{cat.icon}</span>
                        <span className="nav-dropdown-text">{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="nav-dropdown-footer">
                    <button
                      type="button"
                      className="nav-dropdown-footer-link"
                      onClick={() => handleNav('categories')}
                    >
                      📁 Shiko të Gjitha Kategoritë e Lipjanit →
                    </button>
                  </div>
                </div>
              )}
            </li>

            {/* Butoni Të Sponsorizuara */}
            <li>
              <button
                type="button"
                className="site-nav__link"
                onClick={handleSponsoredSectionClick}
              >
                ★ Të Sponsorizuara
              </button>
            </li>
          </ul>
        </nav>

        {/* Actions & User/Admin Controls */}
        <div className="site-header__actions">
          {isAuthenticated ? (
            isAdmin ? (
              /* Rasti 3: Administrator i kyçur me kredenciale administrative */
              <div className="admin-nav-logged-wrap">
                <button
                  type="button"
                  className="btn btn--admin-nav"
                  onClick={() => handleNav('admin')}
                  title="Hyr në Panelin Administrativ"
                  id="navbar-admin-panel-btn"
                >
                  🔐 Paneli Admin
                </button>

                <div
                  className="admin-nav-user-pill"
                  title={`Sesioni aktiv i administratorit: ${user?.email || 'admin@lipjani.gov'}`}
                >
                  <span className="admin-nav-user-avatar" aria-hidden="true">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </span>
                  <span className="admin-nav-user-name">
                    {user?.name || 'Administrator'}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn--admin-logout"
                  onClick={logout}
                  title="Dil nga llogaria administrative"
                  id="navbar-admin-logout-btn"
                >
                  🚪 Dil
                </button>
              </div>
            ) : (
              /* Rasti 2: Përdorues normal i kyçur (pa Paneli Admin) */
              <div className="user-nav-logged-wrap">
                <div
                  className="user-nav-user-pill"
                  title={`Përdorues i kyçur: ${user?.email}`}
                >
                  <span className="user-nav-user-avatar" aria-hidden="true">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <span className="user-nav-user-name">
                    {user?.name || 'Përdorues'}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn--user-logout"
                  onClick={logout}
                  title="Dil nga llogaria"
                  id="navbar-user-logout-btn"
                >
                  🚪 Dil
                </button>
              </div>
            )
          ) : (
            /* Rasti 1: Vizitor i pakyçur (Regjistrohu dhe Kyçu, pa Paneli Admin) */
            <div className="guest-nav-actions">
              <button
                type="button"
                className="btn btn--guest-register"
                onClick={() => handleOpenAuthModal('register')}
                id="navbar-register-btn"
                title="Krijo llogari të re"
              >
                ✨ Regjistrohu
              </button>
              <button
                type="button"
                className="btn btn--guest-login"
                onClick={() => handleOpenAuthModal('login')}
                id="navbar-login-btn"
                title="Kyçu në llogari"
              >
                🔑 Kyçu
              </button>
            </div>
          )}

          {/* Mobile menu hamburger toggle */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Mbyll menunë' : 'Hap menunë'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="navigation" aria-label="Lundrimi mobil">
          <ul className="mobile-drawer__links">
            <li>
              <button
                type="button"
                className={`mobile-drawer__link ${activeView === 'home' ? 'mobile-drawer__link--active' : ''}`}
                onClick={() => handleNav('home')}
              >
                🏠 Kreu
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`mobile-drawer__link ${activeView === 'catalog' ? 'mobile-drawer__link--active' : ''}`}
                onClick={() => handleNav('catalog')}
              >
                📋 Katalogu i Bizneseve
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`mobile-drawer__link ${activeView === 'categories' ? 'mobile-drawer__link--active' : ''}`}
                onClick={() => handleNav('categories')}
              >
                📁 Kategoritë e Bizneseve
              </button>
            </li>
            <li>
              <button
                type="button"
                className="mobile-drawer__link"
                onClick={handleSponsoredSectionClick}
              >
                ★ Të Sponsorizuara
              </button>
            </li>

            <li className="mobile-drawer__divider" aria-hidden="true" />

            {isAuthenticated ? (
              isAdmin ? (
                /* Rasti 3 (Mobile): Administrator */
                <>
                  <li className="mobile-drawer__admin-card">
                    <div className="mobile-drawer__avatar" aria-hidden="true">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="mobile-drawer__admin-info">
                      <span className="mobile-drawer__admin-name">{user?.name || 'Administrator'}</span>
                      <span className="mobile-drawer__admin-role">Administrator Zyrtar</span>
                    </div>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="mobile-drawer__link mobile-drawer__link--admin"
                      onClick={() => handleNav('admin')}
                      id="mobile-drawer-admin-panel-btn"
                    >
                      🔐 Paneli Administrativ
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="mobile-drawer__link mobile-drawer__link--logout"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      id="mobile-drawer-admin-logout-btn"
                    >
                      🚪 Dil nga Paneli
                    </button>
                  </li>
                </>
              ) : (
                /* Rasti 2 (Mobile): Përdorues normal (pa Paneli Admin) */
                <>
                  <li className="mobile-drawer__user-card">
                    <div className="mobile-drawer__avatar mobile-drawer__avatar--user" aria-hidden="true">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="mobile-drawer__user-info">
                      <span className="mobile-drawer__user-name">{user?.name || 'Përdorues'}</span>
                      <span className="mobile-drawer__user-role">Përdorues i Regjistruar</span>
                    </div>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="mobile-drawer__link mobile-drawer__link--logout"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      id="mobile-drawer-user-logout-btn"
                    >
                      🚪 Dil nga Llogaria
                    </button>
                  </li>
                </>
              )
            ) : (
              /* Rasti 1 (Mobile): Vizitor (Regjistrohu & Kyçu) */
              <>
                <li>
                  <button
                    type="button"
                    className="mobile-drawer__link mobile-drawer__link--auth-login"
                    onClick={() => handleOpenAuthModal('login')}
                    id="mobile-drawer-login-btn"
                  >
                    🔑 Kyçu
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="mobile-drawer__link mobile-drawer__link--auth-register"
                    onClick={() => handleOpenAuthModal('register')}
                    id="mobile-drawer-register-btn"
                  >
                    ✨ Regjistrohu
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Modal i Kyçjes dhe Regjistrimit të Përdoruesit */}
      <UserAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </header>
  );
}
