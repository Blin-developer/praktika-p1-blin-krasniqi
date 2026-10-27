/**
 * UserProfileModal – Komponent i thjeshtëzuar që nuk pengon build-in.
 * Funksionaliteti i llogarisë administrative tani është i integruar direkt brenda Admin Panel (AdminAccountTab).
 */
export default function UserProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Menaxhimi Administrativ</h3>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Mbyll">
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p>Llogaria dhe konfigurimet administrative menaxhohen direkt nga Paneli Administrativ.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Mbyll
          </button>
        </div>
      </div>
    </div>
  );
}
