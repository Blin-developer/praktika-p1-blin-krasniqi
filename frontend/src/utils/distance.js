/**
 * distance.js – Llogaritja e distancës gjeografike (Formula Haversine)
 * dhe veglat e navigimit për Komunën e Lipjanit.
 */

/**
 * Llogarit distancën në kilometra ndërmjet dy pikave gjeografike
 * duke përdorur formulën sferike Haversine.
 *
 * @param {number} lat1 Gjerësia e pikës 1
 * @param {number} lon1 Gjatësia e pikës 1
 * @param {number} lat2 Gjerësia e pikës 2
 * @param {number} lon2 Gjatësia e pikës 2
 * @returns {number} Distanca në kilometra
 */
export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  if (
    lat1 == null ||
    lon1 == null ||
    lat2 == null ||
    lon2 == null ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return Infinity;
  }

  const R = 6371; // Rrezja mesatare e Tokës në kilometra
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formaton distancën në tekst të lexueshëm për qytetarin:
 * - Nën 1 km: shfaqet në metra (p.sh. "350 m larg")
 * - 1 deri në 10 km: me një shifër dhjetore (p.sh. "1.4 km larg")
 * - Mbi 10 km: numër i rrumbullakosur (p.sh. "14 km larg")
 *
 * @param {number} distanceKm Distanca në kilometra
 * @returns {string|null} Teksti i formatuar ose null
 */
export function formatDistance(distanceKm) {
  if (distanceKm == null || !Number.isFinite(distanceKm) || distanceKm === Infinity) {
    return null;
  }

  if (distanceKm < 1) {
    const meters = Math.max(10, Math.round(distanceKm * 1000));
    return `${meters} m larg`;
  }

  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km larg`;
  }

  return `${Math.round(distanceKm)} km larg`;
}

/**
 * Gjeneron lidhjen direkte të navigimit në Google Maps (Turn-by-Turn Navigation).
 * Nëse lokacioni i përdoruesit njihet, vendos origin dhe destination.
 * Nëse jo, përdor vetëm destinacionin dhe Google Maps përdor GPS aktual të pajisjes.
 *
 * @param {number|string} destLat Latitude e destinacionit (biznesit)
 * @param {number|string} destLng Longitude e destinacionit (biznesit)
 * @param {{lat: number, lng: number}|null} userLocation Lokacioni opsional i përdoruesit
 * @returns {string} URL për Google Maps Directions
 */
export function getDirectionsUrl(destLat, destLng, userLocation = null) {
  const dLat = parseFloat(destLat);
  const dLng = parseFloat(destLng);

  if (userLocation?.lat != null && userLocation?.lng != null) {
    const uLat = parseFloat(userLocation.lat);
    const uLng = parseFloat(userLocation.lng);
    return `https://www.google.com/maps/dir/?api=1&origin=${uLat},${uLng}&destination=${dLat},${dLng}&travelmode=driving`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${dLat},${dLng}&travelmode=driving`;
}

/**
 * Koordinatat standarde të qendrës së Lipjanit (Sheshi "Adem Jashari")
 * si pikë referimi e besueshme për demonstrim ose kur GPS nuk është i disponueshëm.
 */
export const LIPJAN_CENTER_COORDS = {
  lat: 42.5217,
  lng: 21.1258,
  label: "Qendra e Lipjanit (Sheshi 'Adem Jashari')",
};

