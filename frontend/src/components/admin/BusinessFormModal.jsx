import { useState, useEffect } from 'react';
import { createAdminBusiness, updateAdminBusiness, ApiError } from '../../services/api';

/**
 * BusinessFormModal – Formular modal për krijimin dhe editimin e biznesit nga administratori.
 */
export default function BusinessFormModal({
  isOpen,
  onClose,
  business = null,
  categories = [],
  settlements = [],
  services = [],
  onSuccess,
}) {
  const isEdit = Boolean(business?.id);

  const [formData, setFormData] = useState({
    name: '',
    status: 'draft',
    category_id: '',
    settlement_id: '',
    short_description: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    latitude: '',
    longitude: '',
    is_featured: false,
    services: [],
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Inicializo formularin me të dhënat ekzistuese nëse është edit, ose bosh nëse është create
  useEffect(() => {
    if (!isOpen) return;

    if (business) {
      setFormData({
        name: business.name || '',
        status: business.status || 'draft',
        category_id: business.category_id || business.category?.id || (categories[0]?.id || ''),
        settlement_id: business.settlement_id || business.settlement?.id || (settlements[0]?.id || ''),
        short_description: business.short_description || '',
        description: business.description || '',
        phone: business.phone || '',
        email: business.email || '',
        website: business.website || '',
        address: business.address || '',
        latitude: business.latitude !== null && business.latitude !== undefined ? business.latitude : '',
        longitude: business.longitude !== null && business.longitude !== undefined ? business.longitude : '',
        is_featured: Boolean(business.is_featured),
        services: business.services ? business.services.map((s) => s.id) : [],
      });
    } else {
      setFormData({
        name: '',
        status: 'published',
        category_id: categories[0]?.id || '',
        settlement_id: settlements[0]?.id || '',
        short_description: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        latitude: '',
        longitude: '',
        is_featured: false,
        services: [],
      });
    }

    setErrors({});
    setGeneralError(null);
  }, [isOpen, business, categories, settlements]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Pastro gabimin për këtë fushë
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleServiceToggle(serviceId) {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceId);
      const updated = exists
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: updated };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGeneralError(null);

    // Përgatit payload-in
    const payload = {
      name: formData.name.trim(),
      category_id: Number(formData.category_id),
      settlement_id: Number(formData.settlement_id),
      status: formData.status,
      short_description: formData.short_description.trim() || null,
      description: formData.description.trim() || null,
      phone: formData.phone.trim() || null,
      email: formData.email.trim() || null,
      website: formData.website.trim() || null,
      address: formData.address.trim() || null,
      latitude: formData.latitude !== '' ? Number(formData.latitude) : null,
      longitude: formData.longitude !== '' ? Number(formData.longitude) : null,
      is_featured: Boolean(formData.is_featured),
      services: formData.services,
    };

    try {
      let result;
      if (isEdit) {
        result = await updateAdminBusiness(business.id, payload);
      } else {
        result = await createAdminBusiness(payload);
      }

      if (onSuccess) {
        onSuccess(result.data, isEdit);
      }
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setErrors(err.errors);
        setGeneralError(err.message || 'Ju lutem kontrolloni fushat me gabime.');
      } else {
        setGeneralError(err.message || 'Ndodhi një gabim gjatë ruajtjes së biznesit.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="business-modal-title"
    >
      <div className="admin-modal admin-modal--form">
        <div className="admin-modal__header">
          <div>
            <h2 id="business-modal-title" className="admin-modal__title">
              {isEdit ? `Edito Biznesin: ${business.name}` : 'Shto Biznes të Ri'}
            </h2>
            <p className="admin-modal__subtitle">
              {isEdit
                ? 'Përditëso të dhënat dhe shërbimet e biznesit ekzistues.'
                : 'Plotësoni të dhënat për regjistrimin e një biznesi të ri në katalog.'}
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

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-modal__body">
            {generalError && (
              <div className="admin-alert admin-alert--error" role="alert">
                <strong>Gabim gjatë validimit:</strong> {generalError}
              </div>
            )}

            {/* Seksioni 1: Informacioni Bazë */}
            <div className="admin-form-section">
              <h3 className="admin-form-section__title">1. Informacioni Bazë</h3>

              <div className="admin-form-grid admin-form-grid--2">
                <div className={`form-field ${errors.name ? 'has-error' : ''}`}>
                  <label htmlFor="field-name">
                    Emri i Biznesit <span className="req">*</span>
                  </label>
                  <input
                    id="field-name"
                    name="name"
                    type="text"
                    required
                    placeholder="p.sh. Restorant Tradita"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.name && <span className="field-error">{errors.name[0]}</span>}
                </div>

                <div className={`form-field ${errors.status ? 'has-error' : ''}`}>
                  <label htmlFor="field-status">
                    Statusi i Publikimit <span className="req">*</span>
                  </label>
                  <select
                    id="field-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="draft">Draft (Në përpunim)</option>
                    <option value="published">Published (I Publikuar)</option>
                    <option value="archived">Archived (I Arkivuar)</option>
                  </select>
                  {errors.status && <span className="field-error">{errors.status[0]}</span>}
                </div>
              </div>

              <div className="admin-form-grid admin-form-grid--2">
                <div className={`form-field ${errors.category_id ? 'has-error' : ''}`}>
                  <label htmlFor="field-category">
                    Kategoria <span className="req">*</span>
                  </label>
                  <select
                    id="field-category"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    disabled={submitting}
                    required
                  >
                    <option value="" disabled>Zgjidhni kategorinë</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <span className="field-error">{errors.category_id[0]}</span>}
                </div>

                <div className={`form-field ${errors.settlement_id ? 'has-error' : ''}`}>
                  <label htmlFor="field-settlement">
                    Vendbanimi (Lokacioni) <span className="req">*</span>
                  </label>
                  <select
                    id="field-settlement"
                    name="settlement_id"
                    value={formData.settlement_id}
                    onChange={handleChange}
                    disabled={submitting}
                    required
                  >
                    <option value="" disabled>Zgjidhni vendbanimin</option>
                    {settlements.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.settlement_id && <span className="field-error">{errors.settlement_id[0]}</span>}
                </div>
              </div>

              <div className={`form-field ${errors.short_description ? 'has-error' : ''}`}>
                <label htmlFor="field-short-desc">Përshkrimi i Shkurtër</label>
                <input
                  id="field-short-desc"
                  name="short_description"
                  type="text"
                  maxLength={255}
                  placeholder="Një fjali përmbledhëse për biznesin..."
                  value={formData.short_description}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {errors.short_description && (
                  <span className="field-error">{errors.short_description[0]}</span>
                )}
              </div>

              <div className={`form-field ${errors.description ? 'has-error' : ''}`}>
                <label htmlFor="field-desc">Përshkrimi i Plotë</label>
                <textarea
                  id="field-desc"
                  name="description"
                  rows={3}
                  placeholder="Përshkrim i hollësishëm i produkteve, historikut dhe ofertës..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {errors.description && <span className="field-error">{errors.description[0]}</span>}
              </div>

              <div className="form-field form-field--checkbox">
                <label className="checkbox-label" htmlFor="field-featured">
                  <input
                    id="field-featured"
                    name="is_featured"
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  <span>
                    ⭐ <strong>Biznes i Veçuar (Featured)</strong> — Shfaqet në krye të listës me theksim vizual
                  </span>
                </label>
              </div>
            </div>

            {/* Seksioni 2: Kontakti dhe Adresa */}
            <div className="admin-form-section">
              <h3 className="admin-form-section__title">2. Kontakti dhe Adresa</h3>

              <div className="admin-form-grid admin-form-grid--3">
                <div className={`form-field ${errors.phone ? 'has-error' : ''}`}>
                  <label htmlFor="field-phone">Telefoni</label>
                  <input
                    id="field-phone"
                    name="phone"
                    type="text"
                    placeholder="+383 44 123 456"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.phone && <span className="field-error">{errors.phone[0]}</span>}
                </div>

                <div className={`form-field ${errors.email ? 'has-error' : ''}`}>
                  <label htmlFor="field-email">Email</label>
                  <input
                    id="field-email"
                    name="email"
                    type="email"
                    placeholder="kontakt@biznesi.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.email && <span className="field-error">{errors.email[0]}</span>}
                </div>

                <div className={`form-field ${errors.website ? 'has-error' : ''}`}>
                  <label htmlFor="field-website">Website</label>
                  <input
                    id="field-website"
                    name="website"
                    type="text"
                    placeholder="https://biznesi.com"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.website && <span className="field-error">{errors.website[0]}</span>}
                </div>
              </div>

              <div className={`form-field ${errors.address ? 'has-error' : ''}`}>
                <label htmlFor="field-address">Adresa Fizike</label>
                <input
                  id="field-address"
                  name="address"
                  type="text"
                  placeholder="p.sh. Rruga Adem Jashari, Lipjan"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {errors.address && <span className="field-error">{errors.address[0]}</span>}
              </div>

              <div className="admin-form-grid admin-form-grid--2">
                <div className={`form-field ${errors.latitude ? 'has-error' : ''}`}>
                  <label htmlFor="field-lat">Gjerësia Gjeografike (Latitude)</label>
                  <input
                    id="field-lat"
                    name="latitude"
                    type="number"
                    step="any"
                    placeholder="42.5217"
                    value={formData.latitude}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.latitude && <span className="field-error">{errors.latitude[0]}</span>}
                </div>

                <div className={`form-field ${errors.longitude ? 'has-error' : ''}`}>
                  <label htmlFor="field-lng">Gjatësia Gjeografike (Longitude)</label>
                  <input
                    id="field-lng"
                    name="longitude"
                    type="number"
                    step="any"
                    placeholder="21.1258"
                    value={formData.longitude}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.longitude && <span className="field-error">{errors.longitude[0]}</span>}
                </div>
              </div>
            </div>

            {/* Seksioni 3: Shërbimet e Biznesit */}
            <div className="admin-form-section">
              <h3 className="admin-form-section__title">3. Shërbimet & Komoditetet</h3>
              <p className="admin-form-section__hint">
                Përzgjidhni shërbimet që ky biznes ofron për qytetarët e Lipjanit:
              </p>

              <div className="admin-services-checkbox-grid">
                {services.map((srv) => {
                  const isChecked = formData.services.includes(srv.id);
                  return (
                    <label
                      key={srv.id}
                      className={`admin-service-checkbox ${isChecked ? 'is-checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleServiceToggle(srv.id)}
                        disabled={submitting}
                      />
                      <span className="admin-service-checkbox__name">{srv.name}</span>
                    </label>
                  );
                })}
              </div>
              {errors.services && <span className="field-error">{errors.services[0]}</span>}
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
              {submitting
                ? 'Duke ruajtur të dhënat...'
                : isEdit
                ? 'Ruaj Ndryshimet'
                : 'Krijo Biznesin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
