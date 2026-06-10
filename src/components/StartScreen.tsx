import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Users, Globe, ChevronRight, BookOpen } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  onPedagogy: () => void;
  onOpenBriefing: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onPedagogy, onOpenBriefing }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col p-8 md:p-20 overflow-hidden relative selection:bg-indigo-500">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/20 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[160px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
        
        {/* Floating "Agents" - Decorative elements for free-ness */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[15%] w-32 h-32 border border-white/5 bg-white/[0.02] rounded-full backdrop-blur-3xl" 
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[10%] w-48 h-48 border border-white/5 bg-white/[0.01] rounded-[3rem] backdrop-blur-2xl" 
        />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Header / Branding */}
      <header className="relative z-10 flex justify-end items-start mb-24">
        <div className="flex gap-4">
          <button 
            onClick={onOpenBriefing}
            className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all text-white/70 hover:text-white"
          >
            <Globe size={16} className="text-indigo-400 group-hover:rotate-45 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Briefing</span>
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex-grow flex flex-col justify-center max-w-7xl mx-auto w-full pb-12">
        <div className="max-w-4xl space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-8 text-white">
              Agentic<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">Boardroom</span>
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">Governance Strategy Simulation</p>
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed">
              Navigate the 3-year horizon of autonomous transformation.
              A strategic laboratory for executive leadership in the agentic era.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-8 items-center"
          >
            <button
              onClick={onStart}
              className="group relative bg-white text-slate-900 px-12 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] active:scale-95 flex items-center justify-center gap-4 w-full sm:w-auto"
            >
              Enter Simulation
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-8 py-2 text-slate-500">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Time Horizon</p>
                <p className="text-sm font-bold text-slate-300">12 Quarters</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Context</p>
                <p className="text-sm font-bold text-slate-300">Strategy & Ethics</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Information Bar */}
      <footer className="relative z-10 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 pt-8 border-t border-white/5">
        <div>Research and Development by Somendra Narayan</div>
        <div className="flex gap-8">
          <span className="text-slate-400 hover:text-indigo-400 transition-colors">Governance Lab</span>
        </div>
      </footer>
    </div>
  );
};
