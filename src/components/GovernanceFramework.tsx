import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Zap, 
  Eye, 
  Scale, 
  BookOpen,
  Target,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

interface GovernanceFrameworkProps {
  onBack?: () => void;
}

export const GovernanceFramework: React.FC<GovernanceFrameworkProps> = ({ onBack }) => {
  const pillars = [
    {
      title: "Autonomy",
      icon: <Zap className="text-amber-500" />,
      description: "The degree of independent decision-making granted to agentic systems.",
      risk: "High autonomy increases speed but risks 'unaligned' strategic drift.",
      governance: "Requires strict 'guardrails' and threshold-based escalations."
    },
    {
      title: "Alignment",
      icon: <Target className="text-rose-500" />,
      description: "Ensuring agents act in accordance with human values and corporate intent.",
      risk: "Misalignment leads to 'reward hacking' where agents optimize for the wrong metrics.",
      governance: "Requires continuous monitoring of 'Constitutional AI' principles."
    },
    {
      title: "Accountability",
      icon: <Scale className="text-emerald-500" />,
      description: "The clear assignment of legal and ethical responsibility for agent actions.",
      risk: "The 'Responsibility Gap'—when no human can be blamed for a machine error.",
      governance: "Requires 'Human-in-the-Loop' (HITL) for high-stakes decisions."
    },
    {
      title: "Transparency",
      icon: <Eye className="text-indigo-500" />,
      description: "The visibility and interpretability of recursive agent logic.",
      risk: "Black-box decisions prevent effective auditing and regulatory compliance.",
      governance: "Requires standardized logging and 'Explainable AI' (XAI) traces."
    }
  ];

  return (
    <div className="space-y-12 py-8">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      )}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Agentic Governance Framework</h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          Managing autonomous systems requires a shift from traditional "Command and Control" to 
          "Orchestration and Oversight." Use these four pillars to evaluate your strategic choices.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {pillars.map((pillar, i) => (
          <motion.div 
            key={pillar.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-slate-100 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900">{pillar.title}</h3>
            </div>
            
            <p className="text-slate-600 font-medium mb-6 leading-relaxed">
              {pillar.description}
            </p>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-1" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1">Critical Risk</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{pillar.risk}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-1" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Governance Strategy</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{pillar.governance}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-10 rounded-[3rem] bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <BookOpen size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-black mb-4">The Orchestration Challenge</h3>
          <p className="text-slate-400 leading-relaxed mb-6 font-medium">
            In the agentic era, governance shifts from "monitoring actions" to "orchestrating intent." 
            The challenge is to build systems that remain resilient even when the speed of agent 
            decision-making far exceeds the speed of human intervention.
          </p>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400">
            <Shield size={14} /> Strategic Insight
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-3xl font-black text-slate-900 text-center">Governance Maturity Model</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { level: "Reactive", desc: "Governance is an afterthought, triggered only by crises or failures.", color: "bg-rose-50 text-rose-600" },
            { level: "Emergent", desc: "Basic guardrails are in place, but oversight is inconsistent and siloed.", color: "bg-amber-50 text-amber-600" },
            { level: "Operational", desc: "Standardized protocols and audit trails are integrated into the core stack.", color: "bg-blue-50 text-blue-600" },
            { level: "Strategic", desc: "Governance is a competitive advantage, enabling safe, high-speed innovation.", color: "bg-emerald-50 text-emerald-600" }
          ].map((m, i) => (
            <div key={i} className={`p-6 rounded-3xl border border-white shadow-sm ${m.color}`}>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Level {i + 1}</p>
              <p className="text-lg font-black mb-2">{m.level}</p>
              <p className="text-xs font-medium leading-relaxed opacity-80">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
