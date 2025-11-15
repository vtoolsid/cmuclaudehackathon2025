'use client';

import { useState } from 'react';
import { NutritionPreferences } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import { CMU_DINING_LOCATIONS } from '@/lib/diningData';

interface NutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: NutritionPreferences) => void;
  initialPreferences?: NutritionPreferences;
}

const DEFAULT_MEAL_TIMES = [
  { label: 'Breakfast', startHour: 8, endHour: 10 },   // 8:00 AM - 10:00 AM
  { label: 'Lunch', startHour: 12, endHour: 14 },      // 12:00 PM - 2:00 PM
  { label: 'Dinner', startHour: 18, endHour: 20 },     // 6:00 PM - 8:00 PM
];

const DINING_OPTIONS = CMU_DINING_LOCATIONS.map(loc => loc.name);

const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Halal',
  'Kosher',
  'Pescatarian',
];

const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree Nuts',
  'Dairy',
  'Gluten',
  'Soy',
  'Eggs',
  'Fish',
  'Shellfish',
  'Sesame',
];

const NUTRITION_GOALS = [
  'High Protein',
  'Low Carb',
  'Balanced Diet',
  'Weight Loss',
  'Muscle Gain',
  'Heart Healthy',
];

export default function NutritionModal({ isOpen, onClose, onSave, initialPreferences }: NutritionModalProps) {
  const [mealsPerDay, setMealsPerDay] = useState(initialPreferences?.mealsPerDay || 3);
  const [favoriteDining, setFavoriteDining] = useState<string[]>(initialPreferences?.favoriteDiningOptions || []);
  const [noGoDining, setNoGoDining] = useState<string[]>(initialPreferences?.noGoDiningOptions || []);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(initialPreferences?.dietaryRestrictions || []);
  const [allergies, setAllergies] = useState<string[]>(initialPreferences?.allergies || []);
  const [nutritionGoals, setNutritionGoals] = useState<string[]>(initialPreferences?.nutritionGoals || []);

  const handleSave = () => {
    const preferences: NutritionPreferences = {
      mealsPerDay,
      preferredMealTimes: DEFAULT_MEAL_TIMES.slice(0, mealsPerDay),
      favoriteDiningOptions: favoriteDining,
      noGoDiningOptions: noGoDining,
      dietaryRestrictions,
      allergies,
      nutritionGoals,
    };
    onSave(preferences);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nutrition Goals</DialogTitle>
          <DialogDescription>
            Configure your meal preferences and favorite dining locations
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="meals-per-day">Meals Per Day</Label>
            <Input
              id="meals-per-day"
              type="number"
              min="1"
              max="5"
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label>Favorite Dining Locations</Label>
            <p className="text-xs text-slate-500">Select your preferred dining spots</p>
            <MultiSelect
              options={DINING_OPTIONS}
              value={favoriteDining}
              onChange={setFavoriteDining}
              placeholder="Select favorite locations..."
            />
          </div>

          <div className="space-y-2">
            <Label>Locations to Avoid</Label>
            <p className="text-xs text-slate-500">Select places you want to skip</p>
            <MultiSelect
              options={DINING_OPTIONS}
              value={noGoDining}
              onChange={setNoGoDining}
              placeholder="Select locations to avoid..."
            />
          </div>

          <div className="border-t border-slate-200 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Dietary Preferences</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Dietary Restrictions</Label>
                <p className="text-xs text-slate-500">Select any dietary restrictions</p>
                <MultiSelect
                  options={DIETARY_RESTRICTIONS}
                  value={dietaryRestrictions}
                  onChange={setDietaryRestrictions}
                  placeholder="None selected..."
                />
              </div>

              <div className="space-y-2">
                <Label>Allergies</Label>
                <p className="text-xs text-slate-500">Select any food allergies</p>
                <MultiSelect
                  options={COMMON_ALLERGIES}
                  value={allergies}
                  onChange={setAllergies}
                  placeholder="None selected..."
                />
              </div>

              <div className="space-y-2">
                <Label>Nutrition Goals</Label>
                <p className="text-xs text-slate-500">Select your dietary goals</p>
                <MultiSelect
                  options={NUTRITION_GOALS}
                  value={nutritionGoals}
                  onChange={setNutritionGoals}
                  placeholder="None selected..."
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-md text-sm border border-slate-200">
            <p className="font-medium text-slate-900 mb-2">Default Meal Times</p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex justify-between">
                <span>Breakfast</span>
                <span className="text-slate-500">8:00 AM - 10:00 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Lunch</span>
                <span className="text-slate-500">12:00 PM - 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Dinner</span>
                <span className="text-slate-500">6:00 PM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

