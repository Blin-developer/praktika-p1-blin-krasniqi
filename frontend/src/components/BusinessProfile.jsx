import { useContext, useState } from 'react';
import { useBusiness } from '../hooks/useBusiness';
import { AuthContext } from '../context/AuthContext';

/**
 * BusinessProfile.jsx – Pamja e detajuar e profilit të një biznesi
 * Shfaq emrin, kategorinë, përshkrimin, shërbimet, telefonin, adresën,
 * lokacionin në hartë, orarin e punës, website dhe butonat e veprimit të kontaktit.
 */
function BusinessProfile({ slug, onBack, onRequireAuth }) {
  const { business, loading, error, reload } = useBusiness(slug);
  const { isAuthenticated, isFavorite, toggleFavorite } = useContext(AuthContext);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

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

  const hasCoordinates = Boolean(latitude && longitude);
  const latNum = parseFloat(latitude);
  const lngNum = parseFloat(longitude);

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
              📍 {settlement.name}{settlement.postal_code ? ` (Kodi Postal: ${settlement.postal_code})` : ''}
            </p>
          )}

          {/* Butonat e shpejtë të kontaktit */}
          <div className="business-profile__contact-actions" role="group" aria-label="Butonat e kontaktit">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="btn btn--primary business-profile__action-btn"
                aria-label={`Telefono ${name}`}
              >
                📞 Telefono: {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="btn btn--secondary business-profile__action-btn"
                aria-label={`Dërgo email te ${name}`}
              >
                ✉️ Dërgo Email
              </a>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline-primary business-profile__action-btn"
                aria-label={`Vizito uebfaqen e ${name}`}
              >
                🌐 Vizito Uebfaqen ↗
              </a>
            )}
            {hasCoordinates && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${latNum},${lngNum}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary business-profile__action-btn"
                aria-label="Hap lokacionin në Google Maps"
              >
                🗺️ Hap në Hartë ↗
              </a>
            )}

            <button
              type="button"
              className={`btn ${isFavorite(business.id) ? 'btn--saved-active' : 'btn--secondary'} business-profile__action-btn`}
              onClick={async () => {
                if (!isAuthenticated) {
                  if (onRequireAuth) onRequireAuth('Për të ruajtur këtë biznes, ju lutem kyçuni ose regjistrohuni.');
                  return;
                }
                setFavoriteLoading(true);
                try {
                  await toggleFavorite(business.id);
                } finally {
                  setFavoriteLoading(false);
                }
              }}
              disabled={favoriteLoading}
              aria-label={isFavorite(business.id) ? 'Hiq nga të ruajturat' : 'Ruaj në llogari'}
            >
              {isFavorite(business.id) ? '❤️ E Ruajtur në Llogari' : '🤍 Ruaje Biznesin'}
            </button>
          </div>
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

            {/* Lokacioni në Hartë */}
            <section className="business-profile__card" aria-labelledby="map-heading">
              <h2 id="map-heading" className="business-profile__card-title">
                📍 Lokacioni në Hartë
              </h2>
              {hasCoordinates ? (
                <div className="business-profile__map-container">
                  <iframe
                    title={`Harta e ${name}`}
                    className="business-profile__map-iframe"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lngNum - 0.007}%2C${latNum - 0.005}%2C${lngNum + 0.007}%2C${latNum + 0.005}&layer=mapnik&marker=${latNum}%2C${lngNum}`}
                    loading="lazy"
                  />
                  <div className="business-profile__map-footer">
                    <span className="business-profile__coords-text">
                      Koordinatat: {latNum.toFixed(6)}, {lngNum.toFixed(6)}
                    </span>
                    <div className="business-profile__map-external-links">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${latNum},${lngNum}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="business-card__link"
                      >
                        Google Maps ↗
                      </a>
                      <span aria-hidden="true"> &bull; </span>
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${latNum}&mlon=${lngNum}#map=16/${latNum}/${lngNum}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="business-card__link"
                      >
                        OpenStreetMap ↗
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted business-profile__no-location">Lokacioni i saktë nuk është verifikuar</p>
              )}
            </section>
          </div>

          {/* Kolona anësore djathtas */}
          <aside className="business-profile__side-col">
            {/* Orari i Punës */}
            <section className="business-profile__card" aria-labelledby="hours-heading">
              <h2 id="hours-heading" className="business-profile__card-title">
                🕒 Orari i Punës
              </h2>
              {opening_hours && typeof opening_hours === 'object' && Object.keys(opening_hours).length > 0 ? (
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
                  {opening_hours.monday_saturday && (
                    <li>
                      <span className="hours-day">E Hënë – E Shtunë</span>
                      <span className="hours-time">{opening_hours.monday_saturday}</span>
                    </li>
                  )}
                  {opening_hours.monday_sunday && (
                    <li>
                      <span className="hours-day">E Hënë – E Diel</span>
                      <span className="hours-time">{opening_hours.monday_sunday}</span>
                    </li>
                  )}
                  {opening_hours.saturday && (
                    <li>
                      <span className="hours-day">E Shtunë</span>
                      <span className="hours-time">{opening_hours.saturday}</span>
                    </li>
                  )}
                  {opening_hours.sunday && (
                    <li>
                      <span className="hours-day">E Diel</span>
                      <span className="hours-time">{opening_hours.sunday}</span>
                    </li>
                  )}
                  {Object.entries(opening_hours)
                    .filter(([key]) => ![
                      'monday_friday',
                      'saturday_sunday',
                      'monday_saturday',
                      'monday_sunday',
                      'saturday',
                      'sunday'
                    ].includes(key))
                    .map(([key, val]) => (
                      <li key={key}>
                        <span className="hours-day">{key}</span>
                        <span className="hours-time">{String(val)}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-muted business-profile__no-hours">Orari nuk është publikuar</p>
              )}
            </section>

            {/* Të Dhënat e Kontaktit */}
            <section className="business-profile__card" aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="business-profile__card-title">
                📞 Kontakti &amp; Vendndodhja
              </h2>
              <dl className="business-profile__contact-list">
                <dt>🏠 Adresa:</dt>
                <dd>
                  {address || <span className="text-muted">Lokacioni i saktë nuk është verifikuar</span>}
                </dd>

                {settlement?.name && (
                  <>
                    <dt>📍 Vendbanimi:</dt>
                    <dd>{settlement.name}</dd>
                  </>
                )}

                <dt>📱 Telefoni:</dt>
                <dd>
                  {phone ? (
                    <a href={`tel:${phone}`} className="business-card__link">
                      {phone}
                    </a>
                  ) : (
                    <span className="text-muted">Telefoni nuk është publikuar</span>
                  )}
                </dd>

                <dt>✉️ Email:</dt>
                <dd>
                  {email ? (
                    <a href={`mailto:${email}`} className="business-card__link">
                      {email}
                    </a>
                  ) : (
                    <span className="text-muted">Email nuk është publikuar</span>
                  )}
                </dd>

                <dt>🌐 Uebfaqja:</dt>
                <dd>
                  {website ? (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="business-card__link"
                    >
                      {website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span className="text-muted">Uebfaqja nuk është publikuar</span>
                  )}
                </dd>
              </dl>
            </section>
          </aside>
        </div>
      </article>
    </div>
  );
}

export default BusinessProfile;
