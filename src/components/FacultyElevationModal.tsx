import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, AlertTriangle, X, Sparkles, GraduationCap } from 'lucide-react';
import { validateAccessDetails } from '../config/security';

interface FacultyElevationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (isAdmin: boolean) => void;
}

export const FacultyElevationModal: React.FC<FacultyElevationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setError(null);
    setIsValidating(true);

    setTimeout(async () => {
      const { isValid, isAdmin } = await validateAccessDetails(passcode);
      if (isValid) {
        setPasscode('');
        onSuccess(isAdmin);
        onClose();
      } else {
        setError('Authorization failed. Invalid administrator credentials.');
      }
      setIsValidating(false);
    }, 650);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-white overflow-hidden"
          >
            {/* Ambient Background Light Trace */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 p-2 text-slate-500 hover:text-slate-350 hover:bg-slate-800 rounded-lg transition-colors z-10"
            >
              <X size={18} />
            </button>

            {/* Header Content */}
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <div className="w-14 h-14 bg-indigo-650 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-505/20 text-white">
                <Shield size={24} />
              </div>
              <div>
                <span className="text-[9px] uppercase font-black tracking-widest text-indigo-400 block leading-none mb-1">Amsterdam Business School</span>
                <h3 className="text-xl font-black uppercase text-white font-display">Faculty Elevation</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Authenticate with your master passcode key to grant administrative capabilities.
                </p>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Master Passcode Key</label>
                <div className="relative">
                  <input 
                    type="password"
                    autoFocus
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="••••••••"
                    disabled={isValidating}
                    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-2xl py-4 pl-5 pr-12 text-sm text-white font-mono placeholder-slate-700 focus:outline-none transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <Key size={16} />
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
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 duration-200 flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Validating Authenticity...
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    Verify Administrator <Sparkles size={14} />
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
