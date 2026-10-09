/* The Bid Calculator — model and math.
 *
 * Mirrors vault 50-Website/pages/tools-bid-calculator.md. Two rules carried over
 * from the Leak Audit: the owner's numbers beat any statistic, and we round
 * conservatively. The 50% gross-profit floor is The Contractor Fight's rule and
 * is credited on the page; it's a benchmark, not our invention.
 */

export type TradeId = 'roofing' | 'remodel' | 'electrical' | 'hvac' | 'other';

export interface JobDefaults {
  materials: number; hours: number; rate: number; subs: number;
}
export interface Job { id: string; label: string; d: JobDefaults }
export interface Trade {
  id: TradeId; label: string; jobs: Job[];
  /** Fallbacks framed as ours, never as facts about the owner. */
  overhead: number; hoursPerBid: number; bidsPerMonth: number;
}

export const TRADES: Trade[] = [
  { id: 'roofing', label: 'Roofing & exteriors', overhead: 18000, hoursPerBid: 0.5, bidsPerMonth: 24, jobs: [
    { id: 'replace', label: 'Roof replacement', d: { materials: 9000, hours: 60, rate: 55, subs: 500 } },
    { id: 'repair', label: 'Repair', d: { materials: 600, hours: 8, rate: 55, subs: 0 } },
    { id: 'siding', label: 'Siding / gutters', d: { materials: 5000, hours: 50, rate: 55, subs: 300 } },
  ] },
  { id: 'remodel', label: 'Remodeling & GC', overhead: 22000, hoursPerBid: 6, bidsPerMonth: 4, jobs: [
    { id: 'kitchen', label: 'Kitchen', d: { materials: 18000, hours: 220, rate: 60, subs: 6000 } },
    { id: 'bath', label: 'Bathroom', d: { materials: 9000, hours: 140, rate: 60, subs: 3000 } },
    { id: 'addition', label: 'Addition / whole house', d: { materials: 45000, hours: 600, rate: 60, subs: 15000 } },
  ] },
  { id: 'electrical', label: 'Electrical', overhead: 12000, hoursPerBid: 0.5, bidsPerMonth: 20, jobs: [
    { id: 'panel', label: 'Panel upgrade', d: { materials: 1800, hours: 12, rate: 85, subs: 0 } },
    { id: 'service', label: 'Service call', d: { materials: 150, hours: 3, rate: 85, subs: 0 } },
    { id: 'remodel-wiring', label: 'Remodel wiring', d: { materials: 3500, hours: 60, rate: 85, subs: 0 } },
  ] },
  { id: 'hvac', label: 'HVAC & plumbing', overhead: 15000, hoursPerBid: 1, bidsPerMonth: 12, jobs: [
    { id: 'install', label: 'System install', d: { materials: 6000, hours: 24, rate: 75, subs: 400 } },
    { id: 'repair', label: 'Repair', d: { materials: 300, hours: 4, rate: 75, subs: 0 } },
    { id: 'repipe', label: 'Repipe / water heater', d: { materials: 2500, hours: 20, rate: 75, subs: 0 } },
  ] },
  { id: 'other', label: 'Other trade', overhead: 12000, hoursPerBid: 1, bidsPerMonth: 8, jobs: [
    { id: 'typical', label: 'A typical job', d: { materials: 3000, hours: 40, rate: 60, subs: 0 } },
  ] },
];

export interface BidInputs {
  trade: TradeId; job: string;
  materials: number; hours: number; rate: number; subs: number;
  overhead: number;              // per month, including the owner's pay
  price: number | null;          // what they quoted; null = "tell me what to charge"
  closeRate: number;             // 0–1
  bidsPerMonth: number; hoursPerBid: number;
}

export const FLOOR = 0.5;        // The Contractor Fight's gross-profit floor
export const TARGETS = [0.5, 0.55, 0.6] as const;

export type Verdict = 'pays' | 'thin' | 'costs' | 'unpriced';

export interface BidResult {
  cost: number; labor: number;
  price: number | null; gp: number | null; gpPct: number | null; verdict: Verdict;
  chargeAt: Record<number, number>;        // price needed at each GP target
  gpAtFloor: number;                        // gross profit per job if priced at the floor
  jobsPerMonth: number | null;              // jobs like this to cover overhead (at their price, or at the floor)
  leadsPerMonth: number | null;
  hoursPerYear: number;
}

export const roundDown = (n: number, step = 10) => Math.floor(n / step) * step;
export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
export const pct = (x: number) => Math.round(x * 100) + '%';

export function trade(id: TradeId) { return TRADES.find((t) => t.id === id) || TRADES[TRADES.length - 1]; }
export function job(t: Trade, id: string) { return t.jobs.find((j) => j.id === id) || t.jobs[0]; }

export function compute(i: BidInputs): BidResult {
  const labor = Math.max(0, i.hours) * Math.max(0, i.rate);
  const cost = Math.max(0, i.materials) + labor + Math.max(0, i.subs);
  const chargeAt: Record<number, number> = {};
  for (const m of TARGETS) chargeAt[Math.round(m * 100)] = cost > 0 ? Math.ceil(cost / (1 - m) / 10) * 10 : 0;
  const gpAtFloor = chargeAt[50] - cost;
  let price: number | null = i.price && i.price > 0 ? i.price : null;
  let gp: number | null = null, gpPct: number | null = null, verdict: Verdict = 'unpriced';
  if (price !== null) {
    gp = price - cost; gpPct = price > 0 ? gp / price : 0;
    verdict = gpPct >= FLOOR ? 'pays' : gpPct >= 0.35 ? 'thin' : 'costs';
  }
  const gpForBreakEven = gp !== null && gp > 0 ? gp : gpAtFloor > 0 ? gpAtFloor : null;
  const jobsPerMonth = gpForBreakEven ? Math.ceil(i.overhead / gpForBreakEven) : null;
  const close = Math.min(1, Math.max(0.05, i.closeRate || 0.3));
  const leadsPerMonth = jobsPerMonth !== null ? Math.ceil(jobsPerMonth / close) : null;
  const hoursPerYear = Math.round(Math.max(0, i.bidsPerMonth) * Math.max(0, i.hoursPerBid) * 12);
  return { cost, labor, price, gp, gpPct, verdict, chargeAt, gpAtFloor, jobsPerMonth, leadsPerMonth, hoursPerYear };
}

/** Compact query string so a result can be sent to an estimator and re-run. */
export function toQuery(i: BidInputs) {
  const p = new URLSearchParams({ t: i.trade, j: i.job, m: String(i.materials), h: String(i.hours), r: String(i.rate), s: String(i.subs), o: String(i.overhead), b: String(i.bidsPerMonth), hb: String(i.hoursPerBid), c: String(i.closeRate) });
  if (i.price) p.set('p', String(i.price));
  return p.toString();
}
export function fromQuery(q: URLSearchParams): Partial<BidInputs> | null {
  if (!q.get('t')) return null;
  const n = (k: string) => (q.get(k) !== null && q.get(k) !== '' ? Number(q.get(k)) : undefined);
  const out: Partial<BidInputs> = { trade: (q.get('t') as TradeId) || 'other', job: q.get('j') || undefined };
  const map: [keyof BidInputs, string][] = [['materials', 'm'], ['hours', 'h'], ['rate', 'r'], ['subs', 's'], ['overhead', 'o'], ['bidsPerMonth', 'b'], ['hoursPerBid', 'hb'], ['closeRate', 'c'], ['price', 'p']];
  for (const [k, qk] of map) { const v = n(qk); if (v !== undefined && !Number.isNaN(v)) (out as any)[k] = v; }
  return out;
}
