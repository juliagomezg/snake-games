import React from 'react';
import GameBoard from './GameBoard';
import Score from './Score';
import GameOver from './GameOver';
import { DifficultyLevel } from '../types/game';

interface GameContainerProps {
  snake: Array<{x: number, y: number}>;
  apple: {x: number, y: number};
  powerUp: any | null;
  score: number;
  gameTime: number;
  isGameOver: boolean;
  difficulty: DifficultyLevel;
  onRestart: () => void;
  highScoreData: {
    isHighScore: boolean;
    rank: number;
  };
}

const GameContainer: React.FC<GameContainerProps> = ({
  snake,
  apple,
  powerUp,
  score,
  gameTime,
  isGameOver,
  difficulty,
  onRestart,
  highScoreData
}) => {
  return (
    <>
      <Score 
        score={score} 
        gameTime={gameTime} 
      />
      
      <div className="relative my-4 rounded-lg overflow-hidden shadow-xl">
        <GameBoard 
          snake={snake} 
          apple={apple}
          powerUp={powerUp}
          difficulty={difficulty}
        />
        
        {isGameOver && (
          <GameOver 
            score={score} 
            gameTime={gameTime} 
            onRestart={onRestart}
            isHighScore={highScoreData.isHighScore}
            highScoreRank={highScoreData.rank}
          />
        )}
      </div>
    </>
  );
};

export default GameContainer; 