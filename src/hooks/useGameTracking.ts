import { useState, useEffect, useRef } from 'react';
import { Position, DifficultyLevel, DIFFICULTY_CONFIGS } from '../types/game';
import { GameSessionData, apiService } from '../services/apiService';
import { CollisionType } from './useSnakeLogic';

interface UseGameTrackingProps {
  snake: Position[];
  apple: Position;
  score: number;
  gameTime: number;
  difficulty: DifficultyLevel;
  isGameOver: boolean;
  isPaused: boolean;
  collisionType: CollisionType;
}

export const useGameTracking = ({
  snake,
  apple,
  score,
  gameTime,
  difficulty,
  isGameOver,
  isPaused,
  collisionType
}: UseGameTrackingProps) => {
  // Referencia para almacenar el historial de movimientos
  const movementHistory = useRef<Position[]>([]);
  
  // Contador de power-ups recogidos
  const [powerUpsCollected, setPowerUpsCollected] = useState(0);
  
  // Estado para almacenar el ID de la sesión de juego
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Estado para almacenar los insights de la IA
  const [aiInsights, setAiInsights] = useState<any>(null);
  
  // Estado para indicar si se están cargando los insights
  const [loadingInsights, setLoadingInsights] = useState(false);
  
  // Estado para almacenar errores
  const [error, setError] = useState<string | null>(null);
  
  // Rastrear movimientos de la serpiente
  useEffect(() => {
    if (!isPaused && !isGameOver && snake.length > 0) {
      // Guardar la posición de la cabeza en el historial
      movementHistory.current.push({ ...snake[0] });
      
      // Limitar el historial a los últimos 1000 movimientos para evitar problemas de memoria
      if (movementHistory.current.length > 1000) {
        movementHistory.current = movementHistory.current.slice(-1000);
      }
    }
  }, [snake, isPaused, isGameOver]);
  
  // Detectar recolección de power-ups (simplificado, en una implementación real
  // esto se conectaría con la lógica real de power-ups)
  useEffect(() => {
    // Simulación: incrementar contador cuando el score es múltiplo de 5
    if (score > 0 && score % 5 === 0) {
      setPowerUpsCollected(prev => prev + 1);
    }
  }, [score]);
  
  // Enviar datos al backend cuando termina el juego
  useEffect(() => {
    const sendGameData = async () => {
      if (isGameOver && score > 0) {
        try {
          const gameData: GameSessionData = {
            timestamp: Date.now(),
            score,
            gameTime,
            difficulty,
            snakeLength: snake.length,
            movementPattern: movementHistory.current,
            collisionType,
            powerUpsCollected,
            boardSize: DIFFICULTY_CONFIGS[difficulty].gridSize
          };
          
          const result = await apiService.sendGameData(gameData);
          
          if (result.success && result.sessionId) {
            setSessionId(result.sessionId);
            // Solicitar insights después de enviar los datos
            fetchAIInsights(result.sessionId);
          } else {
            setError(result.error || 'Error al enviar datos de juego');
          }
        } catch (err) {
          setError('Error inesperado al enviar datos de juego');
          console.error('Error al enviar datos de juego:', err);
        }
      }
    };
    
    sendGameData();
  }, [isGameOver, score, gameTime, difficulty, snake.length, collisionType, powerUpsCollected]);
  
  // Función para obtener insights de la IA
  const fetchAIInsights = async (id: string) => {
    setLoadingInsights(true);
    try {
      const result = await apiService.getAIInsights(id);
      
      if (result.success && result.insights) {
        setAiInsights(result.insights);
      } else {
        setError(result.error || 'Error al obtener insights de IA');
      }
    } catch (err) {
      setError('Error inesperado al obtener insights de IA');
      console.error('Error al obtener insights de IA:', err);
    } finally {
      setLoadingInsights(false);
    }
  };
  
  // Función para obtener recomendaciones personalizadas
  const getPersonalizedRecommendations = async () => {
    setLoadingInsights(true);
    try {
      const result = await apiService.getPersonalizedRecommendations();
      
      if (result.success && result.recommendations) {
        return result.recommendations;
      } else {
        setError(result.error || 'Error al obtener recomendaciones personalizadas');
        return null;
      }
    } catch (err) {
      setError('Error inesperado al obtener recomendaciones personalizadas');
      console.error('Error al obtener recomendaciones personalizadas:', err);
      return null;
    } finally {
      setLoadingInsights(false);
    }
  };
  
  return {
    sessionId,
    aiInsights,
    loadingInsights,
    error,
    getPersonalizedRecommendations
  };
}; 