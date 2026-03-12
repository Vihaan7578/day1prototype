export enum Region {
  North = 'North India',
  South = 'South India',
  West = 'West India',
  East = 'East India',
  NorthEast = 'North-East India'
}

export enum Diet {
  Veg = 'Vegetarian',
  NonVeg = 'Non-Vegetarian',
  Eggetarian = 'Eggetarian',
  Jain = 'Jain',
  Vegan = 'Vegan'
}

export enum InjuryType {
  None = 'None',
  Fracture = 'Fracture',
  Ligament = 'Ligament Tear',
  Muscle = 'Muscle Strain',
  BackPain = 'Chronic Back Pain'
}

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  region: Region;
  diet: Diet;
  injury: InjuryType;
  isOnboarded: boolean;
  waterIntake?: number; // in ml
  waterGoal?: number; // in ml
  sleepHours?: number; 
  sleepQuality?: number; // percentage
  snacksLogged?: number;
  loggedMeals?: string[]; // IDs or names of meals eaten today (e.g. 'breakfast', 'lunch')
  lastActiveDate?: string; // ISO date string strictly for local day tracking
}

export interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
}

export interface DailyPlan {
  breakfast: MealItem;
  lunch: MealItem;
  snack: MealItem;
  dinner: MealItem;
}

export interface MuscleExercise {
  name: string;
  reps: string;
  sets: string;
  tip: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  type?: 'text' | 'input' | 'select';
  options?: string[];
  field?: keyof UserProfile;
}
