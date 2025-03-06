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
    if (isGameOver) {
      // Si el juego terminó, solo permitir reiniciar
      if (event.key === 'r' || event.key === 'R') {
        onRestart();
      }
      return;
    }

    // Manejar pausa
    if (event.key === 'p' || event.key === 'P') {
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
        // Evitar que la serpiente se mueva en dirección opuesta
        if (direction !== 'DOWN') {
          onDirectionChange('UP');
        }
        break;
      case 'ArrowDown':
        if (direction !== 'UP') {
          onDirectionChange('DOWN');
        }
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') {
          onDirectionChange('LEFT');
        }
        break;
      case 'ArrowRight':
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