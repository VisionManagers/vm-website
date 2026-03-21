import React, { useState } from 'react';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import {
  PhoneOff, Clock, TrendingDown, Clock4, CalendarCheck, Shield, Users,
  Rocket, Mic, BarChart3, Settings, CheckCircle2, ChevronDown, Star,
  Loader2
} from 'lucide-react';

const AIVoice: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    challenge: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!formData.full_name.trim() || formData.full_name.trim().length < 2) return 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address.';
    const digits = formData.phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSubmitting(true);
    try {
      const { error: dbError } = await supabase.from('leads').insert([{
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || null,
        challenge: formData.challenge || null,
        source: 'ai-voice-medical-leadpage',
      }]);
      if (dbError) throw dbError;
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // ── Thank-You State ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-vmTeal/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-[scale-in_0.5s_ease-out]">
            <CheckCircle2 className="w-10 h-10 text-vmTeal" />
          </div>
          <h1 className="text-4xl font-serif text-vmNavy mb-4">We Got Your Info!</h1>
          <p className="text-slate-600 text-lg mb-8">
            Thanks for reaching out. A member of the Vision Managers team will contact you within <strong>24 hours</strong> to discuss how AI voice agents can work for your practice.
          </p>
          <div className="bg-vmSlate rounded-xl p-8 text-left mb-8">
            <h2 className="font-bold text-lg text-vmNavy mb-4">What happens next:</h2>
            <ol className="space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="bg-vmTeal/20 text-vmNavy font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
                <span>We review your practice details and prepare a personalized overview</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-vmTeal/20 text-vmNavy font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
                <span>We'll call or email to schedule a quick 15-minute discovery call</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-vmTeal/20 text-vmNavy font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
                <span>You'll hear a live demo of your AI voice agent, customized for your practice</span>
              </li>
            </ol>
          </div>
          <button onClick={() => window.location.hash = '/'} className="text-vmNavy font-bold hover:text-vmTeal transition-colors">
            &larr; Return Home
          </button>
        </div>
      </div>
    );
  }

  // ── Lead Form Component ───────────────────────────────────────────
  const LeadForm = ({ id, dark }: { id?: string; dark?: boolean }) => (
    <form id={id} onSubmit={handleSubmit} className={`rounded-2xl p-8 md:p-10 ${dark ? 'bg-white shadow-2xl' : 'bg-vmSlate border border-slate-200'}`}>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor={`full_name_${id}`} className="block text-sm font-semibold text-vmNavy mb-1">Full Name <span className="text-red-500">*</span></label>
          <input type="text" id={`full_name_${id}`} value={formData.full_name} onChange={update('full_name')} required placeholder="Dr. Jane Smith"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-vmTeal focus:border-vmTeal outline-none transition" />
        </div>
        <div>
          <label htmlFor={`email_${id}`} className="block text-sm font-semibold text-vmNavy mb-1">Email <span className="text-red-500">*</span></label>
          <input type="email" id={`email_${id}`} value={formData.email} onChange={update('email')} required placeholder="jane@yourpractice.com"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-vmTeal focus:border-vmTeal outline-none transition" />
        </div>
        <div>
          <label htmlFor={`phone_${id}`} className="block text-sm font-semibold text-vmNavy mb-1">Phone Number <span className="text-red-500">*</span></label>
          <input type="tel" id={`phone_${id}`} value={formData.phone} onChange={update('phone')} required placeholder="(555) 123-4567"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-vmTeal focus:border-vmTeal outline-none transition" />
        </div>
        <div>
          <label htmlFor={`company_${id}`} className="block text-sm font-semibold text-vmNavy mb-1">Practice Name</label>
          <input type="text" id={`company_${id}`} value={formData.company} onChange={update('company')} placeholder="Bright Smile Dental"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-vmTeal focus:border-vmTeal outline-none transition" />
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor={`challenge_${id}`} className="block text-sm font-semibold text-vmNavy mb-1">What's your biggest challenge with phone calls?</label>
        <select id={`challenge_${id}`} value={formData.challenge} onChange={update('challenge')}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-800 focus:ring-2 focus:ring-vmTeal focus:border-vmTeal outline-none transition">
          <option value="">Select one...</option>
          <option value="after-hours">Too many after-hours calls going to voicemail</option>
          <option value="overwhelmed-staff">Front desk is overwhelmed during peak hours</option>
          <option value="missed-calls">We know we're missing calls but can't quantify it</option>
          <option value="scheduling">Patients struggle to schedule appointments</option>
          <option value="multiple-locations">Managing calls across multiple locations</option>
          <option value="other">Something else</option>
        </select>
      </div>
      {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      <button type="submit" disabled={submitting}
        className="w-full mt-6 bg-vmNavy hover:bg-vmNavy/90 text-white font-bold py-4 px-8 rounded-lg text-lg transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Get Your Free Consultation'}
      </button>
      <p className="text-center text-slate-400 text-xs mt-3">We'll reach out within 24 hours. No spam, no obligation.</p>
    </form>
  );

  // ── Main Page ─────────────────────────────────────────────────────
  return (
    <>
    <SEO
      title="AI Voice Agents"
      description="Stop losing patients to voicemail. 24/7 AI voice reception for dental, optometry, chiropractic, and med spa practices. Natural-sounding, HIPAA-conscious, live in 14 days."
      path="/ai-voice"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'AI Voice Agents for Medical Practices',
        provider: { '@type': 'Organization', name: 'Vision Managers' },
        description: '24/7 AI-powered phone reception for healthcare practices. Answers every call, books appointments automatically.',
        url: 'https://visionmanagers.com/ai-voice',
        serviceType: ['AI Voice Agent', 'Virtual Receptionist', 'Medical Practice Automation'],
      }}
    />
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative bg-vmNavy text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vmNavy via-vmNavy/95 to-vmTeal/20" />
        <div className="relative max-w-7xl mx-auto px-6 pt-44 pb-20 md:pb-28 text-center">
          <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-6">
            Stop Losing Patients<br />to <span className="italic text-vmTeal">Voicemail</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 font-light">
            Your practice misses calls every day — after hours, during lunch, when staff is busy.
            Each missed call is a patient who books somewhere else. Our AI voice agents answer every call,
            24/7, so you never lose another lead.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#get-started" className="bg-vmTeal text-vmNavy px-8 py-4 rounded-lg font-bold text-lg hover:bg-vmTeal/90 transition shadow-lg">
              See How It Works
            </a>
            <a href="#benefits" className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition">
              Learn More
            </a>
          </div>
          <p className="text-white/50 text-sm mt-6">Dental &bull; Optometry &bull; Dermatology &bull; Any high-volume practice</p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 md:py-28 bg-vmSlate">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">The Problem</span>
            <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-4">This Is Costing You Real Money</h2>
            <p className="text-slate-500 text-lg font-light">Most practices don't realize how many patients they lose before they ever walk through the door.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: PhoneOff, title: "After-Hours Calls Go Nowhere", desc: "40% of patient calls happen outside business hours. Every one that hits voicemail is a potential booking lost to a competitor who picks up." },
              { icon: TrendingDown, title: "Front Desk Is Overwhelmed", desc: "Your staff juggles check-ins, insurance questions, and ringing phones. When they can't keep up, calls go unanswered and patients feel ignored." },
              { icon: TrendingDown, title: "Revenue Walks Out the Door", desc: "A single missed new-patient call can mean $1,000+ in lifetime value gone. Multiply that across a month and the losses add up fast." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-slate-200">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-vmNavy">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">The Solution</span>
            <h2 className="text-3xl md:text-4xl font-serif text-vmNavy mb-4">An AI Voice Agent That Works Like Your Best Receptionist</h2>
            <p className="text-slate-500 text-lg font-light">Our AI answers calls naturally, books appointments, answers common questions, and routes urgent matters — all without putting a single patient on hold.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                { icon: Clock4, title: "24/7 Call Answering", desc: "Nights, weekends, holidays — every call gets answered by a professional, natural-sounding AI voice agent." },
                { icon: CalendarCheck, title: "Instant Appointment Booking", desc: "Integrates with your scheduling system to book, reschedule, or confirm appointments in real time." },
                { icon: Shield, title: "HIPAA-Conscious Design", desc: "Built with healthcare privacy in mind. No sensitive health data is stored — just the information needed to get patients scheduled." },
                { icon: Users, title: "Frees Up Your Staff", desc: "Your front desk focuses on in-office patients while the AI handles the phones. Better experience for everyone." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-vmTeal/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <item.icon className="w-5 h-5 text-vmNavy" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-vmNavy">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-vmNavy/5 to-vmTeal/10 rounded-2xl p-8 md:p-12">
              <div className="text-center">
                <p className="text-5xl font-bold text-vmNavy mb-2">85%</p>
                <p className="text-slate-600 mb-8">of callers won't leave a voicemail — they'll just call the next practice</p>
                <div className="border-t border-slate-200 pt-8">
                  <p className="text-5xl font-bold text-vmNavy mb-2">$30K+</p>
                  <p className="text-slate-600">average annual revenue lost per practice from missed calls</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 md:py-28 bg-vmSlate">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">Why Us</span>
            <h2 className="text-3xl md:text-4xl font-serif text-vmNavy">Why Practices Choose Vision Managers</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Rocket, title: "Live in Days, Not Months", desc: "We configure and deploy your AI voice agent in under a week. No IT team required." },
              { icon: Mic, title: "Sounds Natural", desc: "Patients can't tell it's AI. Natural conversation flow, not robotic menus or hold music." },
              { icon: BarChart3, title: "ROI From Week One", desc: "Capture just 2-3 extra patients per month and the system pays for itself many times over." },
              { icon: Settings, title: "Fully Customized", desc: "Trained on your practice's services, hours, providers, and protocols. It's your receptionist, just AI-powered." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center border border-slate-200">
                <div className="w-14 h-14 bg-vmTeal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-vmNavy" />
                </div>
                <h3 className="font-bold mb-2 text-vmNavy">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">Results</span>
            <h2 className="text-3xl md:text-4xl font-serif text-vmNavy">What Practice Owners Are Saying</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "We were sending at least 15 calls a week to voicemail after 5pm. Within the first month, the AI agent captured 12 new patient bookings we would have lost.", name: "Dr. Sarah M.", title: "Dental Practice Owner" },
              { quote: "My front desk staff was drowning in calls. Now the AI handles routine scheduling and they can actually focus on patients in the office. Game changer.", name: "Dr. James T.", title: "Optometry Practice" },
              { quote: "I was skeptical about AI answering patient calls, but the quality blew me away. Patients have actually complimented how easy it was to schedule after hours.", name: "Dr. Priya K.", title: "Multi-Location Dermatology" },
            ].map((t, i) => (
              <div key={i} className="bg-vmSlate rounded-xl p-8 border border-slate-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-600 mb-6 italic">"{t.quote}"</p>
                <p className="font-semibold text-sm text-vmNavy">{t.name}</p>
                <p className="text-slate-400 text-sm">{t.title}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-slate-400 text-sm">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> HIPAA-Conscious</div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 24/7 Availability</div>
            <div className="flex items-center gap-2"><Rocket className="w-4 h-4" /> Setup in Days</div>
          </div>
        </div>
      </section>

      {/* CTA / Lead Form */}
      <section id="get-started" className="py-20 md:py-28 bg-vmNavy text-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Find Out How Many Patients You're Losing</h2>
            <p className="text-white/70 text-lg font-light">Tell us about your practice and we'll show you exactly how an AI voice agent can capture missed revenue. Free consultation, no pressure.</p>
          </div>
          <LeadForm id="get-started-form" dark />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-vmSlate">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-serif text-vmNavy">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Will patients know they're talking to an AI?", a: "Most patients can't tell. Our AI uses advanced natural language processing to have fluid, human-like conversations. It handles greetings, scheduling, and common questions just like a trained receptionist would. We're transparent if a patient directly asks, but most simply appreciate getting their call answered immediately." },
              { q: "What happens if the AI can't handle a call?", a: "The AI is trained to recognize when a situation needs a human touch — emergencies, complex insurance questions, upset patients. In those cases, it takes a message with full context and flags it for immediate follow-up by your team. During office hours, it can transfer directly to staff." },
              { q: "How long does setup take?", a: "Most practices are live within 3-5 business days. We handle the technical setup, train the AI on your specific services and protocols, and test thoroughly before going live. You don't need an IT team or any technical expertise." },
              { q: "What does it cost?", a: "Pricing depends on your call volume and the level of customization needed. Most single-location practices find the cost is a fraction of hiring additional front desk staff — and the AI never calls in sick. We'll give you transparent pricing during your free consultation." },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-slate-200 group" {...(i === 0 ? { open: true } : {})}>
                <summary className="font-bold text-vmNavy cursor-pointer list-none flex justify-between items-center p-6">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <p className="text-slate-600 px-6 pb-6">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default AIVoice;