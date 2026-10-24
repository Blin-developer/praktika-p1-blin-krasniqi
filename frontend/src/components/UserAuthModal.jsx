import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * UserAuthModal – Dritare modale moderne për Kyçjen (Login) dhe Regjistrimin e përdoruesve të thjeshtë
 */
export default function UserAuthModal({ isOpen, onClose, initialMode = 'login', noticeMessage = null }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { userLogin, register, loading } = useContext(AuthContext);

  // Sinkronizo mode sa herë hapet modal ose ndryshon initialMode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setLocalError(null);
      setSuccessMessage(null);
      setPassword('');
      setPasswordConfirmation('');
    }
  }, [isOpen, initialMode]);

  // Mbyll me butonin Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setLocalError('Ju lutem plotësoni email-in dhe fjalëkalimin.');
        return;
      }

      try {
        await userLogin(email.trim(), password);
        setSuccessMessage('U kyçët me sukses!');
        setTimeout(() => {
          onClose();
        }, 500);
      } catch (err) {
        setLocalError(err.message || 'Kredencialet nuk janë të sakta.');
      }
    } else {
      // Register
      if (!name.trim() || !email.trim() || !password) {
        setLocalError('Të gjitha fushat janë të detyrueshme.');
        return;
      }
      if (password.length < 8) {
        setLocalError('Fjalëkalimi duhet të ketë së paku 8 karaktere.');
        return;
      }
      if (password !== passwordConfirmation) {
        setLocalError('Konfirmimi i fjalëkalimit nuk përputhet.');
        return;
      }

      try {
        await register(name.trim(), email.trim(), password, passwordConfirmation);
        setSuccessMessage('Llogaria juaj u krijua me sukses!');
        setTimeout(() => {
          onClose();
        }, 600);
      } catch (err) {
        setLocalError(err.message || 'Dështoi regjistrimi. Ju lutem provoni sërish.');
      }
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setLocalError(null);
    setSuccessMessage(null);
    setPassword('');
    setPasswordConfirmation('');
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="auth-modal">
        {/* Header me tab-et e qarta */}
        <div className="auth-modal__header">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('login')}
            >
              🔑 Kyçu
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('register')}
            >
              ✨ Krijo Llogari
            </button>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Mbyll dritaren"
          >
            ✕
          </button>
        </div>

        <div className="auth-modal__body">
          {noticeMessage && !localError && !successMessage && (
            <div className="alert alert--info" role="status">
              ℹ️ {noticeMessage}
            </div>
          )}

          {localError && (
            <div className="alert alert--error" role="alert">
              ⚠️ {localError}
            </div>
          )}

          {successMessage && (
            <div className="alert alert--success" role="status">
              ✓ {successMessage}
            </div>
          )}

          <h2 id="auth-modal-title" className="auth-modal__title">
            {mode === 'login' ? 'Mirë se vini përsëri!' : 'Regjistrohuni në Katalog'}
          </h2>
          <p className="auth-modal__subtitle">
            {mode === 'login'
              ? 'Hyni në llogarinë tuaj për të menaxhuar bizneset e ruajtura.'
              : 'Krijoni llogarinë tuaj falas për të ruajtur bizneset dhe shërbimet e preferuara.'}
          </p>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="user-name">Emri dhe Mbiemri</label>
                <input
                  id="user-name"
                  type="text"
                  className="form-control"
                  placeholder="p.sh. Agim Krasniqi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  disabled={loading}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="user-email">Adresa Email</label>
              <input
                id="user-email"
                type="email"
                className="form-control"
                placeholder="shembull@lipjani.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-password">Fjalëkalimi</label>
              <div className="input-with-action">
                <input
                  id="user-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder={mode === 'register' ? 'Së paku 8 karaktere' : 'Fjalëkalimi juaj'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="user-password-confirmation">Konfirmo Fjalëkalimin</label>
                <input
                  id="user-password-confirmation"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Përsëritni fjalëkalimin"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--block btn--lg"
              disabled={loading}
            >
              {loading
                ? 'Duke u procesuar...'
                : mode === 'login'
                ? 'Kyçu në Llogari →'
                : 'Përfundo Regjistrimin →'}
            </button>
          </form>

          <div className="auth-modal__switch">
            {mode === 'login' ? (
              <p>
                Nuk keni ende një llogari?{' '}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => switchMode('register')}
                >
                  Regjistrohuni këtu
                </button>
              </p>
            ) : (
              <p>
                Keni tashmë një llogari?{' '}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => switchMode('login')}
                >
                  Kyçuni këtu
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
