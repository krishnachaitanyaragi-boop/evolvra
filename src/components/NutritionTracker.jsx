import React, { useState } from 'react';
import { 
  Sparkles, Search, Plus, Trash2, Heart, 
  Flame, Apple, AlertCircle, TrendingUp, Clock, Copy
} from 'lucide-react';

export default function NutritionTracker({ 
  userProfile, 
  nutritionLogs = [], 
  onLogFood, 
  onDeleteFood,
  onAddXP
}) {
  const [activeTab, setActiveTab] = useState('log'); // 'log' | 'search' | 'analytics'
  const [naturalInput, setNaturalInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customMealType, setCustomMealType] = useState('Breakfast');

  // Precompiled Local Food Database
  const foodDatabase = [
    // Indian Foods
    { name: 'Chicken Biryani', calories: 450, protein: 28, carbs: 55, fat: 12, serving: '1 plate (300g)' },
    { name: 'Paneer Curry', calories: 320, protein: 16, carbs: 12, fat: 24, serving: '1 bowl (200g)' },
    { name: 'Butter Naan', calories: 290, protein: 7, carbs: 45, fat: 9, serving: '1 piece (90g)' },
    { name: 'Roti / Chapati', calories: 85, protein: 3, carbs: 18, fat: 0.5, serving: '1 medium (30g)' },
    { name: 'Dal Tadka', calories: 150, protein: 8, carbs: 22, fat: 4, serving: '1 bowl (200g)' },
    { name: 'Masala Dosa', calories: 310, protein: 6, carbs: 52, fat: 8, serving: '1 piece' },
    { name: 'Idli', calories: 60, protein: 2, carbs: 12, fat: 0.2, serving: '1 piece (35g)' },
    { name: 'Egg Bhurji', calories: 220, protein: 14, carbs: 3, fat: 17, serving: '2 eggs portion' },
    
    // Gym & Healthy Foods
    { name: 'Whey Protein Scoop', calories: 120, protein: 24, carbs: 2, fat: 1.5, serving: '1 scoop (33g)' },
    { name: 'Chicken Breast (Grilled)', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
    { name: 'Whole Eggs (Boiled)', calories: 75, protein: 6, carbs: 0.6, fat: 5, serving: '1 egg (50g)' },
    { name: 'White Rice (Cooked)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: '100g' },
    { name: 'Oatmeal with Water', calories: 150, protein: 5, carbs: 27, fat: 2.5, serving: '40g dry' },
    { name: 'Peanut Butter', calories: 190, protein: 8, carbs: 6, fat: 16, serving: '1 tbsp (32g)' },
    { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, serving: '1 medium' },
    { name: 'Almonds', calories: 160, protein: 6, carbs: 6, fat: 14, serving: '1 ounce (28g)' },
    
    // Fast Foods
    { name: 'Pizza Slice (Cheese)', calories: 280, protein: 12, carbs: 32, fat: 10, serving: '1 slice' },
    { name: 'Burger (Chicken)', calories: 420, protein: 22, carbs: 40, fat: 18, serving: '1 burger' },
    { name: 'Coca Cola', calories: 140, protein: 0, carbs: 39, fat: 0, serving: '330ml can' },
    { name: 'French Fries', calories: 365, protein: 4, carbs: 48, fat: 17, serving: 'Medium portion' },
  ];

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('evolvra_favorite_meals');
    return saved ? JSON.parse(saved) : [
      { name: 'Post-Workout Shake', calories: 345, protein: 32, carbs: 30, fat: 5, mealType: 'Snack' },
      { name: 'Classic Chicken & Rice', calories: 425, protein: 37, carbs: 56, fat: 5, mealType: 'Lunch' }
    ];
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysFood = nutritionLogs.filter(f => f.date === todayStr);

  const totalCalories = todaysFood.reduce((s, f) => s + f.calories, 0);
  const totalProtein = todaysFood.reduce((s, f) => s + f.protein, 0);
  const totalCarbs = todaysFood.reduce((s, f) => s + f.carbs, 0);
  const totalFat = todaysFood.reduce((s, f) => s + f.fat, 0);

  // Deep Natural Language parsing heuristics
  const parseNaturalLanguageFood = (input) => {
    const text = input.toLowerCase();
    let guessedCalories = 0;
    let guessedProtein = 0;
    let guessedCarbs = 0;
    let guessedFat = 0;
    const itemsMatched = [];

    // Helper: extracts numeric multipliers (e.g. "2 eggs" -> 2, "200g chicken" -> 2)
    const getMultiplier = (phrase, name) => {
      const match = phrase.match(new RegExp(`(\\d+)\\s*(?:x|g|pcs|plate|scoop|bowl|egg|slice)?\\s*${name}`));
      if (match) {
        const val = parseFloat(match[1]);
        if (phrase.includes('g') && val > 10) return val / 100; // grams multiplier: 200g -> 2.0x
        return val;
      }
      // Alternate: "chicken 200g"
      const matchAlt = phrase.match(new RegExp(`${name}\\s*(\\d+)\\s*g`));
      if (matchAlt) return parseFloat(matchAlt[1]) / 100;

      // Single multiplier fallback
      const matchSingleNum = phrase.match(new RegExp(`(\\d+)\\s+`));
      if (matchSingleNum) return parseFloat(matchSingleNum[1]);

      return 1;
    };

    // Dictionary of keyword matches to database food item indices
    const dictionary = [
      { keys: ['egg', 'eggs'], index: 10 },
      { keys: ['chicken breast', 'chicken', 'breast'], index: 9 },
      { keys: ['rice'], index: 11 },
      { keys: ['whey', 'protein scoop', 'protein shake'], index: 8 },
      { keys: ['banana', 'bananas'], index: 14 },
      { keys: ['roti', 'chapati', 'chapatis'], index: 3 },
      { keys: ['biryani'], index: 0 },
      { keys: ['paneer'], index: 1 },
      { keys: ['naan'], index: 2 },
      { keys: ['dal', 'lentils'], index: 4 },
      { keys: ['dosa'], index: 5 },
      { keys: ['idli'], index: 6 },
      { keys: ['bhurji'], index: 7 },
      { keys: ['oats', 'oatmeal'], index: 12 },
      { keys: ['peanut butter'], index: 13 },
      { keys: ['almond', 'almonds'], index: 15 },
      { keys: ['pizza'], index: 16 },
      { keys: ['burger'], index: 17 },
      { keys: ['coke', 'soda'], index: 18 },
      { keys: ['fries', 'french fries'], index: 19 },
    ];

    dictionary.forEach(({ keys, index }) => {
      const foundKey = keys.find(k => text.includes(k));
      if (foundKey) {
        const food = foodDatabase[index];
        const mult = getMultiplier(text, foundKey);
        
        guessedCalories += Math.round(food.calories * mult);
        guessedProtein += Math.round(food.protein * mult);
        guessedCarbs += Math.round(food.carbs * mult);
        guessedFat += Math.round(food.fat * mult);
        
        itemsMatched.push(`${mult}x ${food.name}`);
      }
    });

    if (itemsMatched.length === 0) {
      // General parsing fallback for unknown text inputs
      return null;
    }

    return {
      name: itemsMatched.join(' + '),
      calories: guessedCalories,
      protein: guessedProtein,
      carbs: guessedCarbs,
      fat: guessedFat,
    };
  };

  const handleNaturalSubmit = (e) => {
    e.preventDefault();
    if (!naturalInput.trim()) return;

    const parsed = parseNaturalLanguageFood(naturalInput);
    if (parsed) {
      const newFood = {
        id: 'fd-' + Date.now(),
        date: todayStr,
        name: parsed.name,
        calories: parsed.calories,
        protein: parsed.protein,
        carbs: parsed.carbs,
        fat: parsed.fat,
        mealType: customMealType
      };
      onLogFood(newFood);
      onAddXP(30);
      alert(`AI Analyzed Meal: "${parsed.name}"\nCalories: ${parsed.calories} kcal | P: ${parsed.protein}g | C: ${parsed.carbs}g | F: ${parsed.fat}g.\nSaved to daily log! +30 XP!`);
      setNaturalInput('');
    } else {
      alert("EvolvRa AI could not securely identify ingredients. Try describing it with quantities, e.g., '2 eggs and paratha' or '200g chicken and white rice'.");
    }
  };

  // Search items
  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogDatabaseFood = (food) => {
    const newFood = {
      id: 'fd-' + Date.now(),
      date: todayStr,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      mealType: customMealType
    };
    onLogFood(newFood);
    onAddXP(20);
    alert(`${food.name} added! +20 XP!`);
  };

  const handleAddFavorite = (food) => {
    const isExist = favorites.find(f => f.name === food.name);
    if (!isExist) {
      const updated = [...favorites, { ...food, mealType: customMealType }];
      setFavorites(updated);
      localStorage.setItem('evolvra_favorite_meals', JSON.stringify(updated));
      alert(`${food.name} saved to favorites list.`);
    }
  };

  const handleRemoveFavorite = (name) => {
    const updated = favorites.filter(f => f.name !== name);
    setFavorites(updated);
    localStorage.setItem('evolvra_favorite_meals', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Tab Selectors */}
      <div className="flex bg-white/5 border border-white/5 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'log' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Apple className="w-4 h-4" />
          Meal Tracker
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'search' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          Search Database
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Macro Analytics
        </button>
      </div>

      {activeTab === 'log' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Parser Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Natural Parser Panel */}
            <div className="glass rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold font-display flex items-center gap-1.5 text-white">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  EvolvRa AI Food Analyzer
                </h3>
                <select
                  className="bg-white/5 border border-white/5 text-xs text-gray-300 rounded-xl px-2.5 py-1.5 outline-none"
                  value={customMealType}
                  onChange={(e) => setCustomMealType(e.target.value)}
                >
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(m => (
                    <option key={m} value={m} className="bg-slate-900">{m}</option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleNaturalSubmit} className="space-y-4">
                <div>
                  <textarea
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl py-3 px-4 text-sm text-white placeholder-gray-400 outline-none transition-all"
                    placeholder="Type naturally: e.g. '2 boiled eggs with 1 paratha and paneer curry' or '300g chicken and 1 scoop whey protein'..."
                    value={naturalInput}
                    onChange={(e) => setNaturalInput(e.target.value)}
                  />
                  <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-cyan-400" />
                    Our local AI matches ingredients & quantities, scaling protein & calories instantly.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-90 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  Analyze and Log Meal
                </button>
              </form>
            </div>

            {/* Daily Food Log Table */}
            <div className="glass rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold font-display text-white">Daily Meal Ledger</h3>
                <span className="text-xs text-gray-400">{todaysFood.length} items logged</span>
              </div>

              {todaysFood.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs flex flex-col items-center justify-center gap-2 border border-dashed border-white/10 rounded-2xl">
                  <Apple className="w-8 h-8 text-gray-600" />
                  <span>No foods logged today yet. Speak it to EvolvRa AI above!</span>
                </div>
              ) : (
                <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1 no-scrollbar">
                  {todaysFood.map((food) => (
                    <div key={food.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center hover:border-emerald-500/10 transition-all">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded-lg text-[9px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {food.mealType}
                          </span>
                          <span className="font-bold text-sm text-white">{food.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 flex gap-2">
                          <span>Calories: <strong className="text-white">{food.calories}</strong> kcal</span>
                          <span>P: <strong className="text-white">{food.protein}g</strong></span>
                          <span>C: <strong className="text-white">{food.carbs}g</strong></span>
                          <span>F: <strong className="text-white">{food.fat}g</strong></span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteFood(food.id)}
                        className="text-gray-500 hover:text-red-400 p-1 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Favorites List & Summary */}
          <div className="space-y-6">
            {/* Quick Summary card */}
            <div className="glass rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Ledger Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-gray-400">Calories</div>
                  <div className="text-lg font-black text-white mt-0.5">{totalCalories}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-gray-400">Protein</div>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">{totalProtein}g</div>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-gray-400">Carbs</div>
                  <div className="text-lg font-black text-cyan-400 mt-0.5">{totalCarbs}g</div>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-gray-400">Fat</div>
                  <div className="text-lg font-black text-amber-400 mt-0.5">{totalFat}g</div>
                </div>
              </div>
            </div>

            {/* Favorite Meals */}
            <div className="glass rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                Favorite Meals
              </h3>

              <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1 no-scrollbar">
                {favorites.map((fav, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex justify-between items-center hover:border-emerald-500/20 transition-all">
                    <div>
                      <div className="font-semibold text-xs text-white">{fav.name}</div>
                      <div className="text-[9px] text-gray-400 mt-0.5">
                        {fav.calories} kcal • P: {fav.protein}g | C: {fav.carbs}g | F: {fav.fat}g
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          const newFood = {
                            id: 'fd-' + Date.now(),
                            date: todayStr,
                            name: fav.name,
                            calories: fav.calories,
                            protein: fav.protein,
                            carbs: fav.carbs,
                            fat: fav.fat,
                            mealType: customMealType
                          };
                          onLogFood(newFood);
                          onAddXP(20);
                          alert(`Added favorite: ${fav.name}!`);
                        }}
                        className="p-1 bg-emerald-500/20 text-emerald-300 rounded hover:bg-emerald-500 hover:text-white transition-all"
                        title="Add to log"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(fav.name)}
                        className="text-gray-500 hover:text-red-400 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'search' && (
        <div className="glass rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search food database (Indian favorites, fast foods, gym fuel)..."
                className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl py-3 pl-10 pr-4 text-xs text-white outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="bg-white/5 border border-white/5 text-xs text-gray-300 rounded-2xl px-3 outline-none"
              value={customMealType}
              onChange={(e) => setCustomMealType(e.target.value)}
            >
              {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(m => (
                <option key={m} value={m} className="bg-slate-900">{m}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
            {filteredFoods.map((food, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center hover:border-emerald-500/20 transition-all">
                <div>
                  <div className="font-bold text-sm text-white">{food.name}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Serving: {food.serving}</div>
                  
                  <div className="grid grid-cols-4 gap-2 mt-2 text-[10px] text-gray-400">
                    <div>Kcal: <strong className="text-white">{food.calories}</strong></div>
                    <div>P: <strong className="text-white">{food.protein}g</strong></div>
                    <div>C: <strong className="text-white">{food.carbs}g</strong></div>
                    <div>F: <strong className="text-white">{food.fat}g</strong></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddFavorite(food)}
                    className="p-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 rounded-xl transition-all"
                    title="Add to favorites"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleLogDatabaseFood(food)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1 shadow-md transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Log
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Consistency card */}
          <div className="lg:col-span-2 glass rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Daily Macro Consistency Analytics</h3>
            <p className="text-xs text-gray-400">
              Maintaining steady daily ratios stimulates constant protein synthesis triggers and stabilizes metabolic TDEE.
            </p>

            <div className="space-y-4 border-t border-white/5 pt-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1.5">
                  <span>Daily Calorie Budget Adherence</span>
                  <span>{Math.min(100, Math.round((totalCalories / (userProfile?.calorieTarget || 2200)) * 100))}%</span>
                </div>
                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all" 
                    style={{ width: `${Math.min(100, (totalCalories / (userProfile?.calorieTarget || 2200)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1.5">
                  <span>Protein Target Adherence</span>
                  <span>{Math.min(100, Math.round((totalProtein / (userProfile?.macroTargets?.protein || 150)) * 100))}%</span>
                </div>
                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-cyan-400 h-full rounded-full transition-all" 
                    style={{ width: `${Math.min(100, (totalProtein / (userProfile?.macroTargets?.protein || 150)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Insights Card */}
          <div className="glass rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              Meal Timing Analytics
            </h3>

            <div className="space-y-3">
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-xs text-gray-300">
                <strong>Anabolic Muscle Window:</strong> Consume 25-40g protein within 2 hours post-workout to trigger the mTOR anabolic synthesis pathways.
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-xs text-gray-300">
                <strong>Bedtime Nutrition:</strong> Prioritize slow-digesting casein (or paneer/milk) before sleeping to prevent nighttime muscle catabolism.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
