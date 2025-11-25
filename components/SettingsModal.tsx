import React from 'react';
import { X, Map, BookOpen, Smile, Utensils } from 'lucide-react';
import { Persona } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPersona: Persona;
  onSelectPersona: (p: Persona) => void;
}

const PERSONA_CONFIG = [
  {
    id: Persona.LOCAL,
    label: 'The Local',
    description: 'Hidden gems & local culture',
    icon: Map,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    id: Persona.HISTORIAN,
    label: 'The Historian',
    description: 'Dates, events & legends',
    icon: BookOpen,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    id: Persona.COMEDIAN,
    label: 'The Comedian',
    description: 'Fun facts with a twist',
    icon: Smile,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  },
  {
    id: Persona.FOODIE,
    label: 'The Foodie',
    description: 'Eats, treats & culinary history',
    icon: Utensils,
    color: 'text-red-500',
    bg: 'bg-red-50'
  }
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentPersona, onSelectPersona }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-black text-gray-800">Travel Companion</h2>
            <p className="text-sm text-gray-500">Choose your AI guide's personality</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 space-y-3">
          {PERSONA_CONFIG.map((config) => {
            const isSelected = currentPersona === config.id;
            const Icon = config.icon;
            return (
              <button
                key={config.id}
                onClick={() => onSelectPersona(config.id)}
                className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-transparent bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`p-3 rounded-lg ${config.bg} ${config.color} mr-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <h3 className={`font-bold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                    {config.label}
                  </h3>
                  <p className="text-xs text-gray-500">{config.description}</p>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm ring-2 ring-blue-100"></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-gray-50 text-center">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-transform active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;