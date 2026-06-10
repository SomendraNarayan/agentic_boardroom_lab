// Standalone verification harness (run with tsx). Not a formal test runner;
// asserts the reference archetypes reproduce so the intended ordering can't silently break.
import { computeScore } from './model';
import { REFERENCE_ARCHETYPES } from './constants';
import type { HiddenVariables } from '../types';

const rusher: HiddenVariables = { performance:90, auditability:30, compliance:65, trust:70,
  coordination:60, flexibility:55, interoperability:60, recoverability:40,
  workforceStrain:70, vendorDependency:55 };
const balanced: HiddenVariables = { performance:70, auditability:66, compliance:68, trust:72,
  coordination:70, flexibility:68, interoperability:65, recoverability:70,
  workforceStrain:45, vendorDependency:40 };
const buffered: HiddenVariables = { performance:95, auditability:84, compliance:85, trust:88,
  coordination:85, flexibility:82, interoperability:80, recoverability:85,
  workforceStrain:50, vendorDependency:35 };

let pass = true;
function check(name: string, v: HiddenVariables, ms: number, expected: number) {
  const r = computeScore(v, ms);
  const ok = Math.abs(r.score - expected) <= 1.0;
  pass = pass && ok;
  console.log(`${ok?'PASS':'FAIL'}  ${name.padEnd(20)} score=${r.score.toFixed(1)} (exp ${expected})  rho=${r.resilience}  gap=${r.gap}  weakest=${r.weakestVector}`);
}

check('Rusher', rusher, 80, REFERENCE_ARCHETYPES.RUSHER);
check('Balanced', balanced, 55, REFERENCE_ARCHETYPES.BALANCED);
check('Buffered Aggressor', buffered, 70, REFERENCE_ARCHETYPES.BUFFERED_AGGRESSOR);

// Ordering invariant
const sR = computeScore(rusher,80).score, sB = computeScore(balanced,55).score, sBuf = computeScore(buffered,70).score;
const ordered = sR < sB && sB < sBuf;
console.log(`${ordered?'PASS':'FAIL'}  Ordering: Rusher(${sR}) < Balanced(${sB}) < Buffered(${sBuf})`);
pass = pass && ordered;

console.log(pass ? '\nALL CHECKS PASS' : '\nSOME CHECKS FAILED');
process.exit(pass ? 0 : 1);
