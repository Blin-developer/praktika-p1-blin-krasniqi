import BusinessCard from './BusinessCard';

/**
 * Skeleton Loader për përvojë të qetë gjatë ngarkimit
 */
function LoadingSkeleton() {
  return (
    <div className="business-grid" aria-label="Duke ngarkuar...">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="biz-card biz-card--skeleton">
          <div className="skeleton skeleton--badge"></div>
          <div className="skeleton skeleton--title"></div>
          <div className="skeleton skeleton--text"></div>
          <div className="skeleton skeleton--text skeleton--short"></div>
          <div className="skeleton skeleton--meta"></div>
          <div className="skeleton skeleton--button"></div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="state-card state-card--error" role="alert">
      <div className="state-card__icon" aria-hidden="true">⚠️</div>
      <h3 className="state-card__title">Ndodhi një problem gjatë ngarkimit</h3>
      <p className="state-card__desc">{message}</p>
      {onRetry && (
        <button className="btn btn--primary" onClick={onRetry} type="button">
          🔄 Provo Sërish
        </button>
      )}
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="state-card state-card--empty">
      <div className="state-card__icon" aria-hidden="true">🔍</div>
      <h3 className="state-card__title">Nuk u gjet asnjë biznes</h3>
      <p className="state-card__desc">
        Provoni të ndryshoni fjalën e kërkimit ose pastroni filtrat e aplikuar për të parë të gjitha bizneset.
      </p>
      {onReset && (
        <button className="btn btn--secondary" onClick={onReset} type="button">
          Pastro të gjithë filtrat
        </button>
      )}
    </div>
  );
}

function BusinessList({
  businesses,
  loading,
  error,
  onRetry,
  onReset,
  onSelectBusiness,
  onRequireAuth,
  currentPage = 1,
  onPageChange,
}) {
  const itemsPerPage = 12;

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!businesses || businesses.length === 0) return <EmptyState onReset={onReset} />;

  const totalPages = Math.max(1, Math.ceil(businesses.length / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedBusinesses = businesses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== safeCurrentPage) {
      if (onPageChange) {
        onPageChange(page);
      }
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section aria-label="Lista e bizneseve" className="catalog-results-section">
      <div className="catalog-results-header">
        <p className="results-count">
          U gjetën <strong>{businesses.length}</strong> biznes{businesses.length !== 1 ? 'e' : ''}
          {totalPages > 1 && (
            <span className="results-count__page-hint">
              {' '}(shfaqen {startIndex + 1}–{Math.min(startIndex + itemsPerPage, businesses.length)})
            </span>
          )}
        </p>
      </div>

      <div className="business-grid">
        {paginatedBusinesses.map((biz) => (
          <BusinessCard
            key={biz.id || biz.slug}
            business={biz}
            onSelectBusiness={onSelectBusiness}
            onRequireAuth={onRequireAuth}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="pagination-controls" aria-label="Lundrimi i faqeve">
          <button
            type="button"
            className="pagination-btn pagination-btn--prev"
            onClick={() => handlePageClick(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            aria-label="Faqja e mëparshme"
          >
            ← Prapa
          </button>

          <div className="pagination-numbers">
            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                className={`pagination-number ${page === safeCurrentPage ? 'pagination-number--active' : ''}`}
                onClick={() => handlePageClick(page)}
                aria-current={page === safeCurrentPage ? 'page' : undefined}
                aria-label={`Faqja ${page}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="pagination-btn pagination-btn--next"
            onClick={() => handlePageClick(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            aria-label="Faqja e ardhshme"
          >
            Përpara →
          </button>
        </nav>
      )}
    </section>
  );
}

export default BusinessList;
