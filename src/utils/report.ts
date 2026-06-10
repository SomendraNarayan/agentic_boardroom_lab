import { GameState, HiddenVariables } from '../types';
import { computeScore, governanceGate } from '../scoring/model';
import { deriveProfile } from '../scoring/profiles';

// Lightweight HTML-escape for any value interpolated into the exported HTML report.
// All dynamic strings (profile text, decision labels, scenario titles) pass through this
// so the export can never become an XSS vector even if scenario content changes.
const esc = (s: unknown): string =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const getRating = (variables: HiddenVariables) => {
  // Rating reflects the realized balance, gated by the weakest governance vector —
  // consistent with the live scoring model (no separate, drifting composite).
  const gate = governanceGate(variables);
  const balance = (variables.performance + gate.value) / 2;
  if (balance > 78 && variables.performance - gate.value < 20)
    return { label: 'Architect of the Agentic Turn', color: 'text-emerald-600' };
  if (balance > 62) return { label: 'Pragmatic Institutionalist', color: 'text-blue-600' };
  if (balance > 48) return { label: 'Reactive Crisis Manager', color: 'text-amber-600' };
  return { label: 'Governance Failure', color: 'text-rose-600' };
};

export const downloadResults = (state: GameState, format: 'txt' | 'csv' | 'html') => {
  const { variables, stakeholders, history } = state;
  let content = '';
  const now = new Date();
  const timestamp = now.toLocaleString();
  const filename = `ADT_boardroom_lab_report_${now.toISOString().replace(/[:.]/g, '-')}`;
  const rating = getRating(variables);

  if (format === 'html') {
    const getStrategicComments = () => {
      let commentHtml = '';
      const gateR = governanceGate(variables);
      const gapValue = Math.max(0, Math.round(variables.performance - gateR.value));
      
      if (rating.label === 'Architect of the Agentic Turn') {
        commentHtml += `
          <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-slate-800 space-y-4">
            <h4 class="text-sm font-black text-emerald-900 uppercase">🏆 ADTL Director's Commendation</h4>
            <p class="text-sm leading-relaxed">
              Your performance in managing the transition was exemplary. You navigated the "Bridgerton Paradox" by ensuring that as agent autonomy scaled, your firm's governance, audit traces, and employee safety protocols grew in lockstep. This is the gold standard for executive leadership in the agentic era.
            </p>
          </div>
        `;
      } else if (rating.label === 'Pragmatic Institutionalist') {
        commentHtml += `
          <div class="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-slate-800 space-y-4">
            <h4 class="text-sm font-black text-blue-900 uppercase">📊 Balanced Transition Commentary</h4>
            <p class="text-sm leading-relaxed">
              You demonstrated solid strategic composure. By maintaining key institutional variables close to the safety threshold, you avoided market panic and systemic crashes. However, a slightly more agile posture on interoperability and agent sequencing could have unlocked higher market dominance.
            </p>
          </div>
        `;
      } else {
        commentHtml += `
          <div class="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-slate-800 space-y-4">
            <h4 class="text-sm font-black text-amber-900 uppercase">⚠️ Warning: Operational Exposure</h4>
            <p class="text-sm leading-relaxed">
              Your trajectory shows high volatile risk. Pushing operational throughput at the expense of auditability or regulatory alignment triggered severe Autonomy-Governance Gap penalties. In real corporate environments, this exposure invites high-severity regulatory audits, litigation, and talent flight.
            </p>
          </div>
        `;
      }

      if (gapValue > 20) {
        commentHtml += `
          <div class="p-6 bg-rose-50 rounded-2xl border border-rose-100 text-slate-800 space-y-2 mt-4">
            <h4 class="text-sm font-black text-rose-900 uppercase">⚠️ Critical Vulnerability: The Autonomy-Governance Gap</h4>
            <p class="text-sm leading-relaxed">
              An Autonomy-Governance Gap of <strong>${gapValue} points</strong> was logged. Pushing execution speed faster than you can trace, explain, or legal-review agent actions created severe alignment friction. Future iterations require scaling your control frameworks first.
            </p>
          </div>
        `;
      }
      return commentHtml;
    };

    content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agentic Boardroom Laboratory trajectory Dossier</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Space Grotesk', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-50 text-slate-900 font-sans min-h-screen antialiased py-12">
  <div class="max-w-5xl mx-auto px-6 space-y-12">
    
    <!-- Academic Header Banner -->
    <header class="bg-slate-900 text-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-black/80"></div>
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8 mb-8">
        <div>
          <span class="text-xs font-black tracking-[0.3em] text-indigo-400 uppercase">Executive Education laboratory</span>
          <h1 class="text-4xl md:text-5xl font-black font-display tracking-tight mt-1">The Agentic Boardroom</h1>
          <p class="text-slate-400 text-sm font-medium mt-2">Amsterdam Digital Transformation Lab (ADTL) • Amsterdam Business School</p>
        </div>
        <div class="px-6 py-4 bg-white/5 rounded-3xl border border-white/10 text-center shrink-0">
          <p class="text-[9px] font-black uppercase text-slate-500 tracking-widest">Simulation Date</p>
          <p class="text-sm font-bold mt-1 text-white">${timestamp}</p>
        </div>
      </div>
      <div class="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Strategic Sector</p>
          <p class="text-lg font-bold text-white mt-1">${state.sector}</p>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Score</p>
          <p class="text-2xl font-black text-indigo-300 mt-1">${state.totalScore}</p>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Market Share</p>
          <p class="text-2xl font-black text-white mt-1">${state.marketShare}%</p>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Grade</p>
          <p class="text-lg font-black text-emerald-400 mt-1">${esc(deriveProfile(state).label)}</p>
        </div>
      </div>
    </header>

    <!-- Rating Commendation Box -->
    <div class="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-10">
      <div class="w-24 h-24 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
      </div>
      <div class="space-y-2 text-center md:text-left">
        <span class="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Strategic Leadership Verdict</span>
        <h2 class="text-3xl font-black text-slate-900 tracking-tight">${esc(rating.label)}</h2>
        <p class="text-sm text-slate-500 font-medium leading-relaxed">
          Operational performance is sitting at <strong>${variables.performance}%</strong> while maintaining a compliance indicator of <strong>${variables.compliance}%</strong>. This document outlines your active pathway.
        </p>
      </div>
    </div>

    <!-- Multi-Column Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Metrics & Balance Indicator -->
      <div class="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 space-y-8">
        <h3 class="text-lg font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4">Strategic KPI Trajectory</h3>
        <div class="grid md:grid-cols-2 gap-8">
          ${[
            { label: 'Operational Performance', val: variables.performance, color: 'bg-amber-500', desc: 'Agent throughput and task execution rates' },
            { label: 'Institutional Trust', val: variables.trust, color: 'bg-rose-500', desc: 'Workforce sentiment, client satisfaction, and trust' },
            { label: 'Regulatory Compliance', val: variables.compliance, color: 'bg-emerald-500', desc: 'Legal alignment and algorithmic safeguards' },
            { label: 'Systemic Flexibility', val: variables.flexibility, color: 'bg-indigo-500', desc: 'Modular vendor isolation and quick pivots' },
            { label: 'Technical Interoperability', val: variables.interoperability, color: 'bg-blue-500', desc: 'Unified API schemas and semantic standards' },
            { label: 'Auditability & Control', val: variables.auditability, color: 'bg-slate-900', desc: 'Deep tracer logs for explanation' },
          ].map(k => `
            <div class="space-y-2">
              <div class="flex justify-between items-end">
                <div>
                  <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider">${esc(k.label)}</span>
                  <p class="text-[10px] text-slate-500 leading-none">${k.desc}</p>
                </div>
                <span class="text-xl font-black text-slate-900">${k.val}%</span>
              </div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full ${k.color}" style="width: ${k.val}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Director Feedback & Remarks -->
      <div class="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">Expert Faculty Evaluation</h3>
          <div class="space-y-4">
            ${getStrategicComments()}
          </div>
        </div>
        <div class="pt-8 border-t border-slate-100 text-center md:text-left mt-6">
          <p class="text-sm font-bold text-slate-900">Dr. Somendra Narayan</p>
          <p class="text-[10px] text-slate-400 font-semibold leading-none mt-1">Director, Amsterdam Digital Transformation Lab</p>
        </div>
      </div>

    </div>

    <!-- Detailed Trajectory Table -->
    <div class="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 space-y-8">
      <div>
        <h3 class="text-xl font-black text-slate-900 tracking-tight">Quarterly Action Log & Tactical Audit</h3>
        <p class="text-sm text-slate-500 font-medium">Full historical trace of executive decisions logged across the simulated quarters.</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th class="py-4 pr-4">Quarter</th>
              <th class="py-4">Strategic Scenario Encountered</th>
              <th class="py-4">Executive Choice Logged</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 text-sm">
            ${history.map(h => `
              <tr class="hover:bg-slate-50/50 transition-colors">
                <td class="py-5 pr-4 font-black text-slate-900 font-mono">Q${h.roundId}</td>
                <td class="py-5 pr-6">
                  <span class="font-bold text-slate-900">${esc(h.scenarioTitle)}</span>
                </td>
                <td class="py-5">
                  <span class="font-mono bg-slate-900 text-slate-100 text-xs px-3 py-1.5 rounded-xl font-bold inline-block">${esc(h.decisionLabel)}</span>
                </td>
              </tr>
            `).join('')}
            ${history.length === 0 ? `
              <tr>
                <td colspan="3" class="py-8 text-center text-slate-400 italic">No directives have been logged yet. Complete the first Quarter's agenda to compile actions.</td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer Disclaimer -->
    <footer class="text-center text-slate-400 text-xs space-y-2 pb-12">
      <p>Amsterdam Digital Transformation Lab (ADTL) • University of Amsterdam School of Business</p>
      <p class="italic">Author: Dr. Somendra Narayan, 2025. This certificate confirms active simulation completion.</p>
    </footer>

  </div>
</body>
</html>`;
  } else if (format === 'txt') {
    content = `AGENT GOVERNANCE BOARDROOM - EXECUTIVE REPORT\n`;
    content += `====================================================\n`;
    content += `Generated on: ${timestamp}\n`;
    content += `Player: ${state.sector} Sector Lead\n`;
    content += `====================================================\n\n`;
    content += `CURRENT VERDICT: ${rating.label}\n`;
    content += `STRATEGIC SCORE: ${state.totalScore}\n`;
    content += `MARKET POSITION: ${state.marketShare}%\n\n`;
    
    content += `STRATEGIC KPIs\n`;
    content += `--------------\n`;
    content += `Operational Performance: ${variables.performance}%\n`;
    content += `Institutional Trust: ${variables.trust}%\n`;
    content += `Regulatory Compliance: ${variables.compliance}%\n`;
    content += `Systemic Flexibility: ${variables.flexibility}%\n`;
    content += `Technical Interoperability: ${variables.interoperability}%\n`;
    content += `Auditability & Control: ${variables.auditability}%\n\n`;

    content += `STAKEHOLDER SENTIMENT\n`;
    content += `---------------------\n`;
    stakeholders.forEach(s => {
      content += `${s.name}: ${s.sentiment}%\n`;
    });
    content += `\n`;

    content += `EXECUTIVE COMMENTARY\n`;
    content += `--------------------\n`;
    content += state.marketShare > 35 ? "Market Dominance: You have successfully navigated the agentic turn, establishing your firm as the benchmark for AI governance.\n" : 
               state.marketShare > 20 ? "Competitive Stability: Your balanced approach has secured a future for the firm, though risks remain in the tail-end of the transition.\n" : 
               "Strategic Marginalization: Failure to decisively lead on agentic protocols has left the firm vulnerable to disruption.\n";
    content += `\n`;

    content += `DECISION LOG\n`;
    content += `------------\n`;
    history.forEach((h) => {
      content += `[Q${h.roundId}] ${h.scenarioTitle}\n`;
      content += `      Decision: ${h.decisionLabel}\n\n`;
    });
    if (history.length === 0) {
      content += `(No quarters logged yet)\n`;
    }
  } else {
    content = `Timestamp,Metric,Value\n`;
    content += `"${timestamp}",Rating,"${rating.label}"\n`;
    content += `"${timestamp}",Total Score,${state.totalScore}\n`;
    content += `"${timestamp}",Market Share,${state.marketShare}\n`;
    
    content += `\nMetric,Value\n`;
    content += `Performance,${variables.performance}\n`;
    content += `Trust,${variables.trust}\n`;
    content += `Compliance,${variables.compliance}\n`;
    content += `Flexibility,${variables.flexibility}\n`;
    content += `Interoperability,${variables.interoperability}\n`;
    content += `Auditability,${variables.auditability}\n`;

    content += `\nStakeholder,Sentiment\n`;
    stakeholders.forEach(s => {
      content += `"${s.name}",${s.sentiment}\n`;
    });

    content += `\nRound,Scenario,Decision\n`;
    history.forEach(h => {
      content += `${h.roundId},"${h.scenarioTitle.replace(/"/g, '""')}","${h.decisionLabel.replace(/"/g, '""')}"\n`;
    });
  }

  const mimeType = format === 'html' ? 'text/html' : format === 'txt' ? 'text/plain' : 'text/csv';
  const extension = format;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
