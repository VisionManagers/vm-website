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
const CASE_STUDIES: CaseStudy[] = [];

/* Honest pipeline — things being grown right now. No fake proof. */
const GREENHOUSE = [
  {
    title: 'AI Readiness Score',
    desc: 'An 8-question assessment that scores how prepared your practice is for AI — and exactly where the gaps are.',
    status: 'In development',
  },
  {
    title: 'Call the demo line',
    desc: 'A live voice agent you can phone right now and try to stump. The same architecture that booked $4,300 in two days.',
    status: 'Coming to this page',
  },
  {
    title: 'The 90-minute CRM',
    desc: 'A working CRM built with Claude in one sitting — it reads meetings and email, then flags who to follow up with. We use it daily.',
    status: 'Write-up in progress',
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
            </p>
            <VineDivider className="mx-auto mt-10 text-accent" />
          </Reveal>
        </header>

        <div className="space-y-24">

          {/* Case Studies — renders only when real case studies exist */}
          {CASE_STUDIES.length > 0 && (
          <section>
            <Reveal className="text-center mb-16">
              <Eyebrow className="text-accent mb-4">Proven results</Eyebrow>
              <h2 className="text-4xl font-serif text-vmNavy mb-4">Case Studies</h2>
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
            <p className="mt-6 text-center text-slate-400 text-xs italic">
              *Preliminary calculation from your inputs. An assessment refines these variables for your practice.
            </p>
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

            <div className="grid md:grid-cols-3 gap-8">
              {GREENHOUSE.map((item, i) => (
                <Reveal key={item.title} delay={i * 100}
                  className="p-8 bg-white/70 border border-dashed border-slate-300 rounded-sm">
                  <Sprout className="w-6 h-6 text-accent mb-5" aria-hidden />
                  <h3 className="text-xl font-serif text-vmNavy mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{item.desc}</p>
                  <p className="eyebrow text-slate-400">{item.status}</p>
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
                  Every lab and every client system runs inside the same discipline —
                  the governance framework from our fractional AI Officer practice.
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
            <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
              Talk through what this could look like for you <ArrowRight className="w-4 h-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </div>
    </>
  );
};

export default TheLab;
