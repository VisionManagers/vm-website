
import React from 'react';
import { ChevronRight } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-40 pb-24 px-6 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-6 block">The Firm</span>
        <h1 className="text-5xl md:text-6xl font-serif text-vmNavy mb-12 leading-tight">About <br /><span className="italic">Vision Managers.</span></h1>
        
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-light space-y-10 text-lg">
          <p>
            Vision Managers builds AI solutions that help high-trust businesses attract and retain more clients. Founded a decade ago as a UX research consultancy, the firm has evolved alongside the technology landscape—but the core approach remains unchanged: deep understanding of how people actually behave drives every system we build. Healthcare practices, real estate firms, private equity groups, and technology companies work with Vision Managers because effective AI isn't about automation for its own sake. It's about understanding your clients deeply enough to serve them better.
          </p>

          <p>
            Suk brings an unusual combination of enterprise research rigor and hands-on operational experience. His background includes UX research leadership at Facebook and CVS Health, where his work expanded team capacity and shaped experiences for over a million monthly users. He's also run a fire mitigation company, led a nursing home through COVID, and grew a family optometry practice 200% in under a year. This blend of big-company methodology and founder-level scrappiness means Vision Managers delivers solutions built for how businesses actually operate—not how they look on a whiteboard.
          </p>

          <p>
            Previous clients have described working with Suk as discovering hidden value they didn't know existed in their business. If you're leading a practice or company where trust and relationships are central to growth, we'd welcome a conversation.
          </p>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center gap-6">
          <a 
            href="https://api.leadconnectorhq.com/widget/booking/SrykTWRlxCfGTJxswRqv" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-12 py-5 bg-vmNavy text-white rounded-sm font-semibold hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
          >
            Book Strategy Call
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
