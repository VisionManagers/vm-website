
import React from 'react';
import SEO from '../components/SEO';
import {
  Reveal, Eyebrow, JaliPattern, CuspedArch, LotusMark,
  buttonPrimary, buttonSecondary,
} from '../components/ornaments';
import { ArrowRight, CalendarDays } from 'lucide-react';

const LUMA_URL = 'https://luma.com/casual-intelligence';
const LUMA_EMBED = 'https://luma.com/embed/calendar/cal-U6X63y9rEYlCVLr/events?lt=light';

const TOPICS = [
  { title: 'Second-mind systems', desc: 'Full Obsidian + Claude stacks built live — from daily dashboard to a knowledge base that compounds.' },
  { title: 'CRM that maintains itself', desc: 'The MINT framework, Nexus CRM, and Graph RAG — pipelines that ingest meetings and update themselves.' },
  { title: 'Agents & automation', desc: 'Mission Control setups, local LLMs, and the smallest chunk of work worth automating first.' },
  { title: 'Prompting as a service', desc: 'A great prompt is a reusable business asset — how operators package and sell theirs.' },
  { title: 'AI compliance', desc: 'Recording consent, HIPAA posture, and state-by-state AI law — what regulators actually look for.' },
  { title: 'AI consulting economics', desc: 'Pricing your first client, scoping engagements, and what the market pays.' },
  { title: 'Deep research & memory', desc: 'Multi-source research workflows and memory frameworks that survive past one chat.' },
  { title: 'Platform-agnostic AI', desc: 'Claude, ChatGPT, Gemini, local models — building so you never marry one vendor.' },
  { title: 'Vertical spotlights', desc: 'Genomic health, civic orchestration, tax workflows — the room goes deep on one industry at a time.' },
];

const RECENT = [
  {
    title: 'How to automate your CRM',
    detail: 'The MINT framework — a working pipeline that ingests meetings and updates itself.',
  },
  {
    title: 'How to do Fortune-level research with AI',
    detail: 'The exact multi-source research and verification workflow VM uses for client work.',
  },
  {
    title: 'How to create a second mind with Obsidian',
    detail: 'A full personal-knowledge system, from daily dashboard to a campaign builder, built live.',
  },
];

const CasualIntelligence: React.FC = () => {
  return (
    <>
    <SEO
      title="Casual Intelligence — Weekly AI Roundtable"
      description="A free weekly roundtable where operators show how they actually use AI — live builds, real workflows, no sales pitches. Wednesdays, hosted by Vision Managers."
      path="/casual-intelligence"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'EventSeries',
        name: 'Casual Intelligence',
        description: 'Weekly AI roundtable for business operators. Live demonstrations of real AI workflows.',
        organizer: { '@type': 'Organization', name: 'Vision Managers', url: 'https://visionmanagers.com' },
        eventSchedule: { '@type': 'Schedule', repeatFrequency: 'P1W', byDay: 'https://schema.org/Wednesday' },
      }}
    />
    {/* Indian classical: radiance, intricacy, gathering */}
    <div className="bg-white" data-aesthetic="indic">

      {/* ─── HERO — light through a carved screen ─── */}
      <section className="relative pt-44 pb-28 overflow-hidden light-wash">
        <div className="absolute inset-0 text-vmMarigold pointer-events-none" aria-hidden>
          <JaliPattern opacity={0.12} />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <LotusMark className="w-14 mx-auto mb-8 text-accent" />
            <Eyebrow className="text-accent mb-6">Every Wednesday · free to attend</Eyebrow>
            <h1 className="font-serif text-vmNavy text-4xl md:text-6xl leading-[1.08] mb-8">
              Casual Intelligence.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl mx-auto">
              A weekly roundtable where operators show how they actually use AI —
              live builds, real workflows, honest numbers. Nobody pitches from the
              front of the room. Ever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <a href="#upcoming" className={buttonPrimary}>
                See upcoming sessions & RSVP <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              This page is the invite — share visionmanagers.com/casual-intelligence and someone can be in the room Wednesday.
            </p>
          </Reveal>
        </div>
      </section>

      <Reveal className="flex justify-center py-4 text-accent">
        <CuspedArch />
      </Reveal>

      {/* ─── UPCOMING — live Luma calendar, RSVP on-page ─── */}
      <section id="upcoming" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-10">
            <Eyebrow className="text-accent mb-4">Upcoming</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-serif text-vmNavy">Pick a Wednesday. RSVP right here.</h2>
          </Reveal>
          <Reveal>
            <div className="border border-slate-200 rounded-sm overflow-hidden bg-white">
              <iframe
                src={LUMA_EMBED}
                title="Casual Intelligence — upcoming sessions"
                className="w-full"
                style={{ height: '480px', border: 'none' }}
                loading="lazy"
                allowFullScreen
              />
            </div>
            <p className="mt-4 text-center text-sm text-slate-500">
              Calendar not loading?{' '}
              <a href={LUMA_URL} target="_blank" rel="noreferrer" className="underline decoration-vmMarigold/60 underline-offset-4 text-vmNavy">
                Open Casual Intelligence on Luma
              </a>{' '}
              — hit Follow and every session lands on your calendar.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── THE FORMAT ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <Eyebrow className="text-accent mb-4">The format</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-serif text-vmNavy">Show, don't tell.</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { n: '01', title: 'One operator presents', desc: 'A working system they actually run — screens shared, warts included.' },
              { n: '02', title: 'The room digs in', desc: 'Questions, edge cases, and "would this survive my front desk?" The questions are half the value.' },
              { n: '03', title: 'Everyone leaves with steps', desc: 'A recap lands afterward: the framework, the tools, what to apply this week.' },
            ].map((item, i) => (
              <Reveal key={item.n} delay={i * 100} className="text-center">
                <span className="font-serif text-5xl text-accent/90 block mb-5" aria-hidden>{item.n}</span>
                <h3 className="font-semibold text-vmNavy mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOPICS — nested tile grid (self-similar repetition) ─── */}
      <section className="py-24 px-6 bg-vmSlate/40 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          <Reveal className="text-center mb-16">
            <Eyebrow className="text-accent mb-4">What gets covered</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-serif text-vmNavy">Live themes from real sessions.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPICS.map((topic, i) => (
              <Reveal key={topic.title} delay={i * 60}
                className="relative p-8 bg-white border border-slate-200 rounded-sm overflow-hidden">
                <div className="absolute inset-0 text-vmMarigold pointer-events-none" aria-hidden>
                  <JaliPattern opacity={0.05} />
                </div>
                <div className="relative">
                  <h3 className="font-serif text-xl text-vmNavy mb-3">{topic.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{topic.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RECENT SESSIONS ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <Eyebrow className="text-accent mb-4">Recently at the roundtable</Eyebrow>
            <h2 className="text-3xl font-serif text-vmNavy">Courses in miniature.</h2>
          </Reveal>
          <div className="space-y-8">
            {RECENT.map((session, i) => (
              <Reveal key={session.title} delay={i * 80}
                className="flex items-start gap-6 p-8 border border-slate-200 rounded-sm bg-white">
                <CalendarDays className="w-6 h-6 text-accent shrink-0 mt-1" aria-hidden />
                <div>
                  <h3 className="font-semibold text-vmNavy mb-2">{session.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{session.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO THIS ROOM IS FOR ─── */}
      <section className="py-24 px-6 bg-vmSlate/40">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <Eyebrow className="text-accent mb-4">The room's one rule</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-serif text-vmNavy">Come to figure it out together.</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal className="p-8 bg-white border border-slate-200 rounded-sm">
              <h3 className="font-serif text-xl text-vmNavy mb-4">This is your room if</h3>
              <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <li>You run something real and want AI to earn its keep in it.</li>
                <li>You'd rather ask "would this survive my front desk?" than nod politely.</li>
                <li>You show your work — including the parts that broke — so others can build on it.</li>
                <li>You come back. The relationships are where the compounding happens.</li>
              </ul>
            </Reveal>
            <Reveal delay={120} className="p-8 bg-white border border-slate-200 rounded-sm">
              <h3 className="font-serif text-xl text-vmNavy mb-4">It's not the room for</h3>
              <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <li>Pitching from the front. Nobody sells here — that includes us.</li>
                <li>Showing off a result without sharing the how.</li>
                <li>Collecting an audience instead of joining a conversation.</li>
              </ul>
              <p className="mt-5 text-sm text-slate-500 leading-relaxed">
                If that's the fit you're after, no hard feelings — this just isn't that place.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6 bg-vmNavy relative overflow-hidden">
        <div className="absolute inset-0 text-vmMarigold pointer-events-none" aria-hidden>
          <JaliPattern opacity={0.08} />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <Reveal>
            <Eyebrow className="text-vmMarigold mb-6">Wednesdays</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Pull up a chair.</h2>
            <p className="text-white/60 mb-10 leading-relaxed">
              Free, weekly, and genuinely useful. If you're an operator trying to make AI
              earn its keep, this is the room.
            </p>
            <a href={LUMA_URL} target="_blank" rel="noreferrer" className={buttonSecondary}>
              Follow on Luma <ArrowRight className="w-4 h-4" />
            </a>
          </Reveal>
        </div>
      </section>
    </div>
    </>
  );
};

export default CasualIntelligence;
