import { useAuth } from '../hooks/useAuth';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * AdminLayout – Korniza e përbashkët administrative me kokë lundrimi, të dhënat e administratorit dhe butonat e veprimit.
 */
export default function AdminLayout({ children, activeTab = 'dashboard', onNavigateToCatalog, onTabChange }) {
  const { user, logout, loading } = useAuth();

  return (
    <div className="admin-app">
      {/* Brezi i sipërm administrativ */}
      <header className="admin-header">
        <div className="admin-header__container">
          <div className="admin-header__brand">
            <div className="admin-header__logo-badge">ADMIN</div>
            <div>
              <h1 className="admin-header__title">Paneli Administrativ</h1>
              <p className="admin-header__subtitle">Katalogu i Bizneseve • Komuna e Lipjanit</p>
            </div>
          </div>

          <nav className="admin-header__nav" aria-label="Lundrimi kryesor administrativ">
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'is-active' : ''}`}
              aria-current={activeTab === 'dashboard' ? 'page' : undefined}
              onClick={() => onTabChange && onTabChange('dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'businesses' ? 'is-active' : ''}`}
              aria-current={activeTab === 'businesses' ? 'page' : undefined}
              onClick={() => onTabChange && onTabChange('businesses')}
            >
              🏢 Bizneset
            </button>
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'advertisements' ? 'is-active' : ''}`}
              aria-current={activeTab === 'advertisements' ? 'page' : undefined}
              onClick={() => onTabChange && onTabChange('advertisements')}
            >
              📢 Reklamat
            </button>
            <button
              type="button"
              className="admin-nav-item admin-nav-item--link"
              onClick={onNavigateToCatalog}
              title="Shiko katalogun publik të qytetarëve"
            >
              🌐 Shiko Katalogun Publik
            </button>
          </nav>

          <div className="admin-header__user-section">
            <div className="admin-user-pill">
              <span className="admin-user-pill__avatar" aria-hidden="true">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </span>
              <div className="admin-user-pill__info">
                <span className="admin-user-pill__name">{user?.name || 'Administrator'}</span>
                <span className="admin-user-pill__email">{user?.email}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn--ghost-danger admin-logout-btn"
              onClick={logout}
              disabled={loading}
              title="Shkyçu nga paneli administrativ"
            >
              {loading ? 'Duke u shkyçur...' : 'Shkyçu 🚪'}
            </button>
          </div>
        </div>
      </header>

      {/* Përmbajtja kryesore administrative */}
      <main className="admin-main">
        {children}
      </main>

      <footer className="admin-footer">
        <p>© {CURRENT_YEAR} Komuna e Lipjanit — Sistemi Administrativ i Bizneseve</p>
      </footer>
    </div>
  );
}
