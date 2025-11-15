'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NutritionModal from '@/components/NutritionModal';
import FitnessModal from '@/components/FitnessModal';
import SchedulePreview from '@/components/SchedulePreview';
import { ClassBlock, NutritionPreferences, FitnessPreferences, MealOrWorkoutBlock } from '@/lib/types';
import { parseICSFile, readICSFile } from '@/utils/icsParser';
import { generateICSFile, downloadICSFile } from '@/utils/icsGenerator';
import { getDiningLocationsWithPreferences } from '@/lib/diningData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-3 tracking-tight">CMU Fuel Planner</h1>
          <p className="text-lg text-slate-600">Optimize your meals and workouts around your class schedule</p>
        </motion.header>

        {/* Main Content */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            {/* Step 1: Import Schedule */}
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Step 1: Import Academic Schedule</CardTitle>
                  <CardDescription>
                    Upload your .ics calendar file from SIO or your schedule tool
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    type="file"
                    accept=".ics"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors file:cursor-pointer cursor-pointer"
                  />
                  
                  {classBlocks.length > 0 && (
                    <motion.div 
                      className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm text-emerald-800 font-medium">
                        {classBlocks.length} class{classBlocks.length !== 1 ? 'es' : ''} loaded successfully
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 2: Nutrition Goals */}
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Step 2: Set Nutrition Goals</CardTitle>
                  <CardDescription>
                    Configure your meal preferences and dining options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {nutritionPreferences ? (
                    <motion.div 
                      className="space-y-3 mb-4 p-4 bg-slate-50 rounded-md border border-slate-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-sm text-slate-700">
                        <span className="font-semibold">Meals per day:</span> {nutritionPreferences.mealsPerDay}
                      </div>
                      {nutritionPreferences.favoriteDiningOptions.length > 0 && (
                        <div className="text-sm text-slate-700">
                          <span className="font-semibold">Favorites:</span>{' '}
                          {nutritionPreferences.favoriteDiningOptions.join(', ')}
                        </div>
                      )}
                      {nutritionPreferences.noGoDiningOptions.length > 0 && (
                        <div className="text-sm text-slate-700">
                          <span className="font-semibold">Avoid:</span>{' '}
                          {nutritionPreferences.noGoDiningOptions.join(', ')}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <p className="text-sm text-slate-500 mb-4">No preferences set yet</p>
                  )}
                  
                  <Button
                    variant="primary"
                    onClick={() => setIsNutritionModalOpen(true)}
                    className="w-full"
                  >
                    {nutritionPreferences ? 'Edit' : 'Set'} Nutrition Goals
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 3: Fitness Goals */}
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Step 3: Set Fitness Goals</CardTitle>
                  <CardDescription>
                    Configure your workout schedule and activity preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {fitnessPreferences ? (
                    <motion.div 
                      className="space-y-3 mb-4 p-4 bg-slate-50 rounded-md border border-slate-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-sm text-slate-700">
                        <span className="font-semibold">Workouts per week:</span> {fitnessPreferences.workoutsPerWeek}
                      </div>
                      {fitnessPreferences.activityTypes.length > 0 && (
                        <div className="text-sm text-slate-700">
                          <span className="font-semibold">Activities:</span>{' '}
                          {fitnessPreferences.activityTypes.join(', ')}
                        </div>
                      )}
                      {fitnessPreferences.workoutSplit && (
                        <div className="text-sm text-slate-700">
                          <span className="font-semibold">Split:</span> {fitnessPreferences.workoutSplit}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <p className="text-sm text-slate-500 mb-4">No preferences set yet</p>
                  )}
                  
                  <Button
                    variant="success"
                    onClick={() => setIsFitnessModalOpen(true)}
                    className="w-full"
                  >
                    {fitnessPreferences ? 'Edit' : 'Set'} Fitness Goals
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 4: Generate Plan */}
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Step 4: Generate Your Plan</CardTitle>
                  <CardDescription>
                    AI-powered schedule optimization with Claude
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleGeneratePlan}
                    disabled={isLoading || !nutritionPreferences || !fitnessPreferences || classBlocks.length === 0}
                    className="w-full"
                    variant="default"
                  >
                    {isLoading ? 'Generating with Claude AI...' : 'Generate Plan with Claude'}
                  </Button>

                  {mealWorkoutBlocks.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        onClick={handleExportICS}
                        variant="outline"
                        className="w-full"
                      >
                        Export as .ics File
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Right Panel - Schedule Preview */}
          <motion.div variants={itemVariants}>
            <SchedulePreview classBlocks={classBlocks} mealWorkoutBlocks={mealWorkoutBlocks} />
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          className="mt-16 text-center text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p>Built for CMU students • Powered by Claude AI</p>
        </motion.footer>
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

