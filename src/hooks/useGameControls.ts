import { useEffect, useCallback } from 'react';
import { Direction } from '../types/game';

interface GameControlsProps {
  direction: Direction;
  isGameOver: boolean;
  isPaused: boolean;
  onDirectionChange: (newDirection: Direction) => void;
  onPauseToggle: () => void;
  onRestart: () => void;
}

export const useGameControls = ({
  direction,
  isGameOver,
  isPaused,
  onDirectionChange,
  onPauseToggle,
  onRestart
}: GameControlsProps) => {
  // Función para manejar las teclas presionadas
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Lista de teclas que queremos prevenir su comportamiento predeterminado
    const preventDefaultKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Space'];
    
    // Prevenir el desplazamiento de la pantalla para teclas de dirección y espacio
    if (preventDefaultKeys.includes(event.key)) {
      event.preventDefault();
    }
    
    if (isGameOver) {
      // Si el juego terminó, solo permitir reiniciar
      if (event.key === 'r' || event.key === 'R') {
        onRestart();
      }
      return;
    }

    // Manejar pausa
    if (event.key === 'p' || event.key === 'P' || event.key === ' ' || event.key === 'Space') {
      onPauseToggle();
      return;
    }

    // Si el juego está pausado, no procesar cambios de dirección
    if (isPaused) {
      return;
    }

    // Manejar cambios de dirección
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        // Evitar que la serpiente se mueva en dirección opuesta
        if (direction !== 'DOWN') {
          onDirectionChange('UP');
        }
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction !== 'UP') {
          onDirectionChange('DOWN');
        }
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction !== 'RIGHT') {
          onDirectionChange('LEFT');
        }
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction !== 'LEFT') {
          onDirectionChange('RIGHT');
        }
        break;
      default:
        break;
    }
  }, [direction, isGameOver, isPaused, onDirectionChange, onPauseToggle, onRestart]);

  // Agregar y eliminar el event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}; 