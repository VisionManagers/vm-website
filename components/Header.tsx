
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IMAGES } from '../constants';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollPosRef = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sophisticated scroll lock to prevent layout jumping/snapping
  useEffect(() => {
    if (isMenuOpen) {
      scrollPosRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // Keep gutter to prevent width jump
    } else {
      const savedScroll = scrollPosRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      if (isMenuOpen === false) {
        window.scrollTo(0, savedScroll);
      }
    }
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Solutions', path: '/solutions' },
    { name: 'The Lab', path: '/lab' },
    { name: 'Insights', path: '/insights' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 px-6 py-4 border-b border-slate-200/50 ${
        isMenuOpen ? 'bg-white' : (isScrolled ? 'py-3 glass-effect' : 'py-5 glass-effect')
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group relative z-[70]">
          <img src={IMAGES.LOGO_CIRCLE} alt="VM" className="h-10 w-10 md:h-12 md:w-12 rounded-full transition-transform duration-500" />
          <span className="font-serif text-xl md:text-2xl tracking-tight text-vmNavy">
            Vision Managers
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-all hover:text-vmTeal relative py-1 ${
                isActive(link.path) ? 'text-vmTeal' : 'text-slate-600'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-vmTeal rounded-full" />
              )}
            </Link>
          ))}
          <Link
            to="/start"
            className="bg-vmNavy text-white px-8 py-3 rounded-sm text-sm font-semibold hover:bg-vmNavy/90 transition-all hover:shadow-lg active:scale-95"
          >
            Start Assessment
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-3 text-vmNavy relative z-[70] focus:outline-none bg-vmSlate/50 rounded-full hover:bg-vmSlate transition-all active:scale-90"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <div className="relative w-6 h-6">
            <span className={`absolute inset-0 transition-all duration-500 transform ${isMenuOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
              <Menu className="w-6 h-6" />
            </span>
            <span className={`absolute inset-0 transition-all duration-500 transform ${isMenuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
              <X className="w-6 h-6" />
            </span>
          </div>
        </button>

        {/* Mobile Menu Overlay - Snappy Circ Reveal */}
        <div 
          className={`fixed inset-0 bg-white z-[65] md:hidden flex flex-col transition-all duration-[500ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
            isMenuOpen 
              ? 'opacity-100' 
              : 'opacity-0 pointer-events-none'
          }`}
          style={{
            clipPath: isMenuOpen ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
            WebkitClipPath: isMenuOpen ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)'
          }}
        >
          {/* Inner Content - Staggered Entry */}
          <div className={`flex flex-col h-full w-full transition-all duration-500 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            
            {/* Background Accent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
              <div className={`absolute -top-20 -right-20 w-[100vw] h-[100vw] bg-vmTeal/10 rounded-full blur-[100px] transition-transform duration-[800ms] ${isMenuOpen ? 'translate-x-0' : 'translate-x-1/2'}`} />
            </div>

            {/* Navigation Links Area */}
            <div className="flex-grow flex flex-col items-center justify-center gap-10 px-8 pt-24 pb-12 overflow-y-auto relative z-10">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-3xl font-serif tracking-tight transition-all duration-500 transform ${
                    isActive(link.path) ? 'text-vmTeal' : 'text-vmNavy'
                  } ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{ transitionDelay: `${150 + idx * 60}ms` }}
                >
                  {link.name}
                </Link>
              ))}
              
              <div 
                className={`w-full max-w-sm pt-8 transition-all duration-500 transform ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${250 + navLinks.length * 60}ms` }}
              >
                <Link
                  to="/start"
                  className="block w-full bg-vmNavy text-white py-5 rounded-sm text-center font-bold tracking-[0.2em] uppercase text-[11px] shadow-2xl active:scale-95 hover:bg-vmNavy/95 transition-all"
                >
                  Start Assessment
                </Link>
                
                <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-100 pt-10">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mb-2">Direct Access</p>
                  <div className="flex flex-col items-center gap-6">
                    <Link to="/contact" className="text-lg font-bold text-vmNavy hover:text-vmTeal transition-colors">Contact Us</Link>
                    <Link to="/about" className="text-lg font-bold text-vmNavy hover:text-vmTeal transition-colors">About the Firm</Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Footer */}
            <div 
              className={`p-8 text-center bg-vmSlate/30 border-t border-slate-100 transition-all duration-500 ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${350 + navLinks.length * 60}ms` }}
            >
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2024 Vision Managers LLC</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
