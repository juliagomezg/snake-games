import { useState, useEffect } from 'react';

export interface HighScore {
  score: number;
  time: number;
  date: string;
}

const STORAGE_KEY = 'snake-game-high-scores';
const HIGHEST_SCORE_KEY = 'snake-game-highest-score';
const MAX_SCORES = 10;

export const useHighScores = () => {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [highestScore, setHighestScore] = useState<number>(0);

  // Cargar puntuaciones al iniciar
  useEffect(() => {
    const savedScores = localStorage.getItem(STORAGE_KEY);
    if (savedScores) {
      try {
        const parsedScores = JSON.parse(savedScores);
        setHighScores(parsedScores);
      } catch (error) {
        console.error('Error parsing high scores:', error);
        setHighScores([]);
      }
    }
    
    // Cargar la puntuación más alta
    const savedHighestScore = localStorage.getItem(HIGHEST_SCORE_KEY);
    if (savedHighestScore) {
      try {
        const parsedHighestScore = JSON.parse(savedHighestScore);
        setHighestScore(parsedHighestScore);
      } catch (error) {
        console.error('Error parsing highest score:', error);
        setHighestScore(0);
      }
    }
  }, []);

  // Guardar una nueva puntuación
  const saveScore = (score: number, time: number) => {
    const newScore: HighScore = {
      score,
      time,
      date: new Date().toLocaleDateString()
    };

    const updatedScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score || a.time - b.time) // Ordenar por puntuación (mayor) y luego por tiempo (menor)
      .slice(0, MAX_SCORES); // Mantener solo las mejores puntuaciones

    setHighScores(updatedScores);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
    
    // Actualizar la puntuación más alta si es necesario
    if (score > highestScore) {
      setHighestScore(score);
      localStorage.setItem(HIGHEST_SCORE_KEY, JSON.stringify(score));
    }
    
    // Devolver la posición de la nueva puntuación (0-indexed)
    return updatedScores.findIndex(s => s.score === score && s.time === time);
  };

  // Verificar si una puntuación califica para el ranking
  const isHighScore = (score: number): boolean => {
    if (highScores.length < MAX_SCORES) return true;
    return score > (highScores[highScores.length - 1]?.score || 0);
  };

  // Limpiar todas las puntuaciones
  const clearHighScores = () => {
    setHighScores([]);
    localStorage.removeItem(STORAGE_KEY);
    setHighestScore(0);
    localStorage.removeItem(HIGHEST_SCORE_KEY);
  };

  return {
    highScores,
    highestScore,
    saveScore,
    isHighScore,
    clearHighScores
  };
}; 