import React from 'react';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import { Reveal, Eyebrow, buttonPrimary } from '../components/ornaments';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { BOOKING_URLS } from '../constants';

interface Leak {
  n: number;
  name: string;
  sub?: string;
  reality: string;
  questions: string[];
  math: string;
  fix: string;
}

interface Category {
  id: string;
  label: string;
  tagline: string;
  leaks: Leak[];
}

const CATEGORIES: Category[] = [
  {
    id: 'A',
    label: 'Demand you already paid for, then lost',
    tagline: 'Marketing money was spent. The lead exists. Revenue dies in the handling.',
    leaks: [
      {
        n: 1,
        name: 'The Phone Leak',
        reality:
          'Small businesses live-answer only about 38% of incoming calls (411 Locals study). And most callers who hit voicemail don’t try again — they call the next name on the list.',
        questions: [
          'How many calls come in a week? Who answers after 5pm? On Saturdays?',
          'What is a new patient or client worth to you over a year?',
        ],
        math: 'missed calls/week × 52 × close rate × customer lifetime value',
        fix: 'A voice agent that answers every call, every hour, in your practice’s language.',
      },
      {
        n: 2,
        name: 'The Speed Leak',
        reality:
          'Responding to a lead within 5 minutes vs. 30 makes you dramatically more likely to reach and qualify them (MIT/InsideSales research). After an hour, the odds collapse.',
        questions: [
          'A form comes in Saturday 9am — when does a human respond?',
          'What happened to last month’s unreturned inquiries?',
        ],
        math: 'leads/month × % responded to slowly × drop-off × close rate × value',
        fix: 'Instant-response automation that reaches back in seconds and qualifies while interest is hot.',
      },
      {
        n: 3,
        name: 'The Follow-Up Leak',
        reality:
          'Most businesses have no systematic follow-up on missed contacts at all. No sequence, no CRM discipline — paid-for leads dying silently in the first 30 days.',
        questions: [
          'How many quotes or consults from the last 90 days never got a second touch?',
          'What did each of those leads cost to acquire?',
        ],
        math: 'untouched leads/quarter × 4 × sequence close rate × value',
        fix: 'Automated nurture sequences wired into your CRM, so no lead dies without a real conversation.',
      },
      {
        n: 4,
        name: 'The Stale-Lead Leak',
        sub: 'the graveyard',
        reality:
          'Different from follow-up: this is the database. Every dead quote, no-show, past customer, and old inquiry from the last 2–5 years that nobody has touched since. It’s the cheapest revenue in the business — acquisition was already paid for. Reactivating even 3–5% of a dormant list is often the fastest cash an owner has ever seen.',
        questions: [
          'How many contacts sit in your CRM, inbox, or spreadsheets from the last three years that never closed or never came back?',
          'When did a past customer last hear from you without an invoice attached?',
          'For practices: what % of patients are overdue for their recall exam right now?',
        ],
        math: 'dormant contacts × 3% reactivation × customer value — a 1,000-contact graveyard at $1,500 value is $45K sitting in a spreadsheet',
        fix: 'A database reactivation campaign — usually the quick win that pays for everything else.',
      },
      {
        n: 5,
        name: 'The Second-Look Leak',
        sub: 'retargeting',
        reality:
          'Average website conversion runs 2–3% (Contentsquare benchmark, 46 billion sessions) — meaning roughly 97 of every 100 first-time visitors leave without converting. For most small businesses, that’s the last touch ever: no capture, no list, no retargeting. Every visitor was paid for (ads, SEO, referral goodwill) and evaporates.',
        questions: [
          'Of 100 people who visit your site this month, how many can you ever contact again?',
          'What do people who almost bought see from you the following week? (The usual answer: nothing.)',
        ],
        math: 'monthly visitors × 97% lost × a 2–3% recapture-and-convert rate × value',
        fix: 'Lead capture, a nurture list, and a retargeting content engine that gives near-buyers a second look.',
      },
    ],
  },
  {
    id: 'B',
    label: 'Time bought at expert prices, spent on robot work',
    tagline: 'Payroll and founder hours doing what software does for free.',
    leaks: [
      {
        n: 6,
        name: 'The Owner-Hours Leak',
        reality:
          'Hours every week the owner spends on work a system should do — scheduling, intake, content, reporting, chasing invoices. Usually 10–15 hours a week. At a $200/hr effective value, that’s $100K+ a year of misallocated founder time. And it’s worse than the math: those are the only hours that could have gone to growth.',
        questions: [
          'Walk through last Tuesday. Which of those hours actually required you?',
          'What would you build or sell with 10 hours back a week?',
        ],
        math: 'owner hrs/week on delegatable work × effective hourly value × 50',
        fix: 'An operating system for the business — so your hours go where only you can go.',
      },
      {
        n: 7,
        name: 'The Repetitive-Task Leak',
        sub: 'death by twenty minutes',
        reality:
          'The staff version. Data entry, copy-paste between tools, manual scheduling, the same email written again, the same quote rebuilt, the same report assembled. No single task looks expensive — but a 20-minute task done 15 times a week across 3 staff is 780 hours a year.',
        questions: [
          'What does your best person do every week that makes them roll their eyes?',
          'How long does one quote, report, or invoice take — times how many per week?',
          'What gets retyped from one system into another?',
        ],
        math: '(task minutes × times/week × people ÷ 60) × loaded hourly rate × 52 — run it for just your top three tasks',
        fix: 'Automation workflows that do the robot work, so your people do people work.',
      },
      {
        n: 8,
        name: 'The Handoff Leak',
        reality:
          'Time lost between people: chasing status, re-explaining context, finding the file, meetings that exist only because information isn’t written anywhere. It shows up as "everything routes through me" and interruptions all day.',
        questions: [
          'How many times a day does someone ask you something a system should answer?',
          'How long does a new request take to get from intake to the person who’ll actually do the work?',
        ],
        math: 'interruptions/day × minutes × people involved × 250 days — directional, and usually humbling',
        fix: 'A shared source of truth plus an AI assistant that answers from your business’s own documents.',
      },
    ],
  },
  {
    id: 'C',
    label: 'Knowledge that leaves, training that never lands',
    tagline: 'The business runs on what’s in people’s heads — and heads walk out the door.',
    leaks: [
      {
        n: 9,
        name: 'The Training Leak',
        reality:
          'Three costs hiding as one. Slow ramp: new hires at half productivity for months because training is "shadow Linda." Tribal knowledge: a critical process lives in one person’s head, and the business is one resignation from chaos. Inconsistency: customers get a different experience depending on who they get and what day it is — which quietly erodes the reputation the whole business runs on.',
        questions: [
          'How long until a new hire is genuinely productive — and what are you paying them during that gap?',
          'If your key person gave notice tomorrow, what walks out with them?',
          'Does a customer get the same experience from your best person and your newest?',
        ],
        math: '(ramp months × salary × 50% productivity gap) + (turnover events × replacement and retraining cost) + the cost of repeat mistakes',
        fix: 'SOPs generated from recorded walkthroughs, a training assistant trained on your own documents, and onboarding that runs itself.',
      },
    ],
  },
  {
    id: 'D',
    label: 'Money you never asked for',
    tagline: 'Not lost revenue — unrequested revenue. The strategy leaks.',
    leaks: [
      {
        n: 10,
        name: 'The Offer Leak',
        reality:
          'Underpricing held for years out of fear. No upsell, cross-sell, or bundle. One offer, one price, no next step. No renewal or retention motion — the business re-earns every customer from scratch. Existing customers are far likelier to buy again than strangers are to buy at all — and most businesses only ever ask strangers.',
        questions: [
          'When did you last raise prices — and what actually happened?',
          'What % of your clients buy a second thing from you?',
          'What should every customer be offered at completion that isn’t? What happens at renewal — do you ask, or hope?',
        ],
        math: 'active clients × one unoffered next purchase × a realistic take rate — or simply last year’s revenue × the price increase you’ve been afraid of',
        fix: 'Offer architecture plus automated recall, upsell, and renewal campaigns.',
      },
      {
        n: 11,
        name: 'The Market-Blindness Leak',
        reality:
          'Decisions made by gut in the dark: no voice-of-customer data, no review mining, no competitor watch, no idea which service is actually most profitable or why your best customers really chose you. This is the multiplier on every other leak — marketing money aimed by guesswork amplifies waste everywhere.',
        questions: [
          'In your customers’ own words — not yours — why do they pick you?',
          'When did you last read 50 of your (and your competitors’) reviews in one sitting?',
          'Which service line is most profitable — and is that the one your marketing pushes?',
        ],
        math: 'hard to annualize honestly — but every dollar in every other leak is aimed by this one',
        fix: 'An AI research stack: review mining, call-transcript analysis, competitor monitoring, offer testing.',
      },
      {
        n: 12,
        name: 'The Invisible Leak',
        sub: 'not found, not chosen',
        reality:
          'No content engine, thin reviews, weak buying experience — and the new front: absence from AI answers. When someone asks ChatGPT or Google’s AI for "best [your service] near [your city]" and your business isn’t in the answer, that’s the new page two of Google. Nobody scrolls there.',
        questions: [
          'Ask ChatGPT right now: "best [your service] in [your city]." Are you in the answer? Who is?',
          'How many reviews did you get last month versus them?',
          'When someone lands on your site at 11pm, what can they actually do?',
        ],
        math: 'stays qualitative — but put your competitor’s name in the question and sit with it',
        fix: 'A content engine, a review system, and a buying journey that works while you sleep.',
      },
    ],
  },
];

const SELECTOR: { type: string; start: string; then: string }[] = [
  { type: 'Medical / dental / optometry practice', start: 'Phone (1) · Stale-Lead recalls (4)', then: 'Speed (2) · Training (9) · AI-search (12)' },
  { type: 'Trades / home services', start: 'Phone (1) · Speed (2)', then: 'Stale quotes (4) · Repetitive quoting (7) · Offer (10)' },
  { type: 'Law / professional services', start: 'Speed (2) · Follow-Up (3)', then: 'Owner-Hours (6) · Offer (10) · Handoff (8)' },
  { type: 'Agency / boutique / consulting', start: 'Owner-Hours (6) · Repetitive (7)', then: 'Offer (10) · Market-Blindness (11) · Second-Look (5)' },
  { type: 'Wellness / fitness / membership', start: 'Stale-Lead (4) · Offer & retention (10)', then: 'Invisible (12) · Second-Look (5) · Training (9)' },
];

const LeakAudit: React.FC = () => {
  return (
    <>
      <SEO
        title="The Leak Audit — 12 Ways Your Business Is Quietly Losing Money"
        description="A diagnostic for established business owners: twelve leaks across demand, time, knowledge, and strategy — with the questions and the math to run your own numbers."
        path="/leak-audit"
      />
      {/* Hidden page: shared by direct link only — keep out of search indexes */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-white" data-aesthetic="solar">
        {/* ─── HERO ─── */}
        <section className="relative pt-44 pb-24 px-6 light-wash overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <Eyebrow className="text-accent mb-6">The Leak Audit</Eyebrow>
              <h1 className="font-serif text-4xl md:text-6xl text-vmNavy leading-tight mb-6">
                Your business is leaking money in twelve places.
                <br className="hidden md:block" />
                <span className="text-vmInk/70">Most owners can name two.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
                This is the diagnostic we run with established business owners. Four categories, twelve leaks —
                each with the questions to ask and the math to run. Use your numbers, round down, and total it.
                For a real service business the honest answer usually lands in six figures a year.
              </p>
              <p className="text-sm text-slate-500 mb-10">
                You don’t need all twelve. Find your business type in the table below, read your three or four, and run the math.
              </p>
              <a href="#selector" className={buttonPrimary}>
                Find your leaks <ArrowDown size={16} />
              </a>
            </Reveal>
          </div>
        </section>

        {/* ─── SELECTOR ─── */}
        <section id="selector" className="py-20 px-6 bg-vmSlate/40">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-10">
              <Eyebrow className="text-accent mb-4">Where to start</Eyebrow>
              <h2 className="font-serif text-3xl md:text-4xl text-vmNavy">Your first three leaks, by business type</h2>
            </Reveal>
            <Reveal>
              <div className="overflow-x-auto rounded-sm border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-vmNavy">
                      <th className="px-5 py-4 font-semibold">Business</th>
                      <th className="px-5 py-4 font-semibold">Start with</th>
                      <th className="px-5 py-4 font-semibold">Then look at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SELECTOR.map((row) => (
                      <tr key={row.type} className="border-b border-slate-100 last:border-0">
                        <td className="px-5 py-4 font-medium text-vmNavy">{row.type}</td>
                        <td className="px-5 py-4 text-slate-600">{row.start}</td>
                        <td className="px-5 py-4 text-slate-600">{row.then}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── THE TWELVE LEAKS ─── */}
        {CATEGORIES.map((cat) => (
          <section key={cat.id} className={`py-20 px-6 ${cat.id === 'B' || cat.id === 'D' ? 'bg-vmSlate/40' : ''}`}>
            <div className="max-w-4xl mx-auto">
              <Reveal className="mb-12">
                <Eyebrow className="text-accent mb-3">Category {cat.id}</Eyebrow>
                <h2 className="font-serif text-3xl md:text-4xl text-vmNavy mb-3">{cat.label}</h2>
                <p className="text-slate-500 italic">{cat.tagline}</p>
              </Reveal>

              <div className="space-y-10">
                {cat.leaks.map((leak, i) => (
                  <Reveal key={leak.n} delay={i * 60}>
                    <article id={`leak-${leak.n}`} className="bg-white border border-slate-200 rounded-sm p-7 md:p-9 shadow-sm">
                      <div className="flex items-baseline gap-4 mb-4">
                        <span className="font-serif text-3xl text-accent leading-none">{String(leak.n).padStart(2, '0')}</span>
                        <h3 className="font-serif text-2xl text-vmNavy">
                          {leak.name}
                          {leak.sub && <span className="text-slate-400 text-lg ml-2">— {leak.sub}</span>}
                        </h3>
                      </div>

                      <p className="text-slate-600 leading-relaxed mb-6">{leak.reality}</p>

                      <div className="mb-6">
                        <p className="text-xs font-semibold tracking-widest uppercase text-vmNavy/60 mb-3">Ask yourself</p>
                        <ul className="space-y-2">
                          {leak.questions.map((q) => (
                            <li key={q} className="flex gap-3 text-slate-700">
                              <span className="text-accent mt-1 shrink-0">→</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-6 bg-vmSlate/60 border-l-2 border-accent px-5 py-4">
                        <p className="text-xs font-semibold tracking-widest uppercase text-vmNavy/60 mb-1">Your math</p>
                        <p className="text-vmNavy font-mono text-sm">{leak.math}</p>
                      </div>

                      <p className="text-sm text-slate-500">
                        <span className="font-semibold text-vmNavy">The fix we build: </span>
                        {leak.fix}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ─── CLOSE ─── */}
        <section className="py-24 px-6 bg-vmNavy text-white relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <Reveal>
              <Eyebrow className="text-vmTeal mb-6">The total</Eyebrow>
              <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-6">
                Add up your three or four leaks. Conservatively.
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Use your own numbers, round everything down, and cut the total in half if you want.
                If the number still bothers you, that’s the audit working — the status quo is the expensive option.
              </p>
              <p className="text-white/60 mb-10">
                Bring your numbers to a free 20-minute call. We’ll pressure-test the math together, and you’ll
                leave with the two highest-ROI fixes for your business — whether or not we ever work together.
              </p>
              <a
                href={BOOKING_URLS.DISCOVERY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-vmTeal text-vmNavy text-sm font-bold tracking-wide rounded-sm hover:bg-white transition-all duration-200"
              >
                Run your numbers with me <ArrowRight size={16} />
              </a>
              <p className="text-white/40 text-xs mt-6">
                Free, diagnosis only. If the audit finds nothing, you lost twenty minutes.
              </p>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
};

export default LeakAudit;
