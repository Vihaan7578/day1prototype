import React, { useState } from 'react';
import { UserProfile, MuscleExercise } from '../types';
import { generateWorkoutAdvice } from '../services/geminiService';
import { Activity, X, Play, AlertCircle } from 'lucide-react';

interface FitnessStudioProps {
  user: UserProfile;
}

const FitnessStudio: React.FC<FitnessStudioProps> = ({ user }) => {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [exercises, setExercises] = useState<MuscleExercise[]>([]);
  const [loading, setLoading] = useState(false);

  const handleMuscleClick = async (muscle: string) => {
    setSelectedMuscle(muscle);
    setLoading(true);
    const data = await generateWorkoutAdvice(muscle, user.injury);
    setExercises(data);
    setLoading(false);
  };

  const MusclePath = ({ d, name, className }: { d: string, name: string, className?: string }) => (
    <path 
      d={d} 
      onClick={() => handleMuscleClick(name)}
      className={`cursor-pointer hover:fill-brand-orange transition-colors duration-300 ${className}`}
      fill={selectedMuscle === name ? '#FF6B00' : '#334155'}
      stroke="#1E293B"
      strokeWidth="2"
    />
  );

  return (
    <div className="p-4 h-full flex flex-col">
       <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-white">Fitness Studio</h2>
          <p className="text-brand-muted text-sm">Interactive Muscle Map</p>
       </div>

       {/* Simplified SVG Body Map */}
       <div className="flex-1 flex justify-center items-center relative min-h-[400px]">
         <svg viewBox="0 0 200 400" className="h-full drop-shadow-2xl">
            {/* Head */}
            <circle cx="100" cy="40" r="25" fill="#1E293B" />
            
            {/* Chest */}
            <MusclePath name="Chest" d="M70,70 Q100,90 130,70 L130,110 Q100,130 70,110 Z" />
            
            {/* Abs */}
            <MusclePath name="Abs" d="M75,115 L125,115 L120,160 L80,160 Z" />
            
            {/* Shoulders */}
            <MusclePath name="Shoulders" d="M45,70 Q60,60 70,70 L70,100 Q50,90 45,70 Z M155,70 Q140,60 130,70 L130,100 Q150,90 155,70 Z" />
            
            {/* Arms */}
            <MusclePath name="Arms" d="M45,75 L40,130 L65,130 L70,75 Z M155,75 L160,130 L135,130 L130,75 Z" />
            
            {/* Legs */}
            <MusclePath name="Quads" d="M75,165 L125,165 L120,280 L80,280 Z" />
            
            {/* Calves */}
            <MusclePath name="Calves" d="M80,285 L120,285 L115,360 L85,360 Z" />
         </svg>
         
         <div className="absolute bottom-4 right-4 bg-brand-surface backdrop-blur px-3 py-1 rounded-full text-xs text-brand-muted border border-slate-700">
            Tap a muscle group
         </div>
       </div>

       {/* Modal for Exercises */}
       {selectedMuscle && (
         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 relative animate-slide-up">
                <button 
                  onClick={() => setSelectedMuscle(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  <X size={24} />
                </button>

                <h3 className="text-2xl font-display font-bold text-white mb-1">{selectedMuscle} Blast</h3>
                {user.injury !== 'None' && (
                    <div className="flex items-center gap-2 text-amber-400 text-xs mb-4">
                        <AlertCircle size={12} />
                        <span>Adapted for {user.injury}</span>
                    </div>
                )}

                {loading ? (
                   <div className="py-12 text-center">
                      <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
                   </div>
                ) : (
                    <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                        {exercises.map((ex, idx) => (
                            <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-white">{ex.name}</h4>
                                    <span className="text-xs bg-brand-orange/20 text-brand-orange px-2 py-1 rounded">{ex.reps} | {ex.sets}</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-slate-400">
                                    <Play size={14} className="mt-1 text-emerald-500 shrink-0" />
                                    <p>{ex.tip}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
         </div>
       )}
    </div>
  );
};

export default FitnessStudio;
