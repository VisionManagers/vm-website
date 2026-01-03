
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Home from './pages/Home';
import StartHere from './pages/StartHere';
import Solutions from './pages/Solutions';
import TheLab from './pages/TheLab';
import Insights from './pages/Insights';
import SovereignIntelligence from './pages/insights/SovereignIntelligence';
import LegalAIDeployment from './pages/insights/LegalAIDeployment';
import BottlenecksROI from './pages/insights/BottlenecksROI';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingChat from './components/FloatingChat';

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/start" element={<StartHere />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/lab" element={<TheLab />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/sovereign-intelligence" element={<SovereignIntelligence />} />
            <Route path="/insights/legal-ai-deployment" element={<LegalAIDeployment />} />
            <Route path="/insights/bottlenecks-roi" element={<BottlenecksROI />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <Footer />
        
        {/* Persistent Floating Chat CTA */}
        <FloatingChat />
        
        {/* Vercel Web Analytics */}
        <Analytics />
      </div>
    </Router>
  );
};

export default App;
