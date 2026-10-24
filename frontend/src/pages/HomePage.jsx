import { useState, useEffect } from 'react';
import SponsoredAdBanner from '../components/SponsoredAdBanner';
import BusinessCard from '../components/BusinessCard';
import { fetchAdvertisements, fetchCategories, fetchBusinesses } from '../services/api';

export default function HomePage({
  onNavigateToCatalog,
  onSelectCategory,
  onSelectBusiness,
  onRequireAuth,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredAd, setFeaturedAd] = useState(null);
  const [sponsoredAds, setSponsoredAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularBusinesses, setPopularBusinesses] = useState([]);
  const [_loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      try {
        // 1. Merr reklamat
        const [featuredRes, sponsoredRes, catRes, bizRes] = await Promise.all([
          fetchAdvertisements({ position: 'homepage_featured', limit: 1 }).catch(() => ({ data: [] })),
          fetchAdvertisements({ position: 'sponsored_businesses', limit: 3 }).catch(() => ({ data: [] })),
          fetchCategories().catch(() => ({ data: [] })),
          fetchBusinesses({ featured: 1 }).catch(() => ({ data: [] })),
        ]);

        if (featuredRes.data && featuredRes.data.length > 0) {
          setFeaturedAd(featuredRes.data[0]);
        }
        setSponsoredAds(sponsoredRes.data || []);
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

      {/* 2. REKLAMA KRYESORE E SPONSORIZUAR (HOMEPAGE FEATURED) */}
      {featuredAd && (
        <section className="home-section home-section--ad" aria-label="Reklamë e veçuar">
          <div className="site-container">
            <SponsoredAdBanner
              ad={featuredAd}
              variant="featured"
              onSelectBusiness={onSelectBusiness}
            />
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
            <button
              type="button"
              className="btn btn--link"
              onClick={() => onNavigateToCatalog()}
            >
              Shiko të gjitha bizneset →
            </button>
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

      {/* 4. BIZNESET E SPONSORIZUARA DHE TË REKOMANDUARA */}
      {sponsoredAds.length > 0 && (
        <section id="sponsored" className="home-section home-section--alt" aria-labelledby="sponsored-heading">
          <div className="site-container">
            <div className="section-header">
              <div>
                <span className="section-eyebrow">Biznese të spikatura</span>
                <h2 id="sponsored-heading" className="section-title">Të Sponsorizuara</h2>
              </div>
              <span className="sponsored-info-pill">★ Promovime Aktive</span>
            </div>

            <div className="sponsored-grid">
              {sponsoredAds.map((ad) => (
                <article key={ad.id} className="sponsored-card">
                  <div className="sponsored-card__media">
                    <img
                      src={ad.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'}
                      alt={ad.title}
                      loading="lazy"
                    />
                    <span className="ad-badge ad-badge--gold">★ E sponsorizuar</span>
                  </div>
                  <div className="sponsored-card__content">
                    <span className="sponsored-card__brand">
                      {ad.business?.name || 'Biznes i Lipjanit'}
                    </span>
                    <h3 className="sponsored-card__title">{ad.title}</h3>
                    <p className="sponsored-card__desc">{ad.description}</p>
                    <div className="sponsored-card__footer">
                      {ad.business?.slug && (
                        <button
                          type="button"
                          className="btn btn--outline-primary btn--sm"
                          onClick={() => onSelectBusiness(ad.business.slug)}
                        >
                          {ad.cta_text || 'Shiko profilin'} →
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

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
                  onRequireAuth={onRequireAuth}
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

      {/* 7. FOOTER */}
      <footer className="site-footer">
        <div className="site-container">
          <div className="site-footer__grid">
            <div className="site-footer__col site-footer__col--brand">
              <div className="footer-brand">
                <span className="footer-brand__crest">🏛️</span>
                <div>
                  <h3 className="footer-brand__title">Katalogu i Bizneseve</h3>
                  <span className="footer-brand__sub">Komuna e Lipjanit</span>
                </div>
              </div>
              <p className="site-footer__text">
                Portali zyrtar për prezantimin, promovimin dhe mbështetjen e bizneseve dhe ndërmarrësisë lokale në territorin e Lipjanit.
              </p>
            </div>

            <div className="site-footer__col">
              <h4 className="site-footer__heading">Lidhje të Shpejta</h4>
              <ul className="site-footer__links">
                <li>
                  <button type="button" onClick={() => onNavigateToCatalog()}>
                    Katalogu i Plotë
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onSelectCategory('gastronomi')}>
                    Restorante &amp; Kafene
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onSelectCategory('shendetesi')}>
                    Farmaci &amp; Mjekësi
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onSelectCategory('tregti')}>
                    Supermarkete &amp; Tregti
                  </button>
                </li>
              </ul>
            </div>

            <div className="site-footer__col">
              <h4 className="site-footer__heading">Për Ndërmarrësit</h4>
              <ul className="site-footer__links">
                <li>
                  <span>Promovoni biznesin tuaj me reklama të synuara</span>
                </li>
                <li>
                  <span>Vendndodhje të verifikuara në hartë</span>
                </li>
                <li>
                  <span>Lidhje direkte me qytetarët lokalë</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="site-footer__bottom">
            <p>
              &copy; {new Date().getFullYear()} Komuna e Lipjanit &bull; Katalogu i Bizneseve Lokale. Të gjitha të drejtat të rezervuara.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
