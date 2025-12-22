
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import StartHere from './StartHere';
import Solutions from './Solutions';
import TheLab from './TheLab';
import Insights from './Insights';
import SovereignIntelligence from './insights/SovereignIntelligence';
import LegalAIDeployment from './insights/LegalAIDeployment';
import BottlenecksROI from './insights/BottlenecksROI';
import Contact from './Contact';
import PrivacyPolicy from './PrivacyPolicy';
import About from './About';
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
      </div>
    </Router>
  );
};

export default App;
