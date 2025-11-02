# Movie Recommender App 🎬

A beautiful movie recommendation app powered by Google Gemini AI. Answer 5 quick questions and get a personalized movie recommendation!

## Features ✨

- **Gemini AI Integration** - Smart recommendations using Gemini 1.5 Pro
- **Dark Blue Theme** - Modern, sleek design
- **MCQ Interface** - Easy-to-use multiple choice questions
- **API Validation** - Tests your API key before starting
- **One Perfect Movie** - Get THE movie that matches your mood

## Setup Instructions 🚀

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (starts with `AIza...`)

### 3. Run the App

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 4. Enter Your API Key

When you first open the app, paste your Gemini API key. The app will validate it before proceeding.

## Tech Stack 💻

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Gemini 1.5 Pro** - AI recommendations

## Project Structure 📁

```
movie-recommender-app/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## Available Scripts 📜

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## How It Works 🎯

1. **API Validation** - Tests your Gemini API key with a simple request
2. **5 Questions** - Multiple choice questions about:
   - Your current mood
   - Preferred genre
   - Movie era preference
   - Pacing preference
   - Ending preference
3. **AI Processing** - Gemini AI analyzes your preferences
4. **Perfect Match** - Get one movie recommendation with detailed reasoning

## Troubleshooting 🔧

**API Key Issues:**
- Make sure your key starts with `AIza...`
- Check that you've enabled the Gemini API in Google Cloud Console
- Verify you haven't exceeded your API quota

**Build Issues:**
- Delete `node_modules` and run `npm install` again
- Make sure you're using Node.js 16 or higher

## License 📄

MIT - Feel free to use this project however you want!

---

Made with ❤️ using React + Vite + Gemini AI
