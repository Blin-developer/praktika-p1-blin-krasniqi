import { useState, useEffect, useCallback } from 'react';
import { fetchAdminReviews, deleteAdminReview } from '../../services/api';

/**
 * Formatues i datës në shqip
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('sq-AL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

/**
 * AdminReviewsTab – Paneli administrativ për moderimin e vlerësimeve dhe komenteve të qytetarëve.
 */
export default function AdminReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filtrat
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, lastPage: 1 });

  // Gjendja e fshirjes
  const [deletingId, setDeletingId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAdminReviews({
        page,
        search: search.trim() || undefined,
        rating: ratingFilter || undefined,
      });

      setReviews(res.data || []);
      setPagination({
        total: res.total || 0,
        lastPage: res.last_page || 1,
      });
    } catch (err) {
      setError(err.message || 'Dështoi ngarkimi i vlerësimeve.');
    } finally {
      setLoading(false);
    }
  }, [page, search, ratingFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (review) => {
    const confirmMsg = `A jeni të sigurt që dëshironi të fshini vlerësimin nga "${review.user?.name || 'Përdoruesi'}" për biznesin "${review.business?.name || 'Biznesi'}"?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setDeletingId(review.id);
      await deleteAdminReview(review.id);
      setFeedback({
        type: 'success',
        message: 'Vlerësimi u fshi me sukses nga sistemi i moderimit.',
      });
      await loadData();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Dështoi fshirja e vlerësimit.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-tab-content">
      {/* Header i seksionit */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-header__title">⭐ Moderimi i Vlerësimeve dhe Komenteve</h2>
          <p className="admin-page-header__subtitle">
            Mbikëqyrni përshtypjet dhe yjet e dërguara nga qytetarët. Fshini komentet e papërshtatshme për të ruajtur standardet etike të katalogut.
          </p>
        </div>
        <button type="button" className="btn btn--secondary" onClick={loadData}>
          🔄 Rifresko
        </button>
      </div>

      {/* Banner Feedback */}
      {feedback && (
        <div className={`admin-notification admin-notification--${feedback.type}`} role="alert">
          <span className="admin-notification__icon">
            {feedback.type === 'success' ? '✓' : '⚠️'}
          </span>
          <span className="admin-notification__text">{feedback.message}</span>
          <button
            type="button"
            className="admin-notification__close"
            onClick={() => setFeedback(null)}
            aria-label="Mbyll"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filtrat dhe Kërkimi */}
      <div className="admin-table-filters" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="admin-search-box" style={{ flex: '1 1 280px' }}>
          <span className="admin-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="admin-search-input"
            placeholder="Kërko sipas qytetarit, email-it, biznesit ose tekstit..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="rating-filter-select" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
            Yjet:
          </label>
          <select
            id="rating-filter-select"
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
            className="filter-select"
            style={{ minWidth: '130px', padding: '0.5rem 0.8rem' }}
          >
            <option value="">Të gjithë (1-5★)</option>
            <option value="5">5 Yje (★★★★★)</option>
            <option value="4">4 Yje (★★★★☆)</option>
            <option value="3">3 Yje (★★★☆☆)</option>
            <option value="2">2 Yje (★★☆☆☆)</option>
            <option value="1">1 Yll (★☆☆☆☆)</option>
          </select>
        </div>

        <div className="admin-table-stats">
          <span>Gjithsej vlerësime: <strong>{pagination.total}</strong></span>
        </div>
      </div>

      {/* Tabela e Vlerësimeve */}
      {loading ? (
        <div className="admin-loading-screen" style={{ minHeight: '260px' }}>
          <div className="admin-spinner" />
          <p>Duke ngarkuar vlerësimet...</p>
        </div>
      ) : error ? (
        <div className="admin-notification admin-notification--error">
          <span>⚠️ {error}</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="admin-empty-state">
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>⭐</span>
          <p style={{ fontWeight: 600, color: '#334155', margin: '0 0 0.25rem 0' }}>
            Nuk u gjet asnjë vlerësim.
          </p>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            {search || ratingFilter ? 'Provoni të ndryshoni kriteret e kërkimit.' : 'Qytetarët nuk kanë shtuar ende vlerësime në sistem.'}
          </p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Qytetari</th>
                <th>Biznesi i Vlerësuar</th>
                <th style={{ width: '130px' }}>Vlerësimi</th>
                <th>Komenti / Përshtypja</th>
                <th style={{ width: '150px' }}>Data</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Veprimi</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev) => (
                <tr key={rev.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.85rem' }}>
                      #{rev.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>
                      {rev.user?.name || 'Përdorues i panjohur'}
                    </div>
                    {rev.user?.email && (
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {rev.user.email}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>
                      {rev.business?.name || 'Biznes i fshirë'}
                    </div>
                    {rev.business?.category?.name && (
                      <span className="badge badge--category" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', marginTop: '3px' }}>
                        {rev.business.category.name}
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#eab308', fontSize: '1rem', letterSpacing: '1px' }}>
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </span>
                      <strong style={{ fontSize: '0.85rem', color: '#334155' }}>
                        {rev.rating}/5
                      </strong>
                    </div>
                  </td>
                  <td>
                    {rev.comment ? (
                      <div style={{ fontSize: '0.86rem', color: '#334155', maxWidth: '380px', lineHeight: 1.4 }}>
                        &ldquo;{rev.comment}&rdquo;
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.82rem' }}>
                        (Pa koment me tekst)
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {formatDate(rev.created_at)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn btn--outline-danger btn--sm"
                      onClick={() => handleDelete(rev)}
                      disabled={deletingId === rev.id}
                      title="Fshi komentin e papërshtatshëm"
                      style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                    >
                      {deletingId === rev.id ? 'Duke fshirë...' : '🗑️ Fshi'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Faqosja / Pagination */}
      {pagination.lastPage > 1 && (
        <div className="admin-pagination" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1 || loading}
          >
            ← Prapa
          </button>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 0.75rem', fontSize: '0.85rem', color: '#475569' }}>
            Faqja {page} nga {pagination.lastPage}
          </span>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => setPage((p) => Math.min(p + 1, pagination.lastPage))}
            disabled={page >= pagination.lastPage || loading}
          >
            Para →
          </button>
        </div>
      )}
    </div>
  );
}

