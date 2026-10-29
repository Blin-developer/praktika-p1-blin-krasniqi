import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminDeals,
  createDeal,
  updateDeal,
  deleteDeal,
  fetchAdminBusinesses,
} from '../../services/api';

/**
 * AdminDealsTab – Paneli i menaxhimit të Ofertave Ditore dhe Zbritjeve Lokale ("Deals & Coupons").
 */
export default function AdminDealsTab() {
  const [deals, setDeals] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtrat
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Lista e bizneseve për dropdown-in e krijimit
  const [businesses, setBusinesses] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    business_id: '',
    title: '',
    description: '',
    discount_badge: '-20%',
    coupon_code: '',
    original_price: '',
    deal_price: '',
    start_date: '',
    end_date: '',
    is_active: true,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Ngarko bizneset për përzgjedhje
  useEffect(() => {
    fetchAdminBusinesses({ per_page: 100 })
      .then((res) => {
        if (res?.data) {
          setBusinesses(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const loadDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminDeals({
        page,
        status: statusFilter || undefined,
        search: search.trim() || undefined,
      });
      setDeals(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      setError(err.message || 'Ndodhi një gabim gjatë ngarkimit të ofertave.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  const handleOpenCreateModal = () => {
    setEditingDeal(null);
    setFormData({
      business_id: businesses.length > 0 ? businesses[0].id : '',
      title: '',
      description: '',
      discount_badge: '-20%',
      coupon_code: '',
      original_price: '',
      deal_price: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      is_active: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (deal) => {
    setEditingDeal(deal);
    setFormData({
      business_id: deal.business_id,
      title: deal.title || '',
      description: deal.description || '',
      discount_badge: deal.discount_badge || '-20%',
      coupon_code: deal.coupon_code || '',
      original_price: deal.original_price != null ? deal.original_price : '',
      deal_price: deal.deal_price != null ? deal.deal_price : '',
      start_date: deal.start_date || '',
      end_date: deal.end_date || '',
      is_active: Boolean(deal.is_active),
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    const payload = {
      business_id: Number(formData.business_id),
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      discount_badge: formData.discount_badge.trim(),
      coupon_code: formData.coupon_code.trim() || null,
      original_price: formData.original_price !== '' ? Number(formData.original_price) : null,
      deal_price: formData.deal_price !== '' ? Number(formData.deal_price) : null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      is_active: formData.is_active,
    };

    try {
      if (editingDeal) {
        await updateDeal(editingDeal.id, payload);
      } else {
        await createDeal(payload);
      }
      setIsModalOpen(false);
      loadDeals();
    } catch (err) {
      setFormError(err.message || 'Ndodhi një gabim gjatë ruajtjes së ofertës.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`A jeni të sigurt që dëshironi të fshini ofertën "${title}"?`)) {
      return;
    }
    try {
      await deleteDeal(id);
      loadDeals();
    } catch (err) {
      alert(err.message || 'Gabim gjatë fshirjes së ofertës.');
    }
  };

  return (
    <div className="admin-deals-tab">
      <div className="admin-tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.35rem', color: '#0f172a' }}>
            🏷️ Ofertat Ditore &amp; Zbritjet Lokale
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
            Menaxhoni zbritjet sezonale, kuponët promocionalë dhe menytë speciale të bizneseve në Lipjan.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleOpenCreateModal}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span>➕</span> Krijo Ofertë të Re
        </button>
      </div>

      {/* Shiriti i Kërkimit dhe Filtrimit */}
      <div className="admin-filters-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="search"
          className="form-control"
          placeholder="Kërko sipas titullit ose emrit të biznesit..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ maxWidth: '360px' }}
        />

        <select
          className="form-control"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{ maxWidth: '200px' }}
        >
          <option value="">Të gjitha statuset</option>
          <option value="active">Vetëm Aktive</option>
          <option value="inactive">Vetëm Joaktive</option>
        </select>
      </div>

      {error && (
        <div className="admin-alert admin-alert--error" style={{ marginBottom: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="admin-loading" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
          Duke ngarkuar ofertat...
        </div>
      ) : deals.length === 0 ? (
        <div className="admin-empty-state" style={{ padding: '3rem 2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1.5px dashed #cbd5e1' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏷️</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Nuk u gjet asnjë ofertë</h3>
          <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.9rem' }}>
            Nuk ka ende oferta që përputhen me kriteret e kërkimit tuaj.
          </p>
          <button type="button" className="btn btn--primary btn--sm" onClick={handleOpenCreateModal}>
            Krijo Ofertën e Parë
          </button>
        </div>
      ) : (
        <div className="admin-table-responsive" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Biznesi</th>
                <th style={{ padding: '0.85rem 1rem' }}>Oferta &amp; Zbritja</th>
                <th style={{ padding: '0.85rem 1rem' }}>Çmimi</th>
                <th style={{ padding: '0.85rem 1rem' }}>Kuponi</th>
                <th style={{ padding: '0.85rem 1rem' }}>Vlefshmëria</th>
                <th style={{ padding: '0.85rem 1rem' }}>Statusi</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Veprimet</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => {
                const biz = deal.business;
                return (
                  <tr key={deal.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ color: '#0f172a', display: 'block' }}>{biz?.name || '—'}</strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {biz?.settlement?.name || 'Lipjan'} &bull; {biz?.category?.name || ''}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '4px', padding: '1px 6px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {deal.discount_badge}
                        </span>
                        <strong style={{ color: '#1e293b' }}>{deal.title}</strong>
                      </div>
                      {deal.description && (
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {deal.description}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {deal.deal_price != null ? (
                        <div>
                          <strong style={{ color: '#16a34a' }}>{parseFloat(deal.deal_price).toFixed(2)}€</strong>
                          {deal.original_price != null && (
                            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.78rem', marginLeft: '4px' }}>
                              {parseFloat(deal.original_price).toFixed(2)}€
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {deal.coupon_code ? (
                        <code style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '2px 6px', fontSize: '0.8rem', fontWeight: 600 }}>
                          {deal.coupon_code}
                        </code>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#475569' }}>
                      {deal.end_date ? `Deri më ${deal.end_date}` : 'Pa afat'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {deal.is_active ? (
                        <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600 }}>
                          ✓ Aktive
                        </span>
                      ) : (
                        <span style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 500 }}>
                          Joaktive
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn btn--sm btn--secondary"
                          onClick={() => handleOpenEditModal(deal)}
                          style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                        >
                          ✏️ Modifiko
                        </button>
                        <button
                          type="button"
                          className="btn btn--sm btn--outline-danger"
                          onClick={() => handleDelete(deal.id, deal.title)}
                          style={{ padding: '4px 8px', fontSize: '0.78rem' }}
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
      {meta && meta.last_page > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
          <button
            type="button"
            className="btn btn--sm btn--secondary"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            ← Para
          </button>
          <span style={{ padding: '4px 12px', fontSize: '0.85rem', color: '#475569' }}>
            Faqja {meta.current_page} nga {meta.last_page}
          </span>
          <button
            type="button"
            className="btn btn--sm btn--secondary"
            disabled={page >= meta.last_page}
            onClick={() => setPage(page + 1)}
          >
            Tjetra →
          </button>
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal admin-modal--form" style={{ maxWidth: '580px' }}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">
                {editingDeal ? '✏️ Modifiko Ofertën' : '➕ Krijo Ofertë të Re'}
              </h3>
              <button
                type="button"
                className="admin-modal__close-btn"
                onClick={() => setIsModalOpen(false)}
                disabled={formSubmitting}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-form">
              <div className="admin-modal__body">
                {formError && (
                  <div className="admin-alert admin-alert--error" style={{ marginBottom: '1rem' }}>
                    ⚠️ {formError}
                  </div>
                )}

                <div className="form-field">
                  <label htmlFor="deal-biz">Biznesi <span className="req">*</span></label>
                  <select
                    id="deal-biz"
                    className="form-control"
                    value={formData.business_id}
                    onChange={(e) => setFormData({ ...formData, business_id: e.target.value })}
                    required
                    disabled={formSubmitting || Boolean(editingDeal)}
                  >
                    <option value="">-- Zgjidh Biznesin --</option>
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.settlement?.name || 'Lipjan'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="deal-title">Titulli i Ofertës <span className="req">*</span></label>
                  <input
                    id="deal-title"
                    type="text"
                    className="form-control"
                    placeholder="p.sh. Zbritje Sezonale 20% në të gjitha produktet"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    disabled={formSubmitting}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="deal-desc">Përshkrimi i Detajuar</label>
                  <textarea
                    id="deal-desc"
                    className="form-control"
                    rows="3"
                    placeholder="Përshkruani kushtet e zbritjes, çfarë përfshihet dhe orarin e vlefshmërisë..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={formSubmitting}
                  />
                </div>

                <div className="admin-form-grid admin-form-grid--2">
                  <div className="form-field">
                    <label htmlFor="deal-badge">Teksti i Zbritjes <span className="req">*</span></label>
                    <input
                      id="deal-badge"
                      type="text"
                      className="form-control"
                      placeholder="p.sh. -20%, 3.50€, 1+1 Falas"
                      value={formData.discount_badge}
                      onChange={(e) => setFormData({ ...formData, discount_badge: e.target.value })}
                      required
                      disabled={formSubmitting}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="deal-coupon">Kodi i Kuponit (Opsional)</label>
                    <input
                      id="deal-coupon"
                      type="text"
                      className="form-control"
                      placeholder="p.sh. LIPJAN20"
                      value={formData.coupon_code}
                      onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
                      disabled={formSubmitting}
                    />
                  </div>
                </div>

                <div className="admin-form-grid admin-form-grid--2">
                  <div className="form-field">
                    <label htmlFor="deal-orig-price">Çmimi Fillestar (€)</label>
                    <input
                      id="deal-orig-price"
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="p.sh. 10.00"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      disabled={formSubmitting}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="deal-price">Çmimi me Zbritje (€)</label>
                    <input
                      id="deal-price"
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="p.sh. 7.50"
                      value={formData.deal_price}
                      onChange={(e) => setFormData({ ...formData, deal_price: e.target.value })}
                      disabled={formSubmitting}
                    />
                  </div>
                </div>

                <div className="admin-form-grid admin-form-grid--2">
                  <div className="form-field">
                    <label htmlFor="deal-start">Data e Fillimit</label>
                    <input
                      id="deal-start"
                      type="date"
                      className="form-control"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      disabled={formSubmitting}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="deal-end">Data e Mbarimit</label>
                    <input
                      id="deal-end"
                      type="date"
                      className="form-control"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      disabled={formSubmitting}
                    />
                  </div>
                </div>

                <div className="form-field" style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      disabled={formSubmitting}
                    />
                    <span>Ofertë Aktive (Shfaqet në Faqen Kryesore dhe Profil)</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal__footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={formSubmitting}
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Duke ruajtur...' : editingDeal ? 'Ruaj Ndryshimet' : 'Krijo Ofertën'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
