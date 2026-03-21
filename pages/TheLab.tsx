import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Calculator, Check, ArrowRight, TrendingUp, Clock, Users } from 'lucide-react';
import { IMAGES } from '../constants';
import type { CaseStudy } from '../types';

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'dental-intake',
    title: 'AI Voice Reception for Multi-Location Dental Group',
    client: 'Regional Dental Network',
    industry: 'Healthcare',
    challenge: 'Missed 22% of after-hours calls, losing an estimated $47K/month in new patient revenue across 5 locations.',
    solution: 'Deployed 24/7 AI voice agent with real-time insurance verification, appointment booking, and CRM write-back.',
    results: [
      'Reduced missed calls from 22% to under 3%',
      'Captured $41K/month in previously lost revenue',
      'Staff freed 14 hours/week from phone duty per location',
    ],
    metric: '87%',
    metricLabel: 'Call Capture Rate Increase',
  },
  {
    id: 'legal-synthesis',
    title: 'Document Synthesis for Mid-Market Law Firm',
    client: 'Regional Legal Practice',
    industry: 'Legal',
    challenge: 'Partners spent 4+ hours daily reviewing AI-generated summaries that lacked verifiable source citations.',
    solution: 'Built Lineage-First Synthesis protocol with audit logs, negative constraint training, and multi-stage validation.',
    results: [
      'Review time per document cut from 20 min to 4 min',
      'Partner trust in AI outputs increased from 35% to 89%',
      'Firm-wide efficiency gain of 120 billable hours/month',
    ],
    metric: '80%',
    metricLabel: 'Review Time Reduction',
  },
  {
    id: 'real-estate-leads',
    title: 'Lead Re-Engagement Pipeline for Real Estate Portfolio',
    client: 'Private Equity Real Estate Group',
    industry: 'Real Estate',
    challenge: 'CRM held 12,000+ stale leads with no standardized follow-up process. Manual outreach was inconsistent.',
    solution: 'Automated multi-channel re-engagement with brand-voice-aligned messaging and human escalation triggers.',
    results: [
      '8.4% of dormant leads re-engaged within 30 days',
      '34 qualified appointments booked in first month',
      '$2.1M in pipeline attributed to re-activated leads',
    ],
    metric: '$2.1M',
    metricLabel: 'Pipeline Recovered',
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
      description="Real case studies, ROI data, and proven AI guardrails. See how high-trust businesses deploy AI to capture revenue, reduce friction, and scale with confidence."
      path="/lab"
    />
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center max-w-4xl mx-auto">
          <span className="text-vmTeal font-black tracking-[0.4em] uppercase text-[10px] mb-6 inline-block bg-vmTeal/10 px-4 py-1.5 rounded-full">Vision Managers Interactive</span>
          <h1 className="text-5xl md:text-6xl font-serif text-vmNavy mb-8 leading-tight italic">The Lab.</h1>
          <p className="text-slate-600 text-xl font-light">Proof of results. Real engagements, measurable outcomes, and the AI frameworks behind them.</p>
        </header>

        <div className="space-y-20">
          {/* Case Studies Section */}
          <section>
            <div className="text-center mb-16">
              <span className="text-vmTeal font-black text-[10px] uppercase tracking-widest mb-4 block">Proven Results</span>
              <h2 className="text-4xl font-serif text-vmNavy mb-4">Case Studies</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">How high-trust businesses are deploying AI to capture revenue, reduce friction, and scale with confidence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CASE_STUDIES.map((study) => (
                <div key={study.id} className="bg-white border border-slate-200 rounded-sm overflow-hidden hover:shadow-xl transition-shadow group">
                  {/* Metric banner */}
                  <div className="bg-vmNavy p-6 text-center relative overflow-hidden">
                    <h3 className="text-4xl font-bold text-vmTeal mb-1">{study.metric}</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{study.metricLabel}</p>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rotate-45 transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="p-6 space-y-5">
                    <div>
                      <span className="text-vmTeal font-black text-[10px] uppercase tracking-widest">{study.industry}</span>
                      <h4 className="text-lg font-serif text-vmNavy mt-2 leading-snug">{study.title}</h4>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-[10px] font-black text-vmNavy uppercase tracking-widest mb-1">Challenge</p>
                        <p className="text-slate-600 leading-relaxed">{study.challenge}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-vmNavy uppercase tracking-widest mb-1">Solution</p>
                        <p className="text-slate-600 leading-relaxed">{study.solution}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-black text-vmNavy uppercase tracking-widest mb-3">Results</p>
                      <ul className="space-y-2">
                        {study.results.map((result, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-vmTeal shrink-0 mt-0.5" />
                            <span className="text-slate-700">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/start"
                className="inline-flex items-center gap-3 px-10 py-5 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all group"
              >
                Get Your Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </section>

          {/* ROI Calculator Section */}
          <section className="py-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-vmNavy mb-4">ROI Calculator</h2>
              <p className="text-slate-600">Quantify the cost of friction in your current workflow.</p>
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-0 border border-slate-200 shadow-2xl rounded-sm overflow-hidden">
              {/* Left: Your Numbers (Inputs) */}
              <div className="bg-white p-8 md:p-14 flex flex-col gap-10">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 bg-vmTeal/10 rounded-sm flex items-center justify-center text-vmTeal">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-vmNavy uppercase tracking-wider">Business Variables</h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Monthly Inquiries</label>
                    <input
                      type="number"
                      value={monthlyCalls}
                      onChange={(e) => setMonthlyCalls(Number(e.target.value))}
                      className="w-full p-5 border border-slate-200 rounded-sm focus:border-vmTeal focus:ring-1 focus:ring-vmTeal focus:outline-none transition-all font-medium text-xl bg-vmSlate/30"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Patient/Client Value ($)</label>
                    <input
                      type="number"
                      value={avgValue}
                      onChange={(e) => setAvgValue(Number(e.target.value))}
                      className="w-full p-5 border border-slate-200 rounded-sm focus:border-vmTeal focus:ring-1 focus:ring-vmTeal focus:outline-none transition-all font-medium text-xl bg-vmSlate/30"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Missed Call Rate (%)</label>
                    <input
                      type="number"
                      value={missedRate}
                      onChange={(e) => setMissedRate(Number(e.target.value))}
                      className="w-full p-5 border border-slate-200 rounded-sm focus:border-vmTeal focus:ring-1 focus:ring-vmTeal focus:outline-none transition-all font-medium text-xl bg-vmSlate/30"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Results (Output) */}
              <div className="bg-vmNavy p-8 md:p-14 text-white flex flex-col justify-between relative overflow-hidden group">
                <div className="space-y-12 relative z-10">
                  <div className="grid grid-cols-1 gap-12">
                    <div className="space-y-1">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Uncaptured Opportunity</p>
                      <h4 className="text-3xl md:text-4xl font-bold text-vmTeal">
                        {unansweredCalls} <span className="text-sm opacity-60 font-light">missed inquiries /mo</span>
                      </h4>
                    </div>

                    <div className="space-y-1">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Revenue Leakage (Monthly)</p>
                      <h4 className="text-4xl md:text-5xl font-bold text-white">
                        ${monthlyRevenueAtRisk.toLocaleString()}
                      </h4>
                      <p className="text-[10px] text-vmTeal/60 font-medium italic">Monthly value of inquiries not reaching your team</p>
                    </div>

                    <div className="pt-8 border-t border-white/10 space-y-1">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Net Annual Impact</p>
                      <h4 className="text-5xl md:text-6xl font-bold text-vmTeal">
                        ${annualImpact.toLocaleString()}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="mt-12 relative z-10">
                  <Link
                    to="/start"
                    className="w-full py-5 bg-vmTeal text-vmNavy font-black uppercase tracking-widest text-xs rounded-sm hover:bg-white transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Receive Detailed Assessment <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>

                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rotate-45 transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <p className="mt-8 text-center text-slate-400 text-xs italic">
              *Preliminary calculation based on provided industry averages. Your specific assessment will refine these variables.
            </p>
          </section>

          {/* Safety & Guardrails Section */}
          <div className="border-t border-slate-100 pt-32">
            <div className="grid md:grid-cols-2 gap-24 items-center">
              <div>
                <span className="text-vmTeal font-black text-[10px] uppercase tracking-widest mb-4 block">Safety Standards</span>
                <h2 className="text-4xl font-serif text-vmNavy mb-8 italic">Guardrails, not just code.</h2>
                <p className="text-slate-600 mb-12 text-lg leading-relaxed font-light">
                  We build brand-aligned and human-first systems that meet your professional standards.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { title: "Standardized Tone", desc: "Agents that sound like your best receptionist." },
                    { title: "Data Sync", desc: "Secure real-time verification standards." },
                    { title: "Safety Buffer", desc: "Human-in-the-loop for complex queries." },
                    { title: "Drift Control", desc: "Continuous monitoring for alignment." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1"><Check className="w-4 h-4 text-vmTeal" /></div>
                      <div>
                        <h5 className="font-bold text-vmNavy text-sm mb-1">{item.title}</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative group">
                 <div className="absolute -inset-4 bg-vmTeal/5 rounded-full blur-3xl group-hover:bg-vmTeal/10 transition-colors" />
                 <img src={IMAGES.SKYLINE} alt="Infrastructure" className="w-full h-auto grayscale opacity-40 relative z-10 border border-slate-100 rounded-sm shadow-2xl" />
                 <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="p-10 bg-white shadow-2xl rounded-sm border border-slate-50 text-center max-w-xs">
                      <span className="text-[10px] font-black tracking-widest uppercase text-vmTeal mb-3 block">Guardrail Status</span>
                      <h4 className="text-2xl font-serif text-vmNavy italic">100% Secure</h4>
                      <div className="mt-6 flex gap-1.5 h-2 items-center justify-center">
                        {[...Array(12)].map((_, i) => <div key={i} className="w-1.5 h-full bg-vmTeal rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />)}
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default TheLab;
