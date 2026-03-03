import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2, Eye, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import TipTapEditor from '../../components/admin/TipTapEditor';

const ICON_OPTIONS = ['Shield', 'ShieldCheck', 'Zap', 'TrendingUp', 'BarChart3', 'FileText', 'PenTool', 'ClipboardList'];
const CTA_STYLES = ['navy', 'slate'];
const POST_TYPES = ['Brief', 'Memo', 'Notes'];

const PostEditorInner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = !id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<string>('Brief');
  const [published, setPublished] = useState(false);

  // CTA fields
  const [ctaIcon, setCtaIcon] = useState('');
  const [ctaHeading, setCtaHeading] = useState('');
  const [ctaBody, setCtaBody] = useState('');
  const [ctaButtonText, setCtaButtonText] = useState('');
  const [ctaButtonLink, setCtaButtonLink] = useState('');
  const [ctaStyle, setCtaStyle] = useState('navy');

  useEffect(() => {
    if (!isNew && id) {
      supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            navigate('/admin/posts');
            return;
          }
          setTitle(data.title);
          setSlug(data.slug);
          setSummary(data.summary || '');
          setContent(data.content || '');
          setPostType(data.post_type || 'Brief');
          setPublished(data.published || false);
          setCtaIcon(data.cta_icon || '');
          setCtaHeading(data.cta_heading || '');
          setCtaBody(data.cta_body || '');
          setCtaButtonText(data.cta_button_text || '');
          setCtaButtonLink(data.cta_button_link || '');
          setCtaStyle(data.cta_style || 'navy');
          setLoading(false);
        });
    }
  }, [id, isNew, navigate]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async (andPublish?: boolean) => {
    if (!title.trim() || !slug.trim()) {
      alert('Title and slug are required.');
      return;
    }

    setSaving(true);
    const shouldPublish = andPublish !== undefined ? andPublish : published;

    const postData = {
      title,
      slug,
      summary,
      content,
      post_type: postType,
      published: shouldPublish,
      published_at: shouldPublish ? new Date().toISOString() : null,
      author_id: user?.id,
      cta_icon: ctaIcon || null,
      cta_heading: ctaHeading || null,
      cta_body: ctaBody || null,
      cta_button_text: ctaButtonText || null,
      cta_button_link: ctaButtonLink || null,
      cta_style: ctaStyle || null,
    };

    let error;
    if (isNew) {
      const result = await supabase.from('posts').insert(postData).select().single();
      error = result.error;
      if (!error && result.data) {
        navigate(`/admin/posts/${result.data.id}`, { replace: true });
      }
    } else {
      const result = await supabase.from('posts').update(postData).eq('id', id);
      error = result.error;
    }

    if (error) {
      alert(`Error saving: ${error.message}`);
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!id || !confirm('Delete this post? This cannot be undone.')) return;
    await supabase.from('posts').delete().eq('id', id);
    navigate('/admin/posts');
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
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/admin/posts')} className="inline-flex items-center gap-2 text-slate-400 hover:text-vmNavy text-xs font-bold uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Posts
          </button>
          <div className="flex items-center gap-3">
            {!isNew && (
              <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-vmNavy font-bold uppercase tracking-widest text-xs rounded-sm hover:border-vmTeal transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main editor column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-sm focus:border-vmTeal focus:ring-1 focus:ring-vmTeal focus:outline-none transition-all text-xl font-serif"
                placeholder="Post title..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className="w-full p-4 border border-slate-200 rounded-sm focus:border-vmTeal focus:ring-1 focus:ring-vmTeal focus:outline-none transition-all text-sm resize-none"
                placeholder="Brief summary for the listing card..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Content</label>
              <TipTapEditor content={content} onChange={setContent} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-5">
              <h3 className="text-sm font-bold text-vmNavy uppercase tracking-widest">Post Settings</h3>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-sm focus:border-vmTeal focus:outline-none transition-all text-sm"
                  placeholder="post-slug"
                />
                <p className="text-[10px] text-slate-400">/insights/{slug || '...'}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Type</label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-sm focus:border-vmTeal focus:outline-none transition-all text-sm"
                >
                  {POST_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 accent-vmTeal"
                />
                <label htmlFor="published" className="text-sm text-vmNavy font-medium">Published</label>
              </div>
            </div>

            {/* CTA config */}
            <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-5">
              <h3 className="text-sm font-bold text-vmNavy uppercase tracking-widest">CTA Section</h3>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Icon</label>
                <select
                  value={ctaIcon}
                  onChange={(e) => setCtaIcon(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-sm focus:border-vmTeal focus:outline-none transition-all text-sm"
                >
                  <option value="">None</option>
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Heading</label>
                <input
                  type="text"
                  value={ctaHeading}
                  onChange={(e) => setCtaHeading(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-sm focus:border-vmTeal focus:outline-none transition-all text-sm"
                  placeholder="CTA heading..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Body</label>
                <textarea
                  value={ctaBody}
                  onChange={(e) => setCtaBody(e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-slate-200 rounded-sm focus:border-vmTeal focus:outline-none transition-all text-sm resize-none"
                  placeholder="CTA description..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Button Text</label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={(e) => setCtaButtonText(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-sm focus:border-vmTeal focus:outline-none transition-all text-sm"
                  placeholder="Button label..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Button Link</label>
                <input
                  type="text"
                  value={ctaButtonLink}
                  onChange={(e) => setCtaButtonLink(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-sm focus:border-vmTeal focus:outline-none transition-all text-sm"
                  placeholder="/start"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Style</label>
                <select
                  value={ctaStyle}
                  onChange={(e) => setCtaStyle(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-sm focus:border-vmTeal focus:outline-none transition-all text-sm"
                >
                  {CTA_STYLES.map((s) => (
                    <option key={s} value={s}>{s === 'navy' ? 'Navy (dark bg)' : 'Slate (light bg)'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const PostEditor: React.FC = () => (
  <ProtectedRoute>
    <PostEditorInner />
  </ProtectedRoute>
);

export default PostEditor;
