# SkySense Web Interface

This is the frontend portal for the SkySense weather platform, built with **Next.js 15** and **Tailwind CSS**.

## 🚀 Key Features
- **Real-time Dashboard**: Live weather tracking with geolocation.
- **Analytics**: Deep-dive charts for temperature and precipitation.
- **Global Map**: Interactive meteorological heatmaps with gesture support.
- **Smart Scheduler**: AI-driven activity planning.
- **Dynamic Themes**: Seamless Light and Dark mode switching.

## 🛠️ Quick Start
1. Ensure the parent `server` is running.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Architecture
- `/src/app`: Root layout and theme providers.
- `/src/components`: UI modules (Dashboard, Map, Analytics).
- `/src/hooks`: Data fetching logic (`useWeather.ts`).
- `/src/lib`: Shared utilities and styling constants.

For full project documentation, please see the [main README](../README.md) in the project root.
