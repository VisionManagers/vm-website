
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Calculator, ChevronRight, Check, ArrowRight, Terminal, Cpu, Shield, Globe } from 'lucide-react';
import { IMAGES } from '../constants';

const TheLab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Intake');
  
  // ROI State
  const [monthlyCalls, setMonthlyCalls] = useState(200);
  const [avgValue, setAvgValue] = useState(1500);
  const [missedRate, setMissedRate] = useState(15);

  const unansweredCalls = Math.round(monthlyCalls * (missedRate / 100));
  const monthlyRevenueAtRisk = Math.round(unansweredCalls * avgValue);
  const annualImpact = monthlyRevenueAtRisk * 12;

  const categories = ['Intake', 'Governance', 'Logic', 'Synthesis'];
  
  const tasks = {
    'Intake': ['Smart Form Routing', 'Insurance Parsing', 'Qualification Logic'],
    'Governance': ['Privacy Guardrails', 'Compliance Audit Logs', 'Neural Drift Control'],
    'Logic': ['Appointment Rescheduling', 'Late-Notice Trigger', 'Lead Re-engagement'],
    'Synthesis': ['Portfolio KPI Digest', 'Market Data Synthesis', 'Risk Signal Alerting']
  };

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center max-w-4xl mx-auto">
          <span className="text-vmTeal font-black tracking-[0.4em] uppercase text-[10px] mb-6 inline-block bg-vmTeal/10 px-4 py-1.5 rounded-full">Vision Managers Interactive</span>
          <h1 className="text-5xl md:text-6xl font-serif text-vmNavy mb-8 leading-tight italic">The Sandbox.</h1>
          <p className="text-slate-600 text-xl font-light">Explore our ongoing R&D in high-trust autonomous operations. We are building the verifiable future, one logic-gate at a time.</p>
        </header>

        <div className="space-y-20">
          {/* Architecture Preview Section (Placeholder for Interactive Build-outs) */}
          <section className="bg-vmSlate p-6 md:p-12 rounded-sm border border-slate-100 flex flex-col group">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-serif text-vmNavy mb-2">Build Explorer</h3>
                <p className="text-slate-500 text-sm">Testing brand-isolated logic modules.</p>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full md:w-auto">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full border transition-all ${
                      activeCategory === cat ? 'bg-vmNavy text-white border-vmNavy' : 'bg-white text-slate-400 border-slate-200 hover:border-vmTeal'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-sm p-8 md:p-12 shadow-inner border border-slate-200 relative overflow-hidden min-h-[400px]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vmNavy via-vmTeal to-vmNavy animate-shimmer" />
              
              <div className="flex flex-col items-center justify-center h-full gap-10">
                <div className="relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-vmNavy/5 border border-vmNavy/10 flex items-center justify-center text-vmNavy transition-all relative z-10">
                    <Cpu className="w-10 h-10 md:w-12 md:h-12 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border border-vmTeal/20 animate-ping" />
                </div>
                
                <div className="text-center w-full max-w-md">
                  <h4 className="text-vmNavy font-bold text-sm mb-2 uppercase tracking-widest">Compiling {activeCategory} Build</h4>
                  <p className="text-xs text-slate-400 mb-8 px-4">Our interactive chat and decision agents are currently in private pilot phase. Select a module to see its architectural scope.</p>
                  
                  <div className="grid grid-cols-1 gap-3 px-4">
                    {(tasks[activeCategory as keyof typeof tasks] || []).map(task => (
                      <div key={task} className="px-5 py-3 text-xs font-bold border border-slate-100 rounded-sm bg-vmSlate/50 flex items-center justify-between group/item hover:border-vmTeal transition-colors">
                        <span className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-vmTeal" />
                          {task}
                        </span>
                        <span className="text-[10px] text-slate-300 uppercase">Beta</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                    { title: "Operational Sync", desc: "Secure real-time verification standards." },
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
  );
};

export default TheLab;
