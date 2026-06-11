
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { TESTIMONIALS, BOOKING_URLS } from '../constants';
import {
  Reveal, Eyebrow, LaurelSprig, VineDivider, LeafMark,
  buttonPrimary, buttonSecondary, buttonTealOnNavy,
} from '../components/ornaments';
import { ChevronRight, ArrowRight, Mic, GraduationCap, Compass, Star } from 'lucide-react';

/* Hero line art: a column with a vine growing across it —
   durable structure, living growth. Drawn like an engraving. */
const ColumnAndVine: React.FC = () => (
  <svg viewBox="0 0 280 360" className="w-full max-w-sm text-vmNavy" fill="none" stroke="currentColor"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {/* capital */}
    <path className="draw-path" style={{ '--path-len': 220 } as React.CSSProperties} strokeWidth="1.4"
      d="M70 60 H 210 M76 70 H 204 M84 70 C 84 80, 80 86, 72 92 M196 70 C 196 80, 200 86, 208 92" />
    {/* fluted shaft */}
    {[100, 118, 136, 154, 172].map((x, i) => (
      <path key={x} className="draw-path" strokeWidth={i === 2 ? 1.4 : 1}
        style={{ '--path-len': 260, transitionDelay: `${0.15 + i * 0.08}s` } as React.CSSProperties}
        d={`M${x} 74 V 318`} opacity={i === 0 || i === 4 ? 0.9 : 0.45} />
    ))}
    {/* base */}
    <path className="draw-path" style={{ '--path-len': 200, transitionDelay: '0.5s' } as React.CSSProperties} strokeWidth="1.4"
      d="M82 318 H 198 M74 330 H 206 M66 342 H 214" />
    {/* vine */}
    <g className="text-vmLeaf" stroke="currentColor">
      <path className="draw-path" strokeWidth="1.3"
        style={{ '--path-len': 520, transitionDelay: '0.7s' } as React.CSSProperties}
        d="M30 350 C 60 320, 70 290, 96 268 C 130 240, 160 250, 178 222 C 196 196, 184 168, 160 150 C 140 136, 128 116, 134 92 C 138 76, 150 64, 168 58" />
      {[
        [96, 268, -30], [150, 246, 15], [184, 200, 30], [162, 152, -40], [134, 100, -15], [166, 60, 20],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="3.4" ry="8.5" transform={`rotate(${r} ${x} ${y})`}
          className="draw-path" style={{ '--path-len': 42, transitionDelay: `${1.2 + i * 0.12}s` } as React.CSSProperties} />
      ))}
      {/* one blossom — spring */}
      <g transform="translate(178 222)" className="text-vmLeaf">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-6" rx="2.8" ry="5" transform={`rotate(${a})`}
            className="draw-path" style={{ '--path-len': 26, transitionDelay: '1.9s' } as React.CSSProperties} />
        ))}
      </g>
    </g>
  </svg>
);

const Home: React.FC = () => {
  return (
    <>
    <SEO
      title="Fractional Chief AI Officer for Healthcare"
      description="Vision Managers is the fractional Chief AI Officer for healthcare and dental organizations — senior AI leadership that owns strategy, governance, and results for a fraction of an executive hire."
      path="/"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Vision Managers',
        url: 'https://visionmanagers.com',
        logo: 'https://storage.googleapis.com/vm-website/web%20images/vm-logo%402x.png',
        description: 'Fractional Chief AI Officer services for healthcare and dental organizations. AI strategy, governance, voice AI deployment, and AI training.',
        email: 'sukhneet@visionmanagers.com',
        telephone: '+1-425-494-4489',
        areaServed: 'US',
        serviceType: ['Fractional Chief AI Officer', 'AI Strategy Consulting', 'AI Voice Agents', 'AI Training'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'AI Leadership Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fractional Chief AI Officer' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Voice AI Concierge for Healthcare Practices' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Training for Individuals and Organizations' } },
          ],
        },
      }}
    />
    <div className="w-full" data-aesthetic="solar">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden pt-36 pb-24 light-wash">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <Reveal>
                <Eyebrow className="text-accent mb-8">Fractional Chief AI Officer · Healthcare &amp; Dental</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="font-serif text-vmNavy text-[2.75rem] md:text-7xl leading-[1.06] mb-8">
                  AI is everyone's question.
                  <br />
                  <span className="italic">Make it someone's job.</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mb-4">
                  Most practices use AI playfully — and see nothing for it. Vision Managers
                  gives your organization a Chief AI Officer: senior leadership that owns the
                  strategy, the vendor decisions, and the results, for a fraction of an executive hire.
                </p>
                <p className="text-sm text-slate-400 mb-12">
                  Built for healthcare and dental organizations from single practices to multi-location groups.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
                  <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                    Book a 30-minute AI strategy call
                    <ChevronRight className="w-4 h-4" />
                  </a>
                  <Link to="/solutions" className={buttonSecondary}>
                    See how the role works
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-xs text-slate-400">30 minutes. No pitch deck. You leave with two concrete next steps.</p>
              </Reveal>
            </div>
            <Reveal className="md:col-span-5 hidden md:flex justify-center" delay={300}>
              <ColumnAndVine />
            </Reveal>
          </div>

          <Reveal className="mt-20 pt-8 hairline" delay={100}>
            <p className="eyebrow text-slate-400">
              Working with <span className="text-vmNavy">dentists</span> · <span className="text-vmNavy">optometrists</span> · <span className="text-vmNavy">chiropractors</span> · <span className="text-vmNavy">med spas</span> · and other healthcare organizations
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── PROOF: CASE SPOTLIGHT ─── */}
      <section className="py-24 bg-vmNavy relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <Reveal className="text-center mb-12">
            <Eyebrow className="text-vmTeal">Client results</Eyebrow>
          </Reveal>

          <Reveal className="border border-white/10 rounded-sm p-8 md:p-14 bg-white/5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="eyebrow text-white/40 mb-5">Voice AI — Seattle-area optometry practice</p>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-6 leading-snug">
                  $4,300 in booked appointments within <span className="text-vmTeal italic">two days</span> of going live.
                </h3>
                <p className="text-white/60 leading-relaxed mb-8">
                  The practice's after-hours calls had been going to voicemail. We deployed a voice AI
                  concierge that answers every call and books directly into their schedule — five new
                  patient appointments in week one, no staff added.
                </p>
                <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-vmTeal font-semibold hover:underline text-sm">
                  Get results like this <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  ['5', 'Appointments'],
                  ['$4,300+', 'Visit value'],
                  ['2', 'Days live'],
                ].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <div className="text-3xl md:text-4xl font-serif text-vmTeal mb-2">{num}</div>
                    <p className="eyebrow text-white/40">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── THE PROBLEM, NAMED ─── */}
      <section className="py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <LaurelSprig className="w-28 mx-auto mb-10 text-accent" />
            <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-8 leading-snug">
              You're being asked for an AI strategy.
              <br /><span className="italic">Nobody on your team owns one.</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Vendors call weekly. Staff experiment quietly. Compliance questions go unanswered.
              That isn't a technology gap — it's a leadership gap. A fractional Chief AI Officer
              closes it: one accountable person who decides what's worth doing, what's safe,
              and what gets measured.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── THREE WAYS IN ─── */}
      <section className="py-28 bg-vmSlate/40">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <Eyebrow className="text-accent mb-4">What we offer</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-serif text-vmNavy mb-4">Three ways to work with us.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Start where it fits. Most engagements begin with a readiness audit and grow from there.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FAIO — lead offer */}
            <Reveal className="relative p-8 md:p-10 bg-white border-2 border-vmTeal rounded-sm flex flex-col">
              <div className="absolute -top-3 left-8 px-3 py-1 bg-vmTeal text-vmNavy eyebrow rounded-sm">The core offer</div>
              <Compass className="w-8 h-8 text-vmNavy mb-6" aria-hidden />
              <h3 className="text-2xl font-serif text-vmNavy mb-3">Fractional AI Officer</h3>
              <p className="text-sm text-slate-500 mb-4 font-medium">For practices and groups that need AI owned, not dabbled in</p>
              <ul className="space-y-2.5 mb-8 flex-grow">
                {[
                  'AI strategy owned by a named executive',
                  'Vendor selection and governance',
                  'First 90 days: strategy, guardrails, live pilot',
                  'Monthly leadership cadence with your team',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <LeafMark className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/solutions" className={`${buttonPrimary} w-full`}>
                How the role works <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>

            {/* Voice AI */}
            <Reveal delay={100} className="p-8 md:p-10 bg-white border border-slate-200 rounded-sm flex flex-col">
              <Mic className="w-8 h-8 text-vmNavy mb-6" aria-hidden />
              <h3 className="text-2xl font-serif text-vmNavy mb-3">Voice AI Concierge</h3>
              <p className="text-sm text-slate-500 mb-4 font-medium">For practices losing patients to voicemail</p>
              <ul className="space-y-2.5 mb-8 flex-grow">
                {[
                  'Answers every call, 24/7',
                  'Books directly into your schedule',
                  'HIPAA-conscious architecture',
                  'Live in 10–14 days',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <LeafMark className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/ai-voice" className={`${buttonSecondary} w-full`}>
                See how it works <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>

            {/* Training */}
            <Reveal delay={200} className="p-8 md:p-10 bg-white border border-slate-200 rounded-sm flex flex-col">
              <GraduationCap className="w-8 h-8 text-vmNavy mb-6" aria-hidden />
              <h3 className="text-2xl font-serif text-vmNavy mb-3">AI Training</h3>
              <p className="text-sm text-slate-500 mb-4 font-medium">For teams that want capability in-house</p>
              <ul className="space-y-2.5 mb-8 flex-grow">
                {[
                  'Hands-on, applied to your actual roles',
                  'From zero to working output in 3 hours',
                  'Customized to your industry',
                  '1-on-1 or team formats',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <LeafMark className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={`${buttonSecondary} w-full`}>
                Book a session <ArrowRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FIRST 90 DAYS ─── */}
      <section className="py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <Eyebrow className="text-accent mb-4">The first 90 days</Eyebrow>
            <h2 className="text-4xl font-serif text-vmNavy mb-4">You leave with artifacts, not advice.</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                n: '01',
                title: 'AI strategy document',
                desc: 'Where AI earns its keep in your organization — and where it doesn’t. Priorities ranked by return, signed off by your leadership.',
              },
              {
                n: '02',
                title: 'Governance framework',
                desc: 'Who can use what, with which data, under which guardrails. The answer to the compliance questions your vendors can’t give you.',
              },
              {
                n: '03',
                title: 'First pilot, live',
                desc: 'One high-impact workflow deployed and measured — often missed-call recovery, where results show up in days, not quarters.',
              },
            ].map((item, i) => (
              <Reveal key={item.n} delay={i * 100} className="relative pt-8">
                <span className="font-serif text-5xl text-accent/80 leading-none block mb-5" aria-hidden>{item.n}</span>
                <h3 className="text-lg font-semibold text-vmNavy mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="text-center mt-16">
            <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
              Start with a strategy call <ChevronRight className="w-4 h-4" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-28 bg-vmSlate/40">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <Eyebrow className="text-accent mb-4">What people say</Eyebrow>
            <h2 className="text-4xl font-serif text-vmNavy">Trusted by healthcare professionals.</h2>
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
      <section className="py-28 light-wash border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <VineDivider className="mx-auto mb-12 text-accent" />
            <h2 className="text-4xl font-serif text-vmNavy mb-6 italic">Ready to give AI an owner?</h2>
            <p className="text-lg text-slate-600 mb-3 max-w-2xl mx-auto">
              In 30 minutes we'll map where AI can earn its keep in your organization,
              what it would take, and whether the fractional model fits.
            </p>
            <p className="text-sm text-slate-400 mb-12">A working session, not a sales pitch.</p>
            <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
              Book your strategy call <ChevronRight className="w-4 h-4" />
            </a>
            <p className="mt-8 text-xs text-slate-400">
              Or call directly: <a href="tel:+14254944489" className="text-vmNavy font-semibold hover:text-vmTeal transition-colors">(425) 494-4489</a>
            </p>
          </Reveal>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
