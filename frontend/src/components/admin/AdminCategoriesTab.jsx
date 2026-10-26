import { useState, useEffect } from 'react';
import { fetchCategories } from '../../services/api';

/**
 * AdminCategoriesTab – Paneli administrativ për shikimin dhe menaxhimin e të dhënave të kategorive.
 */
export default function AdminCategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchCategories()
      .then((res) => {
        setCategories(res.data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Dështoi ngarkimi i kategorive.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCategories = categories.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.slug?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-tab-content">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-header__title">Kategoritë e Bizneseve</h2>
          <p className="admin-page-header__subtitle">
            Regjistri i sektorëve zyrtarë dhe numri i bizneseve të lidhura në bazën e të dhënave.
          </p>
        </div>
        <button type="button" className="btn btn--secondary" onClick={loadData}>
          🔄 Rifresko
        </button>
      </div>

      {/* Filter and Search */}
      <div className="admin-table-filters">
        <div className="admin-search-box">
          <span className="admin-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="admin-search-input"
            placeholder="Kërko kategori sipas emrit ose slug-ut..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="admin-table-stats">
          <span>Gjithsej: <strong>{categories.length}</strong> kategori</span>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-screen" style={{ minHeight: '260px' }}>
          <div className="admin-spinner" />
          <p>Duke ngarkuar kategoritë...</p>
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
                <th>Emri i Kategorisë</th>
                <th>Slug</th>
                <th>Përshkrimi</th>
                <th style={{ textAlign: 'center' }}>Biznese Aktive</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Statusi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-table-empty">
                    Nuk u gjet asnjë kategori me këtë kërkim.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <span className="admin-id-badge">#{cat.id}</span>
                    </td>
                    <td>
                      <strong className="admin-biz-name">{cat.name}</strong>
                    </td>
                    <td>
                      <code className="admin-code-tag">{cat.slug}</code>
                    </td>
                    <td>
                      <span className="admin-desc-truncate">
                        {cat.description || '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge--category" style={{ margin: '0 auto' }}>
                        {cat.businesses_count || 0} biznese
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
