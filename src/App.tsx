
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GameState, 
  HiddenVariables,
  Resources,
  INITIAL_VARIABLES, 
  INITIAL_RESOURCES, 
  INITIAL_STAKEHOLDERS, 
  Scenario, 
  DecisionOption,
  Policy,
  SystemEffect,
  Competitor,
  Crisis
} from './types';
import { SCENARIOS, POLICIES, SYSTEM_EFFECTS, AI_COMPETITORS, CRISES } from './gameData';
import { scoreValue, checkTerminal, checkWarning } from './scoring/model';
import { Dashboard } from './components/Dashboard';
import { RoundView } from './components/RoundView';
import { FeedbackView } from './components/FeedbackView';
import { FinalReview } from './components/FinalReview';
import { StartScreen } from './components/StartScreen';
import { HelpModal } from './components/HelpModal';
import { HistoryView } from './components/HistoryView';
import { GovernanceFramework } from './components/GovernanceFramework';
import { ScoreExplanationModal } from './components/ScoreExplanationModal';
import { PedagogyView } from './components/PedagogyView';
import { SimBriefingModal } from './components/SimBriefingModal';
import { AcademicGatePortal } from './components/AcademicGatePortal';
import { ProfessorAdminView } from './components/ProfessorAdminView';
import { FacultyElevationModal } from './components/FacultyElevationModal';
import { 
  LayoutDashboard, 
  PlayCircle, 
  ShieldAlert, 
  History, 
  Users, 
  ChevronRight,
  Trophy,
  Globe,
  Info,
  HelpCircle,
  AlertCircle,
  Shield,
  Cpu,
  X,
  GraduationCap,
  Map,
  Wrench
} from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    variables: { ...INITIAL_VARIABLES },
    resources: { ...INITIAL_RESOURCES },
    stakeholders: INITIAL_STAKEHOLDERS.map(s => ({ ...s })),
    competitors: AI_COMPETITORS.map(c => ({ ...c })),
    activePolicies: [],
    activeEffects: [],
    history: [],
    delayedScenarios: [],
    flags: [],
    sector: 'Banking',
    isGameOver: false,
    currentScenarios: [SCENARIOS[0], SCENARIOS[1]],
    pendingDecisions: {},
    scenarioQueue: [],
    logs: ['Simulation initialized. Strategic mandate received.'],
    marketShare: 25,
    totalScore: 0,
    activeCrises: [],
    roundSummaries: []
  });

  const [view, setView] = useState<'intro' | 'dashboard' | 'scenario' | 'feedback' | 'final' | 'history' | 'governance' | 'pedagogy' | 'admin'>(() => {
    const unlocked = sessionStorage.getItem('abs_boardroom_unlocked') === 'true';
    const admin = sessionStorage.getItem('abs_boardroom_admin') === 'true';
    if (unlocked) {
      return admin ? 'admin' : 'dashboard';
    }
    return 'intro';
  });
  const [lastDecisions, setLastDecisions] = useState<DecisionOption[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('abs_boardroom_unlocked') === 'true';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('abs_boardroom_admin') === 'true';
  });
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);

  // Smooth scroll to top on view change
  useEffect(() => {
    const viewport = document.querySelector('.viewport-container');
    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [view]);

  // Score is computed by the single authoritative scoring module (src/scoring/model.ts).
  // Governance is a CONSTRAINT on realizing value, not a parallel point bucket:
  // value generated (performance + market share, modified by alignment/interop) is
  // GATED by a resilience factor set by the weakest governance vector. No scoring
  // math lives here or anywhere else outside that module.
  const calculateScore = (state: GameState): number => {
    return scoreValue(state.variables, state.marketShare);
  };

  const handleDecisionSelect = (scenarioId: string, optionId: string) => {
    setGameState((prev: GameState) => ({
      ...prev,
      pendingDecisions: {
        ...prev.pendingDecisions,
        [scenarioId]: optionId
      }
    }));
  };

  const handleLockIn = () => {
    const decisionsToApply: DecisionOption[] = [];
    Object.entries(gameState.pendingDecisions).forEach(([scenarioId, optionId]) => {
      const scenario = gameState.currentScenarios.find(s => s.id === scenarioId);
      const option = scenario?.options.find(o => o.id === optionId);
      if (option && scenario) {
        decisionsToApply.push(option);
      }
    });

    setGameState((prev: GameState) => {
      const nextVariables = { ...prev.variables };
      const nextResources = { ...prev.resources };
      const nextStakeholders = prev.stakeholders.map(s => ({ ...s }));
      const nextFlags = [...prev.flags];
      const nextLogs = [...prev.logs];
      const nextHistory = [...prev.history];
      const nextActivePolicies = [...prev.activePolicies];
      const nextDelayedScenarios = [...prev.delayedScenarios];

      decisionsToApply.forEach((option) => {
        // Find the scenario for this option to get the ID for history
        const scenario = prev.currentScenarios.find(s => s.options.some(o => o.id === option.id));
        if (!scenario) return;

        nextLogs.push(`Decision: ${option.label}`);
        
        // Apply impacts
        Object.entries(option.impact).forEach(([key, value]) => {
          const k = key as keyof typeof nextVariables;
          nextVariables[k] = Math.min(100, Math.max(0, nextVariables[k] + (value as number)));
        });

        if (option.cost) {
          Object.entries(option.cost).forEach(([key, value]) => {
            const k = key as keyof typeof nextResources;
            nextResources[k] = Math.max(0, nextResources[k] + (value as number));
          });
        }

        if (option.stakeholderImpact) {
          Object.entries(option.stakeholderImpact).forEach(([key, value]) => {
            const s = nextStakeholders.find(sh => sh.id === key);
            if (s) s.sentiment = Math.min(100, Math.max(0, s.sentiment + (value as number)));
          });
        }

        if (option.policyToActivate) {
          const policy = POLICIES.find(p => p.id === option.policyToActivate);
          if (policy && !nextActivePolicies.find(p => p.id === policy.id)) {
            nextActivePolicies.push({ ...policy, active: true });
            nextLogs.push(`Policy Activated: ${policy.name}`);
          }
        }

        if (option.delayedScenarioId && option.delayRounds) {
          nextDelayedScenarios.push({
            scenarioId: option.delayedScenarioId,
            roundsRemaining: option.delayRounds
          });
        }

        if (option.flagsSet) {
          nextFlags.push(...option.flagsSet);
        }

        nextHistory.push({
          roundId: prev.currentRound,
          scenarioId: scenario.id,
          decisionId: option.id,
          scenarioTitle: scenario.title,
          decisionLabel: option.label
        });
      });

      const nextState = {
        ...prev,
        variables: nextVariables,
        resources: nextResources,
        stakeholders: nextStakeholders,
        activePolicies: nextActivePolicies,
        delayedScenarios: nextDelayedScenarios,
        flags: nextFlags,
        logs: nextLogs,
        history: nextHistory,
        pendingDecisions: {}
      };

      return {
        ...nextState,
        totalScore: calculateScore(nextState)
      };
    });

    setLastDecisions(decisionsToApply);
    setView('feedback');
  };

  const handleContinue = () => {
    setGameState((prev: GameState) => {
      const nextRound = prev.currentRound + 1;
      const nextVariables = { ...prev.variables };
      const nextResources = { ...prev.resources, timeRemaining: prev.resources.timeRemaining - 1 };
      const nextLogs = [...prev.logs];

      // Apply per-turn policy effects
      prev.activePolicies.forEach(policy => {
        Object.entries(policy.impactPerTurn).forEach(([key, value]) => {
          const k = key as keyof typeof nextVariables;
          nextVariables[k] = Math.min(100, Math.max(0, nextVariables[k] + (value as number)));
        });
      });

      // Check system effects
      const nextActiveEffects = SYSTEM_EFFECTS.filter(effect => effect.condition({ ...prev, variables: nextVariables }));
      nextActiveEffects.forEach(effect => {
        Object.entries(effect.impact).forEach(([key, value]) => {
          const k = key as keyof typeof nextVariables;
          nextVariables[k] = Math.min(100, Math.max(0, nextVariables[k] + (value as number)));
        });
        if (!prev.activeEffects.find(e => e.id === effect.id)) {
          nextLogs.push(`Systemic Alert: ${effect.name}`);
        }
      });

      // AI Competitor Moves with Dynamic, Quarter-Specific Strategic Announcements
      const nextCompetitors = prev.competitors.map(c => {
        let performanceGain = 0;
        let trustGain = 0;

        // Base strategy-driven growth rates
        const baseGrowth = c.strategy === 'Aggressive' ? 3 : c.strategy === 'Balanced' ? 2 : 1;
        
        // Dynamic "Catch-up Engine": competitors accelerate when trailing the player's
        // performance, but with diminishing returns and a hard cap. The bonus grows
        // sub-linearly and is capped, so a leading player retains a meaningful, defensible
        // edge and the late rounds remain responsive to player choices.
        const scaleGap = Math.max(0, nextVariables.performance - c.performance);
        const CATCHUP_CAP = 5;
        const rawCatchup = scaleGap > 5 ? Math.sqrt(scaleGap - 5) * 1.1 : 0;
        const catchupBonus = Math.round(Math.min(CATCHUP_CAP, rawCatchup));

        performanceGain = baseGrowth + catchupBonus;

        // NexusCore (Aggressive) shortcuts safety for speed
        if (c.id === 'nexus_core') {
          trustGain = -1; // Fast-moving compromises public trust
          if (nextRound === 5) {
            performanceGain += 12;
            nextLogs.push(`[COMPETITIVE ACTION] NexusCore Solutions deploys 'AetherMesh 2.0' across global channels. Their operational performance surges!`);
          }
          if (nextRound === 9) {
            performanceGain += 10;
            nextLogs.push(`[COMPETITIVE ACTION] NexusCore bypasses EU governance sandboxes to roll out autonomous financial brokers.`);
          }
        }

        // Fortress Legacy (Conservative) prioritizes safety & security
        if (c.id === 'fortress_legacy') {
          trustGain = 3;
          if (nextRound === 6) {
            trustGain += 12;
            nextLogs.push(`[COMPETITIVE ACTION] Fortress Legacy signs a watershed Corporate Audit Pact, bolstering public legitimacy & trust.`);
          }
          if (nextRound === 10) {
            performanceGain += 8;
            nextLogs.push(`[COMPETITIVE ACTION] Fortress activates legacy mainframe agent connectors to catch up on throughput.`);
          }
        }

        // OmniAgent (Balanced) focuses on standards & compliance
        if (c.id === 'omni_agent') {
          trustGain = 1;
          if (nextRound === 7) {
            performanceGain += 8;
            trustGain += 8;
            nextLogs.push(`[COMPETITIVE ACTION] OmniAgent Global rolls out a standard open-source API hub, capturing market goodwill.`);
          }
        }

        return {
          ...c,
          performance: Math.min(100, Math.max(0, c.performance + performanceGain)),
          trust: Math.min(100, Math.max(0, c.trust + trustGain))
        };
      });

      // Unified Market Share and Power Formula (Inspired by Dr. Narayan's "Strategic Decoupling Law")
      // Player competitive power accounts for performance, trust, and structural penalties
      const playerPower = Math.max(10, 
        (nextVariables.performance * 0.45) + 
        (nextVariables.trust * 0.35) + 
        (nextVariables.compliance * 0.15) - 
        (nextVariables.workforceStrain > 60 ? (nextVariables.workforceStrain - 60) * 0.5 : 0) -
        (nextVariables.vendorDependency > 60 ? (nextVariables.vendorDependency - 60) * 0.3 : 0)
      );

      // Competitor competitive powers
      const getCompetitorPower = (c: typeof nextCompetitors[0]) => {
        if (c.id === 'nexus_core') {
          return Math.max(10, (c.performance * 0.6) + (c.trust * 0.2) + 15);
        }
        if (c.id === 'fortress_legacy') {
          return Math.max(10, (c.performance * 0.3) + (c.trust * 0.6) + 15);
        }
        // omni_agent
        return Math.max(10, (c.performance * 0.45) + (c.trust * 0.4) + 15);
      };

      const powers = nextCompetitors.map(c => ({ id: c.id, power: getCompetitorPower(c) }));
      const totalPower = playerPower + powers.reduce((acc, p) => acc + p.power, 0);

      // Allocate market share using largest-remainder (Hamilton) apportionment so that
      // player + competitor shares are integers that sum to EXACTLY 100, with a 5-point
      // minimum floor for every actor. Apportioning the remainder this way preserves the
      // 100% invariant without letting rounding error accumulate on any single actor.
      const PLAYER_MIN = 5;
      const COMPETITOR_MIN = 5;

      // Ideal (fractional) shares from raw power.
      const playerIdeal = (playerPower / totalPower) * 100;
      const competitorIdeals = nextCompetitors.map(c => {
        const pObj = powers.find(p => p.id === c.id);
        return { id: c.id, ideal: pObj ? (pObj.power / totalPower) * 100 : 0 };
      });

      // Floor everything, then distribute the leftover points to the largest remainders.
      const actors = [
        { id: '__player__', ideal: playerIdeal, min: PLAYER_MIN },
        ...competitorIdeals.map(ci => ({ id: ci.id, ideal: ci.ideal, min: COMPETITOR_MIN })),
      ];
      const floored = actors.map(a => {
        const base = Math.max(a.min, Math.floor(a.ideal));
        return { id: a.id, alloc: base, remainder: a.ideal - Math.floor(a.ideal) };
      });
      let allocatedSum = floored.reduce((acc, f) => acc + f.alloc, 0);
      // Distribute or reclaim points so the total is exactly 100, by remainder order.
      const byRemainderDesc = [...floored].sort((a, b) => b.remainder - a.remainder);
      let idx2 = 0;
      while (allocatedSum < 100) {
        const target = byRemainderDesc[idx2 % byRemainderDesc.length];
        target.alloc += 1;
        allocatedSum += 1;
        idx2++;
      }
      const byRemainderAsc = [...floored].sort((a, b) => a.remainder - b.remainder);
      let idx3 = 0;
      while (allocatedSum > 100) {
        // Reclaim only from actors above their minimum, smallest remainder first.
        const target = byRemainderAsc[idx3 % byRemainderAsc.length];
        const actorMin = actors.find(a => a.id === target.id)!.min;
        if (target.alloc > actorMin) {
          target.alloc -= 1;
          allocatedSum -= 1;
        }
        idx3++;
        // Safety: if every actor is at its floor we cannot reduce further.
        if (idx3 > byRemainderAsc.length * 4) break;
      }

      const allocFor = (id: string) => floored.find(f => f.id === id)?.alloc ?? COMPETITOR_MIN;
      const nextMarketShare = Math.min(85, allocFor('__player__'));
      const updatedCompetitors = nextCompetitors.map(c => ({ ...c, marketShare: allocFor(c.id) }));

      // Update delayed scenarios: decrement, then keep only those still in the future.
      // Scenarios that reach 0 this round are snapshotted for firing exactly once, and only
      // those with rounds remaining > 0 are carried forward, so nothing double-fires or drifts.
      const decrementedDelayed = prev.delayedScenarios.map(ds => ({
        ...ds,
        roundsRemaining: ds.roundsRemaining - 1,
      }));
      const nextDelayedScenarios = decrementedDelayed.filter(ds => ds.roundsRemaining > 0);
      const readyDelayedThisRound = decrementedDelayed.filter(ds => ds.roundsRemaining === 0);

      // Manage Crises: age out expired crises first.
      let nextActiveCrises = prev.activeCrises
        .map(c => ({ ...c, duration: c.duration - 1 }))
        .filter(c => c.duration > 0);

      // Randomly trigger a new crisis BEFORE applying impacts, so a newly appearing crisis
      // deals its damage in the same round it appears. 20% chance per round, after round 2,
      // capped at 2 concurrent crises.
      if (Math.random() < 0.20 && nextActiveCrises.length < 2 && nextRound > 2) {
        const availableCrises = CRISES.filter(c => !nextActiveCrises.find(ac => ac.id === c.id));
        if (availableCrises.length > 0) {
          const newCrisis = availableCrises[Math.floor(Math.random() * availableCrises.length)];
          nextActiveCrises.push({ ...newCrisis });
          nextLogs.push(`CRITICAL ALERT: ${newCrisis.title}`);
        }
      }

      // Apply impacts of all active crises (including any triggered this round).
      nextActiveCrises.forEach(crisis => {
        Object.entries(crisis.impactPerTurn).forEach(([key, value]) => {
          const k = key as keyof typeof nextVariables;
          nextVariables[k] = Math.min(100, Math.max(0, nextVariables[k] + (value as number)));
        });

        if (crisis.resourceImpactPerTurn) {
          Object.entries(crisis.resourceImpactPerTurn).forEach(([key, value]) => {
            const k = key as keyof typeof nextResources;
            nextResources[k] = Math.min(100, Math.max(0, nextResources[k] + (value as number)));
          });
        }
      });

      // Find next scenarios for the new quarter. We pass an explicit next-state object
      // so scenario conditions evaluate against fresh values, not stale closure state.
      const stateForConditions = {
        ...prev,
        variables: nextVariables,
        resources: nextResources,
        currentRound: nextRound,
        competitors: updatedCompetitors,
        marketShare: nextMarketShare,
      } as GameState;
      const nextScenarios = findNextScenarios(
        nextRound,
        nextVariables,
        readyDelayedThisRound,
        prev.history.map(h => h.scenarioId),
        stateForConditions,
      );

      // --- Terminal failure, warning quarter, and clean end conditions ---
      const terminal = checkTerminal(nextVariables, nextResources);
      const timeUp = nextResources.timeRemaining <= 0;
      const scenariosExhausted = nextScenarios.length === 0;

      // Warning quarter: if the firm has entered the danger zone but has NOT yet breached a
      // terminal threshold, issue a one-time recovery warning instead of ending the run.
      // This makes failure always foreseeable and recoverable by an attentive player.
      const warning = checkWarning(nextVariables, nextResources);
      const alreadyWarned = prev.flags.includes('__recovery_warning_issued__');
      const nextFlagsRound = [...prev.flags];
      if (warning.warned && !terminal.failed && !alreadyWarned) {
        nextFlagsRound.push('__recovery_warning_issued__');
        warning.reasons.forEach(r => nextLogs.push(`RECOVERY QUARTER — ${r}. Correct course before it becomes terminal.`));
      }

      if (terminal.failed) {
        terminal.reasons.forEach(r => nextLogs.push(`TERMINAL: ${r}`));
      } else if (scenariosExhausted && !timeUp) {
        nextLogs.push('The agenda is complete — all strategic scenarios have been navigated.');
      }

      const isGameOver = timeUp || terminal.failed || scenariosExhausted;

      if (isGameOver) {
        setView('final');
      } else {
        setView('dashboard');
      }

      const nextState = {
        ...prev,
        currentRound: nextRound,
        variables: nextVariables,
        previousVariables: prev.variables,
        resources: nextResources,
        activeEffects: nextActiveEffects,
        competitors: updatedCompetitors,
        marketShare: nextMarketShare,
        delayedScenarios: nextDelayedScenarios,
        currentScenarios: nextScenarios,
        flags: nextFlagsRound,
        isGameOver,
        logs: nextLogs,
        roundSummaries: [
          ...prev.roundSummaries,
          {
            roundId: prev.currentRound,
            variables: { ...nextVariables },
            resources: { ...nextResources },
            marketShare: nextMarketShare,
            totalScore: calculateScore({ ...prev, variables: nextVariables, resources: nextResources, marketShare: nextMarketShare }),
            activeCrises: nextActiveCrises.map(c => c.title),
            activePolicies: prev.activePolicies.map(p => p.name)
          }
        ]
      };

      return {
        ...nextState,
        totalScore: calculateScore(nextState)
      };
    });
  };

  // NOTE: scenario conditions are evaluated against the freshly-computed
  // next-state passed in via `stateForConditions`, NOT the closure-captured `gameState`
  // (which is stale inside a functional state update). Callers must pass the next state.
  // `readyDelayed` is the list of delayed scenarios that have reached 0 this round.
  const findNextScenarios = (
    round: number,
    vars: HiddenVariables,
    readyDelayed: { scenarioId: string; roundsRemaining: number }[],
    seenIds: string[],
    stateForConditions: GameState,
  ): Scenario[] => {
    const selected: Scenario[] = [];

    // 1. Fire delayed scenarios that have come due this round.
    readyDelayed.forEach(d => {
      const s = SCENARIOS.find(sc => sc.id === d.scenarioId);
      if (s && !selected.find(sel => sel.id === s.id)) selected.push(s);
    });

    // 2. Check for triggered scenarios (conditions evaluated against fresh next-state)
    const triggered = SCENARIOS.filter(s =>
      s.isTriggered &&
      !seenIds.includes(s.id) &&
      !selected.find(sel => sel.id === s.id) &&
      s.condition?.({ ...stateForConditions, variables: vars, currentRound: round }),
    );
    selected.push(...triggered);

    // 3. Fill with sequential scenarios until we have at least 2
    while (selected.length < 2) {
      const nextSequential = SCENARIOS.find(s => !s.isTriggered && !seenIds.includes(s.id) && !selected.find(sel => sel.id === s.id));
      if (nextSequential) {
        selected.push(nextSequential);
      } else {
        break;
      }
    }

    return selected;
  };

  if (!isUnlocked) {
    return <AcademicGatePortal onUnlock={(unlockedAsAdmin) => {
      setIsUnlocked(true);
      setIsAdmin(unlockedAsAdmin);
      setView(unlockedAsAdmin ? 'admin' : 'dashboard');
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-slate-900 selection:text-white flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed lg:relative w-80 h-full bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 shadow-2xl lg:shadow-none"
          >
            <div className="p-8 border-b border-white/10 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Globe size={20} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg font-black tracking-tighter uppercase leading-none">Agentic</h1>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Boardroom Lab</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {/* Navigation */}
              <div className="space-y-2">
                <button 
                  onClick={() => setView('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <LayoutDashboard size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
                </button>
                <button 
                  onClick={() => setView('history')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'history' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <History size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Strategic Archive</span>
                </button>
                <button 
                  onClick={() => setView('governance')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'governance' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <Shield size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Governance Framework</span>
                </button>
                <button 
                  onClick={() => setView('pedagogy')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'pedagogy' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <GraduationCap size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Pedagogy</span>
                </button>
                <button 
                  onClick={() => setView('scenario')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'scenario' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <PlayCircle size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Agentic Boardroom</span>
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => setView('admin')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'admin' ? 'bg-indigo-650 bg-indigo-600 text-white shadow-lg hover:bg-indigo-505 hover:bg-indigo-500' : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50/50'}`}
                  >
                    <Wrench size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Faculty Access Portal</span>
                  </button>
                )}
                {!isAdmin && (
                  <button 
                    onClick={() => setIsFacultyModalOpen(true)}
                    className="w-full flex items-center gap-3 px-4 py-2 mt-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/40 rounded-xl transition-all border border-dashed border-slate-250 hover:border-indigo-150"
                  >
                    <Wrench size={14} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Faculty Portal Access</span>
                  </button>
                )}
              </div>

              {/* Stakeholders */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Users size={12} /> Stakeholder Sentiment
                </h3>
                <div className="space-y-4">
                  {gameState.stakeholders.map(s => (
                    <div key={s.id}>
                      <div className="flex justify-between text-[11px] font-bold mb-1.5">
                        <span className="text-slate-600">{s.name}</span>
                        <span className={s.sentiment > 60 ? 'text-emerald-600' : s.sentiment < 40 ? 'text-rose-600' : 'text-blue-600'}>
                          {s.sentiment}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${s.sentiment}%` }}
                          className={`h-full ${s.sentiment > 60 ? 'bg-emerald-500' : s.sentiment < 40 ? 'bg-rose-500' : 'bg-blue-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Policies */}
              {gameState.activePolicies.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <ShieldAlert size={12} /> Active Policies
                  </h3>
                  <div className="space-y-2">
                    {gameState.activePolicies.map(p => (
                      <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-700">
                        {p.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Systemic Effects */}
              {gameState.activeEffects.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-4 flex items-center gap-2">
                    <ShieldAlert size={12} /> Systemic Risks
                  </h3>
                  <div className="space-y-2">
                    {gameState.activeEffects.map(e => (
                      <div key={e.id} className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-[11px] font-bold text-rose-700">
                        {e.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audit Log */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <History size={12} /> Strategic Log
                </h3>
                <div className="space-y-2">
                  {gameState.logs.slice(-5).reverse().map((log, i) => (
                    <div key={i} className="text-[10px] text-slate-500 leading-relaxed border-l-2 border-slate-100 pl-3 py-1">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Market Share</span>
                <span className="text-xl font-black text-slate-900">{gameState.marketShare}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: `${gameState.marketShare}%` }}
                  className="h-full bg-slate-900"
                />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative">
        {/* HUD */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-10 shrink-0 z-40">
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LayoutDashboard size={20} className="text-slate-600" />
            </button>
            
            <div className="flex items-center gap-3 md:gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Quarter</span>
                <span className="text-sm md:text-lg font-black text-slate-900">Q{gameState.currentRound}</span>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block" />
              <div className="flex flex-col hidden sm:flex">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget</span>
                <span className={`text-lg font-black ${gameState.resources.budget < 30 ? 'text-rose-600' : 'text-slate-900'}`}>
                  ${gameState.resources.budget}M
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsBriefingOpen(true)}
              className="group flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all border border-indigo-100"
              title="Strategic Oversight"
            >
              <Map size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Strategic Oversight</span>
            </button>
            <button 
              onClick={() => setView('pedagogy')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900"
              title="Pedagogical Objectives"
            >
              <GraduationCap size={20} />
            </button>
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900"
              title="Help"
            >
              <HelpCircle size={20} />
            </button>
            <button 
              onClick={() => setIsScoreModalOpen(true)}
              className="flex flex-col items-end hover:bg-slate-50 p-1 rounded-lg transition-colors"
            >
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Score</span>
              <span className="text-sm md:text-2xl font-black text-slate-900 tabular-nums">{gameState.totalScore}</span>
            </button>
            <div className="p-2 md:p-3 bg-slate-900 text-white rounded-xl shadow-lg">
              <Trophy size={18} className="md:w-6 md:h-6" />
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-grow overflow-y-auto p-4 md:p-10 custom-scrollbar flex flex-col viewport-container">
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {view === 'intro' && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60]"
                >
                  <StartScreen 
                    onStart={() => setView('dashboard')} 
                    onPedagogy={() => setView('pedagogy')}
                    onOpenBriefing={() => setIsBriefingOpen(true)}
                  />
                </motion.div>
              )}

              {view === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <Dashboard state={gameState} onScoreClick={() => setIsScoreModalOpen(true)} />
                  <div className="flex justify-center pt-8">
                    <button
                      onClick={() => setView('scenario')}
                      className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl hover:shadow-slate-400/40 active:scale-95 flex items-center gap-3"
                    >
                      Enter Boardroom
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </motion.div>
              )}

              {view === 'scenario' && gameState.currentScenarios.length > 0 && (
                <RoundView 
                  key="scenario"
                  scenarios={gameState.currentScenarios} 
                  pendingDecisions={gameState.pendingDecisions}
                  onDecisionSelect={handleDecisionSelect}
                  onLockIn={handleLockIn}
                  stakeholders={gameState.stakeholders}
                  currentRound={gameState.currentRound}
                />
              )}

              {view === 'feedback' && lastDecisions.length > 0 && (
                <FeedbackView 
                  key="feedback"
                  decisions={lastDecisions} 
                  onContinue={handleContinue} 
                />
              )}

              {view === 'history' && (
                <HistoryView 
                  key="history"
                  state={gameState}
                  onBack={() => setView('dashboard')}
                />
              )}

              {view === 'governance' && (
                <GovernanceFramework onBack={() => setView('dashboard')} />
              )}

              {view === 'pedagogy' && (
                <PedagogyView 
                  onBack={() => setView('dashboard')} 
                />
              )}

              {view === 'admin' && isAdmin && (
                <ProfessorAdminView 
                  gameState={gameState}
                  setGameState={setGameState}
                  onNavigateToGame={(target) => setView(target)}
                />
              )}

              {view === 'final' && (
                <FinalReview 
                  key="final"
                  state={gameState} 
                  onRestart={() => window.location.reload()} 
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="mt-20 pt-12 border-t border-slate-200 pb-12">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="flex justify-center gap-4">
                <div className="p-2 bg-slate-100 rounded-full">
                  <Info size={16} className="text-slate-400" />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">About</h4>
                <div className="space-y-2">
                  <p className="text-lg font-black text-slate-900">Dr. Somendra Narayan</p>
                  <p className="text-sm text-slate-500 font-medium">Assistant Professor of Strategy and Innovation</p>
                  <p className="text-sm text-slate-500 font-medium">Amsterdam Business School, University of Amsterdam</p>
                  <p className="text-sm text-slate-500 font-medium">Director, Amsterdam Digital Transformation Lab (ADTL)</p>
                </div>
                <p className="text-xs text-slate-400 italic max-w-2xl mx-auto leading-relaxed">
                  Author of <span className="font-bold">The Bridgerton Paradox in Artificial Intelligence</span> (Palgrave Macmillan / Springer Nature, 2025).
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 max-w-3xl mx-auto">
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  This interactive lab is designed for executive education and leadership training in strategic AI management. 
                  It serves as a contribution to the global discourse on the responsible governance of autonomous and agentic systems.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ScoreExplanationModal 
        isOpen={isScoreModalOpen} 
        onClose={() => setIsScoreModalOpen(false)} 
        state={gameState} 
      />
      <SimBriefingModal 
        isOpen={isBriefingOpen} 
        onClose={() => setIsBriefingOpen(false)} 
        state={gameState} 
      />
      <FacultyElevationModal 
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        onSuccess={(elevatedAsAdmin) => {
          setIsAdmin(elevatedAsAdmin);
          if (elevatedAsAdmin) {
            sessionStorage.setItem('abs_boardroom_unlocked', 'true');
            sessionStorage.setItem('abs_boardroom_admin', 'true');
            setView('admin');
          }
        }}
      />
    </div>
  );
};

export default App;
