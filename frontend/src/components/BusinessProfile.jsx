import { useState, useEffect, useCallback } from 'react';
import { useBusiness } from '../hooks/useBusiness';
import { useAuth } from '../hooks/useAuth';
import { checkBusinessClaimStatus } from '../services/api';
import LeafletMap from './LeafletMap';
import ReviewSection from './ReviewSection';
import BusinessClaimModal from './BusinessClaimModal';
import OwnerBusinessModal from './OwnerBusinessModal';
import UserAuthModal from './UserAuthModal';

/**
 * BusinessProfile.jsx – Pamja e detajuar e profilit të një biznesi
 * Shfaq emrin, kategorinë, përshkrimin, shërbimet, telefonin, adresën,
 * lokacionin në hartë, orarin e punës, website dhe butonat e veprimit të kontaktit.
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

  const { user, isAuthenticated } = useAuth();
  const [claimStatus, setClaimStatus] = useState({
    is_claimed: Boolean(business?.owner_id),
    is_current_user_owner: Boolean(user && business?.owner_id && business.owner_id === user.id),
    user_claim: null,
  });
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const loadClaimStatus = useCallback(async () => {
    if (!isAuthenticated || !business?.id) return;
    try {
      const res = await checkBusinessClaimStatus(business.slug || business.id);
      setClaimStatus({
        is_claimed: res.is_claimed,
        is_current_user_owner: res.is_current_user_owner,
        user_claim: res.user_claim,
      });
    } catch {
      // Shpërfill gabimet e statusit
    }
  }, [isAuthenticated, business?.id, business?.slug]);

  useEffect(() => {
    loadClaimStatus();
  }, [loadClaimStatus]);

  const handleClaimClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowClaimModal(true);
    }
  };

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
            {business.reviews_count > 0 && (
              <span className="badge badge--rating" title={`Mesatarja: ${Number(business.reviews_avg_rating).toFixed(1)} nga 5 yje`}>
                ⭐ {Number(business.reviews_avg_rating).toFixed(1)} ({business.reviews_count} {business.reviews_count === 1 ? 'vlerësim' : 'vlerësime'})
              </span>
            )}
            {claimStatus.is_claimed && (
              <span className="badge badge--claimed" title="Ky biznes ka pronar të verifikuar zyrtarisht nga administrata">
                ✓ Biznes i Verifikuar
              </span>
            )}
            {claimStatus.is_current_user_owner && (
              <span className="badge badge--owner-badge" title="Ju jeni pronari i verifikuar i këtij biznesi">
                👑 Biznesi Juaj
              </span>
            )}
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
          </div>

          {/* Shiriti i Pronarit të Verifikuar */}
          {claimStatus.is_current_user_owner && (
            <div className="claim-owner-banner">
              <div className="claim-owner-banner__content">
                <span className="claim-owner-banner__icon">👑</span>
                <div>
                  <h3 className="claim-owner-banner__title">Ju jeni pronari i verifikuar i këtij biznesi</h3>
                  <p className="claim-owner-banner__text">
                    Mund të ndryshoni orarin e punës, kontaktet, shërbimet dhe të dhënat e biznesit pa pritur aprovim.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn--primary claim-owner-banner__btn"
                onClick={() => setShowOwnerModal(true)}
              >
                ✏️ Menaxho Biznesin Tim
              </button>
            </div>
          )}

          {/* Kërkesa në Pritje */}
          {claimStatus.user_claim && claimStatus.user_claim.status === 'pending' && (
            <div className="claim-status-banner claim-status-banner--pending">
              <span className="claim-status-banner__icon">⏳</span>
              <div>
                <strong>Kërkesa juaj për pronësi është në shqyrtim</strong>
                <p>
                  Kërkesa e dërguar më {new Date(claimStatus.user_claim.created_at).toLocaleDateString('sq-AL')} po shqyrtohet nga stafi administrativ i komunës.
                </p>
              </div>
            </div>
          )}

          {/* Kërkesa e Refuzuar */}
          {claimStatus.user_claim && claimStatus.user_claim.status === 'rejected' && (
            <div className="claim-status-banner claim-status-banner--rejected">
              <span className="claim-status-banner__icon">⚠️</span>
              <div>
                <strong>Kërkesa për pronësi nuk u aprovua</strong>
                <p>
                  {claimStatus.user_claim.admin_notes || 'Kërkesa juaj nuk u aprovua. Mund të dërgoni kërkesë të re me dëshmi shtesë.'}
                </p>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  style={{ marginTop: '0.5rem' }}
                  onClick={handleClaimClick}
                >
                  Dërgo Kërkesë të Re
                </button>
              </div>
            </div>
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

            {/* Lokacioni në Hartë */}
            <section className="business-profile__card" aria-labelledby="map-heading">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 id="map-heading" className="business-profile__card-title" style={{ margin: 0 }}>
                  📍 Lokacioni në Hartë (Leaflet)
                </h2>
                {hasCoordinates ? (
                  <span className="badge badge--success" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    ✓ Lokacion i verifikuar
                  </span>
                ) : (
                  <span className="badge badge--warning" style={{ fontSize: '0.75rem', fontWeight: 600, background: '#fef3c7', color: '#92400e' }}>
                    ⏳ Në verifikim fizik
                  </span>
                )}
              </div>

              {hasCoordinates ? (
                <div className="business-profile__map-container">
                  <LeafletMap business={business} height="360px" />

                  <div className="business-profile__map-footer">
                    <span className="business-profile__coords-text">
                      Koordinatat fizike: {latNum.toFixed(6)}, {lngNum.toFixed(6)}
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
                        href={`https://www.openstreetmap.org/?mlat=${latNum}&mlon=${lngNum}#map=17/${latNum}/${lngNum}`}
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
                <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '10px', border: '1.5px dashed #cbd5e1', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#334155' }}>
                    📍 Vendndodhja fizike është në proces verifikimi zyrtar
                  </p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    Ky biznes nuk ka ende koordinata të verifikuara në terren. Për të ruajtur saktësinë e hartës, nuk vendosen lokacione të rastësishme apo të përafërta.
                  </p>
                  {address && (
                    <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>
                      Adresa e deklaruar: <strong>{address}</strong>
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Seksioni i Vlerësimeve dhe Përshtypjeve të Qytetarëve */}
            <ReviewSection
              businessId={business.id}
              businessSlug={slug}
              businessName={name}
            />
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

            {/* Kërko Pronësinë e Biznesit (nëse nuk është i kërkuar) */}
            {!claimStatus.is_claimed && !claimStatus.user_claim && (
              <section className="business-profile__card claim-prompt-card" aria-labelledby="claim-heading">
                <div className="claim-prompt-card__header">
                  <span className="claim-prompt-card__icon" aria-hidden="true">🏢</span>
                  <div>
                    <h3 id="claim-heading" className="claim-prompt-card__title">
                      A është ky biznesi juaj?
                    </h3>
                    <p className="claim-prompt-card__subtitle">
                      Kërkoni pronësinë zyrtare
                    </p>
                  </div>
                </div>
                <p className="claim-prompt-card__desc">
                  Verifikohuni si pronar i këtij biznesi për të përditësuar vetë orarin, kontaktet, lokacionin dhe shërbimet.
                </p>
                <button
                  type="button"
                  className="btn btn--outline-primary claim-prompt-card__btn"
                  onClick={handleClaimClick}
                >
                  🏢 Kërko Pronësinë e Biznesit
                </button>
              </section>
            )}
          </aside>
        </div>
      </article>

      {/* Modalet për Kërkesën e Pronësisë, Menaxhimin nga Pronari dhe Kyçjen */}
      {showClaimModal && (
        <BusinessClaimModal
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          business={business}
          onClaimSubmitted={() => loadClaimStatus()}
        />
      )}

      {showOwnerModal && (
        <OwnerBusinessModal
          isOpen={showOwnerModal}
          onClose={() => {
            setShowOwnerModal(false);
            reload();
          }}
          business={business}
          onBusinessUpdated={() => {
            reload();
            loadClaimStatus();
          }}
        />
      )}

      {showAuthModal && (
        <UserAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
          noticeMessage="Kyçuni ose regjistrohuni për të dërguar kërkesën tuaj të verifikimit si pronar i këtij biznesi."
        />
      )}
    </div>
  );
}

export default BusinessProfile;
