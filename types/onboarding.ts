export type TroublingArea =
  | "academics"
  | "weight loss"
  | "relationships"
  | "career"
  | "health"
  | "finance"
  | "personal growth"
  | "creativity";

export interface DaySchedule {
  day: string; // "Monday", "Tuesday", etc.
  selected: boolean;
  time?: { hour: number; minute: number; period: "AM" | "PM" };
}

export interface OnboardingData {
  habits: string[]; // Array of 3 habits (max 35 chars each)
  primaryFocus: string | null; // Selected habit from Screen1
  question: string;
  possibleSolution: string;
  selectedDays: DaySchedule[]; // Days selected for scheduling
  currentDayEditing?: string; // Which day is being edited for time
  selectedTime: { hour: number; minute: number; period: "AM" | "PM" }; // For current day being edited
  // Keep troublingAreas for backward compatibility if needed
  troublingAreas?: TroublingArea[];
}

export const TROUBLING_AREAS: TroublingArea[] = [
  "academics",
  "weight loss",
  "relationships",
  "career",
  "health",
  "finance",
  "personal growth",
  "creativity",
];

