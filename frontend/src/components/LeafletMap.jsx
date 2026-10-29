import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Gjeneron një SVG DivIcon modern dhe të mprehtë për markerin Leaflet.
 */
function createCustomPin(color = '#2563eb', isFeatured = false) {
  const badgeHtml = isFeatured
    ? `<span style="position:absolute;top:-4px;right:-4px;background:#f59e0b;color:#fff;border-radius:50%;width:12px;height:12px;font-size:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.3)">★</span>`
    : '';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position:relative;width:34px;height:42px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35));transition:transform 0.15s ease;">
        <svg viewBox="0 0 34 42" width="34" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="${color}"/>
          <circle cx="17" cy="16" r="7" fill="#ffffff"/>
          <circle cx="17" cy="16" r="3.5" fill="${color}"/>
        </svg>
        ${badgeHtml}
      </div>
    `,
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -40],
  });
}

/**
 * LeafletMap – Komponenti kryesor ndërveprues i hartës Leaflet.
 * Mbështet:
 *  - Pamje për një biznes të vetëm (profili i biznesit me pinpoint të saktë fizik)
 *  - Pamje katalogu me shumë biznese (shfaqje e të gjitha bizneseve me koordinata reale)
 */
export default function LeafletMap({
  business = null,
  businesses = null,
  height = '400px',
  onSelectBusiness = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Pastro hartën e mëparshme nëse ekziston
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Inicializo hartën Leaflet
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    });
    mapInstanceRef.current = map;

    // Shto OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors | Lipjan',
      maxZoom: 19,
    }).addTo(map);

    // RASTI 1: Pamje për një biznes të vetëm
    if (business && business.latitude && business.longitude) {
      const lat = parseFloat(business.latitude);
      const lng = parseFloat(business.longitude);

      map.setView([lat, lng], 16);

      const markerColor = business.is_featured ? '#e11d48' : '#2563eb';
      const marker = L.marker([lat, lng], {
        icon: createCustomPin(markerColor, business.is_featured),
        title: business.name,
      }).addTo(map);

      const categoryName = business.category?.name || 'Biznes';
      const addressText = business.address || 'Lipjan';
      const settlementName = business.settlement?.name || '';

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; min-width: 200px; padding: 2px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">${categoryName}</span>
          <h4 style="margin: 4px 0 6px 0; font-size: 15px; font-weight: 700; color: #0f172a;">${business.name}</h4>
          <p style="margin: 0 0 6px 0; color: #475569; font-size: 12px; display: flex; align-items: center; gap: 4px;">
            <span>📍</span> <span>${addressText}${settlementName ? `, ${settlementName}` : ''}</span>
          </p>
          <div style="font-size: 11px; color: #059669; font-weight: 600; margin-top: 4px; padding-top: 4px; border-top: 1px solid #f1f5f9;">
            ✓ Lokacion fizik i verifikuar
          </div>
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();
    }
    // RASTI 2: Pamje me shumë biznese të katalogut
    else if (Array.isArray(businesses) && businesses.length > 0) {
      const validBusinesses = businesses.filter(
        (b) => b && b.latitude != null && b.longitude != null
      );

      if (validBusinesses.length > 0) {
        const markersGroup = L.featureGroup();

        validBusinesses.forEach((biz) => {
          const lat = parseFloat(biz.latitude);
          const lng = parseFloat(biz.longitude);
          if (isNaN(lat) || isNaN(lng)) return;

          const color = biz.is_featured ? '#e11d48' : '#2563eb';
          const marker = L.marker([lat, lng], {
            icon: createCustomPin(color, biz.is_featured),
            title: biz.name,
          });

          const catName = biz.category?.name || '';
          const address = biz.address || 'Lipjan';
          const settlement = biz.settlement?.name || '';

          const popupHtml = `
            <div style="font-family: inherit; font-size: 13px; min-width: 220px; padding: 4px;">
              ${catName ? `<span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">${catName}</span>` : ''}
              <h4 style="margin: 3px 0 6px 0; font-size: 15px; font-weight: 700; color: #0f172a;">${biz.name}</h4>
              <p style="margin: 0 0 8px 0; color: #475569; font-size: 12px;">📍 ${address}${settlement ? ` (${settlement})` : ''}</p>
              ${
                onSelectBusiness && biz.slug
                  ? `<button id="map-btn-${biz.id}" style="width:100%;padding:6px 12px;background:#2563eb;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;">
                      Shiko Profilin e Plotë ➔
                     </button>`
                  : ''
              }
            </div>
          `;

          marker.bindPopup(popupHtml);

          marker.on('popupopen', () => {
            if (onSelectBusiness && biz.slug) {
              const btn = document.getElementById(`map-btn-${biz.id}`);
              if (btn) {
                btn.onclick = () => onSelectBusiness(biz.slug);
              }
            }
          });

          marker.addTo(markersGroup);
        });

        markersGroup.addTo(map);

        // Përshtat kufijtë e hartës për të gjithë markerët e territorit
        if (markersGroup.getLayers().length > 0) {
          map.fitBounds(markersGroup.getBounds(), {
            padding: [40, 40],
            maxZoom: 16,
          });
        }
      } else {
        // Fallback default në qendër të Lipjanit
        map.setView([42.5213, 21.1226], 13);
      }
    } else {
      // Qendra e Komunës së Lipjanit si vlerë standarde
      map.setView([42.5213, 21.1226], 13);
    }

    // Invalidate size pas montimit për renderim të qartë
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [business, businesses, onSelectBusiness]);

  return (
    <div
      className="leaflet-map-wrapper"
      style={{
        width: '100%',
        height,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1.5px solid #e2e8f0',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
      }}
    >
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      />
    </div>
  );
}
