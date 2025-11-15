'use client';

import { useState } from 'react';
import NutritionModal from '@/components/NutritionModal';
import FitnessModal from '@/components/FitnessModal';
import SchedulePreview from '@/components/SchedulePreview';
import { ClassBlock, NutritionPreferences, FitnessPreferences, MealOrWorkoutBlock } from '@/lib/types';
import { parseICSFile, readICSFile } from '@/utils/icsParser';
import { generateICSFile, downloadICSFile } from '@/utils/icsGenerator';
import { getDiningLocationsWithPreferences } from '@/lib/diningData';

export default function Home() {
  const [classBlocks, setClassBlocks] = useState<ClassBlock[]>([]);
  const [nutritionPreferences, setNutritionPreferences] = useState<NutritionPreferences | null>(null);
  const [fitnessPreferences, setFitnessPreferences] = useState<FitnessPreferences | null>(null);
  const [mealWorkoutBlocks, setMealWorkoutBlocks] = useState<MealOrWorkoutBlock[]>([]);
  
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isFitnessModalOpen, setIsFitnessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const content = await readICSFile(file);
      const blocks = parseICSFile(content);
      setClassBlocks(blocks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse ICS file');
      console.error(err);
    }
  };

  const handleGeneratePlan = async () => {
    if (!nutritionPreferences || !fitnessPreferences) {
      setError('Please set both nutrition and fitness preferences first');
      return;
    }

    if (classBlocks.length === 0) {
      setError('Please upload your class schedule first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const diningLocations = getDiningLocationsWithPreferences(
        nutritionPreferences.favoriteDiningOptions,
        nutritionPreferences.noGoDiningOptions
      );

      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classBlocks,
          nutritionPreferences,
          fitnessPreferences,
          diningLocations,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate plan');
      }

      const data = await response.json();
      setMealWorkoutBlocks(data.blocks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportICS = () => {
    if (mealWorkoutBlocks.length === 0) {
      setError('No meal/workout schedule to export');
      return;
    }

    const icsContent = generateICSFile(mealWorkoutBlocks);
    downloadICSFile(icsContent, 'cmu-fuel-plan.ics');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎓 CMU Fuel Planner</h1>
          <p className="text-gray-600">Optimize your meals and workouts around your class schedule</p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            {/* Step 1: Import Schedule */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 1: Import Academic Schedule
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Upload your .ics calendar file from SIO or your schedule tool
              </p>
              
              <input
                type="file"
                accept=".ics"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              {classBlocks.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    ✓ {classBlocks.length} class{classBlocks.length !== 1 ? 'es' : ''} loaded
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Nutrition Goals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 2: Set Nutrition Goals
              </h2>
              
              {nutritionPreferences ? (
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Meals per day:</span> {nutritionPreferences.mealsPerDay}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Favorites:</span>{' '}
                    {nutritionPreferences.favoriteDiningOptions.join(', ') || 'None'}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Avoid:</span>{' '}
                    {nutritionPreferences.noGoDiningOptions.join(', ') || 'None'}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No preferences set yet</p>
              )}
              
              <button
                onClick={() => setIsNutritionModalOpen(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {nutritionPreferences ? 'Edit' : 'Set'} Nutrition Goals
              </button>
            </div>

            {/* Step 3: Fitness Goals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 3: Set Fitness Goals
              </h2>
              
              {fitnessPreferences ? (
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Workouts per week:</span> {fitnessPreferences.workoutsPerWeek}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Activities:</span>{' '}
                    {fitnessPreferences.activityTypes.join(', ')}
                  </div>
                  {fitnessPreferences.workoutSplit && (
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Split:</span> {fitnessPreferences.workoutSplit}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No preferences set yet</p>
              )}
              
              <button
                onClick={() => setIsFitnessModalOpen(true)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                {fitnessPreferences ? 'Edit' : 'Set'} Fitness Goals
              </button>
            </div>

            {/* Step 4: Generate Plan */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 4: Generate Your Plan
              </h2>
              
              <button
                onClick={handleGeneratePlan}
                disabled={isLoading || !nutritionPreferences || !fitnessPreferences || classBlocks.length === 0}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating with Claude AI...' : '🤖 Generate Plan with Claude'}
              </button>

              {mealWorkoutBlocks.length > 0 && (
                <button
                  onClick={handleExportICS}
                  className="w-full mt-3 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                  📥 Export as .ics File
                </button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">⚠️ {error}</p>
              </div>
            )}
          </div>

          {/* Right Panel - Schedule Preview */}
          <div>
            <SchedulePreview classBlocks={classBlocks} mealWorkoutBlocks={mealWorkoutBlocks} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Built for CMU students • Powered by Claude AI</p>
        </footer>
      </div>

      {/* Modals */}
      <NutritionModal
        isOpen={isNutritionModalOpen}
        onClose={() => setIsNutritionModalOpen(false)}
        onSave={setNutritionPreferences}
        initialPreferences={nutritionPreferences || undefined}
      />
      
      <FitnessModal
        isOpen={isFitnessModalOpen}
        onClose={() => setIsFitnessModalOpen(false)}
        onSave={setFitnessPreferences}
        initialPreferences={fitnessPreferences || undefined}
      />
    </div>
  );
}

