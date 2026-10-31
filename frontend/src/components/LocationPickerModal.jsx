import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { X, LocateFixed, Search, Loader2, MapPin } from 'lucide-react';

const NAGPUR = [21.1458, 79.0882];
const NOMINATIM = 'https://nominatim.openstreetmap.org';

function ClickToPin({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 17, { duration: 0.8 });
  }, [target, map]);
  return null;
}

const shortAddress = (displayName) => displayName.split(',').slice(0, 3).join(',').trim();

export default function LocationPickerModal({ initial, onConfirm, onClose }) {
  const [pin, setPin] = useState(initial?.pin || null);
  const [text, setText] = useState(initial?.text || '');
  const [fly, setFly] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const pick = async (lat, lng) => {
    setPin({ lat, lng });
    setMsg('');
    setText('Finding address…');
    try {
      const res = await fetch(
        `${NOMINATIM}/reverse?format=jsonv2&accept-language=en&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setText(data?.display_name ? shortAddress(data.display_name) : `Pinned location (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
    } catch {
      setText(`Pinned location (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setMsg('This browser does not support GPS.');
      return;
    }
    setBusy(true);
    setMsg('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        pick(latitude, longitude);
        setFly([latitude, longitude]);
        setBusy(false);
      },
      () => {
        setMsg('Could not get your location. Allow location access, or tap on the map instead.');
        setBusy(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch(
        `${NOMINATIM}/search?format=jsonv2&limit=5&countrycodes=in&q=${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();
      setResults(data);
      if (data.length === 0) setMsg('No places found. Try another name or tap on the map.');
    } catch {
      setMsg('Search failed. Tap on the map instead.');
    }
    setBusy(false);
  };

  const choose = (r) => {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    setResults([]);
    setQuery('');
    pick(lat, lng);
    setFly([lat, lng]);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-[640px] max-h-[95vh] overflow-y-auto rounded-2xl bg-ink-900 border border-ink-700 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-800">
          <h2 className="font-display text-[15px] text-text-dark">Pin the exact location</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} className="text-text-dark-muted hover:text-text-dark" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div className="flex gap-2">
            <form onSubmit={search} className="flex-1 flex items-center gap-2 rounded-xl border border-ink-700 px-3">
              <Search size={15} className="text-text-dark-muted shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a place, e.g. Dharampeth Nagpur"
                className="flex-1 bg-transparent py-2.5 text-[13px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none"
              />
            </form>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 rounded-xl bg-volt text-black text-[12.5px] font-semibold font-body disabled:opacity-60"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
              My location
            </button>
          </div>

          {results.length > 0 && (
            <div className="rounded-xl border border-ink-700 overflow-hidden">
              {results.map((r) => (
                <button
                  key={r.place_id}
                  onClick={() => choose(r)}
                  className="w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-ink-800/60"
                >
                  <MapPin size={14} className="text-text-dark-muted mt-0.5 shrink-0" />
                  <span className="text-[12.5px] font-body text-text-dark">{r.display_name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="isolate rounded-xl overflow-hidden border border-ink-700 h-[320px]">
            <MapContainer
              center={initial?.pin ? [initial.pin.lat, initial.pin.lng] : NAGPUR}
              zoom={initial?.pin ? 17 : 12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickToPin onPick={pick} />
              <FlyTo target={fly} />
              {pin && (
                <CircleMarker
                  center={[pin.lat, pin.lng]}
                  radius={11}
                  pathOptions={{ color: '#fff', weight: 3, fillColor: '#ef4444', fillOpacity: 1 }}
                />
              )}
            </MapContainer>
          </div>

          <p className="text-[12px] font-body text-text-dark-muted">
            {pin ? 'Tap elsewhere on the map to move the pin.' : 'Tap on the map where the issue is, search a place, or use your current location.'}
          </p>

          {msg && <p className="text-[12.5px] font-body text-red-400">{msg}</p>}

          {pin && (
            <div>
              <label className="text-[12px] font-body text-text-dark-muted block mb-1.5">
                Address / landmark (you can edit)
              </label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={120}
                className="w-full rounded-xl border border-ink-700 bg-transparent px-3 py-2.5 text-[13px] font-body text-text-dark focus:outline-none focus:border-volt/60"
              />
            </div>
          )}

          <button
            disabled={!pin || !text.trim() || text === 'Finding address…'}
            onClick={() => onConfirm(text.trim(), pin)}
            className="w-full py-3 rounded-xl bg-volt text-black font-semibold font-body text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm location
          </button>
        </div>
      </div>
    </div>
  );
}