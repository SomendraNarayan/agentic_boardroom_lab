import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Target, 
  Lightbulb, 
  Brain, 
  ArrowLeft, 
  Shield, 
  Zap, 
  Users, 
  Scale,
  GraduationCap,
  Layers,
  Search,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface PedagogyViewProps {
  onBack: () => void;
}

const StrategicGovernanceFigure = () => {
  return (
    <div className="relative w-full aspect-square bg-white rounded-[2.5rem] shadow-inner overflow-hidden flex items-center justify-center p-8 border border-slate-100 group">
      <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Axes */}
        <line x1="40" y1="360" x2="380" y2="360" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="40" y1="40" x2="40" y2="360" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        
        {/* Labels on Axes */}
        <text x="380" y="380" textAnchor="end" className="text-[10px] font-black fill-slate-400 uppercase tracking-[0.2em]">Scale of Autonomy</text>
        <text x="20" y="40" textAnchor="start" className="text-[10px] font-black fill-slate-400 uppercase tracking-[0.2em]" transform="rotate(-90 20 40)">Organizational Control</text>

        {/* Capability Curve (Agent Effectiveness) */}
        <motion.path
          d="M 40 340 Q 150 330 360 60"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <text x="200" y="100" className="text-[11px] font-black fill-indigo-600 uppercase tracking-tight">System Performance</text>

        {/* Oversight Curve (Human Feasibility) */}
        <motion.path
          d="M 40 100 Q 200 120 360 340"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="8 8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
        <text x="180" y="300" className="text-[11px] font-black fill-rose-600 uppercase tracking-tight">Governor Feasibility</text>

        {/* Frontier Point */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, type: "spring" }}
        >
          <circle cx="178" cy="205" r="8" className="fill-slate-900" />
          <circle cx="178" cy="205" r="16" className="fill-slate-900/10 animate-pulse" />
          
          <rect x="195" y="185" width="140" height="45" rx="8" className="fill-slate-900 shadow-xl" />
          <text x="205" y="202" className="text-[12px] font-black fill-white uppercase tracking-tight">Decoupling Point</text>
          <text x="205" y="215" className="text-[8px] font-medium fill-slate-400 italic">High Autonomy / Control Decay</text>
        </motion.g>

        {/* Warning Zone background */}
        <motion.rect
          x="178"
          y="60"
          width="202"
          height="145"
          className="fill-rose-500/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        />
        <text x="280" y="85" textAnchor="middle" className="text-[9px] font-black fill-rose-400 uppercase tracking-[0.2em] animate-pulse">Critical Misalignment Zone</text>
      </svg>
      
      <div className="absolute top-4 right-4 flex gap-2">
        <Activity size={16} className="text-indigo-200" />
        <AlertTriangle size={16} className="text-rose-200" />
      </div>
    </div>
  );
};

export const PedagogyView: React.FC<PedagogyViewProps> = ({ onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto py-12 px-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-12 font-black uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="space-y-16">
        <header className="text-center space-y-4">
          <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-4">
            <GraduationCap size={48} />
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Pedagogical Framework</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            The **Agentic Governance Boardroom** is an executive-level strategic simulation that places you at the helm of a firm navigating the most significant technological pivot of the decade: the transition from static automation to autonomous agentic orchestration. 
            Over 12 simulated quarters, you will manage a delicate equilibrium between operational throughput and institutional resilience. 
            The goal is to move beyond "Tech-Larping" and confront the hard trade-offs of the agentic era—balancing performance with the legal, ethical, and strategic buffers that protect your firm from systemic collapse.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-[2.5rem] space-y-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Agentic Orchestration</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Moving beyond traditional automation to manage autonomous agent networks that adapt to complex market conditions.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-[2.5rem] space-y-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Institutional Buffer</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Synthesizing Trust and Compliance metrics into a strategic buffer that protects the firm during rapid AI expansion.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-[2.5rem] space-y-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
              <Scale size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Systemic Legitimacy</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Evaluating the long-term trade-offs between technical performance and the institutional social contract.
            </p>
          </div>
        </div>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-grow bg-slate-200" />
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Core Theoretical Pillars</h2>
            <div className="h-px flex-grow bg-slate-200" />
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                  Pillar 01
                </div>
                <h3 className="text-3xl font-black text-slate-900">The Autonomy-Governance Frontier</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  This core concept explores the critical threshold where agentic autonomy outpaces institutional oversight mechanisms. As organizations deploy decentralized autonomous agents to drive performance, the "Control Decay" creates systemic risks that cannot be managed by traditional human-in-the-loop (HITL) models.
                </p>
                <ul className="space-y-3">
                  {[
                    "Strategic decoupling thresholds",
                    "Decentralized performance vs. Centralized oversight",
                    "Governor feasibility bottlenecks"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex items-center justify-center">
                <StrategicGovernanceFigure />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                  Pillar 02
                </div>
                <h3 className="text-3xl font-black text-slate-900">Institutional Resilience Dynamics</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  The simulation environment models the multi-dimensional feedback loops between performance scaling and institutional health. Leaders must maintain "Governance Buffers"—Trust, Compliance, and Flexibility—to absorb the shocks of autonomous drift before they trigger terminal institutional crises.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-rose-500 uppercase mb-1">Dynamics 1</p>
                    <p className="text-xs font-bold text-slate-900">Agentic Performance Spike</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-amber-500 uppercase mb-1">Dynamics 2</p>
                    <p className="text-xs font-bold text-slate-900">Institutional Lag & Friction</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-blue-500 uppercase mb-1">Dynamics 3</p>
                    <p className="text-xs font-bold text-slate-900">Systemic Resilience Audit</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Dynamics 4</p>
                    <p className="text-xs font-bold text-slate-900">Governance Re-Alignment</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-slate-900 p-10 rounded-[3rem] text-white">
                <div className="space-y-6">
                  <h4 className="text-xl font-black">Strategic Objectives</h4>
                  <div className="space-y-4">
                    {[
                      { icon: <Search size={16} />, title: "Pattern Recognition", desc: "Identifying 'hallucination signals' in noisy data." },
                      { icon: <Layers size={16} />, title: "Multi-Horizon Strategy", desc: "Balancing Q1 profits with Year 3 stability." },
                      { icon: <Zap size={16} />, title: "Agile Risk Mitigation", desc: "Deploying governance buffers in real-time." }
                    ].map(outcome => (
                      <div key={outcome.title} className="flex gap-4">
                        <div className="p-2 bg-white/10 rounded-lg h-fit">{outcome.icon}</div>
                        <div>
                          <p className="text-sm font-black">{outcome.title}</p>
                          <p className="text-xs text-slate-400">{outcome.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-12 bg-slate-900 rounded-[3rem] text-center space-y-6 text-white">
          <Brain size={48} className="mx-auto text-indigo-400" />
          <h2 className="text-3xl font-black">Strategic Governance Philosophy</h2>
          <p className="text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            "Governance in the agentic era is not about restricting autonomy, but about architecting the institutional resilience necessary to handle its inevitable decoupling from human latency." — <span className="text-white font-black">Somendra Narayan</span>
          </p>
          <div className="pt-6 flex justify-center gap-4">
          <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Developer & Researcher</p>
            <p className="text-sm font-black">Dr. Somendra Narayan • ABS</p>
          </div>
          <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Institution</p>
            <p className="text-sm font-black">University of Amsterdam</p>
          </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
