import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as api from '../../services/api';

const STATUS_COLOR = {
  Pending: '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved: '#22c55e',
  Rejected: '#ef4444',
};
const FILTERS = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
const NAGPUR = [21.1458, 79.0882];

export default function MapPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .getComplaints()
        .then((res) => alive && setItems(res.data))
        .catch(() => {})
        .finally(() => alive && setLoading(false));
    load();
    const id = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const pins = items.filter(
    (c) =>
      Number.isFinite(c.coordinates?.lat) &&
      Number.isFinite(c.coordinates?.lng) &&
      (filter === 'All' || c.status === filter)
  );

  return (
    <div className="min-h-screen ml-0 md:ml-[76px] bg-ink-950 pb-16 md:pb-0">
      <div className="px-4 md:px-8 pt-6 pb-4">
        <h1 className="font-display text-2xl text-text-dark">Issue Map</h1>
        <p className="font-body text-[13px] text-text-dark-muted mt-1">
          {loading ? 'Loading…' : `${pins.length} issue${pins.length === 1 ? '' : 's'} on the map`} · refreshes every 30s
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-body border transition-colors ${
                filter === f
                  ? 'bg-volt text-black border-volt'
                  : 'border-ink-700 text-text-dark hover:border-volt/50'
              }`}
            >
              {f !== 'All' && (
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{ background: STATUS_COLOR[f] }}
                />
              )}
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-8">
        <div className="rounded-2xl overflow-hidden border border-ink-700 isolate relative z-0 h-[calc(100dvh-290px)] md:h-[calc(100vh-210px)] min-h-[320px]">
          <MapContainer center={NAGPUR} zoom={12} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pins.map((c) => (
              <CircleMarker
                key={c._id}
                center={[c.coordinates.lat, c.coordinates.lng]}
                radius={9}
                pathOptions={{
                  color: '#fff',
                  weight: 2,
                  fillColor: STATUS_COLOR[c.status] || '#888',
                  fillOpacity: 0.95,
                }}
              >
                <Popup>
                  <div style={{ color: '#111', minWidth: 160 }}>
                    {c.mediaType === 'image' && (
                      <img
                        src={api.mediaUrl(c.mediaUrl)}
                        alt=""
                        style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }}
                      />
                    )}
                    <strong>{c.ticketId}</strong>
                    <div>{c.category} · {c.status}</div>
                    {c.location && <div style={{ fontSize: 12, opacity: 0.7 }}>{c.location}</div>}
                    <div style={{ fontSize: 12, marginTop: 4 }}>{c.likes?.length || 0} backed</div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}