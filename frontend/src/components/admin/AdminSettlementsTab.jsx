import { useState, useEffect } from 'react';
import { fetchSettlements } from '../../services/api';

/**
 * AdminSettlementsTab – Paneli administrativ për regjistrin e vendbanimeve të Komunës së Lipjanit.
 */
export default function AdminSettlementsTab() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchSettlements()
      .then((res) => {
        setSettlements(res.data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Dështoi ngarkimi i vendbanimeve.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = settlements.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      s.slug?.toLowerCase().includes(term) ||
      (s.postal_code && String(s.postal_code).includes(term))
    );
  });

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-header__title">Vendbanimet e Komunës</h2>
          <p className="admin-page-header__subtitle">
            Lista zyrtare e vendbanimeve, fshatrave dhe kodeve postare të territorit të Lipjanit.
          </p>
        </div>
        <button type="button" className="btn btn--secondary" onClick={loadData}>
          🔄 Rifresko
        </button>
      </div>

      <div className="admin-table-filters">
        <div className="admin-search-box">
          <span className="admin-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="admin-search-input"
            placeholder="Kërko vendbanim ose kod postal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="admin-table-stats">
          <span>Gjithsej: <strong>{settlements.length}</strong> vendbanime të regjistruara</span>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-screen" style={{ minHeight: '260px' }}>
          <div className="admin-spinner" />
          <p>Duke ngarkuar vendbanimet...</p>
        </div>
      ) : error ? (
        <div className="admin-notification admin-notification--error">
          <span>⚠️ {error}</span>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Vendbanimi</th>
                <th>Slug</th>
                <th>Kodi Postal</th>
                <th>Komuna</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Statusi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-table-empty">
                    Nuk u gjet asnjë vendbanim me këtë kërkim.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="admin-id-badge">#{s.id}</span>
                    </td>
                    <td>
                      <strong className="admin-biz-name">📍 {s.name}</strong>
                    </td>
                    <td>
                      <code className="admin-code-tag">{s.slug}</code>
                    </td>
                    <td>
                      <span className="badge badge--category">
                        {s.postal_code || '14000'}
                      </span>
                    </td>
                    <td>
                      <span className="admin-cell-text">Komuna e Lipjanit</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="admin-status-badge admin-status-badge--published">
                        Aktiv
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
