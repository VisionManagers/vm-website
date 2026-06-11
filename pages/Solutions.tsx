
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BOOKING_URLS } from '../constants';
import {
  Reveal, Eyebrow, LaurelSprig, ColumnFlank,
  buttonPrimary, buttonTealOnNavy,
} from '../components/ornaments';
import { ArrowRight, ChevronRight, Phone, Check, Minus } from 'lucide-react';

/* NOTE FOR REVIEW (not rendered): tier pricing below comes from the researched
   pricing playbook (70-Research/playbooks/pricing.md) and is NOT yet ratified
   by Sukh. Adjust numbers here before any deploy. */

const TIERS = [
  {
    name: 'AI Readiness Audit',
    role: 'The entry point',
    price: 'From $5,000',
    cadence: 'Fixed scope · 2–4 weeks',
    desc: 'A complete assessment of your practice or group: where AI earns its keep, which vendors to trust, what the compliance posture requires. You receive a prioritized 90-day roadmap and a leadership readout.',
    includes: ['Workflow and bottleneck assessment', 'HIPAA-aware vendor and data review', 'Prioritized 90-day roadmap', 'Leadership readout session'],
    featured: false,
  },
  {
    name: 'Fractional AI Officer',
    role: 'The core engagement',
    price: '$6,000–$9,000 / month',
    cadence: 'Quarterly commitment · monthly billing',
    desc: 'A named executive who owns AI for your organization. Strategy, governance, vendor decisions, pilot oversight — with a monthly leadership cadence and measurable outcomes.',
    includes: ['AI strategy owned and maintained', 'Governance and compliance framework', 'Vendor selection and accountability', 'Pilot oversight with measurement', 'Monthly executive readout'],
    featured: true,
  },
  {
    name: 'Officer + Implementation',
    role: 'For multi-location groups',
    price: 'From $12,000 / month',
    cadence: 'Quarterly commitment',
    desc: 'Everything in the core engagement, plus hands-on deployment: voice agents, workflow automation, staff training, and KPI dashboards across locations.',
    includes: ['Everything in Fractional AI Officer', 'Hands-on deployment and builds', 'Staff training programs', 'KPI dashboards across locations'],
    featured: false,
  },
];

const FAQS = [
  {
    q: 'Is this just consulting with a different name?',
    a: 'No. A consultant delivers a report and leaves. A fractional Chief AI Officer holds the role: the strategy stays owned, vendors stay accountable, and results get measured month after month. You leave the first 90 days with artifacts — a strategy document, a governance framework, and a live pilot — not a deck.',
  },
  {
    q: 'We already have IT. Why would we need this?',
    a: 'IT keeps systems running. The AI officer role decides which systems are worth running — what to adopt, what to skip, what the data rules are, and how to measure return. The two roles work together; they are not the same job.',
  },
  {
    q: 'Is our patient data safe?',
    a: 'Data handling is governed before anything is deployed: HIPAA-aware architecture, business associate agreements where required, and a written rule that your patient data never trains public models. Compliance posture is part of the audit, not an afterthought.',
  },
  {
    q: 'What does it cost compared to hiring?',
    a: 'A full-time AI executive runs $250,000+ a year, if you can find one. The fractional model gives you the same seniority at a fraction of that — and you can start with a fixed-scope audit before committing to anything ongoing.',
  },
  {
    q: 'What happens after the strategy call?',
    a: 'If the fit is right, we scope a readiness audit. If it is not, you still leave the call with two concrete next steps you can act on without us. The call is a working session, not a pitch.',
  },
];

const Solutions: React.FC = () => {
  return (
    <>
    <SEO
      title="Fractional Chief AI Officer — Solutions"
      description="Senior AI leadership for healthcare and dental organizations. Readiness audits from $5,000, fractional Chief AI Officer retainers, and full implementation for multi-location groups."
      path="/solutions"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Fractional Chief AI Officer',
        provider: { '@type': 'Organization', name: 'Vision Managers' },
        description: 'Fractional Chief AI Officer engagements for healthcare and dental organizations: AI readiness audits, ongoing AI leadership retainers, and implementation.',
        url: 'https://visionmanagers.com/solutions',
        serviceType: ['Fractional Chief AI Officer', 'AI Readiness Audit', 'AI Governance'],
      }}
    />
    {/* Roman classical: axial symmetry, engraved authority */}
    <div className="pt-40 pb-24 bg-white" data-aesthetic="roman">

      {/* ─── HERO — centered, inscriptional ─── */}
      <section className="px-6 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <Eyebrow className="text-accent mb-8">The engagement</Eyebrow>
            <h1 className="font-serif text-vmNavy text-4xl md:text-6xl leading-[1.08] mb-8">
              A Chief AI Officer for your practice.
              <br /><span className="italic">Without the executive salary.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10">
              One accountable person who owns your AI strategy, governs the risk,
              chooses the vendors, and answers for the results — embedded with your
              leadership team on a fractional basis.
            </p>
            <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
              Book a 30-minute AI strategy call <ChevronRight className="w-4 h-4" />
            </a>
            <p className="mt-4 text-xs text-slate-400">No prep needed. You leave with two concrete next steps.</p>
          </Reveal>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6"><div className="keyline-double text-vmNavy" /></div>

      {/* ─── THE PROBLEM ─── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl font-serif text-vmNavy mb-6">The expensive version of this problem</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Without an owner, AI shows up anyway: staff paste patient information into free
              chatbots, vendors oversell "HIPAA-compliant" tools nobody verifies, and pilots
              die quietly because nobody measured them. The cost isn't the software —
              it's the compliance exposure and the years of compounding advantage your
              competitors bank while you evaluate.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── PROOF — column-flanked, engraved ─── */}
      <section className="px-6 py-12 mb-8">
        <div className="max-w-2xl mx-auto">
          <Reveal className="text-vmNavy">
            <ColumnFlank className="py-10 text-center">
              <p className="font-serif text-2xl md:text-3xl text-vmNavy italic leading-snug mb-6">
                "$4,300 in booked appointments within two days of going live."
              </p>
              <p className="eyebrow text-slate-400">Voice AI pilot · Seattle-area optometry practice</p>
              <p className="text-sm text-slate-500 mt-4 max-w-md mx-auto">
                One workflow, deployed under the same discipline every engagement gets:
                scoped, governed, measured.
              </p>
            </ColumnFlank>
          </Reveal>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6"><div className="keyline-double text-vmNavy" /></div>

      {/* ─── THE TIERS ─── */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <Eyebrow className="text-accent mb-4">Three ways to engage</Eyebrow>
            <h2 className="text-4xl font-serif text-vmNavy mb-4">Start fixed-scope. Grow when it's earned.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Most clients begin with the audit. The retainer follows when the roadmap proves
              there's enough work to own.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {TIERS.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 100}
                className={`flex flex-col p-8 md:p-10 rounded-sm ${tier.featured
                  ? 'bg-vmNavy text-white border-2 border-vmTeal lg:-my-4 lg:py-14'
                  : 'bg-white border border-slate-200'}`}>
                <p className={`eyebrow mb-3 ${tier.featured ? 'text-vmTeal' : 'text-accent'}`}>{tier.role}</p>
                <h3 className={`text-2xl font-serif mb-2 ${tier.featured ? 'text-white' : 'text-vmNavy'}`}>{tier.name}</h3>
                <p className={`font-serif text-xl mb-1 ${tier.featured ? 'text-vmTeal' : 'text-vmNavy'}`}>{tier.price}</p>
                <p className={`text-xs mb-6 ${tier.featured ? 'text-white/50' : 'text-slate-400'}`}>{tier.cadence}</p>
                <p className={`text-sm leading-relaxed mb-8 ${tier.featured ? 'text-white/70' : 'text-slate-600'}`}>{tier.desc}</p>
                <ul className="space-y-2.5 mb-10 flex-grow">
                  {tier.includes.map((item) => (
                    <li key={item} className={`flex items-start gap-2.5 text-sm ${tier.featured ? 'text-white/80' : 'text-slate-700'}`}>
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.featured ? 'text-vmTeal' : 'text-accent'}`} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer"
                  className={tier.featured ? buttonTealOnNavy + ' w-full' : buttonPrimary + ' w-full'}>
                  Discuss this engagement <ArrowRight className="w-4 h-4" />
                </a>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10">
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Pricing shown is representative; every engagement is scoped to the value at stake
              in a working session before any proposal.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6"><div className="keyline-double text-vmNavy" /></div>

      {/* ─── FIT / NOT FIT ─── */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-14">
            <h2 className="text-3xl font-serif text-vmNavy">This works best when it fits.</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12">
            <Reveal>
              <p className="eyebrow text-accent mb-6">A strong fit if you are</p>
              <ul className="space-y-4">
                {[
                  'A healthcare or dental organization, single practice to multi-location group',
                  'Led by an owner or administrator who wants AI owned, measured, and safe',
                  'Already feeling the cost of missed calls, manual follow-up, or vendor noise',
                  'Ready to act on a roadmap once you trust it',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700 text-sm leading-relaxed">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-1" aria-hidden />{item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100}>
              <p className="eyebrow text-slate-400 mb-6">Probably not a fit if you</p>
              <ul className="space-y-4">
                {[
                  'Want a one-time build with no one accountable afterward',
                  'Are looking for the cheapest possible chatbot',
                  'Need a full-time, on-site executive — we will tell you, and help you hire one',
                  'Expect AI to fix an operations problem that is really a people problem',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-500 text-sm leading-relaxed">
                    <Minus className="w-4 h-4 text-slate-300 shrink-0 mt-1" aria-hidden />{item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── VOICE AI CROSS-LINK ─── */}
      <section className="px-6 mb-20">
        <div className="max-w-5xl mx-auto">
          <Reveal className="bg-vmNavy rounded-sm p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-vmTeal/15 flex items-center justify-center flex-shrink-0">
                <Phone className="w-7 h-7 text-vmTeal" aria-hidden />
              </div>
              <div>
                <Eyebrow className="text-vmTeal mb-1">The most common first pilot</Eyebrow>
                <h3 className="text-xl font-serif text-white mb-1">Stop losing patients to voicemail</h3>
                <p className="text-white/60 text-sm">Voice AI that answers every call — dental, optometry, dermatology, and more. Live in days.</p>
              </div>
            </div>
            <Link to="/ai-voice" className={buttonTealOnNavy + ' flex-shrink-0'}>
              See the voice agents <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6"><div className="keyline-double text-vmNavy" /></div>

      {/* ─── FAQ ─── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <Eyebrow className="text-accent mb-4">Questions owners actually ask</Eyebrow>
            <h2 className="text-3xl font-serif text-vmNavy">Before you book the call.</h2>
          </Reveal>
          <div className="space-y-10">
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 60}>
                <h3 className="font-semibold text-vmNavy mb-3">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-6 pt-10">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <LaurelSprig className="w-28 mx-auto mb-10 text-accent" />
            <h2 className="text-4xl font-serif text-vmNavy mb-6 italic">Give AI an owner.</h2>
            <p className="text-slate-600 mb-10 max-w-xl mx-auto">
              Thirty minutes. We map where AI earns its keep in your organization and whether
              the fractional model fits. A working session, not a sales pitch.
            </p>
            <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
              Book the strategy call <ChevronRight className="w-4 h-4" />
            </a>
          </Reveal>
        </div>
      </section>
    </div>
    </>
  );
};

export default Solutions;
