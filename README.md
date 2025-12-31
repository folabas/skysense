# 🌦️ SkySense: Advanced Meteorological Intelligence

SkySense is a premium, high-performance weather intelligence platform designed to provide detailed atmospheric insights with a stunning, modern user interface. Built with **Next.js 15**, **TypeScript**, and **Express**, it offers real-time data visualization, global explorer maps, and personalized activity scheduling.

---

## ✨ Key Features

### 🌡️ Precision Dashboard
*   **Real-Time Sync**: Powered by OpenWeatherMap One Call 3.0 for ultra-accurate current conditions.
*   **Dynamic Highlights**: High-fidelity tracking of UV Index, Wind Status (Beaufort Scale), Humidity, and Precipitation risks.
*   **Astro Tracking**: Live relative countdowns for Sunrise and Sunset, including calculated Length of Day.

### 🌗 Dynamic Theming System
*   **Glassmorphism Aesthetic**: A sleek, translucent UI that adapts perfectly to your environment.
*   **One-Tap Toggle**: Instantly switch between **Deep Dark** and **Crisp Light** modes across the entire application.
*   **Theme-Aware Maps**: Global map layers automatically switch styles to match your selected theme.

### 🗺️ Global Weather Explorer
*   **Interactive Layers**: Toggle between Temperature, Precipitation, and Wind speed global heatmaps.
*   **Advanced Gestures**: Full support for 2-finger panning and pinch-to-zoom on touch devices.
*   **Smart Panning**: Searching for a city automatically glides the map to its exact coordinates.

### 📊 Intelligence & Analytics
*   **Deep Dive Trends**: Visualize temperature variance and precipitation risks using high-performance `recharts`.
*   **Smart Scheduler**: Personalized activity recommendations (Outdoor Workouts, Beach Days, etc.) based on real-time atmospheric metrics.
*   **Severe Alerts**: Integrated Browser Notification API to keep you ahead of extreme weather shifts.

---

## 🚀 Technology Stack

### **Frontend**
- **Next.js 15** (App Router)
- **TypeScript** for type-safe development
- **Tailwind CSS** for adaptive utility-first styling
- **Recharts** for data visualization
- **React Leaflet** for interactive mapping
- **Lucide React** for premium iconography

### **Backend**
- **Node.js & Express** proxy server
- **Axios** for robust API communication
- **Dotenv** for secure environment management

---

## 🛠️ Setup & Installation

### **1. Prerequisites**
- Node.js (v18.x or higher)
- An OpenWeatherMap API Key (with One Call 3.0 access)

### **2. Repository Setup**
```bash
git clone https://github.com/your-username/SkySense.git
cd SkySense
```

### **3. Backend Configuration**
Create a `.env` file in the `server` directory:
```env
OWM_API_KEY=your_openweather_api_key_here
PORT=5000
```
Then run:
```bash
cd server
npm install
npm start
```

### **4. Frontend Configuration**
```bash
cd skysense-web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧭 Project Structure

- `/skysense-web`: The Next.js frontend application.
- `/server`: The Express backend proxy handling API security and geocoding.
- `/src/hooks`: Custom hooks like `useWeather.ts` for unified data management.
- `/src/components`: Modular React components (Dashboard, Analytics, Maps, etc.).

---

## 🔒 Security Note
SkySense uses a dedicated backend proxy to ensure your OpenWeatherMap API keys are never exposed to the client-side browser, protecting your subscription from unauthorized access.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
