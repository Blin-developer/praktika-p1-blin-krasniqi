import { useState, useMemo } from 'react';

/**
 * BusinessDigitalMenu – Menyja digjitale e gastronomisë (restorante, kafene, piceri, furra)
 * me filtrim sipas kategorive, çmime të qarta dhe etiketa vegjetariane / popullore.
 */
export default function BusinessDigitalMenu({ menuItems = [], businessName = 'Biznesi' }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuSearch, setMenuSearch] = useState('');

  // Nxjerr kategoritë unike të menysë
  const categories = useMemo(() => {
    if (!menuItems || menuItems.length === 0) return [];
    const set = new Set();
    menuItems.forEach((item) => {
      if (item.menu_category) set.add(item.menu_category);
    });
    return Array.from(set);
  }, [menuItems]);

  // Filtro artikujt e menysë
  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.menu_category === selectedCategory;
      const matchSearch =
        !menuSearch.trim() ||
        item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(menuSearch.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, menuSearch]);

  if (!menuItems || menuItems.length === 0) {
    return null;
  }

  return (
    <section className="business-profile__card business-menu-section" aria-labelledby="menu-heading">
      <div className="business-menu-header">
        <div>
          <h2 id="menu-heading" className="business-profile__card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🍽️</span> Menyja Digjitale
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Shfletoni ushqimet, pijet dhe çmimet zyrtare të <strong>{businessName}</strong>.
          </p>
        </div>
        <span className="badge badge--category" style={{ fontWeight: 600 }}>
          {menuItems.length} Artikuj në Meny
        </span>
      </div>

      {/* Kontrollet e kërkimit dhe filtrimit sipas kategorive */}
      <div className="menu-controls">
        <div className="menu-categories-pills">
          <button
            type="button"
            className={`menu-cat-pill ${selectedCategory === 'all' ? 'is-active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Të Gjitha ({menuItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`menu-cat-pill ${selectedCategory === cat ? 'is-active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="search"
          className="menu-search-input"
          placeholder="🔍 Kërko ushqim ose pije..."
          value={menuSearch}
          onChange={(e) => setMenuSearch(e.target.value)}
          aria-label="Kërko artikull në meny"
        />
      </div>

      {/* Rrjeti i artikujve të menysë */}
      {filteredItems.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
          Nuk u gjet asnjë artikull për këtë kërkim.
        </div>
      ) : (
        <div className="menu-items-grid">
          {filteredItems.map((item) => (
            <article key={item.id} className="menu-item-card">
              {item.image_url && (
                <div className="menu-item-card__media">
                  <img src={item.image_url} alt={item.name} loading="lazy" />
                </div>
              )}
              <div className="menu-item-card__body">
                <div className="menu-item-card__header">
                  <div className="menu-item-card__name-row">
                    <h3 className="menu-item-card__name">{item.name}</h3>
                    <div className="menu-item-card__badges">
                      {item.is_popular && (
                        <span className="menu-tag menu-tag--popular" title="Specialiteti më i kërkuar i shtëpisë">
                          ★ Popullore
                        </span>
                      )}
                      {item.is_vegetarian && (
                        <span className="menu-tag menu-tag--veg" title="I përshtatshëm për vegjetarianë">
                          🌱 Vegjetariane
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="menu-item-card__price">
                    {parseFloat(item.price).toFixed(2)}€
                  </div>
                </div>

                {item.description && (
                  <p className="menu-item-card__desc">{item.description}</p>
                )}

                <div className="menu-item-card__category-tag">
                  {item.menu_category}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

