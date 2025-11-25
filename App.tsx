import React, { useState, useEffect, useCallback, useRef } from 'react';
import InteractiveMap from './components/InteractiveMap';
import ControlPanel from './components/ControlPanel';
import TriviaCard from './components/TriviaCard';
import AuthScreen from './components/AuthScreen';
import SettingsModal from './components/SettingsModal';
import { Coordinates, POI, User, Persona, GroundingSource } from './types';
import { DALLAS_COORDS } from './constants';
import { getNearbyPois, interpolateRoute } from './services/locationService';
import { generateTrivia } from './services/geminiService';
import { getCurrentUser, logout as authLogout, updateUserPreferences } from './services/authService';
import { LogOut, Map as MapIcon } from 'lucide-react';

const SIMULATION_SPEED = 0.005; // Progress increment per tick

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App Data State
  const [currentLocation, setCurrentLocation] = useState<Coordinates>(DALLAS_COORDS);
  const [nearbyPois, setNearbyPois] = useState<POI[]>([]);
  
  // UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDjMode, setIsDjMode] = useState(false);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0); // 0.0 to 1.0
  const progressRef = useRef(0);
  
  // Trivia State
  const [trivia, setTrivia] = useState<string | null>(null);
  const [triviaSources, setTriviaSources] = useState<GroundingSource[]>([]);
  const [loadingTrivia, setLoadingTrivia] = useState(false);
  const lastTriviaLocation = useRef<Coordinates | null>(null);

  // Speech Synthesis Ref
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Auth
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setAuthLoading(false);
  }, []);

  // Simulation Loop
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      if (isSimulating) {
        progressRef.current += SIMULATION_SPEED;
        if (progressRef.current >= 1) {
          progressRef.current = 1;
          setIsSimulating(false);
        }
        
        const newLocation = interpolateRoute(progressRef.current);
        setCurrentLocation(newLocation);
        setProgress(progressRef.current);
        
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isSimulating) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isSimulating]);

  // Fetch Nearby POIs & Trigger Trivia
  useEffect(() => {
    const fetchData = async () => {
      const pois = await getNearbyPois(currentLocation);
      setNearbyPois(pois);

      // Trigger trivia if we have moved significantly from the last trivia spot
      const dist = lastTriviaLocation.current 
        ? Math.sqrt(Math.pow(currentLocation.lat - lastTriviaLocation.current.lat, 2) + Math.pow(currentLocation.lng - lastTriviaLocation.current.lng, 2))
        : 100;

      // Threshold: approx 0.15 degrees (~10 miles) or if it's the first time
      if (dist > 0.15 && !loadingTrivia && user) {
        lastTriviaLocation.current = currentLocation;
        setLoadingTrivia(true);
        
        // Call Gemini with current location and selected persona
        const result = await generateTrivia(currentLocation, user.preferences.persona);
        
        setTrivia(result.text);
        setTriviaSources(result.sources);
        setLoadingTrivia(false);
      }
    };

    const timer = setTimeout(fetchData, 500); // Debounce
    return () => clearTimeout(timer);
  }, [currentLocation, user]); 

  // Handle DJ Mode (TTS)
  useEffect(() => {
    if (trivia && isDjMode) {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(trivia);
      // Optional: Set voice based on persona if available
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
  }, [trivia, isDjMode]);

  const handleTeleport = (coords: Coordinates) => {
    // Teleporting allows testing Maps Grounding anywhere in the world
    setIsSimulating(false);
    setCurrentLocation(coords);
    lastTriviaLocation.current = null; // Reset to force new trivia generation for new location
  };

  const handleUpdatePersona = async (persona: Persona) => {
    if (user) {
      const updatedUser = await updateUserPreferences(user, persona);
      setUser(updatedUser);
      lastTriviaLocation.current = null; // Trigger new trivia with new persona style
    }
    setIsSettingsOpen(false);
  };

  const handleLogout = async () => {
    await authLogout();
    setUser(null);
    window.speechSynthesis.cancel();
  };

  if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-blue-600 font-bold">Loading JourneyMate...</div>;

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-gray-100">
      
      {/* Top Bar: Location & Logout */}
      <div className="absolute top-4 right-4 z-[500] flex gap-2">
         <div className="hidden md:flex bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-gray-500 items-center gap-2 border border-gray-200">
            <MapIcon className="w-3 h-3" />
            <span>{currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</span>
         </div>
         <button 
           onClick={handleLogout}
           className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors border border-gray-200"
           title="Logout"
         >
           <LogOut className="w-4 h-4" />
         </button>
      </div>

      {/* Main Map Layer */}
      <div className="flex-1 relative">
        <InteractiveMap 
          currentLocation={currentLocation} 
          pois={nearbyPois}
          onTeleport={handleTeleport}
        />
        
        {/* Floating Trivia Card */}
        <TriviaCard 
          fact={trivia} 
          sources={triviaSources}
          loading={loadingTrivia} 
          onClose={() => setTrivia(null)} 
        />
      </div>

      {/* Bottom Control Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000]">
        <ControlPanel 
          nearbyPois={nearbyPois}
          isSimulating={isSimulating}
          onToggleSimulation={() => setIsSimulating(!isSimulating)}
          tripProgress={progress}
          user={user}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isDjMode={isDjMode}
          onToggleDjMode={() => setIsDjMode(!isDjMode)}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        currentPersona={user.preferences.persona}
        onSelectPersona={handleUpdatePersona}
      />
    </div>
  );
};

export default App;