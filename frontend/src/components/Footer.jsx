const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer – Komponenti i unifikuar i fundfaqes për të gjitha pamjet publike të platformës.
 */
export default function Footer({ onNavigate, onSelectCategory }) {
  const handleNav = (view, extra) => {
    if (onNavigate) {
      onNavigate(view, extra);
    }
  };

  const handleCat = (slug) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else if (onNavigate) {
      onNavigate('catalog', { category: slug });
    }
  };

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer__grid">
          {/* Brand & Municipal Info */}
          <div className="site-footer__col site-footer__col--brand">
            <div className="footer-brand">
              <span className="footer-brand__crest" aria-hidden="true">🏛️</span>
              <div>
                <h3 className="footer-brand__title">Katalogu i Bizneseve</h3>
                <span className="footer-brand__sub">Komuna e Lipjanit</span>
              </div>
            </div>
            <p className="site-footer__text">
              Portali zyrtar për prezantimin, promovimin dhe zbulimin e bizneseve, zejtarive dhe shërbimeve aktive në gjithë territorin e Komunës së Lipjanit.
            </p>
            <div className="footer-badge-pill">
              <span>📍 Qyteti i Lipjanit &amp; 70+ Vendbanime</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="site-footer__col">
            <h4 className="site-footer__heading">Lidhje të Shpejta</h4>
            <ul className="site-footer__links">
              <li>
                <button type="button" onClick={() => handleNav('home')}>
                  Ballina / Kreu
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('catalog')}>
                  Katalogu i Plotë
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('categories')}>
                  Kategoritë e Bizneseve
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('home', { scrollTo: 'sponsored' })}>
                  ★ Bizneset e Sponsorizuara
                </button>
              </li>
            </ul>
          </div>

          {/* Sektorët kryesorë */}
          <div className="site-footer__col">
            <h4 className="site-footer__heading">Sektorët Kryesorë</h4>
            <ul className="site-footer__links">
              <li>
                <button type="button" onClick={() => handleCat('gastronomi')}>
                  🍽️ Restorante &amp; Gastronomi
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCat('shendetesi')}>
                  💊 Farmaci &amp; Shëndetësi
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCat('tregti')}>
                  🛒 Supermarkete &amp; Tregti
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCat('auto-transport')}>
                  🚗 Auto &amp; Transport
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCat('sherbime')}>
                  🛠️ Shërbime &amp; Zejtari
                </button>
              </li>
            </ul>
          </div>

          {/* Për Ndërmarrësit */}
          <div className="site-footer__col">
            <h4 className="site-footer__heading">Për Ndërmarrësit &amp; Qytetarët</h4>
            <ul className="site-footer__info-list">
              <li>
                <span className="footer-info-icon" aria-hidden="true">✓</span>
                <span>Të dhëna të verifikuara komunale</span>
              </li>
              <li>
                <span className="footer-info-icon" aria-hidden="true">✓</span>
                <span>Vendndodhje të sakta në hartë</span>
              </li>
              <li>
                <span className="footer-info-icon" aria-hidden="true">✓</span>
                <span>Orare dhe numra të drejtpërdrejtë telefoni</span>
              </li>
              <li>
                <span className="footer-info-icon" aria-hidden="true">✓</span>
                <span>Promovim me reklama të veçuara lokale</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            &copy; {CURRENT_YEAR} Komuna e Lipjanit &bull; Katalogu i Bizneseve Lokale. Të gjitha të drejtat të rezervuara.
          </p>
          <div className="footer-bottom-meta">
            <span className="status-indicator"></span>
            <span>Sistemi është aktiv dhe i sinkronizuar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
