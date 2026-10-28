import { useState, useEffect } from 'react';
import { fetchCategories, fetchAdvertisements } from '../services/api';
import SponsoredAdBanner from '../components/SponsoredAdBanner';

/**
 * Merr një ikonë të përshtatshme vizuale sipas slug-ut të kategorisë.
 */
function getCategoryIcon(slug = '') {
  const s = slug.toLowerCase();
  if (s.includes('gastro') || s.includes('restor') || s.includes('kafe')) return '🍽️';
  if (s.includes('tregti') || s.includes('market') || s.includes('dyqan')) return '🛒';
  if (s.includes('shendet') || s.includes('farmaci') || s.includes('mjek')) return '💊';
  if (s.includes('auto') || s.includes('transport') || s.includes('servis')) return '🚗';
  if (s.includes('sherb') || s.includes('zejtari') || s.includes('mirembajtje')) return '🛠️';
  if (s.includes('edukim') || s.includes('shkoll') || s.includes('trajnim')) return '🎓';
  if (s.includes('ndertim') || s.includes('arkitektur')) return '🏗️';
  if (s.includes('financ') || s.includes('bank') || s.includes('kontabilitet')) return '💼';
  if (s.includes('hotel') || s.includes('turiz')) return '🏨';
  if (s.includes('bujqesi') || s.includes('forme')) return '🌾';
  return '🏢';
}

/**
 * CategoriesPage – Faqja e dedikuar dhe plotësisht funksionale e kategorive të bizneseve.
 * Çdo kategori lidhet drejtpërdrejt me katalogun dhe filtron bizneset reale nga baza e të dhënave.
 */
export default function CategoriesPage({ onSelectCategory, onNavigateToCatalog }) {
  const [categories, setCategories] = useState([]);
  const [categoryAds, setCategoryAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorySearch, setCategorySearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchCategories(),
      fetchAdvertisements({ position: 'category_promotion', limit: 4 }).catch(() => ({ data: [] })),
    ])
      .then(([catRes, adsRes]) => {
        if (isMounted) {
          setCategories(catRes.data || []);
          setCategoryAds(adsRes.data || []);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Dështoi ngarkimi i të dhënave.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCategories = categories.filter((cat) => {
    if (!categorySearch.trim()) return true;
    const term = categorySearch.toLowerCase().trim();
    return (
      cat.name?.toLowerCase().includes(term) ||
      cat.description?.toLowerCase().includes(term) ||
      cat.slug?.toLowerCase().includes(term)
    );
  });

  const totalBusinessesInCategories = categories.reduce(
    (acc, cat) => acc + (cat.businesses_count || 0),
    0
  );

  const handleCategoryClick = (slug) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else if (onNavigateToCatalog) {
      onNavigateToCatalog({ category: slug });
    }
  };

  return (
    <div className="categories-page">
      {/* Header i Faqes së Kategorive */}
      <header className="categories-header">
        <div className="site-container">
          <div className="categories-header__content">
            <span className="badge badge--gold">📁 Sektorët Ekonomikë &amp; Shërbimet</span>
            <h1 className="categories-header__title">
              Kategoritë e Bizneseve
              <span className="categories-header__subtitle"> – Komuna e Lipjanit</span>
            </h1>
            <p className="categories-header__description">
              Zbuloni bizneset, shërbimet profesionale dhe zejtaritë lokale të organizuara sipas sektorit përkatës. Klikoni çdo kategori për të shfaqur menjëherë të gjitha bizneset aktive në katalog.
            </p>

            {/* Statistikat përmbledhëse */}
            <div className="categories-stats-row">
              <div className="category-stat-pill">
                <span className="category-stat-pill__number">{categories.length}</span>
                <span className="category-stat-pill__label">Kategori Zyrtare</span>
              </div>
              <div className="category-stat-pill">
                <span className="category-stat-pill__number">{totalBusinessesInCategories}+</span>
                <span className="category-stat-pill__label">Biznese të Lidhura</span>
              </div>
            </div>

            {/* Kërkim i shpejtë brenda kategorive */}
            <div className="categories-search-box">
              <span className="categories-search-icon" aria-hidden="true">🔍</span>
              <input
                type="search"
                className="categories-search-input"
                placeholder="Filtro kategoritë (p.sh. Gastronomi, Farmaci, Auto)..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                aria-label="Filtro kategoritë"
              />
              {categorySearch && (
                <button
                  type="button"
                  className="categories-search-clear"
                  onClick={() => setCategorySearch('')}
                  aria-label="Pastro kërkimin e kategorive"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Trupi kryesor me Grid-in e Kategorive */}
      <main className="categories-main site-container">
        {loading ? (
          <div className="categories-loading" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p>Duke ngarkuar të gjitha kategoritë nga baza e të dhënave...</p>
          </div>
        ) : error ? (
          <div className="state-card state-card--error" role="alert">
            <div className="state-card__icon">⚠️</div>
            <h3 className="state-card__title">Ndodhi një gabim gjatë ngarkimit</h3>
            <p className="state-card__desc">{error}</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              Provo Sërish
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="state-card state-card--empty">
            <div className="state-card__icon">🔍</div>
            <h3 className="state-card__title">Nuk u gjet asnjë kategori</h3>
            <p className="state-card__desc">
              Nuk ka kategori që përputhen me termin «{categorySearch}». Provoni një fjalë tjetër.
            </p>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setCategorySearch('')}
            >
              Pastro Kërkimin
            </button>
          </div>
        ) : (
          <>
            {categoryAds.length > 0 && (
              <section className="categories-ads-banner-wrap" aria-label="Promovime të veçuara në kategori" style={{ marginBottom: '2.5rem' }}>
                <div className="section-header" style={{ marginBottom: '1rem' }}>
                  <div>
                    <span className="section-eyebrow">✦ Promovime të Zgjedhura</span>
                    <h2 className="section-title" style={{ fontSize: '1.35rem' }}>Biznese të Rekomanduara në Sektorët Kryesorë</h2>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {categoryAds.map((ad) => (
                    <SponsoredAdBanner
                      key={ad.id}
                      ad={ad}
                      variant="featured"
                      onSelectBusiness={(slug) => {
                        if (onNavigateToCatalog) {
                          onNavigateToCatalog({ business: slug });
                        }
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            <div className="categories-section-head">
              <h2 className="categories-section-title">
                Të gjithë sektorët ({filteredCategories.length})
              </h2>
              {onNavigateToCatalog && (
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => onNavigateToCatalog()}
                >
                  Hap Katalogun e Plotë →
                </button>
              )}
            </div>

            <div className="categories-showcase-grid">
              {filteredCategories.map((cat) => {
                const icon = getCategoryIcon(cat.slug);
                const count = cat.businesses_count || 0;

                return (
                  <article
                    key={cat.id || cat.slug}
                    className="category-card"
                    onClick={() => handleCategoryClick(cat.slug)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCategoryClick(cat.slug);
                      }
                    }}
                    aria-label={`Kategoria ${cat.name}, me ${count} biznese`}
                  >
                    <div className="category-card__header">
                      <div className="category-card__icon-wrapper" aria-hidden="true">
                        <span className="category-card__icon">{icon}</span>
                      </div>
                      <span className="category-card__count-badge">
                        {count} {count === 1 ? 'biznes' : 'biznese'}
                      </span>
                    </div>

                    <div className="category-card__body">
                      <h3 className="category-card__name">{cat.name}</h3>
                      <p className="category-card__desc">
                        {cat.description ||
                          `Eksploroni të gjitha bizneset, shërbimet dhe zejet në sektorin e ${cat.name.toLowerCase()} në Lipjan.`}
                      </p>
                    </div>

                    <div className="category-card__footer">
                      <span className="category-card__action-text">
                        Eksploro Bizneset
                      </span>
                      <span className="category-card__arrow" aria-hidden="true">
                        →
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
