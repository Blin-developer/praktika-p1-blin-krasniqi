import { useState, useEffect } from 'react';
import { fetchPublicDeals } from '../services/api';

/**
 * DealsSection – Seksioni i ofertave ditore dhe zbritjeve lokale ("Deals & Coupons")
 * për faqen kryesore të Komunës së Lipjanit.
 */
export default function DealsSection({ onSelectBusiness }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadDeals() {
      try {
        const res = await fetchPublicDeals({ limit: 6 });
        if (mounted && res.data) {
          setDeals(res.data);
        }
      } catch {
        // Gabimi injorohet me elegancë
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDeals();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    });
  };

  // Formatues i datës së skadimit
  const formatExpiryDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('sq-AL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (!loading && deals.length === 0) {
    return null;
  }

  return (
    <section className="home-section deals-section" aria-labelledby="deals-heading">
      <div className="site-container">
        <div className="section-header deals-section__header">
          <div>
            <span className="section-eyebrow deals-eyebrow">
              🏷️ Oferta Lokale &amp; Kuponë
            </span>
            <h2 id="deals-heading" className="section-title deals-section__title">
              Ofertat &amp; Zbritjet e Javës në Lipjan
            </h2>
            <p className="section-subtitle">
              Përfitoni nga zbritjet ditore, menytë speciale dhe kuponët promovues të bizneseve të verifikuara në Lipjan.
            </p>
          </div>
          <div className="deals-live-badge">
            <span className="pulse-dot"></span>
            <span>{deals.length} Oferta Aktive</span>
          </div>
        </div>

        {loading ? (
          <div className="deals-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="deal-card deal-card--skeleton">
                <div className="deal-card__skeleton-badge"></div>
                <div className="deal-card__skeleton-title"></div>
                <div className="deal-card__skeleton-desc"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="deals-grid">
            {deals.map((deal) => {
              const biz = deal.business;
              const hasPricing = deal.deal_price != null;
              const isCopied = copiedCode === deal.coupon_code;

              return (
                <article
                  key={deal.id}
                  className="deal-card"
                  onClick={() => biz?.slug && onSelectBusiness && onSelectBusiness(biz.slug)}
                >
                  <div className="deal-card__top">
                    <span className="deal-card__badge">
                      {deal.discount_badge || 'Zbritje'}
                    </span>
                    {biz?.category?.name && (
                      <span className="deal-card__category">
                        {biz.category.name}
                      </span>
                    )}
                  </div>

                  <div className="deal-card__business">
                    <span className="deal-card__biz-name">
                      🏢 {biz?.name || 'Biznes në Lipjan'}
                    </span>
                    {biz?.settlement?.name && (
                      <span className="deal-card__biz-loc">
                        📍 {biz.settlement.name}
                      </span>
                    )}
                  </div>

                  <h3 className="deal-card__title">{deal.title}</h3>

                  {deal.description && (
                    <p className="deal-card__desc">{deal.description}</p>
                  )}

                  {/* Shfaqja e çmimit me zbritje */}
                  {hasPricing && (
                    <div className="deal-card__pricing">
                      <span className="deal-card__deal-price">
                        {parseFloat(deal.deal_price).toFixed(2)}€
                      </span>
                      {deal.original_price != null && (
                        <span className="deal-card__orig-price">
                          {parseFloat(deal.original_price).toFixed(2)}€
                        </span>
                      )}
                    </div>
                  )}

                  {/* Kodi i Kuponit me mundësi kopjimi */}
                  {deal.coupon_code && (
                    <div className="deal-card__coupon-row">
                      <span className="deal-card__coupon-label">Kodi i Kuponit:</span>
                      <button
                        type="button"
                        className={`deal-card__coupon-btn ${isCopied ? 'deal-card__coupon-btn--copied' : ''}`}
                        onClick={(e) => handleCopyCode(deal.coupon_code, e)}
                        title="Kliko për të kopjuar kodin"
                      >
                        <code>{deal.coupon_code}</code>
                        <span>{isCopied ? '✓ U kopjua' : '📋 Kopjo'}</span>
                      </button>
                    </div>
                  )}

                  <div className="deal-card__footer">
                    {deal.end_date ? (
                      <span className="deal-card__expiry">
                        ⏳ Skadon: {formatExpiryDate(deal.end_date)}
                      </span>
                    ) : (
                      <span className="deal-card__expiry">
                        ⏳ Ofertë aktive
                      </span>
                    )}

                    <span className="deal-card__cta">
                      Shiko Biznesin →
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

