import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, FileText, Settings } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 fixed top-[72px] left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin/posts" className="flex items-center gap-2 text-vmNavy font-bold text-sm uppercase tracking-widest">
              <FileText className="w-4 h-4" /> Posts
            </Link>
            <Link to="/admin/digest-settings" className="flex items-center gap-2 text-vmNavy font-bold text-sm uppercase tracking-widest">
              <Settings className="w-4 h-4" /> Digest
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
      <div className="pt-14">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
