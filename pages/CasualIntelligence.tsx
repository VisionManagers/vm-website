
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
  { title: 'Second-mind systems', desc: 'Obsidian + Claude stacks built live, from daily dashboard to a knowledge base that compounds.' },
  { title: 'CRM that maintains itself', desc: 'Pipelines that ingest your meetings and keep themselves current.' },
  { title: 'Agents & automation', desc: 'Multi-agent setups, local models, and the smallest chunk of work worth automating first.' },
  { title: 'AI compliance', desc: 'Recording consent, HIPAA posture, and state-by-state AI law in plain English.' },
  { title: 'Deep research & memory', desc: 'Research workflows and memory systems that survive past one chat.' },
  { title: 'Platform-agnostic AI', desc: 'Claude, ChatGPT, Gemini, local models. Build so you never marry one vendor.' },
];

const SESSIONS = [
  {
    name: 'Brandon Drake',
    title: 'A CRM that updates itself',
    detail: 'Walked the room through MINT, the framework he runs across 6,000+ contacts. It ingests his meetings and keeps itself current.',
  },
  {
    name: 'Dara Pressley',
    title: 'The $100-a-month Claude stack',
    detail: 'Showed the Claude setup that replaced her SaaS subscriptions, piece by piece, and what each piece actually does.',
  },
  {
    name: 'Nick Romanek',
    title: 'Mission Control in 20 hours',
    detail: 'Demoed the multi-agent automation he built in 20 hours, live, including the parts that took the longest to get right.',
  },
];

const CasualIntelligence: React.FC = () => {
  return (
    <>
    <SEO
      title="Casual Intelligence — Weekly AI Roundtable"
      description="A free weekly roundtable where operators show how they actually use AI — live builds, real workflows, no sales pitches. Wednesdays, hosted by Vision Managers."
      path="/ci"
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
            <Eyebrow className="text-accent mb-6">Wednesdays · one hour · free</Eyebrow>
            <h1 className="font-serif text-vmNavy text-4xl md:text-6xl leading-[1.08] mb-8">
              Casual Intelligence.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl mx-auto">
              Every Wednesday, one operator opens up a system they actually run
              and shows the room how it works. Real builds, honest numbers, no
              pitches. You leave with something to try before Friday.
            </p>
            <div className="flex flex-col items-center justify-center gap-3">
              <a href="#upcoming" className={buttonPrimary}>
                See upcoming sessions & RSVP <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-xs text-slate-400">
                One hour on Zoom. No prep needed. Nobody sells you anything.
              </p>
            </div>
            <p className="mt-6 text-xs text-slate-400">
              This page is the invite. Share visionmanagers.com/ci and someone
              you know can be in the room Wednesday.
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
              and hit Follow — every session lands on your calendar.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── THE FORMAT ─── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <Eyebrow className="text-accent mb-4">The format</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-5">What a Wednesday looks like.</h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              No keynote. No panel. The same hour, every week:
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { n: '01', title: 'Someone shows their work', desc: 'An operator shares their screen and walks through a system they actually run. Warts included.' },
              { n: '02', title: 'The room digs in', desc: 'Questions, edge cases, "would this survive my front desk?" The questions are half the value.' },
              { n: '03', title: 'You take it home', desc: 'A recap lands the next day: the framework, the tools, what to try this week.' },
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

      {/* ─── FROM THE ROUNDTABLE — named proof ─── */}
      <section className="py-24 px-6 bg-vmSlate/40">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <Eyebrow className="text-accent mb-4">From the roundtable</Eyebrow>
            <h2 className="text-3xl font-serif text-vmNavy">Real people, showing real systems.</h2>
          </Reveal>
          <div className="space-y-8">
            {SESSIONS.map((session, i) => (
              <Reveal key={session.name} delay={i * 80}
                className="flex items-start gap-6 p-8 border border-slate-200 rounded-sm bg-white">
                <CalendarDays className="w-6 h-6 text-accent shrink-0 mt-1" aria-hidden />
                <div>
                  <h3 className="font-semibold text-vmNavy mb-1">{session.title}</h3>
                  <p className="text-xs text-accent mb-3 uppercase tracking-wide">{session.name}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{session.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOPICS — nested tile grid (self-similar repetition) ─── */}
      <section className="py-24 px-6 relative overflow-hidden">
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
                <li>You show your work, including the parts that broke.</li>
                <li>You come back. The relationships are where the compounding happens.</li>
              </ul>
            </Reveal>
            <Reveal delay={120} className="p-8 bg-white border border-slate-200 rounded-sm">
              <h3 className="font-serif text-xl text-vmNavy mb-4">It's not the room for</h3>
              <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <li>Pitching from the front. Nobody sells here, including us.</li>
                <li>Showing off a result without sharing the how.</li>
                <li>Collecting an audience instead of joining a conversation.</li>
              </ul>
              <p className="mt-5 text-sm text-slate-500 leading-relaxed">
                If that's the fit you're after, no hard feelings. This just isn't that place.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── THE HOST ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
              <img
                src="/images/vm/sukh-portrait.jpg"
                alt="Sukhneet Virk, host of Casual Intelligence"
                loading="lazy"
                className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-sm border border-slate-200 mx-auto md:mx-0"
              />
              <div className="text-center md:text-left">
                <Eyebrow className="text-accent mb-4">Why this room exists</Eyebrow>
                <p className="text-slate-600 leading-relaxed mb-4">
                  "The most useful AI advice I ever got came from another operator
                  showing me their screen. Not a feed, not a keynote. A screen share
                  and an honest 'here's what broke.' So that's the whole format.
                  And the no-pitching rule applies to me too: Vision Managers
                  doesn't sell from this room."
                </p>
                <p className="text-sm text-vmNavy font-semibold">Sukhneet Virk</p>
                <p className="text-xs text-slate-500">Host · Vision Managers</p>
              </div>
            </div>
          </Reveal>
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
              If you're building something real and want AI to earn its keep in it,
              there's a seat for you this Wednesday.
            </p>
            <a href={LUMA_URL} target="_blank" rel="noreferrer" className={buttonSecondary}>
              Save your seat on Luma <ArrowRight className="w-4 h-4" />
            </a>
            <p className="mt-4 text-xs text-white/40">
              Follow once and every session lands on your calendar.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
    </>
  );
};

export default CasualIntelligence;
