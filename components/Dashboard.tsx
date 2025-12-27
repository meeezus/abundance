import React, { useEffect, useState } from 'react';
import { loadState, getTodayDateString, getDailyTarget } from '../services/storage';
import { AppState } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Mountain, Sun, Calendar, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [state, setState] = useState<AppState | null>(null);
  const navigate = useNavigate();
  const today = getTodayDateString();

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) return null;

  const todayLog = state.logs[today] || { 
    emailCount: 0, 
    emailTarget: getDailyTarget(today),
    morningRitualComplete: false
  };

  // Prepare Chart Data
  const chartData = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const log = state.logs[dStr];
      chartData.push({
          name: days[d.getDay()],
          emails: log ? log.emailCount : 0,
          target: log ? log.emailTarget : getDailyTarget(dStr),
          isToday: dStr === today
      });
  }

  return (
    <div className="space-y-10 animate-[fadeIn_1s_ease-out]">
      {/* Hero: The Challenge Scroll */}
      <div className="relative bg-zen-wash border border-zen-stone p-8 rounded-sm shadow-sm overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-zen-ink group-hover:scale-110 transition-transform duration-1000">
            <Mountain size={140} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="border border-zen-red text-zen-red text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-ui">
                DecoponATX Challenge
            </div>
            
            <div className="space-y-1">
                <span className="text-5xl font-serif text-zen-ink block">{state.totalEmailsSent}</span>
                <span className="text-zen-mist text-xs uppercase tracking-widest font-ui">of 90 Steps Taken</span>
            </div>

            {/* Brush Stroke Progress */}
            <div className="w-full max-w-[200px] h-1 bg-zen-stone mt-2 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-zen-ink transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, (state.totalEmailsSent / 90) * 100)}%` }}
                />
            </div>
            
            <p className="text-sm font-serif italic text-zen-mist pt-2">
                "Proving to the child within that we are capable."
            </p>
        </div>
      </div>

      {/* Daily Cards */}
      <div className="grid grid-cols-2 gap-6">
        <div 
            onClick={() => navigate('/action')}
            className="group cursor-pointer flex flex-col items-center justify-center p-6 bg-white border border-zen-stone hover:border-zen-red transition-all duration-300 rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        >
            <span className="text-zen-mist text-[10px] uppercase tracking-widest mb-2 font-ui">Today's Practice</span>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif text-zen-ink group-hover:text-zen-red transition-colors">{todayLog.emailCount}</span>
                <span className="text-sm text-zen-stone">/ {todayLog.emailTarget}</span>
            </div>
        </div>

        <div 
            onClick={() => navigate('/journal')}
            className="group cursor-pointer flex flex-col items-center justify-center p-6 bg-white border border-zen-stone hover:border-zen-red transition-all duration-300 rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        >
             <span className="text-zen-mist text-[10px] uppercase tracking-widest mb-2 font-ui">Evidence Log</span>
             <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif text-zen-ink group-hover:text-zen-red transition-colors">{state.logs[today]?.wins?.length || 0}</span>
                <span className="text-sm text-zen-stone">Wins</span>
            </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="py-4">
        <div className="flex justify-between items-end mb-6 px-2">
             <h3 className="text-sm font-serif text-zen-ink">Weekly Consistency</h3>
             <div className="h-px bg-zen-stone flex-1 mx-4 mb-2"></div>
        </div>
        <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 10, fill: '#8C8C8C', fontFamily: 'Inter'}} 
                        axisLine={false} 
                        tickLine={false} 
                        interval={0}
                    />
                    <Bar dataKey="emails" radius={[1, 1, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.isToday ? '#BC3908' : '#E5E2D9'} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Morning Ritual Status Stamp */}
      <div className="flex items-center justify-between bg-white p-5 border border-zen-stone rounded-sm">
        <div className="flex flex-col">
            <span className="font-serif text-lg text-zen-ink">Morning Ritual</span>
            <span className="text-[10px] text-zen-mist uppercase tracking-wider font-ui">Alignment & Timeline</span>
        </div>
        <button 
            onClick={() => navigate('/ritual')}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                todayLog.morningRitualComplete 
                ? 'border-zen-red text-zen-red bg-zen-redWash'
                : 'border-zen-ink text-zen-ink hover:bg-zen-ink hover:text-white'
            }`}
        >
            {todayLog.morningRitualComplete ? <Sun size={20} /> : <div className="w-3 h-3 bg-current rounded-full" />}
        </button>
      </div>

      {/* Koan / Mantra */}
      <div className="text-center py-8">
        <p className="font-serif text-xl italic text-zen-mist/60 leading-relaxed">
            "I don't need to believe.<br/>I just need to act."
        </p>
      </div>
    </div>
  );
};