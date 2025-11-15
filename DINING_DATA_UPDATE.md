# CMU Dining Data Update Summary

## Overview
Updated the application to use all 36 official CMU dining locations from the CMU Eats data instead of the previous 8 hardcoded locations.

## Changes Made

### 1. Core Data (`lib/diningData.ts`)
**Replaced the entire file with:**
- Comprehensive parser functions to handle various hour formats from CMU Eats
- All 36 CMU dining locations with accurate weekly hours
- Support for complex schedule patterns:
  - 24-hour locations (Stephanie's - Market C)
  - Day ranges (Monday–Friday, Saturday–Sunday)
  - Multiple time windows per day (e.g., Nourish: 10:30 AM - 3:00 PM, 3:30 PM - 6:00 PM)
  - Closed days (CLOSED)
  - Special hours (Shabbat closures, weekend variations)
  - Split hours (e.g., Friday: 8:00 AM - 1:00 PM, 2:00 PM - 11:59 PM)

**Parsing Functions:**
- `parseTime()` - Converts "8:00 AM" to 24-hour format (8)
- `parseDayRange()` - Handles "Monday–Friday", "Saturday–Sunday", "Daily", etc.
- `parseHoursString()` - Main parser for complete hour strings from CSV

### 2. UI Components
**`components/NutritionModal.tsx`:**
- Updated placeholder examples from "Resnik, Entropy+" to "Entropy+, The Exchange"
- Updated help text from "Resnik, Entropy, Cohon" to "Entropy+, Au Bon Pain, The Exchange"

### 3. API Route
**`app/api/generate-plan/route.ts`:**
- Updated example output in system prompt from "Breakfast at Resnik" / "Resnik Cafe" to "Breakfast at Entropy+" / "Entropy+"

### 4. Documentation Updates
**`README.md`:**
- Updated dining locations section from 8 locations to comprehensive list of all 36
- Updated example favorite dining options
- Added note about Shabbat hours and weekend variations

**`QUICKSTART.md`:**
- Updated sample configuration to use current restaurant names

**`PROJECT-SUMMARY.md`:**
- Updated dining location count from 8 to 36
- Added detailed description of location coverage
- Updated known limitations note about static hours

## Complete List of Dining Locations

The application now includes:

1. Stephanie's - Market C (24/7)
2. Scotty's Market By Salem's
3. Stack'd Underground
4. Stack'd Dessert Bar
5. The Grill At Scotty's
6. Salem's Hot Bar
7. Au Bon Pain At Skibo Café
8. El Gallo De Oro
9. Entropy+
10. Revolution Noodle
11. Millie's Coffee 'n' Creamery
12. Rohr Café - La Prima
13. De Fer Coffee & Tea
14. Nourish
15. Capital Grains
16. The Exchange
17. Schatz Dining Room
18. Taste Of India
19. Hunan Express
20. The Edge Cafe & Market
21. Sweet Plantain
22. Fire And Stone
23. Tahini
24. Zebra Lounge
25. La Prima Espresso (Wean Hall)
26. Redhawk Coffee
27. Ola Ola
28. Ciao Bella
29. Shake Smart
30. Crisp And Crust
31. Rohr Commons - Tepper Eatery
32. Wild Blue Sushi
33. Forbes Avenue Subs
34. Tepper Taqueria
35. Tepper Taqueria Express
36. E.a.t. (Evenings At Tepper)

## Benefits

1. **More Options**: Students have 36 dining locations to choose from instead of 8
2. **Accurate Hours**: Each location has precise operating hours for each day of the week
3. **Real CMU Data**: Uses official CMU Eats data instead of estimates
4. **Better Scheduling**: Claude AI can now find meals at more locations across different times
5. **Special Hours**: Properly handles weekend hours, Shabbat closures, and other variations

## Technical Details

### Hour Parsing Examples

**24-Hour Location:**
```
Input: "Saturday: Open 24 hours"
Output: { day: "Saturday", startHour: 0, endHour: 24 }
```

**Day Range:**
```
Input: "Monday–Friday: 8:00 AM - 6:00 PM"
Output: [
  { day: "Monday", startHour: 8, endHour: 18 },
  { day: "Tuesday", startHour: 8, endHour: 18 },
  ...
]
```

**Multiple Windows:**
```
Input: "Daily: 10:30 AM - 3:00 PM, 3:30 PM - 6:00 PM"
Output: 14 windows (2 per day × 7 days)
```

**Closed Days:**
```
Input: "Saturday: CLOSED; Sunday: 12:00 PM - 8:00 PM"
Output: [{ day: "Sunday", startHour: 12, endHour: 20 }]
```

## Testing

All parsing was verified to work correctly:
- ✅ 24-hour locations parsed correctly
- ✅ Day ranges (Monday–Friday) work properly
- ✅ Multiple time windows per day handled
- ✅ Closed days are filtered out
- ✅ Weekend/weekday variations respected
- ✅ Special hours (Shabbat) parsed correctly

## No Breaking Changes

The data structure remains the same (`DiningLocation` type unchanged), so:
- ✅ All existing components work without modification
- ✅ API contracts remain the same
- ✅ TypeScript types are consistent
- ✅ Claude AI prompt receives the same data format

## Source Data

Original CSV: `/Users/oliverali/Downloads/cmu_eats_hours.csv`
- 36 restaurants with official weekly hours from CMU Eats

