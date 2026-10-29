import { useState, useEffect } from 'react';

/**
 * BusinessPhotoGallery – Galeri me shumë foto për bizneset në Lipjan
 * me modal Lightbox për shfletim me rezolucion të plotë.
 */
export default function BusinessPhotoGallery({ photos = [], businessName = 'Biznesi' }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  // Mbyllje me butonin Escape dhe shfletim me tastierë majtas/djathtas
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, photos.length]);

  if (!photos || photos.length === 0) {
    return null;
  }

  const currentPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <section className="business-profile__card business-gallery-section" aria-labelledby="gallery-heading">
      <div className="business-gallery-header">
        <div>
          <h2 id="gallery-heading" className="business-profile__card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📸</span> Galeria e Fotove
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Pamje nga ambienti, ambientet e brendshme, tarraca dhe produktet e <strong>{businessName}</strong>.
          </p>
        </div>
        <span className="badge badge--success" style={{ fontWeight: 600 }}>
          {photos.length} {photos.length === 1 ? 'Foto' : 'Foto'}
        </span>
      </div>

      {/* Grid-i i fotove */}
      <div className={`business-gallery-grid ${photos.length === 1 ? 'business-gallery-grid--single' : photos.length === 2 ? 'business-gallery-grid--double' : ''}`}>
        {photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            className={`gallery-thumb ${idx === 0 ? 'gallery-thumb--hero' : ''}`}
            onClick={() => setSelectedPhotoIndex(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedPhotoIndex(idx)}
            aria-label={`Zmadho foton: ${photo.caption || businessName}`}
          >
            <img
              src={photo.image_url}
              alt={photo.caption || `${businessName} - Foto ${idx + 1}`}
              loading="lazy"
            />
            <div className="gallery-thumb__overlay">
              <span className="gallery-thumb__zoom-icon">🔍 Zmadho</span>
              {photo.caption && (
                <span className="gallery-thumb__caption">{photo.caption}</span>
              )}
            </div>
            {photo.is_primary && (
              <span className="gallery-thumb__primary-tag">★ Ballore</span>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && currentPhoto && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setSelectedPhotoIndex(null)}
        >
          <div className="gallery-lightbox__dialog">
            <button
              type="button"
              className="gallery-lightbox__close"
              onClick={() => setSelectedPhotoIndex(null)}
              aria-label="Mbyll galerinë"
            >
              ✕
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-lightbox__nav gallery-lightbox__nav--prev"
                  onClick={() => setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                  aria-label="Foto e mëparshme"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="gallery-lightbox__nav gallery-lightbox__nav--next"
                  onClick={() => setSelectedPhotoIndex((prev) => (prev + 1) % photos.length)}
                  aria-label="Foto pasuese"
                >
                  ›
                </button>
              </>
            )}

            <div className="gallery-lightbox__img-wrap">
              <img
                src={currentPhoto.image_url}
                alt={currentPhoto.caption || businessName}
              />
            </div>

            <div className="gallery-lightbox__footer">
              <span className="gallery-lightbox__caption">
                {currentPhoto.caption || `${businessName} (${selectedPhotoIndex + 1} nga ${photos.length})`}
              </span>
              <span className="gallery-lightbox__counter">
                {selectedPhotoIndex + 1} / {photos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
