import React, { useState, useEffect } from 'react';
import { loadState, updateDailyLog, getTodayDateString } from '../services/storage';
import { DailyLog, ResistanceLog } from '../types';
import { ShieldAlert, Feather, Minus, X } from 'lucide-react';

export const ActionCenter: React.FC = () => {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [showResistanceModal, setShowResistanceModal] = useState(false);
  const [resistanceStep, setResistanceStep] = useState(0); 
  const [resistanceVoice, setResistanceVoice] = useState('');
  
  const today = getTodayDateString();

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const state = loadState();
    setLog(state.logs[today]);
  };

  const handleEmailChange = (delta: number) => {
    if (!log) return;
    const newCount = Math.max(0, log.emailCount + delta);
    updateDailyLog(today, { emailCount: newCount });
    refreshData();
  };

  const saveResistance = (acted: boolean) => {
    if (!log) return;
    const newLog: ResistanceLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        trigger: `Email Count: ${log.emailCount}`,
        voiceMessage: resistanceVoice,
        responseType: acted ? 'acted' : 'collapsed'
    };
    updateDailyLog(today, { resistanceLogs: [...log.resistanceLogs, newLog] });
    
    setResistanceVoice('');
    setResistanceStep(0);
    setShowResistanceModal(false);
    refreshData();
  };

  if (!log) return <div className="flex h-full items-center justify-center text-zen-mist">Preparing Dojo...</div>;

  const progress = Math.min(100, (log.emailCount / (log.emailTarget || 1)) * 100);
  // Calculate dash array for circle (r=80, circum=502)
  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-10 pb-12 animate-[fadeIn_1s_ease-out]">
      
      {/* Header */}
      <div className="text-center space-y-1 pt-4">
        <h2 className="text-2xl font-serif text-zen-ink">The Practice</h2>
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-zen-mist font-ui">
            <span>Target: {log.emailTarget}</span>
            <span className="w-1 h-1 bg-zen-mist rounded-full"></span>
            <span>Current: {log.emailCount}</span>
        </div>
      </div>

      {/* Enso Counter */}
      <div className="relative flex flex-col items-center justify-center">
         <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Background Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="80" fill="transparent" stroke="#E5E2D9" strokeWidth="2" />
                <circle 
                    cx="128" cy="128" r="80" 
                    fill="transparent" 
                    stroke="#2A2A2A" 
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            
            <div className="text-center z-10 flex flex-col items-center">
                <span className="text-7xl font-serif text-zen-ink leading-none ml-2">{log.emailCount}</span>
                <span className="text-xs uppercase tracking-widest text-zen-mist mt-2 font-ui">Sent</span>
            </div>
         </div>

         {/* Controls - Minimalist */}
         <div className="flex items-center gap-12 -mt-4">
            <button 
                onClick={() => handleEmailChange(-1)}
                className="w-12 h-12 flex items-center justify-center text-zen-mist hover:text-zen-ink transition-colors"
            >
                <Minus size={24} strokeWidth={1} />
            </button>
            
            {/* Hanko Stamp Button */}
            <button 
                onClick={() => handleEmailChange(1)}
                className="w-20 h-20 bg-zen-red rounded-full shadow-[0_4px_20px_rgba(188,57,8,0.3)] flex items-center justify-center text-white hover:bg-zen-ink transition-colors duration-500 group"
            >
                <Feather size={32} strokeWidth={1.5} className="group-active:scale-90 transition-transform" />
            </button>
         </div>
      </div>

      {/* Resistance Trigger - Paper Strip Style */}
      <div className="pt-8">
         <button 
            onClick={() => setShowResistanceModal(true)}
            className="w-full bg-white border border-zen-stone py-4 px-6 flex items-center justify-between hover:border-zen-red group transition-all shadow-sm"
         >
            <div className="flex items-center gap-4">
                <ShieldAlert size={20} className="text-zen-mist group-hover:text-zen-red transition-colors" strokeWidth={1.5} />
                <span className="font-serif text-zen-ink">I feel resistance</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-zen-mist group-hover:text-zen-red font-ui">The Voice</span>
         </button>
      </div>

      {/* Recent History - Ink Log */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase text-zen-mist font-ui tracking-[0.2em] text-center border-b border-zen-stone pb-2 mx-10">Dojo Log</h3>
        
        {log.resistanceLogs.length === 0 && (
            <div className="text-center py-6 text-zen-stone font-serif italic text-sm">
                The path is clear.
            </div>
        )}

        <div className="space-y-3 px-2">
            {log.resistanceLogs.slice().reverse().map(r => (
                <div key={r.id} className="flex flex-col gap-1 border-l-2 border-zen-stone pl-4 py-1">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-ui text-zen-mist">{new Date(r.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span className={`text-[10px] uppercase tracking-wider font-bold ${r.responseType === 'acted' ? 'text-zen-ink' : 'text-zen-red'}`}>
                            {r.responseType === 'acted' ? 'Overcame' : 'Retreated'}
                        </span>
                    </div>
                    <p className="text-sm font-serif text-zen-ink italic">"{r.voiceMessage}"</p>
                </div>
            ))}
        </div>
      </div>

      {/* Resistance Modal - Zen Dialog */}
      {showResistanceModal && (
        <div className="fixed inset-0 z-50 bg-zen-paper/95 backdrop-blur-md flex items-center justify-center p-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="w-full max-w-md relative space-y-8">
                <button onClick={() => setShowResistanceModal(false)} className="absolute -top-12 right-0 text-zen-mist hover:text-zen-ink">
                    <X size={24} strokeWidth={1} />
                </button>

                {resistanceStep === 0 && (
                    <div className="text-center space-y-8 py-4">
                        <div className="w-20 h-20 mx-auto rounded-full border border-zen-stone flex items-center justify-center animate-breathe">
                            <div className="w-2 h-2 bg-zen-red rounded-full" />
                        </div>
                        <h3 className="text-3xl font-serif text-zen-ink">Pause. Breathe.</h3>
                        <p className="text-zen-ink/70 font-serif text-lg">Do not argue with the voice.<br/>Just observe it.</p>
                        <button 
                            onClick={() => setResistanceStep(1)} 
                            className="w-full border-b border-zen-ink pb-2 text-sm uppercase tracking-widest hover:text-zen-red hover:border-zen-red transition-colors pt-8 font-ui"
                        >
                            I have taken a breath
                        </button>
                    </div>
                )}

                {resistanceStep === 1 && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-serif text-zen-ink">Name the Protector</h3>
                        <p className="text-sm text-zen-mist font-ui">What is the little one afraid of?</p>
                        <textarea 
                            autoFocus
                            value={resistanceVoice}
                            onChange={(e) => setResistanceVoice(e.target.value)}
                            placeholder="Write it down to let it go..."
                            className="w-full bg-transparent border-b border-zen-stone p-2 text-zen-ink font-serif text-lg outline-none focus:border-zen-red min-h-[80px] placeholder:text-zen-stone placeholder:italic"
                        />
                         <div className="p-4 bg-zen-wash rounded-sm text-sm italic text-zen-ink/70 font-serif">
                            "I see you. Thank you for trying to keep me safe."
                        </div>
                        <button 
                            disabled={!resistanceVoice}
                            onClick={() => setResistanceStep(2)} 
                            className="w-full bg-zen-ink text-white py-4 rounded-sm mt-4 disabled:opacity-50 hover:bg-zen-red transition-colors font-ui uppercase text-xs tracking-widest"
                        >
                            Acknowledge
                        </button>
                    </div>
                )}

                {resistanceStep === 2 && (
                    <div className="text-center space-y-8 py-4">
                        <h3 className="text-2xl font-serif text-zen-ink">Compassionate Action</h3>
                        <p className="text-lg text-zen-mist italic">"I'm moving forward anyway."</p>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                             <button 
                                onClick={() => saveResistance(false)} 
                                className="border border-zen-stone text-zen-mist py-4 rounded-sm hover:border-zen-ink hover:text-zen-ink font-ui text-xs uppercase tracking-wider"
                            >
                                I Collapsed
                            </button>
                            <button 
                                onClick={() => saveResistance(true)} 
                                className="bg-zen-red text-white py-4 rounded-sm hover:bg-zen-ink transition-colors font-ui text-xs uppercase tracking-widest shadow-lg"
                            >
                                Send The Email
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};