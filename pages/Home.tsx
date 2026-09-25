import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { TESTIMONIALS, BOOKING_URLS } from '../constants';
import {
  Reveal, Eyebrow, LeafMark, VineDivider, LaurelSprig, SectionNumber, Constellation,
  buttonPrimary, buttonSecondary, buttonTealOnNavy,
} from '../components/ornaments';
import {
  ChevronRight, ArrowRight, ArrowUpRight,
  Stethoscope, Hammer, Handshake, Star,
} from 'lucide-react';

/* 60–90s founder story video (hook → authority → optometry story → the 12 leaks
   → CTA → risk reversal). Set to e.g. '/videos/hero-story.mp4' once recorded —
   the poster ships first so the layout doesn't wait on the asset, and no play
   affordance renders until there is something to play. */
const HERO_STORY_VIDEO = '';

const HeroPoster: React.FC<{ className?: string }> = ({ className = '' }) => (
  <figure className={className}>
    {HERO_STORY_VIDEO ? (
      <div className="rounded-sm overflow-hidden shadow-xl aspect-[4/5]">
        <video
          src={HERO_STORY_VIDEO}
          poster="/images/vm/sukh-portrait.jpg"
          autoPlay
          muted
          loop
          playsInline
          controls
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div className="duotone-vm rounded-sm aspect-[4/5] shadow-xl">
        <img src="/images/vm/sukh-portrait.jpg" alt="Sukhneet Virk, founder of Vision Managers" loading="eager" />
      </div>
    )}
    <figcaption className="mt-3 text-xs text-slate-500 leading-snug">
      Sukhneet Virk — the one person accountable for the result.
    </figcaption>
  </figure>
);

/* Each step carries a plate from the age of scientific illustration — observe,
   map, construct, record. Ornament, not illustration: they're cropped to
   medallions and pulled into navy so they read as a set. Public domain (Met). */
const STEPS = [
  {
    n: '01',
    title: 'Find the loss',
    desc: 'We start where it hurts: the missed calls, the dead follow-ups, the revenue leaking in places you never look. Money first — clarity follows.',
    plate: '/images/art/plate-birds.webp',
    plateAlt: 'Detail from George Edwards, A Natural History of Uncommon Birds, 1743–51',
  },
  {
    n: '02',
    title: 'Map the business',
    desc: 'We connect your data and relationships — contacts, calls, records — into one living map, so you can finally see how your business actually moves.',
    plate: '/images/art/plate-polyhedra.webp',
    plateAlt: 'Detail from Jost Amman, Perspectiva Corporum Regularium, 1568',
  },
  {
    n: '03',
    title: 'Build the system',
    desc: 'Automation, voice agents, workflows that turn the map into motion. And the honest part most won’t tell you: where AI doesn’t belong yet.',
    plate: '/images/art/plate-proportion.webp',
    plateAlt: 'Detail from Albrecht Dürer, De vrbibvs, 1535',
  },
  {
    n: '04',
    title: 'Answer for the result',
    desc: 'It shows up on your P&L, or it doesn’t ship. One person accountable from the first call to the number at the end.',
    plate: '/images/art/plate-tulip.webp',
    plateAlt: 'Detail from Barbara Regina Dietzsch, a tulip with moth and beetle, c. 1750–60',
  },
];

/* Capabilities are SHOWN, never led with (offer-ladder positioning, rev. 2026-09-10).
   Voice sits among the others deliberately: it's a strong capability and a poor
   front door — commoditized, and not the work worth being hired for. */
const BUILDS = [
  {
    title: 'Data and reporting systems',
    desc: 'The numbers assembled once, automatically, instead of rebuilt by hand every month. One team lead was losing one to two full days a month to that.',
  },
  {
    title: 'Automation for the repetitive work',
    desc: 'Measurements in, formatted bids out — in your layout, not a generic one. Intake, qualification, CRM updates, the follow-up that never happens.',
  },
  {
    title: 'Knowledge out of people’s heads',
    desc: 'The SOPs, the training, the answers that currently live in one person and walk out when they do. Turned into something the whole team can ask.',
  },
  {
    title: 'Marketing that converts what you already get',
    desc: 'Most sites lose the visitor before the form. Fixing the buying journey usually beats buying more traffic — and it’s cheaper.',
  },
  {
    title: 'Voice agents that answer and book',
    desc: 'Every call answered, every hour, in your language — with the compliance posture healthcare demands. Whether it’s your first fix or your fifth is what the audit decides.',
  },
  {
    title: 'Vendor and spend audits',
    desc: 'What you’re paying for phones, connectivity and services, re-quoted through my supplier lanes. The audit is free — the supplier pays me — and any setup costs are quoted up front.',
  },
];

/* Renders the vault ladder (offer-ladder.md + pricing-rules.md v1.3).
   Rule 8: the website renders prices, it never defines them. */
const LADDER = [
  { price: 'Free', name: 'The Leak Audit', desc: 'Twelve leaks, your numbers, on your own.', to: '/leak-audit' },
  { price: 'Free', name: 'Vendor & spend audit', desc: 'I re-quote what you already pay — my fee comes from the supplier. Setup costs, if any, quoted up front.', to: '/solutions' },
  { price: '$500', name: 'AI Quick-Start', desc: 'One week. Dollar math, and one fix already live.', to: '/solutions' },
  { price: '$7,500', name: 'Expansion OS', desc: 'Six months, eight seats. You build two systems with me.', to: '/expansion-os' },
  { price: '$5,000/mo', name: 'Strategic AI Partner', desc: 'A weekly seat and a named roadmap. The whole picture.', to: '/partner' },
];

/* Three lanes, each in that owner's language, each pointing at the leak they
   already feel. Replaces the flat industry list — the generic list is what made
   a GC reading cold ask "what's your trade?" twice (Justin brief, 9/13).
   Rule for these cards: no I-led sentences. */
const LANES = [
  {
    Icon: Hammer,
    title: 'Trades & home services',
    lines: [
      'Measurements in, formatted bids out — in your layout, not a generic one.',
      'The call that rings Friday at 6pm sits until Monday — and the job goes to whoever answered.',
    ],
    to: '/bid-bot',
    label: 'See the bid bot',
  },
  {
    Icon: Stethoscope,
    title: 'Clinics & practices',
    lines: [
      'After-hours calls go to voicemail — and the patient books with the next practice on the list.',
      'Every call answered, with the compliance posture healthcare demands: $4,300 of appointments booked within days for one practice, no staff added.',
    ],
    to: '/ai-voice',
    label: 'See the practice fixes',
  },
  {
    Icon: Handshake,
    title: 'Recruiting, agencies & professional services',
    lines: [
      'Follow-up that never happens. Reporting rebuilt by hand every month.',
      'The process that lives in one person’s head — and walks out the door when they do.',
    ],
    to: '/leak-audit',
    label: 'Run your numbers',
  },
];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Vision Managers — Find What Your Business Is Leaking"
        description="Most businesses are leaking $100K+ a year — missed calls, follow-up that never happens, work still done by hand, knowledge trapped in one person's head. There are 12 places to check; most owners can name 2. See yours in your own numbers — free, no email needed."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Vision Managers',
          url: 'https://visionmanagers.com',
          logo: 'https://storage.googleapis.com/vm-website/web%20images/vm-logo%402x.png',
          description:
            'Vision Managers finds where a business is losing money and hours — missed demand, manual work, knowledge trapped in one person’s head — and builds the systems that close the gap. Strategy, data systems, automation, training and voice, with one person accountable for the result.',
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
          {/* Hubert Robert's arch, read the right way round: nobody in the
              painting is looking at it. They're getting on with their evening,
              held up by something they never have to think about. Deliberately
              NOT "the system dwarfs the people" — in an AI context that reads
              as the machine being bigger than you, which is the fear, not the
              pitch. Masked into the ground so it's depth, not a picture. */}
          <figure className="hero-art hidden lg:block">
            <img
              src="/images/art/roman-arch.webp"
              alt="Hubert Robert, The Return of the Cattle, about 1773 — warm evening light through a great stone arch, with people and their cattle settling in for the evening beneath it."
              loading="eager"
            />
            <figcaption className="hero-art-caption">
              <span className="placard-title">The Return of the Cattle</span> · Hubert Robert,
              c. 1773 — someone built the arch. Centuries on, people still live their evenings
              beneath it without once thinking about it. The best systems end up invisible.
            </figcaption>
          </figure>
          <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
            <div className="lg:flex lg:items-center lg:gap-16">
            <div className="max-w-3xl">
              <Reveal>
                <Eyebrow className="text-vmTeal mb-8">Vision Managers · systems that pay for themselves</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                {/* "Most businesses", not "your business" (Sukh ruling 9/14): a claim
                    about THE reader gets judged instantly — a "no" verdict opens with
                    distrust. Population-level reads as true+surprising and makes them
                    curious about their own number. $100K+ derivation: numbers-ledger.md. */}
                <h1 className="font-serif text-vmNavy text-[2.6rem] md:text-[4.5rem] leading-[1.05] mb-8 text-balance">
                  Most businesses are leaking $100K+ a year.
                  <br />
                  <span className="italic text-[0.66em] leading-tight inline-block mt-4">
                    I find the leaks, then build the systems that close them.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                {/* The self-identification paragraph: names their problem so specifically
                    they recognize themselves (Sukh ruling 9/14 — this beats a category
                    statement; Justin was self-identifying line by line as he read). */}
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-10">
                  The money goes out through missed calls, follow-up that never happens, work still
                  done by hand, and knowledge trapped in one person’s head. There are 12 places to
                  check — most owners can name 2. AI is how the fix gets built.{' '}
                  <em>It isn’t the point.</em>
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
                  <Link to="/leak-audit" className={buttonPrimary}>
                    Find your leaks
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
                    Book a call
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                {/* Risk reversal lives beside the primary CTA, not buried in step 04 */}
                <p className="text-xs text-slate-500">
                  12 leaks, your numbers, no email required. And if we build: it shows up on your
                  P&amp;L, or it doesn’t ship.
                </p>
              </Reveal>
            </div>
            {/* Poster removed 9/14 (Sukh: the arch artwork holds the space until the
                60–90s video exists). To wire the video in: set HERO_STORY_VIDEO and
                render <HeroPoster className="hidden lg:block w-72 shrink-0" /> here
                plus a lg:hidden instance above the CTAs. */}
            </div>
          </div>
        </section>

        {/* ─── PROOF — the names, the pointer ─── */}
        <section className="py-28 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="text-center mb-14">
              <Eyebrow className="text-accent mb-4">Proof</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif text-vmNavy leading-tight">
                Built for Emerald Health —
                <br />
                <span className="italic">and the practices whose phones we answer.</span>
              </h2>
            </Reveal>

            <Reveal className="max-w-2xl mx-auto text-center">
              {/* $4,300 is a WIN with internal records behind it — use the number
                  (numbers-ledger.md). Nexus removed sitewide per Sukh 9/14. */}
              <p className="text-slate-600 leading-relaxed mb-8">
                When a Bellevue-area eye care practice was losing after-hours calls to voicemail,
                we mapped where patients were being lost and deployed a voice agent that books
                straight into the schedule — <strong className="text-vmNavy">$4,300 of booked
                appointments within days of going live</strong>, no staff added. Since January it
                has answered <strong className="text-vmNavy">752 calls</strong> the front desk would
                otherwise have missed.
              </p>
              {/* The written case study exists on /lab as of 9/25 — link to it, not to
                  the sales page. The practice stays unnamed (Suk 9/25). */}
              <Link to="/lab#case-studies"
                className="inline-flex items-center gap-2 text-vmNavy font-semibold hover:text-vmTeal transition-colors text-sm">
                Read the voice-agent case study <ArrowRight className="w-4 h-4" />
              </Link>
              {/* Second proof, trades lane. Every figure here is in numbers-ledger.md;
                  permission GRANTED on the recording (proof-library §A/§B, 9/17). The
                  time-saved number is deliberately absent — not collected yet. */}
              <p className="text-slate-600 leading-relaxed mt-10 mb-8">
                And when an Eastside roofing contractor was typing every bid by hand — ten to
                fifteen minutes for a roof, up to an hour for the complicated ones — we read all
                745 of his bids and rebuilt his estimating inside his own ChatGPT.{' '}
                <strong className="text-vmNavy">His first bid came out in the walkthrough</strong>,
                in his own format, off his own rates.
              </p>
              <Link to="/lab#case-studies"
                className="inline-flex items-center gap-2 text-vmNavy font-semibold hover:text-vmTeal transition-colors text-sm">
                Read the bid-writer case study <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ─── WHAT GETS BUILT — capability, shown not led with ─── */}
        <section className="py-24 bg-vmCream">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="max-w-2xl mb-16">
              <Eyebrow className="text-accent mb-4">What actually gets built</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-5 leading-snug">
                The six systems I build most.
              </h2>
              <p className="text-slate-500">
                Which of these you need is what the audit decides. Most owners guess wrong about
                their own list — it’s almost never the thing they came in asking for.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-11">
              {BUILDS.map((b, i) => (
                <Reveal key={b.title} delay={(i % 3) * 80}>
                  <LeafMark className="w-5 h-5 text-accent mb-4" />
                  <h3 className="text-lg font-serif text-vmNavy mb-3 leading-snug">{b.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
                </Reveal>
              ))}
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
                relationships between them. Most of it sits in pieces, unseen and unworked.
                Connected into one map, it shows you where the money is leaking and what to fix
                first. That map is what we build.
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
                    <span className="art-medallion">
                      <img src={s.plate} alt={s.plateAlt} loading="lazy" />
                    </span>
                    <SectionNumber n={s.n} />
                  </div>
                  <h3 className="text-xl font-serif text-vmNavy mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16 text-center">
              <Link to="/leak-audit"
                className="inline-flex items-center gap-2 text-vmNavy font-semibold hover:text-vmTeal transition-colors text-sm">
                Step one, on your own: the twelve-leak audit <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-slate-500 mt-3">
                The questions and the math for each. Use your numbers, round down, total it.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── WHO IT'S FOR — the wider door, on a Morris ground ─── */}
        <section
          className="py-28 bg-white art-ground"
          style={{ '--art-ground-img': "url('/images/art/windrush.webp')" } as React.CSSProperties}
        >
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-16 max-w-2xl mx-auto">
              <Eyebrow className="text-accent mb-4">Who it’s for</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-serif text-vmNavy mb-5">Which one is you?</h2>
              <p className="text-slate-500">Three kinds of businesses, the same 12 leaks — yours just leak in a different order.</p>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {LANES.map((lane, i) => (
                <Reveal key={lane.title} delay={i * 80} className="p-8 bg-vmCream/70 border border-slate-100 rounded-sm flex flex-col">
                  <lane.Icon className="w-8 h-8 text-vmNavy mb-6" aria-hidden strokeWidth={1.4} />
                  <h3 className="text-xl font-serif text-vmNavy mb-4">{lane.title}</h3>
                  {lane.lines.map((line) => (
                    <p key={line} className="text-sm text-slate-600 leading-relaxed mb-3">{line}</p>
                  ))}
                  <Link to={lane.to} className="mt-auto pt-3 inline-flex items-center gap-2 text-sm font-semibold text-vmNavy hover:text-vmTeal transition-colors">
                    {lane.label} <ArrowRight className="w-4 h-4" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── THE LADDER — how people actually work with me ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="max-w-2xl mb-14">
              <Eyebrow className="text-accent mb-4">How people work with me</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-5 leading-snug">
                Start small. Expand when the numbers prove it.
              </h2>
              <p className="text-slate-500">
                Two of these cost nothing. Most people start at $500 and expand only once the
                numbers say so — nobody signs the top rung cold.
              </p>
            </Reveal>

            <div className="flex flex-col">
              {LADDER.map((r, i) => (
                <Reveal key={r.name} delay={i * 60}>
                  <Link
                    to={r.to}
                    className="group grid grid-cols-[7.5rem_1fr_auto] gap-5 items-baseline py-5 border-t border-slate-200 hover:border-vmTeal transition-colors"
                  >
                    <span className="font-serif text-xl text-vmNavy tabular-nums">{r.price}</span>
                    <span>
                      <span className="block font-semibold text-vmNavy group-hover:text-vmTeal transition-colors">
                        {r.name}
                      </span>
                      <span className="block text-sm text-slate-600 mt-1">{r.desc}</span>
                    </span>
                    <ArrowRight
                      className="w-4 h-4 text-slate-300 group-hover:text-vmTeal transition-colors self-center"
                      aria-hidden
                    />
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10">
              <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                Prices are what they are on every call — you shouldn’t have to get on the phone to
                find out whether you can afford to talk to me.
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

        {/* ─── TESTIMONIALS ─── */}
        <section className="py-28 bg-vmCream">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-16">
              <LaurelSprig className="w-28 mx-auto mb-8 text-accent" />
              <Eyebrow className="text-accent mb-4">In their words</Eyebrow>
              <h2 className="text-4xl font-serif text-vmNavy">From the people who’ve worked with me.</h2>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    <p className="eyebrow text-slate-500 mt-1">{t.title}</p>
                    {/* Verifiable beats flattering: a quote the reader can check on a
                        profile we don't control carries more weight than one we typed. */}
                    {t.sourceUrl && (
                      <a
                        href={t.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs text-slate-500 hover:text-vmTeal transition-colors"
                      >
                        Verify on {t.sourceLabel}
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CASUAL INTELLIGENCE BAND ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="relative overflow-hidden bg-vmNavy rounded-sm">
              {/* Hokusai's Prussian blue sits almost exactly on the VM palette —
                  used here as texture inside the navy, not as a picture. */}
              <img
                src="/images/art/great-wave.webp"
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-[0.24] mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-vmNavy via-vmNavy/88 to-vmNavy/25" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-12">
                <div>
                  <Eyebrow className="text-vmMarigold mb-3">Season 2 · starts Sept 30</Eyebrow>
                  <h3 className="text-2xl font-serif text-white mb-2">Casual Intelligence</h3>
                  <p className="text-white/60 text-sm max-w-md leading-relaxed">
                    The Wednesday roundtable where operators show the systems they actually run —
                    live builds, real numbers, no pitches. Season 2 is a founding membership:
                    $79/mo, first ten seats locked for life.
                  </p>
                </div>
                <Link to="/ci" className={buttonTealOnNavy}>
                  See Season 2 <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── THE LONGER VIEW — a featured work, and why the work matters ─── */}
        <section className="py-28 bg-vmCream">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
              <Reveal className="md:col-span-7">
                <figure className="art-framed">
                  <img
                    src="/images/art/grande-jatte.webp"
                    alt="Georges Seurat, A Sunday on La Grande Jatte — 1884: Parisians at rest on an island in the Seine, painted in fine dots of colour"
                    loading="lazy"
                  />
                </figure>
              </Reveal>

              <div className="md:col-span-5">
                <Reveal>
                  <Eyebrow className="text-accent mb-5">The longer view</Eyebrow>
                  <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-6 leading-snug">
                    The point was never
                    <br />
                    <span className="italic">the technology.</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    A Sunday afternoon on an island in the Seine. Ordinary people doing nothing in
                    particular — and a painter free to spend two years rendering them, dot by dot,
                    because someone decided that was worth the time. It hangs in Chicago still.
                  </p>
                  <p className="text-slate-500 leading-relaxed mb-8">
                    That’s the world worth building toward: people whose hours belong to them, work
                    made freely, and the good of it kept for whoever comes next. Automation is a
                    means. The end is the time it hands back.
                  </p>
                  <figcaption className="art-placard">
                    <p className="eyebrow text-slate-500 mb-2">From the collection</p>
                    <p className="text-sm text-vmNavy placard-title">
                      A Sunday on La Grande Jatte — 1884
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">Georges Seurat, 1884–86</p>
                    <p className="text-xs text-slate-500 mt-1.5">
                      Art Institute of Chicago · Public domain
                    </p>
                  </figcaption>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-28 cosmos-wash border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Reveal>
              <VineDivider className="mx-auto mb-12 text-accent" />
              <h2 className="text-4xl md:text-5xl font-serif text-vmNavy mb-6 italic">Let’s find where your business is leaking.</h2>
              <p className="text-lg text-slate-600 mb-3 max-w-2xl mx-auto">
                In 30 minutes we’ll map where you’re losing money, what it would take to fix it, and
                whether I’m the right person to build it with you.
              </p>
              <p className="text-sm text-slate-500 mb-12">A working session, not a sales pitch.</p>
              <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                Book your call <ChevronRight className="w-4 h-4" />
              </a>
              <p className="mt-8 text-xs text-slate-500">
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
