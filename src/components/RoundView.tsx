import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scenario, DecisionOption, CS_ROLES, Stakeholder } from '../types';
import { 
  ChevronRight, 
  Info, 
  AlertCircle, 
  Wallet, 
  Users, 
  MessageSquare, 
  BrainCircuit, 
  ExternalLink,
  CheckCircle2,
  Lock,
  X,
  PlayCircle,
  Shield
} from 'lucide-react';

interface RoundViewProps {
  scenarios: Scenario[];
  pendingDecisions: Record<string, string>;
  onDecisionSelect: (scenarioId: string, optionId: string) => void;
  onLockIn: () => void;
  stakeholders: Stakeholder[];
  currentRound: number;
}

export const RoundView: React.FC<RoundViewProps> = ({ 
  scenarios, 
  pendingDecisions, 
  onDecisionSelect, 
  onLockIn,
  stakeholders,
  currentRound
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
  const allDecided = scenarios.every(s => pendingDecisions[s.id]);

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 md:px-4 py-1.5 rounded-full bg-slate-900 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">
            Quarterly Agenda — Q{currentRound}
          </span>
          <div className="h-px flex-grow bg-slate-200" />
        </div>
        
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 font-display tracking-tight">
          Agentic Boardroom
        </h2>
        <p className="text-slate-500 font-medium text-base md:text-lg">
          Review and decide on the key strategic initiatives for this quarter.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        {scenarios.map((scenario) => {
          const selectedOptionId = pendingDecisions[scenario.id];
          const selectedOption = scenario.options.find(o => o.id === selectedOptionId);

          return (
            <motion.div
              key={scenario.id}
              layoutId={scenario.id}
              onClick={() => setSelectedScenarioId(scenario.id)}
              className={`group cursor-pointer glass-panel p-8 rounded-3xl transition-all border-2 ${
                selectedOptionId ? 'border-emerald-500 bg-emerald-50/30' : 'border-transparent hover:border-slate-900'
              } relative overflow-hidden`}
            >
              {selectedOptionId && (
                <div className="absolute top-4 right-4 text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {scenario.phase}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-slate-800">
                {scenario.title}
              </h3>
              
              <p className="text-slate-500 font-medium line-clamp-2 mb-6">
                {scenario.brief}
              </p>

              {selectedOption && (
                <div className="mt-auto p-4 bg-white/50 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Selected Strategy</p>
                  <p className="text-slate-900 font-bold">{selectedOption.label}</p>
                </div>
              )}

              {!selectedOption && (
                <div className="mt-auto flex items-center gap-2 text-slate-400 font-bold text-sm">
                  <PlayCircle size={16} />
                  Click to review and decide
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Lock In Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
        <motion.button
          whileHover={allDecided ? { scale: 1.05 } : {}}
          whileTap={allDecided ? { scale: 0.95 } : {}}
          onClick={() => allDecided && setShowConfirm(true)}
          disabled={!allDecided}
          className={`flex items-center gap-3 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-2xl transition-all ${
            allDecided 
              ? 'bg-slate-900 text-white hover:bg-slate-800' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {allDecided ? <Lock size={18} /> : <Info size={18} />}
          {allDecided ? 'Lock In Decisions' : `Decide ${scenarios.length - Object.keys(pendingDecisions).length} more to continue`}
        </motion.button>
      </div>

      {/* Scenario Detail Modal */}
      <AnimatePresence>
        {selectedScenarioId && selectedScenario && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScenarioId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div
              layoutId={selectedScenarioId}
              className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedScenarioId(null)}
                className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
              >
                <X size={24} className="text-slate-400" />
              </button>

              <div className="flex-grow overflow-y-auto custom-scrollbar">
                <div className="p-6 md:p-16">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                      {selectedScenario.phase}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                    {selectedScenario.title}
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                    {/* Left Column: Brief & Options */}
                    <div className="lg:col-span-2 space-y-8 md:space-y-10">
                      <section>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                          <Info size={14} /> Executive Briefing
                        </h4>
                        <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium italic border-l-4 border-slate-900 pl-4 md:pl-6">
                          {selectedScenario.brief}
                        </p>
                      </section>

                      <section>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                          Available Strategies
                        </h4>
                        <div className="space-y-4">
                          {selectedScenario.options.map((option) => {
                            const isSelected = pendingDecisions[selectedScenario.id] === option.id;
                            return (
                              <button
                                key={option.id}
                                onClick={() => onDecisionSelect(selectedScenario.id, option.id)}
                                className={`w-full text-left p-6 rounded-3xl border-2 transition-all ${
                                  isSelected 
                                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl scale-[1.02]' 
                                    : 'border-slate-100 hover:border-slate-300 bg-slate-50'
                                }`}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-lg font-black">{option.label}</h5>
                                  {isSelected && <CheckCircle2 size={20} />}
                                </div>
                                <p className={`text-sm mb-4 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                  {option.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(option.impact).map(([key, value]) => (
                                    <span key={key} className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                                      isSelected ? 'bg-white/10 text-white' : 'bg-white text-slate-500 border border-slate-200'
                                    }`}>
                                      {key} { (value as number) > 0 ? '+' : ''}{value}
                                    </span>
                                  ))}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    </div>

                    {/* Right Column: Decision Support */}
                    <div className="space-y-8">
                      {/* Strategic Context */}
                      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Shield size={40} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                          <Shield size={14} className="text-emerald-400" /> Governance Context
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                          This scenario tests your ability to manage <span className="text-white font-bold">{selectedScenario.phase}</span> dynamics. 
                          Consider the long-term impact on <span className="text-emerald-400">Trust</span> and <span className="text-emerald-400">Compliance</span> versus short-term <span className="text-amber-400">Performance</span> gains.
                        </p>
                      </div>

                      {/* AI Advice */}
                      {selectedScenario.aiAdvice && (
                        <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                            <BrainCircuit size={14} /> AI Decision Support
                          </h4>
                          <p className="text-sm text-blue-900 leading-relaxed font-medium">
                            {selectedScenario.aiAdvice}
                          </p>
                        </div>
                      )}

                      {/* C-Suite Opinions */}
                      {selectedScenario.cSuiteOpinions && (
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <MessageSquare size={14} /> C-Suite Perspectives
                          </h4>
                          {selectedScenario.cSuiteOpinions.map((op, i) => {
                            const role = CS_ROLES.find(r => r.id === op.roleId);
                            return (
                              <div key={i} className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">
                                    {role?.name[0]}
                                  </div>
                                  <span className="text-[10px] font-black text-white/70">{role?.title}</span>
                                </div>
                                <p className="text-xs text-white/90 italic leading-relaxed">
                                  "{op.opinion}"
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Stakeholder Opinions */}
                      {selectedScenario.stakeholderOpinions && (
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Users size={14} /> Stakeholder Interests
                          </h4>
                          {selectedScenario.stakeholderOpinions.map((op, i) => {
                            const sh = stakeholders.find(s => s.id === op.stakeholderId);
                            return (
                              <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black">
                                    {sh?.name[0]}
                                  </div>
                                  <span className="text-[10px] font-black text-slate-900">{sh?.name}</span>
                                </div>
                                <p className="text-xs text-slate-600 italic leading-relaxed">
                                  "{op.opinion}"
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Links */}
                      {selectedScenario.links && (
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Reference Links
                          </h4>
                          {selectedScenario.links.map((link, i) => (
                            <a 
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              {link.label}
                              <ExternalLink size={12} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedScenarioId(null)}
                  className="px-8 py-3 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
                >
                  Confirm Selection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center"
            >
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Lock In Decisions?</h3>
              <p className="text-slate-500 font-medium mb-8">
                Once locked, these strategic choices will be implemented across the organization. This action cannot be undone for this quarter.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    onLockIn();
                  }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all"
                >
                  Implement Strategies
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-200 transition-all"
                >
                  Review Again
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
