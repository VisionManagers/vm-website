/**
 * Calendly → Airtable CRM. Pure logic, no HTTP server concerns (the Vercel handler and the
 * local test script both call handleCalendlyEvent).
 *
 * invitee.created  → People upsert (by email, else new record keyed by slug) + a Touchpoint "booking" row
 * invitee.canceled → Touchpoint marked cancelled (or rescheduled) + People next_action updated
 */
import {
  PEOPLE, TOUCHPOINTS, PEOPLE_KEY, TOUCHPOINT_KEY,
  findPersonByEmail, findPersonBySlug, findTouchpointBySlug, upsert, updateById, listAdd,
} from './airtable.js';

export type CalendlyEvent = {
  event: 'invitee.created' | 'invitee.canceled' | string;
  created_at: string;
  payload: {
    name?: string; first_name?: string; last_name?: string; email: string;
    text_reminder_number?: string | null; timezone?: string;
    questions_and_answers?: { question: string; answer: string; position?: number }[];
    scheduled_event?: { uri?: string; name?: string; start_time?: string; end_time?: string; location?: any };
    cancel_url?: string; reschedule_url?: string; status?: string; uri?: string;
    rescheduled?: boolean; old_invitee?: string | null; new_invitee?: string | null;
    cancellation?: { canceler_type?: string; reason?: string | null; created_at?: string } | null;
    tracking?: Record<string, string | null>;
  };
};

const TZ = 'America/Los_Angeles';

export function slugify(s: string) {
  return s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'unknown';
}

function ptDate(iso: string | undefined) {
  const d = iso ? new Date(iso) : new Date();
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
function ptTime(iso: string | undefined) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
}
function ptWeekday(iso: string | undefined) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(iso));
}

function answersMarkdown(qa: CalendlyEvent['payload']['questions_and_answers']) {
  if (!qa?.length) return '';
  return qa
    .slice().sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((x) => `- **${x.question.trim()}** — ${String(x.answer ?? '').trim() || '—'}`)
    .join('\n');
}

export type Result = { action: string; personSlug: string; personId: string; touchpointSlug: string; touchpointId?: string };

export async function handleCalendlyEvent(evt: CalendlyEvent): Promise<Result | { action: 'ignored'; reason: string }> {
  const p = evt.payload;
  if (!p?.email) return { action: 'ignored', reason: 'no invitee email' };
  const name = (p.name || `${p.first_name || ''} ${p.last_name || ''}`).trim() || p.email.split('@')[0];
  const email = p.email.trim().toLowerCase();
  const phone = (p.text_reminder_number || '').trim();
  const start = p.scheduled_event?.start_time;
  const callDate = ptDate(start);
  const callTime = ptTime(start);
  const eventName = p.scheduled_event?.name || 'Discovery call';
  const today = ptDate(undefined);
  const answers = answersMarkdown(p.questions_and_answers);

  // ---- the person: by email first, else a new record keyed by a name slug ----
  let person = await findPersonByEmail(email);
  let personSlug = person?.fields?.[PEOPLE_KEY] as string | undefined;
  if (!person) {
    personSlug = slugify(name);
    const clash = await findPersonBySlug(personSlug);
    if (clash && String(clash.fields.email || '').toLowerCase() !== email) personSlug = `${personSlug}-${slugify(email.split('@')[0])}`.slice(0, 60);
  }
  personSlug = personSlug || slugify(name);
  const touchpointSlug = `${callDate}-${personSlug}-booking`;

  if (evt.event === 'invitee.created') {
    const context = [
      `## Context`,
      `Booked **${eventName}** via Calendly on ${today} for **${ptWeekday(start)} ${callTime} PT**.`,
      answers ? `\n## Intake (from the booking page)\n${answers}` : '',
      p.reschedule_url ? `\nReschedule: ${p.reschedule_url}\nCancel: ${p.cancel_url}` : '',
      `\n## Conversation history\n- ${today} — booked: ${eventName} for ${callDate} ${callTime} PT (Calendly)`,
    ].filter(Boolean).join('\n');

    const nextAction = `Discovery call ${ptWeekday(start)} ${callTime} PT — run the discovery-call prep brief`;
    if (person) {
      const f = person.fields;
      person = await updateById(PEOPLE, person.id, {
        next_action: nextAction,
        next_action_date: callDate,
        tags: listAdd(f.tags, 'calendly', 'booking'),
        ...(phone && !f.phone ? { phone } : {}),
        ...(f.warmth === 'cold' || !f.warmth ? { warmth: 'warm' } : {}),
        body_markdown: `${(f.body_markdown || '').trimEnd()}\n\n## Booking ${today}\n- ${today} — booked: ${eventName} for ${callDate} ${callTime} PT (Calendly)${answers ? `\n${answers}` : ''}`.trim(),
      });
    } else {
      person = await upsert(PEOPLE, PEOPLE_KEY, {
        [PEOPLE_KEY]: personSlug,
        name, email, ...(phone ? { phone } : {}),
        status: 'cold', source: 'inbound', unit: 'n/a',
        first_contact: today, meeting_count: 0, paying: false, mrr: 0,
        next_action: nextAction, next_action_date: callDate,
        warmth: 'warm', trust: 'unvetted', priority: 'B', cadence: 'monthly', tier: 'none',
        tags: 'calendly; booking', goal_fit: 'deal',
        body_markdown: context,
      });
    }
    const tp = await upsert(TOUCHPOINTS, TOUCHPOINT_KEY, {
      [TOUCHPOINT_KEY]: touchpointSlug,
      type: 'booking', date: callDate,
      event: `Booked: ${eventName}, ${ptWeekday(start)} ${callTime} PT (via Calendly)`,
      people: `[[../People/${personSlug}]]`, source: 'calendly', tags: 'calendly; booking',
      body_markdown: [`# ${name} — booked ${eventName}, ${callDate}`, '', `Booked ${today} via Calendly for ${ptWeekday(start)} ${callTime} PT.`, answers ? `\n## Intake\n${answers}` : ''].filter(Boolean).join('\n'),
    });
    return { action: 'created', personSlug, personId: person.id, touchpointSlug, touchpointId: tp.id };
  }

  if (evt.event === 'invitee.canceled') {
    const rescheduled = !!p.rescheduled;
    const reason = (p.cancellation?.reason || '').trim();
    const who = p.cancellation?.canceler_type === 'host' ? 'by Suk' : 'by the invitee';
    const tp = await findTouchpointBySlug(touchpointSlug);
    let tpId: string | undefined = tp?.id;
    if (tp) {
      const f = tp.fields;
      await updateById(TOUCHPOINTS, tp.id, {
        event: `${rescheduled ? 'RESCHEDULED' : 'CANCELLED'} — ${String(f.event || '').replace(/^Booked: /, '')}`,
        tags: listAdd(f.tags, rescheduled ? 'rescheduled' : 'cancelled'),
        body_markdown: `${(f.body_markdown || '').trimEnd()}\n\n${today} — ${rescheduled ? 'rescheduled' : 'cancelled'} ${who}${reason ? `: "${reason}"` : ''}.`,
      });
    }
    if (person && !rescheduled) {
      person = await updateById(PEOPLE, person.id, {
        next_action: `Call for ${callDate} cancelled ${who}${reason ? ` ("${reason}")` : ''} — reach out and rebook`,
        next_action_date: today,
        tags: listAdd(person.fields.tags, 'cancelled-booking'),
        body_markdown: `${(person.fields.body_markdown || '').trimEnd()}\n- ${today} — cancelled the ${callDate} call ${who}${reason ? `: "${reason}"` : ''}`,
      });
    }
    return { action: rescheduled ? 'rescheduled' : 'cancelled', personSlug, personId: person?.id || '', touchpointSlug, touchpointId: tpId };
  }

  return { action: 'ignored', reason: `event ${evt.event}` };
}
