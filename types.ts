export type EmotionalState = 'scarcity' | 'abundance' | 'anxious' | 'determined' | 'neutral';
export type Timeline = 'A' | 'B'; // A = Scarcity/Old, B = Abundance/New

export interface ResistanceLog {
  id: string;
  timestamp: string;
  trigger: string; // e.g., "Email #10", "Before starting"
  voiceMessage: string; // What did the inner voice say?
  responseType: 'acted' | 'collapsed';
  notes?: string;
}

export interface Win {
  id: string;
  timestamp: string;
  description: string;
  category: 'execution' | 'mindset' | 'money';
}

export interface DailyLog {
  date: string; // ISO Date string YYYY-MM-DD
  emailCount: number;
  emailTarget: number;
  morningRitualComplete: boolean;
  eveningRitualComplete: boolean;
  emotionalState: EmotionalState;
  timelineChoice: Timeline;
  wins: Win[];
  resistanceLogs: ResistanceLog[];
  callsBooked: number;
  repliesReceived: number;
  notes: string;
}

export interface AppState {
  logs: Record<string, DailyLog>; // Keyed by date YYYY-MM-DD
  currentStreak: number;
  totalEmailsSent: number;
}

export const EMAIL_TARGETS: Record<number, number> = {
  1: 15, // Mon
  2: 20, // Tue
  3: 20, // Wed
  4: 20, // Thu
  5: 15, // Fri
  0: 0,  // Sun
  6: 0   // Sat
};
