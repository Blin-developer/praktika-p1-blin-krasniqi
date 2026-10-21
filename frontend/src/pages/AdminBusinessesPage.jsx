import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import BusinessFormModal from '../components/admin/BusinessFormModal';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';
import {
  fetchAdminBusinesses,
  updateAdminBusinessStatus,
  deleteAdminBusiness,
  fetchCategories,
  fetchSettlements,
  fetchServices,
} from '../services/api';

/**
 * AdminBusinessesPage – Faqja kryesore administrative për menaxhimin e bizneseve (Java 3, Dita 2).
 */
export default function AdminBusinessesPage({ onNavigateToCatalog }) {
  // Filtrat dhe kërkimi
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [settlementFilter, setSettlementFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Të dhënat e API
  const [businesses, setBusinesses] = useState([]);
  const [counts, setCounts] = useState({ all: 0, published: 0, draft: 0, archived: 0 });
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Të dhëna mbështetëse (kategoritë, vendbanimet, shërbimet)
  const [categories, setCategories] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [services, setServices] = useState([]);

  // Njoftimet (Feedback alerts)
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // Gjendjet e modaleve
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingBusiness, setDeletingBusiness] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Status updating loader id
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Debounce kërkimin për 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Kthehu në faqen e parë kur kërkohet
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Ngarko kategoritë, vendbanimet dhe shërbimet
  useEffect(() => {
    Promise.all([fetchCategories(), fetchSettlements(), fetchServices()])
      .then(([catRes, setRes, srvRes]) => {
        setCategories(catRes.data || []);
        setSettlements(setRes.data || []);
        setServices(srvRes.data || []);
      })
      .catch((err) => {
        console.error('Gabim gjatë ngarkimit të meta-të dhënave:', err);
      });
  }, []);

  // Ngarko bizneset nga API
  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAdminBusinesses({
        search: debouncedSearch.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category_id: categoryFilter || undefined,
        settlement_id: settlementFilter || undefined,
        page,
        per_page: perPage,
      });

      setBusinesses(response.data || []);
      if (response.counts) {
        setCounts(response.counts);
      }
      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (err) {
      setError(err.message || 'Dështoi ngarkimi i listës së bizneseve.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, categoryFilter, settlementFilter, page]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  // Shfaq mesazh feedback për 4 sekonda
  function showFeedback(type, message) {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4500);
  }

  // Ndryshimi i shpejtë i statusit
  async function handleQuickStatusChange(business, newStatus) {
    if (business.status === newStatus) return;
    setUpdatingStatusId(business.id);
    try {
      await updateAdminBusinessStatus(business.id, newStatus);
      showFeedback('success', `Statusi i biznesit «${business.name}» u ndryshua me sukses në «${newStatus}».`);
      loadBusinesses();
    } catch (err) {
      showFeedback('error', `Gabim gjatë ndryshimit të statusit: ${err.message}`);
    } finally {
      setUpdatingStatusId(null);
    }
  }

  // Hap modalin për shtim
  function handleOpenCreate() {
    setEditingBusiness(null);
    setFormModalOpen(true);
  }

  // Hap modalin për editim
  function handleOpenEdit(business) {
    setEditingBusiness(business);
    setFormModalOpen(true);
  }

  // Sukses pas ruajtjes nga modali
  function handleFormSuccess(savedBusiness, isEdit) {
    showFeedback(
      'success',
      isEdit
        ? `Biznesi «${savedBusiness.name}» u përditësua me sukses.`
        : `Biznesi i ri «${savedBusiness.name}» u krijua me sukses!`
    );
    loadBusinesses();
  }

  // Hap modalin e fshirjes
  function handleOpenDelete(business) {
    setDeletingBusiness(business);
    setDeleteError(null);
    setDeleteModalOpen(true);
  }

  // Konfirmo fshirjen
  async function handleConfirmDelete() {
    if (!deletingBusiness) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAdminBusiness(deletingBusiness.id);
      showFeedback('success', `Biznesi «${deletingBusiness.name}» u fshi me sukses.`);
      setDeleteModalOpen(false);
      setDeletingBusiness(null);
      loadBusinesses();
    } catch (err) {
      setDeleteError(err.message || 'Ndodhi një gabim gjatë fshirjes.');
    } finally {
      setDeleting(false);
    }
  }

  // Pastro filtrat
  function handleResetFilters() {
    setSearch('');
    setDebouncedSearch('');
    setStatusFilter('all');
    setCategoryFilter('');
    setSettlementFilter('');
    setPage(1);
  }

  return (
    <AdminLayout activeTab="businesses" onNavigateToCatalog={onNavigateToCatalog}>
      <div className="admin-businesses-container">
        {/* Banner njoftimi për feedback */}
        {feedback && (
          <div className={`admin-notification admin-notification--${feedback.type}`} role="alert">
            <span className="admin-notification__icon">
              {feedback.type === 'success' ? '✓' : '✗'}
            </span>
            <span className="admin-notification__text">{feedback.message}</span>
            <button
              type="button"
              className="admin-notification__close"
              onClick={() => setFeedback(null)}
              aria-label="Mbyll njoftimin"
            >
              ✕
            </button>
          </div>
        )}

        {/* Kokë faqes me titull dhe butonin e shtimit */}
        <div className="admin-page-header">
          <div>
            <h2 className="admin-page-header__title">Menaxhimi i Bizneseve</h2>
            <p className="admin-page-header__subtitle">
              Regjistri zyrtar i bizneseve të komunës së Lipjanit — shiko, kërko, shto, edito dhe ndrysho statusin.
            </p>
          </div>

          <button
            type="button"
            className="btn btn--primary admin-add-btn"
            onClick={handleOpenCreate}
            id="admin-create-business-btn"
          >
            <span className="btn-icon">+</span> Shto Biznes të Ri
          </button>
        </div>

        {/* Tab-et e statusit me numërues */}
        <div className="admin-status-tabs" role="tablist" aria-label="Filtro sipas statusit">
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'all'}
            className={`admin-status-tab ${statusFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => {
              setStatusFilter('all');
              setPage(1);
            }}
          >
            Të Gjitha{' '}
            <span className="admin-status-tab__badge">{counts.all}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'published'}
            className={`admin-status-tab admin-status-tab--published ${statusFilter === 'published' ? 'is-active' : ''}`}
            onClick={() => {
              setStatusFilter('published');
              setPage(1);
            }}
          >
            ● Published{' '}
            <span className="admin-status-tab__badge">{counts.published}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'draft'}
            className={`admin-status-tab admin-status-tab--draft ${statusFilter === 'draft' ? 'is-active' : ''}`}
            onClick={() => {
              setStatusFilter('draft');
              setPage(1);
            }}
          >
            ● Draft{' '}
            <span className="admin-status-tab__badge">{counts.draft}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'archived'}
            className={`admin-status-tab admin-status-tab--archived ${statusFilter === 'archived' ? 'is-active' : ''}`}
            onClick={() => {
              setStatusFilter('archived');
              setPage(1);
            }}
          >
            ● Archived{' '}
            <span className="admin-status-tab__badge">{counts.archived}</span>
          </button>
        </div>

        {/* Shiriti i filtrave dhe kërkimit */}
        <div className="admin-filter-bar">
          <div className="admin-search-wrapper">
            <span className="admin-search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              id="admin-search-input"
              className="admin-search-input"
              placeholder="Kërko me emër, telefon, email, adresë..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Kërko biznese"
            />
            {search && (
              <button
                type="button"
                className="admin-search-clear"
                onClick={() => setSearch('')}
                aria-label="Pastro kërkimin"
              >
                ✕
              </button>
            )}
          </div>

          <div className="admin-filter-selects">
            <select
              className="admin-select"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filtro sipas kategorisë"
            >
              <option value="">Të gjitha kategoritë</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="admin-select"
              value={settlementFilter}
              onChange={(e) => {
                setSettlementFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filtro sipas vendbanimit"
            >
              <option value="">Të gjitha vendbanimet</option>
              {settlements.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {(debouncedSearch || statusFilter !== 'all' || categoryFilter || settlementFilter) && (
              <button
                type="button"
                className="btn btn--ghost admin-reset-btn"
                onClick={handleResetFilters}
              >
                Pastro
              </button>
            )}
          </div>
        </div>

        {/* Tabela e bizneseve */}
        <div className="admin-card">
          {error ? (
            <div className="admin-error-box" role="alert">
              <p><strong>Gabim:</strong> {error}</p>
              <button type="button" className="btn btn--outline" onClick={loadBusinesses}>
                Provo Përsëri
              </button>
            </div>
          ) : loading ? (
            <div className="admin-loading-state">
              <div className="admin-spinner" aria-hidden="true" />
              <p>Duke ngarkuar bizneset...</p>
            </div>
          ) : businesses.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state__icon">📂</div>
              <h3>Nuk u gjet asnjë biznes</h3>
              <p>Nuk ka biznese që përputhen me kriteret e kërkimit apo filtrit të zgjedhur.</p>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={handleResetFilters}
              >
                Pastro të gjithë filtrat
              </button>
            </div>
          ) : (
            <div className="admin-table-responsive">
              <table className="admin-table" aria-label="Tabela e menaxhimit të bizneseve">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: '28%' }}>Emri i Biznesit</th>
                    <th scope="col" style={{ width: '16%' }}>Kategoria</th>
                    <th scope="col" style={{ width: '15%' }}>Vendbanimi</th>
                    <th scope="col" style={{ width: '15%' }}>Statusi</th>
                    <th scope="col" style={{ width: '12%' }}>Telefoni</th>
                    <th scope="col" style={{ width: '14%', textAlign: 'right' }}>Veprimet</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((biz) => {
                    const isUpdating = updatingStatusId === biz.id;

                    return (
                      <tr key={biz.id} className={`admin-row status-${biz.status}`}>
                        {/* Emri */}
                        <td>
                          <div className="admin-biz-name-cell">
                            <span className="admin-biz-name">
                              {biz.name}
                              {biz.is_featured && (
                                <span className="admin-featured-star" title="Biznes i veçuar">
                                  ⭐
                                </span>
                              )}
                            </span>
                            {biz.short_description && (
                              <span className="admin-biz-desc">
                                {biz.short_description}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Kategoria */}
                        <td>
                          <span className="admin-badge admin-badge--category">
                            {biz.category?.name || '—'}
                          </span>
                        </td>

                        {/* Vendbanimi */}
                        <td>
                          <span className="admin-settlement-cell">
                            📍 {biz.settlement?.name || '—'}
                          </span>
                        </td>

                        {/* Statusi + Ndryshimi i shpejtë */}
                        <td>
                          <div className="admin-status-cell">
                            <span className={`status-pill status-pill--${biz.status}`}>
                              {biz.status === 'published' && '● Published'}
                              {biz.status === 'draft' && '● Draft'}
                              {biz.status === 'archived' && '● Archived'}
                            </span>

                            <select
                              className="admin-quick-status-select"
                              value={biz.status}
                              onChange={(e) => handleQuickStatusChange(biz, e.target.value)}
                              disabled={isUpdating}
                              aria-label={`Ndrysho statusin për ${biz.name}`}
                              title="Ndrysho statusin"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="archived">Archived</option>
                            </select>
                          </div>
                        </td>

                        {/* Telefoni */}
                        <td>
                          <span className="admin-phone-cell">
                            {biz.phone || <span className="text-muted">—</span>}
                          </span>
                        </td>

                        {/* Veprimet */}
                        <td style={{ textAlign: 'right' }}>
                          <div className="admin-actions-cell">
                            <button
                              type="button"
                              className="btn-action btn-action--edit"
                              onClick={() => handleOpenEdit(biz)}
                              title="Edito të dhënat e biznesit"
                              aria-label={`Edito ${biz.name}`}
                            >
                              ✏️ Edito
                            </button>

                            <button
                              type="button"
                              className="btn-action btn-action--delete"
                              onClick={() => handleOpenDelete(biz)}
                              title="Fshij biznesin"
                              aria-label={`Fshij ${biz.name}`}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && businesses.length > 0 && (
            <div className="admin-pagination">
              <div className="admin-pagination__info">
                Po shfaqen <strong>{meta.from || 1}</strong> deri <strong>{meta.to || businesses.length}</strong> nga{' '}
                <strong>{meta.total}</strong> biznese gjithsej
              </div>

              <div className="admin-pagination__controls">
                <button
                  type="button"
                  className="btn btn--ghost admin-page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label="Faqja e mëparshme"
                >
                  ← Para
                </button>

                <span className="admin-page-indicator">
                  Faqja <strong>{meta.current_page}</strong> nga <strong>{meta.last_page || 1}</strong>
                </span>

                <button
                  type="button"
                  className="btn btn--ghost admin-page-btn"
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={page >= meta.last_page}
                  aria-label="Faqja tjetër"
                >
                  Pas →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modali për Krijim / Editim */}
      <BusinessFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        business={editingBusiness}
        categories={categories}
        settlements={settlements}
        services={services}
        onSuccess={handleFormSuccess}
      />

      {/* Modali për Konfirmimin e Fshirjes */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        business={deletingBusiness}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
        error={deleteError}
      />
    </AdminLayout>
  );
}
