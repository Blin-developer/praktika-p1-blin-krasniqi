import BusinessCard from './BusinessCard';

/**
 * BusinessList.jsx – Lista e bizneseve me gjendje loading, error, zbrazëti dhe faqosje (12 biznese për faqe)
 */

function LoadingState() {
  return (
    <div className="state-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p>Duke ngarkuar bizneset...</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="state-container state-container--error" role="alert">
      <p className="state-icon">⚠️</p>
      <p>Ndodhi një gabim: <strong>{message}</strong></p>
      <button
        className="btn btn--primary"
        onClick={onRetry}
        type="button"
      >
        Provo Sërish
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="state-container state-container--empty">
      <p className="state-icon">🔍</p>
      <p>Nuk u gjet asnjë biznes.</p>
      <p className="state-hint">Provoni të ndryshoni kriteret e kërkimit ose filtrat e zgjedhur.</p>
    </div>
  );
}

function BusinessList({
  businesses,
  loading,
  error,
  onRetry,
  onSelectBusiness,
  currentPage = 1,
  onPageChange,
}) {
  const itemsPerPage = 12;

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!businesses || businesses.length === 0) return <EmptyState />;

  const totalPages = Math.max(1, Math.ceil(businesses.length / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedBusinesses = businesses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== safeCurrentPage) {
      if (onPageChange) {
        onPageChange(page);
      }
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Gjenero listën e numrave të faqeve
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section aria-label="Lista e bizneseve" className="catalog-results-section">
      <div className="catalog-results-header">
        <p className="results-count">
          <strong>{businesses.length}</strong> biznes{businesses.length !== 1 ? 'e' : ''} gjetur
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
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="pagination-controls" aria-label="Lundrimi i faqeve">
          <button
            type="button"
            className="btn btn--secondary pagination-btn-prev"
            onClick={() => handlePageClick(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            aria-label="Faqja e mëparshme"
          >
            ← E mëparshmja
          </button>

          <div className="pagination-numbers" role="navigation" aria-label="Numrat e faqeve">
            {pageNumbers.map((num) => (
              <button
                key={num}
                type="button"
                className={`pagination-number-btn ${num === safeCurrentPage ? 'pagination-number-btn--active' : ''}`}
                onClick={() => handlePageClick(num)}
                aria-current={num === safeCurrentPage ? 'page' : undefined}
                aria-label={`Faqja ${num}`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn--secondary pagination-btn-next"
            onClick={() => handlePageClick(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            aria-label="Faqja e ardhshme"
          >
            E ardhshmja →
          </button>

          <span className="page-info">
            Faqja <strong>{safeCurrentPage}</strong> nga <strong>{totalPages}</strong>
          </span>
        </nav>
      )}
    </section>
  );
}

export default BusinessList;
