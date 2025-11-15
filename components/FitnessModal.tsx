'use client';

import { useState } from 'react';
import { FitnessPreferences } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';

interface FitnessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: FitnessPreferences) => void;
  initialPreferences?: FitnessPreferences;
}

const ACTIVITY_OPTIONS = [
  'Weightlifting',
  'Cardio',
  'Running',
  'Swimming',
  'Yoga',
  'Pilates',
  'Cycling',
  'Basketball',
  'Soccer',
  'Intramurals',
  'Rock Climbing',
  'Dance',
];

const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Glutes',
  'Calves',
];

export default function FitnessModal({ isOpen, onClose, onSave, initialPreferences }: FitnessModalProps) {
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(initialPreferences?.workoutsPerWeek || 3);
  const [activityTypes, setActivityTypes] = useState<string[]>(initialPreferences?.activityTypes || []);
  const [workoutSplit, setWorkoutSplit] = useState(initialPreferences?.workoutSplit || '');
  const [targetMuscles, setTargetMuscles] = useState<string[]>(initialPreferences?.targetMuscles || []);

  const handleSave = () => {
    const preferences: FitnessPreferences = {
      workoutsPerWeek,
      activityTypes,
      workoutSplit: workoutSplit || undefined,
      targetMuscles,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Fitness Goals</DialogTitle>
          <DialogDescription>
            Configure your workout preferences and activity types
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="workouts-per-week">Workouts Per Week</Label>
            <Input
              id="workouts-per-week"
              type="number"
              min="0"
              max="7"
              value={workoutsPerWeek}
              onChange={(e) => setWorkoutsPerWeek(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>Activity Types</Label>
            <p className="text-xs text-slate-500">Select your preferred workout activities</p>
            <MultiSelect
              options={ACTIVITY_OPTIONS}
              value={activityTypes}
              onChange={setActivityTypes}
              placeholder="Select activity types..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workout-split">Workout Split (Optional)</Label>
            <p className="text-xs text-slate-500">e.g., Push/Pull/Legs, Upper/Lower</p>
            <Input
              id="workout-split"
              type="text"
              value={workoutSplit}
              onChange={(e) => setWorkoutSplit(e.target.value)}
              placeholder="Push/Pull/Legs"
            />
          </div>

          <div className="space-y-2">
            <Label>Target Muscle Groups (Optional)</Label>
            <p className="text-xs text-slate-500">Select muscle groups to focus on</p>
            <MultiSelect
              options={MUSCLE_GROUPS}
              value={targetMuscles}
              onChange={setTargetMuscles}
              placeholder="Select muscle groups..."
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-md text-sm border border-slate-200">
            <p className="font-medium text-slate-900 mb-2">CMU Gym Hours</p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="text-slate-500">6:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday - Sunday</span>
                <span className="text-slate-500">8:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="success" onClick={handleSave} className="flex-1">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

