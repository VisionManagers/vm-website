import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BOOKING_URLS } from '../constants';
import {
  Reveal, Eyebrow, SectionNumber, VineDivider, LotusMark,
  buttonPrimary, buttonSecondary,
} from '../components/ornaments';
import { ArrowRight, ChevronRight, Check, Minus } from 'lucide-react';

/* Copy ported from the approved working set (~/Documents/VM/Sales/OFFER.md +
   expansion-os-landing.html). Restyled to the site's design system rather than
   the standalone page's own brand — the build brief's "do not restyle" predates
   this page living inside the site.

   Prices RENDER vault canon: offer-ladder.md Rung 2X + pricing-rules.md v1.3
   (rule 8 — the website renders prices, it never defines them). The guarantee
   is the found-value + shipped-systems ruling of 2026-09-05. No income claims. */

const MODULES = [
  {
    n: '01', month: 'Month one', name: 'Map',
    head: 'Find where the business leaks',
    desc: 'We audit where time, money and attention drain out of your operation — missed calls, manual follow-up, content that never ships, leads that go cold. You pick the two builds with the highest return.',
    leave: 'your build roadmap',
  },
  {
    n: '02', month: 'Month two', name: 'Voice',
    head: 'Get the language right first',
    desc: 'Positioning, offer language, and conversation design. What your business says — on the phone, on the page, in the follow-up — before we automate any of it. Automating a weak message just delivers it faster.',
    leave: 'your offer and conversation playbook',
  },
  {
    n: '03', month: 'Month three', name: 'Build I',
    head: 'Ship your first working system',
    desc: 'Your highest-ROI build goes live: a voice agent that answers and books, an intake automation, a content engine — whatever your Map pointed to. Built with you, in the sessions, on your real business.',
    leave: 'system one, live',
  },
  {
    n: '04', month: 'Month four', name: 'Reach',
    head: 'Build the marketing system',
    desc: 'Funnel, content cadence, and the experience of buying from you — examined the way a UX researcher examines it, then rebuilt so more of the right people get through.',
    leave: 'your marketing operating plan',
  },
  {
    n: '05', month: 'Month five', name: 'Build II',
    head: 'Ship the second system, connect everything',
    desc: 'Second build goes live, and your systems get wired into one picture — CRM as the source of truth, so nothing falls between tools and you can see the whole business in one place.',
    leave: 'system two, live and connected',
  },
  {
    n: '06', month: 'Month six', name: 'Run',
    head: 'Own it without me',
    desc: 'Your operating manual: how every system works, your prompt library, your maintenance rhythm, and a twelve-month roadmap. The goal is self-sufficiency — you should not need me when we’re done.',
    leave: 'your AI operating manual',
  },
];

const CADENCE = [
  { stat: '75 min', title: 'Weekly build session', desc: 'The whole cohort, working on real businesses in real time. You watch seven other builds happen alongside yours — that’s half the education.' },
  { stat: '1:1', title: 'Monthly private session', desc: 'Your business, your blockers, nobody else in the room. We solve the specific thing in your way this month.' },
  { stat: '48 hr', title: 'Access between sessions', desc: 'Stuck mid-build on a Tuesday? Message the group channel. Answers within two business days, usually much faster.' },
];

const FOR = [
  'You run a real, revenue-generating business — practice, firm, agency, trade',
  'You want AI working inside the business in months, not “someday”',
  'You’ll build in the sessions, not spectate',
  'You care who’s in the room — this is a curated group, and it stays that way',
];

const NOT_FOR = [
  'You’re idea-stage, with no business to apply this to yet',
  'You want it done for you — that’s a different engagement, ask me',
  'You’re shopping for a library of recordings to watch later',
];

const INCLUDED = [
  '24 weekly build sessions',
  '6 private 1:1 sessions',
  'Direct access between sessions',
  'Two systems shipped, live in your business',
  'Your complete AI operating manual',
];

const ExpansionOS: React.FC = () => {
  return (
    <>
      <SEO
        title="Expansion OS — Build the operating system your business runs on"
        description="A six-month, hands-on cohort for established business owners. You build your AI systems — voice, automation, marketing, customer experience — with direct guidance every week. Eight seats, prepaid. Founding cohort $7,500."
        path="/expansion-os"
      />
      <div className="w-full bg-vmCream" data-aesthetic="indic">

        {/* ─── HERO ─── */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal>
              <Eyebrow className="text-accent mb-8">Expansion OS · a Vision Managers program</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-serif text-vmNavy text-[2.6rem] md:text-[4.2rem] leading-[1.06] mb-8 max-w-4xl">
                Build the operating system
                <br />
                <span className="italic">your business runs on.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-6">
                A six-month, hands-on cohort for established business owners. You build your AI
                systems — voice, automation, marketing, customer experience — with direct guidance
                every week. Not a course. Not a mastermind. <strong className="text-vmNavy">A build program.</strong>
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="eyebrow text-slate-400 mb-10">
                Founding cohort · 8 seats · prepaid, six months · applications reviewed personally
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                  Request a fit call <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#arc" className={buttonSecondary}>
                  See what we build <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── THE GAP ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <Reveal>
              <Eyebrow className="text-accent mb-5">The honest problem</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-6 leading-snug">
                You don’t need <span className="italic">another AI course.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-5">
                You’ve watched the demos. Maybe you’ve bought a tool or two. And the honest truth is
                the same one most owners tell me: nothing is actually running inside the business yet.
              </p>
              <p className="text-slate-500 leading-relaxed">
                The gap isn’t information — it’s implementation. Someone who knows AI, knows
                marketing, and knows how customers actually experience your business, sitting with
                you while you build. That’s what this is.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── THE ARC ─── */}
        <section id="arc" className="py-24 bg-vmCream scroll-mt-24">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="max-w-2xl mb-16">
              <Eyebrow className="text-accent mb-4">The six-month arc</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-5 leading-snug">
                Six modules. Two shipped systems. One operating picture.
              </h2>
              <p className="text-slate-500">
                Each month has a job. By month six your business runs on systems you built and
                understand — not on a vendor you’re locked into.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
              {MODULES.map((m, i) => (
                <Reveal key={m.n} delay={(i % 2) * 80}>
                  <div className="flex items-center gap-4 mb-4">
                    <SectionNumber n={m.n} />
                    <span className="eyebrow text-slate-400">{m.month} — {m.name}</span>
                  </div>
                  <h3 className="text-xl font-serif text-vmNavy mb-3">{m.head}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{m.desc}</p>
                  <p className="text-xs text-vmNavy pt-3 hairline">
                    <span className="text-slate-400">You leave with:</span> {m.leave}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CADENCE ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="mb-16 max-w-xl">
              <Eyebrow className="text-accent mb-4">How it works</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy leading-snug">
                Hands-on means <span className="italic">hands-on.</span>
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-10">
              {CADENCE.map((c, i) => (
                <Reveal key={c.title} delay={i * 90}>
                  <p className="font-serif text-4xl text-accent mb-4">{c.stat}</p>
                  <h3 className="text-lg font-serif text-vmNavy mb-3">{c.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── THE ROOM — Kyōsai ─── */}
        <section className="py-24 bg-vmCream">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
              <Reveal className="md:col-span-5">
                <figure className="art-framed">
                  <img
                    src="/images/art/painting-party.webp"
                    alt="Kawanabe Kyōsai, Calligraphy and Painting Party, 1880 — a crowded room of artists making work side by side"
                    loading="lazy"
                  />
                </figure>
              </Reveal>
              <div className="md:col-span-7">
                <Reveal>
                  <Eyebrow className="text-accent mb-5">Why a room, and not a course</Eyebrow>
                  <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-6 leading-snug">
                    Everyone here is
                    <br />
                    <span className="italic">making something.</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    In 1880 Kyōsai painted a calligraphy and painting party: a room full of artists
                    working side by side, watching each other, borrowing what worked. Nobody is
                    spectating. That is the whole difference between a room and an audience.
                  </p>
                  <p className="text-slate-500 leading-relaxed mb-8">
                    Eight seats, and you watch seven other businesses get built alongside yours.
                    Half the education is seeing someone else solve a problem you haven’t hit yet.
                  </p>
                  <figcaption className="art-placard">
                    <p className="eyebrow text-slate-400 mb-2">From the collection</p>
                    <p className="text-sm text-vmNavy placard-title">Calligraphy and Painting Party</p>
                    <p className="text-sm text-slate-500 mt-0.5">Kawanabe Kyōsai, 1880</p>
                    <p className="text-xs text-slate-400 mt-1.5">Cleveland Museum of Art · Public domain</p>
                  </figcaption>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FIT ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="mb-14 max-w-xl">
              <Eyebrow className="text-accent mb-4">Fit</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy leading-snug">
                This is a small room <span className="italic">on purpose.</span>
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-12">
              <Reveal>
                <h3 className="text-lg font-serif text-vmNavy mb-6">Built for you if</h3>
                <ul className="flex flex-col gap-4">
                  {FOR.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px] text-slate-600 leading-relaxed">
                      <Check className="w-4 h-4 shrink-0 mt-1 text-accent" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={90}>
                <h3 className="text-lg font-serif text-vmNavy mb-6">Not built for you if</h3>
                <ul className="flex flex-col gap-4">
                  {NOT_FOR.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px] text-slate-500 leading-relaxed">
                      <Minus className="w-4 h-4 shrink-0 mt-1 text-slate-300" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── WHO ─── */}
        <section className="py-24 bg-vmCream">
          <div className="max-w-3xl mx-auto px-6">
            <Reveal>
              <LotusMark className="w-10 mb-8 text-accent" />
              <Eyebrow className="text-accent mb-5">Who you’re building with</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-6 leading-snug">
                One person, <span className="italic">three lenses.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-5">
                I’m Suk Virk, founder of Vision Managers. I spent years doing conversation design and
                UX research inside Meta and CVS — studying how people actually talk to systems and
                buy from businesses — before building AI systems full-time for healthcare practices
                and professional services firms.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Most AI help gives you one lens: a developer, or a marketer, or a strategist. The
                businesses I work with grow because all three are in the same conversation. That’s
                what you get here, every week, on your business.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── PRICE + GUARANTEE ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-start">
            <Reveal>
              <Eyebrow className="text-accent mb-5">Founding cohort</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-8 leading-snug">
                One price. All in. <span className="italic">Prepaid.</span>
              </h2>
              <div className="keyline-double h-2 w-44 text-vmNavy mb-6" aria-hidden />
              <span className="block font-serif text-5xl md:text-6xl text-vmNavy leading-none">
                $7,500
              </span>
              <span className="block eyebrow text-slate-400 mt-4 mb-8">
                Six months, prepaid · 8 seats
              </span>
              <ul className="flex flex-col gap-3 mb-8">
                {INCLUDED.map((inc) => (
                  <li key={inc} className="flex items-start gap-3 text-[15px] text-slate-700">
                    <Check className="w-4 h-4 shrink-0 mt-1 text-accent" aria-hidden />
                    {inc}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-500 leading-relaxed">
                Future cohorts run at <strong className="text-vmNavy">$12,000</strong>. Founding
                members keep this rate for any future cohort they rejoin.
              </p>
            </Reveal>

            <Reveal delay={90}>
              <div className="p-8 md:p-10 bg-vmCream rounded-sm border border-slate-200">
                <Eyebrow className="text-accent mb-5">The guarantee</Eyebrow>
                <p className="text-slate-700 leading-relaxed mb-5">
                  <strong className="text-vmNavy">Month one, in your numbers.</strong> The Map audits
                  where your business is leaking. If it doesn’t identify at least{' '}
                  <strong className="text-vmNavy">$75,000 a year</strong> of recoverable opportunity,
                  you get every dollar back.
                </p>
                <p className="text-slate-700 leading-relaxed mb-6">
                  <strong className="text-vmNavy">Month six, shipped.</strong> Two working systems,
                  built by you. If they aren’t live, we keep going at no additional cost until they are.
                </p>
                <p className="text-sm text-slate-500 leading-relaxed pt-5 hairline">
                  What I won’t promise is what you’ll earn — that depends on whether you implement,
                  and I can’t control that. I can control what I find and what we ship.
                </p>
              </div>
              <p className="text-xs text-slate-400 mt-5 leading-relaxed">
                Prepaid because building takes commitment, and the room works when everyone in it is
                committed.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-28 cosmos-wash border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Reveal>
              <VineDivider className="mx-auto mb-12 text-accent" />
              <h2 className="text-3xl md:text-5xl font-serif text-vmNavy mb-6 italic">
                Twenty minutes to find out if this fits.
              </h2>
              <p className="text-lg text-slate-600 mb-3 max-w-xl mx-auto">
                Every seat is approved personally — the curation is the product. We’ll talk about
                your business and what you’d build first, and I’ll tell you honestly if this isn’t it.
              </p>
              <p className="text-sm text-slate-400 mb-12">
                Not ready for six months? <Link to="/leak-audit" className="text-vmNavy font-semibold hover:text-vmTeal transition-colors">Run the leak audit</Link> on your own first.
              </p>
              <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                Request a fit call <ChevronRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
};

export default ExpansionOS;
