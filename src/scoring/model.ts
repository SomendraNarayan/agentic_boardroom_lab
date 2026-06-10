/**
 * SCORING MODEL: the single authoritative formula.
 *
 * Score = (Performance + MarketShare) modified by alignment & interoperability,
 *         dragged by vendor dependency, GATED by the weakest governance vector
 *         through a resilience factor, minus a workforce-strain penalty.
 *
 * Governance is a CONSTRAINT on realizing value, not a parallel point bucket:
 * you cannot out-perform a broken control system.
 *
 * Nothing else in the codebase computes scoring math. The explanation modal and
 * the exported report import and display from THIS module only.
 */

import type { HiddenVariables, Resources } from '../types';
import {
  RESILIENCE,
  GENERATION,
  DRAGS,
  TERMINAL,
  WARNING,
} from './constants';

export interface ScoreBreakdown {
  /** Final realized score, >= 0. */
  score: number;
  /** Raw value the firm generated before gating (performance + share, modified). */
  generated: number;
  /** Resilience factor in [rho_min, 1]: the fraction of generated value realized. */
  resilience: number;
  /** Governance gap = performance - weakest governance vector. */
  gap: number;
  /** Which governance vector is the binding (weakest) constraint. */
  weakestVector: 'auditability' | 'compliance' | 'trust';
  /** The numeric value of the weakest vector. */
  weakestValue: number;
  /** The resilience floor in effect (set by recoverability). */
  resilienceFloor: number;
  /** Itemized contributions, for transparent display in the UI. */
  components: {
    base: number;            // performance + marketShare
    alignmentLift: number;   // additional value from coordination/flexibility
    interopLift: number;     // +/- from interoperability
    vendorDrag: number;      // value removed by vendor dependency (>= 0)
    gatingLoss: number;      // value removed by the resilience gate (>= 0)
    strainPenalty: number;   // flat penalty from workforce strain (>= 0)
    penalties: number;       // exogenous penalties passed in
  };
}

/** The governance gate: the weakest of the three anticipatory control vectors. */
export function governanceGate(v: HiddenVariables): {
  value: number;
  vector: 'auditability' | 'compliance' | 'trust';
} {
  const candidates: Array<['auditability' | 'compliance' | 'trust', number]> = [
    ['auditability', v.auditability],
    ['compliance', v.compliance],
    ['trust', v.trust],
  ];
  let best = candidates[0];
  for (const c of candidates) {
    if (c[1] < best[1]) best = c;
  }
  return { vector: best[0], value: best[1] };
}

/** Resilience floor scales with recoverability: brittle firms are annihilated, resilient ones degrade. */
export function resilienceFloor(recoverability: number): number {
  const r = Math.max(0, Math.min(100, recoverability)) / 100;
  return RESILIENCE.FLOOR_MIN + (RESILIENCE.FLOOR_MAX - RESILIENCE.FLOOR_MIN) * r;
}

/** The resilience factor rho(gap) in [floor, 1]. */
export function resilienceFactor(gap: number, recoverability: number): number {
  const floor = resilienceFloor(recoverability);
  return floor + (1 - floor) / (1 + Math.exp(RESILIENCE.K * (gap - RESILIENCE.G0)));
}

/** Compute the full, itemized score breakdown from game state. */
export function computeScore(
  variables: HiddenVariables,
  marketShare: number,
  penalties = 0,
): ScoreBreakdown {
  const gate = governanceGate(variables);
  const gap = variables.performance - gate.value;
  const floor = resilienceFloor(variables.recoverability);
  const rho = resilienceFactor(gap, variables.recoverability);

  // --- Generation ---
  const base = variables.performance + marketShare;
  const alignment = (variables.coordination + variables.flexibility) / 2; // 0..100
  const alignmentFactor = 1 + GENERATION.ALIGNMENT_MAX_LIFT * (alignment / 100);
  const interopFactor =
    1 + GENERATION.INTEROP_MAX_SWING * (variables.interoperability - 50) / 50;

  const afterAlignment = base * alignmentFactor;
  const afterInterop = afterAlignment * interopFactor;

  // --- Vendor drag (soft) ---
  let generated = afterInterop;
  let vendorDrag = 0;
  if (variables.vendorDependency > DRAGS.VENDOR_THRESHOLD) {
    const factor =
      1 - DRAGS.VENDOR_PER_POINT * (variables.vendorDependency - DRAGS.VENDOR_THRESHOLD);
    vendorDrag = generated * (1 - factor);
    generated = generated * factor;
  }

  // --- Gating: the core constraint ---
  const realizedBeforeStrain = generated * rho;
  const gatingLoss = generated - realizedBeforeStrain;

  // --- Workforce strain penalty (hard) ---
  let strainPenalty = 0;
  if (variables.workforceStrain > DRAGS.STRAIN_THRESHOLD) {
    strainPenalty = (variables.workforceStrain - DRAGS.STRAIN_THRESHOLD) * DRAGS.STRAIN_PER_POINT;
  }

  const realized = realizedBeforeStrain - strainPenalty - penalties;
  const score = Math.max(0, Math.round(realized * 10) / 10);

  return {
    score,
    generated: Math.round(generated * 10) / 10,
    resilience: Math.round(rho * 1000) / 1000,
    gap: Math.round(gap * 10) / 10,
    weakestVector: gate.vector,
    weakestValue: gate.value,
    resilienceFloor: Math.round(floor * 1000) / 1000,
    components: {
      base: Math.round(base * 10) / 10,
      alignmentLift: Math.round((afterAlignment - base) * 10) / 10,
      interopLift: Math.round((afterInterop - afterAlignment) * 10) / 10,
      vendorDrag: Math.round(vendorDrag * 10) / 10,
      gatingLoss: Math.round(gatingLoss * 10) / 10,
      strainPenalty: Math.round(strainPenalty * 10) / 10,
      penalties,
    },
  };
}

/** Convenience: just the integer score, for places that only need the number. */
export function scoreValue(
  variables: HiddenVariables,
  marketShare: number,
  penalties = 0,
): number {
  return Math.round(computeScore(variables, marketShare, penalties).score);
}

export interface TerminalStatus {
  failed: boolean;
  reasons: string[];
}

/** Terminal-failure check (independent of score). */
export function checkTerminal(v: HiddenVariables, resources: Resources): TerminalStatus {
  const reasons: string[] = [];
  if (v.trust < TERMINAL.TRUST_FLOOR)
    reasons.push('Trust collapse — workforce revolt and public legitimacy crisis');
  if (v.compliance < TERMINAL.COMPLIANCE_FLOOR)
    reasons.push('Regulatory shutdown — compliance fell below the survivable floor');
  if (v.workforceStrain > TERMINAL.STRAIN_CEILING)
    reasons.push('Workforce terminal crisis — strain became unmanageable');
  if (resources.budget <= TERMINAL.BUDGET_FLOOR) reasons.push('Insolvency — budget exhausted');
  if (resources.politicalCapital <= TERMINAL.POLITICAL_CAPITAL_FLOOR)
    reasons.push('Loss of mandate — political capital exhausted');
  return { failed: reasons.length > 0, reasons };
}

export interface WarningStatus {
  warned: boolean;
  reasons: string[];
}

/** Warning-zone check: fires a recovery-quarter alert BEFORE any terminal trigger. */
export function checkWarning(v: HiddenVariables, resources: Resources): WarningStatus {
  const reasons: string[] = [];
  if (v.trust < WARNING.TRUST_FLOOR && v.trust >= TERMINAL.TRUST_FLOOR)
    reasons.push('Trust is approaching the danger floor');
  if (v.compliance < WARNING.COMPLIANCE_FLOOR && v.compliance >= TERMINAL.COMPLIANCE_FLOOR)
    reasons.push('Compliance is approaching the regulatory floor');
  if (v.workforceStrain > WARNING.STRAIN_CEILING && v.workforceStrain <= TERMINAL.STRAIN_CEILING)
    reasons.push('Workforce strain is approaching crisis');
  if (resources.budget <= WARNING.BUDGET_FLOOR && resources.budget > TERMINAL.BUDGET_FLOOR)
    reasons.push('Budget reserves are nearly depleted');
  if (
    resources.politicalCapital <= WARNING.POLITICAL_CAPITAL_FLOOR &&
    resources.politicalCapital > TERMINAL.POLITICAL_CAPITAL_FLOOR
  )
    reasons.push('Political capital is nearly depleted');
  return { warned: reasons.length > 0, reasons };
}
