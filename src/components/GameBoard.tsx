import React, { memo, useEffect, useState } from 'react';
import { Position, CELL_SIZE, DifficultyLevel, DIFFICULTY_CONFIGS, PowerUp, POWER_UP_CONFIGS } from '../types/game';

interface GameBoardProps {
  snake: Position[];
  apple: Position;
  powerUp: PowerUp | null;
  difficulty: DifficultyLevel;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, apple, powerUp, difficulty }) => {
  const gridSize = DIFFICULTY_CONFIGS[difficulty].gridSize;
  const [cellSize, setCellSize] = useState(CELL_SIZE);
  
  // Ajustar el tamaño de las celdas según el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        // En pantallas pequeñas, usar un tamaño de celda más pequeño
        setCellSize(15);
      } else if (width < 768) {
        // En pantallas medianas, ajustar según el tamaño
        setCellSize(18);
      } else {
        // En pantallas grandes, usar el tamaño normal
        setCellSize(CELL_SIZE);
      }
    };
    
    // Ejecutar al montar y cuando cambie el tamaño de la ventana
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
    width: `${gridSize * cellSize}px`,
    height: `${gridSize * cellSize}px`,
  };

  // Renderizar la serpiente
  const renderSnake = () => {
    return snake.map((segment, index) => {
      const isHead = index === 0;
      
      const segmentStyle: React.CSSProperties = {
        position: 'absolute',
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        left: `${segment.x * cellSize}px`,
        top: `${segment.y * cellSize}px`,
        transition: 'all 0.1s ease',
      };
      
      return (
        <div 
          key={`snake-${index}`} 
          style={segmentStyle} 
          className={`
            ${isHead 
              ? 'bg-gradient-to-br from-snake-head to-teal-600 border border-teal-800 z-20' 
              : 'bg-gradient-to-br from-snake-body to-green-400 border border-green-600 z-10'
            } 
            rounded-md shadow-sm transform ${isHead ? 'scale-105' : 'scale-90'}
          `}
        />
      );
    });
  };

  // Renderizar la manzana
  const renderApple = () => {
    const appleStyle: React.CSSProperties = {
      position: 'absolute',
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      left: `${apple.x * cellSize}px`,
      top: `${apple.y * cellSize}px`,
      zIndex: 5,
    };
    
    return (
      <div 
        style={appleStyle} 
        className="bg-gradient-to-br from-apple to-red-400 rounded-full border border-red-600 shadow-sm animate-pulse"
      />
    );
  };
  
  // Renderizar el power-up
  const renderPowerUp = () => {
    if (!powerUp) return null;
    
    const powerUpStyle: React.CSSProperties = {
      position: 'absolute',
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      left: `${powerUp.position.x * cellSize}px`,
      top: `${powerUp.position.y * cellSize}px`,
      zIndex: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${cellSize * 0.6}px`,
    };
    
    const config = POWER_UP_CONFIGS[powerUp.type];
    
    return (
      <div 
        style={powerUpStyle} 
        className={`${config.color} rounded-lg border border-white shadow-md animate-pulse`}
        title={config.description}
      >
        {config.icon}
      </div>
    );
  };

  // Renderizar el tablero
  const renderGrid = () => {
    const cells = [];
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isEvenCell = (x + y) % 2 === 0;
        cells.push(
          <div 
            key={`cell-${x}-${y}`} 
            className={`${isEvenCell ? 'bg-board-bg' : 'bg-gray-100'} border-board-border`}
          />
        );
      }
    }
    
    return cells;
  };

  return (
    <div className="relative bg-board-bg border border-board-border game-board-container overflow-auto flex justify-center">
      <div style={boardStyle} className="grid">
        {renderGrid()}
      </div>
      {renderApple()}
      {renderPowerUp()}
      {renderSnake()}
    </div>
  );
};

// Memoizar el componente para evitar re-renders innecesarios
export default memo(GameBoard); 