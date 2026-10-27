import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

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
 * Ofron lundrim mes faqeve kryesore, dropdown të pasur të kategorive dhe qasje të drejtpërdrejtë në Panelin Administrativ.
 */
export default function Navbar({
  activeView = 'home', // 'home' | 'catalog' | 'categories' | 'admin'
  onNavigate,
}) {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

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
            <span className="brand-logo__crest" aria-hidden="true">🏛️</span>
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

        {/* Actions & Admin Access */}
        <div className="site-header__actions">
          {isAuthenticated && isAdmin ? (
            <div className="admin-nav-logged-wrap">
              <button
                type="button"
                className="btn btn--admin-badge"
                onClick={() => handleNav('admin')}
                title="Hyr në Panelin Administrativ"
              >
                🔐 Paneli Admin
              </button>

              <div className="admin-nav-user-pill">
                <span className="admin-nav-user-avatar" aria-hidden="true">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </span>
                <span className="admin-nav-user-name">
                  {user?.name?.split(' ')[0] || 'Admin'}
                </span>
              </div>

              <button
                type="button"
                className="btn btn--sm btn--danger-outline"
                onClick={logout}
                title="Shkyçu nga llogaria administrative"
              >
                🚪 Dil
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn--primary btn--sm admin-entry-btn"
              onClick={() => handleNav('admin')}
              title="Qasja e Mbrojtur në Panelin Administrativ"
            >
              🔐 Paneli Admin
            </button>
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

            <li>
              <button
                type="button"
                className="mobile-drawer__link mobile-drawer__link--admin"
                onClick={() => handleNav('admin')}
              >
                🔐 Paneli Administrativ
              </button>
            </li>

            {isAuthenticated && (
              <li>
                <button
                  type="button"
                  className="mobile-drawer__link mobile-drawer__link--logout"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                >
                  🚪 Dil nga Paneli
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
