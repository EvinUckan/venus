// Venus App Types

export interface Settings {
  name: string;
  cycleLength: number; // default 28, range 21-45
  periodLength: number; // default 5, range 2-10
  language: "en" | "tr";
  hasCompletedOnboarding?: boolean;
}

export interface Cycle {
  id: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export interface DiaryEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  moodTag: MoodTag;
  note?: string;
}

export type MoodTag = "happy" | "calm" | "sad" | "energetic";

export type Phase = "menstrual" | "follicular" | "ovulation" | "luteal";

export interface PhaseInfo {
  phase: Phase;
  description: string;
  daysUntilNextPeriod: number;
  daysUntilOvulation: number | null;
}
