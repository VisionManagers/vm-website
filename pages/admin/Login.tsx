import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { IMAGES } from '../../constants';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  if (user) {
    navigate('/admin/posts', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin/posts');
    }
  };

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src={IMAGES.LOGO_CIRCLE} alt="VM" className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-vmNavy">Admin Access</h1>
          <p className="text-slate-400 text-sm mt-2">Vision Managers content management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-sm flex items-start gap-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-sm focus:border-vmTeal focus:ring-1 focus:ring-vmTeal focus:outline-none transition-all text-sm"
              placeholder="admin@visionmanagers.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-vmNavy uppercase tracking-[0.2em] block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-sm focus:border-vmTeal focus:ring-1 focus:ring-vmTeal focus:outline-none transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
