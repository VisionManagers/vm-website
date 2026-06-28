import React, { useEffect, useRef, useState } from 'react';

/* The opt-in soundscape chooser. A persistent vertical tab on the middle-right;
   open it and pick one of a few ambient beds. Nothing plays until chosen.
   Tracks are licensed/commissioned and dropped in later — set `src` per track. */

export type AmbientTrack = { key: string; label: string; src?: string };

const DEFAULT_TRACKS: AmbientTrack[] = [
  { key: 'cathedral', label: 'Cathedral choir', src: '' },
  { key: 'jazz', label: 'Jazz room', src: '' },
  { key: 'birdsong', label: 'Birdsong', src: '' },
  { key: 'ocean', label: 'Ocean', src: '' },
];

const SoundDock: React.FC<{ tracks?: AmbientTrack[] }> = ({ tracks = DEFAULT_TRACKS }) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const active = tracks.find((t) => t.key === current) || null;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (active?.src) {
      a.src = active.src;
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [active]);

  const pick = (key: string) => setCurrent((prev) => (prev === key ? null : key));

  // Until at least one soundscape is licensed, don't ship a control that plays
  // nothing — it reappears automatically the moment a track has a source.
  if (!tracks.some((t) => t.src)) return null;

  return (
    <div className="sounddock">
      {open && (
        <div className="sounddock-panel" role="group" aria-label="Ambient soundscape">
          <h4>Let the voices in</h4>
          {tracks.map((t) => (
            <button
              key={t.key}
              type="button"
              className="sounddock-opt"
              aria-pressed={current === t.key}
              onClick={() => pick(t.key)}
            >
              <span className="mini" aria-hidden />
              {t.label}
            </button>
          ))}
          <button type="button" className="sounddock-off" onClick={() => setCurrent(null)}>
            Sound off
          </button>
        </div>
      )}

      <button
        type="button"
        className="sounddock-tab"
        aria-expanded={open}
        aria-label={open ? 'Close soundscape menu' : 'Choose an ambient soundscape'}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className="dot"
          aria-hidden
          style={{ background: active ? '#00C2B2' : '#C9A24B', boxShadow: `0 0 8px ${active ? '#00C2B2' : '#C9A24B'}` }}
        />
        <span className="vlabel">{active ? active.label : 'Sound'}</span>
      </button>

      <audio ref={audioRef} loop preload="none" />
    </div>
  );
};

export default SoundDock;
