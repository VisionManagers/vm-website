
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { IMAGES, TESTIMONIALS, BOOKING_URLS } from '../constants';
import {
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mic,
  Search,
  Rocket,
  GraduationCap,
  CalendarCheck,
  Clock,
  DollarSign,
  Star
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <>
    <SEO
      title="Home"
      description="Voice AI for healthcare practices. Your AI receptionist answers every call, books appointments, and never puts a patient on hold. Live in 14 days. Vision Managers."
      path="/"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Vision Managers',
        url: 'https://visionmanagers.com',
        logo: 'https://storage.googleapis.com/vm-website/web%20images/vm-logo%402x.png',
        description: 'Voice AI concierge systems for healthcare practices. AI training for individuals and teams.',
        email: 'sukhneet@visionmanagers.com',
        telephone: '+1-425-494-4489',
        areaServed: 'US',
        serviceType: ['AI Voice Agents', 'AI Training', 'AI Consulting'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'AI Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Voice AI Concierge for Healthcare Practices' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Training for Individuals and Organizations' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Discovery and Automation Strategy' } },
          ],
        },
      }}
    />
    <div className="w-full">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20 bg-white">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 mb-10 text-xs font-bold tracking-[0.2em] text-vmNavy uppercase bg-vmTeal/10 rounded-full">
            Voice AI for Healthcare Practices
          </span>
          <h1 className="text-5xl md:text-8xl font-serif text-vmNavy mb-10 leading-[1.05]">
            Your Practice Is <br />
            <span className="italic font-normal">Missing Calls.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
            85% of patients who hit voicemail won't leave a message — they'll call the next practice.
            Our <span className="text-vmNavy font-semibold">AI voice receptionist</span> answers every call, books appointments, and never puts a patient on hold.
            <span className="text-vmTeal font-bold"> Live in 14 days.</span>
          </p>

          <p className="text-sm text-slate-400 mb-14 max-w-2xl mx-auto">
            Flat monthly fee. No per-call charges. No long-term contracts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <a
              href={BOOKING_URLS.DISCOVERY}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-12 py-5 bg-vmNavy text-white rounded-sm font-semibold hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
            >
              Book a Free Discovery Call
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              to="/ai-voice"
              className="w-full sm:w-auto px-12 py-5 bg-white text-vmNavy border border-slate-200 rounded-sm font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group"
            >
              See How It Works
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-vmTeal" /> HIPAA-Conscious</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-vmTeal" /> Live in 14 Days</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-vmTeal" /> No Long-Term Contracts</span>
          </div>

          <div className="pt-10 mt-10 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
              Built for <span className="text-vmNavy">Dentists</span> · <span className="text-vmNavy">Optometrists</span> · <span className="text-vmNavy">Chiropractors</span> · <span className="text-vmNavy">Med Spas</span> · <span className="text-slate-400">and other healthcare practices</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF: CASE STUDY SPOTLIGHT ─── */}
      <section className="py-20 bg-vmNavy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vmNavy via-vmNavy to-vmTeal/10" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="text-vmTeal font-black text-[10px] uppercase tracking-widest mb-4 block">Client Results</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-sm p-8 md:p-12 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-4">Voice AI — Seattle-Area Optometry Practice</p>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-6 leading-snug">
                  5 new patient appointments booked in <span className="text-vmTeal italic">week one.</span>
                </h3>
                <p className="text-white/60 leading-relaxed mb-8">
                  After deploying their Voice AI concierge, the practice immediately started capturing after-hours calls that previously went to voicemail — converting them into booked appointments without adding staff.
                </p>
                <a
                  href={BOOKING_URLS.DISCOVERY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-vmTeal font-semibold hover:underline group text-sm"
                >
                  Get results like this <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-vmTeal mb-2">5</div>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Appointments</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">$4,300<span className="text-lg">+</span></div>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Visit Value</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-vmTeal mb-2">2</div>
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THREE SERVICES ─── */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-vmTeal font-black text-[10px] uppercase tracking-widest mb-4 block">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-serif text-vmNavy mb-4">Three ways we help.</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-light">Choose what fits — or let us figure it out together on a free discovery call.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Voice AI — Featured */}
            <div className="relative p-8 md:p-10 bg-white border-2 border-vmTeal rounded-sm hover:shadow-2xl transition-all group">
              <div className="absolute -top-3 left-8 px-3 py-1 bg-vmTeal text-vmNavy text-[10px] font-black uppercase tracking-widest rounded-sm">Most Popular</div>
              <div className="w-12 h-12 bg-vmTeal/10 rounded-full flex items-center justify-center mb-6">
                <Mic className="w-6 h-6 text-vmTeal" />
              </div>
              <h3 className="text-2xl font-serif text-vmNavy mb-3">Voice AI Concierge</h3>
              <p className="text-sm text-slate-500 mb-2 font-medium">Best for: Healthcare practices</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Your AI front desk. Answers every call, books appointments, confirms scheduling, handles FAQs, and escalates to your staff when needed. 24/7. No extra headcount.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  'Natural, human-sounding voice',
                  'EHR-aware scheduling',
                  'HIPAA-conscious architecture',
                  'Live in 10–14 days',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-vmTeal shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={BOOKING_URLS.DISCOVERY}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-vmNavy text-white font-bold uppercase tracking-widest text-[11px] rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all flex items-center justify-center gap-2 group/btn"
              >
                Book a Voice AI Demo <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </a>
            </div>

            {/* AI Training */}
            <div className="p-8 md:p-10 bg-white border border-slate-200 rounded-sm hover:shadow-2xl transition-all group">
              <div className="w-12 h-12 bg-vmNavy/5 rounded-full flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6 text-vmNavy" />
              </div>
              <h3 className="text-2xl font-serif text-vmNavy mb-3">AI Training</h3>
              <p className="text-sm text-slate-500 mb-2 font-medium">Best for: Individuals & business teams</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                From zero to AI-native in 3 hours — not weeks. Hands-on training with real AI tools applied to your actual role. You leave being able to build things yourself. Guaranteed.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  'Beginner to advanced',
                  'Customized to your industry',
                  'Real tools, real workflows',
                  '1-on-1 or corporate formats',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-vmTeal shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={BOOKING_URLS.DISCOVERY}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-white text-vmNavy border border-slate-200 font-bold uppercase tracking-widest text-[11px] rounded-sm hover:bg-vmNavy hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
              >
                Book a Training Session <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </a>
            </div>

            {/* Discovery Call */}
            <div className="p-8 md:p-10 bg-white border border-slate-200 rounded-sm hover:shadow-2xl transition-all group">
              <div className="w-12 h-12 bg-vmNavy/5 rounded-full flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-vmNavy" />
              </div>
              <h3 className="text-2xl font-serif text-vmNavy mb-3">Free Discovery Call</h3>
              <p className="text-sm text-slate-500 mb-2 font-medium">Best for: Anyone exploring AI</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Not sure where to start? We'll map your current workflows, show you where AI and automation save you time and money, and give you a clear next step — in 20 minutes.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  'Free, no-obligation',
                  'Tailored to your practice',
                  'Actionable recommendations',
                  'Clear pricing before you commit',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-vmTeal shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={BOOKING_URLS.DISCOVERY}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-white text-vmNavy border border-slate-200 font-bold uppercase tracking-widest text-[11px] rounded-sm hover:bg-vmNavy hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
              >
                Book Free Call <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-32 bg-vmSlate/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-vmTeal font-black text-[10px] uppercase tracking-widest mb-4 block">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-serif text-vmNavy mb-4">How it works.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '1',
                title: 'Discovery',
                icon: Search,
                desc: 'Free 20-minute call. We map your current workflow, identify where calls drop off, and define what your AI solution looks like.',
                detail: 'Free — no commitment',
              },
              {
                step: '2',
                title: 'Build & Configure',
                icon: Zap,
                desc: 'We build and train your AI on your specific workflows, tone, and systems. You review and approve before anything goes live.',
                detail: '10–14 days typical',
              },
              {
                step: '3',
                title: 'Go Live & Optimize',
                icon: Rocket,
                desc: 'Your AI goes live. We monitor and optimize performance, fine-tuning responses and flows based on real call data.',
                detail: 'Ongoing support included',
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative mx-auto mb-8 w-20 h-20">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-vmNavy group-hover:bg-vmNavy group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-2xl border border-slate-100">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-vmTeal text-vmNavy text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white z-10 shadow-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-vmNavy mb-3 uppercase tracking-widest text-sm">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 max-w-xs mx-auto">{item.desc}</p>
                <p className="text-vmTeal text-xs font-bold uppercase tracking-widest">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href={BOOKING_URLS.DISCOVERY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 bg-vmNavy text-white font-semibold rounded-sm hover:shadow-2xl hover:-translate-y-1 transition-all group"
            >
              Start with a Free Discovery Call <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="mt-4 text-xs text-slate-400">20 minutes. No pitch. Just clarity on what AI can do for you.</p>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-vmTeal font-black text-[10px] uppercase tracking-widest mb-4 block">What People Say</span>
            <h2 className="text-4xl font-serif text-vmNavy mb-4">Trusted by healthcare professionals.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-10 bg-vmSlate rounded-sm group hover:bg-white hover:shadow-2xl transition-all border border-slate-100 flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-vmTeal text-vmTeal" />
                  ))}
                </div>
                <div className="flex-grow">
                  <p className="text-lg text-slate-700 italic mb-8 leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="pt-6 border-t border-slate-50">
                  <h5 className="font-bold text-vmNavy text-sm">{t.name}</h5>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32 border-t border-slate-100 bg-vmSlate/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif text-vmNavy mb-6 italic">Ready to stop missing calls?</h2>
          <p className="text-lg text-slate-600 mb-4 max-w-2xl mx-auto">
            In 20 minutes, we'll show you exactly how many calls your practice is missing, what that's costing you, and how AI fixes it — specific to your situation.
          </p>
          <p className="text-sm text-slate-400 mb-12">No pitch. No pressure. Just a clear picture.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href={BOOKING_URLS.DISCOVERY}
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-5 bg-vmNavy text-white rounded-sm font-semibold hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 group"
            >
              Book Your Free Discovery Call <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <p className="mt-8 text-xs text-slate-400">
            Or call directly: <a href="tel:+14254944489" className="text-vmNavy font-semibold hover:text-vmTeal transition-colors">(425) 494-4489</a>
          </p>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
