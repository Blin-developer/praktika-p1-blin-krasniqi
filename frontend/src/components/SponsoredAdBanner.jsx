import { useEffect } from 'react';
import { trackAdClick, trackAdImpression } from '../services/api';

/**
 * SponsoredAdBanner – Komponent premium për shfaqjen e reklamave të sponsorizuara
 * me identifikim të qartë "E sponsorizuar", klikime të gjurmuara dhe dizajn elitar.
 */
export default function SponsoredAdBanner({
  ad,
  variant = 'featured', // 'featured' | 'sidebar'
  onSelectBusiness,
}) {
  useEffect(() => {
    if (ad?.id) {
      trackAdImpression(ad.id);
    }
  }, [ad?.id]);

  if (!ad) return null;

  const handleCtaClick = (e) => {
    trackAdClick(ad.id);
    if (ad.cta_url) {
      return;
    }

    if (onSelectBusiness && ad.business?.slug) {
      e.preventDefault();
      onSelectBusiness(ad.business.slug);
    }
  };

  const businessName = ad.business?.name || 'Biznes i Lipjanit';
  const ctaText = ad.cta_text || 'Zbulo më shumë';
  const imageUrl =
    ad.image_url ||
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';

  if (variant === 'sidebar') {
    return (
      <aside className="ad-card ad-card--sidebar" aria-label="Njoftim i sponsorizuar">
        <div className="ad-card__header-bar">
          <span className="ad-badge ad-badge--gold">✦ E sponsorizuar</span>
          {ad.business?.settlement?.name && (
            <span className="ad-card__loc">📍 {ad.business.settlement.name}</span>
          )}
        </div>

        <div className="ad-card__image-wrap">
          <img
            src={imageUrl}
            alt={ad.title}
            className="ad-card__image"
            loading="lazy"
          />
        </div>

        <div className="ad-card__content">
          <span className="ad-card__business">{businessName}</span>
          <h4 className="ad-card__title">{ad.title}</h4>
          {ad.description && <p className="ad-card__desc">{ad.description}</p>}
          <a
            href={ad.cta_url || `#business-${ad.business?.slug}`}
            onClick={handleCtaClick}
            className="btn btn--primary btn--sm btn--block ad-card__btn"
            target={ad.cta_url ? '_blank' : '_self'}
            rel={ad.cta_url ? 'noopener noreferrer' : ''}
          >
            {ctaText} ↗
          </a>
        </div>
      </aside>
    );
  }

  // Variant: Featured (Homepage)
  return (
    <article className="ad-featured-banner" aria-label="Biznes i veçuar i sponsorizuar">
      <div className="ad-featured-banner__grid">
        <div className="ad-featured-banner__text">
          <div className="ad-featured-banner__badge-row">
            <span className="ad-badge ad-badge--gold">✦ E sponsorizuar</span>
            {ad.business?.category?.name && (
              <span className="badge badge--category">{ad.business.category.name}</span>
            )}
          </div>

          <span className="ad-featured-banner__brand">{businessName}</span>
          <h2 className="ad-featured-banner__title">{ad.title}</h2>
          {ad.description && (
            <p className="ad-featured-banner__desc">{ad.description}</p>
          )}

          <div className="ad-featured-banner__actions">
            <a
              href={ad.cta_url || `#business-${ad.business?.slug}`}
              onClick={handleCtaClick}
              className="btn btn--primary"
              target={ad.cta_url ? '_blank' : '_self'}
              rel={ad.cta_url ? 'noopener noreferrer' : ''}
            >
              {ctaText} →
            </a>
            {ad.business?.slug && onSelectBusiness && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => onSelectBusiness(ad.business.slug)}
              >
                Shiko Profilin e Plotë
              </button>
            )}
          </div>
        </div>

        <div className="ad-featured-banner__media">
          <img
            src={imageUrl}
            alt={ad.title}
            className="ad-featured-banner__img"
            loading="lazy"
          />
        </div>
      </div>
    </article>
  );
}
