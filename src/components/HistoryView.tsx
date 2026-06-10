import React from 'react';
import { motion } from 'motion/react';
import { GameState } from '../types';
import { QUARTERLY_UPDATES } from '../gameData';
import { 
  History, 
  ChevronRight, 
  FileText, 
  Activity, 
  Zap,
  ArrowLeft,
  Award,
  Download,
  Table
} from 'lucide-react';
import { downloadResults } from '../utils/report';

interface HistoryViewProps {
  state: GameState;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ state, onBack }) => {
  const [selectedRound, setSelectedRound] = React.useState<number | null>(null);

  const roundHistory = state.history;
  const updates = QUARTERLY_UPDATES;

  const getRoundData = (roundId: number) => {
    const historyItem = roundHistory.find(h => h.roundId === roundId);
    const update = updates.find(u => u.round === roundId);
    const summary = state.roundSummaries.find(s => s.roundId === roundId);
    return { historyItem, update, summary };
  };

  if (selectedRound !== null) {
    const { historyItem, update, summary } = getRoundData(selectedRound);
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-4xl mx-auto py-8 px-6"
      >
        <button 
          onClick={() => setSelectedRound(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} /> Back to Archive
        </button>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-slate-900">Quarter {selectedRound} Review</h2>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">
                Score: {summary?.totalScore || 'N/A'}
              </span>
              <span className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">
                Historical Record
              </span>
            </div>
          </div>

          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Performance', val: summary.variables.performance, color: 'text-amber-600' },
                { label: 'Trust', val: summary.variables.trust, color: 'text-rose-600' },
                { label: 'Compliance', val: summary.variables.compliance, color: 'text-emerald-600' },
                { label: 'Market Share', val: summary.marketShare, color: 'text-blue-600', suffix: '%' },
              ].map(m => (
                <div key={m.label} className="glass-panel p-4 rounded-2xl border border-slate-100">
                  <p className="text-[8px] font-black uppercase text-slate-400 mb-1">{m.label}</p>
                  <p className={`text-xl font-black ${m.color}`}>{m.val}{m.suffix || '%'}</p>
                </div>
              ))}
            </div>
          )}

          {summary && (
            <div className="glass-panel p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Resource Status</h3>
              <div className="flex gap-8">
                <div>
                  <p className="text-[8px] font-black uppercase text-slate-400">Budget Remaining</p>
                  <p className="text-lg font-black text-slate-900">${summary.resources.budget}M</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-slate-400">Political Capital</p>
                  <p className="text-lg font-black text-slate-900">{summary.resources.politicalCapital}</p>
                </div>
              </div>
            </div>
          )}

          {update && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel p-8 rounded-[2rem]">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-slate-900" />
                  Operational Update
                </h3>
                <p className="text-slate-600 leading-relaxed">{update.operationalUpdate}</p>
              </div>
              <div className="glass-panel p-8 rounded-[2rem]">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Zap size={16} className="text-slate-900" />
                  Governance Pulse
                </h3>
                <p className="text-slate-600 leading-relaxed">{update.governanceUpdate}</p>
              </div>
            </div>
          )}

          <div className="glass-panel p-8 rounded-[2rem]">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <FileText size={16} className="text-slate-900" />
              Strategic Directives
            </h3>
            <div className="space-y-6">
              {roundHistory.filter(h => h.roundId === selectedRound).map((h, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{h.scenarioTitle}</p>
                  <p className="text-lg font-black text-slate-900">{h.decisionLabel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-900 mb-2">Strategic Archive</h2>
          <p className="text-slate-500 font-medium">Review past quarters to refine your future strategy.</p>
        </div>
        <div className="p-4 bg-slate-100 rounded-3xl">
          <History size={32} className="text-slate-900" />
        </div>
      </div>

      {/* Dynamic Trajectory Dossier Download Panel */}
      {state.currentRound > 1 && (
        <div className="mb-10 p-6 md:p-8 bg-indigo-950 text-white rounded-[2rem] border border-indigo-900 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-indigo-900/20 font-black text-6xl -z-0 tracking-tighter select-none pointer-events-none">REPORT PORTAL</div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Classroom & Board Evaluation</span>
              <h3 className="text-xl font-black tracking-tight">Download Mid-Game Executive Dossier</h3>
              <p className="text-xs text-indigo-200 leading-relaxed font-semibold">
                Submit, review, or archive your intermediate progress files. This generates an academic evaluation including all strategic updates and current alignment KPIs recorded up to Quarter {state.currentRound - 1}.
              </p>
            </div>
            <div className="shrink-0 flex flex-wrap gap-2">
              <button 
                onClick={() => downloadResults(state, 'html')}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 text-xs font-black uppercase tracking-widest transition-transform active:scale-95 duration-200 shadow-md"
              >
                <Award size={14} /> Dossier (HTML)
              </button>
              <button 
                onClick={() => downloadResults(state, 'txt')}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-slate-100 rounded-xl hover:bg-slate-800 text-xs font-black uppercase tracking-widest transition-transform active:scale-95 duration-200"
              >
                <Download size={14} /> Trail (TXT)
              </button>
              <button 
                onClick={() => downloadResults(state, 'csv')}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-900/60 text-indigo-100 rounded-xl hover:bg-indigo-900 text-xs font-black uppercase tracking-widest transition-transform active:scale-95 duration-200 border border-indigo-800"
              >
                <Table size={14} /> Data (CSV)
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {Array.from({ length: state.currentRound - 1 }, (_, i) => i + 1).map(round => {
          const { historyItem, summary } = getRoundData(round);
          return (
            <button
              key={round}
              onClick={() => setSelectedRound(round)}
              className="group glass-panel p-6 rounded-[2rem] flex items-center justify-between hover:border-slate-400 transition-all text-left"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                  Q{round}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Quarterly Summary • Score: {summary?.totalScore || 'N/A'}</p>
                  <p className="text-lg font-black text-slate-900">
                    {historyItem?.scenarioTitle || `Quarter ${round} Directives`}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </button>
          );
        })}

        {state.currentRound === 1 && (
          <div className="text-center py-20 glass-panel rounded-[3rem] border-dashed">
            <p className="text-slate-400 font-medium">No historical data available yet. Complete Quarter 1 to begin your archive.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
