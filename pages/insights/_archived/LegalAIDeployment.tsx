
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const LegalAIDeployment: React.FC = () => {
  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/insights" className="inline-flex items-center gap-2 text-slate-400 hover:text-vmNavy transition-colors mb-12 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Insights
        </Link>
        
        <header className="mb-16">
          <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">Field Notes</span>
          <h1 className="text-5xl md:text-6xl font-serif text-vmNavy mb-8 leading-tight">Navigating the Trust Gap in Legal AI.</h1>
          <p className="text-xl text-slate-500 font-light italic">Published JAN 12, 2025</p>
        </header>

        <article className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-light space-y-8">
          <p className="text-xl leading-relaxed">
            Legal practitioners are inherently trained in skepticism. When a senior partner reviews the work of a junior associate, they are looking for the "thinking" behind the words. This same expectation applies to AI, yet most tools fail to show their work.
          </p>

          <h3 className="text-2xl font-serif text-vmNavy mt-12 mb-6">The "Verification Burden" Bottleneck</h3>
          <p>
            In our recent work with mid-market law firms, we found that the primary reason AI pilots fail isn't inaccuracy—it's the <strong>Review Burden</strong>. If a partner has to spend 20 minutes fact-checking an AI-generated summary that took 10 seconds to create, the net efficiency gain is negative.
          </p>

          <p>
            The "Trust Gap" is essentially the time cost required to verify an output. To bridge this, Vision Managers has developed the <strong>Lineage-First Synthesis</strong> protocol.
          </p>

          <h3 className="text-2xl font-serif text-vmNavy mt-12 mb-6">Operational Strategies for Trust</h3>
          <ul className="list-disc pl-6 space-y-6">
            <li>
              <strong>Audit Logs as Output:</strong> We don't just provide a final draft; we provide a "Decision Log" that shows exactly which case files and documents the AI referenced for every specific claim.
            </li>
            <li>
              <strong>Negative Constraint Training:</strong> We program agents to prioritize <em>omission</em> over hallucination. If the evidence isn't 100% verifiable, the agent is instructed to flag it for human review rather than guessing.
            </li>
            <li>
              <strong>Collaborative Intercepts:</strong> Instead of "one-click" generation, we use multi-stage workflows where the human practitioner validates the agent's logic at key milestones before the final output is generated.
            </li>
          </ul>

          <p>
            Ultimately, successful AI deployment in legal isn't about the model's IQ—it's about the model's <strong>transparency</strong>.
          </p>
        </article>

        {/* CTA Section */}
        <div className="mt-24 p-12 bg-vmSlate border border-slate-100 rounded-sm text-center">
          <div className="w-16 h-16 bg-vmTeal/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Zap className="w-8 h-8 text-vmTeal" />
          </div>
          <h3 className="text-3xl font-serif text-vmNavy mb-6 italic">Quantify your efficiency paradox.</h3>
          <p className="text-slate-600 mb-10 max-w-xl mx-auto">
            Our strategic assessment identifies where manual review is killing your AI ROI and how to build verifiable guardrails that your partners will actually trust.
          </p>
          <Link 
            to="/start" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all group"
          >
            Start Strategic Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LegalAIDeployment;
