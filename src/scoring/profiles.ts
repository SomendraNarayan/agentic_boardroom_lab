/**
 * OUTCOME PROFILES: nuanced, trajectory-derived archetypes.
 *
 * A profile is earned by the SHAPE of the whole run (the maximum gap reached, which
 * vector was the binding constraint, whether crises were survived, whether a terminal
 * threshold was ever breached), not by a threshold on the final number. Two players
 * with similar scores can earn different profiles depending on HOW they got there.
 */

import type { GameState, HiddenVariables } from '../types';
import { computeScore, governanceGate } from './model';
import { RESILIENCE } from './constants';

export interface OutcomeProfile {
  id: string;
  label: string;
  tone: 'exemplary' | 'strong' | 'solid' | 'mixed' | 'failure';
  /** A nuanced, diagnostic summary of how the run played out. */
  summary: string;
}

interface TrajectoryStats {
  finalScore: number;
  maxGap: number;
  meanGap: number;
  everDangerous: boolean;     // gap entered the steep-decay region
  terminalBreach: boolean;    // any terminal threshold ever crossed
  crisesSurvived: number;
  weakestVectorEver: 'auditability' | 'compliance' | 'trust';
  recoveredFromDanger: boolean;
}

/** The gap region where the resilience factor is steeply punishing. */
const DANGER_GAP = RESILIENCE.G0 + 10; // ~30: rho already well below 0.5

function deriveStats(state: GameState): TrajectoryStats {
  const summaries = state.roundSummaries.length
    ? state.roundSummaries
    : [
        {
          roundId: state.currentRound,
          variables: state.variables,
          resources: state.resources,
          marketShare: state.marketShare,
          totalScore: state.totalScore,
          activeCrises: [],
          activePolicies: [],
        },
      ];

  let maxGap = -Infinity;
  let gapSum = 0;
  let everDangerous = false;
  let weakestCounts: Record<string, number> = { auditability: 0, compliance: 0, trust: 0 };
  const gaps: number[] = [];

  for (const s of summaries) {
    const v = s.variables as HiddenVariables;
    const gate = governanceGate(v);
    const gap = v.performance - gate.value;
    gaps.push(gap);
    maxGap = Math.max(maxGap, gap);
    gapSum += gap;
    if (gap >= DANGER_GAP) everDangerous = true;
    weakestCounts[gate.vector]++;
  }

  // Recovered from danger = was dangerous at some point, but ended below danger.
  const endGap = gaps[gaps.length - 1] ?? 0;
  const recoveredFromDanger = everDangerous && endGap < DANGER_GAP;

  const weakestVectorEver = (Object.entries(weakestCounts).sort(
    (a, b) => b[1] - a[1],
  )[0][0]) as TrajectoryStats['weakestVectorEver'];

  // Crises survived: distinct crisis titles that appeared in any round summary.
  const crisisSet = new Set<string>();
  summaries.forEach((s) => (s.activeCrises || []).forEach((c) => crisisSet.add(c)));

  // Terminal breach detection across the trajectory.
  let terminalBreach = false;
  for (const s of summaries) {
    const v = s.variables as HiddenVariables;
    if (v.trust < 20 || v.compliance < 20 || v.workforceStrain > 90) terminalBreach = true;
    if (s.resources.budget <= 0 || s.resources.politicalCapital <= 0) terminalBreach = true;
  }
  if (state.resources.budget <= 0 || state.resources.politicalCapital <= 0) terminalBreach = true;

  return {
    finalScore: computeScore(state.variables, state.marketShare).score,
    maxGap: Number.isFinite(maxGap) ? maxGap : 0,
    meanGap: gapSum / summaries.length,
    everDangerous,
    terminalBreach,
    crisesSurvived: crisisSet.size,
    weakestVectorEver,
    recoveredFromDanger,
  };
}

export function deriveProfile(state: GameState): OutcomeProfile {
  const t = deriveStats(state);
  const vectorName = {
    auditability: 'auditability (the explainability of agent decisions)',
    compliance: 'regulatory compliance',
    trust: 'workforce and public trust',
  }[t.weakestVectorEver];

  // --- Failure ---
  if (t.terminalBreach || state.isGameOver === true && t.finalScore < 20) {
    return {
      id: 'governance_failure',
      label: 'Governance Failure',
      tone: 'failure',
      summary:
        `The firm crossed a survivable threshold. Performance was allowed to outrun its weakest ` +
        `control — ${vectorName} — until the institution could no longer absorb the consequences. ` +
        `In a real organization this is the point at which regulators, the workforce, or the balance ` +
        `sheet force the decision out of the executive's hands.`,
    };
  }

  // --- Exemplary: high score, never dangerous, controls kept in step ---
  if (t.finalScore >= 130 && !t.everDangerous && t.maxGap < RESILIENCE.G0) {
    return {
      id: 'architect',
      label: 'Architect of the Agentic Turn',
      tone: 'exemplary',
      summary:
        `An exemplary run. The firm scaled autonomous capability while keeping every control vector ` +
        `in lockstep — the gap between performance and the weakest of trust, compliance, and ` +
        `auditability never entered dangerous territory. This is the gold standard: ambition and ` +
        `institutional resilience advancing together rather than in tension.`,
    };
  }

  // --- Buffered Aggressor: high score, was aggressive but stayed buffered ---
  if (t.finalScore >= 120 && t.maxGap >= RESILIENCE.G0 && !t.everDangerous) {
    return {
      id: 'buffered_aggressor',
      label: 'The Buffered Aggressor',
      tone: 'strong',
      summary:
        `A strong, aggressive run. The firm pushed performance hard and let the governance gap open ` +
        `at times — but never past the point of control, and the buffers held. This is disciplined ` +
        `aggression: the highest realized value comes not from caution but from scaling fast while ` +
        `keeping the weakest control (here, ${t.weakestVectorEver}) close enough to cash the value in.`,
    };
  }

  // --- Reactive Crisis Manager: recovered from danger ---
  if (t.recoveredFromDanger || t.crisesSurvived >= 2) {
    return {
      id: 'crisis_manager',
      label: 'Reactive Crisis Manager',
      tone: 'mixed',
      summary:
        `A run defined by recovery. Performance outran ${vectorName} into dangerous territory at ` +
        `least once, and the firm clawed back — surviving ${t.crisesSurvived} crisis ` +
        `${t.crisesSurvived === 1 ? 'episode' : 'episodes'}. Survivable, but the realized value lost ` +
        `during each decoupling is value that disciplined sequencing would have kept.`,
    };
  }

  // --- Pragmatic Institutionalist: solid, conservative ---
  if (t.finalScore >= 80) {
    return {
      id: 'pragmatic',
      label: 'Pragmatic Institutionalist',
      tone: 'solid',
      summary:
        `A composed, conservative run. The firm kept its governance gap modest throughout and avoided ` +
        `systemic risk — but a more confident posture on performance, with the buffers it had in place, ` +
        `would have realized a higher ceiling. Safe is not the same as optimal.`,
    };
  }

  // --- Low but not failed ---
  return {
    id: 'underperformer',
    label: 'Cautious Underperformer',
    tone: 'mixed',
    summary:
      `The firm avoided catastrophe but never built momentum. Holding performance low keeps the ` +
      `governance gap comfortable, but it leaves most of the achievable value on the table. The ` +
      `lesson of the agentic turn is not to avoid scaling — it is to scale without outrunning your ` +
      `weakest control.`,
  };
}
