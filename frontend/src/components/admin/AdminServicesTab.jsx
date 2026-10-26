import { useState, useEffect } from 'react';
import { fetchServices } from '../../services/api';

/**
 * AdminServicesTab – Paneli administrativ për shërbimet dhe lehtësirat e bizneseve.
 */
export default function AdminServicesTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchServices()
      .then((res) => {
        setServices(res.data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Dështoi ngarkimi i shërbimeve.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = services.filter((srv) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      srv.name?.toLowerCase().includes(term) ||
      srv.slug?.toLowerCase().includes(term) ||
      srv.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-header__title">Shërbimet &amp; Lehtësirat</h2>
          <p className="admin-page-header__subtitle">
            Regjistri i shërbimeve të ofruara nga bizneset (Wi-Fi, Parking, Terracë, Kartela, etj.).
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
            placeholder="Kërko shërbim sipas emrit ose përshkrimit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="admin-table-stats">
          <span>Gjithsej: <strong>{services.length}</strong> shërbime</span>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-screen" style={{ minHeight: '260px' }}>
          <div className="admin-spinner" />
          <p>Duke ngarkuar shërbimet...</p>
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
                <th>Emri i Shërbimit</th>
                <th>Slug</th>
                <th>Përshkrimi</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Lloji</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Statusi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-table-empty">
                    Nuk u gjet asnjë shërbim me këtë kërkim.
                  </td>
                </tr>
              ) : (
                filtered.map((srv) => (
                  <tr key={srv.id}>
                    <td>
                      <span className="admin-id-badge">#{srv.id}</span>
                    </td>
                    <td>
                      <strong className="admin-biz-name">✨ {srv.name}</strong>
                    </td>
                    <td>
                      <code className="admin-code-tag">{srv.slug}</code>
                    </td>
                    <td>
                      <span className="admin-desc-truncate">
                        {srv.description || 'Shërbim / lehtësi e veçantë e biznesit.'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge--category">
                        Lehtësi
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="admin-status-badge admin-status-badge--published">
                        Aktive
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
