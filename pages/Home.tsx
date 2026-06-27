import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { TESTIMONIALS, BOOKING_URLS } from '../constants';
import {
  Reveal, Eyebrow, LeafMark, VineDivider, LaurelSprig, SectionNumber, Constellation,
  buttonPrimary, buttonSecondary, buttonTealOnNavy,
} from '../components/ornaments';
import {
  ChevronRight, ArrowRight, Telescope, Orbit, Boxes, Target,
  Stethoscope, Rocket, Handshake, GraduationCap, Star,
} from 'lucide-react';

const STEPS = [
  {
    n: '01',
    Icon: Telescope,
    title: 'Find the loss',
    desc: 'We start where it hurts: the missed calls, the dead follow-ups, the revenue leaking in places you never look. Money first — clarity follows.',
  },
  {
    n: '02',
    Icon: Orbit,
    title: 'Map the Cosmos',
    desc: 'We connect your data and relationships — contacts, calls, records — into one living map, so you can finally see how your business actually moves.',
  },
  {
    n: '03',
    Icon: Boxes,
    title: 'Build the system',
    desc: 'Automation, voice agents, workflows that turn the map into motion. And the honest part most won’t tell you: where AI doesn’t belong yet.',
  },
  {
    n: '04',
    Icon: Target,
    title: 'Answer for the result',
    desc: 'It shows up on your P&L, or it doesn’t ship. One person accountable from the first call to the number at the end.',
  },
];

const AUDIENCES = [
  {
    Icon: Stethoscope,
    title: 'Healthcare practices',
    desc: 'Where it’s proven. Recover missed calls, automate the front desk, stay compliant — from single practices to multi-location groups.',
  },
  {
    Icon: Rocket,
    title: 'Founders & operators',
    desc: 'You’re drowning in tools and tabs. I turn the scattered data your business already runs on into systems that compound.',
  },
  {
    Icon: Handshake,
    title: 'Partners & dealmakers',
    desc: 'Relationships are data too. I map networks, surface the connections worth making, and structure the introductions that move deals.',
  },
  {
    Icon: GraduationCap,
    title: 'Teams that want it in-house',
    desc: 'Hands-on training applied to your actual roles — from zero to working output in an afternoon, not a curriculum.',
  },
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Vision Managers — AI That Earns Its Keep"
        description="Vision Managers turns the data and relationships your business is already sitting on into systems that drive real outcomes — AI strategy, automation, and voice, with one person accountable for the result. Proven in healthcare, built for anyone."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Vision Managers',
          url: 'https://visionmanagers.com',
          logo: 'https://storage.googleapis.com/vm-website/web%20images/vm-logo%402x.png',
          description:
            'Vision Managers turns a business’s scattered data and relationships into systems that drive measurable outcomes. AI strategy, automation, voice AI, and training — accountable, results-first. Proven in healthcare, built for anyone.',
          email: 'sukhneet@visionmanagers.com',
          telephone: '+1-425-494-4489',
          areaServed: 'US',
          serviceType: [
            'AI Strategy & Advisory',
            'Data & Relationship Systems',
            'AI Voice Agents',
            'Automation',
            'AI Training',
          ],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'AI & Data Systems',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Strategy & Advisory' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Data & Relationship Mapping Systems' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Voice AI Concierge' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Training' } },
            ],
          },
        }}
      />
      <div className="w-full" data-aesthetic="solar">

        {/* ─── HERO — the Cosmos ─── */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-36 pb-24 cosmos-wash">
          <Constellation />
          <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
            <div className="max-w-3xl">
              <Reveal>
                <Eyebrow className="text-vmTeal mb-8">Vision Managers · AI, owned and accountable</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="font-serif text-vmNavy text-[2.7rem] md:text-[5.2rem] leading-[1.04] mb-8">
                  Your business is sitting on data
                  <br />
                  <span className="italic">that could be running it.</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-10">
                  I find what’s quietly costing you — missed calls, dead follow-ups, data nobody’s
                  connecting — and build the systems that fix it. One person accountable for the
                  strategy, the automation, and the result. Including when <em>not</em> to use AI.
                  Proven in healthcare, built for anyone.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
                  <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                    Book a call
                    <ChevronRight className="w-4 h-4" />
                  </a>
                  <Link to="/solutions" className={buttonSecondary}>
                    See how it works
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-xs text-slate-400">A working session, not a sales pitch. You leave with two concrete next steps.</p>
              </Reveal>

              <Reveal className="mt-16 pt-8 hairline" delay={100}>
                <p className="eyebrow text-slate-400">
                  Trusted by <span className="text-vmNavy">dentists</span> · <span className="text-vmNavy">optometrists</span> ·{' '}
                  <span className="text-vmNavy">clinics</span> · <span className="text-vmNavy">founders</span> ·{' '}
                  <span className="text-vmNavy">operators</span>
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── DARK CHAPTER — the reframe, over the cathedral ─── */}
        <section className="relative dark-chapter overflow-hidden">
          <img
            src="/images/vm/cathedral-dome.jpg"
            alt="The frescoed dome of Santa Maria Maggiore, Rome"
            className="chapter-img absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1722]/85 via-[#0A1722]/70 to-[#0A1722]/92" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 md:py-44 text-center">
            <Reveal>
              <Eyebrow className="text-vmGold mb-8">The shift</Eyebrow>
              <h2 className="font-serif text-3xl md:text-5xl text-vmCream leading-[1.18] mb-10">
                You don’t have an AI problem.
                <br />
                <span className="italic text-white">You have an unconnected-data problem.</span>
              </h2>
              <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
                Every business runs on a hidden network — contacts, calls, records, and the
                relationships between them. Most of it sits in pieces, unseen and unworked. Connect
                those points, the way stars become constellations or neurons become a mind, and the
                picture starts to run itself. That map is what we build. We call it your <span className="text-vmGold italic">Cosmos</span>.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── HOW IT WORKS — the arc ─── */}
        <section className="py-28 bg-vmCream">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-20 max-w-2xl mx-auto">
              <Eyebrow className="text-accent mb-4">How it works</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif text-vmNavy mb-5">From scattered points to a system that runs.</h2>
              <p className="text-slate-500">Four moves, in order. Most engagements start at step one and earn their way to the next.</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 90} className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <SectionNumber n={s.n} />
                    <s.Icon className="w-7 h-7 text-vmTeal" aria-hidden strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-serif text-vmNavy mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PROOF — the number, the names ─── */}
        <section className="py-28 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="text-center mb-14">
              <Eyebrow className="text-accent mb-4">Proof</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif text-vmNavy leading-tight">
                $4,300 in booked appointments —
                <br />
                <span className="italic">in two days.</span>
              </h2>
            </Reveal>

            <Reveal className="grid md:grid-cols-2 gap-12 items-center border border-slate-200 rounded-sm p-8 md:p-14 bg-vmCream/60">
              <div>
                <p className="eyebrow text-slate-400 mb-5">Voice AI — Seattle-area optometry practice</p>
                <p className="text-slate-600 leading-relaxed mb-8">
                  Their after-hours calls were going to voicemail — and walking out the door. We
                  mapped where patients were being lost, then deployed a voice concierge that answers
                  every call and books straight into the schedule. Five new appointments in week one,
                  no staff added.
                </p>
                <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-vmNavy font-semibold hover:text-vmTeal transition-colors text-sm">
                  Find what you’re losing <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[['5', 'Appointments'], ['$4,300+', 'Visit value'], ['2', 'Days live']].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <div className="text-3xl md:text-4xl font-serif text-vmTeal mb-2">{num}</div>
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

        {/* ─── THE PERSON — accountable, real ─── */}
        <section className="py-28 bg-vmCream">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <Reveal className="md:col-span-5">
                <div className="duotone-vm rounded-sm aspect-[4/5] max-w-sm mx-auto md:mx-0 shadow-xl">
                  <img src="/images/vm/sukh-portrait.jpg" alt="Sukhneet, founder of Vision Managers" loading="lazy" />
                </div>
              </Reveal>
              <div className="md:col-span-7">
                <Reveal>
                  <Eyebrow className="text-accent mb-5">One accountable person</Eyebrow>
                  <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-6 leading-snug">
                    Not a vendor. Not a dashboard.
                    <br />
                    <span className="italic">Someone who answers for it.</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    Most AI shows up as another tool nobody owns. I work the other way: I sit on your
                    side of the table, learn how your business actually moves, and stay accountable
                    from the first call to the result. If AI isn’t the answer, I’ll tell you that too.
                  </p>
                  <p className="text-slate-500 leading-relaxed mb-8">
                    It’s the difference between buying software and gaining understanding — control of
                    your own data, and a system you can steer by.
                  </p>
                  <Link to="/about" className={buttonSecondary}>
                    More about how I work <ArrowRight className="w-4 h-4" />
                  </Link>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WHO IT'S FOR — the wider door ─── */}
        <section className="py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-16 max-w-2xl mx-auto">
              <Eyebrow className="text-accent mb-4">Who it’s for</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif text-vmNavy mb-5">If it runs on data and relationships, it can run better.</h2>
              <p className="text-slate-500">Healthcare is where it’s proven. It’s far from where it stops.</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {AUDIENCES.map((a, i) => (
                <Reveal key={a.title} delay={i * 80} className="p-8 bg-vmCream/70 border border-slate-100 rounded-sm flex flex-col">
                  <a.Icon className="w-8 h-8 text-vmNavy mb-6" aria-hidden strokeWidth={1.4} />
                  <h3 className="text-xl font-serif text-vmNavy mb-3">{a.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{a.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="py-28 bg-vmCream">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-16">
              <LaurelSprig className="w-28 mx-auto mb-8 text-accent" />
              <Eyebrow className="text-accent mb-4">In their words</Eyebrow>
              <h2 className="text-4xl font-serif text-vmNavy">From the people who’ve worked with me.</h2>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 100} className="p-10 bg-white rounded-sm border border-slate-100 flex flex-col">
                  <div className="flex gap-1 mb-6" aria-label="5 star review">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-vmTeal text-vmTeal" aria-hidden />
                    ))}
                  </div>
                  <p className="text-slate-700 italic mb-8 leading-relaxed flex-grow">"{t.quote}"</p>
                  <div className="pt-6 hairline">
                    <h5 className="font-semibold text-vmNavy text-sm">{t.name}</h5>
                    <p className="eyebrow text-slate-400 mt-1">{t.title}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CASUAL INTELLIGENCE BAND ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-12 bg-vmNavy rounded-sm">
              <div>
                <Eyebrow className="text-vmMarigold mb-3">Every Wednesday</Eyebrow>
                <h3 className="text-2xl font-serif text-white mb-2">Casual Intelligence</h3>
                <p className="text-white/60 text-sm max-w-md leading-relaxed">
                  A weekly roundtable where operators show how they actually use AI — live builds,
                  real workflows, no sales pitches. Free to attend.
                </p>
              </div>
              <Link to="/casual-intelligence" className={buttonTealOnNavy}>
                Join the roundtable <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-28 cosmos-wash border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Reveal>
              <VineDivider className="mx-auto mb-12 text-accent" />
              <h2 className="text-4xl md:text-5xl font-serif text-vmNavy mb-6 italic">Let’s find what your data could be doing.</h2>
              <p className="text-lg text-slate-600 mb-3 max-w-2xl mx-auto">
                In 30 minutes we’ll map where you’re losing money, what it would take to fix it, and
                whether I’m the right person to build it with you.
              </p>
              <p className="text-sm text-slate-400 mb-12">A working session, not a sales pitch.</p>
              <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                Book your call <ChevronRight className="w-4 h-4" />
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

export default Home;
