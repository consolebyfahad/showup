export type TroublingArea =
  | "academics"
  | "weight loss"
  | "relationships"
  | "career"
  | "health"
  | "finance"
  | "personal growth"
  | "creativity";

export interface OnboardingData {
  troublingAreas: TroublingArea[];
  primaryFocus: TroublingArea | null;
  question: string;
  possibleSolution: string;
  selectedTime: { hour: number; minute: number; period: "AM" | "PM" };
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

