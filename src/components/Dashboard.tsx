import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, HiddenVariables, QuarterlyUpdate } from '../types';
import { QUARTERLY_UPDATES } from '../gameData';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { 
  Zap, 
  Shield, 
  Users, 
  Cpu, 
  Lock, 
  Scale, 
  Heart, 
  Flame, 
  Layers, 
  RefreshCw,
  Info,
  ChevronRight,
  AlertCircle,
  Globe,
  Trophy,
  BarChart3,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  Eye,
  AlertTriangle,
  Wallet
} from 'lucide-react';

interface DashboardProps {
  state: GameState;
  onScoreClick?: () => void;
}

const METRIC_INSIGHTS: Record<string, { description: string; factors: string[]; trend: string }> = {
  Performance: {
    description: "Overall operational throughput and efficiency of agentic workflows.",
    factors: ["Agent sequencing speed", "Tool-call success rate", "Human-in-the-loop latency"],
    trend: "Typically increases with scaling, but plateaus if coordination fails."
  },
  Trust: {
    description: "Institutional and public legitimacy of automated decisions.",
    factors: ["Transparency of logs", "Workforce morale", "Regulatory alignment"],
    trend: "Highly volatile; easily damaged by hallucinations or bias signals."
  },
  Compliance: {
    description: "Adherence to legal frameworks and internal governance mandates.",
    factors: ["Audit trace depth", "Policy enforcement", "Regional regulation alignment"],
    trend: "Improves with centralized governance; degrades with 'Agile' fragmentation."
  },
  Flexibility: {
    description: "The organization's ability to pivot agent stacks and vendors.",
    factors: ["Interoperability standards", "Modular architecture", "Contractual freedom"],
    trend: "Decreases sharply with vendor lock-in; increases with open protocols."
  },
  Coordination: {
    description: "The seamlessness of cross-functional agent communication.",
    factors: ["Protocol standardization", "Orchestration layer health", "Silo integration"],
    trend: "Requires central investment to maintain as agent count grows."
  },
  Auditability: {
    description: "The ability to reconstruct and explain recursive agent decisions.",
    factors: ["Log standardization", "Decision trace persistence", "Human-readable outputs"],
    trend: "Critical for regulatory safety; often sacrificed for performance."
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ state, onScoreClick }) => {
  const { variables, currentRound } = state;
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const currentUpdate = QUARTERLY_UPDATES.find(u => u.round === currentRound) || QUARTERLY_UPDATES[0];

  const radarData = [
    { subject: 'Performance', A: variables.performance, fullMark: 100 },
    { subject: 'Trust', A: variables.trust, fullMark: 100 },
    { subject: 'Compliance', A: variables.compliance, fullMark: 100 },
    { subject: 'Flexibility', A: variables.flexibility, fullMark: 100 },
    { subject: 'Coordination', A: variables.coordination, fullMark: 100 },
    { subject: 'Auditability', A: variables.auditability, fullMark: 100 },
  ];

  const metrics = [
    { label: 'Performance', value: variables.performance, prev: state.previousVariables?.performance, icon: <Zap size={16} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', tooltip: "How fast and efficient your agents are." },
    { label: 'Trust', value: variables.trust, prev: state.previousVariables?.trust, icon: <Heart size={16} />, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', tooltip: "Legitimacy and public/employee confidence." },
    { label: 'Compliance', value: variables.compliance, prev: state.previousVariables?.compliance, icon: <Shield size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', tooltip: "Alignment with legal and ethical standards." },
    { label: 'Flexibility', value: variables.flexibility, prev: state.previousVariables?.flexibility, icon: <Layers size={16} />, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', tooltip: "Ability to pivot and avoid vendor lock-in." },
  ];

  const governanceMaturity = useMemo(() => {
    const score = (variables.trust + variables.compliance + variables.auditability) / 3;
    if (score > 80) return { level: 'Strategic Leader', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score > 60) return { level: 'Operational Practitioner', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score > 40) return { level: 'Emergent Observer', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { level: 'Reactive/Ad-hoc', color: 'text-rose-600', bg: 'bg-rose-50' };
  }, [variables]);

  const renderTrend = (current: number, prev?: number) => {
    if (prev === undefined || current === prev) return <Minus size={12} className="text-slate-300" />;
    if (current > prev) return <TrendingUp size={12} className="text-emerald-500" />;
    return <TrendingDown size={12} className="text-rose-500" />;
  };

  const handleRadarClick = (data: any) => {
    if (data && data.activeLabel) {
      setSelectedMetric(data.activeLabel);
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 max-w-[1600px] mx-auto">
      {/* Competitive Landscape */}
      <div className="glass-panel p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-white/40 bg-white/60 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Competitive Landscape</h3>
            <p className="text-sm md:text-base text-slate-900 font-black">Global Market Benchmarking • Quarter {state.currentRound}</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/80 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
            <Globe size={14} className="text-indigo-600 animate-pulse" /> Live Market Feed
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <div className="p-6 md:p-8 bg-slate-900 text-white rounded-[2rem] shadow-2xl border border-white/10 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Trophy size={140} />
            </div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Firm</span>
              <span className="px-2.5 py-1 bg-emerald-500 text-[9px] font-black rounded-lg uppercase shadow-lg shadow-emerald-500/20">Market Leader</span>
            </div>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div 
                  onClick={onScoreClick}
                  className="cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-all group/score"
                >
                  <p className="text-4xl font-black tabular-nums tracking-tighter group-hover/score:text-indigo-400 transition-colors">{state.totalScore}</p>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1 flex items-center gap-1">
                    Score <Info size={10} className="opacity-0 group-hover/score:opacity-100 transition-opacity" />
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black tabular-nums tracking-tighter text-right">{state.marketShare}%</p>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1 text-right">Market Share</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <div className={`px-4 py-2 rounded-2xl ${governanceMaturity.bg} ${governanceMaturity.color} border border-white/10`}>
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-0.5">Governance Maturity</p>
                  <p className="text-[10px] font-black uppercase tracking-tight">{governanceMaturity.level}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-wider">
                  <span className="text-slate-400">Operational Performance</span>
                  <span className="text-white">{variables.performance}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${variables.performance}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-400 to-white" 
                  />
                </div>
              </div>
            </div>
          </div>

          {state.competitors.map(c => (
            <div key={c.id} className="p-6 md:p-8 bg-white/80 rounded-[2rem] border border-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">{c.name}</span>
                <span className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase shadow-sm ${
                  c.strategy === 'Aggressive' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                  c.strategy === 'Conservative' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-50 text-slate-600 border border-slate-100'
                }`}>
                  {c.strategy}
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-5xl font-black text-slate-900 tabular-nums tracking-tighter">{Math.round(c.marketShare)}%</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Market Share</p>
                </div>
                <div className="pt-6 border-t border-slate-50">
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-wider">
                    <span className="text-slate-400">Performance</span>
                    <span className="text-slate-900">{Math.round(c.performance)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${c.performance}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-slate-900" 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Strategic Balance Banner (Interactive Gapping Tool) */}
      <div className="p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 text-slate-100 font-black text-8xl -z-10 tracking-tighter select-none pointer-events-none">EQUILIBRIUM</div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase text-indigo-600 tracking-[0.25em]">Systemic Equilibrium Governance Index (SEGI)</h4>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Scale size={24} className="text-slate-900" />
              The Autonomy-Governance Equilibrium
            </h3>
            <p className="text-sm text-slate-500 max-w-4xl leading-relaxed font-semibold">
              Live score tracking of the systemic governance frontier. Move your mouse or tap tiles to examine their formula weighting and instant impact on your academic trajectory.
            </p>
          </div>
          <button 
            onClick={onScoreClick}
            className="shrink-0 flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 text-xs font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95 duration-200"
          >
            <Info size={14} /> View Methodology & Theory
          </button>
        </div>

        {/* Live Equation Tracker - Restructured into 6 Beautiful, Modular Cards Mapping the Popup Components */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 mt-6 pt-6 border-t border-slate-200">
          
          {/* Card 1: Value Creation */}
          <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between hover:border-indigo-200 hover:shadow-sm transition-all duration-300 cursor-pointer" onClick={onScoreClick}>
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-tight">Value Creation</span>
              <div className="p-1 bg-amber-50 text-amber-500 rounded-lg"><Zap size={10} /></div>
            </div>
            <div className="mt-4">
              <p className="text-[8px] font-bold text-slate-400">Perf × 2.5</p>
              <p className="text-xl font-black text-slate-950 tabular-nums">+{variables.performance * 2.5}</p>
            </div>
          </div>

          {/* Card 2: Value Protection */}
          <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between hover:border-indigo-200 hover:shadow-sm transition-all duration-300 cursor-pointer" onClick={onScoreClick}>
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-tight">Value Protection</span>
              <div className="p-1 bg-emerald-50 text-emerald-500 rounded-lg"><Shield size={10} /></div>
            </div>
            <div className="mt-4">
              <p className="text-[8px] font-bold text-slate-400">Trust & Comp × 2.0</p>
              <p className="text-xl font-black text-slate-950 tabular-nums">+{Math.round(variables.trust * 2 + variables.compliance * 2)}</p>
            </div>
          </div>

          {/* Card 3: Gap Penalty */}
          <div className={`p-4 rounded-2xl border flex flex-col justify-between hover:shadow-sm transition-all duration-300 cursor-pointer ${
            (variables.performance - (variables.auditability + variables.compliance + variables.trust) / 3) > 20 
              ? 'bg-rose-50/50 border-rose-200' 
              : 'bg-white border-slate-100 hover:border-indigo-200'
          }`} onClick={onScoreClick}>
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-tight">Equilibrium Gap</span>
              <div className={`p-1 rounded-lg ${
                (variables.performance - (variables.auditability + variables.compliance + variables.trust) / 3) > 20 
                  ? 'bg-rose-100 text-rose-500' 
                  : 'bg-slate-150 text-slate-400'
              }`}><AlertTriangle size={10} /></div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[8px] font-bold text-slate-400">Autonomy Penalty</span>
                {(variables.performance - (variables.auditability + variables.compliance + variables.trust) / 3) > 20 && (
                  <span className="text-[6px] bg-rose-200 text-rose-800 font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide animate-pulse">RISK</span>
                )}
              </div>
              <p className={`text-xl font-black tabular-nums mt-1.5 ${
                (variables.performance - (variables.auditability + variables.compliance + variables.trust) / 3) > 20 
                  ? 'text-rose-600' 
                  : 'text-slate-500'
              }`}>
                -{Math.round(
                  Math.max(0, variables.performance - (variables.auditability + variables.compliance + variables.trust) / 3) > 20 
                  ? Math.pow(Math.max(0, variables.performance - (variables.auditability + variables.compliance + variables.trust) / 3) - 20, 1.5) * 2 
                  : 0
                )}
              </p>
            </div>
          </div>

          {/* Card 4: Alignment Bonus */}
          <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between hover:border-indigo-200 hover:shadow-sm transition-all duration-300 cursor-pointer" onClick={onScoreClick}>
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-tight">Alignment Bonus</span>
              <div className="p-1 bg-indigo-50 text-indigo-500 rounded-lg"><Layers size={10} /></div>
            </div>
            <div className="mt-4">
              <p className="text-[8px] font-bold text-slate-400">Coord & Flex Mean</p>
              <p className="text-xl font-black text-slate-950 tabular-nums">+{Math.round((variables.coordination + variables.flexibility) / 2)}</p>
            </div>
          </div>

          {/* Card 5: Market Dominance */}
          <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between hover:border-indigo-200 hover:shadow-sm transition-all duration-300 cursor-pointer" onClick={onScoreClick}>
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-tight">Market Dominance</span>
              <div className="p-1 bg-blue-50 text-blue-500 rounded-lg"><Globe size={10} /></div>
            </div>
            <div className="mt-4">
              <p className="text-[8px] font-bold text-slate-400">Share × 15</p>
              <p className="text-xl font-black text-slate-950 tabular-nums">+{Math.round(state.marketShare * 15)}</p>
            </div>
          </div>

          {/* Card 6: Efficiency Reserves */}
          <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between hover:border-indigo-200 hover:shadow-sm transition-all duration-300 cursor-pointer" onClick={onScoreClick}>
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-tight">Efficiency Cap</span>
              <div className="p-1 bg-slate-100 text-slate-500 rounded-lg"><Wallet size={10} /></div>
            </div>
            <div className="mt-4">
              <p className="text-[8px] font-bold text-slate-400">Resource Mean</p>
              <p className="text-xl font-black text-slate-950 tabular-nums">+{Math.round((state.resources.budget + state.resources.politicalCapital) / 2)}</p>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Left Side: Quarterly Results & Financials */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="glass-panel p-8 rounded-[2.5rem] shadow-xl border border-white/40 bg-white/60 backdrop-blur-xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
              <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg">
                <BarChart3 size={16} />
              </div>
              Quarterly Results
            </h3>
            <div className="space-y-4">
              {metrics.map((m) => (
                <div key={m.label} className="flex items-center justify-between p-5 bg-white/40 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all group relative">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${m.bg} ${m.color} ${m.border} shadow-sm group-hover:scale-110 transition-transform`}>
                      {m.icon}
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500">{m.label}</span>
                      <p className="text-[9px] text-slate-400 font-medium leading-none mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{m.tooltip}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderTrend(m.value, m.prev)}
                    <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">{m.value}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Governance Pulse</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Shield size={14} className="text-slate-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Alignment</span>
                  </div>
                  <span className={`text-xs font-black ${variables.trust > 60 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {variables.trust > 60 ? 'High' : 'At Risk'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Scale size={14} className="text-slate-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Accountability</span>
                  </div>
                  <span className={`text-xs font-black ${variables.auditability > 60 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {variables.auditability > 60 ? 'Robust' : 'Opaque'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Eye size={14} className="text-slate-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Transparency</span>
                  </div>
                  <span className={`text-xs font-black ${variables.compliance > 60 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {variables.compliance > 60 ? 'Full' : 'Limited'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Financial & Political Health</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-emerald-600 mb-2 tracking-widest">Budget</p>
                  <p className="text-3xl font-black text-emerald-900 tracking-tighter">${state.resources.budget}M</p>
                </div>
                <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-indigo-600 mb-2 tracking-widest">Political Cap</p>
                  <p className="text-3xl font-black text-indigo-900 tracking-tighter">{state.resources.politicalCapital}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] shadow-xl border border-slate-800 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldAlert size={120} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-3 relative z-10">
              <div className="p-2 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20">
                <AlertCircle size={16} />
              </div>
              Systemic Risk Monitoring
            </h3>
            {state.activeCrises.length > 0 ? (
              <div className="space-y-5 relative z-10">
                {state.activeCrises.map(crisis => (
                  <div key={crisis.id} className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm font-black uppercase text-rose-400 tracking-tight">{crisis.title}</p>
                      <span className="text-[9px] font-black px-2 py-1 bg-rose-500/20 text-rose-400 rounded-lg uppercase border border-rose-500/30">{crisis.severity}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-5 font-medium">{crisis.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 flex-grow bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "100%" }}
                          animate={{ width: `${(crisis.duration / 4) * 100}%` }}
                          className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" 
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0">{crisis.duration}Q Remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 relative z-10">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Shield size={40} className="text-emerald-400" />
                </div>
                <p className="text-sm font-black text-white mb-1">Systems Nominal</p>
                <p className="text-xs font-bold text-slate-500">No active systemic crises detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quarterly Briefing & Tech Updates */}
        <div className="lg:col-span-8 space-y-6 md:space-y-10">
          <div className="glass-panel p-8 md:p-12 rounded-[3rem] shadow-xl border border-white/40 bg-white/60 backdrop-blur-xl min-h-[450px] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
              <h3 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter text-slate-900">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/20">
                  <Info size={24} />
                </div>
                Executive Briefing
              </h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quarter {state.currentRound} Intelligence</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 md:gap-16 flex-grow">
              <div className="space-y-10">
                <div className="group">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-4 group-hover:translate-x-1 transition-transform">Operational Update</h4>
                  <p className="text-base text-slate-700 leading-relaxed font-medium border-l-4 border-indigo-100 pl-6 py-1">
                    {currentUpdate.operationalUpdate}
                  </p>
                </div>
                <div className="group">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4 group-hover:translate-x-1 transition-transform">Governance & Trust</h4>
                  <p className="text-base text-slate-700 leading-relaxed font-medium border-l-4 border-emerald-100 pl-6 py-1">
                    {currentUpdate.governanceUpdate}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-8 bg-slate-900/5 rounded-[2.5rem] border border-white shadow-inner">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                    <Cpu size={14} className="text-slate-900" /> Tech & Industry Pulse
                  </h4>
                  <ul className="space-y-6">
                    {currentUpdate.techPulse.map((pulse, idx) => (
                      <li key={idx} className="flex gap-4 group">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                        <div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">{pulse.title}</p>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">{pulse.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Nominal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 ${state.variables.vendorDependency > 50 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-slate-300'} rounded-full`} />
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Vendor Risk</span>
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 italic tracking-wide">"Strategy is the art of making choices under uncertainty."</p>
            </div>
          </div>

          {/* Strategic Balance Radar */}
          <div className="glass-panel p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-white/40 bg-white/60 backdrop-blur-xl min-h-[500px] flex flex-col relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-1000" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 relative z-10">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Strategic Balance Index</h3>
                <p className="text-sm text-slate-900 font-black">Interactive Executive Deep-Dive</p>
              </div>
              <div className="px-4 py-2 bg-white/80 rounded-full border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                Click segment for analysis
              </div>
            </div>
            
            <div className="flex-grow min-h-[400px] relative z-10 w-full">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart 
                  cx="50%" 
                  cy="50%" 
                  outerRadius="70%" 
                  data={radarData}
                  onClick={handleRadarClick}
                >
                  <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Current State"
                    dataKey="A"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="#4f46e5"
                    fillOpacity={0.2}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <AnimatePresence>
              {selectedMetric && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="absolute bottom-8 right-8 left-8 md:left-auto md:w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl z-20 text-white"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                      <h4 className="text-xl font-black tracking-tight">{selectedMetric}</h4>
                    </div>
                    <button 
                      onClick={() => setSelectedMetric(null)} 
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-8 font-medium">
                    {METRIC_INSIGHTS[selectedMetric].description}
                  </p>
                  <div className="space-y-6">
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] block mb-4">Contributing Factors</span>
                      <ul className="space-y-3">
                        {METRIC_INSIGHTS[selectedMetric].factors.map(f => (
                          <li key={f} className="text-[11px] font-bold text-slate-200 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_5px_rgba(129,140,248,0.5)]" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] block mb-2">Strategic Trend</span>
                      <p className="text-[11px] font-bold text-indigo-300 italic leading-relaxed">{METRIC_INSIGHTS[selectedMetric].trend}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
