import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Reveal, Eyebrow, VineDivider, LeafMark, buttonPrimary } from '../components/ornaments';

const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/u9ITLagwSXqANxwjhaAS';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Do I need to be technical?',
    a: 'No. If you can describe your week, we can find where AI fits.',
  },
  {
    q: 'Is my business data safe?',
    a: 'We treat data carefully and plainly: nothing of yours trains public models, and healthcare work follows HIPAA-aware handling.',
  },
  {
    q: 'What does working together cost?',
    a: 'The call is free. Most clients start with a $500 Quick-Start: a one-week look at your business with dollar math and one fix implemented. Bigger work is scoped only when the numbers justify it.',
  },
  {
    q: "What if AI isn't right for us yet?",
    a: 'Then that is what we will tell you. Sometimes the honest answer is "not yet, do this cheaper thing first." You get that answer free.',
  },
  {
    q: 'What happens after the call?',
    a: 'Within a day you get your AI Opportunity Snapshot: the opportunity we found and roughly what it is worth in dollars. What you do with it is up to you.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const BookButton: React.FC<{ id: string }> = ({ id }) => (
  <div id={id} className="flex flex-col items-center gap-3">
    <a href={BOOKING_URL} target="_blank" rel="noreferrer" className={buttonPrimary}>
      Book a 20-minute discovery call
    </a>
    <p className="text-sm text-vmNavy/60 max-w-md text-center leading-relaxed">
      Free, no pitch. If AI isn&rsquo;t worth it for you yet, we&rsquo;ll say so &mdash; and you
      still get your <span className="font-medium text-vmNavy">AI Opportunity Snapshot</span> the next day.
    </p>
  </div>
);

const WhatIsAI: React.FC = () => {
  return (
    <>
      <SEO
        title="What is AI? A plain-English guide for business owners"
        description="What is AI, actually? And what's it worth to your business in real dollars? A 20-minute discovery call finds your #1 AI opportunity, sized and in writing by the next day."
        path="/ai"
        jsonLd={faqJsonLd}
      />
      <div data-aesthetic="solar" className="bg-vmCream text-vmNavy">
        {/* S1 — Hero */}
        <section className="relative overflow-hidden pt-40 pb-24 px-6">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 0%, rgba(127,176,105,0.16), transparent 65%)' }}
          />
          <div className="relative max-w-3xl mx-auto text-center">
            <Reveal>
              <Eyebrow className="text-vmLeaf">Plain answers, no hype</Eyebrow>
              <h1 className="font-serif text-4xl md:text-6xl leading-tight mt-4">
                What is AI, actually?
              </h1>
              <p className="mt-6 text-lg md:text-xl text-vmNavy/75 leading-relaxed max-w-2xl mx-auto">
                And what&rsquo;s it worth to your business, in real dollars? Twenty minutes, and
                you&rsquo;ll know your #1 AI opportunity &mdash; sized, in writing, by tomorrow.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-10">
                <BookButton id="cta-hero" />
              </div>
              <p className="mt-8 text-sm text-vmNavy/55">
                From the team behind{' '}
                <Link to="/ci" className="underline decoration-vmLeaf/50 underline-offset-4 hover:text-vmNavy">
                  Casual Intelligence
                </Link>
                , the Eastside&rsquo;s weekly AI roundtable &mdash; working with clients like Emerald Health.
              </p>
            </Reveal>
          </div>
        </section>

        <VineDivider className="max-w-xs mx-auto text-vmLeaf/60" />

        {/* S2 — AI in one honest minute */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <Eyebrow className="text-vmLeaf">AI in one honest minute</Eyebrow>
              <h2 className="font-serif text-3xl md:text-4xl mt-3">Three things worth knowing</h2>
            </Reveal>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {[
                {
                  h: "It's a pattern machine.",
                  p: 'It read most of the internet and learned the patterns: language, images, decisions. So it can draft, summarize, answer, and sort, fast.',
                },
                {
                  h: "It's already in your tools.",
                  p: 'The email that suggests replies. The phone tree that understands sentences. You are using AI now, chosen or not.',
                },
                {
                  h: "The hard part isn't the tech.",
                  p: 'It is knowing which parts of your week to hand it. That is the whole game, and it is different for every business.',
                },
              ].map(({ h, p }, i) => (
                <Reveal key={h} delay={i * 120}>
                  <div>
                    <LeafMark className="w-6 h-6 text-vmLeaf" />
                    <h3 className="font-serif text-xl mt-4">{h}</h3>
                    <p className="mt-3 text-vmNavy/70 leading-relaxed">{p}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* S3 — What it could do for you */}
        <section className="py-20 px-6 bg-white/60">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <Eyebrow className="text-vmLeaf">For your business</Eyebrow>
              <h2 className="font-serif text-3xl md:text-4xl mt-3">What it could do for you</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {[
                {
                  h: 'Automate the repetitive',
                  p: 'The calls your front desk misses get answered, booked, and logged by an agent that never steps away.',
                },
                {
                  h: 'Get your time back',
                  p: 'Reports, follow-ups, and research that ate your evenings come back as drafts you approve in minutes.',
                },
                {
                  h: 'Make more money',
                  p: 'A missed appointment costs a practice hundreds of dollars. Catching even a few each month pays for the fix.',
                },
                {
                  h: 'Open new doors',
                  p: 'Offers you could not make before: 24/7 answering, custom research, a course, a whole new service line.',
                },
              ].map(({ h, p }, i) => (
                <Reveal key={h} delay={i * 100}>
                  <div className="bg-vmCream/80 border border-slate-200/70 border-t-2 border-t-vmLeaf/60 rounded-sm p-8 h-full">
                    <h3 className="font-serif text-xl">{h}</h3>
                    <p className="mt-3 text-vmNavy/70 leading-relaxed">{p}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* S4 — Where to start */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <Eyebrow className="text-vmLeaf">Where to start</Eyebrow>
              <h2 className="font-serif text-3xl md:text-4xl mt-3">Three doors. Pick the one that fits today.</h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-12 bg-white border border-slate-200/70 rounded-sm p-8 md:p-12 text-center">
                <h3 className="font-serif text-2xl">Talk it through</h3>
                <p className="mt-4 text-vmNavy/70 leading-relaxed max-w-xl mx-auto">
                  Twenty minutes on your business. We find the one thing worth doing first and what
                  it&rsquo;s worth in dollars. Free &mdash; and your AI Opportunity Snapshot arrives in
                  writing the next day, whether or not we ever work together.
                </p>
                <div className="mt-8">
                  <BookButton id="cta-doors" />
                </div>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Reveal delay={150}>
                <Link to="/ci" className="block border border-slate-200/70 rounded-sm p-6 hover:border-vmLeaf/60 transition-colors">
                  <h4 className="font-serif text-lg">Join the room</h4>
                  <p className="mt-2 text-sm text-vmNavy/65 leading-relaxed">
                    Casual Intelligence, Wednesdays. Free, casual, real conversations about using AI well.
                  </p>
                </Link>
              </Reveal>
              <Reveal delay={220}>
                <Link to="/ci" className="block border border-slate-200/70 rounded-sm p-6 hover:border-vmLeaf/60 transition-colors">
                  <h4 className="font-serif text-lg">Learn it yourself</h4>
                  <p className="mt-2 text-sm text-vmNavy/65 leading-relaxed">
                    Short free lessons, from zero. The same ground clients pay us $200 an hour to walk
                    them through &mdash; free to start. First cohort already running.
                  </p>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        <VineDivider className="max-w-xs mx-auto text-vmLeaf/60" />

        {/* S5 — Proof strip */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3 text-center">
            {[
              { p: 'A weekly room of owners and builders talking AI in plain English.', to: '/ci', label: 'Casual Intelligence' },
              { p: 'Working with healthcare clients like Emerald Health.', to: '/ai-voice', label: 'AI Voice for practices' },
              { p: 'We build in the open. See what we actually make.', to: '/lab', label: 'The Lab' },
            ].map(({ p, to, label }, i) => (
              <Reveal key={label} delay={i * 100}>
                <div>
                  <p className="text-sm text-vmNavy/65 leading-relaxed">{p}</p>
                  <Link to={to} className="mt-2 inline-block text-sm font-medium underline decoration-vmLeaf/50 underline-offset-4">
                    {label}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* S6 — FAQ */}
        <section className="py-20 px-6 bg-white/60">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <Eyebrow className="text-vmLeaf">Straight answers</Eyebrow>
              <h2 className="font-serif text-3xl md:text-4xl mt-3">Questions owners actually ask</h2>
            </Reveal>
            <div className="mt-10 space-y-8">
              {FAQS.map(({ q, a }, i) => (
                <Reveal key={q} delay={i * 60}>
                  <div className="border-b border-slate-200/70 pb-6">
                    <h3 className="font-serif text-lg">{q}</h3>
                    <p className="mt-2 text-vmNavy/70 leading-relaxed">{a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* S7 — Final CTA */}
        <section className="py-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
              <h2 className="font-serif text-3xl md:text-4xl">
                Twenty minutes. Your #1 opportunity, in writing.
              </h2>
              <div className="mt-10">
                <BookButton id="cta-final" />
              </div>
              <p className="mt-6 text-xs text-vmNavy/50">
                Booking asks three short questions so the call starts warm.
              </p>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
};

export default WhatIsAI;
