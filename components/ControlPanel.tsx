import React from 'react';
import { MapPin, Navigation, Settings, Volume2, VolumeX } from 'lucide-react';
import { POI, User } from '../types';

interface ControlPanelProps {
  nearbyPois: POI[];
  isSimulating: boolean;
  onToggleSimulation: () => void;
  tripProgress: number;
  user: User | null;
  onOpenSettings: () => void;
  isDjMode: boolean;
  onToggleDjMode: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  nearbyPois, 
  isSimulating, 
  onToggleSimulation,
  tripProgress,
  user,
  onOpenSettings,
  isDjMode,
  onToggleDjMode
}) => {
  const percent = Math.round(tripProgress * 100);
  const remaining = 100 - percent;

  return (
    <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-6 pb-8 transition-transform">
      {/* Handle bar */}
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

      {/* Header & Controls */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
             {user ? `Hi, ${user.name.split(' ')[0]}` : 'Trip to Austin'}
          </h2>
          <p className="text-gray-500 text-sm">
            Via I-35 S • {remaining}% remaining
          </p>
        </div>
        
        <div className="flex gap-2">
           {/* DJ Mode Toggle */}
           <button 
            onClick={onToggleDjMode}
            className={`p-3 rounded-full transition-colors shadow-sm border ${
              isDjMode 
                ? 'bg-indigo-100 text-indigo-600 border-indigo-200' 
                : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
            }`}
            title={isDjMode ? "DJ Mode Active (Auto-speak)" : "Enable DJ Mode"}
          >
            {isDjMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Settings Toggle */}
          <button 
            onClick={onOpenSettings}
            className="p-3 bg-white text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Drive Toggle */}
          <button 
            onClick={onToggleSimulation}
            className={`px-4 py-2 rounded-full font-semibold transition-colors shadow-md ${
              isSimulating 
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                : 'bg-blue-600 text-white hover:bg-blue-700 border border-transparent'
            }`}
          >
            {isSimulating ? 'Pause' : 'Drive'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
          style={{ width: `${Math.max(5, percent)}%` }}
        ></div>
      </div>

      {/* Nearby Smart Stops */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nearby Smart Stops</h3>
        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{nearbyPois.length} found</span>
      </div>
      
      <div className="space-y-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
        {nearbyPois.length > 0 ? (
          nearbyPois.map(poi => (
            <div key={poi.id} className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors group">
              <div className="p-2 bg-white rounded-lg shadow-sm mr-3 text-blue-500 group-hover:text-blue-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate">{poi.name}</h4>
                <p className="text-xs text-gray-500 truncate">{poi.type} • {poi.description}</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Navigation className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No stops nearby. Enjoy the drive!
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;