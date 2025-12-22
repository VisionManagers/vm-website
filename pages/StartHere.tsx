
import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const StartHere: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    industry: '',
    industryOther: '',
    role: '',
    locations: '',
    bottleneck: '',
    bottleneckOther: '',
    timeline: '',
    budget: '',
    fixedDescription: '',
    name: '',
    email: '',
    company: '',
    website: '',
    phone: '',
    consent: false
  });

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.industry) newErrors.industry = "Please select your industry.";
      if (formData.industry === 'Other' && !formData.industryOther) newErrors.industryOther = "Please specify your industry.";
      if (!formData.role) newErrors.role = "Please select your professional role.";
      if (!formData.locations) newErrors.locations = "Please specify the number of locations.";
    } else if (step === 2) {
      if (!formData.bottleneck) newErrors.bottleneck = "Please identify your primary bottleneck.";
      if (formData.bottleneck === 'Other' && !formData.bottleneckOther) newErrors.bottleneckOther = "Please specify your bottleneck.";
      if (!formData.timeline) newErrors.timeline = "Please select your target timeline.";
      if (!formData.budget) newErrors.budget = "Please select an allocated budget range.";
    } else if (step === 3) {
      if (!formData.name) newErrors.name = "Full name is required.";
      
      // Email Validation
      if (!formData.email) {
        newErrors.email = "A work email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid work email address.";
      }

      if (!formData.company) newErrors.company = "Company name is required.";

      // Website Validation (Loose check for .com, .org, .ai etc)
      if (formData.website && !/\.[a-z]{2,}$/i.test(formData.website)) {
        newErrors.website = "Please enter a valid website (e.g., domain.com).";
      }

      // Phone Validation (Numeric only, no text)
      if (formData.phone && !/^[0-9+\-() ]+$/.test(formData.phone)) {
        newErrors.phone = "Phone number must be numeric (no letters allowed).";
      }
      
      // Consent is optional as per user request
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const nextStep = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep()) {
      return;
    }

    if (step < 3) {
      setStep(s => s + 1);
      setErrors({});
      window.scrollTo(0, 0);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const webhookUrl = 'https://services.leadconnectorhq.com/hooks/q4adJN1peFzHlHvxv37q/webhook-trigger/ef5b9be6-149e-4201-9190-e1c102a80f08';
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: 'Website Strategic Assessment'
        }),
      });

      if (response.ok) {
        setStep(4);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an issue submitting your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    setErrors({});
    window.scrollTo(0, 0);
  };

  const industries = ["Dental", "Optometry", "Tech", "Construction", "Real Estate", "Private Equity / Portfolio Team", "Other"];
  const roles = ["Owner / Partner", "Executive (COO / GM / VP)", "Acquisitions / Operating Partner", "Manager / Team Lead", "Staff / Researching"];
  const locationOptions = ["1 location", "2–5 locations", "6+ locations"];
  
  const bottlenecks = ["Missed calls", "Scheduling + no-shows", "Inconsistent follow-up", "Manual admin", "Poor reporting", "Systems don’t connect", "Other"];
  const timelines = ["Now (0–30 days)", "Soon (1–3 months)", "Later (3+ months)"];
  const budgets = ["Under $2.5k", "$2.5k–$10k", "$10k–$25k", "$25k–$50k", "$50k+"];

  const ErrorLabel = ({ message }: { message?: string }) => message ? (
    <div className="flex items-center gap-1.5 mt-2 text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
      <AlertCircle className="w-3.5 h-3.5" />
      <span className="text-[11px] font-bold uppercase tracking-wider">{message}</span>
    </div>
  ) : null;

  if (step === 4) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center bg-vmSlate">
        <div className="max-w-md w-full bg-white p-12 rounded-sm shadow-2xl text-center">
          <div className="w-20 h-20 bg-vmTeal/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-vmTeal" />
          </div>
          <h2 className="text-3xl font-serif text-vmNavy mb-4">Thank you - submission received.</h2>
          <p className="text-slate-600 mb-8">Please monitor your email for your custom assessment.</p>
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
    <div className="pt-32 pb-20 px-6 min-h-screen bg-vmSlate">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <h1 className="text-3xl font-serif text-vmNavy">Strategic Assessment</h1>
            <span className="text-sm font-bold text-vmTeal uppercase tracking-widest">Step {step} of 3</span>
          </div>
          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-vmTeal transition-all duration-700 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }} 
            />
          </div>
        </div>

        <form onSubmit={nextStep} className="bg-white p-8 md:p-12 rounded-sm shadow-xl border border-slate-100">
          {step === 1 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <h2 className="text-xs font-black text-vmTeal uppercase tracking-widest mb-6">Page 1 — Fit</h2>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-4">Select your industry. *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {industries.map(ind => (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => handleFieldChange('industry', ind)}
                          className={`p-4 border text-left transition-all text-sm rounded-sm ${
                            formData.industry === ind 
                              ? 'border-vmNavy bg-vmNavy/5 text-vmNavy font-bold ring-1 ring-vmNavy' 
                              : errors.industry 
                                ? 'border-red-200 bg-red-50 text-slate-600' 
                                : 'border-slate-100 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                    {formData.industry === 'Other' && (
                      <input
                        type="text"
                        name="industry_other"
                        className={`mt-4 w-full p-4 border outline-none focus:border-vmNavy text-sm rounded-sm ${errors.industryOther ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder="Please specify your industry..."
                        value={formData.industryOther}
                        onChange={(e) => handleFieldChange('industryOther', e.target.value)}
                      />
                    )}
                    <ErrorLabel message={errors.industry || (formData.industry === 'Other' ? errors.industryOther : undefined)} />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-4">What’s your role? *</label>
                    <div className="grid grid-cols-1 gap-3">
                      {roles.map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleFieldChange('role', role)}
                          className={`p-4 border text-left transition-all text-sm rounded-sm ${
                            formData.role === role 
                              ? 'border-vmNavy bg-vmNavy/5 text-vmNavy font-bold ring-1 ring-vmNavy' 
                              : errors.role 
                                ? 'border-red-200 bg-red-50 text-slate-600' 
                                : 'border-slate-100 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                    <ErrorLabel message={errors.role} />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-4">Locations. *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {locationOptions.map(loc => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => handleFieldChange('locations', loc)}
                          className={`p-4 border text-center transition-all text-sm rounded-sm ${
                            formData.locations === loc 
                              ? 'border-vmNavy bg-vmNavy/5 text-vmNavy font-bold ring-1 ring-vmNavy' 
                              : errors.locations 
                                ? 'border-red-200 bg-red-50 text-slate-600' 
                                : 'border-slate-100 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                    <ErrorLabel message={errors.locations} />
                  </div>
                </div>
              </section>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <h2 className="text-xs font-black text-vmTeal uppercase tracking-widest mb-6">Page 2 — Need + Timing + Budget</h2>
                <div className="space-y-10">
                  <div>
                    <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-2">What’s the primary bottleneck? *</label>
                    <p className="text-xs text-slate-400 mb-4 font-normal">Select which one you’d fix first.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {bottlenecks.map(b => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => handleFieldChange('bottleneck', b)}
                          className={`p-4 border text-left transition-all text-sm rounded-sm ${
                            formData.bottleneck === b 
                              ? 'border-vmNavy bg-vmNavy/5 text-vmNavy font-bold ring-1 ring-vmNavy' 
                              : errors.bottleneck 
                                ? 'border-red-200 bg-red-50 text-slate-600' 
                                : 'border-slate-100 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                    {formData.bottleneck === 'Other' && (
                      <input
                        type="text"
                        name="bottleneck_other"
                        className={`mt-4 w-full p-4 border outline-none focus:border-vmNavy text-sm rounded-sm ${errors.bottleneckOther ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder="Describe briefly..."
                        value={formData.bottleneckOther}
                        onChange={(e) => handleFieldChange('bottleneckOther', e.target.value)}
                      />
                    )}
                    <ErrorLabel message={errors.bottleneck || (formData.bottleneck === 'Other' ? errors.bottleneckOther : undefined)} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-2">Timeline. *</label>
                      <p className="text-[10px] text-slate-400 mb-4">When do you want to go live?</p>
                      <select 
                        className={`w-full p-4 border outline-none bg-white text-sm rounded-sm ${errors.timeline ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        value={formData.timeline}
                        onChange={(e) => handleFieldChange('timeline', e.target.value)}
                      >
                        <option value="">Select range...</option>
                        {timelines.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ErrorLabel message={errors.timeline} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-2">Allocated budget *</label>
                      <p className="text-[10px] text-slate-400 mb-4 opacity-0">spacer</p>
                      <select 
                        className={`w-full p-4 border outline-none bg-white text-sm rounded-sm ${errors.budget ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        value={formData.budget}
                        onChange={(e) => handleFieldChange('budget', e.target.value)}
                      >
                        <option value="">Select range...</option>
                        {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <ErrorLabel message={errors.budget} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-4">What does “fixed” look like? (Optional)</label>
                    <textarea
                      name="fixed_look_like"
                      className="w-full p-6 border border-slate-200 focus:border-vmNavy outline-none min-h-[100px] transition-colors text-sm rounded-sm"
                      placeholder="One sentence defining the ideal outcome."
                      value={formData.fixedDescription}
                      onChange={(e) => handleFieldChange('fixedDescription', e.target.value)}
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <h2 className="text-xs font-black text-vmTeal uppercase tracking-widest mb-6">Page 3 — Contact + permission</h2>
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-4">Full name *</label>
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        className={`w-full p-4 border outline-none text-sm rounded-sm ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder="Jeff Bezos"
                        value={formData.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                      />
                      <ErrorLabel message={errors.name} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-4">Work email *</label>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        inputMode="email"
                        className={`w-full p-4 border outline-none text-sm rounded-sm ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder="bezos@amazon.com"
                        value={formData.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                      />
                      <ErrorLabel message={errors.email} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-2">Company *</label>
                      <input
                        type="text"
                        name="organization"
                        autoComplete="organization"
                        className={`w-full p-4 border outline-none text-sm rounded-sm ${errors.company ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder="Company name"
                        value={formData.company}
                        onChange={(e) => handleFieldChange('company', e.target.value)}
                      />
                      <ErrorLabel message={errors.company} />
                      <p className="mt-2 text-[10px] text-slate-400">This allows your report to be more accurate and valuable.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-2">Website (optional)</label>
                      <input
                        type="text"
                        name="url"
                        autoComplete="url"
                        inputMode="url"
                        className={`w-full p-4 border outline-none text-sm rounded-sm ${errors.website ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder="example.com"
                        value={formData.website}
                        onChange={(e) => handleFieldChange('website', e.target.value)}
                      />
                      <ErrorLabel message={errors.website} />
                      <p className="mt-2 text-[10px] text-slate-400">This allows your report to be more accurate and valuable.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-vmNavy uppercase tracking-widest mb-2">Phone (optional)</label>
                    <input
                      type="tel"
                      name="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      className={`w-full p-4 border outline-none text-sm rounded-sm ${errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                      placeholder="+1 555-555-5555"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                    />
                    <ErrorLabel message={errors.phone} />
                  </div>

                  <div className={`p-6 bg-vmSlate rounded-sm border border-slate-100`}>
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative mt-1">
                        <input 
                          type="checkbox" 
                          name="communication_consent"
                          className="peer sr-only"
                          checked={formData.consent}
                          onChange={(e) => handleFieldChange('consent', e.target.checked)}
                        />
                        <div className={`w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-vmTeal peer-checked:border-vmTeal transition-all`} />
                        <CheckCircle2 className="w-3 h-3 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-grow">
                        <span className="text-sm font-bold text-vmNavy uppercase tracking-tight">Yes—Vision Managers may call/text me to schedule next steps.</span>
                        <p className="text-xs text-slate-400 mt-1">No spam. You can opt out anytime.</p>
                      </div>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          )}

          <div className="mt-12 flex justify-between gap-4">
            {step > 1 && (
              <button 
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="px-8 py-4 text-vmNavy font-bold flex items-center gap-2 hover:bg-slate-50 transition-all rounded-sm disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="ml-auto px-10 py-4 bg-vmNavy text-white rounded-sm font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:bg-vmNavy/95 transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed min-w-[180px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {step === 3 ? 'Submit Assessment' : 'Continue'} 
                  {step === 3 ? <Send className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">Fields marked with * are required.</p>
      </div>
    </div>
  );
};

export default StartHere;
