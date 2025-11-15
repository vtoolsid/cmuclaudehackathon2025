'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ClassBlock, MealOrWorkoutBlock } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SchedulePreviewProps {
  classBlocks: ClassBlock[];
  mealWorkoutBlocks: MealOrWorkoutBlock[];
}

interface DaySchedule {
  day: string;
  blocks: Array<{
    time: string;
    title: string;
    location?: string;
    type: 'class' | 'meal' | 'workout';
  }>;
}

export default function SchedulePreview({ classBlocks, mealWorkoutBlocks }: SchedulePreviewProps) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Combine and organize blocks by day
  const scheduleByDay: DaySchedule[] = daysOfWeek.map(day => ({
    day,
    blocks: [],
  }));

  // Add class blocks
  classBlocks.forEach(block => {
    const date = new Date(block.start);
    const dayIndex = date.getDay();
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    scheduleByDay[dayIndex].blocks.push({
      time,
      title: block.title,
      location: block.location,
      type: 'class',
    });
  });

  // Add meal/workout blocks
  mealWorkoutBlocks.forEach(block => {
    const date = new Date(block.start);
    const dayIndex = date.getDay();
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    scheduleByDay[dayIndex].blocks.push({
      time,
      title: block.title,
      location: block.location,
      type: block.type,
    });
  });

  // Sort blocks by time within each day
  scheduleByDay.forEach(day => {
    day.blocks.sort((a, b) => {
      const timeA = new Date('1970-01-01 ' + a.time);
      const timeB = new Date('1970-01-01 ' + b.time);
      return timeA.getTime() - timeB.getTime();
    });
  });

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100';
      case 'meal':
        return 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100';
      case 'workout':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100';
    }
  };

  const getBlockAccent = (type: string) => {
    switch (type) {
      case 'class':
        return 'border-l-4 border-l-blue-500';
      case 'meal':
        return 'border-l-4 border-l-amber-500';
      case 'workout':
        return 'border-l-4 border-l-emerald-500';
      default:
        return 'border-l-4 border-l-slate-500';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const dayVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const blockVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  if (classBlocks.length === 0 && mealWorkoutBlocks.length === 0) {
    return (
      <Card className="text-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-slate-700 mb-2">No schedule to display yet</p>
          <p className="text-sm text-slate-500">Upload your class schedule and set your preferences to get started</p>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Weekly Schedule Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {scheduleByDay.map((daySchedule) => (
            <motion.div key={daySchedule.day} variants={dayVariants}>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 pb-2 border-b-2 border-slate-200">
                {daySchedule.day}
              </h3>
              {daySchedule.blocks.length === 0 ? (
                <p className="text-sm text-slate-400 italic ml-4">No scheduled events</p>
              ) : (
                <AnimatePresence>
                  <div className="space-y-2.5">
                    {daySchedule.blocks.map((block, index) => (
                      <motion.div
                        key={`${daySchedule.day}-${index}`}
                        variants={blockVariants}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        className={`border rounded-lg p-4 ml-4 transition-all duration-200 cursor-default ${getBlockColor(block.type)} ${getBlockAccent(block.type)}`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base truncate">{block.title}</h4>
                            {block.location && (
                              <p className="text-sm opacity-75 mt-1.5 truncate">{block.location}</p>
                            )}
                          </div>
                          <span className="text-sm font-medium whitespace-nowrap">{block.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-6 pt-6 border-t border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-slate-600 font-medium">Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span className="text-slate-600 font-medium">Meals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span className="text-slate-600 font-medium">Workouts</span>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

