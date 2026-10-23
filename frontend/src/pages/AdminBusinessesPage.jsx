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
 * AdminBusinessesPage – Faqja kryesore administrative për menaxhimin e bizneseve (Java 3, Dita 4).
 * Përfshin dashboard me statistika, filtrat, renditje, CRUD dhe menaxhim të statusit.
 */
export default function AdminBusinessesPage({ onNavigateToCatalog }) {
  // Gjendja e pamjes: 'dashboard' ose 'businesses'
  const [activeView, setActiveView] = useState('dashboard');

  // Filtrat dhe kërkimi
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [settlementFilter, setSettlementFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Sortimi
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');

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
        sort_by: sortBy,
        sort_order: sortOrder,
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
  }, [debouncedSearch, statusFilter, categoryFilter, settlementFilter, page, sortBy, sortOrder]);

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

  // Hap modalin e fshirjes/arkivimit
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

  // Arkivo në vend të fshirjes
  async function handleArchiveInstead() {
    if (!deletingBusiness) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await updateAdminBusinessStatus(deletingBusiness.id, 'archived');
      showFeedback('success', `Biznesi «${deletingBusiness.name}» u arkivua me sukses.`);
      setDeleteModalOpen(false);
      setDeletingBusiness(null);
      loadBusinesses();
    } catch (err) {
      setDeleteError(err.message || 'Ndodhi një gabim gjatë arkivimit.');
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
    setSortBy('id');
    setSortOrder('desc');
  }

  // Sortimi me klikim në kolonën e tabelës
  function handleSort(column) {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1);
  }

  // Render sortim icon
  function renderSortIcon(column) {
    if (sortBy !== column) return <span className="admin-sort-icon admin-sort-icon--neutral">⇅</span>;
    return (
      <span className="admin-sort-icon admin-sort-icon--active">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  }

  // Shiko profilin publik të biznesit
  function handleViewPublic(business) {
    if (business.status !== 'published') {
      showFeedback('error', 'Ky biznes nuk është i publikuar. Ndryshoni statusin në "Published" për ta parë publikisht.');
      return;
    }
    const slug = business.slug || business.id;
    window.open(`/?business=${slug}`, '_blank');
  }

  return (
    <AdminLayout
      activeTab={activeView}
      onNavigateToCatalog={onNavigateToCatalog}
      onTabChange={setActiveView}
    >
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

        {activeView === 'dashboard' ? (
          /* ======================= DASHBOARD ======================= */
          <div className="admin-dashboard">
            <div className="admin-page-header">
              <div>
                <h2 className="admin-page-header__title">Dashboard</h2>
                <p className="admin-page-header__subtitle">
                  Përmbledhja e gjendjes aktuale të katalogut të bizneseve të komunës së Lipjanit.
                </p>
              </div>
              <button
                type="button"
                className="btn btn--primary admin-add-btn"
                onClick={() => { setActiveView('businesses'); }}
                id="admin-go-to-businesses-btn"
              >
                🏢 Menaxho Bizneset
              </button>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats-grid">
              <div
                className="admin-stat-card admin-stat-card--total"
                role="button"
                tabIndex={0}
                onClick={() => { setStatusFilter('all'); setActiveView('businesses'); }}
                onKeyDown={(e) => e.key === 'Enter' && (setStatusFilter('all'), setActiveView('businesses'))}
              >
                <div className="admin-stat-card__icon">🏢</div>
                <div className="admin-stat-card__content">
                  <span className="admin-stat-card__number">{counts.all}</span>
                  <span className="admin-stat-card__label">Total Biznese</span>
                </div>
              </div>

              <div
                className="admin-stat-card admin-stat-card--published"
                role="button"
                tabIndex={0}
                onClick={() => { setStatusFilter('published'); setActiveView('businesses'); }}
                onKeyDown={(e) => e.key === 'Enter' && (setStatusFilter('published'), setActiveView('businesses'))}
              >
                <div className="admin-stat-card__icon">✅</div>
                <div className="admin-stat-card__content">
                  <span className="admin-stat-card__number">{counts.published}</span>
                  <span className="admin-stat-card__label">Published</span>
                </div>
                <div className="admin-stat-card__bar">
                  <div
                    className="admin-stat-card__bar-fill admin-stat-card__bar-fill--published"
                    style={{ width: counts.all > 0 ? `${(counts.published / counts.all) * 100}%` : '0%' }}
                  />
                </div>
              </div>

              <div
                className="admin-stat-card admin-stat-card--draft"
                role="button"
                tabIndex={0}
                onClick={() => { setStatusFilter('draft'); setActiveView('businesses'); }}
                onKeyDown={(e) => e.key === 'Enter' && (setStatusFilter('draft'), setActiveView('businesses'))}
              >
                <div className="admin-stat-card__icon">📝</div>
                <div className="admin-stat-card__content">
                  <span className="admin-stat-card__number">{counts.draft}</span>
                  <span className="admin-stat-card__label">Draft</span>
                </div>
                <div className="admin-stat-card__bar">
                  <div
                    className="admin-stat-card__bar-fill admin-stat-card__bar-fill--draft"
                    style={{ width: counts.all > 0 ? `${(counts.draft / counts.all) * 100}%` : '0%' }}
                  />
                </div>
              </div>

              <div
                className="admin-stat-card admin-stat-card--archived"
                role="button"
                tabIndex={0}
                onClick={() => { setStatusFilter('archived'); setActiveView('businesses'); }}
                onKeyDown={(e) => e.key === 'Enter' && (setStatusFilter('archived'), setActiveView('businesses'))}
              >
                <div className="admin-stat-card__icon">📦</div>
                <div className="admin-stat-card__content">
                  <span className="admin-stat-card__number">{counts.archived}</span>
                  <span className="admin-stat-card__label">Archived</span>
                </div>
                <div className="admin-stat-card__bar">
                  <div
                    className="admin-stat-card__bar-fill admin-stat-card__bar-fill--archived"
                    style={{ width: counts.all > 0 ? `${(counts.archived / counts.all) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>

            {/* Veprime të shpejta */}
            <div className="admin-quick-actions">
              <h3 className="admin-quick-actions__title">Veprime të Shpejta</h3>
              <div className="admin-quick-actions__grid">
                <button
                  type="button"
                  className="admin-quick-action-card"
                  onClick={handleOpenCreate}
                >
                  <span className="admin-quick-action-card__icon">➕</span>
                  <span className="admin-quick-action-card__label">Shto Biznes të Ri</span>
                </button>
                <button
                  type="button"
                  className="admin-quick-action-card"
                  onClick={() => { setActiveView('businesses'); }}
                >
                  <span className="admin-quick-action-card__icon">📋</span>
                  <span className="admin-quick-action-card__label">Shiko Listën e Plotë</span>
                </button>
                <button
                  type="button"
                  className="admin-quick-action-card"
                  onClick={onNavigateToCatalog}
                >
                  <span className="admin-quick-action-card__icon">🌐</span>
                  <span className="admin-quick-action-card__label">Shiko Katalogun Publik</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ======================= BUSINESSES LIST ======================= */
          <>
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
                        <th
                          scope="col"
                          style={{ width: '28%', cursor: 'pointer' }}
                          onClick={() => handleSort('name')}
                          title="Rendit sipas emrit"
                        >
                          Emri i Biznesit {renderSortIcon('name')}
                        </th>
                        <th scope="col" style={{ width: '14%' }}>Kategoria</th>
                        <th scope="col" style={{ width: '13%' }}>Vendbanimi</th>
                        <th
                          scope="col"
                          style={{ width: '13%', cursor: 'pointer' }}
                          onClick={() => handleSort('status')}
                          title="Rendit sipas statusit"
                        >
                          Statusi {renderSortIcon('status')}
                        </th>
                        <th scope="col" style={{ width: '12%' }}>Telefoni</th>
                        <th scope="col" style={{ width: '20%', textAlign: 'right' }}>Veprimet</th>
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
                                  className="btn-action btn-action--view"
                                  onClick={() => handleViewPublic(biz)}
                                  title="Shiko profilin publik"
                                  aria-label={`Shiko ${biz.name}`}
                                >
                                  👁️
                                </button>

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
                                  className="btn-action btn-action--archive"
                                  onClick={() => {
                                    if (biz.status !== 'archived') {
                                      handleQuickStatusChange(biz, 'archived');
                                    } else {
                                      handleOpenDelete(biz);
                                    }
                                  }}
                                  title={biz.status !== 'archived' ? 'Arkivo biznesin' : 'Fshij biznesin'}
                                  aria-label={biz.status !== 'archived' ? `Arkivo ${biz.name}` : `Fshij ${biz.name}`}
                                >
                                  {biz.status !== 'archived' ? '📦' : '🗑️'}
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
          </>
        )}
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

      {/* Modali për Konfirmimin e Fshirjes/Arkivimit */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        business={deletingBusiness}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        onArchive={handleArchiveInstead}
        deleting={deleting}
        error={deleteError}
      />
    </AdminLayout>
  );
}
