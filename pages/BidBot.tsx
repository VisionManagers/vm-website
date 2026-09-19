import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BOOKING_URLS } from '../constants';
import {
  Reveal, Eyebrow, SectionNumber, VineDivider, LaurelSprig,
  buttonPrimary, buttonSecondary,
} from '../components/ornaments';
import { ArrowRight, ChevronRight, Check, Minus, Download } from 'lucide-react';

/* Copy assembled from the vault per the copywriting playbook (VoC-first):
   10-Strategy/offers/document-generation.md (the offer + rubric) and
   70-Research/industry-data/estimating-bid-market-2026-09.md (borrowed market
   language — quoted on-page as market voices with honest source labels, never
   implied to be VM clients). The Chris Wolf quote is proof-library §A GRANTED.

   Prices RENDER vault canon: pricing-rules.md v1.7 (Document Generation pain
   bands: Standard $750 · Heavy $1,500 · Anchor $2,250+). Rule: the website
   renders prices, it never defines them. Bid Desk deliberately carries NO
   price — not on the card yet (research running, 9/18). */

const STEPS = [
  {
    n: '01',
    head: 'Send your past bids',
    desc: 'Five to ten past bids and your rate sheet. That’s your whole part of the setup.',
  },
  {
    n: '02',
    head: 'Your writer gets built — in about a week',
    desc: 'Template, wording, and pricing rules extracted from your real work — then validated against your own bid history before you ever rely on it.',
  },
  {
    n: '03',
    head: 'Talk the job in. Approve. Send.',
    desc: 'From the truck or the kitchen table — describe the job the way you’d tell your best estimator. The formal bid comes back in your format. You check every number and hit send.',
  },
];

const RULES = [
  'It never invents a price — your rates, applied by code, with the arithmetic shown.',
  'It refuses to write anything it has no rate for.',
  'Nothing goes out without your approval.',
];

/* Market voices — real forum/review language, honestly attributed. These are
   the market's words about the problem, not VM customers. */
const MARKET_VOICES = [
  {
    quote: '“Every week I’m spending 10–20 hours… then spending my nights building detailed scopes and pricing — all for free.”',
    source: 'a contractor, r/Contractor',
  },
  {
    quote: '“We live and die on the bid, a little too high, and we loose the project, a little too low, and we loose our shirt.”',
    source: 'a GC, ContractorTalk (spelling his)',
  },
  {
    quote: '“I loved doing the work but hated doing the estimates and sales part.”',
    source: 'r/Construction',
  },
];

/* Renders pricing-rules.md v1.7 — the pain bands. */
const BANDS = [
  { band: 'Standard', cost: 'A bid takes you up to a couple of hours today', price: '$750' },
  { band: 'Heavy', cost: 'Half a day to a couple of days each', price: '$1,500' },
  { band: 'Anchor', cost: '20–40+ hours each — the document your business lives on', price: 'from $2,250' },
];

const FIT = [
  'You send four or more bids, quotes, or proposals a month',
  'You can name what they cost you — the evenings, the weekend at the desk',
  'You have a folder of past bids and a rate sheet you trust',
];

const NOT_FIT = [
  'Fewer than four a month — honestly, a template and ChatGPT will do',
  'You enjoy building your own tools — you don’t need me for this',
];

const BidBot: React.FC = () => {
  return (
    <>
      <SEO
        title="Your Bid Bot — Same-Day Formal Bids, In Your Prices"
        description="A bid writer trained on your own past bids and rate sheet. Talk the job in from the truck; a formal bid in your format comes back in minutes. You approve every number. Built for you in about a week, from $750."
        path="/bid-bot"
      />
      <div className="w-full bg-vmCream" data-aesthetic="roman">

        {/* ─── HERO ─── */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal>
              <Eyebrow className="text-accent mb-8">Your Bid Bot · for trades &amp; home services</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-serif text-vmNavy text-[2.6rem] md:text-[4.2rem] leading-[1.06] mb-8 max-w-4xl">
                Bids are eating
                <br />
                <span className="italic">your nights.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-6">
                One remodeler counts 40+ hours of estimating on a single $100K job. A roofer sends
                5–8 bids a week — written after dinner. Same scope, same sections, same rates,
                retyped for the hundredth time. <strong className="text-vmNavy">And the customer
                signs with whoever got them a real number first.</strong>
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                  Book the free 20-minute call <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#how" className={buttonSecondary}>
                  See how it works <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── MARKET VOICES ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="mb-12 max-w-xl">
              <Eyebrow className="text-accent mb-4">You’re not the only one</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy leading-snug">
                Thirty years of contractor forums, <span className="italic">one sentence.</span>
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-10">
              {MARKET_VOICES.map((v, i) => (
                <Reveal key={v.source} delay={i * 80}>
                  <p className="font-serif text-lg text-vmNavy leading-relaxed mb-4">{v.quote}</p>
                  <p className="text-xs text-slate-500">— {v.source}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={260}>
              <p className="text-xs text-slate-400 mt-10">
                Real posts from public contractor forums and reviews — the trade talking about the
                problem, not our clients.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── THE FIX ─── */}
        <section id="how" className="py-24 bg-vmCream scroll-mt-24">
          <div className="max-w-3xl mx-auto px-6">
            <Reveal>
              <Eyebrow className="text-accent mb-5">The fix</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-6 leading-snug">
                A bid writer trained on <span className="italic">your</span> bids —
                not a database app.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-5">
                Estimating apps price from national databases, and their own reviews say what
                happens next: owners correcting every line. Your Bid Bot is built from your past
                bids and your rate sheet — your format, your wording, your numbers.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Talk the job in from the truck; the formal bid is drafted before you’re back at
                the shop. You approve every number, then send — same day, sometimes from the
                driveway.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── STEPS ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="mb-14 max-w-xl">
              <Eyebrow className="text-accent mb-4">How it works</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy leading-snug">
                Set up <span className="italic">for</span> you. Not by you.
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

        {/* ─── SAFETY RULES ─── */}
        <section className="py-24 bg-vmCream">
          <div className="max-w-3xl mx-auto px-6">
            <Reveal>
              <LaurelSprig className="w-10 mb-8 text-accent" />
              <Eyebrow className="text-accent mb-5">The part that matters</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-8 leading-snug">
                Built so it <span className="italic">can’t lie to you.</span>
              </h2>
              <ul className="flex flex-col gap-4 mb-6">
                {RULES.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                    <Check className="w-4 h-4 shrink-0 mt-1.5 text-accent" aria-hidden />
                    {r}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-500 leading-relaxed">
                A wrong number on a bid costs real money — so the writer writes, and a calculator
                applies your rates. When it has no rate for something, it stops and says so.
                We demo that refusal on the walkthrough, on purpose.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── PROOF ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <Reveal>
              <Eyebrow className="text-accent mb-5">In the wild</Eyebrow>
              <blockquote className="font-serif text-2xl md:text-3xl text-vmNavy leading-snug mb-6">
                “This was a very easy process. I’m impressed with your professionalism and I’m
                excited to use my new AI helper.”
              </blockquote>
              <p className="text-sm text-slate-600 mb-2">
                — Chris Wolf, Wolf &amp; Wolf (roofing &amp; exteriors, Eastside)
              </p>
              <p className="text-sm text-slate-500">
                His bid writer was built from and tested against 600+ of his own past bids.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── PRICE ─── */}
        <section className="py-24 bg-vmCream">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="mb-12 max-w-2xl">
              <Eyebrow className="text-accent mb-4">What it costs</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-5 leading-snug">
                From <span className="italic">$750</span> per document type.
              </h2>
              <p className="text-slate-600 leading-relaxed">
                A “type” is one kind of document — roof bids, remodel bids, proposals, change
                orders. The price follows what that document costs you today:
              </p>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              {BANDS.map((b, i) => (
                <Reveal key={b.band} delay={i * 80} className="p-7 bg-white border border-slate-200 rounded-sm">
                  <p className="eyebrow text-slate-500 mb-3">{b.band}</p>
                  <p className="font-serif text-3xl text-vmNavy mb-3">{b.price}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{b.cost}</p>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                Most owners start with one type — usually bids. First type built in about a week.
                You see it working on your own past documents before you rely on it.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── BID DESK TEASER (no price — not on the card yet) ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <Reveal>
              <Eyebrow className="text-accent mb-5">Coming next</Eyebrow>
              <h2 className="text-2xl md:text-3xl font-serif text-vmNavy mb-5 leading-snug">
                The Bid Desk — none of your bids <span className="italic">die in silence.</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Most estimates don’t lose — they get ghosted. The Bid Desk follows up on every
                bid you send, in your voice, and reports one number a month: jobs it won you.
              </p>
              <p className="text-sm text-slate-500">Ask about it on the call.</p>
            </Reveal>
          </div>
        </section>

        {/* ─── FIT + DOWNLOAD ─── */}
        <section className="py-24 bg-vmCream">
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
                href="/downloads/your-bid-bot.pdf"
                download
                className="inline-flex items-center gap-2 text-sm font-semibold text-vmNavy hover:text-vmTeal transition-colors"
              >
                <Download className="w-4 h-4" aria-hidden />
                Take the one-pager — send it to the contractor you’re thinking of
              </a>
            </Reveal>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-28 cosmos-wash border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Reveal>
              <VineDivider className="mx-auto mb-12 text-accent" />
              <h2 className="text-3xl md:text-5xl font-serif text-vmNavy mb-6 italic">
                Get your evenings back.
              </h2>
              <p className="text-lg text-slate-600 mb-3 max-w-xl mx-auto">
                Twenty minutes: walk me through your last bid — how long it took, and when you
                wrote it. I’ll tell you honestly whether a bid bot pays for itself in your shop.
              </p>
              <p className="text-sm text-slate-500 mb-12">
                Want the wider picture first? <Link to="/leak-audit" className="text-vmNavy font-semibold hover:text-vmTeal transition-colors">Run the leak audit</Link> — free, no email needed.
              </p>
              <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                Book the free 20-minute call <ChevronRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
};

export default BidBot;
