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
      <p>Nuk u gjetën biznese për filtrat aktualë.</p>
      <p className="state-hint">Provoni të ndryshoni kriteret e kërkimit.</p>
    </div>
  );
}

function BusinessList({ businesses, loading, error, onRetry }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!businesses || businesses.length === 0) return <EmptyState />;

  return (
    <section aria-label="Lista e bizneseve">
      <p className="results-count">
        {businesses.length} biznes{businesses.length !== 1 ? 'e' : ''} gjetur
      </p>
      <div className="business-grid">
        {businesses.map((biz) => (
          <BusinessCard key={biz.id} business={biz} />
        ))}
      </div>
    </section>
  );
}

export default BusinessList;
