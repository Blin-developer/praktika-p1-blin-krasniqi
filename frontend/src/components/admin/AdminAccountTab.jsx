import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * AdminAccountTab – Paneli i menaxhimit të profilit personal të administratorit (Llogaria ime).
 * Mbështet shikimin e të dhënave reale, modifikimin e profilit (emër/email),
 * ndryshimin e sigurt të fjalëkalimit dhe verifikimin e qasjes administrative.
 */
export default function AdminAccountTab() {
  const { user, updateProfile, changePassword, testAccess, logout } = useAuth();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null); // { type: 'success' | 'error', text: string }

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfPw, setShowConfPw] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState(null); // { type: 'success' | 'error', text: string }

  // Security Test State
  const [testingAccess, setTestingAccess] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Sinkronizo kur ngarkohet ose përditësohet user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Trajto përditësimin e profilit
  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileFeedback(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setProfileFeedback({ type: 'error', text: 'Ju lutem plotësoni emrin e administratorit.' });
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setProfileFeedback({ type: 'error', text: 'Ju lutem vendosni një adresë email të vlefshme.' });
      return;
    }

    setProfileSaving(true);
    try {
      await updateProfile(cleanName, cleanEmail);
      setProfileFeedback({
        type: 'success',
        text: 'Të dhënat e administratorit u ruajtën me sukses në sistem!',
      });
      setTimeout(() => {
        setProfileFeedback(null);
      }, 5000);
    } catch (err) {
      setProfileFeedback({
        type: 'error',
        text: err.message || 'Ndodhi një gabim gjatë ruajtjes së profilit.',
      });
    } finally {
      setProfileSaving(false);
    }
  }

  // Trajto ndryshimin e fjalëkalimit
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!currentPassword) {
      setPasswordFeedback({ type: 'error', text: 'Ju lutem shkruani fjalëkalimin aktual.' });
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setPasswordFeedback({
        type: 'error',
        text: 'Fjalëkalimi i ri duhet të ketë të paktën 8 karaktere.',
      });
      return;
    }
    if (newPassword !== newPasswordConfirmation) {
      setPasswordFeedback({
        type: 'error',
        text: 'Konfirmimi i fjalëkalimit nuk përputhet me fjalëkalimin e ri.',
      });
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(currentPassword, newPassword, newPasswordConfirmation);
      setPasswordFeedback({
        type: 'success',
        text: 'Fjalëkalimi u ndryshua me sukses! Përdorni fjalëkalimin e ri në hyrjet e ardhshme.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirmation('');
      setTimeout(() => {
        setPasswordFeedback(null);
      }, 5000);
    } catch (err) {
      setPasswordFeedback({
        type: 'error',
        text: err.message || 'Dështoi ndryshimi i fjalëkalimit. Kontrolloni fjalëkalimin aktual.',
      });
    } finally {
      setPasswordSaving(false);
    }
  }

  // Testo rrugën e mbrojtur administrative në backend
  async function handleTestSecurity() {
    setTestingAccess(true);
    setTestResult(null);
    try {
      const res = await testAccess();
      setTestResult({
        success: true,
        message: res.message || 'Qasja administrative u verifikua me sukses nga backend-i.',
        data: res.user,
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Qasja administrative dështoi.',
      });
    } finally {
      setTestingAccess(false);
    }
  }

  return (
    <div className="admin-tab-content admin-account-view">
      {/* Titulli i seksionit */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-header__title">Llogaria Ime</h2>
          <p className="admin-page-header__subtitle">
            Menaxhoni të dhënat e profilit të administratorit, kredencialet e sigurisë dhe sesionin aktiv.
          </p>
        </div>
      </div>

      <div className="admin-account-grid">
        {/* Kolona 1: Përmbledhja e Administratorit & Siguria */}
        <div className="admin-account-card admin-account-card--overview">
          <div className="admin-account-card__header">
            <h3 className="admin-account-card__title">Profili Administrativ</h3>
            <span className="admin-role-badge">Kryeadministrator</span>
          </div>

          <div className="admin-account-avatar-wrap">
            <div className="admin-account-avatar" aria-hidden="true">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-account-avatar-meta">
              <strong className="admin-account-name">{user?.name || 'Administrator'}</strong>
              <span className="admin-account-email">{user?.email}</span>
              <span className="admin-account-status-tag">🟢 Sesion Aktiv dhe i Sigurt</span>
            </div>
          </div>

          <div className="admin-account-details-list">
            <div className="admin-account-detail-item">
              <span className="admin-account-detail-label">ID në Databazë:</span>
              <strong className="admin-account-detail-value">#{user?.id || '1'}</strong>
            </div>
            <div className="admin-account-detail-item">
              <span className="admin-account-detail-label">Roli i Sistemit:</span>
              <strong className="admin-account-detail-value">Administrator (is_admin: true)</strong>
            </div>
            <div className="admin-account-detail-item">
              <span className="admin-account-detail-label">Zona e Përgjegjësisë:</span>
              <strong className="admin-account-detail-value">Komuna e Lipjanit</strong>
            </div>
          </div>

          {/* Testi i Autorizimit Backend */}
          <div className="admin-security-test-box">
            <h4 className="admin-security-test-box__title">Kontrolli i Autorizimit në Server</h4>
            <p className="admin-security-test-box__desc">
              Verifikoni nëse token-i juaj Sanctum ka të drejta të plota për rrugët e mbrojtura administrative.
            </p>

            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={handleTestSecurity}
              disabled={testingAccess}
            >
              {testingAccess ? '⏳ Duke verifikuar...' : '🔍 Testo Autorizimin (/api/v1/admin/test)'}
            </button>

            {testResult && (
              <div
                className={`admin-test-feedback admin-test-feedback--${
                  testResult.success ? 'success' : 'error'
                }`}
                role="status"
              >
                <strong>{testResult.success ? '✓ 200 OK:' : '✗ Gabim:'}</strong> {testResult.message}
              </div>
            )}
          </div>

          <div className="admin-account-logout-action">
            <button
              type="button"
              className="btn btn--danger-outline btn--full"
              onClick={logout}
            >
              🚪 Shkyçu nga Ky Sesion
            </button>
          </div>
        </div>

        {/* Kolona 2: Formulari i Editimit të Profilit dhe Ndryshimi i Fjalëkalimit */}
        <div className="admin-account-forms-column">
          {/* Formulari 1: Përditësimi i Emrit dhe Email-it */}
          <div className="admin-account-card">
            <div className="admin-account-card__header">
              <h3 className="admin-account-card__title">Përditëso të Dhënat e Profilit</h3>
              <span className="admin-card-subtitle">Ndryshoni emrin zyrtar dhe adresën email</span>
            </div>

            {profileFeedback && (
              <div
                className={`admin-feedback-banner admin-feedback-banner--${profileFeedback.type}`}
                role="alert"
              >
                <span>{profileFeedback.type === 'success' ? '✓' : '⚠️'}</span>
                <span>{profileFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="admin-form" noValidate>
              <div className="form-group">
                <label htmlFor="admin-acc-name" className="form-label">
                  Emri dhe Mbiemri <span className="form-required">*</span>
                </label>
                <input
                  id="admin-acc-name"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={profileSaving}
                  placeholder="p.sh. Administratori Kryesor"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-acc-email" className="form-label">
                  Adresa Email Zyrtare <span className="form-required">*</span>
                </label>
                <input
                  id="admin-acc-email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={profileSaving}
                  placeholder="admin@lipjani.test"
                  required
                />
              </div>

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={profileSaving}
                >
                  {profileSaving ? '⏳ Duke u ruajtur...' : '💾 Ruaj Ndryshimet'}
                </button>
              </div>
            </form>
          </div>

          {/* Formulari 2: Ndryshimi i Fjalëkalimit */}
          <div className="admin-account-card">
            <div className="admin-account-card__header">
              <h3 className="admin-account-card__title">Ndrysho Fjalëkalimin</h3>
              <span className="admin-card-subtitle">
                Zgjidhni një fjalëkalim të fortë me të paktën 8 karaktere
              </span>
            </div>

            {passwordFeedback && (
              <div
                className={`admin-feedback-banner admin-feedback-banner--${passwordFeedback.type}`}
                role="alert"
              >
                <span>{passwordFeedback.type === 'success' ? '✓' : '⚠️'}</span>
                <span>{passwordFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="admin-form" noValidate>
              <div className="form-group">
                <label htmlFor="admin-current-pw" className="form-label">
                  Fjalëkalimi Aktual <span className="form-required">*</span>
                </label>
                <div className="admin-input-eye-wrap">
                  <input
                    id="admin-current-pw"
                    type={showCurrentPw ? 'text' : 'password'}
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={passwordSaving}
                    placeholder="Fjalëkalimi juaj i tanishëm"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="admin-eye-toggle-btn"
                    onClick={() => setShowCurrentPw((v) => !v)}
                    aria-label={showCurrentPw ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}
                  >
                    {showCurrentPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="admin-form-row admin-form-row--2cols">
                <div className="form-group">
                  <label htmlFor="admin-new-pw" className="form-label">
                    Fjalëkalimi i Ri <span className="form-required">*</span>
                  </label>
                  <div className="admin-input-eye-wrap">
                    <input
                      id="admin-new-pw"
                      type={showNewPw ? 'text' : 'password'}
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={passwordSaving}
                      placeholder="Minimumi 8 karaktere"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="admin-eye-toggle-btn"
                      onClick={() => setShowNewPw((v) => !v)}
                      aria-label={showNewPw ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}
                    >
                      {showNewPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="admin-new-pw-conf" className="form-label">
                    Konfirmo Fjalëkalimin <span className="form-required">*</span>
                  </label>
                  <div className="admin-input-eye-wrap">
                    <input
                      id="admin-new-pw-conf"
                      type={showConfPw ? 'text' : 'password'}
                      className="form-control"
                      value={newPasswordConfirmation}
                      onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                      disabled={passwordSaving}
                      placeholder="Përsërit fjalëkalimin e ri"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="admin-eye-toggle-btn"
                      onClick={() => setShowConfPw((v) => !v)}
                      aria-label={showConfPw ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}
                    >
                      {showConfPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={passwordSaving}
                >
                  {passwordSaving ? '⏳ Duke u përditësuar...' : '🔒 Përditëso Fjalëkalimin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
