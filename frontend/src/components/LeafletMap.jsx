import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDirectionsUrl } from '../utils/distance';

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
 * Gjeneron një DivIcon pulsues për vendndodhjen e përdoruesit (User Location).
 */
function createUserPin() {
  return L.divIcon({
    className: 'user-leaflet-marker',
    html: `
      <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:#3b82f6;opacity:0.4;animation:leafletPulse 2s infinite ease-out;"></div>
        <div style="position:relative;width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.4);z-index:2;"></div>
      </div>
      <style>
        @keyframes leafletPulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      </style>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

/**
 * LeafletMap – Komponenti kryesor ndërveprues i hartës Leaflet.
 * Mbështet:
 *  - Pamje për një biznes të vetëm (profili i biznesit me pinpoint të saktë fizik)
 *  - Pamje katalogu me shumë biznese (shfaqje e të gjitha bizneseve me koordinata reale)
 *  - Shfaqje të vendndodhjes së përdoruesit ("Afër Meje") dhe buton navigimi hap-pas-hapi.
 */
export default function LeafletMap({
  business = null,
  businesses = null,
  userLocation = null,
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

      const markerColor = business.is_featured ? '#e11d48' : '#2563eb';
      const marker = L.marker([lat, lng], {
        icon: createCustomPin(markerColor, business.is_featured),
        title: business.name,
      }).addTo(map);

      const categoryName = business.category?.name || 'Biznes';
      const addressText = business.address || 'Lipjan';
      const settlementName = business.settlement?.name || '';
      const directionsUrl = getDirectionsUrl(lat, lng, userLocation);

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; min-width: 220px; padding: 2px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">${categoryName}</span>
          <h4 style="margin: 4px 0 6px 0; font-size: 15px; font-weight: 700; color: #0f172a;">${business.name}</h4>
          <p style="margin: 0 0 6px 0; color: #475569; font-size: 12px; display: flex; align-items: center; gap: 4px;">
            <span>📍</span> <span>${addressText}${settlementName ? `, ${settlementName}` : ''}</span>
          </p>
          <div style="font-size: 11px; color: #059669; font-weight: 600; margin-top: 4px; padding-top: 4px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
            <span>✓ Lokacion i verifikuar</span>
          </div>
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:4px;width:100%;margin-top:8px;padding:6px 10px;background:#2563eb;color:#ffffff;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;box-sizing:border-box;">
            🧭 Më trego rrugën (Navigim) ↗
          </a>
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();

      if (userLocation && userLocation.lat && userLocation.lng) {
        const uMarker = L.marker([userLocation.lat, userLocation.lng], {
          icon: createUserPin(),
          title: 'Vendndodhja juaj',
        }).addTo(map);

        uMarker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 2px;">
            <strong style="color: #2563eb; font-size: 13px;">📍 Vendndodhja Juaj</strong>
            <p style="margin: 2px 0 0 0; color: #64748b; font-size: 11px;">${userLocation.label || 'GPS i Verifikuar'}</p>
          </div>
        `);

        const bounds = L.latLngBounds([
          [lat, lng],
          [userLocation.lat, userLocation.lng],
        ]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      } else {
        map.setView([lat, lng], 16);
      }
    }
    // RASTI 2: Pamje me shumë biznese të katalogut
    else if (Array.isArray(businesses) && businesses.length > 0) {
      const validBusinesses = businesses.filter(
        (b) => b && b.latitude != null && b.longitude != null
      );

      if (validBusinesses.length > 0 || (userLocation && userLocation.lat && userLocation.lng)) {
        const markersGroup = L.featureGroup();

        // Nëse ka vendndodhje përdoruesi, shto markerin e tij
        if (userLocation && userLocation.lat && userLocation.lng) {
          const userMarker = L.marker([userLocation.lat, userLocation.lng], {
            icon: createUserPin(),
            title: 'Vendndodhja juaj aktuale',
            zIndexOffset: 1000,
          });

          userMarker.bindPopup(`
            <div style="font-family: inherit; font-size: 12px; padding: 2px; text-align: center;">
              <strong style="color: #2563eb; font-size: 13px; display: block;">📍 Vendndodhja Juaj Aktuale</strong>
              <span style="color: #64748b; font-size: 11px;">${userLocation.label || 'Koordinatat nga GPS'}</span>
            </div>
          `);

          userMarker.addTo(markersGroup);
        }

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
          const distanceHtml = biz.distance_text
            ? `<div style="display:inline-flex;align-items:center;gap:3px;background:#eff6ff;color:#1e40af;border:1px solid #bfdbfe;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;margin-bottom:6px;">🧭 ${biz.distance_text}</div>`
            : '';
          const directionsUrl = getDirectionsUrl(lat, lng, userLocation);

          const popupHtml = `
            <div style="font-family: inherit; font-size: 13px; min-width: 230px; padding: 4px;">
              ${distanceHtml}
              ${catName ? `<div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">${catName}</div>` : ''}
              <h4 style="margin: 3px 0 6px 0; font-size: 15px; font-weight: 700; color: #0f172a;">${biz.name}</h4>
              <p style="margin: 0 0 8px 0; color: #475569; font-size: 12px;">📍 ${address}${settlement ? ` (${settlement})` : ''}</p>
              <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
                ${
                  onSelectBusiness && biz.slug
                    ? `<button id="map-btn-${biz.id}" style="width:100%;padding:6px 12px;background:#2563eb;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;">
                        Shiko Profilin e Plotë ➔
                       </button>`
                    : ''
                }
                <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:4px;width:100%;padding:5px 10px;background:#f8fafc;color:#1e40af;border:1px solid #cbd5e1;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none;box-sizing:border-box;">
                  🧭 Më trego rrugën ↗
                </a>
              </div>
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
  }, [business, businesses, userLocation, onSelectBusiness]);

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
