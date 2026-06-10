import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, Shield, Zap, AlertTriangle, Layers, Gauge } from 'lucide-react';
import { GameState } from '../types';
import { computeScore } from '../scoring/model';

interface ScoreExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
}

const fmt = (n: number) => (n >= 0 ? '+' : '') + Math.round(n * 10) / 10;

export const ScoreExplanationModal: React.FC<ScoreExplanationModalProps> = ({ isOpen, onClose, state }) => {
  const { variables, marketShare } = state;
  // ALL scoring numbers come from the single authoritative model. No math here.
  const b = computeScore(variables, marketShare);
  const rhoPct = Math.round(b.resilience * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
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
                  <TrendingUp size={20} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">Strategic Score Breakdown</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-8">
              {/* Headline score */}
              <div className="text-center p-8 bg-slate-900 text-white rounded-[2rem] shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Realized Strategic Value</p>
                <div className="text-6xl font-black tabular-nums tracking-tighter">{Math.round(b.score)}</div>
                <p className="text-xs text-indigo-300 font-bold tracking-widest uppercase mt-4">Amsterdam Digital Transformation Lab</p>
              </div>

              {/* The governing idea */}
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200/80 space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Gauge size={14} /> How your score is realized
                </h4>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 font-mono text-center text-slate-800 text-sm">
                  Score = (Performance + Market Share, modified) &times; Resilience &minus; Penalties
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Governance is not a pile of points added next to performance. It is a <strong>licence to realize value</strong>.
                  The value your firm <em>generates</em> is gated by a <strong>resilience factor</strong> set by your <strong>weakest</strong>
                  {' '}governance vector &mdash; trust, compliance, or auditability. Let performance outrun your weakest control and the
                  multiplier collapses: the value still exists on paper, but you cannot bank it.
                </p>
              </div>

              {/* Resilience gate */}
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg"><Layers size={16} /></div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Value generated</p>
                      <p className="text-[11px] text-slate-500">Performance + market share, lifted by alignment &amp; interoperability</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-slate-900 tabular-nums">{Math.round(b.generated)}</span>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-2xl border ${b.gap > 20 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${b.gap > 20 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}><Shield size={16} /></div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Resilience factor &mdash; {rhoPct}%</p>
                      <p className="text-[11px] text-slate-500">
                        Gap {Math.round(b.gap)} between performance and your weakest vector
                        {' '}(<strong className="capitalize">{b.weakestVector}</strong>, at {Math.round(b.weakestValue)})
                      </p>
                    </div>
                  </div>
                  <span className={`text-lg font-black tabular-nums ${b.gap > 20 ? 'text-amber-700' : 'text-emerald-700'}`}>&times;{(b.resilience).toFixed(2)}</span>
                </div>

                {b.components.gatingLoss > 0.5 && (
                  <div className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-100 text-rose-700 rounded-lg"><AlertTriangle size={16} /></div>
                      <div>
                        <p className="text-xs font-black text-slate-900">Value lost to the governance gate</p>
                        <p className="text-[11px] text-slate-500">Generated value you could not bank because controls lagged</p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-rose-700 tabular-nums">{fmt(-b.components.gatingLoss)}</span>
                  </div>
                )}

                {b.components.strainPenalty > 0 && (
                  <div className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-100 text-rose-700 rounded-lg"><Zap size={16} /></div>
                      <div>
                        <p className="text-xs font-black text-slate-900">Workforce strain penalty</p>
                        <p className="text-[11px] text-slate-500">Operator overload past the safe threshold</p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-rose-700 tabular-nums">{fmt(-b.components.strainPenalty)}</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed px-4">
                This scoring model is a pedagogical operationalization grounded in human-factors research on automation,
                not a validated empirical instrument. The highest scores come from scaling aggressively while keeping your
                weakest control in step &mdash; not from caution, and never from performance alone.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
