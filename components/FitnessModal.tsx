'use client';

import { useState } from 'react';
import { FitnessPreferences } from '@/lib/types';

interface FitnessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: FitnessPreferences) => void;
  initialPreferences?: FitnessPreferences;
}

export default function FitnessModal({ isOpen, onClose, onSave, initialPreferences }: FitnessModalProps) {
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(initialPreferences?.workoutsPerWeek || 3);
  const [activityTypes, setActivityTypes] = useState(initialPreferences?.activityTypes.join(', ') || '');
  const [workoutSplit, setWorkoutSplit] = useState(initialPreferences?.workoutSplit || '');
  const [targetMuscles, setTargetMuscles] = useState(initialPreferences?.targetMuscles?.join(', ') || '');

  if (!isOpen) return null;

  const handleSave = () => {
    const preferences: FitnessPreferences = {
      workoutsPerWeek,
      activityTypes: activityTypes.split(',').map(s => s.trim()).filter(Boolean),
      workoutSplit: workoutSplit || undefined,
      targetMuscles: targetMuscles.split(',').map(s => s.trim()).filter(Boolean),
      facilitiesOpenWindows: [
        // Default CMU gym hours
        { day: 'Monday', startHour: 6, endHour: 23 },
        { day: 'Tuesday', startHour: 6, endHour: 23 },
        { day: 'Wednesday', startHour: 6, endHour: 23 },
        { day: 'Thursday', startHour: 6, endHour: 23 },
        { day: 'Friday', startHour: 6, endHour: 23 },
        { day: 'Saturday', startHour: 8, endHour: 21 },
        { day: 'Sunday', startHour: 8, endHour: 21 },
      ],
    };
    onSave(preferences);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Fitness Goals</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workouts Per Week
            </label>
            <input
              type="number"
              min="0"
              max="7"
              value={workoutsPerWeek}
              onChange={(e) => setWorkoutsPerWeek(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Types
            </label>
            <p className="text-xs text-gray-500 mb-1">Comma-separated (e.g., lifting, cardio, yoga)</p>
            <textarea
              value={activityTypes}
              onChange={(e) => setActivityTypes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="lifting, cardio, intramurals"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workout Split (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-1">e.g., Push/Pull/Legs, Upper/Lower</p>
            <input
              type="text"
              value={workoutSplit}
              onChange={(e) => setWorkoutSplit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Push/Pull/Legs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Muscles (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-1">Comma-separated muscle groups</p>
            <textarea
              value={targetMuscles}
              onChange={(e) => setTargetMuscles(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="chest, back, legs, shoulders"
            />
          </div>

          <div className="bg-green-50 p-3 rounded-md text-sm text-gray-700">
            <p className="font-medium mb-1">CMU Gym Hours:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Mon-Fri: 6:00 AM - 11:00 PM</li>
              <li>Sat-Sun: 8:00 AM - 9:00 PM</li>
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
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

