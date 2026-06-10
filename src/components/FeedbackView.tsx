import React from 'react';
import { motion } from 'motion/react';
import { DecisionOption, CS_ROLES } from '../types';
import { MessageSquare, Zap } from 'lucide-react';

interface FeedbackViewProps {
  decisions: DecisionOption[];
  onContinue: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ decisions, onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <div className="text-center">
        <div className="inline-block p-4 bg-slate-900 text-white rounded-2xl mb-6 shadow-xl">
          <Zap size={32} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2 font-display tracking-tight">Quarterly Directives Processed</h2>
        <p className="text-slate-500 font-medium">The executive committee has integrated your decisions into the operational roadmap.</p>
      </div>

      <div className="space-y-12">
        {decisions.map((decision, dIdx) => (
          <div key={dIdx} className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-2">
              Feedback: {decision.label}
            </h3>
            <div className="grid gap-4">
              {decision.responses.map((resp, i) => {
                const role = CS_ROLES.find(r => r.id === resp.roleId);
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (dIdx * 0.2) + (i * 0.1) }}
                    className="glass-panel p-6 rounded-2xl flex gap-6 items-start border-l-4 border-l-slate-800"
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white text-xl font-black">
                        {role?.name[0]}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-slate-900">{role?.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role?.title}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed italic font-medium">"{resp.message}"</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Governance Insight */}
            {decision.governanceInsight && (
              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                    <Zap size={14} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Governance Insight</span>
                </div>
                <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                  {decision.governanceInsight}
                </p>
              </div>
            )}
            
            {/* Impact Summary */}
            <div className="flex flex-wrap gap-3 mt-4">
              {Object.entries(decision.impact).map(([key, value]) => (
                <div key={key} className="px-3 py-1.5 bg-white/50 rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{key}</span>
                  <span className={`text-xs font-black ${Number(value) > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {Number(value) > 0 ? '+' : ''}{value}%
                  </span>
                </div>
              ))}
              {decision.cost && Object.entries(decision.cost).map(([key, value]) => (
                <div key={key} className="px-3 py-1.5 bg-white/50 rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{key}</span>
                  <span className={`text-xs font-black ${Number(value) < 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {Number(value) > 0 ? '+' : ''}{value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onContinue}
          className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center gap-3"
        >
          Proceed to Next Quarter
          <MessageSquare size={20} />
        </button>
      </div>
    </motion.div>
  );
};
