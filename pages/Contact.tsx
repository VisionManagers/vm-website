
import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, Mail, User } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
          <p className="text-slate-600 mb-8">Thank you for reaching out. A specialist will contact you shortly.</p>
          <button 
            onClick={() => window.location.hash = '/'}
            className="text-vmNavy font-bold hover:text-vmTeal transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
        <div>
          <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">Direct Connection</span>
          <h1 className="text-5xl font-serif text-vmNavy mb-8 leading-tight">Speak with <br /><span className="italic">Vision Managers.</span></h1>
          <p className="text-xl text-slate-600 font-light leading-relaxed mb-12">
            Have a specific operational question? Our team is available for direct consultation regarding high-trust AI implementation.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-vmSlate rounded-full flex items-center justify-center text-vmNavy">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-slate-600">advisor@visionmanagers.com</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-vmSlate rounded-full flex items-center justify-center text-vmNavy">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-slate-600">+1 (800) VM-TRUST</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-vmSlate p-10 rounded-sm border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-vmNavy">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full p-4 bg-white border border-slate-200 outline-none focus:border-vmTeal transition-colors"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-vmNavy">Professional Email</label>
              <input 
                required
                type="email" 
                className="w-full p-4 bg-white border border-slate-200 outline-none focus:border-vmTeal transition-colors"
                placeholder="email@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-vmNavy">Phone (Optional)</label>
              <input 
                type="tel" 
                className="w-full p-4 bg-white border border-slate-200 outline-none focus:border-vmTeal transition-colors"
                placeholder="+1"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-vmNavy">How can we help?</label>
            <textarea 
              required
              className="w-full p-4 bg-white border border-slate-200 outline-none focus:border-vmTeal transition-colors min-h-[150px]"
              placeholder="Briefly describe your situation..."
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
  );
};

export default Contact;
