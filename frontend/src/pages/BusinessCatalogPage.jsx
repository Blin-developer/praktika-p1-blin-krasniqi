import { useState, useEffect, useRef } from 'react';
import BusinessList from '../components/BusinessList';
import BusinessProfile from '../components/BusinessProfile';
import SponsoredAdBanner from '../components/SponsoredAdBanner';
import { useBusinesses } from '../hooks/useBusinesses';
import {
  fetchCategories,
  fetchSettlements,
  fetchServices,
  fetchAdvertisements,
} from '../services/api';

/**
 * BusinessCatalogPage – Faqja kryesore e katalogut të bizneseve të Komunës së Lipjanit.
 * Mbështet kërkim me debounce, 5 filtra të integruar (kategoria, vendbanimi, shërbimi, website, orari),
 * ruajtje të plotë në URL, faqosje me 12 biznese për faqe dhe shfaqje të reklamave anësore.
 */
function BusinessCatalogPage({
  onRequireAuth,
  initialFilters = {},
  initialBusiness: _initialBusiness = null,
}) {

  // Inicializo gjendjet drejtpërdrejt nga URL query parameters ose props
  const [search, setSearch] = useState(() => {
    return (
      initialFilters.search ||
      new URLSearchParams(window.location.search).get('search') ||
      ''
    );
  });
  const [debouncedSearch, setDebouncedSearch] = useState(() => {
    return (
      initialFilters.search ||
      new URLSearchParams(window.location.search).get('search') ||
      ''
    );
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return (
      initialFilters.category ||
      new URLSearchParams(window.location.search).get('category') ||
      ''
    );
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
  const [sidebarAd, setSidebarAd] = useState(null);

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

  // Ngarko metadata për dropdown-et (kategori, vendbanime, shërbime, reklama anësore)
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

    fetchAdvertisements({ position: 'sidebar_banner', limit: 1 })
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setSidebarAd(data.data[0]);
        }
      })
      .catch(() => setSidebarAd(null));
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
        <div className="catalog-header__content">
          <span className="badge badge--gold">📋 Regjistri Publik i Bizneseve</span>
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
            onRequireAuth={onRequireAuth}
          />
        ) : (
          <div className="catalog-layout">
            <div className="catalog-content">
              {/* Shiriti i filtrave dhe kërkimit */}
              <section className="filter-bar" aria-label="Kërkimi dhe filtrat e katalogut">
                {activeFiltersCount > 0 && (
                  <div className="active-filters-chips">
                    <span className="active-filters-label">Filtrat aktivë ({activeFiltersCount}):</span>
                    {selectedCategory && (
                      <span className="filter-chip">
                        📁 {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                        <button
                          type="button"
                          className="filter-chip__remove"
                          onClick={() => setSelectedCategory('')}
                          aria-label="Hiq filtrin e kategorisë"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {selectedSettlement && (
                      <span className="filter-chip">
                        📍 {settlements.find((s) => s.slug === selectedSettlement)?.name || selectedSettlement}
                        <button
                          type="button"
                          className="filter-chip__remove"
                          onClick={() => setSelectedSettlement('')}
                          aria-label="Hiq filtrin e vendbanimit"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {selectedService && (
                      <span className="filter-chip">
                        ✨ {services.find((srv) => srv.slug === selectedService)?.name || selectedService}
                        <button
                          type="button"
                          className="filter-chip__remove"
                          onClick={() => setSelectedService('')}
                          aria-label="Hiq filtrin e shërbimit"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {selectedWebsite && (
                      <span className="filter-chip">
                        🌐 {selectedWebsite === 'yes' ? 'Me Uebfaqe' : 'Pa Uebfaqe'}
                        <button
                          type="button"
                          className="filter-chip__remove"
                          onClick={() => setSelectedWebsite('')}
                          aria-label="Hiq filtrin e faqes"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {selectedSchedule && (
                      <span className="filter-chip">
                        🕒 {selectedSchedule === 'yes' ? 'Me Orar' : 'Pa Orar'}
                        <button
                          type="button"
                          className="filter-chip__remove"
                          onClick={() => setSelectedSchedule('')}
                          aria-label="Hiq filtrin e orarit"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {debouncedSearch && (
                      <span className="filter-chip">
                        🔍 «{debouncedSearch}»
                        <button
                          type="button"
                          className="filter-chip__remove"
                          onClick={() => {
                            setSearch('');
                            setDebouncedSearch('');
                          }}
                          aria-label="Hiq kërkimin"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    <button
                      type="button"
                      className="filter-chip filter-chip--clear-all"
                      onClick={handleReset}
                    >
                      Pastro të gjithë
                    </button>
                  </div>
                )}

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
                onReset={handleReset}
                onSelectBusiness={handleSelectBusiness}
                onRequireAuth={onRequireAuth}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Sidebar me Reklamë Anësore */}
            {sidebarAd && (
              <aside className="catalog-sidebar">
                <SponsoredAdBanner
                  ad={sidebarAd}
                  variant="sidebar"
                  onSelectBusiness={handleSelectBusiness}
                />
              </aside>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default BusinessCatalogPage;
