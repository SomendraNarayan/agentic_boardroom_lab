import React from 'react';
import { motion } from 'motion/react';
import { GameState, CS_ROLES } from '../types';
import { 
  Award, 
  Shield, 
  Zap, 
  AlertTriangle, 
  RefreshCw, 
  Users, 
  Wallet, 
  Activity, 
  BarChart3,
  Download,
  FileText,
  Table
} from 'lucide-react';
import { downloadResults } from '../utils/report';
import { deriveProfile } from '../scoring/profiles';

interface FinalReviewProps {
  state: GameState;
  onRestart: () => void;
}

export const FinalReview: React.FC<FinalReviewProps> = ({ state, onRestart }) => {
  const { variables, stakeholders, resources, history } = state;

  // The outcome profile is derived from the SHAPE of the whole run (max gap reached,
  // weakest vector, crises survived, terminal breaches) — not a threshold on the score.
  const profile = deriveProfile(state);
  const profileColor =
    profile.tone === 'exemplary' ? 'text-emerald-600' :
    profile.tone === 'strong' ? 'text-blue-600' :
    profile.tone === 'solid' ? 'text-indigo-600' :
    profile.tone === 'mixed' ? 'text-amber-600' :
    'text-rose-600';
  const rating = {
    label: profile.label,
    color: profileColor,
    icon: profile.tone === 'exemplary' ? <Award className="w-20 h-20" /> :
          profile.tone === 'strong' ? <Award className="w-20 h-20" /> :
          profile.tone === 'solid' ? <Shield className="w-20 h-20" /> :
          profile.tone === 'mixed' ? <Zap className="w-20 h-20" /> :
          <AlertTriangle className="w-20 h-20" />
  };

  const governanceMaturity = (variables.trust + variables.compliance + variables.auditability) / 3;

  const handleDownload = (format: 'txt' | 'csv' | 'html') => {
    downloadResults(state, format);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-12 px-6"
    >
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-100/50 to-transparent blur-3xl" />
        <motion.div 
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, delay: 0.2 }}
          className={`inline-block mb-8 p-8 bg-white rounded-[2.5rem] shadow-2xl ${rating.color}`}
        >
          {rating.icon}
        </motion.div>
        <h2 className="text-7xl font-black text-slate-900 mb-4 font-display tracking-tight leading-none">
          The Agentic <br/>Boardroom
        </h2>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-slate-200" />
          <p className={`text-2xl font-black uppercase tracking-[0.4em] ${rating.color}`}>{rating.label}</p>
          <div className="h-px w-12 bg-slate-200" />
        </div>
        <p className="text-slate-600 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          {profile.summary}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Strategic KPIs */}
        <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <BarChart3 size={200} />
          </div>
          <h3 className="text-xl font-black mb-12 flex items-center gap-3 uppercase tracking-widest text-slate-400">
            <BarChart3 size={24} className="text-slate-900" />
            Strategic Performance Index
          </h3>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {[
              { label: 'Operational Performance', val: variables.performance, color: 'bg-amber-500', desc: 'Efficiency of agent execution' },
              { label: 'Institutional Trust', val: variables.trust, color: 'bg-rose-500', desc: 'Confidence from users and partners' },
              { label: 'Regulatory Compliance', val: variables.compliance, color: 'bg-emerald-500', desc: 'Adherence to global AI standards' },
              { label: 'Systemic Flexibility', val: variables.flexibility, color: 'bg-indigo-500', desc: 'Ability to pivot under pressure' },
              { label: 'Technical Interoperability', val: variables.interoperability, color: 'bg-blue-500', desc: 'Cross-platform agent synergy' },
              { label: 'Auditability & Control', val: variables.auditability, color: 'bg-slate-900', desc: 'Transparency of agent reasoning' },
            ].map(kpi => (
              <div key={kpi.label} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{kpi.label}</span>
                    <span className="text-xs text-slate-500 font-medium">{kpi.desc}</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900 tabular-nums">{kpi.val}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${kpi.val}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className={`h-full ${kpi.color}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stakeholder Verdict */}
        <div className="flex flex-col gap-8">
          <div className="glass-panel p-10 rounded-[3rem] shadow-2xl bg-slate-900 text-white flex-grow">
            <h3 className="text-xl font-black mb-10 flex items-center gap-3 uppercase tracking-widest text-slate-400">
              <Users size={24} className="text-white" />
              Stakeholder Verdict
            </h3>
            <div className="space-y-8">
              {stakeholders.map(s => (
                <div key={s.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-300">{s.name}</span>
                    <span className="text-sm font-black tabular-nums">{s.sentiment}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${s.sentiment}%` }}
                      className={`h-full ${s.sentiment > 60 ? 'bg-emerald-400' : s.sentiment < 40 ? 'bg-rose-400' : 'bg-blue-400'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] shadow-2xl bg-white border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-slate-900 text-white rounded-2xl">
                <Award size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Strategic Score</p>
                <p className="text-3xl font-black text-slate-900 tabular-nums">{state.totalScore}</p>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Market Share</span>
                <span className="text-lg font-black text-slate-900">{state.marketShare}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Budget Efficiency</span>
                <span className="text-lg font-black text-slate-900">{Math.round((resources.budget / 100) * 100)}%</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-500">Governance Maturity</span>
                <span className={`text-lg font-black ${governanceMaturity > 75 ? 'text-emerald-600' : governanceMaturity > 50 ? 'text-blue-600' : 'text-rose-600'}`}>
                  {governanceMaturity > 75 ? 'Strategic' : governanceMaturity > 50 ? 'Operational' : 'Reactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Sheet */}
      <div className="glass-panel p-12 rounded-[3rem] shadow-2xl mb-12 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h3 className="text-2xl font-black flex items-center gap-3 uppercase tracking-widest text-slate-900 mb-2">
              <FileText size={28} />
              Executive Decision Sheet
            </h3>
            <p className="text-slate-500 font-medium">A complete audit trail of your strategic directives across 12 quarters.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => handleDownload('html')}
              className="flex items-center gap-3 px-6 py-3.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 shadow-indigo-500/20"
            >
              <Award size={18} /> Download Executive Dossier (HTML)
            </button>
            <button 
              onClick={() => handleDownload('txt')}
              className="flex items-center gap-3 px-6 py-3.5 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              <Download size={18} /> Download Audit Trail (TXT)
            </button>
            <button 
              onClick={() => handleDownload('csv')}
              className="flex items-center gap-3 px-6 py-3.5 bg-slate-100 text-slate-900 hover:bg-slate-200 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-95"
            >
              <Table size={18} /> Export Data (CSV)
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((h, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-slate-300 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Q{h.roundId}</span>
                <div className="h-1 w-1 rounded-full bg-slate-300 group-hover:w-4 transition-all" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 truncate">{h.scenarioTitle}</p>
              <p className="text-slate-900 font-black leading-tight">{h.decisionLabel}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-12 py-12">
        <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        
        <button
          onClick={onRestart}
          className="group relative bg-slate-900 text-white px-20 py-8 rounded-[2.5rem] font-black text-3xl hover:bg-slate-800 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-slate-400/40 active:scale-95 flex items-center gap-6"
        >
          <RefreshCw size={32} className="group-hover:rotate-180 transition-transform duration-700" />
          Begin New Mandate
        </button>

        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
          Simulation Complete • Strategic Mandate Concluded
        </p>
      </div>
    </motion.div>
  );
};
