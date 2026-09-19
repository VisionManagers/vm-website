import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BOOKING_URLS } from '../constants';
import {
  Reveal, Eyebrow, SectionNumber, VineDivider, SakuraBranch,
  buttonPrimary, buttonSecondary,
} from '../components/ornaments';
import { ArrowRight, ChevronRight, Check, Minus, Download } from 'lucide-react';

/* Copy assembled from 10-Strategy/offers/market-test.md (the productized offer,
   Suk-ratified 9/18) — value stack with crossed-off values, founding-cohort
   pricing, decision guarantee.

   Prices RENDER vault canon: pricing-rules.md v1.7 — Market Test $2,500,
   founding 4 at $1,250, seat tracker in offers/market-test.md is the scarcity
   source of truth. When the founding seats fill, this page's founding block
   comes DOWN (real scarcity only — never sayable once seats are gone). */

const STACK = [
  {
    name: 'The market dossier',
    desc: 'Demand signals, full competitor teardown, buyer economics — every claim sourced. Agencies typically charge $5K–$15K and take 4–8 weeks.',
    value: '$5,000',
  },
  {
    name: 'The customer copy bank',
    desc: '20–30 verbatim quotes from your real market — your ads, page, and pitch, pre-written by the people who’ll buy.',
    value: '$2,500',
  },
  {
    name: 'The gap map',
    desc: 'Where your competitors’ own 1-star reviews hand you the positioning.',
    value: '$1,500',
  },
  {
    name: 'The pricing corridor',
    desc: 'What your buyers already pay — and the price bands nobody owns.',
    value: '$1,000',
  },
  {
    name: 'The sales kit',
    desc: '30-second pitch, discovery questions, objection answers, the close. Sell face-to-face the same week.',
    value: '$1,500',
  },
];

const STEPS = [
  { n: '01', head: 'Intake — 15 minutes', desc: 'Your idea in your words, who you think pays, and your gut price. Five questions. The 72-hour clock starts here.' },
  { n: '02', head: 'The test runs', desc: 'Five research lanes in parallel: real demand, competitor teardown, your customers’ own words, the money math — and a lane whose only job is to kill your idea.' },
  { n: '03', head: 'The verdict call — 30 minutes', desc: 'GO, REFRAME, or KILL — argued on evidence, not vibes. You leave with the dossier, the copy bank, and a sales kit you can use that week.' },
];

const FIT = [
  'You intend to act within 30 days — a build you’re about to pay for, a sale you want to attempt, an audience you’ll pitch',
  'You’d rather lose one idea in 72 hours than six months and five figures',
  'You’ll actually use the sales kit — this is a market test, not homework',
];

const NOT_FIT = [
  'Idle curiosity — no plan to act. I’ll tell you, and point you somewhere free',
  'You want validation, not a verdict. One in three of these should die',
];

const MarketTest: React.FC = () => {
  return (
    <>
      <SEO
        title="The 72-Hour Market Test — Know Before You Build"
        description="Market-test your idea in 72 hours: real demand, your customers' exact words, and a GO / REFRAME / KILL verdict you can trust — before you spend a dollar building. Founding cohort pricing for the next 4."
        path="/market-test"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'The 72-Hour Market Test',
          provider: { '@type': 'Organization', name: 'Vision Managers', url: 'https://visionmanagers.com' },
          serviceType: ['Market Research & Idea Validation'],
          audience: { '@type': 'BusinessAudience', name: 'Founders and business owners validating a product or idea' },
          areaServed: 'US',
          description:
            'A 72-hour market test for a business idea: demand evidence, competitor teardown, 20–30 verbatim customer quotes, pricing corridors, a same-week sales kit, and a GO / REFRAME / KILL verdict. Guarantee: a clear verdict and 20+ sourced quotes, or you don’t pay.',
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: '2500',
            description: 'Founding-cohort pricing currently available for the next four seats.',
          },
          url: 'https://visionmanagers.com/market-test',
        }}
      />
      <div className="w-full bg-vmCream" data-aesthetic="nihon">

        {/* ─── HERO ─── */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal>
              <Eyebrow className="text-accent mb-8">The 72-Hour Market Test · for builders &amp; founders</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-serif text-vmNavy text-[2.6rem] md:text-[4.2rem] leading-[1.06] mb-8 max-w-4xl">
                Don’t build it <span className="italic">yet.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-6">
                Market-test your idea in 72 hours: real demand, your customers’ exact words, and a
                GO / REFRAME / KILL verdict you can trust — <strong className="text-vmNavy">before
                you spend a dollar building.</strong>
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                  Claim a founding seat <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#stack" className={buttonSecondary}>
                  See what you get <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── THE PROBLEM ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <Reveal>
              <Eyebrow className="text-accent mb-5">The expensive way to find out</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-6 leading-snug">
                Most ideas die <span className="italic">after</span> the build.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-5">
                The product is live, the money is spent, and the customers never come. The
                information that would have saved you existed the whole time — in forums, reviews,
                competitor complaints, and price sheets.
              </p>
              <p className="text-slate-500 leading-relaxed">
                In 72 hours, it’s on your desk. A killed bad idea returns its fee many times over —
                the thing it replaces is the five-figure build nobody wanted, and the six months
                attached to it.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── THE STACK ─── */}
        <section id="stack" className="py-24 bg-vmCream scroll-mt-24">
          <div className="max-w-4xl mx-auto px-6">
            <Reveal className="mb-14 max-w-2xl">
              <Eyebrow className="text-accent mb-4">What you walk away with</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy leading-snug">
                Not a report. <span className="italic">Ammunition.</span>
              </h2>
            </Reveal>
            <div className="flex flex-col">
              {STACK.map((s, i) => (
                <Reveal key={s.name} delay={i * 60}>
                  <div className="flex items-baseline justify-between gap-6 py-5 border-b border-slate-200">
                    <div>
                      <h3 className="text-lg font-serif text-vmNavy mb-1.5">{s.name}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed max-w-xl">{s.desc}</p>
                    </div>
                    <span className="shrink-0 font-semibold text-slate-400 line-through decoration-accent decoration-2">
                      {s.value}
                    </span>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={320}>
                <div className="flex items-baseline justify-between gap-6 py-5">
                  <div>
                    <h3 className="text-lg font-serif text-vmNavy mb-1.5">The kill case</h3>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                      Every reason it fails, ranked and sourced, before you’ve spent anything.
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold italic text-accent text-right">
                    the $10K–$50K
                    <br className="sm:hidden" /> mistake
                  </span>
                </div>
              </Reveal>
            </div>
            <Reveal delay={380}>
              <p className="font-serif text-2xl text-vmNavy mt-8">
                On the sheet: <span className="italic">$11,500+ of it.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="mb-14 max-w-xl">
              <Eyebrow className="text-accent mb-4">How it works</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy leading-snug">
                Seventy-two hours, <span className="italic">start to verdict.</span>
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-12">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 90}>
                  <div className="mb-4"><SectionNumber n={s.n} /></div>
                  <h3 className="text-lg font-serif text-vmNavy mb-3">{s.head}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── GUARANTEE + PRICE ─── */}
        <section className="py-24 bg-vmCream">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-start">
            <Reveal>
              <Eyebrow className="text-accent mb-5">Founding cohort</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-8 leading-snug">
                The next four seats, <span className="italic">at half.</span>
              </h2>
              <p className="mb-2">
                <span className="font-serif text-3xl text-slate-400 line-through decoration-accent decoration-2 mr-4">$2,500</span>
                <span className="font-serif text-5xl md:text-6xl text-vmNavy leading-none">$1,250</span>
              </p>
              <span className="block eyebrow text-slate-500 mt-4 mb-8">
                Founding cohort · next 4 only · one test runs at a time
              </span>
              <p className="text-sm text-slate-500 leading-relaxed">
                Why half: I’m banking the first four case studies — you get the founding price, I
                get to show your results, with your permission. The price returns to{' '}
                <strong className="text-vmNavy">$2,500</strong> at seat five.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <div className="p-8 md:p-10 bg-white rounded-sm border border-slate-200">
                <Eyebrow className="text-accent mb-5">The guarantee</Eyebrow>
                <p className="text-slate-700 leading-relaxed mb-5">
                  A clear <strong className="text-vmNavy">GO / REFRAME / KILL verdict</strong> and{' '}
                  <strong className="text-vmNavy">20+ sourced customer quotes</strong> — or you
                  don’t pay.
                </p>
                <p className="text-sm text-slate-500 leading-relaxed pt-5 hairline">
                  What I won’t promise is a GO. Roughly a third of ideas should die at this stage —
                  that’s the test working, and it’s the cheapest “no” you’ll ever get.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── FIT + DOWNLOAD ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <Reveal>
                <h3 className="text-lg font-serif text-vmNavy mb-6">A good fit if</h3>
                <ul className="flex flex-col gap-4">
                  {FIT.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                      <Check className="w-4 h-4 shrink-0 mt-1 text-accent" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={90}>
                <h3 className="text-lg font-serif text-vmNavy mb-6">Not the fit — and I’ll say so</h3>
                <ul className="flex flex-col gap-4">
                  {NOT_FIT.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-500 leading-relaxed">
                      <Minus className="w-4 h-4 shrink-0 mt-1 text-slate-300" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <Reveal>
              <a
                href="/downloads/72-hour-market-test.pdf"
                download
                className="inline-flex items-center gap-2 text-sm font-semibold text-vmNavy hover:text-vmTeal transition-colors"
              >
                <Download className="w-4 h-4" aria-hidden />
                Take the one-pager — send it to the founder you’re thinking of
              </a>
            </Reveal>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-28 cosmos-wash border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Reveal>
              <SakuraBranch className="mx-auto mb-12 w-16 text-accent" />
              <h2 className="text-3xl md:text-5xl font-serif text-vmNavy mb-6 italic">
                Know in 72 hours what a build takes six months to teach.
              </h2>
              <p className="text-lg text-slate-600 mb-3 max-w-xl mx-auto">
                Twenty minutes: tell me the idea and what you’re about to spend on it. I’ll tell
                you honestly whether it’s test-shaped — and if it isn’t, that call costs you nothing.
              </p>
              <p className="text-sm text-slate-500 mb-12">
                Running a business rather than building one?{' '}
                <Link to="/leak-audit" className="text-vmNavy font-semibold hover:text-vmTeal transition-colors">
                  The leak audit
                </Link>{' '}
                is your free first step instead.
              </p>
              <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                Claim a founding seat <ChevronRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
};

export default MarketTest;
