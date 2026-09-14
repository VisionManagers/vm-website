import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BOOKING_URLS } from '../constants';
import {
  Reveal, Eyebrow, ColumnFlank, VineDivider,
  buttonPrimary, buttonSecondary,
} from '../components/ornaments';
import { ArrowRight, ChevronRight, CalendarDays, Map, MessagesSquare } from 'lucide-react';

/* Prices on this page RENDER the vault canon: 10-Strategy/offers/offer-ladder.md
   (Rung 4 + its container, ruled 2026-09-05) + pricing-rules.md v1.3
   — rule 8: the website renders prices, never defines them.
   To change a number, change it there first, then update this display. */

const CONTAINER = [
  {
    Icon: CalendarDays,
    title: 'A weekly strategic block',
    desc: 'Ninety minutes, the same slot every week, held whether or not something is on fire. This is the part you are actually buying — a standing hour with someone who knows your business and is paid to think about it.',
  },
  {
    Icon: Map,
    title: 'A named quarterly roadmap',
    desc: 'We agree what the next ninety days are for, and the month’s work comes off that roadmap — not off whatever felt urgent on Monday. New urgent things get triaged onto it, not bolted onto the month.',
  },
  {
    Icon: MessagesSquare,
    title: 'Access between the blocks',
    desc: 'Async through the week, answered within 48 hours. For the questions that shouldn’t wait for Thursday, and the ones that turn out to matter more than what was on the agenda.',
  },
];

const NOT_FOR = [
  'You want a specific thing built and then you’re done — that’s a Build Sprint, and it’s cheaper.',
  'You want someone to execute a plan you’ve already made. This seat is for deciding what the plan is.',
  'Nobody internally can act on the roadmap between sessions.',
  'You haven’t seen me work yet. Start at $500 and make me earn this.',
];

const Partner: React.FC = () => {
  return (
    <>
      <SEO
        title="Strategic AI Partner — Vision Managers"
        description="A standing seat at the top of your AI and data roadmap: a weekly strategic block, a named quarterly roadmap, and one accountable person who answers for the result. From $5,000 a month."
        path="/partner"
      />
      <div className="w-full bg-vmCream" data-aesthetic="roman">

        {/* ─── HERO — the seat, named and priced ─── */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <ColumnFlank className="text-accent">
            <Reveal>
              <Eyebrow className="text-accent mb-8">The seat at the top of the ladder</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-serif text-vmNavy text-[2.6rem] md:text-[4.2rem] leading-[1.06] mb-8 max-w-4xl">
                Some businesses don’t need a project.
                <br />
                <span className="italic">They need a standing partner.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mb-10">
                Most of what I do starts small and earns its way up. This doesn’t. It’s the
                arrangement for operators who already know their data is the problem, have the
                money to fix it, and want one person accountable for the whole roadmap rather
                than another vendor with a ticket queue.
              </p>
            </Reveal>

            <Reveal delay={220}>
              {/* keyline-double carries opacity:.35 — keep it on its own rule element,
                  never wrapping content, or it fades the price with it. */}
              <div className="mb-10">
                <div className="keyline-double h-2 w-44 text-vmNavy mb-6" aria-hidden />
                <span className="block font-serif text-5xl md:text-6xl text-vmNavy leading-none">
                  $5,000<span className="text-2xl text-slate-500 font-sans"> / month</span>
                </span>
                <span className="block eyebrow text-slate-500 mt-4">
                  Entry. It grows on documented results, never on ambition.
                </span>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <a href={BOOKING_URLS.STRATEGY_CALL} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                  Book a strategy call
                  <ChevronRight className="w-4 h-4" />
                </a>
                <Link to="/solutions" className={buttonSecondary}>
                  This is more than I need
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-xs text-slate-500 mt-5">
                That second button is a real one. Most people should start at $500 — see the ladder.
              </p>
            </Reveal>
            </ColumnFlank>
          </div>
        </section>

        {/* ─── WHAT YOU'RE BUYING ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="max-w-2xl mb-16">
              <Eyebrow className="text-accent mb-5">What you’re actually buying</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-6 leading-snug">
                Not hours. <span className="italic">Judgment.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-5">
                You can buy hands anywhere, and cheaper than mine. What’s hard to buy is someone
                who has seen the same problem in a dental group, a law firm and a manufacturer in
                the same quarter, and can tell you which of your three plans is the one that
                actually works.
              </p>
              <p className="text-slate-500 leading-relaxed">
                That includes telling you when the answer isn’t AI. A vendor paid to deploy will
                never say that sentence. It’s the whole reason this seat exists.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-10">
              {CONTAINER.map((c, i) => (
                <Reveal key={c.title} delay={i * 90}>
                  <c.Icon className="w-7 h-7 text-accent mb-5" aria-hidden strokeWidth={1.4} />
                  <h3 className="text-xl font-serif text-vmNavy mb-3">{c.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-14 pt-8 hairline max-w-3xl">
              <p className="text-slate-600 leading-relaxed">
                <strong className="text-vmNavy">Builds come off the roadmap.</strong> When something
                falls outside it, it gets scoped and priced separately rather than quietly absorbed
                into the month. That line is what keeps a retainer from turning into unlimited
                access — which serves neither of us, and is how these arrangements usually fail.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── THE LONG VIEW — Panini ─── */}
        <section className="py-24 bg-vmCream">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
              <Reveal className="md:col-span-7">
                <figure className="art-framed">
                  <img
                    src="/images/art/ancient-rome.webp"
                    alt="Giovanni Paolo Panini, Ancient Rome — a picture gallery whose walls are covered with paintings of Rome's monuments, with figures studying them"
                    loading="lazy"
                  />
                </figure>
              </Reveal>
              <div className="md:col-span-5">
                <Reveal>
                  <Eyebrow className="text-accent mb-5">Why the seat, and not a project</Eyebrow>
                  <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-6 leading-snug">
                    Panini painted the
                    <br />
                    <span className="italic">whole room at once.</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    Every monument in Rome, gathered onto four walls so a visitor could stand in
                    one place and see how it all related. Nobody could get that view by walking
                    the city. Someone had to assemble it deliberately, and then you needed a guide
                    who had already spent years in the room.
                  </p>
                  <p className="text-slate-500 leading-relaxed mb-8">
                    A project gives you one monument. This gives you the room — and someone
                    standing in it with you every week, who remembers what you decided last
                    quarter and why.
                  </p>
                  <figcaption className="art-placard">
                    <p className="eyebrow text-slate-500 mb-2">From the collection</p>
                    <p className="text-sm text-vmNavy placard-title">Ancient Rome</p>
                    <p className="text-sm text-slate-500 mt-0.5">Giovanni Paolo Panini, 1757</p>
                    <p className="text-xs text-slate-500 mt-1.5">
                      The Metropolitan Museum of Art · Public domain
                    </p>
                  </figcaption>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WHO IT'S FOR / NOT FOR ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-14">
            <Reveal>
              <Eyebrow className="text-accent mb-5">This fits when</Eyebrow>
              <h3 className="text-2xl font-serif text-vmNavy mb-6">You’re past the pilot stage.</h3>
              <p className="text-slate-600 leading-relaxed mb-5">
                Multi-entity operators, funded founders, and businesses past roughly $1M in revenue
                where the data is genuinely fragmented — several systems, none of them talking, and
                decisions being made on whichever number was easiest to find that morning.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Healthcare is where most of my proof lives — voice, practice operations, records.
                It is not the boundary. The pattern travels further than the vertical does.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <Eyebrow className="text-accent mb-5">Don’t buy this if</Eyebrow>
              <ul className="flex flex-col gap-4">
                {NOT_FOR.map((n) => (
                  <li key={n} className="text-slate-600 leading-relaxed pl-5 relative text-sm">
                    <span className="absolute left-0 text-accent" aria-hidden>—</span>
                    {n}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-500 mt-7 leading-relaxed">
                I’d rather tell you this now than three months in. The ladder exists so you never
                pay for more conviction than the evidence supports.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── PROOF ─── */}
        <section className="py-24 bg-vmCream">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Reveal>
              <Eyebrow className="text-accent mb-5">Proof</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-8 leading-snug">
                Built for <span className="italic">Emerald Health.</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                The seat isn’t theoretical — it’s how the deepest engagements already run. They
                started as something small and specific, and expanded because the reporting made
                the next decision obvious. One deployment put <strong className="text-vmNavy">$4,300
                of booked appointments</strong> on the calendar within two days of going live.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                No income promises. What I’ll commit to is the cadence, the roadmap, and being the
                person who answers for it.
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
                Let’s find out if it’s the right seat.
              </h2>
              <p className="text-lg text-slate-600 mb-3 max-w-xl mx-auto">
                A working session, not a pitch. We’ll map where your data is costing you and
                whether this arrangement is worth $5,000 a month to you — or whether something
                smaller gets you there.
              </p>
              <p className="text-sm text-slate-500 mb-12">
                If it isn’t a fit, I’ll say so on the call and point you at what is.
              </p>
              <a href={BOOKING_URLS.STRATEGY_CALL} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                Book a strategy call <ChevronRight className="w-4 h-4" />
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

export default Partner;
