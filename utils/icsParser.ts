// ICS file parsing utilities
import ICAL from 'ical.js';
import { ClassBlock } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export function parseICSFile(icsContent: string): ClassBlock[] {
  try {
    const jcalData = ICAL.parse(icsContent);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    const classBlocks: ClassBlock[] = [];

    for (const vevent of vevents) {
      const event = new ICAL.Event(vevent);
      
      const startDate = event.startDate.toJSDate();
      const endDate = event.endDate.toJSDate();
      
      classBlocks.push({
        id: uuidv4(),
        title: event.summary || 'Untitled Event',
        location: event.location || undefined,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
    }

    return classBlocks;
  } catch (error) {
    console.error('Error parsing ICS file:', error);
    throw new Error('Failed to parse ICS file. Please ensure it is a valid calendar file.');
  }
}

export function readICSFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

