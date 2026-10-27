import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * AdminLoginPage – Faqja zyrtare e hyrjes për administratorin e sistemit (Komuna e Lipjanit).
 * Siguron validim të plotë të formave, kontroll të qartë të roleve (is_admin),
 * ndërrim të dukshmërisë së fjalëkalimit dhe kontrast të lartë të lexueshmërisë.
 */
export default function AdminLoginPage({ onNavigateToCatalog }) {
  const { user, isAuthenticated, loading, error, login, logout, testAccess } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setLocalError('Fusha e email-it është e detyrueshme.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setLocalError('Ju lutem jepni një adresë email të vlefshme.');
      return;
    }
    if (!password) {
      setLocalError('Fusha e fjalëkalimit është e detyrueshme.');
      return;
    }

    try {
      await login(cleanEmail, password);
    } catch {
      // Gabimi nga backend trajtohet në AuthContext dhe shfaqet përmes `error`
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

  const displayedError = localError || error;

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        {/* Header me Stemë Zyrtare dhe Titull */}
        <div className="admin-auth-card__header">
          <div className="admin-auth-card__crest" aria-hidden="true">🏛️</div>
          <div className="admin-auth-card__badge">ZONA ADMINISTRATIVE E MBROJTUR</div>
          <h1 className="admin-auth-card__title">
            {isAuthenticated ? 'Sesioni Administrativ' : 'Hyrja e Administratorit'}
          </h1>
          <p className="admin-auth-card__subtitle">
            Katalogu Zyrtar i Bizneseve • Komuna e Lipjanit
          </p>
        </div>

        {isAuthenticated ? (
          <div className="admin-auth-authenticated">
            <div className="admin-auth-success-badge">
              ✓ Jeni të kyçur si Administrator i Autorizuar
            </div>

            <div className="admin-auth-user-info">
              <p><strong>Emri:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Roli:</strong> Administrator (is_admin: true)</p>
            </div>

            <div className="admin-auth-test-section">
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={handleTestAdmin}
                disabled={testLoading}
              >
                {testLoading ? 'Duke testuar...' : 'Verifiko Qasjen në Server (/api/v1/admin/test)'}
              </button>

              {testResult && (
                <div
                  className={`admin-auth-test-result ${
                    testResult.success ? 'is-success' : 'is-error'
                  }`}
                  role="status"
                >
                  {testResult.success ? (
                    <div>
                      <strong>✓ 200 OK:</strong> {testResult.data.message}
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
                {loading ? 'Duke u shkyçur...' : 'Shkyçu (Logout) 🚪'}
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
          <form className="admin-auth-form" onSubmit={handleSubmit} noValidate>
            {displayedError && (
              <div className="admin-auth-error-banner" role="alert">
                <span className="admin-auth-error-banner__icon">⚠️</span>
                <span>{displayedError}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="admin-email" className="form-label">
                Email i Administratorit <span className="form-required">*</span>
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                placeholder="p.sh. admin@lipjani.test"
                className="form-control"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (localError) setLocalError(null);
                }}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-password" className="form-label">
                Fjalëkalimi <span className="form-required">*</span>
              </label>
              <div className="admin-input-eye-wrap">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="form-control"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-eye-toggle-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="admin-auth-form__actions">
              <button
                type="submit"
                id="admin-login-button"
                className="btn btn--primary btn--full btn--lg"
                disabled={loading}
              >
                {loading ? '⏳ Duke u kyçur...' : '🔐 Hyr në Panelin Administrativ'}
              </button>

              <button
                type="button"
                className="btn btn--outline btn--full"
                onClick={onNavigateToCatalog}
                disabled={loading}
              >
                ← Kthehu te Katalogu Publik
              </button>
            </div>

            <div className="admin-auth-footer-note">
              <span>🔒 Transmetim i enkriptuar SSL • Vetëm për stafin e autorizuar të Komunës së Lipjanit.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
