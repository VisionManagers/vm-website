import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../../components/SEO';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { getPostBySlug } from '../../lib/posts';
import { getIcon } from '../../lib/icons';
import type { InsightPost } from '../../types';

const POST_TYPE_LABELS: Record<string, string> = {
  Brief: 'Executive Brief',
  Notes: 'Field Notes',
  Memo: '1-Page Memo',
};

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<InsightPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPostBySlug(slug)
      .then((data) => {
        if (!data) setError(true);
        setPost(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 px-6 min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-vmTeal animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-serif text-vmNavy mb-6">Post not found.</h1>
          <p className="text-slate-500 mb-8">The article you're looking for doesn't exist or has been unpublished.</p>
          <Link to="/insights" className="inline-flex items-center gap-2 text-vmNavy font-bold text-sm uppercase tracking-widest hover:text-vmTeal transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
    : '';

  const CtaIcon = getIcon(post.cta_icon);
  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <>
    <SEO
      title={post.title}
      description={post.summary || `${post.title} — Vision Managers Insights`}
      path={`/insights/${post.slug}`}
      type="article"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.summary || post.title,
        url: `https://visionmanagers.com/insights/${post.slug}`,
        datePublished: post.published_at || undefined,
        publisher: { '@type': 'Organization', name: 'Vision Managers' },
      }}
    />
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/insights" className="inline-flex items-center gap-2 text-slate-400 hover:text-vmNavy transition-colors mb-12 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Insights
        </Link>

        <header className="mb-16">
          <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">
            {POST_TYPE_LABELS[post.post_type] || post.post_type}
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-vmNavy mb-8 leading-tight">{post.title}</h1>
          <p className="text-xl text-slate-500 font-light italic">Published {publishedDate}</p>
        </header>

        <article
          className="vm-article"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* CTA Section */}
        {post.cta_heading && post.cta_button_text && post.cta_button_link && (
          post.cta_style === 'navy' ? (
            <div className="mt-24 p-12 bg-vmNavy text-white rounded-sm text-center relative overflow-hidden group">
              <div className="relative z-10">
                {CtaIcon && <CtaIcon className="w-12 h-12 text-vmTeal mx-auto mb-8" />}
                <h3 className="text-3xl font-serif mb-6 italic">{post.cta_heading}</h3>
                <p className="text-slate-300 mb-10 max-w-xl mx-auto">{post.cta_body}</p>
                <Link
                  to={post.cta_button_link}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-vmTeal text-vmNavy font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white transition-all group/btn"
                >
                  {post.cta_button_text} <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rotate-45 transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ) : (
            <div className="mt-24 p-12 bg-vmSlate border border-slate-100 rounded-sm text-center">
              {CtaIcon && (
                <div className="w-16 h-16 bg-vmTeal/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CtaIcon className="w-8 h-8 text-vmTeal" />
                </div>
              )}
              <h3 className="text-3xl font-serif text-vmNavy mb-6 italic">{post.cta_heading}</h3>
              <p className="text-slate-600 mb-10 max-w-xl mx-auto">{post.cta_body}</p>
              <Link
                to={post.cta_button_link}
                className="inline-flex items-center gap-3 px-10 py-5 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all group"
              >
                {post.cta_button_text} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )
        )}
      </div>
    </div>
    </>
  );
};

export default PostDetail;
