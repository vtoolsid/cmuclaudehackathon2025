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
    description: "Fresh sandwiches, wraps, fruits, vegetables, salads, snacks, ice cream, beverages, coffee; accepts credit/Market C cards only.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: Open 24 hours; Sunday: Open 24 hours; Monday: Open 24 hours; Tuesday: Open 24 hours; Wednesday: Open 24 hours; Thursday: Open 24 hours; Friday: Open 24 hours"),
  },
  {
    name: "Scotty's Market By Salem's",
    description: "CMU's first campus grocery with produce, snacks, international groceries, and a Mediterranean grill.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 8:00 AM - 11:59 PM; Sunday: 8:00 AM - 11:59 PM; Monday: 8:00 AM - 12:00 PM; Tuesday: 8:00 AM - 11:59 PM; Wednesday: 8:00 AM - 11:59 PM; Thursday: 8:00 AM - 11:59 PM; Friday: 8:00 AM - 1:00 PM, 2:00 PM - 11:59 PM"),
  },
  {
    name: "Stack'd Underground",
    description: "Burgers, Nashville chicken, grilled cheese, wraps, salads, vegetarian and halal options.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Friday: 11:00 AM - 11:59 PM"),
  },
  {
    name: "Stack'd Dessert Bar",
    description: "Milkshakes, sundaes, floats, banana splits, and more cold desserts.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Friday: 11:00 AM - 11:59 PM"),
  },
  {
    name: "The Grill At Scotty's",
    description: "Freshly grilled burgers, shawarma, gyros, wraps, salads.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Thursday: 8:00 AM - 11:45 PM; Friday: 8:00 AM - 1:00 PM, 2:00 PM - 11:45 PM"),
  },
  {
    name: "Salem's Hot Bar",
    description: "Rotating Mediterranean-inspired hot dishes.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Thursday: 10:30 AM - 10:00 PM; Friday: 10:30 AM - 1:00 PM, 2:00 PM - 10:00 PM"),
  },
  {
    name: "Au Bon Pain At Skibo Café",
    description: "Coffee, espresso, teas, sandwiches, soups, salads, pastries, grab-and-go.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Friday: 7:00 AM - 9:00 PM"),
  },
  {
    name: "El Gallo De Oro",
    description: "Mexican bowls, burritos, tacos, quesadillas, and salads.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: 12:00 PM - 8:00 PM; Monday–Thursday: 10:30 AM - 9:00 PM; Friday: 10:30 AM - 4:30 PM"),
  },
  {
    name: "Entropy+",
    description: "Campus convenience store with groceries, snacks, drinks, sushi, salads.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 12:00 PM - 8:00 PM; Sunday–Thursday: 7:00 AM - 10:00 PM; Friday: 7:00 AM - 8:00 PM"),
  },
  {
    name: "Revolution Noodle",
    description: "Malatang noodle bowls, bao buns, bubble tea, smoothies.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 12:00 PM - 8:00 PM; Sunday: CLOSED; Monday–Friday: 10:30 AM - 8:00 PM"),
  },
  {
    name: "Millie's Coffee 'n' Creamery",
    description: "Ice cream, vegan gelato, pastries, espresso, tea.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 12:00 PM - 6:00 PM; Sunday: 12:00 PM - 8:00 PM; Monday–Thursday: 8:00 AM - 10:00 PM; Friday: 8:00 AM - 6:00 PM"),
  },
  {
    name: "Rohr Café - La Prima",
    description: "Espresso, pastries, sandwiches, hot pressed meals.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: 9:00 AM - 4:00 PM; Monday–Friday: 7:30 AM - 6:00 PM"),
  },
  {
    name: "De Fer Coffee & Tea",
    description: "Specialty coffee and tea roasted by CMU alumni.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 8:30 AM - 3:00 PM; Sunday: CLOSED; Monday–Friday: 7:00 AM - 8:00 PM"),
  },
  {
    name: "Nourish",
    description: "Allergen-friendly kitchen free of major allergens; salads, sandwiches, hot entrées, vegan items.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Daily: 10:30 AM - 3:00 PM, 3:30 PM - 6:00 PM"),
  },
  {
    name: "Capital Grains",
    description: "Student-run grain bowls and vegetarian salads.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: 11:30 AM - 3:00 PM; Monday–Friday: CLOSED"),
  },
  {
    name: "The Exchange",
    description: "Deli sandwiches, soups, entrées, baked goods, fruit, snacks, coffee.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: 10:00 AM - 2:30 PM; Sunday: CLOSED; Monday–Thursday: 8:00 AM - 7:00 PM; Friday: 8:00 AM - 6:00 PM"),
  },
  {
    name: "Schatz Dining Room",
    description: "All-you-care-to-eat dining hall with rotating entrées, vegan, vegetarian, and gluten-free options.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: 10:30 AM - 2:30 PM, 4:30 PM - 8:30 PM; Monday–Friday: 7:00 AM - 9:00 PM"),
  },
  {
    name: "Taste Of India",
    description: "Indian curries, tandoori dishes, vegetarian and non-vegetarian meals.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: 4:30 PM - 9:00 PM; Monday–Friday: 11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM"),
  },
  {
    name: "Hunan Express",
    description: "Chinese entrees, noodle and rice bowls, dumplings, smoothies, boba tea.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: CLOSED; Sunday: 12:00 PM - 8:00 PM; Monday–Friday: 10:30 AM - 8:00 PM"),
  },
  {
    name: "The Edge Cafe & Market",
    description: "Kosher café with bagels, bourekas, pizza, wraps, salads.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: CLOSED; Sunday: 4:30 PM - 11:59 PM; Monday–Thursday: 11:00 AM - 11:59 PM; Friday: 11:00 AM - 2:00 PM"),
  },
  {
    name: "Sweet Plantain",
    description: "Cuban dishes such as Ropa Vieja, bowls, plantains, and sides.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: CLOSED; Sunday–Thursday: 4:30 PM - 9:00 PM; Friday: CLOSED"),
  },
  {
    name: "Fire And Stone",
    description: "Steaks, fish, sandwiches, wings.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: CLOSED; Sunday–Thursday: 4:30 PM - 9:00 PM; Friday: CLOSED"),
  },
  {
    name: "Tahini",
    description: "Kosher Mediterranean shawarma, falafel, couscous, salads.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday: CLOSED; Sunday: 5:00 PM - 9:00 PM; Monday–Thursday: 11:00 AM - 2:00 PM, 4:00 PM - 9:00 PM; Friday: 11:00 AM - 2:00 PM"),
  },
  {
    name: "Zebra Lounge",
    description: "Coffeehouse with pastries, pizza, sandwiches, sushi; kosher & halal friendly.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 8:00 AM - 4:00 PM"),
  },
  {
    name: "La Prima Espresso (Wean Hall)",
    description: "Espresso, pastries, wraps, breakfast items.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 8:00 AM - 6:00 PM"),
  },
  {
    name: "Redhawk Coffee",
    description: "Local specialty coffee, pastries, matcha, unique lattes.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 8:00 AM - 5:00 PM"),
  },
  {
    name: "Ola Ola",
    description: "Hawaiian-inspired bowls, spam musubi, desserts, tropical drinks.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 10:30 AM - 9:00 PM"),
  },
  {
    name: "Ciao Bella",
    description: "Globally inspired customizable pasta bowls.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 10:30 AM - 8:00 PM"),
  },
  {
    name: "Shake Smart",
    description: "Protein shakes, smoothies, acai bowls.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 10:30 AM - 8:00 PM"),
  },
  {
    name: "Crisp And Crust",
    description: "Custom salads and flatbreads.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 10:30 AM - 8:00 PM"),
  },
  {
    name: "Rohr Commons - Tepper Eatery",
    description: "Salad bar, soup, grab-and-go meals.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 11:00 AM - 8:00 PM"),
  },
  {
    name: "Wild Blue Sushi",
    description: "Fresh sushi, poke bowls, rice bowls, bubble tea.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 11:00 AM - 6:00 PM"),
  },
  {
    name: "Forbes Avenue Subs",
    description: "Custom deli-style subs and wraps.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday: 11:00 AM - 8:00 PM; Tuesday: 11:00 AM - 4:00 PM; Wednesday–Friday: 11:00 AM - 8:00 PM"),
  },
  {
    name: "Tepper Taqueria",
    description: "Street-style tacos, burritos, bowls, nachos.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday: 11:00 AM - 7:00 PM; Tuesday: 11:00 AM - 4:00 PM; Wednesday–Thursday: 11:00 AM - 7:00 PM; Friday: 11:00 AM - 4:00 PM"),
  },
  {
    name: "Tepper Taqueria Express",
    description: "Grab-and-go taco kits, empanadas, churros.",
    isOnCampus: true,
    noGo: false,
    openWindows: parseHoursString("Saturday–Sunday: CLOSED; Monday–Friday: 11:00 AM - 4:00 PM"),
  },
  {
    name: "E.a.t. (Evenings At Tepper)",
    description: "Grubhub-only burgers, sandwiches, salads, tenders, quesadillas.",
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
