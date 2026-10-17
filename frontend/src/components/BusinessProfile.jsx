import { useBusiness } from '../hooks/useBusiness';

/**
 * BusinessProfile.jsx – Pamja e detajuar e profilit të një biznesi
 * Konsumon të dhënat reale nga Laravel API përmes hook-ut useBusiness.
 */
function BusinessProfile({ slug, onBack }) {
  const { business, loading, error, reload } = useBusiness(slug);

  if (loading) {
    return (
      <div className="business-profile-container">
        <button
          type="button"
          className="btn btn--secondary business-profile__back-btn"
          onClick={onBack}
        >
          ← Kthehu te Katalogu
        </button>
        <div className="state-container" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true"></div>
          <p>Duke ngarkuar profilin e biznesit...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="business-profile-container">
        <button
          type="button"
          className="btn btn--secondary business-profile__back-btn"
          onClick={onBack}
        >
          ← Kthehu te Katalogu
        </button>
        <div className="state-container state-container--error" role="alert">
          <p className="state-icon">⚠️</p>
          <p>{error || 'Biznesi nuk u gjet.'}</p>
          <div className="business-profile__error-actions">
            <button className="btn btn--secondary" type="button" onClick={onBack}>
              Kthehu te Katalogu
            </button>
            {error && (
              <button className="btn btn--primary" type="button" onClick={reload}>
                Provo Sërish
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const {
    name,
    category,
    settlement,
    short_description,
    description,
    address,
    phone,
    email,
    website,
    is_featured,
    opening_hours,
    services,
    latitude,
    longitude,
  } = business;

  return (
    <div className="business-profile-container">
      {/* Shirit lundrimi mbrapsht */}
      <nav className="business-profile__nav" aria-label="Lundrimi i profilit">
        <button
          type="button"
          className="btn btn--secondary business-profile__back-btn"
          onClick={onBack}
        >
          ← Kthehu te Katalogu
        </button>
        <span className="business-profile__breadcrumb">
          Katalogu / {category?.name ?? 'Biznes'} / <strong>{name}</strong>
        </span>
      </nav>

      <article className="business-profile">
        {/* Header i profilit */}
        <header className="business-profile__header">
          <div className="business-profile__badges">
            {is_featured && (
              <span className="badge badge--featured">★ I Veçuar</span>
            )}
            <span className="business-card__category-tag">
              {category?.name ?? '—'}
            </span>
          </div>

          <h1 className="business-profile__title">{name}</h1>

          {short_description && (
            <p className="business-profile__subtitle">{short_description}</p>
          )}

          {settlement?.name && (
            <p className="business-profile__location-tag">
              📍 {settlement.name}{settlement.postal_code ? ` (Kodi: ${settlement.postal_code})` : ''}
            </p>
          )}
        </header>

        {/* Trupi kryesor: rrjeti me 2 kolona */}
        <div className="business-profile__grid">
          {/* Kolona kryesore majtas */}
          <div className="business-profile__main-col">
            {/* Përshkrimi i plotë */}
            <section className="business-profile__card" aria-labelledby="about-heading">
              <h2 id="about-heading" className="business-profile__card-title">
                Rreth Biznesit
              </h2>
              <div className="business-profile__description">
                <p>{description || short_description || 'Nuk ka përshkrim të zgjeruar për këtë biznes.'}</p>
              </div>
            </section>

            {/* Shërbimet & Lehtësirat */}
            {services && services.length > 0 && (
              <section className="business-profile__card" aria-labelledby="services-heading">
                <h2 id="services-heading" className="business-profile__card-title">
                  Shërbimet &amp; Lehtësirat
                </h2>
                <div className="business-profile__services-grid">
                  {services.map((service) => (
                    <div key={service.id || service.slug} className="service-card">
                      <div className="service-card__name">✓ {service.name}</div>
                      {service.description && (
                        <p className="service-card__desc">{service.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Kolona anësore djathtas */}
          <aside className="business-profile__side-col">
            {/* Orari i Punës */}
            <section className="business-profile__card" aria-labelledby="hours-heading">
              <h2 id="hours-heading" className="business-profile__card-title">
                🕒 Orari i Punës
              </h2>
              {opening_hours && typeof opening_hours === 'object' ? (
                <ul className="business-profile__hours-list">
                  {opening_hours.monday_friday && (
                    <li>
                      <span className="hours-day">E Hënë – E Premte</span>
                      <span className="hours-time">{opening_hours.monday_friday}</span>
                    </li>
                  )}
                  {opening_hours.saturday_sunday && (
                    <li>
                      <span className="hours-day">E Shtunë – E Diel</span>
                      <span className="hours-time">{opening_hours.saturday_sunday}</span>
                    </li>
                  )}
                  {Object.entries(opening_hours)
                    .filter(([key]) => key !== 'monday_friday' && key !== 'saturday_sunday')
                    .map(([key, val]) => (
                      <li key={key}>
                        <span className="hours-day">{key}</span>
                        <span className="hours-time">{String(val)}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-muted">Kontaktoni biznesin për orarin e plotë të shërbimit.</p>
              )}
            </section>

            {/* Të Dhënat e Kontaktit */}
            <section className="business-profile__card" aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="business-profile__card-title">
                📞 Kontakti &amp; Vendndodhja
              </h2>
              <dl className="business-profile__contact-list">
                {address && (
                  <>
                    <dt>🏠 Adresa:</dt>
                    <dd>{address}</dd>
                  </>
                )}
                {settlement?.name && (
                  <>
                    <dt>📍 Vendbanimi:</dt>
                    <dd>{settlement.name}</dd>
                  </>
                )}
                {phone && (
                  <>
                    <dt>📱 Telefoni:</dt>
                    <dd>
                      <a href={`tel:${phone}`} className="business-card__link">
                        {phone}
                      </a>
                    </dd>
                  </>
                )}
                {email && (
                  <>
                    <dt>✉️ Email:</dt>
                    <dd>
                      <a href={`mailto:${email}`} className="business-card__link">
                        {email}
                      </a>
                    </dd>
                  </>
                )}
                {website && (
                  <>
                    <dt>🌐 Uebfaqja:</dt>
                    <dd>
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="business-card__link"
                      >
                        {website.replace(/^https?:\/\//, '')}
                      </a>
                    </dd>
                  </>
                )}
              </dl>
            </section>

            {/* Lokacioni gjeografik */}
            {(latitude || longitude) && (
              <section className="business-profile__card" aria-labelledby="geo-heading">
                <h2 id="geo-heading" className="business-profile__card-title">
                  📍 Koordinatat Gjeografike
                </h2>
                <p className="business-profile__coords">
                  {latitude && <span>Lat: <strong>{latitude}</strong></span>}
                  {longitude && <span> &bull; Lng: <strong>{longitude}</strong></span>}
                </p>
                <p className="business-profile__map-notice">
                  Harta interaktive me vendndodhjen vizuale është e planifikuar për Java 3.
                </p>
              </section>
            )}
          </aside>
        </div>
      </article>
    </div>
  );
}

export default BusinessProfile;
