import { useState, useEffect, useCallback } from 'react';
import AdvertisementFormModal from './AdvertisementFormModal';
import {
  fetchAdminAdvertisements,
  createAdminAdvertisement,
  updateAdminAdvertisement,
  toggleAdminAdvertisement,
  deleteAdminAdvertisement,
} from '../../services/api';

export default function AdminAdvertisementsTab() {
  const [ads, setAds] = useState([]);
  const [counts, setCounts] = useState({
    all: 0,
    active: 0,
    scheduled: 0,
    expired: 0,
    draft: 0,
    disabled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [deletingAd, setDeletingAd] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [successBanner, setSuccessBanner] = useState(null);

  const loadAds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminAdvertisements({
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        position: positionFilter || undefined,
        per_page: 50,
      });

      setAds(res.data || []);
      if (res.counts) {
        setCounts(res.counts);
      }
    } catch (err) {
      setError(err.message || 'Dështoi ngarkimi i reklamave.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, positionFilter]);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  const handleCreateNew = () => {
    setEditingAd(null);
    setModalError(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setModalError(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    setModalError(null);
    try {
      if (editingAd) {
        await updateAdminAdvertisement(editingAd.id, formData);
        setSuccessBanner(`Reklama '${formData.title}' u përditësua me sukses.`);
      } else {
        await createAdminAdvertisement(formData);
        setSuccessBanner(`Reklama '${formData.title}' u krijua me sukses.`);
      }
      setIsFormModalOpen(false);
      loadAds();
    } catch (err) {
      setModalError(err.message || 'Ndodhi një gabim gjatë ruajtjes së reklamës.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (ad) => {
    try {
      await toggleAdminAdvertisement(ad.id, { is_active: !ad.is_active });
      loadAds();
    } catch (err) {
      alert(`Dështoi ndryshimi i gjendjes: ${err.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAd) return;
    setSubmitting(true);
    try {
      await deleteAdminAdvertisement(deletingAd.id);
      setSuccessBanner(`Reklama '${deletingAd.title}' u fshi me sukses.`);
      setDeletingAd(null);
      loadAds();
    } catch (err) {
      alert(`Dështoi fshirja: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-ads-tab" aria-label="Menaxhimi i Reklamave">
      {/* 1. KARTAT E STATISTIKAVE */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-card__icon" aria-hidden="true">📢</span>
          <div className="admin-stat-card__data">
            <span className="admin-stat-card__value">{counts.all}</span>
            <span className="admin-stat-card__label">Gjithsej Reklama</span>
          </div>
        </div>

        <div className="admin-stat-card admin-stat-card--success">
          <span className="admin-stat-card__icon" aria-hidden="true">🟢</span>
          <div className="admin-stat-card__data">
            <span className="admin-stat-card__value">{counts.active}</span>
            <span className="admin-stat-card__label">Aktive Tani</span>
          </div>
        </div>

        <div className="admin-stat-card admin-stat-card--info">
          <span className="admin-stat-card__icon" aria-hidden="true">⏳</span>
          <div className="admin-stat-card__data">
            <span className="admin-stat-card__value">{counts.scheduled}</span>
            <span className="admin-stat-card__label">Të Planifikuara</span>
          </div>
        </div>

        <div className="admin-stat-card admin-stat-card--warning">
          <span className="admin-stat-card__icon" aria-hidden="true">⚠️</span>
          <div className="admin-stat-card__data">
            <span className="admin-stat-card__value">{counts.expired}</span>
            <span className="admin-stat-card__label">Të Skaduara</span>
          </div>
        </div>

        <div className="admin-stat-card admin-stat-card--secondary">
          <span className="admin-stat-card__icon" aria-hidden="true">🛑</span>
          <div className="admin-stat-card__data">
            <span className="admin-stat-card__value">{counts.disabled + counts.draft}</span>
            <span className="admin-stat-card__label">Draft / Çaktivizuar</span>
          </div>
        </div>
      </div>

      {successBanner && (
        <div className="admin-alert admin-alert--success" role="status">
          ✓ {successBanner}
          <button
            type="button"
            className="alert-close-btn"
            onClick={() => setSuccessBanner(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. SHIRITI I VEPRIMEVE DHE FILTRAVE */}
      <div className="admin-actions-bar">
        <div className="admin-search-wrap">
          <span className="admin-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="form-control"
            placeholder="Kërko reklamë ose biznes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filters-wrap">
          <select
            className="form-control"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="">Të gjitha pozicionet</option>
            <option value="homepage_featured">Homepage Featured</option>
            <option value="sponsored_businesses">Sponsored Businesses</option>
            <option value="category_promotion">Category Promotion</option>
            <option value="sidebar_banner">Sidebar Banner</option>
          </select>

          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Të gjitha statuset</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
            <option value="disabled">Disabled</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn--primary"
          onClick={handleCreateNew}
        >
          ➕ Shto Reklamë të Re
        </button>
      </div>

      {/* 3. TABELA E REKLAMAVE */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading-state">
            <div className="spinner"></div>
            <p>Duke ngarkuar reklamat...</p>
          </div>
        ) : error ? (
          <div className="admin-error-state">
            <p>⚠️ {error}</p>
            <button type="button" className="btn btn--secondary" onClick={loadAds}>
              Provo sërish
            </button>
          </div>
        ) : ads.length === 0 ? (
          <div className="admin-empty-state">
            <p>Nuk u gjet asnjë reklamë sipas filtrave të zgjedhur.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reklama &amp; Biznesi</th>
                <th>Pozicioni</th>
                <th>Periudha e Vlefshmërisë</th>
                <th>Statusi Efektiv</th>
                <th>Statistika</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => {
                const effStatus = ad.effective_status || ad.status;
                return (
                  <tr key={ad.id}>
                    <td>
                      <div className="ad-table-title-group">
                        <strong className="ad-table-title">{ad.title}</strong>
                        <span className="ad-table-business">
                          🏢 {ad.business?.name || 'Biznes i fshirë'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="position-pill">
                        {ad.position === 'homepage_featured' && '🌟 Kryefaqe'}
                        {ad.position === 'sponsored_businesses' && '★ E Sponsorizuar'}
                        {ad.position === 'category_promotion' && '📁 Kategori'}
                        {ad.position === 'sidebar_banner' && '📌 Anësore'}
                      </span>
                    </td>

                    <td>
                      <div className="schedule-meta">
                        <span className="schedule-date">
                          📅 {ad.start_at ? new Date(ad.start_at).toLocaleDateString() : 'Menjëherë'}
                        </span>
                        <span className="schedule-date">
                          🏁 {ad.end_at ? new Date(ad.end_at).toLocaleDateString() : 'Pa afat'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className={`status-badge status-badge--${effStatus}`}>
                        {effStatus === 'active' && '🟢 Aktive'}
                        {effStatus === 'scheduled' && '⏳ E Planifikuar'}
                        {effStatus === 'draft' && '📝 Draft'}
                        {effStatus === 'disabled' && '🛑 E Çaktivizuar'}
                        {effStatus === 'expired' && '⚠️ E Skaduar'}
                      </span>
                    </td>

                    <td>
                      <div className="ad-stats-meta">
                        <span>👆 {ad.clicks || 0} klikime</span>
                        <span className="text-muted">👁️ {ad.impressions || 0} shikime</span>
                      </div>
                    </td>

                    <td>
                      <div className="table-action-btns">
                        <button
                          type="button"
                          className={`btn-action ${ad.is_active ? 'btn-action--warning' : 'btn-action--success'}`}
                          onClick={() => handleToggleActive(ad)}
                          title={ad.is_active ? 'Çaktivizo reklamën' : 'Aktivizo reklamën'}
                        >
                          {ad.is_active ? 'Çaktivizo' : 'Aktivizo'}
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-action--edit"
                          onClick={() => handleEdit(ad)}
                          title="Redakto reklamën"
                        >
                          Ndrysho
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-action--delete"
                          onClick={() => setDeletingAd(ad)}
                          title="Fshij reklamën"
                        >
                          Fshij
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL: Shto / Ndrysho Reklamë */}
      <AdvertisementFormModal
        isOpen={isFormModalOpen}
        ad={editingAd}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        submitting={submitting}
        error={modalError}
      />

      {/* MODAL: Konfirmo Fshirjen */}
      {deletingAd && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal admin-modal--confirm">
            <div className="admin-modal__header admin-modal__header--danger">
              <h2 className="admin-modal__title">Konfirmo Fshirjen e Reklamës</h2>
              <button
                type="button"
                className="admin-modal__close-btn"
                onClick={() => setDeletingAd(null)}
              >
                ✕
              </button>
            </div>
            <div className="admin-modal__body">
              <p>
                A jeni i sigurt që dëshironi të fshini reklamën{' '}
                <strong>«{deletingAd.title}»</strong>?
              </p>
              <p className="admin-confirm-subtext">
                Ky veprim fshin përfundimisht të dhënat dhe statistikat e kësaj reklame.
              </p>
            </div>
            <div className="admin-modal__footer">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setDeletingAd(null)}
                disabled={submitting}
              >
                Anulo
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={handleDeleteConfirm}
                disabled={submitting}
              >
                {submitting ? 'Duke u fshirë...' : 'Po, Fshije'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
