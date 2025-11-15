// ICS file generation utilities
import { MealOrWorkoutBlock } from '@/lib/types';

function formatICSDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export function generateICSFile(blocks: MealOrWorkoutBlock[]): string {
  const icsLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CMU Fuel Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const block of blocks) {
    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:${block.id}`);
    icsLines.push(`DTSTAMP:${formatICSDate(new Date().toISOString())}`);
    icsLines.push(`DTSTART:${formatICSDate(block.start)}`);
    icsLines.push(`DTEND:${formatICSDate(block.end)}`);
    icsLines.push(`SUMMARY:${block.title}`);
    
    if (block.location) {
      icsLines.push(`LOCATION:${block.location}`);
    }
    
    if (block.type === 'meal') {
      icsLines.push('CATEGORIES:MEAL');
    } else if (block.type === 'workout') {
      icsLines.push('CATEGORIES:WORKOUT');
    }
    
    icsLines.push('END:VEVENT');
  }

  icsLines.push('END:VCALENDAR');
  
  return icsLines.join('\r\n');
}

export function downloadICSFile(icsContent: string, filename: string = 'cmu-fuel-plan.ics'): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

