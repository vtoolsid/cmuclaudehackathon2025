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

export default function NutritionModal({ isOpen, onClose, onSave, initialPreferences }: NutritionModalProps) {
  const [mealsPerDay, setMealsPerDay] = useState(initialPreferences?.mealsPerDay || 3);
  const [favoriteDining, setFavoriteDining] = useState<string[]>(initialPreferences?.favoriteDiningOptions || []);
  const [noGoDining, setNoGoDining] = useState<string[]>(initialPreferences?.noGoDiningOptions || []);

  const handleSave = () => {
    const preferences: NutritionPreferences = {
      mealsPerDay,
      preferredMealTimes: DEFAULT_MEAL_TIMES.slice(0, mealsPerDay),
      favoriteDiningOptions: favoriteDining,
      noGoDiningOptions: noGoDining,
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

