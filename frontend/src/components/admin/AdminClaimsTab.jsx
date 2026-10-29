import { useState, useEffect, useCallback } from 'react';
import { fetchAdminClaims, approveAdminClaim, rejectAdminClaim } from '../../services/api';

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
 * AdminClaimsTab – Paneli administrativ për shqyrtimin dhe aprovimin e kërkesave për pronësi të bizneseve.
 */
export default function AdminClaimsTab() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filtrat
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, lastPage: 1 });

  // Gjendja e përpunimit
  const [processingId, setProcessingId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAdminClaims({
        page,
        status: statusFilter || undefined,
        search: search.trim() || undefined,
      });

      setClaims(res.data || []);
      setPagination({
        total: res.total || 0,
        lastPage: res.last_page || 1,
      });
    } catch (err) {
      setError(err.message || 'Dështoi ngarkimi i kërkesave për pronësi.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (claim) => {
    const promptMsg = `Aprovimi i kërkesës do t'i japë përdoruesit "${claim.full_name}" të drejtën për të përditësuar vetë biznesin "${claim.business?.name}".\n\nShënoni një shënim administrativ (opsionale):`;
    const adminNote = window.prompt(promptMsg, 'Dokumentacioni dhe autorizimi u verifikuan me sukses.');
    if (adminNote === null) return; // Anuluar nga përdoruesi

    try {
      setProcessingId(claim.id);
      await approveAdminClaim(claim.id, adminNote);
      setFeedback({
        type: 'success',
        message: `Kërkesa për pronësi u aprovua me sukses. Biznesi "${claim.business?.name}" iu caktua pronarit!`,
      });
      await loadData();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Dështoi aprovimi i kërkesës.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (claim) => {
    const promptMsg = `Refuzoni kërkesën nga "${claim.full_name}" për biznesin "${claim.business?.name}".\n\nShënoni arsyen e refuzimit:`;
    const adminNote = window.prompt(promptMsg, 'Dokumentacioni i pamjaftueshëm ose NUI nuk përputhet me regjistrin.');
    if (adminNote === null) return; // Anuluar nga përdoruesi

    try {
      setProcessingId(claim.id);
      await rejectAdminClaim(claim.id, adminNote);
      setFeedback({
        type: 'success',
        message: 'Kërkesa për pronësi u refuzua.',
      });
      await loadData();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Dështoi refuzimi i kërkesës.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="admin-tab-content">
      {/* Header i seksionit */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-header__title">🏢 Kërkesat për Pronësi të Bizneseve</h2>
          <p className="admin-page-header__subtitle">
            Verifikoni dhe miratoni kërkesat e pronarëve për të menaxhuar vetë faqen dhe të dhënat e tyre në katalog.
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
            placeholder="Kërko sipas aplikuesit, email-it, telefonit, biznesit ose NUI..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="claims-status-filter" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
            Statusi:
          </label>
          <select
            id="claims-status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="filter-select"
            style={{ minWidth: '150px', padding: '0.5rem 0.8rem' }}
          >
            <option value="">Të gjitha kërkesat</option>
            <option value="pending">⏳ Në pritje (Pending)</option>
            <option value="approved">✓ Të aprovuara (Approved)</option>
            <option value="rejected">✕ Të refuzuara (Rejected)</option>
          </select>
        </div>

        <div className="admin-table-stats">
          <span>Gjithsej kërkesa: <strong>{pagination.total}</strong></span>
        </div>
      </div>

      {/* Tabela e Kërkesave */}
      {loading ? (
        <div className="admin-loading-screen" style={{ minHeight: '260px' }}>
          <div className="admin-spinner" />
          <p>Duke ngarkuar kërkesat për pronësi...</p>
        </div>
      ) : error ? (
        <div className="admin-notification admin-notification--error">
          <span>⚠️ {error}</span>
        </div>
      ) : claims.length === 0 ? (
        <div className="admin-empty-state">
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🏢</span>
          <p style={{ fontWeight: 600, color: '#334155', margin: '0 0 0.25rem 0' }}>
            Nuk u gjet asnjë kërkesë për pronësi.
          </p>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            {search || statusFilter ? 'Provoni të ndryshoni kriteret e kërkimit.' : 'Pronarët nuk kanë dërguar ende kërkesa verifikimi.'}
          </p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Biznesi i Kërkuar</th>
                <th>Aplikuesi &amp; Roli</th>
                <th>Kontakti</th>
                <th>Dëshmia e Verifikimit / NUI</th>
                <th style={{ width: '120px' }}>Statusi</th>
                <th style={{ width: '140px' }}>Data</th>
                <th style={{ width: '170px', textAlign: 'center' }}>Veprimet</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.85rem' }}>
                      #{claim.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>
                      {claim.business?.name || 'Biznes i fshirë'}
                    </div>
                    {claim.business?.category?.name && (
                      <span className="badge badge--category" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', marginTop: '3px' }}>
                        {claim.business.category.name}
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>
                      {claim.full_name}
                    </div>
                    <span className="badge badge--primary" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', marginTop: '3px' }}>
                      {claim.business_role || 'Pronar'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.84rem', color: '#1e293b' }}>
                      📞 {claim.phone}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      ✉️ {claim.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#334155', maxWidth: '300px', lineHeight: 1.4 }}>
                      {claim.verification_notes}
                    </div>
                    {claim.admin_notes && (
                      <div style={{ fontSize: '0.78rem', color: '#0369a1', marginTop: '4px', background: '#f0f9ff', padding: '2px 6px', borderRadius: '4px' }}>
                        Shënim admin: {claim.admin_notes}
                      </div>
                    )}
                  </td>
                  <td>
                    {claim.status === 'approved' ? (
                      <span className="badge badge--success">✓ E Aprovuar</span>
                    ) : claim.status === 'rejected' ? (
                      <span className="badge badge--danger" style={{ background: '#fef2f2', color: '#b91c1c' }}>
                        ✕ E Refuzuar
                      </span>
                    ) : (
                      <span className="badge badge--warning" style={{ background: '#fef3c7', color: '#92400e' }}>
                        ⏳ Në Pritje
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {formatDate(claim.created_at)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {claim.status === 'pending' ? (
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="btn btn--primary btn--sm"
                          onClick={() => handleApprove(claim)}
                          disabled={processingId === claim.id}
                          style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                          title="Aprovo kërkesën dhe cakto pronësinë"
                        >
                          ✓ Aprovo
                        </button>
                        <button
                          type="button"
                          className="btn btn--outline-danger btn--sm"
                          onClick={() => handleReject(claim)}
                          disabled={processingId === claim.id}
                          style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                          title="Refuzo kërkesën"
                        >
                          ✕ Refuzo
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        Përfunduar
                      </span>
                    )}
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

