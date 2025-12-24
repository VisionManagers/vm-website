
import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-16 mb-24">
          {/* Left Column: Brand & Description */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <img src={IMAGES.LOGO_CIRCLE} alt="VM" className="h-8 w-8 rounded-full" />
              <span className="font-serif text-xl text-vmNavy tracking-tight">Vision Managers</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Securing the future of high-trust businesses through Operational AI solutions and rigorous governance. We bridge the gap between  strategy and revenue.
            </p>
          </div>
          
          {/* Right Columns: Grouped Navigation */}
          <div className="md:col-span-6 md:col-start-7 grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-8">
            <div>
              <h5 className="text-xs font-bold text-vmNavy uppercase tracking-[0.2em] mb-8">Core</h5>
              <ul className="space-y-4">
                <li><Link to="/solutions" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">Solutions</Link></li>
                <li><Link to="/lab" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">The Lab</Link></li>
                <li><Link to="/insights" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">Insights</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-vmNavy uppercase tracking-[0.2em] mb-8">Firm</h5>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">About</Link></li>
                <li><Link to="/start" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">Assessment</Link></li>
                <li><Link to="/contact" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h5 className="text-xs font-bold text-vmNavy uppercase tracking-[0.2em] mb-8">Legal</h5>
              <ul className="space-y-4">
                <li><Link to="/privacy" className="text-sm text-slate-600 hover:text-vmTeal transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} Vision Managers LLC. All operational data is encrypted.</span>
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
