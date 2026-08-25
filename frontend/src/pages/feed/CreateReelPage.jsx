import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Video as VideoIcon, Play, Pause, ArrowLeft, MapPin, Check,
} from 'lucide-react';

const SUGGESTED_LOCATIONS = [
  'Nandanvan, Nagpur',
  'Ram Nagar Crossing, Nagpur',
  'Lake View Apartments, Nagpur',
  'Green Park Society, Nagpur',
  'Sunrise Apartments, Nagpur',
  'Municipal Ward 5, Nagpur',
  'Sitabuldi, Nagpur',
  'Dharampeth, Nagpur',
  'Civil Lines, Nagpur',
  'Sadar, Nagpur',
];

export default function CreateReelPage() {
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [step, setStep] = useState('select'); // 'select' | 'trim' | 'details' | 'sharing' | 'shared'
  const [caption, setCaption] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [shareToFeed, setShareToFeed] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const inputRef = useRef(null);
  const videoRef = useRef(null);

  const handleFiles = (files) => {
    if (files && files[0]) {
      setFile(files[0]);
      setPreviewUrl(URL.createObjectURL(files[0]));
      setStep('trim');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleLoadedMetadata = () => {
    const d = videoRef.current?.duration || 0;
    setDuration(d);
    setTrimEnd(d);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
    setPlaying((v) => !v);
  };

  const handleShare = () => {
    setStep('sharing');
    setTimeout(() => setStep('shared'), 8000);
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setStep('select');
    setCaption('');
    setSelectedLocation(null);
    setLocationOpen(false);
    setLocationQuery('');
    setShareToFeed(true);
    setTrimStart(0);
    setTrimEnd(0);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="min-h-screen ml-[76px] bg-ink-950 flex items-center justify-center px-6 py-10">
      <div className={`w-full rounded-2xl bg-ink-900 border border-ink-700 overflow-hidden shadow-2xl transition-all duration-200 ${step === 'details' ? 'max-w-[1000px]' : 'max-w-[420px]'}`}>

        {step === 'trim' && file && previewUrl ? (
          <>
            <div className="relative flex items-center justify-between px-4 py-4 border-b border-ink-800">
              <button onClick={resetAll} aria-label="Back">
                <ArrowLeft size={20} className="text-text-dark hover:text-text-dark-muted transition-colors" />
              </button>
              <p className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold font-body text-text-dark">
                Edit reel
              </p>
              <button
                onClick={() => setStep('details')}
                className="text-[14px] font-semibold font-body text-blue-500 hover:text-blue-400 transition-colors"
              >
                Next
              </button>
            </div>

            <div className="relative aspect-[9/16] bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src={previewUrl}
                autoPlay
                loop
                muted
                playsInline
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
              />
              {!playing && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-ink-950/60 flex items-center justify-center"
                >
                  <Play size={22} className="text-text-dark fill-text-dark ml-0.5" />
                </button>
              )}
            </div>

          </>
        ) : step === 'details' && file && previewUrl ? (
          <>
            <div className="relative flex items-center justify-center px-4 py-4 border-b border-ink-800">
              <button onClick={() => setStep('trim')} aria-label="Back">
                <ArrowLeft size={20} className="text-text-dark hover:text-text-dark-muted transition-colors" />
              </button>
              <p className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold font-body text-text-dark">
                Create new reel
              </p>
              <button
                onClick={handleShare}
                className="absolute right-4 text-[14px] font-semibold font-body text-blue-500 hover:text-blue-400 transition-colors"
              >
                Share
              </button>
            </div>

            <div className="flex max-h-[600px]">
              <div className="w-[40%] relative bg-black flex items-center justify-center overflow-hidden">
                <video
                  src={previewUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-[60%] flex flex-col overflow-y-auto">
                <div className="flex items-center gap-2.5 px-4 py-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-signal to-volt p-[1.5px] shrink-0">
                    <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center">
                      <span className="text-[10px] font-semibold text-text-dark font-body">AB</span>
                    </div>
                  </div>
                  <span className="text-[13.5px] font-semibold font-body text-text-dark">i_am_atharv_1</span>
                </div>

                <div className="px-4">
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value.slice(0, 2200))}
                    placeholder="Write a caption..."
                    rows={4}
                    className="w-full bg-transparent text-[13.5px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none resize-none"
                  />
                  <div className="flex items-center justify-end mt-2 mb-3">
                    <span className="text-[11px] font-body text-text-dark-muted">{caption.length}/2,200</span>
                  </div>
                </div>

                <div className="border-t border-ink-800">
                  {selectedLocation ? (
                    <div className="w-full flex items-center justify-between px-4 py-3.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin size={16} className="text-text-dark shrink-0" />
                        <span className="text-[13.5px] font-body text-text-dark truncate">{selectedLocation}</span>
                      </div>
                      <button
                        onClick={() => { setSelectedLocation(null); setLocationQuery(''); }}
                        aria-label="Remove location"
                      >
                        <X size={15} className="text-text-dark-muted hover:text-text-dark transition-colors" />
                      </button>
                    </div>
                  ) : locationOpen ? (
                    <div className="w-full px-4 py-3.5">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-text-dark-muted shrink-0" />
                        <input
                          autoFocus
                          value={locationQuery}
                          onChange={(e) => setLocationQuery(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Escape') { setLocationOpen(false); setLocationQuery(''); } }}
                          placeholder="Add location"
                          className="flex-1 bg-transparent text-[13.5px] font-body text-text-dark placeholder:text-text-dark-muted focus:outline-none"
                        />
                        <button
                          onClick={() => { setLocationOpen(false); setLocationQuery(''); }}
                          aria-label="Close location search"
                        >
                          <X size={15} className="text-text-dark-muted hover:text-text-dark transition-colors" />
                        </button>
                      </div>

                      {locationQuery.trim() && (
                        <div className="max-h-40 overflow-y-auto -mx-1">
                          {SUGGESTED_LOCATIONS.filter((loc) =>
                            loc.toLowerCase().includes(locationQuery.toLowerCase())
                          ).map((loc) => (
                            <button
                              key={loc}
                              onClick={() => { setSelectedLocation(loc); setLocationOpen(false); }}
                              className="w-full flex items-center gap-2.5 px-1 py-2 rounded-lg hover:bg-ink-800/60 transition-colors text-left"
                            >
                              <MapPin size={14} className="text-text-dark-muted shrink-0" />
                              <span className="text-[13px] font-body text-text-dark truncate">{loc}</span>
                            </button>
                          ))}
                          {SUGGESTED_LOCATIONS.filter((loc) =>
                            loc.toLowerCase().includes(locationQuery.toLowerCase())
                          ).length === 0 && (
                            <p className="text-[12.5px] font-body text-text-dark-muted px-1 py-2">
                              No matching locations.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setLocationOpen(true)}
                      className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-ink-800/50 transition-colors"
                    >
                      <span className="text-[13.5px] font-body text-text-dark-muted">Add location</span>
                      <MapPin size={16} className="text-text-dark-muted" />
                    </button>
                  )}

                  <div className="flex items-center justify-between px-4 py-3.5 border-t border-ink-800">
                    <span className="text-[14px] font-semibold font-body text-text-dark">Share to Feed</span>
                    <button
                      onClick={() => setShareToFeed((v) => !v)}
                      className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                        shareToFeed ? 'bg-lime-400 justify-end' : 'bg-ink-700 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-ink-950 block" />
                    </button>
                  </div>
                  <p className="px-4 pb-4 text-[12px] font-body text-text-dark-muted leading-relaxed">
                    Your reel will also appear on your profile grid and in the Home Feed.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : step === 'sharing' ? (
          <>
            <div className="relative flex items-center justify-center py-4 border-b border-ink-800">
              <p className="text-[15px] font-semibold font-body text-text-dark">Sharing</p>
            </div>
            <div className="flex items-center justify-center py-32">
              <div className="relative w-20 h-20">
                <div
                  className="absolute inset-0 rounded-full animate-spin"
                  style={{ background: 'conic-gradient(from 0deg, #d7ff3d, #eaffb0, #d7ff3d, #d7ff3d)' }}
                />
                <div className="absolute inset-[3px] rounded-full bg-ink-900" />
              </div>
            </div>
          </>
        ) : step === 'shared' ? (
          <>
            <div className="relative flex items-center justify-center py-4 border-b border-ink-800">
              <p className="text-[15px] font-semibold font-body text-text-dark">Reel shared</p>
              <div className="absolute right-4 flex items-center gap-4">
                <button
                  onClick={() => navigate('/reels')}
                  className="text-[14px] font-semibold font-body text-blue-500 hover:text-blue-400 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={resetAll}
                  className="text-[14px] font-semibold font-body text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 py-28">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full" style={{ background: '#d7ff3d' }} />
                <div className="absolute inset-[3px] rounded-full bg-ink-900 flex items-center justify-center">
                  <Check size={28} className="text-lime-400" strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-[15px] font-body text-text-dark">Your reel has been shared.</p>
            </div>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center py-4 border-b border-ink-800">
              <p className="text-[15px] font-semibold font-body text-text-dark">Create new reel</p>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-5 py-24 transition-colors ${
                dragging ? 'bg-ink-800/60' : ''
              }`}
            >
              <VideoIcon size={56} strokeWidth={1.2} className="text-text-dark" />

              <p className="text-[17px] font-body font-light text-text-dark text-center px-6">
                Drag a video here
              </p>

              <button
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[13.5px] font-semibold font-body text-white transition-colors"
              >
                Select from computer
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}