import { useState, useEffect } from 'react';

export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  highestScore: number;
  totalTime: number; // en segundos
  applesEaten: number;
  deaths: {
    collision: number; // Muertes por colisión con la serpiente
    wall: number;      // Muertes por colisión con la pared
  };
}

const STORAGE_KEY = 'snake-game-stats';

const initialStats: GameStats = {
  gamesPlayed: 0,
  totalScore: 0,
  highestScore: 0,
  totalTime: 0,
  applesEaten: 0,
  deaths: {
    collision: 0,
    wall: 0
  }
};

export const useStats = () => {
  const [stats, setStats] = useState<GameStats>(initialStats);
  
  // Cargar estadísticas guardadas
  useEffect(() => {
    const savedStats = localStorage.getItem(STORAGE_KEY);
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setStats(parsedStats);
      } catch (error) {
        console.error('Error parsing game stats:', error);
        setStats(initialStats);
      }
    }
  }, []);
  
  // Guardar estadísticas
  const saveStats = (newStats: Partial<GameStats>) => {
    const updatedStats = {
      ...stats,
      ...newStats,
      deaths: {
        ...stats.deaths,
        ...(newStats.deaths || {})
      }
    };
    
    setStats(updatedStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats));
  };
  
  // Registrar una partida jugada
  const recordGame = (score: number, time: number, deathType: 'collision' | 'wall' = 'wall') => {
    const updatedStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      totalScore: stats.totalScore + score,
      highestScore: Math.max(stats.highestScore, score),
      totalTime: stats.totalTime + time,
      applesEaten: stats.applesEaten + score, // Cada punto es una manzana
      deaths: {
        ...stats.deaths,
        [deathType]: stats.deaths[deathType] + 1
      }
    };
    
    saveStats(updatedStats);
    return updatedStats;
  };
  
  // Calcular estadísticas derivadas
  const getAverageScore = () => {
    return stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0;
  };
  
  const getAverageTime = () => {
    return stats.gamesPlayed > 0 ? Math.round(stats.totalTime / stats.gamesPlayed) : 0;
  };
  
  // Resetear estadísticas
  const resetStats = () => {
    setStats(initialStats);
    localStorage.removeItem(STORAGE_KEY);
  };
  
  return {
    stats,
    recordGame,
    getAverageScore,
    getAverageTime,
    resetStats
  };
}; 