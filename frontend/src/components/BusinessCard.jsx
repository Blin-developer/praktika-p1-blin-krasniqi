import { useState, useEffect, useRef } from 'react';
import { getDirectionsUrl } from '../utils/distance';

/**
 * Merr një ikonë të përshtatshme për kategorinë.
 */
function getCategoryIcon(slug = '') {
  const s = slug.toLowerCase();
  if (s.includes('gastro') || s.includes('restor')) return '🍽️';
  if (s.includes('tregti') || s.includes('market')) return '🛒';
  if (s.includes('shendet') || s.includes('farmaci')) return '💊';
  if (s.includes('auto') || s.includes('transport')) return '🚗';
  if (s.includes('edukim') || s.includes('shkoll')) return '🎓';
  if (s.includes('sherb') || s.includes('zejtari')) return '🛠️';
  return '🏢';
}

/**
 * BusinessCard – Kartelë moderne dhe profesionale e biznesit
 * me meta-të dhëna të qarta, orare, kategori dhe dizajn premium.
 */
function BusinessCard({
  business,
  onSelectBusiness,
  isSponsored = false,
  userLocation = null,
}) {
  const {
    slug,
    name,
    short_description,
    address,
    phone,
    is_featured,
    category,
    settlement,
    services = [],
  } = business;

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Mbyll menunë e kartelës kur klikohet jashtë ose shtypet Escape
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const catIcon = getCategoryIcon(category?.slug || '');
  const effectiveSponsored = isSponsored || Boolean(business.is_sponsored);

  return (
    <article
      className={`biz-card ${effectiveSponsored ? 'biz-card--sponsored' : ''} ${is_featured && !effectiveSponsored ? 'biz-card--featured' : ''}`}
      aria-label={`Biznesi: ${name}`}
    >
      {/* Header me badget dhe menunë me tri pika */}
      <div className="biz-card__top">
        <div className="biz-card__badges">
          {effectiveSponsored && (
            <span className="badge badge--sponsored">
              ✦ E sponsorizuar
            </span>
          )}
          {is_featured && !effectiveSponsored && (
            <span className="badge badge--featured">
              ★ I Veçuar
            </span>
          )}
          <span className="badge badge--category">
            <span className="badge__icon" aria-hidden="true">{catIcon}</span>
            {category?.name ?? 'Kategori'}
          </span>
          {business.distance_text && (
            <span className="badge badge--distance" title={`Distanca fizike nga lokacioni juaj: ${business.distance_text}`}>
              🧭 {business.distance_text}
            </span>
          )}
          {business.active_deals_count > 0 && (
            <span className="badge badge--deal-pill" title="Ky biznes ka oferta dhe zbritje aktive">
              🏷️ Ofertë
            </span>
          )}
          {business.photos_count > 0 && (
            <span className="badge badge--photo-pill" title={`${business.photos_count} foto në galeri`}>
              📸 {business.photos_count}
            </span>
          )}
          {business.menu_items_count > 0 && (
            <span className="badge badge--menu-pill" title="Ky biznes ofron meny digjitale">
              🍽️ Meny
            </span>
          )}
        </div>

        <div className="biz-card__actions-top">

          {/* Menuja me tri pika (kebab menu) */}
          <div className="card-kebab-container" ref={menuRef}>
            <button
              type="button"
              className="card-kebab-btn"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-label={`Opsionet për ${name}`}
              title="Më shumë opsione"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="card-kebab-menu" role="menu">
                <button
                  type="button"
                  className="card-kebab-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    if (onSelectBusiness) onSelectBusiness(slug);
                  }}
                  role="menuitem"
                >
                  👁️ Shiko profilin e plotë
                </button>
                <button
                  type="button"
                  className="card-kebab-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    handleFavoriteClick(e);
                  }}
                  role="menuitem"
                >
                  {saved ? '💔 Hiq nga të preferuarat' : '❤️ Ruaj në të preferuarat'}
                </button>
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="card-kebab-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    📞 Telefono: {phone}
                  </a>
                )}
                <button
                  type="button"
                  className="card-kebab-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    const link = `${window.location.origin}/catalog?business=${slug}`;
                    navigator.clipboard?.writeText(link);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  role="menuitem"
                >
                  {copied ? '✓ U kopjua lidhja!' : '🔗 Kopjo lidhjen e biznesit'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Titulli dhe Emri */}
      <div className="biz-card__header">
        <h3 className="biz-card__title">
          {onSelectBusiness ? (
            <button
              type="button"
              className="biz-card__title-btn"
              onClick={() => onSelectBusiness(slug)}
            >
              {name}
            </button>
          ) : (
            name
          )}
        </h3>

        {business.reviews_count > 0 ? (
          <div className="biz-card__rating" title={`Mesatarja: ${Number(business.reviews_avg_rating).toFixed(1)} nga 5 yje`}>
            <span className="biz-card__rating-star">★</span>
            <span className="biz-card__rating-score">{Number(business.reviews_avg_rating).toFixed(1)}</span>
            <span className="biz-card__rating-count">({business.reviews_count})</span>
          </div>
        ) : (
          <div className="biz-card__rating biz-card__rating--none" title="Ende pa vlerësime nga qytetarët">
            <span className="biz-card__rating-star-empty">☆</span>
            <span className="biz-card__rating-none-text">E re</span>
          </div>
        )}
      </div>

      {/* Përshkrimi i shkurtër */}
      <div className="biz-card__body">
        <p className="biz-card__desc">
          {short_description || 'Biznes i regjistruar dhe aktiv në Komunën e Lipjanit.'}
        </p>

        {/* Shërbimet kyçe nëse ka */}
        {services && services.length > 0 && (
          <div className="biz-card__services">
            {services.slice(0, 3).map((svc) => (
              <span key={svc.id} className="biz-card__service-tag">
                ✓ {svc.name}
              </span>
            ))}
            {services.length > 3 && (
              <span className="biz-card__service-more">
                +{services.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta të dhënat e vendndodhjes dhe kontaktit */}
        <div className="biz-card__meta">
          {settlement?.name && (
            <div className="biz-card__meta-item">
              <span className="meta-icon" aria-hidden="true">📍</span>
              <span className="meta-text">{settlement.name}</span>
            </div>
          )}
          {address && (
            <div className="biz-card__meta-item">
              <span className="meta-icon" aria-hidden="true">🏠</span>
              <span className="meta-text meta-text--truncate">{address}</span>
            </div>
          )}
          {phone && (
            <div className="biz-card__meta-item">
              <span className="meta-icon" aria-hidden="true">📞</span>
              <a href={`tel:${phone}`} className="meta-link" onClick={(e) => e.stopPropagation()}>
                {phone}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer me veprimin kryesor dhe butonin e rrugës */}
      <div className="biz-card__footer">
        <div className="biz-card__footer-actions">
          {onSelectBusiness && (
            <button
              type="button"
              className="btn btn--view-profile"
              onClick={() => onSelectBusiness(slug)}
              aria-label={`Shiko profilin e plotë për ${name}`}
            >
              Shiko Profilin →
            </button>
          )}
          {business.latitude && business.longitude && (
            <a
              href={getDirectionsUrl(business.latitude, business.longitude, userLocation)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--route-card"
              onClick={(e) => e.stopPropagation()}
              title={`Hap navigimin hap-pas-hapi në Google Maps për ${name}`}
            >
              🧭 Rruga ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default BusinessCard;
