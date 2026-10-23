/**
 * DeleteConfirmModal – Dritare dialoguese për konfirmimin e fshirjes së një biznesi.
 */
export default function DeleteConfirmModal({
  isOpen,
  business,
  onClose,
  onConfirm,
  onArchive,
  deleting = false,
  error = null,
}) {
  if (!isOpen || !business) return null;

  const isAlreadyArchived = business.status === 'archived';

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <div className="admin-modal admin-modal--confirm">
        <div className={`admin-modal__header ${isAlreadyArchived ? 'admin-modal__header--danger' : 'admin-modal__header--warning'}`}>
          <div className="admin-modal__icon">{isAlreadyArchived ? '⚠️' : '📦'}</div>
          <h2 id="delete-dialog-title" className="admin-modal__title">
            {isAlreadyArchived ? 'Konfirmo Fshirjen Përfundimtare' : 'Menaxho Fshirjen ose Arkivimin'}
          </h2>
          <button
            type="button"
            className="admin-modal__close-btn"
            onClick={onClose}
            disabled={deleting}
            aria-label="Mbyll"
          >
            ✕
          </button>
        </div>

        <div className="admin-modal__body">
          {error && (
            <div className="admin-alert admin-alert--error" role="alert">
              <strong>Gabim:</strong> {error}
            </div>
          )}

          <p className="admin-confirm-text">
            {isAlreadyArchived ? (
              <>
                A jeni të sigurt që dëshironi të fshini përfundimisht biznesin{' '}
                <strong className="admin-confirm-text__highlight">«{business.name}»</strong>?
              </>
            ) : (
              <>
                A jeni i sigurt që dëshironi ta arkivoni këtë biznes{' '}
                <strong className="admin-confirm-text__highlight">«{business.name}»</strong>?
              </>
            )}
          </p>

          <p className="admin-confirm-subtext">
            {isAlreadyArchived ? (
              'Ky veprim do të heqë përfundimisht biznesin dhe lidhjet e tij me shërbimet nga baza e të dhënave. Ky veprim nuk mund të kthehet mbrapa.'
            ) : (
              'Rekomandohet arkivimi në vend të fshirjes: Biznesi i arkivuar fshihet nga katalogu publik, por të dhënat dhe historiku ruhen të sigurta në panel.'
            )}
          </p>
        </div>

        <div className="admin-modal__footer admin-modal__footer--confirm">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Anulo
          </button>

          {!isAlreadyArchived && onArchive && (
            <button
              type="button"
              className="btn btn--warning"
              onClick={onArchive}
              disabled={deleting}
            >
              {deleting ? 'Duke u procesuar...' : '📦 Arkivo Biznesin (Rekomanduar)'}
            </button>
          )}

          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Duke u fshirë...' : isAlreadyArchived ? 'Po, fshije përfundimisht' : 'Fshij gjithsesi'}
          </button>
        </div>
      </div>
    </div>
  );
}
