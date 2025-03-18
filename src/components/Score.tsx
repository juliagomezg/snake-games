import React, { memo, useEffect, useState } from 'react';

interface ScoreProps {
  score: number;
  gameTime: number;
}

/**
 * Componente para mostrar la puntuación y el tiempo de juego
 * Implementa un sistema anti-parpadeo al actualizar el tiempo
 */
const Score: React.FC<ScoreProps> = ({ score, gameTime }) => {
  // Estado local para animación suave del tiempo
  const [displayTime, setDisplayTime] = useState(gameTime);
  
  // Actualizar el tiempo mostrado con animación suave
  useEffect(() => {
    setDisplayTime(gameTime);
  }, [gameTime]);
  
  // Formatear el tiempo en formato mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-full bg-white rounded-lg p-3 sm:p-4 shadow-md border border-gray-100 mb-3 sm:mb-4">
      <div className="flex justify-between">
        <div className="w-5/12 bg-gradient-to-b from-gray-50 to-gray-100 p-2 sm:p-3 rounded-lg text-center">
          <div className="text-xs sm:text-sm text-gray-500 mb-1">Puntuación</div>
          <div className="text-xl sm:text-3xl font-bold text-snake-head transition-all duration-300">{score}</div>
        </div>
        
        <div className="w-5/12 bg-gradient-to-b from-gray-50 to-gray-100 p-2 sm:p-3 rounded-lg text-center">
          <div className="text-xs sm:text-sm text-gray-500 mb-1">Tiempo</div>
          <div className="text-xl sm:text-3xl font-bold text-gray-800 transition-all duration-300">{formatTime(displayTime)}</div>
        </div>
      </div>
    </div>
  );
};

// Memoizar el componente para evitar re-renders innecesarios
export default memo(Score); 