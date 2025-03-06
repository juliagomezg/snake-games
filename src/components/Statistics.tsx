import React, { memo } from 'react';
import { GameStats } from '../hooks/useStats';

interface StatisticsProps {
  stats: GameStats;
  averageScore: number;
  averageTime: number;
  onReset: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ 
  stats, 
  averageScore, 
  averageTime, 
  onReset 
}) => {
  // Función para formatear el tiempo (segundos a minutos:segundos)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Estadísticas de Juego</h2>
        <button 
          onClick={onReset}
          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Resetear
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Partidas jugadas</div>
          <div className="text-2xl font-bold text-gray-800">{stats.gamesPlayed}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Puntuación más alta</div>
          <div className="text-2xl font-bold text-snake-head">{stats.highestScore}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Puntuación media</div>
          <div className="text-2xl font-bold text-gray-800">{averageScore}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Tiempo medio</div>
          <div className="text-2xl font-bold text-gray-800">{formatTime(averageTime)}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Detalles</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Manzanas comidas</span>
            <span className="font-medium text-gray-800">{stats.applesEaten}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tiempo total de juego</span>
            <span className="font-medium text-gray-800">{formatTime(stats.totalTime)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Puntuación total</span>
            <span className="font-medium text-gray-800">{stats.totalScore}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Causas de muerte</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-red-500">Colisión con pared</div>
            <div className="text-xl font-bold text-red-600">{stats.deaths.wall}</div>
            <div className="text-xs text-red-400 mt-1">
              {stats.gamesPlayed > 0 
                ? `${Math.round((stats.deaths.wall / stats.gamesPlayed) * 100)}% de las muertes` 
                : '0% de las muertes'}
            </div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-red-500">Colisión con serpiente</div>
            <div className="text-xl font-bold text-red-600">{stats.deaths.collision}</div>
            <div className="text-xs text-red-400 mt-1">
              {stats.gamesPlayed > 0 
                ? `${Math.round((stats.deaths.collision / stats.gamesPlayed) * 100)}% de las muertes` 
                : '0% de las muertes'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Statistics); 