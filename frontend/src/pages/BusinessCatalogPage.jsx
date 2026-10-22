import { useState, useEffect, useRef } from 'react';
import BusinessList from '../components/BusinessList';
import BusinessProfile from '../components/BusinessProfile';
import { useBusinesses } from '../hooks/useBusinesses';
import { fetchCategories, fetchSettlements, fetchServices } from '../services/api';

/**
 * BusinessCatalogPage – Faqja kryesore e katalogut të bizneseve të Komunës së Lipjanit.
 * Mbështet kërkim, 5 filtra të integruar (kategoria, vendbanimi, shërbimi, website, orari),
 * ruajtje të plotë në URL dhe faqosje me 12 biznese për faqe.
 */
function BusinessCatalogPage({ onNavigateToAdmin }) {
  // Inicializo gjendjet drejtpërdrejt nga URL query parameters
  const [search, setSearch] = useState(() => {
    return new URLSearchParams(window.location.search).get('search') || '';
  });
  const [debouncedSearch, setDebouncedSearch] = useState(() => {
    return new URLSearchParams(window.location.search).get('search') || '';
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return new URLSearchParams(window.location.search).get('category') || '';
  });
  const [selectedSettlement, setSelectedSettlement] = useState(() => {
    return new URLSearchParams(window.location.search).get('settlement') || '';
  });
  const [selectedService, setSelectedService] = useState(() => {
    return new URLSearchParams(window.location.search).get('service') || '';
  });
  const [selectedWebsite, setSelectedWebsite] = useState(() => {
    return new URLSearchParams(window.location.search).get('website') || '';
  });
  const [selectedSchedule, setSelectedSchedule] = useState(() => {
    return new URLSearchParams(window.location.search).get('schedule') || '';
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const p = parseInt(new URLSearchParams(window.location.search).get('page'), 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  });
  const [selectedBusinessSlug, setSelectedBusinessSlug] = useState(() => {
    return new URLSearchParams(window.location.search).get('business') || '';
  });

  const [categories, setCategories] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [services, setServices] = useState([]);

  // Flag për të shmangur mbishkrimin e faqes gjatë rikthimit nga historia popstate
  const isPopStateRef = useRef(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Kur ndryshon një filtër ose kërkimi (jo nga popstate), rikthejmë faqen në 1
  const prevFiltersRef = useRef({
    debouncedSearch,
    selectedCategory,
    selectedSettlement,
    selectedService,
    selectedWebsite,
    selectedSchedule,
  });

  useEffect(() => {
    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      return;
    }

    const prev = prevFiltersRef.current;
    const hasFilterChanged =
      prev.debouncedSearch !== debouncedSearch ||
      prev.selectedCategory !== selectedCategory ||
      prev.selectedSettlement !== selectedSettlement ||
      prev.selectedService !== selectedService ||
      prev.selectedWebsite !== selectedWebsite ||
      prev.selectedSchedule !== selectedSchedule;

    if (hasFilterChanged) {
      setCurrentPage(1);
      prevFiltersRef.current = {
        debouncedSearch,
        selectedCategory,
        selectedSettlement,
        selectedService,
        selectedWebsite,
        selectedSchedule,
      };
    }
  }, [
    debouncedSearch,
    selectedCategory,
    selectedSettlement,
    selectedService,
    selectedWebsite,
    selectedSchedule,
  ]);

  // Sinkronizo URL-në kur ndryshojnë filtrat, kërkimi, faqja ose profili
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSettlement) params.set('settlement', selectedSettlement);
    if (selectedService) params.set('service', selectedService);
    if (selectedWebsite) params.set('website', selectedWebsite);
    if (selectedSchedule) params.set('schedule', selectedSchedule);
    if (currentPage > 1) params.set('page', String(currentPage));
    if (selectedBusinessSlug) params.set('business', selectedBusinessSlug);

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [
    debouncedSearch,
    selectedCategory,
    selectedSettlement,
    selectedService,
    selectedWebsite,
    selectedSchedule,
    currentPage,
    selectedBusinessSlug,
  ]);

  // Dëgjo lundrimin Back / Forward në shfletues
  useEffect(() => {
    const handlePopState = () => {
      isPopStateRef.current = true;
      const params = new URLSearchParams(window.location.search);
      setSelectedBusinessSlug(params.get('business') || '');
      setSearch(params.get('search') || '');
      setDebouncedSearch(params.get('search') || '');
      setSelectedCategory(params.get('category') || '');
      setSelectedSettlement(params.get('settlement') || '');
      setSelectedService(params.get('service') || '');
      setSelectedWebsite(params.get('website') || '');
      setSelectedSchedule(params.get('schedule') || '');
      const p = parseInt(params.get('page'), 10);
      setCurrentPage(Number.isFinite(p) && p > 0 ? p : 1);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ngarko metadata për dropdown-et (kategori, vendbanime, shërbime)
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.data || []))
      .catch(() => setCategories([]));

    fetchSettlements()
      .then((data) => setSettlements(data.data || []))
      .catch(() => setSettlements([]));

    fetchServices()
      .then((data) => setServices(data.data || []))
      .catch(() => setServices([]));
  }, []);

  const filters = {
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
    settlement: selectedSettlement || undefined,
    service: selectedService || undefined,
    website: selectedWebsite || undefined,
    schedule: selectedSchedule || undefined,
  };

  const { businesses, loading, error, reload } = useBusinesses(filters);

  function handleSearchSubmit(e) {
    e.preventDefault();
  }

  function handleReset() {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategory('');
    setSelectedSettlement('');
    setSelectedService('');
    setSelectedWebsite('');
    setSelectedSchedule('');
    setCurrentPage(1);
    setSelectedBusinessSlug('');
    window.history.replaceState(null, '', window.location.pathname);
  }

  function handleSelectBusiness(slug) {
    setSelectedBusinessSlug(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug) {
      params.set('business', slug);
    } else {
      params.delete('business');
    }
    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.pushState(null, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  const activeFiltersCount = [
    debouncedSearch,
    selectedCategory,
    selectedSettlement,
    selectedService,
    selectedWebsite,
    selectedSchedule,
  ].filter(Boolean).length;

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        {onNavigateToAdmin && (
          <div className="catalog-header__top-bar">
            <button
              type="button"
              className="catalog-header__admin-btn"
              onClick={onNavigateToAdmin}
              aria-label="Hyrja në panelin administrativ"
            >
              🔐 Paneli Administrativ
            </button>
          </div>
        )}
        <div className="catalog-header__content">
          <h1 className="catalog-header__title">
            Katalogu i Bizneseve
            <span className="catalog-header__subtitle"> – Komuna e Lipjanit</span>
          </h1>
          <p className="catalog-header__description">
            Eksploroni bizneset, shërbimet dhe zejet aktive në të gjitha vendbanimet e Komunës së Lipjanit.
          </p>
        </div>
      </header>

      <main className="catalog-main">
        {selectedBusinessSlug ? (
          <BusinessProfile
            slug={selectedBusinessSlug}
            onBack={() => handleSelectBusiness('')}
          />
        ) : (
          <>
            {/* Shiriti i filtrave dhe kërkimit */}
            <section className="filter-bar" aria-label="Kërkimi dhe filtrat e katalogut">
              <form
                className="filter-bar__form"
                onSubmit={handleSearchSubmit}
                role="search"
              >
                {/* 1. Kërko me tekst */}
                <div className="filter-group filter-group--search">
                  <label htmlFor="search-input" className="filter-label">
                    🔍 Kërko
                  </label>
                  <input
                    id="search-input"
                    type="search"
                    className="filter-input"
                    placeholder="Kërko biznes ose shërbim"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Kërko biznese sipas emrit ose shërbimit"
                  />
                </div>

                {/* 2. Kategoria */}
                <div className="filter-group">
                  <label htmlFor="category-select" className="filter-label">
                    📁 Kategoria
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

                {/* 3. Vendbanimi */}
                <div className="filter-group">
                  <label htmlFor="settlement-select" className="filter-label">
                    📍 Vendbanimi
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

                {/* 4. Shërbimi */}
                <div className="filter-group">
                  <label htmlFor="service-select" className="filter-label">
                    ✨ Shërbimi
                  </label>
                  <select
                    id="service-select"
                    className="filter-select"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    aria-label="Filtro sipas shërbimit të veçantë"
                  >
                    <option value="">Të gjitha shërbimet</option>
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.slug}>
                        {srv.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Website */}
                <div className="filter-group">
                  <label htmlFor="website-select" className="filter-label">
                    🌐 Uebfaqja
                  </label>
                  <select
                    id="website-select"
                    className="filter-select"
                    value={selectedWebsite}
                    onChange={(e) => setSelectedWebsite(e.target.value)}
                    aria-label="Filtro sipas pranisë së faqes së internetit"
                  >
                    <option value="">Të gjitha</option>
                    <option value="yes">Me uebfaqe</option>
                    <option value="no">Pa uebfaqe</option>
                  </select>
                </div>

                {/* 6. Orari */}
                <div className="filter-group">
                  <label htmlFor="schedule-select" className="filter-label">
                    🕒 Orari
                  </label>
                  <select
                    id="schedule-select"
                    className="filter-select"
                    value={selectedSchedule}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    aria-label="Filtro sipas orarit të punës"
                  >
                    <option value="">Të gjitha</option>
                    <option value="yes">Me orar të publikuar</option>
                    <option value="no">Pa orar</option>
                  </select>
                </div>

                {/* Butoni Pastro */}
                <div className="filter-group filter-group--action">
                  <button
                    type="button"
                    className="btn btn--secondary filter-reset-btn"
                    onClick={handleReset}
                    aria-label="Pastro të gjithë filtrat"
                    title="Pastro të gjithë filtrat"
                  >
                    Pastro {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
                  </button>
                </div>
              </form>
            </section>

            {/* Lista e bizneseve me faqosje */}
            <BusinessList
              businesses={businesses}
              loading={loading}
              error={error}
              onRetry={reload}
              onSelectBusiness={handleSelectBusiness}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default BusinessCatalogPage;
