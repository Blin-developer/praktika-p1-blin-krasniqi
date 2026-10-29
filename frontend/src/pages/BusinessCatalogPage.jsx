import { useState, useEffect, useRef, useMemo } from 'react';
import BusinessList from '../components/BusinessList';
import BusinessProfile from '../components/BusinessProfile';
import SponsoredAdBanner from '../components/SponsoredAdBanner';
import LeafletMap from '../components/LeafletMap';
import { useBusinesses } from '../hooks/useBusinesses';
import {
  calculateHaversineDistanceKm,
  formatDistance,
  LIPJAN_CENTER_COORDS,
} from '../utils/distance';
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
  const [selectedSort, setSelectedSort] = useState(() => {
    return (
      initialFilters.sort ||
      new URLSearchParams(window.location.search).get('sort') ||
      ''
    );
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const p = parseInt(new URLSearchParams(window.location.search).get('page'), 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [selectedBusinessSlug, setSelectedBusinessSlug] = useState(() => {
    if (typeof _initialBusiness === 'string') return _initialBusiness;
    if (_initialBusiness?.slug) return _initialBusiness.slug;
    return new URLSearchParams(window.location.search).get('business') || '';
  });

  useEffect(() => {
    if (_initialBusiness) {
      const slug = typeof _initialBusiness === 'string' ? _initialBusiness : _initialBusiness?.slug;
      if (slug) setSelectedBusinessSlug(slug);
    }
  }, [_initialBusiness]);

  const [categories, setCategories] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [services, setServices] = useState([]);
  const [sidebarAds, setSidebarAds] = useState([]);
  const [categoryPromoAd, setCategoryPromoAd] = useState(null);

  // Gjendjet e Geolocation ("Bizneset Afër Meje")
  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = sessionStorage.getItem('lipjan_user_location');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [nearMeActive, setNearMeActive] = useState(() => {
    return new URLSearchParams(window.location.search).get('sort') === 'near_me';
  });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

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
    selectedSort,
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
      prev.selectedSchedule !== selectedSchedule ||
      prev.selectedSort !== selectedSort;

    if (hasFilterChanged) {
      setCurrentPage(1);
      prevFiltersRef.current = {
        debouncedSearch,
        selectedCategory,
        selectedSettlement,
        selectedService,
        selectedWebsite,
        selectedSchedule,
        selectedSort,
      };
    }
  }, [
    debouncedSearch,
    selectedCategory,
    selectedSettlement,
    selectedService,
    selectedWebsite,
    selectedSchedule,
    selectedSort,
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
    if (selectedSort) params.set('sort', selectedSort);
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
    selectedSort,
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
      const s = params.get('sort') || '';
      setSelectedSort(s);
      setNearMeActive(s === 'near_me');
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

    fetchAdvertisements({ position: 'sidebar_banner', limit: 3 })
      .then((data) => setSidebarAds(data.data || []))
      .catch(() => setSidebarAds([]));
  }, []);

  // Ngarko reklamë të veçantë për kategorinë e përzgjedhur nëse ekziston
  useEffect(() => {
    fetchAdvertisements({
      position: 'category_promotion',
      category: selectedCategory || undefined,
      limit: 1,
    })
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setCategoryPromoAd(data.data[0]);
        } else {
          setCategoryPromoAd(null);
        }
      })
      .catch(() => setCategoryPromoAd(null));
  }, [selectedCategory]);

  const filters = {
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
    settlement: selectedSettlement || undefined,
    service: selectedService || undefined,
    website: selectedWebsite || undefined,
    schedule: selectedSchedule || undefined,
    sort: selectedSort === 'near_me' ? undefined : (selectedSort || undefined),
  };

  const { businesses, loading, error, reload } = useBusinesses(filters);

  // Kërkesa e koordinatave reale GPS nga shfletuesi i qytetarit
  const requestUserLocation = () => {
    setGeoLoading(true);
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoLoading(false);
      setGeoError('Shfletuesi ose pajisja juaj nuk mbështet shërbimin GPS Geolocation.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Vendndodhja juaj (GPS)',
        };
        setUserLocation(loc);
        try {
          sessionStorage.setItem('lipjan_user_location', JSON.stringify(loc));
        } catch {}
        setNearMeActive(true);
        setSelectedSort('near_me');
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        let msg = 'Nuk mund të lexohej vendndodhja automatike nga GPS.';
        if (err.code === 1) {
          msg = 'Qasja në lokacion u refuzua nga shfletuesi. Ju lutem lejoni lejen (Allow Location) ose përdorni qendrën e Lipjanit.';
        } else if (err.code === 2) {
          msg = 'Sinjali GPS nuk u kap nga pajisja juaj.';
        } else if (err.code === 3) {
          msg = 'Koha e kërkimit të GPS skadoi.';
        }
        setGeoError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Aktivizimi / Çaktivizimi i butonit "Afër Meje"
  const handleToggleNearMe = () => {
    if (nearMeActive) {
      setNearMeActive(false);
      if (selectedSort === 'near_me') {
        setSelectedSort('');
      }
    } else {
      if (userLocation?.lat != null && userLocation?.lng != null) {
        setNearMeActive(true);
        setSelectedSort('near_me');
      } else {
        requestUserLocation();
      }
    }
  };

  // Vendosja e menjëhershme e koordinatave të qendrës së Lipjanit (Sheshi "Adem Jashari")
  const handleUseLipjanCenter = () => {
    const loc = { ...LIPJAN_CENTER_COORDS };
    setUserLocation(loc);
    try {
      sessionStorage.setItem('lipjan_user_location', JSON.stringify(loc));
    } catch {}
    setNearMeActive(true);
    setSelectedSort('near_me');
    setGeoError(null);
  };

  // Llogaritja reale e distancës me Formulën Haversine dhe renditja sipas afërsisë fizike
  const processedBusinesses = useMemo(() => {
    if (!businesses || businesses.length === 0) return [];

    if (nearMeActive && userLocation?.lat != null && userLocation?.lng != null) {
      const mapped = businesses.map((biz) => {
        if (biz.latitude != null && biz.longitude != null) {
          const bLat = parseFloat(biz.latitude);
          const bLng = parseFloat(biz.longitude);
          if (!isNaN(bLat) && !isNaN(bLng)) {
            const distKm = calculateHaversineDistanceKm(
              userLocation.lat,
              userLocation.lng,
              bLat,
              bLng
            );
            return {
              ...biz,
              distance_km: distKm,
              distance_text: formatDistance(distKm),
            };
          }
        }
        return {
          ...biz,
          distance_km: Infinity,
          distance_text: null,
        };
      });

      // Rendit nga më i afërti tek më i largëti
      return mapped.sort((a, b) => a.distance_km - b.distance_km);
    }

    return businesses;
  }, [businesses, nearMeActive, userLocation]);

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
    setSelectedSort('');
    setNearMeActive(false);
    setGeoError(null);
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
    selectedSort,
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
                    {selectedSort === 'top_rated' && (
                      <span className="filter-chip filter-chip--highlight">
                        ⭐ Më të Vlerësuarat në Lipjan
                        <button
                          type="button"
                          className="filter-chip__remove"
                          onClick={() => setSelectedSort('')}
                          aria-label="Hiq renditjen e vlerësimeve"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {nearMeActive && (
                      <span className="filter-chip filter-chip--highlight" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#93c5fd' }}>
                        🧭 Afër Meje ({userLocation?.label?.replace('Vendndodhja juaj (GPS)', 'GPS') || 'Aktive'})
                        <button
                          type="button"
                          className="filter-chip__remove"
                          onClick={() => {
                            setNearMeActive(false);
                            if (selectedSort === 'near_me') setSelectedSort('');
                          }}
                          aria-label="Hiq renditjen afër meje"
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

              {/* Reklamë e veçantë për kategorinë e përzgjedhur */}
              {categoryPromoAd && (
                <div className="catalog-category-promo" style={{ marginBottom: '1.75rem' }}>
                  <SponsoredAdBanner
                    ad={categoryPromoAd}
                    variant="featured"
                    onSelectBusiness={handleSelectBusiness}
                  />
                </div>
              )}

              {/* Shiriti i mënyrës së shfaqjes (Listë / Hartë Leaflet) dhe Renditja */}
              <div className="catalog-view-switcher" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.25rem 0 1rem 0', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                    {!loading && (
                      <span>
                        Gjithsej <strong>{businesses.length}</strong> biznese {viewMode === 'map' && `(${businesses.filter(b => b.latitude && b.longitude).length} me marker të saktë fizik)`}
                      </span>
                    )}
                  </div>

                  {/* Buton i shpejtë për renditjen sipas yjeve / vlerësimeve */}
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedSort === 'top_rated') {
                        setSelectedSort('');
                      } else {
                        setSelectedSort('top_rated');
                        setNearMeActive(false);
                      }
                    }}
                    className={`btn btn--sm ${selectedSort === 'top_rated' ? 'btn--primary' : 'btn--secondary'}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      padding: '5px 12px',
                      borderRadius: '6px',
                    }}
                    title="Rendit bizneset nga më të vlerësuarat me yje në Lipjan"
                  >
                    <span>⭐</span>
                    {selectedSort === 'top_rated' ? 'Më të Vlerësuarat ✓' : 'Më të Vlerësuarat'}
                  </button>

                  {/* Buton i shpejtë për "Afër Meje" (Geolocation & Rruga) */}
                  <button
                    type="button"
                    onClick={handleToggleNearMe}
                    disabled={geoLoading}
                    className={`btn btn--sm ${nearMeActive ? 'btn--primary' : 'btn--secondary'}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      padding: '5px 12px',
                      borderRadius: '6px',
                    }}
                    title="Rendit bizneset më afër vendndodhjes suaj me GPS"
                  >
                    <span>{geoLoading ? '⏳' : '🧭'}</span>
                    {geoLoading
                      ? 'Duke kërkuar GPS...'
                      : nearMeActive
                      ? 'Afër Meje ✓'
                      : '🧭 Afër Meje'}
                  </button>
                </div>

                <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: viewMode === 'list' ? '#ffffff' : 'transparent',
                      color: viewMode === 'list' ? '#0f172a' : '#64748b',
                      boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span>📋</span> Pamja Listë
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: viewMode === 'map' ? '#2563eb' : 'transparent',
                      color: viewMode === 'map' ? '#ffffff' : '#64748b',
                      boxShadow: viewMode === 'map' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span>🗺️</span> Harta Leaflet
                  </button>
                </div>
              </div>

              {/* Njoftimi i statusit kur Afër Meje është aktive */}
              {nearMeActive && userLocation && (
                <div className="near-me-status-banner">
                  <div className="near-me-status-banner__left">
                    <span className="near-me-status-banner__icon">🧭</span>
                    <div>
                      <h4 className="near-me-status-banner__title">
                        Bizneset Afër Meje – Renditur sipas afërsisë fizike
                      </h4>
                      <p className="near-me-status-banner__text">
                        Pika juaj e referimit: <strong>{userLocation.label || 'Koordinatat GPS'}</strong> ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}).
                        {processedBusinesses.length > 0 && processedBusinesses[0].distance_text && (
                          <span> Biznesi më i afërt ndodhet vetëm <strong>{processedBusinesses[0].distance_text}</strong>.</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="near-me-status-banner__actions">
                    <button
                      type="button"
                      className="btn btn--sm btn--secondary"
                      onClick={requestUserLocation}
                      disabled={geoLoading}
                    >
                      🔄 Rifresko GPS
                    </button>
                    <button
                      type="button"
                      className="btn btn--sm btn--outline-danger"
                      onClick={() => {
                        setNearMeActive(false);
                        if (selectedSort === 'near_me') setSelectedSort('');
                      }}
                    >
                      ✕ Çaktivizo
                    </button>
                  </div>
                </div>
              )}

              {/* Njoftim në rast refuzimi të GPS nga shfletuesi me buton testues për qendrën e Lipjanit */}
              {geoError && (
                <div className="near-me-error-banner">
                  <span className="near-me-error-banner__icon">⚠️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>
                      Nuk u mor dot vendndodhja automatike nga shfletuesi
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#7f1d1d' }}>
                      {geoError}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn--sm btn--primary"
                        onClick={handleUseLipjanCenter}
                        style={{ fontSize: '0.82rem' }}
                      >
                        📍 Përdor Qendrën e Lipjanit (Sheshi "Adem Jashari")
                      </button>
                      <button
                        type="button"
                        className="btn btn--sm btn--secondary"
                        onClick={() => setGeoError(null)}
                        style={{ fontSize: '0.82rem' }}
                      >
                        Mbyll
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista e bizneseve me faqosje OSE Harta Leaflet */}
              {viewMode === 'map' ? (
                <div className="catalog-map-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                      📍 Harta Ndërvepruese e Komunës së Lipjanit – Lokacione Fizike të Verifikuara
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      ✓ {processedBusinesses.filter(b => b.latitude && b.longitude).length} pinpoint-e aktive
                    </span>
                  </div>

                  <LeafletMap
                    businesses={processedBusinesses}
                    userLocation={nearMeActive ? userLocation : null}
                    height="540px"
                    onSelectBusiness={handleSelectBusiness}
                  />

                  {/* Bizneset me lokacion në proces verifikimi */}
                  {processedBusinesses.some(b => !b.latitude || !b.longitude) && (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '1rem 1.25rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#92400e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>⚠️</span> Bizneset me lokacion në proces verifikimi fizik ({processedBusinesses.filter(b => !b.latitude || !b.longitude).length})
                      </h4>
                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.82rem', color: '#b45309' }}>
                        Për arsye saktësie, këto biznese nuk shfaqen me koordinata të improvizuara në hartë deri në konfirmimin e plotë të lokacionit të tyre fizik:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {processedBusinesses.filter(b => !b.latitude || !b.longitude).map(b => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => handleSelectBusiness(b.slug)}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #fde68a',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              color: '#78350f',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <strong>{b.name}</strong> <span style={{ color: '#92400e', fontSize: '0.75rem' }}>({b.settlement?.name || 'Lipjan'})</span> ➔
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <BusinessList
                  businesses={processedBusinesses}
                  userLocation={nearMeActive ? userLocation : null}
                  loading={loading}
                  error={error}
                  onRetry={reload}
                  onReset={handleReset}
                  onSelectBusiness={handleSelectBusiness}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>

            {/* Sidebar me Reklama Anësore */}
            {sidebarAds.length > 0 && (
              <aside className="catalog-sidebar">
                {sidebarAds.map((ad) => (
                  <SponsoredAdBanner
                    key={ad.id}
                    ad={ad}
                    variant="sidebar"
                    onSelectBusiness={handleSelectBusiness}
                  />
                ))}
              </aside>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default BusinessCatalogPage;
