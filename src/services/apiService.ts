import { GameStats } from '../hooks/useStats';
import { Position, DifficultyLevel } from '../types/game';

// URL base del backend (cambiar por la URL real cuando esté disponible)
const API_BASE_URL = 'https://api.snake-game-analytics.com';

// Interfaz para los datos de una partida
export interface GameSessionData {
  id?: string;
  userId?: string;
  timestamp: number;
  score: number;
  gameTime: number;
  difficulty: DifficultyLevel;
  snakeLength: number;
  movementPattern: Position[];
  collisionType: 'wall' | 'collision' | null;
  powerUpsCollected: number;
  boardSize: number;
}

// Interfaz para los insights generados por la IA
export interface AIInsights {
  id?: string;
  gameSessionId?: string;
  timestamp: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  heatmap?: {
    positions: {
      x: number;
      y: number;
      frequency: number;
    }[];
  };
  patterns?: {
    name: string;
    description: string;
    frequency: number;
  }[];
  comparisonToAverage?: {
    score: number; // Porcentaje por encima/debajo del promedio
    time: number;  // Porcentaje por encima/debajo del promedio
    efficiency: number; // Puntos por segundo comparado con el promedio
  };
}

// Clase para manejar las llamadas a la API
class ApiService {
  // Enviar datos de una partida al backend
  async sendGameData(gameData: GameSessionData): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      // En un entorno de desarrollo, simular una respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        console.log('Enviando datos de juego al backend (simulado):', gameData);
        return {
          success: true,
          sessionId: `session_${Date.now()}`
        };
      }
      
      // En producción, enviar los datos reales al backend
      const response = await fetch(`${API_BASE_URL}/game-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar datos de juego');
      }
      
      return {
        success: true,
        sessionId: data.id
      };
    } catch (error) {
      console.error('Error al enviar datos de juego:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
  
  // Obtener insights generados por la IA
  async getAIInsights(sessionId: string): Promise<{ success: boolean; insights?: AIInsights; error?: string }> {
    try {
      // En un entorno de desarrollo, simular insights de IA
      if (process.env.NODE_ENV === 'development') {
        console.log('Obteniendo insights de IA (simulados) para la sesión:', sessionId);
        
        // Simular un retraso para imitar el procesamiento de la IA
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generar insights simulados
        const mockInsights: AIInsights = {
          timestamp: Date.now(),
          skillLevel: Math.random() > 0.7 ? 'advanced' : Math.random() > 0.4 ? 'intermediate' : 'beginner',
          strengths: [
            'Buena velocidad de reacción',
            'Eficiente recolección de manzanas',
            'Buen uso del espacio del tablero'
          ],
          weaknesses: [
            'Tendencia a quedar atrapado en esquinas',
            'Dificultad para planificar movimientos a largo plazo'
          ],
          recommendations: [
            'Intenta mantener la serpiente en movimiento circular',
            'Practica en dificultad media para mejorar la velocidad de reacción',
            'Enfócate en planificar 3-4 movimientos por adelantado'
          ],
          heatmap: {
            positions: [
              { x: 5, y: 5, frequency: 0.8 },
              { x: 10, y: 10, frequency: 0.6 },
              { x: 15, y: 15, frequency: 0.4 }
            ]
          },
          patterns: [
            { name: 'Espiral', description: 'Movimiento en espiral desde el centro', frequency: 0.6 },
            { name: 'Zigzag', description: 'Movimiento en zigzag horizontal', frequency: 0.3 }
          ],
          comparisonToAverage: {
            score: Math.random() * 50 - 25, // Entre -25% y +25%
            time: Math.random() * 40 - 20,  // Entre -20% y +20%
            efficiency: Math.random() * 60 - 30 // Entre -30% y +30%
          }
        };
        
        return {
          success: true,
          insights: mockInsights
        };
      }
      
      // En producción, obtener los insights reales del backend
      const response = await fetch(`${API_BASE_URL}/ai-insights/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener insights de IA');
      }
      
      return {
        success: true,
        insights: data
      };
    } catch (error) {
      console.error('Error al obtener insights de IA:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
  
  // Enviar estadísticas acumuladas para análisis
  async sendStatsForAnalysis(stats: GameStats): Promise<{ success: boolean; analysisId?: string; error?: string }> {
    try {
      // En un entorno de desarrollo, simular una respuesta exitosa
      if (process.env.NODE_ENV === 'development') {
        console.log('Enviando estadísticas para análisis (simulado):', stats);
        return {
          success: true,
          analysisId: `analysis_${Date.now()}`
        };
      }
      
      // En producción, enviar las estadísticas reales al backend
      const response = await fetch(`${API_BASE_URL}/stats-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar estadísticas para análisis');
      }
      
      return {
        success: true,
        analysisId: data.id
      };
    } catch (error) {
      console.error('Error al enviar estadísticas para análisis:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
  
  // Obtener recomendaciones personalizadas basadas en el historial de juego
  async getPersonalizedRecommendations(): Promise<{ 
    success: boolean; 
    recommendations?: { 
      difficulty?: DifficultyLevel; 
      practiceAreas: string[]; 
      suggestedTechniques: string[] 
    }; 
    error?: string 
  }> {
    try {
      // En un entorno de desarrollo, simular recomendaciones
      if (process.env.NODE_ENV === 'development') {
        console.log('Obteniendo recomendaciones personalizadas (simuladas)');
        
        // Simular un retraso para imitar el procesamiento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generar recomendaciones simuladas
        return {
          success: true,
          recommendations: {
            difficulty: Math.random() > 0.6 ? 'MEDIUM' : Math.random() > 0.3 ? 'EASY' : 'HARD',
            practiceAreas: [
              'Movimientos rápidos en espacios reducidos',
              'Planificación de rutas eficientes',
              'Reacción a obstáculos inesperados'
            ],
            suggestedTechniques: [
              'Técnica de la espiral: mantén la serpiente en un patrón espiral',
              'Técnica del borde: sigue los bordes del tablero',
              'Técnica del zigzag: alterna movimientos horizontales y verticales'
            ]
          }
        };
      }
      
      // En producción, obtener las recomendaciones reales del backend
      const response = await fetch(`${API_BASE_URL}/personalized-recommendations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener recomendaciones personalizadas');
      }
      
      return {
        success: true,
        recommendations: data
      };
    } catch (error) {
      console.error('Error al obtener recomendaciones personalizadas:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

// Exportar una instancia única del servicio
export const apiService = new ApiService(); 