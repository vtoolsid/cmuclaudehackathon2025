'use client';

import { motion } from 'framer-motion';
import { ClassBlock, MealOrWorkoutBlock } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { useMemo, useState } from 'react';
import EventDetailModal from '@/components/EventDetailModal';

interface WeeklyCalendarViewProps {
  classBlocks: ClassBlock[];
  mealWorkoutBlocks: MealOrWorkoutBlock[];
}

interface CalendarEvent {
  id: string;
  title: string;
  location?: string;
  type: 'class' | 'meal' | 'workout';
  dayIndex: number;
  startHour: number;
  endHour: number;
  startMinute: number;
  duration: number;
}

export default function WeeklyCalendarView({ classBlocks, mealWorkoutBlocks }: WeeklyCalendarViewProps) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [selectedEvent, setSelectedEvent] = useState<MealOrWorkoutBlock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (eventId: string) => {
    const event = mealWorkoutBlocks.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 300); // Clear after animation
  };

  const events = useMemo(() => {
    const allEvents: CalendarEvent[] = [];

    // Process class blocks
    classBlocks.forEach(block => {
      const startDate = new Date(block.start);
      const endDate = new Date(block.end);
      const dayIndex = startDate.getDay();
      const startHour = startDate.getHours();
      const endHour = endDate.getHours();
      const startMinute = startDate.getMinutes();
      const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

      allEvents.push({
        id: block.id,
        title: block.title,
        location: block.location,
        type: 'class',
        dayIndex,
        startHour,
        endHour,
        startMinute,
        duration
      });
    });

    // Process meal/workout blocks
    mealWorkoutBlocks.forEach(block => {
      const startDate = new Date(block.start);
      const endDate = new Date(block.end);
      const dayIndex = startDate.getDay();
      const startHour = startDate.getHours();
      const endHour = endDate.getHours();
      const startMinute = startDate.getMinutes();
      const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

      allEvents.push({
        id: block.id,
        title: block.title,
        location: block.location,
        type: block.type,
        dayIndex,
        startHour,
        endHour,
        startMinute,
        duration
      });
    });

    return allEvents;
  }, [classBlocks, mealWorkoutBlocks]);

  const getEventStyle = (event: CalendarEvent) => {
    const top = (event.startHour + event.startMinute / 60) * 80; // 80px per hour for more space
    const height = event.duration * 80;
    
    return {
      top: `${top}px`,
      height: `${Math.max(height, 60)}px`, // Minimum 60px height
    };
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600';
      case 'meal':
        return 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600';
      case 'workout':
        return 'bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600';
      default:
        return 'bg-slate-500 border-slate-600 text-white hover:bg-slate-600';
    }
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
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
    <>
    <Card className="overflow-hidden">
      <div className="bg-white">
        {/* Calendar Title */}
        <div className="border-b border-slate-200 p-4 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-xl font-semibold text-slate-900">Weekly Schedule</h2>
          <p className="text-sm text-slate-500 mt-1">View all your classes, meals, and workouts</p>
        </div>

        {/* Header with days */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b-2 border-slate-300 sticky top-0 bg-white z-20 shadow-sm">
          <div className="border-r border-slate-200 p-2 bg-slate-50"></div>
          {daysOfWeek.map((day, index) => {
            const isToday = index === new Date().getDay();
            return (
              <div
                key={day}
                className={`p-3 text-center border-r border-slate-200 last:border-r-0 transition-colors ${
                  isToday 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-medium uppercase tracking-wide">{day.slice(0, 3)}</div>
                {isToday && <div className="text-[10px] mt-0.5 opacity-90">Today</div>}
              </div>
            );
          })}
        </div>

        {/* Calendar grid */}
        <div className="relative overflow-auto" style={{ maxHeight: 'calc(100vh - 420px)', minHeight: '600px' }}>
          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            {/* Time column */}
            <div className="relative bg-slate-50 border-r border-slate-200 sticky left-0 z-10">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-[80px] border-b border-slate-200 pr-2 pt-1 text-right text-xs text-slate-600 font-semibold"
                >
                  {formatHour(hour)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {daysOfWeek.map((day, dayIndex) => {
              const dayEvents = events.filter(e => e.dayIndex === dayIndex);
              const isToday = dayIndex === new Date().getDay();
              
              return (
                <div 
                  key={day} 
                  className={`relative border-l border-slate-200 ${isToday ? 'bg-blue-50/30' : 'bg-white hover:bg-slate-50/50'} transition-colors`}
                >
                  {/* Hour grid lines */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={`h-[80px] border-b ${
                        hour % 3 === 0 ? 'border-slate-200' : 'border-slate-100'
                      }`}
                    />
                  ))}

                  {/* Events overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {dayEvents.map((event) => {
                      const style = getEventStyle(event);
                      const isShortEvent = event.duration < 0.75; // Less than 45 minutes
                      
                      // Only allow clicking on meal/workout blocks, not classes
                      const isClickable = dayEvents.find(e => e.id === event.id) && 
                                         mealWorkoutBlocks.some(mw => mw.id === event.id);
                      
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => isClickable && handleEventClick(event.id)}
                          className={`absolute left-1 right-1 rounded-lg border-l-4 shadow-md overflow-visible pointer-events-auto ${isClickable ? 'cursor-pointer' : 'cursor-default'} ${getEventColor(event.type)} group`}
                          style={style}
                        >
                          <div className="p-2.5 h-full overflow-hidden flex flex-col relative">
                            <div className={`font-bold leading-tight mb-1 ${isShortEvent ? 'text-[11px]' : 'text-sm'}`}>
                              {event.title}
                            </div>
                            {event.location && (
                              <div className={`opacity-90 line-clamp-1 ${isShortEvent ? 'text-[9px]' : 'text-xs'}`}>
                                {event.location}
                              </div>
                            )}
                            <div className={`opacity-90 mt-auto ${isShortEvent ? 'text-[9px]' : 'text-[10px]'}`}>
                              {formatHour(event.startHour)} - {formatHour(event.endHour)}
                            </div>
                          </div>
                          
                          {/* Tooltip on hover */}
                          <div className="absolute left-0 top-full mt-1 w-64 bg-slate-900 text-white text-xs rounded-lg shadow-xl p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                            <div className="font-bold mb-1">{event.title}</div>
                            {event.location && (
                              <div className="text-slate-300 mb-1">Location: {event.location}</div>
                            )}
                            <div className="text-slate-400">
                              {formatHour(event.startHour)} - {formatHour(event.endHour)}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend and Stats */}
        <div className="border-t-2 border-slate-300 p-4 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded shadow-sm"></div>
                <span className="text-slate-700 font-medium">Classes ({classBlocks.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded shadow-sm"></div>
                <span className="text-slate-700 font-medium">Meals ({mealWorkoutBlocks.filter(b => b.type === 'meal').length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded shadow-sm"></div>
                <span className="text-slate-700 font-medium">Workouts ({mealWorkoutBlocks.filter(b => b.type === 'workout').length})</span>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Total events: {classBlocks.length + mealWorkoutBlocks.length}
            </div>
          </div>
        </div>
      </div>
    </Card>

    <EventDetailModal 
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      event={selectedEvent}
    />
    </>
  );
}

