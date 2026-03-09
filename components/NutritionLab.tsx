import React, { useState } from 'react';
import { UserProfile, DailyPlan } from '../types';
import { generateRegionalMealPlan } from '../services/geminiService';
import { RefreshCw, Utensils, ShoppingBag, Flame, ChevronRight } from 'lucide-react';

interface NutritionLabProps {
  user: UserProfile;
}

const NutritionLab: React.FC<NutritionLabProps> = ({ user }) => {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateRegionalMealPlan(user);
    setPlan(result);
    setLoading(false);
  };

  const MealCard = ({ title, meal, color }: { title: string, meal: any, color: string }) => (
    <div className="bg-brand-surface backdrop-blur-md border border-slate-700/50 p-5 rounded-2xl mb-4 hover:border-slate-600 transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${color}`}>{title}</h3>
        <span className="text-xs bg-slate-800 px-2 py-1 rounded-md text-slate-300">{meal.calories} kcal</span>
      </div>
      <h4 className="text-xl font-display font-semibold text-white mb-1">{meal.name}</h4>
      <p className="text-brand-muted text-sm mb-4">{meal.description}</p>
      
      <div className="flex gap-4 text-xs text-slate-400">
        <div><span className="text-white font-bold">{meal.protein}g</span> Protein</div>
        <div><span className="text-white font-bold">{meal.carbs}g</span> Carbs</div>
        <div><span className="text-white font-bold">{meal.fat}g</span> Fat</div>
      </div>
    </div>
  );

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Nutrition Lab</h2>
          <p className="text-brand-muted text-sm">AI Chef: {user.region} Edition</p>
        </div>
        <button 
            onClick={handleGenerate}
            disabled={loading}
            className="p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-brand-orange text-brand-orange transition-all disabled:opacity-50"
        >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!plan && !loading && (
        <div className="text-center py-12 px-6 border border-dashed border-slate-700 rounded-3xl bg-slate-900/30">
          <Utensils className="w-12 h-12 text-brand-muted mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Plan Generated</h3>
          <p className="text-brand-muted mb-6">Tap the button to let our AI chef cook up a {user.diet} plan from {user.region}.</p>
          <button 
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-brand-orange to-brand-red py-3 rounded-xl font-semibold text-white shadow-lg shadow-orange-500/20"
          >
            Generate Weekly Plan
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white animate-pulse">Curating spices from {user.region}...</p>
        </div>
      )}

      {plan && (
        <div className="space-y-4 animate-fade-in">
            {/* Macros Summary */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <div className="flex-none w-32 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="text-brand-muted text-xs mb-1">Total Cal</div>
                    <div className="text-white font-bold text-lg flex items-center gap-1">
                        <Flame size={14} className="text-brand-orange" />
                        {plan.breakfast.calories + plan.lunch.calories + plan.snack.calories + plan.dinner.calories}
                    </div>
                </div>
                 <div className="flex-none w-32 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="text-brand-muted text-xs mb-1">Protein Goal</div>
                    <div className="text-white font-bold text-lg">
                        {plan.breakfast.protein + plan.lunch.protein + plan.snack.protein + plan.dinner.protein}g
                    </div>
                </div>
            </div>

            <MealCard title="Breakfast" meal={plan.breakfast} color="text-yellow-400" />
            <MealCard title="Lunch" meal={plan.lunch} color="text-brand-orange" />
            <MealCard title="Snack" meal={plan.snack} color="text-purple-400" />
            <MealCard title="Dinner" meal={plan.dinner} color="text-blue-400" />
            
            <button className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600/20 border border-emerald-600/50 text-emerald-400 rounded-xl font-semibold mt-4">
                <ShoppingBag size={18} />
                Generate Grocery List
            </button>
        </div>
      )}
    </div>
  );
};

export default NutritionLab;
