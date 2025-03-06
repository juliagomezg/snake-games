import React, { memo, useEffect, useState } from 'react';

interface GameOverProps {
  score: number;
  gameTime: number;
  onRestart: () => void;
  isHighScore?: boolean;
  highScoreRank?: number;
}

const GameOver: React.FC<GameOverProps> = ({ 
  score, 
  gameTime, 
  onRestart,
  isHighScore = false,
  highScoreRank = -1
}) => {
  // Formatear el tiempo en formato mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Activar la animación después de un breve retraso
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-xs transform transition-all animate-fadeIn">
        <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-red-500 mb-6">¡Juego Terminado!</h2>
        
        {isHighScore && (
          <div className={`mb-6 transform transition-all duration-500 ${showAnimation ? 'scale-110' : 'scale-0'}`}>
            <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-400">
              <p className="text-yellow-800 font-bold">
                {highScoreRank === 0 
                  ? '¡Nueva puntuación más alta!' 
                  : `¡Top ${highScoreRank + 1} puntuación!`}
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-sm mb-1">Puntuación</p>
            <p className="text-2xl font-bold text-snake-head">{score}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-sm mb-1">Tiempo</p>
            <p className="text-2xl font-bold text-gray-800">{formatTime(gameTime)}</p>
          </div>
        </div>
        
        <div className="tooltip w-full">
          <button 
            className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            onClick={onRestart}
          >
            Jugar de nuevo
          </button>
          <span className="tooltip-text">Reiniciar el juego y comenzar una nueva partida</span>
        </div>
      </div>
    </div>
  );
};

// Memoizar el componente para evitar re-renders innecesarios
export default memo(GameOver); 