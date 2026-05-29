import React, { useState } from 'react';
import { 
  User, Sliders, RefreshCw, Dumbbell, 
  Target, Info, CheckCircle2, ShieldCheck 
} from 'lucide-react';

export default function Settings({ userProfile, onSaveProfile, onResetData }) {
  const [formData, setFormData] = useState(userProfile || {
    name: '',
    goal: 'Fat Loss',
    gender: 'Male',
    age: 26,
    height: 175,
    weight: 75,
    targetWeight: 70,
    activityLevel: 'Moderately Active',
    experience: 'Intermediate',
    units: 'kg',
    calorieTarget: 2200,
    macroTargets: { protein: 150, carbs: 220, fat: 70 }
  });

  const goals = ['Fat Loss', 'Muscle Gain', 'Lean Bulk', 'Body Recomposition', 'Maintenance'];
  const activityLevels = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'];
  const experiences = ['Beginner', 'Intermediate', 'Advanced'];

  // Recalculates based on edits
  const calculateTargets = (data) => {
    let w = parseFloat(data.weight);
    let h = parseFloat(data.height);
    let a = parseInt(data.age);

    if (data.units === 'lbs') {
      w = w * 0.453592; // lbs to kg
    }

    let bmr = 0;
    if (data.gender === 'Male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const activityMultipliers = {
      'Sedentary': 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725,
    };

    const multiplier = activityMultipliers[data.activityLevel] || 1.2;
    const tdee = Math.round(bmr * multiplier);

    let calorieTarget = tdee;
    let proteinPerKg = 2.0;
    let fatPct = 0.25;

    switch (data.goal) {
      case 'Fat Loss':
        calorieTarget = Math.round(tdee - 500);
        proteinPerKg = 2.2;
        break;
      case 'Muscle Gain':
        calorieTarget = Math.round(tdee + 350);
        proteinPerKg = 2.0;
        break;
      case 'Lean Bulk':
        calorieTarget = Math.round(tdee + 150);
        proteinPerKg = 2.1;
        break;
      case 'Body Recomposition':
        calorieTarget = Math.round(tdee - 150);
        proteinPerKg = 2.2;
        break;
      case 'Maintenance':
      default:
        calorieTarget = tdee;
        proteinPerKg = 1.8;
        break;
    }

    const proteinGrams = Math.round(w * proteinPerKg);
    const fatGrams = Math.round((calorieTarget * fatPct) / 9);
    const carbGrams = Math.round((calorieTarget - (proteinGrams * 4) - (fatGrams * 9)) / 4);

    return {
      ...data,
      tdee,
      calorieTarget,
      macroTargets: {
        protein: proteinGrams,
        carbs: carbGrams,
        fat: fatGrams,
      }
    };
  };

  const handleFieldChange = (field, val) => {
    const updated = { ...formData, [field]: val };
    setFormData(updated);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const finalProfile = calculateTargets(formData);
    onSaveProfile(finalProfile);
    alert('Biometric parameters updated. Calorie & macro targets updated dynamically across the platform!');
  };

  return (
    <div className="max-w-xl mx-auto w-full pb-20 animate-fade-in space-y-6">
      <div className="glass rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <h2 className="text-xl font-bold font-display text-white relative z-10 flex items-center gap-1.5">
          <User className="w-5 h-5 text-emerald-400" />
          Profile Configuration
        </h2>
        <p className="text-xs text-gray-400 mt-1 relative z-10">
          Modify core metabolic parameters, goals, and measurement units to dynamically calculate TDEE baseline indices.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="glass rounded-3xl p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-bold pl-1">Full Name</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/5 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-white outline-none mt-1"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-bold pl-1">Gender Identification</label>
            <select
              className="w-full bg-white/5 border border-white/5 focus:border-emerald-500 rounded-xl py-2.5 px-3 text-xs text-gray-300 outline-none mt-1"
              value={formData.gender}
              onChange={(e) => handleFieldChange('gender', e.target.value)}
            >
              {['Male', 'Female', 'Non-binary'].map(g => (
                <option key={g} value={g} className="bg-slate-900">{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-bold pl-1">Age</label>
            <input
              type="number"
              className="w-full bg-white/5 border border-white/5 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-white outline-none mt-1"
              value={formData.age}
              onChange={(e) => handleFieldChange('age', parseInt(e.target.value) || '')}
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-bold pl-1">Height (cm)</label>
            <input
              type="number"
              className="w-full bg-white/5 border border-white/5 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-white outline-none mt-1"
              value={formData.height}
              onChange={(e) => handleFieldChange('height', parseInt(e.target.value) || '')}
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-bold pl-1">Weight ({formData.units})</label>
            <input
              type="number"
              step="0.1"
              className="w-full bg-white/5 border border-white/5 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-white outline-none mt-1"
              value={formData.weight}
              onChange={(e) => handleFieldChange('weight', parseFloat(e.target.value) || '')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-bold pl-1">Primary Fitness Goal</label>
            <select
              className="w-full bg-white/5 border border-white/5 focus:border-emerald-500 rounded-xl py-2.5 px-3 text-xs text-gray-300 outline-none mt-1"
              value={formData.goal}
              onChange={(e) => handleFieldChange('goal', e.target.value)}
            >
              {goals.map(g => (
                <option key={g} value={g} className="bg-slate-900">{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-bold pl-1">Activity Level</label>
            <select
              className="w-full bg-white/5 border border-white/5 focus:border-emerald-500 rounded-xl py-2.5 px-3 text-xs text-gray-300 outline-none mt-1"
              value={formData.activityLevel}
              onChange={(e) => handleFieldChange('activityLevel', e.target.value)}
            >
              {activityLevels.map(a => (
                <option key={a} value={a} className="bg-slate-900">{a}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-bold pl-1">Experience Level</label>
            <select
              className="w-full bg-white/5 border border-white/5 focus:border-emerald-500 rounded-xl py-2.5 px-3 text-xs text-gray-300 outline-none mt-1"
              value={formData.experience}
              onChange={(e) => handleFieldChange('experience', e.target.value)}
            >
              {experiences.map(e => (
                <option key={e} value={e} className="bg-slate-900">{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-bold pl-1">Measurement Unit</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-900/50 p-1 border border-white/5 rounded-xl mt-1">
              {['kg', 'lbs'].map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleFieldChange('units', u)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    formData.units === u ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          Update Parameters & Recalculate targets
        </button>
      </form>

      <div className="glass rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400">Danger Zone</h3>
        <p className="text-[11px] text-gray-400">Resetting local files will delete all daily calorie/workout logs, streaks, levels, and weight history from localStorage.</p>
        
        <button
          onClick={() => {
            if (confirm("Are you absolutely sure you want to reset all profile and historical logs data? This action is irreversible.")) {
              onResetData();
            }
          }}
          className="w-full py-2.5 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs font-semibold transition-all"
        >
          Reset All System Records
        </button>
      </div>
    </div>
  );
}
