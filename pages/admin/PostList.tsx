import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import type { InsightPost } from '../../types';

const PostListInner: React.FC = () => {
  const [posts, setPosts] = useState<InsightPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data as InsightPost[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  };

  const togglePublish = async (id: string, currentlyPublished: boolean) => {
    await supabase.from('posts').update({
      published: !currentlyPublished,
      published_at: !currentlyPublished ? new Date().toISOString() : null,
    }).eq('id', id);
    fetchPosts();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-vmNavy">Posts</h1>
          <Link
            to="/admin/posts/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all"
          >
            <Plus className="w-4 h-4" /> New Post
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 text-vmTeal animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg mb-4">No posts yet.</p>
            <Link to="/admin/posts/new" className="text-vmTeal font-bold text-sm uppercase tracking-widest hover:underline">
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-[10px] font-black text-vmNavy uppercase tracking-widest p-4">Title</th>
                  <th className="text-left text-[10px] font-black text-vmNavy uppercase tracking-widest p-4 hidden md:table-cell">Type</th>
                  <th className="text-left text-[10px] font-black text-vmNavy uppercase tracking-widest p-4 hidden md:table-cell">Status</th>
                  <th className="text-left text-[10px] font-black text-vmNavy uppercase tracking-widest p-4 hidden md:table-cell">Date</th>
                  <th className="text-right text-[10px] font-black text-vmNavy uppercase tracking-widest p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/admin/posts/${post.id}`)}
                        className="text-vmNavy font-medium hover:text-vmTeal transition-colors text-left"
                      >
                        {post.title}
                      </button>
                      <p className="text-xs text-slate-400 mt-1">/{post.slug}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-xs font-bold text-vmTeal uppercase tracking-widest">{post.post_type}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${post.published ? 'text-green-600' : 'text-slate-400'}`}>
                        {post.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-500 hidden md:table-cell">
                      {formatDate(post.published_at || post.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => togglePublish(post.id, post.published)}
                          className="p-2 text-slate-400 hover:text-vmTeal transition-colors"
                          title={post.published ? 'Unpublish' : 'Publish'}
                        >
                          {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => navigate(`/admin/posts/${post.id}`)}
                          className="p-2 text-slate-400 hover:text-vmNavy transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePost(post.id, post.title)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const PostList: React.FC = () => (
  <ProtectedRoute>
    <PostListInner />
  </ProtectedRoute>
);

export default PostList;
