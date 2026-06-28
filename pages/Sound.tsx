import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BOOKING_URLS } from '../constants';
import { Reveal, buttonPrimary } from '../components/ornaments';
import SoundDock from '../components/SoundDock';
import { ChevronRight, ArrowLeft } from 'lucide-react';

/* The Museum of the Human Voice — a separate, immersive exhibition.
   Backgrounds are atmospheric placeholders (gradients) except the cathedral,
   which reuses the real image already shipped for Home. Licensed footage,
   per-room soundscapes, and the birdsong research citation are dropped in
   before launch (the data is the single place to swap them). */

type Movement = {
  key: string;
  num: string;
  title: string;
  tradition: string;
  note: string;
  tone: 'dark' | 'light';
  bg: string;
  img?: string;
};

const MOVEMENTS: Movement[] = [
  {
    key: 'cathedral', num: 'I', title: 'The Cathedral',
    tradition: 'Gregorian chant · stone · reverberation',
    note: 'Sacred spaces were built for the voice — the architecture is the instrument. Sound given room to become awe.',
    tone: 'dark', img: '/images/vm/cathedral-dome.jpg', bg: '#0A1722',
  },
  {
    key: 'jazz', num: 'II', title: 'The Jazz Room',
    tradition: 'Brushed drums · upright bass · a lone horn',
    note: 'A singer close to the mic in a small, warm room. Voice as presence and improvisation — the exact opposite of a script.',
    tone: 'dark',
    bg: 'radial-gradient(70% 80% at 28% 28%, rgba(232,163,61,0.5), transparent 60%), radial-gradient(60% 70% at 82% 82%, rgba(196,101,74,0.45), transparent 62%), linear-gradient(160deg,#1b1208,#0c0a08)',
  },
  {
    key: 'mehfil', num: 'III', title: 'The Mehfil',
    tradition: 'Harmonium · Urdu poetry · candlelight',
    note: 'The ghazal carries centuries of longing in a single held note — meaning that lives far beyond the literal words.',
    tone: 'dark',
    bg: 'radial-gradient(60% 70% at 50% 24%, rgba(232,163,61,0.55), transparent 60%), radial-gradient(72% 80% at 50% 102%, rgba(122,30,42,0.6), transparent 66%), linear-gradient(160deg,#1c0f10,#0c0808)',
  },
  {
    key: 'bamboo', num: 'IV', title: 'The Bamboo Forest',
    tradition: 'Shakuhachi · wind · water · taiko',
    note: 'Breath drawn through bamboo, then the drum’s force. Sound as the body and the natural world meeting in one phrase.',
    tone: 'light',
    bg: 'radial-gradient(60% 70% at 30% 28%, rgba(111,163,94,0.55), transparent 62%), radial-gradient(60% 70% at 80% 72%, rgba(0,194,178,0.30), transparent 62%), linear-gradient(160deg,#eef3e6,#dfe7d6)',
  },
  {
    key: 'nature', num: 'V', title: 'The Natural World',
    tradition: 'Birdsong · whale call · spectrogram',
    note: 'Birdsong, whale call, the hush of the sea — the sounds that reach us before any word does, and move the body long before they become language.',
    tone: 'light',
    bg: 'radial-gradient(60% 70% at 30% 24%, rgba(0,194,178,0.4), transparent 62%), radial-gradient(72% 80% at 76% 80%, rgba(11,76,131,0.25), transparent 62%), linear-gradient(160deg,#e7f1f2,#dbe9ec)',
  },
  {
    key: 'machine', num: 'VI', title: 'Sound Becomes Language',
    tradition: 'Waveform → phoneme → word → model',
    note: 'Humans turned sound into ever more complex language. Large language models now give that ancient lineage a new voice — used, at its best, to elevate life.',
    tone: 'light',
    bg: 'radial-gradient(58% 70% at 50% 30%, rgba(201,162,75,0.30), transparent 62%), linear-gradient(160deg,#faf6ee,#efe7d6)',
  },
];

const darkScrim = 'linear-gradient(180deg, rgba(10,12,16,0.45), rgba(10,12,16,0.74))';
const lightScrim = 'radial-gradient(60% 60% at 50% 45%, rgba(250,246,238,0.74), rgba(250,246,238,0.34))';

const Sound: React.FC = () => {
  return (
    <>
      <SEO
        title="The Museum of the Human Voice"
        description="A short, immersive walk through where the human voice comes from — from stone cathedrals and jazz rooms to birdsong and the machine that now speaks back. An exhibition by Vision Managers."
        path="/sound"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'The Museum of the Human Voice',
          isPartOf: { '@type': 'WebSite', name: 'Vision Managers', url: 'https://visionmanagers.com' },
          about: 'The history and art of the human voice, from acoustic traditions to AI voice.',
          url: 'https://visionmanagers.com/sound',
        }}
      />

      <div data-aesthetic="solar" className="bg-vmCream">
        <SoundDock />

        {/* ─── Front door ─── */}
        <section className="museum-band" style={{ minHeight: '100vh' }}>
          <div className="museum-bg voice-poster" aria-hidden />
          <div className="museum-scrim" aria-hidden style={{ background: 'radial-gradient(58% 56% at 50% 42%, rgba(250,246,238,0.82), rgba(250,246,238,0.42))' }} />
          <Reveal className="museum-inner">
            <span className="eyebrow voice-eyebrow text-vmGold mb-7">An exhibition by Vision Managers</span>
            <h1 className="font-serif text-vmNavy" style={{ fontSize: 'clamp(2.4rem, 7vw, 5rem)', lineHeight: 1.05 }}>
              The Museum of the<br />
              <span className="italic">Human Voice</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl font-light text-vmInk/80 max-w-2xl mx-auto leading-relaxed">
              Before it ever answered your phone, the voice spent ten thousand years learning to move us.
              A short walk through how — from stone cathedrals to birdsong to the machine that now speaks back.
            </p>
            <p className="mt-9 voice-cue" style={{ position: 'static' }}>
              Begin the journey<span className="arrow" style={{ display: 'inline-block', marginLeft: '0.4rem' }}>↓</span>
            </p>
          </Reveal>
        </section>

        {/* ─── The movements ─── */}
        {MOVEMENTS.map((m) => (
          <section key={m.key} className="museum-band">
            <div className="museum-bg" aria-hidden style={m.img ? { backgroundColor: m.bg, backgroundImage: `url(${m.img})` } : { background: m.bg }} />
            <div className="museum-scrim" aria-hidden style={{ background: m.tone === 'dark' ? darkScrim : lightScrim }} />
            <Reveal className="museum-inner">
              <p className="museum-placard" style={{ color: m.tone === 'dark' ? '#C9A24B' : '#0B4C83' }}>
                {m.num} · {m.tradition}
              </p>
              <h2 className="font-serif mt-5 mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, color: m.tone === 'dark' ? '#FAF6EE' : '#0B4C83' }}>
                {m.title}
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: m.tone === 'dark' ? 'rgba(250,246,238,0.84)' : 'rgba(11,58,99,0.82)' }}>
                {m.note}
              </p>
            </Reveal>
          </section>
        ))}

        {/* ─── Close — back to the offering ─── */}
        <section className="py-28 md:py-36 bg-vmCream text-center">
          <div className="max-w-3xl mx-auto px-6">
            <Reveal>
              <span className="eyebrow voice-eyebrow text-vmGold mb-6">The newest movement</span>
              <h2 className="font-serif text-vmNavy text-4xl md:text-5xl mb-7 italic leading-tight">
                This is how we think about voice.<br />Imagine what we’ll build for yours.
              </h2>
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                  Book a call <ChevronRight className="w-4 h-4" />
                </a>
                <Link to="/ai-voice" className="inline-flex items-center gap-2 text-vmNavy font-semibold hover:text-vmTeal transition-colors text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back to AI Voice
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
};

export default Sound;
