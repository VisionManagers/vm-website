import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { track } from '../lib/track';
import { Reveal, Eyebrow, VineDivider, buttonPrimary, buttonSecondary } from '../components/ornaments';
import { ArrowRight, ChevronRight, Download, Mic, Square, Phone, MessageSquare, Calculator, Sparkles, Star } from 'lucide-react';
import { TESTIMONIALS, BOOKING_URLS, REFERRAL_TEXT_NUMBER, REFERRAL_TEXT_TEL, VOICE_DEMO_NUMBER, AI_COACH_URL } from '../constants';

/* /bni — the one link Suk gives anyone in his BNI chapter. Vault brief: 50-Website/pages/bni.md.
   One job: make sending a referral effortless. Copy is Suk's own 10/5 handout language. */

const LISTEN = [
  { n: '1', who: 'Contractors and trades', sub: 'roofing, remodel, electrical, HVAC',
    lines: ['“I’ll write the bid up tonight.”', '“I’ll get you the bid this weekend.”', '“I’m on a roof, I’ll call you back.”'],
    say: 'Suk builds bid bots for the trades. Your bids, your numbers, by dinner.' },
  { n: '2', who: 'Making an AI decision', sub: 'being pitched, about to sign, or already paying',
    lines: ['“Three AI companies pitched me this month.”', '“We’re about to sign up for an AI tool.”', '“We pay for AI and I can’t tell if it’s working.”'],
    say: 'Before you sign anything, talk to Suk. He saved one agency about $8,000 on an AI service they were already shopping for.' },
  { n: '3', who: 'Paying for AI, barely using it', sub: 'solo owners, practices, small teams',
    lines: ['“I know I should be using AI.”', '“I tried it and what I got back was useless.”', '“I don’t have time to figure this out.”'],
    say: 'Suk trains owners on AI one skill at a time. You use it that day.' },
];
const DOWNLOADS = [
  { title: 'Who to send me', desc: 'The three lines to listen for, what to say, and the one text to send. One page.', href: '/downloads/vision-managers-who-to-send-me.pdf', alt: { label: 'Word', href: '/downloads/vision-managers-who-to-send-me.docx' } },
  { title: 'What I do', desc: 'The three ways I help, with the numbers behind each. One page, forwardable.', href: '/downloads/vision-managers-what-i-do.pdf' },
  { title: 'Exit-Readiness, one page', desc: 'For a trades owner one to three years from selling: what buyers price, and what I build so the business runs without them.', href: '/downloads/exit-readiness-onepager.pdf' },
];
const fieldCls = 'w-full px-4 py-3 bg-white border border-slate-200 rounded-sm outline-none focus:border-vmTeal transition-colors text-vmNavy';

const BNI: React.FC = () => {
  // referral form
  const [ref, setRef] = useState({ referrer: '', who: '', said: '', contact: '', okToText: true });
  const [refState, setRefState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const sendReferral = async (e: React.FormEvent) => {
    e.preventDefault(); setRefState('sending');
    try {
      const r = await fetch('/api/bni-referral', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...ref, okToText: ref.okToText ? 'yes' : 'no' }) });
      if (!r.ok) throw new Error(); setRefState('sent'); track('bni_referral_sent');
    } catch { setRefState('error'); }
  };
  // testimonial: typed or voice
  const [t, setT] = useState({ name: '', business: '', words: '', okToUse: true });
  const [tState, setTState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [recState, setRecState] = useState<'idle' | 'recording' | 'done' | 'unsupported'>('idle');
  const [audioUrl, setAudioUrl] = useState<string>(''); const audioBlob = useRef<Blob | null>(null);
  const rec = useRef<MediaRecorder | null>(null); const chunks = useRef<Blob[]>([]); const timer = useRef<number | null>(null);
  const [secs, setSecs] = useState(0);
  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '';
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 32000 } : undefined);
      chunks.current = []; mr.ondataavailable = (ev) => { if (ev.data.size) chunks.current.push(ev.data); };
      mr.onstop = () => { const blob = new Blob(chunks.current, { type: mr.mimeType || 'audio/webm' }); audioBlob.current = blob; setAudioUrl(URL.createObjectURL(blob)); setRecState('done'); stream.getTracks().forEach((tr) => tr.stop()); };
      mr.start(); rec.current = mr; setRecState('recording'); setSecs(0);
      timer.current = window.setInterval(() => setSecs((s) => { if (s + 1 >= 90) stopRec(); return s + 1; }), 1000);
    } catch { setRecState('unsupported'); }
  };
  const stopRec = () => { if (timer.current) { window.clearInterval(timer.current); timer.current = null; } rec.current?.state === 'recording' && rec.current.stop(); };
  const sendTestimonial = async (e: React.FormEvent) => {
    e.preventDefault(); setTState('sending');
    try {
      let audio = '', mime = '';
      if (audioBlob.current) {
        mime = audioBlob.current.type; const buf = await audioBlob.current.arrayBuffer();
        let bin = ''; const bytes = new Uint8Array(buf); for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        audio = btoa(bin);
      }
      const r = await fetch('/api/bni-testimonial', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...t, okToUse: t.okToUse ? 'yes' : 'no', audio, mime }) });
      if (!r.ok) throw new Error(); setTState('sent'); track('bni_testimonial_sent', { kind: audio ? 'voice' : 'text' });
    } catch { setTState('error'); }
  };

  return (
    <>
      <SEO title="For my BNI chapter — how to refer Suk, book a 1-to-1, downloads" description="Everything a BNI member needs in one place: who to send me and what to say, a 60-minute 1-to-1, the one-page handouts, the Bid Calculator, and a place to leave a testimonial." path="/bni" />
      <div className="min-h-screen bg-vmCream" data-aesthetic="roman">

        {/* ─── HERO ─── */}
        <section className="pt-36 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <Eyebrow className="text-accent mb-6">For my BNI chapter</Eyebrow>
              <h1 className="font-serif text-vmNavy text-[2.4rem] md:text-[3.6rem] leading-[1.06] mb-6">
                Something in their business is quietly costing them money.
                <br /><span className="italic">I find it and fix it.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
                You don’t have to explain what I do. Listen for one of the lines below, then text me a first
                name and a business. I take it from there, and their first conversation is free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#refer" className={buttonPrimary}>Send me a referral <ChevronRight className="w-4 h-4" /></a>
                <a href="#one-to-one" className={buttonSecondary}>Book a 1-to-1 <ArrowRight className="w-4 h-4" /></a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── WHO TO SEND ME ─── */}
        <section className="py-16 px-6 bg-white border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-10 max-w-2xl"><Eyebrow className="text-accent mb-3">Who to send me</Eyebrow><h2 className="text-3xl font-serif text-vmNavy">Three lines to listen for.</h2></Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              {LISTEN.map((c) => (
                <Reveal key={c.n} className="p-7 bg-vmCream/70 border border-slate-100 rounded-sm flex flex-col">
                  <p className="font-serif text-3xl text-vmTeal mb-2">{c.n}</p>
                  <h3 className="text-lg font-serif text-vmNavy">{c.who}</h3>
                  <p className="text-xs text-slate-500 mb-4">{c.sub}</p>
                  <p className="eyebrow text-slate-500 mb-2">Listen for</p>
                  <ul className="text-sm text-slate-700 leading-relaxed mb-5 space-y-1">{c.lines.map((l) => <li key={l}>{l}</li>)}</ul>
                  <p className="eyebrow text-slate-500 mb-1 mt-auto">Say</p>
                  <p className="text-sm text-vmNavy leading-relaxed">{c.say}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-10 p-6 bg-vmNavy text-white rounded-sm md:flex md:items-center md:justify-between gap-8">
              <div>
                <p className="eyebrow text-vmMarigold mb-2">Then</p>
                <p className="text-lg">Text me their first name and business: <a href={`sms:${REFERRAL_TEXT_TEL}`} className="font-semibold underline underline-offset-4">{REFERRAL_TEXT_NUMBER}</a></p>
                <p className="text-white/70 text-sm mt-2">Or send them this: “Hey [name], you mentioned [the bids / the AI pitches / getting started with AI]. My friend Suk fixes exactly that. OK if I have him text you?”</p>
              </div>
              <a href={`sms:${REFERRAL_TEXT_TEL}`} className="mt-5 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-vmTeal text-white rounded-sm font-semibold shrink-0"><MessageSquare className="w-4 h-4" /> Text Suk</a>
            </Reveal>
          </div>
        </section>

        {/* ─── SEND A REFERRAL (the form) ─── */}
        <section id="refer" className="py-20 px-6 scroll-mt-28">
          <div className="max-w-3xl mx-auto">
            <Reveal><Eyebrow className="text-accent mb-3">Send me a referral</Eyebrow><h2 className="text-3xl font-serif text-vmNavy mb-3">Thirty seconds, from your phone.</h2><p className="text-slate-600 mb-8">I’ll text them today and tell you what happened.</p></Reveal>
            {refState === 'sent' ? (
              <Reveal className="p-8 bg-white border border-vmTeal rounded-sm"><p className="font-serif text-2xl text-vmNavy mb-2">Got it. Thank you.</p><p className="text-slate-600">I’ll reach out to {ref.who.split(/[,\-–—(]/)[0].trim() || 'them'} today and let you know how it went.</p></Reveal>
            ) : (
              <form onSubmit={sendReferral} className="p-8 bg-white border border-slate-200 rounded-sm grid gap-4">
                <input className={fieldCls} placeholder="Your name" required value={ref.referrer} onChange={(e) => setRef({ ...ref, referrer: e.target.value })} />
                <input className={fieldCls} placeholder="Who — first name and business (e.g. Mike, Northwest Roofing)" required value={ref.who} onChange={(e) => setRef({ ...ref, who: e.target.value })} />
                <input className={fieldCls} placeholder="What they said (one line is plenty)" value={ref.said} onChange={(e) => setRef({ ...ref, said: e.target.value })} />
                <input className={fieldCls} placeholder="Their phone or email (optional — I can ask you)" value={ref.contact} onChange={(e) => setRef({ ...ref, contact: e.target.value })} />
                <label className="flex items-center gap-3 text-sm text-slate-600"><input type="checkbox" checked={ref.okToText} onChange={(e) => setRef({ ...ref, okToText: e.target.checked })} className="accent-vmTeal w-4 h-4" /> They’re OK with me texting them</label>
                <div className="flex items-center gap-4"><button type="submit" disabled={refState === 'sending'} className={buttonPrimary}>{refState === 'sending' ? 'Sending…' : 'Send it to Suk'} <ChevronRight className="w-4 h-4" /></button>{refState === 'error' && <p className="text-sm text-red-700">That didn’t send — text me instead: {REFERRAL_TEXT_NUMBER}</p>}</div>
              </form>
            )}
          </div>
        </section>

        {/* ─── 1-TO-1 ─── */}
        <section id="one-to-one" className="py-20 px-6 bg-white border-y border-slate-100 scroll-mt-28">
          <div className="max-w-4xl mx-auto md:grid md:grid-cols-5 md:gap-12 items-center">
            <Reveal className="md:col-span-3">
              <Eyebrow className="text-accent mb-3">Book a 1-to-1</Eyebrow>
              <h2 className="text-3xl font-serif text-vmNavy mb-4">An hour, for members.</h2>
              <p className="text-slate-600 leading-relaxed mb-3">How we each get business, who we’re listening for, and one concrete thing we can send each other this month. Bring the referrals you’re unsure about.</p>
              <p className="text-sm text-slate-500">Sixty minutes, video or coffee on the Eastside.</p>
            </Reveal>
            <Reveal className="md:col-span-2 mt-8 md:mt-0">
              {BOOKING_URLS.BNI_121 ? (
                <a href={BOOKING_URLS.BNI_121} target="_blank" rel="noopener noreferrer" className={buttonPrimary + ' w-full justify-center'}>Pick a time <ChevronRight className="w-4 h-4" /></a>
              ) : (
                <div className="p-6 bg-vmCream border border-slate-200 rounded-sm text-sm text-slate-600"><p className="font-semibold text-vmNavy mb-1">Text me for a time.</p><p>{REFERRAL_TEXT_NUMBER} — say “1-to-1” and two days that work. Online booking for this is coming.</p></div>
              )}
            </Reveal>
          </div>
        </section>

        {/* ─── DOWNLOADS ─── */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-10 max-w-2xl"><Eyebrow className="text-accent mb-3">Downloads</Eyebrow><h2 className="text-3xl font-serif text-vmNavy">One page each. Forward them.</h2></Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              {DOWNLOADS.map((d) => (
                <Reveal key={d.title} className="p-7 bg-white border border-slate-200 rounded-sm flex flex-col">
                  <h3 className="text-lg font-serif text-vmNavy mb-2">{d.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{d.desc}</p>
                  <div className="mt-auto flex items-center gap-5">
                    <a href={d.href} download className="inline-flex items-center gap-2 text-sm font-semibold text-vmNavy hover:text-vmTeal"><Download className="w-4 h-4" /> PDF</a>
                    {d.alt && <a href={d.alt.href} download className="text-sm text-slate-500 hover:text-vmNavy">{d.alt.label}</a>}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TRY THE AI ─── */}
        <section className="py-20 px-6 bg-white border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-10 max-w-2xl"><Eyebrow className="text-accent mb-3">Try it yourself</Eyebrow><h2 className="text-3xl font-serif text-vmNavy">Three things you can test right now.</h2></Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              <Reveal className="p-7 bg-vmCream/70 border border-slate-100 rounded-sm flex flex-col">
                <Calculator className="w-6 h-6 text-vmTeal mb-4" aria-hidden />
                <h3 className="text-lg font-serif text-vmNavy mb-2">The Bid Calculator</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">For anyone in the trades: type one real bid in and see whether it’s making them money. Free, under a minute, no email.</p>
                <Link to="/tools/bid-calculator" className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-vmNavy hover:text-vmTeal">Run a bid <ArrowRight className="w-4 h-4" /></Link>
              </Reveal>
              <Reveal className="p-7 bg-vmCream/70 border border-slate-100 rounded-sm flex flex-col">
                <Phone className="w-6 h-6 text-vmTeal mb-4" aria-hidden />
                <h3 className="text-lg font-serif text-vmNavy mb-2">Call the receptionist</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">The voice agent that answers a practice’s phone, every hour. Call it, ask it anything, try to book something.</p>
                {VOICE_DEMO_NUMBER ? <a href={`tel:${VOICE_DEMO_NUMBER.replace(/[^+\d]/g, '')}`} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-vmNavy hover:text-vmTeal">Call {VOICE_DEMO_NUMBER} <ArrowRight className="w-4 h-4" /></a> : <p className="mt-auto text-sm text-slate-500">Ask me for the demo line on a 1-to-1.</p>}
              </Reveal>
              <Reveal className="p-7 bg-vmCream/70 border border-slate-100 rounded-sm flex flex-col">
                <Sparkles className="w-6 h-6 text-vmTeal mb-4" aria-hidden />
                <h3 className="text-lg font-serif text-vmNavy mb-2">The AI coach</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">If you want to feel what good AI does for you: a daily log that talks back. I built it for myself and use it every day.</p>
                <a href={AI_COACH_URL} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-vmNavy hover:text-vmTeal">Try it <ArrowRight className="w-4 h-4" /></a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── WHAT CLIENTS SAY ─── */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-12"><Eyebrow className="text-accent mb-3">What clients say</Eyebrow><h2 className="text-3xl font-serif text-vmNavy">In their words.</h2></Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((q) => (
                <Reveal key={q.name} className="p-8 bg-white border border-slate-100 rounded-sm flex flex-col">
                  <div className="flex gap-1 mb-5" aria-label="5 star review">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-vmTeal text-vmTeal" aria-hidden />)}</div>
                  <p className="text-slate-700 italic leading-relaxed mb-6 flex-grow">“{q.quote}”</p>
                  <p className="font-semibold text-vmNavy text-sm">{q.name}</p><p className="eyebrow text-slate-500 mt-1">{q.title}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LEAVE A TESTIMONIAL ─── */}
        <section id="testimonial" className="py-20 px-6 bg-white border-t border-slate-100 scroll-mt-28">
          <div className="max-w-3xl mx-auto">
            <Reveal><Eyebrow className="text-accent mb-3">Leave me a testimonial</Eyebrow><h2 className="text-3xl font-serif text-vmNavy mb-3">Type it, or just talk.</h2><p className="text-slate-600 mb-8">It comes straight to me. Nothing is published unless you tick the box, and I’ll show you where it goes first.</p></Reveal>
            {tState === 'sent' ? (
              <Reveal className="p-8 bg-vmCream border border-vmTeal rounded-sm"><p className="font-serif text-2xl text-vmNavy mb-2">Thank you, {t.name.split(' ')[0]}.</p><p className="text-slate-600">That means a lot. I’ll send you a note when I’ve got it placed.</p></Reveal>
            ) : (
              <form onSubmit={sendTestimonial} className="p-8 bg-vmCream border border-slate-200 rounded-sm grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input className={fieldCls} placeholder="Your name" required value={t.name} onChange={(e) => setT({ ...t, name: e.target.value })} />
                  <input className={fieldCls} placeholder="Your business" value={t.business} onChange={(e) => setT({ ...t, business: e.target.value })} />
                </div>
                <textarea className={fieldCls + ' min-h-[120px]'} placeholder="What was it like working with me? Two sentences is perfect." value={t.words} onChange={(e) => setT({ ...t, words: e.target.value })} />
                <div className="p-4 bg-white border border-slate-200 rounded-sm">
                  <p className="text-sm font-semibold text-vmNavy mb-2">Or leave a voice note (up to 90 seconds)</p>
                  {recState === 'unsupported' && <p className="text-sm text-slate-500">Your browser blocked the microphone — type it above instead, or text me a voice memo at {REFERRAL_TEXT_NUMBER}.</p>}
                  {recState !== 'unsupported' && (
                    <div className="flex flex-wrap items-center gap-4">
                      {recState !== 'recording' ? (
                        <button type="button" onClick={startRec} className="inline-flex items-center gap-2 px-4 py-2 bg-vmNavy text-white rounded-sm text-sm font-semibold"><Mic className="w-4 h-4" /> {recState === 'done' ? 'Record again' : 'Record'}</button>
                      ) : (
                        <button type="button" onClick={stopRec} className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-sm text-sm font-semibold"><Square className="w-4 h-4" /> Stop · {secs}s</button>
                      )}
                      {recState === 'done' && audioUrl && <audio controls src={audioUrl} className="h-9" />}
                    </div>
                  )}
                </div>
                <label className="flex items-start gap-3 text-sm text-slate-600"><input type="checkbox" checked={t.okToUse} onChange={(e) => setT({ ...t, okToUse: e.target.checked })} className="accent-vmTeal w-4 h-4 mt-0.5" /> Suk can use this with my name and business on his website and materials.</label>
                <div className="flex items-center gap-4"><button type="submit" disabled={tState === 'sending'} className={buttonPrimary}>{tState === 'sending' ? 'Sending…' : 'Send it'} <ChevronRight className="w-4 h-4" /></button>{tState === 'error' && <p className="text-sm text-red-700">That didn’t send — text it to me at {REFERRAL_TEXT_NUMBER}.</p>}</div>
              </form>
            )}
          </div>
        </section>

        {/* ─── FOOT ─── */}
        <section className="py-16 px-6 text-center">
          <Reveal>
            <VineDivider className="mx-auto mb-8 text-accent" />
            <p className="text-slate-600 mb-2">Suk Virk · <a href="tel:+14254944489" className="text-vmNavy font-semibold hover:text-vmTeal">(425) 494-4489</a> · <a href="mailto:sukhneet@visionmanagers.com" className="text-vmNavy font-semibold hover:text-vmTeal">sukhneet@visionmanagers.com</a></p>
            <p className="text-sm text-slate-500">If they’d rather start on their own: <Link to="/leak-audit" className="text-vmNavy font-semibold hover:text-vmTeal">the free 12-leak audit</Link>, no email needed.</p>
          </Reveal>
        </section>
      </div>
    </>
  );
};

export default BNI;
