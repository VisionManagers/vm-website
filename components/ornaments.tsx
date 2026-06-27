import React, { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────────
   Ornament layer — Redesign 2026
   Botanical + architectural SVG line art, drawn single-weight like
   museum catalog engravings. All ornament is aria-hidden and inherits
   color from the page aesthetic (stroke-accent / currentColor).
   ───────────────────────────────────────────────────────────────── */

/* Scroll reveal wrapper. quiet = nihon register (long fade, no rise). */
export const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  quiet?: boolean;
  delay?: number;
  as?: 'div' | 'section' | 'span';
}> = ({ children, className = '', quiet = false, delay = 0, as = 'div' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={`${quiet ? 'reveal-quiet' : 'reveal'} ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`eyebrow block ${className}`}>{children}</span>
);

const svgProps = {
  fill: 'none' as const,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

/* ── Solarpunk / botanical ──────────────────────────────────────── */

/* Laurel sprig — Roman section-complete marker, also Home hero garnish */
export const LaurelSprig: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 120 48" className={className} {...svgProps} strokeWidth="1.3" stroke="currentColor">
    <path className="draw-path" style={{ '--path-len': 140 } as React.CSSProperties} d="M8 40 Q60 8 112 40" />
    {[
      [22, 33, -38], [36, 26, -30], [50, 22, -18], [64, 21, -6],
      [78, 23, 8], [92, 28, 22], [104, 34, 34],
    ].map(([x, y, r], i) => (
      <ellipse
        key={i}
        cx={x} cy={y} rx="3.2" ry="8"
        transform={`rotate(${r} ${x} ${y})`}
        className="draw-path"
        style={{ '--path-len': 40, transitionDelay: `${0.25 + i * 0.07}s` } as React.CSSProperties}
      />
    ))}
  </svg>
);

/* Vine tendril divider — grows across the section break */
export const VineDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 320 24" className={`w-64 ${className}`} {...svgProps} strokeWidth="1.2" stroke="currentColor">
    <path className="draw-path" style={{ '--path-len': 360 } as React.CSSProperties}
      d="M4 14 C 50 14, 60 6, 96 10 S 160 20, 200 12 S 280 6, 316 12" />
    <path className="draw-path" style={{ '--path-len': 50, transitionDelay: '0.5s' } as React.CSSProperties}
      d="M96 10 q 4 -8 12 -9" />
    <ellipse cx="120" cy="6" rx="2.6" ry="6" transform="rotate(28 120 6)"
      className="draw-path" style={{ '--path-len': 30, transitionDelay: '0.65s' } as React.CSSProperties} />
    <path className="draw-path" style={{ '--path-len': 50, transitionDelay: '0.8s' } as React.CSSProperties}
      d="M200 12 q 5 8 13 8" />
    <ellipse cx="226" cy="19" rx="2.6" ry="6" transform="rotate(-62 226 19)"
      className="draw-path" style={{ '--path-len': 30, transitionDelay: '0.95s' } as React.CSSProperties} />
  </svg>
);

/* Single leaf mark — list / card marker */
export const LeafMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" className={className} {...svgProps} strokeWidth="1.3" stroke="currentColor">
    <path d="M10 17 C 4 13, 4 6, 10 3 C 16 6, 16 13, 10 17 Z" />
    <path d="M10 16.5 V 5" opacity="0.6" />
  </svg>
);

/* ── Roman ──────────────────────────────────────────────────────── */

/* Arch frame: wraps content/image with a semicircular top */
export const ArchFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`overflow-hidden border border-current/15 ${className}`} style={{ borderRadius: '999px 999px 4px 4px / 380px 380px 4px 4px' }}>
    {children}
  </div>
);

/* Column flank: 1px verticals framing a pull-quote or stat */
export const ColumnFlank: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`relative px-8 md:px-12 ${className}`}>
    <span aria-hidden className="absolute left-0 top-0 bottom-0 w-px bg-current opacity-25" />
    <span aria-hidden className="absolute left-1.5 top-2 bottom-2 w-px bg-current opacity-15" />
    <span aria-hidden className="absolute right-0 top-0 bottom-0 w-px bg-current opacity-25" />
    <span aria-hidden className="absolute right-1.5 top-2 bottom-2 w-px bg-current opacity-15" />
    {children}
  </div>
);

/* ── Indian classical ───────────────────────────────────────────── */

/* Jali screen — perforated-lattice background panel (stroke-only) */
export const JaliPattern: React.FC<{ className?: string; opacity?: number }> = ({ className = '', opacity = 0.18 }) => (
  <svg className={`absolute inset-0 w-full h-full ${className}`} {...svgProps} preserveAspectRatio="xMidYMid slice" style={{ opacity }}>
    <defs>
      <pattern id="jali" width="56" height="64" patternUnits="userSpaceOnUse">
        <path d="M28 2 C 38 12, 42 18, 42 28 C 42 40, 36 48, 28 54 C 20 48, 14 40, 14 28 C 14 18, 18 12, 28 2 Z"
          fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="28" cy="28" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0 60 q 14 -8 28 0 q 14 8 28 0" fill="none" stroke="currentColor" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#jali)" />
  </svg>
);

/* Cusped (multifoil) arch divider */
export const CuspedArch: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 320 28" className={`w-64 ${className}`} {...svgProps} strokeWidth="1.2" stroke="currentColor">
    <path className="draw-path" style={{ '--path-len': 420 } as React.CSSProperties}
      d="M4 24 q 16 -16 32 0 q 16 -16 32 0 q 16 -16 32 0 q 16 -16 32 0 q 16 -16 32 0 q 16 -16 32 0 q 16 -16 32 0 q 16 -16 32 0 q 16 -16 32 0 q 16 -16 28 0" />
  </svg>
);

/* Lotus mark — opens within a tile */
export const LotusMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 48 32" className={className} {...svgProps} strokeWidth="1.2" stroke="currentColor">
    <path className="draw-path" style={{ '--path-len': 80 } as React.CSSProperties}
      d="M24 28 C 14 24, 10 14, 12 6 C 18 10, 22 16, 24 28 C 26 16, 30 10, 36 6 C 38 14, 34 24, 24 28 Z" />
    <path className="draw-path" style={{ '--path-len': 60, transitionDelay: '0.3s' } as React.CSSProperties}
      d="M24 28 C 18 18, 18 10, 24 2 C 30 10, 30 18, 24 28 Z" />
    <path className="draw-path" style={{ '--path-len': 50, transitionDelay: '0.5s' } as React.CSSProperties}
      d="M6 28 q 18 -6 36 0" opacity="0.6" />
  </svg>
);

/* ── Japanese ───────────────────────────────────────────────────── */

/* Torii / pillar mark — the section icon Sukh asked for */
export const ToriiMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 32 32" className={className} {...svgProps} strokeWidth="1.4" stroke="currentColor">
    <path d="M3 8 Q 16 5 29 8" />
    <path d="M6 13 H 26" />
    <path d="M9 13 V 28 M23 13 V 28" />
    <path d="M16 8 V 13" opacity="0.7" />
  </svg>
);

/* Sakura branch — enters from the margin, never centered */
export const SakuraBranch: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 240 120" className={className} {...svgProps} strokeWidth="1.3">
    <path className="draw-path" style={{ '--path-len': 300 } as React.CSSProperties} stroke="currentColor"
      d="M2 116 C 40 96, 64 78, 92 62 C 124 44, 150 40, 186 30 M92 62 C 100 48, 108 40, 122 32 M150 40 C 152 28, 158 20, 168 14" />
    {[
      [122, 30, 1], [170, 12, 1], [188, 28, 1], [108, 44, 0.85], [206, 22, 0.7],
    ].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`} className="stroke-accent">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-5.5" rx="2.6" ry="4.6" transform={`rotate(${a})`}
            className="draw-path" style={{ '--path-len': 24, transitionDelay: `${0.7 + i * 0.12}s` } as React.CSSProperties} />
        ))}
        <circle cx="0" cy="0" r="1" className="fill-accent" stroke="none" />
      </g>
    ))}
  </svg>
);

/* Shoji grid — light through paper; one section per page max */
export const ShojiGrid: React.FC<{ className?: string; opacity?: number }> = ({ className = '', opacity = 0.1 }) => (
  <svg className={`absolute inset-0 w-full h-full ${className}`} {...svgProps} preserveAspectRatio="xMidYMid slice" style={{ opacity }}>
    <defs>
      <pattern id="shoji" width="96" height="120" patternUnits="userSpaceOnUse">
        <rect width="96" height="120" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M48 0 V120 M0 60 H96" stroke="currentColor" strokeWidth="0.6" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#shoji)" />
  </svg>
);

/* ── Shared primitives ──────────────────────────────────────────── */

/* Engraved section number (Playfair lining figures) */
export const SectionNumber: React.FC<{ n: string; className?: string }> = ({ n, className = '' }) => (
  <span aria-hidden className={`font-serif text-5xl md:text-6xl leading-none text-accent opacity-90 ${className}`}>{n}</span>
);

/* ── Cosmos ──────────────────────────────────────────────────────── */

/* Constellation field — the Cosmos motif. Drifting nodes linked when
   near: relationship-mapping made visible (stars → constellations,
   neurons → a mind). Decorative + aria-hidden; meaning lives in the HTML
   behind it. Static single frame under reduced-motion, so it never blocks
   comprehension or prerender. Absolutely positioned; never intercepts input. */
export const Constellation: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINK = 134;
    let width = 0;
    let height = 0;
    let nodes: { x: number; y: number; vx: number; vy: number; r: number; bright: boolean }[] = [];
    let raf = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(26, Math.min(76, Math.floor((width * height) / 15500)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.4 + 0.8,
        bright: Math.random() < 0.16,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(11,76,131,${(1 - d / LINK) * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        if (n.bright) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 3.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,229,209,0.08)';
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.bright ? 'rgba(0,194,178,0.95)' : 'rgba(11,76,131,0.5)';
        ctx.fill();
      }
    };

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      build();
      if (reduce) draw();
      else raf = requestAnimationFrame(step);
    };

    const onResize = () => {
      cancelAnimationFrame(raf);
      start();
    };

    start();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={`constellation-canvas ${className}`} aria-hidden />;
};

/* Primary + secondary button voices (invariant across aesthetics) */
export const buttonPrimary =
  'inline-flex items-center justify-center gap-2 px-10 py-4 bg-vmNavy text-white text-sm font-semibold tracking-wide rounded-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200';
export const buttonSecondary =
  'inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-vmNavy border border-slate-200 text-sm font-semibold tracking-wide rounded-sm hover:bg-vmSlate transition-all duration-200';
export const buttonTealOnNavy =
  'inline-flex items-center justify-center gap-2 px-10 py-4 bg-vmTeal text-vmNavy text-sm font-bold tracking-wide rounded-sm hover:bg-white transition-all duration-200';
