import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import StartHere from './pages/StartHere';
import Solutions from './pages/Solutions';
import TheLab from './pages/TheLab';
import Insights from './pages/Insights';
import PostDetail from './pages/insights/PostDetail';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import AIVoice from './pages/AIVoice';
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy-load admin routes (no admin JS shipped to public visitors)
const AdminLogin = React.lazy(() => import('./pages/admin/Login'));
const AdminPostList = React.lazy(() => import('./pages/admin/PostList'));
const AdminPostEditor = React.lazy(() => import('./pages/admin/PostEditor'));
const AdminDigestSettings = React.lazy(() => import('./pages/admin/DigestSettings'));

// Lazy-load digest page
const Digest = React.lazy(() => import('./pages/insights/Digest'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen relative">
        <Header />

        <main className="flex-grow">
          <React.Suspense fallback={
            <div className="pt-40 pb-20 px-6 min-h-screen bg-white flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-vmTeal border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/start" element={<StartHere />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/lab" element={<TheLab />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/insights/digest" element={<Digest />} />
              <Route path="/insights/:slug" element={<PostDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/about" element={<About />} />
              <Route path="/ai-voice" element={<AIVoice />} />

              {/* Admin routes — no public nav links */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/posts" element={<AdminPostList />} />
              <Route path="/admin/posts/new" element={<AdminPostEditor />} />
              <Route path="/admin/posts/:id" element={<AdminPostEditor />} />
              <Route path="/admin/digest-settings" element={<AdminDigestSettings />} />
            </Routes>
          </React.Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
