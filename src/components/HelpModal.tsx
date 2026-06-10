import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Shield, Zap, Users, BarChart3, Info } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 text-white rounded-xl">
                  <HelpCircle size={20} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Executive Help Desk</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-8">
              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Info size={16} className="text-slate-900" /> Executive Summary
                </h3>
                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                  <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                    Welcome to the **Agentic Boardroom**. You are leading a firm through the "Agentic Turn"—the shift from software that <span className="italic">assists</span> humans to autonomous agents that <span className="italic">act</span> on their behalf. 
                    <br /><br />
                    Your mission is to maintain a high-growth firm across 12 simulated quarters. You must balance aggressive **Performance** with robust **Governance**. If your performance outpaces your governance for too long, you risk a "Systemic Crisis" that could collapse your firm's market value.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <BarChart3 size={16} className="text-slate-900" /> Core Indicators
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-black text-slate-900 mb-1">Performance</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Your "engine." It measures how fast and efficiently your agents work. Drives market share.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-black text-slate-900 mb-1">Trust & Compliance</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Your "brakes." Trust measures workforce and public legitimacy; Compliance measures legal alignment.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-black text-slate-900 mb-1">Auditability</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">The "glass." How well can you explain <span className="italic">why</span> an agent made a decision? Critical for safety.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-black text-slate-900 mb-1">Political Capital</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Your currency. Complex or unpopular decisions consume capital; high trust builds it back.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Zap size={16} className="text-slate-900" /> The Loop (How to Play)
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs">1</div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Review Your Dashboard</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">Analyze market trends, your firm's stats, and active crises from the previous quarter.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs">2</div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Strategy Table</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">Consider the tradeoffs for each quarterly agenda item. Read advice from your C-Suite before deciding.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs">3</div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Feedback Loop</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">Observe how your variables shift and read reflections on how your choices impacted the firm's culture.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Shield size={16} className="text-slate-900" /> Governance Glossary
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { term: "Agentic Autonomy", desc: "The degree of independent decision-making power granted to an AI agent." },
                    { term: "Algorithmic Bias", desc: "Systematic and repeatable errors in a computer system that create unfair outcomes." },
                    { term: "Human-in-the-Loop (HITL)", desc: "A requirement for human intervention or approval in an automated process." },
                    { term: "Protocol Fragmentation", desc: "When different parts of an organization use incompatible agent standards." },
                    { term: "Responsibility Gap", desc: "The difficulty in assigning legal or moral blame when an autonomous system fails." }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs font-black text-slate-900 mb-1">{item.term}</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                <div className="flex gap-4 items-start">
                  <Info className="text-blue-500 shrink-0" size={20} />
                  <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                    <span className="font-black uppercase tracking-widest block mb-1">Pro Tip</span>
                    Don't just chase Performance. A high-performance firm with zero Trust or Compliance will eventually collapse under regulatory pressure or workforce strikes.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Return to Simulation
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
