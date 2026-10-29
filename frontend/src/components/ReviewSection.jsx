import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  fetchBusinessReviews,
  submitBusinessReview,
  deleteBusinessReview,
  deleteAdminReview,
} from '../services/api';
import UserAuthModal from './UserAuthModal';

/**
 * Përshkrimet e yjeve në gjuhën shqipe
 */
const STAR_LABELS = {
  1: 'Shumë dobët',
  2: 'Dobët',
  3: 'Mesatar',
  4: 'Shumë mirë',
  5: 'Shkëlqyeshëm',
};

/**
 * Formatues i datës në shqip
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('sq-AL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * ReviewSection – Seksioni i vlerësimeve dhe përshtypjeve të qytetarëve për një biznes.
 */
export default function ReviewSection({
  businessId,
  businessSlug,
  businessName,
  onReviewsUpdated,
}) {
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    count: 0,
    average: null,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Forma e vlerësimit
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Modal për autentikim
  const [showAuthModal, setShowAuthModal] = useState(false);

  const targetIdentifier = businessSlug || businessId;

  // Ngarko vlerësimet nga API
  const loadReviews = useCallback(async () => {
    if (!targetIdentifier) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetchBusinessReviews(targetIdentifier);
      const list = res.data || [];
      setReviews(list);
      setStats({
        count: res.count || 0,
        average: res.average !== null ? Number(res.average) : null,
        distribution: res.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });

      // Kontrollo nëse përdoruesi aktual ka një vlerësim ekzistues
      if (user) {
        const found = list.find((r) => r.user_id === user.id);
        if (found) {
          setUserReview(found);
          setRating(found.rating);
          setComment(found.comment || '');
        } else {
          setUserReview(null);
          setRating(5);
          setComment('');
        }
      }

      if (onReviewsUpdated) {
        onReviewsUpdated({
          count: res.count || 0,
          average: res.average,
        });
      }
    } catch (err) {
      setError(err.message || 'Ndodhi një gabim gjatë ngarkimit të vlerësimeve.');
    } finally {
      setLoading(false);
    }
  }, [targetIdentifier, user, onReviewsUpdated]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Dërgimi i formularit të vlerësimit
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (rating < 1 || rating > 5) {
      setFormFeedback({ type: 'error', message: 'Ju lutem zgjidhni nga 1 deri në 5 yje.' });
      return;
    }

    try {
      setSubmitting(true);
      setFormFeedback(null);
      await submitBusinessReview(targetIdentifier, {
        rating,
        comment: comment.trim() || null,
      });

      setFormFeedback({
        type: 'success',
        message: userReview
          ? 'Vlerësimi juaj u përditësua me sukses!'
          : 'Faleminderit! Vlerësimi juaj u publikua me sukses.',
      });
      setIsEditing(false);
      await loadReviews();
    } catch (err) {
      setFormFeedback({
        type: 'error',
        message: err.message || 'Dështoi ruajtja e vlerësimit.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Fshirja e vlerësimit vetjak
  const handleDeleteOwnReview = async () => {
    if (!window.confirm('A jeni të sigurt që dëshironi të fshini vlerësimin tuaj?')) return;
    try {
      setSubmitting(true);
      await deleteBusinessReview(targetIdentifier);
      setUserReview(null);
      setRating(5);
      setComment('');
      setIsEditing(false);
      setFormFeedback({ type: 'success', message: 'Vlerësimi juaj u fshi me sukses.' });
      await loadReviews();
    } catch (err) {
      setFormFeedback({ type: 'error', message: err.message || 'Dështoi fshirja e vlerësimit.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Fshirja nga moderimi administrativ
  const handleDeleteAsAdmin = async (reviewId) => {
    if (!window.confirm('A jeni të sigurt për fshirjen e këtij vlerësimi si Administrator?')) return;
    try {
      await deleteAdminReview(reviewId);
      await loadReviews();
    } catch (err) {
      alert(`Gabim gjatë fshirjes: ${err.message}`);
    }
  };

  return (
    <section className="business-profile__card review-section" aria-labelledby="reviews-heading">
      <div className="review-section__header">
        <h2 id="reviews-heading" className="business-profile__card-title" style={{ margin: 0 }}>
          ⭐ Vlerësimet dhe Përshtypjet e Qytetarëve
        </h2>
        <span className="review-section__count-badge">
          {stats.count} {stats.count === 1 ? 'vlerësim' : 'vlerësime'}
        </span>
      </div>

      {/* ── STATISTIKAT DHE PËRMBLEDHJA E YJEVE ── */}
      <div className="review-summary-card">
        <div className="review-summary-card__score-box">
          <div className="review-summary-card__big-score">
            {stats.average !== null ? Number(stats.average).toFixed(1) : '—'}
          </div>
          <div className="review-summary-card__stars" aria-label={`Vlerësimi: ${stats.average || 0} nga 5 yje`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${stats.average && star <= Math.round(stats.average) ? 'star--filled' : 'star--empty'}`}
              >
                ★
              </span>
            ))}
          </div>
          <div className="review-summary-card__subtitle">
            {stats.count > 0
              ? `Bazuar në ${stats.count} ${stats.count === 1 ? 'qytetar' : 'qytetarë'}`
              : 'Ende nuk ka vlerësime'}
          </div>
        </div>

        {/* Shpërndarja e yjeve (5..1) */}
        <div className="review-summary-card__bars">
          {[5, 4, 3, 2, 1].map((star) => {
            const countForStar = stats.distribution[star] || 0;
            const pct = stats.count > 0 ? Math.round((countForStar / stats.count) * 100) : 0;
            return (
              <div key={star} className="review-bar-row">
                <span className="review-bar-row__label">{star} ★</span>
                <div className="review-bar-row__track">
                  <div
                    className="review-bar-row__fill"
                    style={{ width: `${pct}%` }}
                    aria-valuenow={pct}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
                <span className="review-bar-row__count">{countForStar}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FORMULARI I VLERËSIMIT ── */}
      <div className="review-form-wrapper">
        {!isAuthenticated ? (
          <div className="review-cta-box">
            <div className="review-cta-box__icon">💬</div>
            <div className="review-cta-box__content">
              <h4 className="review-cta-box__title">A keni përvojë me {businessName || 'këtë biznes'}?</h4>
              <p className="review-cta-box__desc">
                Ndani vlerësimin dhe përshtypjen tuaj për të ndihmuar bashkëqytetarët e Lipjanit të bëjnë zgjedhjen e duhur.
              </p>
            </div>
            <button
              type="button"
              className="btn btn--primary review-cta-box__btn"
              onClick={() => setShowAuthModal(true)}
            >
              🔐 Kyçu për të Vlerësuar
            </button>
          </div>
        ) : userReview && !isEditing ? (
          <div className="review-user-existing">
            <div className="review-user-existing__header">
              <div>
                <span className="badge badge--success">✓ Vlerësimi juaj është regjistruar</span>
                <h4 style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '1rem', color: '#1e293b' }}>
                  Ju e keni vlerësuar këtë biznes me {userReview.rating} nga 5 yje:
                </h4>
              </div>
              <div className="review-user-existing__actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Modifiko
                </button>
                <button
                  type="button"
                  className="btn btn--outline-danger btn--sm"
                  onClick={handleDeleteOwnReview}
                  disabled={submitting}
                >
                  🗑️ Fshi
                </button>
              </div>
            </div>
            <div className="review-item__stars" style={{ margin: '0.4rem 0' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`star ${s <= userReview.rating ? 'star--filled' : 'star--empty'}`}>
                  ★
                </span>
              ))}
            </div>
            {userReview.comment && (
              <p className="review-item__comment" style={{ margin: '0.3rem 0 0 0' }}>
                &ldquo;{userReview.comment}&rdquo;
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="review-form__header">
              <h4 className="review-form__title">
                {userReview ? '✏️ Ndrysho Vlerësimin Tuaj' : '⭐ Shto Vlerësimin Tuaj'}
              </h4>
              {isEditing && (
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => setIsEditing(false)}
                >
                  Anulo
                </button>
              )}
            </div>

            {formFeedback && (
              <div
                className={`review-feedback review-feedback--${formFeedback.type}`}
                role="alert"
              >
                {formFeedback.type === 'success' ? '✓ ' : '⚠️ '}
                {formFeedback.message}
              </div>
            )}

            {/* Përzgjedhësi interaktiv i yjeve */}
            <div className="star-picker-group">
              <label className="star-picker-group__label">Zgjidhni vlerësimin me yje:</label>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map((starNum) => {
                  const isFilled = hoverRating ? starNum <= hoverRating : starNum <= rating;
                  return (
                    <button
                      key={starNum}
                      type="button"
                      className={`star-picker__btn ${isFilled ? 'is-active' : ''}`}
                      onMouseEnter={() => setHoverRating(starNum)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starNum)}
                      aria-label={`${starNum} yje - ${STAR_LABELS[starNum]}`}
                    >
                      ★
                    </button>
                  );
                })}
                <span className="star-picker__hint">
                  {STAR_LABELS[hoverRating || rating]} ({hoverRating || rating} / 5)
                </span>
              </div>
            </div>

            {/* Komenti me tekst */}
            <div className="form-field" style={{ marginTop: '0.75rem' }}>
              <label htmlFor="review-comment">
                Përshtypja juaj (opsionale):
              </label>
              <textarea
                id="review-comment"
                rows={3}
                placeholder="Përshkruani përvojën tuaj me shërbimin, cilësinë, stafin apo çmimet..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
                disabled={submitting}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>
                {comment.length} / 1000 karaktere
              </span>
            </div>

            <div className="review-form__actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={submitting}
              >
                {submitting
                  ? 'Duke ruajtur...'
                  : userReview
                  ? 'Përditëso Vlerësimin'
                  : 'Dërgo Vlerësimin'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── LISTA E KOMENTEVE DHE VLERËSIMEVE ── */}
      <div className="review-list">
        <h4 className="review-list__title">
          Komentet e Qytetarëve ({reviews.length})
        </h4>

        {loading ? (
          <div className="review-list__loading">
            <div className="spinner spinner--sm" aria-hidden="true" />
            <span>Duke ngarkuar komentet...</span>
          </div>
        ) : error ? (
          <div className="review-list__error">⚠️ {error}</div>
        ) : reviews.length === 0 ? (
          <div className="review-list__empty">
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>⭐</span>
            <p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>
              Ende nuk ka përshtypje për këtë biznes.
            </p>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Bëhuni qytetari i parë që ndan përvojën e tij!
            </p>
          </div>
        ) : (
          <div className="review-list__items">
            {reviews.map((rev) => {
              const isOwner = user && rev.user_id === user.id;
              const userName = rev.user?.name || 'Qytetar i Lipjanit';
              const initial = userName.charAt(0).toUpperCase();

              return (
                <article key={rev.id} className="review-item">
                  <div className="review-item__header">
                    <div className="review-item__avatar" aria-hidden="true">
                      {initial}
                    </div>
                    <div className="review-item__user-info">
                      <div className="review-item__name-row">
                        <span className="review-item__user-name">{userName}</span>
                        {isOwner && (
                          <span className="badge badge--primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                            Ju
                          </span>
                        )}
                      </div>
                      <span className="review-item__date">{formatDate(rev.created_at)}</span>
                    </div>

                    <div className="review-item__stars" aria-label={`${rev.rating} nga 5 yje`}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`star ${s <= rev.rating ? 'star--filled' : 'star--empty'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {rev.comment && (
                    <div className="review-item__body">
                      <p className="review-item__comment">{rev.comment}</p>
                    </div>
                  )}

                  {/* Veprime administrative ose vetjake */}
                  {(isOwner || isAdmin) && (
                    <div className="review-item__footer-actions">
                      {isAdmin && !isOwner && (
                        <button
                          type="button"
                          className="review-item__admin-del-btn"
                          onClick={() => handleDeleteAsAdmin(rev.id)}
                          title="Fshi si Administrator"
                        >
                          🛡️ Fshi komentin (Moderim)
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal për Kyçje / Regjistrim kur qytetari dëshiron të vlerësojë */}
      {showAuthModal && (
        <UserAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
          noticeMessage="Ju lutem kyçuni me llogarinë tuaj për të lënë vlerësimin me yje dhe përshtypjen."
        />
      )}
    </section>
  );
}

