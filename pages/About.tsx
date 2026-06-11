
import React from 'react';
import SEO from '../components/SEO';
import { BOOKING_URLS } from '../constants';
import { Reveal, Eyebrow, SakuraBranch, ToriiMark, buttonPrimary } from '../components/ornaments';
import { ChevronRight } from 'lucide-react';

/* Japanese register: ma — the space is the content. One element at a time. */
const About: React.FC = () => {
  return (
    <>
    <SEO
      title="About"
      description="Vision Managers brings enterprise UX research rigor and founder-level operating experience to AI leadership for healthcare — Facebook and CVS Health research background, hands-on practice growth."
      path="/about"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Vision Managers',
        description: 'The firm behind the fractional Chief AI Officer practice for healthcare and dental organizations.',
        url: 'https://visionmanagers.com/about',
      }}
    />
    <div className="bg-white relative overflow-hidden" data-aesthetic="nihon">

      {/* sakura enters from the right margin — never centered */}
      <div className="absolute top-28 -right-10 w-72 md:w-96 text-vmInk/50 pointer-events-none hidden sm:block" aria-hidden>
        <Reveal quiet><SakuraBranch className="w-full" /></Reveal>
      </div>

      {/* vertical margin annotation */}
      <span className="vertical-label absolute left-6 top-48 text-slate-300 hidden lg:block" aria-hidden>
        Vision Managers · est. as a research practice
      </span>

      <div className="pt-44 pb-32 px-6">
        <div className="max-w-2xl mx-auto">

          {/* ─── One thought per viewport ─── */}
          <Reveal quiet>
            <Eyebrow className="text-accent mb-10">The firm</Eyebrow>
            <h1 className="font-serif text-vmNavy text-4xl md:text-6xl leading-[1.1] mb-24">
              Understand people first.
              <br /><span className="italic">The technology follows.</span>
            </h1>
          </Reveal>

          <Reveal quiet>
            <p className="text-lg text-slate-600 leading-loose mb-16">
              Vision Managers began as a UX research consultancy a decade ago. The tools have
              changed completely since then; the method hasn't. Every system we advise on or
              build starts from how patients, staff, and owners actually behave — because AI
              that ignores people fails quietly, and in healthcare, quiet failures are expensive.
            </p>
          </Reveal>

          <div className="hairline mb-16" />

          <Reveal quiet>
            <div className="flex items-start gap-5 mb-16">
              <ToriiMark className="w-8 h-8 text-accent shrink-0 mt-1" />
              <div>
                <h2 className="font-serif text-2xl text-vmNavy mb-6">The operator behind it</h2>
                <p className="text-slate-600 leading-loose mb-6">
                  Suk's research career runs through Facebook and CVS Health, where his work
                  shaped experiences for over a million monthly users. His operating career is
                  less typical: he has run a fire mitigation company, led a nursing home through
                  COVID, and grown a family optometry practice 200% in under a year.
                </p>
                <p className="text-slate-600 leading-loose">
                  That combination is the point. Enterprise-grade method, applied by someone who
                  has personally answered the phones, made payroll, and lived with the systems
                  he chose. Vision Managers advises the way an owner would want to be advised.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="hairline mb-16" />

          <Reveal quiet>
            <p className="font-serif text-2xl md:text-3xl text-vmNavy italic leading-snug mb-24 text-center px-4">
              "Working with Suk is discovering value you didn't know
              was sitting in your own business."
              <span className="block eyebrow not-italic text-slate-400 mt-6">How past clients describe it</span>
            </p>
          </Reveal>

          <Reveal quiet className="text-center">
            <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
              Start a conversation <ChevronRight className="w-4 h-4" />
            </a>
            <p className="mt-4 text-xs text-slate-400">30 minutes. A working session, not a sales pitch.</p>
          </Reveal>

        </div>
      </div>
    </div>
    </>
  );
};

export default About;
