# Development Guide

## Project Overview

CMU Fuel Planner is a full-stack Next.js application that integrates Claude AI to help CMU students optimize their meal and workout schedules around their classes.

## Architecture

### Frontend (React + Next.js)
- **Main Page** (`app/page.tsx`): Client-side React component managing state
- **Modals**: `NutritionModal.tsx` and `FitnessModal.tsx` for user preferences
- **Schedule Display**: `SchedulePreview.tsx` for visualizing the weekly plan

### Backend (Next.js API Routes)
- **API Route** (`app/api/generate-plan/route.ts`): Handles Claude API integration

### Utilities
- **ICS Parser** (`utils/icsParser.ts`): Parses uploaded calendar files
- **ICS Generator** (`utils/icsGenerator.ts`): Creates downloadable calendar files

### Data Layer
- **Types** (`lib/types.ts`): TypeScript interfaces for all data models
- **Dining Data** (`lib/diningData.ts`): CMU dining locations with hours

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000)

### 2. Make Changes

- Edit files in `app/`, `components/`, `lib/`, or `utils/`
- Next.js hot reload will automatically update the browser

### 3. Type Checking

```bash
npm run type-check
```

### 4. Linting

```bash
npm run lint
```

### 5. Build for Production

```bash
npm run build
npm start
```

## Key Technologies

### Next.js 15 (App Router)
- Server and client components
- API routes for backend logic
- Built-in TypeScript support
- Automatic code splitting

### Tailwind CSS
- Utility-first CSS framework
- Configured in `tailwind.config.ts`
- Global styles in `app/globals.css`

### Anthropic Claude API
- Model: `claude-sonnet-4-20250514`
- Used for intelligent schedule generation
- API key stored in `.env.local`

### ical.js
- Parses ICS calendar files
- Extracts event data (VEVENT components)
- Handles date/time conversions

## File Structure

```
/Users/virtoolsidass/Documents/GitHub/cmuclaudehackathon2025/
├── app/
│   ├── api/generate-plan/route.ts   # Claude API integration
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main application
├── components/
│   ├── FitnessModal.tsx             # Fitness preferences UI
│   ├── NutritionModal.tsx           # Nutrition preferences UI
│   └── SchedulePreview.tsx          # Weekly schedule display
├── lib/
│   ├── diningData.ts                # CMU dining locations
│   └── types.ts                     # TypeScript types
├── utils/
│   ├── icsGenerator.ts              # ICS file creation
│   └── icsParser.ts                 # ICS file parsing
├── .env.local                       # Environment variables (create this)
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
└── tailwind.config.ts               # Tailwind config
```

## Environment Variables

Create `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

**Important**: Never commit `.env.local` to git (already in `.gitignore`)

## Testing the Application

### Test with Sample Schedule

1. Use `sample-schedule.ics` (included)
2. Upload it in the app
3. Set preferences
4. Generate plan
5. Export and verify ICS output

### Test Different Scenarios

**Minimal Schedule:**
- 2-3 classes per day
- 2 meals, 3 workouts per week

**Heavy Schedule:**
- 4-5 classes per day
- 3 meals, 5 workouts per week
- Multiple no-go locations

**Edge Cases:**
- Empty preferences
- No classes uploaded
- Very early/late classes
- Weekend schedules

## API Integration Details

### Claude API Call Flow

1. User submits preferences
2. Frontend calls `/api/generate-plan` (POST)
3. Backend formats data for Claude
4. Claude generates schedule as JSON
5. Backend parses and validates response
6. Frontend displays schedule

### Prompt Engineering

The system prompt instructs Claude to:
- Find free time windows between classes
- Match meals with dining hours
- Schedule workouts based on gym availability
- Respect all user preferences
- Output valid JSON only

### Error Handling

- API key validation
- JSON parsing with fallback
- User-friendly error messages
- Console logging for debugging

## Common Development Tasks

### Add New Dining Location

Edit `lib/diningData.ts`:

```typescript
{
  name: "New Location",
  isOnCampus: true,
  noGo: false,
  openWindows: [
    { day: "Monday", startHour: 7, endHour: 22 },
    // ... more days
  ],
}
```

### Modify Meal Time Preferences

Edit `components/NutritionModal.tsx`:

```typescript
const DEFAULT_MEAL_TIMES = [
  { label: 'Breakfast', startHour: 8, endHour: 10 },
  { label: 'Brunch', startHour: 10, endHour: 12 },  // Add new
  // ... more meal times
];
```

### Change Claude Model

Edit `app/api/generate-plan/route.ts`:

```typescript
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',  // Change model here
  // ...
});
```

### Customize Styling

Edit `app/globals.css` or use Tailwind classes in components.

## Debugging Tips

### Check API Calls

Open browser DevTools → Network tab → Filter by "generate-plan"

### View Claude Responses

Check terminal/console logs when running `npm run dev`

### Verify Environment Variables

```bash
# In terminal
echo $ANTHROPIC_API_KEY

# Or check in code
console.log('API Key set:', !!process.env.ANTHROPIC_API_KEY);
```

### ICS File Issues

```javascript
// Add logging in icsParser.ts
console.log('Parsed events:', vevents.length);
console.log('First event:', vevents[0]);
```

## Performance Considerations

- **Client-side parsing**: ICS files parsed in browser (fast for small files)
- **API route**: Claude API calls made server-side (secure)
- **Static generation**: Main page pre-rendered at build time
- **Dynamic route**: `/api/generate-plan` runs on-demand

## Security Notes

- API key never exposed to client
- All Claude API calls from server
- Input validation on API routes
- No sensitive data stored

## Useful Commands

```bash
# Fresh install
npm run fresh

# Clean build artifacts
npm run clean

# Type checking without building
npm run type-check

# Production build
npm run build

# Serve production build
npm start
```

## Future Improvements

### Short-term
- [ ] Add loading states and progress indicators
- [ ] Improve error messages
- [ ] Add schedule conflict warnings
- [ ] Allow manual block editing

### Medium-term
- [ ] Real-time CMU Eats API integration
- [ ] Custom meal time configuration
- [ ] Walking time between locations
- [ ] Multi-week planning

### Long-term
- [ ] User accounts and saved preferences
- [ ] Social features (study groups, meal buddies)
- [ ] Mobile app with push notifications
- [ ] Integration with CMU authentication

## Getting Help

- Check the [README.md](./README.md) for setup instructions
- See [QUICKSTART.md](./QUICKSTART.md) for quick testing
- Review type definitions in `lib/types.ts`
- Read component comments for implementation details

## Contributing

1. Create a feature branch
2. Make changes with clear commits
3. Test thoroughly (all scenarios)
4. Run `npm run lint` and `npm run type-check`
5. Build successfully with `npm run build`
6. Submit a pull request

Happy coding! 🚀

