import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Reveal, Eyebrow, buttonPrimary, buttonSecondary } from '../components/ornaments';
import { ArrowRight, ArrowLeft, ChevronRight, Check, Search } from 'lucide-react';
import { BOOKING_URLS } from '../constants';
import {
  LEAKS, BIZ_TYPES, SHARED_INPUTS, CATEGORY_LABEL,
  conservative, money, byId, findBlindSpot,
} from '../lib/leaks';
import type { LeakDef, LeakInput, Category as LeakCategory } from '../lib/leaks';

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
    label: 'Hot leads you miss',
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
          'Responding to a lead within 5 minutes vs. 30 makes you dramatically more likely to reach and qualify them (Oldroyd Lead Response Management study, MIT/InsideSales). After an hour, the odds collapse.',
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
    label: 'Hours lost to manual work',
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
    label: 'Knowledge stuck in people’s heads',
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

/* ─────────────────────────────────────────────────────────────────────
   The instrument. Everything above is reference content, kept and shown
   underneath — the page used to be only that, which is why nobody ran it.

   Shape follows the evidence on B2B diagnostic assessments: one question
   per screen, visible progress, and nothing asked that doesn't change the
   result. Twelve leaks x three questions would be thirty questions and a
   dead page; we run the two they already suspect, which is usually five.

   The sequencing is the point:
     pick -> answer -> SEE THE NUMBER -> see a blind spot -> then the email.
   Value lands before the gate, so the email buys the written audit rather
   than paying a toll to find out anything at all.

   Arithmetic runs in the browser: instant, free, no lead required to get an
   honest answer. The AI writes the long-form audit afterwards through the
   existing api/lab.ts `deals` generator — whose own prompt already calls it
   a Revenue Leak Audit — with these answers passed as ground truth.
   ───────────────────────────────────────────────────────────────────── */

type Step = 'intro' | 'pick' | 'questions' | 'result' | 'sent';

const fieldCls =
  'w-full px-4 py-3 bg-white border border-slate-300 rounded-sm text-vmNavy ' +
  'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-vmTeal focus:border-transparent';

const LeakAudit: React.FC = () => {
  const [step, setStep] = useState<Step>('intro');
  const [bizType, setBizType] = useState<string>('');
  const [picked, setPicked] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, number>>({});
  const [estimated, setEstimated] = useState<Set<string>>(new Set());
  const [qIndex, setQIndex] = useState(0);

  const [lead, setLead] = useState({ name: '', email: '' });
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  /* Only the inputs the picked leaks actually need, deduped — nobody gets
     asked twice what a customer is worth. Shared inputs are conditional:
     the hourly rate is pointless unless a time-based leak is in play. */
  const questions: LeakInput[] = useMemo(() => {
    const pickedLeaks = picked.map(byId).filter(Boolean) as LeakDef[];
    const timeBased = pickedLeaks.some((l) => ['ownerhours', 'repetitive', 'handoff'].includes(l.id));
    const valueBased = pickedLeaks.some(
      (l) => !l.qualitative && !['ownerhours', 'repetitive', 'handoff'].includes(l.id),
    );
    const seen = new Set<string>();
    const out: LeakInput[] = [];
    const push = (i: LeakInput) => { if (!seen.has(i.key)) { seen.add(i.key); out.push(i); } };

    SHARED_INPUTS.forEach((s) => {
      if (s.key === 'rate' && !timeBased) return;
      if (s.key === 'value' && !valueBased) return;
      push(s);
    });
    pickedLeaks.forEach((l) => l.inputs.forEach(push));
    return out;
  }, [picked]);

  const results = useMemo(() => {
    return (picked.map(byId).filter(Boolean) as LeakDef[])
      .filter((l) => l.compute)
      .map((l) => {
        const merged: Record<string, number> = { ...values };
        [...SHARED_INPUTS, ...l.inputs].forEach((i) => {
          if (merged[i.key] === undefined || Number.isNaN(merged[i.key])) merged[i.key] = i.fallback;
        });
        return { leak: l, amount: conservative(l.compute!(merged)), explain: l.explain?.(merged) ?? '' };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [picked, values]);

  const total = results.reduce((s, r) => s + r.amount, 0);
  const blind = useMemo(() => findBlindSpot(picked, values, bizType), [picked, values, bizType]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? p : [...p, id]));

  const chooseType = (id: string) => {
    setBizType(id);
    const t = BIZ_TYPES.find((b) => b.id === id);
    if (t) setPicked(t.lead);
    setStep('pick');
  };

  const current = questions[qIndex];
  const next = () => (qIndex + 1 < questions.length ? setQIndex(qIndex + 1) : setStep('result'));
  const back = () => (qIndex === 0 ? setStep('pick') : setQIndex(qIndex - 1));

  /* Hands the finished audit to the existing lab engine, which writes the
     long form and emails the designed report — and notifies Suk. */
  const sendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true); setSendError('');
    try {
      const start = await fetch('/api/lab', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', name: lead.name, email: lead.email }),
      }).then((r) => r.json());
      if (start?.error) throw new Error(start.error);

      await fetch('/api/lab', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate', leadId: start.leadId, tool: 'deals',
          input: { transcript: [{ role: 'user', content: auditSummary(bizType, results, blind, total, values) }] },
        }),
      });
      setStep('sent');
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Something went wrong — try again?');
    } finally {
      setSending(false);
    }
  };

  const grouped = (['A', 'B', 'C', 'D'] as LeakCategory[]).map((c) => ({
    c, leaks: LEAKS.filter((l) => l.category === c),
  }));

  return (
    <>
      <SEO
        title="The Leak Audit — find what your business is losing, in your own numbers"
        description="A five-question diagnostic for business owners. Pick the leaks you already suspect, answer a few questions, and see what they cost you a year — plus one you didn't see coming. No email needed for your number."
        path="/leak-audit"
      />

      <div className="bg-vmCream" data-aesthetic="solar">
        <section className="pt-36 pb-20 px-6">
          <div className="max-w-3xl mx-auto">

            {/* ─── INTRO ─── */}
            {step === 'intro' && (
              <Reveal>
                <Eyebrow className="text-accent mb-6">The Leak Audit</Eyebrow>
                <h1 className="font-serif text-vmNavy text-[2.4rem] md:text-[3.6rem] leading-[1.06] mb-7">
                  Most owners can name two.
                  <br />
                  <span className="italic">There are twelve.</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-2xl">
                  About two minutes. You’ll see what the leaks you already suspect are costing
                  you a year — your numbers, rounded down — and one you probably haven’t looked at.
                </p>
                <p className="text-sm text-slate-500 mb-10">
                  No email needed to get your number. Nothing is saved unless you ask for the written version.
                </p>

                <h2 className="text-sm font-semibold text-vmNavy mb-4">First — what kind of business?</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {BIZ_TYPES.map((t) => (
                    <button key={t.id} onClick={() => chooseType(t.id)}
                      className="text-left px-5 py-4 bg-white border border-slate-200 rounded-sm hover:border-vmTeal hover:shadow-sm transition-all text-vmNavy font-medium">
                      {t.label}
                    </button>
                  ))}
                </div>
              </Reveal>
            )}

            {/* ─── PICK ─── */}
            {step === 'pick' && (
              <Reveal>
                <Eyebrow className="text-accent mb-5">Step one of three</Eyebrow>
                <h1 className="font-serif text-vmNavy text-[2rem] md:text-[2.9rem] leading-tight mb-5">
                  Which of these already bother you?
                </h1>
                <p className="text-slate-600 mb-2">
                  Pick up to three. The two most common for your kind of business are already
                  ticked — change them if they’re wrong.
                </p>
                <p className="text-sm text-slate-500 mb-9">
                  You don’t need all twelve. Two done properly beats twelve done vaguely.
                </p>

                <div className="flex flex-col gap-8 mb-10">
                  {grouped.map(({ c, leaks }) => (
                    <div key={c}>
                      <p className="eyebrow text-slate-500 mb-3">{CATEGORY_LABEL[c]}</p>
                      <div className="flex flex-col gap-2">
                        {leaks.map((l) => {
                          const on = picked.includes(l.id);
                          return (
                            <button key={l.id} onClick={() => toggle(l.id)} aria-pressed={on}
                              className={`flex items-start gap-3 text-left px-4 py-3 rounded-sm border transition-all ${
                                on ? 'bg-white border-vmTeal shadow-sm' : 'bg-white/60 border-slate-200 hover:border-slate-300'
                              }`}>
                              <span className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                                on ? 'bg-vmTeal border-vmTeal' : 'border-slate-300'
                              }`}>
                                {on && <Check className="w-3 h-3 text-white" aria-hidden />}
                              </span>
                              <span>
                                <span className="block text-sm font-semibold text-vmNavy">{l.name}</span>
                                <span className="block text-sm text-slate-600 leading-snug">{l.symptom}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={() => { setQIndex(0); setStep('questions'); }}
                    disabled={picked.length === 0}
                    className={buttonPrimary + (picked.length === 0 ? ' opacity-40 pointer-events-none' : '')}>
                    Run the numbers <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setStep('intro')} className="text-sm text-slate-500 hover:text-vmNavy">Back</button>
                </div>
              </Reveal>
            )}

            {/* ─── QUESTIONS ─── */}
            {step === 'questions' && current && (
              <Reveal key={current.key}>
                <div className="mb-10">
                  <div className="flex justify-between eyebrow text-slate-500 mb-2">
                    <span>Question {qIndex + 1} of {questions.length}</span>
                    <span>{Math.round((qIndex / questions.length) * 100)}%</span>
                  </div>
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-vmTeal transition-all duration-300"
                      style={{ width: `${(qIndex / questions.length) * 100}%` }} />
                  </div>
                </div>

                <h1 className="font-serif text-vmNavy text-[1.7rem] md:text-[2.4rem] leading-snug mb-4">
                  {current.label}
                </h1>
                {current.hint && <p className="text-slate-600 mb-7">{current.hint}</p>}

                <div className="flex items-center gap-3 mb-3 max-w-sm">
                  {current.suffix === '$' && <span className="text-2xl font-serif text-slate-500">$</span>}
                  <input
                    className={fieldCls + ' text-xl'} type="number" inputMode="numeric" autoFocus
                    min={current.min} max={current.max}
                    value={values[current.key] ?? ''}
                    placeholder={String(current.fallback)}
                    onChange={(e) => {
                      setValues((v) => ({ ...v, [current.key]: Number(e.target.value) }));
                      setEstimated((p) => { const n = new Set(p); n.delete(current.key); return n; });
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') next(); }}
                  />
                  {current.suffix && current.suffix !== '$' && (
                    <span className="text-slate-500 whitespace-nowrap">{current.suffix}</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setValues((v) => ({ ...v, [current.key]: current.fallback }));
                    setEstimated((p) => new Set(p).add(current.key));
                    next();
                  }}
                  className="text-sm text-slate-500 hover:text-vmNavy underline underline-offset-4 mb-9 block">
                  I don’t know — use a conservative estimate
                </button>

                <div className="flex items-center gap-4">
                  <button onClick={next} className={buttonPrimary}>
                    {qIndex + 1 === questions.length ? 'See what it costs' : 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={back} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-vmNavy">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                </div>
              </Reveal>
            )}

            {/* ─── RESULT ─── */}
            {step === 'result' && (
              <Reveal>
                <Eyebrow className="text-accent mb-5">Your audit</Eyebrow>
                <h1 className="font-serif text-vmNavy text-[1.9rem] md:text-[2.6rem] leading-tight mb-3">
                  Conservatively, this is costing you
                </h1>
                <p className="font-serif text-vmNavy text-[3.2rem] md:text-[5rem] leading-none mb-4 tabular-nums">
                  {money(total)}<span className="text-2xl text-slate-500 font-sans"> a year</span>
                </p>
                <p className="text-slate-600 mb-4 max-w-2xl">
                  {estimated.size === 0
                    ? 'Every figure is your own number, rounded down. Cut the total in half if you like — if it still bothers you, that’s the audit working.'
                    : 'Rounded down throughout. Cut the total in half if you like — if it still bothers you, that’s the audit working.'}
                </p>
                {estimated.size > 0 && (
                  <p className="text-sm text-slate-500 mb-12 max-w-2xl p-4 bg-white border-l-2 border-vmMarigold rounded-sm">
                    <strong className="text-vmNavy">{estimated.size} of these {questions.length} answers
                    used my estimate, not your number.</strong> Conservative ones — but the figure above is
                    only worth what you put into it.{' '}
                    <button onClick={() => { setQIndex(0); setStep('questions'); }}
                      className="text-vmNavy underline underline-offset-4 hover:text-vmTeal">
                      Go back and use your own
                    </button>.
                  </p>
                )}

                <div className="flex flex-col gap-5 mb-12">
                  {results.map((r) => (
                    <div key={r.leak.id} className="p-6 bg-white border border-slate-200 rounded-sm">
                      <div className="flex justify-between items-baseline gap-4 mb-2">
                        <h3 className="font-serif text-lg text-vmNavy">{r.leak.name}</h3>
                        <span className="font-serif text-2xl text-vmNavy tabular-nums">{money(r.amount)}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">{r.explain}</p>
                      <p className="text-sm text-vmNavy"><strong>The fix:</strong> {r.leak.build}</p>
                    </div>
                  ))}
                </div>

                {blind && (
                  <div className="p-7 bg-vmNavy rounded-sm mb-12">
                    <p className="eyebrow text-vmMarigold mb-3">The one you didn’t pick</p>
                    <h3 className="font-serif text-2xl text-white mb-3">{blind.leak.name}</h3>
                    <p className="text-white/75 leading-relaxed mb-4">{blind.leak.symptom}</p>
                    {blind.leak.id === 'invisible' ? (
                      <div className="flex items-start gap-3 p-4 bg-white/10 rounded-sm mb-4">
                        <Search className="w-5 h-5 text-vmTeal shrink-0 mt-0.5" aria-hidden />
                        <p className="text-white/85 text-sm leading-relaxed">
                          <strong className="text-white">Check it in ten seconds.</strong> Open ChatGPT and ask
                          for the best {(BIZ_TYPES.find((b) => b.id === bizType)?.label ?? 'business').toLowerCase()} in
                          your city. Are you in the answer? Who is? That’s the new page two of Google — except
                          nobody ever scrolls there.
                        </p>
                      </div>
                    ) : blind.amount > 0 ? (
                      <p className="text-white/85 mb-4">
                        On numbers like yours this is worth roughly{' '}
                        <strong className="text-vmTeal font-serif text-xl">{money(blind.amount)}</strong> a year —
                        and it wasn’t on your list.
                      </p>
                    ) : null}
                    <p className="text-white/60 text-sm">{blind.leak.build}</p>
                  </div>
                )}

                {/* The gate — after the value, never before it */}
                <div className="p-7 bg-white border-2 border-vmTeal rounded-sm mb-10">
                  <h3 className="font-serif text-xl text-vmNavy mb-2">Want the written version?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    My system will write the full audit from your answers — the arithmetic shown, what to
                    fix first, and the leaks you didn’t pick checked against your business — and email it
                    as a designed report. That report is also month one of any engagement, so it’s the real thing.
                  </p>
                  <form onSubmit={sendReport} className="flex flex-col sm:flex-row gap-3">
                    <input className={fieldCls} required placeholder="Your name"
                      value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
                    <input className={fieldCls} required type="email" placeholder="you@yourbusiness.com"
                      value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
                    <button type="submit" disabled={sending} className={buttonPrimary + ' shrink-0'}>
                      {sending ? 'Writing…' : 'Send it'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                  {sendError && <p className="text-sm text-red-700 mt-3" role="alert">{sendError}</p>}
                </div>

                <div className="pt-8 hairline">
                  <p className="text-slate-600 mb-5">
                    Or skip ahead — bring these numbers to a 20-minute call and we’ll pressure-test them
                    together. You’ll leave with the two highest-return fixes whether or not we work together.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                      Book the call <ChevronRight className="w-4 h-4" />
                    </a>
                    <button onClick={() => { setStep('pick'); setQIndex(0); }} className={buttonSecondary}>
                      Try different leaks <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Reveal>
            )}

            {/* ─── SENT ─── */}
            {step === 'sent' && (
              <Reveal>
                <Eyebrow className="text-accent mb-5">On its way</Eyebrow>
                <h1 className="font-serif text-vmNavy text-[2rem] md:text-[3rem] leading-tight mb-5">
                  Check your inbox in a few minutes.
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-2xl">
                  It’s being written now — the full audit against your numbers, the other leaks checked,
                  and what I’d fix first. It arrives as a designed report you can forward to whoever else
                  needs to see it.
                </p>
                <p className="text-slate-500 mb-10">
                  If it hasn’t arrived in ten minutes, check spam — then email me directly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                    Book 20 minutes <ChevronRight className="w-4 h-4" />
                  </a>
                  <Link to="/expansion-os" className={buttonSecondary}>
                    Month one of Expansion OS is this audit <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* ─── REFERENCE — the full twelve, only on the way in ─── */}
        {step === 'intro' && (
          <>
            <section className="py-16 px-6 bg-white border-t border-slate-200">
              <div className="max-w-5xl mx-auto">
                <Reveal className="mb-8">
                  <Eyebrow className="text-accent mb-3">Where to start</Eyebrow>
                  <h2 className="font-serif text-2xl md:text-3xl text-vmNavy">Your first leaks, by business type</h2>
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

            {CATEGORIES.map((cat) => (
              <section key={cat.id} className={`py-16 px-6 ${cat.id === 'B' || cat.id === 'D' ? 'bg-vmSlate/40' : 'bg-white'}`}>
                <div className="max-w-4xl mx-auto">
                  <Reveal className="mb-10">
                    <Eyebrow className="text-accent mb-3">Category {cat.id}</Eyebrow>
                    <h2 className="font-serif text-2xl md:text-3xl text-vmNavy mb-3">{cat.label}</h2>
                    <p className="text-slate-500 italic">{cat.tagline}</p>
                  </Reveal>

                  <div className="space-y-8">
                    {cat.leaks.map((leak, i) => (
                      <Reveal key={leak.n} delay={i * 50}>
                        <article id={`leak-${leak.n}`} className="bg-white border border-slate-200 rounded-sm p-6 md:p-8 shadow-sm">
                          <div className="flex items-baseline gap-4 mb-4">
                            <span className="font-serif text-3xl text-accent leading-none">{String(leak.n).padStart(2, '0')}</span>
                            <h3 className="font-serif text-xl md:text-2xl text-vmNavy">
                              {leak.name}
                              {leak.sub && <span className="text-slate-500 text-lg ml-2">— {leak.sub}</span>}
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
          </>
        )}
      </div>
    </>
  );
};

/* Everything the writing model needs, in plain language. The lab generator
   treats the transcript as ground truth, so this reads like the owner
   talking rather than a form dump. */
function auditSummary(
  bizType: string,
  results: { leak: LeakDef; amount: number; explain: string }[],
  blind: { leak: LeakDef; amount: number } | null,
  total: number,
  values: Record<string, number>,
): string {
  const type = BIZ_TYPES.find((b) => b.id === bizType)?.label ?? 'a service business';
  const lines = results.map((r) => `- ${r.leak.name}: ${money(r.amount)}/yr. ${r.explain}`).join('\n');
  const inputs = Object.entries(values).map(([k, v]) => `${k}=${v}`).join(', ');
  return [
    `I run ${type}. I just completed the Leak Audit on visionmanagers.com — these are my real answers.`,
    '',
    'The leaks I picked, and what the calculator made them worth:',
    lines,
    '',
    `Conservative annual total: ${money(total)}.`,
    blind ? `The blind spot it surfaced: ${blind.leak.name}${blind.amount ? ` (~${money(blind.amount)}/yr)` : ''}.` : '',
    '',
    `Raw inputs: ${inputs}.`,
    '',
    'Write my full Revenue Leak Audit from this. Use my numbers, round down, show the arithmetic, tell me what to fix first and why, and check the leaks I did not pick against what you can learn about my business.',
  ].filter(Boolean).join('\n');
}

export default LeakAudit;
