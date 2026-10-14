import { useState, useEffect } from 'react';
import BusinessList from '../components/BusinessList';
import { useBusinesses } from '../hooks/useBusinesses';
import { fetchCategories, fetchSettlements } from '../services/api';

/**
 * BusinessCatalogPage – Faqja kryesore e katalogut të bizneseve
 */
function BusinessCatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSettlement, setSelectedSettlement] = useState('');
  // Debounced search value to avoid sending request on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [settlements, setSettlements] = useState([]);

  // Initialize filters from URL query parameters on first render
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search') || '';
    const cat = params.get('category') || '';
    const setl = params.get('settlement') || '';
    setSearch(q);
    setSelectedCategory(cat);
    setSelectedSettlement(setl);
    setDebouncedSearch(q);
  }, []);
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);
  // Update URL whenever filters change (search, category, settlement)
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSettlement) params.set('settlement', selectedSettlement);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [debouncedSearch, selectedCategory, selectedSettlement]);

  const filters = {
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
    settlement: selectedSettlement || undefined,
  };
  const { businesses, loading, error, reload } = useBusinesses(filters);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.data || []))
      .catch(() => setCategories([]));

    fetchSettlements()
      .then((data) => setSettlements(data.data || []))
      .catch(() => setSettlements([]));
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
  }

  function handleReset() {
    setSearch('');
    setSelectedCategory('');
    setSelectedSettlement('');
    setDebouncedSearch('');
    // Clear URL query parameters
    window.history.replaceState(null, '', window.location.pathname);
  }

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        <div className="catalog-header__content">
          <h1 className="catalog-header__title">
            Katalogu i Bizneseve
            <span className="catalog-header__subtitle"> – Komuna e Lipjanit</span>
          </h1>
          <p className="catalog-header__description">
            Zbuloni bizneset dhe shërbimet e komunës së Lipjanit.
          </p>
        </div>
      </header>

      <main className="catalog-main">
        {/* Shiriti i filtrave */}
        <section className="filter-bar" aria-label="Filtrat e kërkimit">
          <form
            className="filter-bar__form"
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <div className="filter-group">
              <label htmlFor="search-input" className="filter-label">
                Kërko
              </label>
              <input
                id="search-input"
                type="search"
                className="filter-input"
                placeholder="Emri i biznesit, adresa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Kërko biznese"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="category-select" className="filter-label">
                Kategoria
              </label>
              <select
                id="category-select"
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filtro sipas kategorisë"
              >
                <option value="">Të gjitha kategoritë</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="settlement-select" className="filter-label">
                Vendndodhja
              </label>
              <select
                id="settlement-select"
                className="filter-select"
                value={selectedSettlement}
                onChange={(e) => setSelectedSettlement(e.target.value)}
                aria-label="Filtro sipas vendbanimit"
              >
                <option value="">Të gjitha vendbanimet</option>
                {settlements.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleReset}
              aria-label="Pastro filtrat"
            >
              Pastro
            </button>
          </form>
        </section>

        {/* Lista e bizneseve */}
        <BusinessList
          businesses={businesses}
          loading={loading}
          error={error}
          onRetry={reload}
        />
      </main>
    </div>
  );
}

export default BusinessCatalogPage;
