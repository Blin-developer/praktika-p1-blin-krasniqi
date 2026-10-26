import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * AdminLoginPage – Faqja bazë e hyrjes për administratorin (Java 3, Dita 1).
 */
export default function AdminLoginPage({ onNavigateToCatalog }) {
  const { user, isAuthenticated, loading, error, login, logout, testAccess } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await login(email, password);
    } catch {
      // Gabimi trajtohet nga AuthContext
    }
  }

  async function handleTestAdmin() {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await testAccess();
      setTestResult({ success: true, data: res });
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setTestLoading(false);
    }
  }

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="admin-auth-card__header">
          <div className="admin-auth-card__badge">ZONA ADMINISTRATIVE</div>
          <h1 className="admin-auth-card__title">
            {isAuthenticated ? 'Statusi i Autentikimit' : 'Hyrja e Administratorit'}
          </h1>
          <p className="admin-auth-card__subtitle">
            Paneli Zyrtar i Menaxhimit • Komuna e Lipjanit
          </p>
        </div>

        {isAuthenticated ? (
          <div className="admin-auth-authenticated">
            <div className="admin-auth-success-badge">
              ✓ Jeni të kyçur si Administrator
            </div>

            <div className="admin-auth-user-info">
              <p><strong>Emri:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Roli:</strong> Administrator (is_admin: true)</p>
            </div>

            <div className="admin-auth-test-section">
              <button
                type="button"
                className="btn btn--outline"
                onClick={handleTestAdmin}
                disabled={testLoading}
              >
                {testLoading ? 'Duke testuar...' : 'Testo Rrugën e Mbrojtur (GET /api/v1/admin/test)'}
              </button>

              {testResult && (
                <div className={`admin-auth-test-result ${testResult.success ? 'is-success' : 'is-error'}`}>
                  {testResult.success ? (
                    <div>
                      <strong>✓ Sukses 200 OK:</strong> {testResult.data.message}
                    </div>
                  ) : (
                    <div>
                      <strong>✗ Gabim:</strong> {testResult.message}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="admin-auth-actions">
              <button
                type="button"
                className="btn btn--danger"
                onClick={logout}
                disabled={loading}
              >
                {loading ? 'Duke u shkyçur...' : 'Shkyçu (Logout)'}
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={onNavigateToCatalog}
              >
                ← Kthehu te Katalogu Publik
              </button>
            </div>
          </div>
        ) : (
          <form className="admin-auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="admin-auth-error-banner" role="alert">
                <strong>Gabim:</strong> {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="admin-email">Email i Administratorit</label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                placeholder="p.sh. admin@lipjani.test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">Fjalëkalimi</label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="admin-auth-form__actions">
              <button
                type="submit"
                id="admin-login-button"
                className="btn btn--primary btn--full"
                disabled={loading}
              >
                {loading ? 'Duke u kyçur...' : 'Hyr'}
              </button>

              <button
                type="button"
                className="btn btn--ghost btn--full"
                onClick={onNavigateToCatalog}
                disabled={loading}
              >
                ← Kthehu te Katalogu Publik
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
