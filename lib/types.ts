// Data models for the CMU Fuel Planner

export type ClassBlock = {
  id: string;
  title: string;
  location?: string;
  start: string; // ISO string
  end: string;   // ISO string
};

export type MealOrWorkoutBlock = {
  id: string;
  type: "meal" | "workout";
  title: string;
  location?: string;
  start: string; // ISO
  end: string;   // ISO
  metadata?: Record<string, any>;
};

export type PreferredMealTime = {
  label: string;
  startHour: number;
  endHour: number;
};

export type NutritionPreferences = {
  mealsPerDay: number;
  preferredMealTimes: PreferredMealTime[];
  favoriteDiningOptions: string[];
  noGoDiningOptions: string[];
  dietaryRestrictions: string[]; // e.g., "vegetarian", "vegan", "halal", "kosher"
  allergies: string[]; // e.g., "peanuts", "dairy", "gluten", "shellfish"
  nutritionGoals: string[]; // e.g., "high protein", "low carb", "balanced"
};

export type FitnessPreferences = {
  workoutsPerWeek: number;
  activityTypes: string[];
  workoutSplit?: string;
  targetMuscles?: string[];
  facilitiesOpenWindows?: { day: string; startHour: number; endHour: number }[];
};

export type DiningLocation = {
  name: string;
  description: string;
  isOnCampus: boolean;
  noGo: boolean;
  openWindows: { day: string; startHour: number; endHour: number }[];
};

export type ScheduleBlock = ClassBlock | MealOrWorkoutBlock;

