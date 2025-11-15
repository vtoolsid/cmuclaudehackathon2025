# 🎓 TartanTaste

A smart scheduling application for CMU students that uses Claude AI to optimize meal and workout times around class schedules.

## Features

- 📅 **Import Academic Schedule**: Upload your `.ics` calendar file from SIO or schedule tools
- 🍽️ **Nutrition Planning**: Set meal preferences, favorite dining locations, and places to avoid
- 💪 **Fitness Planning**: Configure workout frequency, activity types, and muscle group targets
- 🤖 **AI-Powered Scheduling**: Claude AI generates optimized meal and workout schedules
- 📥 **Export to Calendar**: Download your complete schedule as an `.ics` file for Google Calendar, Apple Calendar, etc.

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API (Sonnet 4)
- **Calendar**: ical.js for ICS parsing and generation
- **Backend**: Next.js API Routes

## Prerequisites

- Node.js 18+ and npm
- Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

## Setup Instructions

### 1. Clone and Install

```bash
cd /path/to/cmuclaudehackathon2025
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Usage Guide

### Step 1: Import Your Class Schedule

1. Export your class schedule from CMU SIO as an `.ics` file
2. Click the file upload button and select your `.ics` file
3. The app will parse and display your class schedule

### Step 2: Set Nutrition Goals

1. Click "Set Nutrition Goals"
2. Configure:
   - **Meals Per Day**: Number of meals you want (1-5)
   - **Favorite Dining Options**: Comma-separated list (e.g., "Entropy+, Au Bon Pain, The Exchange")
   - **No-Go Dining Options**: Places you want to avoid
3. Default meal times:
   - Breakfast: 8:00 AM - 10:00 AM
   - Lunch: 12:00 PM - 2:00 PM
   - Dinner: 6:00 PM - 8:00 PM

### Step 3: Set Fitness Goals

1. Click "Set Fitness Goals"
2. Configure:
   - **Workouts Per Week**: Number of workouts (0-7)
   - **Activity Types**: E.g., "lifting, cardio, yoga"
   - **Workout Split** (optional): E.g., "Push/Pull/Legs"
   - **Target Muscles** (optional): E.g., "chest, back, legs"
3. CMU gym hours are pre-configured

### Step 4: Generate Your Plan

1. Click "Generate Plan with Claude"
2. Claude AI will analyze your schedule and preferences
3. A complete weekly plan with meals and workouts will be generated
4. Review the schedule in the preview panel

### Step 5: Export to Calendar

1. Click "Export as .ics File"
2. Import the downloaded file into your calendar app
3. Your meals and workouts are now in your calendar!

## Project Structure

```
cmuclaudehackathon2025/
├── app/
│   ├── api/
│   │   └── generate-plan/
│   │       └── route.ts          # Claude API integration
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── components/
│   ├── FitnessModal.tsx          # Fitness preferences modal
│   ├── NutritionModal.tsx        # Nutrition preferences modal
│   └── SchedulePreview.tsx       # Weekly schedule display
├── lib/
│   ├── diningData.ts             # CMU dining locations
│   └── types.ts                  # TypeScript type definitions
├── utils/
│   ├── icsGenerator.ts           # ICS file generation
│   └── icsParser.ts              # ICS file parsing
├── .env.local                    # Environment variables (create this)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Data Models

### ClassBlock
```typescript
{
  id: string;
  title: string;
  location?: string;
  start: string;  // ISO timestamp
  end: string;    // ISO timestamp
}
```

### MealOrWorkoutBlock
```typescript
{
  id: string;
  type: "meal" | "workout";
  title: string;
  location?: string;
  start: string;  // ISO timestamp
  end: string;    // ISO timestamp
  metadata?: Record<string, any>;
}
```

## CMU Dining Locations

The app includes 36 official CMU dining locations with accurate operating hours from CMU Eats:
- Stephanie's - Market C (24/7)
- Scotty's Market By Salem's
- Stack'd Underground
- Stack'd Dessert Bar
- The Grill At Scotty's
- Salem's Hot Bar
- Au Bon Pain At Skibo Café
- El Gallo De Oro
- Entropy+
- Revolution Noodle
- Millie's Coffee 'n' Creamery
- Rohr Café - La Prima
- De Fer Coffee & Tea
- Nourish
- Capital Grains
- The Exchange
- Schatz Dining Room
- Taste Of India
- Hunan Express
- The Edge Cafe & Market
- Sweet Plantain
- Fire And Stone
- Tahini
- Zebra Lounge
- La Prima Espresso (Wean Hall)
- Redhawk Coffee
- Ola Ola
- Ciao Bella
- Shake Smart
- Crisp And Crust
- Rohr Commons - Tepper Eatery
- Wild Blue Sushi
- Forbes Avenue Subs
- Tepper Taqueria
- Tepper Taqueria Express
- E.a.t. (Evenings At Tepper)

Each location includes actual operating hours for each day of the week, including weekend variations and special Shabbat hours.

## Claude AI Integration

The app uses Claude Sonnet 4 to:
1. Analyze your class schedule and find free time windows
2. Match meal times with dining location hours
3. Schedule workouts based on gym availability
4. Respect all user preferences (favorites, no-go locations, meal frequency)
5. Balance the schedule across the week

## Troubleshooting

### API Key Issues
- Ensure `ANTHROPIC_API_KEY` is set in `.env.local`
- Restart the dev server after adding the environment variable

### ICS Parsing Errors
- Ensure your `.ics` file is valid (exported from SIO or compatible tools)
- Check that the file contains VEVENT components

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## Future Enhancements

- [ ] Real-time CMU Eats API integration
- [ ] Custom meal time preferences
- [ ] Conflict detection and resolution
- [ ] Walking time calculations between locations
- [ ] Study session scheduling
- [ ] Group study/meal coordination
- [ ] Mobile app version

## License

MIT License - Built for the CMU Claude Hackathon 2025

## Credits

Built with ❤️ for CMU students using:
- [Claude AI](https://anthropic.com) by Anthropic
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [ical.js](https://mozilla-comm.github.io/ical.js/)
