import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import SEO from '../../components/SEO';
import { BOOKING_URLS } from '../../constants';
import {
  Reveal, Eyebrow, VineDivider, LeafMark,
  buttonPrimary,
} from '../../components/ornaments';
import {
  Gem, Compass, Megaphone, Magnet, Building2, Phone,
  ArrowRight, Send, Loader2, Mail, CheckCircle2, RotateCcw, Sparkles, Mic,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────
   The Workbench — five live AI tools, personalized to the visitor's
   business, with working memory across sessions and an emailed PDF
   report as the capture mechanic. The AI receptionist demo lives on
   a real phone line: (425) 494-4489.
   ──────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'vm_lab_session';
const RECEPTIONIST_TEL = '+14254944489';
const RECEPTIONIST_DISPLAY = '(425) 494-4489';

interface Session {
  leadId: string;
  businessName: string;
  name: string;
  returning?: boolean;
}

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

type ToolKey = 'scout' | 'deals' | 'coach' | 'marketing' | 'leads';
type GeneratorKey = 'deals' | 'coach' | 'marketing' | 'leads';

const TOOLS: { key: ToolKey; icon: React.ElementType; title: string; tagline: string }[] = [
  { key: 'scout', icon: Building2, title: 'Deal Scout', tagline: 'Real estate only: hunts live property deals with web search — for investors and agents.' },
  { key: 'deals', icon: Gem, title: 'Profit Leak Detector', tagline: 'Finds the revenue leaking out of how your business runs — sized in dollars, ranked by what to plug first.' },
  { key: 'coach', icon: Compass, title: 'Business Coach', tagline: 'Ask any business question. Get a direct, practical answer — then talk it through.' },
  { key: 'marketing', icon: Megaphone, title: 'Marketing Strategist', tagline: 'Diagnoses your market, picks the angle, then writes everything — strategy first.' },
  { key: 'leads', icon: Magnet, title: 'Lead Machine', tagline: 'Builds your client-finding playbook: who, where, and the exact scripts.' },
];

const SCOUT_SEED = `Let's build your buy-box, one quick question at a time — then I'll go hunting with live web search.

**1. Target geography** — state, county, city, or ZIP? (Just a state is fine to start; we can zoom in later.)`;

const MARKETING_ASSETS = [
  { value: 'full marketing kit', label: 'Full kit (email + social + ad)' },
  { value: 'promo email', label: 'Promotional email' },
  { value: 'social posts', label: 'Social media posts' },
  { value: 'ad copy', label: 'Google & Facebook ads' },
  { value: 'review reply kit', label: 'Review reply kit' },
];

/* Compact markdown → HTML, styled to the house voice, sanitized before render */
function renderMarkdown(md: string): string {
  const inline = (line: string): string =>
    line
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-vmNavy font-semibold">$1</strong>')
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const parts: string[] = [];
  let inList = false;
  let listTag = '';

  const closeList = () => {
    if (inList) { parts.push(`</${listTag}>`); inList = false; }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }
    if (/^---+$/.test(line)) { closeList(); parts.push('<hr class="my-8 border-slate-200" />'); continue; }
    if (line.startsWith('## ')) {
      closeList();
      parts.push(`<h2 class="text-2xl font-serif text-vmNavy mt-10 mb-3 pb-2 border-b border-slate-100">${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      parts.push(`<h3 class="text-lg font-serif text-vmNavy mt-7 mb-2">${inline(line.slice(4))}</h3>`);
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      if (!inList || listTag !== 'ul') { closeList(); parts.push('<ul class="space-y-2 my-4">'); inList = true; listTag = 'ul'; }
      parts.push(`<li class="flex items-start gap-2"><span class="text-vmTeal mt-1.5 shrink-0">&bull;</span><span>${inline(line.replace(/^[-*]\s+/, ''))}</span></li>`);
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      if (!inList || listTag !== 'ol') { closeList(); parts.push('<ol class="space-y-2 my-4 list-none">'); inList = true; listTag = 'ol'; }
      const num = line.match(/^(\d+)\./)?.[1] || '';
      parts.push(`<li class="flex items-start gap-3"><span class="text-vmTeal font-bold shrink-0">${num}.</span><span>${inline(line.replace(/^\d+\.\s+/, ''))}</span></li>`);
      continue;
    }
    closeList();
    parts.push(`<p class="text-slate-600 leading-relaxed my-3">${inline(line)}</p>`);
  }
  closeList();
  return DOMPurify.sanitize(parts.join(''));
}

interface LabError extends Error {
  capReached?: boolean;
}

async function postJson(url: string, body: unknown): Promise<any> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: LabError = new Error(data.error || 'Something went wrong. Try again.');
    err.capReached = !!data.capReached;
    throw err;
  }
  return data;
}

/* ── Speech-to-text (browser Web Speech API; hidden where unsupported) ── */

function getSpeechRecognition(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

function useSpeech(onText: (text: string) => void) {
  const recRef = useRef<any>(null);
  const onTextRef = useRef(onText);
  onTextRef.current = onText;
  const [listening, setListening] = useState(false);
  const supported = !!getSpeechRecognition();

  useEffect(() => () => { recRef.current?.stop?.(); }, []);

  const toggle = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = getSpeechRecognition();
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (ev: any) => {
      let text = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) text += ev.results[i][0].transcript;
      }
      if (text.trim()) onTextRef.current(text.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  return { supported, listening, toggle };
}

const MicButton: React.FC<{ onText: (t: string) => void; className?: string }> = ({ onText, className }) => {
  const { supported, listening, toggle } = useSpeech(onText);
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={listening ? 'Stop dictating' : 'Dictate instead of typing'}
      title={listening ? 'Stop dictating' : 'Talk instead of typing'}
      className={`shrink-0 w-10 h-10 rounded-sm border flex items-center justify-center transition-all ${
        listening
          ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
          : 'bg-white border-slate-200 text-slate-400 hover:text-vmNavy hover:border-vmNavy/40'
      } ${className || ''}`}
    >
      <Mic className="w-4 h-4" />
    </button>
  );
};

/* ── Cap-reached notice (conversion moment, not an error) ── */

const CapNotice: React.FC = () => (
  <div className="mt-4 bg-vmNavy/5 border border-vmNavy/15 rounded-sm p-5">
    <p className="text-sm text-vmNavy font-semibold mb-1">You've used today's bench time.</p>
    <p className="text-sm text-slate-600 leading-relaxed mb-4">
      The bench resets tomorrow — or skip the wait and see these tools uncapped,
      wired into your real phone line, calendar, and numbers.
    </p>
    <a href={BOOKING_URLS.BOOK} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm font-bold text-vmNavy hover:text-vmTeal transition-colors">
      Book your 20-minute discovery call <ArrowRight className="w-4 h-4" />
    </a>
  </div>
);

/* ── Live receptionist call card ── */

const ReceptionistCard: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <div className={`bg-vmNavy rounded-sm ${compact ? 'p-6' : 'p-6 md:p-8'} flex flex-col sm:flex-row sm:items-center gap-5`}>
    <div className="w-12 h-12 bg-vmTeal/15 rounded-sm flex items-center justify-center shrink-0">
      <Phone className="w-6 h-6 text-vmTeal" aria-hidden />
    </div>
    <div className="flex-grow">
      <h3 className="text-lg font-serif text-white">The AI Receptionist answers a real phone line.</h3>
      <p className="text-sm text-white/60 leading-relaxed mt-1">
        Don't chat with a demo — call it. Book an appointment, ask about prices,
        try your best to stump it. It's the same system answering for our client practices.
      </p>
    </div>
    <a
      href={`tel:${RECEPTIONIST_TEL}`}
      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-vmTeal text-vmNavy text-sm font-bold tracking-wide rounded-sm hover:bg-white transition-all duration-200 shrink-0"
    >
      <Phone className="w-4 h-4" /> {RECEPTIONIST_DISPLAY}
    </a>
  </div>
);

/* ── Intake form ─────────────────────────────────────────────── */

const IntakeForm: React.FC<{ onStarted: (s: Session) => void }> = ({ onStarted }) => {
  const [form, setForm] = useState({ name: '', email: '', website: '', phone: '' });
  const [showOptional, setShowOptional] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string) => (ev: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: ev.target.value }));

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { leadId, businessName, returning } = await postJson('/api/lab', { action: 'start', ...form });
      onStarted({ leadId, businessName, name: form.name, returning });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const field = 'w-full p-4 border border-slate-200 rounded-sm focus:border-vmNavy focus:outline-none transition-all bg-vmSlate/40 text-base';

  return (
    <Reveal className="max-w-xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-sm overflow-hidden">
      <div className="bg-vmNavy px-8 py-7 md:px-10">
        <h2 className="text-2xl font-serif text-white leading-snug">Two fields and you're in.</h2>
        <p className="text-white/60 text-sm mt-2 leading-relaxed">
          The tools research your business from your email and remember you when you
          come back — and your results get emailed to you as a designed report.
        </p>
      </div>
      <form onSubmit={submit} className="p-8 md:p-10 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="eyebrow text-vmNavy block mb-2">Name *</label>
            <input className={field} required value={form.name} onChange={set('name')} placeholder="Jordan Rivera" autoFocus />
          </div>
          <div>
            <label className="eyebrow text-vmNavy block mb-2">Email *</label>
            <input className={field} type="email" required value={form.email} onChange={set('email')} placeholder="you@yourbusiness.com" />
          </div>
        </div>

        {showOptional ? (
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="eyebrow text-vmNavy block mb-2">Website <span className="text-slate-300 normal-case">(optional)</span></label>
              <input className={field} value={form.website} onChange={set('website')} placeholder="yourbusiness.com" />
            </div>
            <div>
              <label className="eyebrow text-vmNavy block mb-2">Phone <span className="text-slate-300 normal-case">(optional)</span></label>
              <input className={field} type="tel" value={form.phone} onChange={set('phone')} placeholder="(555) 555-0100" />
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setShowOptional(true)} className="text-sm text-slate-400 hover:text-vmNavy transition-colors">
            + Add website or phone (optional — we'll read your website from a business email)
          </button>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className={buttonPrimary + ' w-full disabled:opacity-60'}>
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Start using the AI
        </button>
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          Free to use. No card, no call required.
        </p>
      </form>
    </Reveal>
  );
};

/* ── Chat panel (Deal Scout, and follow-up chat under each generator) ── */

const ChatTool: React.FC<{
  session: Session;
  toolKey: ToolKey;
  intro?: React.ReactNode;
  emptyHint: string;
  placeholder: string;
  seed?: string;
  compact?: boolean;
  busyHint?: string;
  /* Controlled mode: the parent owns the transcript (generator intake chats) */
  messages?: ChatMsg[];
  onMessagesChange?: (m: ChatMsg[]) => void;
  onRan: () => void;
  onBusyChange?: (busy: boolean) => void;
}> = ({ session, toolKey, intro, emptyHint, placeholder, seed, compact, busyHint, messages: controlled, onMessagesChange, onRan, onBusyChange }) => {
  const [internalMessages, setInternalMessages] = useState<ChatMsg[]>(
    seed ? [{ role: 'assistant', content: seed }] : []
  );
  const messages = controlled ?? internalMessages;
  const setMessages = (m: ChatMsg[]) => {
    if (onMessagesChange) onMessagesChange(m); else setInternalMessages(m);
  };
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [capped, setCapped] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  const send = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next: ChatMsg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    onBusyChange?.(true);
    setError('');
    try {
      const { reply } = await postJson('/api/lab', { action: 'chat', tool: toolKey, leadId: session.leadId, messages: next });
      setMessages([...next, { role: 'assistant', content: reply }]);
      onRan();
    } catch (err) {
      if ((err as LabError).capReached) {
        setCapped(true);
      } else {
        setError(err instanceof Error ? err.message : 'The agent dropped the call. Try again.');
      }
      setMessages(messages);
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  };

  return (
    <div>
      {intro && <p className="text-sm text-slate-500 leading-relaxed mb-5">{intro}</p>}
      <div ref={scrollRef} className={`${compact ? 'h-64' : 'h-96'} overflow-y-auto bg-vmSlate/40 border border-slate-200 rounded-sm p-4 space-y-3`}>
        {messages.length === 0 && (
          <p className={`text-sm text-slate-400 italic text-center ${compact ? 'mt-20' : 'mt-32'}`}>{emptyHint}</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] px-4 py-3 rounded-sm text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-vmNavy text-white' : 'bg-white border border-slate-200 text-slate-700'
            }`}>
              {m.role === 'assistant'
                ? <div className="chat-md" dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
                : m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-vmNavy" />
              {busyHint && <span className="text-xs text-slate-400">{busyHint}</span>}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {capped ? <CapNotice /> : (
        <form onSubmit={send} className="flex gap-3 mt-4">
          <input
            className="flex-grow p-4 border border-slate-200 rounded-sm focus:border-vmNavy focus:outline-none transition-all bg-white text-base"
            value={input}
            onChange={(ev) => setInput(ev.target.value)}
            placeholder={placeholder}
            maxLength={2000}
          />
          <MicButton onText={(t) => setInput((v) => (v ? v + ' ' : '') + t)} className="self-center w-12 h-12" />
          <button type="submit" disabled={busy || !input.trim()} className="px-6 bg-vmNavy text-white rounded-sm hover:shadow-lg transition-all disabled:opacity-40" aria-label="Send">
            <Send className="w-5 h-5" />
          </button>
        </form>
      )}
    </div>
  );
};

/* ── Generator tools (one-shot output + follow-up conversation) ── */

/* The big runs take 2-5 minutes server-side; the browser polls rather than
   holding a connection open, and these staged messages keep the wait honest */
const PROGRESS_STAGES: { at: number; msg: string }[] = [
  { at: 0, msg: 'Reading everything it knows about your business…' },
  { at: 15, msg: 'Researching your market — live web search…' },
  { at: 50, msg: 'Checking local competitors and real benchmarks…' },
  { at: 95, msg: 'Running the numbers — every figure shows its math…' },
  { at: 150, msg: 'Writing your walkthrough…' },
  { at: 210, msg: 'Editor pass — checking every number twice…' },
  { at: 260, msg: 'Almost there — formatting the final document…' },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* Opening messages for each tool's intake conversation — the advisor asks
   for real numbers instead of inferring them; Build works at any time */
const INTAKE_SEEDS: Record<GeneratorKey, string> = {
  deals: "Numbers first, magic second — I'd rather ask than guess at your business. **What do you sell, and what's a typical sale or job worth?** Rough is fine. A couple of quick questions and the audit gets built on your real numbers.",
  coach: "What's on your mind? Ask it the way you'd ask a $500-an-hour advisor — messy is fine. I'll come back with a couple of quick questions so my answer fits your actual numbers, not averages.",
  marketing: "Before I write a single word of copy: **what are you promoting right now, and who's the customer you wish you had more of?** The strategy comes from your answers, not a template.",
  leads: "Let's start with who's worth cloning. **Think of your best client — what made them great, and roughly what are they worth to you over a few years?** Ballpark is fine.",
};

const GeneratorTool: React.FC<{
  session: Session;
  tool: GeneratorKey;
  onRan: () => void;
  onBusyChange?: (busy: boolean) => void;
}> = ({ session, tool, onRan, onBusyChange }) => {
  const [output, setOutput] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [capped, setCapped] = useState(false);
  const [assetType, setAssetType] = useState(MARKETING_ASSETS[0].value);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: INTAKE_SEEDS[tool] },
  ]);

  const run = async () => {
    setBusy(true);
    onBusyChange?.(true);
    setError('');
    try {
      const input = {
        ...(tool === 'marketing' ? { assetType } : {}),
        transcript: messages.length > 1 ? messages : undefined,
      };
      const { runId } = await postJson('/api/lab', { action: 'generate', leadId: session.leadId, tool, input });

      const t0 = Date.now();
      // Poll up to 7 minutes; the server job itself is bounded well under that
      while (Date.now() - t0 < 7 * 60 * 1000) {
        const elapsed = (Date.now() - t0) / 1000;
        const stage = [...PROGRESS_STAGES].reverse().find((s) => elapsed >= s.at);
        setProgress(stage?.msg ?? PROGRESS_STAGES[0].msg);
        await sleep(4000);
        const poll = await postJson('/api/lab', { action: 'poll', leadId: session.leadId, runId });
        if (poll.status === 'done') {
          setOutput(poll.output);
          onRan();
          return;
        }
        if (poll.status === 'error') {
          setError(poll.error || 'Generation failed. Try again.');
          return;
        }
      }
      setError('This one ran long and timed out. Run it again — your inputs are saved.');
    } catch (err) {
      if ((err as LabError).capReached) {
        setCapped(true);
      } else {
        setError(err instanceof Error ? err.message : 'Generation failed. Try again.');
      }
    } finally {
      setBusy(false);
      setProgress('');
      onBusyChange?.(false);
    }
  };

  const intro: Record<GeneratorKey, string> = {
    deals: `Chat first — it asks for your real numbers instead of guessing, then builds the full audit for ${session.businessName}. After it's built, keep talking: corrections recalculate on the spot.`,
    coach: 'Chat like you would with a real coach — it asks the follow-ups your answer depends on, then builds the full walkthrough. Keep talking after: push back, adjust, refine.',
    marketing: 'Talk it through first — what you\'re promoting, who you want more of. The strategy gets built from your answers, not a template, and you can adjust it in the same conversation.',
    leads: `A quick conversation about who's worth pursuing, then the full playbook for ${session.businessName} — real named targets in your market. Corrections welcome after; it redoes the math live.`,
  };

  const buttonLabel: Record<GeneratorKey, string> = {
    deals: 'Find my hidden revenue',
    coach: 'Coach me',
    marketing: 'Build my strategy',
    leads: 'Build my lead playbook',
  };

  return (
    <div>
      <p className="text-sm text-slate-500 leading-relaxed mb-5">{intro[tool]}</p>

      {tool === 'marketing' && (
        <div className="mb-4">
          <label className="eyebrow text-vmNavy block mb-2">What do you need built?</label>
          <select
            className="w-full p-4 border border-slate-200 rounded-sm focus:border-vmNavy focus:outline-none bg-vmSlate/40 text-base"
            value={assetType}
            onChange={(ev) => setAssetType(ev.target.value)}
          >
            {MARKETING_ASSETS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </div>
      )}

      <ChatTool
        session={session}
        toolKey={tool}
        compact={!!output}
        emptyHint=""
        placeholder={output ? 'Correct a number, push back, or ask for more…' : 'Answer, or ask anything — talk or type…'}
        busyHint="Thinking — may check the web…"
        messages={messages}
        onMessagesChange={setMessages}
        onRan={onRan}
        onBusyChange={onBusyChange}
      />

      <div className="mt-5">
        {capped ? <CapNotice /> : (
          <>
            <button onClick={run} disabled={busy} className={buttonPrimary + ' disabled:opacity-60'}>
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {busy ? 'Building — takes a few minutes' : output ? 'Rebuild with what we discussed' : buttonLabel[tool]}
            </button>
            {busy && progress && (
              <p className="text-sm text-vmNavy/70 mt-3 italic transition-all">{progress}</p>
            )}
            {busy ? (
              <p className="text-xs text-slate-400 mt-1">
                Switch tools freely while this works — it keeps going in the background.
              </p>
            ) : !output && (
              <p className="text-xs text-slate-400 mt-2">
                The advisor will tell you when it has enough — or build now and it flags anything it had to assume.
              </p>
            )}
          </>
        )}
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      {output && (
        <div
          className="mt-8 pt-6 hairline border-t text-base"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(output) }}
        />
      )}
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────────────── */

const Workbench: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTool, setActiveTool] = useState<ToolKey>('deals');
  const [toolsRun, setToolsRun] = useState<Set<string>>(new Set());
  const [busyTools, setBusyTools] = useState<Set<string>>(new Set());
  const [reportState, setReportState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [reportError, setReportError] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSession(JSON.parse(saved));
    } catch { /* fresh session */ }
  }, []);

  // On page close, tell the server the visit ended so Suk gets one
  // consolidated summary email (the idle sweeper catches missed beacons)
  useEffect(() => {
    const endVisit = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        const { leadId } = JSON.parse(saved);
        if (!leadId) return;
        navigator.sendBeacon?.('/api/lab',
          new Blob([JSON.stringify({ action: 'end-visit', leadId })], { type: 'application/json' }));
      } catch { /* noop */ }
    };
    window.addEventListener('pagehide', endVisit);
    return () => window.removeEventListener('pagehide', endVisit);
  }, []);

  const start = (s: Session) => {
    setSession(s);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* private mode */ }
  };

  const reset = () => {
    setSession(null);
    setToolsRun(new Set());
    setBusyTools(new Set());
    setReportState('idle');
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  };

  const markRan = (tool: string) => setToolsRun((prev) => new Set(prev).add(tool));

  const setToolBusy = (tool: string) => (busy: boolean) =>
    setBusyTools((prev) => {
      const next = new Set(prev);
      if (busy) next.add(tool); else next.delete(tool);
      return next;
    });

  const sendReport = async () => {
    if (!session) return;
    setReportState('sending');
    setReportError('');
    try {
      await postJson('/api/lab-report', { leadId: session.leadId });
      setReportState('sent');
    } catch (err) {
      setReportError(err instanceof Error ? err.message : 'Could not send the report.');
      setReportState('error');
    }
  };

  return (
    <>
      <SEO
        title="The Workbench"
        description="Five live AI tools personalized to your business — a real-estate deal scout, a profit leak detector, a business coach, a marketing strategist, and a lead machine — plus an AI receptionist answering a real phone line. Your results emailed as a designed PDF."
        path="/lab/workbench"
      />
      <div className="pt-40 pb-24 min-h-screen light-wash" data-aesthetic="solar">
        <div className="max-w-7xl mx-auto px-6">

          <header className="mb-16 text-center max-w-3xl mx-auto">
            <Reveal>
              <Eyebrow className="text-accent mb-6">Lab 004 · Live now</Eyebrow>
              <h1 className="text-5xl md:text-6xl font-serif text-vmNavy mb-8 leading-tight italic">The Workbench.</h1>
              <p className="text-slate-600 text-xl leading-relaxed">
                Five working AI tools that research <em>your</em> business the moment you sit down —
                and remember you when you come back. Use them all, then we'll email you
                everything as a designed report.
              </p>
              <VineDivider className="mx-auto mt-10 text-accent" />
            </Reveal>
          </header>

          {!session ? (
            <div className="space-y-8">
              <IntakeForm onStarted={start} />
              <Reveal className="max-w-xl mx-auto">
                <ReceptionistCard compact />
              </Reveal>
            </div>
          ) : (
            <div className="space-y-10">

              {/* Bench header */}
              <Reveal className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="eyebrow text-accent mb-1">
                    {session.returning ? `Welcome back, ${session.name.split(' ')[0]}` : 'Bench configured for'}
                  </p>
                  <h2 className="text-2xl font-serif text-vmNavy">{session.businessName}</h2>
                </div>
                <button onClick={reset} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-vmNavy transition-colors">
                  <RotateCcw className="w-4 h-4" /> Different business
                </button>
              </Reveal>

              {/* Live receptionist line */}
              <Reveal>
                <ReceptionistCard />
              </Reveal>

              {/* Tool selector */}
              <Reveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {TOOLS.map((t) => {
                  const active = activeTool === t.key;
                  const ran = toolsRun.has(t.key);
                  const working = busyTools.has(t.key);
                  return (
                    <button
                      key={t.key}
                      onClick={() => setActiveTool(t.key)}
                      className={`p-4 rounded-sm border text-left transition-all ${
                        active
                          ? 'bg-vmNavy border-vmNavy text-white shadow-lg'
                          : 'bg-white border-slate-200 text-vmNavy hover:border-vmNavy/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <t.icon className={`w-5 h-5 ${active ? 'text-vmTeal' : 'text-accent'}`} aria-hidden />
                        {working
                          ? <Loader2 className={`w-4 h-4 animate-spin ${active ? 'text-vmTeal' : 'text-vmNavy/60'}`} aria-label="Working" />
                          : ran && <CheckCircle2 className={`w-4 h-4 ${active ? 'text-vmTeal' : 'text-vmLeaf'}`} aria-hidden />}
                      </div>
                      <p className="text-sm font-semibold leading-tight">{t.title}</p>
                    </button>
                  );
                })}
              </Reveal>

              {/* Tool panels — all stay mounted so switching tools never resets
                  state, and in-flight generations keep working in the background */}
              <Reveal className="bg-white border border-slate-200 shadow-2xl rounded-sm p-8 md:p-12">
                {TOOLS.map((tool) => (
                  <div key={tool.key} className={activeTool === tool.key ? '' : 'hidden'}>
                    <div className="flex items-center gap-4 pb-5 mb-6 hairline border-b">
                      <div className="w-10 h-10 bg-vmTeal/10 rounded-sm flex items-center justify-center text-vmNavy shrink-0">
                        <tool.icon className="w-6 h-6" aria-hidden />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif text-vmNavy">{tool.title}</h3>
                        <p className="text-xs text-slate-400">{tool.tagline}</p>
                      </div>
                    </div>
                    {tool.key === 'scout' ? (
                      <ChatTool
                        session={session}
                        toolKey="scout"
                        intro={<>AcquisitionScout hunts real property listings with live web search — distress signals, auction inventory, county lists. Answer its questions to build your buy-box, then send it hunting. Every lead cites its source; verify title and comps before any offer.</>}
                        emptyHint="The scout is ready to report in."
                        placeholder="Answer the scout, or change the mission…"
                        seed={SCOUT_SEED}
                        busyHint="Searching live listings — this can take up to a minute…"
                        onRan={() => markRan('scout')}
                        onBusyChange={setToolBusy('scout')}
                      />
                    ) : (
                      <GeneratorTool
                        session={session}
                        tool={tool.key as GeneratorKey}
                        onRan={() => markRan(tool.key)}
                        onBusyChange={setToolBusy(tool.key)}
                      />
                    )}
                  </div>
                ))}
              </Reveal>

              {/* Report CTA */}
              <Reveal className="bg-vmNavy rounded-sm p-8 md:p-12 text-center">
                <Mail className="w-8 h-8 text-vmTeal mx-auto mb-4" aria-hidden />
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">Take it all with you.</h3>
                <p className="text-white/60 max-w-xl mx-auto mb-8 leading-relaxed">
                  {toolsRun.size === 0
                    ? 'Run at least one tool, and we’ll compile everything the AI built for you into a designed PDF report, delivered to your inbox.'
                    : `${toolsRun.size} of ${TOOLS.length} tools used. We’ll compile everything into a designed PDF report and email it to you.`}
                </p>
                {reportState === 'sent' ? (
                  <p className="inline-flex items-center gap-2 text-vmTeal font-semibold">
                    <CheckCircle2 className="w-5 h-5" /> Report sent — check your inbox.
                  </p>
                ) : (
                  <button
                    onClick={sendReport}
                    disabled={reportState === 'sending' || toolsRun.size === 0}
                    className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-vmTeal text-vmNavy text-sm font-bold tracking-wide rounded-sm hover:bg-white transition-all duration-200 disabled:opacity-40"
                  >
                    {reportState === 'sending' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                    {reportState === 'sending' ? 'Building your report…' : 'Email me my report'}
                  </button>
                )}
                {reportState === 'error' && <p className="text-sm text-red-300 mt-3">{reportError}</p>}
              </Reveal>

              {/* Honest framing + booking CTA */}
              <Reveal className="text-center pt-6">
                <div className="flex items-start gap-3 max-w-xl mx-auto text-left mb-10">
                  <LeafMark className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Everything above was generated from the few details you typed in, plus
                    what the AI could research and remember. Installed in your business —
                    connected to your real phone line, calendar, and numbers — this is
                    what runs every day.
                  </p>
                </div>
                <a href={BOOKING_URLS.BOOK} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
                  Book your 20-minute discovery call <ArrowRight className="w-4 h-4" />
                </a>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Workbench;
