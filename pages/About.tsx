import React from 'react';
import SEO from '../components/SEO';
import { BOOKING_URLS } from '../constants';
import {
  Reveal, Eyebrow, VineDivider, SectionNumber, Constellation,
  buttonPrimary, buttonSecondary,
} from '../components/ornaments';
import { ChevronRight, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About — Vision Managers"
        description="The person behind Vision Managers: enterprise UX research rigor (Facebook, CVS Health) and real operating scars, turned to one job — mapping the data and relationships your business already runs on into systems you can steer by."
        path="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Vision Managers',
          description:
            'The person behind Vision Managers — research rigor and owner-level operating experience, focused on turning a business’s scattered data and relationships into systems that drive outcomes.',
          url: 'https://visionmanagers.com/about',
        }}
      />
      <div className="w-full" data-aesthetic="solar">

        {/* ─── HERO ─── */}
        <section className="relative min-h-[72vh] flex items-center overflow-hidden pt-36 pb-20 cosmos-wash">
          <Constellation />
          <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7">
                <Reveal>
                  <Eyebrow className="text-vmTeal mb-8">The person behind it</Eyebrow>
                </Reveal>
                <Reveal delay={80}>
                  <h1 className="font-serif text-vmNavy text-[2.5rem] md:text-6xl leading-[1.06] mb-8">
                    Not a vendor. Not a dashboard.
                    <br />
                    <span className="italic">Someone who answers for it.</span>
                  </h1>
                </Reveal>
                <Reveal delay={160}>
                  <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                    I’m Sukhneet — Sukh. I sit on your side of the table, learn how your business
                    actually moves, and stay accountable from the first call to the number at the
                    end. If AI isn’t the answer, I’ll tell you that too.
                  </p>
                </Reveal>
              </div>
              <Reveal className="md:col-span-5" delay={260}>
                <div className="duotone-vm rounded-sm aspect-[4/5] max-w-xs mx-auto shadow-xl">
                  <img src="/images/vm/sukh-portrait.jpg" alt="Sukhneet, founder of Vision Managers" loading="lazy" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── METHOD ─── */}
        <section className="py-28 bg-vmCream">
          <div className="max-w-3xl mx-auto px-6">
            <Reveal>
              <Eyebrow className="text-accent mb-6">How I work</Eyebrow>
              <h2 className="font-serif text-vmNavy text-3xl md:text-5xl leading-[1.1] mb-10">
                Understand the people first.
                <br />
                <span className="italic">The technology follows.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                I started a decade ago as a UX researcher — the work of figuring out how people
                actually behave, not how a slide deck says they should. The tools have changed
                completely since then. The method hasn’t. Every system I advise on or build starts
                from how patients, staff, and owners really move — because AI that ignores people
                fails quietly, and quiet failures are the expensive kind.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── THE OPERATOR ─── */}
        <section className="py-28 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12">
              <Reveal className="md:col-span-4">
                <SectionNumber n="01" />
                <h2 className="font-serif text-2xl md:text-3xl text-vmNavy mt-4 leading-snug">
                  Enterprise method, owner’s scars.
                </h2>
              </Reveal>
              <div className="md:col-span-8">
                <Reveal>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    My research career runs through <span className="text-vmNavy font-medium">Facebook</span> and{' '}
                    <span className="text-vmNavy font-medium">CVS Health</span>, where my work shaped
                    experiences for over a million monthly users. My operating career is less typical:
                    I’ve run a fire-mitigation company, led a nursing home through COVID, and grown a
                    family optometry practice 200% in under a year.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    That combination is the whole point. Enterprise-grade method, applied by someone
                    who has personally answered the phones, made payroll, and lived with the systems
                    he chose. I advise the way an owner would actually want to be advised.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── THE WHY — Cosmos ─── */}
        <section className="py-28 bg-vmCream">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12">
              <Reveal className="md:col-span-4">
                <SectionNumber n="02" />
                <h2 className="font-serif text-2xl md:text-3xl text-vmNavy mt-4 leading-snug">
                  Why I call it a Cosmos.
                </h2>
              </Reveal>
              <div className="md:col-span-8">
                <Reveal>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Every business runs on a hidden network — contacts, calls, records, and the
                    relationships between them. Most of it sits in pieces, unseen and unworked.
                    Connect those points, the way stars become constellations or neurons become a
                    mind, and the picture starts to run itself.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    That’s the work I care about: giving people real control and understanding of
                    their own data, so they can build the future on their own vision and values —
                    not a vendor’s roadmap. Proven with healthcare practices; built for anyone
                    serious about growth.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── DARK CHAPTER — the client's words ─── */}
        <section className="relative dark-chapter overflow-hidden">
          <img
            src="/images/vm/cathedral-apse.webp"
            alt="The gilded apse of an Italian cathedral"
            className="chapter-img absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1722]/85 via-[#0A1722]/72 to-[#0A1722]/92" />
          <div className="relative z-10 max-w-3xl mx-auto px-6 py-28 md:py-36 text-center">
            <Reveal>
              <p className="font-serif text-2xl md:text-4xl text-vmCream italic leading-snug">
                “Working with Sukh is discovering value you didn’t know
                was sitting in your own business.”
              </p>
              <span className="block eyebrow not-italic text-vmGold mt-8">How past clients describe it</span>
            </Reveal>
          </div>
        </section>

        {/* ─── HONEST BEAT ─── */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Reveal>
              <h2 className="font-serif text-2xl md:text-3xl text-vmNavy leading-snug mb-6">
                Including the part most won’t tell you:
                <br />
                <span className="italic">where AI doesn’t belong yet.</span>
              </h2>
              <p className="text-slate-600 leading-relaxed">
                The fastest way I lose a sale is by being honest about it. I’d rather you trust the
                advice — and the result has to show up on your P&amp;L, or it doesn’t ship.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-28 cosmos-wash border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Reveal>
              <VineDivider className="mx-auto mb-10 text-accent" />
              <h2 className="font-serif text-3xl md:text-4xl text-vmNavy italic mb-6">Let’s start a conversation.</h2>
              <p className="text-slate-600 mb-10 max-w-xl mx-auto">
                Thirty minutes to map where you’re losing money, what it would take to fix it, and
                whether I’m the right person to build it with you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                  Start a conversation <ChevronRight className="w-4 h-4" />
                </a>
                <a href="/solutions" className={buttonSecondary}>
                  See how it works <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <p className="mt-6 text-xs text-slate-400">A working session, not a sales pitch.</p>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
