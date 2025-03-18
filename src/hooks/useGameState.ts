import { useState, useCallback, useRef } from 'react';
import { 
  GameState, 
  Position, 
  Direction, 
  DifficultyLevel,
  PowerUpType,
  PowerUp,
  DIFFICULTY_CONFIGS,
  POWER_UP_CONFIGS
} from '../types/game';

// Función para generar una posición aleatoria dentro del tablero
const getRandomPosition = (gridSize: number): Position => {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize)
  };
};

// Función para generar una posición para la manzana que no esté en la serpiente
const getRandomApplePosition = (snake: Position[], powerUp: PowerUp | null, gridSize: number): Position => {
  let newApple = getRandomPosition(gridSize);
  
  // Asegurarse de que la manzana no aparezca en la serpiente o en el power-up
  while (
    snake.some(segment => segment.x === newApple.x && segment.y === newApple.y) ||
    (powerUp && powerUp.position.x === newApple.x && powerUp.position.y === newApple.y)
  ) {
    newApple = getRandomPosition(gridSize);
  }
  
  return newApple;
};

// Función para generar un power-up aleatorio
const generateRandomPowerUp = (snake: Position[], apple: Position, gameTime: number, gridSize: number): PowerUp => {
  // Seleccionar un tipo de power-up aleatorio
  const powerUpTypes: PowerUpType[] = ['SPEED', 'SLOW', 'DOUBLE_POINTS', 'INVINCIBILITY', 'SHRINK'];
  const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
  
  // Generar una posición para el power-up
  let position = getRandomPosition(gridSize);
  
  // Asegurarse de que el power-up no aparezca en la serpiente o en la manzana
  while (
    snake.some(segment => segment.x === position.x && segment.y === position.y) ||
    (apple.x === position.x && apple.y === position.y)
  ) {
    position = getRandomPosition(gridSize);
  }
  
  // Configurar el power-up
  const config = POWER_UP_CONFIGS[randomType];
  
  return {
    position,
    type: randomType,
    duration: config.duration,
    expiresAt: gameTime + config.duration,
    timestamp: Date.now() // Añadir timestamp para un seguimiento más preciso
  };
};

// Estado inicial del juego
const initialGameState = (difficulty: DifficultyLevel = 'MEDIUM'): GameState => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const gridSize = config.gridSize;
  
  // Posición inicial de la serpiente en el centro
  const initialSnake = [
    { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }
  ];
  
  return {
    snake: initialSnake,
    apple: getRandomApplePosition(initialSnake, null, gridSize),
    powerUp: null,
    activePowerUps: {
      doublePoints: false,
      invincibility: false,
      speedModifier: 1
    },
    powerUpTimestamps: {
      doublePoints: null,
      invincibility: null,
      speedModifier: null
    },
    direction: 'RIGHT',
    score: 0,
    isGameOver: false,
    isPaused: false,
    gameTime: 0,
    gameStartTime: Date.now(),
    lastUpdateTime: Date.now(),
    speed: config.initialSpeed,
    difficulty
  };
};

interface UseGameStateOptions {
  initialDifficulty?: DifficultyLevel;
}

export const useGameState = (options: UseGameStateOptions = {}) => {
  const { initialDifficulty = 'MEDIUM' } = options;
  const [gameState, setGameState] = useState<GameState>(initialGameState(initialDifficulty));
  const pauseStartTimeRef = useRef<number | null>(null);
  const totalPausedTimeRef = useRef<number>(0);
  
  // Reiniciar el juego
  const resetGame = useCallback(() => {
    setGameState(prevState => {
      const newState = initialGameState(prevState.difficulty);
      // Reiniciar los contadores de tiempo
      totalPausedTimeRef.current = 0;
      pauseStartTimeRef.current = null;
      return newState;
    });
  }, []);
  
  // Pausar/reanudar el juego
  const togglePause = useCallback(() => {
    setGameState(prevState => {
      const now = Date.now();
      
      if (prevState.isPaused) {
        // Al reanudar, calcular el tiempo que estuvo pausado
        if (pauseStartTimeRef.current) {
          totalPausedTimeRef.current += (now - pauseStartTimeRef.current);
          pauseStartTimeRef.current = null;
        }
      } else {
        // Al pausar, guardar el tiempo actual
        pauseStartTimeRef.current = now;
      }
      
      return {
        ...prevState,
        isPaused: !prevState.isPaused,
        lastUpdateTime: now
      };
    });
  }, []);
  
  // Actualizar el estado del juego
  const updateGameState = useCallback((newState: Partial<GameState>) => {
    setGameState(prevState => ({
      ...prevState,
      ...newState
    }));
  }, []);
  
  // Terminar el juego
  const endGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isGameOver: true
    }));
  }, []);
  
  // Incrementar el tiempo de juego y actualizar power-ups
  const incrementGameTime = useCallback(() => {
    setGameState(prevState => {
      const newGameTime = prevState.gameTime + 1;
      
      // Verificar si hay power-ups activos que deben expirar
      const activePowerUps = { ...prevState.activePowerUps };
      let powerUpsChanged = false;
      
      // Verificar si el power-up de doble puntos debe expirar
      if (activePowerUps.doublePoints && prevState.powerUp?.expiresAt && newGameTime >= prevState.powerUp.expiresAt) {
        activePowerUps.doublePoints = false;
        powerUpsChanged = true;
      }
      
      // Verificar si el power-up de invencibilidad debe expirar
      if (activePowerUps.invincibility && prevState.powerUp?.expiresAt && newGameTime >= prevState.powerUp.expiresAt) {
        activePowerUps.invincibility = false;
        powerUpsChanged = true;
      }
      
      // Verificar si el modificador de velocidad debe expirar
      if (activePowerUps.speedModifier !== 1 && prevState.powerUp?.expiresAt && newGameTime >= prevState.powerUp.expiresAt) {
        activePowerUps.speedModifier = 1;
        powerUpsChanged = true;
      }
      
      return {
        ...prevState,
        gameTime: newGameTime,
        activePowerUps: powerUpsChanged ? activePowerUps : prevState.activePowerUps
      };
    });
  }, []);
  
  // Cambiar la dificultad
  const changeDifficulty = useCallback((difficulty: DifficultyLevel) => {
    setGameState(initialGameState(difficulty));
    // Reiniciar contadores de tiempo
    totalPausedTimeRef.current = 0;
    pauseStartTimeRef.current = null;
  }, []);
  
  // Generar un nuevo power-up
  const generatePowerUp = useCallback(() => {
    setGameState(prevState => {
      const config = DIFFICULTY_CONFIGS[prevState.difficulty];
      
      // Verificar si es momento de generar un power-up
      if (prevState.score > 0 && prevState.score % config.powerUpFrequency === 0 && !prevState.powerUp) {
        const newPowerUp = generateRandomPowerUp(
          prevState.snake, 
          prevState.apple, 
          prevState.gameTime,
          config.gridSize
        );
        
        return {
          ...prevState,
          powerUp: newPowerUp
        };
      }
      
      return prevState;
    });
  }, []);
  
  // Activar un power-up con seguimiento de tiempo preciso
  const activatePowerUp = useCallback((type: PowerUpType) => {
    setGameState(prevState => {
      const activePowerUps = { ...prevState.activePowerUps };
      const powerUpTimestamps = { ...prevState.powerUpTimestamps };
      const now = Date.now();
      const duration = POWER_UP_CONFIGS[type].duration * 1000; // Convertir a milisegundos
      
      switch (type) {
        case 'DOUBLE_POINTS':
          activePowerUps.doublePoints = true;
          powerUpTimestamps.doublePoints = now + duration;
          break;
        case 'INVINCIBILITY':
          activePowerUps.invincibility = true;
          powerUpTimestamps.invincibility = now + duration;
          break;
        case 'SPEED':
          activePowerUps.speedModifier = 0.5; // Más rápido
          powerUpTimestamps.speedModifier = now + duration;
          break;
        case 'SLOW':
          activePowerUps.speedModifier = 1.5; // Más lento
          powerUpTimestamps.speedModifier = now + duration;
          break;
        case 'SHRINK':
          // Reducir el tamaño de la serpiente a la mitad (mínimo 1)
          const newLength = Math.max(1, Math.floor(prevState.snake.length / 2));
          return {
            ...prevState,
            snake: prevState.snake.slice(0, newLength),
            powerUp: null
          };
      }
      
      return {
        ...prevState,
        activePowerUps,
        powerUpTimestamps,
        powerUp: null
      };
    });
  }, []);
  
  return {
    gameState,
    resetGame,
    togglePause,
    updateGameState,
    endGame,
    incrementGameTime,
    changeDifficulty,
    generatePowerUp,
    activatePowerUp
  };
}; 