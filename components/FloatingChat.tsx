
import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-vmNavy p-6 text-white flex justify-between items-center">
            <div>
              <h4 className="font-bold text-lg">VM Advisor</h4>
              <p className="text-xs text-vmTeal flex items-center gap-1.5">
                <span className="w-2 h-2 bg-vmTeal rounded-full animate-pulse" />
                Operational Specialist Online
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-vmSlate/30">
            <div className="bg-white p-4 rounded-lg rounded-tl-none shadow-sm text-sm text-slate-700 border border-slate-100 max-w-[85%]">
              Hello. I'm an Operational AI specialist. How can I help you navigate your transition to high-trust autonomous systems?
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Type your query..." 
                className="w-full py-3 px-4 bg-vmSlate rounded-full outline-none pr-12 text-sm focus:ring-1 focus:ring-vmTeal"
              />
              <button className="absolute right-2 top-1.5 p-1.5 bg-vmNavy text-white rounded-full hover:bg-vmTeal transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-vmNavy text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-vmTeal hover:text-vmNavy transition-all group relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vmTeal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-vmTeal"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingChat;
