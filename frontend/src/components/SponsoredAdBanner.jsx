import { useEffect } from 'react';
import { trackAdClick, trackAdImpression } from '../services/api';

/**
 * SponsoredAdBanner – Komponent për shfaqjen e reklamave të sponsorizuara
 * me identifikim të qartë ligjor "E sponsorizuar", klikime të gjurmuara dhe CTA funksionale.
 */
export default function SponsoredAdBanner({
  ad,
  variant = 'featured', // 'featured' | 'sidebar' | 'inline'
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
      // Nëse ka URL të jashtme
      return;
    }

    if (onSelectBusiness && ad.business?.slug) {
      e.preventDefault();
      onSelectBusiness(ad.business.slug);
    }
  };

  const businessName = ad.business?.name || 'Biznes Lokal';
  const ctaText = ad.cta_text || 'Shiko biznesin';
  const imageUrl = ad.image_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';

  if (variant === 'sidebar') {
    return (
      <aside className="ad-card ad-card--sidebar" aria-label="Reklamë e sponsorizuar">
        <div className="ad-card__badge-row">
          <span className="ad-badge">★ E sponsorizuar</span>
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
            className="btn btn--ad-cta"
            target={ad.cta_url ? '_blank' : '_self'}
            rel={ad.cta_url ? 'noopener noreferrer' : ''}
          >
            {ctaText} ↗
          </a>
        </div>
      </aside>
    );
  }

  // Variant: Featured (Homepage / Hero)
  return (
    <article className="ad-featured-banner" aria-label="Njoftim i sponsorizuar">
      <div className="ad-featured-banner__badge">
        <span className="ad-badge ad-badge--gold">★ E sponsorizuar</span>
      </div>
      <div className="ad-featured-banner__grid">
        <div className="ad-featured-banner__text">
          <span className="ad-featured-banner__brand">{businessName}</span>
          <h2 className="ad-featured-banner__title">{ad.title}</h2>
          {ad.description && (
            <p className="ad-featured-banner__desc">{ad.description}</p>
          )}
          <div className="ad-featured-banner__actions">
            <a
              href={ad.cta_url || `#business-${ad.business?.slug}`}
              onClick={handleCtaClick}
              className="btn btn--primary btn--lg"
              target={ad.cta_url ? '_blank' : '_self'}
              rel={ad.cta_url ? 'noopener noreferrer' : ''}
            >
              {ctaText} →
            </a>
            {ad.business?.slug && onSelectBusiness && (
              <button
                type="button"
                className="btn btn--outline-dark"
                onClick={() => onSelectBusiness(ad.business.slug)}
              >
                Profili i Biznesit
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
