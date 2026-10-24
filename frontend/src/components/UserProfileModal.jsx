import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * UserProfileModal – Dritare modale për menaxhimin e profilit personal,
 * ndryshimin e fjalëkalimit dhe listën e bizneseve të ruajtura (Favorites).
 */
export default function UserProfileModal({
  isOpen,
  onClose,
  initialTab = 'profile', // 'profile' | 'password' | 'saved'
  onSelectBusiness,
}) {
  const { user, updateProfile, changePassword, favorites, toggleFavorite, logout, loading } =
    useContext(AuthContext);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

  const [msg, setMsg] = useState({ type: null, text: null });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: null, text: null });
    setSubmitting(true);

    try {
      await updateProfile(name.trim(), email.trim());
      setMsg({ type: 'success', text: 'Të dhënat e profilit u përditësuan me sukses!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Dështoi përditësimi i profilit.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: null, text: null });

    if (newPassword.length < 8) {
      setMsg({ type: 'error', text: 'Fjalëkalimi i ri duhet të ketë së paku 8 karaktere.' });
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      setMsg({ type: 'error', text: 'Konfirmimi i fjalëkalimit nuk përputhet.' });
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword, newPasswordConfirmation);
      setMsg({ type: 'success', text: 'Fjalëkalimi u ndryshua me sukses!' });
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirmation('');
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Fjalëkalimi aktual nuk është i saktë.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveFavorite = async (businessId) => {
    try {
      await toggleFavorite(businessId);
    } catch {
      // Handled
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
      <div className="user-profile-modal">
        {/* Header */}
        <div className="user-profile-modal__header">
          <div className="user-profile-modal__user-badge">
            <div className="user-avatar-circle" aria-hidden="true">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 id="profile-modal-title" className="user-profile-modal__title">
                {user.name}
              </h2>
              <span className="user-profile-modal__email">{user.email}</span>
            </div>
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

        {/* Tab navigation */}
        <div className="profile-tabs">
          <button
            type="button"
            className={`profile-tab ${activeTab === 'profile' ? 'profile-tab--active' : ''}`}
            onClick={() => {
              setActiveTab('profile');
              setMsg({ type: null, text: null });
            }}
          >
            👤 Të Dhënat e Mia
          </button>
          <button
            type="button"
            className={`profile-tab ${activeTab === 'saved' ? 'profile-tab--active' : ''}`}
            onClick={() => {
              setActiveTab('saved');
              setMsg({ type: null, text: null });
            }}
          >
            ❤️ Bizneset e Ruajtura ({favorites.length})
          </button>
          <button
            type="button"
            className={`profile-tab ${activeTab === 'password' ? 'profile-tab--active' : ''}`}
            onClick={() => {
              setActiveTab('password');
              setMsg({ type: null, text: null });
            }}
          >
            🔒 Fjalëkalimi
          </button>
        </div>

        {/* Body */}
        <div className="user-profile-modal__body">
          {msg.text && (
            <div className={`alert alert--${msg.type}`} role="status">
              {msg.type === 'success' ? '✓ ' : '⚠️ '}
              {msg.text}
            </div>
          )}

          {/* TAB 1: Profile info */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="edit-name">Emri dhe Mbiemri</label>
                <input
                  id="edit-name"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting || loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-email">Adresa Email</label>
                <input
                  id="edit-email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting || loading}
                  required
                />
              </div>

              <div className="profile-form__actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={submitting || loading}
                >
                  {submitting ? 'Duke u ruajtur...' : 'Ruaj Ndryshimet'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Saved businesses */}
          {activeTab === 'saved' && (
            <div className="saved-businesses-list">
              {favorites.length === 0 ? (
                <div className="saved-empty">
                  <span className="saved-empty__icon" aria-hidden="true">🤍</span>
                  <h4>Nuk keni ende biznese të ruajtura</h4>
                  <p>Klikoni ikonën e zemrës ❤️ në çdo biznes për ta ruajtur këtu për qasje të shpejtë.</p>
                </div>
              ) : (
                <ul className="saved-items">
                  {favorites.map((biz) => (
                    <li key={biz.id} className="saved-item">
                      <div className="saved-item__info">
                        <h4 className="saved-item__name">
                          {biz.name}
                        </h4>
                        <span className="saved-item__meta">
                          {biz.category?.name || 'Kategori'} &bull; {biz.settlement?.name || 'Lipjan'}
                        </span>
                      </div>

                      <div className="saved-item__actions">
                        {onSelectBusiness && (
                          <button
                            type="button"
                            className="btn btn--sm btn--outline-primary"
                            onClick={() => {
                              onClose();
                              onSelectBusiness(biz.slug);
                            }}
                          >
                            Hap Profilin
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn--sm btn--ghost-danger"
                          onClick={() => handleRemoveFavorite(biz.id)}
                          title="Hiq nga të ruajturat"
                        >
                          Hiq ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* TAB 3: Change password */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="current-pw">Fjalëkalimi Aktual</label>
                <input
                  id="current-pw"
                  type="password"
                  className="form-control"
                  placeholder="Fjalëkalimi juaj i tanishëm"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-pw">Fjalëkalimi i Ri</label>
                <input
                  id="new-pw"
                  type="password"
                  className="form-control"
                  placeholder="Së paku 8 karaktere"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-pw-conf">Konfirmo Fjalëkalimin e Ri</label>
                <input
                  id="new-pw-conf"
                  type="password"
                  className="form-control"
                  placeholder="Përsëritni fjalëkalimin e ri"
                  value={newPasswordConfirmation}
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="profile-form__actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={submitting}
                >
                  {submitting ? 'Duke u ndryshuar...' : 'Përditëso Fjalëkalimin'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="user-profile-modal__footer">
          <button
            type="button"
            className="btn btn--danger-outline"
            onClick={() => {
              logout();
              onClose();
            }}
          >
            🚪 Dil nga Llogaria
          </button>
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Mbyll
          </button>
        </div>
      </div>
    </div>
  );
}
