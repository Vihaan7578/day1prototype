import React, { useState } from 'react';
import { UserProfile, Region, Diet, InjuryType } from '../types';
import { Save, LogOut, User } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [editedUser, setEditedUser] = useState<UserProfile>(user);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to completely reset your profile? All local data will be lost.")) {
      localStorage.removeItem('dayone_user');
      window.location.reload();
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Profile</h2>
          <p className="text-brand-muted text-sm">Your Personal Details</p>
        </div>
        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-brand-orange border border-brand-orange/30">
          <User size={24} />
        </div>
      </div>

      <div className="bg-brand-surface border border-slate-700 rounded-2xl p-5 space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Name</label>
          <input 
            type="text" 
            value={editedUser.name}
            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-brand-orange transition-colors"
          />
        </div>

        {/* Region */}
        <div>
          <label className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Region</label>
          <select 
            value={editedUser.region}
            onChange={(e) => setEditedUser({ ...editedUser, region: e.target.value as Region })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-brand-orange transition-colors appearance-none"
          >
            {Object.values(Region).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Diet */}
        <div>
          <label className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Dietary Preference</label>
          <select 
            value={editedUser.diet}
            onChange={(e) => setEditedUser({ ...editedUser, diet: e.target.value as Diet })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-brand-orange transition-colors appearance-none"
          >
            {Object.values(Diet).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Injury */}
        <div>
          <label className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Injury Status</label>
          <select 
            value={editedUser.injury}
            onChange={(e) => setEditedUser({ ...editedUser, injury: e.target.value as InjuryType })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-brand-orange transition-colors appearance-none"
          >
            {Object.values(InjuryType).map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-brand-orange to-brand-red text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
      >
        <Save size={20} />
        {isSaved ? "Saved!" : "Save Profile"}
      </button>

      <button 
        onClick={handleReset}
        className="w-full mt-4 bg-slate-800 text-rose-400 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border border-slate-700 hover:border-rose-500/50 hover:bg-rose-500/10 transition-colors"
      >
        <LogOut size={18} />
        Reset App Data
      </button>
    </div>
  );
};

export default Profile;
