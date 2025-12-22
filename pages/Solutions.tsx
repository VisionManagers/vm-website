
import React from 'react';
import { Shield, Zap, ShieldCheck, HeartPulse, Workflow, Database, Check, ArrowRight, ChevronRight } from 'lucide-react';

const Solutions: React.FC = () => {
  const bookingLink = "https://api.leadconnectorhq.com/widget/booking/SrykTWRlxCfGTJxswRqv";

  const steps = [
    {
      id: "audit",
      title: "Audit",
      duration: "2 Weeks",
      icon: Shield,
      fee: "Fixed-Fee",
      desc: "A deep dive into your current bottlenecks resulting in a written strategic plan.",
      success: "Written roadmap signed off by key stakeholders."
    },
    {
      id: "pilot",
      title: "Pilot",
      duration: "1 Week",
      icon: Zap,
      fee: "Setup Fee",
      desc: "Deploy one high-impact workflow (e.g., Missed Call Recovery) to prove ROI fast.",
      success: "Positive ROI proven through live operational data."
    },
    {
      id: "deployment",
      title: "Deployment",
      duration: "45 Days",
      icon: ShieldCheck,
      fee: "Full Production",
      desc: "Production-ready systems for your entire office or organization + staff training.",
      success: "Seamless integration with existing CRM/EHR systems."
    },
    {
      id: "maintenance",
      title: "Maintenance",
      duration: "Monthly",
      icon: HeartPulse,
      fee: "Subscription",
      desc: "Ongoing monitoring, safeguard audits, and continuous model iteration.",
      success: "99.9% uptime and zero-drift brand alignment."
    }
  ];

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-24">
          <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">The Engagement Model</span>
          <h1 className="text-5xl font-serif text-vmNavy mb-8 leading-tight">The <span className="italic underline decoration-vmTeal">AI Audit</span>: <br />The Foundation of Transformation.</h1>
          <p className="text-xl text-slate-600 font-light leading-relaxed">
            Every engagement starts with a comprehensive AI Audit. We don't bill by the hour; we bill by the transformation. Our structured pathway ensures you scale safely without breaking what already works.
          </p>
        </div>

        {/* 4-Step Packaging */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {steps.map((step, i) => (
            <div key={i} className="p-8 bg-vmSlate border border-slate-100 rounded-sm hover:bg-white hover:shadow-2xl transition-all group flex flex-col min-h-[460px]">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-vmTeal mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-vmNavy mb-4">{step.title}</h3>
              
              <div className="space-y-6 mb-6 flex-grow">
                <div className="pb-4 border-b border-slate-200/50">
                  <div className={`flex items-center mb-1 justify-between`}>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Scope</span>
                    <span className={`text-[10px] font-bold text-slate-600 uppercase tracking-widest text-right`}>{step.duration}</span>
                  </div>
                  <div className="text-center pt-2">
                    <span className="text-[10px] font-black text-vmTeal uppercase tracking-[0.2em]">{step.fee}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Deliverable</span>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Success Criteria</span>
                <p className="text-[11px] font-bold text-vmNavy leading-tight">{step.success}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Top CTA Button */}
        <div className="flex justify-center mb-32">
          <a 
            href={bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-12 py-5 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all shadow-xl active:scale-95"
          >
            Request AI Audit
          </a>
        </div>

        {/* Standardized Offerings */}
        <div className="space-y-16 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-vmNavy italic">Standardized Offerings</h2>
          </div>
          
          {/* Card 1: AI Strategic Audit */}
          <div className="bg-white p-12 rounded-sm border border-slate-100 shadow-sm hover:shadow-xl transition-all grid md:grid-cols-12 gap-12 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-vmTeal/5 rounded-full -mr-16 -mt-16 group-hover:bg-vmTeal/10 transition-colors" />
            
            <div className="md:col-span-8">
              <div className="flex items-center gap-4 mb-6">
                 <span className="text-xs font-black text-vmTeal uppercase tracking-widest">Clinics & High-Trust SMBs</span>
              </div>
              <h2 className="text-3xl font-serif text-vmNavy mb-6">AI Strategic Audit</h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg max-w-2xl">A comprehensive deep-dive into your operational infrastructure. We identify revenue leakage points and design the precise AI guardrails needed to secure your growth.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Bottleneck Identification",
                  "Compliance Safety Review",
                  "Implementation Roadmap",
                  "ROI Projection Model"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-vmTeal" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-slate-50">
                 <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Standard Deliverable</span>
                    <span className="text-xs font-bold text-vmNavy px-3 py-1 bg-vmTeal/10 rounded-full">Strategic Assessment Brief</span>
                 </div>
                 <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Fixed Timeline</span>
                    <span className="text-xs font-bold text-vmNavy px-3 py-1 bg-vmTeal/10 rounded-full">2 Week Turnaround</span>
                 </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-vmSlate p-10 rounded-sm flex flex-col justify-center items-center text-center">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Implementation</h4>
              <div className="text-3xl font-serif text-vmNavy mb-8 italic">2 Weeks</div>
              <a 
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-vmNavy text-white rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-vmTeal hover:text-vmNavy transition-all shadow-lg"
              >
                Request AI Audit <ArrowRight className="w-4 h-4" />
              </a>
              <p className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Foundation for all pilots</p>
            </div>
          </div>

          {/* Card 2: Lead Recovery and Booking Engine */}
          <div className="bg-white p-12 rounded-sm border border-slate-100 shadow-sm hover:shadow-xl transition-all grid md:grid-cols-12 gap-12 group overflow-hidden relative">
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-vmNavy/5 rounded-full group-hover:bg-vmNavy/10 transition-colors" />
            
            <div className="md:col-span-8">
              <div className="flex items-center gap-4 mb-6">
                 <span className="text-xs font-black text-vmNavy uppercase tracking-widest">Multi-Location & Growth Enterprise</span>
                 <Workflow className="w-4 h-4 text-vmTeal" />
              </div>
              <h2 className="text-3xl font-serif text-vmNavy mb-6">Lead Recovery and Booking Engine</h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg max-w-2xl">
                An audited automation layer for high-trust businesses that sell consults, appointments, or high-ticket services. We identify where leads drop, quantify the cost, then deploy the fixes with tight controls.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                {[
                  { title: "KPI Instrumentation", desc: "Baseline metrics + revenue attribution" },
                  { title: "Response Enforcement", desc: "Speed-to-lead and follow-up protocols" },
                  { title: "Lead Recapture Campaigns", desc: "Reactive outbound SMS + Voice for dropped inquiries" },
                  { title: "Qualification Rules", desc: "Automated logic + escalation paths" },
                  { title: "Scheduling Engine", desc: "Automation + exception handling" },
                  { title: "Transparent Audit", desc: "Logs for visibility and improvement" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-vmTeal mt-1 shrink-0" />
                    <div>
                      <h5 className="text-sm font-bold text-vmNavy">{item.title}</h5>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-slate-50">
                 <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Standard Deliverable</span>
                    <span className="text-xs font-bold text-vmNavy px-3 py-1 bg-vmTeal/10 rounded-full">Revenue Infrastructure Install</span>
                 </div>
                 <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Security Standard</span>
                    <span className="text-xs font-bold text-vmNavy px-3 py-1 bg-vmTeal/10 rounded-full">Brand-Isolated Guardrails</span>
                 </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-vmNavy p-10 rounded-sm flex flex-col justify-center items-center text-center text-white relative">
              <Database className="w-12 h-12 text-vmTeal/20 absolute top-4 right-4" />
              <h4 className="text-xs font-black text-vmTeal uppercase tracking-widest mb-4">Implementation</h4>
              <div className="text-4xl font-serif mb-8 italic text-white">45 Days</div>
              <a 
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-vmTeal text-vmNavy rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg"
              >
                Request AI Audit <ArrowRight className="w-4 h-4" />
              </a>
              <p className="mt-6 text-[10px] text-vmTeal/50 uppercase tracking-widest font-bold">Includes End-to-End Tracking</p>
            </div>
            
            <div className="md:col-span-12 mt-4">
              <p className="text-[11px] text-slate-400 italic">
                *Results depend on lead quality, offer strength, and your team’s capacity—but the system ensures every lead is handled consistently and measurable end-to-end.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="max-w-4xl mx-auto py-20 px-8 bg-vmSlate border border-slate-100 rounded-sm text-center">
          <h2 className="text-4xl font-serif text-vmNavy mb-6 italic">Secure your transformation today.</h2>
          <p className="text-slate-600 mb-10 max-w-xl mx-auto">
            Book your AI Audit to identify revenue leakage and build your implementation roadmap.
          </p>
          <a 
            href={bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-12 py-5 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all shadow-xl group"
          >
            Schedule Your Audit <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
