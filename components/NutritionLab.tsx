import React, { useState } from 'react';
import { UserProfile, DailyPlan, MealItem } from '../types';
import { generateRegionalMealPlan, modifyMealPlan, generateGroceryList } from '../services/geminiService';
import { RefreshCw, Utensils, ShoppingBag, Flame, ChevronRight, CheckCircle2, MessageSquareText, X } from 'lucide-react';

interface NutritionLabProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const NutritionLab: React.FC<NutritionLabProps> = ({ user, onUpdateUser }) => {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  
  // New State variables
  const [cravingInput, setCravingInput] = useState('');
  const [modifyInput, setModifyInput] = useState('');
  const [modifying, setModifying] = useState(false);
  const [groceries, setGroceries] = useState<string[] | null>(null);
  const [loadingGroceries, setLoadingGroceries] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setRateLimitMessage(null);
    try {
       const result = await generateRegionalMealPlan(user, cravingInput);
       setPlan(result);
    } catch (e: any) {
       if (e.message === 'RATE_LIMIT_ERROR') {
          setRateLimitMessage("⚠️ Gemini API Rate Limit Exceeded. Please wait a minute before trying again.");
       }
    } finally {
       setLoading(false);
    }
  };

  const handleModify = async () => {
    if (!plan || !modifyInput.trim()) return;
    setModifying(true);
    setRateLimitMessage(null);
    try {
       const updatedPlan = await modifyMealPlan(plan, modifyInput);
       if (updatedPlan) setPlan(updatedPlan);
       setModifyInput('');
    } catch (e: any) {
       if (e.message === 'RATE_LIMIT_ERROR') {
          setRateLimitMessage("⚠️ API Rate Limit Exceeded. Please wait 60 seconds.");
       }
    } finally {
       setModifying(false);
    }
  };

  const handleGenerateGroceryList = async () => {
    if (!plan) return;
    setLoadingGroceries(true);
    setRateLimitMessage(null);
    try {
       const list = await generateGroceryList(plan);
       setGroceries(list);
    } catch (e: any) {
       if (e.message === 'RATE_LIMIT_ERROR') {
          setRateLimitMessage("⚠️ API Rate Limit Exceeded. Please wait 60 seconds.");
       }
    } finally {
       setLoadingGroceries(false);
    }
  };

  const toggleMealLogged = (mealId: string) => {
    const isLogged = user.loggedMeals?.includes(mealId);
    let newLoggedMeals = user.loggedMeals ? [...user.loggedMeals] : [];
    
    if (isLogged) {
       newLoggedMeals = newLoggedMeals.filter(m => m !== mealId);
    } else {
       newLoggedMeals.push(mealId);
    }
    
    onUpdateUser({ ...user, loggedMeals: newLoggedMeals });
  };

  const MealCard = ({ title, mealId, meal, color }: { title: string, mealId: string, meal: MealItem, color: string }) => {
    const isLogged = user.loggedMeals?.includes(mealId);
    
    return (
      <div className={`bg-brand-surface backdrop-blur-md border ${isLogged ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-slate-700/50'} p-5 rounded-2xl mb-4 hover:border-slate-600 transition-all relative overflow-hidden`}>
        {/* Toggle Button */}
        <button 
          onClick={() => toggleMealLogged(mealId)}
          className={`absolute top-4 right-4 flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${
            isLogged ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          <CheckCircle2 size={14} />
          {isLogged ? 'Logged' : 'Mark Eaten'}
        </button>

        <div className="flex justify-between items-start mb-2 pr-24">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${color}`}>{title}</h3>
        </div>
        
        <div className="flex justify-between items-end mb-1">
           <h4 className="text-xl font-display font-semibold text-white">{meal.name}</h4>
           <span className="text-xs bg-slate-800 px-2 py-1 rounded-md text-slate-300 mb-1">{meal.calories} kcal</span>
        </div>
        
        <p className="text-brand-muted text-sm mb-4">{meal.description}</p>
        
        <div className="flex gap-4 text-xs text-slate-400">
          <div><span className="text-white font-bold">{meal.protein}g</span> Protein</div>
          <div><span className="text-white font-bold">{meal.carbs}g</span> Carbs</div>
          <div><span className="text-white font-bold">{meal.fat}g</span> Fat</div>
        </div>
      </div>
    );
  };

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
          <p className="text-brand-muted mb-6">Let our AI chef cook up a {user.diet} plan from {user.region}.</p>
          
          <div className="mb-6">
             <label className="text-left block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Any Cravings? (Optional)</label>
             <input 
               type="text" 
               placeholder="e.g. 'I want something spicy for lunch'"
               value={cravingInput}
               onChange={e => setCravingInput(e.target.value)}
               className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange text-sm"
             />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-orange to-brand-red py-3 rounded-xl font-semibold text-white shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center gap-2 items-center"
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : null}
            {loading ? "Generating Plan..." : "Generate Today's Plan"}
          </button>
          
          {rateLimitMessage && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 text-xs font-bold animate-slide-up flex items-center justify-center text-center gap-2">
               {rateLimitMessage}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white animate-pulse">Curating spices from {user.region}...</p>
        </div>
      )}

      {plan && !loading && (
        <div className="space-y-4 animate-fade-in">
            {rateLimitMessage && (
               <div className="mb-2 p-3 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 text-xs font-bold animate-slide-up flex items-center justify-center text-center gap-2">
                  {rateLimitMessage}
               </div>
            )}
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

            <MealCard title="Breakfast" mealId="breakfast" meal={plan.breakfast} color="text-yellow-400" />
            <MealCard title="Lunch" mealId="lunch" meal={plan.lunch} color="text-brand-orange" />
            <MealCard title="Snack" mealId="snack" meal={plan.snack} color="text-purple-400" />
            <MealCard title="Dinner" mealId="dinner" meal={plan.dinner} color="text-blue-400" />
            
            {/* Modification Input */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4 mt-6">
               <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                 <MessageSquareText size={14} /> Want to change something?
               </label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={modifyInput}
                   onChange={e => setModifyInput(e.target.value)}
                   placeholder="e.g. 'Swap dinner for a light soup'"
                   className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-orange text-sm"
                 />
                 <button 
                   onClick={handleModify}
                   disabled={modifying || !modifyInput.trim()}
                   className="bg-slate-700 px-4 py-2 rounded-xl text-white font-medium hover:bg-brand-orange transition-colors disabled:opacity-50"
                 >
                   {modifying ? <RefreshCw size={18} className="animate-spin" /> : 'Update'}
                 </button>
               </div>
            </div>

            <button 
                onClick={handleGenerateGroceryList}
                disabled={loadingGroceries}
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/50 text-emerald-400 rounded-xl font-semibold mt-4 transition-colors"
            >
                {loadingGroceries ? <RefreshCw size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
                {loadingGroceries ? "Extracting Ingredients..." : "Generate Grocery List"}
            </button>
        </div>
      )}

      {/* Grocery List Modal */}
      {groceries && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm sm:items-center sm:justify-center p-4 pb-20 sm:pb-4">
           <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 relative animate-slide-up max-h-[70vh] flex flex-col">
              <button 
                onClick={() => setGroceries(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                    <ShoppingBag size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-display font-bold text-white">Grocery List</h3>
                    <p className="text-xs text-brand-muted">Extracted from today's meal plan</p>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-2">
                 {groceries.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                       <div className="w-5 h-5 rounded-md border border-slate-500 bg-slate-900 shrink-0"></div>
                       <span className="text-sm text-slate-200">{item}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default NutritionLab;
