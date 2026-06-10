import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, AlertTriangle, Info, GraduationCap, Sparkles } from 'lucide-react';
import { validateAccessDetails } from '../config/security';

interface AcademicGatePortalProps {
  onUnlock: (isAdmin: boolean) => void;
}

export const AcademicGatePortal: React.FC<AcademicGatePortalProps> = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showConfigTips, setShowConfigTips] = useState(false);

  // Auto-unlock validation if URL has ?passcode=XYZ or ?admin=XYZ
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryPass = params.get('passcode') || params.get('admin');
    if (queryPass) {
      setIsValidating(true);
      validateAccessDetails(queryPass).then(({ isValid, isAdmin }) => {
        if (isValid) {
          sessionStorage.setItem('abs_boardroom_unlocked', 'true');
          if (isAdmin) {
            sessionStorage.setItem('abs_boardroom_admin', 'true');
          } else {
            sessionStorage.removeItem('abs_boardroom_admin');
          }
          onUnlock(isAdmin);
        } else {
          setError('URL passcode parameter validation failed.');
        }
        setIsValidating(false);
      });
    }
  }, [onUnlock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setError(null);
    setIsValidating(true);

    // Minor loading latency to feel like a real security trace
    setTimeout(async () => {
      const { isValid, isAdmin } = await validateAccessDetails(passcode);
      if (isValid) {
        sessionStorage.setItem('abs_boardroom_unlocked', 'true');
        if (isAdmin) {
          sessionStorage.setItem('abs_boardroom_admin', 'true');
        } else {
          sessionStorage.removeItem('abs_boardroom_admin');
        }
        onUnlock(isAdmin);
      } else {
        setError('Authorization failed. Please verify your seminar invite credentials.');
      }
      setIsValidating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-6 relative overflow-hidden text-white font-sans">
      {/* Decorative light flares */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center py-4 border-b border-slate-900 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <GraduationCap className="text-white" size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 block leading-none">Amsterdam Business School</span>
            <span className="text-xs font-bold text-slate-400">Amsterdam Digital Transformation Lab</span>
          </div>
        </div>
        <button 
          onClick={() => setShowConfigTips(!showConfigTips)}
          className="p-2 px-3 text-slate-350 hover:text-white transition-colors bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/20 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest cursor-pointer"
        >
          <Info size={14} className="text-indigo-400" /> Simulation Lab Info
        </button>
      </header>

      {/* Center Portal Box */}
      <main className="max-w-md w-full mx-auto my-auto z-10 pt-10 pb-16">
        <AnimatePresence mode="wait">
          {showConfigTips ? (
            <motion.div
              key="guide"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/95 backdrop-blur-md rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tight">Simulation Lab Guide</h3>
                  <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">Amsterdam Business School • ADTL</p>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-5 leading-relaxed">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <Sparkles size={12} /> The Strategic Simulation
                  </h4>
                  <p className="font-semibold text-slate-300">
                    Welcome to <strong>The Agentic Boardroom Simulation</strong>, an executive classroom environment hosted by the Amsterdam Digital Transformation Lab (ADTL).
                  </p>
                  <p className="mt-2 text-slate-450 text-slate-400">
                    Students act as C-suite executives navigating a 12-quarter (3-year) technology transformation horizon, deciding on company-wide integration of autonomous agent networks.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-850/80 space-y-3">
                  <h5 className="font-mono text-slate-450 uppercase text-[9px] font-black tracking-wider text-indigo-300">Governing Formulas & Strategic Metrics</h5>
                  <ul className="space-y-2.5 text-[11px] font-semibold text-slate-350">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 font-mono">1.</span>
                      <span><strong>AI Performance:</strong> Directly dictates speed, productivity multiplier, cost reductions, and competitive market share gains.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 font-mono">2.</span>
                      <span><strong>Digital Trust:</strong> Customer loyalty, worker union sentiment, and executive reputation management. Low trust triggers negative event chains.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 font-mono">3.</span>
                      <span><strong>Safety & Compliance:</strong> Auditing compliance under the EU AI Act and standard corporate governance.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-mono">⚠</span>
                      <span><strong>The Autonomy-Governance Penalty:</strong> If Performance vastly outpaces Safety and Trust (the Autonomy Gap &gt; 20%), high-frictional audit failures trigger massive score and regulatory budget penalties.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">How to Secure Access Keys</h4>
                  <p className="text-slate-400">
                    To maintain classroom integrity, this simulation does not provide a direct bypass. Regular students can obtain the active seminar passkeys from:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 font-semibold pl-1">
                    <li>The course outline or Canvas announcement stream</li>
                    <li>The introductory slides of the master lecture session</li>
                    <li>Direct request to your Faculty Program Coordinator or Course Administrator</li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800 text-slate-450 text-[10px] text-slate-400 flex gap-2 items-center">
                  <Shield size={14} className="text-indigo-400 shrink-0" />
                  <span>Faculty hosts can authenticate with their master passcode to open administrative and real-time variable dashboard slides.</span>
                </div>
              </div>

              <button 
                onClick={() => setShowConfigTips(false)}
                className="w-full py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95 duration-200 cursor-pointer"
              >
                Back To Portal
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-slate-900 shadow-2xl relative"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                </span>
                Simulation Portal
              </div>

              <div className="flex flex-col items-center text-center space-y-4 mb-8">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20"
                  animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Key size={28} />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white font-display">The Agentic Boardroom</h2>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1">
                    Enter your seminar invitation passcode to access the strategic simulation environment.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Seminar Access Key</label>
                  <div className="relative">
                    <input 
                      type="password"
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        if (error) setError(null);
                      }}
                      disabled={isValidating}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-2xl py-4 pl-5 pr-12 text-sm text-white font-mono placeholder-slate-700 focus:outline-none transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <Shield size={16} />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5 items-start p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 leading-normal font-semibold"
                  >
                    <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isValidating || !passcode.trim()}
                  className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 duration-200 flex items-center justify-center gap-2"
                >
                  {isValidating ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      Unlock Simulation <Sparkles size={14} />
                    </span>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center border-t border-slate-900 py-6 text-[10px] text-slate-500 space-y-1 z-10 leading-relaxed font-semibold">
        <p>Amsterdam Business School • University of Amsterdam School of Business</p>
        <p>Dr. Somendra Narayan • © 2026 ADTL. All rights reserved.</p>
      </footer>
    </div>
  );
};
