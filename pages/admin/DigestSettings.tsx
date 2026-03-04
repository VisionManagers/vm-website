import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/ProtectedRoute';

const DigestSettingsInner: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [rowId, setRowId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('digest_settings')
      .select('id, prompt')
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setPrompt(data.prompt);
          setRowId(data.id);
        } else if (error) {
          console.error('Failed to load digest settings:', error.message);
        }
        setLoading(false);
      });
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!prompt.trim()) {
      showToast('error', 'Prompt cannot be empty.');
      return;
    }

    setSaving(true);

    if (rowId) {
      const { error } = await supabase
        .from('digest_settings')
        .update({ prompt, updated_at: new Date().toISOString() })
        .eq('id', rowId);

      if (error) {
        showToast('error', `Save failed: ${error.message}`);
      } else {
        showToast('success', 'Digest prompt saved.');
      }
    } else {
      const { data, error } = await supabase
        .from('digest_settings')
        .insert({ prompt })
        .select()
        .single();

      if (error) {
        showToast('error', `Save failed: ${error.message}`);
      } else {
        setRowId(data.id);
        showToast('success', 'Digest prompt saved.');
      }
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-vmTeal animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/posts')}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-vmNavy text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Prompt
          </button>
        </div>

        <h1 className="text-3xl font-serif text-vmNavy mb-2 italic">Digest Settings</h1>
        <p className="text-slate-400 text-sm mb-8">
          Edit the system prompt used to generate the AI Intelligence Digest. Changes take effect on the next generation — no deploy needed.
        </p>

        {/* Prompt editor */}
        <div className="space-y-2 mb-8">
          <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">
            System Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={24}
            className="w-full p-4 border border-slate-200 rounded-sm focus:border-vmTeal focus:ring-1 focus:ring-vmTeal focus:outline-none transition-all text-sm font-mono leading-relaxed resize-y bg-white"
            placeholder="Enter the digest system prompt..."
          />
        </div>

        {/* Post-processing info box */}
        <div className="bg-slate-50 border border-slate-200 rounded-sm p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-vmTeal shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-vmNavy uppercase tracking-widest mb-3">
                Post-Processing Applied After Generation
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                The following formatting is automatically applied to the digest output before display. You don't need to account for these in your prompt — they happen after.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-vmTeal mt-1 shrink-0">&bull;</span>
                  <span>Numbered citation references like <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">[1]</code>, <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">[2]</code> are stripped from the text</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-vmTeal mt-1 shrink-0">&bull;</span>
                  <span>Orphaned punctuation at the start of lines is cleaned up</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-vmTeal mt-1 shrink-0">&bull;</span>
                  <span>Markdown headings (<code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">##</code>, <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">###</code>) are converted to styled HTML</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-vmTeal mt-1 shrink-0">&bull;</span>
                  <span>Markdown links, <strong>bold</strong>, and <em>italic</em> are converted to styled HTML</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-vmTeal mt-1 shrink-0">&bull;</span>
                  <span>Bullet and numbered lists get VM-branded styling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-vmTeal mt-1 shrink-0">&bull;</span>
                  <span>Lines starting with <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">Source:</code> are styled as small, muted text</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Toast notification */}
        {toast && (
          <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-sm shadow-lg text-sm font-medium transition-all z-50 ${
            toast.type === 'success'
              ? 'bg-vmNavy text-white'
              : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-vmTeal" />}
            {toast.message}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const DigestSettings: React.FC = () => (
  <ProtectedRoute>
    <DigestSettingsInner />
  </ProtectedRoute>
);

export default DigestSettings;
