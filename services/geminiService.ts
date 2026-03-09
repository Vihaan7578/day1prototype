import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, DailyPlan, MuscleExercise } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

export const generateRegionalMealPlan = async (user: UserProfile): Promise<DailyPlan | null> => {
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
    const response = await ai.models.generateContent({
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
    return null;
  }
};

export const generateWorkoutAdvice = async (muscleGroup: string, injury: string): Promise<MuscleExercise[]> => {
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
    const response = await ai.models.generateContent({
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
    return [];
  }
};

export const generateRecoveryTips = async (injury: string): Promise<{ foodFocus: string[], movementTips: string[] } | null> => {
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
    const response = await ai.models.generateContent({
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
    return null;
  }
}
