
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Quote, Shield } from 'lucide-react';

const SovereignIntelligence: React.FC = () => {
  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/insights" className="inline-flex items-center gap-2 text-slate-400 hover:text-vmNavy transition-colors mb-12 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Insights
        </Link>
        
        <header className="mb-16">
          <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">Executive Brief</span>
          <h1 className="text-5xl md:text-6xl font-serif text-vmNavy mb-8 leading-tight">The Sovereign Intelligence Mandate.</h1>
          <p className="text-xl text-slate-500 font-light italic">Published JAN 05, 2025</p>
        </header>

        <article className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-light space-y-8">
          <p className="text-xl leading-relaxed">
            In the rapidly evolving landscape of enterprise AI, a critical shift is occurring. Organizations that once rushed to adopt general-purpose LLMs are now facing the reality of data leakage and regulatory non-compliance.
          </p>

          <h3 className="text-2xl font-serif text-vmNavy mt-12 mb-6">The Liability of the Multi-Tenant Shortcut</h3>
          <p>
            The majority of high-trust businesses—medical clinics, legal firms, and asset managers—initially integrated AI through simple API wrappers. While functional, this architecture inherently creates a <strong>Dependency Risk</strong>. Your most valuable operational IP is being processed by third-party systems where you have zero oversight of the underlying weights or data retention policies.
          </p>

          <div className="bg-vmSlate p-8 border-l-4 border-vmTeal my-12 italic text-vmNavy text-lg">
            <Quote className="w-8 h-8 text-vmTeal/30 mb-4" />
            "In a world where intelligence is commoditized, the only defensible moat is the sovereignty of your own operational data."
          </div>

          <h3 className="text-2xl font-serif text-vmNavy mt-12 mb-6">The Three Pillars of Sovereignty</h3>
          <p>
            Vision Managers advocates for a three-tiered approach to infrastructure that we call the <strong>Verifiable Stack</strong>:
          </p>
          <ol className="list-decimal pl-6 space-y-6">
            <li>
              <strong>Private Inference:</strong> Transitioning from public APIs to dedicated instances where data is processed within your virtual private cloud (VPC). No data is ever used for training by the provider.
            </li>
            <li>
              <strong>Instruction Isolation:</strong> Building brand-specific guardrails that are mathematically isolated from the model's general alignment. This prevents "hallucination leak" from other industries.
            </li>
            <li>
              <strong>Hardware Anchoring:</strong> Leveraging local hardware for ultra-low latency tasks that require zero-trust security postures.
            </li>
          </ol>

          <p>
            By 2025, data sovereignty will not be an "option" for high-trust businesses; it will be a compliance requirement. Those who fail to build sovereign intelligence today will face expensive migration costs and potential litigation tomorrow.
          </p>
        </article>

        {/* CTA Section */}
        <div className="mt-24 p-12 bg-vmNavy text-white rounded-sm text-center relative overflow-hidden group">
          <div className="relative z-10">
            <Shield className="w-12 h-12 text-vmTeal mx-auto mb-8" />
            <h3 className="text-3xl font-serif mb-6 italic">Secure your data infrastructure.</h3>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto">
              Our Sovereign Intelligence Audit evaluates your current AI dependencies and provides a roadmap for private, secure deployment.
            </p>
            <Link 
              to="/solutions#audit-form" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-vmTeal text-vmNavy font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white transition-all group/btn"
            >
              Request Revenue Workflow Audit <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rotate-45 transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default SovereignIntelligence;
