import { useState, useEffect } from 'react';
import BusinessCard from './BusinessCard';

/**
 * BusinessList.jsx – Lista e bizneseve me gjendje loading, error dhe zbrazëti
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
      <p className="state-hint">Provoni të ndryshoni kriteret e kërkimit.</p>
    </div>
  );
}

function BusinessList({ businesses, loading, error, onRetry }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Rikthe faqen në 1 sa herë ndryshon lista e bizneseve (p.sh. nga filtrat)
  useEffect(() => {
    setCurrentPage(1);
  }, [businesses]);

  const totalPages = Math.max(1, Math.ceil((businesses || []).length / itemsPerPage));
  const paginatedBusinesses = (businesses || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!businesses || businesses.length === 0) return <EmptyState />;

  return (
    <section aria-label="Lista e bizneseve">
      <p className="results-count">
        {businesses.length} biznes{businesses.length !== 1 ? 'e' : ''} gjetur
      </p>
      <div className="business-grid">
        {paginatedBusinesses.map((biz) => (
          <BusinessCard key={biz.id} business={biz} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="btn btn--secondary"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Faqja e mëparshme"
          >
            Faqja e mëparshme
          </button>
          <span className="page-info">
            Faqja {currentPage} nga {totalPages}
          </span>
          <button
            className="btn btn--secondary"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Faqja e ardhshme"
          >
            Faqja e ardhshme
          </button>
        </div>
      )}
    </section>
  );
}

export default BusinessList;
