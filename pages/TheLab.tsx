import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BOOKING_URLS } from '../constants';
import {
  Reveal, Eyebrow, VineDivider, LeafMark, LaurelSprig,
  buttonPrimary, buttonTealOnNavy,
} from '../components/ornaments';
import { Calculator, Check, ArrowRight, Sprout } from 'lucide-react';
import type { CaseStudy } from '../types';

// Case studies — add real engagements here as they're completed.
// Template:
// {
//   id: 'short-slug',
//   title: 'What Was Built',
//   client: 'Client Name or "Practice Name, City, ST"',
//   industry: 'Healthcare' | 'Real Estate' | 'Legal' | etc.,
//   challenge: '1-2 sentences: the pain point before VM.',
//   solution: '1-2 sentences: what VM deployed.',
//   results: ['Metric-driven result 1', 'Metric-driven result 2', 'Metric-driven result 3'],
//   metric: 'The headline number (e.g. "$4,300+", "87%", "5")',
//   metricLabel: 'Short label for the metric (e.g. "Revenue Booked Week One")',
// }
const CASE_STUDIES: CaseStudy[] = [
  {
    // Bellevue eye care practice — voice agent live since Aug 2026. The practice is
    // deliberately unnamed (Suk 9/25: "an anonymous practice in the Bellevue area");
    // never name it on any public surface. $4,300 / 5 appts / 2 days are the WIN row in
    // numbers-ledger.md. "Within days," never "first week."
    id: 'bellevue-eyecare-voice-agent',
    title: 'A voice agent that books straight into the schedule',
    client: 'An eye care practice — Bellevue, WA (name withheld)',
    industry: 'Eye care · Voice AI',
    challenge:
      'After-hours and overflow calls were going to voicemail, and the patients on them were walking. Nobody could say how many, because a voicemail that never becomes a callback leaves no trace.',
    solution:
      'Mapped where patients were being lost, then designed and deployed a voice agent that answers every call, captures who is calling and when they want to be seen, and books straight into the schedule — handing off to staff when a caller needs a person.',
    results: [
      '5 appointments booked in the first 2 days live — $4,300+ in scheduled visit value',
      'Every appointment request lands in the front desk’s inbox automatically, no callback queue',
      'Answering live patient calls every day since August 2026, with no staff added',
    ],
    metric: '$4,300+',
    metricLabel: 'booked within days of going live',
  },
  {
    // Wolf & Wolf bid writer — delivered 2026-09-17. Permission GRANTED (name +
    // company + bid count) on the recording; every number is in numbers-ledger.md.
    // No time-saved claim: his after-number isn't collected yet (check-in 9/24).
    id: 'wolf-and-wolf-bid-writer',
    title: 'A bid writer built from 745 of his own bids',
    client: 'Chris Wolf, Wolf & Wolf — Eastside, WA',
    industry: 'Roofing & exteriors',
    challenge:
      'Every bid was typed by hand in Word: ten to fifteen minutes for a roof, up to an hour for the complicated ones, five to eight a week. ChatGPT and Copilot had both broken his formatting, so he’d stopped booking jobs on the spot.',
    solution:
      'Read all 745 of his bids from 2023–2026, rebuilt his estimating on his own rate card, and installed it inside his own ChatGPT. It shows the arithmetic first, refuses to price anything it has no rate for, and hands back a Word bid in his house format.',
    results: [
      'Pricing checked against 80 of his own roof bids: 4.7% median error, no lean high or low',
      'Installed in a 20-minute walkthrough with him driving; the first bid built live from a two-line description',
      '“This was a very easy process. I’m impressed with your professionalism and I’m excited to use my new AI helper.”',
    ],
    metric: '745',
    metricLabel: 'of his bids, read end to end',
  },
  {
    // Emerald Health — the compounding account. Delivered facts only: website (with a
    // dev partner), client interviews → video testimonials, phone audit + migration scope.
    // The physician is anonymized (her permission covers Emerald's use, not ours). The
    // phone port and reporting dashboard are NOT results yet — add lines when they land.
    id: 'emerald-health-compounding-account',
    title: 'One billing company, three systems, one accountable builder',
    client: 'Emerald Health — medical billing (RCM) for 15+ practices',
    industry: 'Healthcare · revenue cycle',
    challenge:
      'A growing billing company with teams in two countries had a website that didn’t sell, client wins nobody had captured on record, and a phone carrier that blocked their texting and offered no support when it did.',
    solution:
      'Started with the website. Then ran the client interviews ourselves — research-grade, on camera — and cut them into testimonials. Then audited the phone stack against five carriers and scoped the migration. Each piece paid for the next conversation.',
    results: [
      'A physician client’s interview became a video testimonial — and that practice then signed a credentialing contract with Emerald',
      'Phone migration scoped and the provider chosen: 9 numbers to 12 lines, texting unblocked, five carriers compared on the client’s own call data',
      'Reporting across 7–8 billing systems mapped next, so team leads stop spending 1–2 days a month per client assembling it by hand',
    ],
    metric: '3',
    metricLabel: 'systems, one client, one builder',
  },
  {
    // Phoenix Log — VM's own product, not a client engagement; say so on the card.
    // Numbers pulled live from the app's database 2026-09-25 (numbers-ledger.md) —
    // refresh them on every Lab pass; they move weekly.
    id: 'phoenix-log',
    title: 'A daily log with an AI coach that reads it back',
    client: 'Phoenix Log (phnxlog.com) — our own product',
    industry: 'Product build · coaching',
    challenge:
      'The founder had 2,000+ days of his own daily tracking, and a coaching group whose members dropped their reports into a group chat, where every insight got buried by the next message. The first version of the app was lost with its no-code host.',
    solution:
      'Rebuilt from a blank repo on our own stack in September 2026: a 60-second nightly log, an AI coach that reads the last 30 days and answers in plain words, field reports, a life audit, a tap counter for the day, a roster view for coaches, calendar reminders, segment email, and billing.',
    results: [
      'Rebuilt and live in 11 days, with all 235 of the founder’s own entries imported on day one',
      '17 beta testers in the first 11 days; 5 of them logged this week',
      '60 AI coach reads delivered since the rebuild — 42 on daily logs, 18 on field reports',
    ],
    metric: '11',
    metricLabel: 'days from blank repo to live product',
  },
  {
    // Sunny Sarah — website build, Feb 19 → Mar 27, 2026 (Granola). Build facts only;
    // her verbatims are in proof-library with permission not-asked, so none are here.
    id: 'sunny-sarah-website',
    title: 'A wellness site the owner now runs herself',
    client: 'Sunny Sarah — whole-food nutrition & wellness (sunnysarah.net)',
    industry: 'Website · solo wellness business',
    challenge:
      'Thirty years of nutrition guidance and a product line, on a site she couldn’t touch. Every change went through someone else, so nothing changed.',
    solution:
      'Rebuilt the site on a platform she can edit herself: her story, products, a downloadable guide, a quiz with personalized results, a booking link at every contact point, blog and newsletter. Then trained her to publish her own updates.',
    results: [
      'Kicked off February 19, live on her own domain March 27, 2026',
      'Editing and publishing her own pages and newsletter within three months of launch',
      'Monthly maintenance retired on purpose — the site is hers to run',
    ],
    metric: '5 wks',
    metricLabel: 'from kickoff to live on her domain',
  },
  {
    // My Better Life Mentor — full rebuild off a broken WordPress site, kicked off
    // Mar 4, 2026; May revision + team access; ownership transfer to her own account
    // in progress (Sept). Build facts only; her verbatims are permission not-asked.
    id: 'my-better-life-mentor-website',
    title: 'A broken WordPress site replaced with one that says what she does',
    client: 'Joni Johnson, My Better Life Mentor — life coach, Navarre, FL (mybetterlifementor.com)',
    industry: 'Website · coaching practice',
    challenge:
      'A WordPress site that had broken, with copy that listed credentials instead of the reasons her clients actually come in: depression, anxiety, feeling stuck.',
    solution:
      'Rebuilt from scratch: symptom-led copy her clients recognize themselves in, a 15-minute consultation one tap from every page, a testimonials page, her military and first-responder work, local SEO for Navarre — plus team access so she and her assistant can edit it and read the analytics themselves.',
    results: [
      'Kicked off March 4, 2026; first revision round shipped in May with team access handed over',
      'Google Business Profile and local search pointed at the new site',
      'Ownership moving into her own account — the way every build we do is meant to end',
    ],
    metric: 'Hers',
    metricLabel: 'editable, transferable, owned by the client',
  },
];

/* Honest pipeline — things being grown right now. No fake proof. */
const GREENHOUSE = [
  {
    title: 'AI Readiness Score',
    desc: 'An 8-question assessment that scores how prepared your practice is for AI — and exactly where the gaps are.',
    status: 'In development',
  },
  {
    title: 'Call the demo line',
    desc: 'A live voice agent you can phone and try to stump — the AI receptionist answers at (425) 494-4489, linked from The Workbench.',
    status: 'Live now',
  },
  {
    title: '3D equipment teardowns',
    desc: 'Scroll-driven, interactive breakdowns of real clinical equipment — see every component of a machine as you move down the page.',
    status: 'Queued',
  },
  {
    title: 'Learn: AI from zero',
    desc: 'A leveled AI-literacy track — three short courses from "what is AI" to prompting as a reusable business asset.',
    status: 'Recording',
  },
];

/* Systems we run our own business on — every claim literally true. */
const IN_USE = [
  {
    title: 'The discovery pipeline',
    desc: 'Book a call and you experience the product: the conversation is ingested by our system and your AI Opportunity Snapshot — your #1 opportunity, sized in dollars — arrives in writing the next day.',
    hint: 'Experience it: book the 20-minute call.',
  },
  {
    title: 'The second-mind CRM',
    desc: 'An Obsidian + Claude system that reads our meetings and email, updates 90+ relationship records, flags who to follow up with, and keeps every promise dated. It runs this entire business, daily.',
    hint: 'Ask to see it live on a call.',
  },
  {
    title: 'VM Voice, in production',
    desc: 'The same voice agents we sell, answering for real practices right now — designed conversation by conversation.',
    hint: 'Read the voice-agent case study above.',
    to: '/lab#case-studies',
  },
  {
    title: 'The AI-training kit',
    desc: 'A live training cohort built from a tested session structure — starter templates, first prompts, and a build-it-in-session format.',
    hint: 'Cohorts run monthly.',
  },
];

const TheLab: React.FC = () => {
  // ROI State
  const [monthlyCalls, setMonthlyCalls] = useState(200);
  const [avgValue, setAvgValue] = useState(1500);
  const [missedRate, setMissedRate] = useState(15);

  const unansweredCalls = Math.round(monthlyCalls * (missedRate / 100));
  const monthlyRevenueAtRisk = Math.round(unansweredCalls * avgValue);
  const annualImpact = monthlyRevenueAtRisk * 12;

  return (
    <>
    <SEO
      title="The Lab"
      description="Working AI tools you can try: ROI calculator, live demos, and real builds from Vision Managers engagements. Proof, not promises."
      path="/lab"
    />
    <div className="pt-40 pb-24 min-h-screen light-wash" data-aesthetic="solar">
      <div className="max-w-7xl mx-auto px-6">

        {/* ─── HEADER ─── */}
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <Reveal>
            <Eyebrow className="text-accent mb-6">Working proof · not promises</Eyebrow>
            <h1 className="text-5xl md:text-6xl font-serif text-vmNavy mb-8 leading-tight italic">The Lab.</h1>
            <p className="text-slate-600 text-xl leading-relaxed">
              Things we've actually built — live, usable, and measured. If we recommend
              something for your practice, a version of it has been grown here first.
              Step in. Touch everything.
            </p>
            <VineDivider className="mx-auto mt-10 text-accent" />
          </Reveal>
        </header>

        <div className="space-y-24">

          {/* ─── LAB 004: THE WORKBENCH (flagship live exhibit) ─── */}
          <section>
            <Reveal className="max-w-5xl mx-auto bg-vmNavy rounded-sm overflow-hidden shadow-2xl">
              <div className="grid md:grid-cols-5">
                <div className="md:col-span-3 p-10 md:p-14">
                  <p className="eyebrow text-vmTeal mb-3">Lab 004 · Live now · Newest exhibit</p>
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-5 italic">The Workbench.</h2>
                  <p className="text-white/70 leading-relaxed mb-8">
                    Five AI tools that research <em>your</em> business the moment you enter — and
                    remember you when you come back: a property scout with live web search, a profit
                    leak detector that sizes your hidden revenue in dollars, a business coach, a
                    marketing strategist, and a lead machine. Plus an AI receptionist answering a
                    real phone line. Everything you make is emailed to you as a designed report.
                  </p>
                  <Link to="/lab/workbench" className={buttonTealOnNavy}>
                    Sit down at the bench <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="md:col-span-2 bg-white/5 border-t md:border-t-0 md:border-l border-white/10 p-10 md:p-14 flex flex-col justify-center gap-5">
                  {[
                    'AI Receptionist — call it live: (425) 494-4489',
                    'Deal Scout — live property deal sourcing',
                    'Profit Leak Detector — your hidden revenue, in dollars',
                    'Business Coach — direct answers, your context',
                    'Marketing Strategist — strategy first, then the copy',
                    'Lead Machine — who to reach and how',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-vmTeal shrink-0 mt-1" aria-hidden />
                      <p className="text-sm text-white/70 leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>

          {/* Case Studies — renders only when real case studies exist */}
          {CASE_STUDIES.length > 0 && (
          <section id="case-studies" className="scroll-mt-28">
            <Reveal className="text-center mb-16">
              <Eyebrow className="text-accent mb-4">Delivered engagements</Eyebrow>
              <h2 className="text-4xl font-serif text-vmNavy mb-4">Case Studies</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Each card says what was built and what was measured. Where a number isn’t in
                yet, it isn’t on the card.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CASE_STUDIES.map((study) => (
                <Reveal key={study.id} className="bg-white border border-slate-200 rounded-sm overflow-hidden">
                  <div className="bg-vmNavy p-6 text-center">
                    <h3 className="text-4xl font-serif text-vmTeal mb-1">{study.metric}</h3>
                    <p className="eyebrow text-white/40">{study.metricLabel}</p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <span className="eyebrow text-accent">{study.industry}</span>
                      <h4 className="text-lg font-serif text-vmNavy mt-2 leading-snug">{study.title}</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="eyebrow text-vmNavy mb-1">Challenge</p>
                        <p className="text-slate-600 leading-relaxed">{study.challenge}</p>
                      </div>
                      <div>
                        <p className="eyebrow text-vmNavy mb-1">Solution</p>
                        <p className="text-slate-600 leading-relaxed">{study.solution}</p>
                      </div>
                    </div>
                    <div className="pt-4 hairline">
                      <p className="eyebrow text-vmNavy mb-3">Results</p>
                      <ul className="space-y-2">
                        {study.results.map((result, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden />
                            <span className="text-slate-700">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
          )}

          {/* ─── LAB 001: ROI CALCULATOR (live) ─── */}
          <section>
            <Reveal className="flex items-end justify-between flex-wrap gap-4 mb-10">
              <div>
                <p className="eyebrow text-accent mb-2">Lab 001 · Live now</p>
                <h2 className="text-3xl md:text-4xl font-serif text-vmNavy">What is voicemail costing you?</h2>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Put your own numbers in. The result is the annual revenue currently
                leaking through unanswered calls.
              </p>
            </Reveal>

            <Reveal className="max-w-6xl mx-auto grid md:grid-cols-2 gap-0 border border-slate-200 shadow-2xl rounded-sm overflow-hidden bg-white">
              {/* Inputs */}
              <div className="p-8 md:p-14 flex flex-col gap-10">
                <div className="flex items-center gap-4 pb-4 hairline border-b">
                  <div className="w-10 h-10 bg-vmTeal/10 rounded-sm flex items-center justify-center text-vmNavy">
                    <Calculator className="w-6 h-6" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-vmNavy">Your numbers</h3>
                </div>

                <div className="space-y-8">
                  {[
                    { label: 'Monthly inquiries', value: monthlyCalls, set: setMonthlyCalls },
                    { label: 'Patient / client value ($)', value: avgValue, set: setAvgValue },
                    { label: 'Missed call rate (%)', value: missedRate, set: setMissedRate },
                  ].map((field) => (
                    <div className="space-y-3" key={field.label}>
                      <label className="eyebrow text-vmNavy block">{field.label}</label>
                      <input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.set(Number(e.target.value))}
                        className="w-full p-5 border border-slate-200 rounded-sm focus:border-vmNavy focus:outline-none transition-all font-medium text-xl bg-vmSlate/40"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Output */}
              <div className="bg-vmNavy p-8 md:p-14 text-white flex flex-col justify-between">
                <div className="space-y-12">
                  <div className="space-y-1">
                    <p className="eyebrow text-white/40">Uncaptured opportunity</p>
                    <h4 className="text-3xl md:text-4xl font-serif text-vmTeal">
                      {unansweredCalls} <span className="text-sm opacity-60 font-sans font-light">missed inquiries / mo</span>
                    </h4>
                  </div>

                  <div className="space-y-1">
                    <p className="eyebrow text-white/40">Revenue leakage (monthly)</p>
                    <h4 className="text-4xl md:text-5xl font-serif text-white">
                      ${monthlyRevenueAtRisk.toLocaleString()}
                    </h4>
                  </div>

                  <div className="pt-8 border-t border-white/10 space-y-1">
                    <p className="eyebrow text-white/40">Annual impact</p>
                    <h4 className="text-5xl md:text-6xl font-serif text-vmTeal">
                      ${annualImpact.toLocaleString()}
                    </h4>
                  </div>
                </div>

                <div className="mt-12">
                  <Link to="/start" className={buttonTealOnNavy + ' w-full'}>
                    Get the detailed assessment <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </Reveal>
            <p className="mt-6 text-center text-slate-500 text-xs italic">
              *Preliminary calculation from your inputs. An assessment refines these variables for your practice.
            </p>
          </section>

          {/* ─── MORE LIVE EXHIBITS ─── */}
          <section>
            <Reveal className="text-center mb-14">
              <Eyebrow className="text-accent mb-4">More rooms, open now</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-4">Walk the other exhibits.</h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-8">
              <Reveal className="p-10 bg-white border border-slate-200 rounded-sm flex flex-col">
                <p className="eyebrow text-accent mb-2">Lab 002 · Live</p>
                <h3 className="text-2xl font-serif text-vmNavy mb-4">The Museum of Sound</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
                  An immersive walk from the first sounds to the language of AI — built as an
                  experience, not a page. This is what we make when we explore for its own sake.
                </p>
                <Link to="/sound" className="inline-flex items-center gap-2 text-vmNavy font-semibold hover:text-vmTeal transition-colors text-sm">
                  Enter the museum <ArrowRight className="w-4 h-4" />
                </Link>
              </Reveal>
              <Reveal delay={120} className="p-10 bg-white border border-slate-200 rounded-sm flex flex-col">
                <p className="eyebrow text-accent mb-2">Lab 003 · You're inside it</p>
                <h3 className="text-2xl font-serif text-vmNavy mb-4">This website</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
                  Museum-grade design system, classical architecture as structural language, every
                  page a different room of one building — designed, written, and shipped with the
                  same AI-assisted system we install for clients.
                </p>
                <span className="text-sm text-slate-500 italic">Exhibit ongoing. You're in it now.</span>
              </Reveal>
            </div>
          </section>

          {/* ─── IN DAILY USE ─── */}
          <section>
            <Reveal className="text-center mb-14">
              <Eyebrow className="text-accent mb-4">The honest flex</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-4">We run our business on what we sell.</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Every system below is in production — not for a client, for us. Nothing here is a
                mockup, and every claim is literally true.
              </p>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-8">
              {IN_USE.map((item, i) => (
                <Reveal key={item.title} delay={i * 80}
                  className="p-8 bg-white border border-slate-200 rounded-sm border-t-2 border-t-vmLeaf/60">
                  <h3 className="text-xl font-serif text-vmNavy mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">{item.desc}</p>
                  {item.to ? (
                    <Link to={item.to} className="inline-flex items-center gap-2 text-sm font-semibold text-vmNavy hover:text-vmTeal transition-colors">
                      {item.hint} <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <p className="eyebrow text-slate-500">{item.hint}</p>
                  )}
                </Reveal>
              ))}
            </div>
          </section>

          {/* ─── THE GREENHOUSE ─── */}
          <section>
            <Reveal className="text-center mb-14">
              <Eyebrow className="text-accent mb-4">The greenhouse</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-4">Growing now.</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Labs in progress. Each one goes live on this page when it's real enough to use —
                not before.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {GREENHOUSE.map((item, i) => (
                <Reveal key={item.title} delay={i * 100}
                  className="p-8 bg-white/70 border border-dashed border-slate-300 rounded-sm">
                  <Sprout className="w-6 h-6 text-accent mb-5" aria-hidden />
                  <h3 className="text-xl font-serif text-vmNavy mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{item.desc}</p>
                  <p className="eyebrow text-slate-500">{item.status}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ─── GUARDRAILS ─── */}
          <section className="pt-16 hairline border-t">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <Reveal>
                <Eyebrow className="text-accent mb-4">How everything here is built</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-8 italic">Guardrails, not just code.</h2>
                <p className="text-slate-600 mb-10 text-lg leading-relaxed">
                  Every lab and every client system runs inside the same discipline:
                  find the loss, map it, build it, measure it — with the guardrails below
                  as non-negotiables.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { title: 'Standardized tone', desc: 'Agents that sound like your best receptionist.' },
                    { title: 'Data discipline', desc: 'Your data never trains public models.' },
                    { title: 'Human in the loop', desc: 'Complex queries escalate to people.' },
                    { title: 'Drift control', desc: 'Continuous monitoring for alignment.' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <LeafMark className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-vmNavy text-sm mb-1">{item.title}</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={150} className="text-center p-12">
                <LaurelSprig className="w-40 mx-auto mb-8 text-accent" />
                <p className="font-serif text-2xl text-vmNavy italic leading-snug max-w-xs mx-auto">
                  "If we recommend it, we've run it ourselves first."
                </p>
              </Reveal>
            </div>
          </section>

          {/* ─── ONE CTA ─── */}
          <Reveal className="text-center pt-8">
            <a href={BOOKING_URLS.BOOK} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
              Book your 20-minute discovery call <ArrowRight className="w-4 h-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </div>
    </>
  );
};

export default TheLab;
