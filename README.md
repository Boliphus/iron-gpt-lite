## GymBuddy AI App Plan

---

### 1. Core Concept

**GymBuddy AI** is a 72‑hour hackathon mobile app that provides:

- **AI Personal Coaching** via GPT‑4 chat for form tips, motivation, and Q&A  
- **Workout Plan Generator** tailored to goals, schedule, and equipment  
- **Nutrition Planner** with meal logging, API‑driven nutrient analysis, and visual score cards  
- **Progress Tracking & Analytics** with charts of weight, reps, and nutrition scores  
- **Push Notifications** for workout reminders  

---

### 2. Key Features

| Feature                     | AI / API Tech                    | User Flow                                           |
|-----------------------------|----------------------------------|-----------------------------------------------------|
| **Chat Coach**              | OpenAI GPT‑4                     | “How to fix my squat?” → AI reply                   |
| **Workout Plan Generator**  | GPT‑4 + JSON schema              | “4‑day hypertrophy split” → plan rendered in UI     |
| **Nutrition Planner**       | Edamam (or USDA) Nutrition API   | Log ingredients → nutrient breakdown & score cards  |
| **Nutrition Score Cards**   | JS scoring functions + charts    | After analysis → macro/micro/density scores shown   |
| **Progress Analytics**      | Recharts in WebView              | Log weight/reps → trend charts                      |
| **Notifications**           | Expo Notifications               | Set workout schedule → local reminders fire         |

---

### 3. Tech Stack

- **Frontend**: Expo + React Native with NativeWind  
- **AI**: OpenAI GPT‑4 via `openai` JS client  
- **Nutrition API**: Edamam or USDA FoodData Central  
- **Charts**: Recharts (in React Native WebView)  
- **State & Storage**: Redux Toolkit + AsyncStorage  
- **Notifications**: Expo Notifications  
- **Backend (optional)**: Firebase Auth + Firestore  

---

### 4. 72‑Hour Sprint Breakdown

| Time Window | Sprint                           | Goals & Deliverables                                      |
|-------------|----------------------------------|-----------------------------------------------------------|
| H0–H6       | Setup & Scaffolding              | • Expo project init<br>• NativeWind theming scaffold<br>• Auth stub |
| H6–H18      | Chat Coach MVP                   | • OpenAI API integration<br>• Chat UI & basic reply flow  |
| H18–H30     | Workout Plan Generator           | • Prompt templates<br>• JSON plan schema & renderer       |
| H30–H42     | Nutrition Planner & Score Cards  | • Meal‑input UI<br>• Nutrition API call<br>• Score cards UI |
| H42–H54     | Progress Tracking & Notifications| • Chart component<br>• Expo Notifications setup           |
| H54–H66     | Polish & QA                      | • UI polish<br>• Error handling<br>• Smoke tests         |
| H66–H72     | Launch Prep                      | • README & app descriptions<br>• Icons/splash assets<br>• `expo publish` |

---

### 5. README Skeleton

```markdown
# GymBuddy AI

**AI‑powered personal trainer in your pocket.**

## 🚀 Getting Started

1. `git clone … && cd gymbuddy-ai`  
2. `npm install`  
3. Copy your OpenAI key to `app.config.js`:
   ```js
   extra: {
     openAiApiKey: process.env.OPENAI_API_KEY,
   }
   ```  
4. `expo start`

## 🏗 Architecture

- **Expo**/RN + NativeWind  
- **OpenAI** GPT‑4 for chat & plan generation  
- **AsyncStorage** for persisting logs & plans  
- **Recharts** for analytics  
- **Expo Notifications** for reminders  

## 🗓 72‑Hour Roadmap

| Sprint | Deliverable                  |
| ------ | ---------------------------- |
| H0–6   | Scaffolding & Auth           |
| H6–18  | Chat Coach MVP               |
| H18–30 | Workout Plan Generator       |
| H30–42 | Nutrition Planner & Score Cards |
| H42–54 | Progress Tracking & Notifications |
| H54–66 | Polish & QA                  |
| H66–72 | Launch & Publish             |

## 🛠 Available Scripts

- `expo start`  
- `expo publish`  
- `npm run lint`  

## 🎨 Design Tokens

All colors & typography live in `/design-tokens`.
```

---

### 6. Nutrition Score Cards

#### A. Workflow

1. **User logs a meal** (e.g. “200 g chicken breast, 1 cup rice…”)  
2. **API call** to nutrition endpoint → returns `totalNutrients` & `totalDaily`  
3. **Compute scores**:
   - **Macro Balance**: avg. protein/carbs/fat % of daily targets  
   - **Micronutrient Sufficiency**: avg. key vitamins/minerals %  
   - **Calorie Density**: closeness to ideal 1 kcal/g  
4. **Display cards** with title, percent score, and a horizontal gauge  

#### B. Sample Scoring Function

```ts
function computeScores(data): Score[] {
  const { totalNutrients, totalDaily, totalWeight } = data;
  const macroPct =
    (totalDaily.PROCNT.quantity +
     totalDaily.CHOCDF.quantity +
     totalDaily.FAT.quantity) / 3;
  const keys = ['VITC','VITA_RAE','FE','CA'];
  const microPct =
    keys.reduce((sum, k) => sum + (totalDaily[k]?.quantity || 0), 0) / keys.length;
  const kcal = totalNutrients.ENERC_KCAL.quantity;
  const densityScore = Math.min(100, (1 - Math.abs(kcal/totalWeight - 1)) * 100);

  return [
    { id: 'macro', label: 'Macro Balance',   score: Math.round(macroPct) },
    { id: 'micro', label: 'Micronutrients',  score: Math.round(microPct) },
    { id: 'density', label: 'Calorie Density', score: Math.round(densityScore) },
  ];
}
```

#### C. ScoreCard Component

```tsx
import React from 'react';
import { View, Text } from 'react-native';

export function ScoreCard({ title, score, accent }) {
  return (
    <View style={{
      width: 140,
      padding: 16,
      backgroundColor: 'white',
      borderRadius: 24,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      margin: 8,
    }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>
        {title}
      </Text>
      <Text style={{
        fontSize: 24,
        fontWeight: '700',
        color: accent,
        marginVertical: 4,
      }}>
        {score}%
      </Text>
      <View style={{
        height: 6,
        width: '100%',
        backgroundColor: '#eee',
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <View style={{
          height: '100%',
          width: `${score}%`,
          backgroundColor: accent,
        }} />
      </View>
    </View>
  );
}
```

#### D. Integration in NutritionPlanner

```tsx
import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView } from 'react-native';
import { ScoreCard } from '../components/ScoreCard';
import { computeScores } from '../services/nutritionService';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../design-tokens/themes';

export default function NutritionPlanner() {
  const { id } = useTheme();
  const accent = themes[id].accent;

  const [input, setInput] = useState('');
  const [scores, setScores] = useState([]);

  const analyze = async () => {
    const data = await fetchNutritionAPI(input);
    setScores(computeScores(data));
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        style={{ borderWidth: 1, borderRadius: 8, padding: 8 }}
        placeholder="Enter ingredients…"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Analyze" onPress={analyze} />
      <ScrollView horizontal style={{ marginTop: 16 }}>
        {scores.map(s => (  
          <ScoreCard
            key={s.id}
            title={s.label}
            score={s.score}
            accent={accent}
          />
        ))}
      </ScrollView>
    </View>
  );
}
```
