import React, { memo } from 'react';

interface LevelSystemProps {
  score: number;
  highestScore: number;
}

const LevelSystem: React.FC<LevelSystemProps> = ({ score, highestScore }) => {
  // Definir los niveles y sus requisitos
  const levels = [
    { level: 1, name: "Principiante", requiredScore: 0, color: "bg-green-500" },
    { level: 2, name: "Aprendiz", requiredScore: 5, color: "bg-blue-500" },
    { level: 3, name: "Intermedio", requiredScore: 15, color: "bg-yellow-500" },
    { level: 4, name: "Avanzado", requiredScore: 30, color: "bg-orange-500" },
    { level: 5, name: "Experto", requiredScore: 50, color: "bg-red-500" },
    { level: 6, name: "Maestro", requiredScore: 75, color: "bg-purple-500" },
    { level: 7, name: "Leyenda", requiredScore: 100, color: "bg-indigo-500" }
  ];
  
  // Determinar el nivel actual basado en la puntuación más alta
  const currentLevel = levels.reduce((highest, level) => {
    return highestScore >= level.requiredScore ? level : highest;
  }, levels[0]);
  
  // Encontrar el siguiente nivel
  const nextLevelIndex = levels.findIndex(level => level.level === currentLevel.level) + 1;
  const nextLevel = nextLevelIndex < levels.length ? levels[nextLevelIndex] : null;
  
  // Calcular el progreso hacia el siguiente nivel
  const calculateProgress = () => {
    if (!nextLevel) return 100; // Ya alcanzó el nivel máximo
    
    const currentLevelScore = currentLevel.requiredScore;
    const nextLevelScore = nextLevel.requiredScore;
    const scoreRange = nextLevelScore - currentLevelScore;
    const playerProgress = highestScore - currentLevelScore;
    
    return Math.min(100, Math.floor((playerProgress / scoreRange) * 100));
  };
  
  const progress = calculateProgress();
  
  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Nivel de Jugador</h2>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full ${currentLevel.color} flex items-center justify-center text-white font-bold text-lg`}>
            {currentLevel.level}
          </div>
          <div className="ml-3">
            <div className="font-bold text-gray-800">{currentLevel.name}</div>
            <div className="text-xs text-gray-500">Puntuación requerida: {currentLevel.requiredScore}</div>
          </div>
        </div>
        
        {nextLevel && (
          <div className="text-right">
            <div className="text-sm text-gray-600">Siguiente nivel:</div>
            <div className="font-semibold text-gray-800">{nextLevel.name} ({nextLevel.requiredScore})</div>
          </div>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${currentLevel.color}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-right">
        {nextLevel 
          ? `${highestScore}/${nextLevel.requiredScore} puntos (${progress}%)`
          : "¡Nivel máximo alcanzado!"}
      </div>
    </div>
  );
};

export default memo(LevelSystem); 