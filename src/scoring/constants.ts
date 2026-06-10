/**
 * SCORING CONSTANTS: single source of truth.
 *
 * Every tunable number in the scoring/difficulty system lives here and ONLY here.
 * The model (model.ts), the explanation modal, and the exported report all read
 * from this file, so the formula can never drift between what the game computes
 * and what it tells the player.
 *
 * These values are deliberate DESIGN choices calibrated for the intended
 * difficulty curve. They are motivated by the human-factors and resilience
 * literature but are not empirically measured parameters. Treat them as the
 * tuning surface: changing the feel of the game means changing numbers here,
 * and nowhere else.
 */

// ---- Resilience factor: rho(gap) ----
// rho is the fraction of generated value the firm can actually REALIZE.
// It is a floored logistic in the governance gap.
export const RESILIENCE = {
  /** Half-decay gap: governance may trail performance by ~this many points
   *  before half of generated value is forfeit. Encodes realistic tolerance. */
  G0: 20,
  /** Slope: gentle, so risk accumulates CONTINUOUSLY across the range (no cliff). */
  K: 0.08,
  /** Resilience floor bounds. The floor scales with the `recoverability` variable:
   *  rho_min = FLOOR_MIN + (FLOOR_MAX - FLOOR_MIN) * (recoverability/100).
   *  A resilient firm fails gracefully; a brittle one is nearly annihilated. */
  FLOOR_MIN: 0.05,
  FLOOR_MAX: 0.25,
} as const;

// ---- Generation modifiers ----
export const GENERATION = {
  /** Alignment (mean of coordination + flexibility) lifts generation by up to this. */
  ALIGNMENT_MAX_LIFT: 0.25,
  /** Interoperability lifts/drags generation by up to this, centered at 50. */
  INTEROP_MAX_SWING: 0.10,
} as const;

// ---- Drags ----
export const DRAGS = {
  /** Vendor dependency above this point shaves generated value (soft, strategic). */
  VENDOR_THRESHOLD: 60,
  /** Per-point fraction shaved above the vendor threshold (max ~-16% at 100). */
  VENDOR_PER_POINT: 0.004,
  /** Workforce strain above this point imposes a flat realized-score penalty (hard). */
  STRAIN_THRESHOLD: 75,
  /** Per-point penalty above the strain threshold. */
  STRAIN_PER_POINT: 3,
} as const;

// ---- Terminal-failure thresholds (independent of score) ----
// A run ENDS in failure, not just a low score, when an anticipatory control
// or a resource fully collapses. These thresholds are calibrated so that reckless
// play fails often while reasonable play almost never does.
export const TERMINAL = {
  TRUST_FLOOR: 20,
  COMPLIANCE_FLOOR: 20,
  STRAIN_CEILING: 90,
  BUDGET_FLOOR: 0,
  POLITICAL_CAPITAL_FLOOR: 0,
} as const;

// ---- Warning zone (one tier above terminal) ----
// When a player enters this zone, the game issues a "recovery quarter" warning
// BEFORE any terminal trigger can fire, so failure is always seen coming and
// is recoverable by an attentive player. This is the core of the "fair" curve.
export const WARNING = {
  TRUST_FLOOR: 28,
  COMPLIANCE_FLOOR: 28,
  STRAIN_CEILING: 82,
  BUDGET_FLOOR: 10,
  POLITICAL_CAPITAL_FLOOR: 10,
} as const;

// ---- Reference archetypes ----
// The model's unit tests assert these scores (±1) so any future change that
// breaks the intended ordering (Rusher < Balanced < Buffered Aggressor) fails loudly.
export const REFERENCE_ARCHETYPES = {
  RUSHER: 32.5,
  BALANCED: 124.4,
  BUFFERED_AGGRESSOR: 157.4,
} as const;
