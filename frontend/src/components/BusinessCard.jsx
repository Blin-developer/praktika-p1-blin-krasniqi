/**
 * BusinessCard.jsx – Kartela vizuale e një biznesi në listë
 */

function BusinessCard({ business, onSelectBusiness }) {
  const {
    slug,
    name,
    short_description,
    address,
    phone,
    is_featured,
    category,
    settlement,
  } = business;

  return (
    <article className="business-card" aria-label={`Biznesi: ${name}`}>
      {is_featured && (
        <span className="badge badge--featured" aria-label="Biznes i veçuar">
          ★ I Veçuar
        </span>
      )}

      <div className="business-card__header">
        <div className="business-card__category-tag">
          {category?.name ?? '—'}
        </div>
        <h3 className="business-card__name">
          {onSelectBusiness ? (
            <button
              type="button"
              className="business-card__title-btn"
              onClick={() => onSelectBusiness(slug)}
            >
              {name}
            </button>
          ) : (
            name
          )}
        </h3>
      </div>

      <div className="business-card__body">
        {short_description && (
          <p className="business-card__description">{short_description}</p>
        )}

        <dl className="business-card__meta">
          {settlement?.name && (
            <>
              <dt>📍 Vendndodhja</dt>
              <dd>{settlement.name}</dd>
            </>
          )}
          {address && (
            <>
              <dt>🏠 Adresa</dt>
              <dd>{address}</dd>
            </>
          )}
          {phone && (
            <>
              <dt>📞 Telefoni</dt>
              <dd>
                <a href={`tel:${phone}`} className="business-card__link">
                  {phone}
                </a>
              </dd>
            </>
          )}
        </dl>
      </div>

      {onSelectBusiness && (
        <div className="business-card__footer">
          <button
            type="button"
            className="btn btn--outline-primary business-card__action"
            onClick={() => onSelectBusiness(slug)}
            aria-label={`Shiko profilin e ${name}`}
          >
            Shiko Profilin →
          </button>
        </div>
      )}
    </article>
  );
}

export default BusinessCard;
