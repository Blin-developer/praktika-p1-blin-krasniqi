import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

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
 * me ruajtje në të favorizuara, meta-të dhëna të qarta dhe dizajn premium.
 */
function BusinessCard({
  business,
  onSelectBusiness,
  onRequireAuth,
  isSponsored = false,
}) {
  const {
    id,
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

  const { isAuthenticated, isFavorite, toggleFavorite } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const saved = isFavorite(id);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      if (onRequireAuth) {
        onRequireAuth('Për të ruajtur këtë biznes, ju lutem kyçuni ose regjistrohuni.');
      }
      return;
    }

    try {
      setSaving(true);
      await toggleFavorite(id);
    } catch {
      // Handled in context
    } finally {
      setSaving(false);
    }
  };

  const catIcon = getCategoryIcon(category?.slug || '');

  return (
    <article
      className={`biz-card ${isSponsored ? 'biz-card--sponsored' : ''} ${is_featured ? 'biz-card--featured' : ''}`}
      aria-label={`Biznesi: ${name}`}
    >
      {/* Header me badget dhe butonin e ruajtjes */}
      <div className="biz-card__top">
        <div className="biz-card__badges">
          {isSponsored && (
            <span className="badge badge--sponsored">
              ★ E sponsorizuar
            </span>
          )}
          {is_featured && !isSponsored && (
            <span className="badge badge--featured">
              ★ I Veçuar
            </span>
          )}
          <span className="badge badge--category">
            <span className="badge__icon" aria-hidden="true">{catIcon}</span>
            {category?.name ?? 'Kategori'}
          </span>
        </div>

        <button
          type="button"
          className={`biz-card__fav-btn ${saved ? 'biz-card__fav-btn--active' : ''}`}
          onClick={handleFavoriteClick}
          disabled={saving}
          aria-label={saved ? `Hiq ${name} nga të ruajturat` : `Ruaj ${name} në llogari`}
          title={saved ? 'Hiq nga të ruajturat' : 'Ruaje biznesin'}
        >
          {saved ? '❤️' : '🤍'}
        </button>
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

      {/* Footer me veprimin kryesor */}
      <div className="biz-card__footer">
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
      </div>
    </article>
  );
}

export default BusinessCard;
