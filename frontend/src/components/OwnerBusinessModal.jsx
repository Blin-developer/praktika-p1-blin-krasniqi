import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { fetchServices, updateOwnedBusiness } from '../services/api';

/**
 * Ndihmës për pastrim teksti
 */
function clean(val) {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

/**
 * OwnerBusinessModal – Dritare modale për vetë-menaxhimin e të dhënave nga pronari i verifikuar.
 */
export default function OwnerBusinessModal({
  isOpen,
  onClose,
  business,
  onBusinessUpdated,
}) {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    website: '',
    address: '',
    short_description: '',
    description: '',
    monday_friday: '',
    saturday_sunday: '',
    services: [],
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !business) return;

    const hours = business.opening_hours || {};
    setFormData({
      phone: clean(business.phone),
      email: clean(business.email),
      website: clean(business.website),
      address: clean(business.address),
      short_description: clean(business.short_description),
      description: clean(business.description),
      monday_friday: clean(hours.monday_friday || hours.monday_saturday || '08:00 - 20:00'),
      saturday_sunday: clean(hours.saturday_sunday || hours.sunday || '09:00 - 18:00'),
      services: Array.isArray(business.services) ? business.services.map((s) => s.id) : [],
    });
    setError(null);
    setSuccess(false);

    // Ngarko shërbimet e disponueshme
    setLoadingServices(true);
    fetchServices()
      .then((res) => setAvailableServices(res.data || []))
      .catch(() => setAvailableServices([]))
      .finally(() => setLoadingServices(false));
  }, [isOpen, business]);

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

  if (!isOpen || !business) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceId);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((id) => id !== serviceId)
          : [...prev.services, serviceId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        website: formData.website.trim() || null,
        address: formData.address.trim() || null,
        short_description: formData.short_description.trim() || null,
        description: formData.description.trim() || null,
        opening_hours: {
          monday_friday: formData.monday_friday.trim() || undefined,
          saturday_sunday: formData.saturday_sunday.trim() || undefined,
        },
        services: formData.services,
      };

      const res = await updateOwnedBusiness(business.id, payload);
      setSuccess(true);
      if (onBusinessUpdated) {
        onBusinessUpdated(res.data);
      }
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      setError(err.message || 'Ndodhi një gabim gjatë përditësimit.');
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div className="admin-modal admin-modal--form" style={{ maxWidth: '680px' }}>
        <div className="admin-modal__header">
          <div>
            <h2 id="owner-modal-title" className="admin-modal__title">
              🏢 Menaxhoni Biznesin Tuaj
            </h2>
            <p className="admin-modal__subtitle">
              Përditësoni oraret, kontaktet dhe shërbimet për: <strong>{business.name}</strong>
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

        <form onSubmit={handleSubmit} className="admin-form" noValidate>
          <div className="admin-modal__body">
            {success && (
              <div className="admin-alert admin-alert--success" style={{ marginBottom: '1.25rem', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}>
                ✓ Të dhënat e biznesit u ruajtën me sukses!
              </div>
            )}

            {error && (
              <div className="admin-alert admin-alert--error" style={{ marginBottom: '1.25rem' }} role="alert">
                ⚠️ {error}
              </div>
            )}

            {/* Seksioni 1: Kontakti & Adresa */}
            <div className="admin-form-section">
              <h3 className="admin-form-section__title">1. Kontakti dhe Adresa Fizike</h3>
              <div className="admin-form-grid admin-form-grid--2">
                <div className="form-field">
                  <label htmlFor="owner-phone">Numri i Telefonit</label>
                  <input
                    id="owner-phone"
                    name="phone"
                    type="tel"
                    placeholder="+383 44 123 456"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="owner-email">Email Zyrtar</label>
                  <input
                    id="owner-email"
                    name="email"
                    type="email"
                    placeholder="kontakt@biznesi.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="admin-form-grid admin-form-grid--2" style={{ marginTop: '0.75rem' }}>
                <div className="form-field">
                  <label htmlFor="owner-website">Uebfaqja (Website)</label>
                  <input
                    id="owner-website"
                    name="website"
                    type="url"
                    placeholder="https://biznesi.com"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="owner-address">Adresa Fizike</label>
                  <input
                    id="owner-address"
                    name="address"
                    type="text"
                    placeholder="p.sh. Rruga Fehmi Lladrovci, Lipjan"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            {/* Seksioni 2: Orari i Punës */}
            <div className="admin-form-section" style={{ marginTop: '1.25rem' }}>
              <h3 className="admin-form-section__title">2. Orari Javor i Punës</h3>
              <div className="admin-form-grid admin-form-grid--2">
                <div className="form-field">
                  <label htmlFor="owner-hours-mf">E Hënë – E Premte</label>
                  <input
                    id="owner-hours-mf"
                    name="monday_friday"
                    type="text"
                    placeholder="08:00 - 20:00"
                    value={formData.monday_friday}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="owner-hours-ss">E Shtunë – E Diel</label>
                  <input
                    id="owner-hours-ss"
                    name="saturday_sunday"
                    type="text"
                    placeholder="09:00 - 18:00 (ose Mbyllur)"
                    value={formData.saturday_sunday}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            {/* Seksioni 3: Përshkrimi */}
            <div className="admin-form-section" style={{ marginTop: '1.25rem' }}>
              <h3 className="admin-form-section__title">3. Përshkrimi i Biznesit</h3>
              <div className="form-field">
                <label htmlFor="owner-short-desc">Përshkrim i Shkurtër (përmbledhës)</label>
                <input
                  id="owner-short-desc"
                  name="short_description"
                  type="text"
                  placeholder="Një fjali prezantuese që shfaqet në kartelat e katalogut..."
                  value={formData.short_description}
                  onChange={handleChange}
                  maxLength={500}
                  disabled={submitting}
                />
              </div>

              <div className="form-field" style={{ marginTop: '0.75rem' }}>
                <label htmlFor="owner-desc">Përshkrim i Plotë dhe Historia</label>
                <textarea
                  id="owner-desc"
                  name="description"
                  rows={4}
                  placeholder="Përshkruani gamën e plotë të produkteve, historinë, ofertat dhe avantazhet e biznesit tuaj..."
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={5000}
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Seksioni 4: Shërbimet / Lehtësirat */}
            <div className="admin-form-section" style={{ marginTop: '1.25rem' }}>
              <h3 className="admin-form-section__title">4. Shërbimet &amp; Lehtësirat e Ofrura</h3>
              {loadingServices ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Duke ngarkuar shërbimet...</p>
              ) : (
                <div className="admin-services-checkbox-grid">
                  {availableServices.map((svc) => {
                    const isChecked = formData.services.includes(svc.id);
                    return (
                      <label
                        key={svc.id}
                        className={`admin-service-checkbox ${isChecked ? 'is-checked' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleServiceToggle(svc.id)}
                          disabled={submitting}
                        />
                        <span className="admin-service-checkbox__name">{svc.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="admin-modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Mbyll
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? 'Duke ruajtur ndryshimet...' : 'Ruaj Ndryshimet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

