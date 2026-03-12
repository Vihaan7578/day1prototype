import React, { useState, useEffect } from 'react';
import { UserProfile, Region, Diet, InjuryType } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import NutritionLab from './components/NutritionLab';
import FitnessStudio from './components/FitnessStudio';
import RecoveryHub from './components/RecoveryHub';
import Profile from './components/Profile';
import { Home, Utensils, Dumbbell, HeartPulse, User } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'meals' | 'train' | 'recover' | 'profile'>('home');

  // Load user from local storage on mount (simulated persistence)
  useEffect(() => {
    const savedUserStr = localStorage.getItem('dayone_user');
    if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr) as UserProfile;
        const todayStr = new Date().toDateString();
        
        // Reset daily metrics if it's a new day
        if (savedUser.lastActiveDate !== todayStr) {
           const updatedUser = {
             ...savedUser,
             waterIntake: 0,
             snacksLogged: 0,
             loggedMeals: [],
             lastActiveDate: todayStr
           };
           setUser(updatedUser);
           localStorage.setItem('dayone_user', JSON.stringify(updatedUser));
        } else {
           setUser(savedUser);
        }
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    const enrichedProfile = {
      ...profile,
      waterIntake: 0,
      waterGoal: 3000,
      snacksLogged: 0,
      loggedMeals: [],
      lastActiveDate: new Date().toDateString()
    };
    setUser(enrichedProfile);
    localStorage.setItem('dayone_user', JSON.stringify(enrichedProfile));
  };

  const updateUser = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    localStorage.setItem('dayone_user', JSON.stringify(updatedProfile));
  };

  if (!user || !user.isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard user={user} onUpdateUser={updateUser} />;
      case 'meals': return <NutritionLab user={user} onUpdateUser={updateUser} />;
      case 'train': return <FitnessStudio user={user} />;
      case 'recover': return <RecoveryHub user={user} />;
      case 'profile': return <Profile user={user} onUpdateUser={updateUser} />;
      default: return <Dashboard user={user} onUpdateUser={updateUser}/>;
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
        activeTab === id ? 'text-brand-orange' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text font-sans selection:bg-brand-orange selection:text-white">
      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-screen bg-brand-bg shadow-2xl relative overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-orange/5 to-transparent pointer-events-none" />
        
        {renderContent()}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 h-20 pb-4 z-50">
          <div className="flex justify-around items-center h-full px-2">
            <NavItem id="home" icon={Home} label="Home" />
            <NavItem id="meals" icon={Utensils} label="Meals" />
            
            {/* Floating Action Button (Center) */}
            <div className="relative -top-6">
                <button 
                  onClick={() => setActiveTab('train')}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 transition-transform active:scale-95 ${
                    activeTab === 'train' ? 'bg-white text-brand-orange' : 'bg-gradient-to-r from-brand-orange to-brand-red text-white'
                  }`}
                >
                    <Dumbbell size={24} />
                </button>
            </div>

            <NavItem id="recover" icon={HeartPulse} label="Recover" />
            <NavItem id="profile" icon={User} label="Profile" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
