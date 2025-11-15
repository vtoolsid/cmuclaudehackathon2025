# Architecture Overview

Visual guide to understanding how CMU Fuel Planner works.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Main Page (app/page.tsx)              │    │
│  │  - File upload                                     │    │
│  │  - State management                                │    │
│  │  - Modal triggers                                  │    │
│  │  - API calls                                       │    │
│  └────────────────────────────────────────────────────┘    │
│           │                    │                    │        │
│           ▼                    ▼                    ▼        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Nutrition   │  │   Fitness    │  │  Schedule    │     │
│  │    Modal     │  │    Modal     │  │   Preview    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                          │
                          │ HTTP POST /api/generate-plan
                          │
┌─────────────────────────▼─────────────────────────────────────┐
│                    NEXT.JS SERVER                             │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │      API Route (app/api/generate-plan/route.ts)     │    │
│  │  1. Receive preferences & class schedule            │    │
│  │  2. Format data for Claude                          │    │
│  │  3. Call Anthropic API                              │    │
│  │  4. Parse JSON response                             │    │
│  │  5. Return meal/workout blocks                      │    │
│  └─────────────────────────┬───────────────────────────┘    │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                            │
                            │ HTTPS Request
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                  ANTHROPIC CLAUDE API                         │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Claude Sonnet 4 (AI Model)                  │    │
│  │  - Analyzes class schedule                          │    │
│  │  - Finds free time windows                          │    │
│  │  - Matches with dining hours                        │    │
│  │  - Schedules workouts                               │    │
│  │  - Respects all preferences                         │    │
│  │  - Returns optimized JSON schedule                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Schedule Import Flow

```
User selects .ics file
        ↓
FileReader reads file content
        ↓
ical.js parses ICS format
        ↓
Extract VEVENT components
        ↓
Convert to ClassBlock[] array
        ↓
Display in UI + Store in state
```

### 2. Preference Collection Flow

```
User clicks "Set Nutrition/Fitness Goals"
        ↓
Modal opens with form
        ↓
User fills out preferences
        ↓
Click "Save"
        ↓
Modal validates input
        ↓
Convert to typed objects
        ↓
Store in component state
        ↓
Display summary in UI
```

### 3. Plan Generation Flow

```
User clicks "Generate Plan with Claude"
        ↓
Validate all data present
        ↓
Apply preferences to dining data
        ↓
POST to /api/generate-plan
        ↓
Server formats prompt
        ↓
Call Claude API with system + user message
        ↓
Claude analyzes schedule
        ↓
Claude returns JSON array
        ↓
Server parses & validates JSON
        ↓
Return MealOrWorkoutBlock[]
        ↓
Frontend displays in SchedulePreview
```

### 4. Export Flow

```
User clicks "Export as .ics"
        ↓
generateICSFile() creates ICS string
        ↓
Format each block as VEVENT
        ↓
Wrap in VCALENDAR
        ↓
Create Blob from string
        ↓
Generate download URL
        ↓
Trigger browser download
        ↓
Clean up URL
        ↓
User imports into calendar app
```

## Component Hierarchy

```
app/layout.tsx (Root)
    └── app/page.tsx (Main App)
            ├── NutritionModal
            │       └── Form Fields
            │
            ├── FitnessModal
            │       └── Form Fields
            │
            └── SchedulePreview
                    └── Day Schedules
                            └── Block Cards
```

## State Management

```typescript
// In app/page.tsx
const [classBlocks, setClassBlocks] = useState<ClassBlock[]>([]);
const [nutritionPreferences, setNutritionPreferences] = useState<...>(null);
const [fitnessPreferences, setFitnessPreferences] = useState<...>(null);
const [mealWorkoutBlocks, setMealWorkoutBlocks] = useState<...>([]);
const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
const [isFitnessModalOpen, setIsFitnessModalOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Flow:**
- All state lives in main page component
- Modals receive callbacks to update state
- Preview components receive state as props
- No external state management needed (simple app)

## Type System

```
┌─────────────────────────────────────────────────┐
│              lib/types.ts                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ClassBlock                                     │
│    ├── id: string                               │
│    ├── title: string                            │
│    ├── location?: string                        │
│    ├── start: string (ISO)                      │
│    └── end: string (ISO)                        │
│                                                 │
│  MealOrWorkoutBlock                             │
│    ├── id: string                               │
│    ├── type: "meal" | "workout"                 │
│    ├── title: string                            │
│    ├── location?: string                        │
│    ├── start: string (ISO)                      │
│    ├── end: string (ISO)                        │
│    └── metadata?: Record<string, any>           │
│                                                 │
│  NutritionPreferences                           │
│    ├── mealsPerDay: number                      │
│    ├── preferredMealTimes: PreferredMealTime[]  │
│    ├── favoriteDiningOptions: string[]          │
│    └── noGoDiningOptions: string[]              │
│                                                 │
│  FitnessPreferences                             │
│    ├── workoutsPerWeek: number                  │
│    ├── activityTypes: string[]                  │
│    ├── workoutSplit?: string                    │
│    ├── targetMuscles?: string[]                 │
│    └── facilitiesOpenWindows?: Window[]         │
│                                                 │
│  DiningLocation                                 │
│    ├── name: string                             │
│    ├── isOnCampus: boolean                      │
│    ├── noGo: boolean                            │
│    └── openWindows: Window[]                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

## File Dependencies

```
app/page.tsx
    ├── imports: components/NutritionModal.tsx
    ├── imports: components/FitnessModal.tsx
    ├── imports: components/SchedulePreview.tsx
    ├── imports: lib/types.ts
    ├── imports: utils/icsParser.ts
    ├── imports: utils/icsGenerator.ts
    └── imports: lib/diningData.ts

app/api/generate-plan/route.ts
    ├── imports: @anthropic-ai/sdk
    └── imports: lib/types.ts

utils/icsParser.ts
    ├── imports: ical.js
    ├── imports: uuid
    └── imports: lib/types.ts

utils/icsGenerator.ts
    └── imports: lib/types.ts

lib/diningData.ts
    └── imports: lib/types.ts

components/*.tsx
    └── imports: lib/types.ts
```

## API Request/Response

### Request to Claude

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4096,
  "system": "<detailed system prompt>",
  "messages": [
    {
      "role": "user",
      "content": "JSON with classBlocks, diningLocations, preferences"
    }
  ]
}
```

### Response from Claude

```json
{
  "content": [
    {
      "type": "text",
      "text": "[{\"id\":\"...\",\"type\":\"meal\",\"title\":\"...\", ...}]"
    }
  ]
}
```

## Security Model

```
┌────────────────────────────────────────────┐
│           Security Layers                  │
├────────────────────────────────────────────┤
│                                            │
│  1. API Key Security                       │
│     • Stored in .env.local                 │
│     • Never sent to client                 │
│     • Server-side only                     │
│                                            │
│  2. Input Validation                       │
│     • TypeScript type checking             │
│     • Form validation in modals            │
│     • API route validation                 │
│                                            │
│  3. File Upload Security                   │
│     • Client-side parsing only             │
│     • No server file storage               │
│     • .ics format validation               │
│                                            │
│  4. Network Security                       │
│     • HTTPS in production                  │
│     • CORS handled by Next.js              │
│     • No sensitive data in URLs            │
│                                            │
└────────────────────────────────────────────┘
```

## Performance Considerations

### Client-Side (Fast)
- ICS file parsing
- Form input handling
- State updates
- Schedule rendering

### Server-Side (API Route)
- Claude API calls (2-5 seconds)
- JSON parsing
- Data formatting

### Optimization Strategies
1. **Static Generation**: Main page pre-rendered
2. **Client Parsing**: .ics processed in browser
3. **Lazy Loading**: Modals only when needed
4. **Minimal State**: Only essential data
5. **Direct Styling**: Tailwind (no runtime CSS-in-JS)

## Error Handling Strategy

```
┌──────────────────────────────────────────┐
│         Error Boundaries                 │
├──────────────────────────────────────────┤
│                                          │
│  File Upload Error                       │
│    ↓ User-friendly message               │
│    ↓ Error state displayed               │
│    ↓ Console log for debugging           │
│                                          │
│  API Call Error                          │
│    ↓ Catch in try/catch                  │
│    ↓ Set error state                     │
│    ↓ Display in UI                       │
│    ↓ Log details to console              │
│                                          │
│  Claude API Error                        │
│    ↓ Check response status               │
│    ↓ Parse error message                 │
│    ↓ Return structured error             │
│    ↓ Frontend displays                   │
│                                          │
│  Validation Error                        │
│    ↓ Form validation before submit       │
│    ↓ Inline error messages               │
│    ↓ Prevent invalid API calls           │
│                                          │
└──────────────────────────────────────────┘
```

## Build Process

```
npm run build
    ↓
Next.js Compiler
    ↓
TypeScript Compilation
    ↓
Tailwind CSS Processing
    ↓
Bundle Optimization
    ↓
Static Page Generation
    ↓
Route Preparation
    ↓
.next/ Output Directory
    ↓
Ready for Production
```

## Deployment Architecture (Vercel)

```
GitHub Repository
        ↓
    Git Push
        ↓
Vercel Build Pipeline
        ├── Install dependencies
        ├── Build Next.js app
        ├── Inject env variables
        └── Generate static assets
        ↓
Edge Network Deployment
        ↓
    Global CDN
        ↓
User Requests
        ├── Static pages → CDN
        ├── API routes → Serverless functions
        └── Assets → Edge cache
```

## Summary

CMU Fuel Planner uses a clean, modern architecture:

- **Frontend**: React components with TypeScript
- **Backend**: Next.js API routes (serverless)
- **AI**: Anthropic Claude API integration
- **Data**: Client-side state management
- **Build**: Next.js compiler with optimization
- **Deploy**: Edge-ready for global distribution

The architecture prioritizes:
- ✅ Simplicity (no complex state management)
- ✅ Security (API keys server-side only)
- ✅ Performance (static generation + client parsing)
- ✅ Type Safety (TypeScript everywhere)
- ✅ Scalability (serverless API routes)

