import React, { useState, useEffect } from 'react';
import { loadState, updateDailyLog, getTodayDateString } from '../services/storage';
import { Win, DailyLog } from '../types';
import { Plus, Moon, Sun } from 'lucide-react';

export const Journal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wins' | 'reflection'>('wins');
  const [newWin, setNewWin] = useState('');
  const [logs, setLogs] = useState<Record<string, DailyLog>>(loadState().logs);
  const today = getTodayDateString();
  const currentLog = logs[today];

  const handleAddWin = () => {
    if (!newWin.trim()) return;
    const win: Win = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        description: newWin,
        category: 'execution'
    };
    const updated = updateDailyLog(today, { wins: [...(currentLog?.wins || []), win] });
    setLogs(updated.logs);
    setNewWin('');
  };

  const setEveningRitual = () => {
     updateDailyLog(today, { eveningRitualComplete: true });
     setLogs(loadState().logs); // refresh
  };

  return (
    <div className="space-y-8 min-h-[80vh] animate-[fadeIn_1s_ease-out]">
        {/* Simple Text Tabs */}
        <div className="flex gap-8 justify-center pb-4 border-b border-zen-stone">
            <button 
                onClick={() => setActiveTab('wins')}
                className={`text-xs uppercase tracking-[0.2em] font-ui transition-colors ${activeTab === 'wins' ? 'text-zen-ink font-bold' : 'text-zen-stone hover:text-zen-mist'}`}
            >
                Evidence
            </button>
            <button 
                onClick={() => setActiveTab('reflection')}
                className={`text-xs uppercase tracking-[0.2em] font-ui transition-colors ${activeTab === 'reflection' ? 'text-zen-ink font-bold' : 'text-zen-stone hover:text-zen-mist'}`}
            >
                Reflection
            </button>
        </div>

        {activeTab === 'wins' && (
            <div className="space-y-8">
                <div className="bg-white border border-zen-stone p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <h3 className="text-xl font-serif text-zen-ink mb-1">Record a Win</h3>
                    <p className="text-xs text-zen-mist font-ui mb-6 uppercase tracking-wider">Proof of capability</p>
                    
                    <div className="flex items-center gap-4 border-b border-zen-stone pb-2 focus-within:border-zen-ink transition-colors">
                        <input 
                            type="text" 
                            value={newWin}
                            onChange={(e) => setNewWin(e.target.value)}
                            placeholder="I sent the scary email..."
                            className="flex-1 bg-transparent text-zen-ink font-serif text-lg outline-none placeholder:text-zen-stone placeholder:italic"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddWin()}
                        />
                        <button 
                            onClick={handleAddWin}
                            className="text-zen-mist hover:text-zen-red transition-colors"
                        >
                            <Plus size={24} strokeWidth={1} />
                        </button>
                    </div>
                </div>

                <div className="space-y-6 pl-4 border-l border-zen-stone">
                    {(currentLog?.wins || []).length === 0 ? (
                        <div className="text-zen-stone italic font-serif">The page is waiting...</div>
                    ) : (
                        (currentLog?.wins || []).slice().reverse().map((win) => (
                            <div key={win.id} className="relative group">
                                <div className="absolute -left-[21px] top-2 w-2 h-2 bg-zen-stone rounded-full group-hover:bg-zen-red transition-colors" />
                                <p className="text-lg font-serif text-zen-ink leading-relaxed">{win.description}</p>
                                <span className="text-[10px] text-zen-stone font-ui uppercase tracking-widest">
                                    {new Date(win.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {activeTab === 'reflection' && (
            <div className="space-y-8">
                <div className="bg-zen-wash p-8 rounded-sm space-y-6">
                    <div className="flex items-center justify-center text-zen-ink mb-4">
                        <Moon size={24} strokeWidth={1} />
                    </div>
                    
                    <div className="space-y-6 text-center font-serif text-lg text-zen-ink/80">
                        <p>Did I act despite the voice?</p>
                        <p>Which timeline did I inhabit today?</p>
                        <p className="italic text-zen-ink">"Tomorrow, I am willing to find out."</p>
                    </div>

                    {!currentLog?.eveningRitualComplete ? (
                        <button 
                            onClick={setEveningRitual}
                            className="w-full mt-6 border border-zen-stone bg-white text-zen-ink py-4 hover:border-zen-ink transition-colors font-ui text-xs uppercase tracking-[0.2em]"
                        >
                            Complete Reflection
                        </button>
                    ) : (
                        <div className="text-center py-4 text-zen-red font-serif italic">
                            Rest well, warrior.
                        </div>
                    )}
                </div>

                {/* History List */}
                <div className="space-y-6 pt-6">
                     <h4 className="text-xs uppercase text-zen-stone font-ui font-bold tracking-widest text-center">Past Days</h4>
                     {(Object.values(logs) as DailyLog[])
                        .filter(l => l.date !== today)
                        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 3)
                        .map(log => (
                            <div key={log.date} className="flex justify-between items-center py-4 border-b border-zen-stone/50">
                                <div className="flex flex-col">
                                    <span className="font-serif text-lg text-zen-ink">{log.date}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-zen-mist font-ui">
                                        Timeline {log.timelineChoice}
                                    </span>
                                </div>
                                <span className="font-serif text-xl text-zen-ink">{log.emailCount} <span className="text-xs text-zen-stone">emails</span></span>
                            </div>
                        ))
                     }
                </div>
            </div>
        )}
    </div>
  );
};