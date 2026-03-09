import React from 'react';
import { UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Droplet, Plus, Calendar, ChevronRight, HeartPulse } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateUser }) => {
  const data = [
    { name: 'Done', value: 65 },
    { name: 'Remaining', value: 35 },
  ];
  const COLORS = ['#FF6B00', '#1E293B'];

  const waterIntake = user.waterIntake || 0;
  const waterGoal = user.waterGoal || 3000;
  const waterPercentage = Math.min(Math.round((waterIntake / waterGoal) * 100), 100);

  const logWater = (amount: number) => {
    onUpdateUser({
      ...user,
      waterIntake: waterIntake + amount
    });
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Good Morning,</h1>
          <p className="text-brand-orange text-lg font-medium">{user.name}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
            🧘
        </div>
      </div>

      {/* Daily Score Ring */}
      <div className="bg-brand-surface backdrop-blur-md border border-slate-700 rounded-3xl p-6 relative overflow-hidden">
        <h3 className="text-slate-400 text-sm font-medium mb-2">Daily Wellness Score</h3>
        <div className="h-48 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-3xl font-display font-bold text-white">65</span>
            <span className="text-xs text-slate-400 block">%</span>
          </div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>1,200 / 2,100 kcal</span>
            <span>45 min workout</span>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Next Meal */}
        <div className="col-span-2 bg-gradient-to-r from-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700 flex justify-between items-center">
            <div>
                <p className="text-xs text-brand-orange mb-1 font-bold tracking-wide">UP NEXT • 1:00 PM</p>
                <h4 className="text-white font-bold text-lg">Rajma Chawal</h4>
                <p className="text-slate-400 text-xs">450 kcal • High Protein</p>
            </div>
            <button className="bg-slate-700/50 p-2 rounded-full text-white hover:bg-brand-orange transition-colors">
                <ChevronRight size={20} />
            </button>
        </div>

        {/* Hydration Section */}
        <div className="col-span-2 bg-brand-surface p-5 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                        <Droplet size={24} fill={waterPercentage > 0 ? "currentColor" : "none"} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold">Daily Hydration</h4>
                        <p className="text-xs text-slate-400">Stay focused, stay hydrated</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xl font-display font-bold text-white">{(waterIntake / 1000).toFixed(1)}L</span>
                    <span className="text-xs text-slate-400 block">of {(waterGoal / 1000).toFixed(1)}L</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                    <span>Progress</span>
                    <span>{waterPercentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div 
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${waterPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Quick Log Buttons */}
            <div className="flex gap-2">
                <button 
                    onClick={() => logWater(250)}
                    className="flex-1 bg-slate-800 hover:bg-blue-600/20 border border-slate-700 hover:border-blue-500/50 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={14} /> 250ml
                </button>
                <button 
                    onClick={() => logWater(500)}
                    className="flex-1 bg-slate-800 hover:bg-blue-600/20 border border-slate-700 hover:border-blue-500/50 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={14} /> 500ml
                </button>
            </div>
        </div>

        {/* Quick Workout */}
        <div className="bg-brand-surface p-4 rounded-2xl border border-slate-700 flex flex-col justify-between h-32 relative group cursor-pointer overflow-hidden">
             <div className="absolute inset-0 bg-brand-orange/5 group-hover:bg-brand-orange/10 transition-colors"></div>
             <div className="p-2 bg-brand-orange/20 rounded-lg text-brand-orange w-fit z-10">
                <Plus size={18} />
             </div>
             <div className="z-10">
                <h4 className="text-white font-bold text-sm">Quick Log</h4>
                <p className="text-xs text-slate-400">Add snack or workout</p>
             </div>
        </div>

        {/* Sleep Tracker (Placeholder for grid balance) */}
        <div className="bg-brand-surface p-4 rounded-2xl border border-slate-700 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <HeartPulse size={18} />
                </div>
                <span className="text-white font-bold">7h 20m</span>
            </div>
            <div>
                 <p className="text-xs text-slate-400 mb-2">Sleep Quality: 85%</p>
                 <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[85%]"></div>
                 </div>
            </div>
        </div>
      </div>

      {/* Upcoming Webinar */}
      <div className="bg-indigo-900/30 border border-indigo-500/30 p-4 rounded-2xl flex items-center gap-4">
        <div className="bg-indigo-500/20 p-3 rounded-full text-indigo-400">
            <Calendar size={20} />
        </div>
        <div>
            <p className="text-xs text-indigo-300 font-bold mb-0.5">LIVE IN 2 HRS</p>
            <h4 className="text-white text-sm font-medium">Myths of Protein w/ Dr. Sharma (for demo purposes only)</h4>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
