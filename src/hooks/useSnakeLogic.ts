import { useEffect, useRef, useCallback } from 'react';
import { 
  GameState, 
  Position, 
  Direction, 
  PowerUpType,
  DIFFICULTY_CONFIGS
} from '../types/game';
import { useSoundEffects } from './useSoundEffects';
import { useGameTime } from './useGameTime';

export type CollisionType = 'wall' | 'collision' | null;

interface SnakeLogicProps {
  gameState: GameState;
  updateGameState: (newState: Partial<GameState>) => void;
  endGame: () => void;
  incrementGameTime: () => void;
  generatePowerUp: () => void;
  activatePowerUp: (type: PowerUpType) => void;
  onCollision?: (type: CollisionType) => void;
  soundEnabled?: boolean;
}

export const useSnakeLogic = ({
  gameState,
  updateGameState,
  endGame,
  incrementGameTime,
  generatePowerUp,
  activatePowerUp,
  onCollision,
  soundEnabled = true
}: SnakeLogicProps) => {
  const { 
    snake, 
    apple, 
    powerUp, 
    activePowerUps, 
    direction, 
    score, 
    isGameOver, 
    isPaused, 
    speed, 
    difficulty 
  } = gameState;
  
  const difficultyConfig = DIFFICULTY_CONFIGS[difficulty];
  const gridSize = difficultyConfig.gridSize;
  
  // Inicializar efectos de sonido
  const { 
    playEatSound, 
    playGameOverSound, 
    playMoveSound, 
    playPowerUpSound 
  } = useSoundEffects({
    enabled: soundEnabled
  });
  
  // Usar useRef para evitar re-renders innecesarios
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionChangeRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(0);
  
  // Función para generar una nueva posición para la manzana
  const generateNewApple = useCallback((): Position => {
    let newApple: Position;
    do {
      newApple = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      // Asegurarse de que la manzana no aparezca en la serpiente o en el power-up
    } while (
      snake.some(segment => segment.x === newApple.x && segment.y === newApple.y) ||
      (powerUp && powerUp.position.x === newApple.x && powerUp.position.y === newApple.y)
    );
    
    return newApple;
  }, [snake, powerUp, gridSize]);
  
  // Función para verificar colisiones
  const checkCollision = useCallback((head: Position): CollisionType => {
    // Si el jugador tiene invencibilidad, no hay colisiones
    if (activePowerUps.invincibility) {
      return null;
    }
    
    // Colisión con los bordes
    if (
      head.x < 0 || 
      head.x >= gridSize || 
      head.y < 0 || 
      head.y >= gridSize
    ) {
      return 'wall';
    }
    
    // Colisión con la serpiente misma (excepto la cabeza)
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return 'collision';
      }
    }
    
    return null;
  }, [snake, gridSize, activePowerUps.invincibility]);
  
  // Función para mover la serpiente
  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;
    
    const head = { ...snake[0] };
    
    // Calcular nueva posición de la cabeza según la dirección
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }
    
    // Verificar colisión
    const collisionType = checkCollision(head);
    if (collisionType) {
      playGameOverSound(); // Reproducir sonido de fin de juego
      
      // Notificar el tipo de colisión
      if (onCollision) {
        onCollision(collisionType);
      }
      
      endGame();
      return;
    }
    
    // Crear nueva serpiente (con la nueva cabeza)
    const newSnake = [head, ...snake];
    
    // Verificar si la serpiente comió la manzana
    const ateApple = head.x === apple.x && head.y === apple.y;
    
    // Verificar si la serpiente recogió un power-up
    const atePowerUp = powerUp && head.x === powerUp.position.x && head.y === powerUp.position.y;
    
    if (ateApple) {
      // Reproducir sonido de comer
      playEatSound();
      
      // Incrementar puntuación (doble si el power-up está activo)
      const pointsToAdd = activePowerUps.doublePoints ? 2 : 1;
      const newScore = score + pointsToAdd;
      
      // Calcular nueva velocidad
      let newSpeed = speed;
      if (newScore % difficultyConfig.speedThreshold === 0) {
        // Aplicar el modificador de velocidad del power-up
        const baseSpeed = Math.max(50, speed - difficultyConfig.speedIncrement);
        newSpeed = Math.round(baseSpeed * activePowerUps.speedModifier);
      }
      
      updateGameState({
        snake: newSnake,
        apple: generateNewApple(),
        score: newScore,
        speed: newSpeed
      });
      
      // Generar un power-up si es necesario
      generatePowerUp();
    } else if (atePowerUp) {
      // Reproducir sonido de power-up
      playPowerUpSound();
      
      // Activar el power-up
      activatePowerUp(powerUp.type);
      
      updateGameState({ snake: newSnake });
    } else {
      // Si no comió nada, eliminar la última parte de la serpiente
      newSnake.pop();
      updateGameState({ snake: newSnake });
    }
  }, [
    snake, 
    direction, 
    apple, 
    powerUp, 
    activePowerUps, 
    score, 
    isGameOver, 
    isPaused, 
    speed, 
    difficultyConfig, 
    checkCollision, 
    generateNewApple, 
    updateGameState, 
    endGame, 
    playEatSound, 
    playGameOverSound, 
    playPowerUpSound, 
    onCollision, 
    generatePowerUp, 
    activatePowerUp
  ]);
  
  // Cambiar la dirección de la serpiente
  const changeDirection = useCallback((newDirection: Direction) => {
    // Evitar cambios de dirección opuestos
    const oppositeDirections = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };
    
    const now = Date.now();
    // Limitar la frecuencia de cambios de dirección para evitar giros rápidos que causan colisiones
    if (now - lastDirectionChangeRef.current < speed * 0.8) {
      return;
    }
    
    if (newDirection !== oppositeDirections[direction as keyof typeof oppositeDirections]) {
      // Reproducir sonido de movimiento
      playMoveSound();
      lastDirectionChangeRef.current = now;
      updateGameState({ direction: newDirection });
    }
  }, [direction, updateGameState, speed, playMoveSound]);
  
  // Utilizamos el nuevo hook de tiempo de juego
  useGameTime({
    isActive: !isGameOver,
    isPaused,
    onSecondElapsed: incrementGameTime
  });
  
  // Configurar el bucle principal del juego con requestAnimationFrame
  useEffect(() => {
    if (isGameOver || isPaused) {
      // Detener el bucle del juego si está terminado o pausado
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }
    
    // Función para el bucle del juego con requestAnimationFrame
    const gameLoop = (timestamp: number) => {
      // Inicializar el tiempo de referencia si es necesario
      if (!lastMoveTimeRef.current) {
        lastMoveTimeRef.current = timestamp;
      }
      
      // Calcular el tiempo transcurrido desde el último movimiento
      const elapsed = timestamp - lastMoveTimeRef.current;
      
      // Aplicar el modificador de velocidad del power-up
      const adjustedSpeed = Math.round(speed * activePowerUps.speedModifier);
      
      // Mover la serpiente si ha pasado el tiempo necesario
      if (elapsed >= adjustedSpeed) {
        moveSnake();
        // Actualizar el tiempo de referencia, manteniendo el excedente para mayor precisión
        lastMoveTimeRef.current = timestamp - (elapsed % adjustedSpeed);
      }
      
      // Continuar el bucle
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Iniciar el bucle si no está activo
    if (!gameLoopRef.current) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    // Limpiar el bucle al desmontar o cuando cambian las dependencias
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [isGameOver, isPaused, speed, activePowerUps.speedModifier, moveSnake]);
  
  return {
    changeDirection
  };
}; 