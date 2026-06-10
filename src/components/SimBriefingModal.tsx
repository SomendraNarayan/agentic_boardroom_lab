import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Map, 
  Target, 
  Activity, 
  BookOpen, 
  ChevronRight, 
  Layers,
  GraduationCap,
  Globe,
  Clock
} from 'lucide-react';
import { GameState } from '../types';

interface SimBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
}

export const SimBriefingModal: React.FC<SimBriefingModalProps> = ({ isOpen, onClose, state }) => {
  const { currentRound, marketShare, variables } = state;
  const totalRounds = 12; // 3 years * 4 quarters
  const progress = (currentRound / totalRounds) * 100;

  const currentFocus = currentRound <= 4 
    ? { title: "Foundational Scaling", goal: "Alignment & Infrastructure", skill: "Strategic Alignment" }
    : currentRound <= 8 
      ? { title: "Operational Complexity", goal: "Risk & Hallucination Management", skill: "Systems Thinking" }
      : { title: "Agentic Dominance", goal: "Ethical Oversight & Legacy", skill: "Agile Governance" };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                  <Map size={20} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Strategic Oversight</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {/* Mission Summary */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                  <Target size={14} /> Mission Protocol
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  You are leading a high-stakes digital transformation, deploying autonomous agents across a critical infrastructure firm. Your success depends on balancing <span className="text-slate-900 font-bold">Performance</span> with <span className="text-slate-900 font-bold">Governance Maturity</span>.
                </p>
              </section>

              {/* Progress Tracker */}
              <section className="space-y-6">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-2"><Clock size={14} /> Temporal Progress</div>
                  <span>Year {Math.ceil(currentRound / 4)} of 3</span>
                </div>
                
                <div className="relative pt-2">
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                    />
                  </div>
                  <div className="flex justify-between mt-4">
                    {[1, 4, 8, 12].map(r => (
                      <div key={r} className="flex flex-col items-center">
                        <div className={`w-1.5 h-1.5 rounded-full mb-1 ${currentRound >= r ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                        <span className="text-[9px] font-black text-slate-400 uppercase">Q{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Current Phase: {currentFocus.title}</p>
                  <p className="text-xs font-bold text-slate-700">{currentFocus.goal}</p>
                </div>
              </section>

              {/* Learning Objectives */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <GraduationCap size={14} /> Pedagogical Alignment
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600"><Layers size={16} /></div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase mb-1">Active Objective</p>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">
                        Mastering {currentFocus.skill} — navigating the trade-offs between rapid agent deployment and institutional safety.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600"><Globe size={16} /></div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase mb-1">Global Impact</p>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">
                        Currently controlling {marketShare}% of the sector. Every decision influences the broader ecosystem's trust in AI.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Knowledge Links */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button 
                  onClick={onClose}
                  className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Resume Sim</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col justify-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
                  <p className="text-xs font-black text-slate-900 mt-1">Authorized</p>
                </div>
              </div>
            </div>

            {/* Footer Branding */}
            <div className="p-8 border-t border-slate-100 bg-slate-50">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amsterdam Digital Transformation Lab</p>
                <p className="text-xs font-black text-slate-900">Dr. Somendra Narayan • Amsterdam Business School</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
