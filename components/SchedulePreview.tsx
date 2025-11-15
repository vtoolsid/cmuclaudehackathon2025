'use client';

import { ClassBlock, MealOrWorkoutBlock } from '@/lib/types';

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
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'meal':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'workout':
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'class':
        return '📚';
      case 'meal':
        return '🍽️';
      case 'workout':
        return '💪';
      default:
        return '📅';
    }
  };

  if (classBlocks.length === 0 && mealWorkoutBlocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        <p className="text-lg">No schedule to display yet.</p>
        <p className="text-sm mt-2">Upload your class schedule and set your preferences to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Weekly Schedule Preview</h2>
      
      <div className="space-y-6">
        {scheduleByDay.map((daySchedule) => (
          <div key={daySchedule.day}>
            <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">
              {daySchedule.day}
            </h3>
            {daySchedule.blocks.length === 0 ? (
              <p className="text-sm text-gray-400 italic ml-4">No scheduled events</p>
            ) : (
              <div className="space-y-2">
                {daySchedule.blocks.map((block, index) => (
                  <div
                    key={index}
                    className={`border rounded-md p-3 ml-4 ${getBlockColor(block.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl">{getBlockIcon(block.type)}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{block.title}</span>
                          <span className="text-sm">{block.time}</span>
                        </div>
                        {block.location && (
                          <p className="text-sm opacity-75 mt-1">📍 {block.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-gray-600">Classes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
            <span className="text-gray-600">Meals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-600">Workouts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

