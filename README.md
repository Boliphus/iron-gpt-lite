# IronGPT Lite – AI‑Powered Rep Counter & Form Coach

![Hero banner](docs/images/hero.png)

> **72‑hour hackathon prototype** that counts reps, grades form, and autogenerates your next workout plan using GPT‑4o – all from a single cross‑platform React Native + Expo code‑base.

---

## ✨ Pitch
* Record your squat / push‑up / curl with the phone camera.
* On‑device pose estimation counts reps and flags bad form in real time.
* Hit **Finish** → IronGPT feeds your performance into an LLM and spits out a progressive overload plan for tomorrow.
* Share a recap GIF of your best reps straight to socials.

---

## 📸 Screenshots
| Workout HUD | Form Feedback | Recap GIF |
|-------------|--------------|-----------|
| ![HUD](docs/images/hud.png) | ![Feedback](docs/images/feedback.png) | ![GIF](docs/images/recap.gif) |

> **Note:** All mockups use our dark‑first design system with glassmorphic cards and dynamic colour accents (Material You / iOS semantic colours).

---

## 🏗 Architecture
📦 iron-gpt-lite
 ┣ app               # React Native src (Expo)
 ┣ assets            # Icons, Lottie, fonts
 ┣ functions         # (optional) Cloudflare Workers
 ┣ design-tokens     # JSON tokens generated from Figma
 ┣ docs              # Screens, pitch deck, hero images
 ┣ metro.config.js
 ┗ README.md         # ← you are here


### Core Tech
| Layer | Library | Notes |
|-------|---------|-------|
| UI | **React Native + Expo SDK 
49** | Instant OTA updates |
| Design System | **NativeWind** + Tailwind config | Dark/light, 8‑pt grid |
| Pose AI | **react-native-mediapipe-pose** (TFLite GPU) | ~60 fps on flagship devices |
| LLM | **OpenAI GPT‑4o** | Few‑shot JSON schema output |
| Video/GIF | **expo-gl** & **ffmpeg.wasm** | Client‑side GIF stitch |
| State | **Zustand** | Minimal boilerplate |
| Storage | **Expo SQLite** | Local‑only for hack scope |

---

## 🚀 Quick Start
bash
# 1. Clone & install deps
$ git clone https://github.com/your-org/iron-gpt-lite.git
$ cd iron-gpt-lite && yarn

# 2. Add your OpenAI key
$ cp .env.example .env
# → paste OPENAI_API_KEY in .env

# 3. Run in Expo Go (iOS / Android)
$ expo start --tunnel

# 4. Build device binaries (optional)
$ eas build -p ios  # or -p android


---

## 🔑 Environment Variables (.env)
OPENAI_API_KEY="sk-xxxx"
MODEL_NAME="gpt-4o-mini"
POSE_FRAME_INTERVAL=3     # infer every N frames to save battery


---

## 🧑‍🎨 Design Tokens
Colour, typography, and spacing tokens are exported from Figma via the [Figma Tokens](https://tokens.studio/) plugin and live in /design-tokens/tailwind.json. They are auto‑converted to Tailwind config with npm run tokens.

bash
# Regenerate design tokens after Figma update
$ npm run tokens


---

## 🛣 72‑Hour Road‑map
| Phase | Hours | Deliverables |
|-------|-------|--------------|
| **Boot** | 0‑4 | Repo, CI, onboarding sketch |
| **Vision + Rep Counter** | 4‑12 | Pose overlay, squat counter |
| **Multi‑exercise** | 12‑24 | Push‑up & curl configs |
| **GPT Plan Generator** | 24‑32 | API call, JSON schema |
| **Recap GIF** | 32‑44 | ffmpeg.wasm export |
| **Polish** | 44‑56 | Dark mode, haptics, error states |
| **Testing & Demo Assets** | 56‑70 | iPhone + Pixel test, store screenshots |
| **Pitch Deck** | 70‑72 | 3‑min live demo + deck |

---

## 🧩 Extending After Hackathon
* **Back‑end sync** (Supabase) for multi‑device history.
* **Wearable HR/HRV ingestion** for auto‑deload.
* **Nutrition camera** using Vision + LLM.
* **AR bar‑path overlay** with ARKit/ARCore.

---

## 👥 Team
| Role | Name | GitHub |
|------|------|--------|
| PM / Pose AI | Jane Doe | @janedoe |
| Mobile Lead | Boris Lin | @borislin |
| LLM Prompting | Alex Chen | @alexchen |
| UI/UX | Priya Patel | @priyapatel |

---

## 📜 License
MIT © 2025 IronGPT Lite Hackathon Team
