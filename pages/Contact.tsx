
import React, { useState } from 'react';
import SEO from '../components/SEO';
import { BOOKING_URLS } from '../constants';
import { Send, CheckCircle2, Phone, Mail, ArrowRight, CalendarCheck } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    practice: '',
    website: '',
    interest: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full p-12 text-center">
          <div className="w-20 h-20 bg-vmTeal/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-vmTeal" />
          </div>
          <h2 className="text-3xl font-serif text-vmNavy mb-4">Message Sent.</h2>
          <p className="text-slate-600 mb-8">Thank you for reaching out. We'll get back to you shortly.</p>
          <a
            href={BOOKING_URLS.DISCOVERY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-vmNavy text-white rounded-sm font-semibold hover:shadow-xl transition-all group"
          >
            Book a Call Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
    <SEO
      title="Contact"
      description="Book a free discovery call with Vision Managers. Learn how Voice AI can help your healthcare practice capture more patients. Email sukhneet@visionmanagers.com or call (425) 494-4489."
      path="/contact"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Vision Managers',
        url: 'https://visionmanagers.com/contact',
      }}
    />
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
        <div>
          <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">Let's Talk</span>
          <h1 className="text-5xl font-serif text-vmNavy mb-8 leading-tight">Book a <br /><span className="italic">Discovery Call.</span></h1>
          <p className="text-xl text-slate-600 font-light leading-relaxed mb-8">
            In 20 minutes, we'll map your situation, show you where AI creates the most value, and give you a clear next step. No pitch. No pressure.
          </p>

          {/* Primary CTA — Booking */}
          <a
            href={BOOKING_URLS.DISCOVERY}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all group mb-12"
          >
            <CalendarCheck className="w-5 h-5" />
            Book Free Discovery Call
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <div className="space-y-6 pt-8 border-t border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Or reach out directly</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-vmSlate rounded-full flex items-center justify-center text-vmNavy">
                <Mail className="w-5 h-5" />
              </div>
              <a href="mailto:sukhneet@visionmanagers.com" className="text-slate-600 hover:text-vmTeal transition-colors">sukhneet@visionmanagers.com</a>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-vmSlate rounded-full flex items-center justify-center text-vmNavy">
                <Phone className="w-5 h-5" />
              </div>
              <a href="tel:+14254944489" className="text-slate-600 hover:text-vmTeal transition-colors">(425) 494-4489</a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-vmSlate p-10 rounded-sm border border-slate-100 shadow-sm space-y-6">
          <p className="text-xs text-slate-500 mb-2">Prefer to send a message? All fields optional except email.</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-vmNavy">Your Name</label>
              <input
                type="text"
                className="w-full p-4 bg-white border border-slate-200 outline-none focus:border-vmTeal transition-colors"
                placeholder="Jane Smith"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-vmNavy">Email <span className="text-red-400">*</span></label>
              <input
                required
                type="email"
                className="w-full p-4 bg-white border border-slate-200 outline-none focus:border-vmTeal transition-colors"
                placeholder="jane@yourpractice.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-vmNavy">Practice / Business</label>
              <input
                type="text"
                className="w-full p-4 bg-white border border-slate-200 outline-none focus:border-vmTeal transition-colors"
                placeholder="Bright Smile Dental"
                value={formData.practice}
                onChange={(e) => setFormData({...formData, practice: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-vmNavy">Website</label>
              <input
                type="url"
                className="w-full p-4 bg-white border border-slate-200 outline-none focus:border-vmTeal transition-colors"
                placeholder="yourpractice.com"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-vmNavy">I'm interested in...</label>
            <select
              className="w-full p-4 bg-white border border-slate-200 outline-none focus:border-vmTeal transition-colors text-slate-600"
              value={formData.interest}
              onChange={(e) => setFormData({...formData, interest: e.target.value})}
            >
              <option value="">Select one (optional)</option>
              <option value="voice-ai">Voice AI for my practice</option>
              <option value="ai-training">AI Training (for me or my team)</option>
              <option value="automation">AI & automation strategy</option>
              <option value="unsure">Not sure yet — help me figure it out</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-vmNavy">Anything else?</label>
            <textarea
              className="w-full p-4 bg-white border border-slate-200 outline-none focus:border-vmTeal transition-colors min-h-[100px]"
              placeholder="Tell us about your situation..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-vmNavy text-white font-bold uppercase tracking-widest text-[11px] rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all flex items-center justify-center gap-3"
          >
            Send Message <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Contact;
