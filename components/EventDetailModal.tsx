'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MealOrWorkoutBlock } from '@/lib/types';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: MealOrWorkoutBlock | null;
}

export default function EventDetailModal({ isOpen, onClose, event }: EventDetailModalProps) {
  if (!event) return null;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meal':
        return 'from-amber-500 to-orange-500';
      case 'workout':
        return 'from-emerald-500 to-green-500';
      default:
        return 'from-blue-500 to-indigo-500';
    }
  };

  const getEventIcon = (type: string) => {
    if (type === 'meal') {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${getEventColor(event.type)} p-6 text-white`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <p className="text-xs font-medium opacity-90 uppercase tracking-wide">
                        {event.type === 'meal' ? event.metadata?.mealType || 'Meal' : 'Workout'}
                      </p>
                      <h2 className="text-2xl font-bold mt-1">{event.title}</h2>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Time & Date Section */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Schedule</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">{formatDate(event.start)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              {event.location && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Location</h3>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{event.location}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Restaurant Description (for meals only) */}
              {event.type === 'meal' && event.metadata?.description && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h3 className="text-sm font-semibold text-amber-900 mb-3">What's Available</h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {event.metadata.description}
                  </p>
                </div>
              )}

              {/* Workout Type Info */}
              {event.type === 'workout' && (
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <h3 className="text-sm font-semibold text-emerald-900 mb-3">Workout Details</h3>
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    {event.metadata?.workoutType || 'Scheduled workout session'}
                  </p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                  Add to Calendar
                </button>
                <button className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

