'use client';

import { useState } from 'react';
import { NutritionPreferences } from '@/lib/types';

interface NutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: NutritionPreferences) => void;
  initialPreferences?: NutritionPreferences;
}

const DEFAULT_MEAL_TIMES = [
  { label: 'Breakfast', startHour: 8, endHour: 10 },
  { label: 'Lunch', startHour: 12, endHour: 14 },
  { label: 'Dinner', startHour: 18, endHour: 20 },
];

export default function NutritionModal({ isOpen, onClose, onSave, initialPreferences }: NutritionModalProps) {
  const [mealsPerDay, setMealsPerDay] = useState(initialPreferences?.mealsPerDay || 3);
  const [favoriteDining, setFavoriteDining] = useState(initialPreferences?.favoriteDiningOptions.join(', ') || '');
  const [noGoDining, setNoGoDining] = useState(initialPreferences?.noGoDiningOptions.join(', ') || '');

  if (!isOpen) return null;

  const handleSave = () => {
    const preferences: NutritionPreferences = {
      mealsPerDay,
      preferredMealTimes: DEFAULT_MEAL_TIMES.slice(0, mealsPerDay),
      favoriteDiningOptions: favoriteDining.split(',').map(s => s.trim()).filter(Boolean),
      noGoDiningOptions: noGoDining.split(',').map(s => s.trim()).filter(Boolean),
    };
    onSave(preferences);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Nutrition Goals</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meals Per Day
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Favorite Dining Options
            </label>
            <p className="text-xs text-gray-500 mb-1">Comma-separated (e.g., Resnik, Entropy, Cohon)</p>
            <textarea
              value={favoriteDining}
              onChange={(e) => setFavoriteDining(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Resnik, Entropy+"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No-Go Dining Options
            </label>
            <p className="text-xs text-gray-500 mb-1">Places you want to avoid</p>
            <textarea
              value={noGoDining}
              onChange={(e) => setNoGoDining(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Location names to avoid"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-md text-sm text-gray-700">
            <p className="font-medium mb-1">Default Meal Times:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Breakfast: 8:00 AM - 10:00 AM</li>
              <li>Lunch: 12:00 PM - 2:00 PM</li>
              <li>Dinner: 6:00 PM - 8:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

