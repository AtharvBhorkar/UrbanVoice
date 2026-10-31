// Suggested locations ke approx coordinates (Nagpur). Map pin ke liye.
const BASE = {
  'Nandanvan, Nagpur': { lat: 21.1186, lng: 79.1275 },
  'Ram Nagar Crossing, Nagpur': { lat: 21.1337, lng: 79.0613 },
  'Lake View Apartments, Nagpur': { lat: 21.1280, lng: 79.0370 },
  'Green Park Society, Nagpur': { lat: 21.1100, lng: 79.0900 },
  'Sunrise Apartments, Nagpur': { lat: 21.1000, lng: 79.1000 },
  'Municipal Ward 5, Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Sitabuldi, Nagpur': { lat: 21.1396, lng: 79.0849 },
  'Dharampeth, Nagpur': { lat: 21.1366, lng: 79.0689 },
  'Civil Lines, Nagpur': { lat: 21.1561, lng: 79.0816 },
  'Sadar, Nagpur': { lat: 21.1640, lng: 79.0870 },
};

// Chhota random offset (~150m) taaki ek hi area ke pins ek-dusre ko na dhak lein
export const pinFor = (name) => {
  const p = BASE[name];
  if (!p) return null;
  const jitter = () => (Math.random() - 0.5) * 0.003;
  return { lat: +(p.lat + jitter()).toFixed(6), lng: +(p.lng + jitter()).toFixed(6) };
};