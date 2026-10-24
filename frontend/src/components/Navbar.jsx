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

export default function Navbar({
  activeView = 'home', // 'home' | 'catalog' | 'admin'
  onNavigate,
  onOpenAuth,
  onOpenProfile,
}) {
  const { user, isAuthenticated, isAdmin, favoritesCount, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const userMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);

  // Mbyll dropdowns kur klikohet jashtë ose shtypet Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false);
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
    setUserDropdownOpen(false);
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

  const handleCategoriesSectionClick = () => {
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
    handleNav('home', { scrollTo: 'categories' });
  };

  const handleSponsoredSectionClick = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
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
                className={`site-nav__link nav-dropdown-trigger ${categoryDropdownOpen ? 'site-nav__link--active' : ''}`}
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
                      onClick={handleCategoriesSectionClick}
                    >
                      📍 Shiko të gjitha në Faqen Kryesore →
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

        {/* Actions & User Controls */}
        <div className="site-header__actions">
          {/* Butoni i të ruajturave */}
          {isAuthenticated && (
            <button
              type="button"
              className="action-pill action-pill--saved"
              onClick={() => onOpenProfile('saved')}
              title="Bizneset e ruajtura"
              aria-label={`Bizneset e ruajtura (${favoritesCount})`}
            >
              ❤️ <span className="action-pill__label">Ruajtur</span>
              {favoritesCount > 0 && (
                <span className="action-pill__badge">{favoritesCount}</span>
              )}
            </button>
          )}

          {/* Admin panel link - ONLY if admin! */}
          {isAdmin && (
            <button
              type="button"
              className="btn btn--admin-badge"
              onClick={() => handleNav('admin')}
              title="Hyr në Panelin Administrativ"
            >
              🔐 Paneli Admin
            </button>
          )}

          {/* Guest Auth Buttons */}
          {!isAuthenticated ? (
            <div className="auth-buttons">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => onOpenAuth('login')}
              >
                Kyçu
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onOpenAuth('register')}
              >
                Regjistrohu
              </button>
            </div>
          ) : (
            /* Logged in User Menu (me tri pika ⋮ / user dropdown) */
            <div className="user-menu-container" ref={userMenuRef}>
              <button
                type="button"
                className="user-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                aria-label="Opsionet e përdoruesit"
              >
                <div className="user-avatar-pill" aria-hidden="true">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-menu-name">{user.name?.split(' ')[0]}</span>
                <span className="user-menu-dots" aria-hidden="true">⋮</span>
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown-menu" role="menu" aria-label="Menuja e llogarisë">
                  <div className="user-dropdown-header">
                    <strong className="user-dropdown-name">{user.name}</strong>
                    <span className="user-dropdown-email">{user.email}</span>
                    {isAdmin && <span className="admin-tag">Administrator</span>}
                  </div>
                  <div className="user-dropdown-divider"></div>
                  <button
                    type="button"
                    className="user-dropdown-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenProfile('profile');
                    }}
                    role="menuitem"
                  >
                    👤 Llogaria Ime
                  </button>
                  <button
                    type="button"
                    className="user-dropdown-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenProfile('saved');
                    }}
                    role="menuitem"
                  >
                    ❤️ Bizneset e Ruajtura ({favoritesCount})
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      className="user-dropdown-item user-dropdown-item--admin"
                      onClick={() => handleNav('admin')}
                      role="menuitem"
                    >
                      🔐 Paneli Administrativ
                    </button>
                  )}
                  <div className="user-dropdown-divider"></div>
                  <button
                    type="button"
                    className="user-dropdown-item user-dropdown-item--danger"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    role="menuitem"
                  >
                    🚪 Dil nga Llogaria
                  </button>
                </div>
              )}
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
                className="mobile-drawer__link"
                onClick={handleCategoriesSectionClick}
              >
                🏷️ Kategoritë e Bizneseve
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

            {isAuthenticated && (
              <>
                <li>
                  <button
                    type="button"
                    className="mobile-drawer__link"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile('profile');
                    }}
                  >
                    👤 Llogaria Ime
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="mobile-drawer__link"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile('saved');
                    }}
                  >
                    ❤️ Bizneset e Ruajtura ({favoritesCount})
                  </button>
                </li>
              </>
            )}

            {isAdmin && (
              <li>
                <button
                  type="button"
                  className="mobile-drawer__link mobile-drawer__link--admin"
                  onClick={() => handleNav('admin')}
                >
                  🔐 Paneli Administrativ
                </button>
              </li>
            )}
          </ul>

          <div className="mobile-drawer__auth">
            {!isAuthenticated ? (
              <div className="mobile-auth-grid">
                <button
                  type="button"
                  className="btn btn--block btn--secondary"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                >
                  Kyçu
                </button>
                <button
                  type="button"
                  className="btn btn--block btn--primary"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                >
                  Regjistrohu
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn--block btn--danger-outline"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                Dil nga Llogaria
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
