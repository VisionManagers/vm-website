import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BOOKING_URLS } from '../constants';
import { Reveal, buttonPrimary, buttonTealOnNavy } from '../components/ornaments';
import SoundDock from '../components/SoundDock';
import { ChevronRight, ArrowRight, PhoneCall, TrendingUp, Music } from 'lucide-react';

/* Drop the licensed/commissioned choir clip in /public and set this to its path
   (e.g. '/videos/voice-choir.mp4'). Empty → the spring-lit poster gradient stands
   in, so there is never a broken/empty <video>. */
const HERO_VIDEO = '';
const HERO_POSTER = '/images/vm/voice-hero-poster.jpg';

const SPECTRUM = [
  {
    key: 'Operate',
    Icon: PhoneCall,
    line: 'The everyday front desk, handled with care.',
    items: ['Reception over your knowledge base', 'Booking & rescheduling', 'Intake forms', 'Data collection', 'Surveys & callbacks'],
  },
  {
    key: 'Grow',
    Icon: TrendingUp,
    line: 'A voice that opens doors, not just answers them.',
    items: ['Sales conversations', 'Lead qualification', 'Deal-making & negotiation'],
  },
  {
    key: 'Create',
    Icon: Music,
    line: 'Where voice becomes craft.',
    items: ['Guided meditations', 'Voiceover for video', 'Sermons', 'Coaching sessions', 'Training', 'Original music — including our founder’s own'],
  },
];

const AIVoice: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLElement>(null);
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  // Staged hero: as you scroll the sticky frame, the headline gives way to the
  // sub-hero + CTA while the background zooms and softens toward cream.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      rootRef.current?.classList.add('voice-reduced');
      return;
    }
    const scroller = scrollerRef.current;
    const s1 = stage1Ref.current, s2 = stage2Ref.current, bg = bgRef.current, veil = veilRef.current;
    if (!scroller || !s1 || !s2 || !bg || !veil) return;

    const ss = (a: number, b: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    let ticking = false;
    const update = () => {
      const total = scroller.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -scroller.getBoundingClientRect().top / total)) : 0;
      const a1 = 1 - ss(0.30, 0.50, p);
      const a2 = ss(0.42, 0.62, p);
      s1.style.opacity = String(a1);
      s1.style.transform = `translateY(${-26 * (1 - a1)}px)`;
      s1.style.pointerEvents = a1 < 0.1 ? 'none' : 'auto';
      s2.style.opacity = String(a2);
      s2.style.transform = `translateY(${28 * (1 - a2)}px)`;
      s2.style.pointerEvents = a2 < 0.1 ? 'none' : 'auto';
      bg.style.transform = `scale(${1 + 0.12 * p})`;
      veil.style.opacity = (0.5 * ss(0.18, 0.7, p)).toFixed(3);
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <SEO
        title="AI Voice — Conversation IQ"
        description="Everybody's getting voice AI. We design the one that sounds like your practice — the first voice a patient trusts. Conversation IQ: voice agents built with taste, for healthcare and other high-trust practices."
        path="/ai-voice"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'AI Voice Agents — Conversation IQ',
          provider: { '@type': 'Organization', name: 'Vision Managers' },
          description: 'Designed voice agents for healthcare and high-trust practices — answering, booking, and earning trust in a voice that sounds like the practice itself.',
          url: 'https://visionmanagers.com/ai-voice',
          serviceType: ['AI Voice Agent', 'Conversation Design', 'Virtual Receptionist', 'Practice Automation'],
        }}
      />

      <div ref={rootRef} data-aesthetic="solar" className="bg-vmCream">

        {/* Opt-in soundscape chooser (shared with the Museum) */}
        <SoundDock />

        {/* ─── Staged hero — the homage to the human voice ─── */}
        <section ref={scrollerRef} className="voice-scroller">
          <div className="voice-sticky">
            <div ref={bgRef} className="voice-bg" aria-hidden>
              {HERO_VIDEO
                ? <video src={HERO_VIDEO} poster={HERO_POSTER} autoPlay muted loop playsInline preload="none" />
                : <div className="voice-poster" />}
              <div className="voice-sunbeam" />
              <div className="voice-scrim" />
            </div>
            <div ref={veilRef} className="voice-veil" aria-hidden />
            <span className="voice-tick voice-tick-bl" aria-hidden />
            <span className="voice-tick voice-tick-br" aria-hidden />

            {/* Stage 1 — the headline, on its own */}
            <div ref={stage1Ref} className="voice-stage">
              <div className="max-w-4xl">
                <span className="eyebrow voice-eyebrow text-vmGold mb-9">Conversation IQ — voice, with taste</span>
                <h1 className="font-serif text-vmNavy" style={{ lineHeight: 1.07, letterSpacing: '-0.01em' }}>
                  <span className="block opacity-90" style={{ fontSize: 'clamp(1.5rem, 4.2vw, 2.8rem)' }}>
                    Everybody’s getting voice AI.
                  </span>
                  <span className="block italic" style={{ fontSize: 'clamp(2.2rem, 6.6vw, 4.9rem)', marginTop: '0.4rem' }}>
                    But{' '}
                    <span className="voice-care">
                      care
                      <svg viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden>
                        <path d="M3 7 C 28 2, 92 2, 117 6" />
                      </svg>
                    </span>{' '}
                    begins when the phone rings.
                  </span>
                </h1>
              </div>
              <div className="voice-cue">There’s a discipline behind it<span className="arrow">↓</span></div>
            </div>

            {/* Stage 2 — the sub-hero + CTA */}
            <div ref={stage2Ref} className="voice-stage" style={{ opacity: 0 }}>
              <div className="max-w-2xl">
                <p className="text-lg md:text-xl font-light leading-relaxed text-vmInk/80">
                  The voice that answers shouldn’t sound like a machine. It should sound like your practice —
                  for most patients, it’s the first time they decide to trust you.
                </p>
                <p className="mt-5 text-xl md:text-2xl text-vmNavy">Designing that is a discipline.</p>
                <p className="mt-3 text-xl md:text-2xl text-vmNavy">
                  We call it <span className="voice-ciq"><span className="word">Conversation</span> <span className="iq">IQ</span></span>.
                </p>
                <div className="mt-10">
                  <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                    Book a call <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── The difference — taste as care ─── */}
        <section className="py-28 md:py-36 bg-vmCream">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="text-center max-w-3xl mx-auto mb-16">
              <span className="eyebrow voice-eyebrow text-vmGold mb-6">The difference</span>
              <h2 className="font-serif text-vmNavy text-3xl md:text-5xl leading-tight">
                A machine can answer the phone.<br />
                Only a designed voice can <span className="italic">receive someone</span>.
              </h2>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <Reveal>
                <p className="eyebrow text-slate-400 mb-4">What everyone ships</p>
                <p className="text-slate-600 leading-relaxed">
                  Most voice AI is built to complete a task — answer, book, end the call. It clears the queue.
                  It doesn’t make anyone feel cared for, and patients can tell the difference in the first
                  three seconds.
                </p>
              </Reveal>
              <Reveal delay={100}>
                <p className="eyebrow text-vmGold mb-4">What we design</p>
                <p className="text-slate-700 leading-relaxed">
                  A voice that knows how a practice like yours greets people — what reassurance sounds like,
                  when to slow down, when to hand off to a human. It still books the appointment. It just
                  earns trust on the way.
                </p>
              </Reveal>
            </div>

            <Reveal className="mt-16 max-w-3xl mx-auto text-center border border-slate-200 rounded-sm bg-white p-8 md:p-12">
              <p className="text-lg md:text-xl text-vmNavy leading-relaxed">
                We call the discipline behind it{' '}
                <span className="voice-ciq"><span className="word">Conversation</span> <span className="iq">IQ</span></span> —
                conversation design and UX research applied to the one interface every patient actually uses.
                It’s the layer above the voice technology. It’s the layer everyone else skips.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── The spectrum of voice ─── */}
        <section className="py-28 md:py-36 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center max-w-3xl mx-auto mb-16">
              <span className="eyebrow voice-eyebrow text-vmGold mb-6">The spectrum of voice</span>
              <h2 className="font-serif text-vmNavy text-3xl md:text-5xl leading-tight">
                Once a voice is designed well, it can do far more than answer.
              </h2>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              {SPECTRUM.map((s, i) => (
                <Reveal key={s.key} delay={i * 90} className="flex flex-col p-8 md:p-10 bg-vmCream/70 border border-slate-100 rounded-sm">
                  <s.Icon className="w-8 h-8 text-vmNavy mb-6" strokeWidth={1.4} aria-hidden />
                  <h3 className="font-serif text-2xl text-vmNavy mb-2">{s.key}</h3>
                  <p className="text-sm text-slate-500 italic mb-6">{s.line}</p>
                  <ul className="space-y-2.5 mt-auto">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <span className="mt-2 w-1 h-1 rounded-full bg-vmGold flex-shrink-0" aria-hidden />
                        {it}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>

            <Reveal className="text-center mt-10">
              <p className="text-sm text-slate-400">Coaching, not therapy — we keep that line clear.</p>
            </Reveal>
          </div>
        </section>

        {/* ─── Doorway into the Museum of Sound ─── */}
        <section className="relative dark-chapter overflow-hidden">
          <img
            src="/images/vm/cathedral-dome.jpg"
            alt=""
            aria-hidden
            className="chapter-img absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1722]/80 via-[#0A1722]/72 to-[#0A1722]/88" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 md:py-36 text-center">
            <Reveal>
              <span className="eyebrow voice-eyebrow text-vmGold mb-6">Why our voices are different</span>
              <h2 className="font-serif text-vmCream text-3xl md:text-5xl leading-tight mb-6">
                We think about the human voice<br />
                <span className="italic text-white">more deeply than anyone selling a bot.</span>
              </h2>
              <p className="text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
                From Gregorian chant to birdsong to the model that now speaks back, we built a small museum
                about where voice comes from — because it’s the medium we design in. The same care goes into
                the voice that answers your phone.
              </p>
              <Link to="/sound" className={buttonTealOnNavy}>
                Step into the Museum of Sound <ChevronRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ─── Proof — the number, the names ─── */}
        <section className="py-28 md:py-36 bg-vmCream">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="text-center mb-14">
              <span className="eyebrow voice-eyebrow text-vmGold mb-6">Proof</span>
              <h2 className="font-serif text-vmNavy text-4xl md:text-5xl leading-tight">
                $4,300 in booked appointments —<br />
                <span className="italic">in two days.</span>
              </h2>
            </Reveal>

            <Reveal className="grid md:grid-cols-2 gap-12 items-center border border-slate-200 rounded-sm bg-white p-8 md:p-14">
              <div>
                <p className="eyebrow text-slate-400 mb-5">Voice AI — Seattle-area optometry practice</p>
                <p className="text-slate-600 leading-relaxed mb-8">
                  Their after-hours calls were going to voicemail — and walking out the door. We mapped where
                  patients were being lost, then deployed a voice concierge that answers every call and books
                  straight into the schedule. Five new appointments in the first week, no staff added.
                </p>
                <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-vmNavy font-semibold hover:text-vmTeal transition-colors text-sm">
                  Find what you’re losing <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[['5', 'Appointments'], ['$4,300+', 'Visit value'], ['2', 'Days live']].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <div className="font-serif text-3xl md:text-4xl text-vmTeal mb-2">{num}</div>
                    <p className="eyebrow text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-12 text-center">
              <p className="eyebrow text-slate-400">
                Trusted to build for <span className="text-vmNavy">Emerald Health</span> ·{' '}
                <span className="text-vmNavy">Nexus Health ID</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── Close ─── */}
        <section className="py-28 md:py-36 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Reveal>
              <span className="eyebrow voice-eyebrow text-vmGold mb-6">The next call</span>
              <h2 className="font-serif text-vmNavy text-4xl md:text-5xl mb-6 italic">
                Let’s make the first voice they hear sound like you.
              </h2>
              <p className="text-lg text-slate-600 mb-3 max-w-2xl mx-auto">
                In 30 minutes we’ll map where calls are slipping, what a designed voice would change, and
                whether we’re the right ones to build it with you.
              </p>
              <p className="text-sm text-slate-400 mb-10">A working session, not a sales pitch.</p>
              <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                Book a call <ChevronRight className="w-4 h-4" />
              </a>
              <p className="mt-8 text-xs text-slate-400">
                Or call directly:{' '}
                <a href="tel:+14254944489" className="text-vmNavy font-semibold hover:text-vmTeal transition-colors">(425) 494-4489</a>
              </p>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIVoice;
