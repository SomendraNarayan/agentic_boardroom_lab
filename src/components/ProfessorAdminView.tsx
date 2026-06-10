import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Settings, 
  Sparkles, 
  GraduationCap, 
  Database,
  RefreshCw,
  Sliders,
  Scale,
  Award
} from 'lucide-react';
import { 
  getSecurityState, 
  saveSecurityState, 
  getDynamicYearPasskeys, 
  CustomPasscode, 
  SecurityState,
  sha256
} from '../config/security';
import { GameState } from '../types';

interface ProfessorAdminViewProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onNavigateToGame?: (view: 'dashboard' | 'scenario') => void;
}

export const ProfessorAdminView: React.FC<ProfessorAdminViewProps> = ({ gameState, setGameState, onNavigateToGame }) => {
  const [securityProfile, setSecurityProfile] = useState<SecurityState>(getSecurityState());
  const [newLabel, setNewLabel] = useState('');
  const [newCode, setNewCode] = useState('');
  const [isHashed, setIsHashed] = useState(false);
  const [showPlaintext, setShowPlaintext] = useState<{ [key: string]: boolean }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  
  // Sandbox state controls
  const [sandboxPerformance, setSandboxPerformance] = useState(gameState.variables.performance);
  const [sandboxTrust, setSandboxTrust] = useState(gameState.variables.trust);
  const [sandboxCompliance, setSandboxCompliance] = useState(gameState.variables.compliance);
  const [sandboxBudget, setSandboxBudget] = useState(gameState.resources.budget);
  const [sandboxCapital, setSandboxCapital] = useState(gameState.resources.politicalCapital);
  const [sandboxShare, setSandboxShare] = useState(gameState.marketShare);

  useEffect(() => {
    setSandboxPerformance(gameState.variables.performance);
    setSandboxTrust(gameState.variables.trust);
    setSandboxCompliance(gameState.variables.compliance);
    setSandboxBudget(gameState.resources.budget);
    setSandboxCapital(gameState.resources.politicalCapital);
    setSandboxShare(gameState.marketShare);
  }, [gameState]);

  // Synchronize state back
  const updateSecurityState = (newState: SecurityState) => {
    setSecurityProfile(newState);
    saveSecurityState(newState);
  };

  const handleToggleGlobalGate = () => {
    const updated = {
      ...securityProfile,
      isEnabled: !securityProfile.isEnabled
    };
    updateSecurityState(updated);
  };

  const handleToggleDefaultKeys = () => {
    const updated = {
      ...securityProfile,
      allowDefaultKeys: !securityProfile.allowDefaultKeys
    };
    updateSecurityState(updated);
  };

  const handleAddCustomKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newCode.trim()) return;

    let codeToSave = newCode.trim();
    if (isHashed) {
      codeToSave = await sha256(codeToSave);
    }

    const newKey: CustomPasscode = {
      id: 'custom-' + Date.now(),
      code: codeToSave,
      isHashed,
      label: newLabel.trim(),
      createdOn: new Date().toLocaleDateString()
    };

    const updated = {
      ...securityProfile,
      customKeys: [...securityProfile.customKeys, newKey]
    };

    updateSecurityState(updated);
    setNewLabel('');
    setNewCode('');
    setIsHashed(false);
  };

  const handleDeleteKey = (id: string) => {
    const updated = {
      ...securityProfile,
      customKeys: securityProfile.customKeys.filter(k => k.id !== id)
    };
    updateSecurityState(updated);
  };

  const toggleShowPlaintext = (id: string) => {
    setShowPlaintext(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyKey = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyInviteLink = (code: string) => {
    const url = `${window.location.origin}${window.location.pathname}?passcode=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(code);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Export JSON Profile
  const handleExportProfile = () => {
    const jsonString = JSON.stringify(securityProfile, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `adtl-boardroom-security-profile-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  // Import JSON Profile
  const handleImportProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    setImportSuccess(false);

    try {
      const parsed = JSON.parse(importJson);
      if (typeof parsed.isEnabled !== 'boolean' || !Array.isArray(parsed.customKeys)) {
        throw new Error('JSON scheme validation failed. Missing required fields.');
      }

      updateSecurityState(parsed);
      setImportSuccess(true);
      setImportJson('');
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err: any) {
      setImportError(err.message || 'Malformed JSON format. Please verify structure.');
    }
  };

  // Apply sandbox variables to real gameState
  const handleApplySandbox = () => {
    setGameState(prev => {
      const vars = {
        ...prev.variables,
        performance: sandboxPerformance,
        trust: sandboxTrust,
        compliance: sandboxCompliance
      };
      
      const resources = {
        ...prev.resources,
        budget: sandboxBudget,
        politicalCapital: sandboxCapital
      };

      // Recalculate score dynamically
      const baseScore = (vars.performance * 2.5) + (vars.trust * 2) + (vars.compliance * 2);
      const governanceAverage = (vars.auditability + vars.compliance + vars.trust) / 3;
      const gap = Math.max(0, vars.performance - governanceAverage);
      const gapPenalty = gap > 20 ? Math.pow(gap - 20, 1.5) * 2 : 0;
      const trustPenalty = vars.trust < 30 ? (30 - vars.trust) * 10 : 0;
      const compliancePenalty = vars.compliance < 30 ? (30 - vars.compliance) * 10 : 0;
      const resourceEfficiency = (resources.budget + resources.politicalCapital) / 2;
      const marketDominance = sandboxShare * 15;
      const alignmentBonus = (vars.coordination + vars.flexibility) / 2;

      const finalScore = Math.round(
        baseScore + 
        resourceEfficiency + 
        marketDominance + 
        alignmentBonus - 
        gapPenalty - 
        trustPenalty - 
        compliancePenalty
      );

      return {
        ...prev,
        variables: vars,
        resources,
        marketShare: sandboxShare,
        totalScore: Math.max(0, finalScore),
        logs: [...prev.logs, `[FACULTY SANDBOX ALERT] Variable state adjusted by administrator action.`]
      };
    });
  };

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 md:px-8">
      {/* Faculty Headers */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1 text-indigo-600">
            <GraduationCap size={18} />
            <span className="text-[10px] uppercase font-black tracking-widest leading-none">Amsterdam Digital Transformation Lab</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Faculty Administrator Panel</h1>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
            Maintain classroom access, customize gating keys on GitHub Pages, and audit simulation parameters securely.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {onNavigateToGame && (
            <button 
              onClick={() => onNavigateToGame('dashboard')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer shadow-sm shadow-indigo-600/10"
              title="Enter active student boardroom simulation"
            >
              <Sparkles size={14} className="shrink-0" /> Play Student Game
            </button>
          )}
          <button 
            onClick={() => {
              sessionStorage.removeItem('abs_boardroom_unlocked');
              sessionStorage.removeItem('abs_boardroom_admin');
              window.location.reload();
            }}
            className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-100 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
            title="Locks classroom view instantly to gate portal screen"
          >
            <Shield size={14} className="shrink-0" /> Lock Dashboard
          </button>
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
            <Shield size={14} className="shrink-0" /> session: Faculty Admin Mode
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Passkey Gate Customization */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quick Access Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Gating Portal Status */}
            <div className={`p-6 rounded-[2rem] border transition-colors ${
              securityProfile.isEnabled 
                ? 'bg-slate-900 text-white border-slate-800' 
                : 'bg-slate-50 text-slate-900 border-slate-200'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Startup Portal Lock</p>
                  <h3 className="text-xl font-black mt-1">
                    {securityProfile.isEnabled ? "ACTIVE GATING" : "BYPASSED / OPEN"}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-xl ${securityProfile.isEnabled ? 'bg-indigo-600/35' : 'bg-slate-200'}`}>
                  <Key size={16} />
                </div>
              </div>
              <p className="text-[10px] mt-4 opacity-75 font-semibold leading-relaxed">
                Requires students to present program invitation credentials on game entrance. Keep true in live courses.
              </p>
              <button 
                onClick={handleToggleGlobalGate}
                className={`mt-4 w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-transform active:scale-[0.98] ${
                  securityProfile.isEnabled 
                    ? 'bg-white text-slate-900 hover:bg-slate-100' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {securityProfile.isEnabled ? "Bypass Gateway Gate" : "Enable Gateway Gate"}
              </button>
            </div>

            {/* Card 2: Classroom Default Keys */}
            <div className={`p-6 rounded-[2rem] border transition-all ${
              securityProfile.allowDefaultKeys 
                ? 'bg-indigo-950 text-white border-indigo-900' 
                : 'bg-slate-50 text-slate-900 border-slate-200'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Default Academic Keys</p>
                  <h3 className={`text-xl font-black mt-1 ${securityProfile.allowDefaultKeys ? 'text-white' : 'text-slate-900'}`}>
                    {securityProfile.allowDefaultKeys ? "ABS / ADTL Dynamic Allowed" : "DEACTIVATED"}
                  </h3>
                </div>
                <div className="p-2.5 bg-indigo-900/40 rounded-xl text-indigo-400">
                  <Sliders size={16} />
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <label className="text-[8px] font-black uppercase opacity-75">Prefix key</label>
                    <input 
                      type="text"
                      className="w-full bg-indigo-900/30 border border-indigo-800 text-white focus:border-indigo-400 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest focus:outline-none placeholder-indigo-400"
                      value={securityProfile.defaultKeyPrefix || "ABS"}
                      onChange={(e) => {
                        const updated = {
                          ...securityProfile,
                          defaultKeyPrefix: e.target.value.toUpperCase().trim()
                        };
                        updateSecurityState(updated);
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[8px] font-black uppercase opacity-75">Start Year</label>
                    <input 
                      type="number"
                      className="w-full bg-indigo-900/30 border border-indigo-800 text-white focus:border-indigo-400 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                      value={securityProfile.defaultYearStart || 2026}
                      onChange={(e) => {
                        const updated = {
                          ...securityProfile,
                          defaultYearStart: parseInt(e.target.value) || 2026
                        };
                        updateSecurityState(updated);
                      }}
                    />
                  </div>
                </div>
                <p className="text-[10px] opacity-75 font-semibold leading-relaxed">
                  Generates keys like <strong>{(securityProfile.defaultKeyPrefix || "ABS") + (securityProfile.defaultYearStart || 2026)}</strong> and <strong>{"ADTL" + (securityProfile.defaultYearStart || 2026)}</strong>.
                </p>
              </div>

              <button 
                onClick={handleToggleDefaultKeys}
                className="mt-4 w-full py-2.5 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-transform active:scale-[0.98]"
              >
                {securityProfile.allowDefaultKeys ? "Disable Default Keys" : "Enable Default Keys"}
              </button>
            </div>
            
          </div>

          {/* Custom Invite Passcode Orchestrator */}
          <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Plus size={16} /></div>
                <div>
                  <h3 className="font-black text-slate-900">Custom Invitations Keys</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Generate seminar-specific group passkeys.</p>
                </div>
              </div>
              <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider">
                {securityProfile.customKeys.length} Custom Keys
              </span>
            </div>

            {/* Creation Form */}
            <form onSubmit={handleAddCustomKey} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Seat / Student Group Label</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Executive Seminar B"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none transition-all"
                />
              </div>
              
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Passcode Key (Plaintext)</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. STRATEGY-LAB-2"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-mono font-bold focus:outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 pb-2.5 flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="chk-hash"
                  checked={isHashed}
                  onChange={(e) => setIsHashed(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-350 rounded"
                />
                <label htmlFor="chk-hash" className="text-[10px] font-black text-slate-500 uppercase tracking-wide cursor-pointer flex items-center gap-1">
                  SHA-255 Hash <Sparkles size={10} className="text-indigo-500" />
                </label>
              </div>

              <button 
                type="submit"
                className="md:col-span-2 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest shadow-md transition-transform active:scale-95 duration-150"
              >
                Add Key
              </button>
            </form>

            {/* Custom Keys Table */}
            {securityProfile.customKeys.length > 0 ? (
              <div className="mt-8 border border-slate-150 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-150">
                    <tr>
                      <th className="px-5 py-3.5">Group / Context</th>
                      <th className="px-5 py-3.5">Key Identity</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions / Orchestrations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {securityProfile.customKeys.map((key) => {
                      const isPlainVisible = showPlaintext[key.id] || !key.isHashed;
                      const hasCopied = copiedKey === key.id;
                      const linkCopied = copiedLink === key.code;

                      return (
                        <tr key={key.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-bold text-slate-900">{key.label}</p>
                              <p className="text-[9px] text-slate-400">Created: {key.createdOn}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-mono font-bold text-xs select-all">
                            {isPlainVisible ? (
                              key.code
                            ) : (
                              <span className="text-slate-400 text-xs">•••••••• (SHA-256 protected)</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${
                              key.isHashed 
                                ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {key.isHashed ? 'Hashed Entry' : 'Plaintext Access'}
                            </span>
                          </td>
                          <td className="px-5 py-4 ">
                            <div className="flex items-center justify-end gap-2 text-right">
                              {key.isHashed && (
                                <button
                                  onClick={() => toggleShowPlaintext(key.id)}
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                                  title="Toggle Plaintext Preview"
                                >
                                  {showPlaintext[key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleCopyInviteLink(key.code)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-colors ${
                                  linkCopied 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                    : 'bg-white border-slate-250 hover:bg-slate-50 text-slate-600'
                                }`}
                                title="Copy direct student access link"
                              >
                                {linkCopied ? <Check size={10} /> : <Copy size={10} />}
                                {linkCopied ? 'Copied URL!' : 'Bypass URL'}
                              </button>

                              <button
                                onClick={() => handleDeleteKey(key.id)}
                                className="p-2 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete invitation key"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-xs text-slate-450 font-semibold">
                No custom passkeys yet. Create one above to distribute invitations dynamically.
              </div>
            )}

            {/* Auto active dynamic indicator checklist */}
            <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl">
              <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2">Native Self-Sustaining Year Locks</h4>
              <div className="text-[11px] text-slate-600 space-y-2 leading-relaxed">
                <p>
                  To secure complete academic longevity, this dashboard registers automatic key sequences in the format of <strong>"{securityProfile.defaultKeyPrefix || "ABS"}" + [Year]</strong>.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {getDynamicYearPasskeys(securityProfile).slice(0, 8).map((k) => (
                    <span key={k} className="px-2 py-0.5 font-mono text-[9px] font-black bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md">
                      {k}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 font-mono text-[9px] font-black bg-slate-100 border border-slate-200 text-slate-500 rounded-md">
                    ... up to {securityProfile.defaultKeyPrefix || "ABS"}{(securityProfile.defaultYearStart || 2026) + 10}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Export/Import Profile Center */}
          <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 flex items-center gap-2">
                <Download size={16} className="text-indigo-600" /> Export Profile Schema
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Since this application matches credentials purely client-side to ensure static safety, download your active custom passkey roster to your device as a JSON state backup.
              </p>
              <button 
                onClick={handleExportProfile}
                className="flex items-center gap-2 px-5 py-3 bg-slate-905 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest transition-transform active:scale-[0.98]"
              >
                <Download size={14} /> Download Configuration (.json)
              </button>
            </div>

            <form onSubmit={handleImportProfile} className="space-y-4">
              <h4 className="font-black text-slate-900 flex items-center gap-2">
                <Upload size={16} className="text-indigo-600" /> Import Profile Schema
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Restore keys instantly on another coordinator's laptop or browser by pasting your configuration JSON profile payload below:
              </p>
              <textarea 
                rows={2}
                placeholder='Paste raw configuration JSON here...'
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl p-3 text-[10px] font-mono focus:outline-none transition-all"
              />
              <div className="flex justify-between items-center gap-4">
                {importError && (
                  <span className="text-[10px] text-rose-500 font-bold max-w-[60%]">{importError}</span>
                )}
                {importSuccess && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check size={12} /> Config applied.
                  </span>
                )}
                <button 
                  type="submit"
                  disabled={!importJson.trim()}
                  className="ml-auto flex items-center gap-2 px-5 py-3 bg-indigo-604 bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 text-white hover:bg-indigo-500 rounded-xl text-xs font-black uppercase tracking-widest transition-transform active:scale-[0.98]"
                >
                  Apply Profile Schema
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Side: Live Sandbox Variables Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-slate-900 text-white rounded-[2rem] border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Sliders className="text-indigo-400" size={18} />
              <div>
                <h3 className="font-black">Dynamic Sim Sandbox</h3>
                <p className="text-[9px] text-slate-400 font-semibold uppercase">Real-time classroom sandbox</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
              Adjust any live variables below to demonstrate strategic effects, trigger penalties for classroom slides, or debug student milestones immediately.
            </p>

            <div className="space-y-4">
              
              {/* slider 1: Performance */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Performance</span>
                  <span className="text-indigo-400 font-mono font-bold">{sandboxPerformance}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxPerformance}
                  onChange={(e) => setSandboxPerformance(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-850 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* slider 2: Trust */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Human Trust</span>
                  <span className="text-indigo-400 font-mono font-bold">{sandboxTrust}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxTrust}
                  onChange={(e) => setSandboxTrust(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-850 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* slider 3: Compliance */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Legal Compliance</span>
                  <span className="text-indigo-400 font-mono font-bold">{sandboxCompliance}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxCompliance}
                  onChange={(e) => setSandboxCompliance(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-850 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* slider 4: Budget */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Budget Reserve (€M)</span>
                  <span className="text-indigo-400 font-mono font-bold">{sandboxBudget}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxBudget}
                  onChange={(e) => setSandboxBudget(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-850 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* slider 5: Capital */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Political Capital</span>
                  <span className="text-indigo-400 font-mono font-bold">{sandboxCapital}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={sandboxCapital}
                  onChange={(e) => setSandboxCapital(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-850 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* slider 6: Share */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Market Share (%)</span>
                  <span className="text-indigo-400 font-mono font-bold">{sandboxShare}</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="85"
                  value={sandboxShare}
                  onChange={(e) => setSandboxShare(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-850 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Real-time Score preview helper */}
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest block leading-none">Simulated Index Score</span>
                  <span className="text-2xl font-black text-white leading-tight">
                    {Math.round(
                      (sandboxPerformance * 2.5) + (sandboxTrust * 2) + (sandboxCompliance * 2) + 
                      ((sandboxBudget + sandboxCapital) / 2) + (sandboxShare * 15) - 
                      (Math.max(0, sandboxPerformance - (80 + sandboxCompliance + sandboxTrust) / 3) > 20 ? 50 : 0) // rough gap visual preview
                    )}
                  </span>
                </div>
                <div className="text-indigo-400 font-mono text-[9px] uppercase font-black tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                  preview formulas
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button 
                  onClick={handleApplySandbox}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95 duration-100"
                >
                  Apply Variables
                </button>
                <button 
                  onClick={() => {
                    setSandboxPerformance(gameState.variables.performance);
                    setSandboxTrust(gameState.variables.trust);
                    setSandboxCompliance(gameState.variables.compliance);
                    setSandboxBudget(gameState.resources.budget);
                    setSandboxCapital(gameState.resources.politicalCapital);
                    setSandboxShare(gameState.marketShare);
                  }}
                  className="px-4 py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                  title="Reload real gameplay states"
                >
                  <RefreshCw size={12} />
                </button>
              </div>

            </div>
          </div>

          <div className="p-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-[2rem] space-y-2 max-w-sm animate-fade-in">
            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
              <AlertTriangle size={14} className="text-amber-600" />
              Administrative Warning
            </h4>
            <p className="text-[10px] font-semibold leading-relaxed text-amber-800">
              Applying sandbox changes directly overwrites current student session states. Use primarily for classroom presentations, lectures or diagnostic validations.
            </p>
          </div>
        </div>

      </div>

      {/* Dynamic Classroom Deployment Playbook & Pedagogical Guide */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8 mt-12">
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2.5 text-indigo-650 text-indigo-600 mb-1">
            <Settings size={18} />
            <span className="text-[10px] uppercase font-black tracking-widest leading-none">Lecturer Resource Center</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">Classroom Playbook & Pedagogical Framework</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Understand what capabilities can be executed inside this control cockpit, how to run structured classroom simulation sessions, and why these parameters behave as they do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: WHAT can be done here? */}
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl w-fit text-indigo-650 text-indigo-600">
              <Key size={20} />
            </div>
            <h3 className="text-sm font-black uppercase text-indigo-900 tracking-wider">1. Cockpit Capabilities</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              The Faculty Access Portal acts as the master coordinator command post. Inside, you can:
            </p>
            <ul className="text-xs text-slate-500 space-y-2.5 font-semibold list-disc pl-4 leading-normal">
              <li>
                <strong>Manage Gating Access:</strong> Turn off the gateway passcode globally to open the app for general public preview.
              </li>
              <li>
                <strong>Register Custom Team Keys:</strong> Generate specific class team keys (e.g., TEAM-EUROPE, SEMINAR-AI) so that you can trace group performance metrics.
              </li>
              <li>
                <strong>Replicate Sessions:</strong> Export security state files to JSON and import them onto other classroom laptops or browser sessions instantly.
              </li>
              <li>
                <strong>Sandbox Injector:</strong> Adjust live variables (Budget, Trust, performance, compliance) on-the-fly to trigger sudden corporate shifts in front of students.
              </li>
            </ul>
          </div>

          {/* Column 2: HOW to conduct the session? */}
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl w-fit text-emerald-600">
              <Award size={20} />
            </div>
            <h3 className="text-sm font-black uppercase text-emerald-900 tracking-wider">2. Session Methodology</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              A proven 60-minute framework for running the simulation inside Executive and Master courses:
            </p>
            <ol className="text-xs text-slate-500 space-y-2.5 font-semibold list-decimal pl-4 leading-normal">
              <li>
                <strong>Pre-Briefing (10m):</strong> Present the student passkey (e.g., <strong>{securityProfile.defaultKeyPrefix || "ABS"}{(securityProfile.defaultYearStart || 2026)}</strong>) on the slides. Have students read the Simulation Briefing page.
              </li>
              <li>
                <strong>Autonomous Team Play (30m):</strong> Teams of 3 to 4 play 12 quarters. They must balance cash spending with stakeholder trust.
              </li>
              <li>
                <strong>Mid-Game Shock (5m):</strong> (Optional) Have teams report their stats. Use the Sandbox variables on your presentation slide to show how a sudden 50% drop in Legal Compliance raises the Autonomy Gap and triggers audit fines.
              </li>
              <li>
                <strong>Debrief & Scoring (15m):</strong> Use the score explanations to compare teams' final board alignment.
              </li>
            </ol>
          </div>

          {/* Column 3: WHY are we simulating this? */}
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl w-fit text-amber-700">
              <Scale size={20} />
            </div>
            <h3 className="text-sm font-black uppercase text-amber-900 tracking-wider">3. Pedagogical Design</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              The underlying simulation mathematics teach the crucial trade-offs of modern AI deployment:
            </p>
            <ul className="text-xs text-slate-500 space-y-2.5 font-semibold pl-4 list-disc leading-normal">
              <li>
                <strong>The Cost of Recklessness:</strong> Students often push AI Performance high, but fail to fund Compliance and Trust. At &gt;20% gap levels, they lose budget exponentially to fines.
              </li>
              <li>
                <strong>Stakeholder Alignment:</strong> The simulation shows that AI is not just a technological tool, but a socio-technical one that depends on workers, regulators, and digital trust.
              </li>
              <li>
                <strong>Compliance is Value Protection:</strong> High compliance levels prevent catastrophic crises and expensive public audit failures.
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};
