/**
 * DeleteConfirmModal – Dritare dialoguese për konfirmimin e fshirjes së një biznesi.
 */
export default function DeleteConfirmModal({
  isOpen,
  business,
  onClose,
  onConfirm,
  deleting = false,
  error = null,
}) {
  if (!isOpen || !business) return null;

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <div className="admin-modal admin-modal--confirm">
        <div className="admin-modal__header admin-modal__header--danger">
          <div className="admin-modal__icon">⚠️</div>
          <h2 id="delete-dialog-title" className="admin-modal__title">Konfirmo Fshirjen</h2>
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
            A jeni të sigurt që dëshironi të fshini biznesin{' '}
            <strong className="admin-confirm-text__highlight">«{business.name}»</strong>?
          </p>

          <p className="admin-confirm-subtext">
            Ky veprim do të heqë përfundimisht biznesin dhe lidhjet e tij me shërbimet nga baza e të dhënave. Ky veprim nuk mund të kthehet mbrapa.
          </p>
        </div>

        <div className="admin-modal__footer">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Anulo
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Duke e fshirë...' : 'Po, fshije biznesin'}
          </button>
        </div>
      </div>
    </div>
  );
}
