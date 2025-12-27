import { AppState, DailyLog, EMAIL_TARGETS } from '../types';

const STORAGE_KEY = 'musha_shugyo_data_v1';

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getDailyTarget = (dateStr: string): number => {
  const dayOfWeek = new Date(dateStr).getDay();
  return EMAIL_TARGETS[dayOfWeek] || 0;
};

const initialLog: DailyLog = {
  date: getTodayDateString(),
  emailCount: 0,
  emailTarget: getDailyTarget(getTodayDateString()),
  morningRitualComplete: false,
  eveningRitualComplete: false,
  emotionalState: 'neutral',
  timelineChoice: 'B',
  wins: [],
  resistanceLogs: [],
  callsBooked: 0,
  repliesReceived: 0,
  notes: ''
};

const initialState: AppState = {
  logs: {
    [getTodayDateString()]: initialLog
  },
  currentStreak: 0,
  totalEmailsSent: 0
};

export const loadState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return initialState;
  
  try {
    const parsed = JSON.parse(stored);
    // Ensure today exists
    const today = getTodayDateString();
    if (!parsed.logs[today]) {
      parsed.logs[today] = { 
        ...initialLog, 
        date: today,
        emailTarget: getDailyTarget(today)
      };
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse storage", e);
    return initialState;
  }
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const updateDailyLog = (date: string, updates: Partial<DailyLog>): AppState => {
  const currentState = loadState();
  const currentLog = currentState.logs[date] || { ...initialLog, date, emailTarget: getDailyTarget(date) };
  
  const updatedLog = { ...currentLog, ...updates };
  
  // Recalculate totals
  const allLogs = { ...currentState.logs, [date]: updatedLog };
  const totalEmails = Object.values(allLogs).reduce((acc, log) => acc + log.emailCount, 0);

  const newState = {
    ...currentState,
    logs: allLogs,
    totalEmailsSent: totalEmails
  };
  
  saveState(newState);
  return newState;
};
