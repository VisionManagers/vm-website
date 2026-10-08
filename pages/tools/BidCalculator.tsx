import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { track } from '../../lib/track';
import { Reveal, Eyebrow, buttonPrimary, buttonSecondary } from '../../components/ornaments';
import { ArrowLeft, ArrowRight, ChevronRight, Check } from 'lucide-react';
import { BOOKING_URLS } from '../../constants';
import {
  TRADES, trade as getTrade, job as getJob, compute, money, pct, toQuery, fromQuery, FLOOR,
  type BidInputs, type TradeId,
} from '../../lib/bid';

/* The Bid Calculator — "Is this bid making you money?"
   Vault brief: 50-Website/pages/tools-bid-calculator.md. Result first; email only to save.
   Model: The Contractor Fight's ungated "What Should You Charge" (credited on the page) +
   ServiceTitan's results page (edit · one CTA · share). */

type Step = 'trade' | 'job' | 'q' | 'result';
type QKey = 'materials' | 'hours' | 'rate' | 'subs' | 'overhead' | 'price';
const QUESTIONS: { key: QKey; label: string; hint: string; prefix?: string; suffix?: string; optional?: boolean }[] = [
  { key: 'materials', label: 'Materials on this bid?', hint: 'Your supplier total, delivered. A round number is fine.', prefix: '$' },
  { key: 'hours', label: 'Crew hours on the job?', hint: 'Everyone on site, all days — not just you.', suffix: 'hours' },
  { key: 'rate', label: 'What you pay per crew hour, loaded?', hint: 'Wage plus taxes, insurance and the truck. If you only know wage, add about 30%.', prefix: '$', suffix: '/hr' },
  { key: 'subs', label: 'Subs, permits, dump, rentals?', hint: 'Everything else you pay out for this job. Zero is a real answer.', prefix: '$' },
  { key: 'overhead', label: 'Your overhead per month, including your own pay?', hint: 'Rent, trucks, insurance, office, software, phones — and what you pay yourself. Most owners leave themselves out; don’t.', prefix: '$', suffix: '/month' },
  { key: 'price', label: 'What did you quote?', hint: 'Leave it blank and I’ll tell you what to charge instead.', prefix: '$', optional: true },
];
const STORE = 'vm-bid-calc';
const fieldCls = 'w-full px-4 py-3 bg-white border border-slate-200 rounded-sm outline-none focus:border-vmTeal transition-colors text-vmNavy';

const BidCalculator: React.FC = () => {
  const [step, setStep] = useState<Step>('trade');
  const [qi, setQi] = useState(0);
  const [inp, setInp] = useState<BidInputs>(() => ({
    trade: 'roofing', job: 'replace', materials: 0, hours: 0, rate: 0, subs: 0, overhead: 0, price: null,
    closeRate: 0.3, bidsPerMonth: 24, hoursPerBid: 0.5,
  }));
  const [estimated, setEstimated] = useState<Set<QKey>>(new Set());
  const [email, setEmail] = useState(''); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState<string>('');
  const [showMath, setShowMath] = useState(false);

  // Prefill: a shared link (?t=…) wins, then the last run on this device.
  useEffect(() => {
    const q = fromQuery(new URLSearchParams(window.location.search));
    let base: Partial<BidInputs> | null = q;
    if (!base) { try { const s = localStorage.getItem(STORE); if (s) base = JSON.parse(s); } catch { /* ignore */ } }
    if (base) {
      setInp((cur) => ({ ...cur, ...base }));
      if (q) { setStep('result'); track('tool_start', { tool: 'bid-calculator', trade: q.trade || '', via: 'shared-link' }); }
    }
  }, []);

  const t = getTrade(inp.trade); const j = getJob(t, inp.job);
  const r = useMemo(() => compute(inp), [inp]);
  const q = QUESTIONS[qi];
  const set = (k: keyof BidInputs, v: number | null) => setInp((c) => ({ ...c, [k]: v }));

  const chooseTrade = (id: TradeId) => {
    const tr = getTrade(id);
    setInp((c) => ({ ...c, trade: id, job: tr.jobs[0].id, overhead: c.overhead || tr.overhead, bidsPerMonth: tr.bidsPerMonth, hoursPerBid: tr.hoursPerBid }));
    setStep('job'); track('tool_start', { tool: 'bid-calculator', trade: id });
  };
  const chooseJob = (id: string) => { setInp((c) => ({ ...c, job: id })); setQi(0); setStep('q'); };
  const useDefault = () => {
    const d = (j.d as any)[q.key] ?? (q.key === 'overhead' ? t.overhead : null);
    if (d !== null && d !== undefined) { set(q.key, d); setEstimated((p) => new Set(p).add(q.key)); }
    next();
  };
  const next = () => {
    if (qi + 1 < QUESTIONS.length) return setQi(qi + 1);
    setStep('result');
    try { localStorage.setItem(STORE, JSON.stringify(inp)); } catch { /* ignore */ }
    track('tool_complete', { tool: 'bid-calculator', trade: inp.trade, verdict: compute(inp).verdict });
  };
  const back = () => (qi === 0 ? setStep('job') : setQi(qi - 1));

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/tools/bid-calculator?${toQuery(inp)}` : '';
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!email.trim()) return; setSaving(true); setSaved('');
    try {
      const res = await fetch('/api/bid-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, inputs: inp, result: r, url: shareUrl, tradeLabel: t.label, jobLabel: j.label }) });
      if (!res.ok) throw new Error('save failed');
      setSaved('Sent. Check your inbox — the link in it reopens this bid with your numbers.'); track('tool_save', { tool: 'bid-calculator', trade: inp.trade });
    } catch { setSaved('That didn’t send. Try again, or just bookmark this page — your numbers are remembered on this device.'); }
    finally { setSaving(false); }
  };

  const verdictLine = { pays: 'This bid pays.', thin: 'This bid is thin.', costs: 'This bid costs you money.', unpriced: 'Here is what to charge.' }[r.verdict];

  return (
    <>
      <SEO
        title="Bid Calculator for contractors — is this bid making you money?"
        description="Type one real bid in from the truck and see what it actually earns, what you should charge, and how many hours a year bids like it are eating. Free, no email needed for your number."
        path="/tools/bid-calculator"
      />
      <div className="min-h-screen bg-vmCream" data-aesthetic="roman">
        <section className="pt-36 pb-20 px-6">
          <div className="max-w-3xl mx-auto">

            {step === 'trade' && (
              <Reveal>
                <Eyebrow className="text-accent mb-6">The Bid Calculator · free</Eyebrow>
                <h1 className="font-serif text-vmNavy text-[2.4rem] md:text-[3.6rem] leading-[1.06] mb-7">
                  Is this bid
                  <br /><span className="italic">making you money?</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-2xl">
                  One real bid, six numbers, under a minute. You’ll see what it actually earns, what it
                  should have been priced at, and how many hours a year bids like it are eating.
                </p>
                <p className="text-sm text-slate-500 mb-10">No email needed for your number. Nothing is saved unless you ask to keep it.</p>
                <h2 className="text-sm font-semibold text-vmNavy mb-4">First — what’s your trade?</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {TRADES.map((tr) => (
                    <button key={tr.id} onClick={() => chooseTrade(tr.id)}
                      className="text-left px-5 py-4 bg-white border border-slate-200 rounded-sm hover:border-vmTeal hover:shadow-sm transition-all text-vmNavy font-medium">
                      {tr.label}
                    </button>
                  ))}
                </div>
              </Reveal>
            )}

            {step === 'job' && (
              <Reveal>
                <Eyebrow className="text-accent mb-5">{t.label}</Eyebrow>
                <h1 className="font-serif text-vmNavy text-[2rem] md:text-[2.9rem] leading-tight mb-5">What kind of job is this bid for?</h1>
                <p className="text-slate-600 mb-8">Sets sensible fallbacks for anything you don’t know. Your own numbers always win.</p>
                <div className="grid sm:grid-cols-2 gap-3 mb-10">
                  {t.jobs.map((jb) => (
                    <button key={jb.id} onClick={() => chooseJob(jb.id)}
                      className="text-left px-5 py-4 bg-white border border-slate-200 rounded-sm hover:border-vmTeal hover:shadow-sm transition-all text-vmNavy font-medium">
                      {jb.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep('trade')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-vmNavy"><ArrowLeft className="w-4 h-4" /> Back</button>
              </Reveal>
            )}

            {step === 'q' && q && (
              <Reveal key={q.key}>
                <div className="mb-10">
                  <div className="flex justify-between eyebrow text-slate-500 mb-2"><span>{qi + 1} of {QUESTIONS.length}</span><span>{j.label}</span></div>
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-vmTeal transition-all duration-300" style={{ width: `${(qi / QUESTIONS.length) * 100}%` }} /></div>
                </div>
                <h1 className="font-serif text-vmNavy text-[1.7rem] md:text-[2.4rem] leading-snug mb-4">{q.label}</h1>
                <p className="text-slate-600 mb-7">{q.hint}</p>
                <div className="flex items-center gap-3 mb-3 max-w-sm">
                  {q.prefix && <span className="text-2xl font-serif text-slate-500">{q.prefix}</span>}
                  <input className={fieldCls + ' text-xl'} type="number" inputMode="decimal" autoFocus min={0}
                    value={(inp as any)[q.key] ?? ''} placeholder={q.key === 'price' ? 'blank = tell me' : String((j.d as any)[q.key] ?? t.overhead)}
                    onChange={(e) => { const v = e.target.value === '' ? (q.key === 'price' ? null : 0) : Number(e.target.value); set(q.key, v as any); setEstimated((p) => { const n = new Set(p); n.delete(q.key); return n; }); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') next(); }} />
                  {q.suffix && <span className="text-slate-500 whitespace-nowrap">{q.suffix}</span>}
                </div>
                {!q.optional && (
                  <button onClick={useDefault} className="text-sm text-slate-500 hover:text-vmNavy underline underline-offset-4 mb-9 block">
                    I don’t know — use a typical {t.label.toLowerCase()} number (marked as ours)
                  </button>
                )}
                {q.optional && <div className="mb-9" />}
                <div className="flex items-center gap-4">
                  <button onClick={next} className={buttonPrimary}>{qi + 1 === QUESTIONS.length ? 'Show me' : 'Next'} <ChevronRight className="w-4 h-4" /></button>
                  <button onClick={back} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-vmNavy"><ArrowLeft className="w-4 h-4" /> Back</button>
                </div>
              </Reveal>
            )}

            {step === 'result' && (
              <Reveal>
                <Eyebrow className="text-accent mb-5">{t.label} · {j.label}</Eyebrow>
                <h1 className="font-serif text-vmNavy text-[1.9rem] md:text-[2.6rem] leading-tight mb-3">{verdictLine}</h1>
                {r.price !== null && r.gp !== null && r.gpPct !== null ? (
                  <>
                    <p className="font-serif text-vmNavy text-[3rem] md:text-[4.6rem] leading-none mb-2 tabular-nums">
                      {money(r.gp)}<span className="text-2xl text-slate-500 font-sans"> gross profit · {pct(r.gpPct)}</span>
                    </p>
                    <p className="text-slate-600 mb-8 max-w-2xl">
                      On a {money(r.price)} bid with {money(r.cost)} of cost. The floor most trades coaches use is {pct(FLOOR)} gross profit — that’s what has to cover your overhead and leave something for you.
                      {r.verdict !== 'pays' && ` At ${pct(r.gpPct)}, this one ${r.verdict === 'thin' ? 'barely does' : 'doesn’t'}.`}
                    </p>
                  </>
                ) : (
                  <p className="text-slate-600 mb-8 max-w-2xl">{money(r.cost)} of cost on this job. Priced at the {pct(FLOOR)} floor it needs to go out at <strong className="text-vmNavy">{money(r.chargeAt[50])}</strong>.</p>
                )}

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {[50, 55, 60].map((m) => (
                    <div key={m} className={`p-5 bg-white border rounded-sm ${m === 50 ? 'border-vmTeal' : 'border-slate-200'}`}>
                      <p className="eyebrow text-slate-500 mb-2">Charge this at {m}%</p>
                      <p className="font-serif text-2xl text-vmNavy tabular-nums">{money(r.chargeAt[m])}</p>
                      <p className="text-xs text-slate-500 mt-1">{money(r.chargeAt[m] - r.cost)} gross profit</p>
                    </div>
                  ))}
                </div>

                {r.jobsPerMonth !== null && (
                  <p className="text-slate-600 mb-8 max-w-2xl">
                    To cover {money(inp.overhead)} a month of overhead{r.gp !== null && r.gp > 0 ? ' at your price' : ' at the floor'}, you need about <strong className="text-vmNavy">{r.jobsPerMonth} jobs like this a month</strong>
                    {r.leadsPerMonth !== null && <> — roughly <strong className="text-vmNavy">{r.leadsPerMonth} bids</strong> at a {pct(inp.closeRate)} close rate</>}.
                  </p>
                )}

                {/* The bridge: hours a year, with two sliders */}
                <div className="p-6 bg-white border border-slate-200 rounded-sm mb-8">
                  <p className="eyebrow text-slate-500 mb-3">And the hours</p>
                  <p className="font-serif text-vmNavy text-3xl md:text-4xl mb-4 tabular-nums">{r.hoursPerYear.toLocaleString()} <span className="text-base text-slate-500 font-sans">hours a year writing bids</span></p>
                  <div className="grid sm:grid-cols-2 gap-6 text-sm text-slate-600">
                    <label className="block">Bids a month: <strong className="text-vmNavy">{inp.bidsPerMonth}</strong>
                      <input type="range" min={1} max={60} value={inp.bidsPerMonth} onChange={(e) => set('bidsPerMonth', Number(e.target.value))} className="w-full accent-vmTeal mt-2" /></label>
                    <label className="block">Hours per bid: <strong className="text-vmNavy">{inp.hoursPerBid}</strong>
                      <input type="range" min={0.25} max={40} step={0.25} value={inp.hoursPerBid} onChange={(e) => set('hoursPerBid', Number(e.target.value))} className="w-full accent-vmTeal mt-2" /></label>
                    <label className="block sm:col-span-2">Close rate: <strong className="text-vmNavy">{pct(inp.closeRate)}</strong>
                      <input type="range" min={0.05} max={0.9} step={0.05} value={inp.closeRate} onChange={(e) => set('closeRate', Number(e.target.value))} className="w-full accent-vmTeal mt-2" /></label>
                  </div>
                  <p className="text-sm text-slate-600 mt-5 leading-relaxed">
                    A roofer on Seattle’s Eastside typed every bid by hand — ten to fifteen minutes each, up to an hour for the complicated ones.
                    His bid writer, built from all 745 of his past bids, prices within 4.7% of the ones he wrote himself. In minutes, in his own format, off his own rates.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
                  <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                    Book 20 minutes — leave knowing what your bids should earn <ChevronRight className="w-4 h-4" />
                  </a>
                  <Link to="/bid-bot" className={buttonSecondary}>How the bid writer works <ArrowRight className="w-4 h-4" /></Link>
                </div>

                {/* Save / share — after the number, never before */}
                <form onSubmit={save} className="p-6 bg-white border border-slate-200 rounded-sm mb-6">
                  <p className="font-semibold text-vmNavy mb-1">Keep this bid</p>
                  <p className="text-sm text-slate-600 mb-4">I’ll email you these numbers and a link that reopens them. No list, no drip — one email.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input className={fieldCls} type="email" required placeholder="you@yourcompany.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button type="submit" disabled={saving} className={buttonSecondary + ' whitespace-nowrap'}>{saving ? 'Sending…' : 'Email me this bid'}</button>
                  </div>
                  {saved && <p className="text-sm text-slate-600 mt-3">{saved}</p>}
                </form>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-10">
                  <a href={`mailto:?subject=${encodeURIComponent('Run this bid with the real numbers')}&body=${encodeURIComponent('Open this and fix anything I guessed:\n' + shareUrl)}`} className="text-vmNavy font-semibold hover:text-vmTeal">Send to your estimator</a>
                  <button onClick={() => { navigator.clipboard?.writeText(shareUrl); }} className="text-vmNavy font-semibold hover:text-vmTeal">Copy link</button>
                  <button onClick={() => { setQi(0); setStep('q'); }} className="text-slate-500 hover:text-vmNavy">Edit the numbers</button>
                  <button onClick={() => setStep('trade')} className="text-slate-500 hover:text-vmNavy">Start over</button>
                </div>

                <button onClick={() => setShowMath((s) => !s)} className="text-sm text-slate-500 hover:text-vmNavy underline underline-offset-4 mb-3">
                  {showMath ? 'Hide' : 'Show'} how this is calculated
                </button>
                {showMath && (
                  <div className="text-sm text-slate-600 leading-relaxed space-y-2 max-w-2xl">
                    <p>Cost = materials {money(inp.materials)} + labor ({inp.hours} h × {money(inp.rate)}) {money(r.labor)} + subs/other {money(inp.subs)} = <strong>{money(r.cost)}</strong>.</p>
                    <p>Gross profit = price − cost. Gross-profit % = gross profit ÷ price. “Charge this” at X% = cost ÷ (1 − X), rounded up to $10.</p>
                    <p>Jobs to cover overhead = monthly overhead ÷ gross profit per job. Bids needed = jobs ÷ close rate. Hours a year = bids a month × hours per bid × 12.</p>
                    <p>The 50% floor is The Contractor Fight’s rule of thumb for custom-scope trades; it is a benchmark, not a law. {estimated.size > 0 && <>Fields marked as ours: {Array.from(estimated).join(', ')} — replace them with your numbers and the verdict updates.</>}</p>
                  </div>
                )}
              </Reveal>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default BidCalculator;
