import React, { memo } from 'react';
import { DifficultyLevel, DIFFICULTY_CONFIGS } from '../types/game';

interface DifficultySelectorProps {
  currentDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  currentDifficulty, 
  onDifficultyChange 
}) => {
  const difficultyInfo = {
    EASY: {
      label: 'Fácil',
      description: 'Velocidad lenta, tablero pequeño',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      tooltip: 'Ideal para principiantes: velocidad lenta y tablero pequeño'
    },
    MEDIUM: {
      label: 'Medio',
      description: 'Velocidad media, tablero mediano',
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      tooltip: 'Desafío equilibrado: velocidad media y tablero mediano'
    },
    HARD: {
      label: 'Difícil',
      description: 'Velocidad rápida, tablero grande',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      tooltip: 'Para expertos: velocidad rápida y tablero grande'
    }
  };
  
  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Nivel de Dificultad</h2>
      
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(difficultyInfo).map(([level, info]) => (
          <button
            key={level}
            className={`p-3 rounded-lg text-white transition-all transform ${
              currentDifficulty === level ? 
                `${info.color} scale-105 shadow-md` : 
                `bg-gray-300 hover:scale-105 ${info.hoverColor}`
            }`}
            onClick={() => onDifficultyChange(level as DifficultyLevel)}
            title={info.tooltip}
          >
            <div className="font-bold text-lg">{info.label}</div>
            <div className="text-xs mt-1 opacity-90">{info.description}</div>
            
            <div className="mt-2 text-xs">
              <div className="flex justify-between">
                <span>Velocidad:</span>
                <span>{DIFFICULTY_CONFIGS[level as DifficultyLevel].initialSpeed}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Tablero:</span>
                <span>{DIFFICULTY_CONFIGS[level as DifficultyLevel].gridSize}x{DIFFICULTY_CONFIGS[level as DifficultyLevel].gridSize}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(DifficultySelector); 