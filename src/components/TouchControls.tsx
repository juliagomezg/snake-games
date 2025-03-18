import React, { memo } from 'react';
import { Direction } from '../types/game';

interface TouchControlsProps {
  onDirectionChange: (direction: Direction) => void;
  isDisabled?: boolean;
}

const TouchControls: React.FC<TouchControlsProps> = ({ 
  onDirectionChange, 
  isDisabled = false 
}) => {
  // Función para manejar el clic o toque en los botones
  const handleDirectionClick = (direction: Direction) => {
    if (!isDisabled) {
      onDirectionChange(direction);
    }
  };

  return (
    <div className="touch-controls mt-4">
      <button 
        className="touch-btn touch-up"
        onClick={() => handleDirectionClick('UP')}
        disabled={isDisabled}
        aria-label="Mover arriba"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12,5.41L2.41,15L4,16.58L12,8.59L20,16.58L21.59,15L12,5.41Z" />
        </svg>
      </button>
      
      <button 
        className="touch-btn touch-left"
        onClick={() => handleDirectionClick('LEFT')}
        disabled={isDisabled}
        aria-label="Mover izquierda"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
        </svg>
      </button>
      
      <button 
        className="touch-btn touch-right"
        onClick={() => handleDirectionClick('RIGHT')}
        disabled={isDisabled}
        aria-label="Mover derecha"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
        </svg>
      </button>
      
      <button 
        className="touch-btn touch-down"
        onClick={() => handleDirectionClick('DOWN')}
        disabled={isDisabled}
        aria-label="Mover abajo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12,18.58L21.59,9L20,7.41L12,15.41L4,7.41L2.41,9L12,18.58Z" />
        </svg>
      </button>
    </div>
  );
};

export default memo(TouchControls); 