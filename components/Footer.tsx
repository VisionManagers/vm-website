
import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants';
import { VineDivider, Reveal } from './ornaments';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-12" data-aesthetic="solar">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="flex justify-center mb-16 text-vmNavy/40">
          <VineDivider />
        </Reveal>

        <div className="grid md:grid-cols-12 gap-16 mb-20">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <img src={IMAGES.LOGO_CIRCLE} alt="VM" className="h-8 w-8 rounded-full" />
              <span className="font-serif text-xl text-vmNavy tracking-tight">Vision Managers</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Fractional Chief AI Officer for healthcare and dental organizations.
              Senior AI leadership that owns strategy, governance, and results —
              for a fraction of an executive hire.
            </p>
            <p className="mt-6 text-xs text-slate-400">
              <a href="mailto:sukhneet@visionmanagers.com" className="hover:text-vmTeal transition-colors">sukhneet@visionmanagers.com</a>
              <span className="mx-2 text-slate-200">·</span>
              <a href="tel:+14254944489" className="hover:text-vmTeal transition-colors">(425) 494-4489</a>
            </p>
          </div>

          {/* Nav groups */}
          <div className="md:col-span-6 md:col-start-7 grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-8">
            <div>
              <h5 className="text-xs font-semibold text-vmNavy uppercase tracking-[0.2em] mb-8">Work With Us</h5>
              <ul className="space-y-4">
                <li><Link to="/solutions" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">Solutions</Link></li>
                <li><Link to="/ai-voice" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">AI Voice</Link></li>
                <li><Link to="/start" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">Start Here</Link></li>
                <li><Link to="/contact" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-vmNavy uppercase tracking-[0.2em] mb-8">Learn</h5>
              <ul className="space-y-4">
                <li><Link to="/lab" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">The Lab</Link></li>
                <li><Link to="/insights" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">Insights</Link></li>
                <li><Link to="/casual-intelligence" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">Casual Intelligence</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h5 className="text-xs font-semibold text-vmNavy uppercase tracking-[0.2em] mb-8">Firm</h5>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">About</Link></li>
                <li><Link to="/privacy" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} Vision Managers LLC.</span>
            <span className="text-slate-200 hidden sm:inline">|</span>
            <a
               href="https://www.linkedin.com/in/sukhneetsingh/"
               target="_blank"
               rel="noopener noreferrer"
               className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-vmTeal transition-colors"
             >
               LinkedIn
             </a>
          </div>
          <p className="text-[10px] text-slate-300 uppercase tracking-[0.3em]">Structure that holds · growth that lives</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
