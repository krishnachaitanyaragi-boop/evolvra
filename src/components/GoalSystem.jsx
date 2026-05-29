import React, { useState } from 'react';
import { Target, Dumbbell, Flame, TrendingUp, Sparkles, User, Award, ArrowRight, Check } from 'lucide-react';

export default function GoalSystem({ userProfile, onSaveProfile }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(
    userProfile || {
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
    }
  );

  const goals = [
    {
      id: 'Fat Loss',
      title: 'Fat Loss',
      desc: 'Lose body fat while retaining lean muscle tissue.',
      icon: Flame,
      color: 'from-rose-500 to-orange-500',
      glow: 'rgba(239, 68, 68, 0.4)',
    },
    {
      id: 'Muscle Gain',
      title: 'Muscle Gain',
      desc: 'Build size and strength, prioritizing muscle mass.',
      icon: Dumbbell,
      color: 'from-emerald-500 to-teal-500',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
    {
      id: 'Lean Bulk',
      title: 'Lean Bulk',
      desc: 'Slowly gain muscle mass while minimizing fat gain.',
      icon: Sparkles,
      color: 'from-cyan-500 to-blue-500',
      glow: 'rgba(6, 182, 212, 0.4)',
    },
    {
      id: 'Body Recomposition',
      title: 'Body Recomposition',
      desc: 'Lose fat and gain muscle simultaneously.',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      glow: 'rgba(168, 85, 247, 0.4)',
    },
    {
      id: 'Maintenance',
      title: 'Maintenance',
      desc: 'Maintain current body composition & optimize health.',
      icon: TrendingUp,
      color: 'from-amber-500 to-yellow-500',
      glow: 'rgba(245, 158, 11, 0.4)',
    },
  ];

  const activityLevels = [
    { id: 'Sedentary', title: 'Sedentary', desc: 'Little or no exercise (desk job)' },
    { id: 'Lightly Active', title: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
    { id: 'Moderately Active', title: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
    { id: 'Very Active', title: 'Very Active', desc: 'Heavy exercise 6-7 days/week' },
  ];

  const experiences = ['Beginner', 'Intermediate', 'Advanced'];

  const calculateTDEEAndMacros = (data) => {
    // Mifflin-St Jeor Equation
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

    // Calorie Adjustment & Macros based on Goal
    let calorieTarget = tdee;
    let proteinPerKg = 2.0;
    let fatPct = 0.25; // 25% of calories from fat

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
    const proteinCal = proteinGrams * 4;
    const fatGrams = Math.round((calorieTarget * fatPct) / 9);
    const fatCal = fatGrams * 9;
    const carbCal = calorieTarget - proteinCal - fatCal;
    const carbGrams = Math.round(carbCal / 4);

    return {
      ...data,
      tdee,
      calorieTarget,
      macroTargets: {
        protein: proteinGrams,
        carbs: carbGrams,
        fat: fatGrams,
      },
    };
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const fullProfile = calculateTDEEAndMacros(formData);
      onSaveProfile(fullProfile);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const currentGoalConfig = goals.find((g) => g.id === formData.goal) || goals[0];

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-8 flex flex-col justify-center min-h-[85vh] animate-slide-up">
      {/* Onboarding Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
          EvolvRa
        </h1>
        <p className="text-gray-400 text-sm mt-1">AI-Powered Premium Transformation</p>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {[0, 1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-gradient-to-r from-emerald-500 to-teal-500'
                  : s < step
                  ? 'w-4 bg-emerald-500/60'
                  : 'w-4 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Steps Content */}
      <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        {/* Glow decoration */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 transition-all duration-500"
          style={{ backgroundColor: currentGoalConfig.glow }}
        />

        {step === 0 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold font-display">Who are you, Champion?</h2>
              <p className="text-gray-400 text-sm mt-1">Let's start with the basics to tailor your experience.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl py-3.5 px-4 text-white placeholder-gray-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                  Gender Identification
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Non-binary'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender })}
                      className={`py-3 px-4 rounded-2xl font-medium border transition-all text-sm ${
                        formData.gender === gender
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-transparent text-white shadow-lg'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="99"
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl py-3.5 px-4 text-white outline-none transition-all"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Math.max(1, parseInt(e.target.value) || 0) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                    Preferred Units
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-white/5 rounded-2xl p-1 border border-white/5">
                    {['kg', 'lbs'].map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setFormData({ ...formData, units: u })}
                        className={`py-2 px-3 rounded-xl font-semibold transition-all text-xs ${
                          formData.units === u
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold font-display">What is your Primary Goal?</h2>
              <p className="text-gray-400 text-sm mt-1">EvolvRa dynamically adapts tracking and coaching to this goal.</p>
            </div>

            <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1 no-scrollbar">
              {goals.map((g) => {
                const Icon = g.icon;
                const isSelected = formData.goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: g.id })}
                    className={`w-full flex items-start text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-white/10 border-emerald-500 shadow-md shadow-emerald-500/5'
                        : 'bg-white/5 border-white/5 hover:bg-white/8'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${g.color} text-white shadow-md mr-4 shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-white text-base flex items-center gap-1.5">
                        {g.title}
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{g.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold font-display">Provide Your Biometrics</h2>
              <p className="text-gray-400 text-sm mt-1">Required to accurately calculate your TDEE and macro profiles.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                    Current Weight ({formData.units})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl py-3.5 px-4 text-white outline-none transition-all"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || '' })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                    Target Weight ({formData.units})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl py-3.5 px-4 text-white outline-none transition-all"
                    value={formData.targetWeight}
                    onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) || '' })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl py-3.5 px-4 text-white outline-none transition-all"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || '' })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
                  Activity Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {activityLevels.map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, activityLevel: act.id })}
                      className={`text-left p-3 rounded-2xl border transition-all ${
                        formData.activityLevel === act.id
                          ? 'bg-white/10 border-emerald-500'
                          : 'bg-white/5 border-white/5 hover:bg-white/8'
                      }`}
                    >
                      <div className="font-semibold text-white text-xs">{act.title}</div>
                      <p className="text-[10px] text-gray-400 leading-snug mt-0.5">{act.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold font-display">Experience Level</h2>
              <p className="text-gray-400 text-sm mt-1">Help the coach customize progressive overload suggestions.</p>
            </div>

            <div className="space-y-3">
              {experiences.map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setFormData({ ...formData, experience: exp })}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    formData.experience === exp
                      ? 'bg-white/10 border-emerald-500 text-white shadow-md'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow shadow-emerald-400/50" />
                    <span className="font-semibold text-base">{exp}</span>
                  </div>
                  {formData.experience === exp && <Check className="w-5 h-5 text-emerald-400" />}
                </button>
              ))}
            </div>

            {/* Premium Note */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-3 items-start text-emerald-200">
              <Award className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong>EvolvRa Ready:</strong> EvolvRa AI will formulate a customized diet split (targeting{' '}
                {formData.goal === 'Fat Loss' ? 'an aggressive deficit' : 'a controlled surplus'} with optimal daily
                protein inputs) and program a custom tracking dashboard.
              </div>
            </div>
          </div>
        )}

        {/* Buttons Nav */}
        <div className="flex items-center gap-3 mt-8 border-t border-white/5 pt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-4 rounded-2xl border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white text-sm font-semibold transition-all"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={step === 0 && !formData.name.trim()}
            className="flex-[2] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>{step === 3 ? 'Launch EvolvRa' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
