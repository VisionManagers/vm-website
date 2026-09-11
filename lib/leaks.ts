/* The Leak Audit — model, inputs and math.
 *
 * Mirrors 10-Strategy/offers/leak-audit.md (v2). Every formula here is the
 * one written in the vault; if a formula changes, change it there first.
 *
 * Two rules carried over from the source, because they're what make the
 * output defensible rather than impressive:
 *   1. Their numbers beat any industry statistic. We only ever multiply what
 *      the owner told us.
 *   2. Round DOWN, always. A number the owner can attack and still find
 *      large has sold itself. See `conservative()`.
 *
 * Leaks 11 and 12 are deliberately unpriced — the source says so. They carry
 * a `qualitative` flag and are used as blind-spot reveals instead.
 */

export type Category = 'A' | 'B' | 'C' | 'D';

export interface LeakInput {
  key: string;
  /** The question, phrased so it's answerable from memory in ten seconds. */
  label: string;
  hint?: string;
  suffix?: string;
  /** Used when the visitor genuinely doesn't know — always framed as ours. */
  fallback: number;
  min?: number;
  max?: number;
}

export interface LeakDef {
  n: number;
  id: string;
  category: Category;
  name: string;
  /** One line, in the owner's language — what they'd say, not what we'd call it. */
  symptom: string;
  qualitative?: boolean;
  inputs: LeakInput[];
  /** Annual dollars. Inputs are already merged with shared values. */
  compute?: (v: Record<string, number>) => number;
  /** Shown with the number, so the arithmetic is never a black box. */
  explain?: (v: Record<string, number>) => string;
  build: string;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  A: 'Demand you already paid for, then lost',
  B: 'Time bought at expert prices, spent on robot work',
  C: 'Knowledge that leaves when people do',
  D: 'Money you never asked for',
};

/* Shared inputs — asked once, reused by whichever leaks need them, so nobody
   is asked what a customer is worth twice. */
export const SHARED_INPUTS: LeakInput[] = [
  {
    key: 'value',
    label: 'What is one new customer worth to you, over the life of the relationship?',
    hint: 'Rough is fine. Total revenue, not profit.',
    suffix: '$',
    fallback: 2500,
    min: 50,
    max: 5_000_000,
  },
  {
    key: 'rate',
    label: 'What is an hour of your team’s time worth, loaded?',
    hint: 'Wages plus overhead. For your own hours, use what an hour of you is worth.',
    suffix: '$/hr',
    fallback: 85,
    min: 10,
    max: 2000,
  },
];

/** Rounds down hard, so every figure is one the owner can attack and still lose. */
export const conservative = (n: number): number => {
  if (!isFinite(n) || n <= 0) return 0;
  if (n < 1000) return Math.floor(n / 50) * 50;
  if (n < 10_000) return Math.floor(n / 500) * 500;
  if (n < 100_000) return Math.floor(n / 1000) * 1000;
  return Math.floor(n / 5000) * 5000;
};

export const money = (n: number): string =>
  '$' + Math.round(n).toLocaleString('en-US');

export const LEAKS: LeakDef[] = [
  /* ── A · Demand you already paid for, then lost ───────────────── */
  {
    n: 1, id: 'phone', category: 'A',
    name: 'The Phone Leak',
    symptom: 'Calls go unanswered — after hours, at lunch, when everyone’s busy.',
    inputs: [
      { key: 'missedPerWeek', label: 'Roughly how many calls a week go unanswered or to voicemail?', hint: 'Include after-hours and weekends. A guess is fine.', fallback: 12, min: 0, max: 2000 },
      { key: 'closeRate', label: 'Of the callers you do speak to, what share become customers?', suffix: '%', fallback: 30, min: 1, max: 100 },
    ],
    compute: (v) => v.missedPerWeek * 52 * (v.closeRate / 100) * v.value * 0.5,
    explain: (v) =>
      `${v.missedPerWeek} missed calls a week × 52 weeks × ${v.closeRate}% close rate × ${money(v.value)} — then halved, because some callers do ring back.`,
    build: 'A voice agent that answers every call, every hour, in your language.',
  },
  {
    n: 2, id: 'speed', category: 'A',
    name: 'The Speed Leak',
    symptom: 'Enquiries sit for hours — or until Monday — before a human replies.',
    inputs: [
      { key: 'leadsPerMonth', label: 'How many enquiries come in a month?', hint: 'Forms, emails, DMs — anything that needs a reply.', fallback: 25, min: 0, max: 100_000 },
      { key: 'pctSlow', label: 'What share of those wait more than an hour for a real reply?', suffix: '%', fallback: 50, min: 0, max: 100 },
    ],
    compute: (v) => v.leadsPerMonth * 12 * (v.pctSlow / 100) * 0.15 * v.value,
    explain: (v) =>
      `${v.leadsPerMonth} enquiries a month × 12 × ${v.pctSlow}% answered slowly × a conservative 15% you'd have won by replying fast × ${money(v.value)}.`,
    build: 'Instant-response automation that replies in seconds and qualifies while interest is hot.',
  },
  {
    n: 3, id: 'followup', category: 'A',
    name: 'The Follow-Up Leak',
    symptom: 'Quotes and consults go out, nobody chases them, they go quiet.',
    inputs: [
      { key: 'untouchedPerQuarter', label: 'In the last 90 days, how many quotes or consults never got a second touch?', fallback: 20, min: 0, max: 100_000 },
    ],
    compute: (v) => v.untouchedPerQuarter * 4 * 0.12 * v.value,
    explain: (v) =>
      `${v.untouchedPerQuarter} untouched a quarter × 4 quarters × a conservative 12% that a real sequence recovers × ${money(v.value)}.`,
    build: 'Automated nurture wired into your CRM, so nothing dies without a real conversation.',
  },
  {
    n: 4, id: 'stale', category: 'A',
    name: 'The Stale-Lead Leak',
    symptom: 'There’s a database of old customers and dead quotes nobody has touched in years.',
    inputs: [
      { key: 'dormant', label: 'How many old contacts sit in your CRM, inbox or spreadsheets?', hint: 'Past customers, dead quotes, no-shows — from the last 2–5 years.', fallback: 800, min: 0, max: 5_000_000 },
    ],
    compute: (v) => v.dormant * 0.03 * v.value,
    explain: (v) =>
      `${v.dormant.toLocaleString()} dormant contacts × a 3% reactivation rate — our own conservative planning figure, not a study — × ${money(v.value)}.`,
    build: 'A reactivation campaign. Usually the fastest cash in the building, because you already paid to acquire them.',
  },
  {
    n: 5, id: 'secondlook', category: 'A',
    name: 'The Second-Look Leak',
    symptom: 'People visit the website, leave, and you can never contact them again.',
    inputs: [
      { key: 'visitors', label: 'Roughly how many people visit your website in a month?', fallback: 400, min: 0, max: 10_000_000 },
    ],
    compute: (v) => v.visitors * 12 * 0.97 * 0.02 * v.value * 0.25,
    explain: (v) =>
      `${v.visitors.toLocaleString()} visitors × 12 months × the 97% who leave without converting × a 2% recapture × ${money(v.value)}, then quartered for honesty.`,
    build: 'Lead capture, a list, and retargeting that gives near-buyers a second look.',
  },

  /* ── B · Time bought at expert prices ─────────────────────────── */
  {
    n: 6, id: 'ownerhours', category: 'B',
    name: 'The Owner-Hours Leak',
    symptom: 'You’re still doing scheduling, reporting, chasing invoices — work a system should do.',
    inputs: [
      { key: 'ownerHrs', label: 'How many hours a week do you personally spend on work a system could do?', hint: 'Scheduling, reporting, admin, chasing. Most owners land at 10–15.', suffix: 'hrs', fallback: 10, min: 0, max: 80 },
    ],
    compute: (v) => v.ownerHrs * v.rate * 50,
    explain: (v) =>
      `${v.ownerHrs} hours a week × ${money(v.rate)} an hour × 50 weeks. And these are the only hours that could have gone to growth.`,
    build: 'An operating system for the business, so your hours go where only you can go.',
  },
  {
    n: 7, id: 'repetitive', category: 'B',
    name: 'The Repetitive-Task Leak',
    symptom: 'Staff retype the same things between systems, every week.',
    inputs: [
      { key: 'taskMins', label: 'Pick your worst repeated task. How many minutes does one round take?', suffix: 'min', fallback: 20, min: 1, max: 600 },
      { key: 'timesPerWeek', label: 'How many times a week does that happen?', fallback: 15, min: 1, max: 1000 },
      { key: 'people', label: 'How many people does it?', fallback: 3, min: 1, max: 500 },
    ],
    compute: (v) => (v.taskMins * v.timesPerWeek * v.people / 60) * v.rate * 52,
    explain: (v) =>
      `${v.taskMins} min × ${v.timesPerWeek}× a week × ${v.people} people ÷ 60 × ${money(v.rate)} × 52 weeks. And that's only your worst task.`,
    build: 'Automation workflows, so people do people work.',
  },
  {
    n: 8, id: 'handoff', category: 'B',
    name: 'The Handoff Leak',
    symptom: 'Everything routes through you. People interrupt to ask what a system should answer.',
    inputs: [
      { key: 'interruptions', label: 'How many times a day does someone ask you something a system should answer?', fallback: 8, min: 0, max: 200 },
      { key: 'minsEach', label: 'How long does each one really cost, including getting back on track?', suffix: 'min', fallback: 10, min: 1, max: 240 },
    ],
    compute: (v) => (v.interruptions * v.minsEach / 60) * v.rate * 250 * 0.6,
    explain: (v) =>
      `${v.interruptions} interruptions a day × ${v.minsEach} min ÷ 60 × ${money(v.rate)} × 250 days, discounted 40% because this one is directional.`,
    build: 'A shared source of truth, plus an assistant that answers from your own documents.',
  },

  /* ── C · Knowledge that leaves ────────────────────────────────── */
  {
    n: 9, id: 'training', category: 'C',
    name: 'The Training Leak',
    symptom: 'New hires ramp slowly, and critical know-how lives in one person’s head.',
    inputs: [
      { key: 'rampMonths', label: 'How many months until a new hire is genuinely productive?', suffix: 'months', fallback: 4, min: 0, max: 36 },
      { key: 'salary', label: 'What does that role cost you a year?', suffix: '$', fallback: 55_000, min: 0, max: 2_000_000 },
      { key: 'hiresPerYear', label: 'How many people do you hire or replace in a year?', fallback: 2, min: 0, max: 500 },
    ],
    compute: (v) => v.hiresPerYear * ((v.rampMonths * (v.salary / 12) * 0.5) + v.salary * 0.15),
    explain: (v) =>
      `${v.hiresPerYear} hires × (${v.rampMonths} months at half productivity on a ${money(v.salary)} salary, plus 15% replacement cost).`,
    build: 'SOPs generated from recorded walkthroughs, and a training assistant trained on your own documents.',
  },

  /* ── D · Money you never asked for ────────────────────────────── */
  {
    n: 10, id: 'offer', category: 'D',
    name: 'The Offer Leak',
    symptom: 'No upsell, no renewal motion, and prices you’ve been afraid to raise.',
    inputs: [
      { key: 'activeClients', label: 'How many active customers do you have?', fallback: 120, min: 0, max: 5_000_000 },
      { key: 'upsell', label: 'What would one sensible next purchase be worth?', suffix: '$', fallback: 500, min: 0, max: 1_000_000 },
    ],
    compute: (v) => v.activeClients * v.upsell * 0.15,
    explain: (v) =>
      `${v.activeClients.toLocaleString()} customers × ${money(v.upsell)} × a conservative 15% who'd say yes if you simply asked.`,
    build: 'Offer architecture, plus automated recall, upsell and renewal campaigns.',
  },
  {
    n: 11, id: 'blindness', category: 'D',
    name: 'The Market-Blindness Leak',
    symptom: 'Decisions get made on instinct — no review mining, no voice-of-customer, no competitor watch.',
    qualitative: true,
    inputs: [],
    build: 'A research stack: review mining, call-transcript analysis, competitor monitoring.',
  },
  {
    n: 12, id: 'invisible', category: 'D',
    name: 'The Invisible Leak',
    symptom: 'When someone asks an AI for the best in your category, you’re not in the answer.',
    qualitative: true,
    inputs: [],
    build: 'A content engine, a review system, and a buying journey that works at 11pm.',
  },
];

export const byId = (id: string): LeakDef | undefined => LEAKS.find((l) => l.id === id);

/* Business-type selector — mirrors the vault's table. Picking a type
   pre-selects the leaks that type usually has, so nobody starts from zero. */
export interface BizType { id: string; label: string; lead: string[]; blind: string }
export const BIZ_TYPES: BizType[] = [
  { id: 'practice',  label: 'Medical, dental or optometry', lead: ['phone', 'stale'],            blind: 'invisible' },
  { id: 'trades',    label: 'Trades or home services',       lead: ['phone', 'speed'],            blind: 'offer' },
  { id: 'legal',     label: 'Law or professional services',  lead: ['speed', 'followup'],         blind: 'ownerhours' },
  { id: 'agency',    label: 'Agency, consulting or boutique',lead: ['ownerhours', 'repetitive'],  blind: 'offer' },
  { id: 'wellness',  label: 'Wellness, fitness, membership', lead: ['stale', 'offer'],            blind: 'secondlook' },
  { id: 'recruiting',label: 'Recruiting or staffing',        lead: ['speed', 'followup'],         blind: 'secondlook' },
  { id: 'other',     label: 'Something else',                lead: ['ownerhours', 'followup'],    blind: 'invisible' },
];

/**
 * The blind spot: the highest-value leak they did NOT pick.
 * Priced leaks are ranked by what they'd actually be worth on this business;
 * if none of the unpicked ones can be priced, fall back to the business
 * type's usual blind spot — which is `invisible` for most, and lands hardest
 * because it can be checked in ten seconds.
 */
export function findBlindSpot(
  picked: string[],
  values: Record<string, number>,
  bizType: string,
): { leak: LeakDef; amount: number } | null {
  const unpicked = LEAKS.filter((l) => !picked.includes(l.id));
  const scored = unpicked
    .filter((l) => l.compute && l.inputs.every((i) => values[i.key] !== undefined || i.fallback))
    .map((l) => {
      const merged: Record<string, number> = { ...values };
      l.inputs.forEach((i) => { if (merged[i.key] === undefined) merged[i.key] = i.fallback; });
      return { leak: l, amount: conservative(l.compute!(merged)) };
    })
    .sort((a, b) => b.amount - a.amount);

  const type = BIZ_TYPES.find((b) => b.id === bizType);
  const preferred = type && !picked.includes(type.blind) ? byId(type.blind) : undefined;

  // A qualitative blind spot beats a guessed number: it's checkable, not estimated.
  if (preferred?.qualitative) return { leak: preferred, amount: 0 };
  return scored[0] ?? (preferred ? { leak: preferred, amount: 0 } : null);
}
