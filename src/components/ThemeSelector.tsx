import React, { memo } from 'react';

export type ThemeOption = 'default' | 'dark' | 'neon' | 'retro' | 'pastel';

interface ThemeSelectorProps {
  currentTheme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const themes = [
    {
      id: 'default',
      name: 'Clásico',
      description: 'Tema predeterminado',
      colors: ['bg-green-500', 'bg-teal-600', 'bg-red-500'],
      tooltip: 'El tema original del juego con colores verdes y rojos'
    },
    {
      id: 'dark',
      name: 'Oscuro',
      description: 'Modo nocturno',
      colors: ['bg-blue-600', 'bg-indigo-700', 'bg-purple-500'],
      tooltip: 'Tema oscuro con tonos azules y morados, ideal para jugar de noche'
    },
    {
      id: 'neon',
      name: 'Neón',
      description: 'Colores brillantes',
      colors: ['bg-pink-500', 'bg-purple-600', 'bg-yellow-400'],
      tooltip: 'Colores vibrantes y llamativos estilo neón'
    },
    {
      id: 'retro',
      name: 'Retro',
      description: 'Estilo de 8-bits',
      colors: ['bg-yellow-600', 'bg-orange-700', 'bg-red-600'],
      tooltip: 'Inspirado en los juegos clásicos con tonos cálidos'
    },
    {
      id: 'pastel',
      name: 'Pastel',
      description: 'Colores suaves',
      colors: ['bg-pink-300', 'bg-purple-300', 'bg-blue-300'],
      tooltip: 'Colores suaves y relajantes en tonos pastel'
    }
  ];
  
  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Tema del Juego</h2>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {themes.map(theme => (
          <button
            key={theme.id}
            className={`p-3 rounded-lg text-white transition-all transform ${
              currentTheme === theme.id ? 
                'scale-105 shadow-md border-2 border-gray-300' : 
                'hover:scale-105 border border-gray-200'
            }`}
            style={{ 
              background: currentTheme === theme.id 
                ? `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` 
                : 'white' 
            }}
            onClick={() => onThemeChange(theme.id as ThemeOption)}
            title={theme.tooltip}
          >
            <div className="flex flex-col items-center">
              <div className="flex space-x-1 mb-2">
                {theme.colors.map((color, index) => (
                  <div 
                    key={index} 
                    className={`w-4 h-4 rounded-full ${color}`}
                  />
                ))}
              </div>
              <div className={`font-bold text-sm ${currentTheme === theme.id ? 'text-white' : 'text-gray-800'}`}>
                {theme.name}
              </div>
              <div className={`text-xs mt-1 ${currentTheme === theme.id ? 'text-white opacity-90' : 'text-gray-600'}`}>
                {theme.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(ThemeSelector); 