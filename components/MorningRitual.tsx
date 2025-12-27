import React, { useState } from 'react';
import { getTodayDateString, updateDailyLog } from '../services/storage';
import { ArrowRight, Feather } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 'checkin', title: 'Check-In' },
  { id: 'voice', title: 'The Voice' },
  { id: 'acknowledge', title: 'Kindness' },
  { id: 'alignment', title: 'Align' },
  { id: 'timeline', title: 'Choice' },
  { id: 'breath', title: 'Prepare' },
];

export const MorningRitual: React.FC = () => {
  const [step, setStep] = useState(0);
  const [emotionalState, setEmotionalState] = useState<string>('');
  const [voiceNote, setVoiceNote] = useState('');
  const navigate = useNavigate();
  const today = getTodayDateString();

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      completeRitual();
    }
  };

  const completeRitual = () => {
    updateDailyLog(today, {
      morningRitualComplete: true,
      emotionalState: emotionalState as any || 'determined',
    });
    navigate('/action');
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-3xl font-serif text-zen-ink">State of Mind</h2>
            <div className="space-y-2">
              {['Anxious', 'Determined', 'Scarcity', 'Abundant', 'Neutral'].map((state) => (
                <button
                  key={state}
                  onClick={() => setEmotionalState(state.toLowerCase())}
                  className={`w-full py-4 text-left px-6 border-l-2 transition-all duration-300 font-serif text-lg ${
                    emotionalState === state.toLowerCase()
                      ? 'border-zen-red text-zen-ink bg-zen-wash pl-8'
                      : 'border-zen-stone text-zen-mist hover:text-zen-ink hover:border-zen-ink'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-3xl font-serif text-zen-ink">The Doubting Voice</h2>
            <p className="text-zen-mist font-ui text-sm leading-relaxed">
                What limiting belief is echoing today?<br/>
                Is it the old "I can't make things happen"?
            </p>
            <div className="relative">
                <textarea
                className="w-full bg-zen-wash border-none rounded-sm p-6 text-zen-ink font-serif text-xl focus:ring-0 resize-none min-h-[200px] placeholder:text-zen-stone placeholder:italic"
                placeholder="The voice whispers..."
                value={voiceNote}
                onChange={(e) => setVoiceNote(e.target.value)}
                />
                <Feather className="absolute bottom-4 right-4 text-zen-stone" size={20} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-10 animate-[fadeIn_0.5s_ease-out] flex flex-col justify-center h-full">
            <h2 className="text-3xl font-serif text-zen-ink text-center">Speak to the Child</h2>
            <div className="relative p-8 border-y border-zen-stone">
                <p className="font-serif text-xl text-zen-ink italic leading-loose text-center">
                "I see you, little Michael.<br/>
                I know you are scared of the carousel.<br/>
                I see you trying to protect us.<br/>
                But I am doing it anyway.<br/>
                We are safe."
                </p>
            </div>
            <p className="text-center text-xs uppercase tracking-widest text-zen-mist font-ui">Read aloud</p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
             <h2 className="text-3xl font-serif text-zen-ink">Affirmation</h2>
             <div className="space-y-6">
                <div className="p-6 bg-zen-ink text-zen-paper shadow-lg">
                    <p className="text-2xl font-serif leading-relaxed">"I am willing to find out if I can make this happen."</p>
                </div>
                <div className="p-6 border border-zen-stone">
                    <p className="text-xl font-serif text-zen-mist">"My worthiness isn't determined by results. It's inherent."</p>
                </div>
             </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-3xl font-serif text-zen-ink">Choose Timeline</h2>
            <div className="grid grid-cols-1 gap-6">
                <button className="p-6 border border-zen-stone opacity-50 text-left group hover:opacity-100 transition-opacity">
                    <div className="text-[10px] uppercase tracking-widest text-zen-mist mb-2 font-ui">Timeline A (Old)</div>
                    <div className="font-serif text-xl text-zen-mist group-hover:text-zen-ink">Scarcity. Seeking permission.</div>
                </button>
                <button 
                    onClick={() => updateDailyLog(today, { timelineChoice: 'B' })}
                    className="p-8 bg-zen-red text-zen-paper text-left shadow-xl transform transition-transform active:scale-95"
                >
                    <div className="text-[10px] uppercase tracking-widest text-white/70 mb-2 font-ui">Timeline B (New)</div>
                    <div className="font-serif text-2xl font-bold">Abundance. Creator.</div>
                    <div className="mt-2 text-sm opacity-80 font-ui">"I make things happen."</div>
                </button>
            </div>
          </div>
        );
        case 5:
            return (
              <div className="space-y-8 animate-[fadeIn_0.5s_ease-out] text-center flex flex-col items-center justify-center h-full">
                <div className="w-1 h-24 bg-zen-red mb-4" />
                <h2 className="text-4xl font-serif text-zen-ink">Prepare</h2>
                <div className="space-y-4 text-zen-mist font-serif text-lg">
                    <p>Five deep breaths.</p>
                    <p>Feel the success.</p>
                    <p>Send from worthiness.</p>
                </div>
                <button 
                    onClick={completeRitual}
                    className="mt-12 border-b-2 border-zen-red text-zen-ink pb-1 uppercase tracking-[0.2em] hover:text-zen-red transition-colors font-ui text-sm font-bold"
                >
                    Enter The Dojo
                </button>
              </div>
            );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col py-2">
        {/* Minimalist Progress Line */}
        <div className="w-full h-px bg-zen-stone mb-10 flex">
            <div 
                className="bg-zen-ink transition-all duration-500" 
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
        </div>

      <div className="flex-1 overflow-y-auto px-1">
        {renderStepContent()}
      </div>

      {step < 5 && (
        <div className="mt-8 flex justify-end">
            <button
            onClick={handleNext}
            disabled={step === 0 && !emotionalState}
            className="flex items-center gap-3 text-zen-ink font-ui uppercase tracking-widest text-xs hover:text-zen-red transition-colors disabled:opacity-30"
            >
            <span>Next Step</span>
            <ArrowRight size={16} strokeWidth={1} />
            </button>
        </div>
      )}
    </div>
  );
};