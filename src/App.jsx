import React, { useState, useEffect } from 'react';
import { Film, Sparkles, ArrowRight, RotateCcw, MapPin } from 'lucide-react';

function App() {
  const [step, setStep] = useState('intro');
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
  const [apiError, setApiError] = useState('');
  const [validatingApi, setValidatingApi] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [watchedMovies, setWatchedMovies] = useState([]);

  // Get user location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    setLocationLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
              const data = await response.json();
              setUserLocation({
                city: data.city || data.locality,
                country: data.countryName,
                countryCode: data.countryCode
              });
              console.log('📍 Location detected:', data.city, data.countryName);
            } catch (error) {
              console.log('Could not get location details');
            }
          },
          (error) => {
            console.log('Location permission denied or unavailable');
          }
        );
      }
    } catch (error) {
      console.log('Geolocation not supported');
    }
    setLocationLoading(false);
  };

  const questions = [
    {
      id: 'mood',
      question: "What's your current vibe?",
      options: [
        { value: 'uplifting', label: 'Uplifting', emoji: '✨', description: 'Feel-good energy' },
        { value: 'intense', label: 'Intense', emoji: '⚡', description: 'High stakes' },
        { value: 'thoughtful', label: 'Thoughtful', emoji: '🧠', description: 'Mind-bending' },
        { value: 'chill', label: 'Chill', emoji: '🌙', description: 'Laid back' },
        { value: 'dark', label: 'Dark', emoji: '🖤', description: 'Gritty vibes' }
      ]
    },
    {
      id: 'genre',
      question: "Pick your genre",
      options: [
        { value: 'action', label: 'Action', emoji: '💥', description: 'Adrenaline rush' },
        { value: 'scifi', label: 'Sci-Fi', emoji: '🚀', description: 'Future worlds' },
        { value: 'drama', label: 'Drama', emoji: '🎭', description: 'Raw emotion' },
        { value: 'comedy', label: 'Comedy', emoji: '😂', description: 'Pure laughs' },
        { value: 'thriller', label: 'Thriller', emoji: '🔪', description: 'Suspenseful' },
        { value: 'horror', label: 'Horror', emoji: '👻', description: 'Terrifying' }
      ]
    },
    {
      id: 'era',
      question: "Choose your era",
      options: [
        { value: 'recent', label: '2020s', emoji: '🆕', description: 'Fresh releases' },
        { value: 'modern', label: '2010s', emoji: '📱', description: 'Modern classics' },
        { value: 'classic', label: '2000s', emoji: '💿', description: 'Nostalgic' },
        { value: 'vintage', label: 'Pre-2000', emoji: '📼', description: 'Timeless' },
        { value: 'any', label: 'Any Era', emoji: '🎲', description: 'Surprise me' }
      ]
    },
    {
      id: 'pace',
      question: "Select pacing",
      options: [
        { value: 'fast', label: 'Fast', emoji: '⚡', description: 'Non-stop' },
        { value: 'moderate', label: 'Balanced', emoji: '⚖️', description: 'Just right' },
        { value: 'slow', label: 'Slow-burn', emoji: '🔥', description: 'Builds up' },
        { value: 'varied', label: 'No Preference', emoji: '〰️', description: 'Whatever works' }
      ]
    },
    {
      id: 'ending',
      question: "How should it end?",
      options: [
        { value: 'happy', label: 'Happy', emoji: '🌟', description: 'Feel-good' },
        { value: 'bittersweet', label: 'Bittersweet', emoji: '🌗', description: 'Complex' },
        { value: 'twist', label: 'Plot Twist', emoji: '🔄', description: 'Unexpected' },
        { value: 'open', label: 'Open-ended', emoji: '❓', description: 'Ambiguous' },
        { value: 'any', label: 'Surprise Me', emoji: '🎭', description: 'Anything' }
      ]
    }
  ];

  const handleOptionSelect = (value) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value
    });
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        getRecommendation();
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const validateApiKey = async () => {
    setValidatingApi(true);
    setApiError('');
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
    
    try {
      console.log('Testing API key...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello'
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Key validation failed:', data);
        
        if (data.error) {
          if (data.error.status === 'INVALID_ARGUMENT') {
            setApiError('Invalid API key format');
          } else if (data.error.status === 'PERMISSION_DENIED') {
            setApiError('API key is invalid or lacks permission');
          } else if (data.error.code === 429) {
            setApiError('API quota exceeded');
          } else {
            setApiError(`Error: ${data.error.message || 'Unknown error'}`);
          }
        } else {
          setApiError('Failed to validate API key');
        }
        
        setValidatingApi(false);
        return;
      }
      
      if (data.candidates && data.candidates[0]) {
        console.log('✅ API key validated');
        setShowApiInput(false);
      } else {
        console.error('Unexpected API response:', data);
        setApiError('Unexpected response from API');
      }
      
    } catch (error) {
      console.error('Error validating API key:', error);
      setApiError(`Network error: ${error.message}`);
    }
    
    setValidatingApi(false);
  };

  const getRecommendation = async () => {
    setLoading(true);
    setStep('loading');

    const moodMap = {
      uplifting: 'uplifting and feel-good',
      intense: 'intense and thrilling',
      thoughtful: 'deep and thought-provoking',
      chill: 'chill and relaxing',
      dark: 'dark and mysterious'
    };

    const genreMap = {
      action: 'Action/Adventure',
      scifi: 'Sci-Fi/Fantasy',
      drama: 'Drama',
      comedy: 'Comedy',
      thriller: 'Thriller/Mystery',
      horror: 'Horror'
    };

    const eraMap = {
      recent: 'from 2020-2025',
      modern: 'from 2010-2019',
      classic: 'from 2000-2009',
      vintage: 'from before 2000',
      any: 'from any era'
    };

    const paceMap = {
      fast: 'fast-paced',
      moderate: 'moderately paced',
      slow: 'slow-burn',
      varied: 'with any pacing'
    };

    const endingMap = {
      happy: 'a happy ending',
      bittersweet: 'a bittersweet ending',
      twist: 'a plot twist ending',
      open: 'an open-ended conclusion',
      any: 'any type of ending'
    };

    const locationContext = userLocation 
      ? `\n- User location: ${userLocation.city}, ${userLocation.country}. Consider regional cinema, local favorites, or culturally relevant films from this region when appropriate.`
      : '';

    const watchedContext = watchedMovies.length > 0
      ? `\n- Movies already watched (DO NOT RECOMMEND THESE): ${watchedMovies.join(', ')}`
      : '';

    const prompt = `You are a movie recommendation expert. Based on the user's preferences, recommend ONE perfect movie.

User preferences:
- Mood: ${moodMap[answers.mood]}
- Genre: ${genreMap[answers.genre]}
- Era: A movie ${eraMap[answers.era]}
- Pace: ${paceMap[answers.pace]}
- Ending: ${endingMap[answers.ending]}${locationContext}${watchedContext}

IMPORTANT: ${watchedMovies.length > 0 ? 'Do NOT recommend any of the movies listed as already watched. Choose a DIFFERENT movie.' : 'Recommend a movie that fits all preferences.'}

Respond in this EXACT format:
MOVIE: [Movie Title] (Year)
REASON: [2-3 sentences why this fits their preferences]
VIBE: [One sentence describing the atmosphere]
RUNTIME: [Runtime]

Make sure it's a real movie matching their preferences.`;

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        parseRecommendation(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error:', error);
      setRecommendation({
        title: 'Error',
        reason: 'Sorry, there was an error getting your recommendation.',
        vibe: '',
        runtime: ''
      });
      setStep('result');
    }
    
    setLoading(false);
  };

  const parseRecommendation = (text) => {
    const movieMatch = text.match(/MOVIE:\s*(.+)/i);
    const reasonMatch = text.match(/REASON:\s*(.+?)(?=VIBE:|$)/is);
    const vibeMatch = text.match(/VIBE:\s*(.+?)(?=RUNTIME:|$)/is);
    const runtimeMatch = text.match(/RUNTIME:\s*(.+)/i);

    setRecommendation({
      title: movieMatch ? movieMatch[1].trim() : 'Movie Recommendation',
      reason: reasonMatch ? reasonMatch[1].trim() : text,
      vibe: vibeMatch ? vibeMatch[1].trim() : '',
      runtime: runtimeMatch ? runtimeMatch[1].trim() : ''
    });
    setStep('result');
  };

  const resetApp = () => {
    setStep('intro');
    setAnswers({});
    setCurrentQuestion(0);
    setRecommendation(null);
  };

  const handleAlreadyWatched = () => {
    // Add current movie to watched list
    if (recommendation && recommendation.title !== 'Error') {
      setWatchedMovies([...watchedMovies, recommendation.title]);
      console.log('🎬 Marked as watched:', recommendation.title);
    }
    // Get a new recommendation
    getRecommendation();
  };

  if (showApiInput) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-['Space_Grotesk']">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <Film className="w-16 h-16 text-white mx-auto mb-4 animate-float" />
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">CINEMATIC</h1>
            <p className="text-gray-400 text-sm">AI-Powered Movie Recommendations</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 backdrop-blur-sm animate-slide-up">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && apiKey.trim() && validateApiKey()}
              placeholder="Enter your Gemini API key"
              className="w-full px-4 py-3 rounded-xl bg-black border border-gray-800 text-white placeholder-gray-600 mb-4 focus:outline-none focus:border-white transition-all"
            />
            
            <button
              onClick={validateApiKey}
              disabled={!apiKey.trim() || validatingApi}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">
                {validatingApi ? 'Validating...' : 'Continue'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>

            {apiError && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl animate-shake">
                <p className="text-red-400 text-sm">{apiError}</p>
              </div>
            )}

            <p className="text-gray-500 text-xs text-center mt-6">
              Get your key at{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
                aistudio.google.com
              </a>
            </p>
          </div>

          {userLocation && (
            <div className="text-center mt-4 text-gray-500 text-xs flex items-center justify-center gap-2 animate-fade-in">
              <MapPin className="w-3 h-3" />
              <span>Detected: {userLocation.city}, {userLocation.country}</span>
            </div>
          )}
        </div>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
          
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slide-up {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s ease-out;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-['Space_Grotesk']">
        <div className="max-w-2xl w-full text-center">
          <div className="animate-fade-in">
            <Film className="w-20 h-20 text-white mx-auto mb-6 animate-float" />
            <h1 className="text-6xl font-bold text-white mb-4 tracking-tighter">
              Find Your Film
            </h1>
            <p className="text-xl text-gray-400 mb-12">
              5 questions. 1 perfect movie.
            </p>
            <button
              onClick={() => setStep('questions')}
              className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all inline-flex items-center gap-3 group animate-slide-up"
            >
              <span>Start</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        `}</style>
      </div>
    );
  }

  if (step === 'questions') {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentAnswer = answers[questions[currentQuestion].id];

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-['Space_Grotesk']">
        <div className="max-w-4xl w-full">
          <div className="mb-12 animate-fade-in">
            <div className="flex justify-between text-gray-500 text-sm mb-3">
              <span>{currentQuestion + 1} / {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden">
              <div 
                className="bg-white h-1 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center animate-slide-up tracking-tight">
            {questions[currentQuestion].question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`group relative p-6 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden animate-slide-up ${
                  currentAnswer === option.value
                    ? 'bg-white border-white scale-105'
                    : 'bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:border-gray-600 hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{option.emoji}</div>
                  <div className={`text-xl font-semibold mb-1 transition-colors ${
                    currentAnswer === option.value ? 'text-black' : 'text-white'
                  }`}>
                    {option.label}
                  </div>
                  <div className={`text-sm transition-colors ${
                    currentAnswer === option.value ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {option.description}
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}
          </div>

          {currentQuestion > 0 && (
            <div className="text-center">
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span>Back</span>
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        `}</style>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-['Space_Grotesk']">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-spin-slow" />
          <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">
            Analyzing...
          </h2>
          <p className="text-gray-500">Finding your perfect match</p>
        </div>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (step === 'result' && recommendation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-['Space_Grotesk']">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <Film className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              Your Perfect Movie
            </h2>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-12 mb-6 animate-slide-up">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center tracking-tight leading-tight">
              {recommendation.title}
            </h3>
            
            {recommendation.runtime && (
              <p className="text-gray-500 text-center mb-6">
                {recommendation.runtime}
              </p>
            )}

            {recommendation.vibe && (
              <div className="mb-8 p-6 bg-black/50 rounded-2xl border border-gray-800">
                <p className="text-gray-300 italic text-center text-lg">
                  "{recommendation.vibe}"
                </p>
              </div>
            )}

            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">
                Why This Film?
              </h4>
              <p className="text-gray-300 leading-relaxed text-lg">
                {recommendation.reason}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleAlreadyWatched}
              disabled={loading}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 text-white font-semibold py-4 rounded-2xl hover:border-gray-600 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span>Already Watched</span>
            </button>

            <button
              onClick={resetApp}
              className="bg-white text-black font-semibold py-4 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 group"
            >
              <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Start Over</span>
            </button>
          </div>

          {watchedMovies.length > 0 && (
            <div className="mt-6 text-center text-gray-500 text-xs animate-fade-in">
              <p>Excluded {watchedMovies.length} movie{watchedMovies.length > 1 ? 's' : ''} you've already watched</p>
            </div>
          )}
        </div>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
          
          @keyframes scale-in {
            from { 
              transform: scale(0);
              opacity: 0;
            }
            to { 
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .animate-scale-in {
            animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        `}</style>
      </div>
    );
  }

  return null;
}

export default App;