# DayOne

DayOne is a mobile-first wellness web app built for the Indian market. It uses Google Gemini AI to provide personalized nutrition, fitness, and recovery plans based on the user's region, diet, and injury status.

## Features

- **Onboarding:** A quick chat interface to get your name, region, diet, and injury details.
- **Dashboard:** Tracks your daily wellness score, water intake, sleep quality, and upcoming meals.
- **Nutrition Lab:** Generates regional, diet-specific daily meal plans (with macro breakdowns) using AI.
- **Fitness Studio:** An interactive body map that gives you targeted exercises and adapts them if you have an injury.
- **Recovery Hub:** Gives customized recovery nutrition and movement tips based on your reported injuries.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Google Gemini AI (for personalized content generation)
- Recharts (for dashboard stats)
- Lucide React (for icons)

## Local Setup

Make sure you have [Node.js](https://nodejs.org/) installed, then follow these steps:

1. **Clone the repo:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/DayOnePrototype-main.git
   cd DayOnePrototype-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the AI (Optional but recommended):**
   The app uses Google Gemini to generate dynamic workouts and meal plans. If you don't add an API key, it will just load some fallback demo data.
   - Grab a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
   - Create a `.env` file in the root folder and add:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Run the app:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## Project Structure

- `/components`: UI elements like `Dashboard.tsx`, `FitnessStudio.tsx`, and `NutritionLab.tsx`.
- `/services/geminiService.ts`: Handles all the AI calls to Gemini (and fallbacks).
- `App.tsx`: Main navigation and tab switching logic.
- `types.ts`: TypeScript definitions used across the app.

## Available Scripts

- `npm run dev`: Starts the local dev server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs type checking.
