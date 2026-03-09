import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, DailyPlan, MuscleExercise } from "../types";

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!API_KEY) {
    console.warn("Gemini API Key is not set. AI features will use demo data.");
    return null;
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
}

const MODEL_NAME = 'gemini-2.0-flash';

// Fallback demo data when API key is missing
const DEMO_MEAL_PLAN: DailyPlan = {
  breakfast: { name: "Masala Oats", calories: 280, protein: 10, carbs: 45, fat: 6, description: "Oats cooked with mixed vegetables and Indian spices" },
  lunch: { name: "Rajma Chawal", calories: 450, protein: 18, carbs: 65, fat: 8, description: "Kidney bean curry with steamed rice" },
  snack: { name: "Sprout Chaat", calories: 180, protein: 12, carbs: 25, fat: 3, description: "Mixed sprouts with onion, tomato and chaat masala" },
  dinner: { name: "Paneer Tikka + Roti", calories: 420, protein: 22, carbs: 40, fat: 14, description: "Grilled cottage cheese with whole wheat flatbread" }
};

const DEMO_EXERCISES: MuscleExercise[] = [
  { name: "Push-ups", reps: "12-15", sets: "3", tip: "Keep your core tight and elbows at 45 degrees" },
  { name: "Dumbbell Press", reps: "10-12", sets: "3", tip: "Control the negative portion of the movement" },
  { name: "Cable Flyes", reps: "12-15", sets: "3", tip: "Squeeze at the peak contraction for maximum activation" }
];

const DEMO_RECOVERY = {
  foodFocus: ["Turmeric & Ginger", "Omega-3 rich foods", "Vitamin C sources"],
  movementTips: ["Avoid high-impact activities", "Focus on gentle stretching", "Use ice/heat therapy as needed"]
};

export const generateRegionalMealPlan = async (user: UserProfile): Promise<DailyPlan | null> => {
  const client = getAI();
  if (!client) return DEMO_MEAL_PLAN;

  const prompt = `
    Act as an expert Indian nutritionist. Create a one-day meal plan for a user with the following profile:
    Age: ${user.age}, Gender: ${user.gender}, Region: ${user.region}, Diet: ${user.diet}.
    Focus on authentic regional dishes from ${user.region}.
    Provide Breakfast, Lunch, Snack, and Dinner.
  `;

  const mealItemSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the dish" },
      calories: { type: Type.NUMBER, description: "Approximate calories" },
      protein: { type: Type.NUMBER, description: "Protein in grams" },
      carbs: { type: Type.NUMBER, description: "Carbs in grams" },
      fat: { type: Type.NUMBER, description: "Fat in grams" },
      description: { type: Type.STRING, description: "Short description or key ingredients" },
    },
    required: ["name", "calories", "protein", "carbs", "fat", "description"],
  };

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      breakfast: mealItemSchema,
      lunch: mealItemSchema,
      snack: mealItemSchema,
      dinner: mealItemSchema,
    },
    required: ["breakfast", "lunch", "snack", "dinner"],
  };

  try {
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyPlan;
    }
    return null;
  } catch (error) {
    console.error("Gemini Meal Plan Error:", error);
    return DEMO_MEAL_PLAN;
  }
};

export const generateWorkoutAdvice = async (muscleGroup: string, injury: string): Promise<MuscleExercise[]> => {
  const client = getAI();
  if (!client) return DEMO_EXERCISES;

  const prompt = `
    Suggest 3 exercises for the ${muscleGroup}.
    User injury status: ${injury}.
    If the user has an injury, provide safe alternatives or rehab-focused movements.
    Return a list of 3 exercises.
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        reps: { type: Type.STRING },
        sets: { type: Type.STRING },
        tip: { type: Type.STRING, description: "Form tip or safety warning" },
      },
      required: ["name", "reps", "sets", "tip"],
    }
  };

  try {
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as MuscleExercise[];
    }
    return [];
  } catch (error) {
    console.error("Gemini Workout Error:", error);
    return DEMO_EXERCISES;
  }
};

export const generateRecoveryTips = async (injury: string): Promise<{ foodFocus: string[], movementTips: string[] } | null> => {
  const client = getAI();
  if (!client) return DEMO_RECOVERY;

   const prompt = `
    User has ${injury}. Provide 3 key nutrients/foods to focus on for recovery and 3 movement restrictions/tips.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      foodFocus: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      movementTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  };

  try {
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Recovery Error:", error);
    return DEMO_RECOVERY;
  }
}

