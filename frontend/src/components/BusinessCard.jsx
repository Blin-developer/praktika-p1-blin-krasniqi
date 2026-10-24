import { useContext, useState, useEffect, useRef } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const saved = isFavorite(id);
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

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      if (onRequireAuth) {
        onRequireAuth('login', 'Për të ruajtur këtë biznes, ju lutem kyçuni ose regjistrohuni.');
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
      {/* Header me badget, butonin e ruajtjes dhe menunë me tri pika */}
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

        <div className="biz-card__actions-top">
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
