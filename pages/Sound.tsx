import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SoundDock from '../components/SoundDock';
import {
  Reveal, ArchFrame, CuspedArch, JaliPattern, LotusMark, ToriiMark,
  ShojiGrid, SakuraBranch, VineDivider, LeafMark, LaurelSprig, Constellation,
} from '../components/ornaments';
import { ArrowRight } from 'lucide-react';

/* The Museum of the Human Voice — v2, the full walk.
   Arc (per the 6/30 reframe): sound → the wild → the voice raised →
   the body → conversation → the language of AI → the invitation.
   Each room wears the aesthetic of its tradition (page-scoped exception
   to one-aesthetic-per-page, Sukh 7/7) — invariants never change, only
   the ornament layer, which IS the museum metaphor.
   Imagery/audio: atmosphere gradients + SVG architecture until assets
   are licensed (SoundDock stays hidden). Copy citations per the brief's
   honesty bar. Brief: 50-Website/redesign-2026/pages/sound.md */

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Layer drifts vertically against scroll — the depth illusion. */
const useParallax = (speed: number) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReduced()) return;
    const el = ref.current;
    if (!el || !el.parentElement) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.parentElement!.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const progress = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0, ${(-progress * speed).toFixed(1)}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);
  return ref;
};

/* Placards rise off the wall — a shallow 3D settle. */
const TiltIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const shown = inView || prefersReduced();
  return (
    <div ref={ref} style={{ perspective: '1200px' }}>
      <div
        style={{
          transform: shown ? 'none' : 'rotateX(9deg) translateY(28px)',
          opacity: shown ? 1 : 0,
          transition: `transform 900ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 900ms ease ${delay}ms`,
          transformOrigin: '50% 100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const darkScrim = 'linear-gradient(180deg, rgba(10,12,16,0.42), rgba(10,12,16,0.72))';
const lightScrim = 'radial-gradient(60% 60% at 50% 45%, rgba(250,246,238,0.72), rgba(250,246,238,0.30))';

type RoomProps = {
  num: string;
  placard: string;
  title: string;
  lede: string;
  anchor?: string;
  cite?: string;
  tone: 'dark' | 'light';
  bg: string;
  accent: string;
  ornament?: React.ReactNode;
  annotation?: string;
  low?: boolean; // Japanese: headline sits lower, space leads
};

const Room: React.FC<RoomProps> = ({ num, placard, title, lede, anchor, cite, tone, bg, accent, ornament, annotation, low }) => {
  const bgRef = useParallax(46);
  const ornRef = useParallax(22);
  const ink = tone === 'dark' ? '#FAF6EE' : '#0B4C83';
  const body = tone === 'dark' ? 'rgba(250,246,238,0.85)' : 'rgba(11,58,99,0.82)';
  const quiet = tone === 'dark' ? 'rgba(250,246,238,0.58)' : 'rgba(11,58,99,0.58)';
  return (
    <section className="museum-band" style={{ minHeight: '100vh' }}>
      <div ref={bgRef} className="museum-bg" aria-hidden style={{ background: bg, top: '-8%', bottom: '-8%' }} />
      <div className="museum-scrim" aria-hidden style={{ background: tone === 'dark' ? darkScrim : lightScrim }} />
      {ornament && (
        <div ref={ornRef} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          {ornament}
        </div>
      )}
      <span
        aria-hidden
        className="absolute font-serif select-none pointer-events-none"
        style={{
          fontSize: 'clamp(9rem, 26vw, 22rem)', lineHeight: 1,
          color: accent, opacity: tone === 'dark' ? 0.09 : 0.07,
          top: '4%', left: '3%',
        }}
      >
        {num}
      </span>
      <div className={`museum-inner relative ${low ? 'md:mt-[18vh]' : ''}`} style={{ maxWidth: '46rem' }}>
        <TiltIn>
          <p className="museum-placard" style={{ color: accent }}>{placard}</p>
          <h2
            className="font-serif mt-6 mb-7 italic"
            style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.4rem)', lineHeight: 1.12, color: ink }}
          >
            {title}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: body }}>{lede}</p>
          {anchor && (
            <p className="mt-6 text-sm leading-relaxed max-w-xl mx-auto" style={{ color: quiet }}>
              {anchor}{cite && <span className="italic"> — {cite}</span>}
            </p>
          )}
        </TiltIn>
        {annotation && (
          <span
            aria-hidden
            className="hidden md:block absolute top-6 -right-14 text-[11px] uppercase"
            style={{ writingMode: 'vertical-rl', letterSpacing: '0.35em', color: accent, opacity: 0.75 }}
          >
            {annotation}
          </span>
        )}
      </div>
    </section>
  );
};

const Sound: React.FC = () => {
  return (
    <>
      <SEO
        title="The Museum of the Human Voice"
        description="A walk through the oldest technology we have — from cave resonance and birdsong through chant, qawwali, and cantillation, to the science of why a voice moves us, and the language of AI. An exhibition by Vision Managers."
        path="/sound"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'The Museum of the Human Voice',
          isPartOf: { '@type': 'WebSite', name: 'Vision Managers', url: 'https://visionmanagers.com' },
          about: 'The history, science, and future of the human voice — sound, animal song, sacred vocal traditions, the neuroscience of voice, conversation, and synthetic speech.',
          url: 'https://visionmanagers.com/sound',
        }}
      />

      <div data-aesthetic="solar" className="bg-vmCream">
        <SoundDock />

        {/* ─── FRONT DOOR ─── */}
        <section className="museum-band" style={{ minHeight: '100vh' }}>
          <div className="museum-bg voice-poster" aria-hidden />
          <div className="museum-scrim" aria-hidden style={{ background: 'radial-gradient(58% 56% at 50% 42%, rgba(250,246,238,0.84), rgba(250,246,238,0.44))' }} />
          <Reveal className="museum-inner">
            <span className="eyebrow voice-eyebrow text-vmGold mb-7">An exhibition by Vision Managers</span>
            <h1 className="font-serif text-vmNavy" style={{ fontSize: 'clamp(2.4rem, 7vw, 5rem)', lineHeight: 1.05 }}>
              The Museum of the<br />
              <span className="italic">Human Voice</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl font-light text-vmInk/80 max-w-2xl mx-auto leading-relaxed">
              Every culture that ever lived sang to what it held sacred. Long before the voice
              answered a phone, it was how we reached the divine, bound ourselves into one body,
              and became human. A short walk through the oldest technology we have.
            </p>
            <p className="mt-5 text-sm text-vmInk/50 max-w-xl mx-auto">
              Music exists in every known human society — Mehr, Singh et&nbsp;al., <span className="italic">Science</span>, 2019.
            </p>
            <p className="mt-9 voice-cue" style={{ position: 'static' }}>
              Begin the walk<span className="arrow" style={{ display: 'inline-block', marginLeft: '0.4rem' }}>↓</span>
            </p>
          </Reveal>
        </section>

        {/* ─── I · ORIGINS — ochre dawn ─── */}
        <Room
          num="I"
          placard="I · The body · before language · ~40,000 years"
          title="The first instrument was the one we were born holding."
          lede="Before flutes, before drums: breath, a throat, and a dark cave. In the painted caves, most of the images cluster at the most acoustically resonant points — as if the voice chose the walls."
          anchor="Roughly 80–90% of cave images sit where the resonance is strongest. An inference from acoustics, not proof of singing — and we say so."
          cite="Reznikoff"
          tone="dark"
          accent="#C9A24B"
          bg="radial-gradient(70% 60% at 50% 88%, rgba(196,101,74,0.55), transparent 62%), radial-gradient(55% 45% at 50% 10%, rgba(232,163,61,0.28), transparent 60%), linear-gradient(175deg, #17100a, #0c0906)"
        />

        {/* ─── II · THE WILD — solarpunk, the inherited voice ─── */}
        <Room
          num="II"
          placard="II · Birdsong · whale song · the inherited voice"
          title="The voice is older than us. We only inherited it."
          lede="Six minutes of birdsong measurably lowered anxiety in a randomized study — a short-term effect, honestly reported. And whale song, we learned only recently, carries the same statistical structure that is a hallmark of human language."
          anchor="Structure and awe only: there is no evidence whale song affects human stress. The wonder doesn't need inflating."
          cite="Stobbe, 2022 · Science, 2025"
          tone="light"
          accent="#7FB069"
          bg="radial-gradient(60% 70% at 28% 24%, rgba(127,176,105,0.5), transparent 62%), radial-gradient(64% 74% at 78% 82%, rgba(11,76,131,0.22), transparent 62%), linear-gradient(165deg, #edf4e9, #dce9e6)"
          ornament={
            <>
              <LeafMark className="absolute w-40 h-40 text-vmLeaf" style={{ top: '12%', right: '8%', opacity: 0.16 } as React.CSSProperties} />
              <VineDivider className="absolute w-[46rem] max-w-none text-vmLeaf" style={{ bottom: '10%', left: '-6%', opacity: 0.22 } as React.CSSProperties} />
            </>
          }
        />

        {/* ─── III · SUNG STONE — Roman ─── */}
        <Room
          num="III"
          placard="III · Gregorian chant · stone · reverberation"
          title="They didn't build a room for the voice. They built the voice a body."
          lede="Hagia Sophia holds a sound for roughly ten seconds. The chamber “functions as a musical instrument” — a single chanter becomes “a form of polyphony emerging from the synergy of the singer's output and the resonant return of the chamber.”"
          cite="Pentcheva & Abel, Speculum, 2017"
          tone="dark"
          accent="#C4654A"
          bg="radial-gradient(58% 52% at 50% 0%, rgba(196,101,74,0.4), transparent 58%), linear-gradient(180deg, #141013, #0b0a10)"
          ornament={
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[52rem] max-w-none text-vmTerracotta" style={{ opacity: 0.16 }}>
              <ArchFrame><div style={{ height: '30rem' }} /></ArchFrame>
            </div>
          }
        />

        {/* ─── IV · THE CALL — Indic, raised word ─── */}
        <Room
          num="IV"
          placard="IV · Adhan · tajwid · the raised word"
          title="The holiest words are never just said. They are raised."
          lede="Five times a day, across continents, the call to prayer is not read but recited — tilāwa — the heightening itself marking the words as sacred. Sound as the core of devotion, not its background."
          tone="dark"
          accent="#E8A33D"
          bg="radial-gradient(56% 50% at 50% 12%, rgba(232,163,61,0.5), transparent 60%), linear-gradient(180deg, #191106, #0d0a05)"
          ornament={
            <div className="absolute left-1/2 top-[16%] -translate-x-1/2 w-[40rem] max-w-none text-vmMarigold" style={{ opacity: 0.2 }}>
              <CuspedArch />
            </div>
          }
        />

        {/* ─── V · THE LONGING — Indic, candlelit ─── */}
        <Room
          num="V"
          placard="V · Qawwali · the mehfil · the ghazal"
          title="A single held note can carry centuries of longing."
          lede="In the candlelit mehfil, qawwali builds toward wajd — ecstasy carried entirely by voices in call and response. The ghazal gives yearning a form. The voice gives it a body."
          tone="dark"
          accent="#E8A33D"
          bg="radial-gradient(60% 70% at 50% 22%, rgba(232,163,61,0.5), transparent 60%), radial-gradient(72% 80% at 50% 104%, rgba(122,30,42,0.55), transparent 66%), linear-gradient(165deg, #1c0f10, #0c0808)"
          ornament={
            <div className="absolute inset-0 text-vmMarigold">
              <JaliPattern opacity={0.1} />
            </div>
          }
        />

        {/* ─── VI · THE SYLLABLE — Indic, radiant dawn ─── */}
        <Room
          num="VI"
          placard="VI · Vedic chant · Om · three thousand years"
          title="Some traditions believe the world began as a sound — and is still being spoken."
          lede="Vedic chant has been carried mouth to mouth with extraordinary fidelity for more than three millennia — because in this tradition, the correct sound is itself sacred."
          cite="UNESCO Masterpiece of Oral Heritage, 2008"
          tone="light"
          accent="#E8A33D"
          bg="radial-gradient(58% 54% at 50% 20%, rgba(232,163,61,0.42), transparent 62%), radial-gradient(80% 60% at 50% 100%, rgba(201,162,75,0.25), transparent 60%), linear-gradient(170deg, #fbf3e2, #f2e6cc)"
          ornament={
            <LotusMark className="absolute left-1/2 -translate-x-1/2 bottom-[8%] w-56 h-56 text-vmMarigold" style={{ opacity: 0.2 } as React.CSSProperties} />
          }
        />

        {/* ─── VII · THE SCROLL — parchment, inscription ─── */}
        <Room
          num="VII"
          placard="VII · Torah cantillation · te'amim"
          title="“Sacred texts are to be sung; only profane texts are spoken.”"
          lede="The te'amim — small marks above and below the letters — fix speech into melody, so the reading can never flatten into the everyday. The tune is the boundary between sacred and ordinary."
          tone="light"
          accent="#C4654A"
          bg="radial-gradient(70% 55% at 50% 30%, rgba(250,246,238,0.9), transparent 70%), linear-gradient(170deg, #f6efdd, #e9dfc6)"
          ornament={
            <>
              <div className="absolute left-[12%] right-[12%] top-[14%]" style={{ borderTop: '1px solid rgba(196,101,74,0.35)', boxShadow: '0 4px 0 rgba(196,101,74,0.25)' }} />
              <div className="absolute left-[12%] right-[12%] bottom-[14%]" style={{ borderTop: '1px solid rgba(196,101,74,0.35)', boxShadow: '0 4px 0 rgba(196,101,74,0.25)' }} />
            </>
          }
        />

        {/* ─── VIII · THE BREATH — Japanese, ma ─── */}
        <Room
          num="VIII"
          placard="VIII · Shakuhachi · suizen · blowing zen"
          title="Enlightenment, they taught, in a single note."
          lede="The komusō — the monks of emptiness — did not call the flute music. Blowing it was the practice itself: ichion jōbutsu, awakening in one sound. The pause around the note mattered as much as the note."
          tone="light"
          accent="#F4B8C1"
          annotation="one sound · ichion jōbutsu"
          low
          bg="radial-gradient(56% 60% at 70% 20%, rgba(244,184,193,0.22), transparent 60%), linear-gradient(170deg, #f7f8f6, #e8ecea)"
          ornament={
            <>
              <div className="absolute right-[6%] top-[8%] w-72 h-72 text-vmNavy" style={{ opacity: 0.5 }}>
                <ShojiGrid opacity={0.08} />
              </div>
              <SakuraBranch className="absolute -left-8 bottom-[12%] w-96 max-w-none text-vmNavy" style={{ opacity: 0.25 } as React.CSSProperties} />
              <ToriiMark className="absolute left-[10%] top-[12%] w-10 h-10 text-vmSakura" style={{ opacity: 0.8 } as React.CSSProperties} />
            </>
          }
        />

        {/* ─── IX · THE DRUM & THE LAND — earth, vast ─── */}
        <Room
          num="IX"
          placard="IX · Talking drums · griots · songlines"
          title="Some peoples drummed their language. Others sang the land into being."
          lede="West African talking drums reproduce the pitch of speech closely enough to carry messages between villages. Griots hold centuries in trained memory. And Aboriginal songlines teach that the ancestors sang the landscape into existence — and that it must be kept sung to stay alive."
          tone="dark"
          accent="#C9A24B"
          bg="radial-gradient(90% 50% at 50% 100%, rgba(196,101,74,0.5), transparent 64%), radial-gradient(60% 40% at 50% 0%, rgba(201,162,75,0.25), transparent 58%), linear-gradient(180deg, #120d08, #0a0705)"
        />

        {/* ─── INTERLUDE · THE BODY — the science, catalog register ─── */}
        <section className="py-28 md:py-40 px-6 bg-vmCream">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <LaurelSprig className="w-28 mx-auto mb-8 text-vmGold" />
              <span className="eyebrow voice-eyebrow text-vmGold mb-6">Interlude · The body</span>
              <h2 className="font-serif text-vmNavy text-3xl md:text-5xl mb-8 italic leading-tight">
                Why does a voice do this to us?
              </h2>
              <p className="text-lg text-vmInk/80 leading-relaxed">
                Because the brain is built for it. We carry dedicated <em>voice areas</em> that answer
                to the human voice over almost any other sound. We read a stranger's trustworthiness
                in under half a second — before they finish saying <em>hello</em>. The same words,
                spoken instead of read, make a person seem more thoughtful, more present. And chant
                entrains the breath to about six breaths a minute — the rhythm of a body calming itself.
              </p>
              <p className="mt-8 font-serif text-2xl text-vmNavy italic">
                The voice is the clearest signal we have that there is a mind —
                a <span className="not-italic font-semibold">someone</span> — on the other end.
              </p>
              <p className="mt-8 text-sm text-vmInk/50">
                Belin, 2000 · McAleer, 2014 · Schroeder &amp; Epley, 2015 · Bernardi, 2001
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── CONVERSATION — the pattern in every room ─── */}
        <section className="py-28 md:py-40 px-6" style={{ background: 'linear-gradient(180deg, #FAF6EE 0%, #eef2f5 60%, #dfe7ee 100%)' }}>
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <span className="eyebrow voice-eyebrow text-vmNavy/60 mb-6">The pattern in every room</span>
              <h2 className="font-serif text-vmNavy text-3xl md:text-5xl mb-8 italic leading-tight">
                Every tradition in this museum is a conversation.
              </h2>
              <p className="text-lg text-vmInk/80 leading-relaxed">
                Call and response. The muezzin and the city. The chanter and the stone. The drum and
                the far village. The birds at first light. None of it is one voice alone — it is
                timing, turn-taking, presence. Humans trade conversational turns in about
                200&nbsp;milliseconds, faster than conscious thought. Conversation is the oldest
                design discipline we have, and nature wrote its first patterns.
              </p>
              <p className="mt-8 text-lg text-vmInk/80 leading-relaxed">
                What we learn from the natural world — from every room in this museum — shapes how
                conversations, including the newest ones, should be designed.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── THE LANGUAGE OF AI — cosmos room ─── */}
        <section className="museum-band" style={{ minHeight: '100vh', background: '#0A1722' }}>
          <div className="absolute inset-0 pointer-events-none" aria-hidden style={{ opacity: 0.55 }}>
            <Constellation />
          </div>
          <div className="museum-scrim" aria-hidden style={{ background: 'linear-gradient(180deg, rgba(10,23,34,0.2), rgba(10,23,34,0.6))' }} />
          <div className="museum-inner relative" style={{ maxWidth: '46rem' }}>
            <TiltIn>
              <p className="museum-placard" style={{ color: '#00E5D1' }}>The newest room · 1791 → now</p>
              <h2 className="font-serif mt-6 mb-7 italic text-vmSlate" style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.4rem)', lineHeight: 1.12 }}>
                For ten thousand years we shaped the voice. Then we started building it.
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(248,250,252,0.85)' }}>
                From a leather-and-bellows speaking machine in 1791, to a voice played like an organ
                at the 1939 World's Fair, to voices grown from neural networks — synthetic speech is
                the newest movement in a very old line. And when a built voice feels hollow, the
                research points somewhere specific: not <em>machine-ness</em>, but a beat too slow to
                answer, flat where it should rise. Timing and mismatch. Design, not destiny.
              </p>
              <p className="mt-7 font-serif text-xl md:text-2xl italic" style={{ color: '#00E5D1' }}>
                The voice has always been trusted because it signalled a real, present, caring mind.
                That sets the responsibility for everything built with it: convey genuine care.
                Never counterfeit it.
              </p>
              <p className="mt-7 text-sm" style={{ color: 'rgba(248,250,252,0.5)' }}>
                von Kempelen, 1791 · the Voder, Bell Labs, 1939 · human turn-taking ≈200ms vs typical machine 700–1,000ms
              </p>
            </TiltIn>
          </div>
        </section>

        {/* ─── EXIT · THE INVITATION — solarpunk morning ─── */}
        <section className="py-28 md:py-36 px-6 light-wash">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <VineDivider className="mx-auto mb-10 text-vmLeaf" />
              <span className="eyebrow voice-eyebrow text-vmLeaf mb-6">Walk out into the morning</span>
              <h2 className="font-serif text-vmNavy text-4xl md:text-5xl mb-7 italic leading-tight">
                More life, a better future.
              </h2>
              <p className="text-lg text-vmInk/75 leading-relaxed max-w-2xl mx-auto mb-12">
                That's the thesis — of this museum, and of the people who built it. The tools are
                new; the project is ancient: take the voice, and everything we keep learning about
                it, and use it to make life larger. If that's a conversation you want to be in,
                there are two doors.
              </p>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <Reveal delay={100}>
                <Link to="/ci" className="block h-full p-8 bg-white/80 border border-slate-200 rounded-sm hover:border-vmLeaf/70 transition-colors">
                  <h3 className="font-serif text-xl text-vmNavy mb-3">Join the conversation</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Casual Intelligence — a weekly room where owners and builders talk AI in plain
                    English. Free, Wednesdays, genuinely useful.
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-vmNavy">
                    See upcoming sessions <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </Reveal>
              <Reveal delay={180}>
                <Link to="/contact" className="block h-full p-8 bg-white/80 border border-slate-200 rounded-sm hover:border-vmLeaf/70 transition-colors">
                  <h3 className="font-serif text-xl text-vmNavy mb-3">Get in touch</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Talk sound, the evolution of AI, or how humans, nature, and technology grow
                    together. No agenda needed — those are our favorite conversations.
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-vmNavy">
                    Say hello <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </Reveal>
            </div>
            <Reveal delay={260}>
              <p className="mt-10 text-sm text-slate-400">
                Curious how we design conversations for a living?{' '}
                <Link to="/ai-voice" className="underline underline-offset-4 decoration-vmLeaf/60 text-slate-500 hover:text-vmNavy transition-colors">
                  That story lives here
                </Link>.
              </p>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
};

export default Sound;
