# Quick Start Guide

Get CMU Fuel Planner running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up API Key

Create `.env.local` in the root directory:

```bash
echo "ANTHROPIC_API_KEY=your_key_here" > .env.local
```

Replace `your_key_here` with your actual Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

## 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4. Test with Sample Data

Use the included `sample-schedule.ics` file to test the app:

1. Click the file upload button
2. Select `sample-schedule.ics` from the project root
3. Set your nutrition and fitness preferences
4. Click "Generate Plan with Claude"

## Sample Configuration

### Nutrition Goals
- **Meals Per Day**: 3
- **Favorite Dining**: Resnik, Entropy+
- **No-Go Dining**: (leave empty)

### Fitness Goals
- **Workouts Per Week**: 4
- **Activity Types**: lifting, cardio
- **Workout Split**: Push/Pull/Legs
- **Target Muscles**: chest, back, legs, shoulders

## What to Expect

Claude AI will generate a weekly schedule that:
- Schedules 3 meals per day at your favorite locations
- Places 4 workouts throughout the week
- Avoids conflicts with your classes
- Respects dining hours and gym availability

## Export Your Schedule

Click "Export as .ics File" to download your schedule and import it into:
- Google Calendar
- Apple Calendar
- Outlook
- Any calendar app that supports .ics files

## Troubleshooting

**Port already in use?**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**API key not working?**
```bash
# Check if .env.local exists
cat .env.local

# Restart the dev server
npm run dev
```

**Build errors?**
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## Next Steps

- Export your real schedule from CMU SIO
- Customize your dining and fitness preferences
- Export and sync with your calendar
- Never miss a meal or workout again!

Happy planning! 🎓💪🍽️

