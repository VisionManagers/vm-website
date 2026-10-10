import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { track } from '../../lib/track';
import { Reveal, Eyebrow, buttonPrimary, buttonSecondary } from '../../components/ornaments';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { BOOKING_URLS } from '../../constants';
import {
  TRADES, trade as getTrade, job as getJob, compute, money, pct, toQuery, fromQuery, FLOOR,
  type BidInputs, type TradeId,
} from '../../lib/bid';

/* The Bid Calculator, v2 (Suk 10/9): no click-in. The visitor lands in the tool — trade and
   job at the top, every field on one screen with its typical value one tap away, the result
   updating as they type. Returning visitors find their last numbers already in the boxes.
   Vault brief: 50-Website/pages/tools-bid-calculator.md. Result first; email only to save. */

type FKey = 'materials' | 'hours' | 'rate' | 'subs' | 'overhead' | 'price';
const FIELDS: { key: FKey; label: string; hint: string; prefix?: string; suffix?: string; optional?: boolean }[] = [
  { key: 'materials', label: 'Materials', hint: 'Supplier total, delivered', prefix: '$' },
  { key: 'hours', label: 'Crew hours', hint: 'Everyone on site, all days', suffix: 'hrs' },
  { key: 'rate', label: 'Loaded crew rate', hint: 'Wage + taxes, insurance, truck (≈ wage + 30%)', prefix: '$', suffix: '/hr' },
  { key: 'subs', label: 'Subs, permits, dump', hint: 'Everything else you pay out. Zero is fine', prefix: '$' },
  { key: 'overhead', label: 'Overhead per month', hint: 'Rent, trucks, insurance, software — and your own pay', prefix: '$', suffix: '/mo' },
  { key: 'price', label: 'What you quoted', hint: 'Leave blank and I’ll tell you what to charge', prefix: '$', optional: true },
];
const STORE = 'vm-bid-calc';
const fieldCls = 'w-full px-3 py-2.5 bg-white border border-slate-200 rounded-sm outline-none focus:border-vmTeal transition-colors text-vmNavy text-lg tabular-nums';

const BidCalculator: React.FC = () => {
  const [inp, setInp] = useState<BidInputs>(() => ({ trade: 'roofing', job: 'replace', materials: 0, hours: 0, rate: 0, subs: 0, overhead: 0, price: null, closeRate: 0.3, bidsPerMonth: 24, hoursPerBid: 0.5 }));
  const [touched, setTouched] = useState<Set<FKey>>(new Set());   // fields the visitor typed (vs typical)
  const [typical, setTypical] = useState<Set<FKey>>(new Set());   // fields filled with our typical number
  const [email, setEmail] = useState(''); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState('');
  const [showMath, setShowMath] = useState(false);
  const started = useRef(false); const completed = useRef(false);

  useEffect(() => {
    const q = fromQuery(new URLSearchParams(window.location.search));
    let base: Partial<BidInputs> | null = q;
    if (!base) { try { const s = localStorage.getItem(STORE); if (s) base = JSON.parse(s); } catch { /* ignore */ } }
    if (base) {
      setInp((c) => ({ ...c, ...base }));
      const t = new Set<FKey>(); (['materials', 'hours', 'rate', 'subs', 'overhead', 'price'] as FKey[]).forEach((k) => { if ((base as any)[k]) t.add(k); });
      setTouched(t);
      if (q) track('tool_start', { tool: 'bid-calculator', trade: q.trade || '', via: 'shared-link' });
    }
  }, []);

  const t = getTrade(inp.trade); const j = getJob(t, inp.job);
  const typicalFor = (k: FKey): number | null => (k === 'overhead' ? t.overhead : k === 'price' ? null : (j.d as any)[k] ?? null);
  const r = useMemo(() => compute(inp), [inp]);
  const hasCost = r.cost > 0;
  useEffect(() => {
    if (hasCost) { try { localStorage.setItem(STORE, JSON.stringify(inp)); } catch { /* ignore */ } }
    if (hasCost && !completed.current && (inp.materials > 0 || inp.hours > 0) && inp.overhead > 0) { completed.current = true; track('tool_complete', { tool: 'bid-calculator', trade: inp.trade, verdict: r.verdict }); }
  }, [inp, hasCost, r.verdict]);

  const set = (k: keyof BidInputs, v: number | null) => {
    if (!started.current) { started.current = true; track('tool_start', { tool: 'bid-calculator', trade: inp.trade }); }
    setInp((c) => ({ ...c, [k]: v }));
  };
  const typeField = (k: FKey, raw: string) => {
    const v = raw === '' ? (k === 'price' ? null : 0) : Number(raw);
    set(k, v as any); setTouched((p) => new Set(p).add(k)); setTypical((p) => { const n = new Set(p); n.delete(k); return n; });
  };
  const useTypical = (k: FKey) => { const v = typicalFor(k); if (v === null) return; set(k, v); setTypical((p) => new Set(p).add(k)); setTouched((p) => { const n = new Set(p); n.delete(k); return n; }); };
  const chooseTrade = (id: TradeId) => { const tr = getTrade(id); setInp((c) => ({ ...c, trade: id, job: tr.jobs[0].id, bidsPerMonth: tr.bidsPerMonth, hoursPerBid: tr.hoursPerBid, ...(typical.has('overhead') || !c.overhead ? { overhead: 0 } : {}) })); setTypical(new Set()); };
  const chooseJob = (id: string) => { setInp((c) => ({ ...c, job: id })); setTypical((p) => { const n = new Set(p); n.delete('materials'); n.delete('hours'); n.delete('rate'); n.delete('subs'); return n; }); };
  const fillAllTypical = () => { (['materials', 'hours', 'rate', 'subs', 'overhead'] as FKey[]).forEach((k) => { if (!touched.has(k)) useTypical(k); }); };
  const clearAll = () => { setInp((c) => ({ ...c, materials: 0, hours: 0, rate: 0, subs: 0, overhead: 0, price: null })); setTouched(new Set()); setTypical(new Set()); try { localStorage.removeItem(STORE); } catch { /* ignore */ } };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/tools/bid-calculator?${toQuery(inp)}` : '';
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!email.trim()) return; setSaving(true); setSaved('');
    try {
      const res = await fetch('/api/bid-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, inputs: inp, result: r, url: shareUrl, tradeLabel: t.label, jobLabel: j.label }) });
      if (!res.ok) throw new Error('save failed');
      setSaved('Sent. The link in it reopens this bid with your numbers.'); track('tool_save', { tool: 'bid-calculator', trade: inp.trade });
    } catch { setSaved('That didn’t send. Your numbers are remembered on this device — or copy the link below.'); }
    finally { setSaving(false); }
  };
  const verdictLine = { pays: 'This bid pays.', thin: 'This bid is thin.', costs: 'This bid costs you money.', unpriced: 'Here’s what to charge.' }[r.verdict];
  const chip = (on: boolean) => `px-3.5 py-2 rounded-sm border text-sm font-medium transition-all ${on ? 'bg-vmNavy text-white border-vmNavy' : 'bg-white text-vmNavy border-slate-200 hover:border-vmTeal'}`;

  return (
    <>
      <SEO title="Bid Calculator for contractors — is this bid making you money?" description="Type one real bid in from the truck and see what it actually earns, what you should charge, and how many hours a year bids like it are eating. Free, no email needed for your number." path="/tools/bid-calculator" />
      <div className="min-h-screen bg-vmCream" data-aesthetic="roman">
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-8 max-w-3xl">
              <Eyebrow className="text-accent mb-4">The Bid Calculator · free · no email needed</Eyebrow>
              <h1 className="font-serif text-vmNavy text-[2.2rem] md:text-[3.2rem] leading-[1.06] mb-4">Is this bid <span className="italic">making you money?</span></h1>
              <p className="text-slate-600 leading-relaxed">One real bid, six numbers. Tap <em>typical</em> under any box you don’t know and change it later — the verdict updates as you type.</p>
            </Reveal>

            {/* trade + job */}
            <Reveal className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">{TRADES.map((tr) => <button key={tr.id} type="button" onClick={() => chooseTrade(tr.id)} className={chip(tr.id === inp.trade)}>{tr.label}</button>)}</div>
              <div className="flex flex-wrap gap-2">{t.jobs.map((jb) => <button key={jb.id} type="button" onClick={() => chooseJob(jb.id)} className={chip(jb.id === inp.job) + ' text-xs py-1.5'}>{jb.label}</button>)}</div>
            </Reveal>

            <div className="lg:grid lg:grid-cols-5 lg:gap-10 items-start">
              {/* the form */}
              <Reveal className="lg:col-span-3 p-6 bg-white border border-slate-200 rounded-sm">
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                  {FIELDS.map((f) => {
                    const typ = typicalFor(f.key); const val = (inp as any)[f.key];
                    return (
                      <div key={f.key} className={f.key === 'price' ? 'sm:col-span-2' : ''}>
                        <label className="block text-sm font-semibold text-vmNavy mb-1">{f.label} {f.optional && <span className="font-normal text-slate-400">(optional)</span>}</label>
                        <div className="flex items-center gap-2">
                          {f.prefix && <span className="text-slate-500">{f.prefix}</span>}
                          <input className={fieldCls} type="number" inputMode="decimal" min={0} value={val === 0 && !touched.has(f.key) && !typical.has(f.key) ? '' : (val ?? '')} placeholder={typ !== null ? String(typ) : 'blank = tell me'} onChange={(e) => typeField(f.key, e.target.value)} />
                          {f.suffix && <span className="text-slate-500 text-sm whitespace-nowrap">{f.suffix}</span>}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {f.hint}{typ !== null && <>. {typical.has(f.key) ? <span className="text-vmTeal">Using the typical number ({f.prefix || ''}{typ.toLocaleString()}{f.suffix ? ' ' + f.suffix : ''}) — ours, not yours.</span> : <button type="button" onClick={() => useTypical(f.key)} className="text-vmNavy underline underline-offset-2 hover:text-vmTeal">Typical for {j.label.toLowerCase()}: {f.prefix || ''}{typ.toLocaleString()}{f.suffix ? ' ' + f.suffix : ''}</button>}</>}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm">
                  <button type="button" onClick={fillAllTypical} className="text-vmNavy font-semibold hover:text-vmTeal">Fill the rest with typical numbers</button>
                  <button type="button" onClick={clearAll} className="text-slate-500 hover:text-vmNavy">Clear</button>
                </div>
              </Reveal>

              {/* the result — live */}
              <div className="lg:col-span-2 mt-8 lg:mt-0">
                {!hasCost ? (
                  <Reveal className="p-6 bg-white/60 border border-dashed border-slate-300 rounded-sm text-slate-500 text-sm leading-relaxed">Your three numbers show up here as soon as there’s a cost: what this bid earns, what to charge, and the hours a year bids like it eat.</Reveal>
                ) : (
                  <Reveal key={r.verdict} className="p-6 bg-white border border-vmTeal rounded-sm">
                    <Eyebrow className="text-accent mb-2">{t.label} · {j.label}</Eyebrow>
                    <h2 className="font-serif text-vmNavy text-2xl md:text-3xl leading-tight mb-2">{verdictLine}</h2>
                    {r.price !== null && r.gp !== null && r.gpPct !== null ? (
                      <>
                        <p className="font-serif text-vmNavy text-4xl md:text-5xl leading-none mb-1 tabular-nums">{money(r.gp)}</p>
                        <p className="text-sm text-slate-600 mb-4">gross profit · {pct(r.gpPct)} on a {money(r.price)} bid with {money(r.cost)} of cost. The floor most trades coaches use is {pct(FLOOR)}.{r.verdict !== 'pays' && ` At ${pct(r.gpPct)}, this one ${r.verdict === 'thin' ? 'barely clears it' : 'doesn’t'}.`}</p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-600 mb-4">{money(r.cost)} of cost. At the {pct(FLOOR)} floor it needs to go out at <strong className="text-vmNavy">{money(r.chargeAt[50])}</strong>.</p>
                    )}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[50, 55, 60].map((m) => <div key={m} className={`p-3 rounded-sm border ${m === 50 ? 'border-vmTeal bg-vmCream/60' : 'border-slate-200'}`}><p className="text-[10px] uppercase tracking-widest text-slate-500">Charge at {m}%</p><p className="font-serif text-lg text-vmNavy tabular-nums">{money(r.chargeAt[m])}</p></div>)}
                    </div>
                    {r.jobsPerMonth !== null && <p className="text-sm text-slate-600 mb-4">To cover {money(inp.overhead)}/mo of overhead{r.gp !== null && r.gp > 0 ? ' at your price' : ' at the floor'}: about <strong className="text-vmNavy">{r.jobsPerMonth} jobs like this a month</strong>{r.leadsPerMonth !== null && <>, ~{r.leadsPerMonth} bids at {pct(inp.closeRate)} close</>}.</p>}
                    <div className="pt-4 border-t border-slate-100">
                      <p className="font-serif text-vmNavy text-2xl tabular-nums">{r.hoursPerYear.toLocaleString()} <span className="text-sm text-slate-500 font-sans">hours a year writing bids</span></p>
                      <div className="grid grid-cols-3 gap-3 text-xs text-slate-600 mt-2">
                        <label>Bids/mo <strong className="text-vmNavy">{inp.bidsPerMonth}</strong><input type="range" min={1} max={60} value={inp.bidsPerMonth} onChange={(e) => set('bidsPerMonth', Number(e.target.value))} className="w-full accent-vmTeal" /></label>
                        <label>Hrs/bid <strong className="text-vmNavy">{inp.hoursPerBid}</strong><input type="range" min={0.25} max={40} step={0.25} value={inp.hoursPerBid} onChange={(e) => set('hoursPerBid', Number(e.target.value))} className="w-full accent-vmTeal" /></label>
                        <label>Close <strong className="text-vmNavy">{pct(inp.closeRate)}</strong><input type="range" min={0.05} max={0.9} step={0.05} value={inp.closeRate} onChange={(e) => set('closeRate', Number(e.target.value))} className="w-full accent-vmTeal" /></label>
                      </div>
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">A roofer on Seattle’s Eastside typed every bid by hand, ten to fifteen minutes each. His bid writer, built from all 745 of his past bids, prices within 4.7% of the ones he wrote himself — in minutes, in his format, off his rates.</p>
                    </div>
                    <div className="flex flex-col gap-3 mt-5">
                      <a href={BOOKING_URLS.DISCOVERY} target="_blank" rel="noopener noreferrer" className={buttonPrimary + ' justify-center text-center'}>Book 20 minutes — leave knowing what your bids should earn <ChevronRight className="w-4 h-4" /></a>
                      <Link to="/bid-bot" className={buttonSecondary + ' justify-center'}>How the bid writer works <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                  </Reveal>
                )}
              </div>
            </div>

            {hasCost && (
              <Reveal className="mt-10 grid md:grid-cols-2 gap-6">
                <form onSubmit={save} className="p-6 bg-white border border-slate-200 rounded-sm">
                  <p className="font-semibold text-vmNavy mb-1">Keep this bid</p>
                  <p className="text-sm text-slate-600 mb-3">One email with these numbers and a link that reopens them. No list, no drip.</p>
                  <div className="flex flex-col sm:flex-row gap-3"><input className={fieldCls + ' text-base'} type="email" required placeholder="you@yourcompany.com" value={email} onChange={(e) => setEmail(e.target.value)} /><button type="submit" disabled={saving} className={buttonSecondary + ' whitespace-nowrap'}>{saving ? 'Sending…' : 'Email me this bid'}</button></div>
                  {saved && <p className="text-sm text-slate-600 mt-3">{saved}</p>}
                </form>
                <div className="p-6 bg-white border border-slate-200 rounded-sm text-sm">
                  <p className="font-semibold text-vmNavy mb-2">Share or check the math</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3">
                    <a href={`mailto:?subject=${encodeURIComponent('Run this bid with the real numbers')}&body=${encodeURIComponent('Open this and fix anything I guessed:\n' + shareUrl)}`} className="text-vmNavy font-semibold hover:text-vmTeal">Send to your estimator</a>
                    <button type="button" onClick={() => navigator.clipboard?.writeText(shareUrl)} className="text-vmNavy font-semibold hover:text-vmTeal">Copy link</button>
                    <button type="button" onClick={() => setShowMath((s) => !s)} className="text-slate-500 hover:text-vmNavy underline underline-offset-4">{showMath ? 'Hide' : 'Show'} how this is calculated</button>
                  </div>
                  {showMath && <div className="text-slate-600 leading-relaxed space-y-2">
                    <p>Cost = materials {money(inp.materials)} + labor ({inp.hours} h × {money(inp.rate)}) {money(r.labor)} + subs {money(inp.subs)} = <strong>{money(r.cost)}</strong>.</p>
                    <p>Gross profit = price − cost; GP% = gross profit ÷ price. “Charge at X%” = cost ÷ (1 − X), rounded up to $10. Jobs to cover overhead = overhead ÷ gross profit per job; bids = jobs ÷ close rate; hours/year = bids/mo × hrs/bid × 12.</p>
                    <p>The 50% floor is The Contractor Fight’s rule of thumb for custom-scope trades — a benchmark, not a law.{typical.size > 0 && <> Typical numbers in use: {Array.from(typical).join(', ')} — ours, replace them with yours.</>}</p>
                  </div>}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default BidCalculator;
