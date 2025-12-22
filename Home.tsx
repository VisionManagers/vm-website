
import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGES, SOLUTIONS, TESTIMONIALS } from '../constants';
import { 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Layers, 
  BarChart3, 
  Users, 
  Play, 
  MessageSquare, 
  CheckCircle2,
  Search,
  Layout,
  Cpu,
  RefreshCw,
  ArrowRight,
  Activity,
  Terminal
} from 'lucide-react';

const Home: React.FC = () => {
  const processSteps = [
    { 
      name: 'Assess', 
      line: 'Audit current workflows to find friction points.',
      icon: Search 
    },
    { 
      name: 'Design', 
      line: 'Architecture custom guardrails aligned with your brand.',
      icon: Layout 
    },
    { 
      name: 'Deploy', 
      line: 'Seamlessly integrate autonomous agents into your stack.',
      icon: Cpu 
    },
    { 
      name: 'Safeguard', 
      line: 'Monitor outputs with rigorous human-first checks.',
      icon: ShieldCheck 
    },
    { 
      name: 'Iterate', 
      line: 'Refine performance based on real-world revenue impact.',
      icon: RefreshCw 
    }
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Section - Refined Minimalist Approach */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20 bg-white">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 mb-10 text-xs font-bold tracking-[0.2em] text-vmNavy uppercase bg-vmTeal/10 rounded-full animate-in fade-in slide-in-from-bottom-2 duration-700">
            AI, designed around people
          </span>
          <h1 className="text-5xl md:text-8xl font-serif text-vmNavy mb-10 leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Operational AI for <br />
            <span className="italic font-normal"> High-Trust Businesses.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-14 max-w-4xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <span className="text-vmNavy font-semibold">Capture more demand.</span> <span className="italic text-vmNavy">Convert it faster.</span> <br className="hidden md:block" />
            We build secure AI systems for intake, follow-up, and operations — meaning <span className="text-vmTeal font-bold">more leads</span>, <span className="text-vmTeal font-bold">better conversion</span>, and <span className="text-vmNavy font-bold italic underline decoration-vmTeal/40 underline-offset-8">more revenue.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link 
              to="/start" 
              className="w-full sm:w-auto px-12 py-5 bg-vmNavy text-white rounded-sm font-semibold hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
            >
              Start Assessment
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a 
              href="https://api.leadconnectorhq.com/widget/booking/SrykTWRlxCfGTJxswRqv" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-12 py-5 bg-white text-vmNavy border border-slate-200 rounded-sm font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              Book Strategy Call
            </a>
          </div>

          <div className="pt-10 border-t border-slate-100 animate-in fade-in duration-1000 delay-500">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
              Specialized for <span className="text-vmNavy">Dentists</span> • <span className="text-vmNavy">Optometrists</span> • <span className="text-vmNavy">Specialty Contractors</span> • <span className="text-vmNavy">Portfolio Operators</span>
            </p>
          </div>
        </div>
      </section>

      {/* 2. The Moment: Two-Lane Messaging */}
      <section className="py-32 bg-vmSlate/30">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-sm font-bold text-vmTeal tracking-widest uppercase mb-6">The Opportunity</h2>
            <h3 className="text-4xl font-serif text-vmNavy mb-8 leading-tight">
              Bridging the gap between <span className="italic">strategy</span> and <span className="italic">revenue.</span>
            </h3>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Whether you are a CRO managing enterprise risk or a clinic owner losing revenue to missed calls, the problem is the same: 
              <span className="text-vmNavy font-semibold"> a lack of reliable autonomous standards.</span>
            </p>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {[
                { label: "Leader Lens", title: "Strategic Response Speed", text: "Deploy agents that understand your brand guardrails and policy standards." },
                { label: "Operator Lens", title: "Immediate Recovery", text: "Automate missed calls, bookings, and re-engagement with zero staff friction." }
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-sm bg-white border border-slate-100 border-l-4 border-l-vmTeal group hover:shadow-xl transition-all">
                  <span className="text-[10px] font-black text-vmTeal uppercase tracking-[0.2em] mb-2 block">{item.label}</span>
                  <h4 className="text-xl font-serif text-vmNavy mb-3">{item.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. VM Process: System Design */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-xs font-black text-vmTeal tracking-[0.4em] uppercase mb-6">Execution Methodology</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-vmNavy mb-4">The VM Process</h3>
            <p className="text-slate-500 max-w-xl mx-auto font-light">
              We replace chaos with a verifiable sequence of operational improvements.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-[1px] bg-slate-100 z-0">
               <div className="h-full bg-vmTeal w-0 group-hover:w-full transition-all duration-1000 ease-in-out" />
            </div>

            {processSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="relative z-10 group flex flex-col items-center text-center px-4"
              >
                {/* Icon Wrapper */}
                <div className="mb-8 relative">
                   <div className="w-20 h-20 rounded-full bg-vmSlate flex items-center justify-center text-vmNavy group-hover:bg-vmNavy group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 relative z-10">
                     <step.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
                   </div>
                   {/* Step Number Badge */}
                   <div className="absolute -top-1 -right-1 w-6 h-6 bg-vmTeal text-vmNavy text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white z-20 shadow-sm">
                     {idx + 1}
                   </div>
                   {/* Pulse Effect */}
                   <div className="absolute inset-0 rounded-full bg-vmTeal/20 opacity-0 group-hover:animate-ping group-hover:opacity-100 transition-opacity" />
                </div>

                <h4 className="text-lg font-bold text-vmNavy mb-3 uppercase tracking-widest">{step.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] group-hover:text-slate-600 transition-colors">
                  {step.line}
                </p>

                {/* Vertical Line for Mobile */}
                {idx < processSteps.length - 1 && (
                  <div className="md:hidden w-[1px] h-12 bg-slate-100 my-6" />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-20 flex justify-center">
            <Link to="/solutions" className="group flex items-center gap-3 text-xs font-black text-vmNavy uppercase tracking-[0.2em] hover:text-vmTeal transition-colors">
              Explore Our Roadmap <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Outcomes: Precise Metrics */}
      <section className="py-32 bg-vmSlate/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-serif text-vmNavy mb-16 text-center italic">Measurable Impact.</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Solo Clinic", label: "Revenue Recovery", time: "6 Months", metric: "200% Increase in Bottom Line" },
              { title: "Strategic Redesign", label: "Startup", time: "1 Week", metric: "354% ACV increase" },
              { title: "Sales Automation", label: "Insurance", time: "30 Days", metric: "4.2X outbound calls" }
            ].map((card, idx) => (
              <div key={idx} className="p-4 border border-slate-100 rounded-sm hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col bg-white group min-h-[230px] relative">
                
                {/* Fixed-Height Header ensures label and line alignment across rows */}
                <div className="h-[120px] relative flex flex-col items-center justify-center text-center">
                  {/* Floating Label in Upper Whitespace */}
                  <div className="absolute top-0 pt-4">
                    <h4 className="text-[11px] font-black text-vmTeal uppercase tracking-[0.2em]">{card.label}</h4>
                  </div>
                  
                  {/* Business Title - Centered Vertically within the 120px block */}
                  <h3 className="text-2xl font-serif text-vmNavy group-hover:text-vmTeal transition-colors leading-tight px-2">
                    {card.title}
                  </h3>
                </div>
                
                {/* Synchronized Metrics Divider Line and Content */}
                <div className="pt-3 border-t border-slate-50">
                  <div className="flex justify-between items-start text-[13px] mb-1.5 gap-4">
                    <span className="text-slate-400 uppercase tracking-tighter shrink-0 font-medium">Pilot Phase</span>
                    <span className="text-vmNavy font-bold flex-1 text-right">{card.time}</span>
                  </div>
                  <div className="flex justify-between items-start text-[13px] gap-4">
                    <span className="text-slate-400 uppercase tracking-tighter shrink-0 font-medium">Outcome</span>
                    <span className="text-vmNavy font-bold flex-1 text-right">{card.metric}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Lab Preview: Operational Intelligence Placeholder */}
      <section className="py-32 bg-vmNavy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <img src={IMAGES.SKYLINE} alt="" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 md:gap-20 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-vmTeal text-vmNavy text-[10px] font-black uppercase rounded-sm mb-6">Internal Lab Preview</span>
            <h2 className="text-4xl font-serif mb-8 leading-tight italic">Autonomous Logic Previews.</h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed font-light">
              We are currently refining our next generation of interaction models. Our "Lab" serves as the testing ground for brand-isolated chat agents and complex multi-step intake automation.
            </p>
            <Link to="/lab" className="inline-flex items-center gap-2 text-vmTeal font-semibold hover:underline group">
              Explore The Lab <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-md relative overflow-hidden">
            <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
              {['Logic Tree', 'Lead Routing', 'Safety Check', 'EHR Sync'].map(ind => (
                <div key={ind} className="px-3 py-1 border border-white/20 rounded-full text-[10px] uppercase font-bold tracking-widest opacity-50">{ind}</div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-full bg-vmTeal/20 border border-vmTeal/40 flex items-center justify-center text-vmTeal shadow-xl relative group">
                <Terminal className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-full border border-vmTeal animate-ping opacity-20" />
              </div>
              <div className="flex-grow w-full">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-vmTeal w-1/3 animate-pulse" />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] uppercase font-black text-vmTeal tracking-widest">Compiling New Build...</p>
                  <span className="text-[10px] text-white/40">v2.4.0</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-4">
               <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                 <Activity className="w-4 h-4 text-vmTeal mb-2" />
                 <p className="text-[10px] uppercase font-bold text-white/60">Safety Audit</p>
                 <p className="text-xs font-bold">Passed</p>
               </div>
               <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                 <Layers className="w-4 h-4 text-vmTeal mb-2" />
                 <p className="text-[10px] uppercase font-bold text-white/60">Neural Drift</p>
                 <p className="text-xs font-bold">0.02%</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Proof: Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif text-vmNavy mb-4">Trusted by the Verifiable.</h2>
            <p className="text-slate-600">Real outcomes for real clinics and firms.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-10 bg-vmSlate rounded-sm group hover:bg-white hover:shadow-2xl transition-all border border-slate-100 flex flex-col">
                <div className="flex-grow">
                   <p className="text-lg text-slate-700 italic mb-8 leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-slate-50 min-h-[80px]">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-vmTeal/20 shrink-0">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h5 className="font-bold text-vmNavy text-sm leading-tight">{t.name}</h5>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA: Assessment Lead */}
      <section className="py-32 border-t border-slate-100 bg-vmSlate/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif text-vmNavy mb-8 italic">Ready to grow?</h2>
          <p className="text-lg text-slate-600 mb-12 max-w-xl mx-auto">
            Our assessment produces a custom roadmap for your operation. Zero pressure, pure utility.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/start" 
              className="px-12 py-5 bg-vmNavy text-white rounded-sm font-semibold hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              Start Assessment
            </Link>
            <Link 
              to="/solutions" 
              className="text-vmNavy font-semibold hover:text-vmTeal transition-colors flex items-center gap-2 group"
            >
              View Offer Packages <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
