// Tipos para el juego de la serpiente

// Posición en el tablero
export interface Position {
  x: number;
  y: number;
}

// Direcciones posibles
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Niveles de dificultad
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

// Tipos de power-ups
export type PowerUpType = 'SPEED' | 'SLOW' | 'DOUBLE_POINTS' | 'INVINCIBILITY' | 'SHRINK';

// Power-up en el tablero
export interface PowerUp {
  position: Position;
  type: PowerUpType;
  duration: number; // Duración en segundos
  expiresAt: number; // Tiempo de juego en el que expira
}

// Efectos activos de power-ups
export interface ActivePowerUps {
  doublePoints: boolean;
  invincibility: boolean;
  speedModifier: number; // 1 = normal, < 1 = más rápido, > 1 = más lento
}

// Configuración según nivel de dificultad
export interface DifficultyConfig {
  initialSpeed: number;
  speedIncrement: number;
  speedThreshold: number;
  gridSize: number;
  powerUpFrequency: number; // Cada cuántos puntos aparece un power-up
}

// Constantes del juego
export const CELL_SIZE = 20; // Tamaño de cada celda en píxeles
export const GRID_SIZE = 20; // Tamaño del tablero (20x20)
export const INITIAL_SPEED = 150; // Velocidad inicial (ms)
export const SPEED_INCREMENT = 10; // Incremento de velocidad
export const SPEED_THRESHOLD = 5; // Cada cuántos puntos aumenta la velocidad

// Configuraciones de dificultad
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  EASY: {
    initialSpeed: 180,
    speedIncrement: 5,
    speedThreshold: 7,
    gridSize: 15,
    powerUpFrequency: 5
  },
  MEDIUM: {
    initialSpeed: 150,
    speedIncrement: 10,
    speedThreshold: 5,
    gridSize: 20,
    powerUpFrequency: 7
  },
  HARD: {
    initialSpeed: 120,
    speedIncrement: 15,
    speedThreshold: 3,
    gridSize: 25,
    powerUpFrequency: 10
  }
};

// Configuración de power-ups
export const POWER_UP_CONFIGS: Record<PowerUpType, { duration: number, color: string, icon: string, description: string }> = {
  SPEED: {
    duration: 5,
    color: 'bg-yellow-400',
    icon: '⚡',
    description: 'Velocidad aumentada'
  },
  SLOW: {
    duration: 5,
    color: 'bg-blue-400',
    icon: '🐢',
    description: 'Velocidad reducida'
  },
  DOUBLE_POINTS: {
    duration: 10,
    color: 'bg-purple-400',
    icon: '✨',
    description: 'Puntos dobles'
  },
  INVINCIBILITY: {
    duration: 5,
    color: 'bg-green-400',
    icon: '🛡️',
    description: 'Invencibilidad'
  },
  SHRINK: {
    duration: 0, // Efecto inmediato
    color: 'bg-red-400',
    icon: '✂️',
    description: 'Reducir tamaño'
  }
};

// Estado del juego
export interface GameState {
  snake: Position[]; // Posiciones de la serpiente
  apple: Position; // Posición de la manzana
  powerUp: PowerUp | null; // Power-up actual en el tablero
  activePowerUps: ActivePowerUps; // Power-ups activos
  direction: Direction; // Dirección actual
  score: number; // Puntuación
  gameTime: number; // Tiempo de juego en segundos
  isGameOver: boolean; // Si el juego ha terminado
  isPaused: boolean; // Si el juego está pausado
  speed: number; // Velocidad actual (ms)
  difficulty: DifficultyLevel; // Nivel de dificultad
} 