import { useState, useEffect } from 'react';
import SponsoredAdBanner from '../components/SponsoredAdBanner';
import BusinessCard from '../components/BusinessCard';
import {
  fetchAdvertisements,
  fetchCategories,
  fetchBusinesses,
  trackAdClick,
  trackAdImpression,
} from '../services/api';

export default function HomePage({
  onNavigateToCatalog,
  onNavigateToCategories,
  onSelectCategory,
  onSelectBusiness,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredAds, setFeaturedAds] = useState([]);
  const [categoryPromoAds, setCategoryPromoAds] = useState([]);
  const [sponsoredAds, setSponsoredAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularBusinesses, setPopularBusinesses] = useState([]);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      try {
        // Merr të gjitha pozicionet e reklamave aktive
        const [featuredRes, sponsoredRes, categoryPromoRes, catRes, bizRes] = await Promise.all([
          fetchAdvertisements({ position: 'homepage_featured', limit: 3 }).catch(() => ({ data: [] })),
          fetchAdvertisements({ position: 'sponsored_businesses', limit: 6 }).catch(() => ({ data: [] })),
          fetchAdvertisements({ position: 'category_promotion', limit: 4 }).catch(() => ({ data: [] })),
          fetchCategories().catch(() => ({ data: [] })),
          fetchBusinesses({ featured: 1 }).catch(() => ({ data: [] })),
        ]);

        const fAds = featuredRes.data || [];
        setFeaturedAds(fAds);
        fAds.forEach((ad) => trackAdImpression(ad.id));

        const sAds = sponsoredRes.data || [];
        setSponsoredAds(sAds);
        sAds.forEach((ad) => trackAdImpression(ad.id));

        const cpAds = categoryPromoRes.data || [];
        setCategoryPromoAds(cpAds);
        cpAds.forEach((ad) => trackAdImpression(ad.id));

        setCategories(catRes.data || []);
        setPopularBusinesses((bizRes.data || []).slice(0, 6));
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onNavigateToCatalog) {
      onNavigateToCatalog({ search: searchTerm.trim() });
    }
  };

  const handleCategoryClick = (catSlug) => {
    if (onSelectCategory) {
      onSelectCategory(catSlug);
    }
  };

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="home-hero">
        <div className="home-hero__bg-shape" aria-hidden="true"></div>
        <div className="home-hero__container">
          <span className="home-hero__tag">
            🌟 Platforma Zyrtare Lokale e Komunës së Lipjanit
          </span>
          <h1 className="home-hero__title">
            Gjithçka që kërkon në Lipjan, në një vend.
          </h1>
          <p className="home-hero__subtitle">
            Zbulo bizneset, shërbimet dhe vendet që të duhen, pranë teje.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="home-hero__search-box">
            <span className="home-hero__search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="home-hero__search-input"
              placeholder="Kërko biznes ose shërbim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Kërko biznes ose shërbim"
            />
            <button type="submit" className="btn btn--primary home-hero__search-btn">
              Kërko Tani
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="home-hero__quick-tags">
            <span className="quick-tags-label">Kërkime të shpeshta:</span>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                type="button"
                className="quick-tag-chip"
                onClick={() => handleCategoryClick(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. REKLAMAT KRYESORE TË SPONSORIZUARA (HOMEPAGE FEATURED) */}
      {featuredAds.length > 0 && (
        <section className="home-section home-section--ad" aria-label="Reklama të veçuara">
          <div className="site-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {featuredAds.map((ad) => (
              <SponsoredAdBanner
                key={ad.id}
                ad={ad}
                variant="featured"
                onSelectBusiness={onSelectBusiness}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. KATEGORITË KRYESORE */}
      <section id="categories" className="home-section" aria-labelledby="cat-heading">
        <div className="site-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Zbuloni sipas sektorit</span>
              <h2 id="cat-heading" className="section-title">Kategoritë e Bizneseve</h2>
            </div>
            <div className="section-header__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => onNavigateToCategories ? onNavigateToCategories() : onNavigateToCatalog()}
              >
                📁 Të Gjitha Kategoritë
              </button>
              <button
                type="button"
                className="btn btn--link"
                onClick={() => onNavigateToCatalog()}
              >
                Katalogu i Plotë →
              </button>
            </div>
          </div>

          <div className="category-grid">
            {categories.map((cat) => {
              const icons = {
                gastronomi: '🍽️',
                tregti: '🛒',
                shendetesi: '💊',
                'auto-transport': '🚗',
                sherbime: '🛠️',
                edukim: '🎓',
              };
              const icon = icons[cat.slug] || '🏢';

              return (
                <div
                  key={cat.id}
                  className="cat-card"
                  onClick={() => handleCategoryClick(cat.slug)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.slug)}
                >
                  <div className="cat-card__icon" aria-hidden="true">{icon}</div>
                  <h3 className="cat-card__name">{cat.name}</h3>
                  <p className="cat-card__desc">
                    {cat.description || 'Eksploroni bizneset dhe shërbimet e këtij sektori.'}
                  </p>
                  <div className="cat-card__meta">
                    <span className="cat-card__count">
                      {cat.businesses_count ? `${cat.businesses_count} biznese` : 'Eksploro'}
                    </span>
                    <span className="cat-card__arrow">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3.1 PROMOVIME TË VEÇUARA SIPAS KATEGORIVE (CATEGORY PROMOTION) */}
      {categoryPromoAds.length > 0 && (
        <section className="home-section home-section--category-promos" aria-label="Promovime sipas kategorive" style={{ paddingTop: '1rem', paddingBottom: '2.5rem' }}>
          <div className="site-container">
            <div className="section-header" style={{ marginBottom: '1.25rem' }}>
              <div>
                <span className="section-eyebrow">✦ Promovime të Spikatura sipas Sektorit</span>
                <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Promovime të Zgjedhura në Lipjan</h2>
                <p className="section-subtitle">
                  Ofertat dhe shërbimet e veçuara nga kategoritë kryesore të bizneseve.
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {categoryPromoAds.map((ad) => (
                <SponsoredAdBanner
                  key={ad.id}
                  ad={ad}
                  variant="featured"
                  onSelectBusiness={onSelectBusiness}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. BIZNESET E SPONSORIZUARA DHE TË REKOMANDUARA */}
      <section id="sponsored" className="home-section home-section--alt" aria-labelledby="sponsored-heading">
        <div className="site-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Biznese të spikatura</span>
              <h2 id="sponsored-heading" className="section-title">Biznese të Sponsorizuara</h2>
              <p className="section-subtitle">
                Biznese të veçuara dhe partnerë lokalë që ofrojnë produkte e shërbime cilësore në Komunën e Lipjanit.
              </p>
            </div>
            <span className="sponsored-info-pill">
              ✦ {sponsoredAds.length > 0 ? `${sponsoredAds.length} Promovime Aktive` : 'Sistemi i Reklamave'}
            </span>
          </div>

          {sponsoredAds.length > 0 ? (
            <div className="sponsored-grid">
              {sponsoredAds.map((ad) => (
                <article key={ad.id} className="sponsored-card">
                  <div className="sponsored-card__media">
                    <img
                      src={ad.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'}
                      alt={ad.title}
                      loading="lazy"
                    />
                    <div className="sponsored-card__badges-overlay">
                      <span className="ad-badge ad-badge--gold">✦ E sponsorizuar</span>
                      {ad.business?.settlement?.name && (
                        <span className="ad-badge ad-badge--location">📍 {ad.business.settlement.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="sponsored-card__content">
                    <div className="sponsored-card__brand-row">
                      <span className="sponsored-card__brand">
                        {ad.business?.name || 'Biznes i Lipjanit'}
                      </span>
                      {ad.business?.category?.name && (
                        <span className="badge badge--category">{ad.business.category.name}</span>
                      )}
                    </div>
                    <h3 className="sponsored-card__title">{ad.title}</h3>
                    <p className="sponsored-card__desc">{ad.description}</p>
                    <div className="sponsored-card__footer">
                      {ad.business?.slug && (
                        <button
                          type="button"
                          className="btn btn--primary btn--sm btn--block sponsored-card__cta"
                          onClick={() => {
                            trackAdClick(ad.id);
                            onSelectBusiness(ad.business.slug);
                          }}
                        >
                          {ad.cta_text || 'Shiko Profilin'} →
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="sponsored-empty-box">
              <div className="sponsored-empty-box__icon">📢</div>
              <h3 className="sponsored-empty-box__title">Nuk ka promovime aktive për momentin</h3>
              <p className="sponsored-empty-box__desc">
                Bizneset lokale të Komunës së Lipjanit mund të promovojnë produktet dhe shërbimet e tyre përmes Panelit Administrativ me afate të kontrolluara kohore.
              </p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onNavigateToCatalog()}
              >
                Eksploroni Katalogun e Bizneseve →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. BIZNESE TË VEÇUARA NGA KOMUNA */}
      {popularBusinesses.length > 0 && (
        <section className="home-section" aria-labelledby="featured-heading">
          <div className="site-container">
            <div className="section-header">
              <div>
                <span className="section-eyebrow">Biznese Lokale</span>
                <h2 id="featured-heading" className="section-title">Biznese të Veçuara në Lipjan</h2>
              </div>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => onNavigateToCatalog()}
              >
                Katalogu i Plotë ({popularBusinesses.length}+)
              </button>
            </div>

            <div className="business-grid">
              {popularBusinesses.map((biz) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  onSelectBusiness={onSelectBusiness}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. SEKSIONI INFORMATIV (SI FUNKSIONON) */}
      <section className="home-section home-section--info" aria-labelledby="info-heading">
        <div className="site-container">
          <div className="info-box">
            <div className="info-box__header text-center">
              <span className="section-eyebrow">Për qytetarët dhe vizitorët</span>
              <h2 id="info-heading" className="section-title">Pse të përdorni Katalogun e Lipjanit?</h2>
              <p className="section-subtitle">
                Platforma zyrtare ofron qasje të drejtpërdrejtë në të gjitha shërbimet tregtare dhe profesionale të qytetit dhe fshatrave përreth.
              </p>
            </div>

            <div className="info-cards-grid">
              <div className="info-card">
                <div className="info-card__icon" aria-hidden="true">📍</div>
                <h3>Zbuloni pranë jush</h3>
                <p>
                  Gjeni biznese sipas vendbanimeve të Lipjanit: nga qendra deri në Gadime, Janjevë, Magure e më gjerë.
                </p>
              </div>

              <div className="info-card">
                <div className="info-card__icon" aria-hidden="true">🕒</div>
                <h3>Orare dhe kontakte reale</h3>
                <p>
                  Orari i përditësuar i punës, numrat e telefonit për thirrje direkte dhe harta e saktë gjeografike.
                </p>
              </div>

              <div className="info-card">
                <div className="info-card__icon" aria-hidden="true">❤️</div>
                <h3>Ruani të preferuarat</h3>
                <p>
                  Krijoni llogarinë tuaj personale falas për të mbajtur listën e bizneseve tuaja të preferuara për çdo kohë.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
