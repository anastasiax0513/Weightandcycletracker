# 🏥 Health Tracker PWA

A comprehensive Progressive Web App for tracking your health metrics including weight, menstrual cycle, steps, and water intake.

## ✨ Features

### 📊 Weight Tracking
- Daily weight logging with timestamps
- Goal weight setting and progress tracking
- Trend analysis with historical data
- Estimated time to reach goal based on trends
- Interactive charts with goal line visualization

### 🩸 Menstrual Cycle Tracking
- Period start and end date logging
- Automatic cycle prediction based on historical data
- Ovulation date calculation
- 24-hour alerts before predicted period start
- Cycle length and pattern analysis

### 👟 Steps Tracking
- Daily step count logging
- Customizable daily step goals
- Progress visualization
- Weekly and monthly trends

### 💧 Water Intake Tracking
- Daily water consumption logging (in oz or ml)
- Customizable daily hydration goals
- Visual progress indicators
- Hydration trends over time

### 📅 Monthly Calendar View
- Color-coded indicators for all tracked metrics
- Click any day to add or edit values
- Quick overview of all health data
- Current day highlighting

### 📈 Comparison Charts
- Overlay 2 or more metrics on the same chart
- Compare trends across different health metrics
- Customizable date ranges
- Interactive tooltips and legends

### 💾 Local Data Storage
- All data stored locally using localStorage
- Privacy-focused - your data never leaves your device
- No account required
- Works completely offline after installation

### 📱 PWA Features
- Install on any device (iOS, Android, Desktop)
- Works offline after first load
- Native app-like experience
- Home screen icon
- Fast loading with service worker caching

## 🚀 Deployment

See [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md) for detailed deployment instructions.

**Quick Start:**
1. Upload files to GitHub
2. Import to Vercel
3. Deploy
4. Install on your device!

## 📱 Installation

After deploying, see [INSTALLATION.md](./INSTALLATION.md) for device-specific installation instructions.

**Quick Install:**
- **iOS:** Safari → Share → Add to Home Screen
- **Android:** Chrome → Menu → Install App

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4.0
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **PWA:** Service Workers + Web App Manifest

## 📂 Project Structure

```
health-tracker/
├── components/           # React components
│   ├── WeightTracker.tsx
│   ├── CycleTracker.tsx
│   ├── StepsTracker.tsx
│   ├── WaterTracker.tsx
│   ├── MonthlyCalendar.tsx
│   ├── ComparisonChart.tsx
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── styles/              # Global styles
├── public/              # Static assets
│   ├── manifest.json    # PWA manifest
│   └── service-worker.js
└── App.tsx             # Main application component
```

## 🔧 Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173)

## 🌐 Environment Support

- **Browsers:** Chrome, Safari, Firefox, Edge (latest versions)
- **Mobile:** iOS 12+, Android 5+
- **Desktop:** Windows, macOS, Linux

## 📊 Data Management

All data is stored in your browser's localStorage:
- `health-weights` - Weight entries
- `health-cycles` - Menstrual cycle data
- `health-steps` - Step count entries
- `health-water` - Water intake data
- `health-goal-weight` - Target weight
- `health-step-goal` - Daily step target
- `health-water-goal` - Daily hydration target

**To export your data:** Use browser developer tools → Application → Local Storage → Export

**To clear data:** Clear browser data or use the app's data management features

## 🔒 Privacy

- ✅ All data stored locally on your device
- ✅ No external servers or databases
- ✅ No tracking or analytics
- ✅ No account required
- ✅ Your data stays private

## 📝 License

This project is open source and available for personal use.

## 🤝 Contributing

Feel free to fork, modify, and enhance this application for your own needs!

## 💡 Future Enhancements

Potential features to add:
- Data export (CSV/JSON)
- Data import from other apps
- More detailed analytics
- Additional health metrics (sleep, mood, etc.)
- Reminders and notifications
- Dark mode
- Multiple user profiles
- Cloud backup (optional)

---

**Built with ❤️ for personal health tracking**
