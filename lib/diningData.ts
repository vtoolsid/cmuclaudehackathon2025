// CMU Dining locations parsed from official CMU Eats data

import { DiningLocation } from './types';

// Helper function to parse time string like "8:00 AM" to hour (24-hour format)
function parseTime(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  
  let hour = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  // Convert to 24-hour format
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  // Round up if minutes >= 30
  return minutes >= 30 ? hour + 1 : hour;
}

// Helper function to parse hours string and create open windows
function parseHoursString(hoursStr: string): { day: string; startHour: number; endHour: number }[] {
  const windows: { day: string; startHour: number; endHour: number }[] = [];
  
  // Split by semicolon to get individual day entries
  const dayEntries = hoursStr.split(';').map(s => s.trim());
  
  for (const entry of dayEntries) {
    if (!entry || entry.includes('CLOSED')) continue;
    
    // Parse day range or single day
    const colonIndex = entry.indexOf(':');
    if (colonIndex === -1) continue;
    
    const dayPart = entry.substring(0, colonIndex).trim();
    const timePart = entry.substring(colonIndex + 1).trim();
    
    // Handle "Open 24 hours"
    if (timePart.includes('Open 24 hours')) {
      const days = parseDayRange(dayPart);
      days.forEach(day => {
        windows.push({ day, startHour: 0, endHour: 24 });
      });
      continue;
    }
    
    // Parse time ranges (may have multiple separated by commas)
    const timeRanges = timePart.split(',').map(s => s.trim());
    const days = parseDayRange(dayPart);
    
    for (const timeRange of timeRanges) {
      const timeMatch = timeRange.match(/(\d+:\d+\s*(?:AM|PM))\s*-\s*(\d+:\d+\s*(?:AM|PM))/i);
      if (timeMatch) {
        const startHour = parseTime(timeMatch[1]);
        let endHour = parseTime(timeMatch[2]);
        
        // Handle times like "11:59 PM" as end of day (24)
        if (endHour === 0 || (timeMatch[2].includes('11:59') && timeMatch[2].includes('PM'))) {
          endHour = 24;
        }
        
        days.forEach(day => {
          windows.push({ day, startHour, endHour });
        });
      }
    }
  }
  
  return windows;
}

// Helper function to parse day ranges like "Monday–Friday" or "Saturday–Sunday"
function parseDayRange(dayStr: string): string[] {
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Handle "Daily"
  if (dayStr.toLowerCase().includes('daily')) {
    return [...allDays];
  }
  
  // Handle range with em-dash or hyphen
  const rangeMatch = dayStr.match(/(\w+)\s*[–-]\s*(\w+)/);
  if (rangeMatch) {
    const startDay = rangeMatch[1];
    const endDay = rangeMatch[2];
    
    const startIdx = allDays.findIndex(d => d.toLowerCase().startsWith(startDay.toLowerCase()));
    const endIdx = allDays.findIndex(d => d.toLowerCase().startsWith(endDay.toLowerCase()));
    
    if (startIdx !== -1 && endIdx !== -1) {
      if (startIdx <= endIdx) {
        return allDays.slice(startIdx, endIdx + 1);
      } else {
        // Wrap around (e.g., Saturday-Friday)
        return [...allDays.slice(startIdx), ...allDays.slice(0, endIdx + 1)];
      }
    }
  }
  
  // Single day
  const singleDay = allDays.find(d => d.toLowerCase().startsWith(dayStr.toLowerCase()));
  return singleDay ? [singleDay] : [];
}

export const CMU_DINING_LOCATIONS: DiningLocation[] = [
  {
    name: "Stephanie's - Market C",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: Open 24 hours; Sunday: Open 24 hours; Monday: Open 24 hours; Tuesday: Open 24 hours; Wednesday: Open 24 hours; Thursday: Open 24 hours; Friday: Open 24 hours"),
  },
  {
    name: "Scotty's Market By Salem's",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 8:00 AM - 11:59 PM; Sunday: 8:00 AM - 11:59 PM; Monday: 8:00 AM - 12:00 PM; Tuesday: 8:00 AM - 11:59 PM; Wednesday: 8:00 AM - 11:59 PM; Thursday: 8:00 AM - 11:59 PM; Friday: 8:00 AM - 1:00 PM, 2:00 PM - 11:59 PM"),
  },
  {
    name: "Stack'd Underground",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Friday: 11:00 AM - 11:59 PM"),
  },
  {
    name: "Stack'd Dessert Bar",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Friday: 11:00 AM - 11:59 PM"),
  },
  {
    name: "The Grill At Scotty's",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Thursday: 8:00 AM - 11:45 PM; Friday: 8:00 AM - 1:00 PM, 2:00 PM - 11:45 PM"),
  },
  {
    name: "Salem's Hot Bar",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Thursday: 10:30 AM - 10:00 PM; Friday: 10:30 AM - 1:00 PM, 2:00 PM - 10:00 PM"),
  },
  {
    name: "Au Bon Pain At Skibo Café",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Friday: 7:00 AM - 9:00 PM"),
  },
  {
    name: "El Gallo De Oro",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: 12:00 PM - 8:00 PM; Monday–Thursday: 10:30 AM - 9:00 PM; Friday: 10:30 AM - 4:30 PM"),
  },
  {
    name: "Entropy+",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 12:00 PM - 8:00 PM; Sunday–Thursday: 7:00 AM - 10:00 PM; Friday: 7:00 AM - 8:00 PM"),
  },
  {
    name: "Revolution Noodle",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 12:00 PM - 8:00 PM; Sunday: CLOSED; Monday–Friday: 10:30 AM - 8:00 PM"),
  },
  {
    name: "Millie's Coffee 'n' Creamery",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 12:00 PM - 6:00 PM; Sunday: 12:00 PM - 8:00 PM; Monday–Thursday: 8:00 AM - 10:00 PM; Friday: 8:00 AM - 6:00 PM"),
  },
  {
    name: "Rohr Café - La Prima",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: 9:00 AM - 4:00 PM; Monday–Friday: 7:30 AM - 6:00 PM"),
  },
  {
    name: "De Fer Coffee & Tea",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 8:30 AM - 3:00 PM; Sunday: CLOSED; Monday–Friday: 7:00 AM - 8:00 PM"),
  },
  {
    name: "Nourish",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Daily: 10:30 AM - 3:00 PM, 3:30 PM - 6:00 PM"),
  },
  {
    name: "Capital Grains",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: 11:30 AM - 3:00 PM; Monday–Friday: CLOSED"),
  },
  {
    name: "The Exchange",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 10:00 AM - 2:30 PM; Sunday: CLOSED; Monday–Thursday: 8:00 AM - 7:00 PM; Friday: 8:00 AM - 6:00 PM"),
  },
  {
    name: "Schatz Dining Room",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: 10:30 AM - 2:30 PM, 4:30 PM - 8:30 PM; Monday–Friday: 7:00 AM - 9:00 PM"),
  },
  {
    name: "Taste Of India",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: 4:30 PM - 9:00 PM; Monday–Friday: 11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM"),
  },
  {
    name: "Hunan Express",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: CLOSED; Sunday: 12:00 PM - 8:00 PM; Monday–Friday: 10:30 AM - 8:00 PM"),
  },
  {
    name: "The Edge Cafe & Market",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: CLOSED; Sunday: 4:30 PM - 11:59 PM; Monday–Thursday: 11:00 AM - 11:59 PM; Friday: 11:00 AM - 2:00 PM"),
  },
  {
    name: "Sweet Plantain",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: CLOSED; Sunday–Thursday: 4:30 PM - 9:00 PM; Friday: CLOSED"),
  },
  {
    name: "Fire And Stone",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: CLOSED; Sunday–Thursday: 4:30 PM - 9:00 PM; Friday: CLOSED"),
  },
  {
    name: "Tahini",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: CLOSED; Sunday: 5:00 PM - 9:00 PM; Monday–Thursday: 11:00 AM - 2:00 PM, 4:00 PM - 9:00 PM; Friday: 11:00 AM - 2:00 PM"),
  },
  {
    name: "Zebra Lounge",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 8:00 AM - 4:00 PM"),
  },
  {
    name: "La Prima Espresso (Wean Hall)",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 8:00 AM - 6:00 PM"),
  },
  {
    name: "Redhawk Coffee",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 8:00 AM - 5:00 PM"),
  },
  {
    name: "Ola Ola",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 10:30 AM - 9:00 PM"),
  },
  {
    name: "Ciao Bella",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 10:30 AM - 8:00 PM"),
  },
  {
    name: "Shake Smart",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 10:30 AM - 8:00 PM"),
  },
  {
    name: "Crisp And Crust",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 10:30 AM - 8:00 PM"),
  },
  {
    name: "Rohr Commons - Tepper Eatery",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 11:00 AM - 8:00 PM"),
  },
  {
    name: "Wild Blue Sushi",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 11:00 AM - 6:00 PM"),
  },
  {
    name: "Forbes Avenue Subs",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday: 11:00 AM - 8:00 PM; Tuesday: 11:00 AM - 4:00 PM; Wednesday–Friday: 11:00 AM - 8:00 PM"),
  },
  {
    name: "Tepper Taqueria",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday: 11:00 AM - 7:00 PM; Tuesday: 11:00 AM - 4:00 PM; Wednesday–Thursday: 11:00 AM - 7:00 PM; Friday: 11:00 AM - 4:00 PM"),
  },
  {
    name: "Tepper Taqueria Express",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 11:00 AM - 4:00 PM"),
  },
  {
    name: "E.a.t. (Evenings At Tepper)",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday: 4:30 PM - 7:30 PM; Wednesday–Friday: 4:30 PM - 7:30 PM; Tuesday: CLOSED"),
  },
];

export function getDiningLocationsWithPreferences(
  favoriteDiningOptions: string[],
  noGoDiningOptions: string[]
): DiningLocation[] {
  return CMU_DINING_LOCATIONS.map(location => ({
    ...location,
    noGo: noGoDiningOptions.some(noGo => 
      location.name.toLowerCase().includes(noGo.toLowerCase())
    ),
  }));
}
