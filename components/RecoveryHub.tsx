import React, { useEffect, useState } from 'react';
import { UserProfile, InjuryType } from '../types';
import { generateRecoveryTips } from '../services/geminiService';
import { ShieldCheck, UserCheck, Star, Activity, ArrowRight } from 'lucide-react';

interface RecoveryHubProps {
  user: UserProfile;
}

const RecoveryHub: React.FC<RecoveryHubProps> = ({ user }) => {
  const [tips, setTips] = useState<{ foodFocus: string[], movementTips: string[] } | null>(null);

  useEffect(() => {
    if (user.injury !== InjuryType.None) {
      const fetchRecovery = async () => {
        const data = await generateRecoveryTips(user.injury);
        setTips(data);
      };
      fetchRecovery();
    }
  }, [user.injury]);

  return (
    <div className="p-4 pb-24 space-y-6">
       <div>
          <h2 className="text-2xl font-display font-bold text-white">Recovery & Experts</h2>
          <p className="text-brand-muted text-sm">Heal Faster, Train Smarter</p>
       </div>

       {/* Injury Status Card */}
       {user.injury !== InjuryType.None ? (
         <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <Activity size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-white">Active Recovery</h3>
                    <p className="text-xs text-slate-400">{user.injury} Protocol</p>
                </div>
            </div>

            <div className="space-y-4">
                {tips ? (
                    <>
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Nutrient Focus</h4>
                            <div className="flex flex-wrap gap-2">
                                {tips.foodFocus.map((food, i) => (
                                    <span key={i} className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 border border-slate-700">
                                        {food}
                                    </span>
                                ))}
                            </div>
                        </div>
                         <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-rose-400 uppercase tracking-wider">Avoid / Caution</h4>
                            <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                                {tips.movementTips.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="text-sm text-slate-500 animate-pulse">Analyzing injury protocol...</div>
                )}
            </div>
         </div>
       ) : (
           <div className="bg-brand-surface p-6 rounded-2xl border border-slate-700 text-center">
               <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
               <h3 className="text-white font-bold">System Optimization</h3>
               <p className="text-sm text-slate-400">You are injury free! Focus on hypertrophy and endurance.</p>
           </div>
       )}

       {/* Expert Marketplace (Mock) */}
       <div>
           <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Top Rated Experts</h3>
                <span className="text-xs text-brand-orange">View All</span>
           </div>
           
           <div className="grid gap-4">
                {[
                    { name: 'Dr. Sharma (for demo purposes only)', role: 'Physiotherapist', rating: 4.9, spec: 'Knee Rehab' },
                    { name: 'Coach Arjun (for demo purposes only)', role: 'Strength Coach', rating: 4.8, spec: 'Hypertrophy' },
                ].map((expert, i) => (
                    <div key={i} className="flex items-center gap-4 bg-brand-surface p-4 rounded-xl border border-slate-700 hover:border-brand-orange/50 transition-colors">
                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-slate-300">
                            <UserCheck size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-white text-sm">{expert.name}</h4>
                            <p className="text-xs text-slate-400">{expert.role} • {expert.spec}</p>
                        </div>
                        <div className="text-right">
                             <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1 justify-end">
                                <Star size={10} fill="currentColor" /> {expert.rating}
                             </div>
                             <button className="text-xs bg-brand-orange text-white px-3 py-1.5 rounded-lg">Book</button>
                        </div>
                    </div>
                ))}
           </div>
       </div>
    </div>
  );
};

export default RecoveryHub;
