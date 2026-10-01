/**
 * Minimal Airtable REST client for the CRM base (no SDK, no middleware).
 * Env: AIRTABLE_TOKEN (pat…), AIRTABLE_BASE (app…). Same credentials the vault sync uses.
 *
 * Table conventions (from the vault's _system/airtable/sync_airtable.py):
 *   People      — merge key is the primary field `nameid` (holds the vault slug); list fields are "a; b" text.
 *   Touchpoints — merge key `slug`; `people` is the vault wikilink text "[[../People/<slug>]]".
 * Every write uses typecast=true so new select options are created, exactly like the vault sync.
 */

const API = 'https://api.airtable.com/v0';

function env() {
  const token = process.env.AIRTABLE_TOKEN;
  const base = process.env.AIRTABLE_BASE;
  if (!token || !base) throw new Error('AIRTABLE_TOKEN / AIRTABLE_BASE not set');
  return { token, base };
}

async function call(method: string, path: string, body?: unknown, query?: Record<string, string>) {
  const { token, base } = env();
  const qs = query ? '?' + new URLSearchParams(query).toString() : '';
  const res = await fetch(`${API}/${base}/${encodeURIComponent(path)}${qs}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`Airtable ${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
  return json;
}

export type Record_ = { id: string; fields: Record<string, any> };

export const PEOPLE = 'People';
export const TOUCHPOINTS = 'Touchpoints';
export const PEOPLE_KEY = 'nameid';
export const TOUCHPOINT_KEY = 'slug';

function escapeFormula(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export async function findOne(table: string, formula: string): Promise<Record_ | null> {
  const r = await call('GET', table, undefined, { filterByFormula: formula, maxRecords: '1' });
  return r.records?.[0] ?? null;
}

export function findPersonByEmail(email: string) {
  return findOne(PEOPLE, `LOWER({email})="${escapeFormula(email.trim().toLowerCase())}"`);
}
export function findPersonBySlug(slug: string) {
  return findOne(PEOPLE, `{${PEOPLE_KEY}}="${escapeFormula(slug)}"`);
}
export function findTouchpointBySlug(slug: string) {
  return findOne(TOUCHPOINTS, `{${TOUCHPOINT_KEY}}="${escapeFormula(slug)}"`);
}

/** Upsert one record by the table's merge key (fields must include that key). */
export async function upsert(table: string, mergeKey: string, fields: Record<string, any>): Promise<Record_> {
  const r = await call('PATCH', table, {
    performUpsert: { fieldsToMergeOn: [mergeKey] },
    records: [{ fields }],
    typecast: true,
  });
  return r.records[0];
}

export async function updateById(table: string, id: string, fields: Record<string, any>): Promise<Record_> {
  const r = await call('PATCH', table, { records: [{ id, fields }], typecast: true });
  return r.records[0];
}

export async function deleteById(table: string, id: string) {
  return call('DELETE', table, undefined, { 'records[]': id });
}

/** "a; b" text list helpers (the vault's list encoding). */
export function listAdd(existing: string | undefined, ...items: string[]) {
  const set = new Set((existing || '').split(';').map((s) => s.trim()).filter(Boolean));
  items.forEach((i) => set.add(i));
  return Array.from(set).join('; ');
}
