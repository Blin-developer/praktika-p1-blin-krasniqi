import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { submitBusinessClaim } from '../services/api';
import { useAuth } from '../hooks/useAuth';

/**
 * BusinessClaimModal – Formular modal për kërkesën e pronësisë së biznesit ("Claim Business").
 */
export default function BusinessClaimModal({
  isOpen,
  onClose,
  business,
  onClaimSubmitted,
}) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    phone: '',
    email: user?.email || '',
    business_role: 'Pronar',
    verification_notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        full_name: user?.name || '',
        phone: '',
        email: user?.email || '',
        business_role: 'Pronar',
        verification_notes: '',
      });
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.full_name.trim()) {
      setError('Ju lutem plotësoni emrin dhe mbiemrin.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Ju lutem jepni numrin e telefonit për verifikim.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Ju lutem jepni email adresën tuaj.');
      return;
    }
    if (!formData.verification_notes.trim()) {
      setError('Ju lutem jepni dëshmi ose Numrin Unik Identifikues (NUI) të ARBK-së.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitBusinessClaim(business.slug || business.id, formData);
      setSuccess(true);
      if (onClaimSubmitted) {
        onClaimSubmitted(res.data);
      }
    } catch (err) {
      setError(err.message || 'Ndodhi një gabim gjatë dërgimit të kërkesës.');
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div className="admin-modal admin-modal--form" style={{ maxWidth: '580px' }}>
        <div className="admin-modal__header">
          <div>
            <h2 id="claim-modal-title" className="admin-modal__title">
              🏢 Kërkoni Pronësinë e Biznesit
            </h2>
            <p className="admin-modal__subtitle">
              Për biznesin: <strong>{business?.name}</strong>
            </p>
          </div>
          <button
            type="button"
            className="admin-modal__close-btn"
            onClick={onClose}
            disabled={submitting}
            aria-label="Mbyll"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="admin-modal__body" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.25rem', color: '#166534', margin: '0 0 0.5rem 0' }}>
              Kërkesa u Dërgua me Sukses!
            </h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
              Faleminderit! Kërkesa juaj për verifikimin e pronësisë së <strong>{business?.name}</strong> iu dërgua administratorëve të Komunës së Lipjanit. Pas verifikimit të dokumenteve, do të mund të përditësoni oraret, fotot dhe të dhënat drejtpërdrejt.
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={onClose}
            >
              Në rregull, Mbyll
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="admin-form" noValidate>
            <div className="admin-modal__body">
              <div className="admin-alert admin-alert--info" style={{ marginBottom: '1.25rem', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' }}>
                ℹ️ Plotësoni të dhënat tuaja të sakta. Stafi i komunës do të verifikojë autorizimin tuaj para se t'ju kalojë kontrollin mbi të dhënat e këtij biznesi.
              </div>

              {error && (
                <div className="admin-alert admin-alert--error" style={{ marginBottom: '1.25rem' }} role="alert">
                  ⚠️ {error}
                </div>
              )}

              <div className="admin-form-grid admin-form-grid--2">
                <div className="form-field">
                  <label htmlFor="claim-full-name">
                    Emri dhe Mbiemri <span className="req">*</span>
                  </label>
                  <input
                    id="claim-full-name"
                    name="full_name"
                    type="text"
                    required
                    placeholder="p.sh. Agim Krasniqi"
                    value={formData.full_name}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="claim-role">
                    Roli juaj në Biznes <span className="req">*</span>
                  </label>
                  <select
                    id="claim-role"
                    name="business_role"
                    value={formData.business_role}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="Pronar">Pronar / Bashkëpronar</option>
                    <option value="Drejtor">Drejtor Ekzekutiv</option>
                    <option value="Menaxher">Menaxher i Autorizuar</option>
                    <option value="Përfaqësues">Përfaqësues Ligjor</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-grid admin-form-grid--2" style={{ marginTop: '0.75rem' }}>
                <div className="form-field">
                  <label htmlFor="claim-phone">
                    Numri i Telefonit <span className="req">*</span>
                  </label>
                  <input
                    id="claim-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+383 44 123 456"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="claim-email">
                    Email Adresa <span className="req">*</span>
                  </label>
                  <input
                    id="claim-email"
                    name="email"
                    type="email"
                    required
                    placeholder="pronari@biznesi.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginTop: '0.75rem' }}>
                <label htmlFor="claim-notes">
                  Dëshmia e Pronësisë / NUI i ARBK-së <span className="req">*</span>
                </label>
                <textarea
                  id="claim-notes"
                  name="verification_notes"
                  rows={4}
                  required
                  placeholder="Shënoni Numrin Unik Identifikues (NUI), numrin e certifikatës së regjistrimit të biznesit, ose të dhëna të tjera që dëshmojnë përfaqësimin tuaj zyrtar..."
                  value={formData.verification_notes}
                  onChange={handleChange}
                  disabled={submitting}
                />
                <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Këto të dhëna shqyrtohen vetëm nga administratori për qëllime verifikimi.
                </span>
              </div>
            </div>

            <div className="admin-modal__footer">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Anulo
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={submitting}
              >
                {submitting ? 'Duke dërguar kërkesën...' : 'Dërgo Kërkesën për Verifikim'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

