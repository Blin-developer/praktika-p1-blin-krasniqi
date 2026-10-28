import { useState, useEffect } from 'react';
import { fetchAdminBusinesses, fetchBusinesses } from '../../services/api';

export default function AdvertisementFormModal({
  isOpen,
  ad = null,
  onClose,
  onSubmit,
  submitting = false,
  error = null,
}) {
  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);

  const [formData, setFormData] = useState({
    business_id: '',
    title: '',
    description: '',
    image_url: '',
    cta_text: 'Shiko biznesin',
    cta_url: '',
    position: 'homepage_featured',
    status: 'active',
    start_at: '',
    end_at: '',
    is_active: true,
    priority: 0,
  });

  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setLoadingBusinesses(true);
      fetchAdminBusinesses({ per_page: 100 })
        .then((res) => {
          setBusinesses(res.data || []);
        })
        .catch(() => {
          fetchBusinesses()
            .then((res) => setBusinesses(res.data || []))
            .catch(() => setBusinesses([]));
        })
        .finally(() => setLoadingBusinesses(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (ad) {
      setFormData({
        business_id: ad.business_id || '',
        title: ad.title || '',
        description: ad.description || '',
        image_url: ad.image_url || '',
        cta_text: ad.cta_text || 'Shiko biznesin',
        cta_url: ad.cta_url || '',
        position: ad.position || 'homepage_featured',
        status: ad.status || 'active',
        start_at: ad.start_at ? ad.start_at.slice(0, 16) : '',
        end_at: ad.end_at ? ad.end_at.slice(0, 16) : '',
        is_active: ad.is_active ?? true,
        priority: ad.priority || 0,
      });
    } else {
      setFormData({
        business_id: '',
        title: '',
        description: '',
        image_url: '',
        cta_text: 'Shiko biznesin',
        cta_url: '',
        position: 'homepage_featured',
        status: 'active',
        start_at: '',
        end_at: '',
        is_active: true,
        priority: 0,
      });
    }
    setClientErrors({});
  }, [ad, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (clientErrors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!formData.business_id) errs.business_id = 'Ju lutem përzgjidhni një biznes.';
    if (!formData.title.trim()) errs.title = 'Titulli i reklamës është i detyrueshëm.';
    if (!formData.position) errs.position = 'Zgjedhja e pozicionit është e detyrueshme.';
    if (formData.start_at && formData.end_at && formData.start_at > formData.end_at) {
      errs.end_at = 'Data e përfundimit duhet të jetë pas datës së fillimit.';
    }

    if (Object.keys(errs).length > 0) {
      setClientErrors(errs);
      return;
    }

    onSubmit({
      ...formData,
      business_id: Number(formData.business_id),
      priority: Number(formData.priority) || 0,
      start_at: formData.start_at ? formData.start_at.replace('T', ' ') : null,
      end_at: formData.end_at ? formData.end_at.replace('T', ' ') : null,
    });
  };

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ad-modal-title">
      <div className="admin-modal admin-modal--lg">
        <div className="admin-modal__header">
          <h2 id="ad-modal-title" className="admin-modal__title">
            {ad ? 'Përditëso Reklamën' : 'Krijo Reklamë të Re'}
          </h2>
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

        <form onSubmit={handleSubmit} className="admin-modal__form">
          <div className="admin-modal__body">
            {error && (
              <div className="admin-alert admin-alert--error" role="alert">
                <strong>Gabim:</strong> {error}
              </div>
            )}

            <div className="form-grid form-grid--2col">
              {/* Biznesi i lidhur */}
              <div className="form-group">
                <label htmlFor="ad-business">Biznesi i Lidhur *</label>
                <select
                  id="ad-business"
                  className="form-control"
                  value={formData.business_id}
                  onChange={(e) => handleChange('business_id', e.target.value)}
                  disabled={submitting || loadingBusinesses}
                  required
                >
                  <option value="">-- Përzgjidhni biznesin --</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.settlement?.name || 'Lipjan'})
                    </option>
                  ))}
                </select>
                {clientErrors.business_id && (
                  <span className="form-error">{clientErrors.business_id}</span>
                )}
              </div>

              {/* Pozicioni */}
              <div className="form-group">
                <label htmlFor="ad-position">Pozicioni i Reklamës *</label>
                <select
                  id="ad-position"
                  className="form-control"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  disabled={submitting}
                  required
                >
                  <option value="homepage_featured">Homepage Featured (Banner i Spikatur)</option>
                  <option value="sponsored_businesses">Sponsored Businesses (Listë e Sponsorizuar)</option>
                  <option value="category_promotion">Category Promotion (Promovim sipas Kategorisë)</option>
                  <option value="sidebar_banner">Sidebar Banner (Shirit Anësor në Katalog)</option>
                </select>
                {clientErrors.position && (
                  <span className="form-error">{clientErrors.position}</span>
                )}
              </div>
            </div>

            {/* Titulli */}
            <div className="form-group">
              <label htmlFor="ad-title">Titulli i Reklamës *</label>
              <input
                id="ad-title"
                type="text"
                className="form-control"
                placeholder="p.sh. Pica Falas çdo të premte"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                disabled={submitting}
                maxLength={150}
                required
              />
              {clientErrors.title && (
                <span className="form-error">{clientErrors.title}</span>
              )}
            </div>

            {/* Përshkrimi */}
            <div className="form-group">
              <label htmlFor="ad-desc">Përshkrimi i Shkurtër Promovues</label>
              <textarea
                id="ad-desc"
                className="form-control"
                rows={2}
                placeholder="Tekst tërheqës dhe i qartë për vizitorët..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-grid form-grid--2col">
              {/* URL e Imazhit */}
              <div className="form-group">
                <label htmlFor="ad-image">URL e Imazhit Promovues</label>
                <input
                  id="ad-image"
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Butoni CTA */}
              <div className="form-group">
                <label htmlFor="ad-cta">Teksti i Butonit (CTA)</label>
                <input
                  id="ad-cta"
                  type="text"
                  className="form-control"
                  placeholder="Shiko biznesin"
                  value={formData.cta_text}
                  onChange={(e) => handleChange('cta_text', e.target.value)}
                  disabled={submitting}
                  maxLength={60}
                />
              </div>
            </div>

            <div className="form-grid form-grid--2col">
              {/* URL e Destinacionit CTA */}
              <div className="form-group">
                <label htmlFor="ad-cta-url">URL e Destinacionit (CTA Link)</label>
                <input
                  id="ad-cta-url"
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/oferta-speciale"
                  value={formData.cta_url}
                  onChange={(e) => handleChange('cta_url', e.target.value)}
                  disabled={submitting}
                  maxLength={500}
                />
              </div>

              {/* Prioriteti */}
              <div className="form-group">
                <label htmlFor="ad-priority">Prioriteti i Shfaqjes</label>
                <input
                  id="ad-priority"
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  disabled={submitting}
                  min={0}
                  max={100}
                />
                <small className="form-hint">Numër më i lartë = prioritet më i lartë në shfaqje</small>
              </div>
            </div>

            <div className="form-grid form-grid--3col">
              {/* Statusi */}
              <div className="form-group">
                <label htmlFor="ad-status">Statusi</label>
                <select
                  id="ad-status"
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  disabled={submitting}
                >
                  <option value="active">Active (Aktiv)</option>
                  <option value="scheduled">Scheduled (I Planifikuar)</option>
                  <option value="draft">Draft (Në përgatitje)</option>
                  <option value="disabled">Disabled (I Çaktivizuar)</option>
                  <option value="expired">Expired (I Skaduar)</option>
                </select>
              </div>

              {/* Data e Fillimit */}
              <div className="form-group">
                <label htmlFor="ad-start">Data &amp; Ora e Fillimit</label>
                <input
                  id="ad-start"
                  type="datetime-local"
                  className="form-control"
                  value={formData.start_at}
                  onChange={(e) => handleChange('start_at', e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Data e Përfundimit */}
              <div className="form-group">
                <label htmlFor="ad-end">Data &amp; Ora e Përfundimit</label>
                <input
                  id="ad-end"
                  type="datetime-local"
                  className="form-control"
                  value={formData.end_at}
                  onChange={(e) => handleChange('end_at', e.target.value)}
                  disabled={submitting}
                />
                {clientErrors.end_at && (
                  <span className="form-error">{clientErrors.end_at}</span>
                )}
              </div>
            </div>

            {/* Checkbox aktiv */}
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  disabled={submitting}
                />
                <span>Reklama është aktive për shfaqje</span>
              </label>
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
              {submitting ? 'Duke u ruajtur...' : ad ? 'Ruaj Ndryshimet' : 'Krijo Reklamën'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
