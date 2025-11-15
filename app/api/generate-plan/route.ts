import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ClassBlock, NutritionPreferences, FitnessPreferences, DiningLocation, MealOrWorkoutBlock } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { classBlocks, nutritionPreferences, fitnessPreferences, diningLocations } = await request.json();

    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Build the prompt for Claude
    const systemPrompt = `You are a scheduling assistant for CMU students. You receive:
- A list of class blocks (busy times, with start/end timestamps)
- A list of dining locations with open hours
- The student's nutrition preferences (meals per day, preferred times, favorites, no-go locations)
- The student's fitness preferences (workouts per week, activity types, muscle splits, facility hours)

CRITICAL MEAL TIME REQUIREMENTS:
- Breakfast MUST be scheduled between 8:00 AM - 10:00 AM
- Lunch MUST be scheduled between 12:00 PM - 2:00 PM  
- Dinner MUST be scheduled between 6:00 PM - 8:00 PM
These are the preferredMealTimes in the data. DO NOT schedule meals outside these windows.

Your job is to return a 7-day plan that:
1. **STRICTLY schedules meals within the specified preferredMealTimes windows** - this is non-negotiable
2. Places meals only in free windows when at least one acceptable dining location is open
3. Avoids any no-go dining locations
4. Schedules workouts in free windows, respecting facility hours and target muscles
5. Spreads workouts throughout the week appropriately (workoutsPerWeek)
6. Ensures meals and workouts don't overlap with classes
7. Each meal should last 45-60 minutes
8. Each workout should last 60-90 minutes
9. Choose dining locations from the student's favorite list when possible

Output ONLY valid JSON (no markdown, no explanations) as an array of objects with this exact format:
[
  {
    "id": "unique-id",
    "type": "meal" | "workout",
    "title": "Breakfast at Entropy+" or "Upper Body Workout",
    "location": "Entropy+" or "Gym",
    "start": "ISO 8601 timestamp",
    "end": "ISO 8601 timestamp"
  }
]`;

    const userData = {
      classBlocks: classBlocks as ClassBlock[],
      diningLocations: diningLocations as DiningLocation[],
      nutritionPreferences: nutritionPreferences as NutritionPreferences,
      fitnessPreferences: fitnessPreferences as FitnessPreferences,
    };

    const userMessage = `Please generate a weekly meal and workout schedule based on this data:

CLASS SCHEDULE (Avoid these times):
${JSON.stringify(userData.classBlocks, null, 2)}

DINING LOCATIONS (With open hours):
${JSON.stringify(userData.diningLocations, null, 2)}

NUTRITION PREFERENCES (MUST follow preferredMealTimes exactly):
${JSON.stringify(userData.nutritionPreferences, null, 2)}

IMPORTANT: The preferredMealTimes specify EXACT windows for meals:
- ${userData.nutritionPreferences.preferredMealTimes[0]?.label || 'Breakfast'}: ${userData.nutritionPreferences.preferredMealTimes[0]?.startHour}:00 - ${userData.nutritionPreferences.preferredMealTimes[0]?.endHour}:00
- ${userData.nutritionPreferences.preferredMealTimes[1]?.label || 'Lunch'}: ${userData.nutritionPreferences.preferredMealTimes[1]?.startHour}:00 - ${userData.nutritionPreferences.preferredMealTimes[1]?.endHour}:00
- ${userData.nutritionPreferences.preferredMealTimes[2]?.label || 'Dinner'}: ${userData.nutritionPreferences.preferredMealTimes[2]?.startHour}:00 - ${userData.nutritionPreferences.preferredMealTimes[2]?.endHour}:00

Schedule meals ONLY within these time windows. Do NOT schedule dinner at 2-3 PM or any other incorrect time.

FITNESS PREFERENCES:
${JSON.stringify(userData.fitnessPreferences, null, 2)}

Generate the schedule for the upcoming week starting from Monday. Return ONLY the JSON array of meal and workout blocks.`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    // Parse Claude's response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Try to extract JSON from the response (in case Claude adds markdown formatting)
    let jsonResponse = responseText.trim();
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonResponse = jsonMatch[0];
    }

    const generatedBlocks: MealOrWorkoutBlock[] = JSON.parse(jsonResponse);

    return NextResponse.json({ blocks: generatedBlocks });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

