import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText, ClipboardList, PenTool, CheckCircle2, Loader2, Send } from 'lucide-react';
import { getPublishedPosts } from '../lib/posts';
import type { InsightPost } from '../types';
import type { LucideIcon } from 'lucide-react';

const TYPE_ICONS: Record<string, LucideIcon> = {
  Brief: FileText,
  Notes: PenTool,
  Memo: ClipboardList,
};

const TYPE_LABELS: Record<string, string> = {
  Brief: 'Executive Brief',
  Notes: 'Field Notes',
  Memo: '1-Page Memo',
};

const Insights: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [posts, setPosts] = useState<InsightPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const webhookUrl = 'https://services.leadconnectorhq.com/hooks/q4adJN1peFzHlHvxv37q/webhook-trigger/5f2a6926-db9d-45df-bc6f-2bc97f872458';
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'Executive Brief Signup',
          submittedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Failed to join briefing');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('There was an issue joining the briefing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).toUpperCase();
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-serif text-vmNavy mb-8 leading-tight">Thinking for the <br /><span className="italic">Verifiable Enterprise.</span></h1>
            <p className="text-xl text-slate-600 font-light">Grounding AI in operational reality. Precise, executive-level intelligence.</p>
          </div>
          <div className="hidden md:block">
            <div className="flex gap-2 mb-2">
              {[...Array(30)].map((_, i) => <div key={i} className="w-[2px] h-10 bg-vmSlate group-hover:bg-vmTeal transition-colors" />)}
            </div>
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">Thought Leadership Archive</span>
          </div>
        </header>

        {/* Digest CTA */}
        <Link
          to="/insights/digest"
          className="block mb-16 p-8 bg-vmNavy rounded-sm text-white hover:bg-vmNavy/90 transition-colors group"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-vmTeal font-black text-[10px] uppercase tracking-widest mb-2 block">New Tool</span>
              <h3 className="text-2xl font-serif italic">AI Intelligence Digest</h3>
              <p className="text-slate-300 mt-2 text-sm">Generate a real-time executive briefing powered by AI web research.</p>
            </div>
            <span className="inline-flex items-center gap-2 text-vmTeal font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all shrink-0">
              Try it now <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {loading ? (
          <div className="space-y-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="grid md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-3">
                    <div className="h-4 bg-slate-100 rounded w-24 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-16" />
                  </div>
                  <div className="md:col-span-7">
                    <div className="h-6 bg-slate-100 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                    <div className="h-4 bg-slate-100 rounded w-2/3 mb-6" />
                    <div className="h-4 bg-slate-100 rounded w-28" />
                  </div>
                </div>
                <div className="h-[1px] w-full bg-slate-100 mt-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {posts.map((post) => {
              const Icon = TYPE_ICONS[post.post_type] || FileText;
              const typeLabel = TYPE_LABELS[post.post_type] || post.post_type;
              return (
                <div key={post.id} className="group">
                  <Link to={`/insights/${post.slug}`} className="grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-3">
                       <div className="flex items-center gap-3 mb-2">
                         <Icon className="w-4 h-4 text-vmTeal" />
                         <span className="text-xs font-bold text-vmTeal uppercase tracking-widest">{typeLabel}</span>
                       </div>
                       <span className="text-[10px] text-slate-400 font-bold">{formatDate(post.published_at)}</span>
                    </div>
                    <div className="md:col-span-7">
                      <h2 className="text-2xl font-serif text-vmNavy mb-4 group-hover:text-vmTeal transition-colors">{post.title}</h2>
                      <p className="text-slate-600 leading-relaxed mb-6">{post.summary}</p>
                      <span className="inline-flex items-center gap-2 text-vmNavy font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                        Read the brief <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                  <div className="h-[1px] w-full bg-slate-100 mt-16" />
                </div>
              );
            })}
          </div>
        )}

        <section className="mt-32 p-12 bg-vmSlate rounded-sm text-center">
          <h3 className="text-3xl font-serif text-vmNavy mb-6">Receive the Executive Brief.</h3>
          <p className="text-slate-600 mb-10 max-w-lg mx-auto">Calibrated monthly insights delivered directly to your inbox. No noise.</p>

          <div className="max-w-md mx-auto">
            {submitted ? (
              <div className="bg-white p-8 rounded-sm shadow-xl flex flex-col items-center animate-in zoom-in-95 duration-300">
                <CheckCircle2 className="w-12 h-12 text-vmTeal mb-4" />
                <h4 className="text-vmNavy font-serif text-xl mb-2">Confirmed.</h4>
                <p className="text-slate-500 text-sm">Welcome to the archive.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  required
                  type="email"
                  placeholder="executive@company.com"
                  className="flex-grow p-5 border border-slate-200 outline-none focus:border-vmTeal rounded-sm text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  disabled={isSubmitting}
                  className="px-8 py-5 bg-vmNavy text-white font-bold uppercase tracking-widest text-[10px] rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all min-w-[160px] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Join Briefing <Send className="w-3 h-3" /></>}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Insights;
