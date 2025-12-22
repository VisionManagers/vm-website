
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BarChart3, TrendingUp } from 'lucide-react';

const BottlenecksROI: React.FC = () => {
  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/insights" className="inline-flex items-center gap-2 text-slate-400 hover:text-vmNavy transition-colors mb-12 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Insights
        </Link>
        
        <header className="mb-16">
          <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">1-Page Memo</span>
          <h1 className="text-5xl md:text-6xl font-serif text-vmNavy mb-8 leading-tight">3 Bottlenecks Killing Your AI ROI.</h1>
          <p className="text-xl text-slate-500 font-light italic">Published JAN 15, 2025</p>
        </header>

        <article className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-light space-y-8">
          <p className="text-xl leading-relaxed">
            The hype cycle of 2023 led many executives to believe that buying a few enterprise licenses for a general LLM would automatically unlock productivity. The data now shows that without <strong>Operational Integration</strong>, these tools are merely expensive toys.
          </p>

          <h3 className="text-2xl font-serif text-vmNavy mt-12 mb-6">1. The "Isolated Agent" Bottleneck</h3>
          <p>
            An AI agent that can talk to customers but cannot write to your CRM is a liability. If your staff has to manually transfer data from an AI chat log into your patient records, you haven't solved the bottleneck; you've just moved it.
            <strong>The Fix:</strong> Demand full-stack integration. AI must have "write-access" to your operational reality.
          </p>

          <h3 className="text-2xl font-serif text-vmNavy mt-12 mb-6">2. Lack of Baseline Attribution</h3>
          <p>
            Most firms cannot tell you exactly how many leads they miss per month or the dollar value of those missed calls. Without a baseline, you cannot measure the ROI of the fix.
            <strong>The Fix:</strong> Instrument your current workflow before you automate it. You cannot optimize what you do not measure.
          </p>

          <h3 className="text-2xl font-serif text-vmNavy mt-12 mb-6">3. The "Standardization Gap"</h3>
          <p>
            Staff members often view AI as a threat rather than a tool because it lacks standardized operating procedures (SOPs). Without clear guardrails, the AI's output is unpredictable, leading to more human intervention.
            <strong>The Fix:</strong> Codify your brand voice and policy rules into the agent's logic. Give it a narrow scope so it can be 100% reliable.
          </p>

          <div className="bg-vmTeal/5 p-8 rounded-sm my-12 border-l-4 border-vmTeal">
            <h4 className="text-vmNavy font-bold uppercase tracking-widest text-sm mb-4">The Strategic Takeaway</h4>
            <p className="text-vmNavy italic text-lg leading-relaxed">
              "Efficiency is doing things right. Effectiveness is doing the right things. AI without integration is just faster friction."
            </p>
          </div>
        </article>

        {/* CTA Section */}
        <div className="mt-24 p-12 bg-vmNavy text-white rounded-sm text-center relative overflow-hidden group">
          <div className="relative z-10">
            <TrendingUp className="w-12 h-12 text-vmTeal mx-auto mb-8" />
            <h3 className="text-3xl font-serif mb-6 italic">Quantify the leakage.</h3>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto">
              Our Revenue Workflow Audit identifies your specific bottlenecks and projects the exact ROI of an automated fix.
            </p>
            <Link 
              to="/solutions#audit-form" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-vmTeal text-vmNavy font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white transition-all group/btn"
            >
              Request Revenue Workflow Audit <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottlenecksROI;
