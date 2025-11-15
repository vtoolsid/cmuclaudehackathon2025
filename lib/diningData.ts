// CMU Dining locations with sample hours
// In a real implementation, this would fetch from CMU Eats API

import { DiningLocation } from './types';

export const CMU_DINING_LOCATIONS: DiningLocation[] = [
  {
    name: "Resnik Cafe",
    isOnCampus: true,
    noGo: false,
    openWindows: [
      { day: "Monday", startHour: 7, endHour: 22 },
      { day: "Tuesday", startHour: 7, endHour: 22 },
      { day: "Wednesday", startHour: 7, endHour: 22 },
      { day: "Thursday", startHour: 7, endHour: 22 },
      { day: "Friday", startHour: 7, endHour: 22 },
      { day: "Saturday", startHour: 9, endHour: 21 },
      { day: "Sunday", startHour: 9, endHour: 21 },
    ],
  },
  {
    name: "Entropy+",
    isOnCampus: true,
    noGo: false,
    openWindows: [
      { day: "Monday", startHour: 10, endHour: 22 },
      { day: "Tuesday", startHour: 10, endHour: 22 },
      { day: "Wednesday", startHour: 10, endHour: 22 },
      { day: "Thursday", startHour: 10, endHour: 22 },
      { day: "Friday", startHour: 10, endHour: 20 },
    ],
  },
  {
    name: "Cohon University Center",
    isOnCampus: true,
    noGo: false,
    openWindows: [
      { day: "Monday", startHour: 7, endHour: 21 },
      { day: "Tuesday", startHour: 7, endHour: 21 },
      { day: "Wednesday", startHour: 7, endHour: 21 },
      { day: "Thursday", startHour: 7, endHour: 21 },
      { day: "Friday", startHour: 7, endHour: 20 },
      { day: "Saturday", startHour: 10, endHour: 20 },
      { day: "Sunday", startHour: 10, endHour: 20 },
    ],
  },
  {
    name: "The Exchange",
    isOnCampus: true,
    noGo: false,
    openWindows: [
      { day: "Monday", startHour: 7, endHour: 23 },
      { day: "Tuesday", startHour: 7, endHour: 23 },
      { day: "Wednesday", startHour: 7, endHour: 23 },
      { day: "Thursday", startHour: 7, endHour: 23 },
      { day: "Friday", startHour: 7, endHour: 21 },
      { day: "Saturday", startHour: 10, endHour: 21 },
      { day: "Sunday", startHour: 10, endHour: 23 },
    ],
  },
  {
    name: "Tepper Cafe",
    isOnCampus: true,
    noGo: false,
    openWindows: [
      { day: "Monday", startHour: 8, endHour: 16 },
      { day: "Tuesday", startHour: 8, endHour: 16 },
      { day: "Wednesday", startHour: 8, endHour: 16 },
      { day: "Thursday", startHour: 8, endHour: 16 },
      { day: "Friday", startHour: 8, endHour: 15 },
    ],
  },
  {
    name: "The Underground",
    isOnCampus: true,
    noGo: false,
    openWindows: [
      { day: "Monday", startHour: 11, endHour: 22 },
      { day: "Tuesday", startHour: 11, endHour: 22 },
      { day: "Wednesday", startHour: 11, endHour: 22 },
      { day: "Thursday", startHour: 11, endHour: 22 },
      { day: "Friday", startHour: 11, endHour: 19 },
    ],
  },
  {
    name: "Maggie Murph Cafe",
    isOnCampus: true,
    noGo: false,
    openWindows: [
      { day: "Monday", startHour: 7, endHour: 17 },
      { day: "Tuesday", startHour: 7, endHour: 17 },
      { day: "Wednesday", startHour: 7, endHour: 17 },
      { day: "Thursday", startHour: 7, endHour: 17 },
      { day: "Friday", startHour: 7, endHour: 17 },
    ],
  },
  {
    name: "Rothberg's Roasters II",
    isOnCampus: true,
    noGo: false,
    openWindows: [
      { day: "Monday", startHour: 8, endHour: 19 },
      { day: "Tuesday", startHour: 8, endHour: 19 },
      { day: "Wednesday", startHour: 8, endHour: 19 },
      { day: "Thursday", startHour: 8, endHour: 19 },
      { day: "Friday", startHour: 8, endHour: 16 },
    ],
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

